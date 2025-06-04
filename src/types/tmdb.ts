export interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';

  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  poster_path?: string;
}


export interface TrendingResponse {
  results: TrendingItem[];
  page: number;
  total_pages: number;
  total_results: number;
}
