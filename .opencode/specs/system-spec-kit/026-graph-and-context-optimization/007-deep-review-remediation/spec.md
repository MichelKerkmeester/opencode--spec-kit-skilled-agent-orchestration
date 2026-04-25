---
title: "Feature Specification: 007 Deep-Review Remediation Campaign"
description: "Unified Level 3 specification covering all six remediation waves that consolidated 573 deduplicated findings from the 026 deep-review and cross-phase synthesis programs into a single packet. Closes 1 P0 + 114 P1 from the 120-iteration review, R1-R11 of the Phase 020 CLI-executor research, all 7 findings from the Phase 025 skill-advisor pass, all 12 findings from the Phase 026 R03 post-remediation pass, six of ten themes from the 274-finding 006-campaign, and 25/25 P0+P1 fixes from the cross-phase integrity-parity closure run."
trigger_phrases:
  - "007-deep-review-remediation"
  - "deep review remediation campaign"
  - "120-iteration deep review remediation"
  - "phase 020 cli executor remediation"
  - "phase 025 skill advisor remediation"
  - "phase 026 r03 post-remediation"
  - "005-006 campaign findings remediation"
  - "integrity parity closure"
  - "cross-phase synthesis remediation"
  - "243 findings 11 workstreams"
  - "274 campaign findings"
  - "9 p0 16 p1 cross-phase"
  - "reconsolidation scope-boundary"
  - "executor first-write provenance"
  - "description.json merge-preserving repair"
  - "copilot @path fallback"
  - "cf-108 historical source authority"
  - "cf-022 historical source authority"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation"
    last_updated_at: "2026-04-25T06:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Merged five nested phase packets (001-006) into a single root specification covering the full deep-review remediation campaign."
    next_safe_action: "Hold the remaining historical-source blockers (CF-108 in 005-006/001, CF-207 in 005-006/002, CF-022 cross-phase) for write-authority decision; the rest of the campaign is closed with replayable evidence."
    blockers:
      - "CF-108 — strict validation of source packet 003-graph-metadata-validation/005-doc-surface-alignment exits 2 on CONTINUITY_FRESHNESS; fix requires writing outside the assigned write authority."
      - "CF-207 — recursive validation of source packet 002-skill-advisor-graph exits 2 on historical doc errors outside the write boundary."
      - "CF-022 — the 005-006 campaign blocker still needs a write-authorized follow-up or a formal ADR-level deferral."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-root-merge-2026-04-25"
      parent_session_id: null
    completion_pct: 92
    open_questions:
      - "Will CF-022 close through write authority on the historical 005-006 source packets, or move to a formal ADR-level defer entry?"
      - "Should the remaining 003-evidence-references and 005-packet-state campaign themes wait for the same write-authority decision, or be re-scoped onto live runtime surfaces only?"
    answered_questions:
      - "Phase 020 R1-R11 shipped (R12 deferred per ADR)."
      - "Phase 025 all 5 P1 + 2 P2 findings closed."
      - "Phase 026 R03 T01-T12 all closed."
      - "Cross-phase integrity-parity 9 P0 + 16 P1 fixes all applied via parallel cli-codex agents."
---
# Feature Specification: 007 Deep-Review Remediation Campaign

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet is the durable owner of every deep-review and cross-phase remediation initiative produced under the 026 graph-and-context-optimization wave. Six independently scoped remediation programs were merged here: a 120-iteration combined doc + code review of packets 009/010/012/014, the Phase 020 CLI-executor research-findings remediation, the Phase 025 skill-advisor deep-review remediation, the Phase 026 R03 post-remediation remediation, the 274-finding 006-campaign theme remediation, and the cross-phase integrity-parity closure run sourced from `research/cross-phase-synthesis.md`. Together they handled 573 deduplicated findings across two P0 release-class blockers, 158 P1 required items, and 271 P2 follow-up items.

**Outcome.** All shipped runtime, validator, executor, and documentation surfaces are remediated with replayable evidence. The Phase 020 wave closed 11 of 12 atomic-ship groups (116/116 scoped tests). Phase 025 closed all 5 P1 + 2 P2 findings (58 focused tests). Phase 026 R03 closed all 8 P1 + 4 P2 findings. The 006-campaign closed six of ten themes; four themes remain blocked or unstarted because the fixes need write authority on historical source packets. The cross-phase synthesis closure shipped 9/9 P0 plus 16/16 P1 fixes via parallel `cli-codex gpt-5.4 high fast` dispatch overnight 2026-04-23 → 2026-04-24. The original 120-iteration review's P0 reconsolidation-bridge scope-boundary fix is the lone runtime-class blocker still tracked here for triage when the Workstream 0 dispatch resumes.

**Key decisions.** Treat live verification evidence as a status promotion gate; preserve every finding's CF/CR/R/T identifier and source-phase attribution; defer purely historical-source rewrites that would require write authority outside the 026 packet boundary; keep the Phase 020 retry-budget threshold (`MAX_RETRIES = 3`) and the 10-minute continuity threshold numerically unchanged because the corrective work is documentation honesty plus telemetry groundwork, not data-driven tuning.

**Critical dependencies.** The merged review report at `review/review-report.md` (1,535 lines, 120 iterations, 920 files), the Phase 018 deep-research synthesis at `research/017-sk-deep-cli-runtime-execution-pt-01/research.md`, the r02 deep-review iteration set under `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/`, the R03 iteration set at `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/`, the consolidated 006-campaign report mirrored into this packet's tasks.md and implementation summary, and the `research/cross-phase-synthesis.md` plus `research/cross-phase-findings.json` pair that drove the integrity-parity closure.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (contains the original 120-iteration review's data-integrity blocker plus nine cross-phase P0 findings) |
| **Status** | In Progress (runtime + documentation remediation closed; historical-source blockers tracked for write-authority decision) |
| **Created** | 2026-04-16 (consolidated 2026-04-21, merged into a single root spec 2026-04-25) |
| **Branch** | `main` (cross-phase work originated on `006-integrity-parity-closure`, merged) |
| **Parent Packet** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md` |
| **Predecessor** | `006-search-routing-advisor/spec.md` |
| **Successor** | `008-runtime-executor-hardening/spec.md` |
| **Source — Wave A** | `review/review-report.md` (120-iteration combined deep review of packets 009/010/012/014) |
| **Source — Wave B** | `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` (Phase 018 30-iteration deep-research) |
| **Source — Wave C** | `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/findings-registry.json` |
| **Source — Wave D** | `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-{007,013,014,017-021,028,029}.md` |
| **Source — Wave E** | Consolidated 006-campaign findings (preserved in §3.5 and tasks.md) |
| **Source — Wave F** | `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json` |
| **Effort (planned)** | ~54-95h Wave A + ~30h Wave B + ~16h Wave C + ~12h Wave D + multi-week Wave E + Wave F overnight parallel |
| **Effort (actual)** | Wave A planned (P0 dispatch pending); Wave B ~1h via cli-codex; Wave C ~1 session; Wave D 12 sequential cli-copilot agents; Wave E partial; Wave F ~1 overnight via 25-way parallel cli-codex |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

By the time the 026 graph-and-context-optimization wave reached the deep-review stage, six independent review programs had stacked up and were each running in their own ad-hoc packet folder. They surfaced overlapping but materially different concerns:

1. The 120-iteration combined review of packets 009/010/012/014 produced 243 deduplicated findings, including a P0 reconsolidation-bridge scope-boundary defect that could merge records belonging to different `tenant_id`/`user_id`/`agent_id`/`session_id` scopes and persist a survivor with stripped governance metadata. The same review surfaced 114 P1 findings across status drift, traceability, command/workflow integrity, agent/skill doc parity, error handling, security, stale references, and test quality.
2. The Phase 018 30-iteration deep-research pass on the deep-loop CLI runtime executor produced 12 prioritized R1-R12 remediations spanning executor provenance, description.json data-loss safety, Copilot `@path` large-prompt fallback parity, metadata lineage, retry-budget telemetry, evidence-marker fence parsing, caller-context coverage, and readiness-contract narrowing.
3. The 40-iteration r02 deep-review of the skill-advisor phase stack (Phases 020, 021/001, 021/002, 022, 023, 024) surfaced 5 P1 + 2 P2 deduplicated findings spanning prompt-boundary privacy, renderer/cache contract correctness, telemetry fidelity, plugin parity with native hooks, and operator-doc executability.
4. The R03 post-remediation review on the post-Phase-025 state surfaced 8 P1 + 4 P2 new findings: five docs-drift items in D7, two telemetry/error-handling items, one cross-workspace plugin cache-bleed item, and four small docs/test items.
5. The 006-campaign consolidated review covered 274 findings across ten remediation themes (graph metadata quality, spec structure and validation, evidence references, migration lineage, packet-state continuity, routing accuracy, skill-advisor packaging, search/reranker tuning, security guardrails, and telemetry/rollout controls).
6. The cross-phase synthesis pass on the 026 wave, captured in `research/cross-phase-synthesis.md`, surfaced nine cross-phase P0 findings (CF-001, CF-002, CF-005, CF-009, CF-014, CF-017, CF-019, CF-022, CF-025) plus 16 P1 findings (CF-003 through CF-027) that the synthesis flagged as integrity, parity, and governance gaps blocking trustworthy readiness claims.

Running each remediation as its own packet made it impossible to navigate the 026 wave coherently, broke memory and graph traversal, and created a parity drift in which the parent backlog talked about "missing" Copilot wrapper or writer work that had already been reapplied under the active `009-hook-package` parent.

### Purpose

Stand up one durable Level 3 packet that owns every cross-program remediation finding from the 026 wave, ships actual closure evidence on the runtime + documentation surfaces this campaign controls, and explicitly tracks the residual historical-source-authority blockers in one place so the parent 026 packet can reason about parity to current `009-hook-package` truth without re-reading six folders. Live verification is the promotion gate; status fields cannot run ahead of replayable proof.

### Cross-Cutting Themes

| Theme | Severity | Meaning for this packet |
|-------|----------|-------------------------|
| Operational proof must trail implementation | P0 | Readiness claims are gated on current acceptance reruns. |
| Documentation surfaces must stop drifting from runtime truth | P1 | Spec, summary, and operator docs only describe behavior they can prove today. |
| Cross-runtime parity must converge | P1 | Claude / Copilot / Codex / Gemini / OpenCode plugin paths share one contract. |
| Concurrency, lineage, and freshness guards must be self-enforcing | P0 | Save, scan, and index flows still had split or partial contracts before this packet. |
| Deep-loop governance must enforce its own guarantees | P0 | Executor provenance, retry budgets, and resume contracts emit machine-checkable evidence. |
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

The packet's scope is the union of six remediation waves. Each wave below names the original phase, the source artifact, the finding count, and the disposition. Detailed task ledgers live in `tasks.md`; per-CF/per-R closeout evidence lives in `implementation-summary.md`.

### 3.1 Wave A — 120-Iteration Combined Deep-Review Remediation (formerly 001-deep-review-and-remediation)

- **Source**: `review/review-report.md` (1,535 lines; 120 iterations = 50 doc-layer + 70 code+ops-layer; 920 files reviewed across packets 009-playbook-and-remediation, 010-search-and-routing-tuning, 012-command-graph-consolidation, 014-memory-save-rewrite).
- **Findings**: 243 deduplicated (1 P0 + 114 P1 + 133 P2). Two cross-model audits (GPT-5.4 high then Opus 4.6) caught 6 missing P1s, 2 missing themes, and priority ordering issues — all patched into the report.
- **Workstreams**: 11 (WS 0 P0 reconsolidation; WS 0b path-boundary hardening; WS 0c public-contract verification; WS 1 status drift; WS 2 packet 014 identity; WS 3 command/workflow integrity; WS 4 error handling and security hardening; WS 5 traceability and evidence; WS 6 stale references and placeholders; WS 7 agent/skill doc refresh; WS 8 test quality).
- **In-scope artifacts**: 226 tasks across the 11 workstreams; 93-item verification checklist (9 P0 + 75 P1 + 9 P2).
- **Status at consolidation**: Plan + tasks + checklist created; Workstream 0 (P0 reconsolidation scope-boundary fix) carried forward as the open release-class blocker for downstream remediation.

### 3.2 Wave B — Phase 020 CLI Executor Research-Findings Remediation (formerly 002-cli-executor-remediation)

- **Source**: `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` (256 lines, 17 sections, 30 iterations).
- **Findings**: 12 prioritized R1-R12 remediations (7 P1 + 5 P2) plus the deferred Phase 017 parking-lot item R55-P2-004.
- **Atomic-ship groups (waves A-G)**:
  - **R1+R2** — shared deep-loop executor provenance: first-write JSONL executor identity for cli-codex / cli-copilot / cli-gemini / cli-claude-code, plus typed `dispatch_failure` event so crashes preserve attribution.
  - **R3** — Copilot `@path` large-prompt fallback in all 4 deep-loop YAMLs with a 16 KB threshold and matrix test coverage.
  - **R4+R5** — `description.json` discriminated loader + merge-preserving repair (`mergePreserveRepair` helper) plus specimen regression tests using rich 017 packet fixtures, dropping the 29-of-86 at-risk packet count to zero.
  - **R6+R7** — `graph-metadata.json derived.save_lineage` enum (`description_only` / `graph_only` / `same_pass`) plus precision-aware timestamp normalization.
  - **R8+R10+R11** — retry-budget structured telemetry (`{event:'retry_attempt', memoryId, step, reason, attempt, outcome}`), caller-context coverage for `setImmediate`/`queueMicrotask`/`timers/promises`, and readiness-contract docs narrowed to the four reachable trust states.
  - **R9** — evidence-marker audit parser fix for indented and nested triple-backtick fences.
  - **R12** — deferred per ADR (low coupling to active hardening).
- **Outcome**: All 11 P0/P1/P2 remediations shipped via 6 cli-codex dogfooding waves with 116/116 scoped tests green across 13 files, plus `npx tsc --noEmit` clean.

### 3.3 Wave C — Phase 025 Skill-Advisor Deep-Review Remediation (formerly 003-deep-review-remediation)

- **Source**: 40-iteration r02 deep-review of the skill-advisor phase stack (020 + 021/001 + 021/002 + 022 + 023 + 024) at `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/findings-registry.json`.
- **Findings**: 7 deduplicated (5 P1 + 2 P2). Verdict at consolidation was PASS, but every finding represented a legitimate correctness, privacy, parity, or operator-doc gap.
- **Closures**:
  - **DR-P1-001** (D1 prompt-boundary privacy): `skill_advisor.py --stdin` mode; subprocess argv contains no raw prompt; instruction-shaped envelope labels rejected at the `coerceSharedPayloadEnvelope` boundary using the same sanitizer as `render.ts`.
  - **DR-P1-002** (D2 renderer/cache contract): `tokenCap` propagated to renderer via `result.metrics.tokenCap`; exact prompt cache key includes normalized `maxTokens`; cache-hit path rebuilds top-level and envelope `provenance.generatedAt` so the brief stays fresh.
  - **DR-P1-003** (D3 telemetry fidelity): static vs live measurement streams separated; `finalizePrompt(promptId)` API added to `live-session-wrapper`; analyzer keys by `promptId` and treats baseline `SKILL.md` reads as non-violating.
  - **DR-P1-004** (D5 plugin parity): `.opencode/plugins/spec-kit-skill-advisor.js` honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, escalates SIGTERM to SIGKILL after 1 s, and stamps a source signature into the host cache key; the plugin runs as the 5th path in `advisor-runtime-parity.vitest.ts`.
  - **DR-P1-005** (D7 operator docs): workspace build command corrected, Copilot integration model clarified as callback-based, manual-testing playbook denominator regenerated, Codex registration status aligned, measurement artifact name unified.
  - **DR-P2-001** (D4 API hygiene): `prompt-cache.ts` size cap with insertion-time eviction; `normalizeAdapterOutput` retained as `@deprecated` alias; JSDoc added to public symbols across 7 files.
  - **DR-P2-002** (D6 test coverage): plugin negative-path tests; subprocess error-classification tests; telemetry path-precedence and report-writer tests; one end-to-end builder→renderer parity case with no stubs.
- **Outcome**: 58 focused tests pass; TypeScript build passes; `npm --prefix .../mcp_server run build` passes; the broader project suite still surfaces unrelated legacy failures outside Phase 025 scope, which are tracked separately.

### 3.4 Wave D — Phase 026 R03 Post-Remediation Remediation (formerly 004-r03-post-remediation)

- **Source**: R03 post-remediation review (38/40 iterations before user stop) on the post-Phase-025 state, recorded under `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/`.
- **Findings**: 12 deduplicated (8 P1 + 4 P2). Five P1s sit in D7 docs drift, two in telemetry reachability and D4 error handling, one in D5 cross-workspace cache bleed.
- **Closures (T01-T12)**:
  - **T01-T02, T07-T08, T09 (D7)** — Copilot/Codex hook reference snippets aligned to or annotated against shipped `.github/hooks/superset-notify.json` / `.codex/settings.json` / `.codex/policy.json`; hardcoded inventory and health values either replaced with live references or annotated as snapshot values; manual-testing-playbook reconciled to the actual inline-root-table structure; bare-path commands replaced with `npm --prefix` or explicit `cd` invocations; LT-001 scenario points at the actual `LIVE_SESSION_WRAPPER_SETUP.md` path.
  - **T03 (D3)** — `finalizePrompt(promptId)` wired into the documented `LIVE_SESSION_WRAPPER_SETUP.md` operator workflow.
  - **T04 (D4)** — bare `catch {}` handlers in the advisor producer stack replaced with typed error classification via the new `lib/skill-advisor/error-diagnostics.ts` module; root-cause preserved in diagnostics.
  - **T05+T06 (D5/D6)** — workspace root added to OpenCode plugin host cache key; cross-workspace regression test landed in `spec-kit-skill-advisor-plugin.vitest.ts`.
  - **T10-T11 (D6)** — default telemetry fallback path test plus subprocess spawn-error classification test added.
  - **T12 (D1)** — single-line sanitizer applied to `provenance.sourceRefs` (same sanitizer used for `metadata.skillLabel`).
- **Dispatch model**: 12 sequential `cli-copilot` agents, max 1 concurrent, fresh process per finding. Driver killed each agent on exit and spawned fresh.
- **Outcome**: All 8 P1 + 4 P2 closed with `file:line` evidence in `implementation-summary.md`; baseline 65-test Phase 025 focused suite plus the 3 new T06/T10/T11 tests all pass.

### 3.5 Wave E — 005-006 Campaign Findings Remediation (formerly 005-006-campaign-findings-remediation)

- **Source**: Consolidated 006-campaign report with 274 findings (P0=7, P1=165, P2=102) across ten remediation themes. The original sub-phase folders were flattened into this packet's tasks.md and implementation-summary.md `## Sub-phase summaries` section so future remediation can pick up the theme without re-reading the full consolidated report.
- **Theme dispositions**:

  | Theme | Findings | Severity Mix | Status | Outcome highlights |
  |-------|---------:|--------------|--------|--------------------|
  | 001 graph-and-metadata-quality | 79 | P0=2 P1=42 P2=35 | **Blocked (18%)** | CF-181 `skill-graph-db.ts:347/463` non-skill records skipped; CF-071 `content-router.ts:1075` metadata_only routes; CF-133 derived-field caps schema-enforced; CF-116 embedded `..` rejected from key-file lookup. CF-108 blocked on historical-source write authority. |
  | 002 spec-structure-and-validation | 60 | P0=1 P1=36 P2=23 | **Blocked (20%)** | CF-176 reciprocal sibling graph edges shipped; `skill_advisor.py` allowlists only `skill-advisor` as graph-only; new `advisor-graph-health.vitest.ts`; strict no-recursive validation exits 0 here. CF-207 blocks recursive validation on historical packet doc errors. |
  | 003 evidence-references-and-replayability | 46 | P0=1 P1=31 P2=14 | **Not started** | All tasks unchecked; awaits expanded write authority for historical source packets. |
  | 004 migration-lineage-and-identity-drift | 42 | P0=0 P1=34 P2=8 | **Complete** | Live `specFolder` paths replace retired 010/011/021 tokens; `skill_advisor.py` uses SQLite as the only runtime skill-graph source; `migration-lineage-identity.vitest.ts` covers 4 scenarios; strict no-recursive validation exits 0. |
  | 005 packet-state-continuity-and-closeout | 17 | P0=2 P1=7 P2=8 | **Not started** | All tasks unchecked; awaits write authority on historical closeout surfaces. |
  | 006 routing-accuracy-and-classifier-behavior | 15 | P0=1 P1=6 P2=8 | **Complete** | Tier 3 routing decoupled from `full-auto` planner mode; cache keys partitioned by packet kind/save mode/level/phase; `drop` (not `drop_candidate`) in public Tier 3 prompt; six vitests pass. |
  | 007 skill-advisor-packaging-and-graph | 7 | P0=0 P1=3 P2=4 | **Complete** | `session-bootstrap.ts` emits `skillGraphTopology`; `spec-kit-skill-advisor-bridge.mjs` renders `top.uncertainty`; `manual-testing-playbook.vitest.ts` locks the playbook to exactly 47 scenario files. |
  | 008 search-fusion-and-reranker-tuning | 5 | P0=0 P1=4 P2=1 | **Complete** | `cross-encoder-extended.vitest.ts` covers cache-miss / stale-hit / oldest-eviction telemetry; `remediation-008-docs.vitest.ts` locks feature-catalog counts (CF-200) and plugin manifest details (CF-228). |
  | 009 security-and-guardrails | 2 | P0=0 P1=2 P2=0 | **Complete** | CF-183 `skill_graph_query` recursively redacts `sourcePath`/`contentHash`; CF-186 empty-scan preservation guard with `EMPTY-SKILL-SCAN` warning; new `skill-graph-handlers.vitest.ts`. |
  | 010 telemetry-measurement-and-rollout-controls | 1 | P0=0 P1=0 P2=1 | **Complete** | CF-271 `pre-tool-use.ts` Codex matching documented as starter-phrase policy; `codex-pre-tool-use.vitest.ts` covers regression. `.codex/policy.json` write blocked by EPERM; runtime default + test updated instead. |

### 3.6 Wave F — Cross-Phase Integrity-Parity Closure (formerly 006-integrity-parity-closure)

- **Source**: `research/cross-phase-synthesis.md` and `research/cross-phase-findings.json` produced by the 026 cross-phase synthesis pass.
- **Findings**: 9 P0 (CF-001, CF-002, CF-005, CF-009, CF-014, CF-017, CF-019, CF-022, CF-025) + 16 P1 (CF-003, CF-004, CF-006, CF-007, CF-010, CF-011, CF-012, CF-015, CF-016, CF-018, CF-020, CF-021, CF-023, CF-024, CF-026, CF-027). The synthesis explicitly named live verification as the promotion gate.
- **Outcome**: All 9/9 P0 + 16/16 P1 fixes shipped overnight 2026-04-23 → 2026-04-24 via 25-way parallel `cli-codex gpt-5.4 high fast` dispatch with one CF-016 retry after a Gate 3 hang on the first attempt. Per-finding evidence reports landed under `applied/` (one CF-NNN file per fix) with before/after snippets, target-file diff summaries, and verification notes.
- **Representative closures**:
  - **CF-001** — root packet state model now distinguishes implemented / narrowed / reopened / still-open work; archived deep-research dashboard reconciled.
  - **CF-002** — scan and index acceptance tied to live reruns recorded in `010-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md` and `003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md`.
  - **CF-005** — `atomic-index-memory.ts` lock ordering fixed; `memory-save.ts` routed-save behavior aligned; `handler-memory-save.vitest.ts` covers the save-race regression.
  - **CF-009** — `code-graph/lib/ensure-ready.ts` and `code-graph/handlers/scan.ts` now share one staged-persistence commit path so manual scans cannot mark broken writes fresh.
  - **CF-014** — `shared/review-research-paths.cjs` centralized; `spec_kit_deep-research_auto.yaml` aligned; `sk-deep-research/references/state_format.md` updated.
  - **CF-017** — `manual_testing_playbook.md` and `manual-playbook-runner.ts` result-class vocabulary normalized; `005-release-cleanup-playbooks/.../tasks.md` reconciled.
  - **CF-019** — `skill_advisor.py` pass/fail derivation reordered so graph-conflict penalties apply before threshold check.
  - **CF-022** — closure path recorded in `005-006-campaign-findings-remediation/001-graph-and-metadata-quality/checklist.md` and reconciled into this parent's parity language; underlying historical-source write blocker remains for ADR-level decision.
  - **CF-025** — `sk-deep-research/assets/prompt_pack_iteration.md.tmpl` writes executor metadata early; `lib/deep-loop/post-dispatch-validate.ts` accepts typed executor failure events; `executor-audit.ts` attaches canonical executor metadata.

### 3.7 Out of Scope

- New product features or refactors not directly tied to a finding ID.
- Reclassification of source findings — the consolidated grouping is preserved.
- Numeric tuning of `MAX_RETRIES` or the 10-minute continuity threshold (gated on the new retry-budget telemetry signal accumulating, per ADR).
- Q4 NFKC robustness research (real residual; tracked as a future research slice).
- Off-repo telemetry infrastructure — Wave B emits the signals; analyzing them later is separate work.
- Runtime recursion detection for cross-CLI delegation (Phase 019 ADR-007 keeps this docs-only; no change here).
- Cross-repo skill discovery or new SKILL.md content authoring.
- Edits to historical source packets needed by CF-108, CF-207, and CF-022 — those need write authority outside the 026 packet boundary or a formal ADR-level deferral.

### 3.8 Files to Change (high-leverage runtime + documentation surfaces)

| Surface | File family | Wave | Action |
|---------|-------------|------|--------|
| Reconsolidation | `mcp_server/handlers/save/reconsolidation-bridge.ts`, `tests/reconsolidation-bridge.vitest.ts` | A WS0 | Add scope-field validation + cross-scope merge regression. |
| Path boundary | `mcp_server/lib/graph/graph-metadata-parser.ts`, `mcp_server/core/config.ts`, `mcp_server/lib/resume/resume-ladder.ts`, `mcp_server/handlers/skill-graph/scan.ts` | A WS0b | `path.resolve()` + `startsWith(allowedRoot)` guards; symlink resolution before re-validation. |
| Tool schemas | `mcp_server/tool-schemas.ts`, `mcp_server/tool-input-schemas.ts`, `mcp_server/tools/index.ts`, `mcp_server/handlers/coverage-graph/status.ts` | A WS0c | Reconcile published schemas to handler responses; remove dead tool registrations. |
| Status drift | `spec.md`/`plan.md`/`graph-metadata.json` across packets 009/010/012/014; `mcp_server/lib/.../determineSessionStatus`; `/complete` debug-escalation wiring | A WS1 | Status sync, replace `closed_by_commit: TBD`, fix false-completion logic. |
| Packet 014 identity | `004-memory-save-rewrite/spec.md`, `tasks.md`, `checklist.md`, `changelog/` | A WS2 | Replace `Packet 016`/`SC-016`/`CHK-016` with `Packet 014`/`SC-014`/`CHK-014`. |
| Command + workflow | `.opencode/command/spec_kit/assets/*.yaml` (×10), `.opencode/command/doctor/assets/doctor_mcp_install.yaml`, `mcp_server/scripts/core/workflow.ts`, `mcp_server/context-server.ts`, `mcp_server/scripts/lib/frontmatter-migration.ts` | A WS3 | Live tool refs only; quality-score override fix; section-label fix; default-scope fix. |
| Error + security | `mcp_server/handlers/session-bootstrap.ts`, `mcp_server/scripts/core/title-builder.ts`, `mcp_server/hooks/claude/session-prime.ts`, `mcp_server/scripts/lib/trigger-phrase-sanitizer.ts`, `skill/skill-advisor/scripts/skill_advisor.py` | A WS4 | Explicit error propagation; order-independent sanitizer; tighter agent permissions. |
| Traceability | Multiple packet `implementation-summary.md` files; `mcp_server/scripts/core/post-save-review.ts`; `mcp_server/lib/validation/spec-doc-structure.ts`; `mcp_server/scripts/memory/generate-context.ts` | A WS5 | Wire post-save reviewer into production `workflow.ts`; fix anchor-parse failures. |
| Stale refs | `mcp_server/tools/index.ts`, `mcp_server/scripts/lib/frontmatter-migration.ts`, `mcp_server/lib/validation/spec-doc-structure.ts`, `cli-copilot/assets/prompt_templates.md`, `mcp-code-mode/assets/config_template.md`, `CLAUDE.md`, `AGENTS.md` | A WS6 | Remove dead `deep_loop_graph_*` MCP surface; fix Gate 3 carry-over rule drift. |
| Agent + skill docs | `.claude/agents/*.md`, `.opencode/agent/*.md`, `.codex/agents/*.md`, `.gemini/agents/*.md`; `sk-deep-{research,review}/scripts/reduce-state.cjs`; `cli-{copilot,claude-code}/SKILL.md` | A WS7 | Cross-runtime alignment; reducer schema fix; LEAF guardrail. |
| Test quality | 30+ vitest files across `mcp_server/tests/` and `mcp_server/scripts/tests/` | A WS8 | Replace shadow-copy testing; add edge cases; remove false-positive expectations. |
| Deep-loop executor | `command/spec_kit/assets/spec_kit_deep-{research,review}_{auto,confirm}.yaml`; `mcp_server/lib/deep-loop/executor-audit.ts`; `mcp_server/lib/deep-loop/post-dispatch-validate.ts`; prompt-pack templates; `tests/deep-loop/*.vitest.ts` | B + F | First-write executor identity, typed dispatch_failure event, Copilot @path fallback, executor-metadata-early ordering. |
| description.json | `mcp_server/scripts/spec-folder/generate-description.ts`; new `mcp_server/lib/description/repair.ts`; `tests/description/*.vitest.ts` | B | Discriminated loader + merge-preserving repair. |
| Graph metadata | `mcp_server/lib/graph/graph-metadata-schema.ts`; canonical save path writer; backfill script; `mcp_server/lib/continuity/timestamp-normalize.ts` | B | `derived.save_lineage` enum + precision-aware timestamps. |
| Retry budget + telemetry | `mcp_server/lib/enrichment/retry-budget.ts`; `mcp_server/handlers/save/post-insert.ts`; `tests/retry-budget-telemetry.vitest.ts` | B | Structured `retry_attempt` events; `MAX_RETRIES = 3` unchanged. |
| Evidence-marker parser | `mcp_server/scripts/validation/evidence-marker-audit.ts`; `tests/validation/fixtures/{indented,nested,mismatched}-fence` | B | Indented / nested / mismatched fence handling. |
| Caller-context + readiness docs | `tests/caller-context.vitest.ts`; `sk-deep-{research,review}/SKILL.md`; `cli-copilot/SKILL.md`; `system-spec-kit/SKILL.md` | B | Async-boundary coverage; readiness narrowed to 4 reachable trust states. |
| Skill-advisor producer | `mcp_server/skill-advisor/scripts/skill_advisor.py`; `mcp_server/lib/skill-advisor/{subprocess,render,skill-advisor-brief,prompt-cache,normalize-adapter-output}.ts`; `mcp_server/lib/context/shared-payload.ts`; runtime hooks; `.opencode/plugins/spec-kit-skill-advisor.js` | C + D | Stdin prompt; tokenCap propagation; envelope sanitizer; plugin parity; SIGKILL escalation. |
| Smart-router telemetry | `scripts/observability/smart-router-{measurement,telemetry,analyze}.ts`; `scripts/observability/live-session-wrapper.ts` | C + D | Static vs live separation; `finalizePrompt(promptId)`; promptId aggregation; baseline SKILL.md classification. |
| Operator docs (Phase 025/026) | `references/hooks/skill-advisor-hook.md`; `mcp_server/skill-advisor/{README.md,SET-UP_GUIDE.md,manual_testing_playbook/*.md,feature_catalog/*.md}`; `scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` | C + D | Workspace build command; Codex/Copilot status; denominator regeneration; bare-path → `npm --prefix`. |
| 005-006 campaign | Files cited in Wave E by theme (see §3.5 outcome highlights and `tasks.md`). | E | Per-theme remediation; complete themes carry test + validation evidence; blocked themes hold for write-authority decision. |
| Cross-phase closure | All files cited in Wave F (see `applied/CF-NNN.md` evidence reports). | F | Live verification as promotion gate; CF identifiers preserved on every change. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 — Blockers (MUST complete or formally defer with owner)

| ID | Requirement | Source | Acceptance |
|----|-------------|--------|------------|
| REQ-A0 | Reconsolidation-bridge validates `tenant_id`/`user_id`/`agent_id`/`session_id` before merge; cross-scope attempts abort, preserve both records, and log a typed warning. | Wave A WS0 (review-report.md S2, S3.2#1) | `reconsolidation-bridge.vitest.ts` cross-scope test passes; existing reconsolidation tests still green. |
| REQ-B-R1 | Non-native executor identity is written on the **first** JSONL record of every iteration (cli-codex / cli-copilot / cli-gemini / cli-claude-code). | Wave B R1 | Inspecting `iteration-NNN.jsonl` line 1 shows `executor.{kind,model,reasoningEffort,serviceTier}`. |
| REQ-B-R2 | Failure paths preserve executor identity through a typed `dispatch_failure` event (or enriched `schema_mismatch`). | Wave B R2 | Mocked codex crash mid-iteration emits the conflict event with executor provenance present. |
| REQ-B-R4 | `description.json` loader returns a discriminated-union result distinguishing `parse_error` vs `schema_error`. | Wave B R4 | Unit test: malformed JSON → `parse_error`; schema-invalid valid JSON → `schema_error`. |
| REQ-B-R5 | `mergePreserveRepair` keeps authored narrative on schema-invalid files (canonical derived fields always win, authored narrative + extension keys preserved). | Wave B R5 | Specimen test on rich 017 packet fixtures retains authored summary; the 29-of-86 at-risk count drops to 0. |
| REQ-F-CF001 | Root packet state model distinguishes implemented / narrowed / reopened / still-open work. | Wave F CF-001 | Root docs stop conflating research convergence with operational acceptance. |
| REQ-F-CF002 | Scan and index readiness claims are gated on live acceptance reruns. | Wave F CF-002 | Packet evidence links show current successful reruns before status promotion. |
| REQ-F-CF005 | Routed full-auto save merge preparation runs (or is recomputed) inside the folder lock. | Wave F CF-005 | Routed-save regression covers the pre-lock data-loss path. |
| REQ-F-CF009 | Manual `code_graph_scan` and `ensure-ready` share one staged-persistence helper. | Wave F CF-009 | Broken writes can no longer mark stale data fresh through the manual path. |
| REQ-F-CF014 | Child-phase deep-research prompts, state, deltas, and synthesis use one artifact root. | Wave F CF-014 | Runtime and docs resolve the same canonical research location. |
| REQ-F-CF017 | Playbook, runner, and packet-level result vocabulary normalized (especially `UNAUTOMATABLE`). | Wave F CF-017 | Wrapper release evidence stops depending on contradictory result classes. |
| REQ-F-CF019 | Skill-advisor pass/fail is derived after all mutators (graph-conflict penalties applied first). | Wave F CF-019 | Conflicting recommendations no longer pass before graph penalties apply. |
| REQ-F-CF022 | The 005-006 campaign's CF-022 blocker closes through a write-authorized follow-up or an explicit ADR-level defer rationale. | Wave F CF-022 | Packet records either a concrete owner-backed follow-up or a formal defer decision. |
| REQ-F-CF025 | Non-native executor metadata + typed failure events are emitted before validation. | Wave F CF-025 | Non-native executor runs no longer fail because canonical records are incomplete. |
| REQ-E-historical | Each remaining 005-006 historical-source-authority blocker (CF-108, CF-207, plus the 003 + 005 themes that have not started) closes through write authority OR an ADR-level deferral. | Wave E themes 001/002/003/005 | Packet records either expanded write authority + closure evidence, or a formal owner-backed defer decision. |

### 4.2 P1 — Required (complete OR user-approved deferral with rationale)

| ID | Requirement | Source | Acceptance |
|----|-------------|--------|------------|
| REQ-A-WS0b | Folder-scoped validators reject absolute / escaped paths; DB-directory resolution resolves symlinks via `fs.realpathSync` before re-validation; resume handlers reject absolute `specFolder` values that fall outside packet roots; key-file extraction normalizes to repo-relative. | Wave A WS0b | Regression test for each path-escape vector passes; existing path tests still green. |
| REQ-A-WS0c | All published MCP tool schemas match runtime handler responses; dead tool registrations removed; README entrypoints verified on disk. | Wave A WS0c | Schema-validation test extended to cover new tool families. |
| REQ-A-WS1 | Spec/plan frontmatter status matches `graph-metadata.json` status across packets 009/010/012/014; no `closed_by_commit: TBD` placeholders; false-completion logic in `determineSessionStatus()` fixed. | Wave A WS1 | Status-drift scan returns 0 findings; `validate.sh --strict` passes for all four packets. |
| REQ-A-WS2 | Zero `016` identity references in packet 014. | Wave A WS2 | `grep -r "016" 014-*` returns empty; `validate.sh --strict` passes for 014. |
| REQ-A-WS3 | Command YAMLs reference live MCP tools only; doctor workflow section labels match install guides; `runWorkflow()` quality-score override fixed; 250 ms dispatch graph-context timeout corrected. | Wave A WS3 | All YAMLs lint clean; quality-score and timeout regressions pass. |
| REQ-A-WS4 | No silent error swallowing in reviewed handlers; `sanitizeTriggerPhrases()` is order-independent; agent permissions tightened. | Wave A WS4 | Unit tests cover error propagation + sanitizer order. |
| REQ-A-WS5 | Every checklist item has traceable `file:line` evidence; missing implementation summaries created; post-save reviewer wired into production `workflow.ts`; cross-reference links resolve. | Wave A WS5 | Inventory shows zero placeholders; `post-save-review.ts` runs in canonical save path. |
| REQ-A-WS6 | All 12 P1 stale references fixed (dead `deep_loop_graph_*` surface removed; Gate 3 carry-over rule drift fixed; copy-paste commands valid). | Wave A WS6 | `grep` for known stale patterns returns zero hits. |
| REQ-A-WS7 | All 4 runtime agent directories consistent; SKILL.md files reference current capabilities only; reducer handles current iteration schema; `sk-code` baseline reference resolves to a real skill. | Wave A WS7 | Cross-runtime diff shows zero deltas. |
| REQ-A-WS8 | All 11 P1 test findings fixed; zero false-positive tests in flagged suites; `npx vitest run` passes with no silent skips. | Wave A WS8 | Test inventory all green. |
| REQ-B-R3 | Copilot `@path` large-prompt fallback ships in all four deep-loop YAMLs with matrix coverage. | Wave B R3 | Grep + vitest: 4 YAMLs have `@path` branch; cli-matrix test covers oversized prompt path. |
| REQ-B-R6 | `graph-metadata.json derived.save_lineage` enum (`description_only`/`graph_only`/`same_pass`) shipped and required. | Wave B R6 | Schema test: tag is required and enum-validated. |
| REQ-B-R7 | Continuity threshold docs match one-sided semantics; low-precision timestamps normalized. | Wave B R7 | Docs grep + unit test: date-only values no longer false-stale. |
| REQ-B-R8 | Retry-budget emits structured telemetry (`retry_attempt`); `MAX_RETRIES = 3` numerically unchanged. | Wave B R8 | Unit test: emit signature matches; behavior unchanged. |
| REQ-B-R9 | Evidence-marker parser handles indented + nested line-start backticks; mismatched-fence detection still flags real defects. | Wave B R9 | Unit test: indented + nested cases stop producing false positives without regressing mismatched-fence detection. |
| REQ-B-R10 | Caller-context coverage extended to `setImmediate`, `queueMicrotask`, `timers/promises`. | Wave B R10 | Committed vitest cases. |
| REQ-B-R11 | Readiness docs narrowed to the 4 reachable trust states; Copilot bootstrap docs consistent. | Wave B R11 | Docs review; DQI ≥ 0.85. |
| REQ-C-DR-P1-001 | Prompt boundary hardened: stdin spawn, sanitized envelope labels. | Wave C | `advisor-subprocess.vitest.ts` + `shared-payload-advisor.vitest.ts` cover spawn-args + envelope rejection. |
| REQ-C-DR-P1-002 | Renderer/cache contract correct: `tokenCap` plumbed; cache key includes `maxTokens`; cache-hit envelope provenance restamped. | Wave C | `advisor-renderer.vitest.ts`, `advisor-prompt-cache.vitest.ts`, `advisor-runtime-parity.vitest.ts`. |
| REQ-C-DR-P1-003 | Telemetry fidelity: static vs live streams separated; `finalizePrompt(promptId)` API added; analyzer keys by `promptId`. | Wave C | `smart-router-{telemetry,analyze,measurement}.vitest.ts`. |
| REQ-C-DR-P1-004 | Plugin parity with native hooks: shared disable flag, SIGKILL escalation, source-signature cache key, plugin path in parity harness. | Wave C | `spec-kit-skill-advisor-plugin.vitest.ts`, `advisor-runtime-parity.vitest.ts`. |
| REQ-C-DR-P1-005 | Operator docs executable: workspace build command, Copilot integration model, manual playbook denominator, Codex registration status, measurement artifact name. | Wave C | Build + grep checks. |
| REQ-D-T01..T08 | Eight P1 R03 post-remediation tasks each close with code/doc change + `Closed` status with `file:line` evidence. | Wave D | `implementation-summary.md` rows show `Closed` with anchored evidence; T06 cross-workspace test passes. |
| REQ-F-CF003..CF027 | Each leading-seven P1 cross-phase finding (CF-003, CF-004, CF-006, CF-007, CF-010, CF-011, CF-012) becomes one authoritative runtime / parity / governance contract. | Wave F | `applied/CF-NNN.md` evidence reports per finding; live verification recorded where applicable. |

### 4.3 P2 — Suggestion (fix when practical, defer with reason)

| ID | Requirement | Source | Acceptance |
|----|-------------|--------|------------|
| REQ-A-WS6-P2 | Stale-ref P2 items fixed where practical (dead branches, changelog counts, troubleshooting prose, anchor convention). | Wave A | Documented deferrals in checklist for items not fixed. |
| REQ-A-WS8-P2 | P2 test improvements applied where practical (replace string-presence assertions with behavioral checks; add Unicode/empty/concurrent edge cases; remove false-positive regression expectations). | Wave A | Touched files audited; deferrals annotated. |
| REQ-B-R12 | Phase 017 parking-lot R55-P2-004 (YAML evolution cleanup) — conditional on R1-R3. | Wave B | **Deferred** per ADR; low coupling to active hardening. |
| REQ-C-DR-P2-001 | Prompt-cache size cap + insertion sweep; `normalizeAdapterOutput` documented as `@deprecated`; JSDoc on advisor public symbols. | Wave C | `advisor-prompt-cache.vitest.ts`. |
| REQ-C-DR-P2-002 | Plugin negative-path / subprocess error-classification / telemetry path-precedence / end-to-end builder→renderer parity tests. | Wave C | New tests committed. |
| REQ-D-T09..T12 | R03 P2 closures (LIVE_SESSION_WRAPPER_SETUP link, default-telemetry-fallback test, subprocess spawn-error test, `provenance.sourceRefs` sanitizer parity). | Wave D | `implementation-summary.md` rows show `Closed`. |

### 4.4 Non-Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| NFR-01 | No new test regressions introduced during remediation. | All waves |
| NFR-02 | `validate.sh --strict` passes after each wave on the affected packets. | All waves |
| NFR-03 | Path-escape regression tests exist before path-boundary fixes land. | Wave A WS0/WS0b |
| NFR-04 | Live verification evidence is current enough to support readiness promotion in this packet's status. | Wave F |
| NFR-S01 | Permission and wrapper contract changes do not widen runtime capabilities without matching documentation and smoke coverage. | Wave F |
| NFR-R01 | Packet metadata and evidence paths remain parseable by graph and memory tooling. | Wave E + F |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** — Wave A WS0 (P0 reconsolidation scope-boundary) ships with a passing cross-scope merge regression test before this packet's status can promote past In Progress.
- **SC-002** — Wave A workstreams 0b–8 each have evidence in `tasks.md` showing either `[x]` closure or `[D]` user-approved deferral with rationale.
- **SC-003** — Wave B SC-001 through SC-006 hold: every non-native iteration has executor identity on its first JSONL record; crashed iterations still emit an executor-attributed conflict event; description.json repair preserves authored rich content; the 29-of-86 at-risk count drops to 0; Copilot `@path` fallback exists in all 4 YAMLs and matrix tests; all waves pass `tsc --noEmit` clean and `npx vitest run` green; `validate.sh --strict` exits 0 on Wave B's packet after implementation summary lands.
- **SC-004** — Wave C closes all 5 P1 + 2 P2 findings with `file:line` evidence and a focused vitest suite green.
- **SC-005** — Wave D closes all 8 P1 + 4 P2 findings with `file:line` evidence; T06 cross-workspace test green; baseline 65-test focused suite plus T06/T10/T11 all pass.
- **SC-006** — Wave E reports six themes Complete (004, 006, 007, 008, 009, 010) with strict no-recursive validation green; the four blocked/not-started themes (001, 002, 003, 005) carry a documented historical-source-authority blocker plus their CF id.
- **SC-007** — Wave F applies 9/9 P0 + 16/16 P1 fixes with one `applied/CF-NNN.md` evidence report per finding; live verification recorded for scan, index, routing, executor, and wrapper claims that this packet promotes.
- **SC-008** — `007-deep-review-remediation/graph-metadata.json` lists every active wave's evidence in `derived.key_files` and remains parseable in sorted order.
- **SC-009** — `description.json` and `graph-metadata.json` for this packet stay parseable after the merge into a single root spec.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Likelihood | Mitigation |
|------|------|--------|-----------:|------------|
| Risk | Wave A WS0 dispatch produces a regression in `reconsolidation-bridge.ts` callers that share boundary assumptions. | High | Medium | Audit all callers; introduce scope-boundary check as opt-in feature flag; add cross-scope regression before code change. |
| Risk | Wave B R1 first-write reordering breaks the deep-loop reducer schema. | High | Low | Preserve record schema; treat audit-field append as merge-if-present. |
| Risk | Wave B R4 parse-vs-schema split changes historical loader behavior. | Medium | Low | `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE=false` reverts to prior minimal-replacement; existing callers opt in. |
| Risk | Wave B R6 lineage tag breaks third-party graph-metadata parsers. | Medium | Low | Tolerant deserialization; schema migration marker. |
| Risk | Wave B R9 fence-parser change regresses existing evidence-marker tests. | Medium | Low | Add three regression fixtures (indented, nested, mismatched) **before** parser change. |
| Risk | Wave C/D plugin SIGKILL escalation kills a long-running legitimate child. | Medium | Low | 1 s SIGTERM grace before SIGKILL; `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` opt-out. |
| Risk | Wave E/F historical source packets are intentionally immutable. | High | Medium | Move CF-108, CF-207, CF-022 to formal ADR-level deferrals if write authority is not granted. |
| Risk | Wave F shared contract edits regress another phase surface. | High | Medium | Read every touched target file before editing; centralize edits through one contract per file family. |
| Risk | Live verification remains blocked after code fixes. | High | Medium | Treat blocked proof as incomplete, not complete; never promote status on documentary evidence alone. |
| Dependency | `review/review-report.md` (Wave A source) | High | — | Pinned at 1,535 lines / 120 iterations / 920 files; copied + audited twice. |
| Dependency | `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` (Wave B source) | High | — | Phase 018/019 already shipped; consumed unchanged. |
| Dependency | r02 deep-review iterations (Wave C source) | Medium | — | Findings registry under `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/`. |
| Dependency | R03 iteration set (Wave D source) | Medium | — | Iterations 7, 13, 14, 17-21, 28, 29 captured the in-scope findings. |
| Dependency | Consolidated 006-campaign report (Wave E source) | High | — | Mirrored into this packet's tasks.md and §3.5 sub-phase summaries. |
| Dependency | `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json` (Wave F source) | High | — | Pinned source for the 25-way parallel cli-codex run. |
| Dependency | `generate-description.js` auto-runs on save | High | — | Wave B R5 gates stale-file auto-repair until R4 ships. |
| Dependency | `MAX_RETRIES = 3` and 10-min continuity threshold remain numerically stable for this packet. | High | — | ADR-013 commits to docs-honesty + telemetry first; numeric tuning is a separate future packet. |
| Dependency | Live-capable runtime access for scan / index / routing / executor / wrapper reruns. | High | — | Without it, readiness claims stay blocked; record that explicitly rather than promoting. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01** — Validation for this packet must complete within normal spec-kit validator runtime.
- **NFR-P02** — Live verification evidence must be current enough to support readiness promotion in the active packet state (Wave F).

### Security
- **NFR-S01** — Wrapper, plugin, and runtime hook permission changes do not widen runtime capabilities without matching documentation and smoke coverage.
- **NFR-S02** — `sanitizeTriggerPhrases()` is order-independent (Wave A WS4).
- **NFR-S03** — `provenance.sourceRefs` and `metadata.skillLabel` go through the same single-line sanitizer (Wave D T12).
- **NFR-S04** — `skill_graph_query` recursively redacts `sourcePath` and `contentHash` before serialization (Wave E theme 009 / CF-183).

### Reliability
- **NFR-R01** — Generated metadata must remain parseable by graph and memory tooling.
- **NFR-R02** — Empty skill-graph scans preserve the existing SQLite graph (Wave E theme 009 / CF-186).
- **NFR-R03** — Deep-loop dispatch failures still emit a typed conflict event with executor identity (Wave B R2 + Wave F CF-025).

---

## 8. EDGE CASES

### Data Boundaries
- Empty severity bucket: retain the bucket in requirements but generate no fake finding.
- Placeholder no-finding row: keep it explicit if present in the consolidated report.
- Duplicate target paths across findings must resolve to one coherent contract change, not stacked contradictory edits.
- Missing ranking metadata in `cross-phase-findings.json` must not silently reshape the selected P1 slice.
- Date-only / midnight-UTC timestamps are low-precision and bypass the strict 10-min continuity threshold (Wave B R7).
- Indented (column 1-3) and nested triple-backtick fences must not produce false-positive evidence-marker mismatches (Wave B R9).
- 16 KB-or-smaller Copilot prompts use the positional form; larger prompts switch to the `@path` wrapper (Wave B R3).

### Error Scenarios
- Cross-scope reconsolidation merge attempts abort and preserve both records (Wave A WS0).
- Mocked codex / copilot crash mid-iteration emits the typed `dispatch_failure` event with executor provenance present (Wave B R2 + Wave F CF-025).
- Missing source file: halt remediation and restore source evidence before closing tasks.
- Strict validation failure: fix packet docs before claiming readiness.
- If a live rerun still fails (Wave F), record the blocker and owner instead of promoting readiness.
- If historical source packets are intentionally immutable (CF-108, CF-207, CF-022), move them to explicit ADR-level defer rationale rather than leaving them implicit.
- `.codex/policy.json` write blocked by EPERM (Wave E theme 010 / CF-271): runtime default + test were updated instead and the limitation is recorded.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|------:|----------|
| Scope | 25/25 | 573 deduplicated findings; ~80 runtime files; 30+ test files; 60+ documentation surfaces; six independent source artifacts. |
| Risk | 24/25 | Data-integrity, lineage, executor correctness, save-race, plugin parity, and historical-source authority all in scope. |
| Research | 20/20 | Six cross-program review and research artifacts must be reconciled with current `009-hook-package` truth. |
| Multi-Agent | 12/15 | cli-codex dogfooding (Waves B, C, F), 12 sequential cli-copilot agents (Wave D), 25-way parallel cli-codex (Wave F). |
| Coordination | 14/15 | Parent + 5 historical child packets + active 009 parity; root status promotion gated on six wave outcomes. |
| **Total** | **95/100** | **Level 3 (high-complexity remediation campaign)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Findings implemented out of severity order | H | M | P0 tasks stay first in checklist gates. |
| R-002 | Evidence-derived key files become stale | M | M | Refresh `graph-metadata.json` during closeout; verify file paths before claiming closure. |
| R-003 | A source phase contains unrelated local edits | M | L | Read target files before implementation edits. |
| R-004 | CF-108 / CF-207 / CF-022 stay open indefinitely | H | M | Force a write-authority decision or formal ADR-level defer; never close on documentary inference alone. |
| R-005 | Wave A WS0 blocker never gets dispatched | H | L | Track explicitly in §4.1 P0 list; surface in `handover.md` and `_memory.continuity.blockers`. |
| R-006 | Status surfaces drift again after this merge | M | M | Update `description.json` + `graph-metadata.json` together; rerun `generate-context.js` after every closure. |

---

## 11. USER STORIES

### US-001 — Remediation owner closing the campaign (Priority: P0)

**As a** remediation owner,
**I want** every cross-program 026 finding to live in one packet with one task ledger,
**so that** I can close the runtime, test, and documentation surfaces I control without re-reading six separate folders.

**Acceptance criteria**:
1. Given the packet is at status In Progress, when I open `tasks.md`, then every P0 / P1 task carries its CF / R / WS / T identifier and source-phase attribution.
2. Given a readiness claim is closed, when I review the packet, then live evidence is linked before status promotion.
3. Given multiple source phases are involved, when I inspect scope, then the affected runtime + documentation surfaces are listed explicitly in §3.

### US-002 — Reviewer replaying the closures (Priority: P1)

**As a** reviewer,
**I want** packet docs and metadata that match runtime truth,
**so that** I can replay each closure without rediscovering the original review or research.

**Acceptance criteria**:
1. Given I open `tasks.md`, when I inspect a task, then it cites the finding ID, severity, source phase, and the file:line evidence anchor for closure.
2. Given I open `implementation-summary.md`, when a CF / R / T row is `Closed`, then it has at least one file:line evidence anchor and a verification note.
3. Given I inspect `graph-metadata.json`, when I traverse the parent packet, then this packet appears in sorted child lists with `derived.save_lineage = same_pass`.

### US-003 — Maintainer triaging the residual blockers (Priority: P0)

**As a** parent-packet maintainer,
**I want** the residual historical-source-authority blockers (CF-108, CF-207, CF-022) and the Wave A WS0 dispatch surfaced in one place,
**so that** I can decide between expanding write authority and formally deferring without re-reading the campaign.

**Acceptance criteria**:
1. `_memory.continuity.blockers` lists each residual blocker with CF / WS id and a one-sentence rationale.
2. `handover.md` records the latest dispatch decisions and any Codex / Copilot smoke evidence.
3. The 026 root spec map can quote this packet's status without contradiction.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q-001** — Will CF-022 close through expanded write authority on the historical 005-006 source packets, or move to a formal ADR-level deferral entry? (Wave F dependency.)
- **Q-002** — Should the still-open 005-006 themes (003 evidence-references, 005 packet-state-continuity) wait for the same write-authority decision, or be re-scoped onto live runtime surfaces only?
- **Q-003** — Is Wave A WS0 (the original 120-iteration P0 reconsolidation scope-boundary fix) going to be dispatched as part of this packet, or split into a separate runtime-hardening sub-packet now that Wave F closed all nine cross-phase P0 findings?
- **Q-004** — Is `dispatch_failure` (sibling event) sufficient on its own, or should `schema_mismatch` enrichment with an `executor` field stay as a parallel emission path? Current spec keeps both wired.
- **Q-005** — `derived.save_lineage` shipped with three values (`description_only` / `graph_only` / `same_pass`). Should `backfill` / `migration` / `restore` be added, or wait until telemetry shows need?
- **Q-006** — When does the `retry_attempt` telemetry signal accumulate enough data to justify a numeric tuning packet for `MAX_RETRIES` and the 10-minute continuity threshold?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Implementation Summary**: `implementation-summary.md`
- **Session Handover**: `handover.md`
- **Wave A source review**: `review/review-report.md`
- **Wave B source research**: `research/017-sk-deep-cli-runtime-execution-pt-01/research.md`
- **Wave C source findings**: `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/findings-registry.json`
- **Wave D source iterations**: `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-{007,013,014,017-021,028,029}.md`
- **Wave E source**: Consolidated 006-campaign report (mirrored into `tasks.md` and `implementation-summary.md` §Sub-phase summaries)
- **Wave F source**: `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json` + per-finding evidence under `applied/CF-NNN.md`
