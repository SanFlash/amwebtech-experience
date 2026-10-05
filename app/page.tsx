"use client";

import { createElement, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility, Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Building2,
  Bot, Boxes, Bug, CheckCircle2, ClipboardCheck, CloudCog, Code2, Database, Gauge,
  GitBranch, Globe2, Layers3, LockKeyhole, Menu, MonitorCheck, Play, Quote, Search,
  ScanSearch, ServerCog, ShieldCheck, Smartphone, Sparkles, TestTube2, Users, Workflow,
  X, Zap
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type ServiceItem = [string, string, string, string, string, LucideIcon];

const services: ServiceItem[] = [
  ["01","API Testing","REST, SOAP, GraphQL, contract, data integrity, load/stress, security and API automation.","Functional • Contract • Security","/services/api-testing/",Code2],
  ["02","Test Automation","Scalable web, mobile, API, performance and regression suites with maintainable frameworks.","Selenium • Playwright • Cypress • Appium","/services/test-automation/",Workflow],
  ["03","Manual & Functional QA","Requirement-driven functional, regression, usability and exploratory testing for real user journeys.","Functional • Regression • Usability","/services/",ClipboardCheck],
  ["04","Agile Testing","QA embedded into iterative delivery with continuous feedback, sprint validation and release readiness.","Agile • Scrum • CI/CD","/services/agile-testing/",GitBranch],
  ["05","Mobile Testing","End-to-end iOS, Android and hybrid testing across devices, OS versions, networks and real-device labs.","iOS • Android • Real Devices","/services/mobile-testing/",Smartphone],
  ["06","Performance Testing","Load, stress and resilience testing to expose bottlenecks before production users do.","JMeter • Load • Scale","/services/performance-testing/",Gauge],
  ["07","Security Testing","Vulnerability assessment, penetration testing, SAST, DAST, API, cloud and mobile security validation.","SAST • DAST • API • Cloud","/services/security-testing/",ShieldCheck],
  ["08","AI & LLM Testing","Prompt, hallucination, safety, adversarial, response-quality, model-regression and AI-agent evaluation.","LLM • RAG • Agents • Safety","/services/",Bot],
  ["09","Accessibility & Usability","Inclusive digital experiences aligned with accessibility standards and practical usability goals.","WCAG • ADA • Section 508","/services/accessibility/",Accessibility],
  ["10","Cloud & Data Quality","Cloud application validation plus secure, accurate and compliant test-data strategies.","Cloud • Data • Compliance","/",CloudCog],
  ["11","Dedicated QA Teams","Dedicated QA engineers, automation specialists, QA leads and broader quality engineering teams.","Manual • Automation • QA Leadership","/dedicated-qa-team/",Users],
  ["12","Managed QA & Consulting","Project QA, staff augmentation, automation modernization, CI/CD quality and long-term QA support.","Consulting • Managed QA","/company/",ServerCog]
];

const technologies: Array<[string, LucideIcon]> = [
  ["Selenium",Workflow],["Playwright",MonitorCheck],["Cypress",CheckCircle2],["Appium",Smartphone],
  ["Postman",Code2],["Rest Assured",ShieldCheck],["JMeter",Gauge],["Jira",ClipboardCheck],
  ["Azure DevOps",CloudCog],["GitHub Actions",GitBranch],["Jenkins",Workflow],["AWS",CloudCog],["Azure",CloudCog]
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
  { label:"AI / CONVERSATIONAL", title:"AI-Powered Conversational Platform", text:"Automation-first QA across web, mobile, messaging and voice channels.", metrics:["75% reduction in manual QA","60% improvement in test coverage","Faster release cycles"], image:"https://bridgeiqtechnologies.com/assets/service-qe-v4-DGhnUKcb.png" },
  { label:"NO-CODE / GAMING", title:"No-Code Game Development Platform", text:"End-to-end QA process and automation framework for a rapidly evolving game platform.", metrics:["90% reduction in manual testing","Faster bug detection","Improved release stability"], image:"https://cdn.prod.website-files.com/66ad2be6a1fc504a2d6a22b2/69c2d87d9ae0240b87d03f74_ddce2ca631884e61aac2ece96456deca.png" },
  { label:"WORKFORCE / SAAS", title:"Workforce Management Platform", text:"Dedicated Agile QA across web and mobile applications with complex roles and frequent releases.", metrics:["Web + mobile QA","Cross-browser testing","Agile QA integration"], image:"https://apinita.ru/images/solutions/2026/04/1/professiya-qa-chem-zanimaetsya-testirovshhik-v-it-i-pochemu-eto-vazhno.jpeg" },
  { label:"ENTERPRISE WORKFLOW", title:"Third-Party Workflow Automation", text:"Scalable Agile QA and automation across multiple client environments.", metrics:["65%+ reduction in bug ratio","Faster regression cycles","Consistent deployments"], image:"https://www.testriq.com/_next/image?q=75&url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F7hxinmig%2Fproduction%2F0997f365354f14918e3b8d4d855a74702424b988-1200x896.png%3Fw%3D1200%26q%3D90&w=3840" }
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

function QAVisual3D({ variant }: { variant: "hero" | "automation" | "labs" }) {
  const data = {
    hero: {
      label: "QA AUTOMATION / RELEASE CONTROL",
      sub: "CODE • TEST • VERIFY • SHIP",
      image: "https://bridgeiqtechnologies.com/assets/service-qe-v4-DGhnUKcb.png",
      alt: "QA engineer working with automation dashboards in a modern engineering office",
      icon: MonitorCheck,
      chips: ["96% COVERAGE", "CI / CD", "REGRESSION"],
    },
    automation: {
      label: "AUTOMATION ENGINEERING",
      sub: "FRAMEWORK • EXECUTION • QUALITY GATE",
      image: "https://accelonit.com/img/content/software_testing_realistic.webp",
      alt: "Software testing engineer reviewing a QA automation dashboard",
      icon: Workflow,
      chips: ["450 TEST RUNS", "94% PASS", "CI READY"],
    },
    labs: {
      label: "MOBILE / DEVICE QA LAB",
      sub: "REAL DEVICES • TEST RUNS • RELEASE SIGNALS",
      image: "https://code95.com/app/uploads/2025/12/%D8%B9%D9%85%D9%84%20%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D9%88%D8%A8%D8%A7%D9%8A%D9%84.webp",
      alt: "Mobile application testing workstation with multiple devices and test dashboard",
      icon: Smartphone,
      chips: ["DEVICE MATRIX", "TEST RUNNING", "MOBILE QA"],
    },
  }[variant];
  const Icon = data.icon;
  return (
    <div className={`qa-3d qa-3d-${variant} relevant-visual`} aria-label={data.label}>
      <img className="media-image" src={data.image} alt={data.alt} loading="lazy" decoding="async" />
      <div className="media-overlay" />
      <div className="visual-grid" />
      <div className="visual-line visual-line-one" />
      <div className="visual-line visual-line-two" />
      <div className="media-header"><span>AM / QUALITY ENGINEERING</span><b>LIVE VISUAL</b></div>
      <div className="media-core">
        <div className="media-core-icon"><Icon size={26} strokeWidth={1.6}/></div>
        <strong>{variant === "labs" ? "QA LAB" : variant === "automation" ? "AUTO QA" : "QUALITY"}</strong>
        <span>{data.sub}</span>
      </div>
      <div className="media-chips">{data.chips.map((chip, i) => <span key={chip} className={i === 1 ? "active" : ""}>{chip}</span>)}</div>
      <div className="qa-3d-label"><span>{data.label}</span><b>{data.sub}</b></div>
    </div>
  );
}

function GlobalVisual() {
  return (
    <div className="world-panel reveal global-media" aria-label="Global QA delivery visual">
      <img className="media-image" src="https://aicertswpcdn.blob.core.windows.net/newsportal/2026/01/tech-team-uses-testing-agents.jpg" alt="QA engineering team reviewing software testing dashboards" loading="lazy" decoding="async" />
      <div className="media-overlay" />
      <div className="world-grid"/>
      <div className="world-route route-one"/>
      <div className="world-route route-two"/>
      <div className="world-dot d1"/><div className="world-dot d2"/><div className="world-dot d3"/>
      <div className="global-badge"><Globe2 size={16}/><span>GLOBAL QA DELIVERY</span><b>USA • UK • EU • APAC</b></div>
    </div>
  );
}

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
      gsap.utils.toArray<HTMLElement>(".media-image").forEach((el) => gsap.fromTo(el, { scale:1.16, yPercent:5 }, { scale:1, yPercent:-4, ease:"none",
        scrollTrigger:{ trigger:el, start:"top bottom", end:"bottom top", scrub:1.1 }
      }));
      gsap.utils.toArray<HTMLElement>(".relevant-visual").forEach((el) => {
        const core = el.querySelector(".media-core");
        const chips = el.querySelectorAll(".media-chips span");
        if (core) gsap.from(core, { scale:.72, rotateY:-18, opacity:0, duration:1.1, ease:"power3.out", scrollTrigger:{ trigger:el, start:"top 78%" }});
        gsap.from(chips, { y:20, opacity:0, stagger:.08, duration:.55, ease:"power2.out", scrollTrigger:{ trigger:el, start:"top 74%" }});
      });
      gsap.utils.toArray<HTMLElement>(".visual-line").forEach((line, i) => gsap.to(line, {
        xPercent:i ? -22 : 22, opacity:.55, ease:"none",
        scrollTrigger:{ trigger:line.closest(".relevant-visual"), start:"top bottom", end:"bottom top", scrub:1.2 }
      }));
      gsap.utils.toArray<HTMLElement>(".global-media").forEach((el) => gsap.from(el, {
        rotateX:8, y:55, opacity:0, duration:1.1, ease:"power3.out", scrollTrigger:{ trigger:el, start:"top 82%" }
      }));
    }, root);
    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  return (
    <div ref={root} className="site">
      <header className="nav">
        <a className="brand" href="#top" aria-label="AM Webtech home">
          <span className="brand-fallback" aria-hidden="true"><strong>AM</strong><b>WEBTECH</b></span>
          <img
            className="brand-logo"
            src="/amwebtech-logo-clean.svg"
            alt="AM Webtech"
            width={300}
            height={100}
            loading="eager"
            decoding="async"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              const fallback = event.currentTarget.previousElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {["Services","Solutions","Cases","Labs","Office Tour","Company","Contact"].map((item) =>
            <a key={item} href={"#"+item.toLowerCase()} onClick={() => setMenuOpen(false)}>{item}</a>
          )}
        </nav>
        <div className="nav-actions"><a className="nav-tour" href="/office-tour"><Building2 size={15}/> 3D Office Tour</a><a className="nav-cta" href="#contact">Book a QA Consultation <ArrowRight size={16}/></a></div>
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
          <div className="hero-3d reveal" aria-label="Interactive 3D quality engineering visualization">
            <QAVisual3D variant="hero" />
            <div className="hero-3d-label"><span>3D / QUALITY ENGINE</span><b>AI · AUTOMATION · RELEASE</b></div>
          </div>
          <div className="hero-console">
            <div className="console-head"><span><i/> QA ENGINE ONLINE</span><span>GLOBAL</span></div>
            <div className="console-line"><b>01</b><span>QA experience</span><em>15+ YRS</em></div>
            <div className="console-line"><b>02</b><span>Projects delivered</span><em>2,967+</em></div>
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
            <p>AM Webtech presents itself as a QA-only Quality Engineering partner for SaaS, B2B and digital-product teams across North America, the UK, Europe and APAC. Its public company profile emphasizes AI-powered automation, functional and regression QA, API testing, performance, security, accessibility, mobile testing, consulting and dedicated QA teams.</p>
          </div>
          <div className="intro-metrics reveal">
            <div><strong>15+</strong><span>Years of QA experience</span></div>
            <div><strong>10.8K+</strong><span>LinkedIn followers</span></div>
            <div><strong>393+</strong><span>Clients supported</span></div>
            <div><strong>24/7</strong><span>Global QA support</span></div>
          </div>
        </section>

        <section id="services" className="section dark-section">
          <div className="section-top reveal"><p className="eyebrow">CAPABILITIES / 12 DISCIPLINES</p><h2>One QA partner.<br/><span>Every quality layer.</span></h2><p>Comprehensive testing across functional, non-functional, data, cloud, performance, security, mobile and emerging AI quality needs. </p></div>
          <div className="service-grid">{services.map(([num,title,text,tools,href,Icon]) =>
            <article className="service-card reveal" key={num}>
              <div className="card-top">
                <span className="card-num">{num}</span>
                <span className="service-icon"><Icon size={21} strokeWidth={1.7}/></span>
                <ArrowRight size={20}/>
              </div>
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
            <div className="visual-3d" aria-label="Interactive 3D automation visualization">
              <QAVisual3D variant="automation" />
            </div>
            <div className="floating-card card-a"><Bot size={18}/><b>AI / Automation</b><strong>Execute</strong></div>
            <div className="floating-card card-b"><ShieldCheck size={18}/><b>Quality Gate</b><strong>Pass</strong></div>
            <div className="radar"><div/><div/><div/><div/><div className="radar-core">QA</div></div>
          </div>
        </section>

        <section className="section capability-band">
          <div className="section-top reveal"><p className="eyebrow">MODERN TESTING STACK</p><h2>Tools that fit your <span>delivery ecosystem.</span></h2></div>
          <div className="tech-wall reveal">{technologies.map(([x,Icon],i)=><span key={x}><i>{String(i+1).padStart(2,"0")}</i><Icon size={16}/>{x}</span>)}</div>
        </section>

        <section id="cases" className="section cases-section">
          <div className="section-top reveal"><p className="eyebrow">PROVEN QA / REAL RESULTS</p><h2>Real QA challenges.<br/><span>Measurable results.</span></h2><p>Selected current case-study themes published by AM Webtech, presented as outcome-focused stories. </p></div>
          <div className="case-grid">{caseStudies.map((c,i)=>
            <article className="case-card" key={c.title}>
              <div className="case-media"><img className="media-image" src={c.image} alt={c.title} loading="lazy" decoding="async"/><div className="case-media-shade"/><span>CASE / QA DELIVERY</span></div>
              <div className="case-index">0{i+1}</div><p className="eyebrow">{c.label}</p><h3>{c.title}</h3><p>{c.text}</p>
              <div className="case-metrics">{c.metrics.map(m=><span key={m}><CheckCircle2 size={14}/>{m}</span>)}</div>
              <a href="https://amwebtech.com/portfolio/" target="_blank" rel="noreferrer">Open portfolio <ArrowRight size={15}/></a>
            </article>
          )}</div>
        </section>

        <section id="labs" className="section lab-section">
          <div className="lab-visual reveal parallax">
            <div className="lab-3d" aria-label="Interactive 3D QA labs visualization">
              <QAVisual3D variant="labs" />
            </div>
            <div className="scan-line"/><div className="lab-hud"><span>AM / LABS</span><span>CONTINUOUS QUALITY</span></div><div className="lab-big">QA<br/><i>LABS</i></div><div className="lab-orbit"/></div>
          <div className="lab-copy reveal"><p className="eyebrow">THE QA LABS</p><h2>Test every layer of the <span>digital experience.</span></h2><p>Bring focused validation to AI/LLM behaviour, APIs, mobile experiences, performance, application security, accessibility and usability.</p>
            <div className="lab-items">{([
              ["AI / LLM LAB",Bot],["AUTOMATION LAB",Workflow],["API LAB",Code2],["MOBILE LAB",Smartphone],
              ["PERFORMANCE LAB",Gauge],["SECURITY LAB",ShieldCheck],["ACCESSIBILITY LAB",Accessibility],["USABILITY LAB",Search]
            ] as Array<[string, LucideIcon]>).map(([x,Icon],i)=><a key={x} href="#contact"><span>0{i+1}</span><Icon size={15}/>{x}<ArrowRight size={16}/></a>)}</div>
          </div>
        </section>

        <section className="section global-section">
          <div className="global-copy reveal"><p className="eyebrow">GLOBAL QA EXPERTISE</p><h2>One delivery model.<br/><span>Multiple time zones.</span></h2><p>AM Webtech supports businesses across the USA, UK, Canada, Europe, APAC and other international markets with scalable QA services and flexible engagement models. </p>
            <div className="global-points"><span><Globe2 size={17}/> USA</span><span>UK</span><span>Canada</span><span>Europe</span><span>APAC</span></div>
          </div>
          <GlobalVisual />
        </section>

        <section className="section industry-section">
          <div className="section-top reveal"><p className="eyebrow">INDUSTRIES</p><h2>Quality built around <span>business context.</span></h2></div>
          <div className="industry-grid reveal">{industries.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><strong>{x}</strong><ArrowRight size={15}/></div>)}</div>
        </section>

        <section id="approach" className="section process-section">
          <div className="section-top reveal"><p className="eyebrow">HOW WE WORK</p><h2>From uncertainty to <span>release confidence.</span></h2><p>A structured QA lifecycle that starts with requirements and ends with validated, production-ready software. </p></div>
          <div className="process-line">{process.map(([num,title,description],i)=><div className="process-step reveal" key={num}><span>{num}</span><div className="process-icon"><CheckCircle2 size={16}/></div><h3>{title}</h3><p>{description}</p></div>)}</div>
        </section>

        <section className="section team-section">
          <div className="section-top reveal"><p className="eyebrow">LEADERSHIP</p><h2>People behind the <span>quality mission.</span></h2><p>Publicly listed AM Webtech leadership and delivery roles. </p></div>
          <div className="leader-grid">{leaders.map(([name,role])=><div className="leader reveal" key={name}><div className="avatar">{name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><strong>{name}</strong><span>{role}</span></div>)}</div>
        </section>

        <section className="section client-section">
          <div className="section-top reveal"><p className="eyebrow">CLIENT ECOSYSTEM</p><h2>Brands and products <span>we have supported.</span></h2><p>Client names below are drawn from AM Webtech's public portfolio. </p></div>
          <div className="client-wall reveal">{clients.map(x=><span key={x}>{x}</span>)}</div>
        </section>

        <section id="company" className="section linkedin-section">
          <div className="section-top reveal">
            <p className="eyebrow"><span className="linkedin-dot">in</span> LINKEDIN / POSTS / ACHIEVEMENTS</p>
            <h2>Real company stories, <span>directly from AM Webtech.</span></h2>
            <p>These highlights are built from AM Webtech's public LinkedIn posts — including the 16th Foundation Day, employee recognition, International Testers Day, quality leadership and client stories. Each card links back to the original LinkedIn post instead of embedding a social feed.</p>
          </div>

          <div className="linkedin-post-grid reveal">
            <article className="linkedin-post linkedin-post-feature">
              <div className="post-visual foundation-visual">
                <span className="post-platform">LINKEDIN / AM WEBTECH</span>
                <strong>16</strong><small>YEARS OF<br/>QUALITY</small>
                <span className="post-date">1 MONTH AGO</span>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>FOUNDATION DAY</span><span>16 YEARS</span></div>
                <h3>16 years of milestones. Countless memories along the way.</h3>
                <p>Outdoor activities, poolside fun, cake cutting, the Awards & Recognition Ceremony, conversations and lunch — a company celebration centered on culture, teamwork and relationships.</p>
                <a href="https://www.linkedin.com/company/amwebtech/" target="_blank" rel="noreferrer">Open AM Webtech LinkedIn updates <ArrowUpRight size={16}/></a>
              </div>
            </article>

            <article className="linkedin-post">
              <div className="post-visual awards-visual">
                <span className="post-platform">EMPLOYEE RECOGNITION</span>
                <div className="award-medal">★</div>
                <strong>11</strong><small>RECOGNITION<br/>CATEGORIES</small>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>ACHIEVEMENTS</span><span>3 MONTHS AGO</span></div>
                <h3>Every milestone is built by people.</h3>
                <p>Star Performer, Rising Star, Extra Mile, Accountability, Team Spirit, Client Appreciation, Dedication, Journey to Excellence, Mentorship Champion, Service Recognition and Team Award.</p>
                <a href="https://www.linkedin.com/company/amwebtech/" target="_blank" rel="noreferrer">Open AM Webtech LinkedIn <ArrowUpRight size={16}/></a>
              </div>
            </article>

            <article className="linkedin-post">
              <div className="post-visual testers-visual">
                <span className="post-platform">QUALITY / QA</span>
                <strong>QA</strong><small>TESTERS<br/>MAKE RELEASES BETTER</small>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>INTERNATIONAL TESTERS DAY</span><span>2024</span></div>
                <h3>Celebrating the unsung heroes of the tech world.</h3>
                <p>The post recognizes testers for identifying bugs before they become issues, protecting user experience and helping deliver reliable performance across platforms.</p>
                <a href="https://www.linkedin.com/posts/amwebtech_internationaltestersday-thankyoutesters-activity-7238895009301725185-FyJP" target="_blank" rel="noreferrer">Open original LinkedIn post <ArrowUpRight size={16}/></a>
              </div>
            </article>

            <article className="linkedin-post">
              <div className="post-visual consistency-visual">
                <span className="post-platform">QUALITY ENGINEERING</span>
                <strong>01</strong><small>CONSISTENCY<br/>CREATES QUALITY</small>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>INTERNATIONAL ACHIEVERS DAY</span><span>2026</span></div>
                <h3>Achievement is discipline, not just a breakthrough.</h3>
                <p>AM Webtech's post argues that reliable technology comes from consistent standards, scalable systems, repeatable processes and quality embedded into every decision.</p>
                <a href="https://www.linkedin.com/posts/amwebtech_internationalachieversday-cto-startupfounders-activity-7442131486650281984-NLun" target="_blank" rel="noreferrer">Open original LinkedIn post <ArrowUpRight size={16}/></a>
              </div>
            </article>

            <article className="linkedin-post">
              <div className="post-visual precision-visual">
                <span className="post-platform">QA LEADERSHIP</span>
                <strong>QA</strong><small>DISCIPLINE<br/>OVER SPEED</small>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>QUALITY MINDSET</span><span>2026</span></div>
                <h3>Moving right is more valuable than simply moving fast.</h3>
                <p>The post highlights clear test strategies, precise coverage and disciplined automation as the foundation for reducing uncertainty and preventing production failures.</p>
                <a href="https://www.linkedin.com/posts/amwebtech_amwebtech-qualityengineering-softwaretesting-activity-7417512517930954752-51rZ" target="_blank" rel="noreferrer">Open original LinkedIn post <ArrowUpRight size={16}/></a>
              </div>
            </article>

            <article className="linkedin-post">
              <div className="post-visual client-visual">
                <span className="post-platform">CLIENT SUCCESS</span>
                <strong>★★★★★</strong><small>REAL CLIENT<br/>FEEDBACK</small>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>CLIENT REVIEWS</span><span>PUBLIC POST</span></div>
                <h3>Software QA that clients can feel.</h3>
                <p>AM Webtech shared client feedback praising experienced testing professionals, useful bug sheets, screenshots, recordings and clear defect documentation.</p>
                <a href="https://www.linkedin.com/posts/amwebtech_startup-startupsuccess-startups-activity-7155884888951336961-NQBL" target="_blank" rel="noreferrer">Open original LinkedIn post <ArrowUpRight size={16}/></a>
              </div>
            </article>
            <article className="linkedin-post">
              <div className="post-visual workshop-visual">
                <span className="post-platform">INDUSTRY / LEARNING</span>
                <strong>SKILL</strong><small>BEYOND<br/>TEXTBOOKS</small>
              </div>
              <div className="post-content">
                <div className="post-meta"><span>WORKSHOP ON ANALYTICAL TOOLS</span><span>RECENT</span></div>
                <h3>Bridging academia and industry.</h3>
                <p>AM Webtech's recent LinkedIn activity highlighted Mustakim S. serving as a judge at the finale of the Workshop on Analytical Tools at Shri Vaishnav Institute of Management & Science, Indore.</p>
                <a href="https://www.linkedin.com/company/amwebtech/" target="_blank" rel="noreferrer">Open AM Webtech LinkedIn updates <ArrowUpRight size={16}/></a>
              </div>
            </article>
          </div>

          <div className="linkedin-achievement-bar reveal">
            <div><strong>16</strong><span>Foundation Day milestone</span></div>
            <div><strong>11</strong><span>Recognition categories highlighted</span></div>
            <div><strong>10.8K+</strong><span>LinkedIn followers shown publicly</span></div>
            <div><strong>QA</strong><span>Core company identity</span></div>
          </div>
        </section>

        <section className="section testimonial-section">
          <div className="section-top reveal"><p className="eyebrow"><Quote size={15}/> CLIENT VOICE</p><h2>What clients say about <span>working with AM Webtech.</span></h2></div>
          <div className="testimonial-grid">{testimonials.map(([name,role,quote])=><article className="testimonial reveal" key={name}><Quote size={20}/><p>{quote}</p><strong>{name}</strong><span>{role}</span></article>)}</div>
        </section>

        <section className="section stats-section"><div className="stats-grid">
          {[["13+","Years shown on current website"],["2,967+","Projects completed"],["393+","Trusted clients"],["69+","Professional team"]].map(([n,l])=><div className="stat reveal" key={l}><strong>{n}</strong><span>{l}</span></div>)}
        </div></section>


        <section className="section pricing-section">
          <div className="section-top reveal"><p className="eyebrow">QA ENGAGEMENT OPTIONS</p><h2>Choose the model that fits your <span>quality goals.</span></h2><p>AM Webtech publicly presents Essential, Professional and Enterprise QA service tiers, with the scope adapted to product requirements. The published service scope includes broken-asset checks, spelling review, UI/UX, functional and usability testing, performance testing, SEO audit and regression testing.</p></div>
          <div className="pricing-grid reveal">
            {[
              ["ESSENTIAL","Core quality assurance","Broken assets • UI/UX • Functional & usability • Performance • SEO audit • Regression"],
              ["PROFESSIONAL","Expert testing coverage","Core QA plus broader validation and reliability coverage for growing products"],
              ["ENTERPRISE","Scalable QA solutions","Larger-scale testing, dedicated QA and flexible coverage for complex organizations"]
            ].map(([name,title,features],i)=><article className="price-card" key={name}><span>0{i+1}</span><p className="eyebrow">{name}</p><h3>{title}</h3><p>{features}</p><a href="#contact">Request a personalized quote <ArrowRight size={15}/></a></article>)}
          </div>
        </section>

        <section className="section insights-section">
          <div className="section-top reveal"><p className="eyebrow">LATEST INSIGHTS</p><h2>Ideas for modern <span>quality engineering.</span></h2><p>Current AM Webtech publishing themes include dedicated QA teams, self-healing automation, LLM testing and automation strategies.</p></div>
          <div className="insight-grid reveal">
            {[
              ["01","Dedicated QA Team","How to scale software testing without the cost of building a large in-house team."],
              ["02","Self-Healing Test Automation","How self-healing approaches can reduce automation maintenance and improve ROI."],
              ["03","Why LLM Testing Matters","Why AI products require dedicated validation for reliability, safety and response quality."],
              ["04","Automation Testing Strategies","Approaches for improving ROI, coverage and time-to-market through automation."]
            ].map(([n,t,d])=><a className="insight-card" key={n} href="https://amwebtech.com/blog/" target="_blank" rel="noreferrer"><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowRight size={18}/></a>)}
          </div>
        </section>

        <section id="engagement" className="section company-section">
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
