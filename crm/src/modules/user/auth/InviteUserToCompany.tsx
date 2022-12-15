import { useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/FormInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import UserWrapper from "../auth/UserWrapper";
import FormWrapper from "./FormWrapper";

export default function InviteUserToCompany() {
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();
  const className =
    "block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";
  const toast = useToast();

  function handleSubmit(values: {
    username: string;
    email: string;
    password: string;
  }) {
    makeRequest(
      {
        url:
          COMPANY_ROUTE +
          `/${router.query.companyId}/user/invite/${router.query.code}`,
        method: "POST",
        data: values,
      },
      (_) => {
        toast({
          title: "Success!",
          description: "User registration was successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
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
          <FormWrapper>
            <PrimaryInput
              className={className}
              label="Username"
              name="username"
              placeholder="Username..."
            />
            <PrimaryInput
              className={className}
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <PrimaryInput
              className={className}
              label="Password"
              name="password"
              placeholder="Password..."
              type="password"
            />
            <Button
              className={
                "inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
              }
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
