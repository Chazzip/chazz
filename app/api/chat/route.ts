import { NextResponse } from "next/server";
import { generateOracleReply } from "@/lib/oracle/ai";
import { inferStage } from "@/lib/oracle/profile";
import { toPlainOraclePreview } from "@/lib/oracle/text";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { OracleMessageRecord, OracleProfileRecord, OracleSessionRecord } from "@/lib/oracle/types";

type ChatRequest = {
  sessionId?: string;
  message?: string;
};

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase 环境变量尚未配置。" }, { status: 503 });
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "登录状态已失效，请重新登录。" }, { status: 401 });
  }

  const body = (await request.json()) as ChatRequest;
  const sessionId = body.sessionId?.trim();
  const content = body.message?.trim();

  if (!sessionId || !content) {
    return NextResponse.json({ error: "缺少会话 ID 或消息内容。" }, { status: 400 });
  }

  const { data: sessionData, error: sessionError } = await supabase
    .from("oracle_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (sessionError || !sessionData) {
    return NextResponse.json({ error: sessionError?.message || "会话不存在。" }, { status: 404 });
  }

  const session = sessionData as OracleSessionRecord;

  const { data: profileData, error: profileError } = await supabase
    .from("oracle_profiles")
    .select("*")
    .eq("id", session.oracle_profile_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profileData) {
    return NextResponse.json({ error: profileError?.message || "关联档案不存在。" }, { status: 404 });
  }

  const profile = profileData as OracleProfileRecord;
  const { error: insertUserError } = await supabase.from("oracle_messages").insert({
    session_id: session.id,
    user_id: user.id,
    role: "user",
    content
  });

  if (insertUserError) {
    return NextResponse.json({ error: insertUserError.message }, { status: 500 });
  }

  const { data: historyData, error: historyError } = await supabase
    .from("oracle_messages")
    .select("*")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  if (historyError) {
    return NextResponse.json({ error: historyError.message }, { status: 500 });
  }

  const history = (historyData || []) as OracleMessageRecord[];

  try {
    const assistantText = await generateOracleReply(profile, history);
    const assistantPreview = toPlainOraclePreview(assistantText);
    const nextStage = inferStage(profile, assistantText);
    const createdAt = new Date().toISOString();

    const { data: assistantData, error: assistantError } = await supabase
      .from("oracle_messages")
      .insert({
        session_id: session.id,
        user_id: user.id,
        role: "assistant",
        content: assistantText
      })
      .select("*")
      .single();

    if (assistantError || !assistantData) {
      throw new Error(assistantError?.message || "写入 AI 回复失败。");
    }

    const { error: updateError } = await supabase
      .from("oracle_sessions")
      .update({
        stage: nextStage,
        last_message_preview: assistantPreview,
        last_message_at: createdAt
      })
      .eq("id", session.id)
      .eq("user_id", user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      stage: nextStage,
      assistantMessage: assistantData as OracleMessageRecord
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AI 调用失败。"
      },
      { status: 502 }
    );
  }
}
