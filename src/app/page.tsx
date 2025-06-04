import HeroBlock from "@/components/HeroBlock";
import TrendingComponent from "@/components/TrendingBlock";
import UpcomingComponent from "@/components/UpcomingBlock";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <HeroBlock backgroundImageUrl="/images/hero-image.jpg" />
      <TrendingComponent />
      <UpcomingComponent />
      <Footer />
    </main>
  );
}
