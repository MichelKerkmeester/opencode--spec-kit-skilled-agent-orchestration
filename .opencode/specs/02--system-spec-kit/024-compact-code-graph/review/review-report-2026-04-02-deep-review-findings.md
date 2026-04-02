---
title: "Deep Review Findings Report — Spec 024 Compact Code Graph"
description: "Consolidated deep-review verdict and findings for 024-compact-code-graph and phase folders, including command-gate evidence and release-readiness status."
date: "2026-04-02"
verdict: "PASS"
---

# Deep Review Findings Report

## Deep-Review Verdict

**PASS** for release-readiness.

Full delegated review wave executed with `gpt-5.3-codex` xhigh sub-agents (10 requested, run in 2 waves due 6 concurrent-agent platform limit), followed by repository command validation.

## Remediation Update (2026-04-02, post-fix pass)

### Summary

- Original blocker set from this report has been remediated in runtime/docs.
- Recursive packet validation moved from `81 errors / 119 warnings` to **`0 errors / 0 warnings`** after the warning-cleanup lane.
- The original lint blocker (`11` unused-variable errors) is resolved.
- `check:full` is now fully green after the separate 9-failure test lane remediation.

### Updated Gate Evidence

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/024-compact-code-graph --recursive`
  - Outcome: **PASSED** (`0` errors, `0` warnings)
  - Evidence: `/tmp/validate-024-warning-cleanup-pass5.log`
- `npm run build` in `.opencode/skill/system-spec-kit`
  - Outcome: **PASSED**
  - Evidence: `/tmp/build-system-spec-kit-final.log`
- `npm run check` in `.opencode/skill/system-spec-kit/mcp_server`
  - Outcome: **PASSED** (lint + typecheck)
  - Evidence: `/tmp/check-mcp-server-final.log`
- `TMPDIR=... npm run check:full` in `.opencode/skill/system-spec-kit/mcp_server`
  - Outcome: **PASSED** (lint + typecheck + full test suite)
  - Evidence: `/tmp/check-full-after-warning-cleanup.log`

### Finding Status (from this report)

- ✅ Validation hard failures remediated to zero-error state.
- ✅ Lint blocker remediated.
- ✅ Root packet phase/summary metadata synchronized to 25-phase reality.
- ✅ Stop-hook auto-save behavior implemented and docs aligned.
- ✅ Non-hook priming session identity handling hardened.
- ✅ Phase 011 claims/checklist downgraded to match partial runtime integration.
- ✅ Manual playbook scenario 261d rewritten to use supported tool inputs.
- ✅ Feature catalog root now includes category 22 coverage.
- ✅ includeTrace documentation aligned with current schema.
- ✅ Phase 025 wording corrected (guidance/hints, not hard guarantees) and stale Gemini defer item closed.
- ✅ Checklist notation normalized for PARTIAL items (`[~]`).
- ✅ README/template/workflow parity updates applied (counts/pathing/exceptions/copy pattern).

---

## P1 Findings (Blocking)

- Spec packet validation is failing hard across the parent + phases: `81 errors / 119 warnings`, including repeated `ANCHORS_VALID`, `TEMPLATE_HEADERS`, `TEMPLATE_SOURCE`, and `SPEC_DOC_INTEGRITY` failures.  
  Evidence: `/tmp/validate-024-compact-code-graph.log:3183`, `/tmp/validate-024-compact-code-graph.log:3188`, `/tmp/validate-024-compact-code-graph.log:3190`.

- `check:full` fails at lint with 11 `no-unused-vars` errors in runtime paths, so quality gate is red.  
  Evidence: `/tmp/check-full-mcp-server.log:14`, `/tmp/check-full-mcp-server.log:39`.

- Root packet cross-phase metadata is inconsistent/stale: placeholder phase map (`025-phase-25/` etc), conflicting shipped/deferred totals, and root summary still saying 24 phases.  
  Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:269`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:194`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/tasks.md:68`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:31`.

- Stop-hook auto-save behavior is documented as implemented but runtime does not execute `generate-context.js`; docs also self-contradict on this.  
  Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/spec.md:63`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:97`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:147`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:102`.

- Non-hook priming is not reliably session-isolated for common calls: priming can collapse to `__default__`, and health checks read global primed state.  
  Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:761`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:485`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:131`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:58`.

- Phase 011 claims “working-set integrated 3-source compaction,” but phase artifacts and runtime still admit tracker not wired into compaction retrieval path.  
  Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/spec.md:18`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist.md:21`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/implementation-summary.md:106`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:193`.

- Manual playbook scenario `261d` is not executable as written (`memory_stats` schema has no `sessionId`).  
  Evidence: `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:39`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:229`.

- Feature catalog root is incomplete vs active package (root TOC ends at 21 while manual playbook and foldering include category 22).  
  Evidence: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3`, `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:34`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:36`.

---

## P2 Findings (Non-Blocking But Important)

- `includeTrace` docs in phases 010/013 are stale; schema currently exposes it.  
  Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:104`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:690`.

- Phase 025 docs overstate guarantees (“structurally impossible”) while same phase says hints are non-blocking and defers a Gemini agent update that already exists.  
  Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:29`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/tasks.md:49`, `.gemini/agents/context-prime.md:135`.

- Checklist notation drift: items marked `[x]` while explicitly labeled `PARTIAL`.  
  Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:21`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:40`.

- README / template / workflow doc parity drift (command counts, `*.md` copy pattern pulling template README, missing debug exception in quick reference, `.ts` vs dist JS memory-save checkpoint).  
  Evidence: `README.md:62`, `.opencode/README.md:74`, `.opencode/skill/system-spec-kit/README.md:395`, `.opencode/skill/system-spec-kit/templates/level_3/README.md:63`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:574`, `.opencode/skill/system-spec-kit/SKILL.md:71`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:245`, `.opencode/skill/system-spec-kit/README.md:540`.

---

## Verified False Alarm (Discarded)

- A delegated reviewer flagged `.opencode/agent/deep-review.md` as read-only; current file is write-enabled.  
  Evidence: `.opencode/agent/deep-review.md:8`.

---

## Command Evidence

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/024-compact-code-graph --recursive`  
  Outcome: failed (`81 errors`, `119 warnings`).

- `npm run build` in `.opencode/skill/system-spec-kit`  
  Outcome: passed.

- `TMPDIR=... npm run check:full` in `.opencode/skill/system-spec-kit/mcp_server`  
  Outcome: failed at eslint (`11 errors`).

### Latest Re-Run Evidence (post-warning-cleanup)

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/024-compact-code-graph --recursive`  
  Outcome: passed (`0 errors`, `0 warnings`).  
  Evidence: `/tmp/validate-024-warning-cleanup-pass5.log`.

- `TMPDIR="$PWD/.tmp/vitest-tmp" npm run check:full` in `.opencode/skill/system-spec-kit/mcp_server`  
  Outcome: passed (`363` test files + `1` watcher file, no lint/type failures).  
  Evidence: `/tmp/check-full-after-warning-cleanup.log`.

---

## Workspace Note

- No review edits were made while collecting these findings.
- Dirty state observed during review: existing untracked `code-graph.sqlite` and modified fixture file `.opencode/skill/system-spec-kit/scripts/test-fixtures/002-valid-level1/implementation-summary.md:5`.

---

## Iteration Addendum (51-60, Historical Pre-Remediation Snapshot)

Date: `2026-04-02`  
Scope: follow-up deep-review sweep requested after initial report publication.
Note: this addendum reflects the state before the remediation updates documented above.

### Addendum Verdict

- No new `P0` findings at the time of this addendum.
- No net-new `P1/P2` findings at the time of this addendum.
- Previously reported blockers were reproducible in this pre-remediation snapshot.

### Iteration Outcomes

1. `51` Recursive spec validation re-run: unchanged failure totals.
   - Evidence: `/tmp/validate-024-compact-code-graph-iter2.log:3183`, `/tmp/validate-024-compact-code-graph-iter2.log:3188`, `/tmp/validate-024-compact-code-graph-iter2.log:3190`

2. `52` `check:full` re-run in `mcp_server`: unchanged lint failure (`11` `no-unused-vars` errors).
   - Evidence: `/tmp/check-full-mcp-server-iter2.log:15`, `/tmp/check-full-mcp-server-iter2.log:39`

3. `53` Root phase-map and completion totals mismatch: unchanged.
   - Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:269`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:194`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/tasks.md:68`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:31`

4. `54` Stop-hook auto-save implementation/doc contradiction: unchanged.
   - Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/spec.md:63`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:97`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/implementation-summary.md:102`

5. `55` Non-hook priming session-isolation issue: unchanged.
   - Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:761`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:485`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:131`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:58`

6. `56` Phase 011 working-set integration claim vs runtime path: unchanged.
   - Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/spec.md:18`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist.md:21`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/implementation-summary.md:106`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:193`

7. `57` Manual playbook scenario `261d` invalid input (`sessionId` on `memory_stats`): unchanged.
   - Evidence: `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/261-mcp-auto-priming.md:39`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:229`

8. `58` Feature catalog root coverage gap (`21` vs active `22` category): unchanged.
   - Evidence: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:34`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:36`

9. `59` `includeTrace` docs/schema mismatch and phase 025 guarantee/defer drift: unchanged.
   - Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:104`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:690`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:29`, `.opencode/specs/02--system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/tasks.md:49`, `.gemini/agents/context-prime.md:135`

10. `60` README/template/workflow parity drift: unchanged.
    - Evidence: `README.md:62`, `.opencode/README.md:74`, `.opencode/skill/system-spec-kit/templates/level_3/README.md:65`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:574`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:245`
