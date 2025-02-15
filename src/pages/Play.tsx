import { ContinentCard } from "@/components/ContinentCard";

const continents = [
  { name: "Africa", path: "africa" },
  { name: "Asia", path: "asia" },
  { name: "Europe", path: "europe" },
  { name: "North America", path: "north-america" },
  { name: "South America", path: "south-america" },
  { name: "Oceania", path: "oceania" },
];

export function Play() {
  return (
    <div className="min-h-screen bg-map-pattern px-6 py-20">
      <h1 className="text-4xl font-bold text-dark-brown text-center mb-12 font-lexend mt-8">
        Choose your continent
      </h1>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {continents.map((continent) => (
            <ContinentCard
              key={continent.name}
              name={continent.name}
              path={continent.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
