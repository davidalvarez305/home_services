import { Form, Formik } from "formik";
import { useContext } from "react";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import PrimaryLayout from "../../../layout/Primary";
import { Company, CreateCompanyInput } from "../../../types/general";
import styles from "./CreateCompany.module.css";

const CreateCompany = () => {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();

  function handleSubmit(values: CreateCompanyInput) {
    if (
      values.name === "" ||
      values.street_address_line_1 == "" ||
      values.city === 0 ||
      values.state === 0 ||
      values.zip_code === 0
    ) {
      return;
    }

    makeRequest(
      {
        url: COMPANY_ROUTE,
        method: "POST",
        data: values,
      },
      (res) => {
        const company: Company = res.data.data;
        ctx?.SetUser({ ...ctx.user, company_id: company.id });
      }
    );
  }

  return (
    <PrimaryLayout screenName={"Create Company"}>
      <Formik
        initialValues={{
          name: "",
          logo: "",
          street_address_line_1: "",
          street_address_line_2: "",
          street_address_line_3: "",
          city: 0,
          state: 0,
          zip_code: 0,
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
            </div>
            <div className={styles["form"]}>
              <FormSelect
                name="zip_code"
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
            </div>
          </div>
          <div className={styles["button-container"]}>
            <RequestErrorMessage {...error} />
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
