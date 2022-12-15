import Checkbox from "./Checkbox";
import Link from "next/link";
import useAuthFooterLinks from "../hooks/useAuthFooterLinks";

export default function AuthSubFooter() {
  const { redirect, msg } = useAuthFooterLinks();
  return (
    <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
      {msg.top}
      <div
        onClick={() => redirect()}
        className="cursor-pointer font-medium text-blue-600 hover:text-blue-400"
      >
        {msg.bottom}
      </div>
    </div>
  );
}
