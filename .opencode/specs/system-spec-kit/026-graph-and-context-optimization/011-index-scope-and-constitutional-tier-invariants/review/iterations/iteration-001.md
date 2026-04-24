# Iteration 001 — correctness

## Dispatcher
- iteration: 1 of 7
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T08:04:38.636Z
- session: 2026-04-24T08:04:38.636Z (generation 1, lineageMode=new)

## Summary
The three invariants (`/z_future/*` → no memory; `/external/*` → no memory or code-graph; `constitutional` tier → only valid under `/constitutional/`) are correctly encoded by the `index-scope.ts` helper and are consumed at every known indexing entrypoint (memory discovery walker, memory-save guard, memory-parser `isMemoryFile`, and code-graph walker + specificFiles). The regex boundary semantics are sound — segment-anchored `(^|/)<segment>(/|$)` correctly rejects `not_z_future`, `external-deps`, `constitutional-reference` while matching `z_future`, `external`, `constitutional` at any depth, on Windows-normalized paths, and case-insensitively. The main correctness risks are (a) the cleanup script's LIKE patterns do not precisely mirror the regex semantics, (b) `buildPlan` runs outside the transaction (TOCTOU), (c) FTS cleanup relies on an assumed DB trigger that the script does not verify exists, and (d) `path.resolve` does not resolve symlinks, so a symlink from a safe path into `/z_future/` or `/external/` could bypass the guards at save time.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (regions: imports, `prepareParsedMemoryForIndexing`, `indexMemoryFile`, `indexMemoryFileFromScan`, entry guard at 2695)
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` (exclusion wiring at 1127, 1254)
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/index-scope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts`

## Findings - New

### P0 Findings
- None. No invariant is outright broken at the entrypoints the review could reach. Cross-reference with security/traceability iterations may promote some P1s if an exploit path is demonstrated.

### P1 Findings

1. **TOCTOU in cleanup script: plan built outside the transaction** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:376`, `399` — `buildPlan(database)` runs before `database.transaction(() => applyCleanup(database, plan))`. Between the `SELECT` that builds the plan and the `DELETE`s inside the transaction, a concurrent save can insert a new `z_future`/`external`/invalid-constitutional row. That row will not be in `plan.forbiddenIds`/`plan.downgradeIds` and will survive the cleanup. Evidence: `const plan = buildPlan(database); ... const tx = database.transaction(() => applyCleanup(database, plan)); const applied = tx();`. Fix: move `buildPlan` inside the transaction, or add a post-apply rescan + second pass that loops until `collectSummary` reports zero violations.

```json
{
  "claim": "cleanup-index-scope-violations.ts builds its plan outside the transaction, permitting TOCTOU races where a concurrent save can insert a violating row between plan-build and apply.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:376", ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:399"],
  "counterevidenceSought": "Checked whether a WAL-mode advisory lock, a global Mutex, or a post-apply verify loop exists — none do in this script. Main handler does use getSpecFolderLock() elsewhere, but cleanup does not.",
  "alternativeExplanation": "In practice the cleanup is run by an operator at quiescent moments; concurrent saves are unlikely. The invariant is still a correctness invariant, not an operational one, so the race remains a latent bug.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "Evidence that the SQLite connection holds an exclusive lock for the duration of both queries (e.g., PRAGMA locking_mode=EXCLUSIVE set elsewhere in the script) would reduce this to P2."
}
```

2. **FTS cleanup relies on an assumed trigger that the script does not verify** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:46`, `281` — `ftsCleanupStrategy: 'memory_index_trigger'` is a stringly-typed claim. The script never checks that a `memory_fts` trigger exists on `memory_index` DELETE; it trusts the schema. If the trigger is absent or the schema has drifted (e.g., a migration moved FTS to a shadow table), orphan FTS rows will remain and search will surface deleted z_future/external content. Fix: at the top of `main()` run `SELECT name, tbl_name FROM sqlite_master WHERE type='trigger' AND tbl_name='memory_index'` and abort with a clear error if no DELETE trigger for `memory_fts` is found.

```json
{
  "claim": "The cleanup script asserts FTS cleanup happens via a memory_index trigger but never verifies the trigger exists at runtime, leaving a silent failure mode.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:46", ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:281"],
  "counterevidenceSought": "Grepped the script for 'fts', 'trigger', 'sqlite_master' — no runtime verification. No test asserts that FTS is empty after cleanup in the checked-in suite.",
  "alternativeExplanation": "If the schema is guaranteed by migrations and an integration test locks in the trigger existence, this becomes a documentation concern (P2). The current repo does not show such an integration test in scope.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Find a migration + test that guarantees the memory_fts DELETE trigger on memory_index at schema-init time."
}
```

3. **Symlink bypass at save time** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306` — `canonicalFilePath = path.resolve(parsed.filePath).replace(/\\\\/g, '/')` resolves `..` and absolutizes, but does NOT follow symlinks (`fs.realpathSync` is not used). A symlink `specs/001-active/plan.md` → `specs/.../z_future/real-plan.md` passes `shouldIndexForMemory(canonicalFilePath)` because the string `/z_future/` never appears in the resolved-but-not-realpath'd canonical path. Then `memoryParser.parseMemoryFile` reads the symlink target. Fix: call `fs.realpathSync` (with a try/catch for broken links) before the `shouldIndexForMemory` check, so the invariant compares against the realpath. Applies equally to the code-graph walker at `structural-indexer.ts:1254` `resolve(filePath)`.

```json
{
  "claim": "The save-time and code-graph path checks use path.resolve rather than fs.realpath, so a symlink pointing into /z_future/ or /external/ is not detected as forbidden.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:306", ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1254"],
  "counterevidenceSought": "Checked canonical-path.ts for realpath usage — `getCanonicalPathKey` and `canonicalizeForSpecFolderExtraction` are for string normalization, not symlink resolution. Grepped for 'realpath' in the scope — no hits in save or walker paths.",
  "alternativeExplanation": "If the workspace has a policy against symlinks under specs/ and .opencode/ (not enforced in code), this becomes a defense-in-depth gap rather than an exploitable bug. Since the invariants are user-directed as absolute, the gap remains P1.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "An operator assertion that symlinks are structurally impossible in this repo layout plus a lint/CI check enforcing it."
}
```

4. **Cleanup LIKE patterns miss rows with no leading slash** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:99`, `103`, `107`, `117-123` — All filter clauses use `file_path LIKE '%/z_future/%'` (with a leading `/`). A DB row with a relative `file_path` like `z_future/foo.md` or `external/vendor.ts` (no leading slash) will not match. Current DB snapshot shows absolute paths, but `memory_save` does not enforce absolute-path storage at the schema level (no CHECK constraint seen). Fix: use the same segment-boundary semantics as the regex — either `(file_path LIKE '%/z_future/%' OR file_path LIKE 'z_future/%')` or pre-normalize and store absolute paths with a DB CHECK.

```json
{
  "claim": "Cleanup SQL uses '%/z_future/%' style LIKE patterns which miss rows where file_path begins with 'z_future/' (no leading slash), diverging from the regex's (^|/) boundary semantics.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:99", ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:103", ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:117"],
  "counterevidenceSought": "Checked whether memory-save enforces absolute paths before insert — `validateFilePathLocal` and `canonicalFilePath = path.resolve(...)` produce absolute paths in observed code, but there is no schema-level guarantee and no test that asserts it.",
  "alternativeExplanation": "If every caller path is empirically absolute (confirmed by the current snapshot), this is only theoretical. But the cleanup script is the second line of defense; it should not assume the first line never fails.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "A schema CHECK constraint or a startup-time assertion that all memory_index.file_path rows begin with '/'."
}
```

5. **Cleanup script has no idempotence short-circuit** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:363-411` — Running `--apply` on an already-clean DB still builds a plan, opens a transaction, and executes the full batch of DELETE/UPDATE statements (all no-ops, so no data harm). But there is no upfront `if (before.zFutureRows === 0 && before.externalRows === 0 && before.invalidConstitutionalRows === 0 && before.gateEnforcementDuplicates <= 1) { printSummary('Clean'); process.exit(0); }`. Documentation claims idempotence (per strategy.md "Live DB state after cleanup: ... 0 z_future, 0 external, 0 invalid-constitutional"); the code does not enforce it explicitly. Risk: low, but if a future change adds a side-effect (e.g., logging a CHANGELOG row), it will double-log. Fix: add an early-exit on clean state.

```json
{
  "claim": "cleanup-index-scope-violations.ts --apply has no early-exit on an already-clean DB; it always runs the full transaction. This is functionally idempotent today but fragile to future side-effectful additions.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:394", ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:399"],
  "counterevidenceSought": "Looked for an early-return branch when `before` summary shows no violations — none.",
  "alternativeExplanation": "Transactional no-ops are safe. This is a maintainability-adjacent correctness concern, not a live bug.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "Evidence that operators always run --verify first, making --apply only fire when work is pending."
}
```

6. **`stripDeletedIdsFromMutationLedger` is a silent no-op** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:232-237` — Named like it does work, actually returns 0 unconditionally. If a `mutation_ledger` table exists (or gets added later) and references `memory_id`s that the cleanup deletes, the ledger will be left with dangling references. Either implement it or delete the stub and document the decision.

```json
{
  "claim": "stripDeletedIdsFromMutationLedger is a stub that returns 0, but is called in applyCleanup as if it performed work. Any future mutation_ledger entries will not be cleaned.",
  "evidenceRefs": [".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:232", ".opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:293"],
  "counterevidenceSought": "Grepped for 'mutation_ledger' in the mcp_server code — could not confirm whether the table exists today; if it does not, the stub is harmless.",
  "alternativeExplanation": "Planned future table; stub is intentional scaffolding.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "Confirm that mutation_ledger does not exist in any migration and mark the stub with a TODO + dated milestone."
}
```

### P2 Findings

1. **`isConstitutionalPath` recompiles the regex on every call** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:50-52` — `compileSegmentPattern('constitutional')` is invoked per call instead of being cached as a module-level `const`. No correctness impact; mild allocation overhead on hot paths (save, walker). Suggest: `const CONSTITUTIONAL_SEGMENT = compileSegmentPattern('constitutional');` at module top.

2. **README.md rejection is defense-in-depth by coincidence, not by explicit rule** — `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-979` — `isMemoryFile` rejects `readme.md` only on the constitutional branch (line 973 `basename !== 'readme.md'`). The spec-document branch also rejects it because `SPEC_DOCUMENT_FILENAMES_SET` does not contain `readme.md`. This is correct today but relies on two separate lists agreeing. If someone adds `readme.md` to `SPEC_DOCUMENT_FILENAMES`, the guard disappears. Fix: add an explicit early-return `if (basename === 'readme.md') return false;` at the top of `isMemoryFile`.

3. **`shouldIndexForMemory` entry guard at `memory-save.ts:2695` uses `validatedPath` (relative OK), deep guard at `306` uses resolved path** — `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2695`, `306-309` — Two separate guard invocations with slightly different inputs. If a caller passes a relative path that does not contain `z_future`/`external` before `path.resolve`, the 2695 guard will pass; the 306 guard runs against the resolved path and still catches it. Defense-in-depth holds, but the asymmetry is a maintenance hazard. Suggest: canonicalize once at the entry and share.

4. **`EXCLUDED_FOR_CODE_GRAPH` includes `dist` as a blanket segment** — `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:36` — `dist` at any segment level is excluded. That also excludes legitimate `src/distributed/*` if anyone uses that name (not common, but possible). Not an invariant violation; document or rename. The current test at `index-scope.vitest.ts:67` asserts `/workspace/dist/generated.js` is excluded, which is the intended behavior.

5. **Cleanup `collectSummary.zFutureRows` mixes two OR conditions** — `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:99` — The count includes rows where `spec_folder LIKE '%z_future%'` OR `file_path LIKE '%/z_future/%'`. If a row's `file_path` is clean but `spec_folder` is stale text like `z_future_notes`, the count inflates. The actual delete query (line 118-123) correctly uses only `file_path`. Counters and deletes can diverge, producing confusing operator output. Align the two.

## Traceability Checks
- **spec_code** protocol: partial — `index-scope.ts` exists and is consumed at every claimed call site (discovery walker, memory-save guard, memory-parser, structural-indexer for both glob-walk and specificFiles). Not cross-referenced to spec.md yet — deferred to iteration 3.
- **checklist_evidence** protocol: not executed in this iteration — deferred to iteration 3 (traceability dimension).

## Confirmed-Clean Surfaces
- `EXCLUDED_FOR_MEMORY` and `EXCLUDED_FOR_CODE_GRAPH` in `index-scope.ts:25-40` — the pattern lists are complete and correctly segment-anchored. Mental regex tests confirm correct behavior on `z_future`, `not_z_future`, `external`, `external-deps`, `constitutional`, `constitutional-reference`, Windows backslash paths, and case variants (case-insensitive flag).
- `findSpecDocuments` and `findGraphMetadataFiles` in `memory-index-discovery.ts:66-125, 209-269` — correctly call `shouldIndexForMemory` at both directory and file levels before recursing/including.
- `findConstitutionalFiles` in `memory-index-discovery.ts:174-206` — correctly rejects `readme.md` (case-insensitive via `.toLowerCase()`) and calls `shouldIndexForMemory`.
- Save-time guard at `memory-save.ts:306-315` — unconditional, downgrades (not blocks), fires for BOTH direct saves and `indexMemoryFileFromScan` (via shared `prepareParsedMemoryForIndexing`). Verified by `memory-save-index-scope.vitest.ts` which tests both `handleMemorySave` and `indexMemoryFileFromScan`.
- Code-graph walker at `structural-indexer.ts:1127` and specificFiles at `1254` — both call `shouldIndexForCodeGraph`. The test at `index-scope.vitest.ts:93-114` covers the specificFiles path.
- Regex boundary: verified by direct node execution — rejects `not_z_future/foo.md`, accepts `/workspace/Z_Future/foo.md` (case-insensitive), rejects `external-deps/foo.md`, accepts `/workspace/foo/external`.

## Boundary Cases Probed
- `not_z_future/foo.md` → `shouldIndexForMemory = true` (correctly permitted).
- `external-deps/foo.md` → `shouldIndexForMemory = true` (correctly permitted).
- `constitutional-reference/README.md` → `isConstitutionalPath = false`, so would not be classified as constitutional memory. Correct.
- `Z_Future/foo.md` (case variant) → rejected (case-insensitive flag on regex). Correct.
- Windows `C:\repo\z_future\foo.md` → `normalizeIndexScopePath` replaces `\\` with `/`, then rejected. Correct.
- Double-slash `/foo//z_future/bar.md` → normalized to `/foo/z_future/bar.md` by `.replace(/\/+/g, '/')`. Rejected. Correct.
- `/foo/external_docs/x.md` → permitted (no segment boundary match on `external`). Correct.
- `/foo/EXTERNAL/x.md` → rejected (case-insensitive). Correct.
- Symlink `specs/001-active/plan.md` → `z_future/real.md` → NOT detected; P1 finding #3.
- Relative path `z_future/foo.md` at save time → `path.resolve` prepends cwd; if cwd is repo root the resolved path contains `/z_future/` and is rejected. If cwd is inside `z_future/`, the resolved path loses the segment. Edge case; mitigated because `validateFilePathLocal` likely requires absolute paths (not verified here; deferred to security iteration).

## Coverage
- Dimension: correctness — covered
- Files reviewed: 9 (see "Files Reviewed")
- Remaining dimensions: security, traceability, maintainability

## Next Focus
**security** — focus areas:
1. Does the cleanup script's SQL use parameterized queries everywhere? (Line 178 uses dynamic SQL via `placeholders(ids)` — verify no user-controlled input reaches it.)
2. Does `indexMemoryFileFromScan` path-traversal-harden `filePath` before `path.resolve`, or could a `..` escape the intended scope?
3. Does the save-time guard leak information via the `[memory-save]` warn log (path disclosure)?
4. Symlink-based privilege escalation: can an unprivileged writer create a symlink from a safe path into `/external/` and cause the code-graph to ingest arbitrary content once the invariant is defeated?
5. Verify `memory_fts` trigger assumption from a threat model perspective — if an attacker disables the trigger via DB access, does any other guard catch it?
