---
title: "Migration Plan: 037/005 Stress Test Folder Migration"
description: "Stress-test candidate classification and move plan for the MCP server dedicated stress_test folder."
trigger_phrases:
  - "037-005-stress-test-folder-migration"
  - "stress test folder"
  - "dedicated stress folder"
  - "mcp_server/stress_test"
importance_tier: "normal"
contextType: "general"
---
# Migration Plan: 037/005 Stress Test Folder Migration

<!-- ANCHOR:summary -->
## Summary

This packet moves confirmed MCP server stress-test suites from `mcp_server/tests/` into `mcp_server/stress_test/`. The classification threshold is intentionally narrow: move tests that are explicitly stress/load/capacity/matrix-cell/degraded-state sweeps, and leave fixture-only or ordinary regression coverage in `tests/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:classification -->
## Candidate Classification

| Candidate | Classification | Action | Evidence |
|-----------|----------------|--------|----------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/session-manager-stress.vitest.ts` | DEFINITELY_STRESS_TEST | Move to `mcp_server/stress_test/session/session-manager-stress.vitest.ts` | Filename and suite title say stress; first test performs interleaved writes above working-memory max capacity. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | DEFINITELY_STRESS_TEST | Move to `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | File header says "Code Graph Degraded Stress Cell"; packet 013 docs define it as an integration sweep created from a stress-run gap. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-stale.vitest.ts` | AMBIGUOUS | Leave in `stress_test/search-quality/` | Suite says stress cell, but file is fixture-only and delegates to `runMeasurement`; real degraded behavior is covered elsewhere. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-empty.vitest.ts` | AMBIGUOUS | Leave in `stress_test/search-quality/` | Fixture-only supplement, not load/performance/matrix runner logic. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts` | AMBIGUOUS | Leave in `stress_test/search-quality/` | Fixture-only supplement, not load/performance/matrix runner logic. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w7-degraded-unavailable.vitest.ts` | AMBIGUOUS | Leave in `stress_test/search-quality/` | Fixture-only supplement, not load/performance/matrix runner logic. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | NOT_STRESS_TEST | Leave in `tests/` | Only a comment reproduces a prior stress-test failure cell; the suite validates executor config behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts` | NOT_STRESS_TEST | Leave in `tests/` | "stress-test the floor" is descriptive prose for a scoring edge case, not stress harness ownership. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | NOT_STRESS_TEST | Leave in `tests/` | "Anchor Stress Test" is fixture content inside a save-pipeline regression. |
<!-- /ANCHOR:classification -->

---

<!-- ANCHOR:move-plan -->
## Move Plan

| From | To | Import Changes |
|------|----|----------------|
| `mcp_server/stress_test/session/session-manager-stress.vitest.ts` | `mcp_server/stress_test/session/session-manager-stress.vitest.ts` | No import change needed; both folders are siblings of `lib/`. |
| `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | No import change needed; both folders are siblings of `code_graph/` and `database/`. |
<!-- /ANCHOR:move-plan -->

---

<!-- ANCHOR:config-plan -->
## Config Plan

- `vitest.config.ts`: exclude `mcp_server/stress_test/**` from default runs.
- `vitest.stress.config.ts`: include `mcp_server/stress_test/**/*.{vitest,test}.ts` for explicit stress runs.
- `package.json`: add `npm run stress`.
- `tsconfig.json`: exclude `stress_test/**/*.vitest.ts` and `stress_test/**/*.test.ts` from production build.
- README docs: document the dedicated folder and the default-suite boundary.
<!-- /ANCHOR:config-plan -->

---

<!-- ANCHOR:reference-plan -->
## Reference Plan

Direct references to the moved `code-graph-degraded-sweep.vitest.ts` path in 011 stress-remediation docs are updated from `mcp_server/tests/` to `mcp_server/stress_test/`. No direct in-scope references to `session-manager-stress.vitest.ts` were found outside historical archive material.
<!-- /ANCHOR:reference-plan -->
