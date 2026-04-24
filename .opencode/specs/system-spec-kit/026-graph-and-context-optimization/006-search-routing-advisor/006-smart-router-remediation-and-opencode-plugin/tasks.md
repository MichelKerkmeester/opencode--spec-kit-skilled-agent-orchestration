---
title: "Tasks: Smart-Router Remediation + OpenCode Plugin"
description: "Task tracking for Phase 023: stale router paths, static checker, ON_DEMAND tuning, CLI fallback safety, observe-only telemetry, OpenCode plugin, and verification."
trigger_phrases:
  - "023 smart router tasks"
  - "spec-kit-skill-advisor plugin tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 023 implementation and verification"
    next_safe_action: "Hand off plugin rollout and observe-only telemetry measurement"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The user pre-approved this spec folder and requested progressive task updates."
---
# Tasks: Smart-Router Remediation + OpenCode Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read Phase 023 `spec.md`, 021/002 synthesis, 021/001 V8/V9 findings, plugin pattern, Phase 020 advisor producer/renderer/metrics, and corpus sample.
- [x] T002 Create Level 2 `plan.md` scaffold for this packet.
- [x] T003 Create Level 2 `tasks.md` scaffold for progressive tracking.
- [x] T004 Create Level 2 `checklist.md` scaffold for completion verification.
- [x] T005 Create `implementation-summary.md` scaffold and keep it updated with decisions, hit rates, and verification evidence.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Area A: Scan all `.opencode/skill/*/SKILL.md` smart-router route paths and fix stale references.
- [x] T020 Area D: Create `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh`.
- [x] T021 Area D: Run the static checker and confirm exit 0 on missing-path validation.
- [x] T030 Area B: Measure baseline ON_DEMAND hit rate on the 200-prompt corpus.
- [x] T031 Area B: Apply conservative ON_DEMAND keyword additions across smart-routing skills.
- [x] T032 Area B: Re-measure ON_DEMAND hit rate and document actual result.
- [x] T040 Area C: Update `cli-codex`, `cli-copilot`, `cli-gemini`, and `cli-claude-code` zero-score fallbacks to UNKNOWN disambiguation.
- [x] T050 Area E: Create `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts`.
- [x] T051 Area E: Add telemetry Vitest coverage for compliance classes and JSONL roundtrip.
- [x] T060 Area F: Create `.opencode/plugins/spec-kit-skill-advisor.js`.
- [x] T061 Area F: Create `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`.
- [x] T062 Area F: Add `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T100 Run `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` and record exit code. [Evidence: exit 0, no missing route paths, 5 informational bloat warnings.]
- [x] T101 Run Phase 020 advisor/hook regression tests and record pass count. [Evidence: 19 files / 118 tests passed.]
- [x] T102 Run telemetry harness tests. [Evidence: `mcp_server/tests/smart-router-telemetry.vitest.ts` passed in 2-file 023 run.]
- [x] T103 Run skill-advisor plugin tests. [Evidence: `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` passed in 2-file 023 run.]
- [x] T104 Run `tsc --noEmit`. [Evidence: `npm run typecheck` exited 0.]
- [x] T105 Run `validate.sh` on the 023 folder with `--strict`. [Evidence: strict validation exited 0 with errors=0.]
- [x] T106 Update `implementation-summary.md` with files changed, decisions, metrics, and verification results. [Evidence: summary updated with Areas A-F and verification table.]
- [x] T107 Mark checklist items complete with evidence. [Evidence: checklist updated with P0/P1/P2 evidence.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification commands recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Inputs**: See the 021/001 and 021/002 research documents referenced by `spec.md`
<!-- /ANCHOR:cross-refs -->
