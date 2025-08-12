interface Style {
  tagStart?: string;
  tagEnd?: string;
  append?: string;
  prepend?: string;
}

interface StyleAuthor extends Style {
  isInitial: boolean;
  linkBetweenFirstname: string;
  linkFirstAuthorName: string;
  linkLastAuthor: string;
  appendAuthors?: string;
  etAl?: string; // if want to apply et al., just need to add property
  reverseName: boolean;
  nameIsUpperCase: boolean;
}

export interface CitationsProperties {
  title?: Style;
  publisher?: Style;
  journal?: Style;
  date?: Style;
  volume?: Style;
  issue?: Style;
  author: StyleAuthor;
  page?: Style;
  URL?: Style;
  DOI?: Style;
}

export type CitationHtmlMap = {
  [K in keyof CitationsProperties]?: string;
};

export interface CitationsDetails {
  order: string[];
  title?: Style;
  publisher?: Style;
  journal?: Style;
  date?: Style;
  volume?: Style;
  issue?: Style;
  author?: StyleAuthor;
  page?: Style;
  URL?: Style;
  reportNumber?: Style;
  accessDate?: Style;
  newspaperName?: Style;
  magazineName?: Style;
}

export interface TypeCitation {
  books: CitationsDetails;
  articles: CitationsDetails;
  web: CitationsDetails;
  bookChapter: CitationsDetails;
  conferencePaper: CitationsDetails;
  thesis: CitationsDetails;
  report: CitationsDetails;
  newspaperArticle: CitationsDetails;
  magazineArticle: CitationsDetails;
}

export interface Citations {
  chicago: TypeCitation;
  APA: TypeCitation;
  MLA: TypeCitation;
  custom: TypeCitation;
}
