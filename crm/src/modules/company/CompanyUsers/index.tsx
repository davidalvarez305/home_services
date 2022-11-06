import React, { useCallback, useEffect, useState } from "react";
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
import { Formik, Form, FieldArray, Field } from "formik";
import SmallTableElement from "../../../components/SmallTableElement";

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

  const AddUsers = useCallback(
    () => (
      <div>
        <h1>Friend List</h1>

        <Formik
          initialValues={{ friends: ["jared", "ian", "brent"] }}
          onSubmit={(values) => console.log(JSON.stringify(values, null, 2))}
          render={({ values }) => (
            <Form>
              <FieldArray
                name="friends"
                render={(arrayHelpers) => (
                  <div>
                    {values.friends && values.friends.length > 0 ? (
                      values.friends.map((friend, index) => (
                        <div key={index}>
                          <SmallTableElement
                            plusButton={() => console.log("plusButton")}
                            minusButton={() => console.log("minusButton")}
                          >
                            <Field name={`friends.${index}`} />
                          </SmallTableElement>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add a friend
                      </button>
                    )}
                    <div>
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        />
      </div>
    ),
    []
  );

  if (users.length === 0) {
    return (
      <PrimaryLayout screenName="Users">
        <div className={styles["main-container"]}>
          <div>
            <SubNavigation elements={["View Users", "Add Users"]} />
            <AddUsers />
          </div>
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
