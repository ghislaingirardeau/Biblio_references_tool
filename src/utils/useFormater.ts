import type { RawAPIData } from 'src/types/API';
import type { ReferenceContent } from 'src/types/references';

import type { Ref } from 'vue';

export function formatIdentifier(identifier: Ref<string>) {
  identifier.value = identifier.value.trim();
  const isbnFormattedRegex = /^(97(8|9))?[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX]$/i;

  if (isbnFormattedRegex.test(identifier.value)) {
    identifier.value = identifier.value.split('-').join('');
  }
}

export function formatArticleData(article: RawAPIData, newReference: Ref<ReferenceContent>) {
  const author = article.author?.map((a) => a.family + ' ' + a.given);
  const { title: rawTitle, publisher, DOI, language, volume, issue, page, URL, type } = article;
  console.log(article);
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  newReference.value = Object.assign(newReference.value, {
    type,
    title: rawTitle![0],
    authors: author,
    journal: article['container-title'][0],
    publisher,
    ['published-date']: publishedDate,
    page,
    issue,
    volume,
    DOI,
    URL,
    language,
  });
}

export function formatReportData(article: RawAPIData, newReference: Ref<ReferenceContent>) {
  const author = article.author?.map((a) => a.name);
  const { title, publisher, DOI, language, URL, type } = article;
  console.log(article);
  const publishedDate = article?.['published-print']?.['date-parts']?.[0]?.[0];
  newReference.value = Object.assign(newReference.value, {
    type,
    title,
    authors: author,
    journal: article['container-title'][0],
    publisher,
    ['published-date']: publishedDate,
    DOI,
    URL,
    language,
  });
}

export function formatBookData(result: RawAPIData, newReference: Ref<ReferenceContent>) {
  newReference.value = Object.assign(newReference.value, {
    title: result.title,
    subtitle: result.subtitle,
    authors: result.authors?.map((a) => a.split(' ').reverse().join(' ')),
    publisher: result.publisher,
    ['published-date']: result.publishedDate,
    page: result.pageCount,
    categories: result.categories,
    URL: result.infoLink,
    imageLinks: result.imageLinks?.thumbnail,
    language: result.language,
  });
}
