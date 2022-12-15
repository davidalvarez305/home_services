import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function useAuthFooterLinks() {
  const [path, setPath] = useState("");
  const [msg, setMsg] = useState({ top: "", bottom: "" });
  const router = useRouter();

  const redirect = useCallback(() => {
    router.push(path);
  }, [path, router]);

  useEffect(() => {
    const currentPage = window.location.href;

    switch (true) {
      case currentPage.includes("login"):
        setPath("/register");
        setMsg({ top: "Don’t have an account yet?", bottom: "Create one." });
        break;
      default:
        setPath("/login");
        setMsg({ top: "Have an account?", bottom: "Sign in." });
    }
  }, []);

  return { redirect, msg };
}
