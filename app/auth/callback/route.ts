import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/archive";
  const redirectUrl = new URL(next, requestUrl.origin);

  if (!code) {
    redirectUrl.searchParams.set("error", "缺少认证回调 code。");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectUrl.searchParams.set("error", "Supabase 环境变量尚未配置。");
    return NextResponse.redirect(redirectUrl);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirectUrl.searchParams.set("error", error.message);
  }

  return NextResponse.redirect(redirectUrl);
}
