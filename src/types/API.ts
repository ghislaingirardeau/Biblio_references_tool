import type { Article } from './books';

export interface RawArticle extends Article {
  author?: { family: string; given: string }[];
  created: { timestamp: number };
  ['container-title']: string[];
  ['published-print']: {
    ['date-parts']: string[][];
  };
}
