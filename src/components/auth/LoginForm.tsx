import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useLoginDesign } from "../../hooks/auth/useLoginDesign";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { GoogleSignIn } from "./GoogleSignIn";
import { DemoAccessNote } from "./DemoAccessNote";
import styles from "../../styles/auth/LoginPage.module.css";
export function LoginForm() {
  const { passwordVisible, togglePassword } = useLoginDesign();
  const { email, setEmail, password, setPassword, error, submitting, submit } =
    useLoginForm();
  return (
    <>
    <GoogleSignIn />
    <form
      className={styles.form}
      aria-label="Sign in"
      aria-busy={submitting}
      noValidate
      onSubmit={submit}
    >
      <label htmlFor="login-email">Email</label>
      <div className={styles.field}>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <div className={styles.passwordLabel}>
        <label htmlFor="login-password">Password</label>
        <button
          type="button"
          disabled
          className={styles.recovery}
          aria-describedby="login-preview-note"
        >
          Forgot password?
        </button>
      </div>
      <div className={styles.field}>
        <input
          id="login-password"
          name="password"
          type={passwordVisible ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={submitting}
          required
        />
        <button
          type="button"
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          aria-pressed={passwordVisible}
          onClick={togglePassword}
        >
          {passwordVisible ? (
            <FiEyeOff aria-hidden="true" />
          ) : (
            <FiEye aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className={styles.loginError}>
          {error}
        </p>
      )}
      <button
        className={styles.submit}
        type="submit"
        disabled={submitting}
        aria-describedby="login-preview-note"
      >
        {submitting ? "Signing in…" : "Sign in"}{" "}
        <FiArrowRight aria-hidden="true" />
      </button>
    </form>
    <DemoAccessNote />
    </>
  );
}
