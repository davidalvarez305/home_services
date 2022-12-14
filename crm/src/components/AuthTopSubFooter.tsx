import Link from "next/link";
import useAuthFooterLinks from "../hooks/useAuthFooterLinks";
import Checkbox from "./Checkbox";

export default function AuthTopSubFooter() {
  const { showForgotPassword } = useAuthFooterLinks();
  return (
    <div className="space-y-2 sm:flex sm:items-center sm:justify-between sm:space-x-2 sm:space-y-0 mt-4">
      <Checkbox />
      {showForgotPassword && (
        <Link
          href="/forgot-password"
          className="inline-block text-blue-600 hover:text-blue-400"
        >
          Forgot Password?
        </Link>
      )}
    </div>
  );
}
