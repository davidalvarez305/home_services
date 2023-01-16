import { useContext } from "react";
import Button from "../../../components/Button";
import { USER_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";

export default function ChangePasswordForm() {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(UserContext);
  function handleSubmit() {
    if (!ctx?.user || ctx?.user.email === "") {
      return;
    }

    makeRequest(
      {
        url: USER_ROUTE + "/forgot-password",
        method: "POST",
        data: {
          email: ctx.user.email,
        },
      },
      (_) => {}
    );
  }

  return (
    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <div className="p-5 lg:p-6 grow w-full">
        <div className="md:flex">
          <div className="md:flex-none md:w-1/3 border-b md:border-0 mb-5 md:mb-0">
            <h3 className="flex items-center space-x-2 font-semibold mb-2">
              <svg
                className="hi-solid hi-lock-open inline-block w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
              <span>Change Password</span>
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              Changing your sign in password is an easy way to keep your account
              secure.
            </p>
          </div>
          <div className="md:w-2/3 md:pl-24">
            <Button disabled={isLoading} onClick={() => handleSubmit()}>
              Request Password Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
