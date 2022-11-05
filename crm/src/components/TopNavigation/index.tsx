import { Form, Formik, FormikHelpers } from "formik";
import PrimaryInput from "../PrimaryInput";
import IconButton from "../IconButton";
import styles from "./TopNavigation.module.css";
import { NotificationBell } from "../../assets/NotificationBell";
import { useCallback, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { BUCKET_URL } from "../../constants";
import { SearchIcon } from "../../assets/SearchIcon";

interface Props {
  screenName: string;
}

const TopNavigation: React.FC<Props> = ({ screenName }) => {
  const handleNavigationSubmit = useCallback((values: { search: string }) => {
    console.log("topNav: ", values);
  }, []);

  const ctx = useContext(UserContext);
  const USER_IMAGE = `${BUCKET_URL}/profile-pictures/${ctx?.user.profile_picture}`;

  const NavigationInputField = useCallback(() => {
    return (
      <Formik initialValues={{ search: "" }} onSubmit={handleNavigationSubmit}>
        <Form>
          <div className={styles["search-icon"]}>
            <SearchIcon />
          </div>
          <PrimaryInput
            label={""}
            name={"search"}
            className={styles["type-to-search" + " x12px--medium"]}
          />
        </Form>
      </Formik>
    );
  }, [handleNavigationSubmit]);

  return (
    <div className={styles["top-navigation"]}>
      <div className={styles["overlap-group"]}>
        <div className={styles["navigation-header" + " heading--h6"]}>
          {screenName}
        </div>
        <div className={styles["search"]}>
          <NavigationInputField />
        </div>
        <IconButton>
          <NotificationBell />
        </IconButton>
        <div
          className={styles["top-navigation-image"]}
          style={{ backgroundImage: `url(${USER_IMAGE})` }}
        ></div>
      </div>
    </div>
  );
};

export default TopNavigation;
