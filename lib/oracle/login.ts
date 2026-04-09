const loginIdPattern = /^[a-z0-9][a-z0-9_-]{2,31}$/;

export function normalizeLoginId(loginId: string) {
  return loginId.trim().toLowerCase();
}

export function isValidLoginId(loginId: string) {
  return loginIdPattern.test(loginId);
}

export function loginIdHelpText() {
  return "ID 只能使用 3-32 位小写字母、数字、下划线或短横线，并且需要以字母或数字开头。";
}

export function loginIdToInternalEmail(loginId: string) {
  return `${normalizeLoginId(loginId)}@users.suanming.app`;
}
