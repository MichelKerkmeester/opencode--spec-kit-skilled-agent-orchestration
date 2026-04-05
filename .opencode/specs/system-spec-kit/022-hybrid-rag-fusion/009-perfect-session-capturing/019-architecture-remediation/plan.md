---
title: "Implementati [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/plan]"
description: "Prioritized remediation plan synthesized from 15 analysis agents (10 Wave 1/2 + 5 Wave 3 synthesis) across the perfect-session-capturing subsystem. 197 unique findings, 8-sprint remediation plan, 8 ADRs."
trigger_phrases:
  - "architecture remediation plan"
  - "019 remediation"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Architecture Remediation Deep Dive

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Analysis Agents Deployed

**Wave 1 + Wave 2 Analysis (10 agents):**

| Agent | Model | Findings | Status |
|-------|-------|----------|--------|
| CODEX-A1 | GPT 5.4 | 10 | Complete |
| CODEX-A2 | GPT 5.4 | 10 | Complete |
| CODEX-A3 | GPT 5.4 | 14 | Complete |
| CODEX-A4 | GPT 5.4 | 9 | Complete |
| CODEX-A5 | GPT 5.4 | 5 | Complete |
| OPUS-A1 | Opus 4.6 | 15 | Complete |
| OPUS-A2 | Opus 4.6 | 18 | Complete |
| OPUS-A3 | Opus 4.6 | 9 | Complete |
| OPUS-A4 | Opus 4.6 | 18 | Complete |
| OPUS-A5 | Opus 4.6 | 12 | Complete |

**Wave 3 Synthesis (5 agents):**

| Agent | Model | Role | Status |
|-------|-------|------|--------|
| OPUS-B1 | Opus 4.6 | Prior findings verification | Complete |
| OPUS-B2 | Opus 4.6 | Remediation priority matrix | Complete |
| OPUS-B3 | Opus 4.6 | Decision record synthesis | Complete |
| OPUS-B4 | Opus 4.6 | Checklist generation | Complete |
| OPUS-B5 | Opus 4.6 | Research compilation | Complete |

**Total raw findings across all waves: 270**
**After deduplication: 197 unique findings** (73 cross-agent duplicates removed)

Wave 3 synthesis is complete. All 197 unique findings have been verified, sprint-assigned, and documented in the priority matrix (scratch/wave3-priority-matrix.md).
<!-- /ANCHOR:summary -->

---

### Technical Context

This plan synthesizes findings across the `009-perfect-session-capturing` subsystem rather than implementing code changes directly. The main technical inputs are the Wave 1 and Wave 3 scratch artifacts, the current parent phase tree, and the live TypeScript/runtime surfaces under `.opencode/skill/system-spec-kit/scripts/`.

Key constraints:
- Sprint sequencing must preserve current runtime stability while addressing the highest-risk architecture and data-integrity issues first.
- Findings accepted into this plan must map back to current files or validated scratch artifacts.
- The remediation sequence must respect ADR dependencies, especially where build artifacts, type boundaries, and save-pipeline safety interact.

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion | Sprint |
|------|-----------|--------|
| G-01 | All test suites pass — `npx vitest run` exits 0 | S1 |
| G-02 | No silent data loss in concurrent save scenarios; V-rule bridge fails closed | S2 |
| G-03 | `tsc --noEmit --strict` exits 0; zero `as any` in production code | S3 |
| G-04 | Architecture boundary eval passes (`check-architecture-boundaries.ts`); zero circular deps; utils/ imports only from types/ | S4 |
| G-05 | All 20 description.json files have `status` field; phase numbers in spec.md match folder IDs; checklist counts accurate | S5 |
| G-06 | Zero orphaned dist artifacts; all deleted source files have zero references; README inventories match directory contents | S6 |
| G-07 | Test coverage for previously-untested modules reaches smoke-test level; zero silent test skips | S7 |
| G-08 | Cross-CLI capture parity test passes for codex, copilot, gemini; quality-loop rejects memories with zero triggers | S8 |
<!-- /ANCHOR:quality-gates -->

---

### Wave 3 Synthesis

Wave 3 (5 synthesis agents, OPUS-B1 through OPUS-B5) completed on 2026-03-21. Key results:

### Finding Verification (OPUS-B1)

| Category | Count |
|----------|-------|
| Prior findings that persist unchanged | 109 |
| Prior findings now fixed (in current HEAD) | 7 |
| New findings not in prior wave | 53 |
| **Total unique findings after dedup** | **197** |

### Severity Distribution (Deduplicated, OPUS-B2)

| Severity | Count | Percentage |
|----------|-------|------------|
| CRITICAL | 12 | 6% |
| HIGH | 48 | 24% |
| MEDIUM | 86 | 44% |
| LOW | 51 | 26% |
| **Total** | **197** | **100%** |

### Sprint Assignment (OPUS-B2)

Full priority matrix in `scratch/wave3-priority-matrix.md`. ADRs in `scratch/wave3-decision-records.md`. Checklist items in `scratch/wave3-checklist.md`.

### ADRs Synthesized (OPUS-B3)

8 ADRs produced — see `decision-record.md`:
- ADR-001: Multi-agent audit approach (verified, accepted)
- ADR-002: Type system deduplication strategy
- ADR-003: Architecture boundary enforcement
- ADR-004: Build artifact management
- ADR-005: Spec phase metadata governance
- ADR-006: Memory save pipeline safety
- ADR-007: JSON-primary data flow integrity
- ADR-008: Dead code and deprecated module deletion policy

### Sprint Sequencing Recommendation (OPUS-B3)

| Sprint | ADRs | Key Deliverables |
|--------|------|------------------|
| **S1** | ADR-004, ADR-008 (ops/dist cleanup) | Delete stale artifacts, wire cli-capture-shared, remove broken ops scripts |
| **S2** | ADR-006, ADR-007 | Save pipeline safety, JSON-primary integrity |
| **S3** | ADR-002, ADR-008 (quality scorer, dead exports) | Type renames, legacy scorer deletion |
| **S4** | ADR-003 | Circular dep fix, shim removal, boundary enforcement |
| **S5** | ADR-005 (manual backfill + lint script) | Metadata backfill, automated governance |
| **S6** | ADR-008 (remaining dead code) | Final dead code sweep |
| **S7** | — | Test coverage additions |
| **S8** | — | Extractor parity and quality gate improvements |

### Cross-ADR Dependency Map

```
ADR-004 (Build Artifacts)  ──blocks──>  ADR-006 (Save Safety: V-rule bridge needs valid dist/)
ADR-002 (Type Dedup)       ──enables──> ADR-003 (Boundary Enforcement: clean types needed first)
ADR-003 (Boundaries)       ──enables──> ADR-008 (Dead Code: shim removal depends on boundary fix)
ADR-005 (Metadata)         ──independent
ADR-007 (JSON Flow)        ──depends──> ADR-002 (narrowed nextSteps type)
ADR-008 (Dead Code)        ──depends──> ADR-004 (stale dist/ deletion)
```
---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the finding source is one of the validated Wave 1 or Wave 3 artifacts for this phase.
- Confirm the referenced file or subsystem still exists in the current workspace before assigning remediation.
- Confirm the sprint assignment matches the ADR dependency chain already captured in this plan.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Evidence first | Every sprint item must trace back to a validated finding source |
| No silent scope creep | New findings discovered during remediation become follow-up work unless they block the active sprint |
| Dependency aware | ADR and sprint ordering cannot be bypassed without recording the decision |
| Current-state verification | Any stale path or line reference must be revalidated against current files before acceptance |

### Status Reporting Format

- Report by sprint, affected subsystem, and source finding ID.
- Cite the current file or scratch artifact that justified the remediation item.
- Mark unresolved or blocked items explicitly instead of treating them as implied carry-over.

### Blocked Task Protocol

- If a finding cannot be reproduced against current files, stop and record it for re-triage.
- If a required scratch artifact is missing, block the dependent remediation item until the evidence gap is closed.
- If a dependency sprint is incomplete, defer the blocked item rather than working around the sequence.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Subsystem Map

| Layer | Subsystem | Files | Key Issues |
|-------|-----------|-------|------------|
| Core | core/ | ~10 | Dual quality scorer, stale JS artifacts |
| Extractors | extractors/ | ~15 | Cross-provider parity, circular dep with spec-folder/ |
| Library | lib/ | ~10 | Imported by utils/ (leaf violation), ReDoS risk |
| Utilities | utils/ | ~10 | Imports from lib/ (violates leaf contract) |
| Memory | memory/ | ~8 | TOCTOU orphan cleanup, stdin hang |
| Renderers | renderers/ | ~3 | Minor issues |
| Spec-folder | spec-folder/ | ~5 | Circular dep with extractors/ |
| Tests/Evals | tests/, evals/ | ~15 | 20+ stale mock assertions, deleted exports |
| Types | types/ | ~3 | Type naming collisions (3 pairs) |
| MCP Handlers | mcp_server/ | 44 | Potentially under-covered by Wave 1 |

### Architecture Boundary Rules (from import-policy-allowlist.json)

- `utils/` is a leaf layer — no imports from `lib/`, `core/`, `extractors/`
- `extractors/` must not import from `spec-folder/`
- Shared types must live in `types/` — not duplicated across modules
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Remediation Sprint Order (Wave 3 confirmed and sequenced)

| Sprint | Focus | Priority | Findings | Est. Hours | Risk |
|--------|-------|----------|----------|------------|------|
| **S1** | Critical/Blocking Fixes | CRITICAL | 22 | 4-6h | H |
| **S2** | Data Integrity & Race Conditions | HIGH | 18 | 8-12h | H |
| **S3** | Type System Cleanup | HIGH | 24 | 6-8h | M |
| **S4** | Architecture Remediation | HIGH | 23 | 8-12h | M |
| **S5** | Spec/Metadata Alignment | MEDIUM | 30 | 4-6h | L |
| **S6** | Dead Code Deletion & Consolidation | MEDIUM | 28 | 6-8h | M |
| **S7** | Test Coverage Gaps | LOW | 26 | 6-8h | L |
| **S8** | Extractor Parity & Quality Gates | LOW | 26 | 6-8h | M |

**Total estimated effort:** 45-65 hours
**Net LOC change:** +1,200 / -2,800 (net -1,600 lines)

### Phase 1: Stabilize the Baseline

This phase removes build drift and data-loss risk before deeper structural remediation begins.

### SPRINT S1: Critical/Blocking Fixes

**22 findings. Priority: CRITICAL. Risk: HIGH.**
The current unstaged changes remove 20+ exports but `test-scripts-modules.js` was NOT updated. Running tests will produce immediate failures. Stale dist/ artifacts execute deleted source code in ops scripts:

| Removed Export | Source File | Test Assertions |
|---------------|-------------|-----------------|
| `updateMetadataWithEmbedding` | memory-indexer.ts | T-024d, T-024i |
| `generateSemanticSlug`, `generateShortHash`, `extractKeywords`, `getCurrentDate`, `STOP_WORDS`, `ACTION_VERBS` | anchor-generator.ts | T-009 series, T-030 |
| `createFullSimulation`, `formatTimestamp`, `generateSessionId`, `addSimulationWarning`, `markAsSimulated` | simulation-factory.ts | T-014, T-029 series |
| `filterContent`, `getFilterStats`, `resetStats`, `generateContentHash`, `calculateSimilarity`, `stripNoiseWrappers`, `meetsMinimumRequirements`, `calculateQualityScore` | content-filter.ts | T-012, T-028 |
| `requireInteractiveMode` | prompt-utils.ts | T-033a |
| `logAnchorValidation` | validation-utils.ts | T-035h, T-035i |

Also: `heal-ledger-mismatch.sh:104` references deleted `run-quality-legacy-remediation.js` (will fail at runtime), and `task-enrichment.vitest.ts`/`memory-render-fixture.vitest.ts` mock the deleted `updateMetadataWithEmbedding`.

### SPRINT S2: Data Integrity & Race Conditions

**18 findings. Priority: HIGH. Risk: HIGH.**
Fix race conditions in concurrent save paths, data loss from non-atomic post-commit rewrites, V-rule bridge fail-open bypass, JSON-mode validation skipping, and related data integrity issues. See ADR-006 and ADR-007.

Key issues: `atomicSaveMemory()` deterministic pending path causes write collisions; post-commit file rewrites use plain `writeFile()` exposing crash window; V-rule bridge swallows load errors and silently disables quality gates.

### Phase 2: Restore Architecture and Metadata Integrity

### SPRINT S3: Type System Cleanup

**24 findings. Priority: HIGH. Risk: MEDIUM.**
Three naming collision clusters (Observation, FileEntry x3, ExchangeSummary) require domain-specific renames. Eight interfaces use `[key: string]: unknown` defeating structural safety. See ADR-002.

Key issues: `workflow.ts` requires aliased imports to disambiguate `FileEntry`; `ToolCounts` open indexer allows undeclared tool names to accumulate silently; legacy quality scorer runs in parallel with canonical scorer creating dual-scorer confusion.

### SPRINT S4: Architecture Remediation

**23 findings. Priority: HIGH. Risk: MEDIUM.**
Four circular dependency cycles via `../core` barrel; `utils/` imports from `lib/` (leaf layer violation); `core/workflow.ts` God module with 34 cross-subsystem imports; unwired `cli-capture-shared.ts` module duplicated across 4 capture files. See ADR-003 and ADR-008.

### SPRINT S5: Spec/Metadata Alignment

**30 findings. Priority: MEDIUM. Risk: LOW.**
15 of 20 phases missing `status` in description.json; phase number labels in 011-014 don't match folder IDs; `019-architecture-remediation` absent from root `descriptions.json`; parent checklist count wrong (claims 36, has 39). See ADR-005.

### Phase 3: Close Coverage and Hardening Gaps

### SPRINT S6: Dead Code Deletion & Consolidation

**28 findings. Priority: MEDIUM. Risk: MEDIUM.**
Delete deprecated eval scripts (refs remain in READMEs and ops scripts), dead exports (`extractKeyArtifacts`, `generateMergedDescription`, `toolCallIndexById`), deprecated ops scripts that exit with errors, and stale source-tree build artifacts. See ADR-004 and ADR-008.

### SPRINT S7: Test Coverage Gaps

**26 findings. Priority: LOW. Risk: LOW.**
Add tests for untested memory modules (ast-parser, cleanup-orphaned-vectors, rebuild-auto-entities, reindex-embeddings) and low-level helpers; fix SessionData fixture drift; add architecture-boundary test cases; fix silent test skips.

### SPRINT S8: Extractor Parity & Quality Gates

**26 findings. Priority: LOW. Risk: MEDIUM.**
Standardize session targeting across providers; thread structured JSON fields through pipeline; fix contamination filter regex gaps; add quality-loop minimum dimension floors; fix various extractor behavioral inconsistencies.

### Medium Findings (S3-S6)

- `folder-detector.ts` still exports snake_case aliases (barrel removed but source not)
- `memory-frontmatter` barrel removal — need to verify no consumers use barrel path
- READMEs reference deleted files
- 8 interfaces use `[key: string]: unknown` defeating structural type checking
- Multiple `!` assertions behind indirect guards

### Low Findings (13 items)

- Missing `Completed` date fields in some phases
- Missing `Branch` field in phase 013
- Section numbering gap in phase 017
- Dead exports (`QualityScore`, `generateMergedDescription`, `ToolCallSummary`)
- Simulation factory naming collision (`CollectedData` vs `CollectedDataBase`)
- Various minor type casts in tests and extractors
- Duplicate interface definitions in `implementation-guide-extractor.ts`
- README inventory docs out of date with barrel exports

### New Findings from CODEX-3 (Utils/Lib)
- **CODEX3-001 HIGH**: `ast-parser.ts:8` imports deleted `structure-aware-chunker` from `scripts/lib/` — will fail at resolution
- **CODEX3-002 MEDIUM**: Anchor generator slug collisions — order-dependent collision resolution
- **CODEX3-003 MEDIUM**: Data validator lets malformed arrays through, flags never recomputed to false
- **CODEX3-004 MEDIUM**: `transformKeyDecision()` assumes `.alternatives` is array — TypeError on string input
- **CODEX3-005 MEDIUM**: `content-filter.ts` compiles arbitrary config strings into RegExp — ReDoS risk
- **CODEX3-006 MEDIUM**: `calculateSimilarity()` is character-position-only — high false positive dedup rate
- **CODEX3-007 MEDIUM**: `generateContentSlug()` skips generic-name screening for fallback string
- **CODEX3-008 MEDIUM**: `formatTimestamp()` adds timezone offset then emits `Z` — wrong UTC instant
- **CODEX3-009 LOW**: `extractKeyArtifacts()` marked dead code but still exported
- **CODEX3-010 LOW**: `formatOptionBox()` accepts `isChosen` parameter but never uses it

### New Findings from CODEX-4 (Memory System)
- **CODEX4-001 HIGH**: Orphan cleanup TOCTOU — stale snapshot used for deletion, concurrent indexer can recreate rows
- **CODEX4-002 MEDIUM**: Quarantine moves can overwrite prior quarantined evidence
- **CODEX4-003 MEDIUM**: `rank-memories.ts` accepts any JSON without `results` as valid empty dataset
- **CODEX4-004 MEDIUM**: `validate-memory-quality.ts` silently disables topical-coherence when spec.md unreadable
- **CODEX4-005 MEDIUM**: `reindex-embeddings.ts` can exit 0 without proving it parsed any scan result
- **CODEX4-006 MEDIUM**: `backfill-frontmatter.ts` silently skips unreadable directories
- **CODEX4-007 LOW**: `--stdin` can hang indefinitely when invoked without piped input

### Raw Findings Index

All raw findings are in `scratch/`:
- `scratch/codex-1-core-pipeline.md` — Core pipeline (7 findings)
- `scratch/codex-2-extractors.md` — Extractor system (6 findings)
- `scratch/codex-3-utils-lib.md` — Utils/lib (10 findings)
- `scratch/codex-4-memory-system.md` — Memory system (7 findings)
- `scratch/codex-5-tests-evals.md` — Tests/evals (9 findings + coverage matrix)
- `scratch/opus-1-phase-tree.md` — Phase tree consistency (22 findings)
- `scratch/opus-2-spec-alignment.md` — Spec-to-code alignment (14 findings)
- `scratch/opus-3-architecture.md` — Architecture boundaries (14 findings)
- `scratch/opus-4-git-diff.md` — Git diff analysis (26 findings)
- `scratch/opus-5-type-system.md` — Type system verification (20 findings)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Wave 3 audit pack finalized | Plan, checklist, and decision record are strict-validator clean | Phase 019 completion |
| M2 | Baseline remediation stabilized | Sprint S1 and S2 remove stale-artifact and save-pipeline blockers | Sprint S2 |
| M3 | Architecture remediation ready for closure | Sprint S3 through S8 have validated execution and verification guidance | Sprint S8 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Sprint S1 fix verified by re-running `test-scripts-modules.js` test suite — expect zero assertion errors for removed exports
- Sprint S2 type renames verified by `tsc --noEmit --strict` — zero type errors
- Sprint S3 boundary restoration verified by running `scripts/evals/check-architecture-boundaries` against the updated import-policy-allowlist
- Sprint S4 metadata consistency verified by manual review of all 20 description.json status fields against spec.md
- Sprint S5 artifact cleanup verified by confirming no `.js`/`.d.ts` files coexist with `.ts` source in script directories
- Sprint S6 extractor parity verified by running capture integration tests for codex, copilot, and gemini capture paths
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Required By | Notes |
|------------|------|-------------|-------|
| Wave 1 scratch outputs (10 files) | Input | Wave 3 agents | Must all exist before OPUS-B1 runs |
| `test-scripts-modules.js` | Test file | Sprint S1 | Modified to remove stale assertions |
| `import-policy-allowlist.json` | Config | Sprint S3 | Updated to reflect boundary fixes |
| `tsconfig.json` | Config | Sprint S2, S5 | Strict mode must remain enabled |
| Parent spec (009-perfect-session-capturing/spec.md) | Doc | Sprint S4 | Phase map section updated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each sprint produces a single atomic commit. Rollback procedure per sprint:

| Sprint | Rollback Action |
|--------|----------------|
| S1 | `git revert <S1-commit>` — restores stale test assertions; tests fail again but no new breakage |
| S2 | Revert save-handler changes — race condition and non-atomic writes re-emerge; V-rule bridge reverts to fail-open |
| S3 | `git revert <S3-commit>` — type collisions re-emerge; runtime behavior unchanged |
| S4 | `git revert <S4-commit>` — circular deps and layer violations return; functionality unchanged |
| S5 | `git revert <S5-commit>` — stale phase denominators and missing status fields return in spec docs |
| S6 | `git restore <deleted-files>` — dead code returns; no runtime behavior changes |
| S7 | `git revert <S7-commit>` — test coverage reverts; no production impact |
| S8 | `git revert <S8-commit>` — extractor parity reverts; cross-CLI capture degrades slightly |
<!-- /ANCHOR:rollback -->
