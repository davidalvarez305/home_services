import AuthSubFooter from "../../../components/AuthSubFooter";
import Checkbox from "../../../components/Checkbox";

interface Props {
  children: React.ReactNode;
}

export default function FormWrapper({ children }: Props) {
  return (
    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <div className="p-5 lg:p-6 grow w-full">
        <div className="sm:p-5 lg:px-10 lg:py-8">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
      <AuthSubFooter />
    </div>
  );
}
