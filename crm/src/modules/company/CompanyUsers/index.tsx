import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { AccountStatus, User } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE, ACCOUNT_STATUS_ROUTE } from "../../../constants";
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
import PrimaryInput from "../../../components/FormInput";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";

const CompanyUsers: React.FC = () => {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [accountStatus, setAccountStatus] = useState<AccountStatus[]>([]);
  const { makeRequest, isLoading, error } = useFetch();
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState("");
  const toast = useToast();

  const fetchAccountStatus = useCallback(() => {
    makeRequest(
      {
        url: ACCOUNT_STATUS_ROUTE,
      },
      (res) => {
        setAccountStatus(res.data.data);
      }
    );
  }, [makeRequest]);

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: COMPANY_ROUTE + `/${ctx?.user.company_id}/user`,
        },
        (res) => {
          console.log(res.data.data);
          setUsers(res.data.data);
        }
      );

      // Fetch account status
      fetchAccountStatus();
    }
  }, [makeRequest, ctx?.user.company_id, fetchAccountStatus]);

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

  function handleUpdateCompanyUsers(values: { users: User[] }) {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/user`,
        method: "PUT",
        data: values.users,
      },
      (res) => {
        setUsers(res.data.data);
        toast({
          title: "Success!",
          description: "Users have been successfully updated.",
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
            {users.length > 0 && (
              <Formik
                initialValues={{ users }}
                onSubmit={handleUpdateCompanyUsers}
              >
                <Form>
                  <FieldArray
                    name="users"
                    render={() => (
                      <Table>
                        <Thead>
                          <Tr>
                            {["Users", "Actions"].map((header) => (
                              <Td key={header}>{header}</Td>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {users.map((user, index) => {
                            return (
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
                                      defaultValue={{
                                        value: user.role_id!,
                                        label: "Employee",
                                      }}
                                      name={`users.${index}.role_id`}
                                    />
                                    <FormSelect
                                      options={accountStatus.map((status) => {
                                        return {
                                          value: status.id,
                                          label: status.status,
                                        };
                                      })}
                                      defaultValue={{
                                        value: user.account_status_id!,
                                        label: capitalizeFirstLetter(
                                          accountStatus.filter(
                                            (status) =>
                                              status.id ===
                                              user.account_status_id
                                          )[0].status
                                        ),
                                      }}
                                      name={`users.${index}.account_status_id`}
                                    />
                                  </Td>
                                </Tr>
                              </React.Fragment>
                            );
                          })}
                        </Tbody>
                      </Table>
                    )}
                  />
                  <div className={styles["save-change-button"]}>
                    <Button
                      className={"Dark"}
                      type="submit"
                      isLoading={isLoading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setEditModal(true);
                      }}
                      className={"Light"}
                      isLoading={isLoading}
                    >
                      Add User
                    </Button>
                  </div>
                </Form>
              </Formik>
            )}
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
