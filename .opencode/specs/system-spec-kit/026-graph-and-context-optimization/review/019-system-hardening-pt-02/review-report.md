# Template Validator Audit Synthesis Report

## Executive Summary

This six-iteration deep review converged on `4` active findings across the template v2.2 plus validator joint surface: `0 P0 / 1 P1 / 3 P2`. The highest-severity issue is still contract drift between the published validator surface and the live dispatcher. `validate.sh` continues to execute rule families that `show_help()` does not advertise, so operators and follow-on review packets cannot treat the help output as authoritative. Current evidence is in `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:98-103`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:333-395`, and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:398-427`.

Two structural correctness gaps remain open after synthesis. First, authored frontmatter semantics are still under-enforced: empty `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, and continuity fields can survive validation because the live shell and TypeScript rules mostly check structure, not non-empty meaning. Current evidence is in `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh:33-60`, `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh:18-45`, and `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:518-567`. Second, packet validation still allows duplicate anchor IDs when the duplicate pairs are balanced, even though preflight rejects the same condition. Current evidence is in `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:117-143` and `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:323-339`.

Iteration 3's standalone `TEMPLATE_SOURCE` documentation gap does not remain open as a separate finding on current `main`. `scripts/rules/README.md` now documents `TEMPLATE_SOURCE` in its structure and rule catalog (`.opencode/skill/system-spec-kit/scripts/rules/README.md:111-148`). The residual mismatch is narrower: `show_help()` is still stale, so that documentation drift is now absorbed into `P1-001` rather than tracked as a separate `P2`.

## Coverage Matrix

| Surface | Live authority | Status | Synthesis note |
| --- | --- | --- | --- |
| Published rule inventory | `validate.sh show_help()` + `scripts/rules/README.md` vs live dispatch | Partial | README documents more than `show_help()`, but `show_help()` still omits executed rule families. |
| Template provenance markers | `check-template-source.sh` + README | Covered with residual help drift | Live rule exists and README documents it; help output still does not. |
| Shared authored frontmatter semantics | `check-frontmatter.sh`, `check-level-match.sh`, `spec-doc-structure.ts` | Under-enforced | Structure is validated, but empty semantic values still pass. |
| Continuity required fields | `spec-doc-structure.ts` | Under-enforced | `requiredPairs` treats only `null` as missing, so empty strings bypass both missing-field and compactness checks. |
| Anchor uniqueness | `check-anchors.sh` + `preflight.ts` | Inconsistent | Packet validation tolerates balanced duplicates; preflight rejects them. |
| Operational/save-time rules | TS bridge rules + generated-artifact checks | Mixed into template audit surface | Six rules act on runtime/generated inputs rather than authored template content. |
| Level 3 ADR template baseline | `templates/level_3/decision-record.md` | Defective | The shipped description placeholder is malformed before packet authors touch it. |

## Findings by Severity

### P1

- `P1-001` — `validate.sh` dispatches a broader rule surface than `show_help()` advertises.
  - Evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:98-103` lists only 17 rules in `show_help()`, while `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:354-364` and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:398-427` still canonicalize and dispatch `AI_PROTOCOLS`, `COMPLEXITY_MATCH`, `FOLDER_NAMING`, `FRONTMATTER_VALID`, `LINKS_VALID`, `SECTION_COUNTS`, and `TEMPLATE_SOURCE`.
  - Impact: packet prompts and operator invocations that rely on help output under-describe the real enforcement surface.
  - Current status: `open`.

### P2

- `P2-001` — the Level 3 `decision-record.md` template still ships a malformed description placeholder.
  - Evidence: `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md:2-4`.
  - Impact: new Level 3 packets inherit broken metadata text unless the author catches it manually.
  - Current status: `open`.

- `P2-002` — the template-audit surface still mixes authored-template invariants with operational/save-time guards, while several authored metadata groups remain structurally unowned.
  - Evidence: the live dispatcher and TS bridge expose operational-only rules at `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:379-393` and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:417-424`; authored semantic gaps remain visible in `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh:33-60`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:518-567`, and the emitted continuity bookkeeping fields in `.opencode/skill/system-spec-kit/templates/level_2/spec.md:25-27`, `.opencode/skill/system-spec-kit/templates/level_2/plan.md:25-27`, `.opencode/skill/system-spec-kit/templates/level_2/tasks.md:24-26`, `.opencode/skill/system-spec-kit/templates/level_2/checklist.md:24-26`, `.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md:24-26`, plus `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md:25-27`.
  - Impact: audit coverage claims overstate how much of the authored template contract is actually enforced.
  - Current status: `open`.

- `P2-004` — `check-anchors.sh` still allows duplicate anchor IDs when the duplicate pairs remain balanced.
  - Evidence: `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:117-143` only compares open/close counts per ID, while `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:323-339` explicitly rejects duplicate IDs.
  - Impact: packet validation and preflight disagree on anchor uniqueness, so packet validation is not authoritative for this invariant.
  - Current status: `open`.

## Mismatch Taxonomy with Counts

- `inventory_drift`: `1` active cluster.
  - `show_help()` still omits `7` executed rule families: `AI_PROTOCOLS`, `COMPLEXITY_MATCH`, `FOLDER_NAMING`, `FRONTMATTER_VALID`, `LINKS_VALID`, `SECTION_COUNTS`, `TEMPLATE_SOURCE`.
- `operational_only_rules_in_template_audit`: `6`.
  - `GRAPH_METADATA_PRESENT`, `LINKS_VALID`, `NORMALIZER_LINT`, `MERGE_LEGALITY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`.
- `unowned_authored_field_groups`: `9`.
  - `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `completion_pct`, `open_questions`, `answered_questions`, `HVR_REFERENCE`.
- `duplicate_coverage_groups`: `4`.
  - required document set, template structure, level declaration, continuity-state freshness.
- `cross_surface_correctness_mismatches`: `1`.
  - duplicate-anchor rejection differs between packet validation and preflight.
- `absorbed_or_partially_addressed_mismatches`: `1`.
  - `TEMPLATE_SOURCE` README parity landed, so the old iteration-003 doc gap is no longer a standalone open finding.

## Ranked Proposals

| Rank | Proposal | Why this rank | Expected blast radius |
| --- | --- | --- | --- |
| 1 | Canonicalize the rule registry so dispatch, severity, and `show_help()` derive from one source | Fixes the lone `P1`, prevents future packet prompt drift, and absorbs the remaining inventory mismatch in one place | validator operator surface + all review packets |
| 2 | Add semantic non-empty validation for shared authored frontmatter and continuity bookkeeping fields | Closes the biggest authored-contract hole across the six canonical packet docs | `spec`, `plan`, `tasks`, `checklist`, `implementation-summary`, `decision-record` |
| 3 | Make `check-anchors.sh` reject duplicate anchor IDs, matching preflight | Resolves the current correctness mismatch without changing the broader audit model | packet validation + anchor-bearing packet docs |
| 4 | Split authored-template coverage reporting from operational/save-time rule reporting | Removes the largest audit-noise source and makes future coverage matrices truthful | review/reporting surfaces driven by validator output |
| 5 | Fix the malformed Level 3 `decision-record.md` description placeholder | Low lift, narrow scope, and immediately prevents new packets from inheriting broken metadata text | Level 3 packet scaffolding only |

## Implementation Handoff

Primary handoff target:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/002-template-validator-contract-alignment/`

Suggested scope for that child packet:

- replace the current split inventory model with a single rule registry that feeds dispatch, severity, and `show_help()`
- add semantic validation for authored frontmatter fields and continuity bookkeeping fields
- align packet validation with preflight by rejecting duplicate anchor IDs in `check-anchors.sh`
- repair the malformed placeholder in `templates/level_3/decision-record.md`
- update validator-facing docs only after the registry source of truth lands

If the implementation team wants to keep the first remediation child narrower, the reporting-boundary refactor can be deferred into a second follow-on child after the registry and correctness fixes land.

## Out of Scope

- editing templates, validators, or docs directly inside this review packet
- inventing new rule families not supported by the current evidence trail
- re-opening `P2-003` as a standalone bug now that `scripts/rules/README.md` documents `TEMPLATE_SOURCE`
- implementing the follow-on remediation child during iteration 006 itself
