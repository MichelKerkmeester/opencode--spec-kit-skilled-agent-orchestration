---
title: Rollback Runbook
description: Rollback flow for working-memory automation features and feature-flag re-enable sequencing
---

# Rollback Runbook: Working Memory Automation

Rollback procedure for safely disabling and re-enabling working-memory automation features when rollout quality gates regress.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This runbook defines the rollback and staged recovery flow for working-memory automation features (session boost, pressure policy, extraction, causal boost, auto-resume).

Use this runbook when rollout quality gates regress and feature flags must be disabled and re-enabled in a controlled sequence.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:scope -->
## 2. SCOPE

This runbook defines the rollback flow for the working-memory automation features (session boost, pressure policy, extraction, causal boost, auto-resume).

Rollback is required when one or more of the following occurs:
- Rank stability regresses (`top-5 MRR < 0.95x` baseline)
- Pressure policy causes context quality degradation
- Extraction quality drops below precision/recall gates

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:flags -->
## 3. DISABLE FLAGS

Disable all rollout-sensitive automation flags:

```bash
SPECKIT_SESSION_BOOST=false
SPECKIT_PRESSURE_POLICY=false
SPECKIT_EXTRACTION=false
SPECKIT_CAUSAL_BOOST=false
SPECKIT_AUTO_RESUME=false
```

---

<!-- /ANCHOR:flags -->
<!-- ANCHOR:smoke-tests -->
## 4. SMOKE TESTS

Run focused verification immediately after restart:

```bash
npm run test --workspace=mcp_server -- tests/handler-memory-context.vitest.ts tests/phase2-integration.vitest.ts tests/session-boost.vitest.ts tests/causal-boost.vitest.ts
```

Expected outcomes:
- all selected tests pass
- no extraction callback failures in logs
- no pressure override warnings when `tokenUsage` is absent

---

<!-- /ANCHOR:smoke-tests -->
<!-- ANCHOR:verification -->
## 5. BASELINE VERIFICATION

Confirm baseline behavior before closing rollback:
- `memory_search` response metadata shows no applied session/causal boosts
- `memory_context` response metadata shows no pressure-mode override
- `working_memory` receives no new extraction inserts from post-tool callbacks

---

<!-- /ANCHOR:verification -->
<!-- ANCHOR:re-enable -->
## 6. CONTROLLED RE-ENABLE

Re-enable features one flag at a time in this order:
1. `SPECKIT_SESSION_BOOST`
2. `SPECKIT_PRESSURE_POLICY`
3. `SPECKIT_EXTRACTION`
4. `SPECKIT_CAUSAL_BOOST`
5. `SPECKIT_AUTO_RESUME`

After each flag:
- rerun the smoke test command
- compare extraction precision/recall and top-5 MRR against baseline artifacts

Stop re-enable if any gate fails.
<!-- /ANCHOR:re-enable -->
