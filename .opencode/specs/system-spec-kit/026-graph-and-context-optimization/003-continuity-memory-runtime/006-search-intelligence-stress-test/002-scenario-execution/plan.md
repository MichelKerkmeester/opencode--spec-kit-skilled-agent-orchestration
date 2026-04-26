---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Scenario Execution [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/002-scenario-execution/plan]"
description: "Execution flow + concurrency strategy + scoring workflow for the Search Intelligence Stress-Test playbook."
trigger_phrases:
  - "execution plan"
  - "scoring workflow"
  - "concurrency strategy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/002-scenario-execution"
    last_updated_at: "2026-04-26T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored execution flow + concurrency plan"
    next_safe_action: "Hand off to operator for actual run"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Scenario Execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (orchestrator + dispatch), Markdown (scoring + findings), JSON (meta) |
| **Framework** | Consumes 001's dispatch matrix and scripts |
| **Storage** | runs subfolders per-run folders + findings markdown aggregate |
| **Testing** | Sweep itself is the test — score outputs verify quality |

### Overview

Four-stage flow: pre-flight → dispatch → manual scoring → aggregation. Pre-flight gates dispatch on CLI readiness; dispatch loops the 9×3 matrix (plus ablation cells) honoring cli-copilot's 3-cap; scoring is manual using 001's rubric; aggregation produces findings.md with cross-CLI comparison and 005-defect cross-references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 corpus v1.0.0 locked
- [x] Dispatch matrix + scripts available in 001
- [ ] All 3 CLIs installed and authenticated (verified at execution time)

### Definition of Done
- [ ] All 27 base cells executed (9 × 3) — failures documented per cell, not silent
- [ ] All ablation cells executed (cli-opencode --agent context)
- [ ] All score.md files filled
- [ ] findings.md synthesized
- [ ] validate.sh --strict passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Pre-flight + dispatch + manual-score + aggregate**. Each stage has a clear handoff so failures don't cascade — pre-flight failure aborts cleanly, dispatch failure marks individual cells SKIPPED, scoring is human-paced, aggregation reads score.md files.

### Key Components

- **Pre-flight check** (`scripts/preflight.sh`) — verify CLIs + auth + DB snapshot + CocoIndex daemon
- **Orchestrator** (`scripts/run-all.sh` from 001/scripts) — iterate matrix, call per-CLI dispatchers
- **Per-CLI dispatchers** (`scripts/dispatch-cli-*.sh` from 001) — actual CLI invocations
- **Run folder** (runs subfolders) — captured artifacts per cell
- **Manual scoring** (operator fills score markdown per cell)
- **Aggregator** (manual or `scripts/aggregate.sh` for v2) — produces findings markdown

### Data Flow

```
preflight.sh → status JSON
   ↓
run-all.sh (loops matrix from 001)
   ↓
for each (scenario, cli):
  dispatch-cli-X.sh "$PROMPT" 2>&1
    > runs/<scenario>/<cli>-N/output.txt
  meta.json written with timing + tokens + DB hash
   ↓
operator scores each run → score.md
   ↓
aggregator reads all score.md → findings.md
```

### Concurrency Strategy

- **cli-codex**: serial (no documented cap; respect rate limits naturally)
- **cli-copilot**: max 3 concurrent processes (per repo Phase 018 convention); orchestrator queues
- **cli-opencode**: serial (one MCP-bearing dispatch at a time avoids tool-state interference)

For total throughput: sequential per-CLI is simplest; expected total runtime ~30-45 min for N=1 sweep across 27 cells (≈1 min/cell average).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create sub-phase folder
- [x] Author spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json
- [ ] Validate sub-phase

### Phase 2: Implementation (deferred to execution session)
- [ ] Run preflight.sh; abort if any CLI missing
- [ ] Run run-all.sh (consumes 001 dispatch scripts)
- [ ] Verify all 27+ablation runs/.../ folders populated

### Phase 3: Verification (deferred to execution session)
- [ ] Manually fill score.md for each run using 001 rubric
- [ ] Synthesize findings.md
- [ ] Cross-reference 005 defect REQs
- [ ] Surface ≥1 actionable insight not already in 005
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This sub-phase | `validate.sh --strict` |
| Pre-flight smoke | Verify pre-flight script aborts cleanly when a CLI is uninstalled | Manual (uninstall test) |
| Per-CLI dispatch test | Run 1 scenario per CLI; verify capture works | Manual smoke |
| Inter-rater reliability | Score 1 cell with 2 scorers; expect ±1 agreement | Human |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 dispatch matrix + scripts | Internal | Yellow (scripts pending in 001 T109-T112) | Block execution until 001 scripts land |
| cli-codex installed + authed | External | Verify at exec time | Skip cli-codex column |
| cli-copilot installed + authed | External | Verify at exec time | Skip cli-copilot column |
| cli-opencode installed + authed | External | Verify at exec time | Skip cli-opencode column |
| CocoIndex daemon | External | Red per 005 evidence | Vector channel unavailable; document |
| Sibling 005 defects | Internal | Green | Cross-references work |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Mid-sweep CLI authentication failure or rate-limit exhaustion.
- **Procedure**: Mark affected cells SKIPPED with reason in score.md; continue other CLIs; document gap in findings.md. Sweep can be resumed by re-running run-all.sh with `--skip-existing` flag (idempotency via run folder existence check).
- **Total rollback**: deleting runs subfolder is safe; corpus + matrix in 001 are unchanged.
<!-- /ANCHOR:rollback -->
