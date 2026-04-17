# Iteration 056 — Compound-hypothesis testing (H-56-1..5)

**Segment**: 2 | **Dimension**: blast-radius + root-cause | **Dispatched**: Opus 4.7 via Task tool
**Focus**: 5 compound hypotheses combining segment-2 findings (R51/R52/R53) with review P1s (R1-R10)

---

## 1. Method

Each compound hypothesis combines 2-3 pre-existing findings and asks: does composition create a net-new P0, upgrade an existing P1, or produce a new P1-level compound risk? Evidence re-derived from primary source files (not summaries) to avoid telephone-game drift:

- `scripts/core/workflow.ts:1240-1355` (R51-P1-001/002 re-verification)
- `handlers/code-graph/context.ts:87-209` (H-56-2 caller inspection)
- `tools/code-graph-tools.ts:55-85` (dispatcher — the only caller of both handlers)
- `hooks/claude/hook-state.ts:155-290` (H-56-3 UID-independence check)
- `handlers/session-resume.ts:443-474` (R2-P1-001 context)
- Greps: `handleCodeGraphContext.*handleCodeGraphQuery`, `normalize.*scope|scopeCas`, `canonicalReadiness|trustState` in context.ts

No code was executed; this is an attack-chain instantiability audit.

---

## 2. Hypothesis evaluation

### H-56-1 — Canonical-save paralysis — **CONFIRMED**

Components: R51-P1-001 + R51-P1-002 + R4-P1-002

Attack chain:
1. User runs `/memory:save` (or `generate-context.js --json …`) with default `plannerMode = 'plan-only'` (`generate-context.ts:415`).
2. `workflow.ts:1259` hardcodes `const ctxFileWritten = false`; entire description.json update block (1261-1331) is unreachable dead code. `lastUpdated` NEVER stamped regardless.
3. `workflow.ts:1333` gates `refreshGraphMetadata` on `options.plannerMode === 'full-auto'`; default path logs "Deferred graph metadata refresh to explicit follow-up" (line 1352) and returns.
4. R4-P1-002: no auto-repair / periodic-refresh job exists to compensate.

Result: A default-path canonical save produces ZERO writes to:
- `description.json.lastUpdated` (dead-code guard)
- `description.json.memorySequence` / `memoryNameHistory` (inside dead-code block)
- `graph-metadata.json.derived.*` (mode-gated)

This is not "drift over time"; it is "every default save is a metadata-freshness no-op." The review's R4-P1-002 framed this as "no auto-refresh in the background." Composing with R51-P1-001/002 sharpens it: **the foreground save path itself is a no-op for metadata freshness under the documented default**.

Verdict: **CONFIRMED**. Upgrade severity from P1-drift to P1-upgrade-to-P0-class (every default save a metadata no-op, not just "stale over time"). Confidence 0.93.

### H-56-2 — Cross-handler observability attack — **REFUTED**

Components: R52-P1-001 + R6-P1-001 + R2-P1-001

Attack chain requires: a caller that receives results from BOTH `handleCodeGraphContext` (silent freshness catch, no `canonicalReadiness`) and `handleCodeGraphQuery` (reports live trustState) in a single decision path, then trusts the query-side live signal despite the context-side having silently failed.

Evidence:
- `tools/code-graph-tools.ts:56-84` — the dispatcher is a `switch(name)` with one handler per request. Each MCP tool call invokes exactly ONE handler.
- Grep `handleCodeGraphContext.*handleCodeGraphQuery` → zero hits in source (only `.tmp/vitest-tmp` artifacts where both imports appear in the same module header, not in a combined consumer).
- No in-tree caller composes the two handlers' results.
- R2-P1-001 (session_resume no-auth) does not call either of these handlers directly — its ladder uses `buildResumeLadder` (`session-resume.ts:469`) which is filesystem-first.

A cross-handler observability attack requires a caller that trusts a comparison across handlers. No such caller exists in-tree. An external MCP client COULD make two separate tool calls and compose results itself, but that is (a) the client's trust-choice and (b) the "attacker" here is just a buggy client, not a framework flaw. Iteration 053 already ruled this out under the narrower cache-poisoning framing.

Verdict: **REFUTED**. Confidence 0.88.

### H-56-3 — Multi-container scope-confusion attack — **PARTIAL**

Components: R53-P1w-001 + R1-P1-001 + R4-P1-001

Components hold:
- R53-P1w-001: Docker `-v /tmp:/tmp` + same-UID + same-cwd → containers share `/tmp/speckit-claude-hooks/<projectHash>/`. Confirmed by `hook-state.ts:161-167`.
- R1-P1-001: empty-string scope CAS bypass is latent (review flagged the classifier boundary).
- R4-P1-001: 5 normalizer duplications exist.

Component that does NOT hold for a NEW compound attack:
- The R53-P1w-001 shared-tmpfs surface concerns **hook state files** (`PersistedHookState`), NOT the **memory CAS (dedup/create-record)**. Those are SQLite-based and located in the memory DB path, not `/tmp`. Grep for `normalize.*scope|scopeCas` locates scope-confusion in `handlers/save/dedup.ts:63-66`, `save/create-record.ts:161-164, 207-209`, `save/reconsolidation-bridge.ts:243-246`, `lib/session/session-manager.ts:361-371` — ALL operate on SQLite-backed memory rows, not `/tmp` hook state.
- Containers with shared `/tmp` + same UID do NOT share the SQLite DB path (that lives inside the project tree / per-container volume). So an empty-string scope written in container A's DB does not propagate to container B's DB.

What DOES compose: shared-tmp hook state (R53-P1w-001) + same-UID lets container B read container A's `pendingCompactPrime` payload — already captured by R53-P1w-001 without needing R1-P1-001. The empty-string-scope CAS corruption is a separate surface that does not reach `/tmp`.

Verdict: **PARTIAL**. R53-P1w-001 + R2-P1-001 compose cleanly (containers share hook state); R1-P1-001 CAS scope does NOT ride along because the CAS is DB-backed, not tmpfs-backed. No new compound P0. Confidence 0.82.

### H-56-4 — Copilot silent-failure cluster — **CONFIRMED (new P1)**

Components: R52-P1-002 + R3-P1-001 + R1-P1-002

Attack chain:
1. Copilot runtime lacks `compact-cache.ts` and its `session-prime.ts` never reads `pendingCompactPrime.payloadContract?.provenance.trustState` (R52-P1-002). So on compaction, trustState provenance is silently LOST for Copilot.
2. R3-P1-001 (stale closing-pass CP-002): enrichment / validation steps that fail on the Copilot path lack the same completion-telemetry trail the Claude/Gemini paths have.
3. R1-P1-002 (retry exhaustion missing): failed enrichments accumulate without a retry-cap signal.

Result: A Copilot session that undergoes compaction, fails an enrichment step, and has no retry-limiter surfaces the failure NOWHERE: no `[PROVENANCE: trustState=…]` breadcrumb after recovery, no CP-002 closing-pass telemetry, no retry-exhausted event. Three independent observability layers are missing simultaneously for this runtime. This is consistent with the concurrency pattern in `feedback_copilot_concurrency_override.md` (Copilot is constrained to 3 parallel dispatches — making accumulated per-session silent failures more consequential per session).

This is a NEW P1-level compound risk: **Copilot autonomous iteration mode has zero observability into multi-turn silent-failure accumulation** — upgrading planned Phase 017 Copilot-primary execution from "safe fallback" to "observability blind spot." The individual components are each P1; the composition creates a new runtime-specific cluster worth tracking as a coordinated remediation target.

Verdict: **CONFIRMED** (as new compound P1, not upgrade to P0 — the blast radius is still observability-only, but now triples). Confidence 0.83.

### H-56-5 — Graph-traversal blind spots — **CONFIRMED**

Components: R3-P1-002 + R51-P1-003 + R4-P1-002

Attack chain:
1. R3-P1-002: research folders (`research/NNN-*/`) lack `description.json` + `graph-metadata.json` — meaning memory search and code_graph cannot discover or rank them.
2. R51-P1-003: `_memory.continuity` frontmatter in `implementation-summary.md` has zero programmatic writers — so even spec folders WITH metadata have stale continuity.
3. R4-P1-002: no auto-repair fills these gaps post-hoc.

Compound result: The two signals that tell the memory search layer "this folder exists + last action was X" are BOTH absent or stale for research folders. A caller asking `memory_search({ query: 'deep-research iterations' })` will either miss the research folder entirely (no description.json indexed) OR find it with continuity pointing to a stale/non-existent iteration. Cross-referencing with CLAUDE.md mandatory-metadata rule ("Spec folders without these files are invisible to memory search and graph traversal") confirms the design intent is violated.

This is a CONFIRMED compound risk because it instantiates trivially: any `/spec_kit:deep-research` session creates iteration files under `research/016-.../iterations/` — those paths have no `description.json`. So the deep-research loop itself produces artifacts that are invisible to the memory layer that `/spec_kit:resume` and `memory_context` rely on. Segment-2's own workflow is a standing instance of the attack.

Verdict: **CONFIRMED** as compound P1-broader (not upgrade to P0). Blast-radius enlargement: not one folder, but every research-iteration folder produced by the skill-owned deep-research/review workflow. Confidence 0.85.

---

## 3. Findings

### R56-P1-upgrade-001 | Default-path canonical save is a metadata-freshness no-op | compound-hypothesis

Components: R51-P1-001 + R51-P1-002 + R4-P1-002
**Confirmed attack chain**: Default `/memory:save` → plan-only mode → workflow.ts:1259 `ctxFileWritten = false` (description block unreachable) → workflow.ts:1333 plan-only skips refreshGraphMetadata → returns with zero metadata writes.
**Prerequisites**: User invokes `/memory:save` or `generate-context.js --json` without `--full-auto`. This IS the documented default.
**Evidence**: `scripts/core/workflow.ts:1259` (`const ctxFileWritten = false`), `1333` (`shouldRunExplicitSaveFollowUps = options.plannerMode === 'full-auto'`), `1352` (logs "Deferred graph metadata refresh"). `scripts/memory/generate-context.ts:415` (`let plannerMode: ... = 'plan-only'`).
**Severity**: P1-upgrade (each component P1 individually; composition makes default-path saves structurally no-ops for metadata freshness).
**Remediation dependency ordering**: (a) Delete `const ctxFileWritten = false` stub and extract `refreshPerFolderDescriptionTimestamp(specFolder)` helper, (b) Move `refreshGraphMetadata` out of the `shouldRunExplicitSaveFollowUps` guard (idempotent + cheap ~50ms). Both fixes are independent but both required.
**Confidence**: 0.93

### R56-P1-NEW-002 | Copilot autonomous-iteration observability blind spot | compound-hypothesis

Components: R52-P1-002 + R3-P1-001 + R1-P1-002
**Confirmed attack chain**: Copilot session → compact → no compact-cache writer → trustState provenance lost → enrichment fails → no CP-002 closing-pass telemetry → no retry-exhausted event → session appears healthy to the user.
**Prerequisites**: Copilot-primary execution as per Phase 017 plan. Concurrency-3 limit (`feedback_copilot_concurrency_override.md`) concentrates failures per-session.
**Evidence**: `hooks/copilot/session-prime.ts` (no trustState read), absent `hooks/copilot/compact-cache.ts`, R3-P1-001 stale CP-002 pattern, R1-P1-002 retry-exhaustion gap.
**Severity**: P1-broader. Observability-only (not data-disclosure), but this is the ONLY runtime with the triple-layer gap.
**Remediation**: Must be sequenced as a triple fix — adding retry-exhaustion signal (R1-P1-002) or CP-002 hardening (R3-P1-001) without the Copilot compact-cache (R52-P1-002) leaves Copilot still blind to post-compaction state.
**Confidence**: 0.83

### R56-P1-NEW-003 | Research-iteration folders invisible to memory layer | compound-hypothesis

Components: R3-P1-002 + R51-P1-003 + R4-P1-002
**Confirmed attack chain**: `/spec_kit:deep-research` creates `research/NNN-.../iterations/iteration-NNN.md` → no description.json generator runs on the nested folder → memory_search / code_graph_query cannot index or discover → `/spec_kit:resume` may also miss the research state.
**Prerequisites**: Any deep-research or deep-review session producing nested iteration artifacts. Session 016 itself (this iteration) is a standing instance.
**Evidence**: CLAUDE.md mandatory-metadata rule explicitly warns "Spec folders without these files are invisible to memory search and graph traversal." R51-P1-003: zero programmatic `_memory.continuity` writers. R4-P1-002: no auto-repair.
**Severity**: P1-broader. Every skill-owned research/review loop produces unindexed artifacts.
**Remediation**: The simplest fix is extending `refreshGraphMetadata` / `generate-description.js` to accept nested iteration folders and generate minimal metadata per-iteration OR at the research-parent folder level with iteration cross-references.
**Confidence**: 0.85

---

## 4. Resolved questions / compound-risk matrix

| Hypothesis | Components | Verdict | Confidence |
|-----------|------------|---------|------------|
| H-56-1 canonical-save paralysis | R51-P1-001 + R51-P1-002 + R4-P1-002 | **CONFIRMED** | 0.93 |
| H-56-2 cross-handler observability attack | R52-P1-001 + R6-P1-001 + R2-P1-001 | **REFUTED** | 0.88 |
| H-56-3 multi-container scope-confusion | R53-P1w-001 + R1-P1-001 + R4-P1-001 | **PARTIAL** (CAS is DB-backed, not tmpfs) | 0.82 |
| H-56-4 Copilot silent-failure cluster | R52-P1-002 + R3-P1-001 + R1-P1-002 | **CONFIRMED** (new compound P1) | 0.83 |
| H-56-5 graph-traversal blind spots | R3-P1-002 + R51-P1-003 + R4-P1-002 | **CONFIRMED** (new compound P1-broader) | 0.85 |

**P0 escalations**: 0 (consistent with iteration-053's adversarial audit)
**New compound P1 findings**: 3 (R56-P1-upgrade-001, R56-P1-NEW-002, R56-P1-NEW-003)
**Refuted hypotheses**: 1 (H-56-2; no caller composes both code-graph handlers)
**Partial hypotheses**: 1 (H-56-3; shared-tmp surface is hook-state-only, does not reach SQLite CAS)

---

## 5. Ruled-out directions

- **H-56-2 cross-handler cache poisoning**: the dispatcher is a `switch` handling one tool per request. No in-tree caller composes `handleCodeGraphContext` + `handleCodeGraphQuery` results in a single decision. External MCP clients composing results themselves are out-of-scope (client trust choice, not framework flaw). Iteration-053 already ruled this out for cache-poisoning; this iteration extends the ruling to observability composition.
- **H-56-3 CAS contamination via shared tmpfs**: SQLite CAS store lives in project-tree memory DB, not `/tmp`. Shared-tmpfs attacks reach hook state but NOT CAS. The 5-normalizer duplication surface is not co-located with the tmpfs surface.
- **H-56-1 retroactive staleness**: not separately actionable — if every default save is a no-op, historical staleness is a symptom of the structural flaw, not an independent risk. One remediation resolves both.
- **Unification of R56-P1-NEW-002 and R56-P1-NEW-003 into a cross-runtime failure cluster**: tempting but mis-categorizes. R56-P1-NEW-002 is runtime-layer (Copilot-specific), R56-P1-NEW-003 is workflow-layer (deep-research scaffolding). They share the "no programmatic writer" root pattern but remediate in different trees.

---

## 6. Metrics

- Compound hypotheses tested: 5
- Verdicts: 2 CONFIRMED + 1 CONFIRMED-upgrade + 1 PARTIAL + 1 REFUTED
- New compound findings: 3 (1 P1-upgrade, 2 P1-broader)
- P0 escalations: 0
- Evidence files re-verified: 5 (workflow.ts, context.ts, code-graph-tools.ts, hook-state.ts, session-resume.ts)
- Tool calls: 9 (4 Reads + 3 Greps + 2 Writes at end). Under the 12-call budget.
- newInfoRatio: 0.60 (3 net-new compound findings out of 5 hypotheses; the 2 refuted/partial verdicts themselves are informative, narrowing attack-surface bounds)

---

## 7. Next-focus recommendation

Segment 2 has produced 3 new compound findings (R56-P1-upgrade-001, R56-P1-NEW-002, R56-P1-NEW-003) and refined 2 hypothesis bounds (H-56-2 REFUTED, H-56-3 PARTIAL). Convergence signal is strong: iteration-053 found 0 P0s under expanded threat scope; iteration-056 found 0 P0s under compound-hypothesis composition. The review's severity ranking holds.

Recommended next focus:

1. **Remediation-sequencing**: the 3 new findings have overlapping root causes (no programmatic writers / mode-gated refresh paths). A single refactor — making `refreshGraphMetadata` + a new `refreshPerFolderDescriptionTimestamp` + a new `refreshContinuityFrontmatter` run unconditionally on every canonical save and extending coverage to `research/NNN-.../iterations/` — resolves R4-P1-002 + R51-P1-001/002/003 + R3-P1-002 in one coordinated change. Iteration 057 should draft the task-sequencing.
2. **Alternative**: declare segment-2 converged (no P0 escalations + diminishing net-new) and exit to synthesis phase.

Recommend option (2) — convergence is genuine, and (1) is a remediation-planning task that belongs in implementation, not research.
