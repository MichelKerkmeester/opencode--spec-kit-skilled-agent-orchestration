---
title: "Phase 027 — Tasks"
description: "Parent-level tasks. Research phase complete. Children scaffolded. Implementation dispatches per child."
importance_tier: "high"
contextType: "research"
---

# Phase 027 Tasks

## Research Phase (complete)

### T001 — Scaffold research packet (done)
- [x] Folder + 7 docs
- [x] research/ artifacts at `../research/027-skill-graph-daemon-and-advisor-unification-pt-01/`

### T002 — Dispatch research (done)
- [x] 40 r01 iters (cli-codex gpt-5.4 high fast)
- [x] 20 follow-up iters (cli-copilot gpt-5.4 high)
- [x] 2 synthesis passes

### T003 — Research verification (done)
- [x] research.md exists (12 sections + §13 follow-up)
- [x] findings-registry.json valid + all 31 + 20 questions covered
- [x] Architectural sketch present
- [x] Implementation roadmap 6 sub-packets
- [x] Risk register + measurement plan + §13.8 recommendation

## Scaffolding Phase (complete)

### T004 — Scaffold child 001 (done)
- [x] `001-daemon-freshness-foundation/` — 7 files

### T005 — Scaffold child 002 (done)
- [x] `002-lifecycle-and-derived-metadata/` — 7 files

### T006 — Scaffold child 003 (done)
- [x] `003-native-advisor-core/` — 7 files

### T007 — Scaffold child 004 (done)
- [x] `004-mcp-advisor-surface/` — 7 files

### T008 — Scaffold child 005 (done)
- [x] `005-compat-migration-and-bootstrap/` — 7 files

### T009 — Scaffold child 006 (done)
- [x] `006-promotion-gates/` — 7 files

### T010 — Parent packet updates
- [x] spec.md: Child Layout row + ADR pointer
- [x] plan.md: child dispatch chain
- [x] tasks.md: scaffolding + verification tasks (this file)
- [x] decision-record.md: ADR-001..ADR-006 (NEW)
- [x] implementation-summary.md: Children Convergence Log placeholder

### T011 — Validation
- [ ] `bash validate.sh` per child (manual; GRAPH_METADATA_PRESENT warning expected due to broken generate-context.js)
- [ ] Parent `validate.sh` passes
- [ ] Each child's `description.json` + `graph-metadata.json` parse as valid JSON

## Implementation Phase (future dispatches)

### T012 — Dispatch 027/001 (blocked: user decision to start)
- [ ] `/spec_kit:implement :auto --spec-folder=.../027/001-daemon-freshness-foundation/`
- [ ] 001 converges (benchmark passes, fail-open semantics verified)

### T013 — Dispatch 027/002 (blocks on T012)
- [ ] `/spec_kit:implement :auto --spec-folder=.../027/002-lifecycle-and-derived-metadata/`

### T014 — Dispatch 027/003 (blocks on T013)
- [ ] `/spec_kit:implement :auto --spec-folder=.../027/003-native-advisor-core/`
- [ ] Py↔TS parity green on full 200-prompt corpus

### T015 — Dispatch 027/004 (blocks on T014)
- [ ] `/spec_kit:implement :auto --spec-folder=.../027/004-mcp-advisor-surface/`

### T016 — Dispatch 027/006 (blocks on T014; parallel with T015)
- [ ] `/spec_kit:implement :auto --spec-folder=.../027/006-promotion-gates/`

### T017 — Dispatch 027/005 (blocks on T015, optionally T016)
- [ ] `/spec_kit:implement :auto --spec-folder=.../027/005-compat-migration-and-bootstrap/`

### T018 — Phase 027 closure
- [ ] All 6 children converged
- [ ] Update parent `implementation-summary.md` Children Convergence Log with timestamps
- [ ] Optional: deep-review pass on the full implementation stack

## Commit strategy

One commit per scaffolded child + one for parent updates (7 commits total for scaffolding phase):
1. `chore(027): scaffold 001-daemon-freshness-foundation`
2. `chore(027): scaffold 002-lifecycle-and-derived-metadata`
3. `chore(027): scaffold 003-native-advisor-core`
4. `chore(027): scaffold 004-mcp-advisor-surface`
5. `chore(027): scaffold 005-compat-migration-and-bootstrap`
6. `chore(027): scaffold 006-promotion-gates`
7. `chore(027): wire parent packet + add decision-record.md`
