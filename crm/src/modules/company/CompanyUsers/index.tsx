import React, { useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { User } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE } from "../../../constants";
import styles from "./CompanyUsers.module.css";
import SmallTableElement from "../../../components/SmallTableElement";
import Button from "../../../components/Button";
import { Table, Tbody, Td, Thead, Tr, useToast } from "@chakra-ui/react";
import DeleteButton from "../../../components/DeleteIconButton";
import EditModal from "../../../components/EditModal";
import { UserContext } from "../../../context/UserContext";
import FormSelect from "../../../components/FormSelect";
import { FieldArray, Form, Formik } from "formik";
import RequestErrorMessage from "../../../components/RequestErrorMessage";

const CompanyUsers: React.FC = () => {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const { makeRequest, isLoading, error } = useFetch();
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: COMPANY_ROUTE + `/${ctx?.user.company_id}/user`,
        },
        (res) => {
          setUsers(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id]);

  function handleInviteUser(email: string) {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/user/invite`,
        method: "POST",
        data: { email },
      },
      (_) => {
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

  function handleRemoveUserFromCompany(userId: number) {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/user/${userId}`,
        method: "DELETE",
      },
      (res) => {
        setUsers(res.data.data);
        toast({
          title: "Success!",
          description: "User has been removed.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  return (
    <PrimaryLayout screenName="Users">
      <div className={styles["main-container"]}>
        <div>
          <div>
            <Formik
              initialValues={{ users }}
              onSubmit={(values) => console.log(values)}
            >
              <Form>
                <FieldArray
                  name="users"
                  render={(arrayHelpers) => (
                    <Table>
                      <Thead>
                        <Tr>
                          {["Users", "Actions"].map((header) => (
                            <Td key={header}>{header}</Td>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {users.map((user, index) => (
                          <React.Fragment key={user.username}>
                            <Tr sx={{ minW: "100vw" }}>
                              <Td sx={{ w: 200 }}>
                                <SmallTableElement>
                                  <div>{user.username}</div>
                                </SmallTableElement>
                              </Td>
                              <Td
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  minW: 600,
                                  h: 150,
                                }}
                              >
                                <DeleteButton
                                  onClick={() =>
                                    handleRemoveUserFromCompany(user.id)
                                  }
                                  aria-label={"remove"}
                                />
                                <FormSelect
                                  options={[
                                    { label: "Owner", value: 1 },
                                    {
                                      label: "Employee",
                                      value: 2,
                                    },
                                  ]}
                                  name={`users.${index}.role_id`}
                                />
                                <FormSelect
                                  options={[
                                    { label: "Active", value: 1 },
                                    {
                                      label: "Inactive",
                                      value: 2,
                                    },
                                  ]}
                                  name={`users.${index}.account_status_id`}
                                />
                              </Td>
                            </Tr>
                          </React.Fragment>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                />
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
              </Form>
            </Formik>
          </div>
        </div>
        <RequestErrorMessage {...error} />
      </div>
      {editModal && (
        <EditModal
          handleSubmit={(values) => {
            handleInviteUser(values.input);
            setEditModal(false);
          }}
          editModal={editModal}
          setEditModal={setEditModal}
          editingItem={editingItem}
        />
      )}
    </PrimaryLayout>
  );
};
export default CompanyUsers;
