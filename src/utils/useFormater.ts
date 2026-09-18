import type { DoiAPIData, IsbnAPIData } from 'src/types/API';
import type { BibliographicEntry } from 'src/types/references';

import type { Ref } from 'vue';

export function formatIdentifier(identifier: Ref<string>) {
  identifier.value = identifier.value.trim();
  const isbnFormattedRegex = /^(97(8|9))?[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]$/i;

  if (isbnFormattedRegex.test(identifier.value)) {
    identifier.value = identifier.value.split('-').join('');
  }
}

export function formatArticleData(article: DoiAPIData, newReference: Ref<BibliographicEntry>) {
  const author = article.author?.map((a) => {
    return {
      firstname: a.given,
      lastname: a.family,
    };
  });
  const { title: rawTitle, publisher, DOI, language, volume, issue, page, URL, type } = article;
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  newReference.value = Object.assign(newReference.value, {
    type: type || '',
    title: rawTitle[0] || '',
    authors: author || [],
    journal: article['container-title'][0] || '',
    publisher: publisher || '',
    date: publishedDate || '',
    page: page || '',
    issue: issue || '',
    volume: volume || '',
    DOI: DOI || '',
    URL: URL || '',
    language: language || '',
  });
}

export function formatReportData(article: DoiAPIData, newReference: Ref<BibliographicEntry>) {
  const author = article.author?.map((a) => {
    return {
      firstname: '',
      lastname: a.name,
    };
  });
  console.log(article);
  const { title: rawTitle, publisher, DOI, language, URL, type } = article;
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  newReference.value = Object.assign(newReference.value, {
    type: type || '',
    title: rawTitle[0] || '',
    authors: author || [],
    journal: article['container-title'][0] || '',
    publisher: publisher || '',
    date: publishedDate || '',
    DOI: DOI || '',
    URL: URL || '',
    language: language || '',
  });
}

export function formatBookData(result: IsbnAPIData, newReference: Ref<BibliographicEntry>) {
  const { title, subtitle, authors, publisher, categories, language } = result;
  console.log(authors);
  const formatAuthors = authors?.map((a) => {
    const textToArray = a.split(' ');
    return {
      firstname: textToArray.slice(0, -1).join(' '),
      lastname: textToArray.slice(-1).join(' '),
    };
  });
  newReference.value = Object.assign(newReference.value, {
    title,
    subtitle: subtitle || '',
    authors: formatAuthors || [],
    publisher: publisher || '',
    date: result.publishedDate || '',
    page: result.pageCount || '',
    categories: categories || '',
    URL: result.infoLink || '',
    imageLinks: result.imageLinks?.thumbnail || '',
    language: result.language || '',
  });
}

export function formatConferenceData(article: DoiAPIData, newReference: Ref<BibliographicEntry>) {
  const author = article.author?.map((a) => {
    return {
      firstname: a.given,
      lastname: a.family,
    };
  });
  console.log(article);
  const { title, publisher, DOI, language, URL, type, event, page } = article;
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  const start = event?.start?.['date-parts']?.[0]?.[0];
  const end = event?.end?.['date-parts']?.[0]?.[0];
  newReference.value = Object.assign(newReference.value, {
    type: type || '',
    title: title[0] || '',
    authors: author || [],
    location: event?.location || '',
    publisher: publisher || '',
    date: publishedDate || '',
    name: event?.name || '',
    DOI: DOI || '',
    URL: URL || '',
    language: language || '',
    page: page || '',
  });
}
