"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingItem } from "@/types/tmdb"; // Rename if you have a specific UpcomingItem type
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";

export default function UpcomingBlock() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(`/api/upcoming?page=${page}`);
    const data = await res.json();

    setItems((prev) => [...prev, ...data.results]);
    setHasMore(data.page < data.total_pages);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

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
    <section className="upcoming">
      <div className="wrapper">
        <div className="upcoming-header">
          <h3 className="text-[32px]">Upcoming</h3>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          freeMode={true}
          onReachEnd={loadMore}
        >
          {uniqueItems.map((item) => (
            <SwiperSlide key={`${item.media_type || "movie"}-${item.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                width={240}
                height={360}
                alt={item.title || item.name || "Upcoming item"}
              />
              <div className="swiper-slide__content">
                <h4 className="truncate">{item.title || item.name}</h4>
                <div className="info flex justify-between">
                  <p>{formatDate(item.release_date || item.first_air_date)}</p>
                  {typeof item.vote_average === "number" && (
                    <span>{(item.vote_average * 10).toFixed(0)}%</span>
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
