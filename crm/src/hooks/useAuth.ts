import { useCallback, useState } from "react";
import { LOGOUT_ROUTE } from "../constants";
import { User } from "../types/general";
import useFetch from "./useFetch";

export default function useAuth() {
  const { makeRequest } = useFetch();
  let userProps = {
    id: 0,
    username: "",
    password: "",
    email: "",
    profile_picture: "",
    created_at: 0,
    updated_at: 0,
    api_token: "",
    account_status_id: 0,
    company_id: null,
    role_id: null,
  };
  const [user, setUser] = useState(userProps);

  const SetUser = useCallback((user: User) => {
    setUser(user);
  }, []);

  function Logout() {
    makeRequest(
      {
        url: `${LOGOUT_ROUTE}`,
        method: "POST",
      },
      (res) => {
        if (res.data.data === "Logged out!") {
          setUser(userProps);
        }
      }
    );
  }

  return { SetUser, Logout, user };
}
