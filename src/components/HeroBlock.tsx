interface HeroBlockProps {
  backgroundImageUrl: string;
}

export default function HeroBlock({ backgroundImageUrl }: HeroBlockProps) {
  return (
    <section
      className="hero w-full"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="overlay" />
      <div className="wrapper">
        <h1 className="relative text-[62px] font-bold z-3">Welcome</h1>
        <h2 className="relative text-[24px] font-bold z-3">Millions of movies, TV shows and people to discover. Explore now.</h2>
      </div>
    </section>
  );
}
