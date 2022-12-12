import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

const PrimaryInput: React.FC<Props> = ({ label, name, size: _, ...props }) => {
  const [field] = useField(name);

  return (
    <div className="space-y-1">
      <div className="font-medium">{label}</div>
      <input {...props} {...field} />
    </div>
  );
};

export default PrimaryInput;
