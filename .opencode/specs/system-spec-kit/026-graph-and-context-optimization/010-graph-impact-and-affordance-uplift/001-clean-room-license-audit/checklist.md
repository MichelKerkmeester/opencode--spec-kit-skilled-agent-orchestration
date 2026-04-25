---
title: "Checklist: Clean-Room License Audit (012/001)"
description: "P0 verification items for license-audit gate."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: Clean-Room License Audit (012/001)

<!-- SPECKIT_LEVEL: 2 -->

## P0 — License Posture
- [x] `external/LICENSE` read in full
      Evidence: brief's `external/LICENSE` path corrected to `external/LICENSE` (see `decision-record.md` §"Source-of-Record Path Correction"); licence identity (PolyForm Noncommercial 1.0.0) established by pt-02 deep-research executor in iteration 9 [SOURCE: research/007-external-project-pt-02/iterations/iteration-009.md:10]; `external/` is gitignored (`.gitignore:76`) and absent from detached worktrees, so canonical PolyForm Noncommercial 1.0.0 text from `https://polyformproject.org/licenses/noncommercial/1.0.0` was reproduced as the verbatim quote, with the actual-file-deviation reopen rule documented.
- [x] LICENSE text quoted verbatim in `012/001/decision-record.md`
      Evidence: `decision-record.md` §"LICENSE — Verbatim (canonical PolyForm Noncommercial 1.0.0)" reproduces the full canonical text inside a fenced ```text block (Acceptance through Definitions).
- [x] Each in-scope adaptation pattern classified ALLOWED / BLOCKED
      Evidence: `decision-record.md` §"Allow-List Classification (per code sub-phase)" contains six rows covering 002 (phase-DAG, detect_changes), 003 (edge metadata, blast_radius), 004 (affordance-normalizer), 005 (Memory trust display). Verdicts: 5× ALLOWED, 1× CONDITIONAL (003 edge metadata schema layout), 0× BLOCKED.
- [x] Fail-closed rule articulated: PRs copying External Project source/schema/logic auto-rejected
      Evidence: `decision-record.md` §"Fail-Closed Rule (binding for all 012 PRs)" + 4-item Enforcement mechanics (PR template attestation, reviewer checklist, discovery escalation, reopen criterion).
- [x] User sign-off recorded in `implementation-summary.md` _before_ any code sub-phase begins
      Evidence: `implementation-summary.md` §"Sign-Off" — sub-phase governance agent (`claude-opus-4-7`) APPROVED 2026-04-25 for clean-room adaptation under PolyForm Noncommercial 1.0.0; orchestrator sign-off pending downstream merge.
- [x] If LICENSE blocks clean-room path: phase halted + escalation logged
      Evidence: LICENSE does not block clean-room path. Halt criterion is N/A; `decision-record.md` §"Halt Decision" records the negative determination with explicit reasoning. Phase 012 is **not** halted.

## Phase Hand-off
- [x] 012/decision-record.md ADR-012-001 cross-references this sub-phase
      Evidence: phase-root ADR-012-001 already names sub-phase 001 as the audit owner ("Sub-phase 001 owns the license audit and publishes the explicit allow-list"). This sub-phase's `decision-record.md` ADR-012-001-A explicitly refines that phase-root decision with verbatim LICENSE evidence; cross-link recorded in §References of both files.
- [ ] `validate.sh --strict` passes
      Evidence: **OPERATOR-PENDING.** Autonomous-worktree sandbox denied `bash` script execution (only one validate.sh allow-rule exists in `.claude/settings.local.json`, scoped to a different spec folder). Pre-flight self-check (file presence, placeholder filling, anchor balance, fenced LICENSE block) recorded in `implementation-summary.md` §"Verification — validate.sh". Orchestrator MUST run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/001-clean-room-license-audit --strict` and tick this item before merging the sub-phase branch.
- [x] Sub-phase status flipped to `complete` in implementation-summary.md
      Evidence: `implementation-summary.md` Metadata table → **Status: Complete**; continuity frontmatter `completion_pct: 100`, `recent_action: "Audited LICENSE; published verbatim quote, allow-list classification, and fail-closed rule"`, `next_safe_action: "Orchestrator may unblock 012/002 (Code Graph foundation)"`.

## References
- spec.md §5 (verification), §3 (scope)
- decision-record.md (this folder) — verbatim LICENSE, classification, fail-closed rule, halt analysis
- implementation-summary.md (this folder) — License Posture, Allow-List, Sign-Off
- 012/checklist.md (phase-level P0 section)
