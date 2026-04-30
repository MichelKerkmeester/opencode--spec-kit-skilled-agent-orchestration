---
title: "Implementation Summary: 049 Runtime Command Agent Alignment Review"
description: "Runtime command and agent docs were audited and aligned against current tool, hook, path, and evergreen rules, with blocked Codex TOML drift recorded explicitly."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "049-runtime-command-agent-alignment-review"
  - "runtime command audit"
  - "agent alignment review"
  - "cross-runtime agent consistency"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/049-runtime-command-agent-alignment-review"
    last_updated_at: "2026-04-30T07:45:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Validation passed"
    next_safe_action: "Orchestrator commit"
    blockers:
      - ".codex/agents writes blocked by sandbox EPERM"
    key_files:
      - "audit-findings.md"
      - "remediation-log.md"
      - "cross-runtime-diff.md"
    session_dedup:
      fingerprint: "sha256:049-runtime-command-agent-alignment-review-summary"
      session_id: "049-runtime-command-agent-alignment-review"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 049-runtime-command-agent-alignment-review |
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The command and agent runtime docs now line up with the current tool surface, hook matrix, Node floor, code-graph apply contract, advisor rebuild path, retention sweep tool, runtime directory rules, and evergreen-doc discipline. Codex TOML agent drift is visible rather than swept under the rug: the files are present, but this sandbox denied writes to them.

### Runtime Alignment

Updated OpenCode, Claude, and Gemini agents so hook-injected context references the runtime startup/bootstrap matrix instead of over-naming Claude. Orchestrators now state the runtime directory resolution rule, and write agents now carry the evergreen-doc rule.

### Command Alignment

Updated `/doctor:mcp_install`, `/doctor:code-graph`, `/doctor:skill-advisor`, `/memory:save`, `/memory:search`, and `/memory:manage` to reflect the current Node floor, code-graph apply/manual contract, `advisor_rebuild`, and `memory_retention_sweep`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/command/doctor/*` | Modified | Refresh Node floor, code-graph, and advisor rebuild claims |
| `.opencode/command/memory/*` | Modified | Surface retention sweep lifecycle |
| `.opencode/command/spec_kit/assets/*deep*.yaml` | Modified | Replace stale authority-guard packet prose |
| `.opencode/agent/*.md` | Modified | Align hook, directory, evergreen, and phase wording |
| `.claude/agents/*.md` | Modified | Mirror writable agent fixes |
| `.gemini/agents/*.md` | Modified | Mirror writable agent fixes |
| Packet docs and reports | Created | Audit, remediation, cross-runtime, and validation record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit started with command and agent discovery, then checked canonical sources before edits. Fixes stayed documentation-only. `.codex/agents` remediation was attempted and blocked by sandbox policy, so those findings are recorded as blocked with command output evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep YAML changes textual | The task forbids tool source/schema mutation and only needs alignment-of-docs |
| Record Codex drift as blocked | Approval policy is `never`; bypassing sandbox would be unsafe |
| Treat example spec IDs as exempt | Examples like `specs/007-auth` are format examples, not packet-history claims |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Touched command/agent stale-reference grep | PASS, no output |
| Updated-reference grep | PASS, expected `memory_retention_sweep`, `advisor_rebuild`, hook matrix, directory rule, and evergreen rule references present |
| Strict validator | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex TOML drift remains blocked.** `.codex/agents/context.toml`, `.codex/agents/deep-research.toml`, `.codex/agents/orchestrate.toml`, and `.codex/agents/write.toml` still need the documented path/hook wording fixes outside this sandbox.
<!-- /ANCHOR:limitations -->
