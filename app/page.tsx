"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity, ArrowDown, ArrowRight, BarChart3, Bot, CheckCircle2, Code2,
  Gauge, Globe2, Layers3, Menu, Play, Quote, Search, ShieldCheck,
  Smartphone, Sparkles, Users, X, Zap
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const services = [
  ["01","API Testing","REST, SOAP, GraphQL, contract, data integrity, load/stress, security and API automation.","Functional • Contract • Security","/services/api-testing/"],
  ["02","Test Automation","Scalable web, mobile, API, performance and regression suites with maintainable frameworks.","Selenium • Playwright • Cypress • Appium","/services/test-automation/"],
  ["03","Manual & Functional QA","Requirement-driven functional, regression, usability and exploratory testing for real user journeys.","Functional • Regression • Usability","/services/"],
  ["04","Agile Testing","QA embedded into iterative delivery with continuous feedback, sprint validation and release readiness.","Agile • Scrum • CI/CD","/services/agile-testing/"],
  ["05","Mobile Testing","End-to-end iOS, Android and hybrid testing across devices, OS versions, networks and real-device labs.","iOS • Android • Real Devices","/services/mobile-testing/"],
  ["06","Performance Testing","Load, stress and resilience testing to expose bottlenecks before production users do.","JMeter • Load • Scale","/services/performance-testing/"],
  ["07","Security Testing","Vulnerability assessment, penetration testing, SAST, DAST, API, cloud and mobile security validation.","SAST • DAST • API • Cloud","/services/security-testing/"],
  ["08","AI & LLM Testing","Prompt, hallucination, safety, adversarial, response-quality, model-regression and AI-agent evaluation.","LLM • RAG • Agents • Safety","/services/"],
  ["09","Accessibility & Usability","Inclusive digital experiences aligned with accessibility standards and practical usability goals.","WCAG • ADA • Section 508","/services/accessibility/"],
  ["10","Cloud & Data Quality","Cloud application validation plus secure, accurate and compliant test-data strategies.","Cloud • Data • Compliance","/"],
  ["11","Dedicated QA Teams","Dedicated QA engineers, automation specialists, QA leads and broader quality engineering teams.","Manual • Automation • QA Leadership","/dedicated-qa-team/"],
  ["12","Managed QA & Consulting","Project QA, staff augmentation, automation modernization, CI/CD quality and long-term QA support.","Consulting • Managed QA","/company/"]
];

const technologies = [
  "Selenium","Playwright","Cypress","Appium","Postman","Rest Assured","JMeter",
  "Jira","Azure DevOps","GitHub Actions","Jenkins","AWS","Azure"
];

const industries = [
  "Healthcare","Banking & Financial Services","FinTech","Insurance","Retail",
  "E-Commerce","Logistics","Artificial Intelligence","Government","Real Estate","Education","SaaS"
];

const globalServices = [
  "Manual Testing","Automation Testing","API Testing","Performance Testing","Regression Testing",
  "Security Testing","Accessibility Testing","Mobile App Testing","AI Testing","LLM Testing","Usability Testing","Cloud Testing"
];

const caseStudies = [
  { label:"AI / CONVERSATIONAL", title:"AI-Powered Conversational Platform", text:"Automation-first QA across web, mobile, messaging and voice channels.", metrics:["75% reduction in manual QA","60% improvement in test coverage","Faster release cycles"] },
  { label:"NO-CODE / GAMING", title:"No-Code Game Development Platform", text:"End-to-end QA process and automation framework for a rapidly evolving game platform.", metrics:["90% reduction in manual testing","Faster bug detection","Improved release stability"] },
  { label:"WORKFORCE / SAAS", title:"Workforce Management Platform", text:"Dedicated Agile QA across web and mobile applications with complex roles and frequent releases.", metrics:["Web + mobile QA","Cross-browser testing","Agile QA integration"] },
  { label:"ENTERPRISE WORKFLOW", title:"Third-Party Workflow Automation", text:"Scalable Agile QA and automation across multiple client environments.", metrics:["65%+ reduction in bug ratio","Faster regression cycles","Consistent deployments"] }
];

const clients = [
  "Emplifi","Buildbox","Recruitbot","Certa","Windmill Design","Conversion","LogMeOnce","Colabo",
  "LULALU","OwnZones","WorkApp","Brainy Kids","Angels","Brandwatch","Communities for Cause",
  "British Pathe","Chatsworth Products","Fire Matters","Dreams Quest","Email Ready","Inspiyr","Purple Forge","SEMYOU","Touch Note"
];

const testimonials = [
  ["Pierre Sernet","New York","“Good job! It was nice working with you. Your report was really interesting, and you completed the mission on time. Will contact you if any other testing needed.”"],
  ["Freddie Gjertsen","UK","“AM Webtech was an excellent quality assurance testing team, and I enjoyed many times working with them. They had an excellent eye for detail and was very proactive.”"],
  ["Kathy Kassera Mrozek","Director","“AM Webtech is a highly efficient and accurate team of QA testers; very punctual and professional.”"],
  ["Lyn (Sharma) Bos","CEO / Founder","“In the time that I have worked with AM Webtech, I have been impressed by their thorough, methodical and dependable approach.”"],
  ["Brian Hurley","President & CEO","“AM Webtech were great to work with. We will use them again for QA on other sites we manage.”"]
];

const leaders = [
  ["Gulrez Khan","Co-Founder"],["Shadab Shaikh","Co-Founder"],["Hitesh Solanki","Co-Founder"],
  ["Pavan Parihar","Director of QA and Client Relationship"],["Uday Singh Chouhan","Director of Quality Engineering and Excellence"],
  ["Mustakim Shaikh","Business Development Manager"],["Kehkasha Khan","Business Head"],["Rashika Subramanian","Project Manager QA"]
];

const process = [
  ["01","Requirement Analysis","Understand product goals, risks and quality objectives."],
  ["02","Planning & Strategy","Create a customized QA roadmap and select the right testing mix."],
  ["03","Testing Execution","Combine manual and automated testing with modern tools."],
  ["04","Continuous Reporting","Provide transparent defects, quality signals, sprint updates and insights."],
  ["05","Release Validation","Complete regression and final quality validation before production."],
  ["06","Scale & Improve","Scale resources and continuously improve coverage, automation and quality."],
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const ctx = gsap.context(() => {
      gsap.from(".hero-kicker", { y:24, opacity:0, duration:.8, delay:.15 });
      gsap.from(".hero-title span", { y:90, opacity:0, duration:1, stagger:.1, ease:"power4.out", delay:.2 });
      gsap.from(".hero-copy", { y:25, opacity:0, duration:.8, delay:.65 });
      gsap.from(".hero-actions", { y:25, opacity:0, duration:.8, delay:.8 });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => gsap.from(el, {
        y:60, opacity:0, duration:1, ease:"power3.out",
        scrollTrigger:{ trigger:el, start:"top 86%" }
      }));
      gsap.utils.toArray<HTMLElement>(".parallax").forEach((el) => gsap.to(el, {
        yPercent:-14, ease:"none", scrollTrigger:{ trigger:el, scrub:true }
      }));
      gsap.to(".orb", { y:-80, rotate:22, ease:"none", scrollTrigger:{ trigger:".hero", scrub:true } });
      gsap.utils.toArray<HTMLElement>(".case-card").forEach((el, i) => gsap.from(el, {
        x: i % 2 ? 60 : -60, opacity:0, duration:1,
        scrollTrigger:{ trigger:el, start:"top 88%" }
      }));
    }, root);
    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  return (
    <div ref={root} className="site">
      <header className="nav">
        <a className="brand" href="#top"><span className="brand-mark">AM</span><span>WEBTECH</span></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {["Services","Solutions","Cases","Labs","Company","Contact"].map((item) =>
            <a key={item} href={"#"+item.toLowerCase()} onClick={() => setMenuOpen(false)}>{item}</a>
          )}
        </nav>
        <a className="nav-cta" href="#contact">Book a QA Consultation <ArrowRight size={16}/></a>
        <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="grid-noise"/><div className="hero-glow"/><div className="orb"/>
          <div className="hero-inner">
            <p className="eyebrow hero-kicker"><Sparkles size={15}/> SOFTWARE QUALITY ASSURANCE & TESTING</p>
            <h1 className="hero-title"><span>Testing.</span><span className="accent">Redefined.</span></h1>
            <p className="hero-copy">AI-driven excellence in every release. AM Webtech helps startups, SaaS companies and enterprises reduce release risk, improve test coverage and ship reliable digital experiences.</p>
            <div className="hero-actions">
              <a href="#contact" className="button primary">Build your QA strategy <ArrowRight size={18}/></a>
              <a href="#services" className="button ghost"><Play size={15} fill="currentColor"/> Explore capabilities</a>
            </div>
            <div className="scroll-cue"><ArrowDown size={16}/> Scroll to explore</div>
          </div>
          <div className="hero-console">
            <div className="console-head"><span><i/> QA ENGINE ONLINE</span><span>GLOBAL</span></div>
            <div className="console-line"><b>01</b><span>QA experience</span><em>15+ YRS</em></div>
            <div className="console-line"><b>02</b><span>Projects delivered</span><em>3,452+</em></div>
            <div className="console-line"><b>03</b><span>Global markets</span><em>READY</em></div>
            <div className="console-line"><b>04</b><span>Release confidence</span><em>HIGH</em></div>
          </div>
        </section>

        <section className="ticker"><div className="ticker-track">
          {[...globalServices,"AI QA","CI/CD","Test Automation","Quality Engineering"].map((t,i)=><span key={i}>{t.toUpperCase()}<i>✦</i></span>)}
        </div></section>

        <section id="solutions" className="section intro-section">
          <div className="intro-copy reveal">
            <p className="eyebrow">AM WEBTECH / THE COMPANY</p>
            <h2>From a focused QA team to a <span>global testing partner.</span></h2>
            <p>Founded in 2016, AM Webtech has grown into a software testing partner serving startups, SaaS companies and enterprises across international markets. Its current positioning combines dedicated QA delivery, modern automation, API, mobile, performance, security, AI and LLM testing. </p>
          </div>
          <div className="intro-metrics reveal">
            <div><strong>15+</strong><span>Years of QA experience</span></div>
            <div><strong>3,452+</strong><span>Projects delivered</span></div>
            <div><strong>455+</strong><span>Clients supported</span></div>
            <div><strong>24/7</strong><span>Global QA support</span></div>
          </div>
        </section>

        <section id="services" className="section dark-section">
          <div className="section-top reveal"><p className="eyebrow">CAPABILITIES / 12 DISCIPLINES</p><h2>One QA partner.<br/><span>Every quality layer.</span></h2><p>Comprehensive testing across functional, non-functional, data, cloud, performance, security, mobile and emerging AI quality needs. </p></div>
          <div className="service-grid">{services.map(([num,title,text,tools,href]) =>
            <article className="service-card reveal" key={num}>
              <div className="card-top"><span className="card-num">{num}</span><ArrowRight size={20}/></div>
              <h3>{title}</h3><p>{text}</p><small>{tools}</small>
              <a href={"https://amwebtech.com"+href} target="_blank" rel="noreferrer">View service <ArrowRight size={15}/></a>
            </article>
          )}</div>
        </section>

        <section className="section split-section">
          <div className="split-copy reveal">
            <p className="eyebrow">AUTOMATION / AI / DEVOPS</p>
            <h2>Quality engineered for <span>faster releases.</span></h2>
            <p>AM Webtech's automation approach covers assessment and tool selection, framework design, script development and versioning, and CI/CD integration with platforms such as Jenkins, GitHub Actions and Azure Pipelines. </p>
            <div className="check-list">
              {["Reusable automation frameworks","Web, mobile and API automation","Regression suites","CI/CD quality gates","AI-assisted testing approaches","Actionable reporting"].map(x=><div key={x}><CheckCircle2 size={18}/>{x}</div>)}
            </div>
          </div>
          <div className="visual-panel reveal parallax">
            <div className="visual-grid"/>
            <div className="floating-card card-a"><Zap size={18}/><b>Automation</b><strong>Scale</strong></div>
            <div className="floating-card card-b"><ShieldCheck size={18}/><b>Quality</b><strong>Confidence</strong></div>
            <div className="radar"><div/><div/><div/><div/><div className="radar-core">QA</div></div>
          </div>
        </section>

        <section className="section capability-band">
          <div className="section-top reveal"><p className="eyebrow">MODERN TESTING STACK</p><h2>Tools that fit your <span>delivery ecosystem.</span></h2></div>
          <div className="tech-wall reveal">{technologies.map((x,i)=><span key={x}><i>{String(i+1).padStart(2,"0")}</i>{x}</span>)}</div>
        </section>

        <section id="cases" className="section cases-section">
          <div className="section-top reveal"><p className="eyebrow">PROVEN QA / REAL RESULTS</p><h2>Real QA challenges.<br/><span>Measurable results.</span></h2><p>Selected current case-study themes published by AM Webtech, presented as outcome-focused stories. </p></div>
          <div className="case-grid">{caseStudies.map((c,i)=>
            <article className="case-card" key={c.title}>
              <div className="case-index">0{i+1}</div><p className="eyebrow">{c.label}</p><h3>{c.title}</h3><p>{c.text}</p>
              <div className="case-metrics">{c.metrics.map(m=><span key={m}><CheckCircle2 size={14}/>{m}</span>)}</div>
              <a href="https://amwebtech.com/portfolio/" target="_blank" rel="noreferrer">Open portfolio <ArrowRight size={15}/></a>
            </article>
          )}</div>
        </section>

        <section id="labs" className="section lab-section">
          <div className="lab-visual reveal parallax"><div className="scan-line"/><div className="lab-hud"><span>AM / LABS</span><span>CONTINUOUS QUALITY</span></div><div className="lab-big">QA<br/><i>LABS</i></div><div className="lab-orbit"/></div>
          <div className="lab-copy reveal"><p className="eyebrow">THE QA LABS</p><h2>Test every layer of the <span>digital experience.</span></h2><p>Bring focused validation to AI/LLM behaviour, APIs, mobile experiences, performance, application security, accessibility and usability.</p>
            <div className="lab-items">{["AI / LLM LAB","AUTOMATION LAB","API LAB","MOBILE LAB","PERFORMANCE LAB","SECURITY LAB","ACCESSIBILITY LAB","USABILITY LAB"].map((x,i)=><a key={x} href="#contact"><span>0{i+1}</span>{x}<ArrowRight size={16}/></a>)}</div>
          </div>
        </section>

        <section className="section global-section">
          <div className="global-copy reveal"><p className="eyebrow">GLOBAL QA EXPERTISE</p><h2>One delivery model.<br/><span>Multiple time zones.</span></h2><p>AM Webtech supports businesses across the USA, UK, Canada, Europe, APAC and other international markets with scalable QA services and flexible engagement models. </p>
            <div className="global-points"><span><Globe2 size={17}/> USA</span><span>UK</span><span>Canada</span><span>Europe</span><span>APAC</span></div>
          </div>
          <div className="world-panel reveal"><div className="world-grid"/><div className="world-dot d1"/><div className="world-dot d2"/><div className="world-dot d3"/><div className="world-label">GLOBAL QA DELIVERY</div></div>
        </section>

        <section className="section industry-section">
          <div className="section-top reveal"><p className="eyebrow">INDUSTRIES</p><h2>Quality built around <span>business context.</span></h2></div>
          <div className="industry-grid reveal">{industries.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><strong>{x}</strong><ArrowRight size={15}/></div>)}</div>
        </section>

        <section id="approach" className="section process-section">
          <div className="section-top reveal"><p className="eyebrow">HOW WE WORK</p><h2>From uncertainty to <span>release confidence.</span></h2><p>A structured QA lifecycle that starts with requirements and ends with validated, production-ready software. </p></div>
          <div className="process-line">{process.map(x=><div className="process-step reveal" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div>
        </section>

        <section className="section team-section">
          <div className="section-top reveal"><p className="eyebrow">LEADERSHIP</p><h2>People behind the <span>quality mission.</span></h2><p>Publicly listed AM Webtech leadership and delivery roles. </p></div>
          <div className="leader-grid">{leaders.map(([name,role])=><div className="leader reveal" key={name}><div className="avatar">{name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><strong>{name}</strong><span>{role}</span></div>)}</div>
        </section>

        <section className="section client-section">
          <div className="section-top reveal"><p className="eyebrow">CLIENT ECOSYSTEM</p><h2>Brands and products <span>we have supported.</span></h2><p>Client names below are drawn from AM Webtech's public portfolio. </p></div>
          <div className="client-wall reveal">{clients.map(x=><span key={x}>{x}</span>)}</div>
        </section>

        <section className="section testimonial-section">
          <div className="section-top reveal"><p className="eyebrow"><Quote size={15}/> CLIENT VOICE</p><h2>What clients say about <span>working with AM Webtech.</span></h2></div>
          <div className="testimonial-grid">{testimonials.map(([name,role,quote])=><article className="testimonial reveal" key={name}><Quote size={20}/><p>{quote}</p><strong>{name}</strong><span>{role}</span></article>)}</div>
        </section>

        <section className="section stats-section"><div className="stats-grid">
          {[["15+","Years of QA experience"],["3,452+","Projects delivered"],["455+","Clients supported"],["24/7","Global QA support"]].map(([n,l])=><div className="stat reveal" key={l}><strong>{n}</strong><span>{l}</span></div>)}
        </div></section>

        <section id="company" className="section company-section">
          <div className="company-card reveal"><div><p className="eyebrow">ENGAGEMENT MODELS</p><h2>Start small.<br/><span>Scale with confidence.</span></h2></div><div className="engagement-list">{["Dedicated QA Engineer","Manual + Automation Team","Dedicated Automation Team","QA Lead + Engineers","QA Consulting","Managed QA Support"].map((x,i)=><div key={x}><span>0{i+1}</span>{x}<ArrowRight size={16}/></div>)}</div></div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-glow"/>
          <div className="contact-inner reveal"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Let's make your next release <span>the confident one.</span></h2><p>Tell AM Webtech what you are building, where quality hurts today, and what better looks like.</p>
            <div className="hero-actions contact-actions"><a href="mailto:info@amwebtech.com" className="button primary">Start a conversation <ArrowRight size={18}/></a><a href="https://amwebtech.com/" target="_blank" rel="noreferrer" className="button ghost">Visit AM Webtech <ArrowRight size={16}/></a></div>
            <div className="contact-meta"><span><Globe2 size={16}/> 24/7 Global QA Support</span><span>9:30 AM – 7 PM IST</span><span>US • UK • Canada • APAC</span></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div><a className="brand" href="#top"><span className="brand-mark">AM</span><span>WEBTECH</span></a><p>Software quality assurance and testing for ambitious digital products.</p></div>
        <div className="footer-links"><a href="#services">Services</a><a href="#cases">Cases</a><a href="#labs">Labs</a><a href="#company">Company</a><a href="#contact">Contact</a></div>
        <div><a href="https://amwebtech.com/" target="_blank" rel="noreferrer">amwebtech.com</a><br/>© {new Date().getFullYear()} AM Webtech</div>
      </footer>
    </div>
  );
}
