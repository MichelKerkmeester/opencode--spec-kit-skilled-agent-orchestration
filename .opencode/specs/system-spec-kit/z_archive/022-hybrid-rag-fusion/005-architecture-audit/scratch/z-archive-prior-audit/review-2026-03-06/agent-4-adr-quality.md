# ADR Quality Assessment: 010-architecture-audit decision-record.md

**Reviewer:** Agent 4 (Claude Opus 4.6)
**Date:** 2026-03-06
**File:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/010-architecture-audit/decision-record.md`
**Lines:** 425

---

## Overall Verdict: PASS WITH CONCERNS

**Key finding count:** 14 findings (2 significant, 5 moderate, 7 minor)

**Most important finding:** ADR-006 characterizes AST-based enforcement as deferred "time-bounded technical debt," but an AST checker (`check-no-mcp-lib-imports-ast.ts`) already exists and runs in CI via `npm run check:ast --workspace=scripts`. The ADR's risk acceptance framing is stale relative to actual implementation state.

---

## Format Compliance Matrix

| ADR | Metadata | Context | Constraints | Decision | Alternatives | Consequences | Five Checks | Implementation | Compliant? |
|-----|----------|---------|-------------|----------|-------------|-------------|-------------|----------------|------------|
| 001 | Y | Y | Y | Y | Y | Y | Y | Y | YES |
| 002 | Y | Y | Y | Y | Y | Y | Y | Y | YES |
| 003 | Y | Y | Y | Y | Y | Y | Y | Y | YES |
| 004 | Y | Y | Y | Y | Y | Y | Y | Y | YES |
| 005 | Y | Y | Y | Y | Y | Y | Y | Y | YES |
| 006 | Y | Y | Y | Y | Y | Y | Y | Y | YES |

All 6 ADRs follow the standard 8-section format. No structural omissions.

---

## Per-ADR Evaluation

### ADR-001: API-First Boundary Contract

**Decision Quality Score: 4/5**

- **Strengths:**
  - Clear rationale grounded in measured coupling (4+ files importing `lib/*` internals).
  - Mitigation (allowlist with expiry criteria) directly addresses the migration cost concern.
  - Five Checks are substantive, especially item 5 which acknowledges controlled debt.

- **Concerns:**
  - The alternatives table has a score spread of 3/10 to 9/10, which is large but defensible given the asymmetry of long-term coupling risk. Not a strawman concern; the 4/10 option (duplicate wrappers) is a genuine pattern that could have been selected for local flexibility.
  - No explicit timeline or trigger for when the allowlist should shrink. "Expiry criteria" is referenced but not defined in the ADR itself.

- **Cross-references verified:**
  - `api/*` boundary contract concept is consistent with `spec.md` Section 2 and `ARCHITECTURE_BOUNDARIES.md`.

### ADR-002: Transitional Compatibility Wrappers

**Decision Quality Score: 4/5**

- **Strengths:**
  - Precise identification of the problem (`mcp_server/scripts/reindex-embeddings.ts` back-edge).
  - Canonical runbook location (`scripts/memory/README.md`) is explicitly named.
  - "Keep wrappers indefinitely" at 2/10 is the right call -- permanent ownership ambiguity is a real cost.

- **Concerns:**
  - Five Checks item 5 claims "No tech debt: Yes" but transitional wrappers are, by definition, temporary tech debt. The mitigation (explicit deprecation criteria) is good, but the "Yes" answer should be "Controlled" for consistency with how ADR-001 and ADR-003 handle similar situations.
  - No pointer to where the deprecation criteria are actually documented (task ID or file path).

- **Cross-references verified:**
  - Wrapper paths referenced in ADR match the actual file structure.

### ADR-003: Consolidate Duplicate Helper Logic

**Decision Quality Score: 5/5**

- **Strengths:**
  - Best-documented ADR in the set. Names specific functions (`estimateTokenCount`, `estimateTokens`, `extractQualityScore`, `extractQualityFlags`) and file locations (`tree-thinning.ts`, `token-metrics.ts`, `memory-indexer.ts`, `memory-parser.ts`).
  - Review Addendum transparently documents the correction (token estimation was initially omitted from Five Checks).
  - Alternatives include a non-obvious option (runtime-only ownership adapters at 6/10) that is a genuine alternative, not a strawman.

- **Concerns:**
  - None significant. This is the model ADR in the set.

- **Cross-references verified:**
  - T036 update to Five Checks confirmed in `tasks.md` (completed).
  - `shared/utils/token-estimate.ts` path is consistent with implementation.

### ADR-004: Enforcement Script Hardening

**Decision Quality Score: 4/5**

- **Strengths:**
  - Excellent provenance: cites the exact source (triple ultra-think + 10-agent cross-AI review) with agent counts and dates.
  - Three-tier hardening (P0/P1/P2) with concrete content per tier.
  - Consequences include a quantified coverage estimate ("~60% to ~85%").
  - Constraints section adds the NFR-P01 performance bound (<2s), which is good architectural discipline.

- **Concerns:**
  - **[SIGNIFICANT]** The "Proposed" status label in the Decision section ("We propose") is inconsistent with the Metadata status "Accepted." All other ADRs use "We chose." This appears to be a drafting artifact that was not updated when the ADR was accepted.
  - Five Checks item 5 references ADR-006 for the regex debt, creating a forward reference. While not invalid, it means ADR-004's Five Checks cannot stand alone without reading ADR-006. This is acceptable for a decision record that is read as a whole, but could confuse readers who consult individual ADRs.
  - The "4-6h" effort estimate in Consequences is unusually precise for an architecture decision. Consider whether this should be softened to a range qualifier (e.g., "moderate") since effort estimates in ADRs tend to become stale.

- **Cross-references verified:**
  - T021-T038 range confirmed in `tasks.md` (Phase 4 tasks).
  - CHK-200 through CHK-225 range confirmed in `checklist.md`.

### ADR-005: Handler-Utils Structural Consolidation

**Decision Quality Score: 5/5**

- **Strengths:**
  - Retroactive ADR that properly documents a decision made during implementation. The "Accepted (retroactive)" status is transparent.
  - Four alternatives (most in the document), with genuine differentiation. The "Move to shared/" option at 6/10 is a particularly honest evaluation -- it would work but over-generalizes.
  - Growth governance is explicitly addressed with reference to T033 and CHK-223.
  - Implementation section has the most precise task cross-references (T013a, T013b, T013c, T014, T033, T039).

- **Concerns:**
  - None significant. This is a well-constructed retroactive ADR.

- **Cross-references verified:**
  - T013a, T013b, T013c, T014 all confirmed in `tasks.md`.
  - CHK-013 (cycle removed) and CHK-223 (growth policy) confirmed in `checklist.md`.

### ADR-006: Regex Evasion Risk Acceptance

**Decision Quality Score: 3/5**

- **Strengths:**
  - Proper merge provenance (from former spec 030, with archived source location).
  - The Phase 7 API-Surface Encapsulation Addendum is a valuable addition that documents the rationale for minimal API expansion.
  - Risk vectors are clearly enumerated (5 items).
  - "Accept risk + staged hardening" is the right pattern for managing known enforcement gaps.

- **Concerns:**
  - **[SIGNIFICANT]** The ADR describes AST enforcement as future "time-bounded technical debt" to be implemented later. However, `check-no-mcp-lib-imports-ast.ts` already exists (373 lines, full TypeScript AST parsing via the `typescript` compiler API), is wired as `npm run check:ast`, and runs in CI (`system-spec-kit-boundary-enforcement.yml` step "Run AST enforcement checks"). The AST checker handles:
    - Dynamic `import()` (line 217: `node.expression.kind === ts.SyntaxKind.ImportKeyword`)
    - Template literals (line 154: `ts.isNoSubstitutionTemplateLiteral`)
    - Deep transitive re-export traversal (lines 262-301: recursive `collectForbiddenReExports`)
    - Block comments are inherently handled by AST parsing (not line-based)
    - Multi-line imports are inherently handled by AST parsing

    This means the ADR's core risk acceptance premise -- that regex limitations create residual bypass risk -- is substantially mitigated by implementation that postdates the ADR but was not reflected back into it. The ADR should be updated to "Superseded" or annotated with an addendum noting that AST enforcement now runs alongside regex enforcement.

  - The merged-030 source ADR (in `scratch/`) references "P2 AST-upgrade timeline" as future work, which compounds the staleness.
  - Five Checks item 1 says vectors are "repeatedly validated by cross-AI review" -- this is true for the regex checker, but the AST checker already covers most of these vectors. The risk acceptance is no longer accurately scoped.
  - Consequences section says "Temporary exposure to known regex limitations" -- this undersells the current posture since AST enforcement is already active.

- **Cross-references verified:**
  - T074-T090 range confirmed in `tasks.md` (Phase 7 tasks, all completed).
  - CHK-500 through CHK-522 range confirmed in `checklist.md`.
  - Merged-030 decision record exists at documented scratch path.

---

## Cross-Reference Integrity

| Reference Type | Count Checked | Valid | Invalid | Notes |
|---------------|---------------|-------|---------|-------|
| Task IDs (T###) | 28 | 28 | 0 | All task references found in tasks.md |
| Checklist IDs (CHK-###) | 7 | 7 | 0 | All checklist references found in checklist.md |
| Internal ADR cross-refs | 2 | 2 | 0 | ADR-004 -> ADR-006, ADR-006 -> ADR-004 |
| Spec.md references | 3 | 3 | 0 | Boundary contract, review findings, merged-030 |
| File path references | 12 | 12 | 0 | All referenced source files exist |

Cross-reference integrity is complete. No broken links.

---

## Alternatives Quality Assessment (Strawman Check)

| ADR | # Alternatives | Genuine Differentiation? | Score Spread | Strawman Risk |
|-----|---------------|------------------------|--------------|---------------|
| 001 | 3 | Yes | 3-9 | Low |
| 002 | 3 | Yes | 2-8 | Low |
| 003 | 3 | Yes | 4-9 | Low |
| 004 | 3 | Yes | 2-8 | Low |
| 005 | 4 | Yes | 2-9 | None |
| 006 | 3 | Yes | 2-8 | Low |

No strawmen detected. All alternatives represent genuinely viable options with honest trade-off assessments. The lowest-scored alternatives (2/10 entries like "keep indefinitely" or "accept current limitations") are legitimate options that teams sometimes choose, just with well-documented downsides.

One pattern worth noting: five of six ADRs have a lowest option at 2/10, which creates a mild uniformity. These scores are defensible individually but the pattern suggests the scoring rubric could benefit from calibration.

---

## Five Checks Quality Assessment

| ADR | All 5 Answered? | Substantive? | Self-Standing? | Issues |
|-----|----------------|-------------|----------------|--------|
| 001 | Yes | Yes | Yes | None |
| 002 | Yes | Mostly | Yes | Item 5 says "Yes" but should say "Controlled" |
| 003 | Yes | Yes | Yes | None (corrected via Review Addendum) |
| 004 | Yes | Yes | No | Item 5 forward-references ADR-006 |
| 005 | Yes | Yes | Yes | None |
| 006 | Yes | Partially stale | Yes | Items 1, 3 are stale given AST implementation |

---

## Numbering Consistency

- ADR numbering (001-006) is sequential with no gaps.
- All ADRs use `<!-- ANCHOR:adr-NNN -->` / `<!-- /ANCHOR:adr-NNN -->` markers consistently.
- ADR-005 and ADR-006 are dated 2026-03-05 (one day after ADR-001 through ADR-004, dated 2026-03-04), which is consistent with their described origins (retroactive and merged, respectively).

---

## Missing ADR Assessment

**Were there decisions that should have been ADRs but were not?**

1. **CI workflow design** -- The decision to run both regex and AST enforcement in CI (rather than AST-only) is an architectural choice not captured in any ADR. Given that ADR-004 and ADR-006 extensively discuss enforcement strategy, the dual-enforcement approach warrants at minimum an addendum to ADR-006.

2. **API surface module structure** -- The creation of `mcp_server/api/indexing.ts` is documented in the ADR-006 addendum, which is adequate. The broader decision of the `api/` module decomposition (search, providers, storage, eval, indexing, index) is not captured in any ADR but is arguably implicit in ADR-001.

3. **Allowlist governance schema** -- ADR-004 mentions "allowlist governance schema" as P1 work, and the implementation added fields like `lastReviewedAt`, `expiresAt`, `owner`. This schema design could have been its own ADR but is adequately covered by the task-level documentation.

None of these are critical omissions. Item 1 (dual enforcement) would add the most architectural clarity.

---

## Summary of Findings

### Significant (2)
1. **ADR-004 status inconsistency:** "We propose" in Decision section vs. "Accepted" in Metadata. Should be "We chose" for consistency.
2. **ADR-006 staleness:** AST enforcement is already implemented and running in CI, but the ADR still frames it as deferred technical debt. The risk acceptance premise is substantially outdated.

### Moderate (5)
3. ADR-002 Five Checks item 5 says "Yes" for no tech debt, but transitional wrappers are by definition temporary tech debt. Should be "Controlled."
4. ADR-004 uses a forward reference to ADR-006 in Five Checks, reducing self-containment.
5. ADR-004 includes a specific effort estimate ("4-6h") that will age poorly.
6. ADR-006 consequences section understates actual enforcement posture.
7. Five of six ADRs have a lowest alternative scored at 2/10, suggesting mild scoring uniformity.

### Minor (7)
8. ADR-001 does not define "expiry criteria" for the allowlist within the ADR itself.
9. ADR-002 does not cross-reference where deprecation criteria are documented.
10. ADR-003 Review Addendum is a good practice that should be adopted by ADR-006 for the AST implementation update.
11. ADR-005 is the only retroactive ADR -- the pattern works well and could be explicitly acknowledged as a template for future retroactive documentation.
12. ADR-006's merged-030 source document also references "P2 AST-upgrade timeline" as future, compounding staleness.
13. No ADR captures the dual-enforcement (regex + AST) architectural decision.
14. ANCHOR markers are consistently formatted across all 6 ADRs (positive finding).

---

## Recommended Actions

| Priority | Action | Target ADR |
|----------|--------|-----------|
| P0 | Update ADR-006 with addendum noting AST enforcement is now active in CI; re-scope residual risk to only those vectors AST does not cover (e.g., computed template literal specifiers) | ADR-006 |
| P1 | Change "We propose" to "We chose" in ADR-004 Decision section | ADR-004 |
| P1 | Change ADR-002 Five Checks item 5 from "Yes" to "Controlled" | ADR-002 |
| P2 | Consider adding a brief ADR-007 or ADR-006 addendum for the dual-enforcement (regex + AST parallel) strategy | ADR-006 or new |
| P2 | Soften ADR-004 effort estimate from "4-6h" to relative qualifier | ADR-004 |
