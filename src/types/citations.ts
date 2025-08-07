interface Format {
  tag?: string;
  append?: string;
  prepend?: string;
}

export interface Citations {
  [key: string]: {
    title?: Format;
    publisher?: Format;
    publisheDate?: Format;
    volume?: Format;
    issue?: Format;
    author?: Format;
    page?: Format;
  };
}
