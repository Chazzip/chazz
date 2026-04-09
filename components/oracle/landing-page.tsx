import Link from "next/link";
import styles from "./landing-page.module.css";

const principles = [
  {
    index: "01",
    title: "先有档案，再问命",
    body: "姓名、生日、时辰、出生地、校准记录先入档。之后每一次追问，都回到同一本命簿里。"
  },
  {
    index: "02",
    title: "一个 ID，一间私有档案室",
    body: "你只需要记住自己设定的登录 ID 和密码。进来以后，看到的就是自己的档案和会话。"
  },
  {
    index: "03",
    title: "说清楚，慢慢校准",
    body: "出生信息不完整时先补信息；时间有疑点时先标出来。命理判断需要上下文，不靠一句话硬断。"
  }
] as const;

const architecture = [
  ["入口", "登录 ID + 密码", "不要求填写邮箱。你自己设定入口，自己记住。"],
  ["主档", "个人命盘档案", "姓名、生日、时辰、出生地、备注和时间不确定性，先沉进同一份档案。"],
  ["会话", "按档案保存的追问", "排盘、校准、流年、用神、关系和事业问题，都挂在当前档案下。"],
  ["边界", "只读自己的记录", "每个登录入口只回到自己的档案室。别人的内容不会出现在你的命簿里。"]
] as const;

export function LandingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>O</span>
          <div>
            <strong>命理档案</strong>
            <span>长期保存你的排盘和追问</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <a href="#structure">如何使用</a>
          <a href="#stack">档案规则</a>
          <a href="#launch">开始</a>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.ghostButton} href="/login">
            登录
          </Link>
          <Link className={styles.primaryButton} href="/signup">
            创建账号
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>建档 / 排盘 / 校准 / 归档</p>
          <h1>把每一次问命，放回同一份命盘档案。</h1>
          <p className={styles.lead}>
            先建立自己的主档案，再进入命理会话。排盘、信息补充、历史事件校准、流年追问都会持续保存在你的档案之下。
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/signup">
              开始建档
            </Link>
            <Link className={styles.ghostButton} href="/archive">
              进入档案库
            </Link>
          </div>

          <dl className={styles.metrics}>
            <div>
              <dt>入口</dt>
              <dd>登录 ID + 密码</dd>
            </div>
            <div>
              <dt>档案</dt>
              <dd>出生信息、备注、校准记录</dd>
            </div>
            <div>
              <dt>会话</dt>
              <dd>围绕同一命盘持续追问</dd>
            </div>
          </dl>
        </div>

        <div className={styles.orbit} aria-hidden="true">
          <div className={styles.orbitCore}>
            <span>命</span>
          </div>
          <div className={styles.orbitRing} />
          <div className={styles.orbitRingSoft} />
          <div className={styles.orbitLabel} style={{ top: "10%", left: "50%" }}>
            档案
          </div>
          <div className={styles.orbitLabel} style={{ top: "49%", left: "4%" }}>
            排盘
          </div>
          <div className={styles.orbitLabel} style={{ top: "49%", right: "4%" }}>
            校准
          </div>
          <div className={styles.orbitLabel} style={{ bottom: "9%", left: "50%" }}>
            归档
          </div>
        </div>
      </section>

      <section className={styles.section} id="structure">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>使用顺序</p>
          <h2>先把生辰说准确，再谈结构、运势和选择。</h2>
        </div>

        <div className={styles.cardRow}>
          {principles.map((principle) => (
            <article className={styles.card} key={principle.index}>
              <span>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="stack">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>档案规则</p>
          <h2>这里不是一次性的占卜窗口，而是一间长期档案室。</h2>
          <p className={styles.sectionLead}>
            同一个人、同一份出生资料、同一组历史校准，应该在后续咨询里继续被使用。系统会按登录入口保存档案、会话和消息。
          </p>
        </div>

        <div className={styles.architectureTable}>
          {architecture.map(([label, value, description]) => (
            <div className={styles.architectureRow} key={label}>
              <strong>{label}</strong>
              <div>
                <b>{value}</b>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="launch">
        <div className={styles.launchCard}>
          <div>
            <p className={styles.eyebrow}>开始建档</p>
            <h2>如果你准备好了，先给自己的命簿设一个入口。</h2>
            <p>
              注册只需要登录 ID 和密码。进入档案室后，先补齐姓名、生日、时辰、出生地和必要备注，再开启第一段命理会话。
            </p>
          </div>

          <div className={styles.launchActions}>
            <Link className={styles.primaryButton} href="/signup">
              创建我的档案
            </Link>
            <Link className={styles.ghostButton} href="/login">
              查看登录流
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
