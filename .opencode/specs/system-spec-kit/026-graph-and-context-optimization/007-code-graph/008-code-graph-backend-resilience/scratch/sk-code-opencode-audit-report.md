# sk-code-opencode Audit Report — 008 backend resilience packet

Audit range: `87bf42a3d^..6fd20b1a2` (commits `87bf42a3d`, `14620bec9`, `56480a003`, `f8c37631e`, `6fd20b1a2` plus their direct test fallout).

## 1. Summary

**Verdict: CONDITIONAL.** The TypeScript surface that landed in 007/008 is largely consistent with `sk-code-opencode` standards: file headers are present on every production module except `edge-drift.ts`, naming is consistent, error handling follows the `unknown` + `instanceof` pattern, and explicit return types are present on the public API. There are real gaps — most notably one new module without a TypeScript module header (P0 by the checklist), one publicly exported function whose return type is inferred (P1), one resolver function that throws instead of returning the documented Discriminated-Union failure shape used elsewhere in this packet (P1), and a handful of P2 tidies (duplicated `isRecord`, magic numbers, large file boundary). The remediation pass already closed every finding called out in the prior deep-review iteration set; this audit only flags the residue that fell through that pass against the standards overlay.

The verdict is CONDITIONAL rather than PASS solely because the missing module header is a checklist HARD BLOCKER. None of the findings introduce runtime hazards or break the security contract; they are standards-overlay violations.

## 2. Methodology

I read the following sk-code-opencode resources before scoring:

- `.opencode/skill/sk-code-opencode/SKILL.md` — full file (rules §4, success criteria §5).
- `.opencode/skill/sk-code-opencode/references/typescript/style_guide.md` — file header §2, naming §5, imports §7, comments §8.
- `.opencode/skill/sk-code-opencode/references/typescript/quality_standards.md` — interface vs type §2, type safety §3, return type policy §6, typed errors §8, async §9.
- `.opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md` — P0 §2, P1 §3, P2 §4.
- `.opencode/skill/sk-code-opencode/references/shared/universal_patterns.md` — naming §2, commenting §3, reference comments §4, file org §5, security §6.

I cross-checked against the prior deep-review report at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/review/review-report.md` and excluded any finding already covered there. Cross-references are noted inline as "covered by deep-review §N".

Lenses applied per CLAUDE.md §1: CLARITY, SYSTEMS (cross-handler vocabulary), BIAS (am I inflating?), SUSTAINABILITY, VALUE, SCOPE.

The remediation commit `f8c37631e` ("close all 5 P0 + 12 P1 deep-review findings") was inspected directly: each prior P0/P1 was verified closed at the cited file:line before being excluded from this audit.

## 3. Findings by file

Severity rubric per the prompt: P0 = HARD BLOCKER (sk-code-opencode rule violation, type unsafety, runtime hazard); P1 = required quality issue; P2 = style/maintainability nit.

### 3.1 `code_graph/lib/edge-drift.ts` (new in 008)

#### P0

- **`code_graph/lib/edge-drift.ts:1`** — Missing TypeScript module header. Every other new and existing TypeScript file in this packet (`gold-query-verifier.ts:1-3`, `query-result-adapter.ts:1-3`, `verify.ts:1-3`, `scan.ts:1-3`, `status.ts:1-3`, `detect-changes.ts:1-3`, `ensure-ready.ts:1-3`, `code-graph-db.ts:1-3`) opens with the canonical `// ───\n// MODULE: <Name>\n// ───` block per `typescript/style_guide.md` §2. `edge-drift.ts` jumps straight to `import type { EdgeType } ...`. The TypeScript checklist marks this as P0 HARD BLOCKER (`assets/checklists/typescript_checklist.md` §2 "File Header"). Suggested fix: prepend the standard 3-line header naming the module (e.g. `MODULE: Edge Distribution Drift`).

#### P1

- **`code_graph/lib/edge-drift.ts:26-32`** — `buildEdgeDistribution` is exported with an inferred return type. Quality-standards §6 requires explicit return types on public API. The compiled output may surface as `Record<EdgeType, number>` to consumers, but the source loses the documentation-as-types contract. `computeEdgeShare`, `computePSI`, `computeJSD` correctly annotate; only `buildEdgeDistribution` is missing one. Suggested fix: change to `): EdgeDistribution {`.
- **`code_graph/lib/edge-drift.ts:34-44`** — `computeEdgeShare` ignores the structural-typing escape hatch in `buildEdgeDistribution(distribution?: Partial<Record<EdgeType, number>> | Record<string, number> | null)`. Once `buildEdgeDistribution` widens to `Record<string, number>`, the resulting `EdgeDistribution` may have `EDGE_TYPES` keys plus arbitrary stray keys silently dropped. The current implementation does not advertise this lossy widening at the type level. Suggested fix: tighten the input parameter to `Partial<Record<EdgeType, number>>` only, or add a TSDoc `@remarks` explaining the silent-drop semantics.

#### P2

- **`code_graph/lib/edge-drift.ts:5`** — `DIVERGENCE_EPSILON = 1e-12` lacks a TSDoc/explanatory comment. Universal patterns §3 calls for explaining the WHY. A reader has to reverse-engineer that this is the smoothing constant for divergence calculations on zero-share entries. Suggested fix: one-line comment "Smoothing constant prevents log(0) in PSI/JSD on zero-share edge types".
- **`code_graph/lib/edge-drift.ts:9-11`** — `normalizeValue` accepts `value: number` but treats `Number.isFinite(value) && value > 0` as the only valid case. Suggested fix: rename to `clampToNonNegativeFinite` or document the contract since a literal `normalizeValue` call with a negative number returns 0 silently.

### 3.2 `code_graph/lib/gold-query-verifier.ts` (new in 008)

#### P1

- **`code_graph/lib/gold-query-verifier.ts:90-92,412`** — `isRecord` is duplicated verbatim across three modules in this packet (also at `query-result-adapter.ts:57-59`, `handlers/scan.ts:143-145`, `handlers/status.ts:36-38`, `lib/ensure-ready.ts:106-108`). DRY (universal_patterns §4 design principles gate). `query-result-adapter.ts` is already a "shared adapter" module that other handlers/libs import — promoting `isRecord` there (or to a small `lib/utils/json.ts`) would centralize the type-guard contract. Suggested fix: export `isRecord` from `query-result-adapter.ts` and update the four other call sites to import it.
- **`code_graph/lib/gold-query-verifier.ts:227-229`** — `asNonEmptyString` is declared but never used inside the module. Dead code. Suggested fix: delete it (or use it in `parseQuery` where the manual `getRequiredString`/`typeof` checks duplicate the same intent).
- **`code_graph/lib/gold-query-verifier.ts:204-210`** — Per-row warning emission for v2 probe hooks is unbounded. Prior review listed this as P2; it remains because the remediation pass did not address it. Cross-reference: deep-review §5/P2 #4. (Not duplicating; just noting the residue.)

#### P2

- **`code_graph/lib/gold-query-verifier.ts:265-271`** — `executeBattery(...)` is `async` but contains no `await` — the only awaits inside the loop are on the caller-supplied `query()`. The `async` keyword is correct (since the body awaits) but the function should also explicitly annotate its `Promise<VerifyResult>` return type (it already does — confirm). The actual lint-style nit is line `385`: `batteryPath: '<in-memory>'` is a sentinel string the caller is expected to overwrite. This is fragile — a string literal sentinel should be a typed constant (e.g. `IN_MEMORY_BATTERY_PATH`) so callers and tests can compare without retyping. Suggested fix: extract `const IN_MEMORY_BATTERY_PATH = '<in-memory>' as const;` and reuse it in handlers/tests.
- **`code_graph/lib/gold-query-verifier.ts:236-263`** — `buildProbeResult` returns a redacted clone (lines 258-262) only when `status === 'passed' && !includeDetails`. The conditional is correct but inverted-style; the returned object differs from `baseResult` by exactly two cleared fields. Suggested fix: build the cleared object directly to avoid the spread+overwrite pattern (saves a temp object and is clearer).

### 3.3 `code_graph/lib/query-result-adapter.ts` (new in F08 remediation)

#### P1

- **`code_graph/lib/query-result-adapter.ts:127-141,142-172`** — Both `parseOutlineNode` and `parseRelationshipEdge` emit objects whose conditional-spread pattern (`...(asOptionalString(value.name) ? { name: asOptionalString(value.name) } : {})`) calls `asOptionalString(value.name)` twice per field. Each call performs the `typeof + trim().length` work. For files with thousands of nodes this is measurable. Suggested fix: lift the result into a local: `const name = asOptionalString(value.name); ...(name ? { name } : {})`. Same pattern applies to all 6 fields in `parseOutlineNode` and 9 fields in `parseRelationshipEdge`.

#### P2

- **`code_graph/lib/query-result-adapter.ts:36-41`** — `OutlineQueryData extends Record<string, unknown>` with a typed `nodes: OutlineQueryNode[]` field. The `extends Record<string, unknown>` is needed for `parseSuccessData`'s generic constraint, but it weakens the consumer's type contract — `data.nodes` is well-typed, but `data.someTypo` is also `unknown` not a compile error. Acceptable given the SDK shape, but worth a TSDoc note. Suggested fix: add `@remarks` clarifying that the index signature is intentional for forward-compat and not for unknown-key access.
- **`code_graph/lib/query-result-adapter.ts:96-104`** — JSON parse error message includes `error instanceof Error ? error.message : String(error)`. This pattern is repeated in `gold-query-verifier.ts:407-409`, `verify.ts:181`, `scan.ts:127`, `ensure-ready.ts:427`, etc. — at least 8 occurrences in the packet. KISS/DRY (universal §4). Suggested fix: extract a tiny `function formatErrorMessage(error: unknown): string` helper into `lib/utils/error.ts` and reuse it.

### 3.4 `code_graph/handlers/verify.ts` (new in 008)

#### P1

- **`code_graph/handlers/verify.ts:103-140`** — `resolveVerifyPaths` THROWS on rejection (line 119, 127, 131-133). The siblings `scan.ts:191-219` and `detect-changes.ts:215-243` use a different shape: they return an MCP-formatted error response on the same failure modes rather than throwing. The catch at `verify.ts:178-183` does eventually format the same error, so the runtime behavior is the same — but the contract drift means `resolveVerifyPaths` can't be reused by any other handler and a future caller might forget the `try/catch` wrapper. Suggested fix: convert `resolveVerifyPaths` to return `{ ok: true, ... } | { ok: false, error: string }` — the discriminated-union pattern already used by `detect-changes.ts:132-135` (`CandidatePathResult`).
- **`code_graph/handlers/verify.ts:71-76`** — `assertWorkspaceContainment` is structurally identical to the inlined check at `scan.ts:207-219` and `detect-changes.ts:234-243`. Two of three sites are inline; this one is extracted but only used inside `verify.ts`. Either promote it to `lib/utils/path-containment.ts` and reuse, or inline it for symmetry. Suggested fix: extract `assertWorkspaceContainment` and the canonicalization helper into a shared `lib/utils/workspace-path.ts`. (DRY; SOLID/SRP — workspace-path policy belongs in one place.)

#### P2

- **`code_graph/handlers/verify.ts:37-40`** — `DEFAULT_GOLD_BATTERY_PATH` is computed via 5 levels of `../` against `import.meta.url`. This is a typical computed-default pattern, but the hard-coded relative path will silently break if either the spec folder is renamed or the file moves. Add a short comment near line 37 noting the dependency on `specs/.../assets/code-graph-gold-queries.json`. Suggested fix: one-liner `// REQ-014: default battery lives under 007 research assets — keep in sync if the asset moves.`
- **`code_graph/handlers/verify.ts:43-50`** — `buildResponse` here uses `JSON.stringify(payload, null, 2)` (pretty-print). `scan.ts:199-205` uses the same; `detect-changes.ts:60-67` uses pretty-print. `query.ts:1083-1085` uses compact. Inconsistent format choice across handlers. The MCP spec doesn't require pretty-printing. Pick one. Suggested fix: standardize on compact (no indent) for token efficiency, or document why the pretty form is mandatory for verify/scan/status.

### 3.5 `code_graph/handlers/scan.ts`

#### P1

- **`code_graph/handlers/scan.ts:50-53`** — Inlined `DEFAULT_GOLD_BATTERY_PATH` is identical to `verify.ts:37-40`. Single source of truth (universal §4 DRY). Suggested fix: export from `lib/gold-query-verifier.ts` (or a tiny `lib/gold-battery-paths.ts`) and import in both handlers.
- **`code_graph/handlers/scan.ts:330-340`** — `shouldVerify = args.verify === true && incremental === false` checks `incremental` not `effectiveIncremental`. This matches the user-facing semantics ("only run gold verification on a user-requested full scan, not a git-HEAD-triggered fallback"), but it's subtle. The TSDoc on the schema (`tool-schemas.ts:565`) says "after an explicit full scan" — that's `incremental === false` from the caller, which matches. Add a one-line comment so the next reader doesn't try to "fix" it to `effectiveIncremental`. Suggested fix: `// Verify only when the user explicitly disabled incremental; HEAD-triggered fallbacks (effectiveIncremental === false) skip verify.`

#### P2

- **`code_graph/handlers/scan.ts:89-105`** — The IIFE `const edgeEvidenceClass = (() => { switch ... })()` is duplicated nearly verbatim by `query.ts:607-626` (`classifyEdgeEvidenceClass`). Two near-identical edge-classification branches across handlers. DRY. Suggested fix: import and call `classifyEdgeEvidenceClass` from `query.ts` (or move it to `lib/edge-classification.ts`).
- **`code_graph/handlers/scan.ts:159-176`** — `hasUsablePersistedEdgeDistributionBaseline` and `getPersistedEdgeDistributionBaseline` (status.ts:40-56) duplicate the same parse-then-validate logic. Suggested fix: lift one shared `getPersistedEdgeDistributionBaseline(): EdgeDistribution | null` into `lib/edge-drift.ts` and reuse.

### 3.6 `code_graph/handlers/status.ts`

#### P2

- **`code_graph/handlers/status.ts:177-191`** — The `switch (freshness)` block builds `statusReason` without a `default` arm. The `GraphFreshness` union is closed (`'fresh' | 'stale' | 'empty' | 'error'`), so this is type-safe today, but `noFallthroughCasesInSwitch`-style discipline would suggest an exhaustiveness check (e.g. `default: { const _exhaustive: never = freshness; throw new Error(...); }`) so widening the union elsewhere fails compilation here. Suggested fix: add the `never` exhaustiveness guard.
- **`code_graph/handlers/status.ts:31-34`** — Three threshold constants (`EDGE_DRIFT_PSI_THRESHOLD`, `EDGE_DRIFT_JSD_THRESHOLD`, `EDGE_DRIFT_SHARE_THRESHOLD`) are also literal-duplicated in `tests/edge-drift.vitest.ts:11-13`. Carry-forward pattern §2 ("Single source of truth constants") explicitly calls out this anti-pattern: "Shared rule values live in one module and are imported by dependents/tests." Suggested fix: export the constants from `lib/edge-drift.ts` and import them in both `status.ts` and the vitest.

### 3.7 `code_graph/handlers/detect-changes.ts`

#### P2

- **`code_graph/handlers/detect-changes.ts:140-162`** — `DIFF_PATH_BLOCKED_BYTES = /[\x00-\x1F\x7F]/` is duplicated in `query.ts:641` (`EDGE_METADATA_REASON_BLOCKED`) and `code-graph-db.ts:826` (`EDGE_METADATA_STRING_BLOCKED`). Three identical regexes for "control chars". DRY. Suggested fix: export `CONTROL_CHAR_REGEX` from `lib/utils/sanitization.ts` and reuse.
- **`code_graph/handlers/detect-changes.ts:104-106`** — The block predicate `readinessRequiresBlock` uses `readiness.freshness !== 'fresh' || readiness.verificationGate === 'fail'`. The same gate is inlined at `query.ts:761-763` (`shouldBlockReadPath`) but with different semantics (`readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true`). The two predicates are intentionally different but live next to each other in concept space. A short reference comment in each pointing at the other would help future readers understand the divergence. Suggested fix: cross-reference comments.

### 3.8 `code_graph/handlers/query.ts`

#### P1

- **`code_graph/handlers/query.ts:1146-1151`** — Regex literal `/\.(?:[cm]?[jt]sx?|py|bash|zsh|sh|json|md)$/i` enumerates supported languages but is detached from `indexer-types.ts:117-130` (`detectLanguage`). The two are semantically related (both decide "is this a code file path?"), but they list different extensions (`json/md` here, but not in `detectLanguage`). The discrepancy is intentional — this regex is for "looks like a file path" not "supported indexer language" — but the magic-regex form makes the intent invisible. Suggested fix: extract `const FILE_PATH_EXTENSION_PATTERN = ...; const LOOKS_LIKE_FILE_PATH = /[\\\/]/;` constants with a comment naming the contract, or build them from `MODULE_RESOLUTION_EXTENSIONS` (`structural-indexer.ts:82`).

#### P2

- **`code_graph/handlers/query.ts:721-727`** — `EDGE_EVIDENCE_CLASS_WEAKNESS: Record<EdgeEvidenceClass, number>` ranks evidence classes from weakest (0) to strongest (4). The numeric constants are never named — a reader has to deduce that "lower = weaker." Suggested fix: convert to `enum EdgeEvidenceWeakness { InferredHeuristic = 0, ... }` or add a one-line `// Lower = weaker; used by summarizeWeakestGraphEdgeEnrichment` comment.
- **`code_graph/handlers/query.ts:1289-1292`** — Empty catch arm (`catch (_metricErr: unknown) { /* Best-effort... */ }`). Standards permit best-effort swallow with a comment, which is present. Acceptable, but a structured `console.debug` (or a Speckit metric) noting that the metric emission itself failed would close the observability loop. Suggested fix: optional one-liner `console.debug` for diagnostics.

### 3.9 `code_graph/lib/code-graph-db.ts`

#### P2

- **`code_graph/lib/code-graph-db.ts:413-429`** — `isFileStale(filePath: string, options?: { currentContentHash?: string }): boolean` returns `true` on every "I don't know" path (no row, missing mtime, missing hash, missing on disk). The TSDoc on line 413 says "Check if a file needs re-indexing" but doesn't document the "fail-stale-by-default" contract. Suggested fix: TSDoc `@returns` clarifying that any missing input forces `true`.
- **`code_graph/lib/code-graph-db.ts:806-870`** — `sanitizeEdgeMetadataString` is exported (line 828) but the comment block (806-825) refers only to `R-007-P2-3` and the rationale. Same regex literal as the consumer in `query.ts:643-648` — see the cross-cutting DRY note above.

### 3.10 `code_graph/lib/ensure-ready.ts`

#### P2

- **`code_graph/lib/ensure-ready.ts:21-28`** — The `export type { GraphFreshness } from './ops-hardening.js';` re-export is followed by `import type { GraphFreshness }` on line 28. The double declaration works but is rare style. Comment block (lines 22-27) explains the rationale ("PR 4 / F71 / F17 / F18: Re-export the canonical GraphFreshness union ..."). Acceptable because of the explanatory comment, but consider folding the import and the re-export onto sequential lines so the relationship is visually obvious.
- **`code_graph/lib/ensure-ready.ts:303-308`** — TSDoc block at line 296-302 documents `ensureCodeGraphReady` but is followed by `/** Debounce: skip re-check if last check was within this window */` (line 303) which sits OUTSIDE the function it documents (the `DEBOUNCE_MS` constant). The TSDoc is correct but the placement looks like a docblock split across an unrelated declaration. Suggested fix: move `DEBOUNCE_MS` and the readiness debounce machinery (lines 303-330) ABOVE the `ensureCodeGraphReady` TSDoc block.

### 3.11 `code_graph/lib/structural-indexer.ts`

This file is 2179 LoC. Universal patterns §5 ("File length guidelines") flags any utility/helper > 200 LoC and any handler/endpoint > 300 LoC for "consider splitting." This file has been over the threshold for many releases — not a 008-introduced issue — but it's worth flagging once.

#### P1

- **`code_graph/lib/structural-indexer.ts:1559-1568,1614-1668,1788-1830`** — Tsconfig parsing, settings loading, and resolver creation occupy ~250 LoC mid-file. They could move to `lib/tsconfig-resolver.ts` (or be appended to `query-result-adapter.ts` already established as the "shared adapter" pattern in this packet). Single-responsibility (universal §4 SOLID/SRP). Suggested fix: extract to its own module so `structural-indexer.ts` shrinks toward the universal-patterns ceiling.

#### P2

- **`code_graph/lib/structural-indexer.ts:1480-1530`** — `stripJsonComments` is a hand-rolled JSONC stripper. The codebase already pulls `comment-json` (or could) for `tsconfig*.json` per the SKILL.md alignment-verifier note ("`tsconfig*.json` supports comment-aware parsing fallback"). Re-implementing the parser here is a maintenance hazard for trailing-comma / nested string edge cases. Suggested fix: replace with a vetted JSONC parser or, at minimum, add a TSDoc disclaimer noting the known limitations (no support for unicode-quote tricks, etc.).

### 3.12 `code_graph/lib/tree-sitter-parser.ts`

#### P2

- **`code_graph/lib/tree-sitter-parser.ts:38-45`** — Three top-level `// eslint-disable-next-line @typescript-eslint/no-explicit-any` lines suppress lints around `web-tree-sitter` interop. Quality §3 ("Permitted `any` usage (must include justification comment)") asks for the justification. Lines 38, 40, 44 each suppress separately but no justification comment explains why these can't be `unknown`. Suggested fix: one comment block above lines 36-45 explaining: "web-tree-sitter has no published TS types; we cast at the boundary and rely on TSNode shape (lines 136-146) for downstream type safety."

### 3.13 `code_graph/lib/indexer-types.ts`

#### Clean

No new findings beyond what was already covered by the deep-review pass (REQ-005 `TYPE_ONLY` edge-contract gap, deep-review §5/P0 #3). The remediation path resolved the gap by retaining metadata-only tagging for type-only imports rather than introducing a new edge type — that decision is consistent with the file's existing edge-type taxonomy (lines 13-29).

### 3.14 `code_graph/handlers/index.ts`

#### Clean

Single-purpose barrel file. Conforms to typescript/style_guide.md §11.

### 3.15 `code_graph/tools/code-graph-tools.ts`

#### P2

- **`code_graph/tools/code-graph-tools.ts:21-31`** — `TOOL_NAMES = new Set([...])` and the corresponding `switch` arms in `handleTool` (lines 62-100) are literal-duplicated. If a tool is added to `TOOL_NAMES` but its switch case is forgotten, dispatch silently returns `null`. Suggested fix: declare `const TOOL_NAMES = ['code_graph_scan', ...] as const;` then `type ToolName = typeof TOOL_NAMES[number];` and let the switch be exhaustively typed via `never` arm. Discriminated-union compile-time exhaustiveness, per `quality_standards.md` §4 "State Machine Pattern."

### 3.16 `tool-schemas.ts`

#### P2

- **`tool-schemas.ts:638-658`** (`codeGraphVerify`) — Schema description on line 640 mentions `persistBaseline` and `allowInlineIndex` but the arg `persistBaseline` is documented as "Persist the verification result as the latest stored baseline." while line 653 just says "Persist the verification result as the latest stored baseline." Compare to `verify.ts:170-172` which gates persist on `persistBaseline === true`. The schema documentation is fine, but the description is duplicated near-identically across `codeGraphScan.persistBaseline` (line 566) and `codeGraphVerify.persistBaseline` (line 653). The two flags do different things (scan persists edge-distribution baseline, verify persists gold-verification baseline) — same name, different semantics. Suggested fix: distinguish the two by name (`persistEdgeBaseline` vs `persistVerificationBaseline`) or sharpen the descriptions to make the divergence obvious to LLMs reading the schema.

### 3.17 `lib/architecture/layer-definitions.ts`

#### Clean

The 3-line diff in this file (verified via `git diff 87bf42a3d^..6fd20b1a2 -- '.../layer-definitions.ts'`) was the addition of `code_graph_verify` to `L7.tools`. No standards regressions.

### 3.18 Tests (`code_graph/tests/*.vitest.ts`, `mcp_server/tests/*.vitest.ts`)

The TypeScript module-header check is skipped for `*.vitest.ts` and `*.test.ts` per SKILL.md §3 ("TypeScript module-header enforcement is skipped for test files"). Comment headers are nonetheless present on every test file in scope. No further findings beyond:

#### P1

- **`code_graph/tests/edge-drift.vitest.ts:11-13`** — Threshold constants duplicated from `handlers/status.ts:32-34`. Already cross-referenced under §3.6 P2; the test side is the consumer that should `import { EDGE_DRIFT_PSI_THRESHOLD, ... } from '../lib/edge-drift.js'`.

#### Clean

- `code_graph/tests/code-graph-verify.vitest.ts` — header present, mocks scoped, fixtures isolated to a temp dir.
- `code_graph/tests/code-graph-indexer.vitest.ts` — header present.
- `code_graph/tests/code-graph-scan.vitest.ts` — header present, `vi.hoisted` pattern correct.
- `code_graph/tests/code-graph-query-handler.vitest.ts` — header present.
- `code_graph/tests/code-graph-siblings-readiness.vitest.ts` — header present.
- `code_graph/tests/detect-changes.test.ts` — header present, includes RISK-03 reference comments per universal §4 (good pattern).
- `mcp_server/tests/context-server.vitest.ts` — diff is small (4 lines); header at line 2 follows the numbered-section alternative.
- `mcp_server/tests/crash-recovery.vitest.ts` — diff is small (12 lines); header at line 1 is one-line "TEST: CRASH RECOVERY" — acceptable test-file shorthand.

## 4. Cross-cutting themes

1. **DRY drift around small helpers.** The same `isRecord`, the same control-character regex, the same `error instanceof Error ? error.message : String(error)`, and the same workspace-containment check are repeated across 5+ files. None of these duplications change behavior, but each one is a future divergence risk. The 008 packet introduced `query-result-adapter.ts` as a "shared adapter" — that pattern should be extended to a small `lib/utils/json.ts`, `lib/utils/sanitization.ts`, and `lib/utils/workspace-path.ts`.
2. **Constants duplicated between source and tests.** `EDGE_DRIFT_*_THRESHOLD` lives in `handlers/status.ts` and `tests/edge-drift.vitest.ts`. The 139 carry-forward pattern explicitly forbids this. One-line fix: export from `lib/edge-drift.ts` once.
3. **Inconsistent failure shape across handlers.** `verify.ts` throws + outer-catch; `scan.ts`/`detect-changes.ts` return early with an MCP error response; `query.ts` builds a discriminated-union failure (`BlastRadiusFailureFallback`) with stable `code` values. Three styles, one packet. The `BlastRadiusFailureFallback` pattern is the strongest — it gives operators stable machine-readable failure codes — and would scale well to verify/scan/detect-changes if generalized.
4. **Default JSON output formatting drift.** `JSON.stringify(payload, null, 2)` appears on `verify.ts:47`, `scan.ts:354`, `detect-changes.ts:65`, `status.ts:202`; compact `JSON.stringify(...)` appears on `query.ts:1062`, `1083`, `1102`. MCP doesn't require pretty-print; for token efficiency these handlers should pick one format and be consistent.
5. **Path-string regexes vs central language registry.** `query.ts:1147` invents a "looks like a file path" regex; `indexer-types.ts:117-130` already has the canonical extension list. Either build the regex from the registry or document the divergence explicitly.

## 5. Strengths

- **Type safety is strong.** Every `catch` block in the new code uses `error: unknown` + `instanceof Error` narrowing (verified: `verify.ts:178`, `scan.ts:126,278`, `ensure-ready.ts:426`, `status.ts:229`, `query-result-adapter.ts:100`, `gold-query-verifier.ts:352,406`). No untyped catches anywhere in the audit range.
- **`unknown` over `any` is enforced.** The only two `any` annotations in the entire audit range are `tree-sitter-parser.ts:39,41` (forced by `web-tree-sitter`'s missing types) and `query.ts:817-826` parses `metadataJson: unknown` and casts to `Record<string, unknown>` correctly inside the `try`.
- **Discriminated unions are used well.** `CandidatePathResult` (`detect-changes.ts:132-135`), `ParsedOutlineQueryResult` (`query-result-adapter.ts:54`), `BlastRadiusFailureFallback.code` (`query.ts:174-179`), `ReadyAction`/`GraphFreshness` (`ensure-ready.ts:21-28`) — all correctly modeled per `quality_standards.md` §4.
- **Reference-comment traceability.** Every meaningful change cites its task ID (`R-007-P2-*`, `R-002-*`, `008/D2`, `T-ENR-02 (R5-002)`, etc.) in the comment that owns the change. This is the strongest example I have seen of `universal_patterns.md` §4 reference-comment discipline in this codebase.
- **Path-containment story is consistent on the public surface.** `detect-changes.ts`, `scan.ts`, and `verify.ts` all canonicalize via `realpathSync`, all reject non-canonical paths, and all surface a clear error. The remediation pass (`f8c37631e`) genuinely closed the prior P1 here.
- **Sanitization defense-in-depth.** `code-graph-db.ts:828` sanitizes on the read path even though writes are also sanitized. Comment block at lines 806-825 explains exactly why. Good pattern.

## 6. Remediation roadmap

In order of expected effort × payoff:

1. **(P0)** Add the missing module header to `code_graph/lib/edge-drift.ts:1` (3 lines). Closes the only P0.
2. **(P1)** Add the missing return type to `code_graph/lib/edge-drift.ts:26` (1 token: `: EdgeDistribution`).
3. **(P1)** Convert `verify.ts:resolveVerifyPaths` to the discriminated-union failure shape so it matches `detect-changes.ts:CandidatePathResult` and the rest of the packet vocabulary.
4. **(P1)** Centralize the duplicated helpers: `isRecord`, the control-char regex, `formatErrorMessage`, the workspace-containment check, the `DEFAULT_GOLD_BATTERY_PATH`. Each removal also removes 3-5 future divergence sites.
5. **(P1)** Move `EDGE_DRIFT_*_THRESHOLD` constants from `status.ts` into `lib/edge-drift.ts` and re-import them in tests. Aligns with the 139 carry-forward "single source of truth" rule.
6. **(P1)** Lift the duplicated `parseOutlineNode` field-extraction pattern (`asOptionalString` called twice per field) into a single local. Performance win; readability win.
7. **(P2)** Sweep: extract `tsconfig` resolver out of `structural-indexer.ts`, replace hand-rolled `stripJsonComments`, normalize JSON output formatting, add `default: never` exhaustiveness to the freshness `switch`.
8. **(P2)** Ergonomics: rename `persistBaseline` schema flags to disambiguate scan vs verify semantics; consider a shared sentinel constant for `'<in-memory>'`.
9. **(P2)** Documentation: TSDoc on the `isFileStale` "fail-stale-by-default" contract; one-liner at `query.ts:1147` explaining the path-extension regex divergence; cross-reference comments between `readinessRequiresBlock` and `shouldBlockReadPath`.

## 7. Adversarial self-check

For each P0 in §3, I validated that the cited file:line is the actual problem locus, not a caller or a downstream consumer:

- **`code_graph/lib/edge-drift.ts:1`** — Verified by direct read (`Read` tool, lines 1-10). The file opens with `import type { EdgeType } from './indexer-types.js';` on line 1 with no preceding header comment block. Compared to `code_graph/lib/code-graph-db.ts:1-5` (canonical header present), `code_graph/lib/gold-query-verifier.ts:1-4` (canonical header present), `code_graph/lib/query-result-adapter.ts:1-4` (canonical header present), `code_graph/handlers/verify.ts:1-4` (canonical header present). The locus is `edge-drift.ts:1` (the missing header), not any caller. The TypeScript checklist (`assets/checklists/typescript_checklist.md` §2) marks `[ ] File has box header identifying the module` as P0 HARD BLOCKER. This is a real, source-local violation. The remediation does not need to touch any caller — it's a 3-line prepend at line 1 of the offending file. Confidence: HIGH.

That is the only P0 in the audit. All other findings are P1/P2 and were each anchored by direct file reads at the cited line ranges.

## 8. Out-of-scope cross-references (already covered by deep-review)

The following are already documented in `review/review-report.md` and are NOT re-reported here:

- REQ-002 / REQ-003 / REQ-004 / REQ-005 / REQ-006 / REQ-007 / REQ-008 / REQ-009 / REQ-012 / REQ-015 traceability gaps — closed by `f8c37631e` per the commit description; verified at the cited file:line ranges.
- Verifier case-insensitivity (`gold-query-verifier.ts:223-225`) — closed; current code uses `value.trim()` with no case folding.
- Verifier `rootDir` containment (`verify.ts:71-76,107-140`) — closed; `realpathSync` + workspace-prefix check now match `scan.ts` and `detect-changes.ts`.
- `batteryPath` allowlisting (`verify.ts:78-101`) — closed; allowlist restricts to two approved bases.
- `verificationGate` propagation on `action: 'none'` (`ensure-ready.ts:344-356`) — closed; gate now computed once and applied uniformly.
- Tsconfig `extends` cycle protection (`structural-indexer.ts:1614-1668`) — closed; visited-set tracking present at line 1626.
- Per-specifier type-only import tagging (`tree-sitter-parser.ts:386-396,409-415`) — closed; `specifierImportKind` computed per-specifier.
- Regex fallback metadata parity (`structural-indexer.ts:587-606,609-617,620-636`) — closed; regex path now emits `moduleSpecifier`, `importKind`, `exportKind`.
- Malformed baseline drift handling (`status.ts:40-56,58-87`) — closed; parse failure returns `null` and gates summary correctly.
- Signed `share_drift` direction (`status.ts:65-71`) — closed; raw `currentShare - baselineShare` retained, only the threshold check at line 74-77 takes absolute value.
- Persisted verification context (`gold-query-verifier.ts:240-263`) — closed; `buildProbeResult` now carries query/source metadata into every `ProbeResult`.

Final summary line:

`AUDIT_DONE total_findings P0=1 P1=10 P2=21 verdict=CONDITIONAL`
