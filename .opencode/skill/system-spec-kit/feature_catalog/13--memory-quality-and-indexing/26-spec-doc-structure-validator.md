---
title: "Spec-doc structure validator"
description: "Spec-doc structure validator fail-closes malformed frontmatter continuity blocks, merge legality, sufficiency, contamination and post-save fingerprint checks before a spec doc is accepted."
---

# Spec-doc structure validator

## 1. OVERVIEW

Spec-doc structure validator fail-closes malformed frontmatter continuity blocks, merge legality, sufficiency, contamination and post-save fingerprint checks before a spec doc is accepted.

The validator is the last structural checkpoint before a routed save becomes part of the canonical spec-doc surface. It does not try to infer meaning; it simply makes sure the document contract is intact, the frontmatter continuity block stays thin, and the write does not leak across anchors or silently corrupt the rendered doc.

## 2. CURRENT REALITY

`mcp_server/lib/validation/spec-doc-structure.ts` exposes five canonical continuity rules through `validate.sh --strict`.

- `FRONTMATTER_MEMORY_BLOCK` verifies that the `_memory.continuity` block exists, is well-formed, and stays within the compact size budget.
- `MERGE_LEGALITY` checks that the requested edit is legal for the current anchor and section shape.
- `SPEC_DOC_SUFFICIENCY` rejects routed writes that do not leave enough durable content behind.
- `CROSS_ANCHOR_CONTAMINATION` rejects writes that spill content into the wrong anchor or section.
- `POST_SAVE_FINGERPRINT` confirms the rendered output matches the expected post-save fingerprint and did not drift during write promotion.

The validator is wired into the save pipeline and the dedicated regression suite so structural failures are caught before canonical continuity writes can land.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/spec-doc-structure.ts` | Lib | Five-rule validator bridge for phase 018 spec-doc writes |
| `mcp_server/handlers/memory-save.ts` | Handler | Save-path integration that invokes the validator before storage |
| `scripts/spec/validate.sh` | Shell | Rule exposure and `--strict` orchestration surface |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/spec-doc-structure.vitest.ts` | Rule-level validator coverage |
| `mcp_server/tests/gate-d-regression-quality-gates.vitest.ts` | Gate D regression coverage for the validator bridge |

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/26-spec-doc-structure-validator.md`
