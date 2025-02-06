import "@fontsource/lexend";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SpinningEarth } from "@/components/SpinningEarth";

function App() {
  return (
    <div className="min-h-screen bg-map-pattern">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <SpinningEarth />
        <h1 className="text-6xl font-bold text-dark-brown mb-8 font-lexend">
          Test Your Geography Now!
        </h1>

        <Button
          size="lg"
          className="bg-brown hover:bg-brown/90 text-white text-xl px-8 py-6"
        >
          Start Playing
        </Button>
      </main>
    </div>
  );
}

export default App;
