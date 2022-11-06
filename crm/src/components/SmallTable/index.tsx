import styles from "./SmallTable.module.css";

interface Props {
  children: React.ReactNode;
}

const SmallTable: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles["items"]}>
      <div className={styles["list"]}>
        <div className={styles["address"]}>Add or Remove Users</div>
        {children}
      </div>
    </div>
  );
};

export default SmallTable;
