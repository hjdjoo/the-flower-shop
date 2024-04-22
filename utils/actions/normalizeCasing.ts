export default function normalizeCasing(str: string): string {

  const splitByWord = str.toLowerCase().split(" ");

  splitByWord.forEach((word, idx) => {

    splitByWord[idx] = word[0].toUpperCase().concat(word.slice(1))

  })

  return splitByWord.join(" ");
};