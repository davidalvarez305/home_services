import { useToast } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import React, { useCallback, useContext, useEffect, useState } from "react";
import UserProfileIcon from "../../assets/UserProfileIcon";
import DeleteButton from "../../components/DeleteIconButton";
import LargeFormSection from "../../components/LargeFormSection";
import {
  ACCOUNT_STATUS_ROUTE,
  COMPANY_ROUTE,
  ROLE_ROUTE,
} from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { User, Role, AccountStatus } from "../../types/general";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { v4 as uuidv4 } from "uuid";
import CustomSelect from "../../components/CustomSelect";
import Button from "../../components/Button";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import CustomModal from "../../components/ImageSliderModal";

export default function CompanyUsers() {
  const ctx = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [accountStatus, setAccountStatus] = useState<AccountStatus[]>([]);
  const { makeRequest, isLoading, error } = useFetch();
  const toast = useToast();
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteUserEmail, setInviteUserEmail] = useState("");

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

  const fetchRoles = useCallback(() => {
    makeRequest(
      {
        url: ROLE_ROUTE,
      },
      (res) => {
        setRoles(res.data.data);
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

      // Fetch roles
      fetchRoles();
    }
  }, [makeRequest, ctx?.user.company_id, fetchAccountStatus, fetchRoles]);

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
    <div className="md:flex md:space-x-5">
      <LargeFormSection
        icon={<UserProfileIcon />}
        iconHeader={"Users"}
        paragraphText={"Update users associated with your company."}
      />
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
        <div className="p-5 lg:p-6 grow w-full">
          <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
            <Formik
              initialValues={{ users }}
              onSubmit={handleUpdateCompanyUsers}
            >
              <Form>
                <FieldArray
                  name="users"
                  render={() => (
                    <table className="min-w-full text-sm align-middle whitespace-nowrap">
                      <thead>
                        <tr>
                          {["User", "Action", "Delete"].map((header) => (
                            <th
                              key={header}
                              className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
                            >
                              <div className="flex justify-center items-center gap-1">
                                {header}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <React.Fragment key={user.username}>
                            <tr
                              className={
                                index % 2 !== 0 ? "flex flex-row w-full justify-center items-center bg-gray-50" : "flex flex-row w-full justify-center items-center bg-red-50"
                              }
                              key={uuidv4()}
                            >
                              <td className="p-3">
                                <div>{`${user.first_name} ${user.last_name}`}</div>
                              </td>
                              <td className="flex gap-4 p-3">
                                <CustomSelect
                                  name={`users.${index}.role_id`}
                                  label={"Role"}
                                >
                                  <option value=""></option>
                                  {roles.map(({ id, role }) => (
                                    <option key={id} value={id}>
                                      {capitalizeFirstLetter(role)}
                                    </option>
                                  ))}
                                </CustomSelect>
                                <CustomSelect
                                  name={`users.${index}.account_status_id`}
                                  label={"Account Status"}
                                >
                                  <option value=""></option>
                                  {accountStatus.map(({ id, status }) => (
                                    <option key={id} value={id}>
                                      {capitalizeFirstLetter(status)}
                                    </option>
                                  ))}
                                </CustomSelect>
                              </td>
                              <td className="p-3">
                                <DeleteButton
                                  onClick={() =>
                                    handleRemoveUserFromCompany(user.id)
                                  }
                                  aria-label={"remove"}
                                />
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                />
                <div className="flex flex-row justify-center items-center gap-4 my-6">
                  <Button disabled={isLoading} type={"submit"}>
                    Save
                  </Button>
                  <Button
                    onClick={() => setInviteModal(true)}
                    disabled={isLoading}
                  >
                    Add
                  </Button>
                </div>
                <RequestErrorMessage {...error} />
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      {inviteModal && (
        <CustomModal isOpen={inviteModal} setIsOpen={setInviteModal}>
          <div className="flex flex-col justify-center items-center gap-4">
            <input
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              type="email"
              id="invite-user-email"
              name="invite-user-email"
              placeholder="Add user email..."
              onChange={(e) => setInviteUserEmail(e.target.value)}
            />
            <Button onClick={() => handleInviteUser(inviteUserEmail)} disabled={isLoading}>
              Send
            </Button>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
