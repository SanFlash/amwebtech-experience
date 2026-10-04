"use client";

import { useEffect, useRef } from "react";
import {
  ArrowDown, ArrowRight, Bot, CheckCircle2, Code2, Gauge, Globe2, Layers3,
  Menu, Play, ShieldCheck, Smartphone, Sparkles, X, Zap
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { icon: Code2, tag: "01", title: "Test Automation", text: "Scalable web, mobile, API and regression automation built for faster release cycles.", chips: ["Selenium", "Playwright", "Appium"] },
  { icon: Bot, tag: "02", title: "AI & LLM Testing", text: "Evaluate AI products for accuracy, safety, hallucinations, prompts, RAG and agent reliability.", chips: ["LLM", "RAG", "Agents"] },
  { icon: Gauge, tag: "03", title: "Performance", text: "Find bottlenecks before your users do with measurable load, stress and resilience testing.", chips: ["JMeter", "Load", "Scale"] },
  { icon: ShieldCheck, tag: "04", title: "Security Testing", text: "Build confidence with practical application security testing integrated into delivery.", chips: ["Web", "API", "CI/CD"] },
  { icon: Smartphone, tag: "05", title: "Mobile Testing", text: "Real-device and cross-platform testing across modern iOS and Android experiences.", chips: ["iOS", "Android", "Appium"] },
  { icon: Layers3, tag: "06", title: "Managed QA", text: "Extend your team with dedicated QA engineers, automation teams and QA leadership.", chips: ["Dedicated", "Agile", "Consulting"] }
];

const stats = [
  ["15+", "Years of QA experience"],
  ["3,400+", "Projects delivered"],
  ["450+", "Clients supported"],
  ["24/7", "Global QA support"]
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = [useState(false), () => {}] as any;

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const ctx = gsap.context(() => {
      gsap.from(".hero-kicker", { y: 24, opacity: 0, duration: 0.8, delay: 0.15 });
      gsap.from(".hero-title span", { y: 90, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 });
      gsap.from(".hero-copy", { y: 25, opacity: 0, duration: 0.8, delay: 0.65 });
      gsap.from(".hero-actions", { y: 25, opacity: 0, duration: 0.8, delay: 0.8 });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 84%" }});
      });
      gsap.utils.toArray<HTMLElement>(".parallax").forEach((el) => {
        gsap.to(el, { yPercent: -18, ease: "none", scrollTrigger: { trigger: el, scrub: true }});
      });
      gsap.to(".orb", { y: -80, rotate: 22, ease: "none", scrollTrigger: { trigger: ".hero", scrub: true }});
    }, root);
    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  return (
    <div ref={root} className="site">
      <header className="nav">
        <a className="brand" href="#top"><span className="brand-mark">AM</span><span>WEBTECH</span></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {["Services","Solutions","Labs","Approach","Contact"].map((item) => <a key={item} href={"#" + item.toLowerCase()} onClick={() => setMenuOpen(false)}>{item}</a>)}
        </nav>
        <a className="nav-cta" href="#contact">Book a QA Consultation <ArrowRight size={16}/></a>
        <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="grid-noise" />
          <div className="hero-glow" />
          <div className="orb" />
          <div className="hero-inner">
            <p className="eyebrow hero-kicker"><Sparkles size={15}/> SOFTWARE QUALITY ASSURANCE & TESTING</p>
            <h1 className="hero-title"><span>Testing.</span><span className="accent">Redefined.</span></h1>
            <p className="hero-copy">AI-driven QA engineering for teams that need to release faster, scale smarter and build digital experiences people trust.</p>
            <div className="hero-actions">
              <a href="#contact" className="button primary">Build your QA strategy <ArrowRight size={18}/></a>
              <a href="#services" className="button ghost"><Play size={15} fill="currentColor"/> Explore capabilities</a>
            </div>
            <div className="scroll-cue"><ArrowDown size={16}/> Scroll to explore</div>
          </div>
          <div className="hero-console">
            <div className="console-head"><span><i/> QA ENGINE ONLINE</span><span>LIVE</span></div>
            <div className="console-line"><b>01</b><span>Quality gates</span><em>PASS</em></div>
            <div className="console-line"><b>02</b><span>Automation coverage</span><em>94%</em></div>
            <div className="console-line"><b>03</b><span>AI evaluation</span><em>READY</em></div>
            <div className="console-line"><b>04</b><span>Release confidence</span><em>HIGH</em></div>
          </div>
        </section>

        <section className="ticker"><div className="ticker-track">{["AI QA","AUTOMATION","API TESTING","MOBILE","PERFORMANCE","SECURITY","CI/CD","LLM TESTING"].map((t,i)=><span key={i}>{t}<i>✦</i></span>)}</div></section>

        <section id="services" className="section dark-section">
          <div className="section-top reveal"><p className="eyebrow">CAPABILITIES</p><h2>One QA partner.<br/><span>Every quality layer.</span></h2><p>From first test strategy to continuous delivery, we connect people, automation and AI into one quality system.</p></div>
          <div className="service-grid">{services.map(({icon:Icon, ...s})=><article className="service-card reveal" key={s.tag}><div className="card-top"><Icon size={23}/><span>{s.tag}</span></div><h3>{s.title}</h3><p>{s.text}</p><div className="chips">{s.chips.map(c=><span key={c}>{c}</span>)}</div><a href="#contact" aria-label={s.title}>Explore <ArrowRight size={16}/></a></article>)}</div>
        </section>

        <section id="solutions" className="section split-section">
          <div className="split-copy reveal"><p className="eyebrow">WHY AM WEBTECH</p><h2>Make quality a <span>growth engine.</span></h2><p>Good QA catches bugs. Great QA changes how teams ship. We bring automation, shift-left practices and AI-assisted testing into the delivery workflow.</p><div className="check-list">{["Faster releases with reusable automation","Higher risk coverage across platforms","Actionable reports from every test run","Flexible QA teams that scale with you"].map(x=><div key={x}><CheckCircle2 size={18}/>{x}</div>)}</div></div>
          <div className="visual-panel reveal"><div className="visual-grid"/><div className="floating-card card-a"><Zap size={18}/><b>Release velocity</b><strong>+42%</strong></div><div className="floating-card card-b"><ShieldCheck size={18}/><b>Quality signal</b><strong>0 critical</strong></div><div className="radar"><div/><div/><div/><div/><div className="radar-core">QA</div></div></div>
        </section>

        <section id="labs" className="section lab-section">
          <div className="lab-visual reveal parallax"><div className="scan-line"/><div className="lab-hud"><span>AM / LABS</span><span>CONTINUOUS QUALITY</span></div><div className="lab-big">QA<br/><i>01</i></div></div>
          <div className="lab-copy reveal"><p className="eyebrow">THE QA LABS</p><h2>Where your product gets <span>stress-tested.</span></h2><p>Explore focused testing environments for AI, APIs, mobile, performance and secure digital experiences.</p><div className="lab-items">{["AI / LLM LAB","AUTOMATION LAB","API LAB","MOBILE LAB","PERFORMANCE + SECURITY"].map((x,i)=><a key={x} href="#contact"><span>0{i+1}</span>{x}<ArrowRight size={16}/></a>)}</div></div>
        </section>

        <section id="approach" className="section process-section">
          <div className="section-top reveal"><p className="eyebrow">DELIVERY MODEL</p><h2>From uncertainty to <span>release confidence.</span></h2></div>
          <div className="process-line">{[["01","Assess","Understand product risk, workflow and quality goals."],["02","Strategize","Choose the right test mix, stack and coverage model."],["03","Automate","Build maintainable suites and quality signals."],["04","Integrate","Connect QA to CI/CD for continuous feedback."],["05","Improve","Use data to remove bottlenecks and raise quality."]].map(x=><div className="process-step reveal" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div>
        </section>

        <section className="section stats-section"><div className="stats-grid">{stats.map(([n,l])=><div className="stat reveal" key={l}><strong>{n}</strong><span>{l}</span></div>)}</div></section>

        <section id="contact" className="section contact-section">
          <div className="contact-glow"/>
          <div className="contact-inner reveal"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Let's make your next release <span>the confident one.</span></h2><p>Tell us what you are building, where quality hurts today, and what “better” looks like.</p><a href="mailto:info@amwebtech.com" className="button primary">Start a conversation <ArrowRight size={18}/></a><div className="contact-meta"><span><Globe2 size={16}/> Global delivery</span><span>AM Webtech</span><span>24/7 QA support</span></div></div>
        </section>
      </main>

      <footer className="footer"><div><a className="brand" href="#top"><span className="brand-mark">AM</span><span>WEBTECH</span></a><p>Software quality assurance & testing for ambitious digital products.</p></div><div className="footer-links"><a href="#services">Services</a><a href="#solutions">Solutions</a><a href="#labs">Labs</a><a href="#contact">Contact</a></div><div>© {new Date().getFullYear()} AM Webtech</div></footer>
    </div>
  );
}

function useState(initial: boolean): [boolean, (v: boolean) => void] {
  const ref = useRef(initial);
  return [ref.current, (v: boolean) => { ref.current = v; document.documentElement.dataset.menu = v ? "open" : "closed"; }];
}