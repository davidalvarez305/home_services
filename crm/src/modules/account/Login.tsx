import { Form, Formik } from "formik";
import React, { useState } from "react";
import FormInput from "../../components/FormInput";
import useFetch from "../../hooks/useFetch";
import { LEAD_ROUTE } from "../../constants";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import UserWrapper from "../user/auth/UserWrapper";
import Button from "../../components/Button";
import FormWrapper from "../user/auth/FormWrapper";
import { useToast } from "@chakra-ui/react";
import ConfirmCode from "../user/auth/ConfirmCode";

export default function Login() {
  const [enterCode, setEnterCode] = useState(false);
  const { makeRequest, isLoading, error } = useFetch();
  const toast = useToast();
  const buttonClassName =
    "inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700";

  function handleSubmit(values: { email: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login",
        method: "POST",
        data: values,
      },
      (_) => {
        setEnterCode(true);
        toast({
          title: "Success!",
          description: "Enter the code found in your inbox.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  if (enterCode) {
    return <ConfirmCode setEnterCode={setEnterCode} />;
  }

  return (
    <UserWrapper>
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <FormWrapper>
            <FormInput
              label="Enter Your Email"
              type={"email"}
              name="email"
              placeholder="Email..."
            />
            <Button
              className={buttonClassName}
              type={"submit"}
              disabled={isLoading}
            >
              Submit
            </Button>
          </FormWrapper>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
}
