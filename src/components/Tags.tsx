/** A row of tool tags, all styled alike so no single tool takes the spotlight. */
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
