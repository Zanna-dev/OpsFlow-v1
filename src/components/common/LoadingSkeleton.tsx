import type { LoadingSkeletonProps } from "../../interfaces/LoadingSkeleton.interfaces";
import styles from "./LoadingSkeleton.module.css";

export function LoadingSkeleton({ label }: LoadingSkeletonProps) {
  return <div className={styles.skeleton} role="status">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true"><div className={styles.heading} />{[0, 1, 2].map((row) => <div key={row} className={styles.row}><span className={styles.avatar} /><div className={styles.lines}><span /><span /></div><span className={styles.badge} /></div>)}</div>
  </div>;
}
