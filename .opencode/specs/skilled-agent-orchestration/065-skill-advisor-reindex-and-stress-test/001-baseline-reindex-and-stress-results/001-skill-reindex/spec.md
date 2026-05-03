---
title: "Spec: 065/001 — skill-reindex"
description: "Refresh skill advisor memory system: run skill graph rescan, advisor rebuild, and memory index scan; capture before/after snapshots for verification"
trigger_phrases:
  - "065/001 skill reindex"
  - "skill advisor rebuild"
  - "doctor skill-advisor"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-baseline-reindex-and-stress-results/001-skill-reindex"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded sub-phase"
    next_safe_action: "run_doctor_skill_advisor_auto"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/"
      - ".opencode/command/doctor/skill-advisor.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Spec: 065/001 — skill-reindex

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | 1 |
| Priority | P1 |
| Status | Planned |
| Created | 2026-05-03 |
| Branch | `main` |
| Parent | `065-skill-advisor-reindex-and-stress-test` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After packets 057-064 (agent template overhaul, sk-doc updates, @create agent, RELATED RESOURCES cleanup, skill router refactors), the skill advisor memory system holds stale embeddings + scoring tables. Recommendation confidence + token boosts may be miscalibrated. Sub-phase 002 cannot meaningfully stress-test routing efficiency until the index reflects current SKILL.md content + graph-metadata.json state.

The repo already ships `/doctor:skill-advisor` which is the canonical entrypoint: it analyzes skills, optimizes TOKEN_BOOSTS / PHRASE_BOOSTS / graph-metadata.json scoring tables, and re-indexes the skill graph. This sub-phase is mostly a wrapper around running it, capturing snapshots, and verifying.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pre-reindex snapshot: skill count, advisor record count, last-scanned timestamps, sample confidence scores for known prompts
- Run `/doctor:skill-advisor :auto` (or `:confirm` if operator wants gated review)
- Post-reindex snapshot: same fields
- Diff report: which skills gained/lost records, scoring-table deltas, any new/removed entries
- Validation: `mcp__spec_kit_memory__skill_graph_status` + `mcp__spec_kit_memory__advisor_status` return healthy

### Out of Scope
- Skill content authoring (this packet observes, doesn't modify)
- Advisor algorithm changes
- Stress-testing — owned by sibling sub-phase 002
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|---|---|
| REQ-001 | Pre-reindex snapshot captured + saved to `pre-snapshot.json` in this folder |
| REQ-002 | `/doctor:skill-advisor :auto` runs to completion without errors |
| REQ-003 | Post-reindex snapshot captured + saved to `post-snapshot.json` in this folder |
| REQ-004 | Diff report `reindex-diff.md` summarizes deltas (skills added/removed/changed) |
| REQ-005 | Validation gates: `skill_graph_status` returns healthy, `advisor_status` returns healthy |
| REQ-006 | Sample confidence scores: for 3-5 known prompts (e.g., "save context", "create agent", "deep research"), confidence ≥ 0.8 against expected skill |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All MCP advisor + graph status calls return healthy
- SC-002: Sample known-prompt confidence scores meet thresholds documented in REQ-006
- SC-003: Diff report committed alongside completion
- SC-004: implementation-summary.md filled with what changed in the index, any unexpected drift, and a recommendation to proceed with 002
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|---|---|---|
| Dependency | `/doctor:skill-advisor` slash command | Available in current build (confirmed via skill list) |
| Risk | MCP advisor server unreachable | Fallback: run skill_graph_scan + advisor_rebuild via direct MCP tool calls |
| Risk | Reindex changes scoring such that established routing breaks | Captured in diff report; if regression detected, halt and flag for review before 002 |
| Risk | Long-running reindex blocks session | `:auto` mode runs without gates; expect minutes-scale, not hours |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should diff report be human-readable markdown only, or also machine-parseable JSON? (Default: both — markdown for review, JSON for downstream tools)
<!-- /ANCHOR:questions -->
