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

- [ ] **T09** Fix path-fragment trigger phrase generation (JSON mode quality)
  - Files: `scripts/core/workflow.ts:1056-1128`, `scripts/core/topic-extractor.ts:29-36`, `scripts/core/frontmatter-editor.ts:96-136`
  - Fixes: P1-7
  - 013 deep research findings (3-agent investigation):
    - **Root cause is NOT `deriveMemoryTriggerPhrases()`** — that helper is latent, not called by active JSON-mode path
    - **Active contamination**: workflow.ts:1101-1106 re-adds full folder phrase AFTER `filterTriggerPhrases()` runs
    - **Post-filter token injection**: workflow.ts:1107-1125 appends individual folder tokens not in `FOLDER_STOPWORDS` (misses `generation`, `epic`)
    - **Fallback reintroduction**: `ensureMinTriggerPhrases()` in frontmatter-editor.ts:96-115 backfills from leaf folder tokens WITHOUT stopword checks
    - **Key topics also contaminated**: `extractKeyTopics()` in topic-extractor.ts:31-36 pushes `specFolderName` into weighted segments
    - **Post-save review detects but doesn't prevent**: post-save-review.ts:184-198 catches path fragments AFTER write only
  - Fix architecture (combined, simplified per ultra-think review — see 013/research.md §7):
    - **PR1 — Stop contamination (~40 LOC)**:
      1. Delete post-filter folder reinsertion in workflow.ts:1101-1106
      2. Expand `FOLDER_STOPWORDS` (add `generation`, `epic`, `audit`, `alignment`, `enforcement`, `remediation`)
      3. Apply `FOLDER_STOPWORDS` inside `ensureMinTriggerPhrases()` (frontmatter-editor.ts:96-115) — CRITICAL: omitted from original plan
      4. Apply `FOLDER_STOPWORDS` inside `ensureMinSemanticTopics()` (frontmatter-editor.ts:118-136)
      5. Reduce/gate `specFolderName` weight in `extractKeyTopics()` (topic-extractor.ts:31-36)
    - **Deferred** (premature): shared semantic sanitizer, pre-write prevention promotion
    - **Risk**: retrieval regression — let folder phrases survive naturally through extraction, remove only FORCED reinsertion. `spec_folder` frontmatter enables `memory_search` by folder.

- [ ] **T10** Restore Stage 1 vector fallback on hybrid failure
  - File: `lib/search/hybrid-search.ts:1344`
  - Fixes: P1-16

### Batch A2: JSON Mode Content Quality (from 013 deep research)
- [ ] **T09b** Enrich JSON mode normalization for richer semantic summaries
  - File: `scripts/utils/input-normalizer.ts:571-689`
  - Fixes: Thin content, truncated titles, generic fallback text in memory files
  - 013 deep research findings:
    - **Root cause**: Semantic summarizer fed ONLY by `userPrompts` — Step 7.5 builds `allMessages` from this one channel
    - **JSON mode produces 1 synthetic entry** from `sessionSummary` → summarizer starved → falls back to "Development session"
    - **`exchanges` (user/assistant dialogue) never promoted to messages** — highest enrichment target
    - **`toolCalls` never promoted** — contains implementation evidence
    - **`nextSteps`/`technicalContext` stay as observations** — never reach plan/implementation message classes
    - **`sessionSummary` observation truncated to 200 chars** in `buildSessionSummaryObservation()` at :272-287
  - Fix (enrich in input-normalizer.ts, not semantic-summarizer.ts — **PR2, ~25 LOC**):
    1. Promote `exchanges` to multi-message `userPrompts` with intent/result classification
    2. Promote `toolCalls` to implementation/result messages (summarized, not verbatim JSON)
    3. Promote `nextSteps` and `technicalContext` to plan/implementation message classes
    4. Convert `filesModified` to implementation change messages (not just file-list metadata)
    5. Extend slow-path synthesis to mirror fast-path enrichment when structured arrays missing
  - Exchange promotion contract (from ultra-think review):
    - Max promoted: 10 exchanges
    - Dedup: check if exchange text is substring of existing sessionSummary prompt
    - Fast-path guard: if `userPrompts` already has 3+ entries, skip promotion
  - Regression guard: existing rich-array payloads (fast path) must remain unchanged

### Batch B: Pipeline Integrity
- [ ] **T11** Add governance/preflight to script-side indexing path
  - Files: `scripts/core/memory-indexer.ts:72-171`, `scripts/core/workflow.ts:1655-1675`
  - Fixes: P1-11
  - Phase 2 finding: Script path bypasses 10/11 MCP governance hooks. Parity exists only at raw vector storage layer (vector-index-mutations.ts). Full hook-by-hook comparison in research.md Phase 2 and scratch/iteration-003.md

- [ ] **T12** Wire retention sweep into runtime or remove dead implementation
  - File: `lib/governance/retention.ts:41`
  - Fixes: P1-12

### Batch C: Documentation Fixes
- [ ] **T13** Update tools/README.md tool count (28 → 33)
  - File: `mcp_server/tools/README.md:38`
  - Fixes: P1-10

- [ ] **T14** Fix root 022 packet contradictory counts and phantom phase
  - File: `022-hybrid-rag-fusion/spec.md:20`
  - Fixes: P1-13

- [ ] **T15** Update server README architecture map
  - File: `mcp_server/README.md:186`
  - Add: `api/`, `core/`, `formatters/`, `schemas/`
  - Fix: pipeline directory layout → flat file layout
  - Fixes: P1-14

- [ ] **T16** Fix stale DB path examples in server README
  - File: `mcp_server/README.md:912`
  - Fixes: P1-15

### Batch D: Session Capturing Gaps (deferred)
- [ ] **T17** Complete 016-json-mode-hybrid-enrichment container files
  - Fixes: P1-6b (missing plan.md, tasks.md, implementation-summary.md)

- [ ] **T18** Document 009/000/005 and 009/019 status honestly
  - Fixes: P1-6a, P1-6c (open work acknowledged, not blocked)

---

## Phase 4: P2 Triage (deferred — post-release cleanup)

- [ ] **T19** Remove dead code from MCP server (P2-1, P2-3, P2-12, P2-13)
- [ ] **T20** Clean orphaned dist files — `tsc --build --clean && tsc --build` (P2-4)
- [ ] **T21** Update stale catalog entries referencing deleted test files (P2-5, P2-17)
- [ ] **T22** Add 54 missing playbook scenarios, prioritize ux-hooks (14) and graph-signal (7) (P2-11)
- [ ] **T23** Update sprint metadata for sprints 5, 6, 11 (P2-14)
- [ ] **T24** Document 10 undocumented architecture components (P2-15)
- [ ] **T25** Migrate 5 Python CLI scripts to argparse (P2-8)
- [ ] **T26** Fix shell strict mode placement in 3 scripts (P2-9)
- [ ] **T27** Add catalog entries for 3 audit-only categories (P2-6)
- [ ] **T28** Fix stale playbook count contract (231 → 230) (P2-11)
- [ ] **T29** Remove 31 orphan playbook scenarios or add catalog backlinks (P2-11)
- [ ] **T30** Fix incomplete test refactor for Stage 1 mocks (P2-16)
