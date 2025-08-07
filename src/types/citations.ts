interface Style {
  tagStart?: string;
  tagEnd?: string;
  append?: string;
  prepend?: string;
}

export interface CitationsDetails {
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
}
