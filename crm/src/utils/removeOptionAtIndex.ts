export const removeOptionAtIndex = (
  arr: string[],
  value: string
): string[] => {
  var index;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      index = i;
    }
  }

  if (typeof index === "undefined") {
    return arr;
  }

  arr.splice(index, 1);

  return arr;
};
