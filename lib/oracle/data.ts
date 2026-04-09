import type { User, SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  AccountProfileRecord,
  OracleMessageRecord,
  OracleProfileRecord,
  OracleSessionRecord
} from "@/lib/oracle/types";

async function ensureAccountProfile(supabase: SupabaseClient, user: User) {
  const { data: existing, error } = await supabase
    .from("account_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error && !/session missing/i.test(error.message)) {
    throw new Error(error.message);
  }

  if (existing) {
    return existing as AccountProfileRecord;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("account_profiles")
    .insert({
      user_id: user.id,
      email: user.email ?? null,
      login_id: (user.user_metadata?.login_id as string | undefined) ?? null,
      display_name: (user.user_metadata?.display_name as string | undefined) ?? null,
      focus: "cyber-suanming"
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "初始化账户档案失败。");
  }

  return inserted as AccountProfileRecord;
}

async function ensurePrimaryProfile(supabase: SupabaseClient, user: User) {
  const { data: existing, error } = await supabase
    .from("oracle_profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  if (error && !/session missing/i.test(error.message)) {
    throw new Error(error.message);
  }

  if (existing) {
    return existing as OracleProfileRecord;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("oracle_profiles")
    .insert({
      user_id: user.id,
      label: "主档案",
      is_primary: true,
      is_alive: true,
      life_status_confirmed: true
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "初始化命盘主档案失败。");
  }

  return inserted as OracleProfileRecord;
}

export async function getUserContext() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error && !/session missing/i.test(error.message)) {
    throw new Error(error.message);
  }

  if (!user) {
    return {
      supabase,
      user: null,
      account: null,
      profile: null
    };
  }

  const [account, profile] = await Promise.all([
    ensureAccountProfile(supabase, user),
    ensurePrimaryProfile(supabase, user)
  ]);

  return {
    supabase,
    user,
    account,
    profile
  };
}

export async function getArchiveData() {
  const context = await getUserContext();

  if (!context?.user || !context.account || !context.profile) {
    return context;
  }

  const { data, error } = await context.supabase
    .from("oracle_sessions")
    .select("*")
    .eq("user_id", context.user.id)
    .eq("oracle_profile_id", context.profile.id)
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...context,
    sessions: (data || []) as OracleSessionRecord[]
  };
}

export async function getSessionData(sessionId: string) {
  const context = await getUserContext();

  if (!context?.user || !context.account || !context.profile) {
    return context;
  }

  const { data: sessionData, error: sessionError } = await context.supabase
    .from("oracle_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", context.user.id)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionData) {
    return {
      ...context,
      session: null,
      messages: []
    };
  }

  const { data: messagesData, error: messagesError } = await context.supabase
    .from("oracle_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw new Error(messagesError.message);
  }

  return {
    ...context,
    session: sessionData as OracleSessionRecord,
    messages: (messagesData || []) as OracleMessageRecord[]
  };
}
