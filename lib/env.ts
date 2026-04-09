const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseBrowserKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const aiApiKey = process.env.DASHSCOPE_API_KEY || process.env.OPENAI_API_KEY;

export function hasSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseBrowserKey);
}

export function hasAIEnv() {
  return Boolean(aiApiKey);
}

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabaseBrowserKey) {
    return null;
  }

  return {
    url: supabaseUrl,
    browserKey: supabaseBrowserKey
  };
}

export function getSupabaseAdminEnv() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return {
    url: supabaseUrl,
    serviceRoleKey: supabaseServiceRoleKey
  };
}

export function getAIConfig() {
  if (!aiApiKey) {
    return null;
  }

  return {
    apiKey: aiApiKey,
    baseUrl: process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: process.env.DASHSCOPE_MODEL || process.env.OPENAI_MODEL || "qwen3.6-plus",
    enableThinking: (process.env.DASHSCOPE_ENABLE_THINKING || "true").toLowerCase() !== "false"
  };
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
