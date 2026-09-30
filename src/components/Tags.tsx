import { webTags } from '@/content/profile';

/** A row of tool tags. Web tools get an accent outline so they stand out from the Apple stack. */
export function Tags({ tags, label }: { tags: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {tags.map((t) => (
        <li
          key={t}
          className={`rounded-full border px-3 py-1 font-mono text-xs ${
            webTags.has(t) ? 'border-[var(--ring)] text-fg' : 'border-line bg-surface text-muted'
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
