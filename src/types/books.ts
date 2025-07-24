export interface Book {
  id: string | null;
  title?: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  industryIdentifiers?: IndustryIdentifiers[];
  pageCount?: number;
  categories?: string[];
  language?: string;
  infoLink?: string;
  imageLinks?: { thumbnail: string };
  quotes?: Quote[];
}

export interface Article {
  id: string | null;
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  DOI?: string;
  language?: string;
  quotes?: Quote[];
  volume?: string;
  issue?: string;
  page?: string;
  URL?: string;
}

export interface Web {
  id: string | null;
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  URL?: string;
  quotes?: Quote[];
}

interface IndustryIdentifiers {
  type: string;
  identifier: string;
}

export interface Quote {
  id: string | null;
  page?: string;
  content?: string;
}
