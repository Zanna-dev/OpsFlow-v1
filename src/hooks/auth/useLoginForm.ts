import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError("");
    if (!email.trim() || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid work email.");
      event.currentTarget.querySelector<HTMLInputElement>("#login-email")?.focus();
      return;
    }
    if (!password) {
      setError("Enter your password.");
      event.currentTarget.querySelector<HTMLInputElement>("#login-password")?.focus();
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    try { await signIn({ email, password }); }
    catch { setError("The email or password is incorrect. Try the demo account below."); }
    finally { inFlight.current = false; setSubmitting(false); }
  }
  return { email, setEmail, password, setPassword, error, submitting, submit };
}
