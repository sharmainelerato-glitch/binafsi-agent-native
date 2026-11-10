import LivingAtmosphere from '../components/binafsi/LivingAtmosphere';
/** Public marketing route; access policies remain managed by official Better Auth. */
export default function BinafsiWelcome() {
 return <><link rel="stylesheet" href="/binafsi/styles.css" />
 <div className="page landing binafsi-cinema"><LivingAtmosphere mode="landing" />
 <div className="binafsi-shade" />
 <nav className="marketing-nav"><div className="brand"><span className="mark">✧</span> BINAFSI</div><div className="navlinks"><a href="#features">Why BINAFSI</a><a href="/binafsi">Open workspace</a></div><a className="small-btn" href="/binafsi-access">Get started ↗</a></nav>
 <section className="hero"><div className="eyebrow">YOUR WORLD, IN MOTION</div><h1>Every decision<br />changes <em>everything.</em></h1><p>See the connections between your commitments. Explore safer choices. Move forward on your terms.</p>
 <div className="hero-actions"><a className="primary" href="/binafsi-access">Explore your world ↗</a><a className="outline" href="#features">Discover how it works</a></div>
 <div className="hero-features" id="features"><div><b>✧ Living Memory</b><small>Useful context you choose to save.</small></div><div><b>◎ Connected Life Map</b><small>See real commitments and schedule overlaps.</small></div><div><b>↗ Decision Twin</b><small>Compare options before approving changes.</small></div></div></section>
 <div className="hero-foot">Life, beautifully connected. <span>Original living visualization · Reduced-motion friendly</span></div></div></>;
}
