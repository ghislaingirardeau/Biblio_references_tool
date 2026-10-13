import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Quote } from 'src/types/references';
import {
  getQuotesByProject,
  getQuotesByReference,
  removeQuoteFirestore,
  saveQuoteFirestore,
  updateQuoteFirestore,
} from 'src/utils/useFirestore';

export const useQuotesStore = defineStore('QuotesStore', () => {
  const quotes = ref<Quote[]>([]);
  const quotesByReference = ref<Quote[]>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

  const loadingQuotes = ref(false);
  const removingQuote = ref(false);

  function resetQuoteFilter() {
    filteredQuotes.value = null;
  }

  async function loadQuotes(projectId: string) {
    loadingQuotes.value = true;

    try {
      quotes.value = (await getQuotesByProject(projectId)) as Quote[];
    } finally {
      loadingQuotes.value = false;
    }
  }

  function loadQuotesByReferences(referenceId: string) {
    loadingQuotes.value = true;

    try {
      quotesByReference.value = quotes.value.filter((quote) => quote.reference_id === referenceId);
    } finally {
      loadingQuotes.value = false;
    }
  }

  async function addQuote(quote: Quote) {
    try {
      await saveQuoteFirestore(quote);
      quotes.value.unshift(quote);
      quotesByReference.value.unshift(quote);
    } catch (error) {
      console.log(error);
    }
  }

  async function update(quote: Quote) {
    try {
      await updateQuoteFirestore(quote);
    } catch (error) {
      console.log(error);
    }
  }

  async function removeQuote(quoteId: string) {
    try {
      removingQuote.value = true;
      await removeQuoteFirestore(quoteId);
      const filterQuotes = quotes.value.filter((quote) => quote.id !== quoteId);
      const filterQuotesOnReference = quotesByReference.value.filter(
        (quote) => quote.id !== quoteId,
      );
      quotesByReference.value = filterQuotesOnReference;
      quotes.value = filterQuotes;
    } catch (error) {
      console.log(error);
    } finally {
      removingQuote.value = false;
    }
  }

  function filterQuotes(query: string) {
    filteredQuotes.value = null;
    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const searchQuotes = quotesByReference.value.filter(
      (quote) =>
        quote.content!.toLowerCase().includes(lowerQuery) ||
        quote.tag?.map((q) => q.toLowerCase()).includes(lowerQuery),
    );
    if (searchQuotes.length === 0) {
      return 'No quotes found...';
    }
    filteredQuotes.value = searchQuotes;
    return null;
  }

  return {
    quotes,
    quotesByReference,
    loadingQuotes,
    loadQuotes,
    loadQuotesByReferences,
    filteredQuotes,
    addQuote,
    update,
    filterQuotes,
    resetQuoteFilter,
    removeQuote,
    removingQuote,
  };
});
