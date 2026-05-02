---
title: "Decision Record: 048 Conservative Defaults"
description: "Tier gamma conservative defaults chosen for remaining P1 remediation."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "035-remaining-p1-p2-remediation"
  - "conservative defaults pass"
  - "Tier gamma defaults"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/035-remaining-p1-p2-remediation"
    last_updated_at: "2026-04-30T00:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Recorded defaults"
    next_safe_action: "Verify defaults"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-remaining-p1-p2-remediation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Decision Record: 048 Conservative Defaults

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:tier-gamma-defaults -->
## Tier Gamma Defaults

| Finding | Default chosen | Rationale | Alternative considered |
|---------|----------------|-----------|------------------------|
| 045/001-P1-1 | Remove waits from auto modes and keep confirmation behavior in confirm variants | Auto workflows promise no approval waits; status-only closeout preserves information without blocking | Keep waits and document them as soft checkpoints |
| 045/001-P1-2 | Keep `/memory:*` markdown-only | Memory commands already embed inline operating-mode contracts; adding YAML assets would be a larger architecture change | Create full memory YAML auto/confirm assets |
| 045/001-P1-3 | Plan-only-by-default for `/memory:save` | Safer with Gate 3 hard-block intent; mutation requires explicit apply or full-auto selection | Mutation-first default with dry-run flag |
| 045/002-P1-3 | Delete embedding-cache rows on retention delete | Retention deletion should remove derived semantic artifacts with the source row | Treat cache as reusable content-addressed data with TTL |
| 045/006-P1-2 | Keep `memory_save` planner inputs internal-only | Public MCP schema remains strict and visible; command planners own route-specific controls | Expose `plannerMode` and `targetAnchorId` publicly |
| 045/006-P1-3 | Extend governed-ingest validation to ingest paths | Shared governance validation now runs before ingest jobs and scans proceed when governance metadata is present | Document scan/ingest as ungoverned maintenance exceptions |
| 045/006-P1-4 | Validate args before pre-dispatch logic | Metrics, session priming, and auto-surface logic should observe parsed arguments only | Keep validation in module dispatchers only |
| 045/010-P1-3 | Grandfather legacy strict-warning packet explicitly | The legacy packet remains visible and warnings stay visible, but strict release gates do not fail on known legacy template drift | Rewrite old decision-record headings |
<!-- /ANCHOR:tier-gamma-defaults -->

---

<!-- ANCHOR:decision-impact -->
## Decision Impact

The defaults favor explicit operator intent and fail-closed validation. They keep
large architectural moves out of this packet while making the current runtime
contract clearer and safer.
<!-- /ANCHOR:decision-impact -->
