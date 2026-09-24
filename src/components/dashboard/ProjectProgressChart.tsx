import { useId } from "react";
import { FiActivity, FiArrowUpRight } from "react-icons/fi";
import { useProjectProgressChart } from "../../hooks/dashboard/useProjectProgressChart";
import styles from "../../styles/dashboard/ProjectProgressChart.module.css";

export function ProjectProgressChart() {
  const id = useId();
  const { history, selected, selectedIndex, selectMonth, change, gap } = useProjectProgressChart();
  return <section className={styles.panel} aria-labelledby={`${id}-title`}>
    <header className={styles.heading}>
      <div><p className={styles.eyebrow}><FiActivity aria-hidden="true" /> PROJECT MOMENTUM</p><h2 id={`${id}-title`}>Every month, a clearer picture.</h2><p>Monthly portfolio completion compared with planned progress.</p></div>
      <span className={styles.year}>{history.year}<span>Demo history</span></span>
    </header>
    <div className={styles.layout}>
      <div className={styles.chartArea}>
        <div className={styles.legend}><span><i />Completion</span><span><i />Planned</span><small>Scale: 0–100%</small></div>
        <div className={styles.scroll} tabIndex={0} role="group" aria-label="Monthly progress chart. Select a month for details. Scroll horizontally on smaller screens.">
          <div className={styles.chart}>
            <div className={styles.grid} aria-hidden="true">{[100, 75, 50, 25, 0].map((value) => <div key={value}><span>{value}%</span></div>)}</div>
            <div className={styles.months}>{history.months.map((month, index) => <button key={month.month} type="button" className={styles.month} aria-pressed={selectedIndex === index} aria-label={`${month.month}: ${month.completion === null ? "no recorded completion" : `${month.completion}% completion`}, ${month.planned}% planned`} onClick={() => selectMonth(index)} onFocus={() => selectMonth(index)}>
              <span className={styles.bars} aria-hidden="true"><span className={styles.actual} style={{ height: `${month.completion ?? 0}%` }} /><span className={styles.planned} style={{ height: `${month.planned}%` }} /></span>
              <span className={styles.monthLabel}>{month.month.slice(0, 3)}</span>
            </button>)}</div>
          </div>
        </div>
        <p className={styles.hint}>Select a month to explore its progress. Unrecorded months show the plan only.</p>
      </div>
      <aside className={styles.detail} aria-live="polite" aria-atomic="true">
        <p className={styles.detailLabel}>{selected.month} {history.year}</p>
        <strong className={styles.value}>{selected.completion ?? "—"}{selected.completion !== null && <span>%</span>}</strong>
        <p className={styles.valueLabel}>{selected.completion === null ? "No completion recorded" : "Portfolio completion"}</p>
        {change !== null && <p className={styles.change}><FiArrowUpRight aria-hidden="true" />{change > 0 ? "+" : ""}{change} percentage points <span>from the previous month</span></p>}
        <dl><div><dt>Planned completion</dt><dd>{selected.planned}%</dd></div><div><dt>Against plan</dt><dd>{gap === null ? "Not recorded" : gap === 0 ? "On plan" : `${Math.abs(gap)} pp ${gap > 0 ? "ahead" : "behind"}`}</dd></div></dl>
      </aside>
    </div>
    <footer className={styles.note}><span>ILLUSTRATIVE DATA</span> Sample monthly snapshots, not calculated from your saved projects. Updating a task does not change this demo history.</footer>
  </section>;
}
