import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function Game() {
  const { continent } = useParams();
  const [mapData, setMapData] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>("");
  const [correctGuesses, setCorrectGuesses] = useState<Set<string>>(new Set());
  const [countryNames, setCountryNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [score, setScore] = useState(0);
  const [incorrectGuess, setIncorrectGuess] = useState<string | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [arrowPosition, setArrowPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const updateArrowPosition = () => {
    if (incorrectAttempts >= 5 && mapContainerRef.current) {
      const targetElement = mapContainerRef.current.querySelector(
        `#${currentCountry}`
      );
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = mapContainerRef.current.getBoundingClientRect();

        // Calculate center position of the country relative to the container
        const x = rect.left + rect.width / 2 - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;

        setArrowPosition({ x, y });
      }
    } else {
      setArrowPosition(null);
    }
  };

  useEffect(() => {
    updateArrowPosition();
    // Add resize listener to update arrow position when window is resized
    window.addEventListener("resize", updateArrowPosition);
    return () => window.removeEventListener("resize", updateArrowPosition);
  }, [incorrectAttempts, currentCountry]);

  useEffect(() => {
    // Define viewBox values that make each continent fill its container
    const mapConfigs = {
      europe: { viewBox: "0 50 675 675" },
      asia: { viewBox: "550 100 400 400" },
      africa: { viewBox: "370 300 300 300" },
      "north-america": { viewBox: "-50 -50 500 500" },
      "south-america": { viewBox: "150 400 300 300" },
      oceania: { viewBox: "600 250 500 500" },
    };

    fetch(`/maps/${continent}.svg`)
      .then((response) => response.text())
      .then((data) => {
        const config =
          mapConfigs[continent as keyof typeof mapConfigs] || mapConfigs.europe;

        // Parse the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");

        // Extract country data and set up the game state
        const paths = svgDoc.querySelectorAll("path");
        const countryData: { id: string; name: string }[] = [];
        const nameMapping: { [key: string]: string } = {};

        paths.forEach((path) => {
          const id = path.getAttribute("id");
          const name = path.getAttribute("title");
          if (id && name) {
            countryData.push({ id, name });
            nameMapping[id] = name;
          }
        });

        setCountries(countryData.map((c) => c.id));
        setCountryNames(nameMapping);

        // Set initial random country if none is selected
        if (!currentCountry && countryData.length > 0) {
          const randomIndex = Math.floor(Math.random() * countryData.length);
          setCurrentCountry(countryData[randomIndex].id);
        }

        // Get the root SVG element and modify its attributes
        const svgElement = svgDoc.querySelector("svg");
        if (svgElement) {
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
          svgElement.setAttribute("viewBox", config.viewBox);
        }

        // Remove any existing classes and transforms from paths
        paths.forEach((path) => {
          path.removeAttribute("class");
          path.removeAttribute("transform");
        });

        // Add the correct class to previously guessed countries
        correctGuesses.forEach((countryId) => {
          const path = svgDoc.getElementById(countryId);
          if (path) {
            path.setAttribute("class", "correct");
          }
        });

        // Add hint class if showing hint
        if (showHint) {
          const correctPath = svgDoc.getElementById(currentCountry);
          if (correctPath) {
            correctPath.setAttribute("class", "hint");
          }
        }

        // Convert the modified SVG back to string
        const serializer = new XMLSerializer();
        const modifiedData = serializer.serializeToString(svgDoc);

        setMapData(modifiedData);

        // Update arrow position after map is loaded
        setTimeout(updateArrowPosition, 100);
      })
      .catch((error) => console.error("Error loading map:", error));
  }, [continent, correctGuesses, showHint]);

  const handleCountryClick = (event: React.MouseEvent) => {
    const target = event.target as SVGElement;
    const countryId = target.id;

    if (countryId === currentCountry) {
      // Clear states for next round
      setIncorrectGuess(null);
      setIncorrectAttempts(0);
      setShowHint(false);
      setArrowPosition(null);

      // Add the correct class to the clicked country
      target.classList.add("correct");

      // Correct guess
      setCorrectGuesses((prev) => new Set([...prev, countryId]));

      // Increment score
      setScore((prev) => prev + 100);

      // Select a new random country from remaining ones
      const remainingCountries = countries.filter(
        (country) => !correctGuesses.has(country) && country !== countryId
      );

      if (remainingCountries.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * remainingCountries.length
        );
        setCurrentCountry(remainingCountries[randomIndex]);
      }
    } else if (countryId) {
      // Incorrect guess
      setIncorrectGuess(countryNames[countryId]);
      setScore((prev) => Math.max(0, prev - 25));

      // Increment incorrect attempts and show hint if needed
      const newAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newAttempts);
      if (newAttempts >= 3) {
        setShowHint(true);
      }
      if (newAttempts >= 5) {
        updateArrowPosition();
      }

      // Add temporary incorrect class
      target.classList.add("incorrect");
      setTimeout(() => {
        target.classList.remove("incorrect");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-map-pattern px-6 py-20">
      <div className="container mx-auto mt-16">
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-6">
            <div className="text-brown font-semibold whitespace-nowrap">
              Score: <span className="text-dark-brown">{score}</span>
            </div>
            <div className="text-xl font-semibold text-brown whitespace-nowrap">
              Find:{" "}
              <span className="text-dark-brown">
                {countryNames[currentCountry] || currentCountry}
              </span>
            </div>
            <div className="text-brown font-semibold whitespace-nowrap">
              Progress:{" "}
              <span className="text-dark-brown">
                {correctGuesses.size}/{countries.length}
              </span>
            </div>
            {incorrectGuess && (
              <div className="text-red-500 font-medium whitespace-nowrap">
                That was {incorrectGuess}
              </div>
            )}
          </div>
        </div>
        <div
          className="relative h-[80vh] aspect-square max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
          ref={mapContainerRef}
        >
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_g]:w-full [&_g]:h-full [&_path]:fill-map-base [&_path]:stroke-black [&_path]:stroke-[0.5] [&_path]:transition-colors [&_path]:duration-200 [&_path:hover]:fill-map-hover [&_path]:cursor-pointer bg-[aliceblue] [&_path.correct]:fill-green-500 [&_path.correct]:hover:fill-green-600 [&_path.incorrect]:fill-red-500 [&_path.hint]:animate-hint"
            dangerouslySetInnerHTML={{ __html: mapData }}
            onClick={handleCountryClick}
          />
          {arrowPosition && (
            <div
              className="absolute w-8 h-8 -mt-12 -ml-4 animate-bounce pointer-events-none"
              style={{
                left: arrowPosition.x,
                top: arrowPosition.y,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full"
                stroke="#EF4444"
                strokeWidth="2"
                fill="none"
              >
                <path
                  d="M12 2L12 22M12 22L2 12M12 22L22 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
