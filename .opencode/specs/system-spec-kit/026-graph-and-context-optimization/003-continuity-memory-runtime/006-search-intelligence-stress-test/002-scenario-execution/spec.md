---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/002-scenario-execution/spec]"
description: "Sub-phase 002: execution harness for the stress-test playbook. Runs the dispatch matrix from 001 against cli-codex, cli-copilot, and cli-opencode, captures per-run artifacts, scores via the rubric, and synthesizes findings."
trigger_phrases:
  - "002-scenario-execution"
  - "stress test execution"
  - "playbook run harness"
  - "findings synthesis"
  - "cross-AI scoring"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/002-scenario-execution"
    last_updated_at: "2026-04-26T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored scaffold"
    next_safe_action: "Hand off to operator"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 30
    open_questions:
      - "Production memory DB or frozen snapshot for repeatability?"
      - "N=1 first sweep, expand to N=3 only if signal noisy?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Scenario Execution Sub-Phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Scaffold (execution deferred) |
| **Created** | 2026-04-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Sibling Sub-Phase** | `001-scenario-design` (consumes corpus + matrix from there) |
| **Corpus Version Consumed** | v1.0.0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
001 ships the design (corpus + rubric + matrix); without an execution harness those artifacts produce no signal. This sub-phase scaffolds the harness so an operator can run the playbook end-to-end without inventing infrastructure.

### Purpose
Define the run harness contract: pre-flight checks, dispatch loop, output capture, scoring workflow, and findings aggregation. The actual run is a separate execution session against this scaffold (estimated 30-45 min wall-clock for N=1 sweep).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pre-flight contract (CLIs installed, authenticated, CocoIndex daemon status, DB snapshot)
- Dispatch loop contract (iterate scenarios × CLIs, respect concurrency caps, capture artifacts)
- Output capture contract (per-run folder, meta.json, output.txt)
- Manual scoring workflow (operator fills score.md per run using rubric from 001)
- Findings aggregation contract (cross-CLI comparison tables, top wins/failures, recommendations)

### Out of Scope
- Actual execution (deferred to a dedicated session)
- Modifying the corpus or rubric (those live in 001; bump version there if changes needed)
- Automated scoring (manual-only for v1.0.0)
- Statistical analysis beyond simple per-cell totals + per-CLI averages
- Running scenarios that aren't in 001's v1.0.0 corpus

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This sub-phase spec |
| `plan.md` | Create | Execution flow + concurrency strategy |
| `tasks.md` | Create | Per-scenario + per-CLI run tasks |
| `implementation-summary.md` | Create | Outcome summary (placeholder until runs land) |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| runs subfolder | Create on first execution | One folder per (scenario × CLI × run_n) |
| findings markdown | Create on synthesis | Cross-CLI aggregate + recommendations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pre-flight check before dispatch | Verify cli-codex, cli-copilot, cli-opencode installed and authenticated; abort with clear error message if any missing |
| REQ-002 | Iterate full matrix (9 scenarios × 3 CLIs base + ablation cells) | run-all.sh completes all cells OR cleanly skips with documented reason |
| REQ-003 | Capture per-run artifacts | Each run produces `runs/<scenario>/<cli>-<run_n>/{prompt.md,output.txt,meta.json}` per 001 output schema |
| REQ-004 | Honor cli-copilot 3-process concurrency cap | dispatch-cli-copilot.sh queues if `pgrep -f copilot \| wc -l ≥ 3` |
| REQ-005 | Manual scoring per run | Operator opens each run folder, reads output.txt + meta.json, fills score.md per 001 rubric |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Findings aggregator | findings.md produced from all score.md files, with cross-CLI comparison table, top-3 wins per CLI, top-3 failures per CLI, recommendations |
| REQ-007 | DB snapshot per run | meta.json includes `db_snapshot_hash` so future reruns can reproduce against same DB state |
| REQ-008 | Cross-link to 005 defects in findings | Findings cite which scenarios surfaced which 005 REQs |

### P2 - Refinements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | N=3 variance optional | If signal noisy at N=1, rerun matrix with N=3 and document variance per cell |
| REQ-010 | Auto-aggregator script | Optional: `scripts/aggregate.sh` reads all score.md and produces findings.md skeleton |
| REQ-011 | Tag scenarios with regression status | If a known 005 defect is fixed by remediation packet, tag the scenario "REGRESSION-CHECK" so future runs auto-flag re-emergence |
<!-- /ANCHOR:requirements -->

---

## Execution Workflow

```
┌─────────────────────────────────────┐
│ 1. Pre-flight (run-all.sh)          │
│    • Verify CLI binaries            │
│    • Check authentication           │
│    • Snapshot memory DB             │
│    • Check CocoIndex daemon         │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 2. Dispatch loop                    │
│    For each scenario in S1..I3:     │
│      For each cli in [codex,        │
│                       copilot,      │
│                       opencode]:    │
│        Run dispatch-cli-X.sh        │
│        Capture to runs/.../         │
│      [Optional] Ablation cell:      │
│        cli-opencode --agent context │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 3. Manual scoring                   │
│    Operator reviews each run        │
│    Fills score.md per rubric        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 4. Findings aggregation             │
│    Read all score.md                │
│    Build cross-CLI tables           │
│    Identify top wins/failures       │
│    Cross-reference 005 defects      │
│    Write findings.md                │
└─────────────────────────────────────┘
```

---

## Findings Format (skeleton)

```markdown
# Findings — Search Intelligence Stress-Test (Corpus v1.0.0, run YYYY-MM-DD)

## Executive Summary
- N runs completed, M skipped
- Per-CLI average score: cli-codex=X/10, cli-copilot=Y/10, cli-opencode=Z/10
- Top insight: [novel finding not already in 005]

## Per-Scenario Comparison
| Scenario | cli-codex | cli-copilot | cli-opencode | Notes |
|----------|-----------|-------------|--------------|-------|
| S1 | 9/10 | 7/10 | 10/10 | … |

## Top 3 Wins (per CLI)
### cli-opencode
1. S3: cited the exact decision-record passage…
2. …

## Top 3 Failures (per CLI)
### cli-codex
1. Q1: hallucinated function names…

## Cross-Reference to 005 Defects
- Scenario S2 surfaced 005/REQ-003 (vocabulary violation) on N/3 cells
- Scenario Q3 confirmed 005/REQ-002 (truncation) — cli-opencode returned count=0

## Recommendations
1. [Action surfaced by data; not from prior knowledge]
2. …
```

---

### Acceptance Scenarios

**Given** an operator runs `run-all.sh` after 001 closes, **when** dispatch completes, **then** every cell in the matrix has a `runs/.../` folder with prompt + output + meta.

**Given** scoring completes, **when** the aggregator runs, **then** findings markdown exists with all required sections populated.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 27 base cells (9 × 3) plus ablation cells produce complete run artifacts.
- **SC-002**: All score.md files filled with rubric scores + evidence quotes.
- **SC-003**: findings.md surfaces at least one actionable insight not already in 005.
- **SC-004**: validate.sh --strict passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | One CLI fails authentication mid-sweep | Medium | Mark cells SKIPPED with reason; continue other CLIs |
| Risk | cli-copilot rate-limit during 9-scenario sweep | Low | Sequential dispatch with concurrency=1 if rate-limited; expand to 3 only when stable |
| Risk | Memory DB changes between runs (graph growth observed in 005) | Medium | Snapshot hash per run; document if scenarios diverge across runs of same cell |
| Risk | Manual scoring is slow (~5 min per cell × 27 = 2-3h) | Low | Operator-time cost; budget accordingly |
| Dependency | Sub-phase 001 dispatch matrix + scripts | Critical | This packet consumes 001's artifacts; cannot run without |
| Dependency | All 3 CLIs installed | High | Pre-flight check; abort cleanly if missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Production memory DB or frozen snapshot for repeatability? Recommend production for first sweep (realistic), snapshot for reruns.
- N=1 first sweep, expand to N=3 only if signal noisy? Default yes per parent spec REQ-009.
- Should the aggregator be auto-generated or human-written? Default: human-written for v1.0.0 (cross-CLI insight requires judgment); aggregator candidate for v2.
- What's the SLA for findings synthesis after dispatch completes? Recommend within 24h to keep memory fresh.
- Should we re-run after 005-remediation packet lands to confirm fixes regress no scenarios? Yes — make it part of the remediation packet's verification.
<!-- /ANCHOR:questions -->
