import { useAuthShowcase } from "../../hooks/auth/useAuthShowcase";
import { authScenes } from "../../constants/authScenes";
import { AuthScene } from "./AuthScene";
import styles from "../../styles/auth/AuthShowcase.module.css";

export function AuthShowcase() {
  const { panelRef, ...showcase } = useAuthShowcase();
  return <aside ref={panelRef} className={styles.panel} aria-label="Explore OpsFlow" data-playing={showcase.playing}>
    <div className={styles.topline}><span>BUILT FOR PEOPLE. DESIGNED FOR PROGRESS.</span><span className={styles.edition}>OPSFLOW / 01</span></div>
    <div className={styles.stage} aria-hidden="true">{authScenes.map((scene, index) => <div key={scene.title} className={styles.sceneLayer} data-active={showcase.scene === index}><AuthScene scene={index} /></div>)}</div>
    <div className={styles.captions} aria-live="off">{authScenes.map((scene, index) => <div key={scene.title} className={`${styles.caption} ${styles.sceneLayer}`} data-active={showcase.scene === index} aria-hidden={showcase.scene !== index}><p className={styles.eyebrow}>{scene.eyebrow}</p><h2>{scene.title}</h2><p>{scene.description}</p></div>)}</div>
    <div className={styles.sequence} aria-hidden="true">{authScenes.map((scene, index) => <span key={scene.title} data-active={showcase.scene === index} />)}</div>
    <p className={styles.illustrative}>Illustrative product preview · sample figures</p>
  </aside>;
}
