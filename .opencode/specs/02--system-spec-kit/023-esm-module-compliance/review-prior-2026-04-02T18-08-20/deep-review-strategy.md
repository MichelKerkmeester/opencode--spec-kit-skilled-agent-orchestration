# Deep Review Strategy — ESM Module Compliance (spec-023)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Persistent strategy file for the 10-iteration deep review of the completed 5-phase ESM migration across `@spec-kit/shared`, `@spec-kit/mcp-server`, and `@spec-kit/scripts`. Tracks dimension coverage, findings, and review progression.

### Usage

- **Init:** Populated from config and memory context
- **Per iteration:** Agent reads Next Focus, reviews assigned dimension/files, updates findings, marks dimensions complete
- **Mutability:** Mutable — updated by orchestrator and agents

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Review the completed 5-phase ESM module compliance migration (spec-023):
- **Phase 1**: `@spec-kit/shared` migrated to native ESM (20 files, 48 import rewrites)
- **Phase 2**: `@spec-kit/mcp-server` migrated to native ESM (181 files, 839 import rewrites)
- **Phase 3**: `scripts` interop via Node 25 `require(esm)`, memory-save hardening
- **Phase 4**: 30-iteration deep review follow-through, standards alignment, schema cleanup
- **Phase 5**: Final test sweep — 9480/9480 passing, 0 failures, 0 skipped

Total: 230 files changed, 3750 insertions, 1638 deletions across 18 commits on branch `system-speckit/023-esm-module-compliance`.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (complete)
- [x] D1 Correctness — Logic errors, ESM import resolution correctness, runtime module behavior, edge cases
- [x] D2 Security — Module boundary safety, no exposed internals, safe dynamic imports, no path traversal
- [x] D3 Traceability — Spec/code alignment, checklist evidence verification, cross-reference integrity
- [x] D4 Maintainability — Patterns, clarity, documentation quality, safe follow-on change cost
- [x] D5 Performance — Dynamic import overhead, lazy loading efficiency, startup time impact
- [x] D6 Reliability — Error handling in async imports, fallback paths, graceful degradation
- [x] D7 Completeness — Coverage gaps, unchecked checklist items, missing test coverage

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Converting `@spec-kit/scripts` to ESM (explicitly out of scope)
- Reviewing dual-build/conditional-exports (rejected strategy)
- Standards docs outside spec-023 (deferred)
- Reviewing the 20-iteration research methodology itself

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 7 dimensions reviewed at least once
- Convergence threshold (0.10) reached on newFindingsRatio rolling average
- Max 10 iterations reached
- All quality gates pass (evidence, scope, coverage)

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | findings | 1 | Found side-effectful package-root startup in `@spec-kit/mcp-server`, Node-engine contract drift across the CJS/ESM boundary, and a minor `@spec-kit/shared` root-export mismatch. |
| D2 Security | findings | 2 | Found spoofable shared-memory admin authorization, a fail-open V-rule validation bridge, and `cwd`-steerable path resolution for database discovery. |
| D3 Traceability | findings | 3 | Found packet-wide state drift: CHK-010 falsely claims sync, plan/tasks/checklist still show runtime work open, and `spec.md` carries a stale phase-map addendum that contradicts the shipped-complete implementation summary. |
| D4 Maintainability | findings | 4 | Found fragmented dynamic-import degradation contracts in `scripts/core/workflow.ts`, plus an over-broad `@spec-kit/mcp-server/api` barrel that obscures which ESM exports are truly stable. |
| D5 Performance | advisories | 5 | Found advisory-only overhead in `vector-index-store.ts` hot-path `import()` boundaries and in the CLI's front-loaded native/database import graph, but no blocker-level startup regression tied directly to top-level-await removal. |
| D6 Reliability | findings | 6 | Found a response/reporting reliability gap in `memory_save`: post-commit file-persistence failures are flattened into generic anchor-warning copy, obscuring partial-failure recovery needs even though the underlying rollback/recovery mechanics are otherwise intact. |
| D7 Completeness | findings | 7 | Found that the parent packet still over-claims closure relative to the Phase 4 child packet, and that the reviewed ESM-focused tests still do not fully prove `CHK-005` and `CHK-006`. |

---

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- **P0 (Critical):** 0 active
- **P1 (Major):** 14 active
- **P2 (Minor):** 4 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
- **Provisional verdict:** `CONDITIONAL`
- **Severity adjudication:** No active P1 finding gained enough release-critical proof for P0, and no active P1 lost enough evidence to be downgraded to P2.
- **State continuity note:** Iterations 7-9 were recovered from markdown iteration files during the final synthesis because the append-only JSONL stopped at iteration 6.

---

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Reviewing package metadata together with runtime entrypoints exposed the highest-risk ESM contract problems quickly.
- The focused file set was sufficient to validate that `memory-save.ts` and the core server imports are otherwise largely extension-clean.
- The D2 focus list was broad enough to connect shared-memory auth, validation-bridge behavior, and shared path discovery into one boundary-safety pass.
- Reading the packet docs side by side with the shipped-complete implementation summary surfaced traceability drift quickly without needing a broader code sweep.
- The reviewed `shared/` and `mcp_server/` ESM files consistently use `.js` relative import suffixes, so extension hygiene is no longer the main maintainability risk.
- `import.meta.dirname` is being applied consistently in the reviewed path-sensitive helpers, which keeps the post-ESM path-resolution story understandable.
- The `mcp_server/handlers/save/` barrel is comparatively clean: it re-exports focused submodules and the directory keeps its internal relative imports extension-correct.
- The workflow's retry-manager import is memoized, so the most obvious D5 risk in `scripts/core/workflow.ts` turned out to be smaller than the raw count of `import()` call sites initially suggested.
- The reviewed `context-server.ts` startup cost is dominated by explicit integrity and subsystem initialization work inside `main()`, not by a new eager-load side effect from top-level-await removal alone.
- The reviewed rollback/recovery primitives in `memory-save.ts` and `transaction-manager.ts` remain availability-oriented: failed indexing restores or preserves pending/original file state, and rename-after-commit failures still have a startup recovery path.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- The workspace-level Node engine contract was not updated in lockstep with the ESM migration, so the documented support floor no longer matches the runtime boundary.
- The package root entrypoints still blur executable and library surfaces, which hides correctness issues until a consumer uses the bare package specifier.
- Shared-memory admin tooling still relies on caller-declared actor identities, so the governance model is not yet backed by a trusted runtime principal.
- The validator bridge and shared path helper both still prefer availability/flexibility over failing closed, which leaves boundary-sensitive behavior dependent on deployment discipline.
- The packet's live status surfaces diverged: `implementation-summary.md` now reports shipped completion while `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` still present the migration as pending, and `spec.md` retains a stale phase-parent template block.
- `scripts/core/workflow.ts` now carries three separate dynamic-import patterns for the same `@spec-kit/mcp-server/api` surface, each with a different fallback contract; maintainers have to rediscover which failures are expected versus actionable.
- `@spec-kit/mcp-server/api` has grown into a catch-all barrel that re-exports deep `lib/` internals alongside intended script-facing helpers, so a small ESM surface change can require auditing a much larger implied public API.
- `vector-index-store.ts` still crosses an async `import()` boundary on hot search/read methods even though the store already paid its heavy native/provider startup cost at module load.
- `mcp_server/cli.ts` still front-loads the database/native import graph before it even resolves the subcommand, so lightweight invocations pay more startup cost than necessary.
- `memory_save` still flattens warning semantics in the success response path, so a post-commit file-persistence failure is reported with generic "anchor issues" copy instead of an explicit partial-failure recovery message.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
Final synthesis complete. Recommended remediation order:
- Fix the active security/runtime P1s first: bind shared-memory admin identity to a trusted principal, scope duplicate preflight queries, make the V-rule bridge fail closed or block startup, and repair the ESM-incompatible `mcp_server/scripts` wrappers.
- Truth-sync the packet next: remove stale phase-parent addenda, align parent and child packet completion claims, and update checklist/task/plan surfaces to match the real shipped state.
- Close the remaining verification gaps last: add reviewed proof for `CHK-005` and `CHK-006`, then rerun a targeted D3/D7 closure pass after remediation.

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- Prior Phase 4 deep review (20 iterations) resolved 4 P1 + 8 P2 findings
- `superRefine` removed from shared-memory tool schemas for GPT function-calling compatibility
- V-rule bridge changed from silent skip to warn-on-bypass
- Memory save pipeline hardened with manual-fallback mode
- Node 25 native `require(esm)` used for scripts interop (no helper layer)
- Top-level await removed from 5 server modules to unblock `require(esm)`
- `import.meta.dirname` used instead of `fileURLToPath` wrappers
- All tests passing: 9480/9480 with 0 failures, 0 skipped

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | findings | 10 | Re-verified in the final pass: packet state drift still stands because parent and child packet artifacts do not tell one authoritative completion story |
| `checklist_evidence` | core | findings | 10 | Re-verified in the final pass: `CHK-010` remains false-positive, and `CHK-005` through `CHK-009` / `CHK-016` still lack fully aligned reviewed proof |
| `skill_agent` | overlay | notApplicable | — | No skill/agent boundary in this spec |
| `agent_cross_runtime` | overlay | notApplicable | — | No agent definitions in scope |
| `feature_catalog_code` | overlay | notApplicable | — | No feature catalog in scope |
| `playbook_capability` | overlay | notApplicable | — | No playbook in scope |

---

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW

Key files (high-priority subset from 230 total):

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| shared/package.json | D1 | 1 | 2 | reviewed |
| shared/tsconfig.json | D1 | 1 | 0 | reviewed |
| shared/index.ts | D1, D4, D5 | 5 | 1 | reviewed |
| shared/paths.ts | D1, D2, D4 | 4 | 2 | reviewed |
| mcp_server/package.json | D1 | 1 | 2 | reviewed |
| mcp_server/tsconfig.json | D1 | 1 | 0 | reviewed |
| mcp_server/context-server.ts | D1, D2, D5 | 5 | 1 | reviewed |
| mcp_server/core/config.ts | D4 | 4 | 0 | reviewed |
| mcp_server/cli.ts | D5 | 5 | 1 | reviewed |
| mcp_server/api/index.ts | D4 | 4 | 1 | reviewed |
| mcp_server/handlers/memory-save.ts | D1, D2 | 2 | 1 | reviewed |
| mcp_server/handlers/save/index.ts | D4 | 4 | 0 | reviewed |
| mcp_server/handlers/index.ts | D4 | 4 | 0 | reviewed |
| mcp_server/handlers/memory-index.ts | — | — | — | pending |
| mcp_server/handlers/shared-memory.ts | D2 | 2 | 1 | reviewed |
| mcp_server/lib/search/vector-index-store.ts | D5 | 5 | 1 | reviewed |
| mcp_server/lib/session/session-manager.ts | — | — | — | pending |
| scripts/core/workflow.ts | D1, D2, D4, D5 | 5 | 2 | reviewed |
| mcp_server/tool-schemas.ts | — | — | — | pending |
| mcp_server/startup-checks.ts | — | — | — | pending |
| mcp_server/handlers/v-rule-bridge.ts | D2 | 2 | 1 | reviewed |
| mcp_server/lib/governance/scope-governance.ts | D2 | 2 | 0 | reviewed |

---

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Agent model: GPT-5.4 via codex exec, reasoning: high
- Started: 2026-03-30T08:42:00.000Z
<!-- /ANCHOR:review-boundaries -->

---

<!-- ANCHOR:addendum-2026-04-02 -->
## 17. ADDENDUM — 2026-04-02 (Iterations 011-020)

A second deep-review batch of 10 iterations was completed and captured in `review/iterations/iteration-011.md` through `iteration-020.md`.

Batch result:
- Verdict: FAIL
- Active P0: 5
- Active P1: 29
- Active P2: 17
- Release readiness: blocked

Primary blockers in this batch:
- Completion-state contradictions across phase checklists/tasks/implementation summaries
- Failing verification suites (task-enrichment, extractor/loader, naming-migration, mcp-server and scripts test slices)
- Contract drift between runtime command surfaces and catalog/playbook/adapter docs

See `review/review-report.md` and `review/review-report-2026-04-02-extended.md` for consolidated findings.
<!-- /ANCHOR:addendum-2026-04-02 -->
