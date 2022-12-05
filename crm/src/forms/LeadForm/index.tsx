import Button from "../../components/Button";
import { Form, useFormikContext } from "formik";
import { useState } from "react";
import PrimaryInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import styles from "./LeadForm.module.css";

interface Props {
  setToggleForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadForm: React.FC<Props> = ({ setToggleForm }) => {
  const [imagesNum, setImagesNum] = useState(0);

  const formik = useFormikContext();

  return (
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
            name={"zip_code"}
            options={[{ value: "33015", label: "33015" }]}
          />
          <FormSelect
            name={"service"}
            options={[{ value: 1, label: "Bathroom Remodeling" }]}
          />
        </div>
      </div>
      <div className={styles["bottom-form-container"]}>
          <PrimaryInput
            label={"Project Budget"}
            name={"budget"}
            type={'number'}
          />
        <div className={styles["image-and-services"]}>
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
                formik.setFieldValue("photos", e.target.files);
              }
            }}
            type="file"
            accept="image/*"
            multiple
          />
        </div>
        {imagesNum > 0 && (
          <div className={styles["images-container"]}>
            {`(${imagesNum}) Selected Images`}
          </div>
        )}
        <div className={styles["buttons-container"]}>
          <Button
            isLoading={formik.isSubmitting}
            type={"submit"}
            className={"Dark"}
          >
            Save
          </Button>
          <Button
            isLoading={formik.isSubmitting}
            onClick={() => setToggleForm(false)}
            type={"button"}
            className={"Light"}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default LeadForm;
