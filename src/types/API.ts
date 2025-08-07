import type { BibliographicEntry } from './references';

export interface RawAPIData extends BibliographicEntry {
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
