import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artifacts, getArtifactBySlug } from "@/data/site-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return artifacts.map((artifact) => ({
    slug: artifact.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);

  if (!artifact) {
    return {};
  }

  return {
    title: `${artifact.title} | Chazz Atelier`,
    description: artifact.description
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);

  if (!artifact) {
    notFound();
  }

  return (
    <main className="detail-page detail-page--case">
      <div className="detail-page__hero">
        <div className="detail-page__hero-bg detail-page__hero-bg--case" aria-hidden="true" />
        <div className="detail-page__hero-grid" aria-hidden="true" />
        <div className="detail-page__hero-inner">
          <div className="detail-page__eyebrow-row">
            <Link className="detail-back" href="/">
              返回首页
            </Link>
            <span className="section-tag">{artifact.eyebrow}</span>
          </div>

          <div className="detail-page__hero-copy detail-page__hero-copy--case">
            <div>
              <span className="detail-page__pill">{artifact.tag}</span>
              <h1>{artifact.title}</h1>
              <p>{artifact.longDescription}</p>
            </div>

            <div className="detail-case__signal">
              <strong>Case Intent</strong>
              <p>案例切片页的任务不是展示资料数量，而是让用户一眼看见你的判断路径、表达控制和方法深度。</p>
            </div>
          </div>
        </div>
      </div>

      <section className="detail-section">
        <div className="detail-section__inner">
          <div className="detail-section__header">
            <div>
              <span className="section-tag">Case Structure</span>
              <h2>这类页面最适合承载的三层内容。</h2>
            </div>
            <p>案例页应该同时满足阅读感、专业感和可转化性。它既是一页内容，也是一页能力证明。</p>
          </div>

          <div className="detail-case__grid">
            <article className="detail-card">
              <span className="detail-card__index">01</span>
              <h3>文件与争点</h3>
              <p>把原始文件、关键段落和争点提炼并列展示，让读者先建立上下文，再看你的判断方式。</p>
            </article>
            <article className="detail-card">
              <span className="detail-card__index">02</span>
              <h3>术语与风险</h3>
              <p>重点展示措辞取舍、翻译边界和可能的表达风险，这是最能体现专业性的层。</p>
            </article>
            <article className="detail-card">
              <span className="detail-card__index">03</span>
              <h3>成稿路径</h3>
              <p>最终落到你的成稿逻辑、结构设计和策略意图，让页面看起来像工作方法而不是知识笔记。</p>
            </article>
          </div>
        </div>
      </section>

      <section className="detail-section detail-section--related">
        <div className="detail-layout">
          <aside className="detail-sidebar">
            <div className="detail-sidebar__panel">
              <span className="section-tag">Highlights</span>
              <h2>这一页最应该被看见的内容。</h2>
              <ul className="detail-list">
                {artifact.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="detail-content">
            <article className="detail-card">
              <span className="section-tag">Expandable Blocks</span>
              <h2>你可以继续把它扩成真正的样章页。</h2>
              <p>{artifact.description}</p>
              <div className="detail-table">
                {artifact.details.map(([left, right]) => (
                  <div key={left}>
                    <span>{left}</span>
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="detail-card detail-card--cta">
              <span className="section-tag">Next Layer</span>
              <h2>下一步是把真实案例、图示和样章放进来。</h2>
              <p>当前这一版已经把内容结构、品牌气质和高视觉站点架构搭好了。继续往上做，就可以开始接入真实案例素材、章节图示、下载样章和咨询入口。</p>
              <div className="detail-card__actions">
                <Link href="/#contact">回到合作入口</Link>
                <Link href="/modules/execution">查看相关模块</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
