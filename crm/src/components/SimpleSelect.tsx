import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

type Props = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  label?: string;
  children: React.ReactNode;
};

export default function SimpleSelect({
  name,
  label,
  children,
  ...props
}: Props) {
  const defaultClassName =
    "w-full block border border-gray-200 rounded px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  return (
    <div className="space-y-1">
      {label && (
        <label className="font-medium" htmlFor={name}>
          {label}
        </label>
      )}
      <select className={defaultClassName} {...props}>
        {children}
      </select>
    </div>
  );
}
