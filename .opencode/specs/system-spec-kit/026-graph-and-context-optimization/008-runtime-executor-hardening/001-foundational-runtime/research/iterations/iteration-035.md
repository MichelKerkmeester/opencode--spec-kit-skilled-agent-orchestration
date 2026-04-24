# Iteration 35 — Domain 3: Concurrency and Write Coordination (5/10)

## Investigation Thread
I stayed on the Domain 3 seams from Iterations 031-034, but filtered out the already-written generic RMW races. This pass looked for additive coordination failures: whether the conflict lane can fork lineage under overlap, whether `session-stop.ts` exposes another success-shaped durability signal besides `producerMetadataWritten`, and whether the shared save-context temp path is still being taught uniformly across runtime entry docs.

## Findings

### Finding R35-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`
- **Lines:** `reconsolidation-bridge.ts:270-295`; `reconsolidation.ts:467-508, 610-658, 952-993`
- **Severity:** P1
- **Description:** The reconsolidation conflict lane is not single-winner coordinated. Two overlapping conflict saves can both supersede the same predecessor because candidate selection happens before any writer transaction, `executeConflict()` only checks that the row still exists, and `insertSupersedesEdge()` deduplicates only identical `(source_id, target_id, relation)` triples. Different new memory IDs are therefore all allowed to point at the same old row.
- **Evidence:** `runReconsolidationIfEnabled()` performs `vectorSearch(...)` plus scope filtering before the mutation transaction begins (`reconsolidation-bridge.ts:270-295`). `reconsolidate()` then picks `topMatch` from that stale snapshot and routes to `executeConflict()` (`reconsolidation.ts:610-658`). Inside `executeConflict()`, the only gate is `UPDATE memory_index ... WHERE id = ?`; there is no check that the predecessor is still the sole eligible target or that it has not already been superseded (`reconsolidation.ts:481-503`). `insertSupersedesEdge()` uses `INSERT OR IGNORE` and then re-selects by `source_id`, `target_id`, and `relation`, so a second concurrent source row can still add its own `supersedes` edge to the same target (`reconsolidation.ts:982-993`). Existing conflict coverage is single-writer only: `tests/reconsolidation.vitest.ts:790-855` asserts one deprecated predecessor and one supersedes edge, with no regression for concurrent conflict writers or multi-successor fan-out.
- **Downstream Impact:** A single predecessor memory can end up with multiple active "replacement" memories, each claiming to supersede it. That makes lineage ambiguous for drift analysis, causal traversal, and any consumer that assumes a conflict resolution leaves one current successor.

### Finding R35-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `session-stop.ts:119-125, 313-317`; `hook-state.ts:170-180, 221-240`
- **Severity:** P2
- **Description:** `touchedPaths` is another success-shaped durability signal that outruns the actual write contract. `recordStateUpdate()` appends the state path to `touchedPaths` unconditionally, even though `updateState()` can fail to persist or lose the unlocked `.tmp` race and only emit a warning.
- **Evidence:** `recordStateUpdate()` does `updateState(sessionId, patch)` and then immediately `touchedPaths.add(getStatePath(sessionId))` with no persistence check (`session-stop.ts:119-125`). But `saveState()` explicitly returns `false` on write or rename failure (`hook-state.ts:170-180`), and `updateState()` only logs `State update was not persisted` before returning the in-memory merged object anyway (`hook-state.ts:237-240`). `processStopHook()` then returns `touchedPaths` as part of `SessionStopProcessResult` (`session-stop.ts:313-317`). The replay harness locks in the happy-path interpretation by asserting one touched path inside the sandbox (`tests/hook-session-stop-replay.vitest.ts:17-24`), but it never forces `saveState()` failure or an overlapping writer before trusting that result.
- **Downstream Impact:** Tooling or operators can treat `touchedPaths` as proof that the stop hook durably updated hook-state when the file on disk may still hold stale content. That masks local state-write races and makes later autosave/resume failures look like downstream bugs instead of an earlier failed write.

### Finding R35-003
- **File:** `AGENTS.md`; `CLAUDE.md`; `CODEX.md`; `GEMINI.md`; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Lines:** `AGENTS.md:205-207`; `CLAUDE.md:152-155`; `CODEX.md:205-207`; `GEMINI.md:205-207`; `generate-context.ts:61-83`
- **Severity:** P2
- **Description:** The shared save-context temp path is now prescribed across all runtime root instructions, not just command assets. Every runtime guide still tells the operator to write session JSON to `/tmp/save-context-data.json`, even though the actual CLI help marks `--stdin` and `--json` as the preferred structured-input paths.
- **Evidence:** Each runtime root doc instructs the agent to compose JSON, write it to `/tmp/save-context-data.json`, and pass that file to `generate-context.js` (`AGENTS.md:205-207`; `CLAUDE.md:152-155`; `CODEX.md:205-207`; `GEMINI.md:205-207`). The source CLI contract points the other way: `generate-context.ts` explicitly documents `--stdin` and `--json` as preferred structured-input modes and says the preferred save path should use `--stdin`, `--json`, or a JSON temp file rather than a shared fixed pathname (`generate-context.ts:61-83`). Existing CLI authority tests already cover those safer structured modes (`scripts/tests/generate-context-cli-authority.vitest.ts:108-159, 162-203`), so the collision-prone fixed path is a documentation/runtime-contract choice rather than a capability limitation.
- **Downstream Impact:** Parallel Copilot, Claude, Codex, and Gemini sessions that follow the published instructions can overwrite each other's structured save payload before `generate-context.js` reads it. Because the input file is treated as authoritative session data, the failure mode is silent cross-packet continuity corruption rather than a clean error.

## Novel Insights
- Domain 3 now has a **lineage-coordination** sub-problem, not just a byte-write problem: conflict reconsolidation can fork successor history because the stale pre-transaction snapshot is still authoritative when conflict edges are created.
- The stop-hook result surface has at least two fields that overstate durability. Iteration 34 covered `producerMetadataWritten`; this pass adds `touchedPaths` as a second machine-readable field that can claim persistence without proof.
- The `/tmp/save-context-data.json` race is broader than the command assets and test harnesses already documented in Iterations 031-032: the top-level runtime guides for every assistant profile still normalize the same shared path, so the collision risk is cross-runtime by design.

## Next Investigation Angle
Stay in Domain 3 and stress the new single-writer assumptions directly: add a reconsolidation regression where two conflict saves race on the same predecessor, a stop-hook harness that forces `saveState()` to fail while inspecting returned `touchedPaths`, and a documentation/runtime audit of whether any shipped wrapper actually still needs a shared temp file now that `--stdin` and `--json` are first-class save modes.
