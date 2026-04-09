---
title: "Feature Specification: Memory Save Heuristic Calibration"
description: "Level 3 packet for closing the remaining memory-save schema, sanitizer, validator, and D5 continuation defects identified by the 2026-04-09 RCA and skipped-recommendation audits."
trigger_phrases:
  - "010 memory save heuristic calibration"
  - "memory save quality gates remediation"
  - "d5 continuation calibration"
  - "v8 v12 validator calibration"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Memory Save Heuristic Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet `010-memory-save-heuristic-calibration` closes the defects that remained after `009-post-save-render-fixes`: structured JSON saves still reject explicit `title`, `description`, and `causalLinks`; manual DR finding IDs can still be dropped by the trigger sanitizer; V8 and V12 validators still misclassify real saves; D5 continuation logic still drifts between linker and reviewer; and `decision-extractor.ts` still contains raw truncation callsites that research marked for shared-helper migration. The packet owns the full end-to-end remediation: runtime source, regression tests, `dist/` rebuild, strict packet validation, and a real wild save against the `026-graph-and-context-optimization` parent folder. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:5-18] [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:25-41] [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:69-136]

**Key Decisions**: Treat the RCA issues and skipped research recommendations as one implementation bundle, because they fail on the same live save path; keep the fixes inside the memory-save pipeline and the new packet docs only; and require one focused regression per lane plus a real `generate-context.js` verification run before closeout. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:45-208] [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:169-195]

**Critical Dependencies**: `009-post-save-render-fixes` is a soft predecessor because it already made JSON overrides authoritative at merge time and set the acceptance bar of "real wild save plus rebuilt dist". The new packet extends that work into the schema, validator, and continuation-linker surfaces that `009` explicitly left out of scope. [SOURCE: ../009-post-save-render-fixes/spec.md:21-25] [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:21-44]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-04-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `009-post-save-render-fixes` |
| **Successor** | `011-historical-memory-repair-apply-mode` only if historical rewrite work is later approved |
| **Motivating Audits** | `../../scratch/codex-root-cause-memory-quality-gates.md`; `../../scratch/codex-skipped-research-recommendations.md` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Fresh structured JSON saves in the 026 packet still fail the quality gates even after the render-layer work from `009`:

1. Explicit `title` and `description` are warned as unknown fields and discarded. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:20-73]
2. Authored DR finding-ID trigger phrases are removed by the sanitizer, then PSR-2 asks operators to put them back manually. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:75-113]
3. V8 cross-spec contamination still over-matches dates, ranges, session-id fragments, and finding IDs. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:115-146]
4. V12 topical coherence still misses slug-vs-prose matches and the save path does not pass `filePath` into the validator. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:148-180]
5. D5 continuation handling still drifts because structured saves cannot fully express explicit causal links and the reviewer/linker do not share one frozen continuation contract. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:182-208]
6. Research follow-ons `REC-003`, `REC-006`, `REC-008`, and `REC-018` are still partially or fully unshipped in runtime code. [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:69-136]

### Purpose

Ship the remaining heuristic and schema repairs in one bounded packet so the live memory-save path can accept authored metadata, preserve manual trigger phrases, validate real saves correctly, align D5 linker/reviewer behavior, and prove the result through tests plus a wild save that indexes semantically without skips.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Structured JSON schema acceptance and normalization for `title`, `description`, and `causalLinks`.
- Trigger-phrase sanitizer narrowing so manual phrases survive unless they are true contamination.
- V8 regex tightening, V12 slug/prose normalization, and save-path `filePath` propagation.
- D5 continuation-signal alignment across predecessor discovery and post-save review.
- `decision-extractor.ts` migration away from raw narrative `substring()` truncation.
- New packet docs, parent phase-map update, regression tests, `dist/` rebuild, strict validation, and a real save verification run.

### Out of Scope

- Historical memory rewrites (`REC-009`) and canary tooling (`REC-019`).
- Runtime packets outside the memory-save pipeline and parent phase-map/summary updates.
- Manual edits to any `memory/` file; all save verification must go through `generate-context.js`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Accept and normalize `title`, `description`, and `causalLinks` payload fields. |
| `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` | Modify | Extend collected-data contracts for explicit title/description fields. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Prefer explicit metadata, split manual-vs-extracted trigger sanitization, pass `filePath` to validation, and align D5 linkage flow. |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | Modify | Treat explicit payload causal links and metadata as authoritative inputs. |
| `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts` | Modify | Preserve manual phrases and narrow the D3 filter to the research-backed contract. |
| `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Modify | Tighten V8 regex behavior and normalize V12 trigger matching. |
| `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts` | Modify | Add description-aware fallback and freeze the continuation-signal contract. |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Reuse the same continuation-signal contract as the linker. |
| `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | Modify | Finish `truncateOnWordBoundary()` migration. |
| `.opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts` | Modify/Add | Add regression coverage for each lane. |
| `../spec.md` | Modify | Add the new phase row and update the child-phase count. |
| `../implementation-summary.md` | Modify | Record the new phase as a follow-on child in the parent packet narrative. |
| `010-memory-save-heuristic-calibration/*.md` | Add/Modify | Packet-local spec, plan, tasks, checklist, decision record, and implementation summary. |

---

### Phase Documentation Map

This packet is the Phase 10 follow-on for the `003-memory-quality-issues` train. It picks up the save-path heuristics and skipped research recommendations that Phase 9 surfaced but explicitly did not own.

| Lane | Owner Surface | Defects / Recommendations |
|------|---------------|---------------------------|
| 1 | Input schema + workflow metadata | Issue 1, REC-018 dependency |
| 2 | Trigger sanitizer + workflow merge | Issue 2, REC-006 |
| 3 | V8 contamination validator | Issue 3 |
| 4 | V12 topical validator + workflow call site | Issue 4 |
| 5 | D5 linker/reviewer + causal-links schema | Issue 5, REC-008, REC-018 |
| 6 | Decision extractor truncation helper | REC-003 |
| 7 | Parent packet sync | Lane 9 from user contract |
| 8 | Verification | Dist rebuild, full tests, strict packet validation, wild save |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Structured JSON payloads must accept `title`, `description`, and `causalLinks` without unknown-field warnings. | File-mode saves render explicit title/description and preserve supplied causal links verbatim. |
| REQ-002 | Manual trigger phrases must survive sanitizer filtering unless they are true contamination. | DR finding IDs and manual singleton anchors survive; auto-extracted junk still filters. |
| REQ-003 | V8, V12, and D5 must stop failing on the real 026 save path while still rejecting adversarial cases. | Regression tests and the wild save prove good-path passes and bad-path failures. |
| REQ-004 | Every runtime change must have a failing-before, passing-after regression guard. | New or extended tests cover each lane. |
| REQ-005 | The compiled CLI must match the TypeScript source. | `npm run build` completes and the wild save uses `scripts/dist/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `decision-extractor.ts` must stop using ad-hoc substring truncation. | Remaining narrative callsites use `truncateOnWordBoundary()`. |
| REQ-007 | Parent docs must reflect the new Phase 10 child packet. | `../spec.md` and `../implementation-summary.md` mention the new phase and updated counts. |
| REQ-008 | The new Level 3 packet docs must stay synchronized with the shipped implementation. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` all match the final state. |

### Acceptance Scenarios

**Scenario A: Authored metadata wins**

- **Given** a structured JSON payload with explicit `title`, `description`, and `causalLinks`,
- **When** `generate-context.js` saves the memory,
- **Then** the rendered frontmatter and body use those explicit values verbatim,
- **And** no unknown-field warnings are emitted for those keys.

**Scenario B: Manual trigger phrases survive**

- **Given** a structured JSON payload with authored DR finding IDs and compact manual anchor phrases,
- **When** the trigger pipeline sanitizes and renders the merged trigger set,
- **Then** those manual phrases remain in the saved trigger list,
- **And** the same tokens are still filterable when they are only auto-extracted junk.

**Scenario C: Validators distinguish real saves from noise**

- **Given** a good memory with dates, session ids, slug-form packet references, and finding ids,
- **When** V8 and V12 run,
- **Then** the validators pass that memory,
- **And** still fail deliberately adversarial foreign-spec content.

**Scenario D: D5 contract stays aligned**

- **Given** continuation-style saves with and without explicit lineage,
- **When** predecessor discovery and post-save review run,
- **Then** both surfaces use the same continuation-signal contract,
- **And** only obvious predecessors auto-populate `supersedes`.

**Scenario E: Explicit causal links stay authoritative**

- **Given** a structured JSON payload with explicit `causalLinks.supersedes`,
- **When** the save renders and post-save review runs,
- **Then** the rendered memory keeps that explicit lineage verbatim,
- **And** D5 stays silent because the supersedes contract is already satisfied.

**Scenario F: The compiled dist entrypoint proves the fix in the wild**

- **Given** the rebuilt `scripts/dist/memory/generate-context.js` entrypoint and a fresh verification payload,
- **When** the save runs against the live `026-graph-and-context-optimization` parent folder,
- **Then** the save completes with zero V1-V14 failures, zero PSR-2 warnings, zero D5 warnings, and semantic indexing enabled.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ten child phases are represented accurately in the parent phase map, including `010-memory-save-heuristic-calibration`.
- **SC-002**: The new regression suite covers each shipped lane with clear failure attribution.
- **SC-003**: `scripts/dist/` is rebuilt and both `mcp_server` and `scripts` test suites pass without regressions.
- **SC-004**: `validate.sh --strict` passes on this packet folder.
- **SC-005**: A real save against `026-graph-and-context-optimization` completes with zero V1-V14 failures, zero `PSR-2` missing-manual-phrase warnings, zero D5 warnings, and semantic indexing enabled.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `009-post-save-render-fixes` established the live-save acceptance pattern | Missing the wild save would under-prove the fix | Reuse the same end-to-end verification discipline and rebuild `dist` before the save |
| Risk | Manual-vs-extracted trigger handling could widen too far and let junk through | Retrieval quality could regress | Keep contamination filters intact and test both manual and auto-extracted paths |
| Risk | V8 regex tightening could miss real future slugs | Cross-spec detection could weaken | Back the regex change with explicit token-list tests and keep allowlist scanning intact |
| Risk | D5 fallback could fabricate lineage in mixed folders | Saved memories could claim false supersedes links | Keep the immediate-predecessor-only and ambiguity-skip contract from Phase 4 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability

- Every code patch must cite one of the two motivating audit reports.
- Each checklist item must point to code, tests, or verification evidence.

### Maintainability

- Prefer additive schema and helper changes over broad rewrites.
- Keep sanitizer and continuation contracts shared instead of duplicating slightly different rule sets.

---

## 8. EDGE CASES

- Payload omits `title` or `description`: existing auto-generation must still work.
- Payload supplies manual singleton trigger phrases like `graph` or `research`: manual path keeps them, extracted path may still filter them.
- Folder contains multiple plausible predecessor candidates: auto-linking must skip rather than guess.
- Memory content references real parent/child packet slugs in both prose and hyphenated forms: V12 must accept both representations.

---

### Architecture Notes

- The authoritative data-flow remains `input-normalizer.ts` -> `workflow.ts` -> render/template -> post-save validator/reviewer -> indexer.
- Manual payload values are authoritative only at the schema and merge points; post-save review still checks the rendered output, not the payload directly.
- Shared continuation signaling must live in one reusable contract to prevent linker/reviewer drift.

---

## 9. COMPLEXITY ASSESSMENT

The packet is complexity-moderate but risk-critical. It changes one bounded runtime slice, yet that slice spans normalization, workflow merge, validation, review, template rendering, and semantic indexing. The implementation therefore stayed surgical in code shape while remaining broad in verification depth.

### Implementation Phases

### Phase 1: Runtime and Test Remediation

- Accept and propagate explicit structured metadata.
- Preserve manual trigger phrases through the runtime pipeline.
- Calibrate V8, V12, and D5 behavior.
- Finish the decision-extractor helper migration.

### Phase 2: Verification and Packet Closeout

- Rebuild `scripts/dist`.
- Run the `scripts` and `mcp_server` test suites and classify any unrelated pre-existing failures.
- Validate the packet strictly.
- Execute the real dist-based save verification and sync the packet docs.

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Manual trigger preservation accidentally allows junk through | Medium | High | Keep contamination filters hard and test manual vs extracted paths separately |
| V8 regex narrows too far and misses future real spec slugs | Low | Medium | Assert the exact RCA token set and keep allowlist scanning intact |
| D5 fallback invents lineage in ambiguous folders | Medium | High | Preserve the immediate-predecessor-only plus ambiguity-skip contract |
| Packet docs drift from shipped code | Medium | Medium | Rewrite packet docs only after final build, test, validation, and wild-save evidence |

## 11. USER STORIES

- As a memory-save operator, I can provide an explicit `title` and `description` in structured JSON and trust the saved memory to use them verbatim.
- As a reviewer debugging save quality, I can rely on manual DR trigger phrases to survive the runtime path instead of being silently stripped.
- As a maintainer validating memory quality, I can distinguish real packet references from dates, finding IDs, and numeric ranges.
- As a retrieval operator, I can save a memory that references the spec in slug form or prose form and still receive semantic indexing.

### AI Execution Protocol

### Pre-Task Checklist

- Re-read both motivating audit reports before modifying a lane tied to them.
- Re-confirm the `009-post-save-render-fixes` boundary before touching shared save helpers.
- Keep all edits bounded to the runtime files, tests, and packet/parent-doc surfaces listed in scope.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-010 | Only modify the approved runtime files, tests, and packet-parent documentation surfaces | Prevents drift into unrelated 026 runtime work |
| AI-LANE-010 | Keep every code patch tied to one RCA issue or skipped-research recommendation | Preserves end-to-end traceability |
| AI-VERIFY-010 | Add or extend at least one regression guard per shipped lane before claiming completion | Prevents heuristic regressions from hiding inside the save path |
| AI-E2E-010 | Finish with a real `scripts/dist/memory/generate-context.js` save against the 026 parent folder | Proves the compiled CLI path matches the TypeScript fixes |

### Status Reporting Format

- Start state: which lane or verification gate is active.
- Work state: which runtime surface changed and which test or command proves it.
- End state: whether the lane is complete, still running, or blocked.

### Blocked Task Protocol

1. Stop if a required fix would expand beyond the approved runtime or packet-doc scope.
2. Record the blocker and the owning surface in the packet docs.
3. Keep all completed lanes and evidence reviewable while the blocker is reported explicitly.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should future work add the deferred `memory-doctor --canary` from `REC-019` once the heuristic contract is frozen?
- If historical rewrite work is later approved, should `011-historical-memory-repair-apply-mode` reuse the new manual-trigger and D5 alignment semantics as immutable migration rules?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent packet spec: `../spec.md`
- Parent packet plan: `../plan.md`
- Parent packet implementation summary: `../implementation-summary.md`
- Motivating RCA: `../../scratch/codex-root-cause-memory-quality-gates.md`
- Skipped recommendations audit: `../../scratch/codex-skipped-research-recommendations.md`
