import type { Book, Article, Web } from 'src/types/books';

export interface References {
  books?: Book[];
  articles?: Article[];
  web?: Web[];
}

export type ReferencesType = readonly ['books', 'articles', 'web'];
