import React, { useContext } from "react";
import Layout from "../../../components/Layout";
import { UserContext } from "../../../context/UserContext";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { useToast } from "@chakra-ui/react";
import UserSettingsForm from "./UserSettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";

const ProfileSettings: React.FC = () => {
  // useLoginRequired();
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
      <div className="space-y-4 lg:space-y-8">
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

        {ctx?.user && ctx.user.id > 0 && <ChangePasswordForm />}

      </div>
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
