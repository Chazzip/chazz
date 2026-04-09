import Link from "next/link";
import { redirect } from "next/navigation";
import { createSessionAction, saveProfileAction } from "@/app/actions";
import { AppChrome } from "@/components/oracle/app-chrome";
import styles from "@/components/oracle/workspace.module.css";
import { hasAIEnv, hasSupabaseEnv } from "@/lib/env";
import { getArchiveData } from "@/lib/oracle/data";
import { buildProfileSummary, formatSessionTime, getMissingProfileSteps, getProfileCompletion, stageLabel } from "@/lib/oracle/profile";
import { toPlainOraclePreview } from "@/lib/oracle/text";

type ArchivePageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

function SetupState() {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.setupState}>
        <p className={styles.eyebrow}>档案库未接入</p>
        <h1>还不能进入个人命簿。</h1>
        <p>本地环境变量和数据库表还没有准备好。接好之后，注册、建档、会话归档才会开放。</p>
        <Link className={styles.primaryButton} href="/">
          返回首页
        </Link>
      </section>
    </main>
  );
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (!hasSupabaseEnv()) {
    return <SetupState />;
  }

  const data = await getArchiveData();

  if (!data?.user || !data.account || !data.profile) {
    redirect("/login");
  }

  const { user, account, profile, sessions } = data;
  const profileCompletion = getProfileCompletion(profile);
  const missingSteps = getMissingProfileSteps(profile);
  const viewerName = account.display_name || profile.full_name || "命理来访者";
  const viewerHandle = account.login_id ? `ID / ${account.login_id}` : "ID / 未设置";

  return (
    <AppChrome
      heading="命盘主档案"
      subheading="先建档，再排盘。之后每一次命理会话都会沉到这份档案下。"
      viewerHandle={viewerHandle}
      viewerName={viewerName}
    >
      {resolvedSearchParams?.error ? <p className={styles.alertError}>{resolvedSearchParams.error}</p> : null}
      {resolvedSearchParams?.success ? <p className={styles.alertSuccess}>{resolvedSearchParams.success}</p> : null}
      {!hasAIEnv() ? (
        <p className={styles.alertMuted}>命理模型尚未接入。账号、档案和归档可以使用，新的问命会话暂时不会回文。</p>
      ) : null}

      <section className={styles.dashboardGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span className={styles.panelEyebrow}>主档案</span>
              <h2>建立属于这个账户的命盘档</h2>
            </div>
            <div className={styles.progressBadge}>{profileCompletion}%</div>
          </div>

          <form action={saveProfileAction} className={styles.formGrid}>
            <input name="profileId" type="hidden" value={profile.id} />

            <label className={styles.field}>
              <span>姓名</span>
              <input defaultValue={profile.full_name || ""} name="fullName" placeholder="例如：张三" type="text" />
            </label>

            <label className={styles.field}>
              <span>曾用名 / 改名时间</span>
              <textarea
                defaultValue={profile.former_name_note || ""}
                name="formerNameNote"
                placeholder="如无曾用名，请直接填写“无”。"
                rows={3}
              />
            </label>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>阳历生日</span>
                <input defaultValue={profile.solar_birthday || ""} name="solarBirthday" type="date" />
              </label>

              <label className={styles.field}>
                <span>农历生日</span>
                <input
                  defaultValue={profile.lunar_birthday_text || ""}
                  name="lunarBirthdayText"
                  placeholder="例如：1992年闰四月初八"
                  type="text"
                />
              </label>
            </div>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>出生时间</span>
                <input
                  defaultValue={profile.birth_time_text || ""}
                  name="birthTimeText"
                  placeholder="例如：07:32 / 夜里 / 下午"
                  type="text"
                />
              </label>

              <label className={styles.field}>
                <span>时辰</span>
                <input defaultValue={profile.shichen || ""} name="shichen" placeholder="例如：辰时" type="text" />
              </label>
            </div>

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>性别</span>
                <select defaultValue={profile.gender || ""} name="gender">
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>出生地</span>
                <input
                  defaultValue={profile.birth_location || ""}
                  name="birthLocation"
                  placeholder="例如：辽宁省丹东市"
                  type="text"
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>备注</span>
              <textarea
                defaultValue={profile.notes || ""}
                name="notes"
                placeholder="可以记录边界情况，例如节气交界、出生时间不确定等。"
                rows={4}
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              保存档案
            </button>
          </form>
        </article>

        <aside className={styles.sidebar}>
          <article className={styles.panel}>
            <span className={styles.panelEyebrow}>建档进度</span>
            <h3>档案完成度</h3>
            <div className={styles.progressBar}>
              <div style={{ width: `${profileCompletion}%` }} />
            </div>
            {missingSteps.length > 0 ? (
              <ul className={styles.plainList}>
                {missingSteps.map((step) => (
                  <li key={step.key}>{step.label}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.panelText}>主档案字段已经足够进入确认排盘阶段。</p>
            )}
          </article>

          <article className={styles.panel}>
            <span className={styles.panelEyebrow}>当前摘要</span>
            <h3>当前摘要</h3>
            <pre className={styles.summaryBlock}>{buildProfileSummary(profile)}</pre>
          </article>
        </aside>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <span className={styles.panelEyebrow}>问命记录</span>
            <h2>会话全部发生在这份档案下</h2>
          </div>

          <form action={createSessionAction}>
            <input name="profileId" type="hidden" value={profile.id} />
            <button className={styles.primaryButton} type="submit">
              开启新的命理会话
            </button>
          </form>
        </div>

        {sessions.length === 0 ? (
          <p className={styles.emptyState}>还没有开始任何会话。先保存档案，再发起第一轮信息采集或排盘确认。</p>
        ) : (
          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <Link className={styles.sessionCard} href={`/archive/sessions/${session.id}`} key={session.id}>
                <div>
                  <span>{stageLabel(session.stage)}</span>
                  <h3>{session.title}</h3>
                </div>
                <p>{session.last_message_preview ? toPlainOraclePreview(session.last_message_preview) : "进入后继续查看完整会话。"}</p>
                <small>{formatSessionTime(session)}</small>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppChrome>
  );
}
