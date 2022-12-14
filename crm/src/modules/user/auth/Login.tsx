import { Form, Formik } from "formik";
import React, { useContext } from "react";
import Checkbox from "../../../components/Checkbox";
import PrimaryInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import { LOGIN_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { UserContext } from "../../../context/UserContext";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";

const Login: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(UserContext);
  const router = useRouter();

  function handleSubmit(values: { email: string; password: string }) {
    makeRequest(
      {
        url: LOGIN_ROUTE,
        method: "POST",
        data: values,
      },
      (res) => {
        ctx?.SetUser(res.data.data);
        router.push("/");
      }
    );
  }

  return (
    <UserWrapper>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
            <div className="p-5 lg:p-6 grow w-full">
              <div className="sm:p-5 lg:px-10 lg:py-8">
                <div className="space-y-6">
                  <PrimaryInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    label="Email"
                  />
                  <PrimaryInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    label="Password"
                  />
                  <div>
                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                    >
                      Sign In
                    </Button>
                    <div className="space-y-2 sm:flex sm:items-center sm:justify-between sm:space-x-2 sm:space-y-0 mt-4">
                      <Checkbox />
                      <a
                        href="/forgot-password"
                        className="inline-block text-blue-600 hover:text-blue-400"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
              Don’t have an account yet?
              <a
                className="font-medium text-blue-600 hover:text-blue-400"
                href="/register"
              >
                Join us today
              </a>
            </div>
          </div>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default Login;
