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
  thesis?: ReferenceDetails;
  report?: ReferenceDetails;
  newspaperArticle?: ReferenceDetails;
  magazineArticle?: ReferenceDetails;
  dataset?: ReferenceDetails;
  software?: ReferenceDetails;
  film?: ReferenceDetails;
  legalCase?: ReferenceDetails;
  legislation?: ReferenceDetails;
  presentation?: ReferenceDetails;
  patent?: ReferenceDetails;
  manuscript?: ReferenceDetails;
  interview?: ReferenceDetails;
  audio?: ReferenceDetails;
  image?: ReferenceDetails;
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

export interface Quote {
  id: string | null;
  page?: string;
  content?: string;
}

export interface BibliographicEntry {
  id: string | null;
  title?: string;
  type?: string;
  tag?: string[];
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  ['published-date']?: string;
  page?: string;
  categories?: string[];
  language?: string;
  URL?: string;
  imageLinks?: { thumbnail: string };
  quotes?: Quote[];
  volume?: string;
  issue?: string;
  DOI?: string;
  bookTitle?: string;
  editors?: string[];
  conferenceName?: string;
  location?: string;
  institution?: string;
  degree?: string;
  reportNumber?: string;
  websiteName?: string;
  accessDate?: string;
  newspaperName?: string;
  magazineName?: string;
  repository?: string;
  version?: string;
  interviewee?: string[];
  interviewer?: string[];
  director?: string;
  producers?: string[];
  releaseDate?: string;
  productionCompany?: string;
  court?: string;
  decisionDate?: string;
  jurisdiction?: string;
  enactmentDate?: string;
  referenceNumber?: string;
  inventors?: string[];
  patentNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  status?: 'unpublished' | 'in review' | 'in press';
  presenter?: string;
  event?: string;
  creator?: string;
  format?: string;
  source?: string;
}
