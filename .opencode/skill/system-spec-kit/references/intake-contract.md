---
title: Intake Contract Reference
description: Canonical spec-folder intake contract shared by /spec_kit:plan and /spec_kit:complete. Defines folder classification, repair-mode routing, staged trio publication, relationship capture, resume semantics, and the intake lock.
---

# Intake Contract Reference

This reference module defines the single canonical intake contract used by any SpecKit command that needs to create, repair, or resume a spec folder. Callers execute this contract inline rather than invoking a separate command — the workflow runs as Step 1 of `/spec_kit:plan` and Section 0 of `/spec_kit:complete`.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

<!-- SPECKIT_REFERENCE_SOURCE: intake-contract | v1.0 -->
`/spec_kit:plan --intake-only` exposes intake as a standalone surface (halts after the Emit phase); `/spec_kit:resume` redirects re-entry for `reentry_reason in {incomplete-interview, placeholder-upgrade, metadata-repair}` to `/spec_kit:plan --intake-only` with prefilled state.

### Contract Interface

**Inputs** (resolved by caller before entering the intake workflow):
- `$ARGUMENTS` — optional feature description plus pre-binding flags
- `--spec-folder=PATH` — explicit target (bypass auto-discovery)
- `--level=N` — pre-set documentation level (1 / 2 / 3 / 3+)
- `--start-state=STATE` — pre-classified folder state
- `--repair-mode=MODE` — pre-selected repair mode
- `--record-relationships=yes|no` — relationship-capture toggle
- `--depends-on=PACKET_ID[,PACKET_ID...]` — seed depends_on
- `--related-to=PACKET_ID[,PACKET_ID...]` — seed related_to
- `--supersedes=PACKET_ID[,PACKET_ID...]` — seed supersedes
- `--intake-only` — (plan.md only) halt after Emit phase

> **Phase parent note.** When the invoking workflow targets a folder that already qualifies as a phase parent (≥1 NNN-named populated child), level selection and addendum/composition do not apply at the parent level. The intake publishes only the lean trio (`spec.md` + `description.json` + `graph-metadata.json`) using `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` as the parent scaffold. Heavy docs live in the children. Phase children created alongside the parent still go through the full Level 1–3+ contract for their assigned level.

**Outputs** (returned to caller, or surfaced alongside caller-local preflight state when the invoking workflow emits both):
- `feature_description` — free-text description
- `spec_path` — resolved target folder path
- `folder_state` — caller-local Step 0 classifier used by the invoking YAML asset (`no-spec | partial-folder | repair-mode | placeholder-upgrade | populated-folder`); surface for diagnostics and event parity only
- `start_state` — canonical intake-contract state mapped from `folder_state` and consumed downstream (see §3)
- `repair_mode` — selected mode (see §4)
- `execution_mode` — AUTONOMOUS | INTERACTIVE
- `level_recommendation` — output of `recommend-level.sh`
- `selected_level` — kept recommendation or user override
- `manual_relationships` — `{ depends_on, related_to, supersedes }` grouped with packet_id dedup
- `resume_question_id` — first unresolved question ID or null
- `reentry_reason` — `none | incomplete-interview | placeholder-upgrade | metadata-repair`
- `STATUS` — `OK | FAIL | CANCELLED`

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:workflow-phases -->
## 2. WORKFLOW PHASES

| Phase | Purpose | Outputs |
|-------|---------|---------|
| Preflight | Inspect + classify folder; acquire advisory intake lock | `spec_path`, `folder_state` (caller-local), `start_state` (canonical), `repair_mode`, `resume_question_id`, `reentry_reason` |
| Interview | Consolidated single-prompt Q0–Q4+ for missing fields | `feature_description`, `level_recommendation`, `selected_level`, `manual_relationships` |
| Emit | Stage + rename canonical trio (`spec.md`, `description.json`, `graph-metadata.json`) | Canonical trio published or fail-closed recovery output |
| Save | Optional memory-save branch (only when structured context exists) | Independent memory-save result |
| Report | Return stable contract to caller | `STATUS=OK\|FAIL\|CANCELLED` with all returned fields |

---

<!-- /ANCHOR:workflow-phases -->

<!-- ANCHOR:folder-state-classification -->
## 3. FOLDER STATE CLASSIFICATION

Invoking YAML assets first classify a local `folder_state`, then map it to the canonical `start_state` enum before returning contract outputs or emitting intake events. After T-YML-PLN-01, four of the five tokens align 1:1; only the empty-folder case keeps a local-vs-canonical rename.

| Local `folder_state` | Canonical `start_state` | Consumption |
|----------------------|-------------------------|-------------|
| `no-spec` | `empty-folder` | Local branch token only; downstream callers should consume `start_state=empty-folder` |
| `partial-folder` | `partial-folder` | Shared across local branching and canonical intake contract |
| `repair-mode` | `repair-mode` | Shared across local branching and canonical intake contract |
| `placeholder-upgrade` | `placeholder-upgrade` | Shared across local branching and canonical intake contract |
| `populated-folder` | `populated-folder` | Shared across local branching and canonical intake contract |

The canonical `start_state` values are:

| State | Detection | Default repair_mode |
|-------|-----------|---------------------|
| `empty-folder` | Folder missing OR no `spec.md`, no `description.json`, no `graph-metadata.json`, no tracked seed markers | `create` |
| `partial-folder` | Folder exists, trio incomplete, no tracked seed markers, no intake lock | `repair-metadata` |
| `repair-mode` | Folder exists, trio present but metadata invalid (schema failure, missing required fields) | `repair-metadata` |
| `placeholder-upgrade` | Tracked seed markers present (e.g., `[###-feature-name]`, `[YYYY-MM-DD]` in non-placeholder positions) | `resolve-placeholders` |
| `populated-folder` | Full trio present, metadata valid, no seed markers | `abort` (unless user explicitly opts into repair/overwrite) |

**Tracked seed markers** force `placeholder-upgrade` even when a folder otherwise looks populated. Tracked markers include:
- `[###-feature-name]` in `implementation-summary.md` metadata when the packet is supposed to be closed
- `[YYYY-MM-DD]` in verification dates
- Template-placeholder fragments left unfilled

> **Note:** `implementation-summary.md` with `[###-feature-name]` during the *planning* phase is NOT a tracked marker — it is the expected placeholder until implementation completes. Classification must distinguish planning-phase placeholders from closeout-phase placeholders.

---

<!-- /ANCHOR:folder-state-classification -->

<!-- ANCHOR:repair-mode-routing -->
## 4. REPAIR-MODE ROUTING

After folder classification, the caller confirms (or overrides) the repair mode before the Interview phase runs:

| Mode | Purpose | Behavior |
|------|---------|----------|
| `create` | Fresh spec folder | Author canonical trio from scratch; run full interview |
| `repair-metadata` | Fix broken `description.json` / `graph-metadata.json` / partial trio | Re-run helpers (`generate-description.js`, graph backfill) without overwriting `spec.md` body |
| `resolve-placeholders` | Fill tracked seed markers | Interview only for unresolved markers; other canonical content preserved |
| `abort` | Populated folder, no repair intent | Return STATUS=CANCELLED, no mutations |

`abort` is the default for `populated-folder` unless the caller explicitly selects a repair path. Never auto-overwrite a populated folder.

---

<!-- /ANCHOR:repair-mode-routing -->

<!-- ANCHOR:consolidated-interview -->
## 5. CONSOLIDATED INTERVIEW

All missing inputs are gathered in a SINGLE consolidated prompt. Never split into multiple messages.

**Questions** (asked only if unresolved by flags or discovery):

- **Q0. Feature Description** — what the spec folder captures
- **Q1. Target Folder State** — A) empty/create · B) partial/resume · C) repair metadata · D) populated/review
- **Q2. Documentation Level** — recommendation from `recommend-level.sh`; keep or override to Level 1 / 2 / 3 / 3+
- **Q3. Record Relationships Now?** — A) No · B) Yes
- **Q4+. Relationship Entries** (only if Q3 = Yes) — grouped `depends_on`, `related_to`, `supersedes` with `packet_id` key and dedup per relation type

**Reply format examples:**
- `"Feature intake refactor, A, keep, A"`
- `"B, override to Level 3, B, depends_on=026-009 reason: build on prior graph audit"`

Parse the response into the returned contract fields. In `:auto` mode, proceed only when the full contract is pre-bound by args or inherited parent state; otherwise the ASK path still applies.

---

<!-- /ANCHOR:consolidated-interview -->

<!-- ANCHOR:canonical-trio-publication -->
## 6. CANONICAL TRIO PUBLICATION

The Emit phase stages and commits three files atomically:

1. `spec.md` — canonical specification (per Level 1 / 2 / 3 / 3+ template)
2. `description.json` — generated via `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js <folder> <base>`
3. `graph-metadata.json` — generated via backfill or authored with supersedes/depends_on from `manual_relationships`

**Staged semantics:**
- Write to `<file>.tmp` first
- After all three temp writes succeed, rename atomically
- On any failure mid-write: remove temp files, preserve pre-existing files, emit exact recovery command
- Helper: `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh` for full trio generation

**Success condition:** All three canonical files present and structurally valid BEFORE the optional memory-save branch runs. The save branch is never the success gate.

---

<!-- /ANCHOR:canonical-trio-publication -->

<!-- ANCHOR:manual-relationships -->
## 7. MANUAL RELATIONSHIPS

Relationship objects use:
```json
{
  "packet_id": "system-spec-kit/026-graph-and-context-optimization/NNN-slug",
  "reason": "one-sentence justification",
  "source": "spec.md:Scope",
  "spec_folder": "optional-override-path",
  "title": "optional-human-title"
}
```

**Dedup rule:** within each relation type (`depends_on`, `related_to`, `supersedes`), entries dedupe by `packet_id`. Last entry wins.

**Storage:** persisted in `graph-metadata.json` under `manual.depends_on[]`, `manual.related_to[]`, `manual.supersedes[]`.

---

<!-- /ANCHOR:manual-relationships -->

<!-- ANCHOR:resume-semantics -->
## 8. RESUME SEMANTICS

When a session is interrupted mid-intake, `resume_question_id` and `reentry_reason` persist the re-entry point.

| reentry_reason | Meaning | Re-entry path |
|----------------|---------|---------------|
| `none` | Clean state | Not a re-entry |
| `incomplete-interview` | User abandoned mid-prompt | `/spec_kit:plan --intake-only` with prefilled state |
| `placeholder-upgrade` | Seed marker resolution was pending | `/spec_kit:plan --intake-only` with `--repair-mode=resolve-placeholders` |
| `metadata-repair` | Trio schema validation failed | `/spec_kit:plan --intake-only` with `--repair-mode=repair-metadata` |

`/spec_kit:resume` reads these fields from handover state and routes accordingly.

---

<!-- /ANCHOR:resume-semantics -->

<!-- ANCHOR:intake-lock -->
## 9. INTAKE LOCK

An advisory lock file prevents concurrent trio publication on the same folder.

**Scope:** Step 1 (intake) only. Release on Emit success OR on cancel/abort. Do NOT hold the lock across planning Steps 2–8 of `/spec_kit:plan`.

**Fail-closed behavior:**
- Stale lock (older than a conservative timeout): surface exact cleanup command (`rm <path>.intake.lock`)
- Contended lock (another session active): fail with guidance to retry after that session reports STATUS
- Never silently take an existing lock

---

<!-- /ANCHOR:intake-lock -->

<!-- ANCHOR:optional-memory-save-branch -->
## 10. OPTIONAL MEMORY SAVE BRANCH

Memory save runs AFTER Emit success, only when:
- Structured context exists beyond the canonical trio (e.g., research artifacts, decision records, prior session handoffs)
- Caller explicitly allows the branch (default: skip for fresh creates, allow for repair/resume)

Invocation:
```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json <spec-folder>
```

Report save result independently from trio success — a failed save never invalidates a successful trio.

---

<!-- /ANCHOR:optional-memory-save-branch -->

<!-- ANCHOR:error-handling -->
## 11. ERROR HANDLING

| Error | Action |
|-------|--------|
| Populated folder without explicit repair approval | Abort with STATUS=CANCELLED; show repair/overwrite choices |
| Stale or contended intake lock | Fail closed (STATUS=FAIL) with exact cleanup or retry guidance |
| Missing template or helper failure | Halt Emit; preserve pre-existing files; report failing helper |
| Tracked seed-marker conflict | Reclassify to `placeholder-upgrade` OR halt on ambiguity |
| Memory save requested without structured context | Skip save branch; keep canonical trio as success |
| Staged rename failure | Remove temp files; keep pre-existing files; STATUS=FAIL |

---

<!-- /ANCHOR:error-handling -->

<!-- ANCHOR:consumer-integration -->
## 12. CONSUMER INTEGRATION

### `/spec_kit:plan`

Step 1 (Intake) references this module. Plan's consolidated setup prompt (Section 0) detects folder state early:

- `populated-folder` + no `--intake-only` → skip intake block; proceed to Step 2 (Request Analysis)
- `populated-folder` + `--intake-only` → no-op exit with informational message
- Any non-`populated` state → execute Phases 1–5 of this contract, then proceed OR halt if `--intake-only`

### `/spec_kit:complete`

Section 0 references this module with identical semantics:

- `populated-folder` → skip intake; proceed to plan + implement + verify pipeline
- Any non-`populated` state → execute Phases 1–5, then proceed through full completion workflow

### `/spec_kit:resume`

Reads `handover.md` and `_memory.continuity` for `reentry_reason` and `resume_question_id`. Routes intake re-entry to `/spec_kit:plan --intake-only` with appropriate `--repair-mode` and `--start-state` prefilled from saved state.

---

<!-- /ANCHOR:consumer-integration -->

<!-- ANCHOR:quality-gates -->
## 13. QUALITY GATES

- Folder state classified to exactly one of the five values
- `level_recommendation` and `selected_level` stored separately (override never erases recommendation)
- Manual relationships dedupe by `packet_id` within each relation type
- Canonical trio published via staged temp + rename; pre-existing files intact on failure
- Intake lock acquired at Phase 1 entry, released at Phase 3 exit (or on cancel)
- `:confirm` mode pauses at four gates: folder-state review, interview summary, canonical trio emission, optional save branching
- `:auto` mode reaches zero prompts only when the full contract is pre-bound

---

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:reference -->
## 14. REFERENCE

| Category | Paths |
|----------|-------|
| Spec-kit templates | `.opencode/skill/system-spec-kit/templates/` (Level 1 / 2 / 3 / 3+) |
| Phase-parent template | `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` (lean trio template) |
| Migration-bridge template | `.opencode/skill/system-spec-kit/templates/context-index.md` (optional; for reorganized phase parents) |
| Recommend-level helper | `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` |
| Create helper | `.opencode/skill/system-spec-kit/scripts/spec/create.sh` |
| Description generator | `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js` |
| Memory save script | `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` |
| Validator | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Deep-research spec check | `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` |

---

<!-- /ANCHOR:reference -->

<!-- ANCHOR:supersedes -->
## 15. SUPERSEDES

This module supersedes the deleted standalone intake command surface that packet `012-command-graph-consolidation` removed from `026-graph-and-context-optimization`. The former standalone intake surface duplicated the same logic that `/spec_kit:plan` and `/spec_kit:complete` carried inline, producing three parallel copies that drifted independently. Consolidation into this single reference eliminates drift risk and simplifies the command graph.

**Packet reference:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/`

**Delivery note:** The packet delivered 15 milestones (M1-M9 on 2026-04-14, M10-M15 on 2026-04-15). `/spec_kit:plan` and `/spec_kit:complete` reference this module in place of inline intake blocks; `/spec_kit:plan --intake-only` provides the standalone invocation path with an explicit YAML gate. See the packet's `decision-record.md` for the architectural rationale (ADR-002 through ADR-010).

---

<!-- /ANCHOR:supersedes -->
