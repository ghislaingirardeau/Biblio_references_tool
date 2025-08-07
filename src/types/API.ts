import type { ReferenceContent } from './references';

export interface RawAPIData extends ReferenceContent {
  author?: { family?: string; given?: string; name?: string }[];
  created: { timestamp: number };
  ['container-title']: string[];
  ['published-print']: {
    ['date-parts']: string[][];
  };
  rawTitle: string[];
  infoLink: string;
  pageCount: string;
  publishedDate: string;
}
