const emojiPattern = /\p{Extended_Pictographic}/gu;

const boilerplatePatterns = [
  /^作为(?:一个|一名)?.*(?:AI|人工智能|语言模型|助手)/i,
  /^(?:好的|当然|可以|没问题)[，,。！!\s]*(?:我会|我来|下面|以下|我们|现在)?\s*$/i,
  /^(?:以下是|下面是|这里是|接下来我将).*(?:分析|解读|回复|答案)/i,
  /^(?:免责声明|温馨提示)[:：]?/i
];

export function cleanOracleLine(value: string) {
  return value
    .replace(emojiPattern, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function lineHasOracleBoilerplate(value: string) {
  const cleanLine = cleanOracleLine(stripOracleBlockMarker(value));

  return boilerplatePatterns.some((pattern) => pattern.test(cleanLine));
}

export function stripOracleBlockMarker(value: string) {
  return value
    .replace(/^#{1,6}\s+/, "")
    .replace(/^>\s+/, "")
    .replace(/^(?:[-*+]|\d+[.)]|[一二三四五六七八九十]{1,3}[、.])\s+/, "");
}

export function toPlainOraclePreview(value: string, maxLength = 180) {
  const preview = value
    .split(/\r?\n/)
    .map((line) => cleanOracleLine(stripOracleBlockMarker(line)))
    .filter((line) => line.length > 0 && !lineHasOracleBoilerplate(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (preview.length <= maxLength) {
    return preview;
  }

  return `${preview.slice(0, maxLength - 1).trim()}…`;
}
