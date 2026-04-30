---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: Post-Stress Follow-Up Research — refine v1.0.2 P0/P1/P2 fix proposals"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "10-iteration deep-research loop refining actionable fix proposals for the four follow-ups surfaced by the v1.0.2 stress-test rerun (cli-copilot /memory:save Gate 3 bypass, code-graph fast-fail not testable, file-watcher debounce, CocoIndex fork telemetry leverage), plus a light architectural touch on the broader intelligence-system stack."
trigger_phrases:
  - "011-post-stress-followup-research"
  - "v1.0.2 follow-up research"
  - "post-stress follow-up research"
  - "010 deep-research follow-up"
  - "v1.0.2 P0 P1 P2 research"
  - "intelligence system seam research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research"
    last_updated_at: "2026-04-27T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet"
    next_safe_action: "T101 launch /spec_kit:deep-research:auto with cli-codex gpt-5.5 high fast"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: null
      session_id: "011-post-stress-followup-research-scaffold-2026-04-27"
      parent_session_id: "010-stress-test-rerun-v1-0-2-2026-04-27"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 010-stress-test-rerun-v1-0-2; SUCCESSOR: 012-copilot-target-authority-helper -->

# Feature Specification: Post-Stress Follow-Up Research — refine v1.0.2 P0/P1/P2 fix proposals

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft (scaffold; deep-research loop pending) |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `015-mcp-runtime-stress-remediation` |
| **Predecessor** | `../010-stress-test-rerun-v1-0-2` (v1.0.2 sweep findings + Recommendations §1-5 are this packet's source of evidence) |
| **Successor** | None (current tail) |
| **Handoff Criteria** | `research/research.md` synthesizes per-follow-up recommendations (evidence + alternatives + recommended next packet shape) for all 4 P0/P1/P2 topics; light architectural touch surfaces 1-2 named seams. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The v1.0.2 stress-test rerun closed with four follow-ups tagged in `../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5 — three concrete P0/P1/P2 bugs and one telemetry-leverage opportunity. Each is currently "tagged for follow-up" but lacks a refined fix proposal: the right intervention point, alternatives considered, falsifiable success criteria, and a recommended scope estimate for the eventual remediation packet. Without that refinement step, the follow-ups stay open indefinitely or get scoped poorly downstream.

### Purpose

Run a single 10-iteration `/spec_kit:deep-research:auto` loop with cli-codex (gpt-5.5, high reasoning, fast service tier) that converts each of the four follow-ups from "tagged" to "actionable" — and, in light secondary scope, surfaces 1-2 architectural seams in the broader intelligence-system stack that current evidence suggests would pay off in a focused refinement packet. The loop's research.md is the deliverable; per-follow-up remediation packets are downstream work the user authors after reviewing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The 4 v1.0.2 follow-ups (primary scope):

1. **(P0) cli-copilot `/memory:save` Gate 3 bypass.** I1/cli-copilot scored 2/8 in v1.0.2 (was 1/8 in v1.0.1). It auto-selects a spec folder from session-bootstrap context and writes `last_save_at` + runs `memory_index_scan` without asking. Codex and opencode honor planner-first; copilot doesn't. Investigate where the bypass originates (copilot hooks at `mcp_server/hooks/copilot/` vs the planner-first contract in `004-memory-save-rewrite/`) and recommend the minimal sufficient fix.

2. **(P1) Code-graph fast-fail not testable.** Packet 005's `fallbackDecision.nextTool` field shipped but v1.0.2 Q1 didn't exercise the weak-state path because the graph was healthy post-pre-flight. Investigate options for deterministic graph degradation (env-var toggle, mock daemon, controlled index-deletion, "graph dry-run" mode) and recommend the lowest-cost approach exercising all four `fallbackDecision` matrix branches (fresh / stale-selective / empty / unavailable).

3. **(P2) Code-graph file-watcher debounce.** Pre-flight detected 4-hour staleness. The chokidar watcher at `mcp_server/lib/ops/file-watcher.ts:49` has hardcoded `DEFAULT_DEBOUNCE_MS=2000`. Investigate watcher metrics + missed-event patterns, quantify lower-debounce vs add freshness self-check trade-offs, and recommend tuning + plumbing.

4. **(opportunity) CocoIndex fork telemetry not yet leveraged downstream.** Fork ships 7 new fields (`dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score`); v1.0.2 confirmed wire-level liveness but no consumers exist in `mcp_server/lib/search/`. Investigate which downstream sites should adopt which fields, whether `path_class` rerank is now duplicated upstream (deletion target rather than integration), and identify the highest-ROI next-leverage site.

Light secondary scope (≤20% of iterations):

5. **Intelligence-system seams.** With the 4-stack (Spec Kit Memory + Code Graph + CocoIndex fork + Skill Advisor) v1.0.2-validated, name 1-2 architectural seams that v1.0.2 didn't measure but where current evidence suggests focused refinement would pay off (candidates: cognitive decay calibration, L1 intent dispatch under vague queries, causal-edge balance). Each seam gets a one-line "why now"; full scoping is out of scope here.

### Out of Scope

- **Authoring the per-follow-up remediation packets.** Research produces evidence + recommendations; packets are downstream work the user authors.
- **Modifying any of the 003-009 remediation packets.** They're closed and frozen; research reads from them.
- **Implementation, testing, or deployment** of any fix proposed by the research. The research recommends; implementation is a separate command surface (Gate 4).
- **Re-running the v1.0.2 sweep** or any stress-test execution. Evidence comes from the existing v1.0.2 artifacts.
- **Deep architectural refactor proposals.** Light touch only — name candidates, don't scope them.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Priority | Requirement |
|----|----------|-------------|
| **REQ-001** | P0 | Loop MUST be invoked via `/spec_kit:deep-research:auto` (canonical command surface per Gate 4). Direct dispatch via Task tool or @deep-research agent is forbidden. |
| **REQ-002** | P0 | Executor MUST be `cli-codex` with `--model=gpt-5.5 --reasoning-effort=high --service-tier=fast --executor-timeout=900`. `service_tier=fast` MUST be explicit (not config default) per memory rule `feedback_codex_cli_fast_mode`. |
| **REQ-003** | P0 | Loop MUST run with `--max-iterations=10` (hard cap). Convergence may stop earlier if quality guards pass (source diversity ≥2, focus alignment, no single-weak-source). |
| **REQ-004** | P0 | research.md synthesis MUST cover all 4 v1.0.2 follow-ups (P0 cli-copilot, P1 code-graph fast-fail, P2 file-watcher, opportunity CocoIndex telemetry). Each follow-up gets evidence, root-cause hypothesis, 2-3 fix candidates with trade-offs, recommended approach, falsifiable success criteria, scope estimate, suggested next-packet shape. |
| **REQ-005** | P1 | research.md MUST surface 1-2 architectural seams in the light-secondary "intelligence-system" scope, each with one-line "why now" rationale. Full scoping not required. |
| **REQ-006** | P0 | All file paths cited in research.md MUST exist on disk (no fabrication). Citations include line numbers where specific behavior is referenced. |
| **REQ-007** | P1 | Each iteration delta JSONL record MUST include the required fields: `iteration`, `newInfoRatio`, `status`, `focus`, plus optional `graphEvents` if causal links are written. |
| **REQ-008** | P1 | Topic prompt fed to the loop MUST cite the source-of-evidence paths (`../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5; per-cell scores at `runs/*/score.md`; preflight log) so iteration prompts can ground reads in real artifacts. |
| **REQ-009** | P2 | At convergence, the workflow MUST emit resource-map.md (default behavior; not suppressed via `--no-resource-map`). |
| **REQ-010** | P2 | Parent metadata (011 phase parent's `spec.md`, `description.json`, `graph-metadata.json`, resource-map.md) MUST be updated to include this new child packet at scaffold time. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion |
|----|-----------|
| **SC-001** | Loop completes (stop reason ∈ {`converged`, `maxIterationsReached`}) without `error` or `blockedStop`. |
| **SC-002** | research.md exists at `research/research.md` and is non-empty. |
| **SC-003** | Each of the 4 P0/P1/P2 follow-ups has a labeled section in research.md with at least: evidence cited, fix candidates, recommended approach, falsifiable success criteria. |
| **SC-004** | Light architectural touch surfaces ≥1 named seam (≤2) with one-line "why now". |
| **SC-005** | Cross-reference table in research.md maps recommendations back to `010` Recommendations §1-5 + relevant `003-009` remediation packets. |
| **SC-006** | All file paths cited in research.md resolve on disk (sample-verified for ≥10 distinct paths; 0 fabrications detected). |
| **SC-007** | Parent metadata updated: `015-mcp-runtime-stress-remediation/{spec.md,description.json,graph-metadata.json,resource-map.md}` all reference the new child. |


### Acceptance Scenarios

1. **Given** the completed post stress followup research packet, **When** strict validation checks documentation traceability, **Then** the existing completed outcome remains mapped to the packet's spec, plan, tasks, checklist, and implementation summary.
2. **Given** the packet's recorded verification evidence, **When** this retrospective hygiene pass runs, **Then** no implementation verdict, completion status, or test result is changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Loop converges prematurely on a single follow-up, ignoring the other three | Synthesis is unbalanced; some follow-ups stay un-refined | Convergence quality guards require source diversity ≥2 + focus alignment; topic prompt explicitly enumerates 4 + 1 sub-topics; iteration deltas tracked per focus. |
| cli-codex MCP cancellations during iteration (observed in v1.0.2 I-cells) | Iteration produces shallow result; `newInfoRatio` low | Each iteration retries on transient failure; `--executor-timeout=900` accommodates retries. If cancellations are systemic, surface as a `blockedStop` candidate. |
| Topic prompt too vague → research.md is generic | Recommendations not actionable enough to seed remediation packets | Topic prompt cites specific files, REQ numbers, observed test results, exact field names — see `plan.md` §Topic Composition. |
| File-watcher debounce investigation lacks runtime metrics | P2 recommendation underspecified | `mcp_server/lib/ops/file-watcher.ts` exposes `filesReindexed` + `avgReindexTimeMs` counters; iteration prompts read these. |
| Convergence stops before iteration 10 with shallow per-follow-up coverage | Research underdelivers on 4-topic scope | `--convergence=0.05` is moderately strict; if early stop, iteration count + question-entropy logged in `deep-research-state.jsonl` for review. |
| CocoIndex telemetry investigation discovers fields are partially consumed (we missed) | Recommendation #4 reframes as "validate full coverage" rather than "integrate fields" | Acceptable outcome; research.md flags discovery and recommends downstream-only validation packet. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

| ID | Question | Resolution |
|----|----------|-----------|
| **Q-001** | Should the loop's research.md recommend specific commit-level fixes, or stop at "design proposal + scope estimate"? | Resolved at scaffold: stop at design proposal — implementation is downstream packet work per Gate 4. |
| **Q-002** | If the P1 (graph degradation harness) recommendation lands at a substantial scope (e.g., ≥200 LOC across multiple files), should the research.md author the next packet's scaffold inline, or just describe it? | Resolved at scaffold: describe only. New packet authoring = downstream work. |
| **Q-003** | If iteration deltas show the "intelligence-system seam" sub-topic is starved of attention (consistent <10% per-iter focus), should we extend `--max-iterations` or accept partial coverage? | Defer to user: stop at 10, surface coverage gap in research.md Limitations section. |
<!-- /ANCHOR:questions -->
