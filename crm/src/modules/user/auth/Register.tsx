import { Form, Formik } from "formik";
import React from "react";
import Checkbox from "../../../components/Checkbox";
import PrimaryInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";

const Register: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const router = useRouter();

  function handleSubmit(values: {
    username: string;
    email: string;
    password: string;
  }) {
    if (
      values.username === "" ||
      values.password === "" ||
      values.email === ""
    ) {
      return;
    }
    makeRequest(
      {
        url: USER_ROUTE + "/register",
        method: "POST",
        data: values,
      },
      (_) => {
        router.push("/login");
      }
    );
  }

  return (
    <UserWrapper>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
            <div className="p-5 lg:p-6 grow w-full">
              <div className="sm:p-5 lg:px-10 lg:py-8">
                <div className="space-y-6">
                  <PrimaryInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    label="Username"
                    name="username"
                    placeholder="Username..."
                  />
                  <PrimaryInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    label="Email"
                    name="email"
                    placeholder="Email..."
                    type="email"
                  />
                  <PrimaryInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    label="Password"
                    name="password"
                    placeholder="Password..."
                    type="password"
                  />
                  <Checkbox />
                  <Button
                    className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                    type={"submit"}
                    disabled={isLoading}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </div>
            <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
              <a
                className="font-medium text-blue-600 hover:text-blue-400"
                href="/login"
              >
                Return to Sign In
              </a>
            </div>
          </div>
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default Register;
