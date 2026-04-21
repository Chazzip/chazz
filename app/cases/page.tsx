import Link from "next/link";
import { artifacts } from "@/data/site-content";

export default function CasesPage() {
  return (
    <main className="listing-page">
      <section className="listing-hero">
        <div className="listing-hero__bg listing-hero__bg--case" aria-hidden="true" />
        <div className="listing-hero__inner">
          <div className="detail-page__eyebrow-row">
            <Link className="detail-back" href="/">
              返回首页
            </Link>
            <span className="section-tag">Cases</span>
          </div>

          <div className="listing-hero__copy">
            <div>
              <span className="detail-page__pill">Content Artifacts</span>
              <h1>案例切片</h1>
              <p>案例页负责证明你的判断力。它们不是简单的内容页，而是把专业感转成可以被直接感知的证据层。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="listing-section">
        <div className="listing-grid listing-grid--cases">
          {artifacts.map((artifact) => (
            <article className="artifact-card" key={artifact.slug}>
              <div className="artifact-card__top">
                <span>{artifact.eyebrow}</span>
                <span>{artifact.tag}</span>
              </div>
              <h3>{artifact.title}</h3>
              <p>{artifact.longDescription}</p>
              <ul>
                {artifact.highlights.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                    <span>Highlight</span>
                  </li>
                ))}
              </ul>
              <Link href={`/cases/${artifact.slug}`}>查看展开页</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
