import Header from "@/components/Header";
import HeroBlock from "@/components/HeroBlock";
import TrendingComponent from "@/components/TrendingBlock";
import UpcomingComponent from "@/components/UpcomingBlock";
import PopularComponent from "@/components/PopularBlock";
import JoinBlock from "@/components/JoinBlock";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroBlock backgroundImageUrl="/images/hero-image.jpg" />
      <TrendingComponent />
      <UpcomingComponent />
      <PopularComponent />
      <JoinBlock />
      <Footer />
    </main>
  );
}
