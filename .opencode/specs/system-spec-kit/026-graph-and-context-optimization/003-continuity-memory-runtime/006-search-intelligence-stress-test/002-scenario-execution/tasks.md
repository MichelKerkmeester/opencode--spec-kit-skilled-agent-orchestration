---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: Scenario Execution [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/002-scenario-execution/tasks]"
description: "Per-scenario + per-CLI run tasks + scoring tasks + findings synthesis. Most are deferred to a dedicated execution session."
trigger_phrases:
  - "execution tasks"
  - "scoring tasks"
  - "findings synthesis tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/002-scenario-execution"
    last_updated_at: "2026-04-26T15:00:00Z"
    last_invalid_at: null
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed execution work units"
    next_safe_action: "Hand off to operator for run-all.sh"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 50
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Scenario Execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Most tasks here are deferred to a dedicated execution session. The packet itself completes when scaffolding is in place; runs happen later.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create sub-phase folder (already done by parent)
- [x] T002 Author spec.md (execution scaffold)
- [x] T003 [P] Author plan.md (execution flow)
- [x] T004 [P] Author tasks.md (this file)
- [x] T005 [P] Author implementation-summary.md (placeholder)
- [x] T006 [P] Author description.json + graph-metadata.json
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Pre-flight (deferred — runs at execution time)
- [ ] T101 Run scripts/preflight.sh (from 001 or here); verify all 3 CLIs installed + authed
- [ ] T102 Snapshot memory DB; record hash for runs/.../meta.json
- [ ] T103 Verify CocoIndex daemon status; document if down

### Dispatch sweep (deferred)
- [ ] T201 Run scenario S1 (Search-Simple) × cli-codex
- [ ] T202 [P] Run S1 × cli-copilot
- [ ] T203 [P] Run S1 × cli-opencode
- [ ] T204 Run S2 × cli-codex
- [ ] T205 [P] Run S2 × cli-copilot
- [ ] T206 [P] Run S2 × cli-opencode
- [ ] T207 Run S3 × cli-codex
- [ ] T208 [P] Run S3 × cli-copilot
- [ ] T209 [P] Run S3 × cli-opencode
- [ ] T210 Run Q1 × cli-codex
- [ ] T211 [P] Run Q1 × cli-copilot
- [ ] T212 [P] Run Q1 × cli-opencode
- [ ] T213 Run Q2 × cli-codex
- [ ] T214 [P] Run Q2 × cli-copilot
- [ ] T215 [P] Run Q2 × cli-opencode
- [ ] T216 Run Q3 × cli-codex
- [ ] T217 [P] Run Q3 × cli-copilot
- [ ] T218 [P] Run Q3 × cli-opencode
- [ ] T219 Run I1 × cli-codex
- [ ] T220 [P] Run I1 × cli-copilot
- [ ] T221 [P] Run I1 × cli-opencode
- [ ] T222 Run I2 × cli-codex
- [ ] T223 [P] Run I2 × cli-copilot
- [ ] T224 [P] Run I2 × cli-opencode
- [ ] T225 Run I3 × cli-codex
- [ ] T226 [P] Run I3 × cli-copilot
- [ ] T227 [P] Run I3 × cli-opencode

### Ablation cells (deferred — REQ-009)
- [ ] T301 Run S1 × cli-opencode --agent context (ablation)
- [ ] T302 [P] Run S2 × cli-opencode --agent context
- [ ] T303 [P] Run S3 × cli-opencode --agent context

### Manual scoring (deferred)
- [ ] T401 Score all 27 base runs against 001 rubric → 27 score.md files
- [ ] T402 Score 3 ablation runs → 3 score.md files
- [ ] T403 Second-reviewer for any cell scoring ≤4/10
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T501 Synthesize findings.md (cross-CLI comparison + top wins/failures + recommendations + 005 cross-refs)
- [ ] T502 Verify ≥1 actionable insight not already in 005
- [ ] T503 validate.sh --strict against this packet
- [ ] T504 Cross-link findings.md from sibling 005 packet so remediation work has new evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

This packet (scaffolding only) completes when:
- [x] T001-T006 marked `[x]`
- [ ] T503 (validation) passes
- [ ] No `[B]` blocked tasks remaining

Full execution completes when T101-T504 are all `[x]`. That happens in a separate session.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (execution scaffold + run schema + findings format)
- **Plan**: See `plan.md` (4-stage flow + concurrency strategy)
- **Sibling sub-phase (design)**: `../001-scenario-design/` — corpus + rubric + matrix + scripts
- **Parent root packet**: `../spec.md`
- **Sibling defects packet**: `../../005-memory-search-runtime-bugs/` — cross-reference target
- **CLI skills under test**:
  - `.opencode/skill/cli-codex/SKILL.md`
  - `.opencode/skill/cli-copilot/SKILL.md`
  - `.opencode/skill/cli-opencode/SKILL.md`
<!-- /ANCHOR:cross-refs -->
