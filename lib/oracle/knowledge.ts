import { readFile } from "node:fs/promises";
import path from "node:path";
import type { OracleMessageRecord, OracleProfileRecord } from "@/lib/oracle/types";
import { getMissingProfileSteps } from "@/lib/oracle/profile";

type KnowledgeSource = {
  id: string;
  title: string;
  path: string;
  triggers: RegExp[];
  maxChars: number;
};

const knowledgeRoot = path.join(process.cwd(), "content", "oracle-knowledge", "references");

const sources: KnowledgeSource[] = [
  {
    id: "shichen-table",
    title: "时辰、早晚子时、日上起时法",
    path: "shichen-table.md",
    triggers: [/时辰|出生时间|几点|早上|上午|中午|下午|晚上|夜里|半夜|子时|丑时|寅时|卯时|辰时|巳时|午时|未时|申时|酉时|戌时|亥时/],
    maxChars: 5200
  },
  {
    id: "wuxing-tables",
    title: "五行、干支、十神、藏干、长生",
    path: "wuxing-tables.md",
    triggers: [/五行|天干|地支|干支|十神|藏干|长生|冲|合|刑|害|日主|身旺|身弱|比肩|劫财|食神|伤官|正财|偏财|正官|七杀|正印|偏印/],
    maxChars: 9000
  },
  {
    id: "dayun-rules",
    title: "大运顺逆、起运、流年",
    path: "dayun-rules.md",
    triggers: [/大运|起运|流年|今年|明年|年份|换运|顺排|逆排|节气|立春|惊蛰|清明|立夏|芒种|小暑|立秋|白露|寒露|立冬|大雪|小寒/],
    maxChars: 7000
  },
  {
    id: "classical-texts",
    title: "经典命理典籍摘要、格局、调候、用神",
    path: "classical-texts.md",
    triggers: [/穷通|三命|滴天髓|渊海|子平|神峰|格局|调候|用神|喜神|忌神|旺衰|得令|得地|得势|通关|从格|正官格|七杀格|财格|印格|食神格|伤官格|命宫|神煞|贵人|桃花|驿马|华盖/],
    maxChars: 10000
  }
];

function latestUserText(messages: OracleMessageRecord[]) {
  return [...messages]
    .reverse()
    .find((message) => message.role === "user")
    ?.content ?? "";
}

function profileNeedsIntakeKnowledge(profile: OracleProfileRecord) {
  const missing = getMissingProfileSteps(profile).map((step) => step.key);

  return {
    needsBirthTime: missing.includes("birth_time"),
    needsBirthday: missing.includes("birthday"),
    needsCoreChart: missing.length === 0
  };
}

function selectSources(profile: OracleProfileRecord, messages: OracleMessageRecord[]) {
  const userText = latestUserText(messages);
  const needs = profileNeedsIntakeKnowledge(profile);
  const selected = new Set<string>();

  if (needs.needsBirthTime || profile.birth_time_text || profile.shichen) {
    selected.add("shichen-table");
  }

  if (needs.needsBirthday || needs.needsCoreChart) {
    selected.add("wuxing-tables");
  }

  for (const source of sources) {
    if (source.triggers.some((trigger) => trigger.test(userText))) {
      selected.add(source.id);
    }
  }

  if (/确认排盘|排盘|四柱|命盘|综合|分析/.test(userText) || needs.needsCoreChart) {
    selected.add("wuxing-tables");
    selected.add("dayun-rules");
    selected.add("classical-texts");
  }

  return sources.filter((source) => selected.has(source.id)).slice(0, 4);
}

async function readKnowledgeSource(source: KnowledgeSource) {
  const content = await readFile(path.join(knowledgeRoot, source.path), "utf8");
  const trimmed = content.replace(/\r\n/g, "\n").trim();
  const body = trimmed.length > source.maxChars ? `${trimmed.slice(0, source.maxChars).trim()}\n\n[本文件已按本轮问题截断。]` : trimmed;

  return [`<knowledge id="${source.id}" title="${source.title}">`, body, "</knowledge>"].join("\n");
}

export async function getOracleKnowledgeContext(profile: OracleProfileRecord, messages: OracleMessageRecord[]) {
  const selectedSources = selectSources(profile, messages);

  if (selectedSources.length === 0) {
    return "本轮信息采集不需要额外典籍材料。";
  }

  const blocks = await Promise.all(selectedSources.map((source) => readKnowledgeSource(source)));

  return [
    "以下是本轮命理会话可以参考的仓库内知识文件。它们是参考材料，不是必须逐字复述的内容。",
    "使用要求：先消化规则，再用自然中文答复；不要暴露 XML 标签、文件路径或“知识库检索”这类后台措辞。",
    ...blocks
  ].join("\n\n");
}
