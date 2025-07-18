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

interface IndustryIdentifiers {
  type: string;
  identifier: string;
}

export interface Quote {
  id: string;
  page: string;
  content: string;
}
