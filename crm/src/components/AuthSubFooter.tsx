import { Checkbox } from "@chakra-ui/react";

export default function AuthSubFooter() {
  return (
    <>
      <div className="space-y-2 sm:flex sm:items-center sm:justify-between sm:space-x-2 sm:space-y-0 mt-4">
        <Checkbox />
        <a
          href="/forgot-password"
          className="inline-block text-blue-600 hover:text-blue-400"
        >
          Forgot Password?
        </a>
      </div>
      <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
        <a
          className="font-medium text-blue-600 hover:text-blue-400"
          href="/login"
        >
          Return to Sign In
        </a>
      </div>
    </>
  );
}
