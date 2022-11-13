import { useRouter } from "next/router";
import { useContext } from "react";
import Button from "../../../components/Button";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import PrimaryLayout from "../../../layout/Primary";
import styles from "./AcceptUserCompanyInvite.module.css";

const AcceptUserCompanyInvite = () => {
  useLoginRequired();
  const router = useRouter();
  const { isLoading, makeRequest, error } = useFetch();
  const ctx = useContext(UserContext);

  function handleSubmit() {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${router.query.companyId}/user/invite/${router.query.code}`,
        method: "PUT",
      },
      (res) => {
        ctx?.SetUser(res.data.data);
      }
    );
  }

  return (
    <PrimaryLayout screenName={"Accept Invitation"}>
      <div className={styles["form"]}>
        <div className={styles["message"]}>Do you accept this invitation?</div>
        <Button className={"Dark"} onClick={() => handleSubmit()} isLoading={isLoading}>
          Accept
        </Button>
        <RequestErrorMessage {...error} />
      </div>
    </PrimaryLayout>
  );
};

export default AcceptUserCompanyInvite;
