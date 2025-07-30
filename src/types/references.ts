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
    template?: any;
  };
  articles?: {
    lists: Article[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  web?: {
    lists: WebPage[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  bookChapter?: {
    lists: BookChapter[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  conferencePaper?: {
    lists: ConferencePaper[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  thesis?: {
    lists: Thesis[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  report?: {
    lists: Report[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  newspaperArticle?: {
    lists: NewspaperArticle[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  magazineArticle?: {
    lists: MagazineArticle[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  dataset?: {
    lists: Dataset[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  software?: {
    lists: Software[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  interview?: {
    lists: Interview[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  film?: {
    lists: Film[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  legalCase?: {
    lists: LegalCase[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  legislation?: {
    lists: Legislation[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  patent?: {
    lists: Patent[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  manuscript?: {
    lists: Manuscript[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  presentation?: {
    lists: Presentation[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  audio?: {
    lists: Audio[];
    type: string;
    label: string;
    description: string;
    template?: any;
  };
  image?: {
    lists: Image[];
    type: string;
    label: string;
    description: string;
    template?: any;
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
