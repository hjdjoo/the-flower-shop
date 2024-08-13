export default function snakeToCamel(string: string) {

  const stringArr = string.split("_");

  stringArr.forEach((str, idx) => {

    if (idx > 0) {
      stringArr[idx] = str[0].toUpperCase().concat(str.slice(1));
    }

  });


  return stringArr.join("");

}