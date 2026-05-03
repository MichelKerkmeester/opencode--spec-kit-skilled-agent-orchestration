---
title: "Plan: 065/002 — skill-router-stress-tests"
description: "6 CP scenarios × 3 CLI executors = 18 executions. Aggregated test report mirroring 060/004."
trigger_phrases: ["065/002 plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Plan scaffolded"
    next_safe_action: "wait_for_001_GO_then_execute_T-001"
    blockers:
      - "Blocked until 001-skill-reindex Complete with GO signal"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0650020000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-065-002-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 065/002 — skill-router-stress-tests

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author 6 CP-XXX scenarios across 6 categories (ambiguous, false-positive, low-confidence, multi-skill, novel-phrasing, adversarial). Dispatch each to 3 external CLI executors (cli-copilot, cli-codex, cli-gemini). Aggregate into test-report.md mirroring 060/004 structure. Classify findings P0/P1/P2.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- 6 CP scenarios authored under `scenarios/`
- 18 result files captured under `results/` (or documented timeout/exclusion)
- Per-CP verdict assigned (PASS/WARN/FAIL) with grep-checkable pass criteria
- test-report.md follows 060/004 structure with methodology + lessons + recommendations
- Strict validator passes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Read-only stress-test campaign — does NOT modify skill content or router algorithm. Pattern mirrors 060/004 (`@code` agent stress test) and 062 (`@deep-research` / `@deep-review` cross-architecture validation), retargeted from agent-body discipline to skill-router routing efficiency. Each CP runs across 3 executors for cross-runtime cross-validation: 2/3 agreement = PASS, 1/3 = WARN, 0/3 = FAIL.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps |
|---|---|
| P1 | Pre-condition: verify 001-skill-reindex Complete with GO signal |
| P2 | Author scenarios CP-100..CP-105 (one per category A/B/C/D/E/F) |
| P3 | Dispatch matrix: 6 scenarios × 3 executors = 18 executions; capture to `results/CP-NNN-<executor>.json` |
| P4 | Score: apply pass criteria, tally PASS/WARN/FAIL |
| P5 | Aggregate: write `test-report.md` (header + methodology + per-CP table + aggregate + lessons + recommendations) |
| P6 | Verify: walk checklist, fill implementation-summary, run strict validator |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The CP scenarios ARE the tests. Each scenario specifies grep-checkable pass criteria (skill name match + numeric confidence threshold). Scoring is deterministic (no LLM-as-judge). Cross-executor agreement (2/3 minimum for PASS) reduces single-shot dispatch noise. Adversarial CP-105 separately tagged for analysis.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 001-skill-reindex (HARD BLOCK — fresh index required)
- External CLIs: cli-copilot, cli-codex, cli-gemini (per memory rules: 3-concurrent cap on copilot, codex requires stdin pipe + service_tier=fast, gemini single-model)
- MCP tool `advisor_recommend` for confidence scoring
- 060/004 test-report.md as structural reference for output format
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Read-only campaign — no rollback needed for the codebase. If results indicate router regression: open follow-on packet 066 to investigate root cause. If executor instability dominates results: re-run only the failed CP with bumped timeout (900s).
<!-- /ANCHOR:rollback -->
