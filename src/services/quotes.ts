import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { todayKey } from '@/utils/date';

const ZENQUOTES_URL = 'https://zenquotes.io/api';
const DUMMYJSON_URL = 'https://dummyjson.com/quotes/random';
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const TIMEOUT_MS = 8000;
const CACHE_KEY = 'daily-quote-v2';

export type Quote = {
  text: string;
  author: string;
  originalText: string;
  translated: boolean;
  source: string;
};

type EnglishQuote = { text: string; author: string; source: string };

type ZenQuote = { q: string; a: string };

type DummyJsonQuote = { quote: string; author: string };

type MyMemoryResponse = {
  responseStatus: number | string;
  quotaFinished?: boolean;
  responseData?: { translatedText?: string };
};

async function getJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchZenQuote(mode: 'today' | 'random'): Promise<EnglishQuote> {
  const [quote] = await getJson<ZenQuote[]>(`${ZENQUOTES_URL}/${mode}`);
  if (!quote?.q || quote.a === 'zenquotes.io') throw new Error('Limite de requisições da ZenQuotes atingido');
  return { text: quote.q, author: quote.a, source: 'ZenQuotes.io' };
}

async function fetchDummyJsonQuote(): Promise<EnglishQuote> {
  const quote = await getJson<DummyJsonQuote>(DUMMYJSON_URL);
  if (!quote?.quote) throw new Error('Resposta inválida da DummyJSON');
  return { text: quote.quote, author: quote.author, source: 'DummyJSON' };
}

async function fetchEnglishQuote(mode: 'today' | 'random'): Promise<EnglishQuote> {
  if (Platform.OS === 'web') return fetchDummyJsonQuote();
  try {
    return await fetchZenQuote(mode);
  } catch {
    return fetchDummyJsonQuote();
  }
}

async function translateToPortuguese(text: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({ q: text, langpair: 'en|pt-BR' });
    const data = await getJson<MyMemoryResponse>(`${MYMEMORY_URL}?${params}`);
    const translated = data.responseData?.translatedText?.trim();
    if (Number(data.responseStatus) !== 200 || data.quotaFinished || !translated || translated.startsWith('MYMEMORY')) {
      return null;
    }
    return translated;
  } catch {
    return null;
  }
}

export async function fetchQuote(mode: 'today' | 'random'): Promise<Quote> {
  const quote = await fetchEnglishQuote(mode);
  const translation = await translateToPortuguese(quote.text);
  return {
    text: translation ?? quote.text,
    author: quote.author,
    originalText: quote.text,
    translated: translation !== null,
    source: quote.source,
  };
}

export async function getCachedDailyQuote(): Promise<Quote | null> {
  try {
    const stored = await AsyncStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    const { date, quote } = JSON.parse(stored) as { date: string; quote: Quote };
    return date === todayKey() ? quote : null;
  } catch {
    return null;
  }
}

export async function cacheDailyQuote(quote: Quote): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayKey(), quote }));
  } catch {}
}
