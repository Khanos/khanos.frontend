export type EditorSelection = { start: number; end: number };
export function insertMarkdownImage(
  content: string,
  selection: EditorSelection,
  alt: string,
  value: string,
) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error("Expected a safe HTTPS image URL.");
  const safeAlt = alt
    .replace(/[\r\n]+/g, " ")
    .replace(/([\\[\]`*_<>])/g, "\\$1");
  const safeUrl = url.href.replace(
    /[()<>\\]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  const start = Math.max(0, Math.min(selection.start, content.length));
  const end = Math.max(start, Math.min(selection.end, content.length));
  const before = content.slice(0, start),
    after = content.slice(end);
  // Add only missing paragraph separators; preserve all surrounding source.
  const separator = (text: string, leading: boolean) => {
    if (!text) return "";
    const match = leading ? text.match(/\n*$/) : text.match(/^\n*/);
    return "\n".repeat(Math.max(0, 2 - (match?.[0].length || 0)));
  };
  const image = `${separator(before, true)}![${safeAlt}](${safeUrl})`;
  return {
    content: before + image + separator(after, false) + after,
    cursor: before.length + image.length,
  };
}
