import { MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm fixed top-0 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <MapIcon className="h-8 w-8 text-brown" />
        <span className="text-2xl font-bold text-dark-brown">GeoQuiz</span>
      </Link>

      <Button
        variant="outline"
        className="text-brown border-brown hover:bg-brown/10"
      >
        Leaderboard
      </Button>
    </header>
  );
}
