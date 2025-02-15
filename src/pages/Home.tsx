import { Button } from "@/components/ui/button";
import { SpinningEarth } from "@/components/SpinningEarth";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-map-pattern">
      <SpinningEarth />
      <div className="relative">
        <h1 className="text-6xl font-bold text-dark-brown mb-8 font-lexend">
          Test Your Geography Now!
        </h1>
      </div>
      <div className="relative">
        <h2 className="text-3xl font-bold text-dark-brown mb-8 font-lexend">
          <span className="relative inline-block">
            <span className="z-10 relative">
              Can you find all the countries on the map?
            </span>
            <span className="absolute inset-x-0 bottom-1 h-8 bg-yellow-100/60 -rotate-1 animate-marker origin-left" />
          </span>
        </h2>
      </div>

      <Button
        size="lg"
        className="bg-brown hover:bg-brown/90 text-white text-xl px-8 py-6"
        onClick={() => navigate("/play")}
      >
        Start Playing
      </Button>
    </main>
  );
}
