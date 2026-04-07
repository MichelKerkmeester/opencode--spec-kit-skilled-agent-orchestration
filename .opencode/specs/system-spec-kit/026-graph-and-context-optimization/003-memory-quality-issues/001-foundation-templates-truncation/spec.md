---
title: "Feature Specification: Phase 1: Foundation (Templates & Truncation)"
description: "Phase 1 defines the P0 foundation slice for memory-quality remediation: fix the OVERVIEW anchor mismatch, introduce the shared truncation helper, and preserve OVERVIEW text on word boundaries before later metadata and heuristic phases build on it."
trigger_phrases:
  - "phase 1 foundation templates truncation"
  - "memory quality d1 d8"
  - "truncate on word boundary"
  - "overview anchor fix"
  - "foundation templates truncation"
importance_tier: important
contextType: planning
---
# Feature Specification: Phase 1: Foundation (Templates & Truncation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-07 |
| **Branch** | `main` (working tree, no dedicated branch) |
| **Phase Theme** | Anchor-template fix + shared truncation helper + OVERVIEW preservation |
| **Primary Defects** | D8 then D1 |
| **Primary PRs** | PR-1, PR-2 |
| **Successor Dependency** | Phase 2 consumes the shared truncation helper introduced here |
| **Verification Fixtures** | F-AC1, F-AC7 |

### Phase Context

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | `002-single-owner-metadata` |
| **Handoff Criteria** | PR-1 + PR-2 merged; anchor IDs match; OVERVIEW preserves word boundaries with pinned `…` ellipsis behavior; shared helper exported and unit-tested. [SOURCE: ../spec.md:197] |

This child folder implements the same phase identity the parent packet already published in its phase map: foundation work lands first because later phases either depend directly on the new helper or assume the anchor/template baseline is already stable. [SOURCE: ../spec.md:179-183]
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent research found two defects that are both user-visible and structurally foundational. **D1** corrupted the most prominent narrative section because the OVERVIEW text was truncated at the `SUMMARY` assignment in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:877-881` with raw `substring(0, 500)` logic before template rendering. **D8** left the rendered markdown internally inconsistent because `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` linked to `#overview` but the body still used the `ANCHOR:summary` marker near `:330-352`. [SOURCE: research.md §4] [SOURCE: research.md §5]

These defects matter beyond cosmetic polish. D1 degrades the highest-signal human-readable section, and D8 undermines structural consistency in every rendered memory file that includes OVERVIEW. The parent packet therefore freezes both into the P0 band and makes them the first two items in the nine-PR train. [SOURCE: research.md §10] [SOURCE: research.md §B.4]

### Purpose

Ship the narrowest safe foundation slice: PR-1 (template anchor alignment on `overview`) plus PR-2 (shared `truncateOnWordBoundary` helper extraction with OVERVIEW + observation-summary callsite migration). This lets the OVERVIEW section truncate cleanly on a word boundary, keeps the template anchor naming consistent, exports the helper for downstream reuse, gets F-AC1 and F-AC7 green, keeps `generate-context.js` at exit `0` on the two fixtures, and lets the parent packet mark Phase 1 complete before Phase 2 begins. [SOURCE: research.md §11] [SOURCE: research.md §B.4] [SOURCE: ../spec.md:197]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Align the template's TOC fragment, HTML `id`, and comment anchor to `overview` in `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`. [SOURCE: research.md §6] [SOURCE: research.md §D.1]
- Update the contract validator at `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:51` so the OVERVIEW section rule expects `commentId: 'overview'` instead of the legacy `summary`. (Coupling discovered during implementation: the validator gates rendered memory and must stay in sync with the renamed template marker.)
- Update the memory parser at `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:526` to accept BOTH the legacy `summary` and the new `overview` closing markers as OVERVIEW section terminators, preserving backward compatibility for historical memory files written under the old marker.
- Introduce `truncateOnWordBoundary()` as a shared helper for user-visible narrative truncation. [SOURCE: research.md §D.2] [SOURCE: research/iterations/iteration-017.md:29-31]
- Migrate the existing boundary-aware observation-summary logic in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:275-280` and its `normalizeInputData()` path at `:665-670` onto the helper. [SOURCE: research.md §B.4]
- Replace the raw `sessionSummary.substring(0, 500)` logic at the current `SUMMARY` assignment in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:877-881` with the shared helper so OVERVIEW preserves word boundaries. [SOURCE: research.md §6] [SOURCE: research.md §7]
- Author and execute the F-AC1 and F-AC7 verification fixtures plus a Phase 1 vitest suite. [SOURCE: research.md §11] [SOURCE: research.md §D.3]

### Out of Scope

- Any D4 importance-tier SSOT work in `frontmatter-migration.ts` or reviewer drift checks in later phases. [SOURCE: research.md §B.4]
- Any D7 provenance-only injection in `core/workflow.ts`. [SOURCE: research.md §B.4]
- Any D2/D3/D5/D6 work, SaveMode enum extraction, or reviewer expansion beyond this phase. [SOURCE: research.md §10] [SOURCE: research.md §13] [SOURCE: research.md §B.4]
- Historical artifact migration or operational follow-on PRs PR-10 and PR-11. [SOURCE: research.md §D.4]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Modify | PR-1 template-only anchor alignment at `:172-183` and `:330-352` (rename legacy `summary` opener to new `overview` opener). |
| `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts` | Modify | PR-1 follow-up: update SECTION_RULES line 51 `commentId: 'summary'` → `commentId: 'overview'` so the validator accepts the renamed marker. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | PR-1 follow-up: regex at `:526` accepts both `summary` and `overview` closing markers for backward compatibility with historical memories. |
| `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` | Create | PR-2 introduces the shared `truncateOnWordBoundary(text, limit, opts?)` helper. |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | PR-2 migrates `buildSessionSummaryObservation()` callsites at `:275-280` to call the shared helper. |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | PR-2 replaces the raw D1 clamp at the `SUMMARY` assignment in `:877-881` with `truncateOnWordBoundary(data.sessionSummary, 500)`. |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json` | Create | Phase-owned fixture for the D1 acceptance contract. |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json` | Create | Phase-owned fixture for the D8 acceptance contract. |
| `.opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts` | Create | Helper unit tests at 450/520/900-character boundaries with pinned `…` ellipsis assertion. |
| `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts` | Create | Combined F-AC1 + F-AC7 vitest assertions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-FUNC-001 / F-AC1 | OVERVIEW never ends mid-word, uses the phase-pinned `…` ellipsis, and stays within the expected truncated envelope when `sessionSummary` exceeds the 500-character clamp boundary. | Phase fixture `F-AC1` passes via `truncate-on-word-boundary.vitest.ts` + `memory-quality-phase1.vitest.ts`, and `generate-context.js` JSON-mode replay against `F-AC1-truncation.json` exits `0`. [SOURCE: research.md §11] [SOURCE: research.md §D.3] |
| REQ-FUNC-002 / F-AC7 | The rendered template contains `- [OVERVIEW](#overview)`, `<a id="overview"></a>`, and the `ANCHOR:overview` opening marker, with no surviving legacy `summary` opening marker in the OVERVIEW block. | Phase fixture `F-AC7` passes via `memory-quality-phase1.vitest.ts` template fs assertion, and `generate-context.js` JSON-mode replay against `F-AC7-anchor.json` exits `0`. [SOURCE: research.md §11] [SOURCE: research.md §D.3] |
| REQ-FUNC-003 / PH1-EXIT-1 | The shared helper is exported and referenced from both `input-normalizer.ts:275-280` and `collect-session-data.ts:877-881`. | Grep-based file check or unit-test import coverage confirms the shared helper contract is the only narrative truncation path touched in this phase. [SOURCE: research.md §B.4] |
| REQ-FUNC-004 / PH1-EXIT-2 | `generate-context.js` exits `0` for both F-AC1 and F-AC7 JSON-mode runs against the Phase 1 spec folder using absolute paths. | CLI replay succeeds twice with fixture-specific assertions layered on top. |
| REQ-FUNC-005 / PH1-EXIT-3 | The parent phase map flips Phase 1 from `Pending` to `Complete` after these checks pass. | Parent phase map row for `001-foundation-templates-truncation/` shows `Complete` and retains the published handoff line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-FUNC-006 / F-AC1-USER-1 | Reusable narrative truncation contract: a `sessionSummary` longer than 500 characters trims to the previous whitespace boundary and appends the canonical Unicode ellipsis. | Helper unit test at 520 and 900 characters with limit 500 passes; rendered OVERVIEW assertion in `memory-quality-phase1.vitest.ts` passes. |
| REQ-FUNC-007 / F-AC7-USER-1 | Stable OVERVIEW anchors: any payload that renders OVERVIEW emits the `overview` TOC fragment, HTML id, and comment marker simultaneously. | Template fs assertion in `memory-quality-phase1.vitest.ts` and the live JSON-mode replay both succeed. |
| REQ-FUNC-008 / HELPER-USER-1 | Phase 2 and later phases can import the same `truncateOnWordBoundary` helper without reintroducing ad-hoc substring rules. | Helper module is committed under `scripts/lib/`, has tests, and is referenced from both PR-2 callsites. |

### Acceptance Scenarios (Gherkin)

**Scenario A: Clean OVERVIEW truncation (REQ-FUNC-001 / F-AC1)**

- **Given** a JSON-mode payload with `sessionSummary` longer than 500 characters,
- **When** `generate-context.js` collects `SUMMARY` for the context template,
- **Then** the OVERVIEW section ends on a word boundary,
- **And** the rendered suffix is the single-codepoint Unicode ellipsis `…` (U+2026),
- **And** no token is cut mid-word.

**Scenario B: Stable OVERVIEW anchors (REQ-FUNC-002 / F-AC7)**

- **Given** any payload that renders the OVERVIEW section,
- **When** the context template is populated,
- **Then** the TOC fragment is `#overview`,
- **And** the HTML id is `overview`,
- **And** the comment anchor opener reads `ANCHOR:overview`.

**Scenario C: Shared helper reuse (REQ-FUNC-003 / PH1-EXIT-1 / REQ-FUNC-008)**

- **Given** Phase 2 or any later phase needs boundary-aware text shaping,
- **When** it imports the Phase 1 helper,
- **Then** it relies on the single `truncateOnWordBoundary` contract,
- **And** it does NOT reintroduce ad-hoc substring-based truncation rules.

**Scenario D: Passthrough at or under the limit (REQ-FUNC-006)**

- **Given** a `sessionSummary` of exactly 500 characters or fewer,
- **When** `truncateOnWordBoundary(text, 500)` is called,
- **Then** the function returns the input unchanged,
- **And** no ellipsis is appended.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: PR-1 leaves OVERVIEW with one consistent anchor identity across the TOC, HTML id, and comment marker, and the contract validator + memory parser are updated to honour the new marker without breaking historical memories. [SOURCE: research.md §D.1]
- **SC-002**: PR-2 removes the raw D1 clamp and routes both OVERVIEW and observation-summary truncation through a single shared helper. [SOURCE: research.md §D.2]
- **SC-003**: F-AC1 and F-AC7 are green (helper-level + JSON-mode replay) before the parent phase map is updated. [SOURCE: research.md §11] [SOURCE: research.md §D.3]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ellipsis ambiguity between `...` and `…` | Unstable snapshots and unclear closeout expectations | Pin `…` (U+2026) in helper, callsites, fixtures, and tests. [SOURCE: research.md §D.3] |
| Risk | Helper extraction widens into unrelated truncation sites | Scope creep and unintended behavior drift | Stop at the iteration-17-ordered callsites only (`input-normalizer.ts` + `collect-session-data.ts`). [SOURCE: research/iterations/iteration-017.md:62-68] |
| Risk | Template-only D8 fix breaks downstream contract validator | Quality gate aborts on every rendered OVERVIEW memory | Update `memory-template-contract.ts:51` and `memory-parser.ts:526` in lockstep with the template rename. |

### Dependencies

| Dependency | Type | Why It Matters |
|------------|------|----------------|
| `../research/research.md` | Canonical evidence | Supplies the final defect catalog, remediation matrix, priority order, PR train, and testing contract for this phase. [SOURCE: research.md §4] [SOURCE: research.md §6] [SOURCE: research.md §10] [SOURCE: research.md §11] |
| `../research/iterations/iteration-016.md` | Fixture design | Defines the exact fixture shapes and assertions for F-AC1 and F-AC7. |
| `../research/iterations/iteration-017.md` | Refactor ordering | Constrains the helper extraction order and keeps Phase 1 from sweeping in unrelated truncation sites. |
| Parent `../spec.md` phase map | Packet coordination | Publishes the handoff rule that Phase 2 depends on the helper exported here. |
| `validate.sh` and `generate-context.js` | Verification tooling | Provide the phase-level structural validation and JSON-mode replay checks required for closeout. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- The helper API stays minimal: `truncateOnWordBoundary(text, limit, opts?)` is the only new shared surface justified by research, and it does not absorb structural caps, git parsing slices, or reviewer-only truncation. [SOURCE: research/iterations/iteration-017.md:29-31] [SOURCE: research/iterations/iteration-017.md:73-77]
- Phase 1 must avoid widening into SaveMode or importance-tier SSOT work; those are separate architectural follow-ons mapped to later PRs. [SOURCE: research.md §13] [SOURCE: research.md §B.4]

### Reliability

- Template anchor alignment must be deterministic and payload-independent once OVERVIEW renders. [SOURCE: research.md §5] [SOURCE: research.md §7]
- OVERVIEW truncation must preserve human-readable boundaries even when the source string lands exactly on or just beyond the 500-character threshold.
- Backward compatibility: the memory parser must continue to recognize the OVERVIEW section in historical memories that still carry the legacy `summary` closing marker.

### Performance

- The helper extraction must not introduce a second narrative summarization policy or multi-pass rendering path; PR-2 is a tight correctness fix plus helper extraction, not a broader re-render pipeline. [SOURCE: research.md §D.1] [SOURCE: research.md §D.2]
- No file-system scan, repo-wide search, or reviewer-time expansion belongs in this phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Truncation Boundaries

- A `sessionSummary` that lands just over 500 characters must trim back to the previous whitespace boundary rather than cutting the last token in place. [SOURCE: research.md §7]
- A `sessionSummary` that is already short or under the existing eligibility threshold should not gain an ellipsis unnecessarily. The phase pins behavior for actual truncation, not unconditional suffix decoration. [SOURCE: research.md §D.3]
- Empty / null / negative-limit inputs return an empty string rather than throwing.

### Anchor Rendering

- The D8 fix must update both the TOC block and the OVERVIEW block so the same anchor name survives in both locations. Patching only one side would preserve the mismatch in another form. [SOURCE: research.md §5] [SOURCE: research.md §D.1]
- Payloads that render OVERVIEW with a short summary still need to exercise the anchor contract; F-AC7 is intentionally minimal for that reason.

### Helper Scope Control

- Narrative truncation in `decision-extractor.ts` is real but is treated as a future migration surface after the Phase 1 D1 correction and initial helper extraction settle. [SOURCE: research/iterations/iteration-017.md:20-27]
- Structural slices in git parsing, anchor generation, or protocol parsing must stay untouched. They are explicitly ruled out as shared-helper candidates. [SOURCE: research/iterations/iteration-017.md:73-77]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Three existing source files plus one new helper, two fixture files, two test files, one validator and one parser update. |
| Risk | 16/25 | User-visible truncation, template anchors, and a contract validator coupling discovered mid-implementation. |
| Research | 16/20 | Strongly constrained by canonical synthesis plus two decisive iteration addenda. |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None remaining for Phase 1. The ellipsis decision has been pinned to Unicode `…` (U+2026) per parent handoff criteria. Helper extraction order has been finalized to the iteration-17 narrow path. The contract validator and memory parser couplings discovered during implementation have been resolved with targeted edits and backward-compatible regex.
<!-- /ANCHOR:questions -->
