import type { Book, Article } from 'src/types/books';

export interface References {
  books?: Book[];
  articles?: Article[];
}

export type ReferencesType = readonly ['books', 'articles', 'web'];
