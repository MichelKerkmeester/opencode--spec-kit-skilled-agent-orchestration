---
title: "Phase 018 Resource Map — Commands, Agents, Skills, Docs, Tests, Configs"
surface: commands-agents-docs
agent: resmap-E
worker: cli-codex gpt-5.4 high fast
timestamp: 2026-04-11T14:06:44Z
scan_roots:
  - .opencode/command/
  - .opencode/agent/
  - .claude/agents/
  - .opencode/skill/ (referencing skills only)
  - CLAUDE.md, AGENTS.md, README.md, ARCHITECTURE.md
  - tests/
  - configs/
rows: 50
---

# Phase 018 Resource Map — Commands, Agents, Skills, Docs, Tests, Configs

Scope posture:
- Read-only scan across command surfaces, mirrored agent packs, referencing skills, top-level docs, selected regression tests, and config touchpoints.
- Output intentionally excludes handler/schema/template implementation files owned by other resource-map lanes.
- `ARCHITECTURE.md` was requested as a top-level doc input but is not present at repo root in this checkout.
- No `scripts/tests/memory-quality-phase*.test.ts` files were present at the requested root pattern; the active regression baseline is in `mcp_server/tests/`.

Phase 018 contract distilled from design inputs:
- `/memory:save` becomes routing-transparent, with dry-run or interactive preview and user-visible merge destinations before write.
- `/memory:search` keeps the unified search surface but must expose canonical-spec anchor targeting and an explicit archived-result control aligned with `is_archived`.
- `/spec_kit:resume` moves to a thinner fast-path ladder: `handover.md` -> `_memory.continuity` -> canonical spec docs -> archived legacy memory.
- Rollout and rollback policy adds feature-flag state-machine language plus `archived_hit_rate` and fast-path miss monitoring.

## Resource Table

| # | path | kind | purpose | phase_018_action | verb | effort | depends_on |
|---|---|---|---|---|---|---|---|
| 1 | `.opencode/command/memory/save.md` | command | Canonical operator contract for saving session context | Rewrite black-box save language into routed spec-doc save flow, add `--interactive`/`--dry-run`, and replace memory-file-first framing with routing preview plus continuity update semantics | update | L | save-router |
| 2 | `.opencode/command/memory/search.md` | command | Unified retrieval and analysis surface | Add archived filter wording, retarget `find_spec` and `find_decision` toward canonical spec anchors, and explain how archived legacy rows participate without becoming the default answer | update | M | reader-contract |
| 3 | `.opencode/command/spec_kit/resume.md` | command | Primary resume and crash-recovery entrypoint | Refactor recovery ladder to emphasize fast-path continuity, `session_bootstrap()` first, and canonical spec-doc evidence before archived fallback | update | M | resume-ladder |
| 4 | `.opencode/command/spec_kit/handover.md` | command | Creates handover artifacts later consumed by resume | Clarify that handover is the top resume input, but no longer the only durable continuity surface because `_memory.continuity` and spec-doc anchors now participate | clarify | S | resume-ladder |
| 5 | `.opencode/command/spec_kit/plan.md` | command | Planning workflow doc that borrows memory retrieval for context loading | Update references so planning context examples prefer canonical spec-doc anchors and the new `/memory:search` semantics instead of legacy memory-note language | update | S | reader-contract |
| 6 | `.opencode/command/spec_kit/implement.md` | command | Implementation workflow doc with memory-assisted context pull | Refresh borrowed retrieval wording to reflect canonical anchor lookup and fast resume assumptions when implementation starts from prior packet state | update | S | reader-contract |
| 7 | `.opencode/command/spec_kit/complete.md` | command | End-to-end completion workflow including save hooks | Replace legacy memory-save narrative with routed save language and ensure post-complete save notes point to canonical continuity updates | update | M | save-router |
| 8 | `.opencode/command/spec_kit/deep-research.md` | command | Research workflow wrapper that persists findings and supports resume | Update memory-save companion text to mention routed canonical writes and clarify resume interaction with the continuity ladder | update | S | save-router |
| 9 | `.opencode/command/spec_kit/deep-review.md` | command | Review workflow wrapper with save/resume references | Same as deep-research: refresh saved-context wording and align recovery references with phase-018 resume contract | update | S | save-router |
| 10 | `.opencode/command/create/sk-skill.md` | command | Skill-creation workflow that currently references memory save or index follow-up | Tighten post-create guidance so any save/index note refers to canonical routing and not legacy memory-file assumptions | update | S | save-router |
| 11 | `.opencode/command/create/testing-playbook.md` | command | Testing-playbook creation workflow with memory save follow-up | Align the "save context" helper text with routed save behavior and canonical packet surfaces | update | XS | save-router |
| 12 | `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` | workflow-yaml | Autonomous resume workflow | Replace generic memory recovery with thin fast-path ladder, continuity-aware source labels, and stop-on-first-safe-next-step semantics | update | M | resume-ladder |
| 13 | `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` | workflow-yaml | Interactive resume workflow | Same as auto, plus revise user choices so deeper memory lookup is optional after the canonical fast path is evaluated | update | M | resume-ladder |
| 14 | `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | workflow-yaml | Planning YAML that injects memory lookup and save steps | Update anchor selections and save references so planning reads canonical spec-doc anchors and writes through routed save semantics | update | S | reader-contract |
| 15 | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | workflow-yaml | Autonomous implement YAML with context pull | Adjust borrowed `memory_search` anchor expectations toward canonical spec docs and continuity-derived state | update | S | reader-contract |
| 16 | `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | workflow-yaml | Autonomous completion YAML with final save behavior | Revise memory-save step text to routed save plus continuity update, and ensure completion retrieval examples do not assume legacy `memory/` primacy | update | S | save-router |
| 17 | `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | workflow-yaml | Research-loop workflow with manual save reminders | Update save reminders and failure text to routed canonical save semantics | update | XS | save-router |
| 18 | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | workflow-yaml | Review-loop workflow with manual save reminders | Update save reminders and review resume wording to the same canonical continuity contract | update | XS | save-router |
| 19 | `.opencode/agent/context.md` | agent | Primary retrieval agent contract for all exploration | Change memory-first retrieval description so it explicitly targets canonical spec-doc anchors, archived fallback, and resume fast-path continuity rather than generic memory files | update | M | reader-contract |
| 20 | `.opencode/agent/speckit.md` | agent | Spec-doc specialist with memory rules and save-time notes | Refresh save-time behavior, anchor expectations, and resume references so spec docs are the canonical continuity substrate | update | M | save-router |
| 21 | `.opencode/agent/orchestrate.md` | agent | Orchestration contract that routes resume and memory work | Update command lookup tables, context recovery section, and save-context recommendations to phase-018 semantics | update | M | resume-ladder |
| 22 | `.opencode/agent/handover.md` | agent | Handover writer whose output is top priority for resume | Clarify that handover now feeds a broader continuity ladder rather than being the sole structured continuation artifact | clarify | S | resume-ladder |
| 23 | `.opencode/agent/deep-research.md` | agent | Research leaf agent with memory context and save references | Update memory retrieval and save references to canonical continuity behavior so research packets do not describe legacy retrieval paths | update | S | save-router |
| 24 | `.opencode/agent/deep-review.md` | agent | Review leaf agent with memory context and save references | Same as deep-research: canonicalize save and resume references | update | S | save-router |
| 25 | `.claude/agents/context.md` | agent | Claude-runtime mirror of `@context` | Mirror the same canonical anchor and archived-fallback contract to keep runtime packs aligned | mirror | M | reader-contract |
| 26 | `.claude/agents/speckit.md` | agent | Claude-runtime mirror of `@speckit` | Mirror phase-018 save-time and resume wording to keep runtime packs aligned | mirror | M | save-router |
| 27 | `.claude/agents/orchestrate.md` | agent | Claude-runtime mirror of `@orchestrate` | Mirror updated command tables and recovery wording | mirror | M | resume-ladder |
| 28 | `.claude/agents/handover.md` | agent | Claude-runtime mirror of `@handover` | Mirror broadened continuity-ladder wording | mirror | S | resume-ladder |
| 29 | `.codex/agents/handover.toml` | agent | Codex-runtime handover mirror | Mirror the same handover-as-top-input but not only continuity source language in TOML developer instructions | mirror | S | resume-ladder |
| 30 | `.codex/agents/deep-research.toml` | agent | Codex-runtime research mirror | Mirror updated memory retrieval and save references so Codex leaf behavior matches OpenCode and Claude packs | mirror | S | save-router |
| 31 | `.opencode/skill/sk-deep-research/SKILL.md` | skill-entry | Deep research skill that references memory context, save, and resume | Update memory and resume callouts to canonical continuity, fast resume, and routed save outcomes | update | S | save-router |
| 32 | `.opencode/skill/sk-deep-review/SKILL.md` | skill-entry | Deep review skill that references memory context, save, and resume | Same as sk-deep-research, but framed for review-mode artifacts and convergence | update | S | save-router |
| 33 | `.opencode/skill/sk-doc/SKILL.md` | skill-entry | Documentation specialist that embeds repo governance excerpts including memory workflow | Refresh any embedded command or policy excerpts that still describe legacy `/memory:save` or generic resume behavior | update | S | docs-parity |
| 34 | `.opencode/skill/system-spec-kit/SKILL.md` | skill-entry | Top-level skill and operator source of truth for save, search, and resume | Major contract refresh: save routing transparency, archived search controls, canonical spec-doc indexing, and bootstrap-first resume fast path | update | L | docs-parity |
| 35 | `CLAUDE.md` | doc | Root operator rules for all runtimes | Update Common Workflows, Context Recovery, and MEMORY SAVE RULE to reflect `/spec_kit:resume` fast path and routed `/memory:save` behavior | update | M | docs-parity |
| 36 | `.claude/CLAUDE.md` | doc | Claude-specific recovery overlay | Adjust hook-aware recovery wording so injected context composes with the new canonical resume ladder instead of the older generic memory flow | update | XS | resume-ladder |
| 37 | `AGENTS.md` | doc | Root guardrail doc used by all audit and implementation agents | Update Common Workflows table, Session Start & Recovery, and MEMORY SAVE RULE language to phase-018 semantics | update | M | docs-parity |
| 38 | `README.md` | doc | Top-level repo-facing product description and usage guide | Refresh public descriptions of save, search, resume, startup surfaces, and canonical spec-doc continuity so public docs match new behavior | update | M | docs-parity |
| 39 | `.opencode/skill/system-spec-kit/README.md` | doc | User-facing system-spec-kit guide and quick-start | Update quick-start, feature descriptions, and usage examples for routed save, canonical anchor retrieval, archived fallback, and resume fast path | update | M | docs-parity |
| 40 | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | doc | MCP installation and operator usage guide | Update operator examples and tool descriptions so `memory_context`, `memory_search`, and `session_bootstrap` reflect canonical continuity behavior and archived controls | update | M | docs-parity |
| 41 | `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts` | test | Regression guard for `session_bootstrap()` payload shape | Extend to cover fast-path continuity hints and any new bootstrap messaging that explains canonical resume vs fuller follow-up recovery | extend | M | phase-018-tests |
| 42 | `.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts` | test | Legacy continuation placeholder suite | Migrate or retire legacy `CONTINUE_SESSION` assumptions; replace with phase-018 resume-fast-path coverage where behavior survives | split | M | phase-018-tests |
| 43 | `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | test | Save-handler regression suite | Add phase-018 cases for routing preview, continuity update bookkeeping, rollback messaging, and canonical target validation | extend | L | phase-018-tests |
| 44 | `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` | test | Search-handler regression suite | Add explicit `is_archived` filtering, canonical spec-anchor ranking, and archived fallback behavior coverage | extend | L | phase-018-tests |
| 45 | `.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts` | test | Regression baseline for spec-doc typing, scoring, and intent routing | Keep as foundational baseline, then layer phase-018 assertions for canonical spec-doc dominance over archived legacy rows | extend | M | phase-018-tests |
| 46 | `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts` | test | Anchor extraction and enrichment baseline | Keep existing parser coverage and add only if new continuity anchors or routing previews depend on richer anchor metadata | verify | S | phase-018-tests |
| 47 | `.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts` | test | Docs-to-feature-flag parity test | Extend for phase-018 rollout flags, state-machine documentation, and `archived_hit_rate` references once names are finalized | extend | M | flag-contract |
| 48 | `.mcp.json` | config | Checked-in MCP startup config and env defaults | Add any phase-018 rollout env flags only if the reader or writer cutover is exposed through checked-in runtime defaults; otherwise leave stable and document externally | gate | S | flag-contract |
| 49 | `.opencode/skill/system-spec-kit/mcp_server/configs/README.md` | config | Human-readable config and runtime-source-of-truth notes | Document any new phase-018 feature flags or state-machine references once real config owners decide whether they live in env or DB-backed control-plane state | update | S | flag-contract |
| 50 | `.opencode/skill/system-spec-kit/mcp_server/package.json` | config | MCP server package metadata and test scripts | Add phase-018-specific vitest entrypoint or grouped regression script so the new canonical continuity suite is easy to run in isolation | update | S | phase-018-tests |

## Command × Workflow Impact Matrix

| surface | current role | phase 018 visible delta | likely docs/workflow touchpoints |
|---|---|---|---|
| `/memory:save` | Save current session context into memory | Becomes routing-transparent, optionally interactive, and visibly writes into canonical spec-doc or continuity targets instead of looking like a hidden memory-note dump | `memory/save.md`, `complete.md`, `deep-research.md`, `deep-review.md`, `spec_kit_*` save steps, root docs |
| `/memory:search` | Unified retrieval plus analysis surface | Needs explicit archived-result control, canonical spec-anchor targeting for `find_spec` and `find_decision`, and wording that archived rows are fallback support rather than the primary answer source | `memory/search.md`, plan/implement YAMLs, context agents, README surfaces |
| `/spec_kit:resume` | Standard continuation and crash recovery | Adopts fast-path ladder: handover first, then bootstrap or resume-mode context, then canonical spec docs, then archived legacy memory; should promise the smallest safe recovery packet | `resume.md`, resume YAMLs, handover docs, agent recovery sections, root docs |
| `/spec_kit:handover` | Session handoff creation | Still creates the highest-priority resume input, but now sits inside a broader continuity substrate rather than owning all durable continuity alone | `handover.md`, `@handover` docs, resume docs |
| `/spec_kit:plan` | Planning workflow with memory-assisted context load | Retrieval language should point at canonical spec anchors and updated `/memory:search` behavior, not generic legacy memory lookup | `plan.md`, `spec_kit_plan_confirm.yaml`, root docs |
| `/spec_kit:implement` | Implementation workflow with context pull | Same retrieval update as planning; examples should assume canonical prior packet state | `implement.md`, `spec_kit_implement_auto.yaml` |
| `/spec_kit:complete` | Completion workflow with final save and validation | Save companion text must match routed save semantics and continuity updates | `complete.md`, `spec_kit_complete_auto.yaml`, root docs |
| `/spec_kit:deep-research` | Iterative research with optional memory save at end | Save reminders and resume references should reflect routed save into canonical surfaces | command doc, auto or confirm YAML, deep-research agent or skill |
| `/spec_kit:deep-review` | Iterative review with optional memory save at end | Same as deep-research, but review packet wording should stay read-only and canonical-continuity aware | command doc, YAML, deep-review agent or skill |

## Agent Contract Delta

Primary contract shifts:
- `@context`: retrieval contract changes the most. It should describe canonical spec-doc and continuity anchor retrieval as the default target class, with archived rows treated as fallback support and not the starting assumption.
- `@speckit`: save-time notes and memory rules need to stop describing `memory/` markdown as the primary durable substrate. The spec docs and `_memory.continuity` become the continuity home, while generated memory artifacts become supporting or archived surfaces.
- `@orchestrate`: command recommendations and recovery playbooks must point to the thinner resume ladder and routed save behavior so orchestration prompts stay aligned.
- `@handover`: semantic change is smaller. Handover stays top priority, but the contract should acknowledge it is the first rung in a ladder, not the full continuity stack.
- `@deep-research`: update save and resume references, especially any text that implies session continuity is recovered only from prior memory files.
- `@deep-review`: same as `@deep-research`, but keep the read-only audit framing and avoid implying that review iterations mutate continuity directly.

Mirror expectations:
- `.claude/agents/*` must stay text-parity aligned for `@context`, `@speckit`, `@orchestrate`, and `@handover`.
- `.codex/agents/*.toml` mirrors should receive the same contract changes inside `developer_instructions`, at least for `handover` and `deep-research` where memory or resume behavior is explicitly documented.

No-contract-change candidates:
- `@review`, `@debug`, and `@write` mention memory or context loading, but they do not appear to be the primary phase-018 operator-contract surfaces in this lane.

## Skill Reference Delta

The four referencing skills:
- `sk-deep-research`: update the sections that tell operators or command runners how saved research context lands and how resume state is recovered. Replace legacy memory-first narrative with canonical continuity plus archived fallback.
- `sk-deep-review`: same update pattern as deep-research, but anchored to review packet artifacts and review-loop continuation.
- `sk-doc`: refresh any embedded workflow excerpts copied from `AGENTS.md` or root policy docs so documentation generation does not perpetuate stale save or resume language.
- `sk-git`: no strong direct memory surface showed up in this scan. Treat as "verify only" unless a later parity sweep finds command examples or finish-work text that mentions `/memory:save` or `/spec_kit:resume`.

Top-level skill note:
- `system-spec-kit/SKILL.md` is not just a referencing skill. It is the behavioral source of truth for save, search, startup, and resume. This file likely needs the largest single documentation rewrite in this lane.

## Doc Update Inventory

Root docs:
- `CLAUDE.md`
  - Common Workflows table
  - Context Recovery section
  - MEMORY SAVE RULE
  - Any prose that still frames `/memory:save` as writing memory files first
- `.claude/CLAUDE.md`
  - Hook-aware recovery notes
  - Root-doc delegation language, so the Claude overlay does not preserve obsolete recovery steps
- `AGENTS.md`
  - Session Start & Recovery
  - Quick Reference: Common Workflows
  - MEMORY SAVE RULE
  - Any root wording about `/spec_kit:resume` and save-context expectations
- `README.md`
  - Overview memory-engine framing
  - Quick Start continuity claims
  - Feature descriptions for memory, startup, and session tools
  - FAQ entries that explain how save and recovery work

System-spec-kit docs:
- `.opencode/skill/system-spec-kit/README.md`
  - Save Context
  - Resume Work
  - Command tables
  - Structure or narrative sections that explain how continuity is stored
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
  - Tool summaries for `memory_context`, `memory_search`, `memory_save`, `session_bootstrap`, `session_resume`
  - Resume examples
  - Troubleshooting for save, search, and startup surfaces

Absent file:
- `ARCHITECTURE.md`
  - Not present at repo root in this checkout
  - Needs confirmation whether phase 018 expects a new file, a renamed file, or no change

## Test Disposition Matrix

| test surface | keep as-is | extend in place | migrate or retire | phase-018-specific note |
|---|---|---|---|---|
| `session-bootstrap.vitest.ts` | no | yes | no | Add assertions for canonical fast-path hints and recovery-source messaging |
| `continue-session.vitest.ts` | no | partial | yes | Legacy `CONTINUE_SESSION` placeholders should shrink or move behind compatibility-only coverage |
| `handler-memory-save.vitest.ts` | no | yes | no | Main home for routing preview, continuity update, rollback, and target-validation cases |
| `handler-memory-search.vitest.ts` | no | yes | no | Main home for `is_archived`, canonical spec-anchor ranking, and archived fallback |
| `full-spec-doc-indexing.vitest.ts` | yes | yes | no | Keep as baseline; add canonical-over-archived assertions rather than replacing it |
| `anchor-metadata.vitest.ts` | yes | maybe | no | Extend only if continuity routing depends on new anchor classes or metadata fields |
| `feature-flag-reference-docs.vitest.ts` | no | yes | no | Add rollout state-machine or flag-doc parity once names are concrete |

Recommended phase-018-specific suite split:
- Add one targeted suite for save behavior, likely a dedicated `phase-018-memory-save-routing.vitest.ts`.
- Add one targeted suite for search or resume behavior, likely a `phase-018-canonical-recovery.vitest.ts` or similarly named reader-contract suite.
- Keep baseline suites intact so phase-018-specific tests do not erase pre-existing regression coverage.

Missing test family noted by request:
- No `scripts/tests/memory-quality-phase*.test.ts` files were found at the requested root path.
- If phase 018 expects a "phase-018-specific suite" under that naming pattern, it will need to be added rather than updated in place.

## Config Delta

Likely config or rollout needs:
- A checked-in runtime default is only warranted if phase 018 wants the new reader or writer behavior enabled in repo-local defaults. Otherwise keep `.mcp.json` stable and rely on docs plus DB-backed rollout control.
- The design research strongly points toward DB-backed rollout state, not pure env-var gating, for the shadow-only -> dual-write -> canonical machine. That suggests docs and runtime helpers may change more than static config files do.
- `archived_hit_rate` is the key permanence metric named in design research; if exposed via feature flags or dashboard controls, its documentation needs a parity test and catalog row.
- `mcp_server/package.json` is the cleanest place to wire one or more phase-018 regression test scripts.
- `configs/README.md` should document new env flags only after the owning lane finalizes whether phase-018 control lives in env, config JSON, or the proposed SQLite control-plane table.

Flag candidates to watch for in later lanes:
- writer shadow or dual-write enablement
- reader canonical default enablement
- archived fallback exposure or weighting
- rollout bucket percentage
- rollback freeze or incident latch controls

## Coverage Notes

Scanned but not promoted into the 50-row map:
- `.opencode/command/doctor/*.md` did not show direct memory save, search, or resume contract text in the scoped grep pass.
- `create/changelog.md` mentions `/memory:save`, but only as a generic post-release helper; it looks weaker than the higher-signal create-command surfaces already mapped.
- `create/folder_readme.md` also references `/memory:save`, but its memory text appears downstream of broader documentation scaffolding and looks secondary for phase 018.
- `.claude/agents/deep-research.md` and `.claude/agents/deep-review.md` mirror OpenCode agent wording closely; I treated the OpenCode source rows plus the core Claude mirror rows as sufficient for packet-level planning.
- Additional `.codex/agents/*.toml` files exist, but only `handover` and `deep-research` showed direct phase-relevant memory or resume wording during the scoped scan.
- Root `package.json` has no test scripts or runtime env defaults today, so it looks less likely to carry phase-018-specific changes than `mcp_server/package.json`.
- `.opencode/skill/system-spec-kit/mcp_server/README.md` was requested in scope, but the higher-signal operator-facing deltas landed more clearly in `system-spec-kit/README.md` and `mcp_server/INSTALL_GUIDE.md`.
- No `scripts/tests/memory-quality-phase*.test.ts` files were present in the requested root pattern; that absence is captured in the table notes and uncertainty list rather than as a standalone row.

Scan emphasis choices:
- Kept the table wide and shallow by selecting the files where operator-visible wording or explicit regression hooks already exist.
- Avoided rows for handler, schema, template, and implementation files because those are assigned to other resource-map lanes.
- Treated mirrored agent packs as parity obligations, not independent design surfaces, unless the mirror contained runtime-specific recovery wording.

## Dependency Key

Dependency labels used in the table:
- `save-router`: phase-018 writer-side behavior for routing transparency, target selection, continuity updates, and save rollback messaging.
- `reader-contract`: phase-018 search-side behavior for canonical spec-doc anchor targeting, archived-result handling, and updated retrieval framing.
- `resume-ladder`: phase-018 continuation contract for fast-path resume ordering and recovery-source precedence.
- `docs-parity`: required wording sync across top-level docs, skill docs, and runtime overlays once the canonical UX is finalized.
- `phase-018-tests`: new or extended regression coverage that locks the reader and writer contracts before rollout.
- `flag-contract`: rollout-state-machine and documentation parity work once the final control-plane naming is settled.

## UNCERTAIN

- `ARCHITECTURE.md` does not exist at repo root. I could not map any phase-018 doc work there from this checkout alone.
- No `.opencode/command/doctor/*.md` files surfaced as direct memory-contract touchpoints in this lane, despite being in the allowed scan scope.
- `create/folder_readme.md` and `create/changelog.md` reference `/memory:save` indirectly in broader creation workflows, but they look secondary compared with `create/sk-skill.md` and `create/testing-playbook.md`.
- `.codex/agents/*.toml` may have additional mirrored files beyond `handover` and `deep-research`, but only those two showed direct, phase-relevant memory or resume wording in this scoped scan.
- The exact name and storage location of any new phase-018 rollout flags are not finalized in the design notes I read. Iteration 034 leans toward a SQLite control-plane table instead of env-only gating.
- The request mentions a new `is_archived` filter for `/memory:search`, but the current command docs still expose `includeArchived` and state-based filtering terminology. Final naming may require a coordinated rename across docs and tests.
- The request mentions "spec-doc anchors" for `/memory:search`, while current docs use intent-anchor bundles like `spec-doc`, `decisions`, `architecture`, and `overview`. Final contract may distinguish canonical target class from literal anchor IDs.
- The phase-018-specific regression suite location is not yet defined in checked-in test scripts. It could live under `mcp_server/tests/` rather than the absent `scripts/tests/memory-quality-phase*.test.ts` pattern.
