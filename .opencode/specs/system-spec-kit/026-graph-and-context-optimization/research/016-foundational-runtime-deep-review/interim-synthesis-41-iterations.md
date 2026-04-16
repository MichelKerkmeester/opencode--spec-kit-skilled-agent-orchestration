# Interim Synthesis — Phase 016 Foundational Runtime Deep Review

**As of: iteration 41** (Domain 3 complete at 10/10; Domain 4 in progress at 1/10; Domain 5 not yet started)
**Author:** synthesis agent (read-only analysis)
**Source snapshot:** `iteration-001.md` through `iteration-041.md`
**Prior snapshot:** `interim-synthesis-32-iterations.md` (iterations 1-32; preview stub for 33-34)
**Note:** Domain coverage:
- **Foundational (1-10):** session-lifecycle / hook-state / code-graph / post-insert / shared-payload / compact-cache seam exploration
- **Domain 1 (11-20):** Silent Fail-Open Patterns — complete
- **Domain 2 (21-30):** State Contract Honesty — complete
- **Domain 3 (31-40):** Concurrency and Write Coordination — **complete** (10/10)
- **Domain 4 (41+):** Stringly-Typed Governance — in progress (1/10, iteration 41)
- **Domain 5:** Test Coverage Gaps — not yet started as a dedicated domain (subsidiary evidence in nearly every iteration)

---

## Section 1 — Finding Inventory

### 1.1 Raw Counts

| Metric                                                    | Count (32-iter snapshot) | Count (41-iter snapshot) | Delta |
| --------------------------------------------------------- | ------------------------ | ------------------------ | ----- |
| Iterations read                                           | 32                       | 41                       | +9    |
| Total numbered findings emitted (raw, incl. cross-domain) | 68                       | 93                       | +25   |
| P0 findings (interaction-effect escalations)              | 0                        | 0 (3 candidates, see §4) | —     |
| P1 findings (raw)                                         | 39                       | 54                       | +15   |
| P2 findings (raw)                                         | 29                       | 39                       | +10   |
| Unique file surfaces flagged                              | 14                       | 20                       | +6    |
| Distinct anti-patterns (cross-cutting)                    | 7                        | 9                        | +2    |

After deduplication the full set compresses to approximately **44 distinct issues** across 20 files
(prior: ~33 distinct issues across 14 files).

---

### 1.2 Findings Per Source File (deduped, cumulative through iteration 41)

| File (abbreviated path, all under `.opencode/skill/system-spec-kit/`) | Raw hits | Distinct issues | Dominant domains |
| --------------------------------------------------------------------- | -------- | --------------- | ---------------- |
| `mcp_server/hooks/claude/session-stop.ts`                             | 22       | 10              | D1, D2, D3       |
| `mcp_server/hooks/claude/hook-state.ts`                               | 18       | 8               | D2, D3           |
| `mcp_server/handlers/save/reconsolidation-bridge.ts`                  | 16       | 8               | D1, D3           |
| `mcp_server/handlers/save/post-insert.ts`                             | 14       | 6               | D1, D2           |
| `mcp_server/handlers/code-graph/query.ts`                             | 11       | 6               | D1, D2           |
| `mcp_server/lib/graph/graph-metadata-parser.ts`                       | 7        | 4               | D1, D2, D3       |
| `mcp_server/lib/storage/reconsolidation.ts`                           | 5        | 3               | D3               |
| `mcp_server/lib/context/shared-payload.ts`                            | 3        | 2               | D2               |
| `mcp_server/lib/code-graph/startup-brief.ts`                          | 3        | 1 (dedup)       | Foundational     |
| `mcp_server/lib/code-graph/ensure-ready.ts`                           | 2        | 2               | Foundational     |
| `mcp_server/handlers/session-bootstrap.ts` / `session-resume.ts` / `session-health.ts` | 4 | 3 | D2            |
| `mcp_server/lib/context/opencode-transport.ts`                        | 2        | 2               | D2               |
| `mcp_server/lib/parsing/memory-parser.ts`                             | 1        | 1               | D2               |
| `mcp_server/handlers/memory-save.ts` / `save/response-builder.ts`     | 2        | 2               | D2               |
| `mcp_server/hooks/claude/shared.ts` / `hooks/gemini/session-prime.ts` | 2        | 2               | Foundational     |
| `mcp_server/scripts/loaders/data-loader.ts` + command YAMLs           | 4        | 2               | D3               |
| `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md` [NEW since 38]  | 2        | 1               | D3, D4           |
| `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` [NEW since 38] | 1   | 1               | D4               |
| `.opencode/skill/skill-advisor/scripts/` [NEW since 38]               | 2        | 2               | D4               |
| `mcp_server/scripts/tests/manual-playbook-runner.ts` [NEW since 38]   | 1        | 1               | D4               |

---

### 1.3 Deduplication Map (cumulative, with Domain 3 complete and Domain 4 stub)

Existing dedup clusters from the 32-iteration snapshot are unchanged. New clusters from iterations 33-41:

| Dedup cluster                                                       | Iterations touching it | Canonical finding |
| ------------------------------------------------------------------- | ---------------------- | ----------------- |
| `session-stop.ts` unlocked RMW + autosave races                     | R31-001, R31-002, R32-001, R32-002, R33-002, R33-003, R34-001, R37-001 | R31-001 + R31-002 |
| `reconsolidation-bridge` pre-transaction snapshot exposure          | R31-003, R32-003, R34-002, R35-001, R36-002, R37-003, R39-002, R40-002 | R31-003 + R34-002 + R35-001 |
| `/tmp/save-context-data.json` shared temp path — docs + runtime     | R31-005, R32-005, R35-003, R36-003 | R31-005 + R35-003 |
| `hook-state` compact-clear identity race                            | R33-001 | R33-001 |
| `hook-state` stale-cleanup TOCTOU delete                            | R40-001 | R40-001 |
| `hook-state` directory-level all-or-nothing scan                    | R38-001, R38-002 | R38-001 + R38-002 |
| `session-stop.ts` success-shaped durability signals                 | R34-001, R35-002 | R34-001 + R35-002 |
| `loadMostRecentState()` generation mismatch (stat vs read)          | R36-001 | R36-001 |
| `session-stop.ts` stale `currentSpecFolder` preference              | R37-002 | R37-002 |
| `session-stop.ts` autosave outcome not reported                     | R39-001 | R39-001 |
| `spec_kit_plan_auto.yaml` vocabulary divergence [NEW since 38]      | R41-001 | R41-001 |
| `AGENTS.md` Gate 3 prose trigger list [NEW since 38]                | R41-002 | R41-002 |
| `skill_graph_compiler.py` advisory-only validation [NEW since 38]   | R41-003 | R41-003 |
| `manual-playbook-runner.ts` markdown→Function() eval [NEW since 38] | R41-004 | R41-004 |

---

## Section 2 — Per-Domain Summary

### 2.1 Foundational Seams (iterations 1-10)

*Unchanged from 32-iteration snapshot. See §2.1 in prior synthesis for full narrative.*

**Summary:** scope contract split between startup/resume; freshness/readiness asymmetry; trust-vocabulary collapse; compact-cache cross-runtime asymmetry.

---

### 2.2 Domain 1 — Silent Fail-Open Patterns (iterations 11-20, complete)

*Unchanged from 32-iteration snapshot. See §2.2 in prior synthesis for full narrative.*

**Summary:** Success-shaped envelopes mask skip/defer/partial/failed outcomes across `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, and `reconsolidation-bridge.ts`. Core anti-pattern: absence reinterpreted as truth; status erasure at response boundary.

---

### 2.3 Domain 2 — State Contract Honesty (iterations 21-30, complete)

*Unchanged from 32-iteration snapshot. See §2.3 in prior synthesis for full narrative.*

**Summary:** State laundering, state promotion, regression behavior canonizing degraded contracts, self-contradictory payloads. Core anti-pattern: collapsed producer state hardened into stronger contracts at consumer layers.

---

### 2.4 Domain 3 — Concurrency and Write Coordination (iterations 31-40, **complete**)

**Central thesis (confirmed):** The bug class is layered: byte-level races at write time (unlocked `.tmp` swap), snapshot-coherence races at read-then-decide time (stale pre-transaction snapshots driving conflict, merge, complement, assistive, cleanup, and spec-folder targeting decisions), and TOCTOU identity races at cleanup time. Atomic rename prevents torn bytes; it does not protect any decision that was made before the rename and reused afterward.

**Key patterns confirmed through iteration 40:**

1. **Unlocked RMW on deterministic temp paths** (R31-001/R32-001). Two writers for the same session race on `filePath + '.tmp'`. `updateState()` returns the merged in-memory object even after a failed persist. Covered in iterations 31-33.

2. **Split-brain stop-hook state** (R31-002/R32-002/R33-002/R33-003). `processStopHook()` snapshots state once, makes three independent `recordStateUpdate()` calls (transcriptOffset, producerMetadata, sessionSummary/specFolder), then hands off to `runContextAutosave()` which re-reads from disk. Every interleaved write can change the composition of what autosave actually saves. Also: `storeTokenSnapshot()` emits a transient `lastTranscriptOffset: 0` sentinel before the final correct value is written (R37-001), creating a second overlapping-stop window.

3. **Reconsolidation pre-transaction snapshot exposure** (R31-003, R32-003, R34-002, R35-001, R36-002, R37-003). All three reconsolidation paths — conflict, complement, assistive — make key decisions before the SQLite writer transaction begins:
   - **Conflict** (R35-001): no single-winner coordination; two concurrent conflict saves can both supersede the same predecessor, forking lineage.
   - **Complement** (R34-002): stale-search duplicate window between `runReconsolidationIfEnabled()` and `writeTransaction`.
   - **Assistive** (R36-002, R37-003): advisory recommendation built from a second, separate pre-transaction search; the same request can observe two different candidate universes before committing.
   - **Per-candidate scope validation** (R39-002/R40-002): even within the scope-filter loop, each candidate's governance row is re-read individually outside any transaction, creating a mixed-snapshot candidate universe.

4. **TOCTOU identity races** (R33-001, R36-001, R40-001). [NEW in iterations 33-40]:
   - `clearCompactPrime()` clears by session ID, not by payload identity; a newer compact payload written between `readCompactPrime()` and `clearCompactPrime()` is silently erased (R33-001).
   - `loadMostRecentState()` makes its freshness decision from `statSync()` before reading the payload bytes; a concurrent rename can swap in a newer generation between the stat and the read, so caller receives content from generation N but freshness metadata from generation N-1 (R36-001).
   - `cleanStaleStates()` checks `mtimeMs` via `statSync()`, then issues `unlinkSync()` without re-checking file identity; a live writer's atomic rename can swap a fresh generation onto the same path between those two calls, causing cleanup to delete fresh state while reporting a normal `removed` count (R40-001).

5. **Directory-level all-or-nothing scans** (R38-001, R38-002). [NEW in iterations 38]:
   - `loadMostRecentState()` wraps the entire directory scan in one `try` block; a single bad sibling file aborts the lookup and returns `null` for all consumers.
   - `cleanStaleStates()` shares the same pattern; one bad `statSync`/`unlinkSync` aborts the rest of the sweep.

6. **Success-shaped durability signals overstating write contract** (R34-001, R35-002). [NEW in iterations 34-35]:
   - `producerMetadataWritten` is an attempted-write flag, not a postcondition; the underlying persist can fail or be overwritten after the flag is set.
   - `touchedPaths` has the same flaw; it is appended unconditionally regardless of `saveState()` outcome.

7. **Stop-hook autosave outcome silent** (R39-001). [NEW in iteration 39]:
   - `runContextAutosave()` re-reads state from disk and silently returns on missing `lastSpecFolder` or `sessionSummary`, but `SessionStopProcessResult` never exposes the autosave outcome (ran / skipped / failed). Callers cannot distinguish successful autosave from silent no-op.

8. **Stale `currentSpecFolder` preference in `detectSpecFolder()`** (R37-002). [NEW in iteration 37]:
   - `processStopHook()` feeds a once-snapshotted `stateBeforeStop.lastSpecFolder` into `selectDetectedSpecFolder()` as the current-packet preference. If another writer has already advanced the real active packet, the stop hook can "validate" the old packet and suppress legitimate retargeting.

9. **Shared `/tmp/save-context-data.json` path in runtime error contracts** (R35-003, R36-003). [NEW in iterations 35-36]:
   - All four runtime root docs (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`) still prescribe the fixed shared handoff path.
   - The runtime error message in `data-loader.ts:63-68` itself teaches the shared path, so even operators who never read the docs learn the collision-prone pattern from runtime failure output.

**Concrete exemplar findings added since 32-iteration snapshot:**

| Finding | File:lines | Severity | One-liner |
| ------- | ---------- | -------- | --------- |
| R33-001 | `hook-state.ts:184-205`; `session-prime.ts:43-46,281-287` | P1 | `clearCompactPrime()` clears by session ID, not payload identity; newer payload erased on overlap |
| R35-001 | `reconsolidation-bridge.ts:270-295`; `reconsolidation.ts:467-508,610-658,952-993` | P1 | Conflict lane not single-winner; two concurrent saves can both supersede the same predecessor |
| R37-001 | `session-stop.ts:175-190,244-252,257-268` | P1 | Transient `lastTranscriptOffset: 0` sentinel between two writes; second stop hook can re-parse from zero |
| R37-002 | `session-stop.ts:128-145,244-246,281-296,340-369` | P1 | Stale `currentSpecFolder` preference can suppress legitimate packet retarget |
| R39-001 | `session-stop.ts:60-67,108-117,299-318` | P1 | Autosave outcome (ran/skipped/failed) never surfaced in `SessionStopProcessResult` |
| R40-001 | `hook-state.ts:170-176,247-255`; `session-stop.ts:321-328` | P2 | `cleanStaleStates()` can delete fresh state between `statSync()` and `unlinkSync()` |
| R40-002 | `reconsolidation-bridge.ts:203-237,282-306` | P1 | Per-candidate scope validation reads each row individually outside any transaction; mixed-snapshot candidate universe |

**Open questions carried forward into Domain 4 and Domain 5:**
- Can a predecessor `updated_at` + `content_hash` CAS guard be added to `executeConflict()` without restructuring the reconsolidation orchestrator?
- Does `hook-state.ts` need true file locking, or would a unique temp filename + `current_version` field inside `HookState` be sufficient?
- What is the actual concurrent-writer surface at runtime? Dual stop events are rare; compact-inject + stop-hook writes are more probable. Frequency measurement is still missing.
- Does the `/tmp/save-context-data.json` runtime error path contribute more collision risk than the docs alone, or do the safer CLI modes (`--stdin`, `--json`) already dominate in practice?
- Are there other directory-wide scans in the runtime beyond `loadMostRecentState()` and `cleanStaleStates()` that share the all-or-nothing exception pattern?

---

### 2.5 Domain 4 — Stringly-Typed Governance (iteration 41, 1/10) [NEW since 38]

**Central thesis (initial):** Repository governance — gate triggers, intake-state vocabularies, validation outcomes, and skill routing — is expressed as manually synchronized string tables across docs, YAML assets, Python dictionaries, and markdown playbooks. Different layers interpret the same prose differently, and "validation passes" can succeed even when the invariants being validated are violated. The problem is not merely documentation drift; it is **control-plane drift** where canonical state names and gate triggers have no mechanically shared source of truth.

**Key patterns discovered so far (iteration 41 only):**

1. **Intake-state vocabulary split** (R41-001 / P2). The autonomous plan workflow (`spec_kit_plan_auto.yaml`) uses a private `folder_state` token set that includes `populated` as the "skip intake" state, while the canonical intake contract (`intake-contract.md`) and the operator-facing plan doc both define the healthy state as `populated-folder`. Because branch conditions are prose string comparisons rather than parsed enums, runtimes or prompt revisions can reconcile these differently, leading to avoidable intake prompts, inconsistent `folderState` event payloads, and operator confusion.

2. **Gate 3 trigger list as prose contract** (R41-002 / P2). `AGENTS.md` governs Gate 3 spec-folder detection with a literal English trigger-word list. Both `/spec_kit:plan` and `/spec_kit:complete` outsource trigger classification to that document rather than defining a local or shared classifier. Different runtimes can independently decide whether a given request requires a Gate 3 interrupt, undermining the repository's claim that spec-folder gating is mandatory and consistent.

3. **Skill-graph topology checks advisory-only** (R41-003 / P1). `skill_graph_compiler.py` intentionally marks symmetry, weight-band, weight-parity, and orphan-skill checks as soft validation, so `--validate-only` still returns success-shaped output even when the routing graph violates its own recommended invariants. `skill_advisor.py` then loads that compiled graph as routing authority, so asymmetric or weakly connected graph data can silently bias recommendations while operators trust the "validation passed" signal.

4. **Markdown-to-code execution path in playbook runner** (R41-004 / P1). `manual-playbook-runner.ts` walks the playbook tree, extracts command/object-literal fragments from prose, substitutes placeholders, and evaluates them with `Function(...)()` — no parser sandbox or schema validation. Documentation drift in a playbook scenario can become arbitrary Node-side execution during local or CI validation; the runner treats markdown as code rather than failing on invalid test data.

**Novel insight from iteration 41:** The four findings above form a coherent pattern of **success-shaped governance**: intake classification, gate enforcement, graph validation, and playbook execution all accept or execute string-defined behavior without a typed contract that proves the strings still mean the same thing everywhere. This is a structural analogue to the "success-shaped envelopes" anti-pattern identified in Domain 1 — but at the governance layer rather than the data layer.

**Domain 4 surfaces not yet covered (remaining 9 passes):**
- `opencode.json` + `.utcp_config.json` MCP naming contracts (`{manual_name}.{manual_name}_{tool_name}`)
- `generate-context.js` trigger-word surface for memory category / triggers / scope
- Handover-state routing rules (`handover_state` enum with no runtime validator)
- `skill_advisor.py` hand-maintained keyword/phrase tables vs discovered `SKILL.md` metadata
- Whether `folderState` / Gate 3 vocabularies leak into emitted events, reducers, or follow-up commands beyond `/spec_kit:plan`
- `recommendations.md` + `implementation-summary.md` operational promises without CI gates
- Cross-cutting: which prose contracts could be mechanized with low effort?

---

### 2.6 Domain 5 — Test Coverage Gaps (not yet started as a dedicated domain)

Test-coverage gaps appear as subsidiary evidence in nearly every iteration. The recurring patterns catalogued through iteration 41:

**Legacy gaps (identified by iteration 32, unchanged):**
- `startup-brief.vitest.ts:28-76` mocks `loadMostRecentState()` unconditionally, masking the scope-less contract break.
- `code-graph-query-handler.vitest.ts:12-18` hoists `ensureCodeGraphReady` to always return `'fresh'`.
- `post-insert-deferred.vitest.ts:11-48` asserts all-true booleans for deferred runs.
- `graph-metadata-schema.vitest.ts:223-245` asserts legacy acceptance as clean success.
- `hook-session-stop-replay.vitest.ts:14-56` runs with autosave disabled.
- `reconsolidation-bridge.vitest.ts:255-330` uses static mocked search results only.

**New gaps from iterations 33-41 [NEW since 38]:**
- `hook-precompact.vitest.ts:23-48` and `hook-session-start.vitest.ts:27-107` never invoke `clearCompactPrime()` or `readAndClearCompactPrime()` under overlap (R33-001).
- `hook-stop-token-tracking.vitest.ts:23-109` covers only sequential metric overwrites; no two-stop overlap exposing the `lastTranscriptOffset: 0` sentinel (R37-001).
- `hook-session-stop.vitest.ts:17-89` pins the `detectSpecFolder()` stale-preference case; no case where `currentSpecFolder` is itself stale (R37-002).
- `hook-state.vitest.ts:4-224` imports `cleanStaleStates` but contains no invocation; no TOCTOU stat-then-unlink regression (R40-001).
- `reconsolidation-bridge.vitest.ts:255-330` and `reconsolidation.vitest.ts:790-855` are single-writer; no two-conflict-save race proving forked lineage (R35-001).
- `assistive-reconsolidation.vitest.ts:17-234` exercises only helper thresholds/logging; no live save flow with competing candidate insert (R36-002, R37-003).
- `handler-memory-save.vitest.ts:1056-1093` explicitly locks in reconsolidation planning before writer lock; no regression for per-candidate scope mutation during that window (R39-002, R40-002).
- `transcript-planner-export.vitest.ts:146-217` asserts only downstream response summaries; never exercises `spec_kit_plan_auto.yaml` `folder_state` string conditions (R41-001).
- `memory-save-planner-first.vitest.ts:12-214` covers response shaping only; no Gate 3 trigger-classification verification (R41-002).
- `skill-graph-schema.vitest.ts:1-156` is a dispatcher/input-validation test for MCP tool routing; it is not a compiler-invariant gate for symmetry/weight-band/orphan-skill checks (R41-003).

---

## Section 3 — Cross-Cutting Themes

### 3.1 Anti-Patterns Appearing in 3+ Files

| Anti-pattern | Files affected | Representative findings |
| ------------ | -------------- | ----------------------- |
| Success-shaped envelope masking skip / defer / partial / failed state | `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts` | R8-001, R12-001, R13-004, R17-002, R21-001 |
| Unvalidated `JSON.parse` feeding both write-target and prompt-visible text | `hook-state.ts`, `shared-payload.ts`, `graph-metadata-parser.ts` | R21-002, R9-002, R11-002 |
| Collapsed state vocabulary (missing vs empty vs stale vs degraded) | `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts` | R9-001, R22-001, R23-001, R26-001, R30-001, R30-002 |
| Pre-transaction read-then-mutate (snapshot before lock, no re-read at commit) | `hook-state.ts` + `session-stop.ts`, `reconsolidation-bridge.ts` + `reconsolidation.ts`, `graph-metadata-parser.ts` | R31-001, R31-002, R31-003, R31-004, R34-002, R35-001 |
| Deterministic / shared temp path under concurrency | `hook-state.ts` (`.tmp`), `graph-metadata-parser.ts` (pid+Date.now ms precision), command YAMLs + runtime root docs + `data-loader.ts` error message | R31-001, R31-004, R31-005, R35-003, R36-003 |
| Test fixture canonizes degraded contract | `post-insert-deferred.vitest.ts`, `code-graph-query-handler.vitest.ts`, `structural-contract.vitest.ts`, `graph-metadata-schema.vitest.ts` | R25-001 through R25-004, R26-001 |
| Flag-based success without helper-result inspection | `post-insert.ts`, `session-stop.ts` | R8-001, R34-001, R35-002 |
| **TOCTOU identity race (stat vs act on same pathname)** [NEW since 38] | `hook-state.ts` (`loadMostRecentState` stat-then-read, `cleanStaleStates` stat-then-unlink, `clearCompactPrime` read-then-clear) | R33-001, R36-001, R40-001 |
| **Success-shaped governance (string-defined contracts that accept violations)** [NEW since 38] | `spec_kit_plan_auto.yaml`, `AGENTS.md`, `skill_graph_compiler.py`, `manual-playbook-runner.ts` | R41-001, R41-002, R41-003, R41-004 |

---

### 3.2 Systemic Issues Not in the Original Copilot Deep-Dive

*The original seven systemic issues from the 32-iteration snapshot are unchanged. Three new systemic issues emerge from iterations 33-41:*

**8. Lineage can fork under concurrent conflict reconsolidation.** The original deep-dive flagged scope-filter and snapshot issues in reconsolidation but did not note that concurrent conflict saves can create multiple "replacement" successors for the same predecessor row (R35-001). That makes lineage ambiguous for every downstream drift analysis and causal traversal permanently.

**9. TOCTOU identity is a separate failure class from last-writer-wins.** Earlier iterations documented the unlocked write race. Iterations 33-40 show a second, structurally distinct class: operations that check a file's identity or content via one syscall and then act on the same path via a later syscall (R33-001, R36-001, R40-001). Atomic rename makes last-writer-wins predictable but does not protect TOCTOU callers.

**10. Runtime error contracts can teach dangerous patterns.** The `data-loader.ts` `NO_DATA_FILE` error message instructs callers to use the shared `/tmp/save-context-data.json` path even though the CLI help prefers safer alternatives (R36-003). Fixing documentation without also fixing the error message means every new operator who encounters a failure learns the collision-prone workflow from the runtime itself.

---

### 3.3 Findings That Reinforce Each Other

*Existing reinforcement chains from the 32-iteration snapshot are preserved. New chains from iterations 33-41:*

- **R37-001 (transient zero-offset sentinel) + R33-002 (offset regression under two concurrent stop hooks) + R14-001 (cursor reverts to 0 on metadata failure):** Together, `session-stop.ts` can corrupt `lastTranscriptOffset` through three independent mechanisms — an interleaved second stop hook reading the transient zero, a last-writer-wins overwrite of a smaller offset, and an I/O failure in `storeTokenSnapshot()` that leaves offset 0 as the committed value.

- **R35-001 (conflict fork) + R32-003 (scope-retag not re-checked) + R40-002 (per-candidate scope mixed snapshot):** Together, the conflict lane in reconsolidation can simultaneously (1) create duplicate successors, (2) deprecate a predecessor that has already been retagged out of scope, and (3) include or exclude candidates from the filter set based on scope rows that change between successive per-candidate lookups.

- **R40-001 (cleanup deletes fresh state) + R38-001 (loadMostRecentState all-or-nothing) + R33-002 (offset regression):** Together, a finalize cleanup sweep overlapping with live writers can erase the newest state, make the next startup return `null` for all consumers, and then produce inflated token counts when the next stop hook re-parses from offset 0.

- **R41-003 (skill-graph advisory validation) + R41-002 (Gate 3 prose trigger list) + R41-001 (intake vocab split):** Together, three separate governance checkpoints that appear mechanical are actually prose-level. A skill-routing graph can have broken topology, Gate 3 can fire inconsistently across runtimes, and intake classification can produce different outcomes for the same `folder_state` depending on which string vocabulary a runtime interprets. All three can produce success-shaped output for invalid inputs.

---

## Section 4 — Severity Escalation Candidates

### 4.1 P0 Candidates (Unchanged from Prior Synthesis)

**P0-candidate-A: Cross-runtime tempdir control-plane poisoning**
Constituent findings: R21-002 + R25-004 + R28-001 + R29-001 + R31-001 + R33-003.
Rationale and why-P0: unchanged. A single corrupt temp-state file spans Claude + Gemini, write-side + read-side, prompt-visible + on-disk, tempdir + continuity + analytics.

**P0-candidate-B: Reconsolidation conflict + complement duplicate/corruption window**
Constituent findings: R31-003 + R32-003 + R34-002 + R35-001 + R40-002.
*Updated:* R35-001 (conflict fork) and R40-002 (mixed-snapshot scope filter) strengthen this candidate. The conflict lane can now produce permanent multi-successor lineage, and the scope filter can silently include or exclude candidates based on rows that changed between successive lookups — both writing incorrect deprecation / lineage edges into the persistent store.

**P0-candidate-C: Graph-metadata laundering + search boost**
Constituent findings: R11-002 + R13-002 + R20-002 + R21-003 + R22-002 + R23-002.
Rationale and why-P0: unchanged. State laundering erases corruption signal and raises the boosted artifact above legitimate spec docs.

### 4.2 New P0 Interaction Candidate [NEW since 38]

**P0-candidate-D: TOCTOU cleanup erasing fresh state under live session load**
Constituent findings: R40-001 + R38-001 + R33-002 + R37-001.
Rationale: `cleanStaleStates()` can delete a freshly-written session state (R40-001); `loadMostRecentState()` aborts the entire scan if any sibling file is missing or unreadable (R38-001); the next stop hook then re-parses transcript from offset 0 (R37-001) and can compound that via the transient zero-offset sentinel (R37-001). The combined effect: a routine finalize sweep overlapping with a live session can erase continuity state, produce a false cold-start, and inflate token/cost accounting — all with only warning-level logs. The blast radius spans the cleanup, recovery, and accounting subsystems simultaneously.
Why P0 candidate: unlike the byte-race candidates, this interaction is triggered by a normal maintenance operation (`--finalize` cleanup) rather than an abnormal concurrent write. The triggering condition is more common and the failure signal (normal `removed` count) is further from the actual damage.

### 4.3 P1 Findings That Should Stay P1 with Strict Ordering

Unchanged from 32-iteration snapshot, with three additions:
- R35-001 (conflict fork — no single-winner coordination) — unlocks any meaningful lineage-integrity guarantee
- R39-001 (autosave outcome unreported) — unlocks operator visibility into continuity failures
- R41-003 (skill-graph advisory validation) — unlocks trustworthy `--validate-only` output

### 4.4 P2 Interactions That Approach P1

Unchanged: R14-001 + R33-002 (duplicate token accounting from offset regression). New: R40-001 + R38-001 (TOCTOU cleanup → all-or-nothing abort → cold-start appearance).

---

## Section 5 — Remediation Backlog (Updated)

### 5.1 New or Amended Items from Iterations 33-41

*For the full backlog from the 32-iteration snapshot, see §5.1 in `interim-synthesis-32-iterations.md`. Only additions and amendments are listed here.*

#### `mcp_server/hooks/claude/hook-state.ts` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Replace all-or-nothing `try` in `loadMostRecentState()` with per-file error isolation; skip bad candidates rather than aborting the scan | **Small** | R38-001, R2-002 |
| Replace all-or-nothing `try` in `cleanStaleStates()` with per-file isolation; return `{ removed, skipped, errors }` | **Small** | R38-002, R40-001 |
| Detect file-identity change between `statSync()` and `unlinkSync()` in `cleanStaleStates()`; abort delete if mtime changed | **Small** | R40-001 |
| Replace per-session clear in `clearCompactPrime()` with identity-based clear (`cachedAt` equality check before nulling) | **Small** | R33-001 |
| Tie `loadMostRecentState()` content read to the same file identity as its `mtime` (atomic re-check or single open) | **Small** | R36-001 |

#### `mcp_server/hooks/claude/session-stop.ts` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Eliminate intermediate `lastTranscriptOffset: 0` sentinel in `storeTokenSnapshot()`; only write the resolved offset | **Small** | R37-001 |
| Re-read hook state just before `detectSpecFolder()` instead of using `stateBeforeStop` snapshot | **Small** | R37-002 |
| Add `autosaveOutcome: 'succeeded' | 'failed' | 'skipped_no_input' | 'disabled'` to `SessionStopProcessResult` | **Small** | R39-001, R12-001, R13-001 |
| Gate `touchedPaths.add()` on confirmed `saveState()` success; propagate `persistResult` from `updateState()` | **Small** | R35-002, R34-001 |

#### `mcp_server/handlers/save/reconsolidation-bridge.ts` + `lib/storage/reconsolidation.ts` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add predecessor `content_hash` + `is_deprecated = FALSE` guard to `executeConflict()`; abort if predecessor already superseded | **Medium** | R35-001, R31-003, R32-003 |
| Wrap per-candidate `readStoredScope()` calls inside the same transaction as the vector search result set, or take a snapshot of all candidate scopes in one batch query | **Medium** | R39-002, R40-002 |
| Re-run similarity search + scope filter inside the writer transaction for complement decisions | **Large** | R34-002, R36-002, R37-003 |

#### Command YAMLs + runtime root docs (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Update `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md` to remove fixed-path prescriptions; replace with `--stdin` / `--json` examples | **Small** | R35-003 |
| Update `data-loader.ts` `NO_DATA_FILE` error text to teach `--stdin` / `--json` instead of `/tmp/save-context-data.json` | **Small** | R36-003 |

#### Domain 4 surfaces (new) [NEW since 38]

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Align `spec_kit_plan_auto.yaml` `folder_state` vocabulary with canonical `populated-folder` token from `intake-contract.md`; add a schema-level `enum` for valid state tokens | **Small** | R41-001 |
| Extract Gate 3 trigger classification into a shared classifier module or JSON schema; replace prose list in `AGENTS.md` with a reference | **Medium** | R41-002 |
| Promote `skill_graph_compiler.py` symmetry, weight-band, weight-parity, and orphan-skill checks to hard errors (non-zero exit); annotate `--validate-only` output clearly | **Small** | R41-003 |
| Replace `Function(...)()` eval in `manual-playbook-runner.ts` with a schema-validated step parser; reject unrecognized object shapes as malformed test data | **Medium** | R41-004 |

---

### 5.2 Quick Wins vs Structural Refactors (Updated)

**Quick wins added since 32-iteration snapshot:**

11. Per-file error isolation in `loadMostRecentState()` and `cleanStaleStates()` (R38-001, R38-002)
12. Identity check in `cleanStaleStates()` before `unlinkSync()` (R40-001)
13. Identity-based `clearCompactPrime()` (R33-001)
14. Eliminate transient zero-offset sentinel in `storeTokenSnapshot()` (R37-001)
15. Add `autosaveOutcome` field to `SessionStopProcessResult` (R39-001)
16. Gate `touchedPaths` on confirmed persist (R35-002)
17. Fix `data-loader.ts` error text to teach `--stdin` / `--json` (R36-003)
18. Update four runtime root docs to remove shared temp-path prescription (R35-003)
19. Align `spec_kit_plan_auto.yaml` `folder_state` token with `intake-contract.md` vocab (R41-001)
20. Promote `skill_graph_compiler.py` topology checks to hard errors (R41-003)

**Structural refactors (updated estimates):**

1. Replace `enrichmentStatus` boolean record with enum-valued status map — **Large.** (unchanged)
2. Transactional reconsolidation (scope filter + complement inside writer lock; predecessor CAS in conflict) — **Large.** Now also covers R35-001 and R40-002 in addition to prior findings.
3. HookState schema versioning + runtime validation + unique temp paths — **Medium.** (unchanged)
4. Trust-state vocabulary expansion (`absent`/`unavailable` distinct from `stale`) — **Medium-to-Large.** (unchanged)
5. Graph-metadata `migrated` flag propagation — **Medium.** (unchanged)
6. **Gate 3 shared classifier** — extract trigger classification from prose into a shared module callable from `AGENTS.md`, `plan.md`, and `complete.md` — **Medium.** [NEW since 38]
7. **Playbook runner schema validation** — replace `Function(...)()` eval with typed step parser — **Medium.** [NEW since 38]

---

### 5.3 Test Suite Changes Required (Updated)

*Legacy list from 32-iteration snapshot is unchanged. New additions:*

- `tests/hook-precompact.vitest.ts` — add test: write new `pendingCompactPrime` between `readCompactPrime()` and `clearCompactPrime()`; assert newer payload survives.
- `tests/hook-stop-token-tracking.vitest.ts` — add two-stop overlap test pausing between `storeTokenSnapshot()` and `recordStateUpdate()`.
- `tests/hook-session-stop.vitest.ts` — add test: stale `currentSpecFolder` in transcript tail; assert packet retargeting is not suppressed.
- `tests/hook-state.vitest.ts` — add tests: (a) replace sibling file between `statSync()` and `readFileSync()` in `loadMostRecentState()`; (b) replace target file between `statSync()` and `unlinkSync()` in `cleanStaleStates()`; (c) inject bad sibling to prove per-file isolation.
- `tests/reconsolidation.vitest.ts` — add two-concurrent-conflict test against the same predecessor; assert at most one successor.
- `tests/reconsolidation-bridge.vitest.ts` — add governed-scope mutation between `vectorSearch()` and end of scope-filter loop; assert no mixed-snapshot acceptance.
- `tests/hook-session-stop-replay.vitest.ts` — add enabled-autosave variant where `sessionSummary` or `lastSpecFolder` disappears before `runContextAutosave()` reads state.
- `tests/skill-graph-schema.vitest.ts` (or new `skill-graph-compiler.vitest.ts`) — add symmetry, weight-band, orphan-skill inputs that currently pass `--validate-only`; assert they will fail after promotion to hard errors.
- `tests/transcript-planner-export.vitest.ts` — add `populated` vs `populated-folder` token divergence case for `spec_kit_plan_auto.yaml` Step 0.5 branch.

---

## Section 6 — Gaps for Remaining Iterations (42-50)

### 6.1 Domain 4 Completion (iterations 42-50, 9 more passes)

Proposed angles not yet covered:
1. `skill_advisor.py` hand-maintained keyword/phrase tables — sync against discovered `SKILL.md` metadata?
2. `folderState` / Gate 3 vocabulary propagation into emitted events, reducers, and follow-up commands beyond `/spec_kit:plan`
3. `opencode.json` + `.utcp_config.json` MCP naming contract (`{manual_name}.{manual_name}_{tool_name}`)
4. `generate-context.js` trigger-word surface for memory category / triggers / scope
5. Handover-state routing rules — `handover_state` enum values with no runtime validator
6. `recommendations.md` + `implementation-summary.md` operational promises without CI gates
7. Cross-cutting mechanization survey: which prose contracts could gain low-effort JSON schema + CI gates?
8. Command YAML expression evaluation: `intake_only == TRUE` and similar interpreter-dependent expressions
9. Runtime-doc → runtime behavioral contract gap: which promises in `AGENTS.md` / skill docs are not backed by any test?

### 6.2 Domain 5 — Test Coverage Gaps (dedicated pass, iterations 42+)

Full domain should harvest the growing subsidiary evidence list into a concrete missing-test inventory and turn it into adversarial harnesses. Proposed angles:
1. Concurrent-writer harness inventory (from Domain 3 complete)
2. TOCTOU identity race harnesses (new from iterations 33-40)
3. Malformed-state harness inventory (JSON parse failures, truncated files, schema drift)
4. Fail-open fallback branch harness (swallowed exceptions from Domain 1)
5. Regression-suite dishonesty audit (tests that assert collapsed state)
6. End-to-end save-path integration tests (currently mostly helper-level)
7. End-to-end hook-based session lifecycle (currently mostly unit-level)
8. Cross-runtime (Claude ↔ Gemini) parity tests for hook-state + compact-cache
9. Governance string-contract harnesses (from Domain 4 opening)
10. Concurrency in reconsolidation: conflict fork, complement duplicate, assistive stale-recommendation

### 6.3 Files with Unanswered Questions (as of iteration 41)

| File | Open question |
| ---- | ------------- |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Does `setLastGitHead()` on partial-persistence success block later stale detection for the unpersisted files? (Iteration 5, still unconfirmed) |
| `mcp_server/handlers/code-graph/context.ts` | Does this inherit the readiness-fail-open from `code_graph_query`? (Iteration 5 hint, not fully audited) |
| `mcp_server/lib/search/graph-lifecycle.ts` | Does `onIndex()` `skipped: true` under three different conditions have the same semantics as `post-insert.ts`'s boolean collapses? |
| `mcp_server/lib/storage/reconsolidation.ts` | Does `executeMerge()` CAS also check governance scope, or only `updated_at` + `content_hash`? |
| `mcp_server/lib/search/entity-linker.ts` | Is the stale-entity blast radius per-memory or cross-memory? (R7-002 did not fully investigate) |
| `mcp_server/handlers/memory-save.ts` | What is the real timeline between reconsolidation planning and `writeTransaction` acquisition under load? |
| `mcp_server/hooks/claude/shared.ts:109-123` | Can a crafted `producer` string containing `]` or newline actually break the `[PROVENANCE:]` marker? (R10-002 identifies risk, not confirmed) |
| `mcp_server/hooks/claude/compact-inject.ts` | Does it use the same unlocked `updateState()` pattern, or serialize on a different path? |
| `skill_advisor.py` | Are the hand-maintained keyword/phrase tables generated from or synced against `SKILL.md` metadata, or fully manual? |
| `.opencode/command/spec_kit/` (YAML assets) | Do emitted `folderState` events use the `populated` or `populated-folder` token — and are they tested? |

---

## Appendix A — Finding Catalog: Iterations 33-41

*Format: `RN-NNN` | File:lines | Severity | Short description*
*For R1-001 through R32-005, see Appendix A in `interim-synthesis-32-iterations.md`.*

```
R33-001 | hook-state.ts:184-205; session-prime.ts:43-46,281-287                                             | P1 | clearCompactPrime clears by session ID, not payload identity; newer payload erased on overlap
R33-002 | session-stop.ts:119-125,244-268; hook-state.ts:221-241                                            | P1 | overlapping stop hooks can regress lastTranscriptOffset backwards; no monotonicity guard
R33-003 | hook-state.ts:170-180,221-241; session-stop.ts:60-67,119-125,261-309                              | P1 | failed saveState does not abort autosave; runContextAutosave can persist stale disk state
R34-001 | session-stop.ts:119-125,261-269,302-318; hook-state.ts:221-240                                    | P1 | producerMetadataWritten is an attempted-write flag, not a durable postcondition
R34-002 | reconsolidation-bridge.ts:261-306; reconsolidation.ts:599-694; memory-save.ts:2159-2171,2250-2304  | P1 | complement path: stale-search duplicate window between runReconsolidationIfEnabled and writeTransaction
R35-001 | reconsolidation-bridge.ts:270-295; reconsolidation.ts:467-508,610-658,952-993                      | P1 | conflict lane not single-winner; two concurrent saves can both supersede same predecessor, forking lineage
R35-002 | session-stop.ts:119-125,313-317; hook-state.ts:170-180,221-240                                    | P2 | touchedPaths appended unconditionally regardless of saveState outcome; overstate durability
R35-003 | AGENTS.md:205-207; CLAUDE.md:152-155; CODEX.md:205-207; GEMINI.md:205-207; generate-context.ts:61-83 | P2 | all four runtime root docs prescribe shared /tmp/save-context-data.json handoff path
R36-001 | hook-state.ts:140-155,170-176                                                                      | P2 | loadMostRecentState stat-then-read race: concurrent rename can swap generation between mtime read and JSON read
R36-002 | reconsolidation-bridge.ts:453-501; memory-save.ts:2159-2170,2250-2304                              | P2 | assistive reconsolidation recommendation built from pre-transaction snapshot; can be stale on delivery
R36-003 | data-loader.ts:63-68; generate-context.ts:61-83                                                    | P2 | NO_DATA_FILE error text teaches callers to use shared /tmp/save-context-data.json path
R37-001 | session-stop.ts:175-190,244-252,257-268                                                            | P1 | transient lastTranscriptOffset:0 sentinel between two writes; second concurrent stop hook can re-parse from zero
R37-002 | session-stop.ts:128-145,244-246,281-296,340-369                                                    | P1 | stale currentSpecFolder preference can suppress legitimate packet retarget when another writer advanced the target
R37-003 | reconsolidation-bridge.ts:261-306,453-500                                                           | P2 | single save can observe two different pre-transaction candidate universes (TM-06 then assistive)
R38-001 | hook-state.ts:131-165; session-resume.ts:348-366                                                    | P2 | loadMostRecentState all-or-nothing try block; one bad sibling file aborts entire scan and returns null
R38-002 | hook-state.ts:243-263; session-stop.ts:321-328; gemini/session-stop.ts:77-84                        | P2 | cleanStaleStates all-or-nothing try block; partial removed count returned with no indication of skipped files
R39-001 | session-stop.ts:60-67,108-117,299-318                                                              | P1 | autosave outcome (ran/skipped/failed) never surfaced in SessionStopProcessResult; callers cannot distinguish success from silent skip
R39-002 | reconsolidation-bridge.ts:203-237,282-306                                                           | P1 | governed scope filter reads each candidate's row individually outside any transaction; mixed-snapshot candidate universe
R40-001 | hook-state.ts:170-176,247-255; session-stop.ts:321-328                                             | P2 | cleanStaleStates TOCTOU: stat-then-unlink can delete fresh state written between those two calls
R40-002 | reconsolidation-bridge.ts:203-236,282-295,453-465                                                   | P1 | (extension of R39-002) same per-candidate scope read / mixed-snapshot problem confirmed in both TM-06 and assistive paths
R41-001 | spec_kit_plan_auto.yaml:338-355,371-372; plan.md:93-99; intake-contract.md:66-77,217-222            | P2 | autonomous plan workflow uses 'populated' while canonical contract uses 'populated-folder'; interpreter-dependent string comparison
R41-002 | AGENTS.md:182-186; plan.md:86-89; complete.md:74-77                                                | P2 | Gate 3 trigger list is a prose English word list; different runtimes can classify the same request differently
R41-003 | skill_graph_compiler.py:272-353,630-663; skill_advisor.py:203-265                                  | P1 | skill-graph topology checks advisory-only; --validate-only returns success for graphs that violate routing invariants
R41-004 | manual-playbook-runner.ts:224-246,251-317,438-445                                                   | P1 | markdown→Function() eval with no sandbox; documentation drift can become arbitrary Node-side execution
```

**End of interim synthesis.**

- **Total distinct findings through iteration 41:** ~44
- **Files flagged:** 20
- **P1 volume (raw/distinct):** 54 raw / ~28 distinct
- **P2 volume (raw/distinct):** 39 raw / ~16 distinct
- **Domain 3:** complete (10/10)
- **Domain 4:** in progress (1/10; 4 findings, all P1 or P2)
- **Domain 5:** not yet started as a dedicated domain
- **Next useful increment:** continue Domain 4 (9 more passes), begin Domain 5 as a dedicated pass.
