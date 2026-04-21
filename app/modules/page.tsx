import Link from "next/link";
import { modules } from "@/data/site-content";

export default function ModulesPage() {
  return (
    <main className="listing-page">
      <section className="listing-hero">
        <div className="listing-hero__bg" aria-hidden="true" />
        <div className="listing-hero__inner">
          <div className="detail-page__eyebrow-row">
            <Link className="detail-back" href="/">
              返回首页
            </Link>
            <span className="section-tag">Modules</span>
          </div>

          <div className="listing-hero__copy">
            <div>
              <span className="detail-page__pill">Knowledge Matrix</span>
              <h1>模块总览</h1>
              <p>这里承接首页的知识矩阵，把每个模块进一步展开成可以独立浏览的品牌内容页面。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="listing-section">
        <div className="listing-grid">
          {modules.map((module) => (
            <article className="module-card" key={module.slug}>
              <div className="module-card__top">
                <span>{module.index}</span>
                <b>{module.tag}</b>
              </div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <ul>
                {module.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={`/modules/${module.slug}`}>查看详情页</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
