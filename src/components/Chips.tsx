"use client";

export function Chips<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Record<T, string>;
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(options) as [T, string][]).map(([k, v]) => (
          <button key={k} type="button" className={k === value ? "chip chip-active" : "chip"} onClick={() => onChange(k)}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
