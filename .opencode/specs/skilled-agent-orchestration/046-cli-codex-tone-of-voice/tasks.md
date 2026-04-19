---
title: "Task Breakdown: Codex Tone-of-Voice Personalization"
description: "Ordered task list for delivering Codex APP + CLI personalization assets with surgical SKILL.md integration and full spec-folder closure."
trigger_phrases:
  - "046 tasks"
  - "codex tone tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/046-cli-codex-tone-of-voice"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Execute tasks 2-4 (author assets)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "046-tasks-2026-04-19"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Codex Tone-of-Voice Personalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

> **⚠ PIVOT DURING IMPLEMENTATION.** Tasks T-07 through T-11 produced `cli-codex/assets/` artifacts that were subsequently removed (see ADR-006, ADR-007). Phase 5 below documents the replacement work: a user-global voice addendum at `<repo>/.codex/AGENTS.md` symlinked from `~/.codex/AGENTS.md`.

---

## TASKS

### Phase 1 — Spec Folder (6 tasks)

- [x] **T-01** — Create spec folder directory at `.opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice/`.
- [x] **T-02** — Author `spec.md` (REQ-001 through REQ-008, US-001/US-002/US-003).
- [x] **T-03** — Author `plan.md` (4 phases, dependencies, rollback, validation).
- [x] **T-04** — Author `tasks.md` (this file).
- [x] **T-05** — Author `checklist.md` with P0/P1/P2 items mapped to each REQ.
- [x] **T-06** — Author `decision-record.md` with 5 ADRs (later extended to 8 after pivots).

### Phase 2 — Initial Deliverable Assets (later removed, see ADR-006/ADR-007)

- [x] **T-07** — ~~Author `.opencode/skill/cli-codex/assets/codex_app_personalization.md`~~ — CREATED then REMOVED. Superseded by `<repo>/.codex/AGENTS.md` (ADR-007).
- [x] **T-08** — ~~Author `.opencode/skill/cli-codex/assets/codex_voice_module.md`~~ — CREATED then REMOVED. Superseded — orchestrators govern their own voice; humans use shell wrappers or the global AGENTS.md (ADR-006).

### Phase 3 — SKILL.md Integration (3 sub-edits, later revised)

- [x] **T-09** — Edit `cli-codex/SKILL.md` §2 Resource Domains block. (Later reverted after asset removal.)
- [x] **T-10** — Edit `cli-codex/SKILL.md` §2 LOADING_LEVELS pseudocode. (Later reverted.)
- [x] **T-11** — Edit `cli-codex/SKILL.md` §4 ALWAYS rules (Rule #10). Now states that AI-orchestrated delegations must NOT inject user-global voice content into delegated prompts.

### Phase 4 — Validation & Memory Save

- [x] **T-12** — Run `validate.sh --strict` on spec folder. Template-shape deviations documented as known strict-mode noise; no blocker correctness issues.
- [x] **T-13** — Walk `checklist.md` with evidence. Final state recorded in `implementation-summary.md`.
- [x] **T-14** — Author `implementation-summary.md` + compose save-context JSON + invoke `generate-context.js` to index the spec folder.

### Phase 5 — Scope Pivot: User-Global Voice Addendum (replaced T-07/T-08)

- [x] **T-15** — Write `~/.codex/AGENTS.md` with Compact-tier voice content. (Later relocated — see T-18.)
- [x] **T-16** — Strip full cli-codex/SKILL.md and README.md references to `codex_voice_module.md` after its removal.
- [x] **T-17** — Refactor the global AGENTS.md to cover only Voice / Tone / Reasoning Visibility (three sections, dropping Scope / Code style / End-of-turn-rhythm-standalone; consolidating everything into the three target categories).
- [x] **T-18** — Move source-of-truth to `<repo>/.codex/AGENTS.md` for version control and sharing; replace `~/.codex/AGENTS.md` with a symlink to the repo file. Update the file's header to document the symlink architecture and cite the Claude Constitution + Soul Document as content grounding.
- [x] **T-19** — Delete `codex_app_personalization.md` and strip all remaining references from `cli-codex/SKILL.md` + `README.md`. Final cli-codex state: no voice-related assets; Rule #10 rewritten as a non-injection directive for AI orchestrators.
- [x] **T-20** — Finalize spec folder: update `spec.md` EXECUTIVE SUMMARY and frontmatter (completion_pct=100, status=Complete), append ADR-006/007/008 to `decision-record.md`, rewrite `implementation-summary.md`, annotate `tasks.md` (this file) with Phase 5. Regenerate `description.json` and `graph-metadata.json` via memory save.

---

## DEPENDENCIES BETWEEN TASKS

```
T-01 → T-02 → T-03 → T-04 → T-05 → T-06  (Phase 1, strictly ordered by prose coherence)
                                     ↓
T-07 ── parallel with ── T-08           (Phase 2, independent files)
                                     ↓
T-09 → T-10 → T-11                       (Phase 3, all in same SKILL.md file — sequence to avoid edit conflicts)
                                     ↓
T-12 → T-13 → T-14                       (Phase 4, validation before summary before memory save)
```

---

## COMPLETION CRITERIA

- All `[ ]` above flipped to `[x]`.
- Every task has verifiable evidence (file path, byte count, exit code) cited in `checklist.md` or `implementation-summary.md`.
- No outstanding blockers in `_memory.continuity.blockers`.
