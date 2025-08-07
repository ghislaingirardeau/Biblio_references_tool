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

export interface ReferenceDetails<T> {
  lists: T;
  type: string;
  label: string;
  description: string;
  template?: any;
}

export interface References {
  books?: ReferenceDetails<Book[]>;
  articles?: ReferenceDetails<Article[]>;
  web?: ReferenceDetails<WebPage[]>;
  bookChapter?: ReferenceDetails<BookChapter[]>;
  conferencePaper?: ReferenceDetails<ConferencePaper[]>;
  thesis?: ReferenceDetails<Thesis[]>;
  report?: ReferenceDetails<Report[]>;
  newspaperArticle?: ReferenceDetails<NewspaperArticle[]>;
  magazineArticle?: ReferenceDetails<MagazineArticle[]>;
  dataset?: ReferenceDetails<Dataset[]>;
  software?: ReferenceDetails<Software[]>;
  film?: ReferenceDetails<Film[]>;
  legalCase?: ReferenceDetails<LegalCase[]>;
  legislation?: ReferenceDetails<Legislation[]>;
  presentation?: ReferenceDetails<Presentation[]>;
  patent?: ReferenceDetails<Patent[]>;
  manuscript?: ReferenceDetails<Manuscript[]>;
  interview?: ReferenceDetails<Interview[]>;
  audio?: ReferenceDetails<Audio[]>;
  image?: ReferenceDetails<Image[]>;
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
