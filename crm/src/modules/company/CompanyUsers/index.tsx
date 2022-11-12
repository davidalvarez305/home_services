import React, { useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { UsersByCompany } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE, USER_ROUTE } from "../../../constants";
import styles from "./CompanyUsers.module.css";
import SmallTableElement from "../../../components/SmallTableElement";
import Button from "../../../components/Button";
import { Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import DeleteButton from "../../../components/DeleteIconButton";
import EditModal from "../../../components/EditModal";
import { UserContext } from "../../../context/UserContext";

const CompanyUsers: React.FC = () => {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const [users, setUsers] = useState<UsersByCompany[]>([]);
  const { makeRequest, isLoading } = useFetch();
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState("");
  const toast = useToast();

  useEffect(() => {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/user`,
      },
      (res) => {
        setUsers(res.data.data);
      }
    );
  }, [makeRequest, ctx?.user.company_id]);

  function handleSubmit(email: string) {
    makeRequest(
      {
        url: USER_ROUTE + "/invite",
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
        url: USER_ROUTE + `/company/${ctx?.user.company_id}/?userId=${userId}`,
        method: "DELETE",
      },
      (_) => {
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
            <Table>
              <Thead>
                <Tr>
                  {["Users", "Actions"].map((header) => (
                    <Td key={header}>{header}</Td>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <React.Fragment key={user.username}>
                    <Tr>
                      <Td>
                        <SmallTableElement>
                          <div>{user.username}</div>
                        </SmallTableElement>
                      </Td>
                      <Td>
                        <DeleteButton
                          minusButton={() =>
                            handleRemoveUserFromCompany(user.user_id)
                          }
                          aria-label={"remove"}
                        />
                      </Td>
                    </Tr>
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
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
};
export default CompanyUsers;
