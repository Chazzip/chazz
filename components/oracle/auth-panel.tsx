import Link from "next/link";
import { signInAction, signUpAction } from "@/app/actions";
import styles from "./auth-panel.module.css";

type AuthPanelProps = {
  mode: "login" | "signup";
  enabled: boolean;
  error?: string;
  success?: string;
};

export function AuthPanel({ mode, enabled, error, success }: AuthPanelProps) {
  const isLogin = mode === "login";
  const title = isLogin ? "返回你的命盘档案室" : "给这份命簿起一个入口";
  const description = isLogin
    ? "输入你设定过的登录 ID 和密码。这里不需要邮箱。"
    : "设定一个登录 ID 和密码。请认真记住；后续的档案、排盘和追问都从这个 ID 进入。";

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.copy}>
          <Link className={styles.backLink} href="/">
            返回首页
          </Link>
          <p className={styles.eyebrow}>{isLogin ? "ID 登录" : "建立入口"}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <section className={styles.panel}>
          {error ? <p className={styles.alertError}>{error}</p> : null}
          {success ? <p className={styles.alertSuccess}>{success}</p> : null}
          {!enabled ? (
            <p className={styles.alertMuted}>
              档案库尚未接入。补齐本地环境变量后，这里会开放登录。
            </p>
          ) : null}
          {!isLogin && enabled ? (
            <p className={styles.alertMuted}>
              不填邮箱。登录 ID 只允许小写字母、数字、下划线和短横线。请记住你的 ID 和密码。
            </p>
          ) : null}

          <form action={isLogin ? signInAction : signUpAction} className={styles.form}>
            {!isLogin ? (
              <label className={styles.field}>
                <span>称呼</span>
                <input autoComplete="nickname" name="displayName" placeholder="例如：南山 / Chazz" type="text" />
              </label>
            ) : null}

            <label className={styles.field}>
              <span>登录 ID</span>
              <input
                autoComplete="username"
                name="loginId"
                pattern="[a-z0-9][a-z0-9_-]{2,31}"
                placeholder="例如：nan_shan_01"
                required
                type="text"
              />
            </label>

            <label className={styles.field}>
              <span>密码</span>
              <input
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                name="password"
                placeholder="至少 8 位"
                required
                type="password"
              />
            </label>

            <button className={styles.primaryButton} disabled={!enabled} type="submit">
              {isLogin ? "用 ID 登录档案库" : "创建 ID 和主档案"}
            </button>
          </form>

          <p className={styles.switcher}>
            {isLogin ? "还没有账号？" : "已经有账号？"}
            <Link href={isLogin ? "/signup" : "/login"}>{isLogin ? "去注册" : "去登录"}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
