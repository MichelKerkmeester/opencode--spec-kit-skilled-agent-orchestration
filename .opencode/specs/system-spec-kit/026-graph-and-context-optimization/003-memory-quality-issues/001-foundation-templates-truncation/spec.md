---
title: "Feature Specification: Phase 1 — Foundation (Templates & Truncation)"
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
# Feature Specification: Phase 1 — Foundation (Templates & Truncation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 1 is the ship-first foundation slice of the parent remediation packet. It owns PR-1 and PR-2: a template-only D8 repair in `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`, plus the D1 OVERVIEW correction rooted in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` and aligned with the existing boundary-aware behavior in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` and `:668-674`. [SOURCE: research.md §6] [SOURCE: research.md §10] [SOURCE: research.md §B.4]

The research explicitly places D8 first and D1 immediately after it because both are high-value, low-risk P0 changes. D8 is a literal template mismatch, while D1 is a one-owner correctness bug where `sessionSummary` is cut with a raw `substring(0, 500)` before the template renders `{{SUMMARY}}`. [SOURCE: research.md §4] [SOURCE: research.md §5] [SOURCE: research.md §10]

This phase also introduces the shared `truncateOnWordBoundary()` helper as the reusable primitive that later phases depend on. Iteration 17 mapped the safe extraction order: lift the already boundary-aware narrative trimming into a helper, migrate the existing `buildSessionSummaryObservation()` callsites in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`, then migrate the D1 owner in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`. [SOURCE: research.md §13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]

Success for this phase is narrow and concrete: the OVERVIEW section truncates cleanly on a word boundary, the template anchor naming is fully consistent on `overview`, the helper is exported for downstream reuse, F-AC1 and F-AC7 pass, `generate-context.js` exits `0` on the two fixtures, and the parent packet can mark Phase 1 complete before Phase 2 begins. [SOURCE: research.md §11] [SOURCE: research.md §B.4] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197]

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-07 |
| **Phase Theme** | Anchor-template fix + shared truncation helper + OVERVIEW preservation |
| **Primary Defects** | D8 then D1 |
| **Primary PRs** | PR-1, PR-2 |
| **Successor Dependency** | Phase 2 consumes the shared truncation helper introduced here |
| **Verification Fixtures** | F-AC1, F-AC7 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | `002-single-owner-metadata` |
| **Handoff Criteria** | PR-1 + PR-2 merged; anchor IDs match; OVERVIEW preserves word boundaries with pinned ellipsis behavior; shared helper exported and unit-tested. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197] |

This child folder implements the same phase identity the parent packet already published in its phase map: foundation work lands first because later phases either depend directly on the new helper or assume the anchor/template baseline is already stable. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-183]

**Scope Boundary**: only the PR-1 and PR-2 seams belong here: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` and `:668-674`, plus the new `lib/truncate-on-word-boundary.ts`. [SOURCE: research.md §B.4]

**Dependencies**:
- Parent research remains the source of truth for defect ownership, priority, and fixture design. [SOURCE: research.md §4] [SOURCE: research.md §6] [SOURCE: research.md §11]
- The helper extraction order from iteration 17 constrains implementation sequencing in this phase. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
- Ellipsis behavior must be pinned during this phase so later fixtures do not encode punctuation ambiguity. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:276-276]

**Deliverables**:
- Clean `overview` anchor alignment in the template. [SOURCE: research.md §D.1]
- Shared `truncateOnWordBoundary()` helper plus migrated OVERVIEW and observation-summary callsites. [SOURCE: research.md §D.2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:29-31]
- F-AC1 and F-AC7 fixtures and verification commands recorded in this phase packet. [SOURCE: research.md §D.3]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

The parent research found two defects that are both user-visible and structurally foundational. D1 corrupts the most prominent narrative section because the OVERVIEW text is truncated in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` with `substring(0, 500)` before template rendering, while D8 leaves the rendered markdown internally inconsistent because `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` links to `#overview` but the body still uses the `ANCHOR:summary` marker near `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`. [SOURCE: research.md §4] [SOURCE: research.md §5]

These defects matter beyond cosmetic polish. D1 degrades the highest-signal human-readable section, and D8 undermines structural consistency in every rendered memory file that includes OVERVIEW. The parent packet therefore freezes both into the P0 band and makes them the first two items in the nine-PR train. [SOURCE: research.md §10] [SOURCE: research.md §B.4]

Phase 1 also carries the first safe cross-cutting extraction: a shared truncation helper. Research did not propose a brand-new behavior surface; it found one existing boundary-aware implementation in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` and showed that D1 persists only because `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` bypasses it. [SOURCE: research.md §13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:68-68]

The phase must stay disciplined. Research explicitly warns against sweeping in unrelated truncation sites, structural `slice(0, N)` caps, or broader `_source` / SaveMode refactors at this stage. The only justified extraction is narrative truncation that feeds user-visible text and directly stabilizes the current D1 owner plus the already boundary-aware observation helper. [SOURCE: research.md §13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:31-31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:73-77]
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:user-stories -->
## 3. USER STORIES

### Story 1 — Clean OVERVIEW truncation

```gherkin
Scenario: OVERVIEW truncates on a word boundary
  Given a JSON-mode payload with sessionSummary longer than 500 characters
  When generate-context collects SUMMARY for the context template
  Then the OVERVIEW section ends on a word boundary
  And the rendered suffix uses the phase-pinned ellipsis style
  And no word is cut mid-token
```

Rationale: D1 is owned by `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, while the desired boundary-aware behavior already exists in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`. [SOURCE: research.md §5] [SOURCE: research.md §7]

### Story 2 — Stable OVERVIEW anchors

```gherkin
Scenario: Template anchor names agree on overview
  Given any payload that renders the OVERVIEW section
  When the context template is populated
  Then the TOC fragment is #overview
  And the HTML id is overview
  And the comment anchor is ANCHOR:overview
```

Rationale: D8 is authored directly in `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`, so a template-only alignment is sufficient. [SOURCE: research.md §5] [SOURCE: research.md §7]

### Story 3 — Reusable truncation foundation for later phases

```gherkin
Scenario: Later phases reuse the same truncation primitive
  Given Phase 2 and later phases need boundary-aware text shaping
  When they import the Phase 1 helper
  Then they rely on one shared truncateOnWordBoundary contract
  And they do not reintroduce ad hoc substring-based truncation rules
```

Rationale: the parent phase map states that Phase 2 depends on the shared truncation helper introduced here, and iteration 17 explicitly names `truncateOnWordBoundary()` as the reusable extraction target. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:181-181] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:29-31]
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- Align the template’s TOC fragment, HTML `id`, and comment anchor to `overview` in `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`. [SOURCE: research.md §6] [SOURCE: research.md §D.1]
- Introduce `truncateOnWordBoundary()` as a shared helper for user-visible narrative truncation. [SOURCE: research.md §D.2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:29-31]
- Migrate the existing boundary-aware observation-summary logic in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` and its `normalizeInputData()` path at `:668-674` onto the helper. [SOURCE: research.md §B.4] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-19]
- Replace the raw `sessionSummary.substring(0, 500)` logic in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` with the shared helper so OVERVIEW preserves word boundaries. [SOURCE: research.md §6] [SOURCE: research.md §7]
- Author and execute the F-AC1 and F-AC7 verification fixtures. [SOURCE: research.md §11] [SOURCE: research.md §D.3]

### Out of Scope

- Any D4 importance-tier SSOT work in `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183` or reviewer drift checks in later phases. [SOURCE: research.md §B.4]
- Any D7 provenance-only injection in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659` and `:877-923`. [SOURCE: research.md §B.4]
- Any D2 decision precedence, D3 trigger sanitization, D5 predecessor discovery, D6 reproducer work, SaveMode enum extraction, or reviewer expansion beyond this phase. [SOURCE: research.md §10] [SOURCE: research.md §13] [SOURCE: research.md §B.4]
- Historical artifact migration or operational follow-on PRs such as PR-10 or PR-11. [SOURCE: research.md §D.4]

### Files to Change

| File Path | Change Type | Why It Belongs to Phase 1 |
|-----------|-------------|---------------------------|
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Modify | PR-1 is a template-only anchor alignment at `:172-183` and `:330-352`. [SOURCE: research.md §B.4] |
| `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` | Create | PR-2 introduces the shared helper that later phases reuse. [SOURCE: research.md §B.4] [SOURCE: research.md §D.2] |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | PR-2 migrates the existing boundary-aware observation helper callsites at `:274-283` and `:668-674`. [SOURCE: research.md §B.4] |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | PR-2 replaces the raw D1 clamp at `:875-881`. [SOURCE: research.md §B.4] |
| `tests/fixtures/memory-quality/F-AC1-truncation.json` | Create | Phase-owned fixture for the D1 acceptance contract. [SOURCE: research.md §D.3] |
| `tests/fixtures/memory-quality/F-AC7-anchor.json` | Create | Phase-owned fixture for the D8 acceptance contract. [SOURCE: research.md §D.3] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. ACCEPTANCE CRITERIA

| ID | Criterion | Verification |
|----|-----------|--------------|
| F-AC1 | OVERVIEW never ends mid-word, uses the phase-pinned ellipsis style, and stays within the expected truncated envelope when `sessionSummary` exceeds the 500-character clamp boundary. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283] | Phase fixture `F-AC1` passes in both helper-level assertions and `generate-context.js` JSON-mode replay. [SOURCE: research.md §11] [SOURCE: research.md §D.3] |
| F-AC7 | The rendered template contains `- [OVERVIEW](#overview)`, `<a id="overview"></a>`, and the `ANCHOR:overview` marker, with no surviving `ANCHOR:summary` marker in the OVERVIEW block. [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:172-183] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:330-352] | Phase fixture `F-AC7` passes via template-render replay or direct markdown assertions. [SOURCE: research.md §11] [SOURCE: research.md §D.3] |
| PH1-EXIT-1 | The shared helper is exported and referenced from both `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` and `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`. [SOURCE: research.md §B.4] [SOURCE: research.md §D.2] | Grep-based file check or unit-test import coverage confirms the shared helper contract is the only narrative truncation path touched in this phase. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68] |
| PH1-EXIT-2 | `generate-context.js` exits `0` for both F-AC1 and F-AC7 JSON-mode runs against the intended spec folder. [SOURCE: research.md §11] | CLI replay succeeds twice with fixture-specific assertions layered on top. |
| PH1-EXIT-3 | The parent phase map can flip Phase 1 from `Pending` to `Complete` after these checks pass. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-197] | Parent `spec.md` shows `Complete` for `001-foundation-templates-truncation/` and retains the published handoff line. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:nfr -->
## 6. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- The helper API should stay minimal: `truncateOnWordBoundary(text, limit, opts?)` is the only new shared surface justified by research, and it should not absorb structural caps, git parsing slices, or reviewer-only truncation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:29-31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:73-77]
- Phase 1 must avoid widening into SaveMode or importance-tier SSOT work; those are separate architectural follow-ons already mapped to later PRs. [SOURCE: research.md §13] [SOURCE: research.md §B.4]

### Reliability

- Template anchor alignment must be deterministic and payload-independent once OVERVIEW renders. [SOURCE: research.md §5] [SOURCE: research.md §7]
- OVERVIEW truncation must preserve human-readable boundaries even when the source string lands exactly on or just beyond the 500-character threshold. [SOURCE: research.md §11] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:37-54]

### Performance

- The helper extraction must not introduce a second narrative summarization policy or multi-pass rendering path; research positions PR-2 as a tight correctness fix plus helper extraction, not a broader re-render pipeline. [SOURCE: research.md §D.1] [SOURCE: research.md §D.2]
- No file-system scan, repo-wide search, or reviewer-time expansion belongs in this phase. The scope remains confined to template render and in-memory narrative truncation. [SOURCE: research.md §10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Truncation Boundaries

- A `sessionSummary` that lands just over 500 characters must trim back to the previous whitespace boundary rather than cutting the last token in place. [SOURCE: research.md §7] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:39-54]
- A `sessionSummary` that is already short or under the existing eligibility threshold should not gain an ellipsis unnecessarily. The phase pins behavior for actual truncation, not unconditional suffix decoration. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:276-276]

### Anchor Rendering

- The D8 fix must update both the TOC block and the OVERVIEW block so the same anchor name survives in both locations. Patching only one side would preserve the mismatch in another form. [SOURCE: research.md §5] [SOURCE: research.md §D.1]
- Payloads that render OVERVIEW with a short summary still need to exercise the anchor contract; F-AC7 is intentionally minimal for that reason. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-203]

### Helper Scope Control

- Narrative truncation in `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:120-135`, `:270-274`, `:329-332`, `:429-436`, and `:454-455` is real, but iteration 17 treats those as future migration surfaces after the Phase 1 D1 correction and initial helper extraction settle. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:20-27] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]
- Structural slices in git parsing, anchor generation, or protocol parsing must stay untouched. They are explicitly ruled out as shared-helper candidates. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:73-77]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

| Dependency | Type | Why It Matters |
|------------|------|----------------|
| `../research/research.md` | Canonical evidence | Supplies the final defect catalog, remediation matrix, priority order, PR train, and testing contract for this phase. [SOURCE: research.md §4] [SOURCE: research.md §6] [SOURCE: research.md §10] [SOURCE: research.md §11] |
| `../research/iterations/iteration-016.md` | Fixture design | Defines the exact fixture shapes and assertions for F-AC1 and F-AC7, including the explicit no-mid-token assertion and the `overview` anchor expectations. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:37-54] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-203] |
| `../research/iterations/iteration-017.md` | Refactor ordering | Constrains the helper extraction order and keeps Phase 1 from sweeping in unrelated truncation sites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75] |
| Parent `spec.md` phase map | Packet coordination | Publishes the handoff rule that Phase 2 depends on the helper exported here. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-197] |
| `validate.sh` and `generate-context.js` | Verification tooling | Provide the phase-level structural validation and JSON-mode replay checks required for closeout. [SOURCE: research.md §11] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:prior-art -->
## 9. PRIOR ART

1. `research.md §4` and `§5` establish D1 and D8 as concrete, already-localized defects rather than open investigations. Phase 1 therefore does not spend effort on rediscovery. [SOURCE: research.md §4] [SOURCE: research.md §5]
2. `research.md §6` freezes the final remediation matrix and marks D8 plus D1 as the P0 lane, which this child phase mirrors exactly. [SOURCE: research.md §6]
3. `research.md §10` and `§B.4` set the rollout order: PR-1 first, PR-2 second, both independently revertable and both foundational for later phases. [SOURCE: research.md §10] [SOURCE: research.md §B.4]
4. `research.md §11` and `§D.3` define the acceptance philosophy for this phase: localized fixtures first, `generate-context.js` replay second, broader end-to-end confirmation later in the train. [SOURCE: research.md §11] [SOURCE: research.md §D.3]
5. Iteration 2 proves the OVERVIEW bug belongs to `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` and not to template rendering. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-002.md:26-26] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-002.md:38-42]
6. Iteration 7 proves the anchor mismatch is literal template authorship, so PR-1 can stay a one-file change. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-007.md:21-21] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-007.md:35-35]
7. Iteration 17 gives this phase its architectural guardrails: extract the shared helper, migrate the already boundary-aware callsites, then repair the D1 owner, and leave broader truncation sites for later. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]
<!-- /ANCHOR:prior-art -->

---

<!-- ANCHOR:success-criteria -->
## 10. SUCCESS CRITERIA

- **SC-001**: PR-1 leaves OVERVIEW with one consistent anchor identity across the TOC, HTML id, and comment marker. [SOURCE: research.md §D.1]
- **SC-002**: PR-2 removes the raw D1 clamp and routes both OVERVIEW and observation-summary truncation through a single shared helper. [SOURCE: research.md §D.2]
- **SC-003**: F-AC1 and F-AC7 are green before the parent phase map is updated. [SOURCE: research.md §11] [SOURCE: research.md §D.3]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 11. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ellipsis ambiguity between `...` and `…` | Unstable snapshots and unclear closeout expectations | Pin one canonical suffix in Phase 1 code and tests. [SOURCE: research.md §D.3] |
| Risk | Helper extraction widens into unrelated truncation sites | Scope creep and unintended behavior drift | Stop at the iteration-17-ordered callsites only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68] |
| Dependency | Parent handoff rule in `../spec.md` | Phase 2 cannot start cleanly without the published helper baseline | Treat the parent status update as the last completion action. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Three existing files plus one new helper and phase-owned fixtures. |
| Risk | 14/25 | User-visible truncation and template anchors, but both are already localized. |
| Research | 16/20 | Strongly constrained by canonical synthesis plus two decisive iteration addenda. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which suffix becomes canonical for Phase 1 snapshots: ASCII `...` or Unicode `…`? Research leaves this open but requires the phase to pin one choice before fixtures freeze. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:276-276]
- Should the initial helper migration include any decision-extractor truncation callsites, or should Phase 1 stop strictly at the already boundary-aware observation path plus the D1 owner to preserve the narrowest blast radius? Iteration 17 recommends the narrower order. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]
<!-- /ANCHOR:questions -->
