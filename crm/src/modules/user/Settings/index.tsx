import React, { useContext } from "react";
import Layout from "../../../components/Layout";
import { UserContext } from "../../../context/UserContext";
import { USER_ROUTE } from "../../../constants";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { useToast } from "@chakra-ui/react";
import UserSettingsForm from "./UserSettingsForm";

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  useLoginRequired();
  const ctx = useContext(UserContext);
  const { makeRequest, isLoading, error } = useFetch();
  const toast = useToast();

  function handleDeleteProfile() {
    makeRequest(
      {
        url: USER_ROUTE,
        method: "DELETE",
      },
      (_) => {
        ctx?.Logout();
      }
    );
  }

  return (
    <Layout>
      {/* User Profile */}
      <div className="space-y-4 lg:space-y-8">
        {/* Vital Info */}
        <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
          <div className="p-5 lg:p-6 grow w-full">
            <div className="md:flex">
              <div className="md:flex-none md:w-1/3 border-b md:border-0 mb-5 md:mb-0">
                <h3 className="flex items-center space-x-2 font-semibold mb-2">
                  <svg
                    className="hi-solid hi-user-circle inline-block w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>User Profile</span>
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  Your account’s vital info. Only your username and photo will
                  be publicly visible.
                </p>
              </div>
              <div className="md:w-2/3 md:pl-24">
                {ctx?.user && ctx.user.id > 0 && <UserSettingsForm />}
              </div>
            </div>
          </div>
        </div>
        {/* END Vital Info */}

        {/* Change Password */}
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
                  Changing your sign in password is an easy way to keep your
                  account secure.
                </p>
              </div>
              <div className="md:w-2/3 md:pl-24">
                <form className="space-y-6">
                  <div className="space-y-1">
                    <label className="font-medium" htmlFor="password">
                      Current Password
                    </label>
                    <input
                      className="block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="password"
                      id="password"
                      name="password"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium" htmlFor="password_new">
                      New Password
                    </label>
                    <input
                      className="block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="password"
                      id="password_new"
                      name="password_new"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="font-medium"
                      htmlFor="password_new_confirm"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="password"
                      id="password_new_confirm"
                      name="password_new_confirm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* END Change Password */}
      </div>
      {/* END User Profile */}
      {error.message &&
        error.message.length > 0 &&
        toast({
          title: "Error deleting account.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })}
    </Layout>
  );
};
export default ProfileSettings;
