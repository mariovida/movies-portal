"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";

import ArrowRight from "@/assets/arrow-right.svg";
import SearchIcon from "@/assets/icon-search.svg";

type PersonResult = {
  id: number;
  name: string;
};

type MovieResult = {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
};

type TvResult = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date?: string;
  vote_average?: number;
};

export default function SearchOverlay() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonResult[]>([]);
  const [topPeopleSearched, setTopPeopleSearched] = useState<PersonResult[]>(
    []
  );

  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [moviePage, setMoviePage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const [tvShows, setTvShows] = useState<TvResult[]>([]);
  const [tvPage, setTvPage] = useState(1);
  const [hasMoreTv, setHasMoreTv] = useState(true);
  const [loadingTv, setLoadingTv] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const delayDebounce = setTimeout(() => {
        fetch(`/api/search?query=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.results || []);
          });
      }, 200);

      return () => clearTimeout(delayDebounce);
    } else {
      if (topPeopleSearched.length === 0) {
        fetch("/api/search/top")
          .then((res) => res.json())
          .then((data) => {
            const top = data.results?.slice(0, 4) || [];
            setResults(top);
            setTopPeopleSearched(top);
          });
      } else {
        setResults(topPeopleSearched);
      }
    }
  }, [query, topPeopleSearched]);

  const displayList = query.trim() ? results : topPeopleSearched;

  const loadMoreMovies = async () => {
    if (loadingMovies || !hasMoreMovies) return;

    setLoadingMovies(true);
    const res = await fetch(`/api/search/top-movies?page=${moviePage}`);
    const data = await res.json();

    setMovies((prev) => [...prev, ...(data.results || [])]);
    setMoviePage((prev) => prev + 1);
    setHasMoreMovies(data.page < data.total_pages);
    setLoadingMovies(false);
  };

  const loadMoreTvShows = async () => {
    if (loadingTv || !hasMoreTv) return;

    setLoadingTv(true);
    const res = await fetch(`/api/search/top-tv?page=${tvPage}`);
    const data = await res.json();

    setTvShows((prev) => [...prev, ...(data.results || [])]);
    setTvPage((prev) => prev + 1);
    setHasMoreTv(data.page < data.total_pages);
    setLoadingTv(false);
  };

  useEffect(() => {
    loadMoreMovies();
    loadMoreTvShows();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return `${date.getDate()} ${date.toLocaleString("en-US", {
      month: "short",
    })}: ${date.getFullYear()}`;
  };

  const uniqueMovies = movies.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  const SkeletonSlide = () => (
    <div className="w-[240px] animate-pulse">
      <div className="bg-gray-300 h-[360px] w-full rounded-xl" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="search-overlay">
      <div className="wrapper">
        <div className="search-overlay__input">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="search-results search-results__people">
          <h6>
            Top searched people
            {query.trim() && (
              <span>
                ({results.length} result{results.length !== 1 ? "s" : ""})
              </span>
            )}
          </h6>
          <div className="search-results__people__box">
            {displayList.map((person) => (
              <div key={person.id} className="search-results__people__item">
                <span>{person.name}</span>
                <ArrowRight />
              </div>
            ))}
          </div>
        </div>

        {!query && (
          <div className="search-results">
            <h6>Top searched movies</h6>
            <div className="search-results__box">
              <Swiper
                slidesPerView="auto"
                spaceBetween={30}
                freeMode
                onReachEnd={loadMoreMovies}
              >
                {uniqueMovies.map((movie) => (
                  <SwiperSlide key={movie.id} style={{ width: 240 }}>
                    <div>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        width={240}
                        height={360}
                        alt={movie.title}
                      />
                      <div className="mt-2">
                        <h4 className="truncate font-semibold">
                          {movie.title}
                        </h4>
                        <div className="flex justify-between text-sm text-gray-500">
                          <p>{formatDate(movie.release_date)}</p>
                          {typeof movie.vote_average === "number" && (
                            <span>{(movie.vote_average * 10).toFixed(0)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                {loadingMovies &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <SwiperSlide key={`skeleton-${i}`} style={{ width: 240 }}>
                      <SkeletonSlide />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        )}

        {!query && (
          <div className="search-results">
            <h6>Top searched TV Shows</h6>
            <div className="search-results__box">
              <Swiper
                slidesPerView="auto"
                spaceBetween={30}
                freeMode
                onReachEnd={loadMoreMovies}
              >
                {tvShows
                  .filter(
                    (item, index, self) =>
                      index === self.findIndex((t) => t.id === item.id)
                  )
                  .map((show) => (
                    <SwiperSlide key={show.id} style={{ width: 240 }}>
                      <div>
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                          width={240}
                          height={360}
                          alt={show.name}
                        />
                        <div className="mt-2">
                          <h4 className="truncate font-semibold">
                            {show.name}
                          </h4>
                          <div className="flex justify-between text-sm text-gray-500">
                            <p>{formatDate(show.first_air_date)}</p>
                            {typeof show.vote_average === "number" && (
                              <span>
                                {(show.vote_average * 10).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}

                {loadingTv &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <SwiperSlide
                      key={`tv-skeleton-${i}`}
                      style={{ width: 240 }}
                    >
                      <SkeletonSlide />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
