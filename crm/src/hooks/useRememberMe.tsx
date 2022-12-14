import { useFormikContext } from "formik";
import { useCallback, useEffect } from "react";

export default function useRememberMe() {
  const formik = useFormikContext();

  const rememberEmail = useCallback((email: string) => {
    if (email.length > 0) {
      window.localStorage.setItem("email", email);
    } else {
      window.localStorage.removeItem("email");
    }
  }, []);

  useEffect(() => {
    const email = window.localStorage.getItem("email");

    if (email) {
      formik.setFieldValue('email', email);

      var checkbox = document.getElementById('remember_me');

      if (checkbox) {
        checkbox.click();
      }
    }
  }, [formik]);

  return { rememberEmail };
}
