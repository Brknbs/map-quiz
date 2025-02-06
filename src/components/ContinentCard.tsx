import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ContinentCardProps {
  name: string;
  image: string;
}

const continentImages = {
  Africa: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e",
  Asia: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f",
  Europe: "https://images.unsplash.com/photo-1608817576152-26bbdb00afb7",
  "North America":
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  "South America":
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
  Oceania: "https://images.unsplash.com/photo-1589330273594-fade1ee91647",
};

export function ContinentCard({ name }: ContinentCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={`${
            continentImages[name as keyof typeof continentImages]
          }?auto=format&fit=crop&w=800&q=80`}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <div className="p-4 text-center">
        <h3 className="mb-4 text-2xl font-bold text-dark-brown">{name}</h3>
        <Button
          className="bg-brown hover:bg-brown/90 text-white transform transition-all duration-300 hover:scale-105"
          onClick={() => navigate(`/play/${name.toLowerCase()}`)}
        >
          Play
        </Button>
      </div>
    </div>
  );
}
