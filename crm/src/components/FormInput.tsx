import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

const PrimaryInput: React.FC<Props> = ({ label, name, size: _, ...props }) => {
  const [field, meta] = useField(name);

  const styles = {
    formsPrimarySelect: {
      alignItems: "flex-start",
      border: "0px none",
      display: "flex",
      minHeight: "92px",
      width: "437px",
      margin: "5px",
    },
    fieldTitle: {
      fontWeight: 700,
      lineHeight: "18px",
      marginTop: "-2px",
      minHeight: "18px",
    },
    overlapGroup: {
      alignItems: "flex-start",
      border: "1px solid",
      borderRadius: "8px",
      display: "flex",
      height: "64px",
      marginTop: "12px",
      minWidth: "437px",
      padding: "20px 19px",
      borderColor: "#CFDBD5B2",
    },
  };

  return (
    <div style={{ ...styles.formsPrimarySelect, flexDirection: "column" }}>
      <div className="x12px--bold" style={{ ...styles.fieldTitle }}>
        {label}
      </div>
      <input
        {...props}
        {...field}
        style={{ ...styles.overlapGroup, fontSize: 18 }}
      />
    </div>
  );
};

export default PrimaryInput;
