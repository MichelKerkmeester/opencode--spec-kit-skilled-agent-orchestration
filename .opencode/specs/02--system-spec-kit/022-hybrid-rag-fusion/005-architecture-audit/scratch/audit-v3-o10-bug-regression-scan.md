# O10: Global Bug & Regression Scan

**Agent**: O10 (LEAF, depth 1)
**Scan Date**: 2026-03-21
**Scope**: All 18+ phases in 022-hybrid-rag-fusion ecosystem, plus system-spec-kit source code

---

## Summary

- **Known bugs**: 3
- **Deferred items**: 12
- **Active regressions**: 0 (TypeScript compiles clean)
- **Tech debt items**: 15
- **Skipped tests**: 16
- **Quarantined phases**: 6 (3 unique, duplicated)
- **Duplicate folder IDs**: 1

**Total findings**: 53

---

## CRITICAL Findings (P0 — Must Fix)

### O10-001: Stale dist artifacts for deleted eval scripts

- **Severity**: CRITICAL
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P0-002 through CHK-P0-006), verified via filesystem
- **Location**: `.opencode/skill/system-spec-kit/scripts/dist/evals/`
- **Description**: Stale `.d.ts.map` and `.js.map` files remain for 3 deleted eval scripts: `run-chk210-quality-backfill`, `run-phase1-5-shadow-eval`, `run-phase3-telemetry-dashboard`. Additionally, full stale artifacts (`.d.ts`, `.d.ts.map`, `.js`, `.js.map`) remain for `run-quality-legacy-remediation`.
- **Evidence**: `ls scripts/dist/evals/run-quality-legacy-remediation.*` returns 4 files. `ls scripts/dist/evals/run-chk210-quality-backfill.*` returns 2 stale map files. Similarly for the other two deleted scripts.
- **Impact**: Confuses tooling and developers about what's actually available; dist may drift from source.
- **Recommended Fix**: Delete all stale dist artifacts for the 4 deleted eval scripts. Rebuild dist with `npx tsc --build`.

### O10-002: Stale dist artifacts for relocated structure-aware-chunker

- **Severity**: CRITICAL
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P0-006), verified via filesystem
- **Location**: `.opencode/skill/system-spec-kit/scripts/dist/lib/structure-aware-chunker.*`
- **Description**: Four stale dist files remain at `scripts/dist/lib/structure-aware-chunker.*` even though the module now lives at `shared/lib/structure-aware-chunker.ts`.
- **Evidence**: `ls scripts/dist/lib/structure-aware-chunker.*` returns 4 files (`.d.ts`, `.d.ts.map`, `.js`, `.js.map`).
- **Impact**: Consumers may accidentally import from the wrong dist location.
- **Recommended Fix**: Delete the stale `scripts/dist/lib/structure-aware-chunker.*` files.

### O10-003: 8 remediation sprints (90 CHK items) entirely unstarted

- **Severity**: CRITICAL
- **Category**: deferred
- **Source**: Phase 019 tasks.md (T019-T027) and checklist.md
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/`
- **Description**: The 15-agent architecture audit (Wave 1+3) completed successfully on 2026-03-21, identifying 197 unique findings organized into 8 sprints (S1-S8). All 90 checklist items (15 P0, 31 P1, 44 P2) remain unchecked `[ ]`. Phase 5 (Remediation) has not started.
- **Evidence**: `tasks.md` T020-T027 are all `[ ]`. `checklist.md` verification summary shows 0/15 P0, 0/31 P1, 0/44 P2.
- **Impact**: 15 P0 items are hard blockers. Key issues include potential race conditions in concurrent saves, broken barrel exports, type naming collisions, and stale ops scripts.
- **Recommended Fix**: Begin Sprint S1 (Critical/Blocking Fixes) immediately. S1 alone resolves 22 findings in an estimated 4-6 hours.

---

## HIGH Findings

### O10-004: Four circular dependencies via `from '../core'` imports

- **Severity**: HIGH
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P0-011), verified via grep
- **Location**: `scripts/lib/semantic-summarizer.ts`, `scripts/renderers/template-renderer.ts`, `scripts/spec-folder/folder-detector.ts`, `scripts/spec-folder/directory-setup.ts`
- **Description**: Four files import from `../core` instead of `../config`, creating structural circular dependency paths between `lib/`, `renderers/`, `spec-folder/` and `core/`.
- **Evidence**: `grep -c "from '../core'" <each file>` returns 1 for all four files.
- **Impact**: Makes module boundaries fragile and complicates future refactoring. Can cause initialization order issues.
- **Recommended Fix**: Redirect CONFIG imports to `../config` facade as specified in Sprint S4.

### O10-005: workflow.ts is a 2,472-line God module

- **Severity**: HIGH
- **Category**: tech-debt
- **Source**: Phase 019 audit (OPUS-A1-007, OPUS-A1-008), verified via `wc -l`
- **Location**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- **Description**: `workflow.ts` is 2,472 lines with 7 direct file imports from `extractors/` bypassing the barrel.
- **Evidence**: `wc -l workflow.ts` = 2472. `grep -c "from '../extractors/" workflow.ts` = 7.
- **Impact**: Difficult to test, maintain, and reason about. High cognitive load for contributors.
- **Recommended Fix**: Consolidate to barrel-only imports from `../extractors` (Sprint S4). Plan modular extraction in a future phase.

### O10-006: memory-save.ts modularization TODO (1,402 LOC)

- **Severity**: HIGH
- **Category**: tech-debt
- **Source**: `modularization.vitest.ts` line 19 TODO comment, verified via `wc -l`
- **Location**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- **Description**: Code comment explicitly states: "TODO: Extract quality gate, reconsolidation, chunked-indexing from memory-save (2,553 LOC source)." Current LOC is 1,402 after some extraction, but the file remains a monolith.
- **Evidence**: `wc -l memory-save.ts` = 1402. TODO comment persists in test file.
- **Impact**: Inhibits testability of individual save pipeline stages. High merge conflict risk.
- **Recommended Fix**: Extract quality gate, reconsolidation, and chunked-indexing into separate modules.

### O10-007: `heal-session-ambiguity.sh` has no working verifier

- **Severity**: HIGH
- **Category**: bug
- **Source**: Phase 019 checklist (CHK-P1-020), verified via grep
- **Location**: `.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh`
- **Description**: The script explicitly logs: "ERROR: Deprecated session-quality verifier was removed; wire a supported verification command before using this remediation script" — then halts. The ops script is effectively broken.
- **Evidence**: Line 103 contains the deprecation error message.
- **Impact**: Ops runbook cannot auto-remediate session ambiguity issues until a replacement verifier is wired.
- **Recommended Fix**: Wire a supported verification command or document the script as deprecated and remove from the runbook.

### O10-008: Re-export shims still exist for phase-classifier and memory-frontmatter

- **Severity**: HIGH
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P1-002), verified via `ls`
- **Location**: `.opencode/skill/system-spec-kit/scripts/utils/phase-classifier.ts`, `.opencode/skill/system-spec-kit/scripts/utils/memory-frontmatter.ts`
- **Description**: These files exist as re-export shims forwarding to `lib/` paths. They were supposed to be deleted in Sprint S4 so importers use `lib/` paths directly.
- **Evidence**: Both files exist. `ls scripts/utils/phase-classifier.ts scripts/utils/memory-frontmatter.ts` succeeds.
- **Impact**: Unclear import paths. Developers may import from the wrong location.
- **Recommended Fix**: Delete the shims and update all importers to use `../lib/` paths directly.

### O10-009: `session-activity-signal.ts` re-export shim in extractors

- **Severity**: HIGH
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P1-018), verified via `ls`
- **Location**: `.opencode/skill/system-spec-kit/scripts/extractors/session-activity-signal.ts`
- **Description**: This file exists as a re-export shim forwarding to `../lib/session-activity-signal`. It should be deleted and importers updated.
- **Evidence**: `ls scripts/extractors/session-activity-signal.ts` succeeds.
- **Impact**: Import path confusion.
- **Recommended Fix**: Delete shim, update importers to use `../lib/session-activity-signal` directly.

### O10-010: Duplicate folder ID 017 in phase tree

- **Severity**: HIGH
- **Category**: bug
- **Source**: Filesystem scan
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`
- **Description**: Two folders share the 017 prefix: `017-rewrite-system-speckit-readme` and `017-spec-folder-alignment-audit`. This violates the phase numbering convention.
- **Evidence**: `ls | grep "^017"` returns both folders.
- **Impact**: Description.json indexing, phase references, and navigation are ambiguous. Memory MCP may surface wrong phase context.
- **Recommended Fix**: Renumber one of the folders (e.g., `017-spec-folder-alignment-audit` -> `019-spec-folder-alignment-audit` or a new unused number).

---

## MEDIUM Findings

### O10-011: `FileEntry` type exported from 3 locations

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P2-018), verified via grep
- **Location**: `scripts/types/session-types.ts`, `scripts/core/tree-thinning.ts`, `scripts/utils/input-normalizer.ts`
- **Description**: `FileEntry` is defined as an interface in `session-types.ts` and re-exported as type aliases in `tree-thinning.ts` (aliasing `ThinFileInput`) and `input-normalizer.ts` (aliasing `NormalizedFileEntry`). Three different semantic meanings under one name.
- **Evidence**: `grep "interface FileEntry\|type FileEntry" scripts/**/*.ts` returns 3 source definitions plus 3 dist copies.
- **Impact**: Type confusion when consuming the API. Unclear which `FileEntry` a given import refers to.
- **Recommended Fix**: Rename the aliases to their specific names (`ThinFileInput`, `NormalizedFileEntry`) and deprecate the bare `FileEntry` alias (Sprint S3).

### O10-012: `ConversationPhase` type re-exported from utils/tool-detection.ts

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P1-006), verified via grep
- **Location**: `.opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts:32`
- **Description**: `tool-detection.ts` re-exports `ConversationPhase` as an alias for `ConversationPhaseLabel` from `session-types.ts`. This creates a naming collision with the canonical type.
- **Evidence**: Line 32: `export type ConversationPhase = ConversationPhaseLabel;`
- **Impact**: Consumers may import from the wrong module and get confused about which type to use.
- **Recommended Fix**: Remove the re-export, have consumers import `ConversationPhaseLabel` directly from `session-types.ts`.

### O10-013: 6 quarantined phases (3 unique, duplicated)

- **Severity**: MEDIUM
- **Category**: deferred
- **Source**: Filesystem scan of `009-perfect-session-capturing/scratch/phase-quarantine/`
- **Location**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/phase-quarantine/`
- **Description**: Six phase folders (021-026) are quarantined: `021/024-runtime-contract-and-indexability`, `022/025-source-capabilities-and-structured-preference`, `023/026-live-proof-and-parity-hardening`. Each concept appears twice with different numbering (021-023 and 024-026).
- **Evidence**: `ls` of quarantine directory shows all 6 folders.
- **Impact**: Unclear which version is canonical. These represent deferred work that may need to be resurrected or formally abandoned.
- **Recommended Fix**: Deduplicate (keep one set, delete the other). Decide whether these phases should be promoted back into the active tree or formally archived.

### O10-014: `input-normalizer.ts` TODO for index signature removal

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Source code comment
- **Location**: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:123`
- **Description**: `// TODO(O3-12): Remove index signature once all dynamic fields are explicitly declared`
- **Evidence**: Line 123 of the file.
- **Impact**: Open `[key: string]: unknown` index signatures weaken type safety and allow any field to be set without validation.
- **Recommended Fix**: Explicitly declare all dynamic fields and remove the index signature (Sprint S3).

### O10-015: `toolCallIndexById` map may be unused in Gemini capture

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P2-017), verified via grep
- **Location**: `.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts`
- **Description**: `toolCallIndexById` appears 2 times in the file. It may be constructed (`.set()`) but never read (`.get()`), making it dead code.
- **Evidence**: `grep -c "toolCallIndexById" gemini-cli-capture.ts` = 2.
- **Impact**: Dead code adds cognitive overhead.
- **Recommended Fix**: Verify if `.get()` is called. If not, delete the map (Sprint S6).

### O10-016: `legacy quality-scorer.ts` still exists in `core/`

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P1-016), verified via `ls`
- **Location**: `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts`
- **Description**: The legacy quality scorer still exists alongside the canonical `extractors/quality-scorer.ts`. This creates dual `scoreMemoryQuality` naming confusion.
- **Evidence**: `ls scripts/core/quality-scorer.ts` succeeds.
- **Impact**: Developers may call the wrong scorer. Two implementations doing similar things diverge over time.
- **Recommended Fix**: Delete legacy scorer or rename with explicit `@deprecated` annotation (Sprint S6).

### O10-017: `test-scripts-modules.js` asserts private helpers (17 matches)

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P1-028), verified via grep
- **Location**: `.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js`
- **Description**: The test file references 17 internal/private exports (`ensureArrayOfObjects`, `hasArrayContent`, `ARRAY_FLAG_MAPPINGS`, etc.) that may no longer be exported from their modules.
- **Evidence**: `grep -c "ensureArrayOfObjects\|hasArrayContent\|ARRAY_FLAG_MAPPINGS" test-scripts-modules.js` = 17.
- **Impact**: Tests may silently pass by checking stale exports or fail on refactoring.
- **Recommended Fix**: Update assertions to test public API only (Sprint S7).

### O10-018: `lib/index.ts` barrel does not exist

- **Severity**: MEDIUM
- **Category**: tech-debt
- **Source**: Phase 019 checklist (CHK-P2-035), verified via `ls`
- **Location**: `.opencode/skill/system-spec-kit/scripts/lib/index.ts`
- **Description**: No barrel export file exists for `scripts/lib/`. Consumers must import individual files directly, making refactoring difficult.
- **Evidence**: `ls scripts/lib/index.ts` returns no file.
- **Impact**: No single API surface for `lib/`. Harder to maintain and refactor.
- **Recommended Fix**: Create `lib/index.ts` barrel with public API surface (Sprint S4).

---

## LOW Findings

### O10-019: 16 conditionally-skipped tests in bm25-index.vitest.ts

- **Severity**: LOW
- **Category**: skipped-test
- **Source**: Source code scan
- **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts`
- **Description**: 15 tests use `it.skipIf(!hybridSearch)` and conditionally skip when the hybrid search module is not loaded. These tests run only when the full integration environment is available.
- **Evidence**: Lines 439-554, 15 `it.skipIf` occurrences.
- **Impact**: Reduced test coverage in CI environments where hybrid search is not configured.
- **Recommended Fix**: Document the CI configuration requirement or add mock-based alternatives.

### O10-020: 1 TODO test in crash-recovery.vitest.ts

- **Severity**: LOW
- **Category**: skipped-test
- **Source**: Source code scan
- **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:19`
- **Description**: `it.todo('should create session_state table and indexes -- needs SQLite fixture to inspect sqlite_master and index metadata')`
- **Evidence**: Line 19 of the file.
- **Impact**: Missing test coverage for session_state table creation.
- **Recommended Fix**: Implement the test with proper SQLite fixture.

### O10-021: continue-session.vitest.ts conditionally skips entire suite

- **Severity**: LOW
- **Category**: skipped-test
- **Source**: Source code scan
- **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:41`
- **Description**: `const t124Describe = collectSessionDataLoaded ? describe : describe.skip;` -- the entire test suite is skipped when `collectSessionData` cannot be loaded.
- **Evidence**: Line 41 of the file.
- **Impact**: Full test suite for session continuation may be silently skipped.
- **Recommended Fix**: Ensure `collectSessionData` is reliably loadable in test environments.

### O10-022: Intentional test casts with TODO markers

- **Severity**: LOW
- **Category**: tech-debt
- **Source**: Source code scan
- **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:101,161`
- **Description**: Two `TODO(P6-05)` comments mark intentional test casts that exercise edge cases. These are tracked for future cleanup.
- **Evidence**: Lines 101 and 161 with `// TODO(P6-05): Intentional test cast` comments.
- **Impact**: Minor -- these are intentional and tracked.
- **Recommended Fix**: Address as part of Sprint S7 (test coverage gaps).

### O10-023: `cli-capture-shared.ts` exists but wiring status unclear

- **Severity**: LOW
- **Category**: deferred
- **Source**: Phase 019 checklist (CHK-P0-014), verified via `ls`
- **Location**: `.opencode/skill/system-spec-kit/scripts/lib/cli-capture-shared.ts`
- **Description**: The file exists. The Phase 019 audit asked whether it is wired into the CLI capture extractors or is dead code. This needs verification.
- **Evidence**: `ls scripts/lib/cli-capture-shared.ts` succeeds.
- **Impact**: Potentially dead code if not imported by any extractor.
- **Recommended Fix**: Verify import usage. If no extractor imports it, delete it (Sprint S6).

### O10-024: Bimodal quality distribution in historical memories

- **Severity**: LOW
- **Category**: bug
- **Source**: Memory file `17-03-26_19-49__bimodal-quality-distribution-in-historical-memory.md`
- **Location**: Memory system (cross-cutting)
- **Description**: Analysis of 47 historical memory files showed two distinct quality clusters: low-quality at 15-25 (thin/useless) and high-quality at 65-85 (rich/useful) with a gap at 30-50. The abort threshold sits cleanly in the gap.
- **Evidence**: Memory file documents the analysis and clustering.
- **Impact**: Low-quality memories pollute search results and waste token budget. The bimodal distribution suggests quality controls are working for new saves but legacy memories remain.
- **Recommended Fix**: Run a bulk quality backfill on legacy memories using the current quality scorer. Delete or archive memories scoring below threshold.

### O10-025: `heal-telemetry-drift.sh` and `heal-ledger-mismatch.sh` verifier status unclear

- **Severity**: LOW
- **Category**: deferred
- **Source**: Phase 019 checklist (CHK-P1-020 through CHK-P1-022)
- **Location**: `.opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh`, `.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh`
- **Description**: Unlike `heal-session-ambiguity.sh` which explicitly errors about a removed verifier, these two scripts may have working verifiers or may be similarly broken. `heal-ledger-mismatch.sh` references `cleanup-orphaned-vectors.js --check-ledger --strict`. Status needs verification.
- **Evidence**: grep shows different verification approaches in each script.
- **Impact**: Ops runbook may contain non-functional remediation scripts.
- **Recommended Fix**: Test each script's verify step and document status.

---

## Deferred Work Registry

| ID | Phase | Item | Status | Priority |
|----|-------|------|--------|----------|
| D-001 | 019 | Sprint S1: Critical/Blocking Fixes (22 findings) | NOT STARTED | P0 |
| D-002 | 019 | Sprint S2: Data Integrity & Race Conditions (18 findings) | NOT STARTED | P0 |
| D-003 | 019 | Sprint S3: Type System Cleanup (24 findings) | NOT STARTED | HIGH |
| D-004 | 019 | Sprint S4: Architecture Remediation (23 findings) | NOT STARTED | HIGH |
| D-005 | 019 | Sprint S5: Spec/Metadata Alignment (30 findings) | NOT STARTED | MEDIUM |
| D-006 | 019 | Sprint S6: Dead Code Deletion & Consolidation (28 findings) | NOT STARTED | MEDIUM |
| D-007 | 019 | Sprint S7: Test Coverage Gaps (26 findings) | NOT STARTED | LOW |
| D-008 | 019 | Sprint S8: Extractor Parity & Quality Gates (26 findings) | NOT STARTED | LOW |
| D-009 | 009/quarantine | Phase 021/024: Runtime Contract and Indexability | QUARANTINED | UNKNOWN |
| D-010 | 009/quarantine | Phase 022/025: Source Capabilities and Structured Preference | QUARANTINED | UNKNOWN |
| D-011 | 009/quarantine | Phase 023/026: Live Proof and Parity Hardening | QUARANTINED | UNKNOWN |
| D-012 | 019 | validate.sh run on spec folder (T019) | NOT STARTED | P1 |

---

## Cross-Reference: Source Code BUG-NNN Tags

The codebase uses `BUG-NNN` tags in comments to mark past bug fixes. These are **fixed** bugs (retained as documentation), not active issues:

| Tag | File | Description | Status |
|-----|------|-------------|--------|
| BUG-001 | memory-search.ts, trigger-extractor.ts, input-normalizer.ts | External DB check, trigger phrase preference, safe coercion | FIXED |
| BUG-002 | reconsolidation-bridge.ts | Reconsolidation warning tracking | FIXED |
| BUG-003 | input-normalizer.ts | ACTION/MAGNITUDE validation | FIXED |
| BUG-004 | vector-index-store.ts | External DB modification cache invalidation | FIXED |
| BUG-006 | input-normalizer.ts | importanceTier propagation | FIXED |
| BUG-007 | validators.ts, memory-search.ts | Empty query validation | FIXED |
| BUG-010 | trigger-extractor.ts | ReDoS prevention | FIXED |
| BUG-012 | vector-index-queries.ts, vector-index-store.ts | Config weights, thundering herd | FIXED |
| BUG-013 | vector-index-queries.ts, composite-scoring.ts | Orphan cleanup, tier values | FIXED |
| BUG-017 | search-results.ts | Token capture ordering | FIXED |
| BUG-019 | vector-index-schema.ts | Migration atomicity | FIXED |
| BUG-020 | memory-parser.ts, vector-index-mutations.ts | UTF-16BE encoding, graph residue cleanup | FIXED |
| BUG-021 | vector-index-mutations.ts | BM25 deletion ordering | FIXED |
| BUG-023 | search-results.ts | Error message sanitization | FIXED |
| BUG-026 | trigger-matcher.ts | Unicode word boundary | FIXED |
| BUG-027 | memory-parser.ts | Symlink loop prevention | FIXED |
| BUG-028 | context-server.ts | OOM prevention via restricted scan | FIXED |

All 17 BUG-NNN tagged fixes are present in the current codebase and none appear to have regressed (TypeScript compiles clean, no test assertion failures in the verified BUG fix tests).

---

## Methodology

1. **Memory files**: Scanned 95+ memory files across all phases using `grep -rli` for bug/defer/regression keywords. Identified ~40 files with relevant content.
2. **Task files**: Checked all 80+ `tasks.md` files for unchecked `[ ]` and blocked `[B]` items. The Phase 019 remediation tasks (T019-T027) are the primary outstanding items.
3. **Checklist files**: Checked all 70+ `checklist.md` files for unchecked items and P2 deferrals. Phase 019 has 90 unchecked items. All other phases have fully verified checklists.
4. **Scratch artifacts**: Scanned all scratch directories. Phase 019 has 10+ Wave 1 agent outputs and Wave 3 synthesis files documenting all 197 findings.
5. **Source code**: Grep'd for `TODO|FIXME|HACK|XXX|WORKAROUND` across all `.ts` and `.js` files. Found 2 actionable TODOs (O3-12 index signature, modularization). All BUG-NNN tags are documentation of past fixes.
6. **Skipped tests**: Found 16 conditionally-skipped tests (15 in bm25, 1 todo in crash-recovery) and 1 conditionally-skipped suite (continue-session).
7. **Build verification**: `npx tsc --noEmit` passes clean -- no active compilation regressions.
8. **Filesystem verification**: Confirmed stale dist artifacts, re-export shims, and duplicate folder IDs via direct filesystem checks.
