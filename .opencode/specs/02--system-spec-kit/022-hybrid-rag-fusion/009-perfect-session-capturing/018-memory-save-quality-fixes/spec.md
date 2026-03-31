---
title: "Feature [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-memory-save-quality-fixes/spec]"
description: "This phase resolved eight backend extraction defects that degraded /memory:save output quality even after the earlier runtime fixes."
trigger_phrases:
  - "memory save quality fixes"
  - "018 memory save quality fixes"
  - "root cause fixes"
importance_tier: "important"
contextType: "implementation"
key_topics:
  - "generate-context"
  - "quality remediation"
  - "validator compliance"
level: 2
---
# Feature Specification: Memory Save Quality Root Cause Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/spec.md | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-20 |
| **Branch** | `018-memory-save-quality-fixes` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | [017-json-primary-deprecation](../017-json-primary-deprecation/spec.md) |
| **Successor** | [019-architecture-remediation](../019-architecture-remediation/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the Sprint 1 pipeline hardening landed, a `/memory:save` run still produced a memory file that scored 88/100 while carrying 10 structural quality issues. Manual review traced those defects to eight backend bugs across the `generate-context.js` extraction, normalization, and rendering pipeline: duplicated decision fields, wrong completion status, false blocker detection, generic pattern filler, noisy trigger phrases, contaminated file paths, over-aggressive tree thinning, and missing synthesized conversation messages.

### Purpose
Eliminate the eight root causes, preserve the existing pipeline shape, and raise shipped memory-file quality without reopening template changes or broader MCP-server work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix all eight backend root causes in the existing `generate-context` extractor, normalizer, and rendering code.
- Rebuild `shared/dist` after the trigger-extractor changes so runtime artifacts match source.
- Update the golden expectation for the intentional trigger-filter behavior change in Fix 5.
- Re-run the targeted regression suites, CLI smoke check, and two independent ultra-think reviews.

### Out of Scope
- Template changes - this phase fixes runtime quality defects only.
- New extractors - the remediation stays inside the existing pipeline surfaces.
- Pipeline stage modifications - no new pipeline stages or control-flow rewrites were introduced.
- MCP server changes - the scope stops at the `generate-context.js` backend and its shipped artifacts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | Modify | Fix duplicated decision rendering so CONTEXT, RATIONALE, and CHOSEN no longer collapse into the same value |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Detect completion from observation-based Next Steps when normalized JSON moves `nextSteps` out of the top level |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modify | Replace broad blocker keywords with structural blocker patterns |
| `.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts` | Modify | Remove generic code-pattern matchers and require stronger keyword evidence |
| `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts` | Modify | Filter short generic trigger phrases, expand the allowlist, and keep relaxed mode quality-aware |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Parse em dash, en dash, and colon file separators without contaminating `filesModified` |
| `.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts` | Modify | Lower the merge threshold and cap merged children so useful files stay visible |
| `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts` | Modify | Synthesize assistant messages from structured JSON when prompts are sparse |
| `.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts` | Modify | Update the golden expectation for the intentional Fix 5 trigger-filter improvement |
| `.opencode/skill/system-spec-kit/shared/dist/trigger-extractor.js` | Modify | Rebuild the distributed trigger-extractor artifact after the source changes |

### Root Cause Inventory

| Fix | Issue | Root Cause | Severity |
|-----|-------|------------|----------|
| Fix 1 | Decision CONTEXT matched RATIONALE and CHOSEN | One `rationale` value was reused across all three decision fields for string-form decisions | Medium |
| Fix 2 | Session status showed `IN_PROGRESS 23%` when the work was complete | The input normalizer consumed top-level `nextSteps`, so completion detection missed the real signal | Medium |
| Fix 3 | Decision text was mislabeled as a blocker | `extractBlockers()` matched broad words like `error`, `problem`, and `failed` instead of blocker-specific structure | Medium |
| Fix 4 | `Common Patterns` emitted generic filler such as Module Pattern | Code-pattern matching used overly broad keywords and substring inflation | Low |
| Fix 5 | Trigger phrases included short generic bigrams such as `and wrong` | `filterTechStopWords()` was too permissive and relaxed mode bypassed the filter | Low |
| Fix 6 | `key_files` captured embedded descriptions | Separator parsing only handled the plain ` - ` hyphen form | Low |
| Fix 7 | All ten files collapsed into `(merged-small-files)` | `memoryThinThreshold` at 300 tokens merged far too aggressively | Low |
| Fix 8 | JSON-mode conversations captured only one message | Structured JSON input did not synthesize messages from `sessionSummary` and related fields | Low |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix 1 must separate decision CONTEXT from RATIONALE and CHOSEN | String-form decisions render distinct title, rationale, and chosen fields without duplicate payloads |
| REQ-002 | Fix 2 must mark completed sessions correctly when Next Steps move into observations | JSON-mode sessions with observation-based Next Steps resolve to a completed status instead of `IN_PROGRESS 23%` |
| REQ-003 | Fix 3 must stop blocker false-positives from generic failure words | Narratives mentioning `error`, `problem`, or `failed` do not produce blockers unless blocker structure is present |
| REQ-004 | Fix 4 must remove generic implementation-guide filler | `Module Pattern` and `Functional Transforms` stop appearing unless there is real observation evidence |
| REQ-005 | Fix 5 must filter noisy short generic trigger phrases | Short generic bigrams such as `and wrong` and `not empty` are filtered while technical short words remain allowed |
| REQ-006 | Fix 6 must parse additional separator styles in `filesModified` | Em dash, en dash, colon, and hyphen separators all parse clean file paths without embedded descriptions |
| REQ-007 | Fix 7 must reduce over-merging in tree thinning | Files above 150 tokens are no longer auto-merged and merge groups cap at three children |
| REQ-008 | Fix 8 must synthesize richer conversation output from structured JSON | JSON-mode sessions with `sessionSummary` produce more than one conversation message when prompts are sparse |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The shipped artifacts must match the trigger-extractor source change | `shared/dist/trigger-extractor.js` is rebuilt after Fix 5 |
| REQ-010 | Regression coverage must stay green after all eight fixes | 106 existing targeted tests pass with zero regressions and the CLI help smoke test succeeds |
| REQ-011 | Independent review must confirm the final shape | Two ultra-think reviews pass, and review-identified issues from Fix 4 and Fix 5 are resolved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eight root causes are fixed in the shipped backend surfaces listed in scope.
- **SC-002**: The targeted regression suites finish at 106/106 passing with only the intentional golden expectation update.
- **SC-003**: Two independent ultra-think reviews confirm the combined fix set is low risk and ready to ship.
- **SC-004**: The phase stays inside scope by avoiding template changes, new extractors, pipeline-stage rewrites, and MCP-server changes.

### Acceptance Scenarios

1. **Given** a string-form decision, **When** the extractor renders decision fields, **Then** CONTEXT, RATIONALE, and CHOSEN are no longer duplicates.
2. **Given** a JSON-mode session whose Next Steps were normalized into observations, **When** status is computed, **Then** the session resolves as complete.
3. **Given** narrative text that discusses an error without blocking progress, **When** blockers are extracted, **Then** no blocker entry is emitted.
4. **Given** the updated trigger extractor, **When** the golden and regression suites run, **Then** noisy generic phrases are filtered and the updated expectation passes.
5. **Given** the full eight-fix set, **When** the review and test pass completes, **Then** the phase is ready to remain marked done.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `017-json-primary-deprecation` | Medium | Keep this phase focused on post-deprecation quality defects rather than reopening the contract shift |
| Dependency | Targeted regression suites and CLI smoke check | High | Use the existing test pack and `generate-context.js --help` as the release gate |
| Risk | Pattern tightening may hide legitimate technical phrases | Medium | Maintain an explicit `TECHNICAL_SHORT_WORDS` allowlist and validate the golden output |
| Risk | Tree-thinning changes could retain too much noise or still over-merge | Medium | Lower the threshold conservatively and cap merge groups at three children |
| Risk | Review fixes could introduce cross-fix regressions | Medium | Run a second independent review after applying the Fix 4 and Fix 5 follow-up corrections |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The remediation must preserve the existing targeted test runtime and avoid introducing a materially slower `generate-context` path.
- **NFR-P02**: Tree thinning must remain selective enough to keep output readable without collapsing all files into one merged node.

### Security
- **NFR-S01**: The changes must not add secrets, credentials, or unvalidated parsing shortcuts to the memory-save pipeline.
- **NFR-S02**: Trigger filtering and blocker detection must prefer explicit structure over broad keyword heuristics.

### Reliability
- **NFR-R01**: The same structured JSON and stateless inputs that worked before the fix pass must still produce valid memory output afterward.
- **NFR-R02**: Source and dist artifacts must remain synchronized after the trigger-extractor change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty or sparse `userPrompts` with a populated `sessionSummary` must still produce a useful conversation trace.
- File-path entries that contain descriptions but no `.` or `/` in the first capture group must not be treated as valid file paths.
- Two-word trigger phrases that include technical short words such as `db`, `fs`, or `io` must survive the generic short-word filter.

### Error Scenarios
- Narrative mentions of `error`, `problem`, or `failed` without blocker structure must not emit blockers.
- Observation-based Next Steps must still be recognized even after JSON normalization changes their shape.
- Generic pattern names must not be emitted just because a file name contains a matching substring.

### State Transitions
- Review 1 identified a Fix 4 substring bug and a Fix 5 over-aggressive allowlist filter; both follow-up corrections must remain part of the completed phase.
- The final test run after Review 2 must confirm the post-review code path, not only the first implementation pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Eight fixes touched extractors, normalizers, rendering, tests, and dist output |
| Risk | 16/25 | Heuristic tuning risk existed around blockers, trigger phrases, and thinning behavior |
| Research | 12/20 | Manual review plus two independent ultra-think reviews drove the final corrections |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No open questions remain for this completed phase; any newly discovered save-quality regressions should start a new follow-up phase.
- The unrelated `memory-render-fixture.vitest.ts` failures tied to separate `workflow.ts` work remain outside this phase's ownership boundary.
<!-- /ANCHOR:questions -->

---
<!-- /ANCHOR:questions -->
