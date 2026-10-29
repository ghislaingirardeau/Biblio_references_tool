import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Quote, ReferencesType } from 'src/types/references';
import {
  getQuotesByProject,
  removeQuoteFirestore,
  saveQuoteFirestore,
} from 'src/utils/useFirestore';

export const useQuotesStore = defineStore('QuotesStore', () => {
  // store all quotes, so no need to call firebase more than necessary
  const quotes = ref<Quote[]>([]);
  // store quotes for a specific route => reference
  const quotesByReference = ref<Quote[]>([]);
  const filteredQuotes = ref<Quote[] | null>(null);

  const loadingQuotes = ref(false);
  const removingQuote = ref(false);

  const newQuote = ref<Quote>({
    id: 'quote_' + Date.now().toString(),
    page: '0',
    content: '',
    tag: null,
    reference_id: null,
    project_id: null,
    fromType: null,
  });

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
    quotesByReference.value = quotes.value.filter((quote) => quote.reference_id === referenceId);
    loadingQuotes.value = false;
  }

  async function addQuote(projectId: string, type: keyof ReferencesType, id: string) {
    try {
      newQuote.value.id = 'quote_' + Date.now().toString();
      newQuote.value.project_id = projectId;
      newQuote.value.reference_id = id;
      newQuote.value.fromType = type;
      await saveQuoteFirestore(newQuote.value);
      quotes.value.unshift(newQuote.value);
      quotesByReference.value.unshift(newQuote.value);
    } catch (error) {
      console.log(error);
    }
  }

  async function update(quote: Quote) {
    try {
      await saveQuoteFirestore(quote);
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
      resetQuoteFilter();
    }
  }

  function resetNewQuote() {
    newQuote.value = {
      id: 'quote_' + Date.now().toString(),
      page: '0',
      content: '',
      tag: null,
      reference_id: null,
      project_id: null,
      fromType: null,
    };
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

  function findQuote(id: string) {
    const find = quotes.value.find((q) => q.id === id);
    if (find) {
      filteredQuotes.value = [find];
    }
  }

  return {
    quotes,
    newQuote,
    quotesByReference,
    loadingQuotes,
    loadQuotes,
    loadQuotesByReferences,
    filteredQuotes,
    findQuote,
    addQuote,
    update,
    filterQuotes,
    resetQuoteFilter,
    removeQuote,
    removingQuote,
    resetNewQuote,
  };
});
