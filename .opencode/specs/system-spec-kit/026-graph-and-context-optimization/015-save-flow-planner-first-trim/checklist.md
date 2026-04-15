---
title: "Verification Checklist: Save Flow Planner-First Trim"
description: "Verification Date: 2026-04-15"
trigger_phrases:
  - "015-save-flow-planner-first-trim"
  - "verification checklist"
  - "planner-first save"
  - "save flow trim"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored Level 3 docs scaffold from 014 research findings"
    next_safe_action: "Review packet; run 3 transcript prototypes"
    blockers: []
    key_files:
      - "checklist.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-save-flow-planner-first-trim-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Save Flow Planner-First Trim

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim implementation ready until complete |
| **P1** | Required | Must complete or receive explicit deferral approval |
| **P2** | Optional | May defer with written rationale and follow-up owner |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `spec.md` states planner-first default behavior and explicit fallback mode.
- [ ] CHK-002 [P0] `plan.md` maps M1-M5 to planner-first work, four hot-path trims, and regression verification.
- [ ] CHK-003 [P0] `tasks.md` contains 25-40 atomic tasks with real file paths and dependencies.
- [ ] CHK-004 [P0] Packet 014 research verdict `trim-targeted` is cited as the upstream decision basis.
- [ ] CHK-005 [P0] The load-bearing core is preserved in the packet docs: canonical atomic writer, routed identity, routing contract, and thin continuity validation.
- [ ] CHK-006 [P0] The four over-engineered trim targets are named consistently across spec, plan, tasks, and ADRs.
- [ ] CHK-007 [P1] The seven partial-value subsystems are explicitly described as follow-up, fallback-only, or standalone concerns.
- [ ] CHK-008 [P1] Packet docs name the three real transcript prototype requirement before implementation start.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Planner-default path is non-mutating in `memory-save.ts`.
- [ ] CHK-011 [P0] Full-auto fallback still routes through canonical atomic preparation and rollback.
- [ ] CHK-012 [P1] Shared planner schema types exist and are reused by handler and CLI code.
- [ ] CHK-013 [P1] `content-router.ts` keeps the eight canonical categories.
- [ ] CHK-014 [P1] Default-path Tier 3 routing is disabled or gated explicitly.
- [ ] CHK-015 [P1] `quality-loop.ts` no longer performs auto-fix retries on the default path.
- [ ] CHK-016 [P1] `save-quality-gate.ts` still blocks malformed saves via structural rules.
- [ ] CHK-017 [P1] Reconsolidation and post-insert enrichment are explicit opt-in or standalone paths.
- [ ] CHK-018 [P1] `workflow.ts` no longer performs unconditional reindex or graph refresh for planner-default saves.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `mcp_server/tests/memory-save.vitest.ts` passes with planner-default and fallback scenarios.
- [ ] CHK-021 [P0] `mcp_server/tests/memory-save-integration.vitest.ts` passes for end-to-end planner and fallback behavior.
- [ ] CHK-022 [P0] `mcp_server/tests/content-router.vitest.ts` passes with Tier 3 disabled by default.
- [ ] CHK-023 [P0] `mcp_server/tests/quality-loop.vitest.ts` passes for advisory-only default behavior.
- [ ] CHK-024 [P0] `mcp_server/tests/save-quality-gate.vitest.ts` passes with hard blockers preserved.
- [ ] CHK-025 [P0] `mcp_server/tests/reconsolidation-bridge.vitest.ts` passes with explicit opt-in behavior.
- [ ] CHK-026 [P0] `mcp_server/tests/thin-continuity-record.vitest.ts` passes unchanged continuity validation expectations.
- [ ] CHK-027 [P1] `scripts/tests/generate-context-cli-authority.vitest.ts` passes with planner-default CLI behavior.
- [ ] CHK-028 [P1] `scripts/tests/graph-metadata-refresh.vitest.ts` passes for explicit follow-up refresh behavior.
- [ ] CHK-029 [P1] `mcp_server/tests/memory-save-ux-regressions.vitest.ts` passes for readable operator-facing planner output.
- [ ] CHK-030 [P1] Three real session transcripts are prototyped and reviewed before implementation starts.
- [ ] CHK-031 [P2] Transcript prototypes show zero unexpected `drop` or wrong-anchor outcomes.
- [ ] CHK-032 [P2] Follow-up actions for indexing and graph refresh are surfaced consistently in every relevant planner result.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-033 [P2] No new network dependency is introduced on the default save path.
- [ ] CHK-034 [P2] Planner output does not expose unsafe file targets outside canonical spec-doc surfaces.
- [ ] CHK-035 [P2] Explicit fallback flags are documented without silently widening privilege or mutation scope.
- [ ] CHK-036 [P2] Continuity upserts still rely on the validated thin-continuity helpers rather than raw YAML string edits in runtime code.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` use the correct Level 3 templates and preserve anchors.
- [ ] CHK-041 [P1] `/memory:save` command docs describe planner-first default behavior, fallback mode, and follow-up freshness actions.
- [ ] CHK-042 [P1] `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` and command docs agree on flag names and defaults.
- [ ] CHK-043 [P1] Source citations in `spec.md` and `plan.md` reference actual code or research file paths used by packet 014.
- [ ] CHK-044 [P2] Any follow-up backlog discovered during transcript prototypes is recorded in packet docs instead of lost in commentary.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] New tests are placed under existing `mcp_server/tests/` or `scripts/tests/` folders with names matching repo conventions.
- [ ] CHK-051 [P1] Transcript prototype artifacts live under packet-local `scratch/` and are excluded from canonical packet docs unless summarized.
- [ ] CHK-052 [P1] No retired `[spec]/memory/*.md` write-path logic is reintroduced as part of the refactor.
- [ ] CHK-053 [P2] Any new helper code stays adjacent to save-path ownership files instead of creating a second save subsystem.
<!-- /ANCHOR:file-org -->

---

### Quality/Consistency

- [ ] CHK-060 [P0] Planner output names the same target doc and anchor that the fallback path would use.
- [ ] CHK-061 [P0] Same-path identity and continuity semantics stay deterministic after the refactor.
- [ ] CHK-062 [P1] All four trim targets are described the same way across spec, plan, tasks, checklist, and ADRs.
- [ ] CHK-063 [P1] All seven deferred subsystems are described the same way across spec, plan, tasks, and docs.
- [ ] CHK-064 [P1] Milestone labels M1-M5 match between `plan.md` and `tasks.md`.
- [ ] CHK-065 [P1] Requirement IDs referenced by the checklist still exist in `spec.md`.
- [ ] CHK-066 [P2] Success criteria remain measurable and map to real tests or transcript prototypes.

---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Verified |
|----------|-------|----------|
| **P0** | 16 | [ ]/16 |
| **P1** | 19 | [ ]/19 |
| **P2** | 10 | [ ]/10 |

**Verification Date**: 2026-04-15
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] `decision-record.md` contains ADR-001 through ADR-005 with Proposed status.
- [ ] CHK-101 [P1] Each ADR includes Context, Decision, Consequences, Alternatives, and Related ADRs.
- [ ] CHK-102 [P1] ADR alternatives considered include at least one rejected full-auto or keep-as-is option.
- [ ] CHK-103 [P2] ADR consequences include both operator ergonomics and fallback-safety tradeoffs.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Default planner path removes synchronous Tier 3, reconsolidation, enrichment, graph refresh, and reindex work.
- [ ] CHK-111 [P1] Planner response payload remains bounded enough for the current MCP response envelope.
- [ ] CHK-112 [P2] Any retained fallback-only side effects are explicitly documented as not part of default-path latency.
- [ ] CHK-113 [P2] Transcript prototype timing notes do not reveal new pathological latency on the planner path.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure in `plan.md` includes milestone-level triggers.
- [ ] CHK-121 [P0] Feature-flag defaults are defined before runtime changes land.
- [ ] CHK-122 [P1] Follow-up commands for indexing and graph refresh are documented for operators.
- [ ] CHK-123 [P1] Fallback usage guidance is documented for operators who still want end-to-end mutation.
- [ ] CHK-124 [P2] Transcript-prototype review is complete before packet status changes from Draft.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No docs or code claim that planner mode mutates files.
- [ ] CHK-131 [P1] No docs or code claim that default-path trimming removes the atomic fallback entirely.
- [ ] CHK-132 [P2] Any feature-flag examples use the same names across docs and tests.
- [ ] CHK-133 [P2] Packet docs do not contradict `AGENTS.md` or `.opencode/skill/system-spec-kit/SKILL.md` on continuity ownership rules.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet docs are synchronized after edits.
- [ ] CHK-141 [P1] Every packet doc passes `validate_document.py`.
- [ ] CHK-142 [P2] Packet docs remain placeholder-free after validation fixes.
- [ ] CHK-143 [P2] Packet docs include enough detail for implementation to begin without reopening packet 014 research.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator review pending | Technical Lead | [ ] Approved | |
| Operator review pending | Product Owner | [ ] Approved | |
| Operator review pending | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
