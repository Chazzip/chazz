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
  const [navCondensed, setNavCondensed] = useState(false);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.fromTo(
          ".js-fade",
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.08,
            ease: "power3.out"
          }
        );

        gsap.utils.toArray<HTMLElement>(".js-surface").forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 86%"
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
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(".hero-stage-shell", {
          yPercent: -7,
          rotationZ: -1.8,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(".hero-ribbon__track", {
          xPercent: -50,
          duration: 18,
          ease: "none",
          repeat: -1
        });
      } else {
        gsap.set(".progress-fill", { scaleX: 1 });
      }
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavCondensed(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
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
        threshold: 0.42,
        rootMargin: "-14% 0px -44% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleHashClick = () => setMenuOpen(false);
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".mobile-panel a"));

    links.forEach((link) => link.addEventListener("click", handleHashClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleHashClick));
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });

    if (reduceMotion) {
      return () => window.removeEventListener("pointermove", updatePointer);
    }

    const magneticTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const tiltTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));

    const magneticCleanups = magneticTargets.map((element) => {
      const handleMove = (event: PointerEvent) => {
        const bounds = element.getBoundingClientRect();
        const x = event.clientX - bounds.left - bounds.width / 2;
        const y = event.clientY - bounds.top - bounds.height / 2;

        gsap.to(element, {
          x: x * 0.12,
          y: y * 0.12,
          duration: 0.35,
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

    const tiltCleanups = tiltTargets.map((element) => {
      const handleMove = (event: PointerEvent) => {
        const bounds = element.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

        gsap.to(element, {
          rotateX: offsetY * -8,
          rotateY: offsetX * 12,
          transformPerspective: 1600,
          transformOrigin: "center center",
          duration: 0.42,
          ease: "power3.out"
        });
      };

      const handleLeave = () => {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.55,
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
      window.removeEventListener("pointermove", updatePointer);
      magneticCleanups.forEach((cleanup) => cleanup());
      tiltCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="page-shell" ref={rootRef}>
      <div className="ambient-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />
      <div className="progress-rail" aria-hidden="true">
        <div className="progress-fill" />
      </div>

      <header className="topbar-shell">
        <div className={`topbar${navCondensed ? " is-condensed" : ""}`}>
          <a className="brand" href="#top">
            <span className="brand__mark" aria-hidden="true">
              <span />
            </span>
            <span className="brand__copy">
              <strong>Chazz Atelier</strong>
              <span>Knowledge Architecture for Foreign Patent Practice</span>
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
            <Link className="button button--ghost" href="/modules">
              浏览结构页
            </Link>
            <a className="button button--primary" data-magnetic href="#contact">
              预约一次沟通
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
          <Link className="button button--ghost" href="/cases">
            查看案例原型
          </Link>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero__mesh" aria-hidden="true" />
          <div className="hero__wash" aria-hidden="true" />

          <div className="hero__inner">
            <div className="hero-copy js-fade">
              <span className="eyebrow-pill">Independent Knowledge Atelier / 2026</span>
              <h1>
                把知识网站，
                <br />
                做成像一件
                <em> 产品级作品 </em>
                一样成立。
              </h1>
              <p className="hero-copy__lead">
                这次不再依赖任何旧图片，也不走惯常的深色概念页套路。新的方向更像高级硬件发布页与前沿工作室首页的结合体:
                冷静、锋利、克制，但每一次滚动都能感到层次、光线与系统感。
              </p>

              <div className="hero-copy__actions">
                <a className="button button--primary" data-magnetic href="#matrix">
                  进入视觉体系
                </a>
                <Link className="button button--ghost" href="/cases">
                  看内页原型
                </Link>
              </div>

              <div className="hero-copy__chips">
                <span>Glass Surfaces</span>
                <span>Spatial Motion</span>
                <span>Editorial Rhythm</span>
              </div>

              <div className="hero-copy__signals">
                <article className="js-surface" data-tilt>
                  <strong>Atmosphere</strong>
                  <p>用气氛建立第一印象，而不是先堆信息。</p>
                </article>
                <article className="js-surface" data-tilt>
                  <strong>Precision</strong>
                  <p>每个间距、层级和动效都像产品界面而不是模板页面。</p>
                </article>
                <article className="js-surface" data-tilt>
                  <strong>Restraint</strong>
                  <p>高级感来自克制，不来自过量装饰。</p>
                </article>
              </div>
            </div>

            <div className="hero-stage js-fade">
              <div className="hero-stage__card hero-stage__card--north js-surface" data-tilt>
                <span>Visual Thesis</span>
                <p>像苹果那样用秩序与材质说服用户，而不是用噪音抢眼球。</p>
              </div>

              <div className="hero-stage-shell js-surface" data-tilt>
                <div className="hero-stage__spec hero-stage__spec--left">
                  <span>Motion</span>
                  <strong>GSAP</strong>
                  <p>滚动、视差、磁吸与节奏控制。</p>
                </div>

                <div className="hero-stage__visual">
                  <HeroScene />
                </div>

                <div className="hero-stage__spec hero-stage__spec--right">
                  <span>Spatial</span>
                  <strong>R3F</strong>
                  <p>用空间装置建立记忆，而不是背景插图。</p>
                </div>

                <div className="hero-stage__footer">
                  <div>
                    <span>System Layer</span>
                    <strong>Image-free Visual Identity</strong>
                  </div>
                  <div>
                    <span>Product Feel</span>
                    <strong>Premium, silent, exact</strong>
                  </div>
                </div>
              </div>

              <div className="hero-stage__card hero-stage__card--south js-surface" data-tilt>
                <span>Interface Note</span>
                <p>白底雾面、金属边缘、半透明玻璃和柔和光晕一起，形成比“科技感”更高级的产品感。</p>
              </div>
            </div>
          </div>

          <div className="hero-ribbon" aria-hidden="true">
            <div className="hero-ribbon__track">
              <span>Knowledge Systems</span>
              <span>Visual Restraint</span>
              <span>Product-Grade Motion</span>
              <span>Quiet Luxury Interface</span>
              <span>Knowledge Systems</span>
              <span>Visual Restraint</span>
              <span>Product-Grade Motion</span>
              <span>Quiet Luxury Interface</span>
            </div>
          </div>
        </section>

        <section className="section" id="positioning">
          <div className="section-shell">
            <div className="section-head js-fade">
              <div>
                <span className="section-tag">Positioning</span>
                <h2>高级网站先给人判断，再给人内容。</h2>
              </div>
              <p>
                视觉不是附加层，而是你被理解的第一层结构。新的首页先建立“这个人有判断力”的感受，再引导用户进入模块、路径和案例。
              </p>
            </div>

            <div className="editorial-grid">
              <article className="manifesto-card js-surface" data-tilt>
                <span className="manifesto-card__label">Creative Direction</span>
                <h3>更接近高级产品发布页，不像课程站，也不像资料站。</h3>
                <p>
                  这版把调性从“展示很多内容”改成“展示成熟的秩序感”。光效、材质、留白和节奏全部围绕一个目标:
                  让站点自身先像作品。
                </p>
              </article>

              <div className="signal-grid">
                {signals.map((signal) => (
                  <article className="signal-card js-surface" data-tilt key={signal.eyebrow}>
                    <span>{signal.eyebrow}</span>
                    <strong>{signal.value}</strong>
                    <p>{signal.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="matrix">
          <div className="section-shell">
            <div className="section-head js-fade">
              <div>
                <span className="section-tag">Knowledge Matrix</span>
                <h2>让每一块内容都像被精密装配进系统。</h2>
              </div>
              <p>
                首页不需要提前讲完所有内容，但需要先给出足够清晰的结构骨架。模块化呈现比冗长介绍更有高级感，也更能承接后续扩展。
              </p>
            </div>

            <div className="module-grid">
              {modules.map((module) => (
                <article className="module-card js-surface" data-tilt key={module.slug}>
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
                  <Link href={`/modules/${module.slug}`}>查看这一模块</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--path" id="path">
          <div className="path-layout">
            <aside className="path-intro js-fade">
              <span className="section-tag">Method Path</span>
              <h2>交互节奏不是点缀，而是叙事本身。</h2>
              <p>
                从首屏情绪建立，到知识结构展开，再到案例与合作入口，整个页面应该像一段被精密编排的路径，而不是一串被动滚过去的区块。
              </p>
              <a className="button button--primary" data-magnetic href="#contact">
                看最终转化层
              </a>
            </aside>

            <div className="path-steps">
              {pathSteps.map((step) => (
                <article className="path-step js-surface" data-tilt key={step.label}>
                  <span>{step.label}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="artifacts">
          <div className="section-shell">
            <div className="section-head js-fade">
              <div>
                <span className="section-tag">Artifacts</span>
                <h2>真正撑起品牌可信度的，是后续内容资产层。</h2>
              </div>
              <p>
                当前先把网站做成成立的视觉容器。后续再往里填样章、案例和方法论时，整站不会像内容堆积，而会像一个精心策划过的知识产品。
              </p>
            </div>

            <div className="artifact-grid">
              {artifacts.map((artifact) => (
                <article className="artifact-card js-surface" data-tilt key={artifact.slug}>
                  <div className="artifact-card__top">
                    <span>{artifact.eyebrow}</span>
                    <span>{artifact.tag}</span>
                  </div>
                  <h3>{artifact.title}</h3>
                  <p>{artifact.longDescription}</p>
                  <ul>
                    {artifact.details.map(([left, right]) => (
                      <li key={left}>
                        <span>{left}</span>
                        <span>{right}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/cases/${artifact.slug}`}>打开这一页原型</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--contact" id="contact">
          <div className="contact-layout">
            <article className="contact-card js-surface" data-tilt>
              <span className="section-tag">Contact Layer</span>
              <h2>下一步不是加更多块，而是让每个块都值得被记住。</h2>
              <p>
                这版先把审美、材质、动效和内页骨架统一起来。接下来继续推进时，最有价值的是做真实案例切片、样章预览和更完整的合作入口。
              </p>

              <div className="contact-card__list">
                <div>
                  <strong>Case Slices</strong>
                  <span>用真实材料承接视觉信任。</span>
                </div>
                <div>
                  <strong>Sample Chapters</strong>
                  <span>让知识结构不只停留在首页感受。</span>
                </div>
                <div>
                  <strong>Private Inquiry</strong>
                  <span>把高端表达转成真正的合作界面。</span>
                </div>
              </div>
            </article>

            <aside className="quote-card js-surface" data-tilt>
              <span className="quote-card__label">Brand Sentence</span>
              <blockquote>不是把页面做得更满，而是把每个像素都做得更准。</blockquote>
              <p>这是一个不依赖旧图、不依赖模板、不靠堆装饰的全新方向。</p>
              <footer>Chazz Atelier / Visual rebuild 2026</footer>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
