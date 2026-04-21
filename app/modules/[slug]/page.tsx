import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artifacts, getModuleBySlug, modules } from "@/data/site-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return modules.map((module) => ({
    slug: module.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    return {};
  }

  return {
    title: `${module.title} | Chazz Atelier`,
    description: module.description
  };
}

export default async function ModuleDetailPage({ params }: Props) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  const relatedCases = artifacts.slice(0, 2);

  return (
    <main className="detail-page">
      <div className="detail-page__hero">
        <div className="detail-page__hero-bg" aria-hidden="true" />
        <div className="detail-page__hero-grid" aria-hidden="true" />
        <div className="detail-page__hero-inner">
          <div className="detail-page__eyebrow-row">
            <Link className="detail-back" href="/">
              返回首页
            </Link>
            <span className="section-tag">{module.index}</span>
          </div>

          <div className="detail-page__hero-copy">
            <div>
              <span className="detail-page__pill">{module.tag}</span>
              <h1>{module.title}</h1>
              <p>{module.overview}</p>
            </div>

            <aside className="detail-page__metrics">
              {module.metrics.map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>

      <section className="detail-section">
        <div className="detail-layout">
          <aside className="detail-sidebar">
            <div className="detail-sidebar__panel">
              <span className="section-tag">Outcome</span>
              <h2>这一模块完成后，用户应该真正获得什么。</h2>
              <ul className="detail-list">
                {module.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>

            <div className="detail-sidebar__quote">
              <strong>Module Sentence</strong>
              <blockquote>{module.quote}</blockquote>
            </div>
          </aside>

          <div className="detail-content">
            <article className="detail-card">
              <span className="section-tag">Overview</span>
              <h2>模块结构</h2>
              <p>{module.description}</p>
              <ul className="detail-list">
                {module.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <div className="detail-stack">
              {module.sections.map((section, index) => (
                <article className="detail-card" key={section.title}>
                  <span className="detail-card__index">{`0${index + 1}`}</span>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section detail-section--related">
        <div className="detail-section__inner">
          <div className="detail-section__header">
            <div>
              <span className="section-tag">Related Cases</span>
              <h2>接下来最适合承接这个模块的案例切片。</h2>
            </div>
            <p>模块页负责定义结构，案例页负责证明判断。两者一起，才会真正构成有说服力的知识品牌。</p>
          </div>

          <div className="detail-related-grid">
            {relatedCases.map((artifact) => (
              <article className="detail-card" key={artifact.slug}>
                <span className="detail-page__pill">{artifact.tag}</span>
                <h3>{artifact.title}</h3>
                <p>{artifact.longDescription}</p>
                <Link href={`/cases/${artifact.slug}`}>查看案例切片</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
