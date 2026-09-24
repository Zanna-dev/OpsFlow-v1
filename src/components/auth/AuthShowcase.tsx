import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { useAuthShowcase } from "../../hooks/auth/useAuthShowcase";
import { authScenes } from "../../constants/authScenes";
import { AuthScene } from "./AuthScene";
import styles from "../../styles/auth/AuthShowcase.module.css";
export function AuthShowcase() {
  const { panelRef, ...showcase } = useAuthShowcase();
  const scene = authScenes[showcase.scene];
  return <aside ref={panelRef} className={styles.panel} aria-label="Explore OpsFlow" aria-roledescription="carousel" data-playing={showcase.playing} onFocusCapture={(event) => { if (!(event.target instanceof Element && event.target.closest("[data-play-control]"))) showcase.pause(); }}>
    <div className={styles.topline}><span>BUILT FOR PEOPLE. DESIGNED FOR PROGRESS.</span><span className={styles.edition}>OPSFLOW / 01</span></div>
    <div className={styles.stage}><AuthScene scene={showcase.scene} /></div>
    <div className={styles.caption} aria-live="off"><p className={styles.eyebrow}>{scene.eyebrow}</p><h2>{scene.title}</h2><p>{scene.description}</p></div>
    <div className={styles.controls}><div className={styles.dots} role="group" aria-label="Choose a product scene">{authScenes.map((item, index) => <button type="button" key={item.title} aria-label={`Scene ${index + 1}: ${item.title}`} aria-pressed={showcase.scene === index} onClick={() => showcase.select(index)}><span /></button>)}</div><div className={styles.transport}><button type="button" onClick={() => showcase.select(showcase.scene - 1)} aria-label="Previous scene"><FiChevronLeft /></button><button data-play-control type="button" onClick={showcase.toggle} disabled={showcase.reducedMotion} aria-label={showcase.reducedMotion ? "Autoplay disabled by reduced-motion preference" : showcase.playing ? "Pause showcase" : "Play showcase"}>{showcase.playing ? <FiPause /> : <FiPlay />}</button><button type="button" onClick={() => showcase.select(showcase.scene + 1)} aria-label="Next scene"><FiChevronRight /></button></div></div>
    <p className={styles.illustrative}>Illustrative product preview · sample figures</p>
  </aside>;
}

