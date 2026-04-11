---
title: "Phase 018 Resource Map — Index"
version: 2
created: 2026-04-11T18:50:00Z
updated: 2026-04-11T19:10:00Z
authors:
  - cli-codex gpt-5.4 high fast (7 parallel agents — 5 initial + 2 gap-coverage)
  - claude-opus-4-6 (consolidation)
total_rows: 325
total_files: 7
notes:
  - v1 had 143 rows across 5 surfaces (A-E)
  - v2 adds 182 rows across 2 more surfaces (F-G) closing the skill/README coverage gap
---

# Phase 018 Canonical Continuity Refactor — Resource Map

This is the master index of every existing file phase 018 must touch, organized by surface. Full tables with row-level detail live in `scratch/resource-map/*.md`. This document is the quick-reference overlay: headline findings, cross-surface dependencies, priority ordering, and suggested execution order.

---

## 1. Surface Index

| # | Surface | Rows | File (full table) |
|:-:|---|:-:|---|
| A | **Database & Schema** | 10 | [scratch/resource-map/01-schema.md](scratch/resource-map/01-schema.md) |
| B | **MCP Handlers & Save Pipeline** | 31 | [scratch/resource-map/02-handlers.md](scratch/resource-map/02-handlers.md) |
| C | **Scripts, Generator, Core Indexing** | 22 | [scratch/resource-map/03-scripts.md](scratch/resource-map/03-scripts.md) |
| D | **Templates & Validator Rules** | 30 | [scratch/resource-map/04-templates.md](scratch/resource-map/04-templates.md) |
| E | **Commands, Agents, Skills, Docs, Tests, Configs** | 50 | [scratch/resource-map/05-commands-agents-docs.md](scratch/resource-map/05-commands-agents-docs.md) |
| F | **Exhaustive Skill Surface (gap close)** | 71 | [scratch/resource-map/06-skill-surface-exhaustive.md](scratch/resource-map/06-skill-surface-exhaustive.md) |
| G | **Exhaustive Sub-READMEs (gap close)** | 111 | [scratch/resource-map/07-sub-readmes.md](scratch/resource-map/07-sub-readmes.md) |
| — | **TOTAL** | **325** | — |

Each row in the per-surface files has: `path | kind | purpose | phase_018_action | verb | effort | depends_on`.

**Effort legend**: XS (<50 tok) · S (50–300) · M (300–1200) · L (1200–4000) · XL (>4000)

**Verb allowlist**: `rewrite` · `restructure` · `update-logic` · `update-imports` · `add-parameter` · `add-field` · `add-column` · `add-index` · `add-anchor` · `add-frontmatter-field` · `rename` · `deprecate` · `no-change`

---

## 2. Headline Findings (Cross-Surface, Must Know Before Starting)

### F-1 — `memory_index.is_archived` already exists in the live schema
**Surface A.** The phase-018 research assumed adding `is_archived` as a schema delta. **False.** The column is already present in the canonical bootstrap DDL at `mcp_server/lib/search/vector-index-schema.ts` and mirrored in the downgrade path. **Action**: do NOT write a new `ALTER TABLE memory_index ADD COLUMN is_archived`. Only the 155-row archive flip is new. This reduces Gate B schema work by ~50%.

### F-2 — Only one actual schema change: `causal_edges` anchor columns
**Surface A.** The remaining schema delta is adding `source_anchor TEXT`, `target_anchor TEXT` + 2 indexes on `causal_edges`. It threads through 3 downstream storage helpers: `causal-edges.ts` (runtime API), `checkpoints.ts` (snapshot/restore), `reconsolidation.ts` (supersede edges). That's the entire schema work.

### F-3 — Template anchor bugs exist in live spec templates (pre-phase-018 debt)
**Surface D.** `level_3/spec.md` and `level_3+/spec.md` both **close a `metadata` anchor that they never open** (orphan close). Also: `level_3+/spec.md` leaves governance sections unanchored. `handover.md`, `research.md`, `debug-delegation.md`, `changelog/*`, and `sharded/*` are currently **completely anchorless**. Phase 018 must fix these before merge-time writes are safe — otherwise `MERGE_LEGALITY` validator will fail-closed on the first save.

### F-4 — `memory-save.ts` is the single biggest rewrite (XL)
**Surface B.** The 1799-line `memory-save.ts` is the only XL-effort file in the entire map. It splits governance, parse/quality gating, dedup, PE, enrichment, and atomic file save/index orchestration. Phase 018 splits memory-file assumptions from continuity routing, replaces `atomicSaveMemory` with `atomicIndexMemory`, and preserves spec-folder mutex semantics. Everything else is S/M/L.

### F-5 — `nested-changelog.ts` is the canonical read-transform-write pattern to reuse
**Surface C.** The 787-line `scripts/spec-folder/nested-changelog.ts` is the existing implementation of anchor-aware read-transform-write. Phase 018 should model `anchorMergeOperation` after it, not invent a new pattern. Do not duplicate work.

### F-6 — Validator needs new rule set + shell-surface exposure
**Surface C + D.** `validate.sh` today exposes `ANCHORS_VALID`, `PLACEHOLDER_FILLED`, `SECTIONS_PRESENT`, etc. Phase 018 adds **5 new rules**: `FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`. These must be implemented in a new `mcp_server/lib/validation/spec-doc-structure.ts` AND exposed in the shell orchestrator's rule aliases + help text. Both layers required.

### F-7 — Save pipeline: only 2 of 16 stages rewrite, 8 pass-through
**Surface B.** Full pipeline matrix in 02-handlers.md:
- **Rewrite** (2): template contract stage, atomic save (→ `atomicIndexMemory`)
- **Adapt** (6): dedup, sufficiency gating, embedding pipeline, post-insert, reconsolidation-bridge, quality gate
- **Pass-through** (8): governance, preflight, spec-doc health, mutex, markdown evidence, PE orchestration, db-helpers, response builder
- The core concurrency envelope `withSpecFolderLock` in `save/spec-folder-mutex.ts` is `no-change`.

### F-8 — 4 retrieval handlers need restructure, not rewrite
**Surface B.** `memory-search.ts`, `memory-context.ts`, `session-resume.ts`, `session-bootstrap.ts`, `memory-index-discovery.ts` — all 5 need restructure/rewrite (L or M), but they reuse the 4-stage search pipeline, intent classifier, session state, and trigger matcher **unchanged**. Retargeting means changing what's indexed, not how retrieval works.

### F-9 — `is_archived` already exists means fewer thread-throughs
**Surface A.** Because `is_archived` is already in the schema + already honored by the incremental-index + post-insert-metadata helpers, we don't need new code to propagate it. We only need the 155-row archive flip script (Gate B Day 0).

### F-10 — 50 commands/agents/docs/tests/configs need touch
**Surface E.** The widest but shallowest surface: `.opencode/command/memory/*.md`, `.opencode/command/spec_kit/*.md`, workflow YAMLs, `@context` / `@speckit` / `@orchestrate` / `@handover` / `@deep-research` / `@deep-review` agents, CLAUDE.md, AGENTS.md, README, ARCHITECTURE, memory-quality tests, `.mcp.json`. Most are S/M edits aligning docs + tests to the new semantics.

---

## 3. XL/L Priority Table (Must-Rewrite Across All Surfaces)

Pulled from all 5 tables. These are the files that dominate Gate C duration and set the critical path.

| Priority | Effort | Surface | File | Action (verb) |
|:-:|:-:|:-:|---|---|
| **P0** | **XL** | B | `mcp_server/handlers/memory-save.ts` | rewrite |
| **P0** | L | A | `mcp_server/lib/search/vector-index-schema.ts` | add-column (causal_edges anchors) |
| **P0** | L | B | `mcp_server/handlers/memory-search.ts` | restructure |
| **P0** | L | B | `mcp_server/handlers/memory-context.ts` | restructure |
| **P0** | L | B | `mcp_server/handlers/session-resume.ts` | rewrite (resume ladder) |
| **P1** | L | C | `scripts/memory/generate-context.ts` | restructure |
| **P1** | L | D | `templates/level_{1,2,3,3+}/spec.md` + `plan.md` (per level) | add-frontmatter-field (`_memory.continuity`) + fix anchor bugs |
| **P1** | M | B | `mcp_server/handlers/memory-index-discovery.ts` | restructure |
| **P1** | M | B | `mcp_server/handlers/session-bootstrap.ts` | restructure |
| **P1** | M | B | `mcp_server/handlers/save/post-insert.ts` | update-logic |
| **P1** | M | B | `mcp_server/lib/storage/causal-edges.ts` | update-logic |
| **P1** | M | B | `mcp_server/lib/storage/checkpoints.ts` | add-field |
| **P1** | M | B | `mcp_server/lib/storage/reconsolidation.ts` | update-logic |
| **P1** | M | B | `mcp_server/handlers/save/dedup.ts` | update-logic |
| **P1** | M | B | `mcp_server/handlers/save/create-record.ts` | add-field |
| **P1** | M | B | `mcp_server/handlers/causal-links-processor.ts` | restructure |
| **P1** | M | B | `mcp_server/handlers/memory-triggers.ts` | update-logic |
| **P1** | M | B | `mcp_server/lib/validation/save-quality-gate.ts` | update-logic |
| **P1** | M | B | `mcp_server/schemas/tool-input-schemas.ts` | add-field |
| **P1** | M | C | `scripts/spec/validate.sh` + new `lib/validation/spec-doc-structure.ts` | add-rule |

**Everything else** (~120 files) is XS/S — small edits, parameter additions, doc updates, test fixtures, config flags. They fan out behind the P0/P1 core.

---

## 4. Suggested Execution Order (Maps to Gate Plan)

### Gate A — Pre-work (~1 week)
1. **Template anchor-bug fixes** (D): close the orphan `metadata` anchors in `level_3/spec.md`, `level_3+/spec.md`. Add anchors to `handover.md`, `research.md`, `debug-delegation.md`. Anchorless templates (`changelog/*`, `sharded/*`) get a scope decision: either add anchors or exempt from merge/save targets.
2. **Root packet backfill** (already known from iter 016): ~5 root packets missing canonical `implementation-summary.md`.
3. **Embedding health check + SQLite backup + rollback drill** (already known).

### Gate B — Foundation (~2 weeks)
1. **causal_edges schema migration** (A): `ALTER TABLE causal_edges ADD COLUMN source_anchor TEXT; ADD COLUMN target_anchor TEXT;` + 2 indexes. DDL lives in `vector-index-schema.ts`. Optional standalone SQL at `mcp_server/database/migrations/018-002-*.sql`.
2. **Archive flip** (A): `UPDATE memory_index SET is_archived=1 WHERE ...` — 155 rows. No schema change (column already exists).
3. **Ranking update** (B, likely inside `lib/search/stage2-fusion.ts` or similar): archived × 0.3 weight.
4. **Thread anchor columns through storage helpers** (A): `causal-edges.ts`, `checkpoints.ts`, `reconsolidation.ts`.
5. **Metric visibility** (B): `archived_hit_rate` + new save/resume spans from iter 033.

### Gate C — Writer Ready (~2 weeks)
**Main critical path**. Build these 4 components in dependency order:
1. **`spec-doc-structure.ts` validator** (C): new file at `mcp_server/lib/validation/spec-doc-structure.ts`. Add 5 new rules to `validate.sh` rule aliases + help text.
2. **`contentRouter`** (B): new Tier 1/2/3 classifier. Lives in a new file under `handlers/save/` or `lib/routing/`.
3. **`anchorMergeOperation`** (B): new file modeled after `scripts/spec-folder/nested-changelog.ts`. 5 merge modes.
4. **`atomicIndexMemory`** (B): replaces `atomicSaveMemory` at `memory-save.ts:1521`. Reuses `withSpecFolderLock` at L1569 unchanged.
5. **Rewrite `memory-save.ts`** (B, XL): plug in contentRouter + anchorMergeOperation + atomicIndexMemory. Keep 8 pass-through stages.
6. **Rewrite stages 3 + atomic save** (B): template contract and atomic save are the only pipeline-stage rewrites.
7. **Refactor `generate-context.ts`** (C): retarget to write via new routed path. Reference `nested-changelog.ts` pattern.
8. **Add continuity fields to `_memory.continuity` in all level templates** (D): 14 required fields (see 04-templates.md §"New Frontmatter Fields Required"). Max 2KB per block.
9. **Dual-write shadow activation** (B): feature flag state machine from iter 034 (S1 shadow_only state).

### Gate D — Reader Ready (~2 weeks)
1. **Restructure `memory-search.ts`** (B, L): keep pipeline, retarget source assumptions to spec-doc anchors + continuity fallback.
2. **Restructure `memory-context.ts`** (B, L): retarget resume mode; keep other modes intact.
3. **Rewrite `session-resume.ts`** (B, L): new resume ladder (handover → continuity → spec docs → archived).
4. **Restructure `session-bootstrap.ts`** (B, M).
5. **Restructure `memory-index-discovery.ts`** (B, M): promote spec docs, demote `memory/` to archive.
6. **Update `memory-triggers.ts`** (B, M): retarget trigger source from memory-file frontmatter to spec-doc frontmatter `trigger_phrases` field.
7. **13-feature regression suite** (E): implement the test catalog from iter 029 + regression scenarios from iter 025.
8. **Perf benchmarks** (E): exercise iter-027 latency budget with instrumented spans from iter 033.
9. **Start `D0` 2-week observation window** as soon as Gate C dual-write is stable.

### Gate E — Runtime (~3 weeks)
1. **Feature flag flip via state machine** (from iter 034): shadow-only → dual_write_10pct → 50pct → 100pct → canonical.
2. **Update commands** (E): `/memory:save`, `/memory:search`, `/spec_kit:resume` user-facing behavior.
3. **Update agents** (E): `@context`, `@speckit`, `@orchestrate`, `@handover`, `@deep-research`, `@deep-review`.
4. **Update skills** (E): `sk-deep-research`, `sk-deep-review`, `sk-doc`, `sk-git` memory references.
5. **Update top-level docs** (E): CLAUDE.md, AGENTS.md, README, ARCHITECTURE.
6. **Metrics healthy** confirmation via dashboards.

### Gate F — Permanence (~3 weeks)
1. **Observe `archived_hit_rate`** using iter-036 EWMA α=0.1 + weekly seasonality.
2. **Day 180 decision**: retire / keep / investigate per iter-036 ladder.
3. **If retire**: legacy-cleanup state + Option F prep for phase 021.

---

## 5. Dependency Graph (Critical Path Sketch)

```
Gate A:
  Template anchor fixes ─┐
  Root packet backfill ──┼─ Gate A close
  Embedding/backup/drill ┘

Gate B:
  vector-index-schema.ts add-column ─┬─ causal-edges.ts update-logic ─┐
                                     ├─ checkpoints.ts add-field ──────┼─ archive flip ─ Gate B close
                                     └─ reconsolidation.ts update ─────┘

Gate C:
  spec-doc-structure.ts NEW ──┬─ validate.sh rule aliases ──┐
  contentRouter NEW ──────────┤                              │
  anchorMergeOperation NEW ───┼─ memory-save.ts REWRITE ─────┼─ dual-write shadow ─ Gate C close
  atomicIndexMemory NEW ──────┤                              │
  generate-context.ts REFACTOR┘                              │
  Template _memory.continuity fields ────────────────────────┘

Gate D:
  memory-search.ts restructure ─┐
  memory-context.ts restructure ┤
  session-resume.ts rewrite ────┼─ resume p95<500ms, search p95<300ms ─ Gate D close
  session-bootstrap.ts restruct ┤
  memory-index-discovery restruct┘
                                 │
  13-feature regression (D0 obs window runs in parallel)

Gate E:
  feature-flag state machine flips → cmd/agent/skill/doc updates → Gate E close

Gate F:
  archived_hit_rate observation → Day 180 decision → Gate F close
```

---

## 6. Uncertainty Log

From the 5 per-surface audits (see each file's `UNCERTAIN` section for detail):

- **A**: `schema-downgrade.ts` — unclear if downgrade path must mirror causal-edges anchor columns (it currently doesn't rebuild `causal_edges` at all).
- **A**: `incremental-index.ts` — unclear if per-file invalidation handles multi-anchor-per-doc case correctly.
- **B**: 16-stage conceptual model vs actual file count in `handlers/save/` — the stage matrix uses phase-017 conceptual stages, some of which are inlined into `memory-save.ts` rather than separate files.
- **C**: `mcp_server/core/*` path name mismatch — the "core" files named in the impact prompt (`memory-indexer`, `memory-metadata`, `find-predecessor-memory`) may live under a different subdir. Agent C notes the mismatch; worth a 5-minute verify at execute time.
- **D**: `level_3/spec.md` and `level_3+/spec.md` have orphan close anchors — needs fixing in Gate A.
- **D**: `changelog/*.md` and `sharded/*.md` need a scope decision (add anchors + `_memory` block, OR exempt from merge/save target validation).
- **E**: (see per-file uncertainty notes)

---

## 7. Related Documents

- **`implementation-design.md`** — executive summary of the 40-iteration research
- **`research/research.md`** — progressive synthesis
- **`research/iterations/iteration-001.md` through `iteration-040.md`** — the research bedrock
- **`research/iterations/iteration-035.md`** — causal_edges DDL detail
- **`research/iterations/iteration-022.md`** — spec-doc-structure validator detail
- **`research/iterations/iteration-023.md`** — 5 merge modes pseudocode
- **`research/iterations/iteration-034.md`** — feature-flag state machine
- **`research/iterations/iteration-037.md`** — migration dry-run pipeline
- **`research/iterations/iteration-040.md`** — cross-cutting synthesis + phase 019 handover
- **`prompts/research-prompt-impact.md`** — the 5-iteration impact analysis prompt (companion to this resource map; can be run later for deeper row-level effort estimates)

---

## 8. Gap Coverage (v2 — Agents F & G)

After v1 landed, we discovered that Agent E's "skills that REFERENCE memory" scope was too narrow. It only scanned 4 SKILL.md files and missed the skill `references/`, `assets/`, `scripts/` subtrees, plus every sub-README across the repo. Two follow-up agents (F and G) closed the gap.

### 8.1 — Agent F: Exhaustive Skill Surface (71 rows)

Full file: [scratch/resource-map/06-skill-surface-exhaustive.md](scratch/resource-map/06-skill-surface-exhaustive.md)

Grep-based scan across all 20 skills for phase-018 tokens (`memory_save`, `generate-context`, `_memory.continuity`, `atomicSaveMemory`, `withSpecFolderLock`, `is_archived`, `causal_edges`, `/spec_kit:resume`, etc.).

**Per-skill hit density**:

| Skill | Files with hits |
|---|---:|
| `system-spec-kit` | **44** |
| `sk-code-opencode` | 4 |
| `sk-deep-research` | 4 |
| `sk-deep-review` | 4 |
| `cli-claude-code` | 2 |
| `cli-codex` | 2 |
| `cli-copilot` | 2 |
| `cli-gemini` | 2 |
| `sk-doc` | 2 |
| `sk-git` | 2 |
| `mcp-coco-index` | 1 |
| `mcp-code-mode` | 1 |
| `sk-improve-agent` | 1 |

**7 skills are entirely clean** (zero phase-018 touch points): `mcp-chrome-devtools`, `mcp-clickup`, `mcp-figma`, `sk-code-full-stack`, `sk-code-review`, `sk-code-web`, `sk-improve-prompt`.

### 8.2 — The Memory Handback Protocol Blind Spot (HIGH risk)

**All 4 `cli-*` skills teach a Memory Handback Protocol** that shells directly into `generate-context.js`:

- `cli-claude-code/SKILL.md` + `cli-claude-code/assets/prompt_templates.md`
- `cli-codex/SKILL.md` + `cli-codex/assets/prompt_templates.md`
- `cli-copilot/SKILL.md` + `cli-copilot/assets/prompt_templates.md`
- `cli-gemini/SKILL.md` + `cli-gemini/assets/prompt_templates.md`

All 8 files document the same pattern: build structured JSON session context → write to `/tmp/save-context-data.json` → invoke `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]` → run `memory_index_scan`.

**Phase 018 impact**: `generate-context.js` is the main refactor target (surface C). These 8 skill files all need a coordinated update when the new routed save contract lands — either the invocation pattern changes, or the JSON schema expands to carry routing hints, or both. Also, `cli-{codex,gemini,claude-code}/references/agent_delegation.md` bind delegation to `handover.md` and `implementation-summary.md`, so they're continuity-adjacent.

### 8.3 — Inside system-spec-kit: 44 files are hot

Agent F's biggest finding: **system-spec-kit alone has 44 files** with memory/save/resume tokens, well beyond what agents A/B/C/D/E explicitly enumerated. Most are in:

- `scripts/memory/**/*.ts` — phase-018 writer/reader/migration scripts
- `scripts/ops/*.sh` — operator tools
- `scripts/setup/install.sh`
- `scripts/spec-folder/*.ts`
- `scripts/utils/*.ts`
- `shared/**/README.md` and algorithm-level READMEs
- `shared-spaces/README.md`, `constitutional/README.md`
- `templates/README.md`, `templates/memory/README.md`
- `references/memory/*.md`

Phase 018 must touch most of these as small S-effort edits (terminology, link updates, example refresh). The full list is in 06-skill-surface-exhaustive.md.

### 8.4 — Agent G: Exhaustive Sub-READMEs (111 rows)

Full file: [scratch/resource-map/07-sub-readmes.md](scratch/resource-map/07-sub-readmes.md)

Walked every `README.md` under `.opencode/skill/**`, `system-spec-kit/mcp_server/**`, with explicit skips for the ones v1 already covered.

**Headline**: 111 sub-READMEs enumerated. **19 are memory-relevant** (need rewrite or add-section). **92 are doc-parity-only** (no-change or trivial terminology check).

### 8.5 — 19 Memory-Relevant Sub-READMEs Phase 018 Must Rewrite

From Agent G's actionable set:

| # | Path | Area | Update needed |
|:-:|---|---|---|
| 1 | `mcp_server/handlers/save/README.md` | handler | Rewrite save-pipeline narrative for routed canonical continuity |
| 2 | `mcp_server/lib/session/README.md` | lib | Update resume ladder: handover → `_memory.continuity` → spec docs → archived |
| 3 | `system-spec-kit/constitutional/README.md` | system | Clarify always-surface behavior under canonical continuity |
| 4 | `mcp_server/lib/validation/README.md` | lib | Add phase-018 validator invariants (FRONTMATTER_MEMORY_BLOCK, MERGE_LEGALITY, etc.) |
| 5 | `mcp_server/lib/extraction/README.md` | lib | Rewrite memory-creation wording for spec-doc-first writes |
| 6 | `mcp_server/lib/parsing/README.md` | lib | Add canonical anchor identity notes |
| 7 | `system-spec-kit/scripts/loaders/README.md` | system | Update loader docs for continuity + fast resume precedence |
| 8 | `system-spec-kit/templates/memory/README.md` | system | Rewrite generated-context guidance for new save model |
| 9 | `system-spec-kit/shared/scoring/README.md` | system | Refresh folder-ranking notes for continuity |
| 10 | `mcp_server/lib/response/README.md` | lib | Add continuity preview + archived-fallback notes |
| 11 | `mcp_server/README.md` | system | Major doc-parity rewrite (save/search/resume/archived) |
| 12 | `system-spec-kit/scripts/memory/README.md` | system | Rewrite for canonical continuity routing + follow-up indexing |
| 13 | `system-spec-kit/scripts/core/README.md` | system | Update workflow ownership for canonical read/write paths |
| 14 | `mcp_server/lib/scoring/README.md` | lib | Document canonical-anchor preference + archived fallback weighting |
| 15 | `mcp_server/lib/cognitive/README.md` | lib | Refresh lifecycle/decay notes for archive state |
| 16 | `mcp_server/lib/search/README.md` | lib | Rewrite hybrid search doc for canonical spec-doc targeting |
| 17 | `mcp_server/lib/search/pipeline/README.md` | lib | Add reader-pipeline notes for canonical anchor prioritization |
| 18 | `mcp_server/lib/chunking/README.md` | lib | Update anchor-aware chunking docs |
| 19 | `mcp_server/lib/storage/README.md` | lib | Rewrite storage-layer narrative for canonical continuity + archived legacy |

**Effort pattern**: most are S (50–300 tokens) with 2–3 M (300–1200). Total effort across the 19: roughly ~4,000–6,000 tokens of markdown edits. Not a bottleneck for Gate E, but easy to miss if not tracked.

### 8.6 — Missing README Candidates (follow-up opportunities)

Agent G flagged these directories as LACKING a README that phase 018 could add:

- `.opencode/command/` — command-pack index (discovery aid)
- `.opencode/agent/` — agent-pack index (mirrors skill library)
- `mcp_server/database/migrations/` — migration README if phase 018 externalizes SQL files (per iter 037)

These are optional enhancements, not blockers.

### 8.7 — Updated Totals & Effort Distribution

| v1 / v2 | Rows | Memory-relevant | Doc-parity-only | High-effort (L/XL) |
|---|---:|---:|---:|---:|
| v1 (surfaces A–E) | 143 | ~95 | ~48 | 8 |
| v2 (adds F–G) | **+182** | **+90** (71 skill hits + 19 sub-README) | **+92** | 0 new L/XL |
| **Total v2** | **325** | **~185** | **~140** | **8** |

The gap coverage **doubled the mapped surface** but didn't add any new XL files. All new work is distributed across S/M edits. The 8 high-effort files (XL/L) surfaced in v1 remain the critical path.

### 8.8 — What This Changes for Phase 019 Execution

1. **Gate E planning inflates**: the docs/commands/agents/skills gate was ~50 rows in v1. It's now ~160 rows (50 + 71 + 19 memory-relevant + 19 CLI handback files). Still small-effort per file, but the fan-out is real.
2. **CLI-skill handback coordination becomes a Gate C-E cross-cut**: the 8 `cli-*` Memory Handback Protocol files must be updated in lockstep with `generate-context.js`. If the JSON schema changes, all 4 CLI skills need the new schema immediately to avoid external-AI regressions.
3. **No new architectural surprises**: gen 3 research is still converged. No iter-41+ needed.
4. **Impact analysis prompt is still worth running** (`prompts/research-prompt-impact.md`) if you want LOC deltas on the 325 rows.

---

## 9. How This Map Was Built

**v1**: 5 parallel gpt-5.4 high fast agents scanned 5 surfaces (A–E) read-only via cli-codex. ~4 minutes wall clock, 3-wave parallel.

**v2**: 2 additional gpt-5.4 high fast agents (F, G) closed the skill/README coverage gap in parallel. ~3 minutes wall clock.

Each agent cited absolute paths, used the closed verb allowlist, and marked uncertain rows explicitly. This index was consolidated in-session by claude-opus-4-6.

**Next step**: for finer-grained effort estimates (LOC deltas, dependency DAG cycles, test fixture counts), run the companion 5-iteration impact analysis at `prompts/research-prompt-impact.md`.
