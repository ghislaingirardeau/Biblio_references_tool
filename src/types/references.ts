import type {
  Book,
  Article,
  BookChapter,
  ConferencePaper,
  Thesis,
  WebPage,
  NewspaperArticle,
  MagazineArticle,
  Dataset,
  Software,
  Interview,
  Film,
  LegalCase,
  Legislation,
  Patent,
  Manuscript,
  Presentation,
  Audio,
  Image,
  Report,
} from 'src/types/books';

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
    lists: WebPage[];
    type: string;
    label: string;
    description: string;
  };
  bookChapter?: {
    lists: BookChapter[];
    type: string;
    label: string;
    description: string;
  };
  conferencePaper?: {
    lists: ConferencePaper[];
    type: string;
    label: string;
    description: string;
  };
  thesis?: {
    lists: Thesis[];
    type: string;
    label: string;
    description: string;
  };
  report?: {
    lists: Report[];
    type: string;
    label: string;
    description: string;
  };
  newspaperArticle?: {
    lists: NewspaperArticle[];
    type: string;
    label: string;
    description: string;
  };
  magazineArticle?: {
    lists: MagazineArticle[];
    type: string;
    label: string;
    description: string;
  };
  dataset?: {
    lists: Dataset[];
    type: string;
    label: string;
    description: string;
  };
  software?: {
    lists: Software[];
    type: string;
    label: string;
    description: string;
  };
  interview?: {
    lists: Interview[];
    type: string;
    label: string;
    description: string;
  };
  film?: {
    lists: Film[];
    type: string;
    label: string;
    description: string;
  };
  legalCase?: {
    lists: LegalCase[];
    type: string;
    label: string;
    description: string;
  };
  legislation?: {
    lists: Legislation[];
    type: string;
    label: string;
    description: string;
  };
  patent?: {
    lists: Patent[];
    type: string;
    label: string;
    description: string;
  };
  manuscript?: {
    lists: Manuscript[];
    type: string;
    label: string;
    description: string;
  };
  presentation?: {
    lists: Presentation[];
    type: string;
    label: string;
    description: string;
  };
  audio?: {
    lists: Audio[];
    type: string;
    label: string;
    description: string;
  };
  image?: {
    lists: Image[];
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
