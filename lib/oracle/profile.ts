import type { OracleProfileRecord, OracleSessionRecord, OracleSessionStage } from "@/lib/oracle/types";

type ProfileStep = {
  key: string;
  label: string;
  prompt: string;
};

const profileSteps: ProfileStep[] = [
  {
    key: "full_name",
    label: "姓名",
    prompt: "请告诉我您的姓名。"
  },
  {
    key: "former_name_note",
    label: "曾用名",
    prompt: "请问您有曾用名吗？如果有，请一并告诉我，并补充大概是哪一年改名；如果没有，直接说没有。"
  },
  {
    key: "birthday",
    label: "生日",
    prompt: "请告诉我您的阳历（公历）生日；如果不确定，也可以直接填写农历生日。"
  },
  {
    key: "birth_time",
    label: "出生时间",
    prompt: "请问您的出生时间或出生时辰是？如果只知道大概范围，也请直接说，比如早上、下午、夜里。"
  },
  {
    key: "gender",
    label: "性别",
    prompt: "请问您的性别是男还是女？"
  },
  {
    key: "birth_location",
    label: "出生地",
    prompt: "请告诉我您的出生省份和城市，例如 辽宁省丹东市。"
  }
];

function hasBirthday(profile: OracleProfileRecord) {
  return Boolean(profile.solar_birthday || profile.lunar_birthday_text);
}

function hasBirthTime(profile: OracleProfileRecord) {
  return Boolean(profile.birth_time_text || profile.shichen);
}

function valueOrNull(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function buildProfileUpdatePayload(formData: FormData) {
  return {
    full_name: valueOrNull(formData.get("fullName")),
    former_name_note: valueOrNull(formData.get("formerNameNote")),
    solar_birthday: valueOrNull(formData.get("solarBirthday")),
    lunar_birthday_text: valueOrNull(formData.get("lunarBirthdayText")),
    birth_time_text: valueOrNull(formData.get("birthTimeText")),
    shichen: valueOrNull(formData.get("shichen")),
    gender: valueOrNull(formData.get("gender")),
    birth_location: valueOrNull(formData.get("birthLocation")),
    is_alive: true,
    life_status_confirmed: true,
    deceased_year: null,
    notes: valueOrNull(formData.get("notes"))
  };
}

export function getMissingProfileSteps(profile: OracleProfileRecord) {
  return profileSteps.filter((step) => {
    switch (step.key) {
      case "full_name":
        return !profile.full_name;
      case "former_name_note":
        return !profile.former_name_note;
      case "birthday":
        return !hasBirthday(profile);
      case "birth_time":
        return !hasBirthTime(profile);
      case "gender":
        return !profile.gender || profile.gender === "unknown";
      case "birth_location":
        return !profile.birth_location;
      default:
        return false;
    }
  });
}

export function getProfileCompletion(profile: OracleProfileRecord) {
  const completed = profileSteps.length - getMissingProfileSteps(profile).length;
  return Math.round((completed / profileSteps.length) * 100);
}

export function buildProfileSummary(profile: OracleProfileRecord) {
  return [
    "信息确认",
    `姓名：${profile.full_name || "未知"}`,
    `曾用名：${profile.former_name_note || "未知"}`,
    `阳历生日：${profile.solar_birthday || "未知"}`,
    `农历生日：${profile.lunar_birthday_text || "未知"}`,
    `出生时间：${profile.birth_time_text || profile.shichen || "未知"}`,
    `性别：${profile.gender || "未知"}`,
    `出生地：${profile.birth_location || "未知"}`
  ].join("\n");
}

export function getInitialSessionStage(profile: OracleProfileRecord): OracleSessionStage {
  return getMissingProfileSteps(profile).length > 0 ? "intake" : "verification";
}

export function buildSessionSeedMessage(profile: OracleProfileRecord) {
  const missing = getMissingProfileSteps(profile);

  if (missing.length > 0) {
    const firstStep = missing[0];
    return [
      "档案已接入命理工作流。",
      "",
      "我会按照四柱八字的标准流程，一次只确认一项信息，不会把所有问题一次性抛给你。",
      "",
      `当前先确认：${firstStep.label}`,
      firstStep.prompt
    ].join("\n");
  }

  return [
    "我已经读取到你的主档案，接下来先做排盘前确认。",
    "",
    buildProfileSummary(profile),
    "",
    "如果以上信息正确，请直接回复“确认排盘”；如果要修改，请指出哪一项不对。"
  ].join("\n");
}

export function inferStage(profile: OracleProfileRecord, assistantText: string): OracleSessionStage {
  if (/综合建议|流年分析|大运分析|喜用神/.test(assistantText)) {
    return "analysis";
  }

  if (/\|[\s　]*年柱[\s　]*\|[\s　]*月柱[\s　]*\|[\s　]*日柱[\s　]*\|/.test(assistantText) || /大运序/.test(assistantText)) {
    return "chart";
  }

  if (/信息确认|确认后我开始排盘|确认排盘/.test(assistantText)) {
    return "verification";
  }

  return getMissingProfileSteps(profile).length > 0 ? "intake" : "verification";
}

export function stageLabel(stage: OracleSessionStage) {
  switch (stage) {
    case "intake":
      return "信息采集";
    case "verification":
      return "排盘确认";
    case "chart":
      return "命盘展开";
    case "analysis":
      return "综合分析";
    default:
      return stage;
  }
}

export function formatSessionTime(session: OracleSessionRecord) {
  const value = session.last_message_at || session.created_at;

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
