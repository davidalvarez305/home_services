import { SelectType } from "../components/MultiFormSelect";

export const removeOptionAtIndex = (
  arr: SelectType[],
  value: SelectType
): SelectType[] => {
  var index;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value === value.value) {
      index = i;
    }
  }

  if (typeof index === "undefined") {
    return arr;
  }

  arr.splice(index, 1);

  return arr;
};
