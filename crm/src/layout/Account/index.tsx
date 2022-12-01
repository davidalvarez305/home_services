import TopNavigation from "../../components/TopNavigation";
import Footer from "../../components/Footer";
import styles from "./Account.module.css";
import AccountSidebar from "../../components/AccountSidebar";

interface Props {
  children: React.ReactNode;
  screenName: string;
}

const Account: React.FC<Props> = ({ children, screenName }) => {
  return (
    <div className={"container-center-horizontal"}>
      <div className={styles["accounts-empty"]}>
        <AccountSidebar />
        <div className={styles["flex-col"]}>
          <TopNavigation screenName={screenName} />
          <div className={styles["overlap-group"]}>{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Account;
