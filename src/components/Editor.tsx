import type { KeyboardEvent } from "react";

export function Editor({
  value,
  onChange,
  onRun,
  label,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  label: string;
  rows?: number;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end } = el;
      onChange(value.slice(0, s) + "  " + value.slice(end));
      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
    }
  };
  return (
    <textarea
      className="editor"
      aria-label={label}
      value={value}
      rows={rows}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
