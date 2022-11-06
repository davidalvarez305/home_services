import React, { useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { User } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { Heading } from "@chakra-ui/react";
import { USER_ROUTE } from "../../../constants";

const CompanyUsers: React.FC = () => {
  useLoginRequired();
  const [users, setUsers] = useState<User[]>([]);
  const { makeRequest, isLoading, error, cancelToken } = useFetch();

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
        <Heading>No users.</Heading>
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
