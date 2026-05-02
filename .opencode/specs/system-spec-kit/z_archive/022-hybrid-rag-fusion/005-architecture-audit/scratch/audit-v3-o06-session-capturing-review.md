# Audit V3 — O6: Session Capturing Pipeline Review (009)

**Agent**: O6 (Claude Opus 4.6)
**Scope**: `009-perfect-session-capturing` — parent pack + 20 child phases + 5 sub-children under 000
**Date**: 2026-03-21
**Method**: Cross-reference spec claims against actual code in `generate-context.ts`, `data-loader.ts`, `workflow.ts`, `memory-save.ts`, and `post-save-review.ts`

---

## Executive Summary

The session capturing pipeline is in a strong state. The JSON-primary contract is well-enforced at three levels (CLI arg parsing, data-loader, workflow). Recovery mode requires `--recovery` and logs appropriate warnings. The post-save quality review (Step 10.5) is shipped and integrated. Of the 20 direct child phases, 18 are marked Complete, 1 is "Complete (analysis phase)" with 8 pending remediation sprints, and the parent `000-dynamic-capture-deprecation` is "In Progress" due to one incomplete sub-child. The main risks are: orphaned "phase 020" references in 3 parent docs, 14 of 20 description.json files missing `status` fields, and 8 unstarted remediation sprints from the 019 audit blocking pipeline hardening.

**Finding count**: 11 findings (1 CRITICAL, 3 HIGH, 5 MEDIUM, 2 LOW)

---

## Findings

### O6-001: Parent Docs Reference Non-Existent "Phase 020"
- **Severity**: HIGH
- **Category**: alignment
- **Location**: `.opencode/specs/.../009-perfect-session-capturing/plan.md:7`, `tasks.md:7`, `decision-record.md:7`
- **Description**: Three parent-level docs contain `trigger_phrases: "roadmap phases 018 019 020"` in their frontmatter, but phase 020 does not exist as a direct child of the parent. The live-proof work that was historically called "phase 020" now lives at `000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening`.
- **Evidence**: `grep -r "roadmap phases 018 019 020"` matches plan.md, tasks.md, and decision-record.md frontmatter. No `020-*` folder exists under `009-perfect-session-capturing/`. The OPUS-2 audit (opus-2-spec-alignment.md, OPUS2-004) also flagged this.
- **Impact**: Trigger phrase matching returns these docs for queries about a non-existent phase 020, creating confusion. Maintainers may look for a phase 020 folder that does not exist.
- **Recommended Fix**: Update trigger_phrases in plan.md, tasks.md, and decision-record.md frontmatter to `"roadmap phases 000 018 019"` or similar, matching the actual phase tree.

### O6-002: 14 of 20 Child Phase description.json Files Missing `status` Field
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `009-perfect-session-capturing/{002..006,008..014,016,017,019}-*/description.json`
- **Description**: Only 6 of 20 child phase description.json files (000, 001, 007, 015, 018, and partially 019) include a `"status"` field. The remaining 14 lack it entirely.
- **Evidence**: `grep -c '"status"' */description.json` shows 0 for 14 files. The 019-architecture-remediation audit (plan.md S5, OPUS-B2) also identified this as a systemic gap requiring backfill.
- **Impact**: Programmatic phase status queries (description.json-based dashboards, indexing) cannot determine completion status for the majority of child phases. The status is only available by parsing spec.md markdown, which is fragile.
- **Recommended Fix**: Backfill `"status": "complete"` (or appropriate value) in all 14 description.json files. This is already tracked as Sprint S5 in the 019 remediation plan.

### O6-003: Sub-Child 005-live-proof-and-parity-hardening Still In Progress — Blocks Pipeline Completion Claim
- **Severity**: HIGH
- **Category**: incomplete
- **Location**: `.opencode/specs/.../000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening/`
- **Description**: This sub-child tracks the remaining "retained live proof" work — refreshing live CLI artifacts across all supported CLIs and save modes. Tasks T002, T003, and T004 are still open. Without this, the repo cannot honestly claim flawless multi-CLI parity.
- **Evidence**: `tasks.md` shows T002 (refresh retained artifacts), T003 (review against runtime contract), and T004 (update parity claims) all unchecked. `spec.md` Status = "In Progress".
- **Impact**: The parent `000-dynamic-capture-deprecation` remains "In Progress" because of this single sub-child. This is the last blocker for claiming universal session capture parity.
- **Recommended Fix**: Either execute the retained artifact refresh, or explicitly scope-downgrade the live-proof requirement and mark the phase complete with documented caveats. The parent docs already treat this conservatively, which is correct.

### O6-004: Phase 005 References "Phase 020" Identity — Stale After Renumber
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/specs/.../000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening/{spec,plan,tasks,implementation-summary}.md`
- **Description**: All four docs in this sub-child reference "phase 020" in their frontmatter trigger_phrases and body text. The phase was renumbered from "020" to "005" when moved under `000-dynamic-capture-deprecation`, but the trigger phrases were not updated.
- **Evidence**: `trigger_phrases: "phase 020"` appears in spec.md:7, plan.md:5, tasks.md:5, and implementation-summary.md:5. The `description.json` under `000-dynamic-capture-deprecation` also references `"020-live-proof-and-parity-hardening"`.
- **Impact**: Search and memory trigger matching references a phase number that no longer corresponds to the folder's actual position (005 under 000, not 020 at root level).
- **Recommended Fix**: Replace "phase 020" trigger phrases with "phase 005" or "005-live-proof-and-parity-hardening" in the four affected docs. Update description.json child references similarly.

### O6-005: 019-Architecture-Remediation Has 8 Unstarted Remediation Sprints (T020-T027)
- **Severity**: CRITICAL
- **Category**: incomplete
- **Location**: `.opencode/specs/.../019-architecture-remediation/tasks.md` (lines 87-94)
- **Description**: The 019 phase analysis is complete (all 15 agents ran, 197 findings verified), but the actual remediation work (8 sprints, S1-S8, covering 197 findings) is entirely unstarted. Sprint S1 alone has 12 CRITICAL findings including stale dist artifacts and broken ops scripts.
- **Evidence**: tasks.md shows T020-T027 all unchecked. Completion criteria explicitly note "Phase 5 pending". Sprint S1 is labeled CRITICAL (4-6h) and includes stale dist artifacts and test assertion failures.
- **Impact**: 12 CRITICAL findings (stale dist, broken ops scripts, ast-parser import) and 48 HIGH findings remain unaddressed. The V-rule bridge may fail-open if dist is stale (R-006 in the risk matrix). Concurrent save races (S2) pose data loss risk. These represent real code-level risks to the session capturing pipeline.
- **Recommended Fix**: Prioritize Sprint S1 (critical/blocking fixes) immediately, then S2 (data integrity). The analysis phase should be considered complete but the overall 019 remediation is far from done.

### O6-006: JSON Mode Path Working Correctly — Verified
- **Severity**: LOW
- **Category**: architecture (positive finding)
- **Location**: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `scripts/loaders/data-loader.ts`, `scripts/core/workflow.ts`
- **Description**: The JSON-primary save contract is enforced at three independent layers: (1) `generate-context.ts` throws `RECOVERY_MODE_REQUIRED` if a spec folder is passed positionally without `--recovery`, (2) `data-loader.ts` throws `RECOVERY_MODE_REQUIRED` if `allowRecovery` is false and no data file exists, (3) `workflow.ts` throws `RECOVERY_MODE_REQUIRED` if `_source !== 'file'` and `allowRecovery` is false. All three layers log appropriate warnings.
- **Evidence**: generate-context.ts:436-441, data-loader.ts:559-563, workflow.ts:1370-1375 all contain independent RECOVERY_MODE_REQUIRED guards.
- **Impact**: Positive — the triple-layer enforcement means recovery mode cannot be accidentally triggered. This is the desired behavior per the JSON-primary deprecation design.
- **Recommended Fix**: None needed. The enforcement is sound.

### O6-007: Recovery Mode Path Working Correctly — Verified
- **Severity**: LOW
- **Category**: architecture (positive finding)
- **Location**: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:566-598`
- **Description**: When `--recovery` is explicitly passed, the data-loader falls through to native capture backends (opencode, claude-code, codex, copilot, gemini) in a configurable priority order. The deprecation warning is logged. The `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` env var and per-CLI env detection work correctly for capture source routing.
- **Evidence**: data-loader.ts:570-574 logs the recovery warning. Lines 580-590 iterate the native capture backends. The `buildNativeCaptureOrder` function reorders based on preferred source. Five capture modules (opencode, claude-code, codex, copilot, gemini) are lazy-loaded with proper error handling.
- **Impact**: Positive — crash recovery still works when explicitly requested. The deprecation is operational, not removal.
- **Recommended Fix**: None needed.

### O6-008: Post-Save Quality Review (Step 10.5) Is Shipped and Integrated
- **Severity**: MEDIUM
- **Category**: architecture (positive with caveat)
- **Location**: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`, `workflow.ts:2322-2331`
- **Description**: The post-save quality review module exists, is imported in workflow.ts, and runs after file write but before indexing (Step 10.5). It compares saved frontmatter against the original JSON payload to detect silent field overrides (RC1-RC5 root causes). However, it only runs when `inputMode !== 'stateless'`, meaning recovery-mode saves do not get quality reviewed.
- **Evidence**: workflow.ts:2323 — `if (ctxFileWritten && captureCapabilities.inputMode !== 'stateless')`. Post-save review is skipped entirely for recovery saves.
- **Impact**: Recovery-mode saves, which are already lower quality by nature (heuristic DB extraction), do not get the quality review that would detect contamination. This is a gap in the quality safety net for the most error-prone save path.
- **Recommended Fix**: Consider running post-save review for recovery saves as well, even if the comparison baseline is weaker. At minimum, log that quality review was skipped and why.

### O6-009: 000-dynamic-capture-deprecation Parent Pack Is Level 1 — Insufficient for 5 Sub-Children
- **Severity**: MEDIUM
- **Category**: architecture
- **Location**: `.opencode/specs/.../000-dynamic-capture-deprecation/spec.md`
- **Description**: The branch parent pack (spec.md, plan.md, tasks.md, implementation-summary.md) is documented at Level 1, but it manages 5 sub-children, 4 of which are Level 2 and one of which tracks critical live-proof work. Level 1 documentation (no checklist.md) is typically for <100 LOC changes, not parent packs managing multiple phases.
- **Evidence**: `000-dynamic-capture-deprecation/spec.md` has `SPECKIT_LEVEL: 1`. No `checklist.md` exists in this folder. The sub-children collectively represent significant pipeline infrastructure work.
- **Impact**: No formal checklist verification exists for the branch parent. The branch parent's completion status relies entirely on informal inspection of its sub-children.
- **Recommended Fix**: Upgrade to Level 2 and add a checklist.md that tracks the completion status of each sub-child. This would enable automated verification of the branch parent's readiness.

### O6-010: Spec Phase Map Does Not Include Phase 019 Status Accurately
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `.opencode/specs/.../009-perfect-session-capturing/spec.md` (Section 4, Phase Documentation Map)
- **Description**: The parent spec.md phase map lists phases 000-018 with status but does not list phase 019 in the main table. The spec mentions 019 is "an architecture audit" in several prose sections, but the formal Phase Documentation Map (Section 4) ends at phase 018. Phase 019 exists on disk with significant content (197 findings, 8 ADRs, 8 remediation sprints).
- **Evidence**: spec.md Section 4 table shows phases 000, 001-018 only. Phase 019 is mentioned in prose ("Phase 019 is an architecture audit") but not in the formal table row.
- **Impact**: The phase map is the canonical navigation reference. Missing 019 from it means maintainers must read surrounding prose to discover its existence.
- **Recommended Fix**: Add a row for phase 019 in the Phase Documentation Map table with status "Complete (analysis phase)" and recommendation "remediation pending".

### O6-011: Parent Pack Plan and Tasks Claim "Phase 020" in Rollback Procedures
- **Severity**: HIGH
- **Category**: alignment
- **Location**: `.opencode/specs/.../009-perfect-session-capturing/plan.md:209` (Enhanced Rollback section)
- **Description**: The parent plan.md's Enhanced Rollback Procedure references "phases 018 through 020" but phase 020 does not exist under the parent. This creates confusion about what phases are actually being managed.
- **Evidence**: plan.md line 209: "Restore conservative status language for phases `018` through `020`." Phase 020 is not a direct child of the parent pack. The live-proof work exists at `000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening`.
- **Impact**: A rollback procedure that references non-existent phases cannot be correctly followed. A maintainer attempting rollback would look for a phase 020 folder that does not exist.
- **Recommended Fix**: Update the rollback reference to "phases `018` through `019`" or explicitly reference the branch sub-child if the live-proof phase is also in scope.

---

## Summary Table

| ID | Severity | Category | Title |
|----|----------|----------|-------|
| O6-001 | HIGH | alignment | Parent Docs Reference Non-Existent "Phase 020" |
| O6-002 | MEDIUM | alignment | 14 of 20 description.json Files Missing `status` Field |
| O6-003 | HIGH | incomplete | Sub-Child 005-live-proof Still In Progress |
| O6-004 | MEDIUM | alignment | Phase 005 References Stale "Phase 020" Identity |
| O6-005 | CRITICAL | incomplete | 019 Has 8 Unstarted Remediation Sprints (197 Findings) |
| O6-006 | LOW | architecture | JSON Mode Path Working Correctly (positive) |
| O6-007 | LOW | architecture | Recovery Mode Path Working Correctly (positive) |
| O6-008 | MEDIUM | architecture | Post-Save Review Skipped for Recovery Saves |
| O6-009 | MEDIUM | architecture | 000-dynamic-capture-deprecation Is Level 1 (underweight) |
| O6-010 | MEDIUM | alignment | Phase Map Missing Phase 019 Row |
| O6-011 | HIGH | alignment | Rollback Procedure References Non-Existent Phase 020 |

---

## Pipeline Health Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| JSON-primary enforcement | GREEN | Triple-layer guard in generate-context, data-loader, workflow |
| Recovery mode deprecation | GREEN | `--recovery` required, warnings logged, deprecated for routine use |
| Post-save quality review | YELLOW | Shipped for JSON mode but skipped for recovery mode |
| Dist/source sync | GREEN | dist files newer than source as of 2026-03-21 |
| Phase tree consistency | YELLOW | Phase 020 ghost references in 3 parent docs + 4 sub-child docs |
| Remediation backlog | RED | 197 findings across 8 sprints, including 12 CRITICAL, all unstarted |
| Live-proof coverage | RED | No retained proof artifacts refreshed; universal parity claims blocked |
| Description.json health | YELLOW | 14 of 20 missing status field |

---

## Recommendations (Priority Order)

1. **Immediate**: Fix phase 020 ghost references in parent docs (O6-001, O6-011) — prevents maintainer confusion
2. **Sprint S1**: Execute the 019 critical remediation sprint (O6-005) — addresses stale dist, broken ops scripts
3. **Sprint S2**: Execute data integrity sprint (O6-005) — addresses concurrent save races, V-rule fail-open
4. **Near-term**: Backfill description.json status fields (O6-002) — already planned in 019 Sprint S5
5. **Near-term**: Add post-save review for recovery mode saves (O6-008) — closes quality safety gap
6. **Maintenance**: Update 005-live-proof trigger phrases (O6-004), add 019 to phase map (O6-010)
7. **Optional**: Upgrade 000-dynamic-capture-deprecation to Level 2 (O6-009)
