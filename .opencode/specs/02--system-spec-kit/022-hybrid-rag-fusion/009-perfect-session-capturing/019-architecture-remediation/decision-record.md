---
title: "Decision Record: Architecture Remediation Deep Dive [template:level_3/decision-record.md]"
description: "Architecture decisions for the 15-agent audit and remediation of the perfect-session-capturing subsystem. Synthesized by Wave 3 agent OPUS-B3."
trigger_phrases:
  - "019 decision record"
  - "architecture remediation ADR"
  - "opus-b3 synthesis"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Architecture Remediation Deep Dive

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Multi-Agent Architecture Audit Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The perfect-session-capturing subsystem grew to 96+ TypeScript files and 20 child phases without a unified architecture audit. Prior audits (005-architecture-audit) examined a subset of files and produced findings that were only partially remediated. We needed to choose a coordination strategy for comprehensive, parallel analysis without introducing conflicting findings.

### Constraints

- Analysis must be read-only — no source file modifications during audit
- 10+ concurrent agents require isolated scratch outputs to avoid write conflicts
- Wave 3 synthesis must handle deduplication across 197 unique findings (270 raw)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A 3-wave architecture — Wave 1 parallel analysis (10 agents), Wave 2 targeted fixes (where prior runs surfaced fixable issues), Wave 3 synthesis (5 agents) — with each agent writing to an isolated scratch file (e.g., `scratch/codex-1-core-pipeline.md`).

**How it works**: Wave 1 agents run fully in parallel with no shared state. Each writes findings using the standard `FINDING-NNN | SEVERITY | CATEGORY | file:line` format. Wave 3 OPUS-B1 reads all 10 scratch files and produces a deduplicated, verified master list before OPUS-B2 through OPUS-B5 consume it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-wave multi-agent (chosen)** | Full parallelism; isolated outputs; Wave 3 deduplication | Higher coordination overhead; Wave 3 depends on Wave 1 fidelity | 9/10 |
| Single sequential audit | Simple; no deduplication needed | Too slow for 96+ files; single-agent coverage gaps | 4/10 |
| 2-wave (no synthesis wave) | Faster | No finding verification; priority matrix manual | 6/10 |

**Why this one**: The 197-finding volume and 8-subsystem breadth require parallel coverage. Wave 3 synthesis is necessary to avoid sprint teams acting on stale or duplicate findings.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- All 8 subsystems covered simultaneously in under one session
- Finding deduplication handled systematically by OPUS-B1

**What it costs**:
- Wave 3 cannot start until all Wave 1 scratch files are complete. Mitigation: Gate Wave 3 dispatch on file existence check for all 10 scratch outputs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wave 1 agent produces malformed scratch output | H | OPUS-B1 validates format before accepting each finding |
| Scratch file naming collision | L | Each agent uses its own dedicated filename |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 96+ files cannot be audited by a single agent in one session |
| 2 | **Beyond Local Maxima?** | PASS | Sequential, 2-wave, and 3-wave options evaluated |
| 3 | **Sufficient?** | PASS | 15 agents cover all 8 subsystems with overlap; 197 unique findings from 270 raw |
| 4 | **Fits Goal?** | PASS | Analysis-only; no source changes during audit |
| 5 | **Open Horizons?** | PASS | Wave structure reusable for future audits |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scratch/` receives 10 Wave 1 output files and 5 Wave 3 synthesis outputs
- `plan.md` Sprint S1-S8 structure derived from Wave 3 OPUS-B2 priority matrix

**How to roll back**: If Wave 3 synthesis diverges, discard Wave 3 scratch outputs and re-run OPUS-B1 with stricter finding acceptance criteria.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Type System Deduplication Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Architecture Lead |

---

<!-- ANCHOR:adr-002-context -->
### Context

Wave 1 agents CODEX-A3 and OPUS-A5 independently identified pervasive type naming collisions across the scripts subsystem. Three collision clusters cause the most damage:

1. **`Observation`** -- `input-normalizer.ts:39` defines `facts: string[]` (required), while `session-types.ts:60` defines `facts?: FactValue[]` (optional, union type). Callers importing from one module get a different shape than callers importing from the other, and the compiler does not flag the mismatch because each definition is self-consistent.

2. **`FileEntry`** -- Three definitions exist: `session-types.ts:219` (metadata-only: `FILE_PATH, FILE_NAME?, DESCRIPTION?`), `input-normalizer.ts:55` (normalized change record with `ACTION?, MODIFICATION_MAGNITUDE?`), and `tree-thinning.ts:39` (content pair: `{ path, content }`). `workflow.ts` already resorts to aliased imports to disambiguate.

3. **`ExchangeSummary`** -- `message-utils.ts:35` defines `{ userIntent, outcome, toolSummary, fullSummary }` while `session-types.ts:117` defines `{ userInput, assistantResponse, timestamp? }`. These represent completely different concepts sharing one name.

Additionally, CODEX-A3 found `ToolCounts` (session-types.ts:204) uses an open `[key: string]: number` indexer, and 8 other interfaces use `[key: string]: unknown`, defeating structural type safety. Six `LoadedData`/`RawInputData`/`NormalizedData` interfaces are open bags despite `_source` already partitioning the shapes.

### Constraints

- Renames must not break existing callers in modules outside the sprint scope
- TypeScript strict mode must pass after all renames
- Re-export shims may be needed temporarily for backward compatibility with test fixtures
- The `utils/index.ts` barrel narrowing (Wave 2, OPUS-A4) already removed some deprecated type aliases -- renames should align with the narrowed surface
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Rename to disambiguate, combined with closing open index signatures on the highest-impact interfaces.

**How it works**:

1. **Rename colliding types to domain-specific names.** `Observation` in input-normalizer becomes `NormalizedObservation`. `FileEntry` in input-normalizer becomes `NormalizedFileEntry` (already partially done in Wave 2 barrel changes). `FileEntry` in tree-thinning becomes `ThinFileInput` (already aliased in current diff). `ExchangeSummary` in message-utils becomes `ExchangeArtifactSummary`. `UserPrompt` in input-normalizer becomes `NormalizedUserPrompt` (already exported in Wave 2).

2. **Close open index signatures.** Replace `ToolCounts`'s `[key: string]: number` with a `ToolName` union over the 12 known tool names. Replace `CollectedDataBase`'s index signature with explicit optional fields for each known data source shape, using a discriminated union keyed by `_source`.

3. **Temporary re-export shims.** Deprecated aliases (`export type FileEntry = NormalizedFileEntry`) stay in `utils/input-normalizer.ts` for one sprint to give external consumers migration time, then are removed.

4. **Migrate call sites.** Update all importers to use the new canonical names. The extractors barrel and utils barrel already re-export the new names from the Wave 2 narrowing.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename to disambiguate (chosen)** | Clear intent; compiler catches misuse; each name maps to one shape | All call sites must be updated; temporary shims needed | 9/10 |
| Merge into a single flexible type | Fewer rename changes; one import to remember | Union shapes hide bugs at compile time; `FileEntry` cannot unify metadata-only and content-bearing shapes without losing safety | 3/10 |
| Namespace collision only (prefix module name) | Minimal diff; no shape changes | Does not fix structural incompatibility; still requires aliased imports in workflow.ts | 4/10 |

**Why this one**: The three `FileEntry` shapes represent genuinely different domain concepts (metadata record, normalized change record, content pair). Merging them into one union would require every consumer to narrow at runtime, adding code without removing ambiguity. Renaming makes each shape self-documenting and lets TypeScript's structural matching detect misuse at compile time.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Type errors at compile time when a caller passes a `ThinFileInput` where a `NormalizedFileEntry` is expected
- `workflow.ts` no longer needs aliased imports to disambiguate `FileEntry`
- `ToolCounts` closed union prevents undeclared tool names from silently accumulating in scoring
- Grep for a type name returns exactly one definition, making codebase navigation unambiguous

**What it costs**:
- Sprint S3 touches 15-20 files across extractors, utils, core, and tests
- Re-export shims add 3-4 temporary files that must be cleaned up in Sprint S4

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| External MCP handler consumers import old `FileEntry` name | M | Re-export shims provide one-sprint grace period; handler imports are barrel-only and will pick up renamed types |
| `ToolName` union misses a new CLI tool name | L | Add the name to the union when the capture module is added; TypeScript will error on the missing key |
| Test fixtures use `as any` to bypass renamed types | M | Sprint S3 includes test fixture migration; CODEX-A3-014 tracks `as any` removal |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three naming collisions confirmed by two independent agents (CODEX-A3, OPUS-A5); workflow.ts already requires aliased imports |
| 2 | **Beyond Local Maxima?** | PASS | Rename, merge, and namespace options evaluated; rename is the only option that fixes structural incompatibility |
| 3 | **Sufficient?** | PASS | Covers all 5 collisions (Observation, FileEntry x3, ExchangeSummary, UserPrompt, ConversationPhase) plus the 2 highest-impact index signatures |
| 4 | **Fits Goal?** | PASS | Architecture remediation scope; no behavioral changes, only type-system alignment |
| 5 | **Open Horizons?** | PASS | Discriminated union pattern for LoadedData/NormalizedData is extensible to new data source types |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `types/session-types.ts`: Add `ToolName` union; narrow `ToolCounts` to `Record<ToolName, number>`; rename `ExchangeSummary` disambiguation
- `utils/input-normalizer.ts`: Rename `Observation` to `NormalizedObservation`, `FileEntry` to `NormalizedFileEntry`, `UserPrompt` to `NormalizedUserPrompt`; add deprecated re-export aliases
- `core/tree-thinning.ts`: Rename `FileEntry` to `ThinFileInput` (already aliased in current diff)
- `utils/message-utils.ts`: Rename `ExchangeSummary` to `ExchangeArtifactSummary`; add deprecated re-export alias
- `extractors/session-extractor.ts`: Update `ToolCounts` seeding to use `ToolName` keys
- 10-15 test files: Update imports to use new canonical names; remove `as any` casts where the rename makes them unnecessary
- Sprint S4 cleanup: Remove all deprecated re-export aliases

**How to roll back**: Revert Sprint S3 commit. Type errors will re-emerge but callers remain functional.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Architecture Boundary Enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Architecture Lead |

---

<!-- ANCHOR:adr-003-context -->
### Context

Wave 2 agent OPUS-A1 produced a complete dependency matrix across all 11 subsystems (95+ files). The analysis found 4 circular dependencies, 5 layer violations, 3 cross-boundary coupling issues, and 3 barrel export gaps. The key violations are:

1. **Circular dependencies via `../core` barrel** -- `lib/semantic-summarizer.ts`, `renderers/template-renderer.ts`, `loaders/data-loader.ts`, and `spec-folder/folder-detector.ts` all import `CONFIG` from `../core`, while `core/workflow.ts` imports from each of those subsystems. The cycles work at runtime because `core/index.ts` only re-exports from `config.ts` (which has no back-reference), but structurally they violate the layering model.

2. **`utils/` importing from `lib/`** -- `utils/phase-classifier.ts` and `utils/memory-frontmatter.ts` are re-export shims that import from `../lib/`. This inverts the leaf-layer contract (utils is Layer 1; lib is Layer 2).

3. **God module** -- `core/workflow.ts` has 34 cross-subsystem import statements from 8 different subsystems, including direct file imports that bypass barrel exports. Wave 1 agent CODEX-A1 (CODEX1-004) independently confirmed the `runWorkflow()` function spans ~1,100 lines.

4. **`extractors/quality-scorer.ts` imports types from `core/quality-scorer.ts`** -- `QualityDimensionScore`, `QualityFlag`, `QualityScoreResult` are shared types that belong in `types/`, not in a module that creates a Layer 3-to-Layer 3 dependency.

### Constraints

- Restoring clean boundaries must not break existing barrel exports consumed by MCP handlers
- Sprint S4 is the designated window for boundary restoration
- The `config/` facade module already exists and re-exports `CONFIG`, `findActiveSpecsDir`, `getSpecsDirectories`, and `getAllExistingSpecsDirs` -- it just needs to be used consistently
- MCP handlers must remain decoupled from `scripts/` (confirmed: zero direct imports found)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A three-pronged approach: (1) redirect CONFIG imports through the existing `config/` facade, (2) move shared quality types to `types/session-types.ts`, and (3) remove re-export shims by migrating their consumers to canonical `lib/` paths.

**How it works**:

**Prong 1 -- Break circular deps (P1 priority, ~5 min each):** Change `from '../core'` to `from '../config'` in `lib/semantic-summarizer.ts`, `renderers/template-renderer.ts`, `loaders/data-loader.ts`. For `spec-folder/folder-detector.ts` and `spec-folder/directory-setup.ts`, also add `SPEC_FOLDER_PATTERN` and `findChildFolderAsync` re-exports to `config/index.ts`.

**Prong 2 -- Move shared types (P2 priority, ~30 min):** Move `QualityDimensionScore`, `QualityFlag`, `QualityScoreResult` from `core/quality-scorer.ts` to `types/session-types.ts`. Update the 3 importers (`extractors/quality-scorer.ts`, `core/quality-scorer.ts`, tests).

**Prong 3 -- Remove shims (P5 priority, ~15 min):** Update `extractors/conversation-extractor.ts` to import from `../lib/phase-classifier` directly, then delete `utils/phase-classifier.ts`. Update `core/workflow.ts` to import from `../lib/memory-frontmatter`, then delete `utils/memory-frontmatter.ts`. Remove `extractors/session-activity-signal.ts` shim and update its 1 test importer. Remove the cross-subsystem re-export from `extractors/index.ts:14` (`export * from '../lib/session-activity-signal'`).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move shared types to `types/` + redirect through `config/` facade (chosen)** | Resolves all 4 circular deps and both layer violations cleanly; facade already exists | Requires call-site updates across extractors and core; config/ facade grows | 9/10 |
| Add allowlist to import policy | No code moves; easy to implement | Encodes the violation permanently; allowlist grows without bound | 3/10 |
| Merge violating modules | Eliminates cross-module import | Creates oversized module; contradicts modular architecture goal | 2/10 |

**Why this one**: The `config/` facade was specifically designed to break these upward dependencies (OPUS-A1 confirmed 6 extractor files already use it correctly). The fix is to make the remaining 4 files follow the same established pattern. Moving shared types to `types/` follows the existing convention where `types/session-types.ts` is the canonical location for cross-subsystem type definitions.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- All 4 circular dependency cycles eliminated
- `utils/` restored as a clean leaf layer (only imports from `types/`)
- `extractors/` barrel no longer leaks `lib/` symbols
- Architecture boundary checker (`check-architecture-boundaries.ts`) will pass without allowlist exceptions for these paths
- Future `lib/` additions cannot accidentally create new cycles through the `core/` barrel

**What it costs**:
- `config/index.ts` gains 3-4 additional re-exports (`SPEC_FOLDER_PATTERN`, `findChildFolderAsync`, `findChildFolderSync`)
- 8-10 import paths change across the codebase
- 3 shim files deleted (net reduction in file count)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Consumer outside sprint scope still imports via deleted shim | M | Barrel exports remain stable; only direct-path importers break. Run `tsc --noEmit` to verify |
| `config/` facade becomes a new God module | L | Facade only re-exports; no logic. Size stays proportional to config surface |
| Barrel consolidation in `core/workflow.ts` (OPUS-A1-008) deferred | L | Tracked separately; import-path correctness is more important than barrel-vs-direct |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 4 circular deps confirmed by OPUS-A1 dependency matrix; `utils/` has 2 confirmed layer violations |
| 2 | **Beyond Local Maxima?** | PASS | Facade redirect, merge, and allowlist options evaluated |
| 3 | **Sufficient?** | PASS | All 4 cycles and both layer violations resolved; shim cleanup prevents regression |
| 4 | **Fits Goal?** | PASS | Architecture boundary restoration is the primary goal of Sprint S4 |
| 5 | **Open Horizons?** | PASS | `config/` facade pattern is reusable for any new cross-cutting utility; architecture checker enforces ongoing compliance |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `lib/semantic-summarizer.ts`: Change `from '../core'` to `from '../config'`
- `renderers/template-renderer.ts`: Change `from '../core'` to `from '../config'`
- `loaders/data-loader.ts`: Change `from '../core'` to `from '../config'`
- `spec-folder/folder-detector.ts`, `spec-folder/directory-setup.ts`: Change `from '../core'` to `from '../config'`
- `config/index.ts`: Add `SPEC_FOLDER_PATTERN`, `findChildFolderAsync`, `findChildFolderSync` re-exports
- `types/session-types.ts`: Receive `QualityDimensionScore`, `QualityFlag`, `QualityScoreResult` from `core/quality-scorer.ts`
- Delete: `utils/phase-classifier.ts`, `utils/memory-frontmatter.ts`, `extractors/session-activity-signal.ts`
- `extractors/index.ts`: Remove `export * from '../lib/session-activity-signal'`
- `core/workflow.ts`: Update 1 import path from utils shim to lib canonical

**How to roll back**: Revert Sprint S4 commit. Architecture violations re-emerge but functionality is restored.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Build Artifact Management

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Build/Release Lead |

---

<!-- ANCHOR:adr-004-context -->
### Context

Wave 1 agent CODEX-A1 found that `tree-thinning.js` in the source tree has `memoryThinThreshold: 300` while the TS source has `150`, meaning JS consumers execute different tree-thinning behavior than TS callers. Wave 2 agent OPUS-A4 conducted a comprehensive inventory and found:

- **8 stale source-tree artifacts** (`.js`, `.d.ts`, `.js.map`, `.d.ts.map` for `tree-thinning` and `check-architecture-boundaries`) that coexist with their `.ts` sources -- these are already staged as deletions in git.
- **5 CRITICAL stale `dist/` artifacts** for deleted source files: `run-quality-legacy-remediation` (full set of 4 files), `run-chk210-quality-backfill` (2 map files), `run-phase1-5-shadow-eval` (2 map files), `run-phase3-telemetry-dashboard` (2 map files), and `structure-aware-chunker` (full set of 4 files).
- **2 MEDIUM stale `dist/` artifacts** where source was modified but dist was not rebuilt: `tree-thinning` (FileEntry renamed to ThinFileInput) and `core/index.ts` (barrel narrowed).

The `dist/evals/run-quality-legacy-remediation.js` stale artifact is actively dangerous: `heal-ledger-mismatch.sh:104` executes it via `node dist/evals/run-quality-legacy-remediation.js`, running code from a deleted source.

### Constraints

- `dist/` is the intended output location; source-tree `.js` files are build artifacts that should not coexist with `.ts` source
- Git status shows source-tree artifacts as deleted-staged, confirming they are not intentionally kept
- The `scripts/dist/` directory is not `.gitignore`d, meaning stale artifacts persist across clones
- No CI step currently verifies `dist/` freshness against source
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Delete all stale artifacts (both source-tree and dist/), rebuild dist/ from current TS source, and add a `.gitignore` entry plus CI check to prevent recurrence.

**How it works**:

1. **Delete stale source-tree artifacts** -- Confirm the 8 already-staged deletions (tree-thinning and check-architecture-boundaries `.js`/`.d.ts`/`.map` files). These should never have been committed alongside their `.ts` sources.

2. **Delete stale dist/ artifacts** -- Remove all `dist/` files for the 4 deleted eval scripts and the relocated `structure-aware-chunker`. This eliminates the `heal-ledger-mismatch.sh` executing stale code risk.

3. **Full dist/ rebuild** -- Run `tsc` with the current `tsconfig.json` to regenerate all `dist/` output. This synchronizes the `tree-thinning` threshold (150, not 300), the `core/index` barrel narrowing, and all renamed types.

4. **Add .gitignore for source-tree build artifacts** -- Add `scripts/core/*.js`, `scripts/core/*.d.ts`, `scripts/core/*.map`, `scripts/evals/*.js`, `scripts/evals/*.d.ts`, `scripts/evals/*.map` to `.gitignore` to prevent future source-tree artifact commits. The `dist/` directory remains tracked (intentional, since it ships to consumers).

5. **Add CI freshness check** -- A build-verify step that runs `tsc --noEmit` and compares `dist/` checksum before and after rebuild. If they differ, the build fails. This prevents future source/dist drift.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete stale artifacts + rebuild + CI check (chosen)** | Clean tree; prevents recurrence; single source of truth | Must verify no runtime consumer uses source-tree JS directly | 9/10 |
| Rebuild from TS source only (no CI check) | Correct behavior now | Will drift again without enforcement; same problem recurs next refactor | 5/10 |
| Keep artifacts with version pin | No code changes | Perpetuates source/build drift; `heal-ledger-mismatch.sh` still runs stale code | 2/10 |

**Why this one**: The `memoryThinThreshold: 300 vs 150` divergence proves drift is not hypothetical -- it already caused different runtime behavior depending on whether a consumer loaded the `.ts` or `.js` version. Deleting without a CI guard would allow the same drift to recur within one sprint cycle.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Single source of truth: TS source is always authoritative
- `heal-ledger-mismatch.sh` can no longer execute code from a deleted source
- `tree-thinning` behavior is consistent regardless of how the module is loaded
- `dist/` accurately reflects the current barrel surface (narrowed exports)

**What it costs**:
- One-time full `dist/` rebuild (~30 seconds)
- CI step adds ~10 seconds to each build

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime consumer loads from source-tree `.js` path instead of `dist/` | M | `.gitignore` prevents new source-tree artifacts; existing imports verified to use TS or dist paths |
| dist/ rebuild introduces new TypeScript compilation errors | L | `tsc --noEmit` as pre-check before rebuild; any errors are real and need fixing |
| CI freshness check flaky due to timestamp-only changes in `.map` files | L | Compare content hash only, exclude `.map` metadata fields |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `memoryThinThreshold` 300 vs 150 drift confirmed by CODEX-A1-010; ops script executing deleted source confirmed by OPUS-A4-001 |
| 2 | **Beyond Local Maxima?** | PASS | Delete-only, rebuild-only, and delete+rebuild+CI options evaluated |
| 3 | **Sufficient?** | PASS | Covers all 5 CRITICAL dist artifacts, 8 source-tree artifacts, and 2 stale-but-not-deleted dist artifacts |
| 4 | **Fits Goal?** | PASS | Build hygiene is prerequisite for architecture boundary enforcement; stale artifacts mask real violations |
| 5 | **Open Horizons?** | PASS | CI freshness check prevents any future source/dist drift, not just the current batch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Delete 8 source-tree artifacts (`core/tree-thinning.{js,d.ts,js.map,d.ts.map}`, `evals/check-architecture-boundaries.{js,d.ts,js.map,d.ts.map}`)
- Delete 14 stale `dist/` artifacts across 5 deleted/relocated modules
- Run `tsc` rebuild for full `dist/` synchronization
- Add `.gitignore` entries for `scripts/core/*.js`, `scripts/evals/*.js` and corresponding `.d.ts`/`.map` patterns
- Add CI step: `tsc --noEmit && diff <(sha256sum dist/**/*.js | sort) <(sha256sum dist-fresh/**/*.js | sort)`
- Update `scripts/ops/heal-ledger-mismatch.sh` to remove the `node dist/evals/run-quality-legacy-remediation.js` call

**How to roll back**: `git restore` the deleted artifact files. Drift re-emerges but no runtime breakage.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Spec Phase Metadata Governance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Tooling Lead |

---

<!-- ANCHOR:adr-005-context -->
### Context

Wave 2 agent OPUS-A3 performed a systematic inventory of all 20 child phases (000-019) plus 5 sub-children under 000. The findings reveal three categories of metadata inconsistency:

1. **Missing `status` field in description.json** -- 15 of 20 top-level phases and all 5 sub-children lack a `status` field in their `description.json`. Only phases 000, 001, 007, 015, and 018 have it set. Since the memory indexer and tooling read `description.json` for routing, missing status fields degrade search precision.

2. **Phase number denominators are wrong** -- Phases 011-014 use historical "Phase X" labels in their spec.md that do not match their folder IDs (011 claims "Phase 12", 012 claims "Phase 13", 013 claims "Phase 14", 014 claims "Phase 17"). Sub-children 000/001-003 say "X of 3" but there are now 5 sub-children.

3. **Missing from centralized index** -- Phase 019-architecture-remediation is absent from `descriptions.json` (the root index file), making it invisible to tooling that reads the centralized index for routing or search (OPUS-A3-004).

Wave 2 agent OPUS-A2 independently confirmed the same phase numbering inconsistencies (OPUS-A2-002 through OPUS-A2-005) and found the parent checklist claims 36 items but actually contains 39 (OPUS-A2-006).

### Constraints

- `description.json` files are consumed by the memory indexer; malformed status fields affect retrieval quality
- Manual correction of 20+ phase files is error-prone; automation preferred
- The `descriptions.json` root index must be regenerated or manually updated when phases are added
- R-Item numbering is historical and used for cross-referencing; changing it has cascading documentation effects
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: A two-track approach -- (1) immediate manual backfill of critical metadata gaps (Sprint S5), and (2) an automated lint script that enforces description.json consistency going forward.

**How it works**:

**Track 1 -- Manual backfill (Sprint S5):**
- Add `"status": "complete"` to 12 description.json files for completed phases (002-006, 008-014, 016-017)
- Add `"status": "in-progress"` to phase 019 and sub-child 000/005
- Add `"status": "complete"` to sub-children 000/001-004
- Update phase number labels in 011-014 spec.md to match folder IDs (011="Phase 11", 012="Phase 12", 013="Phase 13", 014="Phase 14")
- Update denominator "of 3" to "of 5" in 000/001-003 spec.md
- Add phase 019 entry to `descriptions.json` root index
- Fix parent checklist counts: P0: 12, P1: 20, P2: 7 (total 39)
- Normalize 019's specId to `"019"` and folderSlug to `"architecture-remediation"`

**Track 2 -- Automated lint script (Sprint S5):**
- A `check-phase-metadata.ts` script that:
  - Verifies every phase folder has `status` in description.json
  - Checks description.json `status` matches spec.md status (spec.md is authoritative)
  - Validates phase number labels in spec.md match folder IDs
  - Checks denominator values against actual sibling count
  - Verifies all phase folders appear in `descriptions.json` root index
  - Reports stale R-Item cross-references (informational, not blocking)
- Run as part of the existing `progressive-validate.sh` pipeline
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Manual backfill + automated lint (chosen)** | Fixes existing gaps AND prevents recurrence; lint integrates with existing validation | Requires writing and maintaining the linter (~100 LOC) | 9/10 |
| Manual correction in Sprint S5 only | No new tooling | Will drift again on next phase addition without enforcement | 5/10 |
| Schema validation via JSON Schema | Catches structural errors (missing required fields) | Does not catch semantic inconsistencies (status vs spec.md, denominator vs sibling count) | 4/10 |

**Why this one**: The metadata gaps are a systemic pattern (15 of 20 phases missing status), not a one-off error. Manual correction fixes the current state but the linter prevents the same gap from appearing when phase 020+ is added. JSON Schema alone cannot validate cross-file semantic consistency.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Memory indexer can route queries using description.json status field for all 25 phase entries
- Phase documentation map in parent spec.md matches on-disk reality
- Tooling that reads `descriptions.json` can find phase 019
- New phases automatically validated for metadata completeness

**What it costs**:
- Sprint S5: ~1 hour for manual backfill across 20+ files
- Sprint S5: ~2 hours to write and test the lint script
- Ongoing: lint script runs in ~2 seconds per validation cycle

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lint script false-positives on intentionally divergent status (e.g., 000 parent "in-progress" while children are complete) | M | Add `statusOverride` field to description.json for documented exceptions; lint recognizes it |
| R-Item renumbering breaks external references | L | R-Items are NOT renumbered; only spec.md "Phase X" labels are aligned to folder IDs. Historical R-Items stay as-is with informational lint warnings |
| Changing checklist counts triggers re-verification | L | Only the summary table values change; actual checklist items are unchanged |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 15/20 phases missing status; 7 instances of wrong denominators; 1 phase missing from root index. Confirmed by both OPUS-A2 and OPUS-A3 independently |
| 2 | **Beyond Local Maxima?** | PASS | Manual-only, lint-only, and schema-only options evaluated |
| 3 | **Sufficient?** | PASS | Covers all 9 OPUS-A3 findings and all 6 OPUS-A2 metadata-related findings |
| 4 | **Fits Goal?** | PASS | Metadata governance enables accurate tooling; prerequisite for memory indexer search quality |
| 5 | **Open Horizons?** | PASS | Lint script extensible to future metadata fields (e.g., keywords quality check from OPUS-A3-008) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Sprint S5: Update 20 `description.json` files with `status` field; update 7 spec.md files with corrected phase numbers and denominators; add 019 to `descriptions.json`; fix parent checklist counts
- Sprint S5: New file `scripts/evals/check-phase-metadata.ts` (~100 LOC); integrate into `progressive-validate.sh`

**How to roll back**: Remove the linter from CI pipeline. Manual governance resumes.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Memory Save Pipeline Safety

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Platform Safety Lead |

---

<!-- ANCHOR:adr-006-context -->
### Context

Wave 1 agent CODEX-A5 found three independent safety defects in the memory save pipeline:

1. **Race condition in `atomicSaveMemory()`** (CODEX-A5-003) -- Every concurrent save to the same file writes to the same deterministic `_pending` path derived from `transactionManager.getPendingPath(file_path)`. Two overlapping saves can overwrite or delete each other's pending file because there is no file-level lock.

2. **Non-atomic post-commit rewrites** (CODEX-A5-004) -- After DB indexing succeeds, the handler rewrites the source file with plain `fs.promises.writeFile()` at `memory-save.ts:565-572` (chunked path) and `memory-save.ts:723-727` (non-chunked path). The only mutex is the in-process `SPEC_FOLDER_LOCKS` map, which does not protect cross-process writers. A crash between DB commit and file rewrite leaves the DB reflecting new state while the disk still has old content.

3. **Fail-open V-rule bridge** (CODEX-A5-002) -- The V-rule bridge (`v-rule-bridge.ts:44-55`) swallows all module load failures and disables V-rule enforcement with only a warning. Since `memory-save.ts:410-447` only enforces V-rules when `vRuleResult` is truthy, a broken or missing `dist/` artifact silently bypasses the hard-block and write-skip-index dispositions. This means quality gates can be silently disabled by a build artifact issue.

Additionally, CODEX-A1-005 found the workflow lock only serializes runs inside one Node process via a promise queue. Concurrent CLI invocations race on shared files like `description.json`, so `memorySequence` and `memoryNameHistory` updates can be lost.

### Constraints

- Memory save is the most critical write path; any fix must not introduce latency that makes the save UX noticeably slower
- MCP handlers run in a long-lived server process; file locks must be released even on unhandled exceptions
- Cross-process locking must work on macOS and Linux (no Windows requirement)
- V-rule validation rules are loaded from `dist/` which may be stale (see ADR-004)
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Three targeted fixes corresponding to each defect, with fail-closed as the default posture.

**How it works**:

1. **Unique pending filenames per request.** Replace `transactionManager.getPendingPath(file_path)` deterministic suffix with `${base}_pending_${randomUUID()}${ext}`. Each concurrent save gets its own staging file. The rename-to-final step becomes the serialization point (OS-level atomic rename). Add a cleanup sweep for orphaned `_pending_*` files older than 60 seconds.

2. **Atomic file writes for post-commit rewrites.** Replace both `fs.promises.writeFile()` calls in the chunked and non-chunked paths with the pending-file + rename flow already implemented in `atomicSaveMemory()`. Use `fs.renameSync` (same filesystem, atomic on POSIX) for the final promotion. Wrap the rename in a file-path lock (using `proper-lockfile` or equivalent) keyed by the final path, not the spec-folder lock.

3. **Fail-closed V-rule bridge.** Change the bridge's error handler from `return null` (disables enforcement) to `throw new Error('V-rule validation unavailable')`. The `memory-save` handler must surface this as a save failure, not a silent pass. Add an eagerness check at MCP server startup: attempt to load the V-rule module and report a startup warning if it fails, rather than discovering the failure at save time.

4. **Cross-process workflow lock for `description.json`.** Replace the in-memory promise queue with a filesystem lockfile (`${specFolder}/.workflow.lock`) using `proper-lockfile` with stale detection. Hold the lock for the read-modify-write cycle of `description.json` updates only, not the entire workflow.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unique pending + atomic rename + fail-closed bridge (chosen)** | Addresses all 3 defects; fail-closed prevents silent quality bypass | Requires `proper-lockfile` dependency or equivalent; slightly more disk I/O | 9/10 |
| Mutex-only (add per-path locks, keep deterministic pending) | Simpler; no new dependency | Does not fix atomicity of post-commit rewrites; mutex alone does not protect against crash mid-write | 5/10 |
| Fail-closed V-rules only (defer file safety) | Quick win for quality gate bypass | Race condition and non-atomic writes remain; data loss risk unchanged | 4/10 |
| Queue all saves through single worker thread | Eliminates all concurrency issues | Serializes saves globally; unacceptable latency for multi-spec-folder workflows | 3/10 |

**Why this one**: Each defect has an independent fix with a clear mechanism. Unique pending files and atomic rename are established patterns for safe concurrent file writes. Fail-closed is the correct default for a quality gate -- the alternative (fail-open) means the gate provides no protection when it is most needed (during build/deploy issues).
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Concurrent saves to the same file no longer overwrite each other's staging data
- DB/file state cannot diverge after a crash during the post-commit rewrite
- V-rule quality gates actually enforce quality -- a missing `dist/` artifact blocks the save rather than silently disabling validation
- Cross-process `description.json` updates are serialized

**What it costs**:
- `proper-lockfile` or equivalent becomes a new dependency (~15KB, no native modules)
- Each save creates and renames 1 additional temporary file (microseconds of overhead)
- V-rule bridge failure now blocks saves, requiring `dist/` to be built before the MCP server starts

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lockfile not released after crash (stale lock) | H | `proper-lockfile` has built-in stale detection (configurable, default 5 minutes); startup cleanup sweep |
| Fail-closed V-rules block saves when dist/ is legitimately stale during development | M | Add `--skip-vrules` CLI flag for development-only use; flag is not available in production MCP handler |
| Orphaned `_pending_*` files accumulate | L | Cleanup sweep on startup and after each save attempt |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Race condition (CODEX-A5-003), non-atomic writes (CODEX-A5-004), and fail-open bridge (CODEX-A5-002) are three independent data-loss/quality-bypass vectors |
| 2 | **Beyond Local Maxima?** | PASS | Mutex-only, fail-closed-only, full-serialization, and targeted-fix options evaluated |
| 3 | **Sufficient?** | PASS | All 4 CODEX-A5 save-pipeline findings addressed; also resolves CODEX-A1-005 cross-process race |
| 4 | **Fits Goal?** | PASS | Memory save integrity is prerequisite for the entire memory system; architecture remediation must fix safety defects |
| 5 | **Open Horizons?** | PASS | Lockfile pattern reusable for any future cross-process coordination; fail-closed pattern applicable to other validation bridges |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `mcp_server/handlers/memory-save.ts`: Replace `writeFile()` with atomic pending+rename at lines 565-572 and 723-727
- `mcp_server/handlers/memory-save.ts`: Replace `transactionManager.getPendingPath()` with UUID-based pending path at line 1120
- `mcp_server/handlers/v-rule-bridge.ts`: Change error handler at lines 44-55 from `return null` to `throw`; add startup verification
- `mcp_server/handlers/memory-save.ts`: Add file-path lock using `proper-lockfile` around the rename step
- `core/workflow.ts`: Replace in-memory promise queue at line 976 with filesystem lockfile
- `package.json`: Add `proper-lockfile` dependency
- New file: `mcp_server/lib/pending-file-cleanup.ts` for orphan sweep

**How to roll back**: Revert the save-handler changes. Race condition and non-atomic writes re-emerge but single-process saves continue to work. V-rule bridge reverts to fail-open.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: JSON-Primary Data Flow Integrity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Data Pipeline Lead |

---

<!-- ANCHOR:adr-007-context -->
### Context

Wave 1 agent CODEX-A2 found that the JSON-primary data flow (the documented preferred mode for memory saves) has systematic integrity gaps where structured fields are dropped or bypassed during normalization:

1. **`sessionSummary`/`keyDecisions` dropped by normalization** (CODEX-A2-001) -- `normalizeInputData()` converts these canonical JSON-primary fields into observations but never preserves the raw fields. Downstream `collectSessionData()` at line 350-362 checks `collectedData.sessionSummary` and `collectedData.keyDecisions` directly, finding them empty.

2. **Structured `toolCalls`/`exchanges` ignored downstream** (CODEX-A2-002) -- `session-types.ts` declares `toolCalls?: ToolCallSummary[]` and `exchanges?: ExchangeSummary[]`, but `session-extractor.ts` reconstructs tool/activity state from observation text regex instead of consuming the richer structured fields. `conversation-extractor.ts` rebuilds tool calls from `observations[].facts`.

3. **`nextSteps` type mismatch** (CODEX-A2-003) -- `session-types.ts` declares `nextSteps?: Array<Record<string, unknown>>`, but normalization and rendering treat it as `string[]`. Object-form next steps collapse into `[object Object]` at `input-normalizer.ts:310-325`.

4. **JSON-mode skips validation entirely** (CODEX-A5-001) -- `--stdin`/`--json` mode only `JSON.parse`s the payload and spreads it into `collectedData` with `_source: 'file'`. Unlike file-based mode, it never calls `validateInputData()` or `normalizeInputData()`. The documented JSON example uses snake_case fields (`user_prompts`, `recent_context`) but `runWorkflow()` reads camelCase fields (`collectedData.userPrompts`), so unnormalized snake_case input is silently dropped.

These findings mean the JSON-primary mode -- documented as the preferred routine save method -- can produce incomplete memories without any error signal.

### Constraints

- JSON-primary mode is the documented preferred interface; fixes must not break existing JSON payloads
- Both snake_case (documented examples) and camelCase (runtime expectations) must be supported during migration
- Normalization must run on JSON-mode payloads without double-processing fields that are already in canonical form
- Backward compatibility with recovery-mode (`--recovery`) payloads must be preserved
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Thread JSON-primary payloads through the same `validateInputData()` and `normalizeInputData()` pipeline as all other modes, and make downstream extractors prefer structured fields over text reconstruction.

**How it works**:

1. **Validate and normalize JSON-mode input.** In `generate-context.ts:372-389`, after `JSON.parse`, call `validateInputData(parsed)` and then `normalizeInputData(validated)` before assigning to `collectedData`. Reject payloads that fail validation with a clear error message instead of silently dropping fields.

2. **Preserve canonical JSON-primary fields through normalization.** In `normalizeInputData()`, always persist `sessionSummary`, `keyDecisions`, and `nextSteps` on the normalized output, in addition to converting them to observations for backward compatibility. Add an `_isPreNormalized` flag that downstream code can check to avoid double-processing.

3. **Narrow `nextSteps` type to `string[]`.** Update `session-types.ts` to declare `nextSteps?: string[]`. In `normalizeInputData()`, add explicit coercion: if an element is a `Record`, extract a `description` or `text` field, or fall back to `JSON.stringify()`. This prevents `[object Object]` rendering.

4. **Thread structured `toolCalls`/`exchanges` through normalization.** Make `session-extractor.ts` prefer `collectedData.toolCalls` when present, falling back to regex-based observation counting only when the structured array is empty. Same pattern for `conversation-extractor.ts` and `exchanges`.

5. **Support both snake_case and camelCase.** In `normalizeInputData()`, add a snake-to-camelCase mapping for documented JSON fields (`user_prompts` -> `userPrompts`, `recent_context` -> `recentContext`, etc.). Apply this mapping before validation so the validator sees canonical field names.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full normalization pipeline for JSON mode (chosen)** | Single code path for all modes; structured fields preserved; validation catches malformed input | Must handle snake/camel case; normalization is a complex function | 9/10 |
| Separate lightweight validator for JSON mode | Simpler; no risk of double-processing | Two validation paths to maintain; structured fields still not threaded through | 4/10 |
| Document camelCase as the only supported format | Simplest; no normalization needed | Breaks existing JSON payloads using documented snake_case examples; bad UX | 2/10 |

**Why this one**: The JSON-primary mode was introduced as the preferred save method precisely because the AI has better context than dynamic capture. Silently dropping that context defeats the purpose. Running through the same pipeline ensures all modes produce memories with the same structural guarantees.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- JSON-primary saves produce complete memories with `sessionSummary`, `keyDecisions`, `toolCalls`, and `exchanges` preserved
- Validation catches malformed JSON payloads at save time instead of producing incomplete memories
- `nextSteps` renders as human-readable text, not `[object Object]`
- Tool call counts are accurate (derived from structured data, not regex)
- snake_case JSON payloads work as documented

**What it costs**:
- `normalizeInputData()` gains ~30 lines of snake-to-camelCase mapping
- `session-extractor.ts` and `conversation-extractor.ts` gain structured-field-preferred branches (~20 lines each)
- `session-types.ts` `nextSteps` type narrows from `Array<Record<string, unknown>>` to `string[]` (breaking change for any external caller using object-form next steps)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Normalization double-processes already-normalized JSON-mode fields | M | `_isPreNormalized` flag skips redundant transformations; idempotent field assignments prevent data corruption |
| snake_case mapping introduces ambiguity for fields with both forms | L | Canonical camelCase always wins; snake_case is mapped only when camelCase is absent |
| `nextSteps` type narrowing breaks callers passing object arrays | M | Coercion logic extracts `description`/`text` fields gracefully; JSON.stringify is the last fallback |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | JSON-primary mode is the documented preferred method; 4 independent findings confirm it drops fields silently (CODEX-A2-001, CODEX-A2-002, CODEX-A2-003, CODEX-A5-001) |
| 2 | **Beyond Local Maxima?** | PASS | Full pipeline, separate validator, and documentation-only options evaluated |
| 3 | **Sufficient?** | PASS | All 4 data-flow integrity findings addressed; structured fields preserved end-to-end |
| 4 | **Fits Goal?** | PASS | Data fidelity is a core architecture quality; the JSON-primary mode is the system's primary data entry point |
| 5 | **Open Horizons?** | PASS | snake-to-camelCase mapping extensible to new fields; structured-field preference pattern applicable to future data sources |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `memory/generate-context.ts:372-389`: Add `validateInputData()` + `normalizeInputData()` calls after JSON.parse
- `utils/input-normalizer.ts`: Add snake-to-camelCase mapping; preserve `sessionSummary`, `keyDecisions`, `nextSteps` on output; add `_isPreNormalized` flag
- `types/session-types.ts`: Narrow `nextSteps` to `string[]`; add coercion note in JSDoc
- `extractors/session-extractor.ts`: Prefer `toolCalls` structured array when available
- `extractors/conversation-extractor.ts`: Prefer `exchanges` structured array when available
- Update 3-4 test files for narrowed `nextSteps` type and new validation behavior

**How to roll back**: Revert the generate-context.ts and input-normalizer.ts changes. JSON-mode saves return to the unvalidated path. Structured fields are again dropped.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Dead Code and Deprecated Module Deletion Policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-03-21 |
| **Deciders** | Spec Kit Owner, Code Health Lead |

---

<!-- ANCHOR:adr-008-context -->
### Context

Multiple Wave 1 and Wave 2 agents independently identified dead code, unwired modules, and deprecated-but-retained code across the codebase. The findings consolidate into four clusters:

1. **Unwired shared module** -- `lib/cli-capture-shared.ts` exports 10 helper functions (`transcriptTimestamp`, `readJsonl`, `normalizeToolName`, `extractTextContent`, `buildSessionTitle`, etc.) that are duplicated in all 4 CLI capture modules (claude-code, codex-cli, copilot-cli, gemini-cli). Zero files import from the shared module (OPUS-A5-001). The module was created during "CODEX2-006 deduplication" but the wiring step was never completed.

2. **Deprecated legacy quality scorer** -- `core/quality-scorer.ts` is explicitly marked `@deprecated` in JSDoc, pointing to `extractors/quality-scorer.ts` as the canonical replacement. `core/workflow.ts` already imports from the extractor scorer. Only 2 test files still import the legacy scorer (OPUS-A5-002, CODEX-A1-006, CODEX-A2-008). The dual scorer creates confusion about which score is authoritative and fragments test calibration.

3. **Deleted eval scripts with stale references** -- 4 eval scripts were deleted (`run-chk210-quality-backfill.ts`, `run-phase1-5-shadow-eval.ts`, `run-phase3-telemetry-dashboard.ts`, `run-quality-legacy-remediation.ts`) but their stale `dist/` artifacts remain (OPUS-A4-001..004), the evals README still documents them (OPUS-A4-015), and 3 ops scripts reference them -- `heal-session-ambiguity.sh` and `heal-telemetry-drift.sh` now exit with deprecation errors (OPUS-A4-008..009), while `heal-ledger-mismatch.sh` still tries to execute the stale `dist/` artifact (OPUS-A4-010).

4. **Dead exports and parameters** -- `extractKeyArtifacts()` is marked "Dead code -- zero production importers" but still exported (CODEX3-009). `formatOptionBox()`'s `isChosen` parameter is accepted but never used (CODEX3-010). `generateMergedDescription` is exported but has zero importers (CODEX1-006). `toolCallIndexById` in gemini-cli-capture is write-only dead state (CODEX-A2-010). `null-data simulation fallback` in collect-session-data is dead code (CODEX-A2-009).

### Constraints

- Dead code deletion must not break any live import path -- verified by `tsc --noEmit`
- The `@deprecated` tag on `core/quality-scorer.ts` is documentation-only; TypeScript does not enforce it
- Ops scripts are sometimes run manually by operators who may not track source changes
- The `lib/cli-capture-shared.ts` module was intentionally created -- the question is whether to wire it in or delete it
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: DELETE completely. No `@deprecated` tags, no re-export shims, no "keep for future use." Dead code is deleted; unwired modules are either wired in (cli-capture-shared) or deleted within the sprint they are identified.

**How it works**:

**Policy:**
- Code with zero live importers and no documented future-use ticket: DELETE in the same sprint it is identified.
- `@deprecated` tags are a migration tool with a maximum lifespan of 1 sprint. If not migrated by end of sprint, delete.
- Ops scripts that reference deleted code: UPDATE to either wire a replacement or remove the broken step with a clear error message. Do not leave broken references that execute stale `dist/` artifacts.
- Stale `dist/` artifacts for deleted source: DELETE immediately (covered by ADR-004).

**Specific actions for this sprint:**

1. **`lib/cli-capture-shared.ts`**: Wire into all 4 CLI capture modules. Replace the 20+ local duplicate function definitions with imports from the shared module. This is the original design intent (CODEX2-006 deduplication) that was never completed. Estimated effort: 2 hours with test verification.

2. **`core/quality-scorer.ts`**: DELETE entirely. Migrate the 2 remaining test importers (`quality-scorer-calibration.vitest.ts`, `description-enrichment.vitest.ts`) to import from `extractors/quality-scorer.ts`. The legacy scorer has been deprecated for 3 sprints.

3. **Ops scripts**: DELETE `heal-session-ambiguity.sh` and `heal-telemetry-drift.sh` (they already exit with deprecation errors and serve no purpose). UPDATE `heal-ledger-mismatch.sh` to remove the `run-quality-legacy-remediation.js` step and add an explicit "ledger verification not yet replaced" error.

4. **Dead exports**: Remove `extractKeyArtifacts()` export, remove `formatOptionBox` `isChosen` parameter, remove `generateMergedDescription` export, remove `toolCallIndexById` map, remove null-data simulation fallback branch.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **DELETE completely, wire unwired code (chosen)** | Zero dead code; clean tree; no "might need it later" accumulation | Irreversible (git history preserves code but not discoverability) | 9/10 |
| Keep with `@deprecated` tags for 2 more sprints | Gives consumers more migration time | `@deprecated` is not enforced; dead code continues accumulating; ops scripts remain broken | 3/10 |
| Move to `_archive/` directory | Preserves discoverability without cluttering active tree | Archive directories become their own dead code; no one ever migrates back from archive | 2/10 |
| Delete dead code but keep cli-capture-shared unwired | Partial cleanup | The largest source of duplication (~200 lines across 4 files) remains | 5/10 |

**Why this one**: Dead code has a compounding maintenance cost -- every audit, every refactor, and every new contributor must evaluate whether dead code is intentionally retained. The git history provides recovery if deletion is premature. The one exception to "delete" is `lib/cli-capture-shared.ts`, which represents intentional design work that should be completed, not discarded.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- ~200 lines of duplicate CLI capture helpers consolidated into shared module
- Dual quality scorer confusion eliminated; one scorer, one calibration, one test surface
- Ops runbook contains only functional scripts
- Codebase surface area reduced by ~500 lines of dead code
- `tsc` has fewer files to check; `vitest` has fewer stale references

**What it costs**:
- `lib/cli-capture-shared.ts` wiring: ~2 hours of careful per-module replacement with test verification
- `core/quality-scorer.ts` deletion: ~30 minutes (delete file, update 2 test imports)
- Ops script cleanup: ~15 minutes
- Dead export removal: ~30 minutes across 5 files

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| cli-capture-shared wiring introduces behavioral differences from local implementations | M | Each shared function was extracted from the local implementations; diff local vs shared to verify exact parity before switching |
| Legacy quality scorer removal breaks calibration test expectations | M | Re-calibrate tests against extractor scorer; both scorers were running in parallel so extractor scores are known |
| Operator runs deleted ops script from cached shell history | L | Scripts already exit with error messages; deletion adds a clear "file not found" signal |
| Dead export removal breaks an undiscovered external consumer | L | Barrel narrowing (Wave 2) already removed these from public surface; direct-path imports verified to have zero consumers via grep |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 4 clusters of dead/unwired code confirmed by 6 independent agents (CODEX-A1, CODEX-A2, CODEX-A5, OPUS-A4, OPUS-A5, CODEX3) |
| 2 | **Beyond Local Maxima?** | PASS | Delete, deprecate-longer, archive, and partial-delete options evaluated |
| 3 | **Sufficient?** | PASS | Covers all identified dead code clusters; establishes policy preventing future accumulation |
| 4 | **Fits Goal?** | PASS | Code health is a direct architecture quality dimension; dead code masks real architecture violations |
| 5 | **Open Horizons?** | PASS | "Delete, don't deprecate" policy applies to all future dead code; 1-sprint deprecation window is a reusable governance rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- Sprint S1: Wire `lib/cli-capture-shared.ts` into `claude-code-capture.ts`, `codex-cli-capture.ts`, `copilot-cli-capture.ts`, `gemini-cli-capture.ts`; delete ~20 local duplicate definitions
- Sprint S2: Delete `core/quality-scorer.ts`; update 2 test files to import from `extractors/quality-scorer.ts`
- Sprint S1: Delete `ops/heal-session-ambiguity.sh`, `ops/heal-telemetry-drift.sh`; update `ops/heal-ledger-mismatch.sh`
- Sprint S2: Remove dead exports (`extractKeyArtifacts`, `generateMergedDescription`, `toolCallIndexById`, `isChosen` param, null-data simulation branch)
- Sprint S1: Delete stale `dist/` artifacts for 4 removed eval scripts (per ADR-004)

**How to roll back**: `git restore` deleted files. Dead code returns but no runtime behavior changes.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

## Cross-ADR Dependency Map

```
ADR-004 (Build Artifacts)  ──blocks──>  ADR-006 (Save Safety: V-rule bridge needs valid dist/)
ADR-002 (Type Dedup)       ──enables──> ADR-003 (Boundary Enforcement: clean types needed first)
ADR-003 (Boundaries)       ──enables──> ADR-008 (Dead Code: shim removal depends on boundary fix)
ADR-005 (Metadata)         ──independent
ADR-007 (JSON Flow)        ──depends──> ADR-002 (narrowed nextSteps type)
ADR-008 (Dead Code)        ──depends──> ADR-004 (stale dist/ deletion)
```

<!--
Level 3 Decision Record — 8 ADRs covering:
  ADR-001: Multi-agent audit architecture (complete, accepted)
  ADR-002: Type deduplication strategy (Wave 3 synthesis complete)
  ADR-003: Architecture boundary enforcement (Wave 3 synthesis complete)
  ADR-004: Build artifact management (Wave 3 synthesis complete)
  ADR-005: Spec phase metadata governance (Wave 3 synthesis complete)
  ADR-006: Memory save pipeline safety (Wave 3 synthesis complete)
  ADR-007: JSON-primary data flow integrity (Wave 3 synthesis complete)
  ADR-008: Dead code and deprecated module deletion policy (Wave 3 synthesis complete)
Write in human voice: active, direct, specific.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
