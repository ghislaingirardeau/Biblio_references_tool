import type { Book, Article, Web } from 'src/types/books';

export interface References {
  books?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  articles?: {
    lists: Article[];
    type: string;
    label: string;
    description: string;
  };
  web?: {
    lists: Web[];
    type: string;
    label: string;
    description: string;
  };
  bookChapter?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  conferencePaper?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  thesis?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  report?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  newspaperArticle?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  magazineArticle?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  dataset?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  software?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  interview?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  film?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  legalCase?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  legislation?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  patent?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  manuscript?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  presentation?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  audio?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
  image?: {
    lists: Book[];
    type: string;
    label: string;
    description: string;
  };
}

export type ReferencesType = readonly [
  'books',
  'articles',
  'web',
  'bookChapter',
  'conferencePaper',
  'thesis',
  'report',
  'newspaperArticle',
  'magazineArticle',
  'dataset',
  'software',
  'interview',
  'film',
  'legalCase',
  'legislation',
  'patent',
  'manuscript',
  'presentation',
  'audio',
  'image',
];
