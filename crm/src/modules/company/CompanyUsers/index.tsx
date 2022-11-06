import React, { useCallback, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { User } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import styles from "./CompanyUsers.module.css";
import SubNavigation from "../../../components/SubNavigation";
import { Formik, Form, FieldArray, Field } from "formik";
import SmallTableElement from "../../../components/SmallTableElement";
import Button from "../../../components/Button";
import SmallTable from "../../../components/SmallTable";

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
                  <SmallTable>
                    {values.friends && values.friends.length > 0 ? (
                      values.friends.map((friend, index) => (
                        <div key={index}>
                          <SmallTableElement
                            minusButton={() => arrayHelpers.remove(index)}
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
                      <Button className={"Dark"} type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </SmallTable>
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
