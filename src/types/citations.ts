interface Format {
  tag?: string;
  append?: string;
  prepend?: string;
}

export interface Citations {
  [key: string]: {
    title?: Format;
    publisher?: Format;
    date?: Format;
    volume?: Format;
    issue?: Format;
    author?: Format;
    page?: Format;
  };
}
