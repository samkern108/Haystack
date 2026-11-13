import type { CSSProperties } from "react";
import type { VideoTag } from "../state/types";

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

export function tagStyle(tag?: VideoTag): CSSProperties {
  return {
    backgroundColor: tag?.color,
    ...(tag?.isCollection ? {
      fontWeight: 700,
      border: `2px solid color-mix(in srgb, ${tag.color} 65%, var(--color-input-text))`,
    } : {}),
  };
}
