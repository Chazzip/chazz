export type OracleSessionStage = "intake" | "verification" | "chart" | "analysis";

export type AccountProfileRecord = {
  user_id: string;
  login_id: string | null;
  email: string | null;
  display_name: string | null;
  focus: string | null;
  created_at: string;
  updated_at: string;
};

export type OracleProfileRecord = {
  id: string;
  user_id: string;
  label: string;
  full_name: string | null;
  former_name_note: string | null;
  solar_birthday: string | null;
  lunar_birthday_text: string | null;
  birth_time_text: string | null;
  shichen: string | null;
  gender: string | null;
  birth_location: string | null;
  is_alive: boolean;
  life_status_confirmed: boolean;
  deceased_year: number | null;
  notes: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type OracleSessionRecord = {
  id: string;
  user_id: string;
  oracle_profile_id: string;
  title: string;
  stage: OracleSessionStage;
  summary: string | null;
  last_message_preview: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OracleMessageRecord = {
  id: string;
  session_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
