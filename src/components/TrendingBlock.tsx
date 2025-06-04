'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingItem } from '@/types/tmdb';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';

type Period = 'day' | 'week';

export default function TrendingComponent() {
  const [period, setPeriod] = useState<Period>('day');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Cache results by period so switching doesn't lose items
  const itemsCache = useRef<Record<Period, TrendingItem[]>>({ day: [], week: [] });
  const pageCache = useRef<Record<Period, number>>({ day: 1, week: 1 });

  // Track current items for selected period
  const [items, setItems] = useState<TrendingItem[]>([]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const page = pageCache.current[period];
    const res = await fetch(`/api/trending?period=${period}&page=${page}`);
    const data = await res.json();

    // Update cache
    itemsCache.current[period] = [...itemsCache.current[period], ...data.results];
    pageCache.current[period] = page + 1;

    setItems(itemsCache.current[period]);
    setHasMore(data.page < data.total_pages);
    setLoading(false);
  };

  // On period change, load cached items immediately or fetch if empty
  useEffect(() => {
    const cached = itemsCache.current[period];
    if (cached.length > 0) {
      setItems(cached);
      setHasMore(true);
    } else {
      // Reset caches for this period
      itemsCache.current[period] = [];
      pageCache.current[period] = 1;
      setItems([]);
      setHasMore(true);
      loadMore();
    }
  }, [period]);

    function formatDate(dateString: string | undefined) {
        if (!dateString) return '—';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';

        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        return `${day} ${month}: ${year}`;
    }

    const uniqueItems = items.filter(
        (item, index, self) =>
        index === self.findIndex((t) => t.id === item.id && t.media_type === item.media_type)
    );

  return (
    <section className="trending">
      <div className="wrapper">
        <div className="trending-header">
          <h3 className="text-[32px]">Trending</h3>
          <button
            onClick={() => setPeriod('day')}
            className={`${period === 'day' ? 'active' : ''}`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`${period === 'week' ? 'active' : ''}`}
          >
            This week
          </button>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          freeMode={true}
          onReachEnd={() => {
            loadMore();
          }}
        >
          {uniqueItems.map((item) => (
            <SwiperSlide
              key={`${item.media_type}-${item.id}`}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                width={240}
                height={360}
                alt={item.title || item.name || 'Trending item'}
              />
              <div className="swiper-slide__content">
                <h4 className="text-sm font-semibold truncate">{item.title || item.name}</h4>
                <div className='info flex justify-between'>
                    <p>{formatDate(item.release_date || item.first_air_date)}</p>
                    {typeof item.vote_average === 'number' && (
                        <span>{(item.vote_average * 10).toFixed(0)}%</span>
                    )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {loading && (
            <div className="swiper-slide flex justify-center items-center text-gray-500">
              Loading
            </div>
          )}
        </Swiper>
      </div>
    </section>
  );
}
