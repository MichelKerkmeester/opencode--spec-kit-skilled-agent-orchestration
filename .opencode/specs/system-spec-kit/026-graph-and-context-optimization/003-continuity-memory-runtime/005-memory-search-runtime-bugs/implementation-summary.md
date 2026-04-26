---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/implementation-summary]"
description: "Findings-only packet — implementation deferred to follow-up remediation packet. Captures bug catalog, root-cause clusters, and reproduction probes for /memory:search runtime defects."
trigger_phrases:
  - "005-memory-search-runtime-bugs implementation"
  - "memory search runtime findings packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs"
    last_updated_at: "2026-04-26T14:33:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Captured findings; remediation deferred to follow-up packet"
    next_safe_action: "Schedule remediation packet to consume Cluster 1-7 from plan.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions:
      - "Truncation root cause: estimator inflation vs unconditional stub-replace"
      - "Intent classifier authority: meta.intent vs data.queryIntentRouting"
      - "Edge type schema: are enabled/contradicts/derived_from implemented?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-memory-search-runtime-bugs |
| **Completed** | 2026-04-26 (findings only) |
| **Level** | 1 |
| **Status** | Findings captured; remediation deferred |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A findings-only spec packet documenting 17 defects in the `/memory:search` command runtime, observed during a live conversation and confirmed via direct MCP probes. Defects are organized into 4 P0 (correctness), 7 P1 (degraded signal), and 6 P2 (refinement) requirements (REQ-001 through REQ-017). The plan groups them into 7 root-cause clusters; tasks decompose each cluster into work units for a follow-up remediation packet.

### Headline Defects

- **Truncation drops results to zero at 2% budget usage** — `memory_context({input:"Semantic Search"})` reports `actualTokens:71 / budgetTokens:3000`, yet `data.content` returns `count:0,results:[]` with `truncated:true`.
- **Intent classifier returns `fix_bug` for "Semantic Search"** at confidence 0.098 — spec §4A documents `understand` as the no-match fallback.
- **Dual-classifier dissonance** — same response carries `meta.intent.type = "fix_bug"` (0.098) AND `data.queryIntentRouting.queryIntent = "semantic"` (0.8); no documented resolution policy.
- **Vocabulary violation** — render output used "Auto-triggered memories" — explicitly forbidden by spec §4A Step 4b.
- **`causal-stats` returns 3 of 6 relation types**, reports `health: "healthy"` while `meetsTarget: false`.
- **Lopsided graph growth** — 344 new edges in 15 minutes, 100% `supersedes`; `caused`/`supports` stagnate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Create | Bug catalog with REQ-001..017 and live probe evidence |
| `plan.md` | Create | 7 root-cause clusters with change surface and verification per cluster |
| `tasks.md` | Create | Findings-packet tasks (T0.1-T0.7) + deferred remediation tasks (T1-T7) |
| `implementation-summary.md` | Create | This file |
| `description.json` | Create | Memory-indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read the canonical command spec at `.opencode/command/memory/search.md` to establish the contract.
2. Reviewed the conversation transcript for observable defects.
3. Ran live MCP probes (`memory_context`, `memory_causal_stats`) to confirm and expand the defect set with hard evidence.
4. Cross-referenced each defect against the spec to separate contract violations from undocumented gaps.
5. Clustered defects by suspected root cause to enable independent remediation.
6. Captured every probe's literal output in `spec.md` §8 so regressions can be detected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Findings-only packet | Remediation crosses 7 surfaces in `mcp_server/`; bundling them risks scope creep. A separate packet can sequence Phase A/B/C from `plan.md`. |
| Capture probe literals in `spec.md` §8 | Future runs can diff against the recorded output to confirm fix or regression. |
| Cluster by root cause, not by severity | Defects sharing a root cause (e.g., REQ-001/004/016 all flow from intent classifier) are easier to fix together. |
| 17 separate REQs even when clustered | Granular IDs let tasks reference exact acceptance criteria; clustering happens in plan.md. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 17 defects map to a REQ ID | PASS |
| Each REQ has a falsifiable acceptance criterion | PASS |
| Probe evidence captured verbatim | PASS — see spec §8 |
| Validation via `validate.sh --strict` | PENDING — runs at packet close |
| Sibling cross-references resolve | PASS — siblings are 001-cache-warning-hooks, 002-memory-quality-remediation, 003-continuity-refactor-gates, 004-memory-save-rewrite |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No remediation in this packet.** All 7 clusters are deferred to a follow-up packet. This packet exists to capture findings while they are fresh; consuming the catalog requires a separate code-changing packet.
2. **Probes are timestamp-bound.** Causal-graph edge counts grow continuously; regression detection should use coverage percent and presence-of-relation-type rather than absolute counts.
3. **Some defects may share root causes not yet identified.** Cluster 2 may be fully explained by a single classifier-threshold fix; Cluster 1 may be one line in the budget enforcement wrapper. Until the source is read, clustering is informed-guess based on observable behavior.
4. **CocoIndex daemon health was not directly probed.** REQ-012 is based on the conversation transcript reporting daemon-not-running; verify the daemon's actual state before remediation.
<!-- /ANCHOR:limitations -->
