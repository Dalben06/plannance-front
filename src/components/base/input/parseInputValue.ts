export type ModelModifiers = { trim?: boolean; number?: boolean };

export function parseInputValue(
  raw: string,
  modifiers?: ModelModifiers,
): string | number | null {
  let v = raw;

  if (modifiers?.trim) v = v.trim();

  if (modifiers?.number) {
    return v === '' ? null : Number(v);
  }

  return v;
}
