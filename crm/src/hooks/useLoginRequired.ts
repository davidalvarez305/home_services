import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";

export default function useLoginRequired() {
  const router = useRouter();
  const ctx = useContext(UserContext);
  useEffect(() => {
    if (!ctx?.user.id) {
      router.push("/login");
    }
  }, [ctx?.user, router]);
}