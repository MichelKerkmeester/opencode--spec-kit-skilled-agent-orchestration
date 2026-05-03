---
title: "Spec: 065 — skill-advisor-reindex-and-stress-test (phase parent)"
description: "Phase parent: (1) reindex all skills into the skill advisor memory system, (2) stress-test SKILL.md content + skill router efficiency via manual playbook scenarios using external CLIs"
trigger_phrases:
  - "065 skill advisor"
  - "skill router stress test"
  - "skill reindex"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase parent + 2 sub-phases"
    next_safe_action: "execute_001_skill_reindex"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex/"
      - ".opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests/"
    completion_pct: 0
    open_questions:
      - "Confirm executor mix for 002 (cli-copilot + cli-codex + cli-gemini all in scope?)"
    answered_questions:
      - "Sequencing: 001 (reindex) MUST run first; 002 (stress tests) consumes refreshed index"
---

# Spec: 065 — skill-advisor-reindex-and-stress-test (phase parent)

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | Phase Parent (lean trio: spec.md + description.json + graph-metadata.json) |
| Priority | P1 |
| Status | Planned |
| Created | 2026-05-03 |
| Branch | `main` |
| Sub-phases | 2 (sequential: 001 then 002) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

Two-part quality investment for the skill subsystem:

1. **Reindex** — Refresh the skill advisor memory system so SKILL.md content + metadata changes accumulated across recent packets (057-064: agent template overhaul, sk-doc updates, skill router refactors) are reflected in advisor recommendations and confidence scoring.

2. **Stress-test** — Validate that SKILL.md content quality + skill router routing efficiency are still trustworthy under adversarial / edge-case prompts. Use manual playbook scenarios dispatched via external CLIs (cli-copilot, cli-codex, cli-gemini) to surface routing drift, false-positive matches, low-confidence misses, and content gaps.

The reindex MUST run first — stress-tests against a stale index measure the wrong thing.
<!-- /ANCHOR:purpose -->

<!-- ANCHOR:children -->
## 3. SUB-PHASE CONTROL

| Order | Sub-phase | Purpose | Level |
|---|---|---|---|
| 1 | `001-skill-reindex` | Full skill graph rescan + advisor rebuild + memory index refresh | 1 |
| 2 | `002-skill-router-stress-tests` | Manual playbook CP scenarios via external CLI executors | 2 (with checklist.md) |

**Sequencing rule:** 002 BLOCKED until 001 completes successfully.
<!-- /ANCHOR:children -->

<!-- ANCHOR:scope -->
## 4. SCOPE BOUNDARY

### In scope (this parent)
- Sub-phase orchestration + sequencing
- Cross-cutting metadata (graph-metadata.json with `children_ids`, `derived.last_active_child_id` pointer)
- Roll-up implementation-summary at the end (created post-implementation per memory rule)

### In scope (children)
- 001: `skill_graph_scan`, `advisor_rebuild`, `memory_index_scan` invocations + verification
- 002: 6+ manual playbook scenarios in CP-XXX format, executor dispatch, scoring methodology

### Out of scope
- Skill content changes (this packet measures, doesn't author)
- Advisor algorithm changes (orthogonal — separate packet if needed)
- New skills (creation flows belong to `/create:sk-skill`)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA (PARENT)

- SC-001: Both sub-phases reach `Complete` status with passing strict validation
- SC-002: 001 emits a verifiable index-state snapshot (skill count, advisor record count, last-scanned timestamps)
- SC-003: 002 produces a test report mirroring 060/004 structure (PASS/WARN/FAIL counts, methodology section, lessons learned)
- SC-004: Roll-up implementation-summary at parent root summarizes findings + any follow-on packet recommendations
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Type | Item | Reason |
|---|---|---|
| Upstream | 064-agent-create | sk-doc template + @create agent landed; advisor must learn @create exists |
| Upstream | 063-sk-doc-agent-template-alignment | 40 agents had structural changes; advisor relevance scoring may have shifted |
| Tooling | `mcp__spec_kit_memory__skill_graph_scan` | Primary skill graph rescan tool |
| Tooling | `mcp__spec_kit_memory__advisor_rebuild` | Advisor index rebuild |
| Tooling | `mcp__spec_kit_memory__memory_index_scan` | Memory side refresh |
| Tooling | External CLIs (cli-copilot, cli-codex, cli-gemini) | Stress-test executors |
<!-- /ANCHOR:dependencies -->
