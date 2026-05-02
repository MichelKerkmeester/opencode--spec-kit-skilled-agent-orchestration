---
title: "Implementation Plan: Retroactive Phase-Parent Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Three-phase rollout: 3 cli-copilot/gpt-5.4-medium workers in parallel, then verification + synthesis."
trigger_phrases:
  - "retroactive phase parent plan"
  - "cli-copilot worker dispatch plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/004-retroactive-phase-parent-migration"
    last_updated_at: "2026-04-27T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md three-phase rollout"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Retroactive Phase-Parent Migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (lean spec.md scaffolding), JSON (description + graph-metadata refresh), Bash (validate.sh per-parent gate) |
| **Framework** | system-spec-kit (templates/phase_parent/, validator phase-parent branches, generator pointer fields) |
| **Storage** | Filesystem only — no database mutations |
| **Testing** | per-parent validate.sh --strict (gate); 026 regression diff (final); spot-check diff on 5 random parents |
| **Executor** | cli-copilot v1.0.36 with `--model gpt-5.4 --effort medium --autopilot --no-ask-user --allow-all-tools` |

### Overview
Three sub-phases. Phase 1 dispatches 3 cli-copilot workers in parallel, each handling a chunk of legacy phase parents (chunked by parent spec collection to avoid write races). Phase 2 verifies the worker outputs (aggregate JSON reports, run is_phase_parent + lean-trio check across all touched parents, run 026 regression diff). Phase 3 has this Claude Opus session synthesize the worker outputs into `implementation-summary.md` and run the canonical save (which dogfoods the pointer mechanism one more time). Workers operate under hard constraints — tolerant migration (no heavy-doc deletion), narrative preservation (carry forward vision/purpose), manual-block preservation (verbatim) — that protect against destructive mass mutation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Discovery scan complete; 28 in-scope parents enumerated
- [ ] Pre-migration 026 regression baseline captured at `scratch/regression-baseline-pre-004.txt`
- [ ] cli-copilot v1.0.36+ available
- [ ] Phases 001 + 002 + 003 shipped; templates and validators ready

### Definition of Done
- [ ] All 6 P0 acceptance criteria met (REQ-001..REQ-006)
- [ ] All 4 P1 acceptance criteria met OR user-approved deferral
- [ ] All 3 worker JSON reports filed and aggregated into `004/scratch/migration-manifest.json`
- [ ] 026 regression preserved (3 baseline error rules unchanged)
- [ ] Spot-check diff on 5 random touched parents shows narrative + manual block preserved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Map-reduce with hard constraints: 3 parallel workers (map) over chunks of legacy parents; this Claude session aggregates their JSON reports + final regression diff (reduce). Worker chunking by parent spec collection eliminates write races by design.

### Worker Chunks

| Worker | Subtree | Phase parent count | Includes archived? |
|--------|---------|-------------------:|--------------------|
| 1 | `022-hybrid-rag-fusion/` (8) + `023-hybrid-rag-fusion-refinement/` (1) | 9 | no |
| 2 | `00--ai-systems/` (6) + `024-compact-code-graph/` (1) + `026/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test` (1) | 8 | no |
| 3 | `026-graph-and-context-optimization/` C-category (3) + active 026 phase parents requiring metadata refresh + ALL z_archive/z_future entries (~7) | ~11 | yes |

### Per-Parent Procedure (mirrored across workers)

```
For each phase parent in worker's chunk:
  1. Capture pre-state:
     - Read existing spec.md (if present) → extract vision/purpose narrative
     - Read existing description.json (if present)
     - Read existing graph-metadata.json (if present) → preserve `manual` block
     - List filesystem children (NNN-named dirs)
     - Run `validate.sh --strict --no-recursive --json` → record errors
  
  2. Synthesize/refresh:
     - If spec.md missing OR is heavy narrative: synthesize lean spec.md from
       templates/phase_parent/spec.md, fill placeholders from preserved narrative
       + description.json + child enumeration. Carry forward vision/purpose.
     - If description.json missing: synthesize using folder name + spec.md title
     - description.json: refresh `lastUpdated`; preserve `memoryNameHistory`
     - graph-metadata.json: refresh `derived.children_ids` from filesystem +
       `derived.last_save_at` to now; preserve `manual` block byte-equal
  
  3. Atomic write each file (temp + rename)
  
  4. Capture post-state:
     - Run `validate.sh --strict --no-recursive --json` → record errors
     - Diff (manual_block_preserved=true|false, narrative_preserved=true|false,
       new_errors=[...] vs pre-state)
  
  5. Append to worker JSON report

End of chunk: write JSON report atomically to:
  004/scratch/worker-N-report.json
```

### Worker JSON Report Schema

```json
{
  "worker_id": "1|2|3",
  "model": "gpt-5.4",
  "effort": "medium",
  "scope_description": "<chunk description>",
  "phase_parents_processed": [
    {
      "path": "specs/.../",
      "category": "B|C",
      "actions": ["spec.md_synthesized", "description.json_refreshed", "graph-metadata.json_derived_refreshed"],
      "manual_block_preserved": true,
      "narrative_preserved": true,
      "validator_pre": { "errors": [...], "warnings": [...] },
      "validator_post": { "errors": [...], "warnings": [...] },
      "new_error_rules": []
    }
  ],
  "skipped": [{ "path": "...", "reason": "..." }],
  "blocked": [],
  "summary": {
    "total_processed": N,
    "total_skipped": N,
    "manual_block_violations": 0,
    "narrative_violations": 0,
    "new_error_rules_anywhere": 0
  }
}
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — Worker Brief Authoring + Parallel Dispatch

> **Sub-phase A.** Compose 3 cli-copilot worker briefs, then dispatch all 3 in parallel as background processes.

- [ ] T001 Author `/tmp/copilot-worker-1.md` (Worker 1: 022-hybrid-rag-fusion + 023 subtree)
- [ ] T002 Author `/tmp/copilot-worker-2.md` (Worker 2: 00--ai-systems + 024 + 026/011-stress)
- [ ] T003 Author `/tmp/copilot-worker-3.md` (Worker 3: 026-active C-category + z_archive/z_future)
- [ ] T004 Dispatch Worker 1 via `nohup copilot -p "$(cat /tmp/copilot-worker-1.md)" --model gpt-5.4 --effort medium --autopilot --no-ask-user --allow-all-tools --no-color > /tmp/copilot-worker-1.log 2>&1 &`
- [ ] T005 Dispatch Worker 2 via same pattern → `/tmp/copilot-worker-2.log`
- [ ] T006 Dispatch Worker 3 via same pattern → `/tmp/copilot-worker-3.log`
- [ ] T007 Arm 2-min status pulse Monitor (per established pattern from earlier in 010 work)
- [ ] T008 Arm completion-signal Monitor that fires when ALL 3 worker PIDs exit

### Phase 2: Implementation — Verification

> **Sub-phase B.** When all 3 workers complete, aggregate reports + run regression.

- [ ] T009 Read all 3 `004/scratch/worker-N-report.json` files; aggregate into `004/scratch/migration-manifest.json`
- [ ] T010 Run discovery scan again; confirm all 28 in-scope parents are now Category A or B (none in Category C)
- [ ] T011 Run `validate.sh --strict --json` on `026-graph-and-context-optimization/`; diff parent error rules against `scratch/regression-baseline-pre-004.txt`. MUST match (zero new error rules introduced).
- [ ] T012 Spot-check diff on 5 random touched parents: confirm `manual` block byte-equal pre/post; confirm narrative content visibly preserved
- [ ] T013 [P] Run cross-impl detection check: for each touched parent, confirm `is_phase_parent` (shell) and `isPhaseParent` (ESM JS) return identical booleans

### Phase 3: Verification — Synthesis + Save

> **Sub-phase C.** This Claude session synthesizes the verified results.

- [ ] T014 Author `004/implementation-summary.md` aggregating worker outputs + verification results
- [ ] T015 Run canonical `/memory:save` against 004 (dogfoods pointer one more time; 010's `last_active_child_id` should auto-bubble to 004)
- [ ] T016 Final task list status update; close packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Per-parent strict validate (worker gate) | Each touched parent before/after migration | `validate.sh --strict --no-recursive --json` |
| 026 regression (final gate) | Parent-level error rules unchanged from baseline | `validate.sh --strict --json` + python diff |
| Cross-impl detection parity | Each touched parent | shell `is_phase_parent` + ESM JS `isPhaseParent` |
| Manual-block preservation diff | 5 random parents | git diff or python deep-equal |
| Narrative preservation | 5 random parents | manual visual diff |
| Worker JSON report integrity | Each worker | jsonlint + schema check |

### Acceptance Scenarios

**Given** a phase parent in Category C (lean trio incomplete) before migration, **when** Worker N processes it, **then** post-migration the parent has all three files (`spec.md`, `description.json`, `graph-metadata.json`) and `is_phase_parent()` continues to return true.

**Given** a phase parent in Category B (lean trio + heavy docs) before migration, **when** Worker N processes it, **then** post-migration `description.json.lastUpdated` is fresh, `graph-metadata.json.derived.children_ids` matches the filesystem, and all heavy docs (plan.md, tasks.md, etc.) are still present with no content changes.

**Given** a phase parent's pre-migration `graph-metadata.json` had `manual.related_to: [...]`, **when** Worker N processes it, **then** post-migration the same `manual.related_to` array is present byte-equal.

**Given** the 026 strict-validation baseline captured at `scratch/regression-baseline-pre-004.txt`, **when** Phase 2 verification re-runs the validation, **then** the parent error rules match the baseline (zero new rules introduced).

**Given** a phase parent had pre-migration `spec.md` with a vision/purpose section, **when** Worker N processes it (whether B or C category), **then** the post-migration `spec.md` carries the same vision/purpose content (may be reflowed but recognizable).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `templates/phase_parent/spec.md` | Internal | Green | Shipped in 001 |
| `is_phase_parent` / `isPhaseParent` | Internal | Green | Shipped in 001 |
| Validator phase-parent branches (5 rules) | Internal | Green | Shipped in 001 + small follow-on |
| `cli-copilot` v1.0.36+ binary | Internal | Green | Verified at 1.0.36 |
| GitHub Copilot API quota (max 3 concurrent per memory) | External | Green | Constrained to 3 workers by design |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Worker accidentally deletes a heavy doc OR clobbers a `manual` block OR introduces a new error class on 026.
- **Procedure**:
  1. Identify the offending parent(s) from the worker JSON report's `summary.manual_block_violations` / `summary.new_error_rules_anywhere` fields.
  2. `git checkout -- <parent-path>` to revert the entire parent's contents to pre-migration state.
  3. Re-run `validate.sh --strict --json` on 026 to confirm baseline restored.
  4. Re-author the worker brief with stricter constraints (e.g. explicit list of files-must-not-touch); re-dispatch only the affected worker.
- **Worst case**: revert ALL changes via `git checkout -- .opencode/specs/` and re-plan with manual review.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Workers in parallel) ──► Phase 2 (Verify) ──► Phase 3 (Synthesize)
         │
         └─ Worker 1, 2, 3 fan out (no shared writes)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Discovery scan + pre-migration baseline + 3 worker briefs | Phase 2 (verification reads worker outputs) |
| Phase 2 | All 3 workers complete | Phase 3 |
| Phase 3 | Verification passes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — Worker briefs + parallel dispatch | Medium | 30-60 min wall-clock (briefs ~15 min author + 15-45 min worker run) |
| Phase 2 — Verification | Low | 15 min |
| Phase 3 — Synthesis + canonical save | Low | 15 min |
| **Total wall-clock** | | **60-90 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-migration regression baseline captured (`scratch/regression-baseline-pre-004.txt`)
- [ ] Discovery scan log preserved (`scratch/discovery-scan.txt`)
- [ ] All 3 worker briefs reviewed for hard-constraint completeness before dispatch

### Rollback Procedure
1. Identify offending paths from worker JSON reports.
2. `git checkout -- <paths>`.
3. Re-run 026 regression to confirm baseline restored.
4. Re-author worker brief if systemic issue; re-dispatch only affected worker.

### Data Reversal
- **Has data migrations?** No (filesystem only).
- **Reversal procedure**: `git checkout`. Tolerant policy means even partial completion leaves the repo in a not-worse state than current — pre-migration heavy docs are still in place.
<!-- /ANCHOR:enhanced-rollback -->
