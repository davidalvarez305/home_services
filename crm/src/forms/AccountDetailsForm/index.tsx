import Button from "../../components/Button";
import { Form, useFormikContext } from "formik";
import PrimaryInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import styles from "./AccountDetailsForm.module.css";

interface Props {
  setToggleForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountDetailsForm: React.FC<Props> = ({ setToggleForm }) => {
  const formik = useFormikContext();

  return (
    <Form>
      <div className={styles["form-container"]}>
        <div className={styles["column-container"]}>
          <PrimaryInput label={"First Name"} name={"first_name"} />
          <PrimaryInput label={"Last Name"} name={"last_name"} />
          <PrimaryInput label={"Email"} name={"email"} />
        </div>
        <div className={styles["column-container"]}>
          <PrimaryInput label={"Phone Number"} name={"phone_number"} />
        </div>
      </div>
      <div className={styles["bottom-form-container"]}>
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

export default AccountDetailsForm;
