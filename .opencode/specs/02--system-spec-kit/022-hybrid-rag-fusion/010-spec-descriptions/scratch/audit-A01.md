# Audit A-01: 001-hybrid-rag-fusion-epic

## Summary
| Metric | Result |
|--------|--------|
| Claimed completion | 85.0% (spec.md:48) |
| Audited completion | 78.9% (243/308 checklist items checked) |
| Discrepancy | +6.1% |
| Template compliance | FAIL |
| Evidence quality | WARN |
| Level correct | YES |

## Detailed Findings
### 1. Template Compliance
- Audited markdown files: README.md, checklist.md, decision-record.md, implementation-summary.md, plan.md, research.md, spec.md, tasks.md.
- Root-level YAML frontmatter is missing or invalid in 8/8 audited files. Each file starts with a consolidation wrapper heading instead of a root `---` block.
- `SPECKIT_TEMPLATE_SOURCE` is missing in README.md and research.md at the root artifact level.
- `SPECKIT_LEVEL` is missing in README.md.
- ANCHOR tags are missing in README.md and research.md.
- The consolidated wrapper format places source-doc frontmatter and anchors mid-file, which does not satisfy v2.2 root-template requirements even when embedded source material is valid.
- spec.md fails the explicit frontmatter check for required root fields (`title`, `status`, `level`, `created`, `updated`) because it has no valid root YAML frontmatter block.

### 2. Checklist Accuracy
- Parsed checklist totals: 308 items, 243 checked, 65 unchecked, for an audited completion rate of 78.9%.
- Priority breakdown:
  - P0: 1/2 checked (50.0%)
  - P1: 101/106 checked (95.3%)
  - Unscoped/embedded items: 141/200 checked (70.5%)
- The 85% completion claim appears in `spec.md:48` as `| **Status** | In Progress (85%+ complete) |`.
- The audited checkbox completion is therefore 6.1 percentage points lower than the claim.
- P0 item-by-item analysis:
  - [ ] `[P0] No additional phase-specific blockers recorded for this checklist normalization pass.` — unchecked, no evidence.
  - [x] `All P0 blocker checks completed in this checklist.` — checked, but evidence is generic (`[EVIDENCE: P0 items below are marked complete with supporting artifacts.]`).
- P1 item-by-item analysis:
  - [ ] `[P1] No additional required checks beyond documented checklist items for this phase.` — unchecked, no evidence.
  - [x] `All P1 required checks completed in this checklist.` — checked, but evidence is generic (`[EVIDENCE: P1 items below are marked complete with supporting artifacts.]`).
  - Remaining sampled P0/P1 implementation checks generally cite concrete evidence patterns such as file paths and aggregate test results (for example `adaptive-fusion.ts`, `context-server.ts:566`, and `4546 passed, 19 skipped, 0 failed across 155 test files`).

### 3. Evidence Quality
- Evidence quality is **WARN**, not PASS.
- Most checked P0/P1 implementation items include specific evidence markers with file references and test outcomes.
- However, the two checklist-level completion assertions (`All P0 blocker checks completed...` and `All P1 required checks completed...`) use boilerplate evidence that points only to items "below" rather than to exact files, commands, commits, or test runs.
- Those generic completion assertions should be replaced with exact verification evidence or left unchecked until the canonical checklist is normalized.

### 4. Cross-References
- Valid adjacent child folders exist for the 002-012 numeric range, but several references inside the epic docs point to names that do not exist under `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`.
- Broken/mismatched references identified during audit:
  - README.md -> `002-hybrid-rag-fusion` (missing)
  - README.md -> `006-hybrid-rag-fusion-logic-improvements` (missing)
  - plan.md -> `003-index-tier-anomalies` (missing)
  - plan.md -> `004-frontmatter-indexing` (missing)
  - research.md -> `002-005` (not a valid folder path)
  - research.md -> `002-index-tier-anomalies` (missing)
  - research.md -> `002-auto-detected-session-bug` (missing)
  - spec.md -> `006-measurement-foundation` (missing)
  - spec.md -> `010-measurement-foundation` (missing)
  - spec.md -> `011-graph-signal-activation` (missing)
  - spec.md -> `012-scoring-calibration` (missing)
  - spec.md -> `002-cross-cutting-remediation` (missing)
- Existing adjacent folders that do resolve include `008-combined-bug-fixes` and `011-feature-catalog`, but the epic documentation does not consistently reference the current child-folder names.

## Issues
1. **ISS-A01-001** — All audited root markdown artifacts fail v2.2 frontmatter compliance because the consolidation wrapper displaced root YAML frontmatter.
2. **ISS-A01-002** — spec.md fails the required frontmatter field check (`title`, `status`, `level`, `created`, `updated`) at the document root.
3. **ISS-A01-003** — README.md and research.md are missing required root template markers/anchors, and README.md also lacks `SPECKIT_LEVEL`.
4. **ISS-A01-004** — The epic claims 85%+ completion, but the actual checklist state is 78.9% (243/308 checked), a +6.1 point discrepancy.
5. **ISS-A01-005** — Checklist evidence quality is weakened by generic checked summary items for P0/P1 that do not cite exact files, commands, commits, or test runs.
6. **ISS-A01-006** — Multiple child-folder references are broken or stale, especially legacy names carried over from pre-consolidation source folders.
7. **ISS-A01-007** — README.md is present in the audited folder and fails the same template-compliance rules applied to the other markdown artifacts in scope.

## Recommendations
1. Rebuild each consolidated artifact from the v2.2 parent template so root-level frontmatter, `SPECKIT_TEMPLATE_SOURCE`, `SPECKIT_LEVEL`, and ANCHOR structure are valid before any embedded historical material.
2. Correct the published completion figure to 78.9%, or update the checklist itself so an 85%+ claim is directly supported by checked items and specific evidence.
3. Replace the generic checked summary lines for P0/P1 with exact verification evidence (file paths, command outputs, test summaries, or commit refs).
4. Normalize checklist.md into one canonical epic checklist rather than embedding multiple source checklists verbatim.
5. Repair stale child-folder references so the epic points to the current 002-012 folder names that actually exist.
6. Decide whether README.md is an auditable spec artifact; if yes, add compliant metadata, and if no, exclude it from this audit standard explicitly.
