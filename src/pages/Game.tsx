import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { CompletionDialog } from "@/components/CompletionDialog";

export function Game() {
  const { continent } = useParams();
  const [mapData, setMapData] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>("");
  const [correctGuesses, setCorrectGuesses] = useState<Set<string>>(new Set());
  const [countryNames, setCountryNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [incorrectGuess, setIncorrectGuess] = useState<string | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [hintPosition, setHintPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>();

  const SMALL_COUNTRIES = [
    "VA",
    "SM",
    "AD",
    "LI",
    "MC",
    "MT",
    "BN",
    "HK",
    "SG",
  ];
  const SMALL_COUNTRY_RADIUS = 4;

  const getPathCenter = (pathData: string) => {
    // Get all numbers from the path data
    const numbers = pathData.match(/-?\d+\.?\d*/g)?.map(Number) || [];
    if (numbers.length < 2) return null;

    // Calculate the average of x and y coordinates
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (let i = 0; i < numbers.length; i += 2) {
      if (i + 1 < numbers.length) {
        sumX += numbers[i];
        sumY += numbers[i + 1];
        count++;
      }
    }

    return {
      x: sumX / count,
      y: sumY / count,
    };
  };

  const updateHintPosition = () => {
    if (incorrectAttempts >= 5 && mapContainerRef.current) {
      const targetElement = mapContainerRef.current.querySelector(
        `#${currentCountry}`
      );
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = mapContainerRef.current.getBoundingClientRect();

        // Calculate the center of the country
        const centerX = rect.left + rect.width / 2 - containerRect.left;
        const centerY = rect.top + rect.height / 2 - containerRect.top;

        // Use the larger dimension to ensure the circle encompasses the country
        const diameter = Math.max(rect.width, rect.height) * 1.2; // 20% larger to give some padding

        setHintPosition({
          x: centerX - diameter / 2,
          y: centerY - diameter / 2,
          width: diameter,
          height: diameter,
        });
      }
    } else {
      setHintPosition(null);
    }
  };

  useEffect(() => {
    updateHintPosition();
    // Add resize listener to update hint position when window is resized
    window.addEventListener("resize", updateHintPosition);
    return () => window.removeEventListener("resize", updateHintPosition);
  }, [incorrectAttempts, currentCountry]);

  useEffect(() => {
    if (isGameStarted && !showCompletionDialog) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameStarted, showCompletionDialog]);

  const resetGame = () => {
    setCorrectGuesses(new Set());
    setIncorrectGuess(null);
    setIncorrectAttempts(0);
    setShowHint(false);
    setHintPosition(null);
    setTime(0);
    setShowCompletionDialog(false);
    setIsGameStarted(false);

    // Select a new random country
    if (countries.length > 0) {
      const randomIndex = Math.floor(Math.random() * countries.length);
      setCurrentCountry(countries[randomIndex]);
    }
  };

  useEffect(() => {
    const mapConfigs = {
      europe: { viewBox: "50 220 500 500" },
      asia: { viewBox: "550 100 400 400" },
      africa: { viewBox: "400 330 250 250" },
      "north-america": { viewBox: "-50 -50 500 500" },
      "south-america": { viewBox: "150 400 300 300" },
      oceania: { viewBox: "700 370 300 300" },
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
        const smallCountryPaths: SVGPathElement[] = [];

        paths.forEach((path) => {
          const id = path.getAttribute("id");
          const name = path.getAttribute("title");
          if (id && name) {
            countryData.push({ id, name });
            nameMapping[id] = name;

            // Handle small countries
            if (SMALL_COUNTRIES.includes(id)) {
              const originalPath = path.getAttribute("d") || "";
              const center = getPathCenter(originalPath);

              if (center) {
                // Create a circular path using SVG circle command
                const circle = `
                  M ${center.x},${center.y} 
                  m -${SMALL_COUNTRY_RADIUS},0 
                  a ${SMALL_COUNTRY_RADIUS},${SMALL_COUNTRY_RADIUS} 0 1,0 ${
                  SMALL_COUNTRY_RADIUS * 2
                },0 
                  a ${SMALL_COUNTRY_RADIUS},${SMALL_COUNTRY_RADIUS} 0 1,0 -${
                  SMALL_COUNTRY_RADIUS * 2
                },0
                `
                  .trim()
                  .replace(/\s+/g, " ");

                path.setAttribute("d", circle);
                // path.setAttribute("stroke-width", "2");

                // Store small country paths to move them to the end later
                smallCountryPaths.push(path);
              }
            }
          }
        });

        // Move small countries to the end of their parent element to render them on top
        const svgGroup = paths[0]?.parentElement;
        if (svgGroup) {
          smallCountryPaths.forEach((path) => {
            // Remove and re-append to move to end
            path.remove();
            svgGroup.appendChild(path);
          });
        }

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

        // Update hint position after map is loaded
        setTimeout(updateHintPosition, 100);
      })
      .catch((error) => console.error("Error loading map:", error));
  }, [continent, correctGuesses, showHint]);

  const handleCountryClick = (event: React.MouseEvent) => {
    if (!isGameStarted) {
      setIsGameStarted(true);
    }

    const target = event.target as SVGElement;
    const countryId = target.id;

    if (countryId === currentCountry) {
      // Clear states for next round
      setIncorrectGuess(null);
      setIncorrectAttempts(0);
      setShowHint(false);
      setHintPosition(null);

      // Add the correct class to the clicked country
      target.classList.add("correct");

      // Correct guess
      const newCorrectGuesses = new Set([...correctGuesses, countryId]);
      setCorrectGuesses(newCorrectGuesses);

      // Check if all countries are found
      if (newCorrectGuesses.size === countries.length) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setShowCompletionDialog(true);
      } else {
        // Select a new random country from remaining ones
        const remainingCountries = countries.filter(
          (country) => !newCorrectGuesses.has(country)
        );
        const randomIndex = Math.floor(
          Math.random() * remainingCountries.length
        );
        setCurrentCountry(remainingCountries[randomIndex]);
      }
    } else if (countryId) {
      // Incorrect guess
      setIncorrectGuess(countryNames[countryId]);

      // Increment incorrect attempts and show hint if needed
      const newAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newAttempts);
      if (newAttempts >= 3) {
        setShowHint(true);
      }
      if (newAttempts >= 5) {
        updateHintPosition();
      }

      // Add temporary incorrect class
      target.classList.add("incorrect");
      setTimeout(() => {
        target.classList.remove("incorrect");
      }, 500);
    }
  };

  // Format time as MM:SS
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-map-pattern px-6 py-20">
      <div className="container mx-auto mt-16">
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-6">
            <div className="text-brown font-semibold whitespace-nowrap">
              Time: <span className="text-dark-brown">{formattedTime}</span>
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
          {hintPosition && (
            <div
              className="absolute pointer-events-none animate-circle border-4 border-red-500 rounded-full"
              style={{
                left: hintPosition.x,
                top: hintPosition.y,
                width: hintPosition.width,
                height: hintPosition.height,
              }}
            />
          )}
        </div>
      </div>
      <CompletionDialog
        isOpen={showCompletionDialog}
        time={time}
        onPlayAgain={resetGame}
      />
    </div>
  );
}
