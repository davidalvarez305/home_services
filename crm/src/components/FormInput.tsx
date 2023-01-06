import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export default function FormInput({ label, name, size: _, ...props }:Props) {
  const [field] = useField(name);

  const defaultClassName = "block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  return (
    <div className="space-y-1">
      <div className="font-medium">{label}</div>
      <input id={field.name} className={defaultClassName} {...props} {...field} />
    </div>
  );
};
