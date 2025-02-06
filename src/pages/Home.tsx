import { Button } from "@/components/ui/button";
import { SpinningEarth } from "@/components/SpinningEarth";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-map-pattern">
      <SpinningEarth />
      <h1 className="text-6xl font-bold text-dark-brown mb-8 font-lexend">
        Test Your Geography Now!
      </h1>
      <h2 className="text-3xl font-bold text-dark-brown mb-8 font-lexend">
        Can you find all the countries on the map? If you think so, challenge
        yourself!
      </h2>

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
