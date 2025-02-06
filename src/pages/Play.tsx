import { ContinentCard } from "@/components/ContinentCard";

const continents = [
  { name: "Africa" },
  { name: "Asia" },
  { name: "Europe" },
  { name: "North America" },
  { name: "South America" },
  { name: "Oceania" },
];

export function Play() {
  return (
    <div className="min-h-screen bg-map-pattern px-6 py-20">
      <h1 className="text-4xl font-bold text-dark-brown text-center mb-12 font-lexend mt-8">
        Choose your continent and start playing!
      </h1>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {continents.map((continent) => (
            <ContinentCard key={continent.name} name={continent.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
