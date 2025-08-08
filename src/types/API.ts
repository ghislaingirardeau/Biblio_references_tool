export interface DoiAPIData {
  author?: { family?: string; given?: string; name?: string }[];
  created: { timestamp: number };
  ['container-title']: string[];
  ['published-print']: {
    ['date-parts']: string[][];
  };
  rawTitle: string[];
  infoLink: string;
  pageCount: string;
  ['published-print']: {
    ['date-parts']: string[][];
  };
  type: string;
  title: string[];
  authors: string;
  journal: string;
  publisher: string;
  date: string;
  page: string;
  issue: string;
  volume: string;
  DOI: string;
  URL: string;
  language: string;
}

export interface IsbnAPIData {
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  categories: string;
  language: string;
  formatAuthors: string;
  pageCount: string;
  infoLink: string;
  imageLinks: { thumbnail: string };
  thumbnail: string;
}
