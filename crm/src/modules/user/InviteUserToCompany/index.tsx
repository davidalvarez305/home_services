import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/FormInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import PrimaryLayout from "../../../layout/Primary";
import UserWrapper from "../UserWrapper";
import styles from "./InviteUserToCompany.module.css";

const InviteUserToCompany = () => {
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();

  function handleSubmit(values: {
    username: string;
    email: string;
    password: string;
  }) {
    makeRequest(
      {
        url: USER_ROUTE + "/invite/" + router.query.code,
        method: "POST",
        data: values,
      },
      (res) => {
        if (res.statusText === "OK") {
          console.log("user: ", res.data.data);
        }
      }
    );
  }

  return (
    <UserWrapper
      h1Text="Sign Up"
      h1Subtext="Create your account by entering your details."
      bottomTextOne="Already have an account?"
      bottomLinkText="Login."
      bottomLinkDestination="login"
    >
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={styles["form"]}>
            <PrimaryInput
              label="Username"
              name="username"
              placeholder="Username..."
            />
            <PrimaryInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <PrimaryInput
              label="Password"
              name="password"
              placeholder="Password..."
              type="password"
            />
            <Button className={"Blue"} type={"submit"} isLoading={isLoading}>
              Submit
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default InviteUserToCompany;
