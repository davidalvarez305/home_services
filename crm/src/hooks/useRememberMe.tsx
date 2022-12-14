import { useCallback, useEffect, useState } from "react";

export default function useRememberMe() {
  const [email, setEmail] = useState<string>();

  const rememberEmail = useCallback((email: string) => {
    if (email.length > 0) {
      window.localStorage.setItem("username", email);
    } else {
      window.localStorage.removeItem("username");
    }
  }, []);

  useEffect(() => {
    const email = window.localStorage.getItem("username");

    if (email) {
      setEmail(email);
    }
  }, []);

  return { email, rememberEmail };
}
