import Sidebar from "../../components/Sidebar";
import TopNavigation from "../../components/TopNavigation";
import Footer from "../../components/Footer";
import styles from "./PrimaryLayout.module.css";
import { SearchIcon } from "../../assets/SearchIcon";

interface Props {
  children: React.ReactNode;
  screenName: string;
}

const PrimaryLayout: React.FC<Props> = ({ children, screenName }) => {
  return (
    <div className={"container-center-horizontal"}>
      <div className={styles["accounts-empty"]}>
        <Sidebar />
        <div className={styles["flex-col"]}>
          <TopNavigation screenName={screenName} />
          <div className={styles["overlap-group"]}>{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PrimaryLayout;
