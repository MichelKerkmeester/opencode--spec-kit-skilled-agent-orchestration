---
title: "Plan: 065/001 — skill-reindex"
description: "Wrapper around /doctor:skill-advisor :auto with before/after snapshot diff."
trigger_phrases: ["065/001 plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Plan scaffolded"
    next_safe_action: "execute_T-001_through_T-010"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0650010000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-065-001-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 065/001 — skill-reindex

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three-phase wrapper around `/doctor:skill-advisor :auto`: pre-snapshot, reindex, post-snapshot + diff + verify.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `skill_graph_status` returns healthy
- `advisor_status` returns healthy
- 5 known-prompt sample confidences ≥ 0.8 against expected skill
- Diff report committed
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Wrapper sub-phase. The actual reindex work lives in the `/doctor:skill-advisor` skill (analyzes skills, optimizes TOKEN_BOOSTS / PHRASE_BOOSTS / graph-metadata.json, re-indexes the skill graph). This sub-phase adds before/after observability + verification gates so 002 can confidently consume a fresh index.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps |
|---|---|
| P1 | Pre-snapshot: `skill_graph_status` + `advisor_status` + 5-prompt sample → `pre-snapshot.json` |
| P2 | Reindex: `/doctor:skill-advisor :auto` (fallback: manual MCP call sequence) |
| P3 | Post-snapshot: same MCP calls → `post-snapshot.json` |
| P4 | Generate `reindex-diff.md`: counts, scoring deltas, per-prompt confidence table |
| P5 | Validation gates + fill `implementation-summary.md` with GO/NO-GO signal |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Sample-prompt confidence test for 5 known-good prompts: "save context", "create new agent", "deep research", "git commit", "review pull request". Each should match its expected skill at confidence ≥ 0.8 post-reindex. Fail any → HALT, do not proceed to 002.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `/doctor:skill-advisor` slash command (confirmed available)
- MCP tools: `mcp__spec_kit_memory__skill_graph_status`, `advisor_status`, `advisor_recommend`, `skill_graph_scan`, `advisor_rebuild`, `memory_index_scan`
- Spec Kit Memory MCP server reachable
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reindex is idempotent — re-running `/doctor:skill-advisor :auto` restores any drift. If scoring tables are corrupted, restore from git: `git checkout HEAD -- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scoring/*.json` and re-run.
<!-- /ANCHOR:rollback -->
