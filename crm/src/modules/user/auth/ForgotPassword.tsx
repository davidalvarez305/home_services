import { Form, Formik } from "formik";
import React, { useState } from "react";
import PrimaryInput from "../../../components/FormInput";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";
import { useToast } from "@chakra-ui/react";
import AuthSubFooter from "../../../components/AuthSubFooter";
import FormWrapper from "./FormWrapper";

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
          description:
            "Use the link sent to your inbox within the next 5 minutes.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  return (
    <UserWrapper>
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <FormWrapper>
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
          </FormWrapper>
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default ForgotPassword;
