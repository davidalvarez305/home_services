import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./SubNavigationElement.module.css";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label: string;
};

const SubNavigationElement: React.FC<Props> = ({ label, ...props }) => {
  return (
    <div className={styles["bar-element-container"]}>
      <div className={styles["link"]}>
        <button {...props} className={styles["label"]}>
          {label}
        </button>
      </div>
    </div>
  );
};

export default SubNavigationElement;
