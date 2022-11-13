function capitalizeFirsLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const toTitleCase = (str: string) => {
  let final = "";

  const splitVar = str.split("_");

  if (splitVar.length > 0) {
    final = splitVar.map((subStr) => capitalizeFirsLetter(subStr)).join(" ");
  } else {
    final = capitalizeFirsLetter(str);
  }
  return final;
};
