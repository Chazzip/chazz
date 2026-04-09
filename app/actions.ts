"use server";

import { redirect } from "next/navigation";
import {
  buildProfileUpdatePayload,
  getMissingProfileSteps,
  buildSessionSeedMessage,
  getInitialSessionStage
} from "@/lib/oracle/profile";
import { isValidLoginId, loginIdHelpText, loginIdToInternalEmail, normalizeLoginId } from "@/lib/oracle/login";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";
import type { OracleProfileRecord } from "@/lib/oracle/types";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function toQuery(pathname: string, key: "error" | "success", message: string) {
  return `${pathname}?${key}=${encodeURIComponent(message)}`;
}

function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit")) {
    return "确认邮件发送过于频繁。开发测试时请先在 Supabase 关闭邮箱确认，或配置自定义 SMTP 后再注册。";
  }

  if (normalized.includes("email not confirmed")) {
    return "这个账号还没有完成邮箱确认。请先点击确认邮件，或在 Supabase 开发环境里临时关闭邮箱确认。";
  }

  if (normalized.includes("invalid login credentials")) {
    return "登录 ID 或密码不正确。";
  }

  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return "这个登录 ID 已经注册过了，请直接登录。";
  }

  return message;
}

async function requireAuthedSupabase() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect(toQuery("/login", "error", "Supabase 环境变量尚未配置。"));
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function signInAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect(toQuery("/login", "error", "请先配置 Supabase 环境变量。"));
  }

  const loginId = normalizeLoginId(asString(formData.get("loginId")));
  const email = loginIdToInternalEmail(loginId);
  const password = asString(formData.get("password"));

  if (!isValidLoginId(loginId) || !password) {
    redirect(toQuery("/login", "error", "请输入正确的登录 ID 和密码。"));
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect(toQuery("/login", "error", "Supabase 客户端初始化失败。"));
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(toQuery("/login", "error", authErrorMessage(error.message)));
  }

  redirect("/archive");
}

export async function signUpAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect(toQuery("/signup", "error", "请先配置 Supabase 环境变量。"));
  }

  const displayName = asString(formData.get("displayName"));
  const loginId = normalizeLoginId(asString(formData.get("loginId")));
  const email = loginIdToInternalEmail(loginId);
  const password = asString(formData.get("password"));

  if (!isValidLoginId(loginId)) {
    redirect(toQuery("/signup", "error", loginIdHelpText()));
  }

  if (!password) {
    redirect(toQuery("/signup", "error", "请输入密码，并记住它。"));
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect(toQuery("/signup", "error", "Supabase 客户端初始化失败。"));
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    redirect(toQuery("/signup", "error", "伪注册需要配置服务端 SUPABASE_SERVICE_ROLE_KEY，用于创建已确认的内部账号。"));
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      login_id: loginId,
      display_name: displayName || loginId
    }
  });

  if (createError) {
    redirect(toQuery("/signup", "error", authErrorMessage(createError.message)));
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    redirect(toQuery("/login", "success", "账号已创建。请使用你的登录 ID 和密码登录。"));
  }

  const { data: account } = await supabase.from("account_profiles").select("user_id").maybeSingle();

  if (account) {
    await supabase
      .from("account_profiles")
      .update({
        login_id: loginId,
        display_name: displayName || loginId
      })
      .eq("user_id", account.user_id);
  }

  redirect("/archive");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function saveProfileAction(formData: FormData) {
  const { supabase, user } = await requireAuthedSupabase();
  const profileId = asString(formData.get("profileId"));

  if (!profileId) {
    redirect(toQuery("/archive", "error", "未找到要更新的档案。"));
  }

  const payload = buildProfileUpdatePayload(formData);
  const { error } = await supabase
    .from("oracle_profiles")
    .update(payload)
    .eq("id", profileId)
    .eq("user_id", user.id);

  if (error) {
    redirect(toQuery("/archive", "error", error.message));
  }

  redirect(toQuery("/archive", "success", "命盘档案已更新。"));
}

export async function createSessionAction(formData: FormData) {
  const { supabase, user } = await requireAuthedSupabase();
  const profileId = asString(formData.get("profileId"));

  if (!profileId) {
    redirect(toQuery("/archive", "error", "未找到归属档案。"));
  }

  const { data: profileData, error: profileError } = await supabase
    .from("oracle_profiles")
    .select("*")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profileData) {
    redirect(toQuery("/archive", "error", profileError?.message ?? "档案不存在。"));
  }

  const profile = profileData as OracleProfileRecord;
  const missingSteps = getMissingProfileSteps(profile);
  const titleBase = profile.full_name || profile.label || "未命名档案";

  const { data: sessionData, error: sessionError } = await supabase
    .from("oracle_sessions")
    .insert({
      user_id: user.id,
      oracle_profile_id: profile.id,
      title: missingSteps.length > 0 ? `${titleBase} / 信息采集` : `${titleBase} / 排盘分析`,
      stage: getInitialSessionStage(profile),
      last_message_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (sessionError || !sessionData) {
    redirect(toQuery("/archive", "error", sessionError?.message ?? "创建会话失败。"));
  }

  const seedMessage = buildSessionSeedMessage(profile);
  const { error: messageError } = await supabase.from("oracle_messages").insert({
    session_id: sessionData.id,
    user_id: user.id,
    role: "assistant",
    content: seedMessage
  });

  if (messageError) {
    redirect(toQuery("/archive", "error", messageError.message));
  }

  const { error: updateError } = await supabase
    .from("oracle_sessions")
    .update({
      last_message_preview: seedMessage.slice(0, 180),
      last_message_at: new Date().toISOString()
    })
    .eq("id", sessionData.id)
    .eq("user_id", user.id);

  if (updateError) {
    redirect(toQuery("/archive", "error", updateError.message));
  }

  redirect(`/archive/sessions/${sessionData.id}`);
}
