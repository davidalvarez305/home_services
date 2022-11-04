import axios from "axios";
import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { USER_ROUTE } from "../constants";
import { UserContext } from "../context/UserContext";

export default function useLoginRequired() {
  const router = useRouter();
  const ctx = useContext(UserContext);

  const fetchData = useCallback(() => {
    axios
      .get(USER_ROUTE, {
        withCredentials: true,
      })
      .then((res) => {
        ctx?.SetUser(res.data.data);
      })
      .catch((_) => {
        router.push("/login");
      });
  }, [ctx, router]);

  useEffect(() => {
    if (!ctx?.user.api_token || !ctx?.user.email) {
      fetchData();
    }
  }, [fetchData, ctx?.user]);
}
