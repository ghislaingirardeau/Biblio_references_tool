import type { Book } from 'src/types/books';

export interface References {
  books?: Book[];
  articles?: Book[];
}

export type ReferencesType = readonly ['books', 'articles', 'web'];
