import { notFound, redirect } from "next/navigation";
import { AppChrome } from "@/components/oracle/app-chrome";
import { SessionChat } from "@/components/oracle/session-chat";
import styles from "@/components/oracle/workspace.module.css";
import { hasAIEnv, hasSupabaseEnv } from "@/lib/env";
import { getSessionData } from "@/lib/oracle/data";
import { buildProfileSummary, stageLabel } from "@/lib/oracle/profile";

type SessionPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const resolvedParams = await params;

  if (!hasSupabaseEnv()) {
    redirect("/archive");
  }

  const data = await getSessionData(resolvedParams.sessionId);

  if (!data?.user || !data.account || !data.profile) {
    redirect("/login");
  }

  if (!data.session) {
    notFound();
  }

  const { user, account, profile, session, messages } = data;
  const viewerName = account.display_name || profile.full_name || "命理来访者";
  const viewerHandle = account.login_id ? `ID / ${account.login_id}` : "ID / 未设置";

  return (
    <AppChrome
      backHref="/archive"
      backLabel="返回档案"
      heading={session.title}
      subheading="这里记录你的补充、追问、校准和每一次排盘判断。"
      viewerHandle={viewerHandle}
      viewerName={viewerName}
    >
      {!hasAIEnv() ? (
        <p className={styles.alertMuted}>命理模型尚未接入。当前只能查看已经归档的内容。</p>
      ) : null}

      <section className={styles.sessionGrid}>
        <section className={`${styles.panel} ${styles.chatPanel}`}>
          <div className={styles.panelHead}>
            <div>
              <span className={styles.panelEyebrow}>本次问命</span>
              <h2>把问题说具体，判断才会收束。</h2>
            </div>
          </div>

          <SessionChat
            enabled={hasAIEnv()}
            initialMessages={messages}
            initialStage={session.stage}
            sessionId={session.id}
          />
        </section>

        <aside className={`${styles.sidebar} ${styles.sessionSidebar}`}>
          <article className={styles.panel}>
            <span className={styles.panelEyebrow}>当前进度</span>
            <h3>{stageLabel(session.stage)}</h3>
            <p className={styles.panelText}>这是会话记录的工作状态。真正的判断以右侧对话里的排盘、校验和分析为准。</p>
          </article>

          <article className={styles.panel}>
            <span className={styles.panelEyebrow}>随身档案</span>
            <h3>{profile.full_name || profile.label}</h3>
            <pre className={styles.summaryBlock}>{buildProfileSummary(profile)}</pre>
          </article>
        </aside>
      </section>
    </AppChrome>
  );
}
