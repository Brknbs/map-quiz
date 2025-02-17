import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CompletionDialogProps {
  isOpen: boolean;
  time: number;
  onPlayAgain: () => void;
}

export function CompletionDialog({
  isOpen,
  time,
  onPlayAgain,
}: CompletionDialogProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold text-dark-brown mb-4">
          Congratulations!
        </h2>
        <p className="text-lg text-brown mb-6">
          You found all countries in{" "}
          <span className="font-bold">{formattedTime}</span>
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            className="border-brown text-brown hover:bg-brown/10"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
          <Button
            className="bg-brown hover:bg-brown/90 text-white"
            onClick={() => navigate("/play")}
          >
            Choose Another Continent
          </Button>
        </div>
      </div>
    </div>
  );
}
