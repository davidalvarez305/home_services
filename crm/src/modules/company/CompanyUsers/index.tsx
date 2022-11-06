import React, { useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { User } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { Heading } from "@chakra-ui/react";
import { USER_ROUTE } from "../../../constants";
import styles from "./CompanyUsers.module.css";
import { useRouter } from "next/router";
import SubNavigationElement from "../../../components/SubNavigationElement";
import SubNavigation from "../../../components/SubNavigation";

const CompanyUsers: React.FC = () => {
  useLoginRequired();
  const [users, setUsers] = useState<User[]>([]);
  const { makeRequest, isLoading, error, cancelToken } = useFetch();
  const [seeAddUsers, setSeeAddUsers] = useState(false);

  useEffect(() => {
    makeRequest(
      {
        url: USER_ROUTE,
      },
      (res) => {
        console.log("fetching");
        console.log([...res.data.data]);
        setUsers([...res.data.data]);
      }
    );
    return () => {
      cancelToken.cancel();
    };
  }, [cancelToken, makeRequest]);

  if (users.length === 0) {
    return (
      <PrimaryLayout screenName="Users">
        <div className={styles["main-container"]}>
          <SubNavigation elements={["View Users", "Add Users"]} />
          <Heading>No users.</Heading>
        </div>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout screenName="Users">
      {users.map((user) => (
        <div key={user.username}>{user.username}</div>
      ))}
    </PrimaryLayout>
  );
};
export default CompanyUsers;
