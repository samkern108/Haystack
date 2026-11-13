import { hasTag, sameTag } from "./taghelpers";

export type TagOperator = "and" | "or";

// Missing operators retain the original OR behavior for saved state.
export function tagOperator(operators: TagOperator[] | undefined, index: number): TagOperator {
  return operators?.[index] === "and" ? "and" : "or";
}

export function includedTagGroups(tags: string[], operators?: TagOperator[]): string[][] {
  const groups: string[][] = [];
  tags.forEach((tag, index) => {
    if (index === 0 || tagOperator(operators, index - 1) === "or") groups.push([tag]);
    else groups[groups.length - 1].push(tag);
  });
  return groups;
}

export type TagExpression = { index: number } | { operator: TagOperator; left: TagExpression; right: TagExpression };

// The most recently toggled connector binds its neighboring terms first.
export function includedTagExpression(tags: string[], operators?: TagOperator[], order: number[] = []): TagExpression | undefined {
  function build(start: number, end: number): TagExpression {
    if (start === end) return { index: start };
    let split = start;
    const priority = (index: number) => {
      const explicit = order.indexOf(index);
      return explicit >= 0 ? 1000 - explicit : tagOperator(operators, index) === "and" ? 1 : 0;
    };
    for (let index = start + 1; index < end; index++) {
      if (priority(index) <= priority(split)) split = index;
    }
    return { operator: tagOperator(operators, split), left: build(start, split), right: build(split + 1, end) };
  }
  return tags.length ? build(0, tags.length - 1) : undefined;
}

export function tagGroupingRanges(tags: string[], operators?: TagOperator[], order?: number[]): [number, number][] {
  if (tags.slice(1).every((_, index) => tagOperator(operators, index) === "and")) return [];
  const ranges: [number, number][] = [];
  function visit(node: TagExpression, root = false): [number, number] {
    if ("index" in node) return [node.index, node.index];
    const left = visit(node.left);
    const right = visit(node.right);
    if (!root) ranges.push([left[0], right[1]]);
    return [left[0], right[1]];
  }
  const expression = includedTagExpression(tags, operators, order);
  if (expression) visit(expression, true);
  return ranges;
}

export function matchesIncludedTags(videoTags: string[], tags: string[], operators?: TagOperator[], order?: number[]): boolean {
  const expression = includedTagExpression(tags, operators, order);
  function evaluate(node: TagExpression): boolean {
    if ("index" in node) return hasTag(videoTags, tags[node.index]);
    return node.operator === "and" ? evaluate(node.left) && evaluate(node.right) : evaluate(node.left) || evaluate(node.right);
  }
  return !expression || evaluate(expression);
}

export function remapTagOrder(previous: string[], next: string[], order: number[] = []): number[] {
  return order.flatMap((index) => {
    const nextIndex = next.findIndex((tag) => sameTag(tag, previous[index] ?? ""));
    return nextIndex >= 0 && nextIndex + 1 < next.length && sameTag(next[nextIndex + 1], previous[index + 1] ?? "") ? [nextIndex] : [];
  });
}

// Preserve the incoming connector of each surviving tag; new tags default to OR.
export function remapTagOperators(previous: string[], next: string[], operators?: TagOperator[]): TagOperator[] {
  return next.slice(1).map((tag) => {
    const index = previous.findIndex((name) => sameTag(name, tag));
    return index > 0 ? tagOperator(operators, index - 1) : "or";
  });
}

export function includedTagSignature(tags: string[], operators?: TagOperator[], order?: number[]): string {
  const expression = includedTagExpression(tags, operators, order);
  // Canonicalize commutative and associative terms while retaining grouping.
  function canonical(node: TagExpression): string {
    if ("index" in node) return JSON.stringify(tags[node.index].trim().toLowerCase());
    const operator = node.operator;
    const terms: string[] = [];
    function collect(term: TagExpression) {
      if (!("index" in term) && term.operator === operator) { collect(term.left); collect(term.right); }
      else terms.push(canonical(term));
    }
    collect(node.left); collect(node.right);
    return JSON.stringify([operator, [...new Set(terms)].sort()]);
  }
  return expression ? canonical(expression) : "[]";
}

export function describeTagFilters(tags: string[], excluded: string[], operators?: TagOperator[], order?: number[]): string {
  const expression = includedTagExpression(tags, operators, order);
  // Expand grouped alternatives so A AND (B OR C) reads as A and B, or A and C.
  function alternatives(node: TagExpression): string[][] | undefined {
    if ("index" in node) return [[tags[node.index]]];
    const left = alternatives(node.left);
    const right = alternatives(node.right);
    if (!left || !right) return undefined;
    if (node.operator === "or") return left.length + right.length <= 64 ? [...left, ...right] : undefined;
    if (left.length * right.length > 64) return undefined;
    return left.flatMap((a) => right.map((b) => [...new Set([...a, ...b])]));
  }
  function grouped(node: TagExpression): string {
    if ("index" in node) return tags[node.index];
    return `(${grouped(node.left)} ${node.operator} ${grouped(node.right)})`;
  }
  const choices = expression ? alternatives(expression) : undefined;
  const includedText = expression
    ? `Videos tagged ${choices ? choices.map((group) => group.join(" and ")).join(", or ") : grouped(expression)}.`
    : "Videos with any tags, including untagged videos.";
  return excluded.length
    ? `${includedText} Excludes videos tagged ${excluded.join(" or ")}.`
    : `${includedText} No tags excluded.`;
}
