import { FiLayers } from "react-icons/fi";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { safeReturnPath } from "../../utils/safeReturnPath";
import { LoginForm } from "../../components/auth/LoginForm";
import { AuthShowcase } from "../../components/auth/AuthShowcase";
import styles from "../../styles/auth/LoginPage.module.css";
export function LoginPage() {
  const { session } = useAuth();
  const [params] = useSearchParams();
  if (session) return <Navigate to={safeReturnPath(params.get("returnTo"))} replace />;
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
      <section className={styles.formPanel} aria-labelledby="login-heading">
        <a className={styles.brand} href="/login" aria-label="OpsFlow sign in">
          <span>
            <FiLayers aria-hidden="true" />
          </span>
          opsflow<span className={styles.brandDot}>.</span>
        </a>
        <div className={styles.formContent}>
          <p className={styles.eyebrow}>WORKSPACE ACCESS</p>
          <h1 id="login-heading">
            Welcome back<span>.</span>
          </h1>
          {/* <p className={styles.intro}>
            Your people. Your projects.
            <br />A clearer view of the work ahead.
          </p> */}
          <LoginForm />
        </div>
        <footer className={styles.footer}>
          <span>Space for people. Focus for work.</span>
          <span>OPSFLOW</span>
        </footer>
      </section>
      <AuthShowcase />
      </div>
    </main>
  );
}
