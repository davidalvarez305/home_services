import React, { useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { User } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import styles from "./CompanyUsers.module.css";
import { Formik, Form, Field } from "formik";
import SmallTableElement from "../../../components/SmallTableElement";
import Button from "../../../components/Button";
import { Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import DeleteButton from "../../../components/DeleteIconButton";
import EditModal from "../../../components/EditModal";

const CompanyUsers: React.FC = () => {
  useLoginRequired();
  const [users, setUsers] = useState<User[]>([]);
  const { makeRequest, isLoading, error, cancelToken } = useFetch();
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState("");
  const toast = useToast();

  useEffect(() => {
    makeRequest(
      {
        url: USER_ROUTE,
      },
      (res) => {
        setUsers((prev) => [...prev, res.data.data]);
      }
    );
    return () => {
      cancelToken.cancel();
    };
  }, [cancelToken, makeRequest]);

  function handleSubmit(email: string) {
    makeRequest(
      {
        url: USER_ROUTE + "/invite",
        method: "POST",
        data: { email },
      },
      (res) => {
        toast({
          title: "Success!",
          description: "User has been invited.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  if (users.length === 0) {
    return (
      <PrimaryLayout screenName="Users">
        <div className={styles["main-container"]}>
          <div>
            <div>
              <Formik
                initialValues={{ users }}
                onSubmit={(values) =>
                  console.log(JSON.stringify(values, null, 2))
                }
              >
                <Form>
                  <Table>
                    <Thead>
                      {["Friends", "Actions"].map((header) => (
                        <Th key={header}>{header}</Th>
                      ))}
                    </Thead>
                    <Tbody>
                      {users.map((user, index) => (
                        <Tr key={user.id}>
                          <Td>
                            <SmallTableElement>
                              <Field name={`friends.${index}`} />
                            </SmallTableElement>
                          </Td>
                          <Td>
                            <DeleteButton
                              minusButton={() => console.log("removed ")}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Form>
              </Formik>
            </div>
          </div>
          <div className={styles["save-change-button"]}>
            <Button className={"Dark"} type="submit">
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setEditModal(true);
              }}
              className={"Light"}
            >
              Add User
            </Button>
          </div>
        </div>
        {editModal && (
          <EditModal
            handleSubmit={(values) => {
              handleSubmit(values.input);
              setEditModal(false);
            }}
            editModal={editModal}
            setEditModal={setEditModal}
            editingItem={editingItem}
          />
        )}
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
