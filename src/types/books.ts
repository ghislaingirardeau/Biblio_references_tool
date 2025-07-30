interface IndustryIdentifiers {
  type: string;
  identifier: string;
}

export interface Quote {
  id: string | null;
  page?: string;
  content?: string;
}

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
  type?: string;
  title?: string;
  subtitle?: string;
  authors?: string[];
  journal?: string;
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

// 3. Book Chapter
export interface BookChapter {
  id: string | null;
  title?: string;
  authors?: string[];
  bookTitle?: string;
  editors?: string[];
  publisher?: string;
  publishedDate?: string;
  page?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 4. Conference Paper
export interface ConferencePaper {
  id: string | null;
  title?: string;
  authors?: string[];
  conferenceName?: string;
  location?: string;
  publishedDate?: string;
  page?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 5. Thesis or Dissertation
export interface Thesis {
  id: string | null;
  title?: string;
  authors?: string[];
  institution?: string;
  degree?: string;
  publishedDate?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 6. Report
export interface Report {
  id: string | null;
  title?: string;
  authors?: string[];
  institution?: string;
  reportNumber?: string;
  publishedDate?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 7. Web Page
export interface WebPage {
  id: string | null;
  title?: string;
  authors?: string[];
  websiteName?: string;
  URL?: string;
  accessDate?: string;
  publishedDate?: string;
  language?: string;
  quotes?: Quote[];
}

// 8. Newspaper Article
export interface NewspaperArticle {
  id: string | null;
  title?: string;
  authors?: string[];
  newspaperName?: string;
  publishedDate?: string;
  page?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 9. Magazine Article
export interface MagazineArticle {
  id: string | null;
  title?: string;
  authors?: string[];
  magazineName?: string;
  issue?: string;
  publishedDate?: string;
  page?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 10. Dataset
export interface Dataset {
  id: string | null;
  title?: string;
  authors?: string[];
  repository?: string;
  DOI?: string;
  publishedDate?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 11. Software
export interface Software {
  id: string | null;
  title?: string;
  authors?: string[];
  version?: string;
  publisher?: string;
  publishedDate?: string;
  URL?: string;
  language?: string;
  quotes?: Quote[];
}

// 12. Interview
export interface Interview {
  id: string | null;
  title?: string;
  interviewee?: string[];
  interviewer?: string[];
  date?: string;
  location?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 13. Film or Video
export interface Film {
  id: string | null;
  title?: string;
  director?: string;
  producers?: string[];
  releaseDate?: string;
  productionCompany?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 14. Legal Case
export interface LegalCase {
  id: string | null;
  title?: string;
  court?: string;
  decisionDate?: string;
  citation?: string;
  jurisdiction?: string;
  quotes?: Quote[];
  URL?: string;
}

// 15. Legislation
export interface Legislation {
  id: string | null;
  title?: string;
  jurisdiction?: string;
  enactmentDate?: string;
  referenceNumber?: string;
  quotes?: Quote[];
  URL?: string;
}

// 16. Patent
export interface Patent {
  id: string | null;
  title?: string;
  inventors?: string[];
  patentNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  quotes?: Quote[];
  URL?: string;
}

// 17. Manuscript
export interface Manuscript {
  id: string | null;
  title?: string;
  authors?: string[];
  status?: 'unpublished' | 'in review' | 'in press';
  submissionDate?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 18. Presentation or Lecture
export interface Presentation {
  id: string | null;
  title?: string;
  presenter?: string;
  event?: string;
  location?: string;
  date?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 19. Audio Recording
export interface Audio {
  id: string | null;
  title?: string;
  speaker?: string;
  publisher?: string;
  releaseDate?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}

// 20. Image or Figure
export interface Image {
  id: string | null;
  title?: string;
  creator?: string;
  format?: string;
  source?: string;
  date?: string;
  language?: string;
  quotes?: Quote[];
  URL?: string;
}
