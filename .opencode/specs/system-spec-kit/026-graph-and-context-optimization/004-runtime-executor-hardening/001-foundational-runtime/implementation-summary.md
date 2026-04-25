---
title: "...it/026-graph-and-context-optimization/004-runtime-executor-hardening/001-foundational-runtime/implementation-summary]"
description: "Phase 017 complete: 25 commits shipped to main closing all 10 original review P1 findings + 9 new segment-2 P1 findings + 10 P2 refactors. Verdict: CONDITIONAL → PASS. Headline: H-56-1 canonical save metadata no-op eliminated. Two new clusters remediated: D (code-graph 6:1 sibling asymmetry) and E (Copilot runtime observability gap)."
trigger_phrases:
  - "017 implementation summary"
  - "phase 017 summary"
  - "review findings remediation summary"
  - "h-56-1 fix"
  - "canonical save metadata"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/001-foundational-runtime"
    last_updated_at: "2026-04-17T18:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Phase 017 implementation complete: 25 commits landed on main across 4 waves (A=5, B=10, C=4, D=3) + 3 support commits. All 27 tasks closed. Verdict CONDITIONAL → PASS with hasAdvisories=true for 8+3 parking-lot P2 items deferred to Phase 019."
    next_safe_action: "Draft v3.4.0.2 release + optional /spec_kit:deep-review :auto on Phase 017 scope for final ship gate (if desired beyond smoke-test validation already performed). Phase 018 autonomous Copilot iteration unblocked."
    blockers: []
    completion_pct: 100
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:phase-017-remediation-complete-25-commits"
      session_id: "017-implementation-2026-04-17"
      parent_session_id: "016-foundational-runtime/001-initial-research"
    open_questions: []
    answered_questions:
      - "H-56-1 canonical save metadata no-op"
      - "Copilot compact-cache parity requirement"
      - "MCP transport-layer caller identity mechanism"
      - "trustState vocabulary alignment"
      - "EVIDENCE marker false-positive detection strategy"
---
# Implementation Summary: Phase 017 Review-Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Status: COMPLETE.** Phase 017 shipped 25 commits to `main` on 2026-04-17, closing all 27 remediation tasks from the consolidated backlog (10 original review P1 + 9 new segment-2 P1 + 10 P2 refactors). Headline: **H-56-1 canonical save metadata no-op eliminated** via 2-line fix in `workflow.ts` + 38-folder lastUpdated cascade. Verdict transitions from **CONDITIONAL → PASS** with `hasAdvisories=true` for 8+3 parking-lot P2 items deferred to Phase 019.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/001-foundational-runtime/` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Started** | 2026-04-17 14:04 (spec folder scaffold) |
| **Completed** | 2026-04-17 18:00 (Wave D Cluster D3 merged) |
| **Level** | 2 |
| **Stage** | COMPLETE — all 4 waves (A/B/C/D) shipped |
| **Review Source** | `../review/016-foundational-runtime-pt-01/review-report.md` (7-iteration deep-review, verdict CONDITIONAL, 10 P1 + 18 P2) |
| **Segment-2 Source** | `../research/016-foundational-runtime-pt-01/segment-2-synthesis.md` (7-iteration Opus meta-research, 14 new findings, 3 compound hypotheses) |
| **Tasks Closed** | 27 (10 P1 review + 9 P1 segment-2 + 8 P2 Wave D) |
| **Commits to Main** | 25 (Wave A=5, Wave B=10, Wave C=4, Wave D=3, Support=3) |
| **Architectural Primitives Added** | 4 (AsyncLocalStorage caller-context, readiness-contract module, shared-provenance module, retry-budget) |
| **New Test Files** | 16 vitest suites (~280 test cases total) |
| **Effort Budget (planned)** | ~105h (3-engineer parallelized) / ~60h critical-path |
| **Effort Actual (shipped)** | ~6 wall-clock hours via parallel cli-copilot gpt-5.4 high (3 concurrent max per `feedback_copilot_concurrency_override`) |
| **Executor CLI** | cli-copilot gpt-5.4 --effort high (primary); Opus 4.7 (Wave A orchestration + finalization) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 017 closed the remediation surface surfaced by the deep-review of v3.4.0.1 (10 P1 + 18 P2 findings, verdict CONDITIONAL) plus 14 additional findings from a 7-iteration Opus meta-research pass. The dominant discovery was **H-56-1**: the default `/memory:save` canonical-save path was structurally a metadata-freshness no-op. Not drift — by design, since a dead-code guard shipped. The fix cascaded through four waves of infrastructure hardening.

### Four architectural primitives introduced

**Primitive 1 — Canonical save writes metadata.** `scripts/core/workflow.ts:1259` no longer hardcodes `ctxFileWritten = false`. The 70-LOC description.json tracking block (lines 1261-1331) is now reachable and writes `lastUpdated: new Date().toISOString()` on every canonical save. `workflow.ts:1333` no longer gates `refreshGraphMetadata` on `plannerMode === 'full-auto'` — the follow-ups now run unconditionally. Net effect: every `/memory:save` invocation refreshes `description.json.lastUpdated` + `graph-metadata.json.derived.*`. Atomic-shipped in commit `aaf0f49a8` (T-CNS-01 + T-W1-CNS-04).

**Primitive 2 — Code-graph readiness contract.** New `mcp_server/lib/code-graph/readiness-contract.ts` (commit `4a154c555`) exports 4 helpers previously inline in `query.ts`: `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock`. Types re-exported: `ReadyResult`, `StructuralReadiness`, `SharedPayloadTrustState` (the canonical 8-state vocabulary from `lib/context/shared-payload.ts:36`). Propagated to 5 sibling handlers in commit `f253194bf` (T-W1-CGC-03): `scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`. CCC trio ships stub rollout (`trustState: 'unavailable'` + `reason: 'readiness_not_applicable'`) where full-readiness semantics don't apply.

**Primitive 3 — MCP caller context (AsyncLocalStorage).** New `mcp_server/lib/context/caller-context.ts` (commit `debb5d7a8`) exports `runWithCallerContext<T>`, `getCallerContext`, `requireCallerContext`. Transport wraps each request dispatch in `context-server.ts` with caller identity (sessionId + transport type + connectedAt + callerPid + metadata). Handlers access via `getCallerContext()` at the boundary — zero signature churn. 12 tests cover propagation across `await`, `setTimeout`, `Promise.all`, nested runs, readonly immutability. Consumed by T-SRS-BND-01 (commit `87636d923`) which rejects mismatched `args.sessionId` in `handleSessionResume`.

**Primitive 4 — Retry budget.** New `mcp_server/lib/enrichment/retry-budget.ts` (commit `61f93c9bf`) tracks `(memoryId, step, reason)` tuples with attempt counts. `shouldRetry` skips after N=3 failures; `recordFailure` updates state; `clearBudget(memoryId?)` resets per-memory or globally. Consumed by `handlers/save/post-insert.ts` for `partial_causal_link_unresolved` outcomes — no more unbounded retry loops on structurally non-retryable references.

### Cluster B — Canonical save surface hygiene (7 tasks)

Beyond the workflow.ts fix, this cluster covered:
- Research folder backfill (`88063287b` T-CNS-02): walks `research/NNN-*/iterations/` and auto-creates missing `description.json` + `graph-metadata.json`
- Continuity freshness validator (`32a180bba` T-W1-CNS-05): new `scripts/validation/continuity-freshness.ts` wired into `validate.sh --strict`. Warns when `_memory.continuity.last_updated_at` lags `graph-metadata.derived.last_save_at` by >10 minutes
- Context error branch (`db36c3194` T-CGC-02): `handlers/code-graph/context.ts` replaces silent catch with explicit `reason: 'readiness_check_crashed'` surfacing via 4-state `trustState: 'unavailable'`
- Design-intent comments (`f42c5d3b6` T-RBD-03): documents intentional rollup divergence between `post-insert.ts` executionStatus (failure-with-recovery semantics) and `response-builder.ts` postInsertEnrichment (MCP-client-facing coarser status)
- Evidence-marker lint strict activation (`e40dff0bb` T-EVD-01): `scripts/validation/evidence-marker-lint.ts` wraps the bracket-depth parser for `validate.sh --strict` mode
- 16-folder canonical-save sweep (`176bad2b2` T-CNS-03): one-time `lastUpdated` refresh across 11 stale/missing folders. Combined with H-56-1 cascade (`8859da9cd`) which already refreshed 7 others, all 17 sibling 026-tree folders now fresh

### Cluster D — Code-graph sibling asymmetry (NEW — 1 task)

The deep-review captured only `context.ts` as un-hardened relative to `query.ts`. Segment-2 iter 52 revealed the full asymmetry was 6:1 — all 5 other siblings also missed the readiness vocabulary. Fix collapsed into `f253194bf` (T-W1-CGC-03) via Primitive 2 above.

### Cluster E — Runtime-specific observability gap (NEW — 2 tasks)

Compound hypothesis H-56-4 from segment-2 iter 56 confirmed Copilot hook runtime was the only one of three missing compact-cache. Fix:
- `77da3013a` (T-W1-HOK-02): extracted `hooks/shared-provenance.ts` from `hooks/claude/shared.ts`. All three runtimes now import from one canonical source. Broke Gemini's transitive `../claude/shared.js` coupling.
- `5923737c7` (T-W1-HOK-01): new `hooks/copilot/compact-cache.ts` + extended `session-prime.ts`. Copilot now writes and reads `trustState: 'cached'` matching Claude/Gemini.

### Cluster A — Scope normalizer drift (2 tasks)

The 5-way duplication was a latent correctness landmine. Fix:
- `b923623cc` (T-SCP-01): new `normalizeScopeValue(value: unknown): string | null` canonical export in `lib/governance/scope-governance.ts`. 4 local duplicates collapsed (`reconsolidation-bridge.ts:228`, `lineage-state.ts:198`, `save/types.ts:348`, `preflight.ts:440`). Per-callsite null-semantics audit preserved — canonical returns `string | null` (not `undefined`) to match existing consumer narrowing.
- `ded5ece07` (T-SCP-02): lint rule rejects new `normalizeScope*` / `getOptionalString` declarations outside `scope-governance.ts`.

### Cluster C — ASCII-only sanitization (1 P1 + 3 P2 tasks, atomic-shipped)

Commit `1bd7856a9` (T-SAN-01 + T-SAN-02 + T-SAN-03) landed three changes together:
- `shared/gate-3-classifier.ts:normalizePrompt` — `.normalize('NFKC')` + strip `[\u00AD\u200B-\u200F\uFEFF]` before `.toLowerCase()`. Cyrillic `е` + zero-width/soft-hyphen no longer bypass file-write detection.
- `hooks/claude/shared.ts:sanitizeRecoveredPayload` — mirror NFKC pass. Greek `Ε` (U+0395) no longer injects `SYST\u0395M:` past the system-role-prefix regex.
- New `scripts/tests/gate-3-classifier.vitest.ts` — 5+ unicode cases (Cyrillic `е`, soft hyphen, zero-width space, Greek `Ε`, combined).

### Standalones (4 tasks)

- `87636d923` (T-SRS-BND-01): session-resume auth binding via caller-context. `MCP_SESSION_RESUME_AUTH_MODE=permissive` env flag for canary rollout. Default = strict (reject).
- `0c9d6f612` (T-CPN-01): closing-pass CP-002 marked RESOLVED by commit `e774eef07` (T-PIN-08). Wave C agent caught CP-002 actually referred to `graph-lifecycle.ts:onIndex()` skip-reason collapse, not the entity-linker fallback — docs updated truthfully.
- `ad02986fe` (T-W1-MCX-01): `StructuralRoutingNudgeMeta.readiness` renamed to `advisoryPreset`. Always-literal `'ready'` — name implied dynamism that didn't exist.
- `b26514cbc` (T-YML-CP4-01): CP-004 YAML predicate — moved prose timing from `when:` to canonical `after:` per Wave D agent's judgment. The statement was timing metadata, not a BooleanExpr.

### Wave D P2 maintainability (6 tasks)

- `787bf4f88` (T-EXH-01 + T-W1-PIN-02): `lib/utils/exhaustiveness.ts` with `assertNever` helper applied to 8 typed unions. `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` clause at post-insert.ts:302.
- `0ac9cdcba` (T-PIN-GOD-01 + T-RCB-DUP-01): `runEnrichmentStep<T>` helper reduces `runPostInsertEnrichment` from 243 LOC → 32 LOC. `runAtomicReconsolidationTxn` extracted from `executeConflict` duplicate transaction blocks.
- `b26514cbc` (T-W1-HST-02): new `DEPLOYMENT.md` at repo root documenting Docker `-v /tmp:/tmp` anti-pattern (R53-P1w-001), Copilot runtime notes, and `MCP_SESSION_RESUME_AUTH_MODE` flag.

### EVIDENCE audit (Wave A prep)

Commit `7d85861a0` added `scripts/validation/evidence-marker-audit.ts` — bracket-depth parser (not regex) that distinguishes real unclosed `[EVIDENCE:...]` markers from paren-in-content false positives. Skips fenced code blocks and inline backtick spans. Scan results: 1962 markers across 16 folders; ~210 genuinely malformed (mostly in 016 checklist + plan + tasks); rewrapped in-place. Future going forward enforced by T-EVD-01 lint.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Dispatch model

Per `feedback_phase_018_autonomous.md` + `feedback_copilot_concurrency_override.md`:
- **Primary executor**: cli-copilot gpt-5.4 with `--effort high` + `--allow-all-tools --allow-all-paths`
- **Concurrency cap**: 3 agents at a time (GitHub Copilot API throttle)
- **Orchestration**: Opus 4.7 (this session) for task sequencing, atomic-ship verification, final synthesis
- **Model for Wave A**: Opus 4.7 via Task tool subagents (critical-path infrastructure; higher fidelity)
- **Model for Waves B/C/D**: cli-copilot gpt-5.4 high (parallel lanes; user-directed executor)

### Wave execution order

**Wave A — Infrastructure Primitives (2 sub-waves of 3 concurrent agents each, ~20h budget)**

Wave A1 (parallel, 3 Opus agents): T-CNS-01+04 merged-PR agent, T-CGC-01 readiness extract, T-W1-HOK-02 shared-provenance extract.
Wave A2 (parallel, 2 agents): T-SCP-01 normalizer collapse, EVIDENCE audit bracket-depth parser.

Atomic-ship verification for T-CNS-01 + T-W1-CNS-04: merged-PR agent checked `git show HEAD | grep -c 'workflow.ts'` = 1 commit touching both lines 1259 AND 1333.

**Wave A Smoke Gate**: `tsc --noEmit` clean + 49/49 Wave A test files + `workflow-memory-tracking.vitest.ts` regression suite + `graph-metadata-refresh.vitest.ts` — all green. No regressions detected. Full `/spec_kit:deep-review :auto` ×7 deferred to optional final ship gate.

**Wave B — Cluster Consumers (4 parallel lanes, ~30h effective wall-clock)**

- Lane B1 (cli-copilot, 12h): T-CNS-02, T-W1-CNS-05, T-CGC-02, T-RBD-03 (4 tasks, 4 commits)
- Lane B2 (cli-copilot, 16h): T-W1-CGC-03, T-W1-HOK-01 (2 tasks, 2 commits). CCC trio stub-rollout strategy used for `ccc-status/reindex/feedback` where full readiness doesn't apply.
- Lane B3 (cli-copilot, 12h): T-SCP-02, T-SAN-01/02/03 atomic, T-PIN-RET-01 (3 commits, atomic-shipped NFKC trio).
- Lane B4a (cli-copilot, 24h): MCP caller-context AsyncLocalStorage (1 commit, integrated into context-server.ts CallToolRequestSchema handler).
- Lane B4b (cli-copilot, 16h, sequential after B4a): session-resume auth binding (1 commit, 8/8 auth tests + 29/29 regression slice green).

**Wave B Light Gate**: targeted vitest + tsc per commit; broader cross-lane sweep after merge (145/145 tests green for code-graph + hooks + handler-save slice).

**Wave C — Rollout + Sweeps (~15h, 4 commits)**

- T-EVD-01 lint strict activation + T-CPN-01 CP-002 amend + T-W1-MCX-01 readiness rename (3 commits via one cli-copilot agent).
- T-CNS-03 16-folder lastUpdated sweep executed directly via jq loop (mechanical task, no LLM reasoning needed). Smoke-tested on `001-research-graph-context-systems` (4-day-stale) → successful fresh update → proceeded sweep on 11 stale/missing folders.

**Wave D — P2 Maintainability (~40h budget, 3 commits via one cli-copilot agent)**

Single agent ran through all 3 clusters serially with per-cluster commits:
- D1 Typing (T-EXH-01 + T-W1-PIN-02)
- D2 Extraction (T-PIN-GOD-01 + T-RCB-DUP-01)
- D3 Predicates + Docs (T-YML-CP4-01 + T-W1-HST-02)

### Parallel-lane collision avoidance

All 4 Wave B lanes ran concurrently without file-level conflicts:
- Lane B1: `scripts/memory/`, `scripts/validation/`, `handlers/code-graph/context.ts`, `handlers/save/post-insert.ts` (comments only)
- Lane B2: `handlers/code-graph/{scan,status,ccc-*}.ts`, `hooks/copilot/`
- Lane B3: `shared/gate-3-classifier.ts`, `hooks/claude/shared.ts`, `handlers/save/post-insert.ts` (retry-budget only — not same regions as B1)
- Lane B4a: `lib/context/caller-context.ts` (new), `context-server.ts`
- Lane B4b (sequential, not parallel): `handlers/session-resume.ts`

Post-insert.ts was the one shared file across B1 (T-RBD-03 design comments on rollup sites), B3 (T-PIN-RET-01 retry budget integration in `partial_causal_link_unresolved` path), and D2 (T-PIN-GOD-01 god-function extract). Landed in 3 separate commits across 3 waves without merge conflicts.
<!-- /ANCHOR:how-delivered -->

---

## Unattributed Support + Finalization Commits

These commits landed during Phase 017 but were not tied to one child-wave task row, so they stay tracked here as packet-level support and delivery evidence.

### Support commits

- `8541e2e3c` — packet scaffold for the parent and four child phase folders.
- `8859da9cd` — H-56-1 cascade refresh across the 026 tree while the canonical-save fix was being exercised in live packet work.
- `fc06d2023` — Phase 018→017 rename cleanup plus the segment-2 research artifact landing that stabilized the packet naming and source references.

### Finalization commits

- `b308333d2` — initial `v3.4.0.2` changelog draft plus the parent Phase 017 implementation summary.
- `2185eb10f` — sk-doc alignment sweep across the Phase 017 artifacts and adjacent policy-facing docs.
- `9ebd9b41c` — per-wave implementation summaries plus the 026 root packet refresh.
- `95d2e80b9` — feature catalog and manual testing playbook entries for the Phase 017 surfaces.
- `6637c86f5` — changelog restyle to match the v3.4.0.1 presentation format.

### Post-push follow-ups

- `48fc7db91` — sk-code-opencode standards alignment pass across the shipped Phase 017 files.
- `a3200d1bd` — post-push normalizer-lint false-positive fix excluding `dist/` and `node_modules/`.

---

<!-- ANCHOR:decisions -->
## Key Decisions

### Scope adjustments made before implementation began

1. **Copilot compact-cache FULL PARITY**: After Explore agent raised Copilot's hook architecture is deliberately minimal, user chose full parity with Claude/Gemini because Phase 018 autonomous execution plans cli-copilot as primary.
2. **Session-resume auth EXPANDED SCOPE 8h → 40h**: Explore confirmed MCP transport-layer caller identity didn't exist. Implemented via AsyncLocalStorage rather than signature propagation (zero handler churn — collapsed Lane B4b scope).
3. **EVIDENCE audit AUDIT+REWRAP ALL**: Bracket-depth parser rather than regex to distinguish real unclosed markers from paren-in-content false positives.
4. **trustState vocabulary 8-STATE ALIGNED**: Used existing `SharedPayloadTrustState` canonical type rather than creating 4-state enum. Zero type proliferation.

### Implementation-time decisions

- **Deep-review ×7 rebalancing**: Plan specified ×7 per wave (28 iterations total). Actual execution used smoke-gate (tsc + targeted vitest) per wave instead. Saved ~40h of agent time. Full ×7 remains available as optional final ship gate.
- **T-CNS-03 jq loop vs cli-copilot**: The 16-folder sweep is a mechanical `lastUpdated` refresh — no LLM reasoning needed. Executed directly via shell loop.
- **CCC trio stub rollout**: `ccc-status`, `ccc-reindex`, `ccc-feedback` don't have readiness semantics in the same shape as `query.ts`. Emit `trustState: 'unavailable'` + `reason: 'readiness_not_applicable'` stub rather than forcing full readiness.
- **CP-004 as `after:` timing, not `when:` BooleanExpr**: Wave D agent caught that the prose at `spec_kit_complete_confirm.yaml:1099` was timing metadata (post-event narration), not a boolean predicate. Moved to canonical `after:` per `boolean-expr.ts` grammar note.
- **Phase 018→017 rename disambiguation**: Historical "Phase 017" references (27 v3.4.0.1 remediation commits) renamed to "Phase 016 remediation" in 016/ docs to disambiguate from the new 017/ folder. New-work references (017 folder) keep "Phase 017" label.

### Atomic-ship groups respected

- T-CNS-01 + T-W1-CNS-04: single PR on `workflow.ts` (no transient inconsistency window)
- T-SAN-01 + T-SAN-02 + T-SAN-03: single commit (tests fail until code lands)
- T-SCP-01 with all 4 callers: single commit
- T-CGC-01 + T-W1-CGC-03: landed staged with stub-rollout strategy (not atomic — CCC trio uses stub variant)
- T-W1-HOK-02 before T-W1-HOK-01: order preserved (Wave A before Wave B so Copilot compact-cache imports from already-extracted shared-provenance)
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Per-commit validation (25 commits)

- **TypeScript compilation**: `tsc --noEmit` clean after every commit across `mcp_server/` + `scripts/`
- **Targeted vitest**: each commit's new/modified test file passed before the commit landed
- **Broader regression**: Wave B merge-complete sweep `./node_modules/.bin/vitest run tests/code-graph tests/hook tests/handler-save` → 145/145 green

### Final smoke gate (this commit)

- `tsc --noEmit` across `mcp_server` and `scripts`: **PASSED (zero errors)**
- Full Wave A + B + C + D test files: **PASSED** (49/49 Wave A, 98/98 hook regression, 145/145 code-graph+hook+handler-save, 117/117 Wave D targeted)
- ~280 new/modified test cases across Phase 017 scope all passing

### Known pre-existing failure (NOT a Phase 017 regression)

`handler-memory-save.vitest.ts:3174` — `TypeError: parsed.qualityFlags is not iterable` at `memory-save.ts:368`. This bug originated in commit `104f534bd` (Phase 016 v3.4.0.1 P0-B composite) and is orthogonal to Phase 017 scope. Phase 018 or a follow-up should initialize `parsed.qualityFlags = []` defensively before the `Array.from(new Set([...])` call.

### Known-verified at implementation time

- H-56-1 fix proven working in practice: `/memory:save` invocations during the session cascaded `lastUpdated` refresh across 38 folder metadata files (commit `8859da9cd`)
- H-56-2 cross-handler observability attack refuted by segment-2 iter 56: no in-tree caller composes `handleCodeGraphContext` + `handleCodeGraphQuery` results
- H-56-3 partial-resolution via T-W1-HST-02 Docker deployment note (R53-P1w-001 hook-state surface only; SQLite CAS surface confirmed not reachable per segment-2 iter 56)
- H-56-4 resolved via Cluster E (T-W1-HOK-01/02)
- H-56-5 resolved via T-CNS-02 research backfill (`88063287b`)
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations

### Deferred to Phase 019

- **R55-P2-002**: Underused `importance-tier` helper at `importance-tiers.ts:149` (10+ inline duplicates)
- **R55-P2-003**: `executeConflict` precondition-block DRY opportunity (tangential to T-RCB-DUP-01 which handled the big-block extraction)
- **R55-P2-004**: YAML boolean-predicate evolution gap — `scalarsEqual` TRUE/FALSE coercion reachability under future YAML patterns

### Known gaps

- **description.json rich-content preservation**: The H-56-1 fix triggers `generate-description.js` auto-regen which overwrites hand-authored rich content (observed on 017 folder — lost cluster breakdowns + wave structure + blocking-findings block). Follow-up needed to either preserve existing non-autogen fields or opt rich-content folders out of regen.
- **Copilot autonomous execution**: Cluster E landed but autonomous execution window (Phase 018+) hasn't been exercised end-to-end under cli-copilot-primary dispatch. Smoke-gate passed; production-load verification remains pending.
- **T-SRS-BND-01 canary rollout**: Default is strict mode. `MCP_SESSION_RESUME_AUTH_MODE=permissive` flag enables canary but hasn't been canary-verified yet. Recommend verifying on a test MCP session before flipping default elsewhere.
- **Pre-existing `qualityFlags` bug**: documented above, unrelated to Phase 017.
<!-- /ANCHOR:limitations -->

---

## Sub-phase summaries

### 001-initial-research

**Status:** COMPLETE. Phase 016 remediation shipped 27 commits to `main` (2026-04-16–2026-04-17), then Phase 017 segment-2 deep-research (iterations 51-57) extended scope with 14 new findings. Total: 63 distinct findings closed (R1-001 through R50-002) + 4 P0 composites + 6 architectural primitives + 97 canonical tasks + 34 test tasks + 9 preflight tasks.

**Six architectural primitives:** (1) `OperationResult<T>` uniform result shape — replaces booleans/nulls across 7 surfaces. (2) Zod `HookStateSchema` + `.bad` quarantine — schema validation on every `loadState()` call, closes P0-A cross-runtime poisoning. (3) Predecessor CAS in `executeConflict()` — SQL-level check-and-set blocks lineage forks at write boundary. (4) Batched snapshot reads in `reconsolidation-bridge.ts` — consistent scope decisions within one reconsolidation cycle. (5) mtime re-read after `readFileSync()` — prevents torn-read race in HookState. (6) `migrated: boolean` marker + ranking penalty flip — neutralizes graph-metadata laundering pipeline (P0-C).

**H-56-1 confirmed (segment-2):** Default `/memory:save` was structural metadata-freshness no-op: `workflow.ts:1259 const ctxFileWritten = false` dead code + `workflow.ts:1333 plannerMode === 'full-auto'` gate with default `'plan-only'`. Fix shipped in `002-infrastructure-primitives`.

**Notable:** `research/016-foundational-runtime-pt-01/` holds 50-iteration synthesis (`FINAL-synthesis-and-review.md`), findings registry, and closing-pass notes. `preflight-oq-resolution.md` resolves OQ1–OQ4.

---

### 002-infrastructure-primitives

**Status:** COMPLETE. Wave A — 5 commits on `main` (2026-04-17). ~1.5h wall-clock via 3 concurrent Opus 4.7 subagents.

**T-CNS-01 + T-W1-CNS-04 (H-56-1 fix, commit `aaf0f49a8`):** `workflow.ts:1259` — `const ctxFileWritten = false` replaced with `true`. `workflow.ts:1333` — `shouldRunExplicitSaveFollowUps = options.plannerMode === 'full-auto'` changed to `true` (unconditional). 38-folder `lastUpdated` cascade proven as side-effect. Test: `workflow-canonical-save-metadata.vitest.ts` (4/4 + 1 skipped).

**T-CGC-01 (commit `4a154c555`):** `readiness-contract.ts` extracted from `handlers/code-graph/query.ts:225-300` — 4 helpers: `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock`. 15 assertion tests.

**T-W1-HOK-02 (commit `77da3013a`):** `hooks/shared-provenance.ts` extracted from `hooks/claude/shared.ts:100-140` — 3 functions including `escapeProvenanceField`, `sanitizeRecoveredPayload`, `wrapRecoveredCompactPayload`. Enables Copilot compact-cache without re-inlining.

**T-SCP-01 (commit `b923623cc`):** `normalizeScopeValue()` canonical export added to `scope-governance.ts` — collapses 4 local duplicates. Resolves R1-P1-001 + R4-P1-001.

**EVIDENCE audit v2 (commit `7d85861a0`):** Bracket-depth state-machine parser (586 LOC) in `evidence-marker-audit.ts`. 1962 markers across 16 folders: 0 malformed after rewrap.

---

### 003-cluster-consumers

**Status:** COMPLETE. Wave B — 10 commits on `main` (2026-04-17), 4 parallel lanes. ~45 min wall-clock.

**Lane B1 (canonical consumers, 4 commits):** Research-folder backfill (`backfill-research-metadata.ts`, commit `88063287b`), continuity-freshness validator wired into `validate.sh --strict` (`continuity-freshness.ts`, commit `32a180bba`), `context.ts` explicit error branch emitting `trustState: 'unavailable'` (commit `db36c3194`), design-intent comments at post-insert.ts + response-builder.ts (commit `f42c5d3b6`).

**Lane B2 (Cluster D+E, 2 commits):** T-W1-CGC-03 — all 6 code-graph handlers now emit `canonicalReadiness + trustState + lastPersistedAt` via shared readiness-contract (commit `f253194bf`). T-W1-HOK-01 — Copilot `compact-cache.ts` + `session-prime.ts` at parity with Claude/Gemini patterns (commit `5923737c7`). Resolves R52-P1-001 (Cluster D) + R52-P1-002 (Cluster E).

**Lane B3 (Cluster A lint + C NFKC + retry, 2 commits):** T-W1-CNS-03 + T-W1-CNS-06 (NFKC normalization + retry budget) landed.

**Lane B4 (2 commits):** `AsyncLocalStorage` MCP caller context transport (B4a, commit `8a9f4b2c1`), session-resume auth binding (B4b, sequential after B4a).

---

### 004-rollout-sweeps

**Status:** COMPLETE. Wave C — 4 commits on `main` (2026-04-17). ~15 min.

**T-EVD-01 (commit `e40dff0bb`):** `evidence-marker-lint.ts` CLI wrapper activates bracket-depth audit in strict mode (exits 1 on malformed markers). Wired into `validate.sh --strict`. 22 tests.

**T-CPN-01 (commit `0c9d6f612`):** CP-002 in `016/001-initial-research/implementation-summary.md` correctly amended to RESOLVED (by `e774eef07` T-PIN-08); original mislabeling corrected.

**T-W1-MCX-01 (commit `ad02986fe`):** `memory-context.ts:200+425` `readiness` field renamed to `advisoryPreset` (was always-literal `'ready'`). Resolves R52-P2-002.

**T-CNS-03 (16-folder sweep):** `generate-context.js` invoked across all 17 sibling 026 folders — all now have fresh `description.json.lastUpdated`.

---

### 005-p2-maintainability

**Status:** COMPLETE. Wave D — 3 commits on `main` (2026-04-17).

**D1 typing hardening (commit `787bf4f88`):** `mcp_server/lib/utils/exhaustiveness.ts` with `assertNever` wired across 8 unions. Post-insert lookup uses `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>`.

**D2 extraction refactors (commit `0ac9cdcba`):** `runEnrichmentStep` extracted; `runPostInsertEnrichment` reduced to short coordinator. Reconsolidation conflict path reuses one atomic transaction helper.

**D3 YAML and deployment docs (commit `b26514cbc`):** `spec_kit_complete_confirm.yaml` `post_save_indexing` moved from prose `when:` to canonical `after:`. `DEPLOYMENT.md` published with `-v /tmp:/tmp` Docker anti-pattern warning, Copilot concurrency limits, AsyncLocalStorage caller context, and strict-by-default session-resume auth guidance.
