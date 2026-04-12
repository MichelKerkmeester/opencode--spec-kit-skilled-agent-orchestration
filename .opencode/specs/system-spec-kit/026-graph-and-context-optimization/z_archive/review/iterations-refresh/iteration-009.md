# Iteration 009 — Manual Trigger Fail-Open Check

## Dimension
D2

## Focus area
Security/fail-open: check input-normalizer.ts new title/description/causalLinks passthrough for injection or path traversal risks

## Findings

### Finding DR-REFRESH-009-P1-001

- **Claim:** Packet `010`'s manual-trigger preservation path still fails open on path fragments, even though the packet ADR says manual phrases should only survive when they are not path fragments, control characters, or prompt/tool leakage.
- **Evidence:** The packet ADR explicitly says manual phrases must survive unless they are true contamination such as path fragments, control characters, or prompt/tool leakage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/decision-record.md:60-67] In the sanitizer, all manual phrases are returned as `keep: true` immediately after the contamination-only check; the path-fragment guard runs only after that unconditional manual return. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:139-156] In the workflow filter, manual phrases are also exempted before the slash and backslash filter runs. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:138-154] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1299-1304] The new manual-preservation test only covers DR ids, singleton anchors, and contamination, not manual path-fragment rejection. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts:8-38]
- **Gap:** A manual phrase like `system/spec-kit` can now bypass the very path-fragment guard that the ADR says should still apply.
- **Severity:** P1 (required)
- **Confidence:** 0.95
- **Downgrade trigger:** Downgrade if another pre-render validation layer rejects manual path fragments before they can be saved or indexed.

## Counter-evidence sought

I explicitly looked for a second fail-open around authored `title`, `description`, or `causalLinks` passthrough and did not find one. Those fields are normalized directly, [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:632-655] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:747-755] rendered through the standard template path, [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:1-15] [SOURCE: .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:136-168] and then blocked on malformed frontmatter before write via V13 and the workflow abort gate. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:154-161] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1662-1666] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1780-1792]

## Iteration summary

The meaningful fail-open is in manual trigger phrase handling, not in the new title or description or causal-links passthrough. Packet `010` fixed most of the save path, but this contamination exception is still too broad.
