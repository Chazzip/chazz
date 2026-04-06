"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HeroScene } from "@/components/hero-scene";
import { artifacts, modules, navItems, pathSteps, signals } from "@/data/site-content";

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("#positioning");
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".js-reveal",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".page-shell",
            start: "top top"
          }
        }
      );

      gsap.utils.toArray<HTMLElement>(".js-panel").forEach((panel) => {
        gsap.fromTo(
          panel,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 82%"
            }
          }
        );
      });

      gsap.to(".progress-fill", {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      gsap.to(".hero-copy", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".hero-stage", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".chapter-marquee__track", {
        xPercent: -26,
        ease: "none",
        repeat: -1,
        duration: 18
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "-15% 0px -40% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const magneticTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));

    const cleanups = magneticTargets.map((element) => {
      const handleMove = (event: PointerEvent) => {
        const bounds = element.getBoundingClientRect();
        const x = event.clientX - bounds.left - bounds.width / 2;
        const y = event.clientY - bounds.top - bounds.height / 2;
        gsap.to(element, {
          x: x * 0.12,
          y: y * 0.12,
          duration: 0.4,
          ease: "power3.out"
        });
      };

      const handleLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        });
      };

      element.addEventListener("pointermove", handleMove);
      element.addEventListener("pointerleave", handleLeave);

      return () => {
        element.removeEventListener("pointermove", handleMove);
        element.removeEventListener("pointerleave", handleLeave);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const handleHashClick = () => setMenuOpen(false);
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".mobile-panel a"));
    links.forEach((link) => link.addEventListener("click", handleHashClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleHashClick));
    };
  }, []);

  return (
    <div className="page-shell" ref={rootRef}>
      <div className="ambient-layer" aria-hidden="true" />
      <div className="progress-rail" aria-hidden="true">
        <div className="progress-fill" />
      </div>

      <header className="topbar-shell">
        <div className="topbar">
          <a className="brand" href="#top">
            <span className="brand__mark">C</span>
            <span className="brand__copy">
              <strong>Chazz Atelier</strong>
              <span>Foreign Patent Knowledge System</span>
            </span>
          </a>

          <nav className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.href}
                className={item.href === activeSection ? "is-active" : undefined}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="topbar__actions">
            <Link className="button button--ghost" href="/cases">
              查看案例切片
            </Link>
            <a className="button button--primary" href="#contact" data-magnetic>
              进入合作入口
            </a>
            <button
              aria-controls="mobile-panel"
              aria-expanded={menuOpen}
              className={`mobile-toggle${menuOpen ? " is-open" : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span />
            </button>
          </div>
        </div>

        <div className={`mobile-panel${menuOpen ? " is-open" : ""}`} id="mobile-panel">
          <nav>
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="button button--primary" href="#contact">
            发起合作沟通
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero__backdrop" aria-hidden="true" />
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__glow" aria-hidden="true" />

          <div className="hero__inner">
            <div className="hero-copy js-reveal">
              <span className="eyebrow-pill">Foreign Patent / AI / Knowledge Brand</span>
              <h1>
                把专业知识，
                <br />
                打磨成拥有
                <em> 品牌审美 </em>
                的个人资产。
              </h1>

              <div className="hero-copy__body">
                <p>
                  这不是一个普通个人站，而是一张关于你如何理解涉外专利、如何组织认知、如何把专业经验转译成长期复利资产的品牌名片。
                  这次直接切到 Next.js、GSAP 和 React Three Fiber，把站点升级成真正能承载高阶视觉表达的结构。
                </p>
                <aside className="micro-note">
                  <strong>Visual Direction</strong>
                  <span>电影感灯光、系统界面式网格、3D 装置核心、克制但高级的运动语言。</span>
                </aside>
              </div>

              <div className="hero-copy__actions">
                <Link className="button button--primary" href="/modules" data-magnetic>
                  浏览知识矩阵
                </Link>
                <a className="button button--secondary" href="#path">
                  查看方法路径
                </a>
              </div>

              <div className="hero-copy__chips">
                <span>European Prosecution</span>
                <span>US OA Strategy</span>
                <span>AI Knowledge Workflow</span>
              </div>

              <div className="hero-copy__signals">
                <article>
                  <strong>Clarity</strong>
                  <p>把涉外专利复杂语境拆成可理解、可执行、可复用的认知结构。</p>
                </article>
                <article>
                  <strong>Judgement</strong>
                  <p>从法规、答复、翻译到策略判断，突出真正拉开差距的专业感。</p>
                </article>
                <article>
                  <strong>Leverage</strong>
                  <p>用 AI 和工作流思维，把知识沉淀成可持续输出的生产力系统。</p>
                </article>
              </div>
            </div>

            <div className="hero-stage js-reveal">
              <div className="hero-stage__panel hero-stage__panel--left js-panel">
                <strong>Knowledge Signal</strong>
                <p>你传递的不是“我有内容”，而是“我已经把内容整理成一个值得信任的体系”。</p>
                <div className="stats-grid">
                  <div>
                    <span>Modules</span>
                    <b>04</b>
                  </div>
                  <div>
                    <span>Scenes</span>
                    <b>12</b>
                  </div>
                </div>
              </div>

              <div className="hero-stage__visual js-panel">
                <HeroScene />
                <div className="hero-stage__visual-overlay">
                  <div className="hero-stage__badge">Curated Knowledge Experience</div>
                  <h2>从信息堆叠，升级为知识品牌的界面语言。</h2>
                  <p>更像高级工作室首页，更少课程页气息；更像成熟方法论，更少资料清单感。</p>
                </div>
              </div>

              <div className="hero-stage__panel hero-stage__panel--right js-panel">
                <strong>Interface Notes</strong>
                <p>React Three Fiber 负责空间装置，GSAP 负责滚动叙事，Next.js 负责真正可扩展的站点架构。</p>
              </div>
            </div>
          </div>

          <div className="hero-footer js-reveal">
            <span>Framework-grade visual system</span>
            <span>Scroll to enter the system</span>
          </div>
        </section>

        <section className="chapter-marquee">
          <div className="chapter-marquee__track">
            <span>Foreign Patent Systems</span>
            <span>AI-Powered Knowledge Design</span>
            <span>Editorial Interface Direction</span>
            <span>Case Slice Architecture</span>
            <span>European Prosecution Strategy</span>
            <span>Foreign Patent Systems</span>
            <span>AI-Powered Knowledge Design</span>
            <span>Editorial Interface Direction</span>
            <span>Case Slice Architecture</span>
            <span>European Prosecution Strategy</span>
          </div>
        </section>

        <section className="chapter-grid">
          <article className="chapter-card js-panel">
            <strong>Scene 01</strong>
            <h3>把首页做成进入体系之前的情绪装置。</h3>
            <p>更强的视觉版不只是更炫，而是让用户在正式读内容前，先进入你的判断世界和方法语境。</p>
          </article>
          <article className="chapter-card chapter-card--dark js-panel">
            <strong>Scene 02</strong>
            <h3>知识，也可以有电影感的开场方式。</h3>
            <p>背景装置、发光网格、滚动标语和 3D 物件一起工作，让网站像一张正在运行的知识界面。</p>
          </article>
          <article className="chapter-card chapter-card--list js-panel">
            <strong>Scene 03</strong>
            <ul>
              <li>
                <span>沉浸式首屏装置</span>
                <span>Immersion</span>
              </li>
              <li>
                <span>章节视觉带与滚动节奏</span>
                <span>Narrative</span>
              </li>
              <li>
                <span>真正可扩展的工程架构</span>
                <span>System</span>
              </li>
            </ul>
          </article>
        </section>

        <section className="section" id="positioning">
          <div className="section-frame">
            <div className="section-header js-reveal">
              <div>
                <span className="section-tag">Positioning</span>
                <h2>先定义你是谁，再定义你教什么。</h2>
              </div>
              <p>
                高级感的来源不是单纯做深色、加玻璃和做动效，而是让品牌定位、信息编排、视觉材料和交互节奏同步服务同一个判断：
                你提供的是一套专业且稀缺的知识操作系统。
              </p>
            </div>

            <div className="signal-grid">
              {signals.map((signal) => (
                <article className="signal-card js-panel" key={signal.eyebrow}>
                  <strong>{signal.eyebrow}</strong>
                  <b>{signal.value}</b>
                  <p>{signal.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="matrix">
          <div className="section-frame">
            <div className="section-header js-reveal">
              <div>
                <span className="section-tag">Knowledge Matrix</span>
                <h2>把涉外专利知识，组织成可持续输出的矩阵。</h2>
              </div>
              <p>
                这里不再像普通列表页，而是直接以模块化方式展示你的核心价值层级。每个模块都对应用户的一个成长阶段，也对应你未来可继续拆分的独立详情页。
              </p>
            </div>

            <div className="module-grid">
              {modules.map((module) => (
                <article className="module-card js-panel" key={module.title}>
                  <div className="module-card__top">
                    <span>{module.index}</span>
                    <b>{module.tag}</b>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <ul>
                    {module.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href={`/modules/${module.slug}`}>继续进入这一模块</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--split" id="path">
          <div className="path-layout">
            <aside className="path-intro js-reveal">
              <span className="section-tag">Method Path</span>
              <h2>视觉与知识内容，应该一起服务同一个叙事路径。</h2>
              <p>
                页面被拆成四个层次：认知建立、专业判断、输出工作流、合作转化。用户会自然地从“这个人很懂”走到“这套体系值得进入”，而不是被硬推销。
              </p>
              <a className="button button--primary" href="#contact" data-magnetic>
                继续进入合作入口
              </a>
            </aside>

            <div className="path-steps">
              {pathSteps.map((step) => (
                <article className="path-step js-panel" key={step.label}>
                  <span>{step.label}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="artifacts">
          <div className="section-frame">
            <div className="section-header js-reveal">
              <div>
                <span className="section-tag">Content Artifacts</span>
                <h2>接下来值得继续扩展的内容资产层。</h2>
              </div>
              <p>
                首页做高级之后，真正拉开差距的是内容资产化。你可以继续把每个模块拆成更具体的样章、案例切片和方法图谱，整站会再上一个层级。
              </p>
            </div>

            <div className="artifact-grid">
              {artifacts.map((artifact) => (
                <article className="artifact-card js-panel" key={artifact.title}>
                  <div className="artifact-card__top">
                    <span>{artifact.eyebrow}</span>
                    <span>{artifact.tag}</span>
                  </div>
                  <h3>{artifact.title}</h3>
                  <p>{artifact.description}</p>
                  <ul>
                    {artifact.details.map(([left, right]) => (
                      <li key={left}>
                        <span>{left}</span>
                        <span>{right}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/cases/${artifact.slug}`}>查看这一页的展开方式</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--contact" id="contact">
          <div className="contact-layout">
            <article className="contact-card js-panel">
              <span className="section-tag">Next Move</span>
              <h2>如果你要把这个站继续做高，下一步就该拆详情页了。</h2>
              <p>
                现在首页已经具备了知识品牌首页的气质。接下来最值得补的是：每个模块的独立详情页、样章预览、案例切片和咨询入口。这样用户从看到品牌，到理解你的方法，再到进入合作，就会是一条完整链路。
              </p>

              <div className="contact-card__list">
                <div>
                  <strong>详情页拆分</strong>
                  <span>为每个模块建立独立页面，承接更深内容与转化。</span>
                  <em>High Priority</em>
                </div>
                <div>
                  <strong>案例样章</strong>
                  <span>用真实材料和切片证明你的判断力，而不是只做概念陈述。</span>
                  <em>Trust Layer</em>
                </div>
                <div>
                  <strong>合作入口</strong>
                  <span>补入微信、邮箱、表单或咨询流程，让品牌入口真正可以承接需求。</span>
                  <em>Conversion</em>
                </div>
              </div>
            </article>

            <aside className="quote-card js-panel">
              <strong>Brand Sentence</strong>
              <blockquote>专业感让人留下，审美让人记住，系统化才让人愿意进入。</blockquote>
              <p>这次不再只是换皮，而是把网站升级成真正可以继续扩张的视觉与工程系统。</p>
              <footer>Chazz Atelier / Foreign Patent x AI</footer>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
