export default function camelToSnake(string: string) {

  const stringArr = string.split(/[A-Z]/g);

  const capitals = string.matchAll(/[A-Z]/g)

  for (let i = 1; i < stringArr.length; i++) {
    stringArr[i] = "_".concat(capitals.next().value[0].toLowerCase()).concat(stringArr[i])
  }

  return stringArr.join("");

}