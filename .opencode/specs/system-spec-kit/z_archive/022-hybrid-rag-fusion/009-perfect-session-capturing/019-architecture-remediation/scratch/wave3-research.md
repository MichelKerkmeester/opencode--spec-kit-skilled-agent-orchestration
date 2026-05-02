# Architecture Remediation: Multi-Agent Audit Research Report

Date: 2026-03-21
Author: OPUS-B5 (Wave 3 Synthesis)

---

## Table of Contents

1. [Methodology](#methodology)
2. [Codebase Metrics](#codebase-metrics)
3. [Finding Distribution](#finding-distribution)
4. [Key Evidence Chains](#key-evidence-chains)
5. [Cross-Agent Agreement](#cross-agent-agreement)
6. [Architecture Diagram](#architecture-diagram)
7. [Technical Debt Inventory](#technical-debt-inventory)
8. [Agent Performance Comparison](#agent-performance-comparison)
9. [Limitations and Gaps](#limitations-and-gaps)

---

## 1. Methodology

### Audit Design

This audit employed a **3-wave, 20-agent architecture** to maximize both coverage breadth and finding reliability through independent verification.

```
WAVE 1 (Initial Audit)     WAVE 2 (Verification)      WAVE 3 (Synthesis)
========================    =======================    ===================
5 Codex GPT-5.4 agents     5 Opus 4.6 agents          5 Opus 4.6 agents
+ 5 Opus 4.6 agents        (fresh, independent)       (compilation/ADRs)

  CODEX-1..5 (W1-early)      CODEX-A1..A5 (W1-late)     OPUS-B1..B5 (W3)
  OPUS-1..5  (W1-early)      OPUS-A1..A5  (W2)
```

**Wave 1** (10 agents): Initial exploration across all subsystems. Each agent was assigned a specific subsystem or analysis lens (core pipeline, extractors, utils/lib, memory, tests/evals, phase tree, spec alignment, architecture boundaries, git diff, type system).

**Wave 2** (5 agents): Fresh Opus agents conducted independent re-analysis using different entry points -- architecture boundaries (A1), spec-to-code alignment (A2), phase tree metadata (A3), git diff impact (A4), and technical debt/duplication (A5). These intentionally overlapped Wave 1 scopes to validate findings.

**Wave 3** (5 agents): Synthesis agents compiling priority matrix (B1), ADRs (B2), checklist (B3), tasks (B4), and this research document (B5).

### Agent Assignments

| Agent ID | Model | Scope | Mode | Findings |
|----------|-------|-------|------|----------|
| **Wave 1 Early (Codex)** | | | |
| CODEX-1 | GPT-5.4 | Core pipeline (workflow, quality-scorer, memory-indexer, tree-thinning) | Read-only sandbox | 7 |
| CODEX-2 | GPT-5.4 | Extractor system (all capture modules, session/file extractors) | Read-only sandbox | 6 |
| CODEX-3 | GPT-5.4 | Utils and lib (anchor-gen, content-filter, data-validator, slug-utils) | Read-only sandbox | 10 |
| CODEX-4 | GPT-5.4 | Memory system (generate-context, cleanup, rank, validate, backfill) | Read-only sandbox | 7 |
| CODEX-5 | GPT-5.4 | Tests, evals, ops scripts, coverage analysis | Read-only sandbox | 9 |
| **Wave 1 Early (Opus)** | | | |
| OPUS-1 | Opus 4.6 | Phase tree consistency (predecessor/successor, numbering, handoffs) | Read-only | 22 |
| OPUS-2 | Opus 4.6 | Spec-to-code alignment (all 20 phase spec.md vs actual source) | Read-only | 14 |
| OPUS-3 | Opus 4.6 | Architecture boundaries (import graph, layer violations, circulars) | Read-only | 14 |
| OPUS-4 | Opus 4.6 | Git diff analysis (unstaged changes, deleted exports, breakage) | Read-only | 26 |
| OPUS-5 | Opus 4.6 | Type system verification (naming collisions, contract safety, casts) | Read-only | 20 |
| **Wave 1 Late (Codex)** | | | |
| CODEX-A1 | GPT-5.4 | Core pipeline logic (deep dive: workflow orchestration, quality gates) | Read-only sandbox | 10 |
| CODEX-A2 | GPT-5.4 | Extractor & JSON-primary flow (normalizer, loader, parity) | Read-only sandbox | 10 |
| CODEX-A3 | GPT-5.4 | Type system & contract safety (casts, index overuse, collisions) | Read-only sandbox | 14 |
| CODEX-A4 | GPT-5.4 | Test & eval coverage gaps (dead references, missing tests, fixtures) | Read-only sandbox | 9 |
| CODEX-A5 | GPT-5.4 | Memory system & MCP handlers (save flow, quality loop, V-rules) | Read-only sandbox | 5 |
| **Wave 2 (Opus)** | | | |
| OPUS-A1 | Opus 4.6 | Architecture boundary analysis (full dependency matrix) | Read-only | 15 |
| OPUS-A2 | Opus 4.6 | Spec-to-code alignment (phase-by-phase verification) | Read-only | 18 |
| OPUS-A3 | Opus 4.6 | Phase tree & metadata consistency (status, denominators, index) | Read-only | 9 |
| OPUS-A4 | Opus 4.6 | Git diff impact analysis (deleted exports, dist artifacts, ops) | Read-only | 18 |
| OPUS-A5 | Opus 4.6 | Duplicate code & technical debt (shims, shared modules, naming) | Read-only | 12 |

### Sandbox Modes

- **Codex GPT-5.4**: All agents ran in read-only sandbox mode (file system reads only, no writes)
- **Opus 4.6**: All agents ran in read-only mode (Grep, Glob, Read tools; no Edit/Write/Bash)
- **Wave 1 early fix agents** (fix-codex-1..5, fix-wave2-codex-1..10): Separate write-enabled Codex agents remediated specific findings after Wave 1 early audit completed

---

## 2. Codebase Metrics

### Subsystem File Counts

Source: OPUS-A1 dependency matrix (Wave 2)

| Subsystem | .ts Files | Barrel (index.ts) | Primary Role |
|-----------|-----------|-------------------|--------------|
| core/ | 9 | Yes | Workflow orchestration, quality scoring, indexing |
| extractors/ | 18 | Yes | Session/file/decision extraction, CLI captures |
| lib/ | 17 | No | Shared logic (content filter, summarizer, anchors) |
| utils/ | 19 | Yes | Leaf utilities (slugs, validators, detection) |
| memory/ | 8 | No | Context generation, memory maintenance, backfill |
| renderers/ | 2 | Yes | Template rendering |
| spec-folder/ | 5 | Yes | Spec folder detection, alignment validation |
| types/ | 1 | No (single file) | Canonical type definitions |
| loaders/ | 2 | Yes | Data loading, input normalization |
| config/ | 1 | Yes (facade) | CONFIG re-export facade |
| evals/ | 13 | No | Architecture checks, eval runners |
| **Total (scripts/)** | **95** | **7 barrels** | |

Additional:
- MCP server handlers (`mcp_server/handlers/`): ~44 files
- Tests (`scripts/tests/`): ~25 test files
- Ops scripts (`scripts/ops/`): 3 shell scripts

### Change Magnitude (Unstaged)

Source: OPUS-A4 git diff analysis

| Metric | Count |
|--------|-------|
| Files modified | 293 |
| Files deleted (source) | 15 |
| Files added (untracked) | 22 |
| Lines inserted | +3,551 |
| Lines deleted | -7,647 |
| **Net delta** | **-4,096 lines** |

### Test Coverage Ratios

Source: CODEX-5 coverage matrix, CODEX-A4 gap analysis

| Subsystem | Test Coverage | Gaps |
|-----------|---------------|------|
| core/quality-scorer.ts | Strong (calibration suite) | Extractor scorer has separate surface |
| core/workflow.ts | Partial (e2e, integration) | God function limits unit testability |
| extractors/ (captures) | Medium (4 capture suites) | Malformed input, maxExchanges, orphaned prompts |
| memory/ (maintenance) | Weak | ast-parser, cleanup-orphaned, rebuild-auto, reindex: no tests |
| evals/ (runners) | None to Weak | 3 deleted scripts had zero tests; boundaries has helper-only tests |
| lib/ (shared) | Indirect only | No direct test files for cli-capture-shared, topic-keywords, etc. |
| utils/ | Medium-Strong | data-validator internals, slug edge cases lack coverage |

**Modules with ZERO corresponding test files:**
- `memory/ast-parser.ts`
- `memory/cleanup-orphaned-vectors.ts`
- `memory/rebuild-auto-entities.ts`
- `memory/reindex-embeddings.ts`
- `core/subfolder-utils.ts`
- `lib/cli-capture-shared.ts`
- `lib/frontmatter-migration.ts`
- `lib/memory-frontmatter.ts`
- `lib/topic-keywords.ts`
- `utils/fact-coercion.ts`
- `utils/memory-frontmatter.ts`

---

## 3. Finding Distribution

### By Severity

| Severity | Wave 1 Early | Wave 1 Late | Wave 2 | Total |
|----------|-------------|-------------|--------|-------|
| CRITICAL | 6 | 0 | 8 | 14 |
| HIGH | 21 | 14 | 17 | 52 |
| MEDIUM | 32 | 18 | 20 | 70 |
| LOW | 17 | 16 | 18 | 51 |
| **Total** | **76** | **48** | **63** | **187** |

Note: Many findings across waves identify the same underlying issue. After deduplication (see Section 5), unique findings total approximately 95-110.

### By Category

| Category | Count | Examples |
|----------|-------|---------|
| ARCHITECTURE (boundary/layer violation) | 28 | Circular deps, utils-from-lib, barrel gaps |
| TYPE_SAFETY (naming collision, casts, index overuse) | 26 | 3 FileEntry shapes, dual quality scorer signatures |
| ALIGNMENT (spec/metadata drift) | 24 | Phase numbering, status mismatches, stale refs |
| DEAD_CODE / BUILD_DRIFT | 22 | Stale dist/ artifacts, deleted script refs, unused exports |
| LOGIC_ERROR / BUG | 18 | Tree-thinning truncation, timestamp offset, similarity false positives |
| PARITY (cross-CLI consistency) | 9 | Session targeting, provenance metadata, tool classification |
| TEST_GAP (missing/shallow coverage) | 16 | Zero-test modules, silent skips, fixture drift |
| VALIDATION (silent failures, swallowed errors) | 11 | TOCTOU orphan cleanup, fail-open V-rule bridge |
| DATA_LOSS (crash/race conditions) | 6 | Concurrent save race, quarantine overwrite |
| DUPLICATE (code duplication) | 12 | cli-capture-shared unwired, re-export shims |
| OPS_BREAKAGE | 5 | 3 heal scripts non-functional |

### By Subsystem

| Subsystem | CRITICAL | HIGH | MEDIUM | LOW | Total |
|-----------|----------|------|--------|-----|-------|
| core/ (workflow, quality-scorer, tree-thinning, memory-indexer, config) | 1 | 10 | 10 | 4 | 25 |
| extractors/ (captures, session, file, contamination, spec-folder) | 0 | 4 | 11 | 4 | 19 |
| lib/ (content-filter, anchor-gen, summarizer, simulation, shared) | 1 | 1 | 7 | 3 | 12 |
| utils/ (input-normalizer, slug-utils, data-validator, message-utils) | 0 | 1 | 9 | 3 | 13 |
| memory/ (generate-context, cleanup, validate, rank, backfill) | 0 | 2 | 5 | 2 | 9 |
| types/ (session-types) | 0 | 3 | 3 | 1 | 7 |
| mcp_server/ (handlers: save, quality-loop, v-rule-bridge) | 0 | 4 | 1 | 0 | 5 |
| tests/ & evals/ | 0 | 3 | 7 | 5 | 15 |
| spec docs/ (spec.md, description.json, checklist.md) | 1 | 8 | 10 | 10 | 29 |
| ops/ (heal scripts) | 0 | 3 | 0 | 0 | 3 |
| dist/ (stale build artifacts) | 5 | 0 | 2 | 0 | 7 |

---

## 4. Key Evidence Chains (Top 10 Most Impactful)

### 1. Test Breakage: 20+ Export Assertions Against Removed Functions

**Agents:** OPUS-4 (001-005), CODEX-A4 (001-005)
**Severity:** CRITICAL
**Category:** TEST_BREAKAGE

```
Evidence Chain:
  git diff shows barrel exports removed from:
    - core/index.ts (-3 exports)
    - extractors/index.ts (-8 exports)
    - utils/index.ts (-16 exports)
    - renderers/index.ts (-3 exports)
    - spec-folder/index.ts (-6 exports)
  -->
  test-scripts-modules.js NOT updated to match
  -->
  20+ assertion blocks destructure now-private symbols
  -->
  IMMEDIATE CI FAILURE on test run
```

**Status:** Partially remediated by fix-codex-1. Additional private-helper assertions (CODEX-A4-001 through A4-005) for `data-validator`, `slugify`, `createSimulationFlowchart`, `BOX` constant, and trigger-extractor alias still need cleanup.

---

### 2. Stale dist/ Artifacts for Deleted Sources

**Agents:** OPUS-A4 (001-005), OPUS-4 (014-015), CODEX-1 (001, 005)
**Severity:** CRITICAL
**Category:** BUILD_DRIFT

```
Evidence Chain:
  4 eval scripts deleted from scripts/evals/:
    - run-quality-legacy-remediation.ts
    - run-chk210-quality-backfill.ts
    - run-phase1-5-shadow-eval.ts
    - run-phase3-telemetry-dashboard.ts
  + structure-aware-chunker.ts moved to shared/
  -->
  dist/evals/ and dist/lib/ still contain .js, .d.ts, .js.map, .d.ts.map
  -->
  heal-ledger-mismatch.sh:104 calls:
    node dist/evals/run-quality-legacy-remediation.js
  -->
  RUNTIME FAILURE in ops remediation
```

**Status:** Source-tree artifacts deleted by fix-codex-2. dist/ artifacts remain unaddressed.

---

### 3. cli-capture-shared.ts Extracted But Never Wired

**Agents:** OPUS-A5 (001), CODEX-2 (006)
**Severity:** CRITICAL
**Category:** DEAD_CODE / DUPLICATION

```
Evidence Chain:
  lib/cli-capture-shared.ts created with 10 shared functions:
    transcriptTimestamp, readJsonl, normalizeToolName, extractTextContent,
    buildSessionTitle, sortAndSliceExchanges, drainPendingPrompts,
    countResponses, parseToolArguments, MAX_EXCHANGES_DEFAULT
  -->
  grep for imports from 'cli-capture-shared': 0 results
  -->
  All 4 CLI capture modules (claude, codex, copilot, gemini)
    still have local copies of these functions
  -->
  ~200 lines x4 = ~800 lines of duplicated code
  -->
  Bug fixes must be applied in 4-5 places
```

---

### 4. Dual Quality Scorer with Incompatible Signatures

**Agents:** CODEX-1 (002), CODEX-A1 (006), CODEX-A2 (008), OPUS-5 (009), OPUS-A5 (002)
**Severity:** HIGH (5 independent confirmations)
**Category:** ARCHITECTURE / TYPE_SAFETY

```
Evidence Chain:
  core/quality-scorer.ts:
    scoreMemoryQuality(content, triggerPhrases, keyTopics, files,
                       observations, sufficiency, hadContamination,
                       contaminationSeverity)  -- 8 positional params
  extractors/quality-scorer.ts:
    scoreMemoryQuality(inputs: QualityInputs)  -- 1 object param, V1-V12 rules
  -->
  core/workflow.ts imports from extractors/ (V2 = production)
  -->
  2 test files still import from core/ (legacy)
  -->
  Tests calibrate against DIFFERENT scoring model than runtime
  -->
  core/ scorer has @deprecated JSDoc but remains exported
```

---

### 5. Three `FileEntry` Type Shapes Across the Codebase

**Agents:** OPUS-5 (003), CODEX-A3 (002)
**Severity:** HIGH
**Category:** NAMING_COLLISION

```
Evidence Chain:
  types/session-types.ts:219-223:
    FileEntry = { FILE_PATH, FILE_NAME?, DESCRIPTION? }
  utils/input-normalizer.ts:55-69:
    FileEntry = { FILE_PATH, DESCRIPTION, ACTION?, MODIFICATION_MAGNITUDE?, ... }
  core/tree-thinning.ts:39-45:
    FileEntry = { path, content }
  -->
  workflow.ts:1635 must cast collectedData to augmented shape
  -->
  workflow.ts:1686-1704 casts into extractor parameter types
  -->
  3 double-casts (as unknown as Record<string, unknown>) at
    input-normalizer.ts:432, 474, 813
```

---

### 6. Circular Dependencies Through core/ Barrel

**Agents:** OPUS-A1 (001-004), OPUS-3 (005, 007)
**Severity:** HIGH
**Category:** CIRCULAR_DEP

```
Evidence Chain:
  lib/semantic-summarizer.ts:14 --> import { CONFIG } from '../core'
  renderers/template-renderer.ts:15 --> import { CONFIG } from '../core'
  spec-folder/folder-detector.ts:22 --> import { CONFIG } from '../core'
  loaders/data-loader.ts:17 --> import { CONFIG } from '../core'
  -->
  core/workflow.ts imports FROM all four of these subsystems
  -->
  4 structural cycles through core/index.ts barrel
  -->
  Work at runtime because CONFIG resolves without back-reference
  -->
  config/ facade already exists and re-exports CONFIG
  -->
  Fix: change '../core' to '../config' in 4 files (~5 min each)
```

---

### 7. Session Targeting Only Works for Claude

**Agents:** CODEX-2 (001), CODEX-A2 (004, 005)
**Severity:** HIGH
**Category:** PARITY

```
Evidence Chain:
  LoadOptions exposes sessionId parameter
  -->
  buildClaudeSessionHints() is the ONLY adapter that uses it
  -->
  Codex: captureCodexConversation(20, projectRoot) -- no sessionId
  Copilot: returns matches[0] (newest by recency)
  Gemini: returns newestMatch (newest by timestamp)
  -->
  Recovery mode with multiple concurrent sessions can bind
    to the WRONG session for Codex/Copilot/Gemini
```

---

### 8. V-Rule Bridge Fail-Open Design

**Agents:** CODEX-A5 (002)
**Severity:** HIGH
**Category:** VALIDATION

```
Evidence Chain:
  mcp_server/handlers/v-rule-bridge.ts:
    loadModule() wraps require() in try/catch
    -->  any load failure: logs "V-rule checks disabled"
    -->  bridge functions return null
  memory-save.ts:410-447:
    only enforces V-rules when vRuleResult is truthy
    -->  broken/missing dist artifact bypasses:
         - hard-block disposition
         - write-skip-index disposition
    -->  Invalid memories can be saved and indexed
```

---

### 9. Tree-Thinning Operates on 500-Character Excerpts

**Agents:** CODEX-A1 (001), CODEX-1 (001)
**Severity:** HIGH
**Category:** LOGIC_ERROR

```
Evidence Chain:
  workflow.ts:679 -- resolveTreeThinningContent():
    readFileSync(candidatePath, 'utf8').slice(0, 500)
  -->
  500-char excerpts passed to applyTreeThinning()
  -->
  applyTreeThinning() classifies via estimateTokenCount(file.content)
  -->
  Medium/large files get underestimated token counts
  -->
  Files incorrectly classified as "tiny" and merged
  -->
  Simultaneous issue: KEY_FILES built from pre-thinning list
    (CODEX-A1-003) so rendered memory advertises collapsed files
```

---

### 10. Concurrent Memory Save Race Condition

**Agents:** CODEX-A5 (003, 004), CODEX-A1 (005)
**Severity:** HIGH
**Category:** RACE_CONDITION / DATA_LOSS

```
Evidence Chain:
  atomicSaveMemory():
    pendingPath = transactionManager.getPendingPath(file_path)
    -->  always returns <base>_pending<ext> (deterministic)
    -->  overlapping saves write to SAME pendingPath
    -->  writeFileSync + delete + renameSync race
    -->  one save can overwrite or delete another's pending file

  Normal save path (separate issue):
    After DB commit, rewrites file with plain writeFile()
    -->  No temp-file + rename semantics
    -->  Crash between DB commit and file write = state divergence
    -->  Only mutex is in-process SPEC_FOLDER_LOCKS map
    -->  Cross-process writers have no protection
```

---

## 5. Cross-Agent Agreement

Findings flagged independently by multiple agents provide the strongest validation signal. The table below tracks convergence on the same underlying issue.

| Issue | Agents Flagging | Agreement Score |
|-------|----------------|-----------------|
| **Dual quality scorer** (incompatible signatures, both run) | CODEX-1, CODEX-A1, CODEX-A2, OPUS-5, OPUS-A5 | **5/20 agents** |
| **Test breakage from removed exports** | OPUS-4 (5 findings), CODEX-A4 (5 findings), CODEX-5 | **3 agent groups** |
| **Stale dist/ artifacts** | OPUS-A4, CODEX-1, OPUS-4 | **3 agent groups** |
| **FileEntry naming collision (3 shapes)** | OPUS-5, CODEX-A3 | **2 agents** |
| **utils/ imports from lib/ (leaf violation)** | OPUS-3, OPUS-A1 | **2 agents** |
| **Circular deps via core/ barrel** | OPUS-3, OPUS-A1 | **2 agents** |
| **heal-ledger-mismatch.sh references deleted script** | OPUS-3, OPUS-4, CODEX-5, OPUS-A4 | **4 agent groups** |
| **Phase numbering drift (011-014)** | OPUS-1, OPUS-2, OPUS-A2, OPUS-A3 | **4 agent groups** |
| **Session targeting parity (Claude only)** | CODEX-2, CODEX-A2 | **2 agents** |
| **ast-parser.ts dangling import (structure-aware-chunker)** | CODEX-3, OPUS-A2 | **2 agents** |
| **Observation naming collision (different shapes)** | OPUS-5, CODEX-A3 | **2 agents** |
| **content-filter ReDoS risk** | CODEX-3 | **1 agent** (unique) |
| **V-rule bridge fail-open** | CODEX-A5 | **1 agent** (unique) |
| **cli-capture-shared never wired** | OPUS-A5, CODEX-2 | **2 agents** |
| **Memory save race condition** | CODEX-A5, CODEX-A1 | **2 agents** |
| **Contamination filter misses normalized title forms** | CODEX-A2 | **1 agent** (unique) |
| **Tree-thinning 500-char truncation** | CODEX-A1, CODEX-1 | **2 agents** |
| **God function (workflow.ts ~1100 lines)** | CODEX-1, OPUS-A1 | **2 agents** |

**Interpretation:** Issues confirmed by 3+ independent agents (dual scorer, test breakage, stale dist, heal-ledger-mismatch ref, phase numbering) should be treated as near-certain. Single-agent findings (ReDoS, V-rule fail-open, contamination filter gaps) are plausible but may warrant manual verification.

---

## 6. Architecture Diagram

### Subsystem Dependency Graph

Source: OPUS-A1 full dependency matrix

```
LAYER 0 (leaf, imports nothing):

  +----------+
  |  types/  |  1 file (session-types.ts)
  +----------+
       ^
       | (type-only imports)
       |
LAYER 1 (leaf utilities):

  +----------+     +----------+
  |  utils/  |     | config/  |   (facade re-exporting core/config.ts)
  |  19 .ts  |     |  1 .ts   |
  +----+-----+     +----+-----+
       |  ^  \*         |
       |  |   \         | (re-exports CONFIG, findActiveSpecsDir, etc.)
       |  |    \        |
LAYER 2 (shared logic):            \* = VIOLATION: 2 re-export shims
                                       from lib/ (phase-classifier,
  +----------+                          memory-frontmatter)
  |   lib/   |
  |  17 .ts  |  <-- No barrel (index.ts)
  +----+-----+
       |  ^
       |  | !CIRCULAR: lib/ imports CONFIG from core/
       |  |            (should use config/ facade)
       |
LAYER 3 (domain modules):

  +--------------+  +---------+  +-------------+  +-----------+  +----------+
  |  core/       |  | extr./  |  | spec-folder/ |  | renderers/|  | loaders/ |
  |  9 .ts       |  | 18 .ts  |  |  5 .ts       |  |  2 .ts    |  |  2 .ts   |
  | (workflow.ts |  |         |  |              |  |           |  |          |
  |  =God module)|  |         |  |              |  |           |  |          |
  +------+-------+  +----+----+  +------+-------+  +-----+-----+  +----+----+
         |               |              |                 |              |
         |               |  !CIRCULAR   |   !CIRCULAR     |  !CIRCULAR   |
         +<------+-------+<-----+-------+<--------+-------+<-----+------+
                 |              |                  |              |
                 +--- all import CONFIG from '../core' ------+
                       (should be from '../config')

LAYER 4 (orchestration + maintenance):

  +----------+    +----------+
  |  memory/ |    |  evals/  |  (self-contained: no scripts/ imports)
  |  8 .ts   |    |  13 .ts  |
  +----------+    +----------+

CROSS-BOUNDARY:

  memory/rebuild-auto-entities.ts --require()--> mcp_server/lib/ (allowlisted, expires 2026-06-15)
  core/workflow.ts --------import-------> @spec-kit/mcp-server/api/providers
  core/memory-indexer.ts ---import-------> @spec-kit/mcp-server/api/search
```

### Circular Dependency Detail

```
CYCLE 1:  core/workflow.ts --> lib/semantic-summarizer.ts --> core/index.ts
CYCLE 2:  core/workflow.ts --> renderers/template-renderer.ts --> core/index.ts
CYCLE 3:  core/workflow.ts --> spec-folder/folder-detector.ts --> core/index.ts
CYCLE 4:  core/workflow.ts --> loaders/data-loader.ts --> core/index.ts

All 4 cycles share the same root cause: subsystems import CONFIG from
the core/ barrel instead of the config/ facade. Fix is mechanical:
change 'from ../core' to 'from ../config' in 4 files.

NEAR-CYCLE:
  core/workflow.ts --> memory/validate-memory-quality.ts
  memory/generate-context.ts --> core/workflow.ts (via indirect import chain)
```

### Import Counts (from OPUS-A1 matrix)

```
                  types  utils  lib   core  config  extr.  spec-f  rend.  loaders  memory
types              -      0      0     0      0       0       0      0       0       0
utils             4T      -     2*     0      0       0       0      0       0       0
lib               2T      7      -    1!      0       0       0      0       0       0
config             0      0      0     1      -       0       0      0       0       0
core              2T      9     10     -      0      10       1      1       1       0
extractors        1T     18      7     0      6       -       1      0       0       0
spec-folder       1T      3      1    2!      0       0       -      0       0       0
renderers          0      1      0    1!      0       0       0      -       0       0
loaders            0      2      0    1!      0       0       0      0       -       0
memory             0      0      1     1      0       1       0      0       1       -

T = type-only, * = re-export shim (violation), ! = structural violation/cycle
```

---

## 7. Technical Debt Inventory

All items below are recommended for **complete deletion** per project policy. No "keep for later" -- delete or replace.

### Category A: Stale Build Artifacts (DELETE)

| Item | Location | Source Status |
|------|----------|--------------|
| `tree-thinning.js` | scripts/core/ | Source .ts exists; JS is stale (threshold 300 vs 150) |
| `tree-thinning.d.ts` | scripts/core/ | Source .ts exists |
| `tree-thinning.js.map` | scripts/core/ | Source .ts exists |
| `tree-thinning.d.ts.map` | scripts/core/ | Source .ts exists |
| `check-architecture-boundaries.js` | scripts/evals/ | Source .ts exists |
| `check-architecture-boundaries.d.ts` | scripts/evals/ | Source .ts exists |
| `check-architecture-boundaries.js.map` | scripts/evals/ | Source .ts exists |
| `check-architecture-boundaries.d.ts.map` | scripts/evals/ | Source .ts exists |
| `run-quality-legacy-remediation.*` (4 files) | scripts/dist/evals/ | Source DELETED |
| `run-chk210-quality-backfill.*.map` (2 files) | scripts/dist/evals/ | Source DELETED |
| `run-phase1-5-shadow-eval.*.map` (2 files) | scripts/dist/evals/ | Source DELETED |
| `run-phase3-telemetry-dashboard.*.map` (2 files) | scripts/dist/evals/ | Source DELETED |
| `structure-aware-chunker.*` (4 files) | scripts/dist/lib/ | Source MOVED to shared/lib/ |

**Note:** Source-tree artifacts under scripts/core/ and scripts/evals/ were already deleted by fix-codex-2. dist/ artifacts remain.

### Category B: Dead Source Files (DELETE)

| Item | Reason | Evidence |
|------|--------|---------|
| `scripts/evals/run-chk210-quality-backfill.ts` | Already deleted in git status | No consumers |
| `scripts/evals/run-phase1-5-shadow-eval.ts` | Already deleted in git status | No consumers |
| `scripts/evals/run-phase3-telemetry-dashboard.ts` | Already deleted in git status | No consumers |
| `scripts/evals/run-quality-legacy-remediation.ts` | Already deleted in git status | No consumers |
| `scripts/memory/historical-memory-remediation.ts` | Already deleted in git status | No consumers |
| `scripts/tests/historical-memory-remediation.vitest.ts` | Already deleted in git status | Tests deleted source |
| `scripts/lib/structure-aware-chunker.ts` | Already deleted; moved to shared/ | No scripts/ consumers |

### Category C: Re-Export Shims (DELETE after import migration)

| Shim File | Canonical Location | Active Importers | Migration Effort |
|-----------|-------------------|------------------|------------------|
| `utils/memory-frontmatter.ts` | `lib/memory-frontmatter.ts` | 1 (`core/workflow.ts`) | ~2 min |
| `utils/phase-classifier.ts` | `lib/phase-classifier.ts` | 2 (`extractors/conversation-extractor.ts`, test) | ~5 min |
| `extractors/session-activity-signal.ts` | `lib/session-activity-signal.ts` | 1 (`tests/auto-detection-fixes.vitest.ts`) | ~2 min |

### Category D: Dead/Unused Exports (REMOVE)

| Export | File | Evidence |
|--------|------|---------|
| `QualityScore` (type) | core/quality-scorer.ts | 0 import sites |
| `generateMergedDescription` | core/tree-thinning.ts | 0 import sites |
| `extractKeyArtifacts` | utils/message-utils.ts | Marked "dead code" in source; barrel-only |
| `ToolCallSummary` (deprecated alias) | types/session-types.ts | Superseded by canonical type |
| `toolCallIndexById` (write-only map) | extractors/gemini-cli-capture.ts:286 | Never read |
| `detect_spec_folder`, `filter_archive_folders` | spec-folder/folder-detector.ts | Snake_case aliases; barrel removed |
| `requireInteractiveMode` | utils/prompt-utils.ts | Removed from barrel, still exported |
| `logAnchorValidation` | utils/validation-utils.ts | Removed from barrel, still exported |

### Category E: Deprecated Code (DELETE or migrate)

| Item | Status | Replacement | Migration Needed |
|------|--------|-------------|------------------|
| `core/quality-scorer.ts` (entire file) | `@deprecated` JSDoc | `extractors/quality-scorer.ts` | 2 test imports |
| Legacy `scoreMemoryQuality` (8-param) | Active in tests only | V2 object-param scorer | Update test calibration |
| `heal-session-ambiguity.sh` | Exits with error unconditionally | None (deprecated runner removed) | Delete or rewrite |
| `heal-telemetry-drift.sh` | Exits with error unconditionally | None (deprecated runner removed) | Delete or rewrite |

### Category F: Dead Shared Module (WIRE IN or DELETE)

| Item | Status | Action |
|------|--------|--------|
| `lib/cli-capture-shared.ts` | 10 functions, 0 importers | Wire into 4 CLI capture modules OR delete |

---

## 8. Agent Performance Comparison: Codex GPT-5.4 vs Opus 4.6

### Quantitative Comparison

| Metric | Codex GPT-5.4 (10 agents) | Opus 4.6 (10 agents) |
|--------|---------------------------|----------------------|
| Total findings | 87 | 100 |
| CRITICAL findings | 0 | 14 |
| HIGH findings | 14 | 38 |
| MEDIUM findings | 37 | 33 |
| LOW findings | 36 | 15 |
| Avg findings/agent | 8.7 | 10.0 |
| Unique issues found (not in other model) | ~12 | ~18 |

### Qualitative Differences

**Codex GPT-5.4 Strengths:**
- **Runtime probing**: Codex agents ran actual code and proved bugs empirically (e.g., CODEX-3 ran `formatOptionBox(opt, true) === formatOptionBox(opt, false)` to prove `isChosen` is unused; CODEX-3 probed `calculateSimilarity()` with real strings to prove false positives)
- **Precise line citations**: Every finding included exact file:line references with quoted code fragments
- **Edge case discovery**: Found subtle input validation gaps (CODEX-3-004: `.alternatives` not checked for array; CODEX-4-003: any JSON accepted as valid empty dataset)
- **Coverage matrix**: CODEX-5 produced the only systematic test coverage gap analysis across all test files
- **Read-only sandbox**: Guaranteed no accidental modifications during audit

**Opus 4.6 Strengths:**
- **Systemic analysis**: Built the complete dependency matrix (OPUS-A1), full phase-by-phase verification table (OPUS-A2), and comprehensive deduplication inventory (OPUS-A5)
- **Higher severity calibration**: Opus agents consistently rated issues at higher severity, particularly identifying CRITICAL-level concerns that Codex rated HIGH or MEDIUM
- **Cross-subsystem reasoning**: Better at tracing impact chains across module boundaries (e.g., OPUS-A4 traced every deleted export through to its barrel, direct importers, and test assertions)
- **Architecture patterns**: OPUS-A1 identified all 4 circular dependencies through systematic import graph analysis; OPUS-A5 found the cli-capture-shared module was entirely unwired
- **Documentation audit**: OPUS-1/2/3 and OPUS-A2/A3 produced the most thorough metadata consistency analysis across 20+ spec folders

**Overlap and Divergence:**

| Domain | Codex Found First | Opus Found First | Both Found |
|--------|-------------------|------------------|------------|
| Logic bugs | 7 | 2 | 3 |
| Architecture | 2 | 8 | 4 |
| Type safety | 4 | 5 | 3 |
| Test gaps | 6 | 1 | 2 |
| Spec alignment | 0 | 12 | 2 |
| Dead code/debt | 3 | 6 | 4 |

**Key Insight:** The models are genuinely complementary. Codex excels at runtime-level bug finding (input validation, edge cases, empirical probing), while Opus excels at structural analysis (dependency graphs, cross-subsystem tracing, metadata consistency). Running both in parallel produces significantly better coverage than either alone.

---

## 9. Limitations and Gaps

### What This Audit Did NOT Cover

1. **MCP Server Handlers (44 files)**: Only CODEX-A5 touched 3 handler files (memory-save, quality-loop, v-rule-bridge). The remaining ~41 handler files were not audited. This is the largest coverage gap.

2. **Shared Package (`@spec-kit/shared/`)**: Cross-package imports were noted but the shared package itself was not audited for internal quality, type safety, or coverage.

3. **dist/ Build Correctness**: The audit identified stale dist/ artifacts but did not verify that the remaining dist/ outputs match their source. A full `tsc` rebuild and diff comparison was not performed.

4. **Runtime Integration Testing**: All agents operated in read-only mode. No agent actually ran the full workflow pipeline end-to-end with test data to verify behavior matches spec claims.

5. **Performance Profiling**: No analysis of execution time, memory usage, or scalability. The content-filter ReDoS risk (CODEX-3-005) is the closest proxy.

6. **Security Audit**: No focused security review. Content-filter ReDoS and the `readJsonSafe` generic cast (CODEX-A3-008) are the only security-adjacent findings.

7. **Configuration Correctness**: `environment_variables.md`, `filters.jsonc`, and other config files were not validated against runtime behavior.

8. **Database Schema/Migration**: SQLite schema, migration history, and data integrity were not examined beyond the TOCTOU orphan cleanup finding.

9. **Template System**: The 50+ template files under `templates/` were not audited for correctness or completeness.

10. **Observability/Logging**: Log output quality, structured logging consistency, and error message helpfulness were not evaluated.

### Potential Blind Spots

- **False negatives from re-export shims**: The audit may undercount consumers of a function if they import through a shim that was checked rather than the canonical source.
- **Dynamic imports**: `require()` calls (3 found) and dynamic `import()` expressions would be missed by static import analysis.
- **Test-only code quality**: Tests were audited for coverage gaps and fixture drift, but not for assertion quality (e.g., whether assertions actually verify meaningful behavior vs. just "it doesn't throw").
- **Cross-package type compatibility**: The audit checked types within `scripts/` but not whether `scripts/` types are compatible with `mcp_server/` or `shared/` type expectations at the package boundary.
- **Undocumented features**: If any behavior is intentionally undocumented (e.g., hidden CLI flags, environment variable overrides), the audit would flag it as a gap when it may be working as intended.

### Recommendations for Future Audits

1. **Dedicated MCP handler audit**: The 44-file handler surface is the most under-examined subsystem. A focused 3-agent audit (handler logic, handler-to-scripts boundary, handler error paths) would close the largest gap.

2. **Integration smoke tests**: Run the actual `generate-context.js` pipeline with known-good input fixtures and verify output against golden files. This would catch behavioral regressions that static analysis misses.

3. **dist/ rebuild gate**: Add a CI step that rebuilds dist/ and fails if the diff is non-empty, preventing stale artifact drift permanently.

4. **Automated cross-agent agreement scoring**: Future multi-agent audits should include a deduplication pass as a built-in step, not just a synthesis artifact.

---

## Appendix: Raw Agent Output Index

| File | Agent | Wave | Scope |
|------|-------|------|-------|
| `codex-1-core-pipeline.md` | CODEX-1 | W1-early | Core pipeline (7 findings) |
| `codex-2-extractors.md` | CODEX-2 | W1-early | Extractor system (6 findings) |
| `codex-3-utils-lib.md` | CODEX-3 | W1-early | Utils/lib (10 findings) |
| `codex-4-memory-system.md` | CODEX-4 | W1-early | Memory system (7 findings) |
| `codex-5-tests-evals.md` | CODEX-5 | W1-early | Tests/evals (9 findings + coverage matrix) |
| `opus-1-phase-tree.md` | OPUS-1 | W1-early | Phase tree consistency (22 findings) |
| `opus-2-spec-alignment.md` | OPUS-2 | W1-early | Spec-to-code alignment (14 findings) |
| `opus-3-architecture.md` | OPUS-3 | W1-early | Architecture boundaries (14 findings) |
| `opus-4-git-diff.md` | OPUS-4 | W1-early | Git diff analysis (26 findings) |
| `opus-5-type-system.md` | OPUS-5 | W1-early | Type system verification (20 findings) |
| `wave1-codex-A1.md` | CODEX-A1 | W1-late | Core pipeline logic (10 findings) |
| `wave1-codex-A2.md` | CODEX-A2 | W1-late | Extractor & JSON-primary flow (10 findings) |
| `wave1-codex-A3.md` | CODEX-A3 | W1-late | Type system & contract safety (14 findings) |
| `wave1-codex-A4.md` | CODEX-A4 | W1-late | Test & eval coverage gaps (9 findings) |
| `wave1-codex-A5.md` | CODEX-A5 | W1-late | Memory system & MCP handlers (5 findings) |
| `wave2-opus-A1.md` | OPUS-A1 | W2 | Architecture boundary analysis (15 findings) |
| `wave2-opus-A2.md` | OPUS-A2 | W2 | Spec-to-code alignment (18 findings) |
| `wave2-opus-A3.md` | OPUS-A3 | W2 | Phase tree & metadata consistency (9 findings) |
| `wave2-opus-A4.md` | OPUS-A4 | W2 | Git diff impact analysis (18 findings) |
| `wave2-opus-A5.md` | OPUS-A5 | W2 | Duplicate code & technical debt (12 findings) |
| `fix-codex-1.md` | Fix agent | Remediation | Test assertion cleanup |
| `fix-codex-2.md` | Fix agent | Remediation | Dead refs, orphaned artifacts |
| `fix-codex-3..5.md` | Fix agents | Remediation | Additional W1-early fixes |
| `fix-wave2-codex-1..10.md` | Fix agents | Remediation | W1 synthesis-directed fixes |
