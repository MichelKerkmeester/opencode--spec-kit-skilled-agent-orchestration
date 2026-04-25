---
title: "Plan: Review Remediation (010/007)"
description: "6-theme remediation plan with explicit ordering and parallelism map."
importance_tier: "important"
contextType: "implementation"
---
# Plan: Review Remediation (010/007)

<!-- SPECKIT_LEVEL: 2 -->

## 1. STRATEGY

Group the 21 P1 + 12 actionable P2 findings into 6 themed task batches. Sequence by dependency: T-A (MCP wiring decision) gates T-B (evidence sync). T-C/D/E/F are independent and parallelizable.

## 2. THEMED TASK BATCHES

### T-A — `detect_changes` MCP wiring decision (P1, blocks T-B for sub-phases 002+006)
- **Decision required first:** wire OR mark-internal-only.
- If wire: add tool name, schema, validator, dispatcher case in `code_graph/tools/code-graph-tools.ts` + `tool-schemas.ts` + `schemas/tool-input-schemas.ts`.
- If internal-only: rewrite all 6 umbrella docs + the install-guide smoke test.
- Effort: M (3-5h)
- Findings closed: R-007-2, R-007-14

### T-B — Verification evidence sync (P1, follows T-A)
- For each of 001-006, run real validate.sh + vitest + tsc; capture exit codes and last 20 lines of output.
- Update `implementation-summary.md` "Verification Evidence" tables with real results.
- Update `checklist.md` to mark items `[x]` only when evidence is real, `[ ]` with OPERATOR-PENDING marker otherwise.
- Effort: M (2-3h)
- Findings closed: R-007-1, R-007-5, R-007-7, R-007-15, R-007-19, R-007-20, R-007-21

### T-C — Public API surface gaps (P1, parallel with T-D/E/F)
- `minConfidence` → MCP tool schema + Zod + allowed-param ledger + tests.
- `affordances` → either expose via advisor-recommend input schema OR document as compile-time-only.
- Effort: M (2-3h)
- Findings closed: R-007-6, R-007-10

### T-D — Sanitization hardening (P1+P2, parallel)
- Affordance-normalizer prompt-injection denylist (broaden TS + PY); shared adversarial fixture.
- Edge metadata `reason`/`step` allowlist on read path.
- Memory trust-badge age-label sanitization.
- Diff-parser path canonicalization.
- Phase-runner duplicate output-key rejection.
- Effort: L (4-6h)
- Findings closed: R-007-3, R-007-4, R-007-8, R-007-9, R-007-11, R-007-P2-1, R-007-P2-3, R-007-P2-8, R-007-P2-10, R-007-P2-11

### T-E — Test rig fixes (P1, parallel)
- Trust-badges test mock-resolution: rewrite to inject DB via dependency override OR move to integration-test against real-DB fixture.
- Unskip trust-badges describe block; verify all 3 cases pass.
- Effort: M (2-3h)
- Findings closed: R-007-13

### T-F — Doc + label cleanup (P1+P2, parallel)
- INSTALL_GUIDE smoke-test cwd bug (Python path).
- Conflicting MCP tool counts across umbrella docs (pick canonical source).
- `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` broken link (create or remove).
- Phase-naming alias note (012 → 010).
- Memory_search cache invalidation on causal-edge mutations.
- `computeBlastRadius` `limit + 1` off-by-one.
- Multi-subject blast-radius seed preservation.
- Failure-fallback `code` + log/metric.
- Shared relationship-edge mapper (dedupe 4 switch branches).
- Effort: L (4-6h)
- Findings closed: R-007-12, R-007-16, R-007-17, R-007-18, R-007-P2-2, R-007-P2-4, R-007-P2-5, R-007-P2-6, R-007-P2-7, R-007-P2-12

## 3. SEQUENCING

```
        ┌───────────┐
        │ T-A       │  decide MCP wiring
        │ (3-5h)    │
        └─────┬─────┘
              │
              ▼
        ┌───────────┐    ┌───────────┐  ┌───────────┐  ┌───────────┐
        │ T-B       │    │ T-C       │  │ T-D       │  │ T-E       │
        │ evidence  │    │ API gaps  │  │ sanitize  │  │ test rig  │
        │ (2-3h)    │    │ (2-3h)    │  │ (4-6h)    │  │ (2-3h)    │
        └─────┬─────┘    └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
              └────────────────┴───────────────┴──────────────┘
                                       │
                                       ▼
                             ┌───────────┐
                             │ T-F       │  doc cleanup
                             │ (4-6h)    │
                             └───────────┘

Critical path: T-A → T-B → T-F = 9-14h
With parallelism (T-A → {T-B + T-C + T-D + T-E in parallel} → T-F): ~13-17h
Fully sequential: ~17-26h
```

## 4. EXIT CRITERIA

- All R-007-* tasks marked complete with evidence pointers
- Re-run /spec_kit:deep-review:auto (3 iterations is enough for a remediation verify pass): P0=0, P1≤2, P2 documented
- Phase 010 closeout summary updated to reflect post-remediation state
- Push all changes to main with conventional-commit messages

## 5. REFERENCES

- spec.md (this folder)
- 010/review/phase-review-summary.md
- 010/{001..006}/review/review-report.md
