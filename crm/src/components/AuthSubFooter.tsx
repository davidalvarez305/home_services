import { Checkbox } from "@chakra-ui/react";
import useAuthFooterLinks from "../hooks/useAuthFooterLinks";

export default function AuthSubFooter() {
  const { redirect, msg } = useAuthFooterLinks();
  // <Checkbox />
  return (
    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <div className="space-y-2 sm:flex sm:items-center sm:justify-between sm:space-x-2 sm:space-y-0 mt-4">
        <a href="#" className="inline-block text-blue-600 hover:text-blue-400">
          Forgot Password?
        </a>
      </div>
      <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
        {msg.top}
        <div
          onClick={() => redirect()}
          className="cursor-pointer font-medium text-blue-600 hover:text-blue-400"
        >
          {msg.bottom}
        </div>
      </div>
    </div>
  );
}
