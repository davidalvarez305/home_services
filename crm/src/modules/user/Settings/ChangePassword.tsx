import { useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import FormInput from "../../../components/FormInput";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import UserWrapper from "../UserWrapper/UserWrapper";

export default function ChangePassword() {
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();
  const toast = useToast();

  function handleSubmit(values: { newPassword: string, confirmNewPassword: string }) {

    if (values.newPassword === "" || values.confirmNewPassword === "") {
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {

      toast({
        title: "Error!",
        description: "Passwords don't match.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    makeRequest(
      {
        url: USER_ROUTE + "/change-password/" + router.query.code,
        method: "PUT",
        data: {
          newPassword: values.newPassword
        },
      },
      (res) => {
        if (res.statusText === "OK") {
          router.push("/login");
        }
      }
    );
  }

  return (
    <UserWrapper>
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
        <div className="p-5 lg:p-6 grow w-full">
          <div className="sm:p-5 lg:px-10 lg:py-8">
            <Formik initialValues={{ newPassword: "", confirmNewPassword: "" }} onSubmit={handleSubmit}>
              <Form>
                <form className="space-y-6">
                  <FormInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter New Password..."
                    label={"New Password"}
                  />
                  <FormInput
                    className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    placeholder="Enter Confirm New Password..."
                    label={"Confirm New Password"}
                  />
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                  >
                    Submit
                  </button>
                </form>
              </Form>
            </Formik>
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
    </UserWrapper>
  );
}
