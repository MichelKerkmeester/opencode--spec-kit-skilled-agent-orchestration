# Iteration 004 — maintainability

## Dispatcher
- iteration: 4 of 7
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T11:15:00Z
- session: 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)

## Summary
Maintainability pass finds that the packet ships a single source-of-truth helper (`index-scope.ts`) but several adjacent modules and the cleanup script do NOT route through it. Two **parallel exclusion lists** exist in `spec-doc-paths.ts` and `memory-index-discovery.ts` that already overlap the helper (both carry `z_archive`/`external`); a future change to invariants 1–3 will need to be made in three places. The cleanup script re-expresses the regex semantics as ad-hoc SQL `LIKE` patterns (correctness impact already tracked as P1-004; the maintainability framing is that there is no comment/docstring pointing cleanup authors at the shared helper). Shipped code has **zero back-references** to packet 011, ADR-004, or ADR-005 — a future maintainer deleting the `parsed.importanceTier = 'important'` line at `memory-save.ts:314` has no local signal that it enforces a user-directed invariant. Cleanup script diverges from the sibling-script convention (`cleanup-orphaned-vectors.ts`) on DB_PATH resolution (local `fileURLToPath` vs shared `@spec-kit/shared/paths` import), section banners, and banner comments. The two vitest files pass but test-visibility is limited: `EXCLUDED_FOR_MEMORY`/`EXCLUDED_FOR_CODE_GRAPH` are exported, but `compileSegmentPattern`, `normalizeIndexScopePath`, `isConstitutionalPath` caching helpers are not; the tests probe only 7 positive happy paths and one specificFiles case. No JSDoc on any exported function in `index-scope.ts`. No dead-code findings beyond the already-reported `stripDeletedIdsFromMutationLedger` stub (P1-006); no `TODO`/`FIXME` in new files; no stray `console.log` that should be `console.debug` beyond the deliberate CLI output.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (regions: `prepareParsedMemoryForIndexing` 298–318)
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` (regions: `isMemoryFile` 954–979)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` (regions: `shouldExcludePath` 1120–1135, `findFiles` 1190–1240, `collectSpecificFiles` 1242–1280)
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts` (reference sibling for convention comparison)
- `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/README.md` (invariants section 111–116)

## Findings - New

### P0 Findings
- None.

### P1 Findings

1. **Parallel exclusion lists in `spec-doc-paths.ts` duplicate `index-scope.ts` invariants** — `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:29-47`, `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25-40` — `SPEC_DOCUMENT_EXCLUDED_SEGMENTS` (line 29) carries `/z_archive/`; `GRAPH_METADATA_EXCLUDED_SEGMENTS` (line 40) does not. Meanwhile `EXCLUDED_FOR_MEMORY` at `index-scope.ts:25-29` also carries `z_archive`. Result: `canClassifyAsSpecDocument` runs `shouldIndexForMemory` AND a separate substring check on its own `SPEC_DOCUMENT_EXCLUDED_SEGMENTS`. A future change that (e.g.) renames `/z_archive/` to `/zarchive/` must be applied in both files or the two layers disagree. The two-layer check is defense-in-depth today but is undocumented as such — no comment explains why both exist. Fix: (a) add a JSDoc block at the top of `SPEC_DOCUMENT_EXCLUDED_SEGMENTS` stating that it is an **additional** narrowing on top of `shouldIndexForMemory` for non-invariant working-artifact filtering (`/memory/`, `/scratch/`, `/temp/`, `/review/`, `/research/iterations/`, `/review/iterations/`, `/node_modules/`), then **remove the duplicated `/z_archive/` entry** so the helper owns it alone. (b) Similarly document `GRAPH_METADATA_EXCLUDED_SEGMENTS`. This collapses to a rule: "invariant-1/2/3 patterns live only in `index-scope.ts`; working-artifact narrowing lives here; the two never overlap."

```json
{
  "claim": "SPEC_DOCUMENT_EXCLUDED_SEGMENTS and EXCLUDED_FOR_MEMORY both contain z_archive, creating two sources of truth for the same invariant with no documentation of the layering contract.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:29", ".opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:34", ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25", ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:28"],
  "counterevidenceSought": "Checked whether the duplication is a deliberate defense-in-depth documented anywhere — no comment in either file, no entry in decision-record.md, no JSDoc on SPEC_DOCUMENT_EXCLUDED_SEGMENTS. Grepped for 'z_archive' across both files — confirmed it is repeated.",
  "alternativeExplanation": "The two lists serve semantically different roles (invariant-level exclusion vs working-artifact filtering). That distinction is real but is not written down anywhere in code or docs; a junior maintainer cannot reconstruct it.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "A comment block added to either file explaining the layering + confirming the duplication is intentional would reduce this to P2."
}
```

2. **`SPEC_DOC_EXCLUDE_DIRS` in `memory-index-discovery.ts` is a THIRD exclusion source with partial overlap** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:28` — The walker carries its own `new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive'])` which is consulted at `line 73` and `line 224` before `shouldIndexForMemory(fullPath)`. This set hardcodes the same `z_archive` + `node_modules` segments that `index-scope.ts` already covers, and introduces `'iterations'` which is not in either `EXCLUDED_FOR_MEMORY` or `SPEC_DOCUMENT_EXCLUDED_SEGMENTS`. Three separate lists now govern what is excluded from spec-document discovery: (i) `EXCLUDED_FOR_MEMORY`, (ii) `SPEC_DOCUMENT_EXCLUDED_SEGMENTS`, (iii) `SPEC_DOC_EXCLUDE_DIRS`. The `'iterations'` entry also differs in granularity from `/research/iterations/` + `/review/iterations/` in `spec-doc-paths.ts` — the walker excludes ANY directory named `iterations` anywhere in the tree (e.g., would also exclude `/workspace/iterations-foo/` if someone created it). Fix: fold `SPEC_DOC_EXCLUDE_DIRS` into `SPEC_DOCUMENT_EXCLUDED_SEGMENTS` (or export a single combined checker from `spec-doc-paths.ts`) and delete the local constant. Flagging as P1 because it is concrete drift already — the three lists do not agree on granularity — and a future invariant-4 add will need to be made in all three places or it will silently not fire.

```json
{
  "claim": "memory-index-discovery.ts defines its own SPEC_DOC_EXCLUDE_DIRS set that overlaps with both EXCLUDED_FOR_MEMORY and SPEC_DOCUMENT_EXCLUDED_SEGMENTS but disagrees on the 'iterations' bare-directory match granularity, creating three-way drift.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:28", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:73", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:224"],
  "counterevidenceSought": "Checked whether this is a performance short-circuit documented in a comment — no comment. Checked whether 'iterations' exists in the other two lists — it does not; they use '/research/iterations/' and '/review/iterations/' with parent-segment anchoring.",
  "alternativeExplanation": "A walker-local fast-path for entry.name checks without constructing full paths. Valid optimization, but the overlap with shared helpers is not acknowledged and the 'iterations' granularity gap is real drift.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Either (a) remove the overlap by making SPEC_DOC_EXCLUDE_DIRS import from spec-doc-paths.ts, or (b) document the three-layer contract in a comment block. Either reduces to P2."
}
```

3. **No code back-references to packet 011, ADR-004, or ADR-005 anywhere in shipped implementation** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:1-52`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306-315`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:954-979` — Grep for `packet 011`, `011-index-scope`, `ADR-004`, `ADR-005` across all four touched files returns **zero hits**. The save-time guard at `memory-save.ts:310-314` that implements the user-directed constitutional-tier invariant has no comment pointing back to where the policy was decided. A future refactor doing "simplify this downgrade — just throw if non-constitutional" would silently revert the ADR-004 decision (soft downgrade vs hard reject). Similarly, `isMemoryFile` at `memory-parser.ts:973` rejects `readme.md` on the constitutional branch — the ADR-005 decision that README files are excluded — with zero inline documentation of why. Fix: add `// Invariant (packet 011, ADR-004): non-constitutional paths downgrade to 'important'; do not throw` at `memory-save.ts:310`, and `// Invariant (packet 011, ADR-005): constitutional/readme.md is NOT indexed` at `memory-parser.ts:973`. Similarly JSDoc the three exported functions in `index-scope.ts` citing the spec folder.

```json
{
  "claim": "The shipped implementation of packet 011 carries no inline comments, JSDoc, or ADR back-references, so the policy rationale for the save-time guard, README exclusion, and tier downgrade is invisible to a future maintainer who is working in the file without reading the 011 spec.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:1-52", ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306-315", ".opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:970-978"],
  "counterevidenceSought": "Ran `grep -n 'packet 011\\|011-index-scope\\|ADR-004\\|ADR-005'` across the four core implementation files — zero hits. Checked mcp_server/README.md for an Invariants section — it does describe the three invariants at lines 111-116, so repo-level documentation exists, but the code itself does not link back. Checked the JSDoc comment on isMemoryFile line 954 — it calls the function 'indexable by the memory system (spec document or constitutional memory)' without naming the invariant.",
  "alternativeExplanation": "Convention in this codebase may be to rely on spec folders and README anchors rather than inline ADR refs. Even if so, the high-risk guard at memory-save.ts:310 is a policy-grade decision that warrants a pointer, because removing the line is one keystroke.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "A single comment line added to memory-save.ts:310 and memory-parser.ts:973 citing the invariant source would reduce this to P2."
}
```

### P2 Findings

1. **Cleanup script diverges from sibling-script conventions (DB_PATH source, banners)** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:1-10`, `57-59`, vs `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:14-15`, `26-34` — The sibling uses `import { DB_PATH } from '@spec-kit/shared/paths';` (single source of truth for the database file); the new script uses an inline `const DB_PATH = fileURLToPath(new URL('../../../mcp_server/database/context-index__voyage__voyage-4__1024.sqlite', import.meta.url));`. If the DB filename ever rotates (e.g., new embedding model bumps to `voyage-5`), the sibling follows automatically while the new script silently opens a non-existent path. Additionally, the sibling uses `// ─── 1. INTERFACES ───`, `// ─── 2. CONFIGURATION ───`, `// ─── 3. MAIN FUNCTION ───` banner comments; the new script uses a flat module-level declaration with no sections. Minor, but inconsistent codebase style for future maintainers.

2. **No test-visible access to `compileSegmentPattern`, `normalizeIndexScopePath`, or `isConstitutionalPath`** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:8-18`, `50-52`, vs `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts:7-11` — The test file imports only `EXCLUDED_FOR_MEMORY`, `EXCLUDED_FOR_CODE_GRAPH`, `shouldIndexForMemory`, `shouldIndexForCodeGraph`. The other exports that carry invariant logic (`isConstitutionalPath`) are never unit-tested. Substring boundary tests (e.g., `/workspace/constitutional-reference/foo.md` should return `false` from `isConstitutionalPath`) are absent. Windows-path tests exist only implicitly via `normalizeIndexScopePath` being called inside the patterns. Fix: add explicit direct tests for `isConstitutionalPath` covering `/constitutional/`, `/Constitutional/`, `constitutional-reference`, `not_constitutional`, and Windows backslash variants.

3. **`index-scope.ts` has no JSDoc on any exported function** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:42-52` — Three exported functions (`shouldIndexForMemory`, `shouldIndexForCodeGraph`, `isConstitutionalPath`) have zero JSDoc. The top-of-file module comment `MODULE: Index Scope Invariants` is a section banner, not a contract description. Consumers (five call sites across `memory-save.ts`, `memory-index-discovery.ts`, `memory-parser.ts`, `spec-doc-paths.ts`, `structural-indexer.ts`) have to read the regex arrays to understand what each function promises. Fix: add JSDoc summarizing the invariant each function enforces (e.g., "Returns false for paths containing `/z_future/`, `/external/`, `/z_archive/` segments (case-insensitive, Windows-normalized). Enforces invariants 1–2 from packet 011.").

4. **Tests do not lock in that `readme.md` is excluded under `/constitutional/`** — `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts:49-114` — No test asserts that `isMemoryFile('/workspace/.opencode/skill/foo/constitutional/readme.md') === false`. ADR-005 is a user-directed invariant. Without a regression test, a future PR that adds `readme.md` to `SPEC_DOCUMENT_FILENAMES_SET` (a single-line change) silently re-opens the exclusion. P2-002 already flagged this in iter-1 from the correctness angle (defense-in-depth-by-coincidence); this P2 is specifically about the test gap.

5. **Operator-facing `--verify` has no CI hook documented** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:386-392`, `.opencode/skill/system-spec-kit/mcp_server/README.md:111-116` — The script exposes `--verify` (exit code 0 clean, 1 violations) precisely for CI drift detection, but neither the README invariants section nor any CI config (`.github/workflows/*`, `package.json` scripts) references it. Without a scheduled CI job running `node dist/scripts/memory/cleanup-index-scope-violations.js --verify`, the DB can drift undetected between releases. Fix: add a `postbuild`/`ci:verify-invariants` script entry in `mcp_server/package.json` or a CI workflow line, and a one-line reference in `mcp_server/README.md:111` pointing operators at the `--verify` mode.

6. **Function naming: `shouldIndexForMemory` is ambiguous with "memory" as RAM vs memory-system-index** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:42`, `46` — "Memory" in this codebase can mean (a) the canonical memory-system index (what these functions gate) or (b) in-process RAM (used elsewhere, e.g., `memory.usage`). The symmetric pair `shouldIndexForMemory` / `shouldIndexForCodeGraph` works only if the reader knows that "memory" is shorthand for "memory-system" (i.e., `memory_save` + `memory_index` table). A slightly more explicit name (`shouldIndexForMemorySystem` / `shouldIndexForCodeGraphSystem`) would remove that ambiguity. Low priority rename; flagging only for future consideration.

## Traceability Checks
- **spec_code** protocol (maintainability variant): pass — the consumer call-sites enumerated in iter-1 (save, discovery, parser, structural-indexer, cleanup) all route through the helper for the invariant regex itself; the maintainability gap is that **parallel working-artifact lists** and **missing inline back-references** sit alongside those call-sites, not that the helper is bypassed. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:307`, `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:957`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:73`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:224`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1126`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1267`.
- **style_consistency** protocol (ad-hoc): partial — cleanup script diverges from sibling conventions (DB_PATH source, section banners). Captured as P2-013.

## Confirmed-Clean Surfaces
- **No dead code beyond P1-006** — grepped `TODO`, `FIXME`, `XXX` across `index-scope.ts`, `cleanup-index-scope-violations.ts`, `memory-save.ts` (new lines only): zero matches.
- **No stray debug `console.log`** — all `console.log` calls in `cleanup-index-scope-violations.ts:338-395` are deliberate CLI output (summary reporting, planned-actions reporting, help text). `console.warn` at `memory-save.ts:311` is the documented downgrade signal (separate log-injection concern already tracked as P1-007).
- **No commented-out code blocks** in any reviewed file.
- **No unused imports** — `import { isConstitutionalPath, shouldIndexForMemory } from '../lib/utils/index-scope.js'` at `memory-save.ts` and parallel imports at all call sites are consumed.
- **No magic numbers** in the new code — batch sizes, timeouts, limits: none introduced. The single hardcoded string `'memory_index_trigger'` at `cleanup-index-scope-violations.ts:46,281` is a type-level literal (`ftsCleanupStrategy: 'memory_index_trigger'`), tracked as P1-002 from a correctness angle.
- **CLI UX follows convention** — `--apply`, `--verify`, `--help`, `-h` flags match sibling `cleanup-orphaned-vectors.ts --dry-run, --help, -h`. Exit codes (0 clean, 1 violations) are documented in `HELP_TEXT`.
- **`isMemoryFile` constitutional-branch readme rejection** lives at `memory-parser.ts:973` with case-insensitive `basename.toLowerCase()` — the logic is correct; only the test + comment gap is flagged.

## Boundary Cases Probed (maintainability-framed)
- If a sixth invariant is added (e.g., `/sandbox/` excluded), how many files change? **Answer: three** (`index-scope.ts`, `spec-doc-paths.ts` for working-artifact narrowing, `memory-index-discovery.ts` SPEC_DOC_EXCLUDE_DIRS) — confirms P1-013 / P1-014 finding.
- If the DB filename rotates (voyage-4 → voyage-5), how many cleanup scripts break? **Answer: one** — `cleanup-index-scope-violations.ts` (inline URL). Sibling `cleanup-orphaned-vectors.ts` follows the shared `@spec-kit/shared/paths` export. Confirms P2-013.
- If `SPEC_DOCUMENT_FILENAMES_SET` grows to include `readme.md` (one-line PR), does the constitutional-readme invariant break? **Answer: yes, silently** — no test guards it (P2-002 iter-1 + P2-016 this iter from a test-gap angle).
- If the save-time downgrade branch is refactored ("simplify — just throw"), is ADR-004's soft-downgrade choice visible? **Answer: no** — no inline comment at `memory-save.ts:310-314` (P1-015).
- If a junior maintainer scans `spec-doc-paths.ts`, do they know `SPEC_DOCUMENT_EXCLUDED_SEGMENTS` is an additive layer on top of `shouldIndexForMemory`? **Answer: no** — no JSDoc, no comment (P1-013).

## Novelty Calculation
- 3 new P1s (P1-013, P1-014, P1-015) × 5 = 15
- 6 new P2s (P2-013..P2-018) × 1 = 6
- weightedTotal = 21
- weightedNew = 21
- newFindingsRatio = 21 / 21 = **1.0**
- Narrative adjustment: All 9 findings are fully new categories (single-source-of-truth drift, inline ADR back-reference gap, test-visibility, style-convention drift, CI-hook absence). None re-report prior iterations. P1-014's `'iterations'` granularity gap is adjacent to P1-004 (cleanup LIKE divergence) conceptually but is a distinct finding about walker-vs-helper drift.
- No new P0 → no override.

## Coverage
- Dimension: maintainability — covered
- Files reviewed: 10 (see "Files Reviewed")
- Remaining dimensions (for deeper-pass iterations 5-7): correctness (edge cases), security (edge cases), synthesis

## Next Focus
**iteration 5 — correctness (deeper pass)**. Priorities:
1. Revisit the specificFiles path in `structural-indexer.ts:1254` for additional edge cases beyond the symlink gap (P1-003): relative paths with `..`, paths that resolve cross-workspace, paths whose real target is outside `rootDir`.
2. Test the interplay of `matchesScopedSpecFolder` (discovery) with `shouldIndexForMemory` — does a `specFolder` option scoped to `z_future/foo/` silently produce empty results (correct-by-accident) or does it crash?
3. Edge case: what if a caller sends `indexMemoryFileFromScan` a path that `shouldIndexForMemory` permits but `canClassifyAsSpecDocument` rejects (e.g., a `.md` outside `/specs/`)? Trace both paths to confirm no orphan row.
4. Cross-reference the `canonicalFilePath` vs `parsed.filePath` asymmetry (P2-003 iter-1) — the guard at `memory-save.ts:2695` has received less review than the `306` guard.
5. Synthesis guardrail: with 27+ cumulative findings across correctness + security + traceability + maintainability, do any findings **contradict** (e.g., one iteration's "ruled out" vs another's "P1")? Scan for inconsistencies before iter-6/iter-7.

Early-convergence recommendation: **CONTINUE to iter-5**. Convergence ratio this iteration is 1.0 (all fresh findings). While total coverage of the four declared dimensions is now complete, the high new-finding rate indicates the maintainability pass did find categories the earlier dimensions missed; iter-5/6 should verify that correctness + security do not themselves have uncovered edge cases before synthesizing at iter-7.
