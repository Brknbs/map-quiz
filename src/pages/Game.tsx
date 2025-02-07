import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function Game() {
  const { continent } = useParams();
  const [mapData, setMapData] = useState<string>("");

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

        const cleanedData = data
          .replace(/<\?xml.*?\?>/, "")
          .replace(
            /<svg[^>]*>/,
            `<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="${config.viewBox}">`
          )
          .replace(/class="land"/g, "")
          .replace(/transform="[^"]*"/g, "")
          .replace(/<g[^>]*>/, "<g>")
          .replace(/<\/g>/, "</g>");

        setMapData(cleanedData);
      })
      .catch((error) => console.error("Error loading map:", error));
  }, [continent]);

  return (
    <div className="min-h-screen bg-map-pattern px-6 py-20">
      <div className="container mx-auto mt-16">
        <div className="relative h-[80vh] aspect-square max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_g]:w-full [&_g]:h-full [&_path]:fill-map-base [&_path]:stroke-black [&_path]:stroke-[0.5] [&_path]:transition-colors [&_path]:duration-200 [&_path:hover]:fill-map-hover [&_path]:cursor-pointer bg-[aliceblue]"
            dangerouslySetInnerHTML={{ __html: mapData }}
          />
        </div>
      </div>
    </div>
  );
}
