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

export interface CitationsDetails {
  order: string[];
  title?: Style;
  ['main-title']?: Style;
  ['main-authors']?: Style;
  pages?: Style;
  publisher?: Style;
  journal?: Style;
  date?: Style;
  volume?: Style;
  issue?: Style;
  author?: StyleAuthor;
  page?: Style;
  URL?: Style;
  DOI?: Style;
  reportNumber?: Style;
  accessDate?: Style;
  newspaperName?: Style;
  magazineName?: Style;
}

export type CitationHtmlMap = {
  [K in keyof CitationsDetails]?: string;
};

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
