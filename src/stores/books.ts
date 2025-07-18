import { defineStore } from 'pinia';
import { onMounted, type Ref, ref } from 'vue';
import type { Book, Quote } from 'src/types/books';
import { useStorage } from '@vueuse/core';
import type { References } from 'src/types/references';

export const useBooksStore = defineStore('BooksStore', () => {
  const books = ref<Book[]>([]);

  function title(id: number) {
    return books.value.find((book) => book.id === id)?.title;
  }

  function find(id: number) {
    return books.value.find((book) => book.id === id);
  }

  function filter(query: string) {
    initBooks();
    if (!query.trim()) {
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filterBooks = books.value.filter(
      (book) =>
        book.title!.toLowerCase().includes(lowerQuery) ||
        book.authors!.join(' ').toLowerCase().includes(lowerQuery),
    );
    if (filterBooks.length === 0) {
      return 'Book not found';
    }
    books.value = filterBooks;
    return null;
  }

  function add(book: Book) {
    book.id = Number(book.industryIdentifiers![0]!.identifier);
    books.value.unshift(book);
    // localStorage.setItem('books', JSON.stringify(books.value));
  }

  function addQuote(bookId: number, quote: Quote) {
    const book = find(bookId);
    if (book && book?.quotes) {
      book?.quotes.unshift(quote);
    } else {
      book!.quotes = [quote];
    }

    // localStorage.setItem('books', JSON.stringify(books.value));
  }

  function initBooks() {
    const saved = localStorage.getItem('books');
    if (saved) {
      books.value = JSON.parse(saved);
    }
  }

  // Load books from localStorage on store init
  onMounted(() => initBooks());

  // Watch for changes and save to localStorage
  // watch(
  //   books,
  //   (newBook) => {
  //     if (newBook) {
  //       localStorage.setItem('books', JSON.stringify(books.value));
  //     }
  //   },
  //   { deep: true }
  // );

  return { books, title, add, addQuote, find, filter, initBooks };
});
