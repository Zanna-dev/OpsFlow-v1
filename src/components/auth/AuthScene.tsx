import { FiUsers, FiLayers, FiCheck, FiArrowUpRight } from "react-icons/fi";
import type { AuthSceneProps } from "../../interfaces/authShowcase.interfaces";
import styles from "../../styles/auth/AuthShowcase.module.css";
export function AuthScene({ scene }: AuthSceneProps) {
  return <div className={styles.visual} aria-hidden="true" key={scene}>
    <div className={styles.window}>
      <div className={styles.windowBar}><span className={styles.miniBrand}><FiLayers />opsflow.</span><span className={styles.windowDots}>● ● ●</span></div>
      <div className={styles.mockBody}>
        <div className={styles.mockNav}><FiLayers /><FiUsers /><span /><span /><span /></div>
        <div className={styles.mockContent}>
          <span className={styles.miniEyebrow}>STUDIO WORKSPACE</span><h3>{scene === 0 ? "A little clarity. A lot of possibility." : scene === 1 ? "Great work starts with your people." : "Every step moves you forward."}</h3>
          {scene === 0 ? <><div className={styles.stats}><div><FiUsers /><span>Employees</span><strong>128</strong></div><div><FiLayers /><span>Active projects</span><strong>24</strong></div></div><div className={styles.chart}><div><span>Delivery overview</span><small>This quarter</small></div><div className={styles.bars}>{[34, 51, 43, 70, 62, 84, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div></> : scene === 1 ? <><div className={styles.person}><span>AO</span><div><strong>Amara Okafor</strong><small>Design · Project owner</small></div><FiCheck /></div><div className={styles.connector}><i /><span>Connected through work</span><i /></div><div className={styles.project}><span>WORKSPACE EXPERIENCE</span><h4>One project. A shared direction.</h4><div className={styles.avatars}><span>AO</span><span>DC</span><span>NB</span><small>Owner + team</small></div></div></> : <><div className={styles.timeline}><span>Planning</span><i /><span>Active</span><i /><span><FiCheck />Complete</span></div><div className={styles.project}><span>WORKSPACE EXPERIENCE</span><h4>Make the next milestone count.</h4><div className={styles.progressLabel}><span>Assigned task completion</span><strong>100%</strong></div><div className={styles.track}><i /></div><p>Clarity at every stage.</p></div></>}
        </div>
      </div>
    </div>
    <div className={styles.floating}><span className={styles.floatIcon}>{scene === 0 ? <FiArrowUpRight /> : scene === 1 ? <FiUsers /> : <FiCheck />}</span><div><strong>{scene === 0 ? "Everything in perspective" : scene === 1 ? "The right people, together" : "A milestone worth celebrating"}</strong><span>{scene === 0 ? "People · Projects · Progress" : scene === 1 ? "Clear ownership. Shared purpose." : "From intention to completion."}</span></div></div>
  </div>;
}
