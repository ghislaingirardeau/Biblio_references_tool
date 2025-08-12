export function formatFirstNames(array: string[], initials: boolean) {
  const result = array.map((n, i, a) => {
    // if name is already initial format return only letter
    const regexInitial = /[a-zA-Z]\./;
    if (regexInitial.test(n) && !initials) return n.slice(0, 1);

    // if more than one name, and initial mode add ponctuation
    if (initials) {
      return n.slice(0, 1) + '.';
    }

    // return full name in array
    return n;
  });

  return result;
}

export function formatFirstAuthor(
  author: { firstname: string; lastname: string },
  isInitial: boolean,
  ponctuation: string,
) {
  const firstname = formatFirstNames(author.firstname.split(' '), isInitial);
  return author.lastname + ponctuation + firstname.join(' ');
}
