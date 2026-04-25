# Iteration 21: Exact `key_files` Sanitization Predicate and Corpus Rerun

## Focus
Lock the exact safe filter for `key_files` sanitization and re-run it against the live 360-file corpus with explicit bash + jq checks.

## Findings
1. `extractReferencedFilePaths()` still accepts almost any backticked token with a dotted suffix; the real sanitation point remains `deriveKeyFiles()` before `normalizeUnique(...)`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]
2. The exact safe predicate for the current corpus is a narrow junk-token regex plus a structural bare-filename rule:

```ts
const CANONICAL_PACKET_DOC_RE =
  /^(spec\.md|plan\.md|tasks\.md|checklist\.md|decision-record\.md|implementation-summary\.md|research\.md|research\/research\.md|handover\.md)$/;
const KEY_FILE_NOISE_RE =
  /^(node |npx |pnpm |npm |yarn |bun |python([0-9]+(\.[0-9]+)*)? |bash |sh |vitest |jest |mocha |tsx |ts-node )|^v[0-9]+\.[0-9]+(\.[0-9]+)?$|^[a-z]+\/[a-z0-9+-]+$|^_memory\.continuity$|^[A-Za-z][A-Za-z0-9_-]*:\s.+$|^console\.warn(\(|$)/;
const BARE_FILE_RE = /^[^/]+\.[A-Za-z0-9._-]+$/;

function keepKeyFile(candidate: string): boolean {
  if (KEY_FILE_NOISE_RE.test(candidate)) return false;
  if (BARE_FILE_RE.test(candidate) && !CANONICAL_PACKET_DOC_RE.test(candidate)) return false;
  return true;
}
```

3. The explicit bash + jq rerun over the active corpus now returns `2,207` unresolved `key_files`, with `108` junk-token hits, `1,412` unresolved bare-filename hits, and `1,498` combined removals (`67.9%`). [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. That rerun is slightly higher than the earlier `1,489 / 2,195` headline, so the implementation should follow the predicate itself rather than hard-coding the older aggregate count. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. The safest patch shape is: filter `referenced` and `fallbackRefs`, then append `docs.map((doc) => doc.relativePath)` unchanged so canonical packet docs are always preserved. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]

## Ruled Out
- Broad slash-path rejection. It overreaches into unresolved but still file-shaped values such as `dist/index.js` and `memory/metadata.json`.

## Dead Ends
- Reusing the earlier aggregate counts without re-running the exact predicate against the live corpus.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.22`
- Questions addressed: `CQ-1`
- Questions answered: `CQ-1`

## Reflection
- What worked and why: converting the earlier “structural-plus-regex” conclusion into one explicit predicate made the implementation handoff testable.
- What did not work and why: the first rerun was too broad because it treated slash-path values as MIME-like noise.
- What I would do differently: start future convergence waves by freezing the exact predicate before comparing counts.

## Recommended Next Focus
Trace `deriveEntities()` one level deeper and decide whether basename de-dupe can safely “keep first” or whether it must prefer canonical packet-doc paths on collision.
