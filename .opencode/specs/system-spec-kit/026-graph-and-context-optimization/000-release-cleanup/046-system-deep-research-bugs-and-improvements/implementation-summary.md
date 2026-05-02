---
title: "Implementation Summary: System Deep Research — Bugs and Improvements"
description: "20-iteration deep research surfaced 82 findings (0 P0, 31 P1, 51 P2) across system-spec-kit, mcp_server, code_graph, skill_advisor; iter-001's 4 findings already remediated in packet 048."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "046-system-deep-research-bugs-and-improvements summary"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
    last_updated_at: "2026-05-01T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored final docs"
    next_safe_action: "Validate and commit"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Total findings? 82 (0 P0 / 31 P1 / 51 P2)."
      - "Were all 20 angles covered? Yes — every angle has at least 1 finding (range 1-8)."
      - "Did iter-001 findings get remediated? Yes — packet 048 (commit 267b4d7a6) closed all 4."
---

# Implementation Summary: System Deep Research — Bugs and Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 046-system-deep-research-bugs-and-improvements |
| **Completed** | 2026-05-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Twenty cli-codex `gpt-5.5` high-reasoning iterations audited the spec-kit system across four categories — production code bugs, wiring/automation, refinement opportunities, and architecture/organization. The run produced **82 findings: 0 P0, 31 P1, 51 P2**. No release-blocking P0s surfaced. Findings cluster around daemon/code-graph concurrency, silent error fallback, advisor routing correctness, code-graph staleness detection, and schema/path validation gaps. The synthesis packs all 82 findings into `research/research.md` (17 sections) plus a per-file path map in `research/resource-map.md`.

### Coverage map (20 angles, 82 findings)

| Category | Angles | Findings | Top severity |
|---|---|---:|---|
| A — Production code bugs | A1-A5 | 20 | P1 |
| B — Wiring / automation bugs | B1-B5 | 20 | P1 |
| C — Refinement / improvement opportunities | C1-C5 | 20 | P1 |
| D — Architecture / file organization | D1-D5 | 22 | P1/P2 |

### Headline findings (samples; full inventory in `research/research.md`)

- **Daemon concurrency [iter-001, A1]** — 4 findings (3 P1 + 1 P2). **Already fixed in packet 048** (commit `267b4d7a6`).
- **Code-graph SQLite contention [iter-002, A2]** — 3 findings (2 P1 + 1 P2). Per-file persistence spans multiple un-atomic write phases; SQLite lacks busy-timeout/retry policy.
- **Silent error fallback [iter-004, A4]** — 4 findings. SQLite projection failures silently fall back to filesystem; subject resolution swallows DB failures.
- **Schema validation gaps [iter-005, A5]** — 6 findings (3 P1 + 3 P2). `workspaceRoot` accepts arbitrary strings; corpus JSONL rows cast without validation; Python stdout parsed without shape check.
- **CLI orchestrator drift [iter-007, B2]** — 6 findings (3 P1 + 3 P2). cli-opencode contradicts itself on subagent dispatch; cli-copilot effort flag docs contradict CLI reference.
- **Memory MCP round-trip [iter-008, B3]** — 2 findings (P1). Causal-link parser claims `causal_links` but only matches `causalLinks`; insert count increments even when storage returns null.
- **Spec-kit validator [iter-009, B4]** — 5 findings (P1 top). Markdown link extraction misses angle-bracket links and reference definitions.
- **Code-graph staleness detection [iter-014, C4]** — 4 findings (P1 top). Broad Git HEAD triggers, missed-file detection gaps, doctor-integration drift.
- **Architecture / boundary discipline [iter-016, D1]** — 8 findings (P2 top). Most lib-internal cross-imports; lifecycle/scorer reach across boundaries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` | Created | Level 2 packet docs (decision-record optional, kept for executor rationale) |
| `description.json`, `graph-metadata.json` | Generated | Lean-trio metadata |
| `research/spec.md` (anchored findings fence) | Generated | Bounded findings sync per skill protocol |
| `research/deep-research-config.json` | Generated | Workflow config (cli-codex, gpt-5.5, high reasoning, 20 max iter, 0.01 convergence) |
| `research/deep-research-strategy.md` | Generated | 20-angle to iteration mapping |
| `research/deep-research-state.jsonl` | Generated | Externalized state log |
| `research/iterations/iteration-001.md` … `iteration-020.md` | Generated | Per-iteration narratives |
| `research/deltas/iter-001.jsonl` … (per iteration) | Generated | JSONL findings deltas |
| `research/prompts/iteration-NNN.md` × 20 + `synthesis.md` | Generated | Pre-rendered prompt packs |
| `research/logs/iter-NNN.log` × 20 + `synthesis.log` | Generated | cli-codex dispatch logs |
| `research/research.md` | Generated | 17-section synthesis (361 lines, 82 findings) |
| `research/resource-map.md` | Generated | Path-grouped resource inventory (119 lines) |
| `research/findings-registry.json` | Generated | Per-iteration finding manifest |
| `research/deep-research-dashboard.md` | Generated | Auto-generated progress dashboard |
| `implementation-summary.md` | Created | This file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The canonical `/spec_kit:deep-research:auto` workflow was used. After the initial orchestrator agent's batch script (`run_all.sh`) failed on macOS bash 3.2 (`declare -A` not supported), the parent agent took over manual dispatch: each iteration was a separate `codex exec --model gpt-5.5 -c model_reasoning_effort="high" --full-auto` call writing to `research/iterations/iteration-NNN.md` and `research/deltas/iter-NNN.jsonl`. Iterations 003-020 dispatched in batches of 3 in parallel; the JSONL state-log accumulated 20 iteration deltas. Synthesis used a final cli-codex high-reasoning call to produce `research.md` + `resource-map.md`.

### Trajectory

| Stage | Outcome |
|-------|---------|
| Iteration 001-005 (Category A) | 20 findings — 1 critical concurrency bug cluster (iter-001), schema gaps (iter-005) |
| Iteration 006-010 (Category B) | 20 findings — runtime hook drift, CLI skill drift, memory parser key mismatch, validator regex gaps, workflow YAML edge cases |
| Iteration 011-015 (Category C) | 20 findings — search-quality tuning levers, scorer fusion edge cases, advisor regression gaps, code-graph staleness misclassification, test reliability anti-patterns |
| Iteration 016-020 (Category D) | 22 findings — boundary leaks, dependency cycles, schema duplication, spec-kit folder topology drift, build/dist separation gaps |
| Synthesis | 17-section `research.md`, 119-line `resource-map.md` |

### Cross-packet outcomes

- **Packet 048** (iter-001 daemon concurrency fixes) — completed in parallel, commit `267b4d7a6`. All 4 iter-001 findings (F-001-A1-01..04) closed: watcher mutex, lifecycle shutdown ordering, generation lock token, cache invalidation monotonicity.
- **Packet 047** (pre-existing test failures) — completed in parallel, commit `9f7c18936`. 5 unit tests fixed: 3 test corrections, 2 product-code completions of an in-progress snake_case rename.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Manual codex dispatch instead of YAML auto-script | The orchestrator's `run_all.sh` used `declare -A` which doesn't exist in macOS bash 3.2. Manual dispatch sidestepped the bash incompatibility without rewriting the workflow YAML |
| 3-deep parallel queue | Each iteration is independent (different angle, different files); 3-deep balanced throughput vs codex API contention |
| No early stop on convergence | Convergence threshold 0.01 explicitly low; pre-defined 20 angles meant exhaustive sweep was the goal |
| Iter-001 findings remediated in parallel packet 048 | Concurrency bugs were actionable and self-contained; remediation didn't need to wait for synthesis |
| No P0 escalation = no immediate remediation packet beyond 048 | 31 P1 findings split across many subsystems; better as a triaged backlog than a single rushed packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 20 iteration files produced | PASS — all 20 with file:line citations |
| Each iteration has Findings table with Priority column | PASS — spot-checked 5 random |
| `research/research.md` 17 sections in locked order | PASS |
| `research/resource-map.md` non-empty path inventory | PASS — 119 lines |
| `research/findings-registry.json` aggregated | PASS — 82 entries |
| Executor verified cli-codex gpt-5.5 high | PASS — `deep-research-config.json` records executor block |
| `validate.sh --strict` for packet 046 | PENDING final pass after this file lands |
| Stayed on `main` | PASS — `git branch --show-current` returns `main` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No P0 found, but 31 P1 remain.** A P1 in this taxonomy means "concrete correctness or reliability failure." They aren't release-blocking like a P0 would be, but several can leave operators with wrong state, broken recovery, or misleading validation. Prioritize these in remediation packets 049+ (recommended ordering: A2 SQLite contention → A4 silent fallbacks → A5 schema gaps → B3 memory parser key mismatch → B2 CLI skill drift → C4 staleness detection).

2. **Architecture findings (Category D) are mostly P2.** They reflect long-term debt rather than acute bugs. Useful for refactoring planning but not urgent.

3. **The synthesis is structural, not prescriptive.** Each finding has a one-line recommendation, but full design work (e.g., what the new boundary between `lib/freshness/` and `lib/derived/` should be) is deferred to remediation packets.

4. **Finding deduplication was manual.** No two findings cite the exact same `file:line+description`, but a few touch overlapping surfaces (e.g., F-001-A1-01 and F-003-A3-01 both involve `daemon/watcher.ts`). Synthesis flagged these but did not collapse them; reviewers should treat them as related, not duplicate.

5. **The orchestrator agent's `run_all.sh` is left in `research/` for reference but is non-functional on macOS.** A follow-on packet could either fix the script (replace `declare -A` with portable hash via `eval`/`mktemp`) or document it as deprecated in favor of manual dispatch.

6. **Out of scope:** No live runtime telemetry; no benchmarking; no implementation of any finding except iter-001 (packet 048).
<!-- /ANCHOR:limitations -->

---
