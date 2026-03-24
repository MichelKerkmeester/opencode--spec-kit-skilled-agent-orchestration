# Deep Research Strategy — 012 Pre-Release Verification (Phase 2)

## 2. Topic
Pre-release verification of 022-hybrid-rag-fusion: verify P0/P1 fix specifications at the code level, build system integrity, runtime error handling paths, and pipeline governance parity. Extends the 10-agent Phase 1 audit (49 findings) with deeper code-level verification.

---

## 3. Key Questions (remaining)
- [x] Q1: Is the package.json exports fix for P0-4 sufficient, or are there other broken export paths beyond `api/index.ts`? What does the full dist/ structure look like vs the exports map?
- [x] Q2: What is the exact runtime code path for P0-1 (startup crash) from factory.ts validation through context-server.ts exit? Are there other handlers that call process.exit() on transient errors?
- [x] Q3: Does the script-side indexing path (generate-context.js → memory-indexer.ts → workflow.ts) bypass governance, preflight, postflight, and audit hooks that the MCP memory_save path enforces? Map both paths completely.

---

## 4. Non-Goals
- Implementing fixes (read-only investigation)
- New feature development
- Playbook scenario creation
- Session capturing sub-phase implementation

---

## 5. Stop Conditions
- All 3 questions answered with file:line evidence
- Max 3 iterations reached
- All agent dispatches complete

---

## 6. Answered Questions
- [x] Q1: The `./api → ./dist/api/index.js` fix is sufficient for P0-4. The wildcard export `./* → ./dist/*.js` is structurally wrong for ALL directory barrels (core, formatters, handlers, hooks, tools, utils, handlers/save), but only `api` is a public import path — others are prohibited by import policy. Leaf imports (api/indexing, api/search, api/providers) work correctly. Details in `scratch/iteration-001.md`.
- [x] Q2: Exact startup crash path: `factory.ts` returns `{valid: false, errorCode: 'E053'}` for timeout/network failures (doesn't throw), `context-server.ts` treats that as fatal → `process.exit(1)`. Runtime exits confined to `context-server.ts` only (3 sites). P1-1 confirmed: bestContent tracked but never returned. P1-16 confirmed: skipFusion catch returns `[]`, erasing Stage 1 vector/raw candidates. Details in `scratch/iteration-002.md`.
- [x] Q3: Script save/index path bypasses governance, preflight, postflight enrichment, mutation/audit hooks, and retention remains unwired at runtime. Detailed path map and 11-row parity matrix captured in `scratch/iteration-003.md`.

---

## 7. What Worked
- Direct file reading of MCP server source code (Phase 1, agents 1-10)
- Grep for function names and import paths (Phase 1)
- Cross-agent correlation of findings (Phase 1 synthesis)
- Following the real runtime entrypoint from `scripts/memory/generate-context.ts` into `runWorkflow()` exposed the exact script-side handoff to `indexMemory()`.
- Comparing `handlers/memory-save.ts` against `handlers/save/*` and the shared vector mutators made the governance vs raw-storage boundary clear.
- A small filesystem existence audit against `scripts-registry.json` surfaced dead entries quickly.

---

## 8. What Failed
- CocoIndex semantic search returned empty results for TypeScript (Phase 1)
- spec_kit_memory MCP connection failed for all codex agents (Phase 1)
- CocoIndex still returned zero results for this TypeScript-heavy query set in Iteration 3, so all evidence came from direct source tracing.
- The first lookup for `generate-context.js` hit the generated runtime path rather than the authored TypeScript source; the useful source-of-truth file was `scripts/memory/generate-context.ts`.

---

## 9. Exhausted Approaches (do not retry)

### CocoIndex semantic search -- BLOCKED (Phase 1, 10 attempts)
- What was tried: `mcp__cocoindex_code__search` with various queries
- Why blocked: Returns 0 results for TypeScript files; index may not cover .ts
- Do NOT retry: Use Grep/Glob/Read instead

### spec_kit_memory MCP -- BLOCKED (Phase 1, 10 attempts)
- What was tried: All memory_* tool calls from codex agents
- Why blocked: "MCP startup failed: handshaking with MCP server failed: connection closed"
- Do NOT retry: Not available from codex CLI context

---

## 10. Ruled Out Directions
[None yet for Phase 2]

---

## 11. Next Focus
No further leaf-agent focus. Iteration 3 answered Q3; next step is synthesis into the parent `research.md` / fix-alignment summary, with emphasis on routing script saves through MCP-equivalent governance and save hooks.

---

## 12. Known Context
Prior 10-agent audit (Phase 1) identified 49 findings:
- **P0-1**: MCP server startup abort on transient network failure (context-server.ts:755)
- **P0-2**: validate.sh fails with 43 errors (exit 2)
- **P0-3**: 5 failing workflow-e2e tests due to memorySequence tracking (workflow.ts:1506)
- **P0-4**: @spec-kit/mcp-server/api module resolution broken (package.json:6)
- **P1-1**: Quality loop bestContent never returned (quality-loop.ts:597)
- **P1-2**: Transient errors conflated with bad API key (factory.ts:434)
- **P1-11**: Script-side indexing bypasses MCP pipeline (memory-indexer.ts:151)
- **P1-12**: Retention sweep not wired into runtime (retention.ts:41)
- **P1-16**: Stage 1 vector fallback regression (hybrid-search.ts:1344)
Full findings in research.md (250+ lines)

---

## 13. Research Boundaries
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current segment: 3
- Started: 2026-03-24T12:00:00.000Z
