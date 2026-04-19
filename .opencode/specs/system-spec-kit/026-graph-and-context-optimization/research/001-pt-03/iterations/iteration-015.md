# Iteration 15 — Formatter contract and artifact lifecycle

## Summary
`writeOutput()` is one of Codesight's strongest transferable patterns: it conditionally emits small, purpose-specific markdown files and then composes them into one combined `CODESIGHT.md`. At the same time, the formatter shows where product claims and artifact lifecycle can drift: stale files are never deleted, token messaging differs across surfaces, and "notable dependency" selection is manually curated.

## Files Read
- `external/src/formatter.ts:5-58`
- `external/src/formatter.ts:176-205`
- `external/src/formatter.ts:229-305`
- `external/src/formatter.ts:308-335`

## Findings

### Finding 1 — Artifact emission is conditional, which keeps noise down
- Source: `external/src/formatter.ts:11-58`
- What it does: routes, schema, components, libs, config, middleware, and graph files are written only when the corresponding result slice is non-empty; `CODESIGHT.md` is always written from the accumulated `sections` array.
- Why it matters for Code_Environment/Public: This is a clean context-generation rule: emit only what you can substantively support, then compose a single canonical summary from the same intermediate sections.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: static context generation
- Risk/cost: low

### Finding 2 — Formatter never cleans up stale section files
- Source: `external/src/formatter.ts:13-58`
- What it does: section files are created when a slice is non-empty, but there is no branch that deletes `routes.md`, `graph.md`, etc. if a future scan produces zero data for that section.
- Why it matters for Code_Environment/Public: Context files can become historically sticky and overstate current reality unless cleanup or freshness markers are added.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: artifact lifecycle
- Risk/cost: medium

### Finding 3 — `CODESIGHT.md` rounds token stats explicitly to avoid diff churn
- Source: `external/src/formatter.ts:283-290`
- What it does: `formatCombined()` rounds token counts to the nearest 100 before writing the combined markdown and documents the reason inline: deterministic output that avoids git conflicts in worktrees.
- Why it matters for Code_Environment/Public: This is a strong small design decision. If heuristic metrics are shown at all, rounding and explicitly framing them as estimates reduces false precision and diff noise.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: output stability
- Risk/cost: low

### Finding 4 — The notable-dependency list is curated, not discovered
- Source: `external/src/formatter.ts:196-203`, `external/src/formatter.ts:308-335`
- What it does: `filterNotableDeps()` compares root dependencies against a handwritten allowlist of frameworks, ORMs, auth libs, payments, infra, AI SDKs, and services.
- Why it matters for Code_Environment/Public: The result is readable, but it hardcodes product judgment into the formatter. Any port should treat this as a policy layer, not an intrinsic truth of the scan.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: dependency summarization
- Risk/cost: medium

### Finding 5 — Combined markdown is a true projection layer over the raw scan
- Source: `external/src/formatter.ts:262-305`
- What it does: `formatCombined()` never rescans anything; it just formats project metadata, token stats, and the previously generated section content into one canonical file.
- Why it matters for Code_Environment/Public: This is the deepest reusable pattern in the formatter: one raw result, many late-bound views, no second analysis pass for presentation.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: projection architecture
- Risk/cost: low

## Recommended Next Focus
Inspect the MCP server in detail. It looks like the runtime analogue of the formatter: another late-bound projection layer, but with different risks around caching, side effects, and tool contracts.

## Metrics
- newInfoRatio: 0.76
- findingsCount: 5
- focus: "iteration 15: formatter contract and artifact lifecycle"
- status: insight
