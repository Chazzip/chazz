import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/oracle/auth-panel";
import { hasSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  if (hasSupabaseEnv()) {
    const supabase = await createServerSupabaseClient();

    if (supabase) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        redirect("/archive");
      }
    }
  }

  return (
    <AuthPanel
      mode="signup"
      enabled={hasSupabaseEnv()}
      error={resolvedSearchParams?.error}
      success={resolvedSearchParams?.success}
    />
  );
}
