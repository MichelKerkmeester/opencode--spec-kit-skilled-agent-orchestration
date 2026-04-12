---
title: "Iteration 008 — Q7 Deep Dive: File-by-file integration impact"
iteration: 8
timestamp: 2026-04-11T13:10:00Z
worker: claude-opus-4-6 (Claude Code session)
scope: q7_integration_impact
status: complete
focus: "Inventory every file that depends on the memory system. Effort estimate per file. Dependency order."
maps_to_questions: [Q7]
---

# Iteration 008 — Q7: Integration Impact Inventory

## Goal

Answer Q7 with a concrete file-level inventory: every command, agent, skill, MCP handler, template, script, doc, and test that depends on memory. For each, effort estimate and dependency order.

## Method

Cross-reference the phase 017 `findings/integration-impact.md` with the earlier Explore-agent results in this session. Group by surface. Assign effort as **XL** (full rewrite, >4000 tokens), **L** (handler-level restructure, 1200-4000 tokens), **M** (multi-function change, 300-1200 tokens), **S** (localized function change, 50-300 tokens), **XS** (import/line edit, <50 tokens).

## Inventory by surface

### Commands (`.opencode/command/`)

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `memory/save.md` | **XL** | rewrite | Central save workflow; must reroute content to spec docs + thin continuity layer |
| `spec_kit/resume.md` | **L** | restructure | "Memory first" recovery ladder changes: handover.md first, spec docs second, continuity third |
| `spec_kit/complete.md` | **L** | restructure | Step 13 (memory save) becomes "route narrative into packet docs" |
| `spec_kit/plan.md` | **M** | update-logic | Context load via memory_context retargets to spec-doc retrieval |
| `spec_kit/implement.md` | **M** | update-logic | Same as plan.md — context load + save path |
| `spec_kit/deep-research.md` | **M** | update-logic | Research findings routed to `research/research.md` instead of memory |
| `spec_kit/deep-review.md` | **M** | update-logic | Same as deep-research |
| `memory/search.md` | **M** | update-logic | Wrapper around `memory_context` — stays mostly intact, target shifts |
| `memory/manage.md` | **S** | update-logic | Stats/list/delete continue to work against the index |
| `memory/learn.md` | **S** | update-logic | Constitutional memory moves to dedicated file path |
| `spec_kit/handover.md` | **S** | update-logic | `handover.md` writes become primary handover path |
| `spec_kit/debug.md` | **XS** | update-imports | Indirect dep |
| `spec_kit/assets/spec_kit_plan_auto.yaml` + `*_confirm.yaml` | **M** | update-logic | Step references to memory_save become spec-doc writes |
| Similar YAML pairs for complete/implement/resume/deep-research/deep-review (12 files) | **M each** | update-logic | Same pattern |

**Commands total**: ~25 files, effort distribution 1 XL + 2 L + 9 M + 5 S + 2 XS + 6 M (YAML) ≈ **~85 M-equivalents**

### Agents (`.opencode/agent/`)

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `context.md` | **XL** | rewrite | Primary memory consumer; "memory first" protocol becomes "spec-docs first with continuity layer fallback" |
| `speckit.md` | **L** | restructure | L1/L2 tool surface shift |
| `orchestrate.md` | **M** | update-logic | Session continuity and prior decisions route through new surfaces |
| `deep-research.md` | **M** | update-logic | Research findings go to research.md |
| `deep-review.md` | **M** | update-logic | Same as deep-research |
| `handover.md` | **M** | update-logic | Primary handover path |
| `ultra-think.md` | **S** | update-logic | PREPARE stage context load retargets |
| `debug.md` / `review.md` / `write.md` / `general.md` | **XS each** | update-imports | Indirect |

**Agents total**: ~11 files ≈ **~25 M-equivalents**

### Skills (`.opencode/skill/`)

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `system-spec-kit/SKILL.md` | **XL** | rewrite | Core memory sections need full rewrite to reflect new architecture |
| `system-spec-kit/references/memory/memory_system.md` | **XL** | rewrite | Architecture reference |
| `system-spec-kit/references/memory/save_workflow.md` | **XL** | rewrite | Save workflow changes completely |
| `system-spec-kit/references/memory/trigger_config.md` | **M** | update-logic | Trigger source retargets to spec-doc frontmatter |
| `system-spec-kit/references/memory/epistemic_vectors.md` | **M** | update-logic | Preflight/postflight become continuity-layer fields |
| `system-spec-kit/references/memory/embedding_resilience.md` | **S** | update-logic | Minor update |
| `system-spec-kit/README.md` | **M** | update-logic | High-level refresh |
| `system-spec-kit/ARCHITECTURE.md` | **L** | restructure | Architecture rewrite |
| `sk-deep-research/SKILL.md` | **M** | update-logic | Research save path update |
| `sk-deep-review/SKILL.md` | **M** | update-logic | Same as deep-research |
| `sk-doc/SKILL.md` | **S** | update-logic | Handover playbook additions |

**Skills total**: ~11 files ≈ **~40 M-equivalents**

### Scripts (`.opencode/skill/system-spec-kit/scripts/`)

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `scripts/memory/generate-context.ts` | **XL** | rewrite | **Central refactor point.** Rewrite to route content into spec doc anchors instead of creating memory files |
| `scripts/memory/backfill-frontmatter.ts` | **L** | restructure | Target shifts |
| `scripts/memory/reindex-embeddings.ts` | **L** | restructure | Target shifts |
| `scripts/memory/rank-memories.ts` | **M** | update-logic | Ranking continues against new targets |
| `scripts/memory/validate-memory-quality.ts` | **L** | restructure | Quality validation for spec-doc writes |
| `scripts/memory/migrate-historical-json-mode-memories.ts` | **XS** | retire | One-time migration, already ran |
| `scripts/memory/migrate-trigger-phrase-residual.ts` | **XS** | retire | Same |
| `scripts/memory/cleanup-orphaned-vectors.ts` | **S** | update-logic | Vector cleanup continues |
| `scripts/memory/rebuild-auto-entities.ts` | **M** | update-logic | Entity extraction retargets |
| `scripts/memory/ast-parser.ts` | **XS** | no-change | Utility |
| `scripts/memory/fix-memory-h1.mjs` | **XS** | retire | One-time fix |

**Scripts total**: ~11 files ≈ **~35 M-equivalents**

### MCP Handlers (`.opencode/skill/system-spec-kit/mcp_server/`)

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `handlers/memory-save.ts` | **XL** | restructure | 16-stage pipeline refactor per iteration 2 (2 stages rewrite, 6 adapt, 8 as-is) |
| `handlers/save/dedup.ts` | **M** | update-logic | UNIQUE constraint + content_hash dedup shift |
| `handlers/save/create-record.ts` | **M** | update-logic | Row insert logic stays; schema adapts |
| `handlers/save/embedding-pipeline.ts` | **XS** | no-change | Content-agnostic |
| `handlers/save/pe-orchestration.ts` | **XS** | no-change | Content-agnostic |
| `handlers/save/reconsolidation-bridge.ts` | **XS** | no-change | Content-agnostic |
| `handlers/save/post-insert.ts` | **M** | update-logic | Causal links parser adapts to spec-doc format |
| `handlers/save/spec-folder-mutex.ts` | **XS** | no-change | Mutex mechanics unchanged |
| `handlers/save/response-builder.ts` | **XS** | no-change | Response shape unchanged |
| `handlers/save/validation-responses.ts` | **M** | update-logic | Rejection responses adapt to new validation |
| `handlers/memory-context.ts` | **L** | restructure | Mode routing retargets to spec-doc + continuity |
| `handlers/memory-search.ts` | **L** | restructure | 4-stage pipeline targets new substrate |
| `handlers/session-resume.ts` | **L** | restructure | First sub-call becomes handover.md read, not memory_context |
| `handlers/session-bootstrap.ts` | **M** | update-logic | Wraps session-resume |
| `handlers/session-health.ts` | **XS** | no-change | Health checks independent |
| `handlers/session-learning.ts` | **S** | update-logic | PREFLIGHT/POSTFLIGHT continuity fields |
| `handlers/memory-triggers.ts` | **M** | update-logic | Source table for trigger cache shifts |
| `handlers/memory-ingest.ts` | **M** | update-logic | Bulk ingest retargets |
| `handlers/memory-crud*.ts` (5 files) | **S each** | update-logic | CRUD continues |
| `handlers/memory-index*.ts` (3 files) | **M each** | update-logic | Indexing retargets |
| `handlers/causal-graph.ts` | **M** | update-logic | Edge endpoints become anchor tuples |
| `handlers/causal-links-processor.ts` | **M** | update-logic | Parser adapts |
| `handlers/checkpoints.ts` | **S** | update-logic | Checkpoint continues |
| `handlers/shared-memory.ts` | **S** | update-logic | Governance continues |
| `handlers/mutation-hooks.ts` | **S** | update-logic | Hooks continue |
| `tools/memory-tools.ts` | **L** | restructure | Tool definition updates |
| `tools/context-tools.ts` | **L** | restructure | Tool definition updates |
| `schemas/tool-input-schemas.ts` | **M** | update-logic | Parameter additions |
| `database/` (schema files) | **M** | update-logic | UNIQUE constraint + document_type fields |
| `lib/cognitive/fsrs-scheduler.ts` | **XS** | no-change | Decay math unchanged |
| `lib/search/intent-classifier.ts` | **XS** | no-change | Query-side |
| `lib/search/session-state.ts` | **S** | update-logic | Dedup key update |
| `lib/validation/save-quality-gate.ts` | **M** | update-logic | Quality gates adapt |
| `lib/storage/causal-edges.ts` | **M** | update-logic | Edge endpoint schema |

**MCP Handlers total**: ~45 files ≈ **~150 M-equivalents**

### Templates (`.opencode/skill/system-spec-kit/templates/`)

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `level_1/implementation-summary.md` | **S** | add-field | Optional memory-metadata frontmatter extension |
| `level_2/implementation-summary.md` | **S** | add-field | Same |
| `level_3/implementation-summary.md` | **S** | add-field | Same |
| `level_3+/implementation-summary.md` | **S** | add-field | Same |
| `level_3/decision-record.md` | **S** | add-field | Same |
| `level_3+/decision-record.md` | **S** | add-field | Same |
| `handover.md` | **M** | restructure | Primary handover target, new anchor structure |
| `research.md` | **S** | add-field | Same |
| `context_template.md` | **L** | deprecate | Current memory template; slim to thin continuity layer or retire |
| Other L1/L2/L3/L3+ templates | **XS each** | no-change | Minor or none |

**Templates total**: ~20 files ≈ **~15 M-equivalents**

### Documentation

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `/CLAUDE.md` | **M** | update-logic | Mandatory tools section refresh |
| `/AGENTS.md` | **M** | update-logic | Gate 1-3 and memory save rule updates |
| `system-spec-kit/README.md` | **M** | update-logic | Core doc refresh |
| `system-spec-kit/ARCHITECTURE.md` | **L** | restructure | Architecture rewrite |
| `mcp_server/README.md` | **M** | update-logic | Handler surface update |
| `mcp_server/INSTALL_GUIDE.md` | **S** | update-logic | Minor |

**Docs total**: ~6 files ≈ **~15 M-equivalents**

### Tests

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `scripts/tests/memory-quality-phase*.test.ts` (6+ files) | **L each** | restructure | Test quality across new save path |
| `mcp_server/test/` (memory-related tests) | **L each** | restructure | Handler tests adapt |
| New tests for wiki-style routing | **M each** | add-new | Required for phase 018 |

**Tests total**: ~15 files ≈ **~50 M-equivalents**

### Configs

| File | Effort | Action | Rationale |
|---|:---:|---|---|
| `.mcp.json` | **XS** | update-imports | Minor tool registration updates |
| `mcp_server/configs/` | **XS** | update-logic | Minor config adjustments |
| `package.json` files | **XS** | update-imports | Dependency review |

**Configs total**: ~3 files ≈ **~3 M-equivalents**

## Aggregate totals

| Surface | File count | M-equivalent effort |
|---|---:|---:|
| Commands | 25 | 85 |
| Agents | 11 | 25 |
| Skills | 11 | 40 |
| Scripts | 11 | 35 |
| MCP Handlers | 45 | 150 |
| Templates | 20 | 15 |
| Documentation | 6 | 15 |
| Tests | 15 | 50 |
| Configs | 3 | 3 |
| **TOTAL** | **147 files** | **~418 M-equivalent** |

If 1 M-equivalent ≈ 1 hour of engineering work with review, **total effort ≈ 52 engineer-days** (about 10 weeks for one engineer, or 4-5 weeks with three engineers working in parallel).

This is a ballpark — phase 018's dedicated impact analysis research (5 iterations) will refine it with line-level precision.

## Dependency order (critical path)

1. **Schema migrations first** (database/, memory_index UNIQUE constraint) — blocks everything else
2. **atomicSaveMemory split** (memory-save.ts, save/create-record.ts, save/dedup.ts) — blocks wiki-style routing
3. **Template contract + memory parser variants** — blocks validation for spec-doc writes
4. **memory_context + memory_search retargeting** — blocks session_resume
5. **session_resume + session_bootstrap** — blocks /spec_kit:resume, @context agent
6. **Commands, agents, workflows** (parallelizable after 5)
7. **Tests** (can start after 2, run in parallel with 3-6)
8. **Docs** (last, once behavior is frozen)

## Findings

- **F8.1**: ~147 files touched across 9 surfaces. ~418 M-equivalent effort (~52 engineer-days).
- **F8.2**: MCP handlers are the largest surface (45 files, 150 M-eq). This matches iteration 2's finding that the save pipeline is the heart of the refactor.
- **F8.3**: Only ~15 files are XL (full rewrite): memory/save.md, context.md, generate-context.ts, memory-save.ts, memory_system.md, save_workflow.md, SKILL.md, and a few others. Most files are S/M (surgical changes).
- **F8.4**: Tests are a significant chunk (50 M-eq, ~12% of total). Phase 018 should budget test work explicitly.
- **F8.5**: The dependency order is schema → handlers → commands/agents → docs/tests. Phase 018 plan.md should encode this sequencing.
- **F8.6**: Phased rollout is essential because the XL files (generate-context.ts, memory-save.ts, context.md) cannot all land in one session. Phase 018 focuses on foundation (schema, save pipeline split), phase 019 does runtime migration (commands, agents), phase 020 does docs/tests cleanup.

## Q7 answer (verified)

The integration impact is wide (~147 files) but tractable (~52 engineer-days for one engineer). Migration is doable across phases 018-020 as a 4-6 week effort with disciplined sequencing. The schema migration is the gate — nothing else can land until the UNIQUE constraint and document_type discrimination are in place.

## What worked

- Effort classification in XS/S/M/L/XL tiers made the totals defensible without requiring line-level accuracy at this stage.
- Cross-referencing with iteration 2's save-pipeline mapping caught the fact that 8 of 16 stages are "as-is" — meaning the save/ subdirectory effort is lower than a naive count suggests.

## What failed / did not work

- Did not enumerate every test file explicitly (just ballpark). Phase 018's 5-iteration impact research will do that precisely.
- The effort-per-file estimates assume seasoned engineers familiar with the codebase. A junior engineer would multiply effort by ~2x.

## Open questions carried forward

- Whether `lib/cognitive/fsrs-scheduler.ts` needs any changes — it's content-agnostic but might be affected by the schema shift. Marked XS/no-change with low confidence; phase 018 should re-verify.
- Exact test rewrite vs. retarget split in `scripts/tests/memory-quality-phase*.test.ts` — phase 018 needs to inspect each file.

## Next focus (for iteration 9)

Q8 synthesis: compile all prior iteration findings into the final recommendation with phased rollout (phase 018 → 019 → 020), risk register, and go/no-go criteria.
