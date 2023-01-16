import React, { InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};
export default function SimpleInput({ label, name, size: _, ...props }: Props) {
  const defaultClassName =
    "block border border-gray-200 text-black rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  return (
    <div className="space-y-1">
      <div className="font-medium text-black">{label}</div>
      <input id={name} className={defaultClassName} {...props} />
    </div>
  );
}
