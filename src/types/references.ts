export interface ReferenceDetails {
  lists: BibliographicEntry[];
  type: string;
  label: string;
  description: string;
  template?: any;
}

export interface References {
  books?: ReferenceDetails;
  articles?: ReferenceDetails;
  web?: ReferenceDetails;
  bookChapter?: ReferenceDetails;
  conferencePaper?: ReferenceDetails;
  dissertation?: ReferenceDetails;
  report?: ReferenceDetails;
  newspaperArticle?: ReferenceDetails;
  magazineArticle?: ReferenceDetails;
  software?: ReferenceDetails;
  legislation?: ReferenceDetails;
  presentation?: ReferenceDetails;
  manuscript?: ReferenceDetails;
  interview?: ReferenceDetails;
}

export type ReferencesType = readonly [
  'books',
  'articles',
  'web',
  'bookChapter',
  'conferencePaper',
  'dissertation',
  'report',
  'newspaperArticle',
  'magazineArticle',
  'software',
  'legislation',
  'manuscript',
  'presentation',
];

export interface Quote {
  id: string | null;
  page?: string;
  content?: string;
  tag?: string;
}

export interface Authors {
  firstname: string;
  lastname: string;
}

export interface BibliographicEntry {
  id: string | null;
  title?: string;
  type?: string;
  tag?: string[];
  subtitle?: string;
  authors?: Authors[];
  ['main-title']?: string;
  ['main-authors']?: Authors[];
  publisher?: string;
  journal?: string;
  date?: string;
  page?: string;
  pages?: string;
  categories?: string[];
  language?: string;
  URL?: string;
  imageLinks?: { thumbnail: string };
  quotes?: Quote[];
  volume?: string;
  issue?: string;
  DOI?: string;
  name?: string;
  location?: string;
  source?: string;
  institution?: string;
  degree?: string;
  accessDate?: string;
  version?: string;
  status?: 'unpublished' | 'in review' | 'in press';
  event?: string;
}
