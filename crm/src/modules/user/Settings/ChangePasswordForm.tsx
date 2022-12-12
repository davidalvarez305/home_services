import { Form, Formik } from "formik";
import { useContext } from "react";
import { BUCKET_URL } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import Image from "next/image";
import FormInput from "../../../components/FormInput";
import useFetch from "../../../hooks/useFetch";

export default function ChangePasswordForm() {
  const { makeRequest, isLoading, error } = useFetch();

  function handleSubmit(values: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    if (
      values.confirmNewPassword !== values.newPassword ||
      values.newPassword.length === 0 ||
      values.confirmNewPassword.length === 0 ||
      values.currentPassword.length === 0
    ) {
      return;
    }
    console.log(values);
  }

  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }}
      onSubmit={handleSubmit}
    >
      <Form>
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
                  <FormInput
                      className="block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="password"
                      id="password"
                      name="password"
                      label="Password"
                    />
                  <FormInput
                      className="block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      label="New Password"
                    />
                  <FormInput
                      className="block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      label="Confirm New Password"
                    />
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
      </Form>
    </Formik>
  );
}
