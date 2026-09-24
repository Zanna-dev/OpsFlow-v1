import { useEffect, useState } from "react";
export function useLoginDesign() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  useEffect(() => { document.title = "Sign in | OpsFlow"; }, []);
  return { passwordVisible, togglePassword: () => setPasswordVisible((value) => !value) };
}
