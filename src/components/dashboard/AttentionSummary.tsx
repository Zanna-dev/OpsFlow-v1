import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import type { DashboardPanelProps } from "../../interfaces/dashboard.interfaces";
import { attentionDescriptions, attentionLabels } from "../../constants/projectAttentionLabels";
import styles from "../../styles/dashboard/AttentionSummary.module.css";

export function AttentionSummary({ data }: DashboardPanelProps) {
  return <section className={styles.section} aria-labelledby="attention-heading">
    <header><div><p className={styles.eyebrow}>YOUR NEXT MOVE</p><h2 id="attention-heading">Where to focus</h2></div><p>Open projects only. A project may appear in more than one group.</p></header>
    <div className={styles.grid}>{data.attention.map(({ category, count }) => <Link key={category} to={`/projects?attention=${category}`} className={styles.card} data-attention={category} data-empty={count === 0}>
      <div className={styles.top}><span>{attentionLabels[category]}</span><FiArrowUpRight aria-hidden="true" /></div>
      <strong>{count}<small>{count === 1 ? "project" : "projects"}</small></strong>
      <p>{attentionDescriptions[category]}</p>
      <span className={styles.action}>{count ? "Review projects" : "No matching projects"}<span aria-hidden="true"> →</span></span>
    </Link>)}</div>
  </section>;
}

