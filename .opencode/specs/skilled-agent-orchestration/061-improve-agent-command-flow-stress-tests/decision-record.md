<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
---
title: "Decision Record: 061"
description: "4 ADRs."
trigger_phrases: ["061 ADRs"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T15:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored 4 ADRs"
    next_safe_action: "Begin Stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Decision Record: 061

<!-- SPECKIT_LEVEL: 3 -->

## ADR-1: Per-CP layer partition (not single-shape suite)

**Decision:** CP-041 + CP-042 stay body-level; CP-040 + CP-043 + CP-044 + CP-045 use command-flow dispatch.

**Why:** Per 060/003 research §4 — discipline lives at different layers per scenario. Forcing one shape on all 6 either misses body-level tests (CP-041/042) or under-tests command-level tests (CP-040/043/044/045). Partition matches owning layer.

## ADR-2: Reuse CP-040..045 IDs for active corrections

**Decision:** Modify the existing playbook files (013-018) in-place rather than creating CP-046..051.

**Why:** Per 060/003 research §11 — successor IDs reserved for spec-local experiments or explicit archival. These are active corrections to the same scenario claims; reusing the IDs preserves the cross-reference history.

## ADR-3: Command-capable temp project root (not just --add-dir)

**Decision:** Build `/tmp/cp-061-sandbox/` with a real `.opencode/` skeleton that lets `/improve:agent` resolve all relative paths.

**Why:** Per 060/003 research §5 062 sketch — `--add-dir /tmp/...` against an empty sandbox under-specifies the command's path assumptions. Real project skeleton required.

## ADR-4: Honest verdict reporting (not score-massaging)

**Decision:** R1 results documented as-is. R2 only if targeted edit can close a gap; otherwise honest gap documentation in test-report.

**Why:** Same discipline as 060/002 — score-massaging defeats the purpose of stress testing. Real PASS at honest count > forced PASS at inflated count.
