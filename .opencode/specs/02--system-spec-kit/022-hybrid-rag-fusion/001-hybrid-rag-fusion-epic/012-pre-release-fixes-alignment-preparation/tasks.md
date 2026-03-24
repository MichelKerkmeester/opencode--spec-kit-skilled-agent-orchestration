# Tasks: Pre-Release Fixes & Alignment

---

## Phase 1: Investigation (complete)

- [x] Agent 1: Memory MCP Server Health audit → 1 P0, 2 P1, 6 P2
- [x] Agent 2: generate-context.js & Scripts audit → 5 P1, 1 P2
- [x] Agent 3: Feature Catalog vs Code Audit gap analysis → 4 P2
- [x] Agent 4: Playbook vs Catalog alignment check → 2 P2
- [x] Agent 5: Pipeline Architecture audit → 2 P1, 3 P2
- [x] Agent 6: Session Capturing (009) completeness → 1 P0, 2 P1
- [x] Agent 7: Validator & Template compliance → 1 P0, 3 P1, 2 P2
- [x] Agent 8: Recent Commits regression check → 1 P1, 2 P2
- [x] Agent 9: sk-code--opencode compliance → 3 P2
- [x] Agent 10: Architecture Doc vs Implementation → 4 P1, 3 P2
- [x] Compile findings into research.md (49 total: 4 P0, 19 P1, 26 P2)
- [x] Cross-reference findings and map cascade dependencies

---

## Phase 2: P0 Blocker Fixes (immediate)

- [ ] **T01** Fix `package.json` exports to resolve `api/index.ts` correctly
  - File: `mcp_server/package.json:6`
  - Fixes: P0-3, P0-4
  - Fix: Add explicit `"./api": "./dist/api/index.js"` entry BEFORE the wildcard `./*` rule
  - Phase 2 finding: Wildcard `./* → ./dist/*.js` is structurally wrong for all 8 directory barrels (api, core, formatters, handlers, hooks, tools, utils, handlers/save) but only `api` is a public import path — others prohibited by import-policy-rules.vitest.ts
  - Leaf imports (api/indexing, api/search, api/providers) work correctly under wildcard
  - Verify: `node -e "require('@spec-kit/mcp-server/api')"` succeeds
  - Verify: 5 failing workflow-e2e tests now pass (39/39)

- [ ] **T02** Add network-error handling to API key validation
  - Files: `shared/embeddings/factory.ts:428-459`, `mcp_server/context-server.ts:738-775`
  - Fixes: P0-1, P1-2
  - Phase 2 finding: factory.ts returns `{valid: false, errorCode: 'E053'}` (resolved, not thrown) for timeout/network errors. context-server.ts catch block only handles thrown exceptions — bypassed for resolved-false. Fix: add `networkError` state to validation result, treat as non-fatal in startup.
  - process.exit() confirmed confined to context-server.ts only (3 sites: fatalShutdown, validation, main().catch)
  - Verify: Server starts with network disabled; logs warning, doesn't exit(1)

- [ ] **T03** Fix lint failures blocking `npm run check`
  - Files: `k-value-analysis.ts:692`, `archival-manager.ts:455`, `retry-manager.ts:46`, `causal-edges.ts:7`, `checkpoints.ts:405`
  - Fixes: P2-2
  - Verify: `npm run check` passes

- [ ] **T04** Fix critical spec validation errors
  - Add `decision-record.md` to `007-code-audit-per-feature-catalog/`
  - Fix broken markdown refs in 011, 010, 016 spec docs
  - Fix template header violations
  - Fixes: P0-2, P1-8, P1-9
  - Verify: `validate.sh` error count < 10 (from 43)

---

## Phase 3: P1 Must-Fix (short-term)

### Batch A: Code Fixes
- [ ] **T05** Fix quality loop to return `bestContent` on rejection
  - File: `handlers/quality-loop.ts:597`
  - Fixes: P1-1

- [ ] **T06** Add `preflight`, `postflight` to input normalizer allowlist
  - File: `scripts/utils/input-normalizer.ts:705`
  - Fixes: P1-3

- [ ] **T07** Forward `--session-id` into `runWorkflow` options
  - File: `scripts/memory/generate-context.ts:381`
  - Fixes: P1-4

- [ ] **T08** Remove dead registry entries (`opencode-capture` + `skill_advisor`)
  - File: `scripts/scripts-registry.json:425` (opencode-capture), `:235` (skill_advisor)
  - Fixes: P1-5
  - Phase 2 finding: Agent 13 found `skill_advisor` also missing from resolved path

- [x] **T09** Fix path-fragment trigger phrase generation (JSON mode quality)
  - Files: `scripts/core/workflow.ts`, `scripts/core/topic-extractor.ts`, `scripts/core/frontmatter-editor.ts`
  - Fixes: P1-7
  - Fix applied (per 013/research.md §7, simplified 3-step/2-PR):
    - **PR1**: Deleted post-filter reinsertion, expanded FOLDER_STOPWORDS (+5 words), applied stopwords in ensureMinTriggerPhrases/Topics, removed specFolderName from extractKeyTopics
    - **Deferred**: shared semantic sanitizer, pre-write prevention promotion

- [x] **T10** Restore Stage 1 vector fallback on hybrid failure
  - File: `lib/search/hybrid-search.ts`
  - Fixes: P1-16

### Batch A2: JSON Mode Content Quality (from 013 deep research)
- [x] **T09b** Enrich JSON mode normalization for richer semantic summaries
  - File: `scripts/utils/input-normalizer.ts`
  - Fixes: Thin content, truncated titles, generic fallback text in memory files
  - Applied: exchanges→userPrompts (10-cap, dedup), toolCalls→observations, truncation 200→500 chars

### Batch B: Pipeline Integrity
- [x] **T11** Add governance/preflight to script-side indexing path
  - Files: `scripts/core/memory-indexer.ts`
  - Applied: title/content validation + audit trail log (basic governance, not full hook parity)

- [x] **T12** Wire retention sweep into runtime or remove dead implementation
  - File: `lib/governance/retention.ts`
  - Applied: documented as manual-only trigger (not wired to runtime)

### Batch C: Documentation Fixes
- [x] **T13** Update tools/README.md tool count (28 → 33)
- [x] **T14** Fix root 022 packet contradictory counts and phantom phase
- [x] **T15** Update server README architecture map
- [x] **T16** Fix stale DB path examples in server README

### Batch D: Session Capturing Gaps
- [x] **T17** Complete 016-json-mode-hybrid-enrichment container files
- [x] **T18** Document 009/000/005 and 009/019 status honestly

---

## Phase 4: P2 Triage (deferred — post-release cleanup)

- [x] **T19** Remove dead code — already clean (verified: `_scheduleLlmBackfill` IS called at :556)
- [x] **T20** Clean orphaned dist files — already clean (both dist/ verified)
- [x] **T21** Update stale catalog refs — already clean (22 folders verified)
- [x] **T22** Add playbook scenarios — 14 new scenarios across 003/004/007 + 3 new playbook folders (020/021/022)
- [x] **T23** Update sprint metadata — Sprint 5/6 → "Implemented", SPECKIT_PIPELINE_V2 annotated as superseded
- [x] **T24** Document architecture components — MODULE_MAP.md comprehensive (27 modules)
- [x] **T25** Python scripts — no CLI scripts exist (only pytest test)
- [x] **T26** Shell strict mode — all scripts already compliant
- [x] **T27** Add audit-only catalog playbooks — 3 new folders with 9 scenarios
- [x] **T28** Fix playbook count contract — "272" → "265" (8 occurrences)
- [ ] **T29** Remove 31 orphan playbook scenarios or add catalog backlinks (P2-11)
- [ ] **T30** Fix incomplete test refactor for Stage 1 mocks (P2-16)
