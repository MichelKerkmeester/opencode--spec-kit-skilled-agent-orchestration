---
title: "Phase 026 — Checklist"
description: "Acceptance verification for R03 post-remediation remediation."
importance_tier: "normal"
contextType: "implementation"
---

# Phase 026 Checklist

## P0
None.

## P1 (8 must close)

- [ ] **T01 / P1-007-01 / D7** Hook reference Copilot+Codex snippets byte-match or link to actual shipped files
- [ ] **T02 / P1-014-01 / D7** Operator docs have no hardcoded stale inventory/status values (or explicit snapshot annotation)
- [ ] **T03 / P1-017-01 / D3** `LIVE_SESSION_WRAPPER_SETUP.md` documents `finalizePrompt()` in operator flow
- [ ] **T04 / P1-018-01 / D4** Advisor producer fail-open paths preserve root-cause in diagnostics
- [ ] **T05 / P1-019-01 / D5** Plugin cache key includes workspace root
- [ ] **T06 / P1-020-01 / D6** Test verifies plugin cross-workspace cache isolation
- [ ] **T07 / P1-021-01 / D7** Playbook accurately describes its own structure
- [ ] **T08 / P1-028-01 / D7** Playbook measurement + analyzer commands runnable from documented cwd

## P2 (4 should close)

- [ ] **T09 / P2-007-01 / D7** LT-001 has repo-relative link to wrapper setup guide
- [ ] **T10 / P2-013-01 / D6** Default telemetry fallback tested
- [ ] **T11 / P2-013-02 / D6** Subprocess spawn-error classification tested
- [ ] **T12 / P2-029-01 / D1** `provenance.sourceRefs` pass through same sanitizer as `skillLabel`

## Integration

- [ ] TS build passes
- [ ] Phase 025 baseline tests still pass (8 files / 65 tests)
- [ ] New tests from T06/T10/T11 pass
- [ ] No regressions in runtime hook adapters
