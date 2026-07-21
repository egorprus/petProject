import axios from "@shared/api/axios";

const CACHE_KEY = "rateCache";

function getCache(): Record<string, number> {
  const stored = localStorage.getItem(CACHE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function setCache(cache: Record<string, number>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export async function getRateForDate(date: string): Promise<number> {
  const formatted = new Date(date).toLocaleDateString("en-CA");

  const cache = getCache();
  if (cache[formatted] !== undefined) return cache[formatted];

  const { data } = await axios.get(
    `https://api.nbrb.by/exrates/rates/431?ondate=${formatted}`
  );
  const rate: number = data.Cur_OfficialRate;

  setCache({ ...cache, [formatted]: rate });
  return rate;
}
