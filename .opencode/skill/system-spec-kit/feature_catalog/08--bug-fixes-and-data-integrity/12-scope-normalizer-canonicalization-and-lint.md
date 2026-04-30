---
title: "Scope normalizer canonicalization and lint"
description: "The implementation collapsed four duplicate string-scope normalizers into one canonical helper and added a strict validator rule that blocks new duplicates."
---

# Scope normalizer canonicalization and lint

## 1. OVERVIEW

The implementation collapsed four duplicate string-scope normalizers into one canonical helper and added a strict validator rule that blocks new duplicates.

This is a data-integrity fix because scope normalization affects governed save, reconsolidation, lineage, and preflight filtering. The implementation change removed drift-prone copies and then added a validator guard so the duplication does not reappear in a later packet.

---

## 2. CURRENT REALITY

Commit `b923623cc` introduced the canonical `normalizeScopeValue(value: unknown): string | null` export in `mcp_server/lib/governance/scope-governance.ts`. Four call sites that previously carried their own slightly different helpers now import the same function:

- `mcp_server/handlers/save/reconsolidation-bridge.ts`
- `mcp_server/lib/storage/lineage-state.ts`
- `mcp_server/handlers/save/types.ts`
- `mcp_server/lib/validation/preflight.ts`

The canonical helper preserves the return shape that these consumers already expected: valid strings are trimmed and returned, while empty, whitespace-only, or non-string inputs collapse to `null`.

Commit `ded5ece07` added `scripts/rules/check-normalizer-lint.sh` and its test coverage. `validate.sh --strict` now fails if new local helpers such as `normalizeScope*` or `getOptionalString` are declared outside the canonical governance module. The current implementation therefore fixed the live drift and added a forward guardrail against recurrence.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/governance/scope-governance.ts` | Lib | Canonical `normalizeScopeValue()` implementation |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Reconsolidation caller updated to use the canonical helper |
| `mcp_server/lib/storage/lineage-state.ts` | Lib | Lineage-state scope normalization routed through the canonical helper |
| `mcp_server/handlers/save/types.ts` | Handler | Save-type normalization routed through the canonical helper |
| `mcp_server/lib/validation/preflight.ts` | Lib | Preflight scope normalization routed through the canonical helper |
| `scripts/rules/check-normalizer-lint.sh` | Validation rule | Strict validator rule that blocks new duplicate normalizers |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/scope-governance-normalizer-parity.vitest.ts` | Canonical helper parity and null-semantics coverage |
| `scripts/tests/normalizer-lint.vitest.ts` | Strict validator coverage for new duplicate-normalizer declarations |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--bug-fixes-and-data-integrity/12-scope-normalizer-canonicalization-and-lint.md`
