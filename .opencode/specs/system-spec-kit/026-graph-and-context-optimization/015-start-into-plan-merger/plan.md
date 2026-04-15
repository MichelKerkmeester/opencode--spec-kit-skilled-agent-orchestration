---
title: "Implementation Plan: Start-into-Plan Merger"
description: "Extract shared intake-contract reference module, collapse plan.md and complete.md inline intake blocks to reference it, add --intake-only flag, hard-delete /spec_kit:start and all downstream references."
trigger_phrases:
  - "start into plan implementation"
  - "intake contract extraction"
  - "plan md merger workflow"
  - "spec_kit command graph cleanup"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-start-into-plan-merger"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored Level 3 canonical plan with 6 milestones and Five Checks"
    next_safe_action: "Run /spec_kit:implement to execute M0 downstream audit"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/references/intake-contract.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/command/spec_kit/resume.md"
    session_dedup:
      fingerprint: "sha256:pending-first-implementation-run"
      session_id: "plan-authoring-2026-04-15"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Start-into-Plan Merger

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (command files), YAML (command assets), TOML (Gemini CLI routing), JSON (registry + catalog) |
| **Framework** | OpenCode command/skill system; system-spec-kit skill |
| **Storage** | Filesystem; Spec Kit Memory DB (for continuity indexing) |
| **Testing** | `validate.sh --strict`, sk-doc DQI validator, manual command-invocation round trips |

### Overview
Extract `/spec_kit:start`'s intake logic into a single canonical reference module at `.opencode/skill/system-spec-kit/references/intake-contract.md`. Collapse the inline intake blocks currently duplicated in `/spec_kit:plan` (lines 79–150) and `/spec_kit:complete` (Section 0 Step 5a) to reference that shared module. Add a `--intake-only` flag on `/spec_kit:plan` for standalone intake invocations. Update `/spec_kit:resume` to route intake re-entry to `/spec_kit:plan --intake-only`. Hard-delete `start.md`, both YAML assets, `.gemini/commands/spec_kit/start.toml`, remove the `spec_kit:start` harness skill-registry entry, and atomically update all 28 downstream reference files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2, §3)
- [x] Success criteria measurable (spec.md §5 SC-001…SC-012)
- [x] Dependencies identified (spec.md §6 Risks & Dependencies)
- [x] ADRs authored (decision-record.md ADR-001 through ADR-009)

### Definition of Done
- [ ] All P0 requirements met (REQ-001 through REQ-011)
- [ ] `validate.sh --strict` exits 0 on 015 packet
- [ ] sk-doc validator PASS on all 015 canonical docs
- [ ] Grep sweep confirms zero `/spec_kit:start` refs in forward-looking docs
- [ ] Closed packet 012 diff is empty
- [ ] `implementation-summary.md` populated post-implementation with verification evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Shared reference module** — extract duplicated logic into a single canonical doc, have caller commands reference rather than duplicate it. Pattern rationale: eliminates drift risk, single source of truth, keeps command files focused on workflow sequencing rather than intake mechanics.

### Key Components

- **`.opencode/skill/system-spec-kit/references/intake-contract.md`** (new): Canonical intake contract. Owns folder classification (5 states: empty-folder, partial-folder, repair-mode, placeholder-upgrade, populated-folder), repair-mode routing (4 branches: create, repair-metadata, resolve-placeholders, abort), staged canonical-trio publication (spec.md + description.json + graph-metadata.json with temp+rename semantics), manual relationship capture with packet_id dedup, resume semantics (`resume_question_id`, `reentry_reason`), and intake lock contract (fail-closed on stale/contended lock).

- **`/spec_kit:plan` (merged workflow)**: 8-step sequence.
  1. **Intake** — references shared contract; publishes trio if needed; respects `--intake-only` flag to halt here
  2. Request Analysis
  3. Pre-Work Review
  4. Specification
  5. Clarification
  6. Planning
  7. Save Context
  8. Workflow Finish
  
  `:with-phases` pre-workflow preserved (runs before Step 1 when enabled).

- **`/spec_kit:complete` (refactored Section 0)**: References shared intake contract in place of current inline block. Downstream Steps 5a/8/9 unchanged in function but updated to reflect reference-only pattern.

- **`/spec_kit:resume` (updated routing)**: When `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}`, routes to `/spec_kit:plan --intake-only` with prefilled state (`--start-state`, `--repair-mode`, `--selected-level`, `--manual-relationships`). When `reentry_reason in {none, planning-paused, implementation-paused}`, routes to full `/spec_kit:plan` or `/spec_kit:implement` as today.

### Data Flow

```
User invokes /spec_kit:plan or /spec_kit:complete
         │
         ▼
Setup Section resolves spec_path + execution_mode
         │
         ▼
Step 1 / Section 0: Load intake-contract.md reference
         │
         ├─ State: populated-folder → skip intake, proceed to planning/completion
         │
         └─ State: non-populated → execute shared intake contract
                  │
                  ▼
            Folder classification (5 states)
                  │
                  ▼
            Repair-mode routing (4 branches)
                  │
                  ▼
            Consolidated Q0–Q4+ interview
                  │
                  ▼
            Staged trio publication (temp + rename)
                  │
                  ▼
            Optional memory save (if structured context exists)
                  │
                  ▼
            Return contract to caller → resume workflow
```

**For `/spec_kit:plan --intake-only`**: Flow exits after staged trio publication + optional memory save. No planning steps execute.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (M0 — Downstream Audit)
- [ ] M0.1 Exhaustive grep for `/spec_kit:start`, `spec_kit/start.md`, `spec_kit_start_*.yaml`
- [ ] M0.2 Locate harness skill-registry file for `spec_kit:start` entry
- [ ] M0.3 Enumerate all 31 touch points with line numbers
- [ ] M0.4 Populate tasks.md file:line targets from audit output

### Phase 2: Core Implementation
- [ ] M1 Extract shared intake module (`intake-contract.md`)
- [ ] M2 Expand plan.md to reference shared module + add `--intake-only` flag
- [ ] M3 Refactor complete.md Section 0 to reference shared module
- [ ] M4 Update resume.md routing for intake re-entry

### Phase 3: Verification (M5 — Atomic Sweep + Deletion)
- [ ] M5a Update authoritative forward-looking docs (skills SKILL.md + README.md, templates READMEs, install guides, cli-* agent-delegation, root README command-graph, specs/descriptions.json)
- [ ] M5b Delete start.md + YAML assets + `.gemini/.../start.toml` + skill registry entry
- [ ] M5c Run `validate.sh --strict` on 015 packet
- [ ] M5d Run sk-doc DQI on all 015 canonical docs
- [ ] M5e Run grep sweep confirming zero `/spec_kit:start` in forward-looking paths
- [ ] M5f Confirm closed packet 012 diff is empty
- [ ] M5g Author changelog entry
- [ ] M5h Populate implementation-summary.md with verification evidence
- [ ] M5i Run `/memory:save` on packet 015
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | All 015 canonical docs | `validate.sh --strict` |
| Quality | All 015 canonical docs | sk-doc DQI validator |
| Static | Repo-wide `/spec_kit:start` reference grep | `grep -r` / Grep tool |
| Integration | `/spec_kit:plan --intake-only` end-to-end | Manual invocation on scratch folder |
| Integration | `/spec_kit:plan` full workflow on empty folder | Manual invocation |
| Integration | `/spec_kit:plan` full workflow on populated folder (intake bypass) | Manual invocation |
| Integration | `/spec_kit:complete` on empty folder (inline intake via shared module) | Manual invocation |
| Integration | `/spec_kit:resume` with `reentry_reason: incomplete-interview` | Manual invocation with forced state |
| Idempotence | `/spec_kit:plan --intake-only` twice on same folder | Manual invocation |
| Diff | Closed packet 012 has zero modifications | `git diff 012-spec-kit-commands/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 012 (closed, canonical) | Internal | Green | No block — referenced via supersedes only |
| `/spec_kit:resume` command | Internal | Green | Must update routing in M4 |
| Harness skill registry | Internal | Unknown (M0.2 audit) | M5b cannot complete without locating file |
| `validate.sh` helper | Internal | Green | M5c dependency |
| sk-doc DQI validator | Internal | Green | M5d dependency |
| `generate-description.js` | Internal | Green | Required to produce 015 `description.json` |
| Graph-metadata backfill script | Internal | Green | Required to produce 015 `graph-metadata.json` with supersedes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-implementation smoke tests fail (e.g., `/spec_kit:plan` breaks, resume re-entry fails, complete.md workflow breaks)
- **Procedure**: 
  1. `git revert` the implementation commit(s) atomically
  2. Re-run `validate.sh --strict` on 012 and 015 to confirm 012 healthy, 015 reverted
  3. Re-index memory via `/memory:save` on both packets
  4. Notify in changelog that merger rolled back
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
M0 (Audit) ──► M1 (Shared Module) ──► M2 (plan.md) ──► M3 (complete.md) ──► M4 (resume.md) ──► M5 (Atomic Sweep + Deletion)
                                           │                  │                                          ▲
                                           └──────────────────┴──────────────────────────────────────────┘
                                           (M2 + M3 + M4 can run in parallel after M1 completes)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| M0 | None | M1, M5 (audit output drives task lists) |
| M1 | M0 | M2, M3, M4 |
| M2 | M1 | M5 |
| M3 | M1 | M5 |
| M4 | M1 | M5 |
| M5 | M2, M3, M4 | None (closes packet) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| M0 Audit | Low | 1–2 hours (grep + enumeration) |
| M1 Shared Module | Medium | 3–4 hours (authoring + sk-doc validation) |
| M2 plan.md expansion | Medium | 2–3 hours (reference refactor + `--intake-only` wiring + 2 YAMLs) |
| M3 complete.md refactor | Low | 1–2 hours (reference refactor + 2 YAMLs) |
| M4 resume.md routing | Low | 1 hour |
| M5 Atomic Sweep | High | 4–6 hours (28 file edits + 3 deletions + validation + tests) |
| **Total** | | **12–18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 015 canonical docs pass `validate.sh --strict`
- [ ] All 015 canonical docs pass sk-doc DQI
- [ ] Grep sweep returns zero forward-looking `/spec_kit:start` refs
- [ ] Closed packet 012 git diff is empty
- [ ] Manual smoke test: `/spec_kit:plan --intake-only` on scratch folder

### Rollback Procedure
1. `git revert HEAD..<merger-starting-sha>` — atomic revert of all merger commits
2. Re-run `validate.sh --strict` on 012 and 015
3. Re-index memory: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for 012 and 015
4. Add rollback note to `.opencode/changelog/01--system-spec-kit/vX.Y.Z.md`
5. If harness skill registry was mutated: restore `spec_kit:start` entry from git history

### Data Reversal
- **Has data migrations?** No — documentation-level changes only
- **Reversal procedure**: Filesystem revert via git; no database state to reverse
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐     ┌──────────────────┐
│     M0      │────►│        M1        │────►│   M2/M3/M4     │────►│        M5        │
│   Audit     │     │  Shared Module   │     │  (parallel)    │     │  Atomic Sweep    │
└─────────────┘     └──────────────────┘     └────────────────┘     └──────────────────┘
                                                                            │
                                                                    ┌───────┴────────┐
                                                                    │                │
                                                            ┌───────▼──────┐  ┌──────▼──────┐
                                                            │     M5a      │  │    M5b      │
                                                            │ Doc Updates  │  │  Deletions  │
                                                            └──────────────┘  └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| M0 Audit | — | 31-file touch-point list | M1, M5 |
| M1 Shared Module | M0 | `intake-contract.md` | M2, M3, M4 |
| M2 plan.md | M1 | Expanded `plan.md` + 2 YAMLs + `--intake-only` | M5 |
| M3 complete.md | M1 | Refactored `complete.md` + 2 YAMLs | M5 |
| M4 resume.md | M1 | Updated `resume.md` routing | M5 |
| M5a Doc Updates | M2, M3, M4 | 28 updated forward-looking docs | M5b |
| M5b Deletions | M5a | Removed `start.md` + 2 YAMLs + `.gemini/.../start.toml` + skill registry entry | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **M0 Audit** — 1–2 hours — CRITICAL (unblocks everything)
2. **M1 Shared Module** — 3–4 hours — CRITICAL (unblocks M2/M3/M4)
3. **M2 plan.md expansion** — 2–3 hours — CRITICAL (core deliverable)
4. **M5a Doc Updates** — 3–4 hours — CRITICAL (prevents orphaned `/start` references after deletion)
5. **M5b Deletions** — 1–2 hours — CRITICAL (final state achieved)

**Total Critical Path**: 10–15 hours

**Parallel Opportunities**:
- M2, M3, M4 can run simultaneously after M1 completes (three independent command files)
- Within M5a, forward-looking doc updates can run in parallel (independent file edits grouped by skill domain)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Downstream audit complete | 31-file touch-point list with line numbers populated in tasks.md | Phase 1 |
| M1 | Shared intake module authored | `intake-contract.md` exists, sk-doc DQI PASS, contract covers all 5 states + 4 repair modes + trio + relationships + resume + lock | Phase 2 |
| M2 | plan.md merger complete | Step 1 references shared module, `--intake-only` flag working, both YAMLs updated | Phase 2 |
| M3 | complete.md refactor complete | Section 0 references shared module, both YAMLs updated, inline block removed | Phase 2 |
| M4 | resume.md routing complete | Intake re-entry reasons route to `/spec_kit:plan --intake-only` | Phase 2 |
| M5 | Atomic sweep + deletion complete | All 28 doc updates applied, 3 files deleted, skill registry cleaned, zero forward-looking refs remain, validate.sh PASS | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Supersede 012's "intake ≠ planning" separation

**Status**: Accepted

**Context**: Packet 012 established `/spec_kit:start` as a separate canonical intake surface while simultaneously embedding inline `/start` absorption in `/spec_kit:plan` and `/spec_kit:complete`. The inline-absorption model has proven complete — every invocation flow already absorbs intake. Standalone `/spec_kit:start` is vestigial.

**Decision**: Collapse the three parallel intake surfaces into a single shared reference module; hard-delete the standalone command.

**Consequences**:
- Positive: single source of truth for intake logic; eliminates drift risk; simpler command-graph
- Negative: external invokers of `/spec_kit:start` break. Mitigation: release changelog migration note

**Alternatives Rejected**:
- Permanent `/spec_kit:start` alias: preserves duplication; user chose hard delete
- Phased stub deprecation: preserves alias for release cycle; user chose atomic removal

See `decision-record.md` for full ADRs with alternatives and Five Checks evaluation.

---

### Five Checks Evaluation (Level 3 required)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three parallel intake surfaces exist today; every month of delay accumulates drift risk and new downstream refs |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives considered (permanent alias, phased stub, hard delete); user chose via explicit AskUserQuestion |
| 3 | **Sufficient?** | PASS | Shared module + reference-only absorption is the minimum to eliminate duplication; no additional mechanism needed |
| 4 | **Fits Goal?** | PASS | 026 parent packet is "graph-and-context-optimization" — command-graph simplification is on-thread; 015 directly reduces graph complexity |
| 5 | **Open Horizons?** | PASS | Shared-module pattern is reusable for future command consolidations (e.g., debug/review, implement/verify); `--intake-only` flag pattern extensible |

**Checks Summary**: 5/5 PASS

<!--
LEVEL 3 PLAN (~290 lines)
- Core + L2 + L3 addendums
- Full dependency graph, critical path, milestones
- Five Checks evaluation required at Level 3
- Additional ADRs in decision-record.md
-->
