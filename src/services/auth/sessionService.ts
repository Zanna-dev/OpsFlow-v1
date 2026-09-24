import type { DemoSession, SignInInput } from "../../interfaces/session.interfaces";

// Disposable demo credentials only. Replace this adapter with server authentication.
let session: DemoSession | null = null;
const listeners = new Set<() => void>();
export function getSession() { return session; }
export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export async function signIn(input: SignInInput) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 400));
  if (input.email.trim().toLowerCase() !== "admin@opsflow.demo" || input.password !== "OpsFlowDemo!23") {
    throw new Error("The email or password is incorrect.");
  }
  session = { name: "Demo administrator", email: "admin@opsflow.demo" };
  listeners.forEach((listener) => listener());
}
export function signOut() {
  session = null;
  listeners.forEach((listener) => listener());
}
