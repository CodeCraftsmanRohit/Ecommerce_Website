import Card from "../components/Card";
import costume from "../assets/costume.jpg";

const Deals = () => {
  const cards = [
    {
      coverImage: costume,
      name: "Eco-Friendly Costume",
      materials: ["Cotton", "Bamboo"],
      carbonFootprint: 2.1,
      ecoScore: "A",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((product, idx) => (
        <Card key={idx} product={product} />
      ))}
    </div>
  );
};

export default Deals;
