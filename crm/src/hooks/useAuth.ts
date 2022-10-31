import { useEffect, useState } from "react";
import { LOGOUT_ROUTE, USER_ROUTE } from "../constants";
import { User } from "../types/general";
import useFetch from "./useFetch";

export default function useAuth() {
  const { makeRequest } = useFetch();
  let userProps = {
    id: 0,
    username: "",
    password: "",
    email: "",
    profile_image: "",
    created_at: "",
  };
  const [user, setUser] = useState(userProps);

  function Login(user: User) {
    setUser(user);
  }

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

  useEffect(() => {
    makeRequest(
      {
        url: `${USER_ROUTE}`,
        method: "GET",
      },
      (res) => {
        if (res.data.data.user) {
          setUser(res.data.data.user);
        }
      }
    );
  }, [makeRequest]);

  return { Login, Logout, user };
}
