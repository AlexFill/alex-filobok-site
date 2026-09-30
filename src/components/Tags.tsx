/** A row of tool tags. All tags look the same: the page is a general profile, not tuned to one role. */
export function Tags({ tags, label }: { tags: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {tags.map((t) => (
        <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}
