import React, { useContext, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";
import LargeBox from "../../../components/LargeBox";
import EmptyLargeBox from "../../../components/EmptyLargeBox";
import styles from "./Dashboard.module.css";
import { IconButton } from "@chakra-ui/react";
import { GoPlus } from "react-icons/go";
import { Form, Formik } from "formik";
import { CreateQuoteInput, Quote } from "../../../types/general";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import RequestErrorMessage from "../../../components/RequestErrorMessage";

const Dashboard: React.FC = () => {
  const [imagesNum, setImagesNum] = useState(0);
  const [addQuote, setAddQuote] = useState(false);
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  useLeadAuth();

  function handleCreateQuote(values: {
    zip_code: string;
    photos: FileList | null;
    services: number;
    street_address_line_1: string;
    street_address_line_2: string;
    street_address_line_3: string;
    city: number;
    state: number;
    country: number;
  }) {
    let formValues: CreateQuoteInput = {
      ...values,
      services: [values.services],
      city_id: values.city,
      state_id: values.state,
      country_id: values.country,
    };

    makeRequest(
      {
        url: `${LEAD_ROUTE}/15/quote`,
        method: "POST",
        data: formValues,
      },
      (res) => {
        const successResponse: Quote = res.data.data;
        if (successResponse.id && values.photos) {
          const fd = new FormData();

          for (let i = 0; i < values.photos.length; i++) {
            fd.append("images", values.photos[i], values.photos[i]?.name);
          }

          makeRequest(
            {
              url: `${LEAD_ROUTE}/15/quote/${successResponse.id}/photo`,
              method: "POST",
              data: fd,
            },
            (res) => {
              console.log(res.data.data);
            }
          );
        }
      }
    );
  }

  if (addQuote) {
    return (
      <PrimaryLayout screenName="Dashboard">
        <Formik
          initialValues={{
            zip_code: "",
            photos: null,
            services: 0,
            street_address_line_1: "",
            street_address_line_2: "",
            street_address_line_3: "",
            city: 0,
            state: 0,
            country: 0,
          }}
          onSubmit={handleCreateQuote}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className={styles["form-container"]}>
                <div className={styles["column-container"]}>
                  <PrimaryInput
                    label={"Street Address Line 1"}
                    name={"street_address_line_1"}
                  />
                  <PrimaryInput
                    label={"Street Address Line 2"}
                    name={"street_address_line_2"}
                  />
                  <PrimaryInput
                    label={"Street Address Line 3"}
                    name={"street_address_line_3"}
                  />
                </div>
                <div className={styles["column-container"]}>
                  <FormSelect
                    name={"city"}
                    options={[{ value: 1, label: "Hialeah" }]}
                  />
                  <FormSelect
                    name={"state"}
                    options={[{ value: 1, label: "Florida" }]}
                  />
                  <FormSelect
                    name={"country"}
                    options={[{ value: 1, label: "United States" }]}
                  />
                  <FormSelect
                    name={"zip_code"}
                    options={[{ value: "33015", label: "33015" }]}
                  />
                </div>
              </div>
              <div className={styles["bottom-form-container"]}>
                <div className={styles["image-and-services"]}>
                  <FormSelect
                    name={"services"}
                    options={[{ value: 1, label: "Bathroom Remodeling" }]}
                  />
                  <Button
                    type={"button"}
                    onClick={() => document.getElementById("image")?.click()}
                    className={"Blue"}
                  >
                    Set Image
                  </Button>
                  <input
                    style={{ display: "none" }}
                    id="image"
                    onChange={(e) => {
                      if (e.target.files) {
                        setImagesNum(e.target.files.length);
                        setFieldValue("photos", e.target.files);
                      }
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                  />
                </div>
                {imagesNum && (
                  <div className={styles["images-container"]}>
                    {`(${imagesNum}) Selected Images`}
                  </div>
                )}
                <div className={styles["buttons-container"]}>
                  <Button
                    isLoading={isLoading}
                    type={"submit"}
                    className={"Dark"}
                  >
                    Create
                  </Button>
                  <Button
                    isLoading={isLoading}
                    onClick={() => setAddQuote(false)}
                    type={"button"}
                    className={"Light"}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <RequestErrorMessage {...error} />
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout screenName="Dashboard">
      <div className={styles["main-container"]}>
        <LargeBox
          bottomLeftHeader={"1234 Street Address Ave"}
          bottomLeftRegularParagraph={"Hialeah"}
          bottomLeftBoldedParagraph={"FL"}
          bottomRightHeader={"Bathroom Remodeling"}
          topLeftHeader={"Budget Amount"}
          topLeftRegularParagraph={"$5000"}
        />
        <EmptyLargeBox>
          <IconButton
            onClick={() => setAddQuote(true)}
            colorScheme={"blue"}
            variant={"ghost"}
            fontSize={"50px"}
            size={"lg"}
            aria-label="add"
            icon={<GoPlus />}
          />
        </EmptyLargeBox>
      </div>
    </PrimaryLayout>
  );
};
export default Dashboard;
