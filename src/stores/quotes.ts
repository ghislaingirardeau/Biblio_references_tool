import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Quote } from 'src/types/books';
import { useReferencesStore } from './references';

const { find } = useReferencesStore();

export const useQuotesStore = defineStore('QuotesStore', () => {
  const quotes = ref<Quote[] | []>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

  function resetQuoteFilter() {
    filteredQuotes.value = null;
  }

  function addQuote(type: string, referenceId: string, quote: Quote) {
    const referenceFound = find(type, referenceId);

    if (referenceFound && referenceFound?.quotes) {
      referenceFound?.quotes.unshift(quote);
    } else {
      referenceFound!.quotes = [quote];
    }
    findQuotes(type, referenceId);
  }

  function findQuotes(type: string, referenceId: string) {
    const referenceFound = find(type, referenceId);

    if (referenceFound && referenceFound?.quotes) {
      quotes.value = referenceFound.quotes;
    } else {
      quotes.value = [];
    }
  }

  function filterQuotes(query: string) {
    filteredQuotes.value = null;
    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const searchQuotes = quotes.value.filter((quote) =>
      quote.content!.toLowerCase().includes(lowerQuery),
    );
    if (searchQuotes.length === 0) {
      return 'Quote not found';
    }
    filteredQuotes.value = searchQuotes;
    return null;
  }

  return {
    quotes,
    filteredQuotes,
    addQuote,
    findQuotes,
    filterQuotes,
    resetQuoteFilter,
  };
});
