/** Soft CSS smoke layers; composited transforms keep the hero lightweight. */
export function HeroSmoke(){
 return <div className="hero-smoke" aria-hidden="true">{[0,1,2].map(i=><span key={i} className={`hero-smoke-cloud hero-smoke-cloud-${i}`}/>)}</div>;
}
