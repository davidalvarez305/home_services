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
      <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
        <a className="font-medium text-blue-600 hover:text-blue-400" href="#">
          Return to Sign In
        </a>
      </div>
    </div>
  );
}
