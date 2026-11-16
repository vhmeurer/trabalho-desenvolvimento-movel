import { useEffect, useState } from 'react';

import { cacheDailyQuote, fetchQuote, getCachedDailyQuote, type Quote } from '@/services/quotes';

type QuoteState =
  | { status: 'loading'; quote: Quote | null }
  | { status: 'ready'; quote: Quote }
  | { status: 'error'; quote: Quote | null };

async function loadDailyQuote(): Promise<Quote> {
  const cached = await getCachedDailyQuote();
  if (cached) return cached;
  const quote = await fetchQuote('today');
  await cacheDailyQuote(quote);
  return quote;
}

export function useDailyQuote() {
  const [state, setState] = useState<QuoteState>({ status: 'loading', quote: null });

  useEffect(() => {
    let active = true;
    loadDailyQuote()
      .then((quote) => active && setState({ status: 'ready', quote }))
      .catch(() => active && setState({ status: 'error', quote: null }));
    return () => {
      active = false;
    };
  }, []);

  async function load(mode: 'today' | 'random') {
    setState((current) => ({ status: 'loading', quote: current.quote }));
    try {
      const quote = mode === 'today' ? await loadDailyQuote() : await fetchQuote('random');
      setState({ status: 'ready', quote });
    } catch {
      setState((current) => ({ status: 'error', quote: current.quote }));
    }
  }

  return {
    ...state,
    retry: () => load('today'),
    nextQuote: () => load('random'),
  };
}
