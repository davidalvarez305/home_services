interface Props {
    icon: JSX.Element;
    iconHeader: string;
    paragraphText: string;
}

export default function LargeFormSection({ icon, iconHeader, paragraphText }:Props) {
  return (
    <div className="md:flex-none md:w-1/3 text-center md:text-left">
      <h3 className="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1">
        {icon}
        <span>{iconHeader}</span>
      </h3>
      <p className="text-gray-500 text-sm mb-5">
        {paragraphText}
      </p>
    </div>
  );
}
