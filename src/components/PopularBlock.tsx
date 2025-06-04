"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingItem } from "@/types/tmdb";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";

type MediaType = "movie" | "tv" | "person";

export default function PopularBlock() {
  const [type, setType] = useState<MediaType>("movie");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const itemsCache = useRef<Record<MediaType, TrendingItem[]>>({
    movie: [],
    tv: [],
    person: [],
  });
  const pageCache = useRef<Record<MediaType, number>>({
    movie: 1,
    tv: 1,
    person: 1,
  });
  const [items, setItems] = useState<TrendingItem[]>([]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const page = pageCache.current[type];
    const res = await fetch(`/api/popular?type=${type}&page=${page}`);
    const data = await res.json();

    itemsCache.current[type] = [...itemsCache.current[type], ...data.results];
    pageCache.current[type] = page + 1;

    setItems(itemsCache.current[type]);
    setHasMore(data.page < data.total_pages);
    setLoading(false);
  };

  useEffect(() => {
    const cached = itemsCache.current[type];
    if (cached.length > 0) {
      setItems(cached);
      setHasMore(true);
    } else {
      itemsCache.current[type] = [];
      pageCache.current[type] = 1;
      setItems([]);
      setHasMore(true);
      loadMore();
    }
  }, [type]);

  function formatDate(dateString: string | undefined) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}: ${year}`;
  }

  const uniqueItems = items.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) => t.id === item.id && t.media_type === item.media_type
      )
  );

  function SkeletonSlide() {
    return (
      <div className="w-[240px] animate-pulse">
        <div className="bg-gray-300 h-[360px] w-full rounded-md" />
        <div className="mt-4">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <section className="popular">
      <div className="wrapper">
        <div className="popular-header">
          <h3 className="text-[32px]">What’s Popular</h3>
          <div>
            <button
              onClick={() => setType("movie")}
              className={`${type === "movie" ? "active" : ""}`}
            >
              Movies
            </button>
            <button
              onClick={() => setType("tv")}
              className={`${type === "tv" ? "active" : ""}`}
            >
              On TV
            </button>
            <button
              onClick={() => setType("person")}
              className={`${type === "person" ? "active" : ""}`}
            >
              People
            </button>
          </div>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          freeMode={true}
          onReachEnd={loadMore}
        >
          {uniqueItems.map((item) => (
            <SwiperSlide key={`${item.media_type}-${item.id}`}>
              <div className="w-[240px]">
                {(type === "person" ? item.profile_path : item.poster_path) && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${
                      type === "person" ? item.profile_path : item.poster_path
                    }`}
                    width={240}
                    height={360}
                    alt={item.title || item.name || "Popular item"}
                  />
                )}
                <div className="swiper-slide__content">
                  <h4 className="truncate">{item.title || item.name}</h4>
                  {type !== "person" && (
                    <div className="info flex justify-between">
                      <p>
                        {formatDate(item.release_date || item.first_air_date)}
                      </p>
                      {typeof item.vote_average === "number" && (
                        <span>{(item.vote_average * 10).toFixed(0)}%</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`}>
                <SkeletonSlide />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}
