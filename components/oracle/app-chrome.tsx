import Link from "next/link";
import { logoutAction } from "@/app/actions";
import styles from "./workspace.module.css";

type AppChromeProps = {
  viewerName: string;
  viewerHandle: string;
  heading: string;
  subheading: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
};

export function AppChrome({
  viewerName,
  viewerHandle,
  heading,
  subheading,
  backHref,
  backLabel,
  children
}: AppChromeProps) {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>O</span>
            <div>
              <strong>命理档案</strong>
              <span>{viewerName}</span>
            </div>
          </div>
          <div className={styles.viewerMeta}>{viewerHandle}</div>
        </div>

        <div className={styles.headerActions}>
          {backHref && backLabel ? (
            <Link className={styles.ghostButton} href={backHref}>
              {backLabel}
            </Link>
          ) : null}
          <Link className={styles.ghostButton} href="/archive">
            档案首页
          </Link>
          <form action={logoutAction}>
            <button className={styles.primaryButton} type="submit">
              退出
            </button>
          </form>
        </div>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>个人命簿</p>
        <h1>{heading}</h1>
        <p>{subheading}</p>
      </section>

      {children}
    </main>
  );
}
