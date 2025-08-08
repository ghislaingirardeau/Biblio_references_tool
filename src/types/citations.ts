interface Style {
  tagStart?: string;
  tagEnd?: string;
  append?: string;
  prepend?: string;
}

export interface CitationsProperties {
  title?: Style;
  publisher?: Style;
  date?: Style;
  volume?: Style;
  issue?: Style;
  author?: Style;
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
  date?: Style;
  volume?: Style;
  issue?: Style;
  author?: Style;
  page?: Style;
}

export interface TypeCitation {
  books: CitationsDetails;
  articles: CitationsDetails;
}

export interface Citations {
  chicago: TypeCitation;
  APA: TypeCitation;
  MLA: TypeCitation;
}
