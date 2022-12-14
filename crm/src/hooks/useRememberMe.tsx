import { useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";

export default function useRememberMe() {
  const [email, setEmail] = useState<string>();
  const { setFieldValue } = useFormikContext();

  const rememberEmail = useCallback((email: string) => {
    if (email.length > 0) {
      window.localStorage.setItem("email", email);
    } else {
      window.localStorage.removeItem("email");
    }
  }, []);

  useEffect(() => {
    if (!document.readyState) return;

    const storageEmail = window.localStorage.getItem("email");

    if (storageEmail) {
      setEmail(storageEmail);
      setFieldValue('email', storageEmail);

      var checkbox = document.getElementById('remember_me') as any;

      if (checkbox) {
        checkbox.checked = true;
      }
    }
  }, [setFieldValue]);

  return { email, rememberEmail };
}
