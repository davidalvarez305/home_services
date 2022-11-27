import styles from "./EmptyLargeBox.module.css";

interface Props {
  children: React.ReactNode;
}

const EmptyLargeBox: React.FC<Props> = ({ children }) => {
  return <div className={styles[`large-box-container`]}>{children}</div>;
};

export default EmptyLargeBox;
