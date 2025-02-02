import Hero from "../organisms/layout/Hero";
import PublicHeader from "../organisms/layout/PublicHeader";

const HomePage = () => {
  return (
    <main className="min-h-screen flex flex-col container px-10 max-w-[1900px] mx-auto overlay">
      <PublicHeader />
      <div className="flex-grow flex items-center justify-center">
        <Hero />
      </div>
    </main>
  );
};

export default HomePage;
