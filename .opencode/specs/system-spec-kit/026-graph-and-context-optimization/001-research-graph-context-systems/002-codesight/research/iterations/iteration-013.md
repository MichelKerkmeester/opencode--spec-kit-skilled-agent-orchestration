# Iteration 13 — Libs detector export-scraping limits

## Summary
`detectLibs()` is deliberately scoped as a helper-library index, not a semantic module graph. It filters out pages, routes, UI components, tests, and story files, then uses regex export extraction for TS/JS/Python/Go. The detector is useful for "what utilities exist?" context, but it should not be mistaken for API surface truth.

## Files Read
- `external/src/detectors/libs.ts:1-225`
- `external/tests/detectors.test.ts:26-29`

## Findings

### Finding 1 — `detectLibs()` excludes most app-entry surfaces on purpose
- Source: `external/src/detectors/libs.ts:5-34`
- What it does: it skips `/components/`, `/pages/`, `/app/`, `/routes/`, `/views/`, `/templates/`, tests, stories, `.tsx`, and `.jsx`, then scans only `.ts/.js/.mjs/.py/.go` files.
- Why it matters for Code_Environment/Public: The detector is intentionally about helper modules, not complete project exports. That makes it a good breadcrumb surface and a poor source of architectural truth.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: helper discovery
- Risk/cost: low

### Finding 2 — TS/JS export extraction is regex-based and misses many real module shapes
- Source: `external/src/detectors/libs.ts:66-130`
- What it does: TS/JS exports are parsed via regexes for `export function`, `export const foo = (...) =>`, `export class`, `export interface`, `export type`, `export enum`, and generic `export const`. There is no handling for `export default`, `export { foo }`, re-export barrels, namespace exports, or inferred signatures beyond a few captured groups.
- Why it matters for Code_Environment/Public: This is another "fast inventory, low authority" surface. It is useful for pointing an assistant at likely helper files, not for generating trustworthy API contracts.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: helper indexing
- Risk/cost: medium

### Finding 3 — Python and Go exports use language-specific visibility shortcuts
- Source: `external/src/detectors/libs.ts:133-209`
- What it does: Python skips names starting with `_`; Go only keeps names beginning with uppercase. Both paths collect top-level function/class/interface declarations only.
- Why it matters for Code_Environment/Public: These are reasonable heuristics, but they ignore package-level visibility conventions like `__all__`, receiver methods, nested classes, and module alias patterns.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: cross-language indexing
- Risk/cost: medium

### Finding 4 — The detector drops files without at least one function/class export
- Source: `external/src/detectors/libs.ts:54-60`
- What it does: after extracting exports, a file is only retained if at least one export has `kind === "function"` or `kind === "class"`. Const-only modules, enum/type-only files, and pure interface barrels can disappear entirely.
- Why it matters for Code_Environment/Public: Good for shrinking context, bad for completeness. It favors implementation-heavy helpers over type-rich public surfaces.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: context compaction
- Risk/cost: low

## Recommended Next Focus
Inspect `detectConfig()` next. It appears to carry the same theme: useful compression, but with deliberately narrow heuristics and thin regression coverage.

## Metrics
- newInfoRatio: 0.69
- findingsCount: 4
- focus: "iteration 13: libs detector export-scraping limits"
- status: insight
