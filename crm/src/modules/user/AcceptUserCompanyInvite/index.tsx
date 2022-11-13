import { useRouter } from "next/router";
import Button from "../../../components/Button";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { COMPANY_ROUTE, USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import PrimaryLayout from "../../../layout/Primary";
import styles from "./AcceptUserCompanyInvite.module.css";

const AcceptUserCompanyInvite = () => {
  useLoginRequired();
  const router = useRouter();
  const { isLoading, makeRequest, error } = useFetch();

  function handleSubmit(values: { email: string }) {
    if (values.email === "") {
      return;
    }

    makeRequest(
      {
        url: COMPANY_ROUTE + `/${router.query.companyId}/user/invite/${router.query.code}`,
        method: "POST",
        data: values,
      },
      (_) => {}
    );
  }

  return (
    <PrimaryLayout screenName={"Accept Invitation"}>
      <div className={styles["form"]}>
        <div className={styles["message"]}>Do you accept this invitation?</div>
        <Button className={"Dark"} type={"submit"} isLoading={isLoading}>
          Accept
        </Button>
        <RequestErrorMessage {...error} />
      </div>
    </PrimaryLayout>
  );
};

export default AcceptUserCompanyInvite;
