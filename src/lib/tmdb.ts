const API_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDb(endpoint: string, queryParams = '') {
  const res = await fetch(`${API_BASE_URL}${endpoint}?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDb fetch error: ${res.status}`);
  }

  return res.json();
}
