import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import FormWrapper from "./FormWrapper";
import UserWrapper from "./UserWrapper";

export default function ChangePassword() {
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();

  type formValues = { newPassword: string; confirmNewPassword: string };
  function handleSubmit(values: formValues) {
    if (values.newPassword === "" || values.confirmNewPassword === "") {
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      return;
    }

    makeRequest(
      {
        url: USER_ROUTE + "/change-password/" + router.query.code,
        method: "PUT",
        data: {
          newPassword: values.newPassword,
        },
      },
      (_) => {
        router.push("/login");
      }
    );
  }

  return (
    <UserWrapper>
      <Formik
        initialValues={{ newPassword: "", confirmNewPassword: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormWrapper>
            <FormInput
              type="password"
              name="newPassword"
              placeholder="Enter New Password..."
              label={"New Password"}
            />
            <FormInput
              type="password"
              name="confirmNewPassword"
              placeholder="Enter Confirm New Password..."
              label={"Confirm New Password"}
            />
            <Button
              disabled={isLoading}
              className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
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
