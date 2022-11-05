import { Form, Formik } from "formik";
import { useState } from "react";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import PrimaryLayout from "../../../layout/Primary";
import { CreateCompanyInput } from "../../../types/general";
import styles from "./CreateCompany.module.css";

const CreateCompany = () => {
  useLoginRequired();
  const [msg, setMsg] = useState("");
  const { isLoading, makeRequest, error } = useFetch();

  function handleSubmit(values: CreateCompanyInput) {
    console.log(values);

    /* makeRequest(
      {
        url: USER_ROUTE + "/forgot-password",
        method: "POST",
        data: values,
      },
      (_) => {
        setMsg("Use the link sent to your inbox within the next 5 minutes.");
      }
    ); */
  }

  if (msg.length > 0) {
    return (
      <PrimaryLayout screenName={"Change Password"}>
        <div>{msg}</div>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout screenName={"Change Password"}>
      <Formik
        initialValues={{
          name: "",
          logo: "",
          street_address_line_1: "",
          street_address_line_2: "",
          street_address_line_3: "",
          services: [""],
          locations: [""],
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={styles["form"]}>
            <FormInput
              label="Company Name"
              name="name"
              placeholder="Company, Inc"
            />
            <FormInput
              label="Company Logo"
              name="logo"
              placeholder="Logo URL"
              type="url"
            />
            <FormInput
              label="Street Address Line 1"
              name="street_address_line_1"
              placeholder="Address Line 1..."
            />
            <FormInput
              label="Street Address Line 2"
              name="street_address_line_2"
              placeholder="Address Line 2..."
            />
            <FormInput
              label="Street Address Line 3"
              name="street_address_line_3"
              placeholder="Address Line 3..."
            />
            <FormInput label="Services" name="services" />
            <FormSelect
              name="areas_served"
              options={["home remodeling", "kitchen remodeling"]}
              isMulti={true}
            />
            <Button className={"Dark"} type={"submit"} isLoading={isLoading}>
              Submit
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </PrimaryLayout>
  );
};

export default CreateCompany;
