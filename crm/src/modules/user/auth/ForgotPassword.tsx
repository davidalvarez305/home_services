import { Form, Formik } from "formik";
import React, { useState } from "react";
import PrimaryInput from "../../../components/FormInput";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";
import { useToast } from "@chakra-ui/react";

const ForgotPassword: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const toast = useToast();

  function handleSubmit(values: { email: string }) {
    makeRequest(
      {
        url: USER_ROUTE + "/forgot-password",
        method: "POST",
        data: values,
      },
      (_) => {
        toast({
          title: "Sent!",
          description: "Use the link sent to your inbox within the next 5 minutes.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
    );
  }

  return (
    <UserWrapper>
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
            <div className="p-5 lg:p-6 grow w-full">
              <div className="sm:p-5 lg:px-10 lg:py-8">
                <div className="space-y-6">
                  <PrimaryInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    label="Email"
                    name="email"
                    placeholder="Email..."
                    type="email"
                  />
                  <Button
                    className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                    type={"submit"}
                    disabled={isLoading}
                  >
                    Start Recovery
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

export default ForgotPassword;
