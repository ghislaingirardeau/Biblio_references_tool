import type { Article, Book } from './books';

export interface RawArticle extends Article {
  author?: { family?: string; given?: string; name?: string }[];
  created: { timestamp: number };
  ['container-title']: string[];
  ['published-print']: {
    ['date-parts']: string[][];
  };
  rawTitle: string[];
}

export interface RawBook extends Book {
  infoLink: string;
  pageCount: string;
  publishedDate: string;
}
