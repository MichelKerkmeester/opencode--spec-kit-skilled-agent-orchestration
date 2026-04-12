---
iteration: 38
dimension: maintainability
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T17:10:29Z
completedAt: 2026-04-12T17:14:39Z
---

# Deep Review Iteration 038 — maintainability (Round 3)

**Focus:** UPDATED WORKFLOW: Verify test quality improvements. Check coverage-graph-integration.vitest.ts uses real TS imports. Check session-isolation.vitest.ts has colliding-ID higher-level fixtures. Check that stale coverage-graph-db.vitest.ts and coverage-graph-tools.vitest.ts are archived. Check new contradictions test file exists.

---

● skill(sk-code-review)

I’m narrowing this to the test-quality surfaces the workflow update touched, then I’ll validate whether the new fixtures and archival structure actually improve maintainability or leave gaps.

● Read review_core.md
  │ .claude/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read test_quality_checklist.md
  │ .claude/skills/sk-code-review/references/test_quality_checklist.md
  └ L1:260 (146 lines read)

● List directory .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvemen…
  └ 20 files found

● Search (glob)
  │ "**/{coverage-graph-integration.vitest.ts,session-isolation.vitest.ts,coverage-graph-db.vitest.t
  │ s,coverage-graph-tools.vitest.ts,*contradictions*.vitest.ts}"
  └ 5 files found

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 38 maintainability …
  └ {"summary":"No matching trigger phrases found","data":{"count":0,"results":[]...

I found the exact test surfaces. Next I’m checking whether the surrounding spec and workflow references line up with the intended migration, or if the repo now has split conventions that will drift again.

● Read tasks.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md
  └ L1:260 (141 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:240 (129 lines read)

● Read coverage-graph-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
  └ L1:260 (260 lines read)

● Read session-isolation.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts
  └ L1:260 (260 lines read)

● Read coverage-graph-contradictions.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-contradictions.vitest.ts
  └ L1:260 (166 lines read)

● List directory .opencode/skill/system-spec-kit/mcp_server/tests/archive
  └ 2 files found

● Search (grep)
  │ "coverage-graph-integration|session-isolation|coverage-graph-db|coverage-graph-tools|contradicti
  │ ons" (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Search (grep)
  │ "coverage-graph-integration|session-isolation|coverage-graph-db|coverage-graph-tools|coverage-gr
  │ aph-contradictions" in **/*.{ts,yml,yaml,md,json}
  └ 5 lines found

The main question now is whether the repo consistently treats the old DB/tool tests as archived artifacts, or whether live references still point at them and quietly preserve the old split.

● Read coverage-graph-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts
  └ L261:520 (252 lines read)

● Read session-isolation.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts
  └ L261:520 (212 lines read)

● Read coverage-graph-db.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts
  └ L1:120 (120 lines read)

● Read coverage-graph-tools.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts
  └ L1:160 (160 lines read)

● Search (grep)
  │ "coverage-graph-db\.vitest|coverage-graph-tools\.vitest|coverage-graph-integration\.vitest|sessi
  │ on-isolation\.vitest|coverage-graph-contradictions\.vitest" (.github)
  └ No matches found

● Search (grep)
  │ "coverage-graph-db\.vitest|coverage-graph-tools\.vitest|coverage-graph-integration\.vitest|sessi
  │ on-isolation\.vitest|coverage-graph-contradictions\.vitest" in
  │ **/*.{ts,js,cjs,mjs,md,json,yml,yaml} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve confirmed the files moved where expected. The remaining maintainability risk is whether the test runner still treats those archived stubs as part of the active suite, because that would preserve dead coverage under a new filename.

● Read coverage-graph-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
  └ L1:260 (260 lines read)

● Search (glob)
  │ "**/vitest.config.{ts,js,mjs,cjs}" in .opencode/skill/system-spec-kit
  └ 2 files found

● Search (grep)
  │ "archive|include|exclude|coverage-graph" in **/vitest.config.{ts,js,mjs,cjs}
  │ (.opencode/skill/system-spec-kit)
  └ 4 lines found

● Read query.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
  └ L1:260 (175 lines read)

● Read status.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
  └ L1:220 (101 lines read)

● Read convergence.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
  └ L1:260 (260 lines read)

● Read vitest.config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
  └ L1:120 (39 lines read)

● Read vitest.config.ts
  │ .opencode/skill/system-spec-kit/vitest.config.ts
  └ L1:120 (11 lines read)

● Search (glob)
  │ "**/archive/**/coverage-graph*.vitest.ts" in .opencode/skill/system-spec-kit
  └ 2 files found

● Search (glob)
  │ "**/coverage-graph*.vitest.ts" in .opencode/skill/system-spec-kit/scripts/tests
  └ 7 files found

● Search (grep)
  │ "coverage-graph-contradictions|shared-ID collisions|real TS imports|archive"
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 5 lines found

I’ve got enough code context to compare intent versus implementation now. I’m pulling the packet’s own remediation notes so I can tell whether any remaining issue is a real maintainability gap versus an intentional archival choice.

● Read coverage-graph-cross-layer.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "coverage-graph-integration|session-isolation|coverage-graph-db|coverage-graph-tools|coverage-gr
  │ aph-contradictions" in **/*.md (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research
  │ -review-improvement-2/006-graph-testing-and-playbook-alignment)
  └ 9 lines found

● Search (grep)
  │ "coverage-graph-integration|session-isolation|coverage-graph-db|coverage-graph-tools|coverage-gr
  │ aph-contradictions|collid" in **/*.md (.opencode/specs/skilled-agent-orchestration/042-sk-deep-r
  │ esearch-review-improvement-2/008-further-deep-loop-improvements)
  └ 8 lines found

● Search (grep)
  │ "coverage-graph-integration|session-isolation|coverage-graph-db|coverage-graph-tools|coverage-gr
  │ aph-contradictions|collid" in **/*.md (.opencode/specs/skilled-agent-orchestration/042-sk-deep-r
  │ esearch-review-improvement-2/review/archive-rvw-2026-04-11)
  └ 22 lines found

I found one likely drift vector: the old tests are archived under `mcp_server/tests/archive`, but the workspace-root Vitest config still globs all `mcp_server/tests/**/*.vitest.ts`. I’m verifying whether any real test command still uses that broader config.

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ L1:220 (51 lines read)

● Search (grep)
  │ "vitest|test|archive" (.opencode/skill/system-spec-kit/package.json)
  └ 6 lines found

● Search (grep)
  │ "coverage-graph cross-layer integration|coverage-graph-integration|cross-layer" in
  │ **/coverage-graph*.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Search (grep)
  │ "createRequire|fileURLToPath|WORKSPACE_ROOT|coverage-graph-core\.cjs" in
  │ **/coverage-graph*.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 61 lines found

● Read coverage-graph-cross-layer.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts
  └ L220:420 (201 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ L1:200 (67 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ L1:200 (34 lines read)

● Search (grep)
  │ "npx vitest|vitest run|vitest.config.ts|archive" in **/*.{md,json,yml,yaml,ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 7 lines found

I’ve narrowed the likely findings to configuration drift rather than missing files. I’m doing one quick command-level check to see whether the root test config still enumerates the archived suites, because that decides whether this is just cosmetic or an actual maintenance trap.

● Check whether archive tests are listed by vitest configs (shell)
  │ cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec
  │ -kit && npx vitest list --config vitest.config.ts 2>/dev/null | grep
  │ 'mcp_server/tests/archive/coverage-graph-\(db\|tools\)\.vitest\.ts' || true && printf '\n---\n'
  │ && npx vitest list --config mcp_server/vitest.config.ts 2>/dev/null | grep
  │ 'mcp_server/tests/archive/coverage-graph-\(db\|tools\)\.vitest\.ts' || true
  └ 2 lines...

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/spec.md
  └ L240:290 (24 lines read)

● Search (grep)
  │ "coverage-graph-integration\.vitest\.ts|coverage-graph-cross-layer\.vitest\.ts" in
  │ **/coverage-graph*.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ No matches found

● Search (grep)
  │ "vitest\.config\.ts" in **/*.{md,json,ts,js,yml,yaml} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "REQ-GT-001|REQ-GT-002|REQ-GT-003|REQ-GT-004|REQ-GT-005|REQ-GT-006"
  │ (.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts)
  └ 13 lines found

● Search (grep)
  │ "keeps research relation names aligned|keeps clamping bounds consistent|rejects
  │ self-loops|findContradictions|computeResearchSignals"
  │ (.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts)
  └ 13 lines found

● Search (grep)
  │ "coverage-graph-cross-layer" in **/*.{md,ts,js,json,yml,yaml}
  └ 6 lines found

I found **2 P2 maintainability findings** in the requested workflow-update surfaces. I did **not** find a new P0/P1 issue in the specific areas you asked me to validate.

### F-038-001
- **Severity:** P2
- **Dimension:** maintainability
- **File:** `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`
- **Line:** `134-476`
- **Title:** Cross-layer contract coverage now lives in two overlapping suites
- **Description:** The new `coverage-graph-integration.vitest.ts` is valid and does use real TypeScript imports, but it now overlaps heavily with the existing `coverage-graph-cross-layer.vitest.ts`. That leaves two active suites asserting the same CJS↔TS contract invariants, which increases drift risk whenever relation sets, weight semantics, or namespace rules change.
- **Evidence:** `coverage-graph-integration.vitest.ts` covers relation alignment, clamping, self-loop rejection, namespace isolation, convergence, and contradiction contracts at `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:136-203`, `208-305`, `316-367`, `372-476`. The older suite already covers the same core cross-layer contract space at `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:147-180`, `216-235`, `238-350`. Both files also repeat the same workspace-root + `createRequire` bootstrap pattern at `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:34-80` and `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts:34-85`.
- **Recommendation:** Pick one canonical cross-layer contract suite and narrow the other to only unique scenarios, or retire it entirely. At minimum, document which file is authoritative for contract parity so future graph-contract changes do not require parallel edits.

### F-038-002
- **Severity:** P2
- **Dimension:** maintainability
- **File:** `.opencode/skill/system-spec-kit/vitest.config.ts`
- **Line:** `5-8`
- **Title:** Archived coverage-graph stubs are excluded inconsistently across Vitest entrypoints
- **Description:** The stale `coverage-graph-db` and `coverage-graph-tools` suites were moved into `mcp_server/tests/archive`, but archival is only enforced in the MCP-server config. The workspace-root Vitest config still includes all `mcp_server/tests/**/*.vitest.ts` files without excluding `archive/**`, so “archived” depends on which config a maintainer happens to run.
- **Evidence:** The files are archived at `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts`, and they still read like executable test suites rather than tombstones (`.../coverage-graph-db.vitest.ts:1-17`, `.../coverage-graph-tools.vitest.ts:1-17`). `mcp_server/vitest.config.ts` explicitly excludes `mcp_server/tests/archive/**` at `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:17-24`, but the root config includes `mcp_server/tests/**/*.vitest.ts` with no matching exclusion at `.opencode/skill/system-spec-kit/vitest.config.ts:5-8`.
- **Recommendation:** Make archive exclusion single-sourced across all supported Vitest entrypoints, or remove the root config if it is no longer a supported runner. That keeps archived suites truly archived instead of “archived unless you use the other config.”

## ITERATION SUMMARY
The requested workflow fixes are mostly in place:  
`coverage-graph-integration.vitest.ts` **does** use real TS imports from `coverage-graph-db.js` (`.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:21-33`), `session-isolation.vitest.ts` **does** include colliding-ID higher-level fixtures that reach query/status/convergence handlers (`.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:371-471`), the stale DB/tool suites **are** archived, and the new contradictions suite **exists** at `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-contradictions.vitest.ts:74-166`. The remaining issues are both **P2 maintainability drift** items around test-suite ownership and archive hygiene.

## COVERAGE ASSESSMENT
- **Reviewed directly:**  
  - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts`  
  - `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`  
  - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-contradictions.vitest.ts`  
  - `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts`  
  - `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts`  
  - `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts`  
  - `.opencode/skill/system-spec-kit/{vitest.config.ts,mcp_server/vitest.config.ts}`  
  - related packet docs under `042.../006-graph-testing-and-playbook-alignment`, `008-further-deep-loop-improvements`, and `review/archive-rvw-2026-04-11`
- **Focus-area verdict:** requested fixes are present, but the suite layout still has duplication/config-drift debt.

## CONFIDENCE
**High (0.90).** I reviewed the exact target files, the packet’s own remediation references, and the active Vitest configs that determine whether the archival/test-quality changes hold up in practice.

## NEXT PRIORITIES
1. Consolidate `coverage-graph-integration` vs `coverage-graph-cross-layer` into one canonical contract suite.
2. Align archive exclusion across all Vitest configs so `mcp_server/tests/archive/**` is never treated as active coverage by mistake.


Changes   +0 -0
Requests  1 Premium (4m 8s)
Tokens    ↑ 1.1m • ↓ 12.8k • 1.0m (cached) • 7.4k (reasoning)
