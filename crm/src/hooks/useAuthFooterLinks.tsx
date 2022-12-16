import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { DJANGO_DOMAIN } from "../constants";

export default function useAuthFooterLinks() {
  const [path, setPath] = useState("");
  const [msg, setMsg] = useState({ top: "", bottom: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const router = useRouter();

  const redirect = useCallback(() => {
    router.push(path);
  }, [path, router]);

  useEffect(() => {
    const currentPage = window.location.href;

    switch (true) {
      case currentPage.includes("account"):
        setPath(DJANGO_DOMAIN);
        setMsg({ top: "Don’t have an account yet?", bottom: "Create one." });
        setShowForgotPassword(false);
        break;
      case currentPage.includes("login"):
        setPath("/register");
        setMsg({ top: "Don’t have an account yet?", bottom: "Create one." });
        break;
      default:
        setPath("/login");
        setMsg({ top: "Have an account?", bottom: "Sign in." });
    }
  }, []);

  return { showForgotPassword, redirect, msg };
}
