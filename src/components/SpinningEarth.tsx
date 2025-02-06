import { Globe2 } from "lucide-react";

export function SpinningEarth() {
  return (
    <div className="animate-spin-slow mb-8">
      <Globe2 className="w-24 h-24 text-brown" strokeWidth={1.5} />
    </div>
  );
}
