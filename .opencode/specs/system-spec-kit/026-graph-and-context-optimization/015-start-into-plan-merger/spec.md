---
title: "Feature Specification: Start-into-Plan Merger"
description: "Deprecate /spec_kit:start and merge its intake logic into /spec_kit:plan via a shared intake-contract reference module, collapsing three parallel intake surfaces into one canonical module."
trigger_phrases:
  - "start into plan merger"
  - "deprecate spec_kit start"
  - "intake contract module"
  - "spec_kit plan intake only"
  - "intake planning merger"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-start-into-plan-merger"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored Level 3 canonical spec for start-into-plan merger"
    next_safe_action: "Run /spec_kit:implement against 015 to execute M0 audit"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/start.md"
      - ".opencode/command/spec_kit/plan.md"
      - ".opencode/command/spec_kit/complete.md"
      - ".opencode/skill/system-spec-kit/references/intake-contract.md"
    session_dedup:
      fingerprint: "sha256:pending-first-implementation-run"
      session_id: "plan-authoring-2026-04-15"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Packet location and level: new 015 at Level 3"
      - "complete.md intake strategy: extract shared module"
      - "Deprecation strategy: hard delete now"
---
# Feature Specification: Start-into-Plan Merger

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 012 (closed 2026-04-14) introduced `/spec_kit:start` as a canonical intake command AND simultaneously embedded `/start` absorption logic inline in `/spec_kit:plan` and `/spec_kit:complete`. The inline-absorption model proved out — every invocation path already flows through plan or complete. `/spec_kit:start` is now a vestigial duplicate maintaining three parallel copies of the same intake contract (five-state folder classification, four repair-mode branches, staged canonical-trio publication, relationship capture, resume semantics). This packet collapses the three surfaces into one shared reference module and hard-deletes the standalone command along with its YAML assets, CLI routing, and skill registry entry.

**Key Decisions**: Extract shared intake module at `.opencode/skill/system-spec-kit/references/intake-contract.md`; hard delete `/spec_kit:start` surface + assets atomically; preserve closed packet 012 as immutable record via supersedes relationship.

**Critical Dependencies**: Packet 012 (closed, referenced via `graph-metadata.json` supersedes); `/spec_kit:resume` routing must update to redirect re-entry via `/spec_kit:plan --intake-only`; harness skill registry mutation needed to remove `spec_kit:start` entry.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-15 |
| **Branch** | `015-start-into-plan-merger` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three parallel intake surfaces exist today: the standalone `/spec_kit:start` command (340 LOC in `.opencode/command/spec_kit/start.md`), plus inline absorption blocks in `/spec_kit:plan` (lines 79–150 of `plan.md`) and `/spec_kit:complete` (Section 0 Step 5a of `complete.md`). Each maintains the same five-state folder classification (empty-folder, partial-folder, repair-mode, placeholder-upgrade, populated-folder), four repair modes (create, repair-metadata, resolve-placeholders, abort), staged trio publication semantics, and relationship-capture dedup logic. The inline-absorption pattern 012 installed proved the coupled-intake model works; the standalone command is vestigial and actively adds drift risk as each surface evolves independently.

### Purpose
Eliminate the duplicate intake surface. Extract one canonical intake-contract reference module, collapse plan.md and complete.md's inline blocks to reference it, add a `--intake-only` flag on `/spec_kit:plan` for standalone intake invocations, and hard-delete `/spec_kit:start` along with all its assets and downstream references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skill/system-spec-kit/references/intake-contract.md` capturing full intake logic extracted from start.md
- Expand `.opencode/command/spec_kit/plan.md` to absorb intake as Step 1 via shared-module reference; add `--intake-only` flag halting after Step 1
- Refactor `.opencode/command/spec_kit/complete.md` Section 0 to reference shared module (no inline duplication)
- Update `/spec_kit:resume` routing so `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` directs to `/spec_kit:plan --intake-only` with prefilled state
- Delete `.opencode/command/spec_kit/start.md`
- Delete YAML assets `spec_kit_start_auto.yaml` and `spec_kit_start_confirm.yaml`
- Delete `.gemini/commands/spec_kit/start.toml`
- Remove `spec_kit:start` skill registry entry from harness configuration
- Update all 28 downstream reference files (enumerated below)

### Out of Scope
- Packet 012 canonical docs — closed packets are immutable records; supersession declared in 015's graph-metadata only
- Historical changelog entries at `.opencode/changelog/01--system-spec-kit/` — historical records, not rewritten
- Any non-spec-kit commands (`/improve:*`, `/create:*`, `/memory:*`, `/doctor:*`)
- Packet 013 (advisor-phrase-booster-tailoring, in-progress) and packet 014 (save-flow-unified-journey, in-progress) — unrelated scope
- `scratch/` contents inside 012 — preserved as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/references/intake-contract.md` | Create | Canonical intake contract (folder classification, repair modes, trio publication, relationships, resume, lock) |
| `.opencode/command/spec_kit/plan.md` | Modify | Step 1 references shared module; add `--intake-only` flag; preserve `:with-phases` |
| `.opencode/command/spec_kit/complete.md` | Modify | Section 0 references shared module; remove inline block |
| `.opencode/command/spec_kit/resume.md` | Modify | Route intake re-entry reasons to `/spec_kit:plan --intake-only` |
| `.opencode/command/spec_kit/start.md` | Delete | Vestigial after merger |
| `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml` | Delete | Asset for deleted command |
| `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` | Delete | Asset for deleted command |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Reflect new workflow + `--intake-only` branch |
| `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Reflect new workflow + `--intake-only` branch |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Reflect Section 0 reference-only refactor |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Reflect Section 0 reference-only refactor |
| `.opencode/command/spec_kit/README.txt` | Modify | Remove `/start` references (lines 61, 91, 138, 145) |
| `.opencode/command/README.txt` | Modify | Remove `/start` from command index |
| `.gemini/commands/spec_kit/start.toml` | Delete | CLI routing for deleted command |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Remove `/start` from command listings (lines 121, 210, 564, 923, 932) |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Remove `/start` mentions (lines 412–414, 624, 626) |
| `.opencode/skill/system-spec-kit/templates/README.md` | Modify | Remove `/start` from phase-system docs (lines 79, 96) |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | Modify | Remove `/start` delegation note (line 100) |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | Modify | Remove `/start` delegation note (line 106) |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | Modify | Remove `/start` delegation note (line 102) |
| `.opencode/skill/system-spec-kit/templates/addendum/README.md` | Modify | Remove `/start` reference (line 50) |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Remove `/start` handoff reference (line 445) |
| `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` | Modify | Update protocol to reflect no-`/start` world (lines 27, 196, 201) |
| `.opencode/skill/sk-deep-review/README.md` | Modify | Remove `/start` reference (line 418) |
| `.opencode/skill/skill-advisor/README.md` | Modify | Remove `/start` from routing docs (line 453) |
| `.opencode/skill/cli-claude-code/references/agent_delegation.md` | Modify | Update delegation reference (line 297) |
| `.opencode/skill/cli-codex/references/agent_delegation.md` | Modify | Update delegation reference (line 320) |
| `.opencode/skill/cli-gemini/references/agent_delegation.md` | Modify | Update delegation reference (line 257) |
| `.opencode/install_guides/README.md` | Modify | Remove `/start` from install guide index |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modify | Remove `/start` from setup walkthrough |
| `.opencode/README.md` | Modify | Remove `/start` from top-level command listing |
| `README.md` | Modify | Update command-graph diagram (lines 876, 882, 927, 931) |
| `.opencode/specs/descriptions.json` | Modify | Update 012 packet description entry (line 4809) — mark deliverable superseded |
| `<harness skill registry file>` | Modify | Remove `spec_kit:start` entry (exact file located during M0 audit) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared intake contract exists | `.opencode/skill/system-spec-kit/references/intake-contract.md` authored with all five folder states, four repair modes, trio publication, relationship capture, resume semantics, intake lock |
| REQ-002 | plan.md absorbs intake via reference | `plan.md` Step 1 references shared module; no duplicate intake logic in plan.md body |
| REQ-003 | complete.md absorbs intake via reference | `complete.md` Section 0 references shared module; no duplicate intake logic in complete.md body |
| REQ-004 | `--intake-only` flag works | `/spec_kit:plan --intake-only` halts after Step 1 (trio published, no planning) |
| REQ-005 | resume.md routing updated | `/spec_kit:resume` routes intake re-entry to `/spec_kit:plan --intake-only` with prefilled state |
| REQ-006 | start.md + assets deleted | `start.md`, 2 YAML assets, `.gemini/.../start.toml` removed from repo |
| REQ-007 | Skill registry cleaned | `spec_kit:start` no longer surfaces in harness skill list |
| REQ-008 | Zero forward-looking `/start` refs | grep `/spec_kit:start\|spec_kit/start.md` in forward-looking docs returns zero matches (historical changelogs excluded) |
| REQ-009 | Closed packet 012 untouched | `git diff 012-spec-kit-commands/` shows zero modifications |
| REQ-010 | 015 records supersession | `graph-metadata.json` for 015 contains `manual.supersedes = [012-spec-kit-commands]` with reason |
| REQ-011 | Structural validation passes | `validate.sh 015-start-into-plan-merger --strict` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Root README command-graph updated | Lines 876, 882, 927, 931 of root `README.md` reflect new architecture; graph diagram shows no `/spec_kit:start` node |
| REQ-013 | CLI agent-delegation refs updated | All three cli-* skill agent_delegation.md files carry correct post-merger references |
| REQ-014 | Install guides updated | Both install guide files free of `/start` references |
| REQ-015 | Template READMEs updated | All five template README files free of `/start` delegation notes |
| REQ-016 | Changelog entry authored | New entry at `.opencode/changelog/01--system-spec-kit/vX.Y.Z.md` documents merger and deprecation |
| REQ-017 | sk-doc validator PASS | All 015 canonical docs pass DQI scoring |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shared intake module exists with complete contract (folder states, repair modes, trio publication, relationship capture, resume semantics, intake lock)
- **SC-002**: `plan.md` Step 1 references shared module; no duplicate intake logic
- **SC-003**: `complete.md` Section 0 references shared module; no duplicate intake logic
- **SC-004**: `/spec_kit:plan --intake-only` halts after Step 1 end-to-end
- **SC-005**: `/spec_kit:resume` re-entry routes to `/spec_kit:plan --intake-only` correctly
- **SC-006**: `start.md`, 2 YAML assets, `.gemini/.../start.toml` deleted
- **SC-007**: Harness skill registry no longer surfaces `spec_kit:start`
- **SC-008**: Zero `/spec_kit:start` references in forward-looking docs (grep verified)
- **SC-009**: Closed packet 012 internals untouched (diff verified)
- **SC-010**: `graph-metadata.json` records `manual.supersedes = [012-spec-kit-commands]`
- **SC-011**: sk-doc validator PASS on all 015 canonical docs
- **SC-012**: `validate.sh --strict` exits 0 for 015 packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 012 (closed) | Supersession relationship must be declared in 015 graph-metadata; 012 cannot be mutated | Use `manual.supersedes` field at 015; add evidence note in 015 decision-record.md ADR-008 |
| Dependency | Harness skill registry | Removal of `spec_kit:start` entry requires knowing exact registry file path | M0 audit task T004 locates file |
| Dependency | `/spec_kit:resume` (independent command) | Routing change must match shared module's `reentry_reason` values | M4 verifies round-trip test |
| Risk | plan.md size growth | Projected 550–600 LOC after intake absorption; cognitive overhead in a single prompt | Shared-module extraction reduces duplication; reference-only inclusion keeps plan.md from carrying full contract |
| Risk | Atomic downstream sweep misses a ref | 28 modify + 3 delete files = 31 touch points; regression risk if any `/start` reference stays | M0 audit establishes exhaustive grep baseline; M5 closure re-runs grep; P0 CHK-034 blocks closeout |
| Risk | Intake lock race | Lock must cover Step 1 only, not Steps 2–8 | ADR-006 scopes lock explicitly; shared module documents release point |
| Risk | Breaking external invokers | External scripts/docs outside repo may call `/spec_kit:start` | Hard delete is user-requested; release changelog REQ-016 provides migration note |
| Risk | sk-doc voice drift in intake-contract.md | New reference doc must match project voice | sk-doc validator enforced as P0 in CHK-041 (checklist surfaces via REQ-017) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Intake contract execution time unchanged from current `/spec_kit:start` baseline (target: <2s on healthy folder classification)

### Security
- **NFR-S01**: Intake lock prevents concurrent trio publication under same spec_folder path (fail-closed semantics from start.md preserved)

### Reliability
- **NFR-R01**: Staged trio publication remains atomic — partial writes never leave visible half-published state (temp + rename semantics preserved)
- **NFR-R02**: `/spec_kit:plan --intake-only` is idempotent on empty folder (repeat invocation yields identical trio, no duplicate intake lock)

### Quality
- **NFR-Q01**: `validate.sh --strict` PASS on 015 canonical docs before closeout
- **NFR-Q02**: sk-doc DQI PASS on all 015 canonical docs
- **NFR-Q03**: Grep sweep confirms zero `/spec_kit:start` references in forward-looking scoped paths

---

## 8. EDGE CASES

### Data Boundaries
- **Empty folder**: `--intake-only` publishes trio + intake lock, no planning artifacts (plan.md / tasks.md / checklist.md) created
- **Populated folder with `--intake-only`**: No-op on trio (already exists), exits cleanly; used for "check state" semantics

### Error Scenarios
- **Intake lock contention**: Fail-closed — return error, do not partial-write
- **Staged trio rename failure**: Leave pre-existing folder untouched; emit explicit error with recovery steps
- **Resume re-entry to deleted start.md invocation**: Backward-compat handling — older sessions that persisted `reentry_command: /spec_kit:start` must be resolved via session migration note in REQ-016 changelog
- **External script invoking `/spec_kit:start`**: Hard delete breaks these; changelog provides migration mapping

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 31, LOC: ~550 expected delta, Systems: 5 (commands, skills, templates, CLI configs, registry) |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y (external invokers), Architectural: Y (supersedes closed-packet decision) |
| Research | 8/20 | Downstream audit needed but bounded — every ref is in-repo grep-discoverable |
| Multi-Agent | 5/15 | Workstreams: single-agent M1–M4 (sequential); parallel acceptable for M5 sweep |
| Coordination | 10/15 | Dependencies: closed packet 012, resume.md, skill registry |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Atomic sweep misses a downstream ref | H | M | M0 audit + M5 grep closure gate (CHK-034) |
| R-002 | External invokers break after hard delete | M | M | Release changelog migration note (REQ-016) |
| R-003 | Skill registry mutation requires harness restart | M | L | Document restart step in implementation-summary.md at closeout |
| R-004 | plan.md size growth causes cognitive overhead | L | M | Reference-only absorption; shared module carries detail |
| R-005 | Intake lock race in shared module | H | L | ADR-006 scopes lock to Step 1 only |
| R-006 | Resume round-trip fails for old sessions | M | L | Migration note + test scenario in CHK-023 |

---

## 11. USER STORIES

### US-001: Unified intake surface (Priority: P0)

**As a** SpecKit user invoking `/spec_kit:plan`, **I want** intake to happen automatically when needed, **so that** I don't need to know about a separate `/spec_kit:start` command.

**Acceptance Criteria**:
1. Given an empty folder, When I run `/spec_kit:plan feature-description`, Then trio is published AND planning proceeds with no separate command invocation
2. Given a populated folder, When I run `/spec_kit:plan feature-description`, Then intake block is bypassed cleanly
3. Given a folder needing repair, When I run `/spec_kit:plan`, Then repair-mode interview runs inline before planning

---

### US-002: Intake-only invocation (Priority: P0)

**As a** SpecKit user wanting to create a spec folder without planning yet, **I want** a `--intake-only` flag, **so that** I can set up the folder and return to it later.

**Acceptance Criteria**:
1. Given an empty folder, When I run `/spec_kit:plan feature-description --intake-only`, Then trio is published AND the command exits without producing plan.md/tasks.md/checklist.md
2. Given a populated folder, When I run `/spec_kit:plan --intake-only`, Then no-op exit with informational message

---

### US-003: Resume continuity (Priority: P1)

**As a** SpecKit user resuming interrupted work, **I want** `/spec_kit:resume` to route me correctly when I was mid-intake, **so that** I don't lose state.

**Acceptance Criteria**:
1. Given a session with `reentry_reason: incomplete-interview`, When I run `/spec_kit:resume`, Then I'm routed to `/spec_kit:plan --intake-only` with prefilled state
2. Given a session with `reentry_reason: placeholder-upgrade`, When I run `/spec_kit:resume`, Then I'm routed identically

---

### US-004: Deprecation clarity (Priority: P1)

**As a** SpecKit user who previously used `/spec_kit:start`, **I want** clear migration guidance, **so that** I can update my workflows.

**Acceptance Criteria**:
1. Given I check the changelog, When I look up this release, Then I find the migration mapping `/spec_kit:start → /spec_kit:plan --intake-only`
2. Given I invoke the deleted `/spec_kit:start`, Then harness returns "command not found" cleanly (no silent failure)

---

## 12. OPEN QUESTIONS

- None at documentation time. All architectural choices resolved via AskUserQuestion during planning session 2026-04-15.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Superseded Packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/` (closed 2026-04-14; supersedes its "intake ≠ planning" design)
