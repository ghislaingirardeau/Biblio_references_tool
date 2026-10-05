import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Quote } from 'src/types/references';
import { useReferencesStore } from './references';
import {
  getQuotesByReference,
  removeQuoteFirestore,
  saveDataFirestore,
  saveQuoteFirestore,
} from 'src/utils/useFirestore';

const { find } = useReferencesStore();

export const useQuotesStore = defineStore('QuotesStore', () => {
  const quotes = ref<Quote[] | []>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

  const loadingQuotes = ref(false);
  const removingQuote = ref(false);

  function resetQuoteFilter() {
    filteredQuotes.value = null;
  }

  async function loadQuotes(referenceId: string) {
    loadingQuotes.value = true;

    try {
      quotes.value = (await getQuotesByReference(referenceId)) as Quote[];
    } finally {
      loadingQuotes.value = false;
    }
  }

  async function addQuote(type: string, referenceId: string, quote: Quote) {
    const referenceFound = find(type, referenceId);

    if (referenceFound && referenceFound?.quotes) {
      referenceFound?.quotes.unshift(quote);
    } else {
      referenceFound!.quotes = [quote];
    }
    findQuotes(type, referenceId);
    // await saveDataFirestore();
    await saveQuoteFirestore(quote);
  }

  async function removeQuote(referenceId: string, quoteId: string) {
    try {
      removingQuote.value = true;
      await removeQuoteFirestore(quoteId);
      const filterQuotes = quotes.value.filter((quote) => quote.id !== quoteId);
      quotes.value = filterQuotes;
    } catch (error) {
      console.log(error);
    } finally {
      removingQuote.value = false;
    }
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
    console.log(quotes.value);
    const searchQuotes = quotes.value.filter(
      (quote) =>
        quote.content!.toLowerCase().includes(lowerQuery) ||
        quote.tag?.map((q) => q.toLowerCase()).includes(lowerQuery),
    );
    if (searchQuotes.length === 0) {
      return 'Quote not found';
    }
    filteredQuotes.value = searchQuotes;
    return null;
  }

  return {
    quotes,
    loadingQuotes,
    loadQuotes,
    filteredQuotes,
    addQuote,
    findQuotes,
    filterQuotes,
    resetQuoteFilter,
    removeQuote,
    removingQuote,
  };
});
