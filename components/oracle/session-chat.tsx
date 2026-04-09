"use client";

import { FormEvent, KeyboardEvent, startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import styles from "./workspace.module.css";
import { cleanOracleLine, lineHasOracleBoilerplate, stripOracleBlockMarker } from "@/lib/oracle/text";
import { stageLabel } from "@/lib/oracle/profile";
import type { OracleMessageRecord, OracleSessionStage } from "@/lib/oracle/types";

type SessionChatProps = {
  sessionId: string;
  initialMessages: OracleMessageRecord[];
  initialStage: OracleSessionStage;
  enabled: boolean;
};

type ChatState = {
  messages: OracleMessageRecord[];
  stage: OracleSessionStage;
};

type OracleTextBlock = {
  type: "heading" | "paragraph" | "list" | "quote";
  text: string;
};

function isBareSectionTitle(value: string) {
  return (
    value.length <= 18 &&
    !/[。！？；，、,;!?：:]/.test(value) &&
    /^(?:档案|信息|确认|排盘|四柱|命局|格局|喜用神|用神|忌神|大运|流年|性情|事业|财运|婚恋|健康|校准|简断|判断|建议|下一步)/.test(value)
  );
}

function parseOracleText(value: string): OracleTextBlock[] {
  return value
    .split(/\r?\n/)
    .map((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || /^[-_*]{3,}$/.test(trimmedLine) || lineHasOracleBoilerplate(trimmedLine)) {
        return null;
      }

      const headingMatch = trimmedLine.match(/^#{1,6}\s+(.+)/);
      const quoteMatch = trimmedLine.match(/^>\s+(.+)/);
      const listMatch = trimmedLine.match(/^(?:[-*+]|\d+[.)]|[一二三四五六七八九十]{1,3}[、.])\s+(.+)/);
      const text = cleanOracleLine(stripOracleBlockMarker(trimmedLine));

      if (!text) {
        return null;
      }

      if (headingMatch) {
        return { type: "heading", text } satisfies OracleTextBlock;
      }

      if (quoteMatch) {
        return { type: "quote", text } satisfies OracleTextBlock;
      }

      if (listMatch) {
        return { type: "list", text } satisfies OracleTextBlock;
      }

      if (isBareSectionTitle(text)) {
        return { type: "heading", text } satisfies OracleTextBlock;
      }

      return { type: "paragraph", text } satisfies OracleTextBlock;
    })
    .filter((block): block is OracleTextBlock => Boolean(block));
}

function MessageContent({ content }: { content: string }) {
  const blocks = parseOracleText(content);

  if (blocks.length === 0) {
    return <p className={styles.messageParagraph}>{cleanOracleLine(content)}</p>;
  }

  return (
    <div className={styles.messageContent}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3 className={styles.messageHeading} key={`${block.type}-${index}`}>
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <p className={styles.messageList} key={`${block.type}-${index}`}>
              {block.text}
            </p>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote className={styles.messageQuote} key={`${block.type}-${index}`}>
              {block.text}
            </blockquote>
          );
        }

        return (
          <p className={styles.messageParagraph} key={`${block.type}-${index}`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export function SessionChat({ sessionId, initialMessages, initialStage, enabled }: SessionChatProps) {
  const [state, setState] = useState<ChatState>({
    messages: initialMessages,
    stage: initialStage
  });
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deferredMessages = useDeferredValue(state.messages);
  const timelineEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ block: "end" });
  }, [busy, deferredMessages.length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = draft.trim();

    if (!content || busy || !enabled) {
      return;
    }

    const optimisticMessage: OracleMessageRecord = {
      id: `local-${Date.now()}`,
      session_id: sessionId,
      user_id: "local-user",
      role: "user",
      content,
      metadata: null,
      created_at: new Date().toISOString()
    };

    setDraft("");
    setError(null);
    setState((current) => ({
      ...current,
      messages: [...current.messages, optimisticMessage]
    }));
    setBusy(true);

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sessionId,
            message: content
          })
        });

        const payload = (await response.json()) as {
          error?: string;
          stage?: OracleSessionStage;
          assistantMessage?: OracleMessageRecord;
        };

        if (!response.ok || !payload.assistantMessage || !payload.stage) {
          throw new Error(payload.error || "AI 会话暂时不可用。");
        }

        setState((current) => ({
          stage: payload.stage!,
          messages: [...current.messages, payload.assistantMessage!]
        }));
      } catch (submitError) {
        const nextError = submitError instanceof Error ? submitError.message : "发送失败，请稍后再试。";
        setError(nextError);
      } finally {
        setBusy(false);
      }
    });
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className={styles.chatWrap}>
      <div className={styles.chatHeader}>
        <div>
          <span className={styles.panelEyebrow}>命理会话</span>
          <strong>所有追问都会留在当前档案</strong>
        </div>
        <div className={styles.stagePill}>{stageLabel(state.stage)}</div>
      </div>

      <div aria-busy={busy} aria-live="polite" className={styles.chatTimeline}>
        {deferredMessages.map((message) => (
          <article
            className={message.role === "assistant" ? styles.assistantBubble : styles.userBubble}
            key={message.id}
          >
            <div className={styles.messageHeader}>
              <span>{message.role === "assistant" ? "命理师" : "你"}</span>
            </div>
            <MessageContent content={message.content} />
          </article>
        ))}

        {busy ? (
          <article className={`${styles.assistantBubble} ${styles.thinkingBubble}`}>
            <div className={styles.messageHeader}>
              <span>命理师</span>
            </div>
            <div className={styles.thinkingLine}>
              <span>推演中</span>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </div>
          </article>
        ) : null}

        <div ref={timelineEndRef} />
      </div>

      {error ? <p className={styles.alertError}>{error}</p> : null}

      <form className={styles.chatComposer} onSubmit={handleSubmit}>
        <textarea
          disabled={!enabled || busy}
          name="message"
          onKeyDown={handleComposerKeyDown}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={enabled ? "写下要确认的信息，或追问某一步判断。按 ⌘ + Enter 发送。" : "模型尚未接入，暂时只能查看归档。"}
          rows={4}
          value={draft}
        />
        <button className={styles.primaryButton} disabled={!enabled || busy || draft.trim().length === 0} type="submit">
          {busy ? "等待回文" : "发送"}
        </button>
      </form>
    </div>
  );
}
