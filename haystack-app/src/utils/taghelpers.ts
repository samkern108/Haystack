export function sameTag(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function hasTag(names: string[], name: string): boolean {
  return names.some((candidate) => sameTag(candidate, name));
}

export function resolveTagName(names: string[], name: string): string {
  return names.find((candidate) => candidate === name.trim())
    ?? names.find((candidate) => sameTag(candidate, name)) ?? name.trim();
}
