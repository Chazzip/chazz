import { getAIConfig } from "@/lib/env";
import { buildOracleInstructions } from "@/lib/oracle/prompt";
import { getOracleKnowledgeContext } from "@/lib/oracle/knowledge";
import type { OracleMessageRecord, OracleProfileRecord } from "@/lib/oracle/types";

type ChatCompletionsPayload = {
  choices?: Array<{
    message?: {
      content?: string | null;
      reasoning_content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

function extractOutputText(payload: ChatCompletionsPayload) {
  const content = payload.choices?.[0]?.message?.content;
  return typeof content === "string" && content.trim().length > 0 ? content.trim() : null;
}

export async function generateOracleReply(profile: OracleProfileRecord, messages: OracleMessageRecord[]) {
  const config = getAIConfig();

  if (!config) {
    throw new Error("请先配置 DASHSCOPE_API_KEY，再启用命理对话。");
  }

  const knowledgeContext = await getOracleKnowledgeContext(profile, messages);

  const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: buildOracleInstructions(profile, knowledgeContext)
        },
        ...messages.slice(-20).map((message) => ({
          role: message.role,
          content: message.content
        }))
      ],
      stream: false,
      enable_thinking: config.enableThinking
    })
  });

  const payload = (await response.json()) as ChatCompletionsPayload;

  if (!response.ok) {
    throw new Error(payload.error?.message || "DashScope Chat Completions 调用失败。");
  }

  const text = extractOutputText(payload);

  if (!text) {
    throw new Error("模型返回了空响应。");
  }

  return text;
}
