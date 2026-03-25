---
title: "Feature Specification: JSON-Primary Deprecation [template:level_2/spec.md]"
description: "This phase deprecates direct stateless CLI capture, enforces structured JSON inputs for generate-context, and makes AI-composed JSON the authoritative save contract."
trigger_phrases:
  - "json primary deprecation"
  - "017 json primary deprecation"
  - "dynamic capture deprecation"
importance_tier: "high"
contextType: "implementation"
---
# Feature Specification: JSON-Primary Deprecation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-20 |
| **Branch** | `017-json-primary-deprecation` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | [016-json-mode-hybrid-enrichment](../016-json-mode-hybrid-enrichment/spec.md) |
| **Successor** | [018-memory-save-quality-fixes](../018-memory-save-quality-fixes/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Dynamic session capture reconstructs context from runtime databases after the fact. That heuristic repeatedly selected the wrong transcript, produced contaminated memory files, and failed even after multiple rounds of follow-up research and fixes. A production wrong-session capture proved the routine save path was still not trustworthy.

### Purpose
Make AI-composed JSON the routine save contract, hard-deprecate direct positional stateless invocation, and document the phase dispositions that moved the obsolete dynamic-capture follow-ups under `../000-dynamic-capture-deprecation/`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reject direct positional stateless saves with migration guidance to structured JSON.
- Extend the structured JSON contract with richer session input such as `toolCalls` and `exchanges`.
- Update operator-facing guidance so JSON is clearly the required routine save path.
- Review and disposition the dynamic-capture follow-up phases into the archived branch parent.

### Out of Scope
- Reintroducing direct stateless save mode via CLI flags.
- Changing the generated memory file format.
- Reopening the broader research-remediation follow-up handled by `018-memory-save-quality-fixes`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Reject direct spec-folder invocation and require structured JSON modes (`--stdin`, `--json`, or JSON file path) |
| `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` | Modify | Enforce structured JSON-only loader contract for save workflows |
| `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` | Modify | Add structured JSON enrichment types |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Update the operator guidance to JSON-primary wording |
| `.opencode/command/memory/save.md` | Modify | Align the save command with the JSON-primary contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Routine saves must reject positional stateless capture with no recovery bypass | Direct spec-folder mode exits non-zero and instructs operators to use structured JSON |
| REQ-002 | JSON must be documented as the primary operator contract | The shipped docs describe JSON mode as the routine save path |
| REQ-003 | Structured JSON enrichment types must exist | The session-type definitions include the new structured fields needed by the JSON path |
| REQ-004 | Structured input modes must remain valid | `--stdin`, `--json`, and JSON file path saves still produce valid memory files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reviewed follow-up phases must have explicit dispositions | Keep, reframe, or archive outcomes are documented for the affected phases |
| REQ-006 | Archived dynamic-capture follow-ups must move under the new branch parent | `../000-dynamic-capture-deprecation/` contains the moved authoritative child packs |
| REQ-007 | Operator docs must stay aligned with the runtime posture | The skill and command docs no longer describe a `--recovery` save path for generate-context |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Direct positional saves fail and emit migration guidance to structured JSON.
- **SC-002**: JSON mode is documented as the primary path in the operator guidance.
- **SC-003**: The affected follow-up phases have explicit keep, reframe, or archive outcomes under the archived branch parent.
- **SC-004**: JSON routine saves via `--stdin`, `--json`, or JSON data-file mode remain functional after the JSON-primary change.

### Acceptance Scenarios

1. **Given** a direct positional save invocation, **When** the command runs, **Then** the runtime exits with migration guidance to structured JSON.
2. **Given** a maintainer reads the operator docs, **When** they inspect the updated save guidance, **Then** JSON mode is shown as the preferred contract.
3. **Given** the archived branch parent, **When** a reviewer inspects the moved follow-up phases, **Then** the review outcomes and archive structure line up with the current folder layout.
4. **Given** JSON routine input (`--stdin`, `--json`, or JSON file path), **When** the memory pipeline runs, **Then** it still produces valid memory output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `016-json-mode-hybrid-enrichment` | High | Keep the JSON-primary transition layered on top of the delivered child-phase baseline while 016 container follow-ons close |
| Dependency | Archived branch parent `../000-dynamic-capture-deprecation/spec.md` | Medium | Preserve the moved follow-up phases under a valid parent pack |
| Risk | Legacy docs may still reference `--recovery` even though runtime no longer supports it | Medium | Keep docs synchronized with current runtime behavior and validation messages |
| Risk | Operator docs could drift from runtime behavior | Medium | Keep runtime warnings and operator documentation synchronized |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Are there any remaining legacy references to `--recovery` in non-authoritative docs that should be archived or corrected?
- Should the next follow-up phase remove obsolete recovery examples from template/reference artifacts?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The deprecation shift must not add material overhead to the save path.
- **NFR-P02**: Structured JSON enrichment must remain optional and backward compatible.

### Security
- **NFR-S01**: The JSON-primary shift must not weaken validation on save inputs.
- **NFR-S02**: Runtime errors must fail closed when direct stateless invocation is attempted.

### Reliability
- **NFR-R01**: Existing structured JSON save flows must continue to produce valid memory output.
- **NFR-R02**: Archived phase ownership must remain traceable through the moved branch parent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty JSON enrichment blocks: treated as valid optional input rather than a hard failure.
- Mixed JSON and positional stateless inputs: reject ambiguous combinations and require structured mode.
- Archived phase references: must resolve through the moved branch parent, not the removed direct-child folders.

### Error Scenarios
- Missing or malformed JSON enrichment fields: validation must fail clearly.
- Direct positional save succeeding: treated as a regression in the routine-save contract.
- Stale phase references in docs: treated as documentation integrity failures.

### State Transitions
- Dynamic-capture follow-ups moved into the archived branch: readers must still reach them through current docs.
- Direct stateless invocation path: intentionally deprecated and blocked in current runtime.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Runtime warnings, docs, archive ownership, and save-contract wording changed together |
| Risk | 18/25 | Save-path guidance and runtime behavior needed to stay aligned |
| Research | 13/20 | The decision followed multiple failed dynamic-capture research passes |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
