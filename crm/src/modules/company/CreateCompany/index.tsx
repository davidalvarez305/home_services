import { Form, Formik } from "formik";
import { useState } from "react";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import MultiFormSelect from "../../../components/MultiFormSelect";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
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
          city: "",
          state: "",
          services: [""],
          zip_codes: [""],
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={styles["form-container"]}>
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
              <RequestErrorMessage {...error} />
            </div>
            <div className={styles["form"]}>
              <MultiFormSelect
                name="services"
                options={[
                  { label: "home remodeling", value: 1 },
                  { label: "kitchen remodeling", value: 2 },
                ]}
              />
              <MultiFormSelect
                name="zip_codes"
                options={[
                  { label: "33015", value: 1 },
                  { label: "33012", value: 2 },
                ]}
              />
              <FormSelect
                name="city"
                options={[
                  { label: "miami", value: 1 },
                  { label: "hialeah", value: 2 },
                ]}
              />
              <FormSelect
                name="state"
                options={[
                  { label: "florida", value: 1 },
                  { label: "georgia", value: 2 },
                ]}
              />
              <RequestErrorMessage {...error} />
            </div>
          </div>
          <div className={styles["button-container"]}>
            <Button className={"Dark"} type={"submit"} isLoading={isLoading}>
              Submit
            </Button>
          </div>
        </Form>
      </Formik>
    </PrimaryLayout>
  );
};

export default CreateCompany;
