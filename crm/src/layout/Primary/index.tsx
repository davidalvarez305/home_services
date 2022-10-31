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
    <div className="container-center-horizontal">
      <div className="accounts-empty">
        <Sidebar />
        <div className="flex-col">
          <TopNavigation
            screenName={screenName}
            searchIcon={<SearchIcon />}
            handleNavigationSubmit={(values) => console.log(values)}
          />
          <div className="overlap-group1">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PrimaryLayout;
