import { journey } from '@/content/profile';
import s from './HeroJourney.module.css';

const [ios, macos, web] = journey;

/**
 * The opening scene. Screen readers and no-motion visitors get the final
 * frame: the heading "Now it's the whole stack." and the full-stack scene.
 * The earlier captions and scenes are decorative steps of the animation.
 */
export function HeroJourney() {
  return (
    <section id="top" data-platform="ios" aria-labelledby="hero-title" className={s.hero}>
      <div className={s.stage}>
        <div className={s.caps}>
          <p className={s.cap1} aria-hidden="true">{ios.caption}</p>
          <p className={s.cap2} aria-hidden="true">{macos.caption}</p>
          <h1 id="hero-title" className={s.cap3}>{web.caption}</h1>
        </div>

        <div className={s.rigWrap}>
          <div className={s.rig}>
            <div className={s.glow} aria-hidden="true" />
            <div className={s.device} aria-hidden="true" />
            <div className={s.deck} aria-hidden="true" />
            <div className={s.screen}>
              <div className={`${s.scene} ${s.s1}`} aria-hidden="true">
                <small>{ios.years}</small>
                <strong>{ios.label}</strong>
                <p>{ios.line}</p>
              </div>
              <div className={`${s.scene} ${s.s2}`} aria-hidden="true">
                <small>{macos.years}</small>
                <strong>{macos.label}</strong>
                <p>{macos.line}</p>
              </div>
              <div className={`${s.scene} ${s.s3}`}>
                <small>{web.years}</small>
                <strong>{web.label}</strong>
                <p>{web.line}</p>
              </div>
            </div>
            <span className={s.island} aria-hidden="true" />
            <div className={s.chrome} aria-hidden="true">
              <i />
              <i />
              <i />
              <b>alexfilobok.vercel.app</b>
            </div>
          </div>
        </div>

        <div className={s.hint} aria-hidden="true">
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
