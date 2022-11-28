import React, { useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";
import LargeBox from "../../../components/LargeBox";
import EmptyLargeBox from "../../../components/EmptyLargeBox";
import styles from "./Dashboard.module.css";
import { IconButton } from "@chakra-ui/react";
import { GoPlus } from "react-icons/go";
import { Form, Formik, useFormik } from "formik";
import { CreateQuoteInput } from "../../../types/general";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
const Dashboard: React.FC = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [addQuote, setAddQuote] = useState(false);
  useLeadAuth();

  function handleCreateQuote(values: CreateQuoteInput) {
    console.log(values);
  }

  if (addQuote) {
    return (
      <PrimaryLayout screenName="Dashboard">
        <Formik
          initialValues={{
            zip_code: "",
            photos: [],
            photo_descriptions: [],
            services: [],
            street_address_line_1: "",
            street_address_line_2: "",
            street_address_line_3: "",
            city_id: 0,
            state_id: 0,
            country_id: 0,
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
                    options={[{ value: 1, label: "33015" }]}
                  />
                </div>
              </div>
              <div className={styles["bottom-form-container"]}>
                <div className={styles["image-and-services"]}>
                  <FormSelect
                    name={"zip_code"}
                    options={[{ value: 1, label: "33015" }]}
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
                      setImages(e.target.files);
                      setFieldValue("photos", e.target.files);
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                  />
                </div>
                {images && (
                  <div className={styles["images-container"]}>
                  {`(${images.length}) Selected Images`}
                  </div>
                )}
                <div className={styles["buttons-container"]}>
                  <Button type={"submit"} className={"Dark"}>
                    Create
                  </Button>
                  <Button
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
