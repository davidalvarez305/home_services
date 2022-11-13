export const capitalizeFirstLetter = (str: string) => {
  var final = "";

  if (str.includes("_")) {
    final = str.split("_").join(" ");
  } else {
    final = str;
  }

  if (final.includes("id")) {
    final = final.split("id")[0];
  }

  return final.charAt(0).toUpperCase() + final.slice(1);
};
