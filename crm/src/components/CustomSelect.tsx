import { useField, useFormikContext } from "formik";
import { DetailedHTMLProps, SelectHTMLAttributes, useEffect } from "react";

type Props = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
  label: string;
  children: React.ReactNode;
};

export default function CustomSelect({ name, label, children, ...props }: Props) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const defaultClassName = "w-full block border border-gray-200 rounded px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  useEffect(() => {
    if (props.value) {
      setFieldValue(name, props.value);
    }
  }, [name, props.value, setFieldValue]);

  return (
    <div className="space-y-1">
      <label className="font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className={defaultClassName}
        id={field.name}
        {...props}
        {...field}
      >
       {children}
      </select>
    </div>
  );
}
