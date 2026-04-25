---
title: "Implementation Summary: Code Graph Doctor Command [system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/implementation-summary]"
description: "Phase A diagnostic-only /doctor:code-graph command shipped: command markdown + auto + confirm YAML workflows + user-facing install guide + Doctor Commands section update. Phase B (apply mode) explicitly gated on research packet 007."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
trigger_phrases:
  - "code graph doctor command implementation"
  - "/doctor:code-graph implementation"
  - "006-code-graph-doctor-command implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command"
    last_updated_at: "2026-04-25T20:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase A diagnostic-only command shipped"
    next_safe_action: "Run /spec_kit:deep-research:auto to unblock Phase B"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "graph-metadata.json"
      - "description.json"
    session_dedup:
      fingerprint: "sha256:0260000000007006000000000000000000000000000000000000000000000099"
      session_id: "006-code-graph-doctor-command-impl"
      parent_session_id: "026-phase-root-flatten-2026-04-21"
    completion_pct: 100
    open_questions:
      - "Phase B promotion: requires research packet 007 to produce verification battery + staleness model + recovery playbook + exclude-rule confidence tiers"
    answered_questions:
      - "Phase A is diagnostic-only with no mutations"
      - "Mirrors doctor_skill-advisor pattern for command markdown structure"
      - "Bloat-dir defaults are placeholder; authoritative tiers come from 007"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-code-graph-doctor-command |
| **Completed** | 2026-04-25 (Phase A only) |
| **Level** | 2 |
| **Phase A status** | Shipped |
| **Phase B status** | Deferred (gated on research packet 007) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now run `/doctor:code-graph:auto` to audit your code-graph index health and get a markdown report listing stale files, missed files, and bloat-dir candidates with proposed exclude-rule recommendations. The command runs in 3 phases (Discovery → Analysis → Proposal-as-report) and never modifies any source files. Before this packet, code-graph operators had to manually inspect `code_graph_status`, eyeball `detect_changes`, and grep for bloat dirs. Now the workflow is one command.

### `/doctor:code-graph` slash command

The command markdown lives at `.opencode/command/doctor/code-graph.md` and follows the established sk-doc Mode-Based template plus the spec_kit family convention used by `/doctor:skill-advisor`. Frontmatter declares `argument-hint: "[:auto|:confirm] [--scope=stale|missed|bloat|all]"` and the `allowed-tools` list includes the `code_graph_*` MCP tools (status, query, context, detect_changes) plus standard Read / Bash / Grep / Glob.

### Auto and confirm YAML workflows

Both YAML files in `.opencode/command/doctor/assets/` describe the same 3-phase pipeline. The `_confirm.yaml` adds one approval gate at `pre_phase_2 (Proposal)` so the user can review the analysis before the report is generated; `_auto.yaml` runs end-to-end with self-validation. Both files declare `mutation_boundaries.allowed_targets: []` (the empty list) — a structural assertion that Phase A produces zero mutations outside packet scratch.

### User-facing install guide

`.opencode/install_guides/SET-UP - Code Graph.md` provides a copy-paste AI-first prompt, prerequisite checklist, scope flag table, the 3-phase diagram, troubleshooting matrix, and a clear note that Phase B (apply mode) is gated on research packet 007.

### Doctor Commands section update

`.opencode/README.md` Section 5 now lists 4 doctor commands (mcp_install, mcp_debug, skill-advisor, code-graph). Counts updated to 23 commands / 32 YAML assets.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/command/doctor/code-graph.md` | Created | Command markdown definition |
| `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml` | Created | Autonomous 3-phase diagnostic workflow |
| `.opencode/command/doctor/assets/doctor_code-graph_confirm.yaml` | Created | Interactive workflow with one pre_phase_2 approval gate |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Created | User-facing diagnostic guide |
| `.opencode/README.md` | Modified | Doctor Commands section: 3 → 4 commands; counts 22/30 → 23/32 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/spec.md` | Modified | Initial create + checkbox completion + reference path normalization |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/plan.md` | Modified | Initial create + checkbox completion |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/tasks.md` | Modified | All 15 tasks marked `[x]` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/checklist.md` | Modified | All 19 checklist items marked `[x]` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/implementation-summary.md` | Created | This file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authoring happened in parallel with the sibling research packet 007 deep-research loop. While the cli-copilot-driven research runner started its 7-iteration investigation in the background, this packet's command markdown + both YAMLs + install guide + parent doc updates were authored directly via Write/Edit. Both YAMLs were syntax-validated via `python3 yaml.safe_load`, the new command was confirmed visible in the runtime skills list as `doctor:code-graph`, and strict spec-folder validation passed cleanly with 0 errors and 0 warnings. The Phase A read-only invariant was structurally enforced via empty `mutation_boundaries.allowed_targets`; Phase B promotion is documented as gated on the research packet's verification battery output.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship Phase A as diagnostic-only first | Code-graph regressions are silent — an over-aggressive exclude rule drops canonical symbols without test coverage. Without a verification battery (which research packet 007 will produce), apply mode would lose recall undetectably. Phase A gives operators the diagnostic value immediately while the research loop produces the safety surface for Phase B |
| Mirror doctor_skill-advisor 5-phase pattern but with 3 phases in Phase A | The skill-advisor pattern (Discovery → Analysis → Proposal → Apply → Verify) maps cleanly. Phase A drops Phase 3 + Phase 4 entirely; the YAML structurally documents the Phase B promotion gate so the architecture is explicit |
| Empty `mutation_boundaries.allowed_targets` in both YAMLs | Structural invariant: Phase A cannot mutate even if a future edit accidentally adds an apply step — the validator would refuse |
| Single `pre_phase_2` approval gate in confirm mode | Interactive mode benefits from one human check (between analysis and report generation) without the heavier 4-gate pattern that mutation workflows need |
| Bloat-dir defaults as placeholders | The authoritative tier definitions come from research packet 007's `assets/exclude-rule-confidence.json`. Phase A documents this gate and uses common-sense defaults (node_modules, __pycache__, .git, dist, build) until 007 finishes |
| Use packet-local scratch for the diagnostic report | Mirrors the skill-advisor proposal-path convention: repo-local, gitignored, umask 077; never `/tmp` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both YAML workflows parse via `python3 yaml.safe_load` | PASS |
| Command markdown frontmatter parses (description, argument-hint, allowed-tools) | PASS |
| Command appears in runtime skill list as `doctor:code-graph` | PASS — visible in skills list after creation |
| Strict spec-folder validation on `006-code-graph-doctor-command/` | PASS — 0 errors, 0 warnings |
| `mutation_boundaries.allowed_targets` is empty `[]` in both YAMLs | PASS — Phase A invariant |
| `description.json` + `graph-metadata.json` present | PASS |
| Cross-references to research packet 007 present in spec, plan, command markdown | PASS |
| Install guide DQI baseline | not yet measured (future addition) |
| End-to-end smoke test (`/doctor:code-graph:auto` against this repo) | DEFERRED — first invocation will run after merge |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase B (apply mode) is now unblocked but not yet implemented.** Research packet 007 converged 2026-04-25 and shipped the four prerequisite assets (verification battery, staleness model, recovery playbook, exclude-rule confidence tiers). This packet remains Phase A diagnostic-only; a follow-up packet (e.g. `008-code-graph-doctor-apply`) would consume the 007 outputs to add the apply mode + verification battery harness + auto-rollback flow.

2. **Bloat-dir tier definitions are now defined upstream.** The auto and confirm YAMLs still use placeholder tiers; the authoritative tiers now live in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/exclude-rule-confidence.json`. Promoting Phase A's defaults to use that file is a cheap follow-up.

3. **Staleness threshold model now defined upstream.** Phase A still reports stale files via `detect_changes` without `fresh` / `soft-stale` / `hard-stale` classification. The threshold model is now materialized at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/staleness-model.md`; a Phase A.5 update could surface those tiers in the diagnostic report.

4. **Verification battery now defined upstream.** The 28-query gold battery is materialized at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/code-graph-gold-queries.json` with `pass_policy` (≥90% overall, ≥80% per edge-focus). Running it requires a harness that drops a canonical symbol via exclude rule, re-scans, and counts query mismatches — that harness is the Phase B work item.

5. **MCP tool fallback paths not exhaustively tested.** The YAMLs document fallback to `git status` + glob comparison if `code_graph_status` or `detect_changes` are unavailable, but those fallback paths have not been smoke-tested against a real degraded state.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
