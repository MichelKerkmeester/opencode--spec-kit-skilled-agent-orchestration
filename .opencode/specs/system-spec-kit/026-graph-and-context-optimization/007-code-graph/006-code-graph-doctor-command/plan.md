---
title: "Implementation Plan: Code Graph Doctor Command [system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/plan]"
description: "Two-phase rollout: Phase A diagnostic-only command (no mutations) lands first; Phase B (apply mode) promotes after the resilience-research packet 007 produces a verification battery."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
trigger_phrases:
  - "code graph doctor command plan"
  - "006-code-graph-doctor-command plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command"
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created plan.md"
    next_safe_action: "Create remaining packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0260000000007006000000000000000000000000000000000000000000000001"
      session_id: "006-code-graph-doctor-command"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Doctor Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command files + YAML workflow definitions |
| **Framework** | OpenCode slash command system (`/doctor:*` command group) |
| **MCP Tools** | `code_graph_status`, `code_graph_query`, `detect_changes` |
| **Pattern Source** | `.opencode/command/doctor/skill-advisor.md` (5-phase pattern) |

### Overview

Deliver `/doctor:code-graph` in two phases:
- **Phase A (this packet)**: diagnostic-only command. Discovery + Analysis + Proposal-as-report. Zero mutations.
- **Phase B (deferred)**: apply mode. Phase 3 writes to a `code-graph-config.json`, triggers re-scan, runs verification battery from research packet 007. Promoted to "ready" only after research-packet findings stabilize.

Mirrors the doctor_skill-advisor pattern but with a tightened mutation surface (Phase A has none).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md done)
- [ ] Phase A vs Phase B boundaries explicit
- [ ] MCP tool dependencies confirmed available

### Definition of Done (Phase A)
- [ ] Command markdown file created with correct frontmatter
- [ ] Auto + confirm YAML workflows created and parse cleanly
- [ ] User-facing install guide created
- [ ] Doctor Commands section in `.opencode/README.md` updated
- [ ] Parent `007-code-graph/{context-index, spec, tasks}.md` updated with 006 child entry
- [ ] Strict spec validation passes 0/0
- [ ] Diagnostic report path conventions documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
OpenCode Slash Command + YAML Workflow Orchestration (mirrors `/doctor:skill-advisor` and `/doctor:mcp_install`).

### Key Components

- **Command Markdown** (the planned .opencode/command/doctor/code-graph.md (created by T001)): frontmatter + execution protocol + setup phase + reference. Supports `:auto`/`:confirm` modes plus `--scope=stale|missed|bloat|all`.
- **Auto YAML** (`doctor_code-graph_auto.yaml`): autonomous workflow. Discovery → Analysis → Proposal-as-report. No Phase 3, no Phase 4 in Phase A.
- **Confirm YAML** (`doctor_code-graph_confirm.yaml`): same phases with one approval gate at `pre_phase_2 (Proposal)`.
- **Install Guide** (`SET-UP - Code Graph.md`): AI-first prompt + prerequisite check + report-reading guide.

### Phase A Data Flow

```
User invokes /doctor:code-graph [:auto|:confirm] [--scope=N]
  → Command markdown loads
  → YAML workflow selected by mode suffix
  → Phase 0 Discovery: code_graph_status({}) + filesystem scan + bloat-dir detection
  → Phase 1 Analysis: compute stale + missed + bloat sets; cross-reference with detect_changes
  → Phase 2 Proposal: generate exclude-rule + language-filter recommendations; write report to packet scratch
  → STATUS=OK with report path
```

### Phase B (later) — Gated on Research Packet

```
[Phase A flow above]
  → Phase 3 Apply (gated; requires research-packet verification battery)
    - validate_targets: realpath + repo-relative + allowlist (config file only)
    - capture_baseline: git status -- <config>
    - generate_rollback_script
    - Edit code-graph-config.json
    - Trigger code_graph_scan
  → Phase 4 Verify
    - Run verification battery (gold-set queries) from research packet
    - Compare results pre/post; rollback on regression
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Phase A Scaffolding
- [ ] Create code-graph.md with frontmatter, argument-hint, allowed-tools (Read + Bash + Grep + Glob + code_graph_* MCP tools)
- [ ] Create `doctor_code-graph_auto.yaml` with 3 phases (Discovery, Analysis, Proposal-as-report)
- [ ] Create `doctor_code-graph_confirm.yaml` with same phases + one pre_phase_2 approval gate
- [ ] Mirror `doctor_skill-advisor_*.yaml` patterns (mutation_boundaries declared empty, scope_policy, fail_fast)

### Phase 2: Diagnostic Logic
- [ ] Phase 0 Discovery activities — list files, code_graph_status, detect_changes, bloat-dir detection
- [ ] Phase 1 Analysis activities — compute stale + missed + bloat sets, hash compare for stale
- [ ] Phase 2 Proposal activities — generate report markdown, write to packet scratch (umask 077)
- [ ] No Phase 3 in Phase A; YAML explicitly notes `phase_3_apply: skipped_in_phase_a`

### Phase 3: Documentation & Integration
- [ ] Create `SET-UP - Code Graph.md` install guide with AI-first prompt
- [ ] Update `.opencode/README.md` Doctor Commands section (add 4th doctor command)
- [ ] Update parent `007-code-graph/{context-index, spec, tasks}.md` with 006 child entry
- [ ] Cross-reference 007 research packet in spec + plan
- [ ] Run strict validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | YAML workflow validation | `python3 yaml.safe_load` |
| Integration | Command loads + runs end-to-end on real repo | OpenCode `/doctor:code-graph:auto` invocation |
| Regression | Phase A is read-only | `git status` after run shows no diffs outside packet scratch |
| Manual | Install guide follow-through | Follow `SET-UP - Code Graph.md` from clean state |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `code_graph_status` MCP tool | Internal | Green | Phase 0 falls back to filesystem-only |
| `detect_changes` MCP tool | Internal | Green | Phase 1 falls back to git status + glob |
| `code_graph_query` MCP tool | Internal | Green (Phase B only) | Phase B verification battery |
| 007-code-graph-resilience-research packet | Internal | Pending (sibling) | Phase B blocked until research output stabilizes |
| Existing `/doctor:skill-advisor` pattern | Internal | Green | Reference for 5-phase YAML structure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Phase A trigger for rollback**: not applicable (no mutations performed)
- **Phase A "rollback"**: simply delete the diagnostic report from packet scratch; no other state changes exist
- **Phase B trigger** (when added later): regression detected by verification battery, build failure, or operator decision
- **Phase B procedure** (when added later): per-run rollback script restores prior `code-graph-config.json`, optional partial re-scan to drop edges added during the bad apply run
<!-- /ANCHOR:rollback -->
