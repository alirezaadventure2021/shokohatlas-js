export function parseJSON(val) {
  if (!val) return null;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return { en: val };
  }
}

export function getLocalized(val, lang = "en") {
  const obj = parseJSON(val);
  if (!obj) return "";
  return obj[lang] || obj.en || "";
}
