/** Literal highlighting: provider text is always rendered as React text, never HTML. */
export function highlightParts(message: string, word: string) {
  const text = message.slice(0, 300);
  const needle = word.toLowerCase();
  const parts: { text: string; match: boolean }[] = [];
  let start = 0;
  while (needle && start < text.length) {
    const at = text.toLowerCase().indexOf(needle, start);
    if (at === -1) break;
    if (at > start) parts.push({ text: text.slice(start, at), match: false });
    parts.push({ text: text.slice(at, at + word.length), match: true });
    start = at + word.length;
  }
  parts.push({ text: text.slice(start) + (message.length > 300 ? '…' : ''), match: false });
  return parts;
}
