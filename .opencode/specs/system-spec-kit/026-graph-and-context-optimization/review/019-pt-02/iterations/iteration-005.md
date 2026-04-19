# Iteration 005

## Dimension

- `correctness` (revisit)

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deltas/iter-002.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deltas/iter-003.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/deltas/iter-004.jsonl`
- `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts`
- `.opencode/skill/system-spec-kit/templates/level_2/spec.md`
- `.opencode/skill/system-spec-kit/templates/level_2/plan.md`

## Proposal Validation

### Proposal 1: Shared frontmatter semantic validation

- Confirmed. The live shell validators check frontmatter structure and marker presence, but not semantic non-emptiness for `title`, `description`, `trigger_phrases`, `importance_tier`, or `contextType` in packet docs. `check-frontmatter.sh` only verifies frontmatter closure and presence of `SPECKIT_TEMPLATE_SOURCE` in `spec.md` and `plan.md` (`check-frontmatter.sh:33-60`), and the empty-field probe still passed `FRONTMATTER_VALID`, `TEMPLATE_SOURCE`, and `LEVEL_MATCH`.
- This proposal is not overstated.

### Proposal 2: Split operational/save-time guards from template-coverage reporting

- Directionally confirmed. `spec-doc-structure.ts` validates merge payload legality, post-save fingerprints, and cross-anchor contamination from external plans/snapshots, not just authored template fields (`spec-doc-structure.ts:467-609`, `611-760`, `760-969`).
- No new contrary evidence surfaced in this pass. The proposal still looks correct as a reporting-boundary fix rather than a missing-validator fix.

### Proposal 3: Document `TEMPLATE_SOURCE` as a first-class live rule

- Confirmed. `check-template-source.sh` only checks for the HTML comment marker in the first 20 lines (`check-template-source.sh:31-53`), and the published inventory omission from earlier iterations remains a documentation-surface mismatch, not a fake issue.
- This proposal is not overstated.

### Proposal 4: Continuity-bookkeeping semantic validation

- Iteration 4 understated the blast radius. The ranking treated `completion_pct`, `open_questions`, and `answered_questions` as if they were confined to `implementation-summary.md` (`iteration-004.md:27-30`), but those fields are emitted in the level templates for `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` as well (`templates/level_2/spec.md:25-27`, `templates/level_2/plan.md:25-27`, plus the corresponding `tasks.md`, `checklist.md`, and `implementation-summary.md` hits surfaced by repo grep).
- `FRONTMATTER_MEMORY_BLOCK` does not validate those fields at all; even when they are injected as empty values, the rule still passes because it only requires `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, and `next_safe_action`, and it treats "present but empty" as non-missing (`spec-doc-structure.ts:512-527`).
- The proposal itself is valid, but the iteration-004 coverage estimate and "last-mile" classification are no longer trustworthy and should be recomputed before final synthesis.

## Edge-Case Validation

### Empty shared frontmatter fields

- Probe: on a temp copy of the packet, `spec.md` was rewritten so `title`, `description`, `trigger_phrases`, `importance_tier`, and `contextType` were present but empty.
- Result: `check-frontmatter.sh`, `check-template-source.sh`, and `check-level-match.sh` all still returned `pass`.
- Interpretation: packet-doc validation currently treats these fields as structural decoration, not semantic requirements.

### Empty required continuity fields

- Probe: on a temp copy of the packet, `spec.md` was rewritten so `_memory.continuity.packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, and `next_safe_action` were all present but empty strings.
- Result: `FRONTMATTER_MEMORY_BLOCK` still returned `pass`.
- Evidence: the rule only flags fields that are `null`, not empty strings (`spec-doc-structure.ts:518-527`), and then skips format checks when the extracted value is falsy (`spec-doc-structure.ts:535-567`).
- Interpretation: semantic non-emptiness is currently unenforced even for continuity fields that the rule calls "required."

### Empty continuity-bookkeeping fields

- Probe: on a temp copy of the packet, `completion_pct`, `open_questions`, and `answered_questions` were injected into `_memory.continuity` as empty values.
- Result: `FRONTMATTER_MEMORY_BLOCK` still returned `pass`.
- Interpretation: iteration 4 was right that these fields are semantically unvalidated, but wrong about them being implementation-summary-only.

### Duplicate anchor IDs

- Probe: on a temp copy of the packet, a second balanced `metadata` anchor block was inserted into `spec.md`.
- Result: `check-anchors.sh` still returned `pass`.
- Evidence: the shell rule counts open/close parity per ID and checks required-anchor order, but it never rejects a duplicated ID when both openings and closings balance (`check-anchors.sh:117-143`, `153-190`). By contrast, preflight explicitly rejects duplicate IDs (`preflight.ts:323-339`).
- Interpretation: packet validation and preflight disagree on duplicate-anchor legality.

### `template_source_hint` contradicts declared level

- Probe: on a temp copy of the packet, `spec.md` frontmatter `template_source_hint` was changed to a bogus Level-3-flavored marker while `<!-- SPECKIT_LEVEL: 2 -->` and the live HTML template-source comment were left intact.
- Result: both `TEMPLATE_SOURCE` and `LEVEL_MATCH` still returned `pass`.
- Evidence: `check-template-source.sh` only looks for the HTML comment marker in the first 20 lines (`check-template-source.sh:44-53`), `check-level-match.sh` only parses explicit level markers/tables/frontmatter `level:` declarations (`check-level-match.sh:18-58`), and repo search found no validator references to `template_source_hint`.
- Interpretation: `template_source_hint` is currently advisory metadata only.

## New Findings

- `P2-004` — `check-anchors.sh` does not reject duplicate anchor IDs when the duplicate pairs are balanced.
  - Evidence: a duplicated `metadata` anchor passed `check-anchors.sh`, while `preflight.ts` still treats duplicate IDs as invalid.
  - Why P2: this is a real correctness blind spot in the packet validator, but no destructive runtime failure or packet corruption was demonstrated in this pass.

- No current evidence supports promoting any existing finding to `P0` or `P1`.

## Draft Coverage-Matrix Report Structure

1. `Executive Summary`
   - verdict, open finding counts, and the one ranking correction from this iteration
2. `Planning Trigger`
   - why this audit exists and which validator/template surfaces were treated as authoritative
3. `Active Finding Registry`
   - `P1-001`, `P2-001`, `P2-002`, `P2-003`, `P2-004` with current status and one-line evidence
4. `Remediation Workstreams`
   - shared-frontmatter semantics
   - operational-vs-template reporting split
   - published `TEMPLATE_SOURCE` inventory sync
   - continuity-bookkeeping semantics (re-scoped as multi-doc, not implementation-summary-only)
5. `Spec Seed`
   - packet-local spec delta for whichever remediation lane gets promoted
6. `Plan Seed`
   - ordered implementation starter with the ranking correction folded in
7. `Traceability Status`
   - coverage matrix table: rule family, authoritative implementation file, emitted template fields/anchors, gap type, edge-case notes
   - explicit probe appendix summary for empty-field, duplicate-anchor, and contradictory-hint cases
8. `Deferred Items`
   - advisory-only metadata such as `template_source_hint`, plus any low-value documentation cleanups
9. `Audit Appendix`
   - iteration log, temp-probe notes, convergence trend, and ranking-correction rationale

## Verdict

- `CONDITIONAL`

The top three proposals survived correctness review, but iteration 4's treatment of continuity bookkeeping as a one-document tail case does not hold against the live templates, and a new duplicate-anchor validation blind spot was evidenced. Final synthesis should keep proposal 1 high, preserve proposal 2 and 3, and recompute proposal 4 before freezing the remediation order.

## Next Dimension

- `traceability`
- Planned focus: fold the corrected continuity-field scope and the duplicate-anchor inconsistency into the final coverage matrix and review-report synthesis.
