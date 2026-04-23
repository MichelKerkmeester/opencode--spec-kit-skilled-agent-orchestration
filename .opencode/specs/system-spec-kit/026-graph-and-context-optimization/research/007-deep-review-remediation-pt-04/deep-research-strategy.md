---
title: Deep Research Strategy — Code Graph Scan Scope Anomaly (pt-04)
description: Iterative investigation into why code_graph_scan returned 33 files after packet 012 instead of the expected 1000-3000.
sessionId: dr-2026-04-23-130100-pt04
specFolder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope
---

# Deep Research Strategy — Code Graph Scan Scope Anomaly

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Investigate why `mcp__spec_kit_memory__code_graph_scan({rootDir, incremental:false})` returned 33 files / 809 nodes / 376 edges after packet 012 was deployed, when the expected range per the packet 012 handover was 1000-3000 files. Determine whether this is a correct outcome (excludes are simply more aggressive than predicted), a regression in the `incremental` flag handling, a DB cleanup bug on the full-reindex path, or a different root cause entirely. Produce evidence-backed recommendation with reproduction steps and a fix plan if a regression is confirmed.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Code graph indexer scope anomaly after packet 012 (.gitignore-aware walk + z_future/z_archive/mcp-coco-index/mcp_server excludes) — running scan returned 33 files vs. 1000-3000 predicted, with 3 UNIQUE constraint errors and `fullReindexTriggered=false` despite `incremental=false` flag.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Is the `incremental=false` flag actually honored when `previousGitHead === currentGitHead`, or does the indexer short-circuit to a no-op/incremental path even when the caller forces a full scan?
- [ ] Q2: How aggressive is the new `.gitignore`-aware walk plus `z_future` / `z_archive` / `mcp-coco-index/mcp_server` exclude set on this repo specifically? What is the empirical post-prune file count at the filesystem level (independent of the indexer)?
- [ ] Q3: Why did 3 files (`structural-indexer.ts`, `tree-sitter-parser.ts`, `working-set-tracker.ts`) hit `UNIQUE constraint failed: code_nodes.symbol_id` — is the full-reindex path failing to clear stale rows for files it intends to re-index?
- [ ] Q4: Did the scan actually replace the DB contents (status now reports 33 files), or did it leave a partially-pruned DB? `dbFileSize` is unchanged at 473MB — what is the relationship between row count and on-disk size pre/post scan?
- [ ] Q5: Given the evidence, what is the correct expected file count for this repo after packet 012, and is 33 the right answer or a regression? If regression, what is the minimal-diff fix and which packet folder owns it?

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Re-implementing or tuning the `.gitignore`-aware walk algorithm itself (separate concern from this anomaly investigation).
- Performance optimization of the indexer (orthogonal).
- Changes to the `code-graph` schema or migration to v4 (packet 012 stayed on v3).
- VACUUM / DB compaction work (the handover already noted this as optional follow-up).
- Re-litigating the packet 012 design decisions (excludes, gitignore, surface matrix doc) — those shipped clean and are out of scope.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- A causally-grounded explanation of the 33-file outcome backed by reading the packet 012 indexer code (`structural-indexer.ts`, `indexer-types.ts`) and reproducing the file-count math from filesystem evidence.
- A binary verdict: "33 is correct" OR "regression — root cause is X in file Y at line Z".
- If regression: a minimal-diff fix proposal with the exact lines to change.
- If correct: an updated expected-range estimate with the reasoning shown.
- Convergence: `newInfoRatio` < 0.05 across 3 iterations OR all 5 questions answered OR `maxIterations=5` reached.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet — populated as iterations answer questions]

---

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet — populated after iteration 1]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet — populated after iteration 1]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 1 should: (a) read `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` and `indexer-types.ts` end-to-end to map the actual control flow when `incremental=false` is passed AND `previousGitHead === currentGitHead`; (b) reproduce the post-exclude file count empirically using the same `ignore` package the indexer uses, walking the workspace root with the same exclude set; (c) trace exactly where the 3 UNIQUE constraint errors come from (the full-reindex DELETE path or the per-file upsert path).

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Packet 012 shipped state (from `session-handover-2026-04-23.md`)

- `lib/structural-indexer.ts` modified to use `ignore@5.3.2` for `.gitignore`-aware walk.
- `lib/indexer-types.ts` added 3 default scan excludes: `z_future`, `z_archive`, `mcp-coco-index/mcp_server`.
- `code-graph/SURFACES.md` matrix doc created.
- 20/20 vitest passes (`structural-contract.vitest.ts` + `tree-sitter-parser.vitest.ts`).
- `validate.sh --strict` clean.
- Build at `2026-04-23T12:16` (dist) — confirmed `z_future` present in `dist/code-graph/lib/indexer-types.js`.

### Live evidence captured this session

- Pre-scan (10:29Z baseline): 26,464 files / 544,577 nodes / 275,321 edges, schemaVersion=3, dbFileSize=473MB.
- Post-scan (10:54Z): 33 files / 809 nodes / 376 edges, dbFileSize=473MB (unchanged), `freshness: fresh`, `trustState: live`.
- Scan response: `filesScanned: 33`, `filesIndexed: 30`, `filesSkipped: 0`, `errors: [3 UNIQUE constraint failed: code_nodes.symbol_id on indexer-self files]`, `durationMs: 47928`, `fullReindexTriggered: false`, `previousGitHead === currentGitHead === 162a6cb16`.
- 3 errored files are the indexer's own source: `structural-indexer.ts`, `tree-sitter-parser.ts`, `working-set-tracker.ts` — suggests these have updated content vs. DB rows.
- The handover predicted 1,000-3,000 files post-prune. Actual 33 is ~30× lower.

### Hypothesis space (from session)

- (a) `incremental=false` flag is parsed but the indexer still short-circuits to incremental when `previousGitHead === currentGitHead` (no full-reindex path triggered).
- (b) `.gitignore` walk + new excludes prune far more aggressively than the handover anticipated; 33 may be the correct answer.
- (c) Full-reindex DB-cleanup logic regressed: scan only persisted 33 modified files but failed to clear/preserve the other ~26K rows correctly.
- (d) New combo of `.gitignore` interpretation: many `.opencode/` paths might be matching ignore patterns from a parent `.gitignore` not previously honored.

### Relevant files

- Indexer code: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- Types/excludes: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts`
- Built dist: `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/{structural-indexer,indexer-types}.js`
- Tests: `.opencode/skill/system-spec-kit/mcp_server/tests/{structural-contract,tree-sitter-parser}.vitest.ts`
- Scan handler: `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` (and likely a code-graph counterpart)
- DB: `mcp_server/database/code-graph.sqlite`
- Repo root .gitignore + nested `.gitignore` files (need enumeration)
- Surface matrix doc: `code-graph/README.md` (or `SURFACES.md` — packet 012 created/folded)
- Packet 012 implementation summary: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/implementation-summary.md`
- Handover: `007-deep-review-remediation/session-handover-2026-04-23.md`

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/007-deep-review-remediation-pt-04/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-23T13:01:00Z
- Executor: cli-codex / model=gpt-5.4 / reasoningEffort=high / serviceTier=fast / timeoutSeconds=900
<!-- /ANCHOR:research-boundaries -->
