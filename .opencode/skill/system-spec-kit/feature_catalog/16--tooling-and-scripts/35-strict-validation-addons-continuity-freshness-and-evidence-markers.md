---
title: "Strict validation add-ons: continuity freshness and evidence markers"
description: "The implementation extended validate.sh --strict with continuity-freshness, evidence-marker lint, the bracket-depth audit tooling, and the normalizer lint guardrail."
---

# Strict validation add-ons: continuity freshness and evidence markers

## 1. OVERVIEW

The implementation extended `validate.sh --strict` with continuity-freshness, evidence-marker lint, the bracket-depth audit tooling, and the normalizer lint guardrail.

This is the tooling layer that turned the save-path fixes into enforceable policy. Instead of only fixing stale metadata, malformed evidence markers, or new scope-normalizer duplicates once, the validator now catches those states automatically during strict packet validation.

---

## 2. CURRENT REALITY

The implementation added four related validation surfaces.

1. Commit `32a180bba` added `scripts/validation/continuity-freshness.ts`, which compares `_memory.continuity.last_updated_at` against `graph-metadata.json.derived.last_save_at` and warns when continuity lags by more than 10 minutes.
2. Commit `7d85861a0` added `scripts/validation/evidence-marker-audit.ts`, a bracket-depth parser that distinguishes real malformed `[EVIDENCE:...]` markers from false positives such as parentheses inside evidence text.
3. Commit `e40dff0bb` added `scripts/validation/evidence-marker-lint.ts` and wired it into `validate.sh --strict`, so malformed evidence markers now fail strict validation instead of relying on an ad hoc audit sweep.
4. Commit `ded5ece07` added `scripts/rules/check-normalizer-lint.sh`, which prevents new local `normalizeScope*` and `getOptionalString` duplicates from being introduced outside `scope-governance.ts`.

The validator therefore gained both freshness enforcement and structural linting. `validate.sh --strict` now layers in the continuity-freshness check, the evidence-marker lint, and the normalizer lint alongside the older rule inventory, while the standalone audit script remains the repair-oriented sweep for legacy malformed evidence blocks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/spec/validate.sh` | Orchestrator | Strict validator entry point that runs the new add-ons |
| `scripts/validation/continuity-freshness.ts` | Script | Detects stale `_memory.continuity.last_updated_at` values relative to packet metadata |
| `scripts/validation/evidence-marker-audit.ts` | Script | Bracket-depth audit and repair surface for malformed evidence markers |
| `scripts/validation/evidence-marker-lint.ts` | Script | Strict lint wrapper over the evidence-marker audit parser |
| `scripts/rules/check-normalizer-lint.sh` | Validation rule | Blocks new duplicate local scope-normalizer helpers |

### Validation And Tests

| File | Focus |
|------|-------|
| `scripts/tests/continuity-freshness.vitest.ts` | Continuity freshness warning behavior |
| `scripts/tests/evidence-marker-audit.vitest.ts` | Bracket-depth audit behavior |
| `scripts/tests/evidence-marker-lint.vitest.ts` | Strict lint exit-code behavior |
| `scripts/tests/normalizer-lint.vitest.ts` | Duplicate-normalizer rule coverage |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/35-strict-validation-addons-continuity-freshness-and-evidence-markers.md`
