import { useToast } from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import React, { useCallback, useContext, useEffect, useState } from "react";
import UserProfileIcon from "../../assets/UserProfileIcon";
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
import CustomModal from "../../components/Modal";
import TrashIcon from "../../assets/TrashIcon";

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
                          {["User", "Role", "Status", "Delete"].map(
                            (header) => (
                              <th
                                key={header}
                                className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
                              >
                                <div className="flex justify-center items-center gap-1">
                                  {header}
                                </div>
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <React.Fragment key={user.username}>
                            <tr
                              className={
                                index % 2 !== 0 ? "bg-gray-50" : undefined
                              }
                              key={uuidv4()}
                            >
                              <td className="p-3 text-center">
                                {`${user.first_name} ${user.last_name}`}
                              </td>
                              <td className="p-3">
                                <CustomSelect name={`users.${index}.role_id`}>
                                  <option value=""></option>
                                  {roles.map(({ id, role }) => (
                                    <option key={id} value={id}>
                                      {capitalizeFirstLetter(role)}
                                    </option>
                                  ))}
                                </CustomSelect>
                              </td>
                              <td>
                                <CustomSelect
                                  name={`users.${index}.account_status_id`}
                                >
                                  <option value=""></option>
                                  {accountStatus.map(({ id, status }) => (
                                    <option key={id} value={id}>
                                      {capitalizeFirstLetter(status)}
                                    </option>
                                  ))}
                                </CustomSelect>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() =>
                                    handleRemoveUserFromCompany(user.id)
                                  }
                                  type="button"
                                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-2 py-1 leading-5 text-sm rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
                                >
                                  <TrashIcon />
                                  <span>Delete</span>
                                </button>
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
                    type={'button'}
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
        <CustomModal modalTitle={'Invite User'} isOpen={inviteModal} setIsOpen={setInviteModal}>
          <div className="flex flex-col justify-center items-center gap-4">
            <input
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              type="email"
              id="invite-user-email"
              name="invite-user-email"
              placeholder="Add user email..."
              onChange={(e) => setInviteUserEmail(e.target.value)}
            />
            <Button
              onClick={() => handleInviteUser(inviteUserEmail)}
              disabled={isLoading}
            >
              Send
            </Button>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
