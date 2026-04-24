# Iteration 052 — Sibling-asymmetry pattern recurrence (KQ-51-2)

**Segment**: 2 | **Dimension**: cross-cutting-coverage | **Dispatched**: Opus 4.7 via Task tool
**Focus KQ**: KQ-51-2 — Does the R6-P1-001 sibling-asymmetry pattern (one sibling in a family receives T-CGQ-09/10/11/12 trust-state hardening while its peers do not) recur elsewhere in the runtime?

## 1. Method

Systematic token-grep sweep across five handler/hook families for the canonical 4-state trust-state hardening tokens introduced by T-CGQ-09/10/11/12 and T-SHP-01 (M8):

- `trustState` / `canonicalReadiness` / `lastPersistedAt` — the R6-P1-001 triad
- `structuralTrust` / `freshnessAuthority` — the query-level trust axis
- Literal vocabulary: `'live'` / `'stale'` / `'absent'` / `'unavailable'`

For each family, the hardened sibling serves as the reference contract and remaining siblings are measured for parity. A sibling is classified **hardened** (≥3 tokens, emits both canonicalReadiness and trustState), **partial** (1-2 tokens, reads trustState but does not emit), or **missing** (0 tokens).

Families inspected:

1. `handlers/code-graph/*.ts` (7 siblings)
2. `handlers/memory-*.ts` (module-root — context, resume, bootstrap, health, save, search, etc.)
3. `handlers/session-resume.ts` vs `handlers/session-bootstrap.ts` vs `handlers/session-health.ts`
4. `handlers/save/*.ts` (12 siblings) — extends R6-P2-001
5. `hooks/claude/*.ts` vs `hooks/gemini/*.ts` vs `hooks/copilot/*.ts`

## 2. Evidence

### 2.1 Code-graph family hardening parity (baseline comparison)

Token counts for `trustState|canonicalReadiness|lastPersistedAt|structuralTrust|freshnessAuthority` across all 7 `handlers/code-graph/*.ts` siblings:

| File                         | Token count | Classification |
| ---------------------------- | ----------- | -------------- |
| `code-graph/query.ts`        | 17          | **Hardened**   |
| `code-graph/scan.ts`         | 0           | **Missing**    |
| `code-graph/status.ts`       | 0           | **Missing**    |
| `code-graph/context.ts`      | 0           | **Missing** (R6-P1-001, already tracked) |
| `code-graph/ccc-status.ts`   | 0           | **Missing**    |
| `code-graph/ccc-reindex.ts`  | 0           | **Missing**    |
| `code-graph/ccc-feedback.ts` | 0           | **Missing**    |

**Significance**: R6-P1-001 tracked ONLY `context.ts`. The full code-graph family has SIX un-hardened siblings vs ONE hardened reference — a 6:1 asymmetry. Every structural read handler should emit canonicalReadiness/trustState so consumers can route on a single vocabulary, but only `query.ts` does. `scan.ts` (mutates graph state) and `status.ts` (the canonical readiness probe) are the most-consequential gaps: `status.ts` in particular is the handler consumers call to ask "is the graph live?" and it answers without the canonical 4-state vocabulary.

**Reference hardening** (`code-graph/query.ts:225-282`):
```
canonicalReadinessFromFreshness()  // fresh→ready, stale→stale, empty→missing
queryTrustStateFromFreshness()     // fresh→live, stale→stale, empty→absent
buildQueryGraphMetadata(readiness) // emits lastPersistedAt breadcrumb
buildReadinessBlock(readiness)     // unified readiness+canonicalReadiness+trustState
```

### 2.2 Memory handler family hardening

Files inspected under `handlers/memory-*.ts`:

- `handlers/memory-context.ts` — lines 200 and 425 declare `readiness: 'ready'` as a literal-narrow in a structural routing nudge. This is NOT the canonical 3-state vocabulary (`ready`/`stale`/`missing`) and emits no trustState, no canonicalReadiness, no lastPersistedAt. Line 1382 uses `source: 'unavailable' as const` — adjacent vocabulary but not wired to a sibling trust contract.
- `handlers/memory-search.ts`, `handlers/memory-crud-*.ts`, `handlers/memory-ingest.ts`, `handlers/memory-triggers.ts`, `handlers/memory-index*.ts`, `handlers/memory-bulk-delete.ts` — zero tokens.
- `handlers/memory-save.ts` — zero tokens (despite being the terminal surface for continuity writes).

**Finding**: The memory handler family has NO hardened sibling to form an asymmetry pair — this is a **whole-family gap** rather than a sibling-asymmetry, so it does not recur the R6-P1-001 pattern. However, `memory-context.ts` advertising a narrow literal `readiness: 'ready'` in an advisory block creates **vocabulary drift** that is worth tracking separately (a consumer keying on `readiness.canonicalReadiness` will find `undefined` on this surface).

### 2.3 Session handler family hardening

| File                                 | trustState emission | canonicalReadiness | lastPersistedAt | Classification |
| ------------------------------------ | ------------------- | ------------------ | --------------- | -------------- |
| `handlers/session-resume.ts`         | line 586 (`trustStateFromStructuralStatus`) | derived via `structuralContext.status` | via `observedAt` | **Hardened** |
| `handlers/session-bootstrap.ts`      | line 334 (`trustStateFromStructuralStatus`) | declared `readiness: 'ready'` (lines 52, 181) | via `structuralContext.status` | **Hardened** |
| `handlers/session-health.ts`         | line 222 (`trustStateFromStructuralStatus`) + full 4-state vocabulary at lines 43, 87-102 | derived | via `graphFreshness` mapping | **Hardened** |

**Finding**: Session family has full three-way parity (bootstrap / resume / health) on the trust-state contract. The M8 / T-SHP-01 / T-SBS-01 work reached all three siblings — no asymmetry here. This is evidence the hardening **did** land consistently for session handlers but the **same care was not taken for code-graph handlers** (query-only) or the **cross-runtime hook family** (see §2.5).

### 2.4 Save handler family hardening (extends R6-P2-001)

Token counts across 12 `handlers/save/*.ts` siblings: **all zero**.

- `response-builder.ts` (0) — the surface already flagged by R6-P2-001 for missing persisted-continuity trust info
- `post-insert.ts` (0) — the enrichment orchestrator
- `atomic-index-memory.ts`, `create-record.ts`, `dedup.ts`, `embedding-pipeline.ts`, `pe-orchestration.ts`, `reconsolidation-bridge.ts`, `validation-responses.ts`, `markdown-evidence-builder.ts`, `spec-folder-mutex.ts` — all zero

**Finding**: Like the memory family, the save family has NO hardened sibling — this is **whole-family gap**, not sibling asymmetry. R6-P2-001 covers this as a broad-stroke observation; T-RBD-01/02/03 did not propagate the hardening vocabulary here. The closest adjacent signal is `response-builder.ts:649` mentioning "graph/search freshness" in a hint string, but no structured `trustState`/`canonicalReadiness` field.

### 2.5 Hooks runtime parity (Claude vs Gemini vs Copilot)

Token counts for `trustState|canonicalReadiness|lastPersistedAt|structuralTrust|freshnessAuthority` per hook file:

| Hook role          | Claude | Gemini | Copilot |
| ------------------ | ------ | ------ | ------- |
| `session-prime.ts` | 1      | 1      | **0**   |
| `session-stop.ts`  | 0      | 0      | *absent* |
| `compact-inject.ts` | 1     | 0      | *absent* |
| `compact-cache.ts` | *absent* | 1   | *absent* |
| `shared.ts`        | 2      | **0**  | *absent* |
| `hook-state.ts`    | 0      | *absent* | *absent* |
| `claude-transcript.ts` | 0  | *absent* | *absent* |

**Three distinct sibling-asymmetries in the hooks family:**

**(A) Claude `compact-inject.ts` vs Copilot runtime**

- Claude `compact-inject.ts:403` writes `trustState: 'cached'` into the compact cache provenance envelope.
- Gemini's analogue is `compact-cache.ts:174` writing the same trustState. Gemini runtime achieves parity via a differently-named file but emits the field.
- Copilot runtime has NO compact-inject, NO compact-cache file — trustState is never written to a Copilot compact cache because the writer doesn't exist.

**(B) Claude `session-prime.ts` vs Copilot `session-prime.ts`**

- Claude `session-prime.ts:70` reads `pendingCompactPrime.payloadContract?.provenance.trustState` and propagates it into injected context.
- Gemini `session-prime.ts:77` does the exact same read (parity achieved).
- Copilot `session-prime.ts` never reads trustState — it only emits a startup brief. Copilot users never see trustState propagated across compaction because (A) nothing writes it and (B) nothing reads it.

**(C) Claude `shared.ts` vs Gemini `shared.ts`**

- Claude `shared.ts:125-129` defines a `wrapRecoveredCompactPayload` envelope helper with explicit `metadata.trustState` escaping: `[PROVENANCE: producer=...; trustState=...; sourceSurface=...]`.
- Gemini `shared.ts` imports only `hookLog` from `../claude/shared.js` and does NOT re-export or define its own provenance envelope. Gemini achieves end-to-end trustState only because its `compact-cache.ts` and `session-prime.ts` reach into Claude's shared.ts transitively via the imported module — a fragile coupling.
- Copilot `shared.ts` does not exist.

## 3. Findings

### R52-P1-001 | Code-graph family sibling-asymmetry: scan.ts + status.ts + ccc-* miss hardening while query.ts has it | sibling-asymmetry

**File:line**:
- Hardened: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:225-282` (17 tokens)
- Un-hardened:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts` (0 tokens)
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts` (0 tokens)
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts` (0 tokens)
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts` (0 tokens)
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts` (0 tokens)

**Hardened sibling**: `code-graph/query.ts` — the reference implementation from T-CGQ-09/10/11/12.

**Un-hardened siblings**: all other `handlers/code-graph/*.ts` files (5 peers; `context.ts` already tracked by R6-P1-001 so excluded from this finding to avoid double-counting).

**Missing fields**: `canonicalReadiness`, `trustState`, `lastPersistedAt`, `structuralTrust`, `freshnessAuthority`.

**Blast radius**: The code-graph tool family is the primary surface for structural consumers (callers/imports/outline/dependencies). When `code_graph_status` returns without the canonical 4-state trust vocabulary, consumer routing logic — including session-bootstrap's own readiness evaluator — cannot distinguish `absent` (empty graph) from `stale` (pending refresh) from `unavailable` (ingestion error). `code_graph_scan` emits a scan summary without trustState, so the session-level trust assessment after a scan invocation cannot reconcile the `pre-scan state → post-scan state` transition against the canonical vocabulary.

**Remediation seed**: Replicate the T-CGQ-09/10/11/12 pattern across the 6 un-hardened siblings. Extract `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock` from `query.ts:225-300` into a shared module (e.g., `lib/code-graph/readiness-contract.ts`) and have all 7 handlers consume it. `status.ts` is the highest-priority target (it IS the canonical readiness probe); `scan.ts` second (it mutates state); `ccc-*` third (lower-traffic supporting surfaces).

**Confidence**: 0.94 — direct token-count evidence across all 7 siblings; the asymmetry is mechanical (one-and-only-one sibling has the tokens); review-report already classifies this as a P1 pattern (R6-P1-001 is the sibling instance already documented).

---

### R52-P1-002 | Copilot hook runtime lacks compact-cycle trustState writer + reader (cross-runtime asymmetry) | sibling-asymmetry

**File:line**:
- Hardened siblings:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:403` (writes `trustState: 'cached'`)
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:70` (reads trustState from payloadContract)
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:174` (writes `trustState: 'cached'`)
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:77` (reads trustState from payloadContract)
- Un-hardened sibling:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:1-61` (no trustState read; no compact writer at all)

**Hardened sibling**: Claude (end-to-end writer + reader) and Gemini (end-to-end writer + reader, via differently-named `compact-cache.ts`).

**Un-hardened sibling**: Copilot runtime — session-prime.ts exists but does not read trustState; no compact-inject.ts or compact-cache.ts exists to write it.

**Missing fields**: `trustState` (across the compact-prime → compact-cache → session-prime continuity loop).

**Blast radius**: Copilot-driven sessions that undergo compaction lose the trust-state provenance that Claude and Gemini sessions preserve. After a Copilot compaction the recovered context has no `[PROVENANCE: ... trustState=...]` breadcrumb, so downstream `memory_context({ mode: 'resume' })` calls and session-health readouts cannot tell whether the Copilot runtime's recovered payload is `live` / `stale` / `absent` / `unavailable`. This creates a third-class experience for Copilot users even though the underlying MCP tools support the full vocabulary. If Phase 017 work adds Copilot-first autonomous iteration (per `feedback_copilot_concurrency_override.md`), this gap becomes a blocker for cross-iteration continuity.

**Remediation seed**: Add `hooks/copilot/compact-cache.ts` (mirror of Gemini's) and extend `hooks/copilot/session-prime.ts` to read `pendingCompactPrime.payloadContract?.provenance.trustState`. Also factor `wrapRecoveredCompactPayload` out of `hooks/claude/shared.ts` into a runtime-agnostic helper (e.g. `hooks/shared-provenance.ts`) so all three runtimes consume it directly rather than Gemini transitively importing from Claude.

**Confidence**: 0.90 — direct file-by-file token sweep shows the three-way asymmetry unambiguously; the remediation is architecturally clear.

---

### R52-P2-001 | Gemini shared.ts transitively couples to Claude's shared.ts for provenance escape | sibling-asymmetry (structural)

**File:line**:
- Hardened: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:125-129` (defines `wrapRecoveredCompactPayload` with trustState escaping)
- Un-hardened: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:7` (`import { hookLog } from '../claude/shared.js'` — imports hookLog only, inherits provenance escape transitively via downstream files)

**Hardened sibling**: `hooks/claude/shared.ts` — the canonical place for provenance envelope helpers.

**Un-hardened sibling**: `hooks/gemini/shared.ts` — imports from Claude but does not re-export `wrapRecoveredCompactPayload` locally. Gemini's `compact-cache.ts` and `session-prime.ts` reach into Claude's shared.ts transitively.

**Missing fields**: local `wrapRecoveredCompactPayload` export; runtime-agnostic placement.

**Blast radius**: Medium. Gemini runtime continues to work because Node resolves the transitive import, but (a) a future edit to Claude shared.ts that breaks Gemini-specific expectations would silently regress Gemini; (b) a new runtime (like Copilot, per R52-P1-002) gets no obvious place to look for the helper — the convention "look in your own runtime's shared.ts" is broken for Gemini and therefore broken as a pattern to extend.

**Remediation seed**: Extract `wrapRecoveredCompactPayload` (and the provenance escape helpers) from `hooks/claude/shared.ts` into a new `hooks/shared-provenance.ts` co-located with `hooks/index.ts`. All runtime-specific shared.ts files re-export from there. This also unblocks the R52-P1-002 Copilot remediation cleanly.

**Confidence**: 0.82 — structural inference from the `import { hookLog } from '../claude/shared.js'` pattern is solid; P2 rather than P1 because the behavioral consequence today is zero (Node resolves it fine) — it is a maintainability / pattern-extension finding rather than a broken-today finding.

---

### R52-P2-002 | memory-context.ts advertises non-canonical readiness vocabulary in structural routing nudge | vocabulary-drift

**File:line**:
- Canonical vocabulary reference: `lib/context/shared-payload.ts` + `handlers/session-bootstrap.ts:52,181` (`readiness: 'ready'` as part of the full-payload contract, but wired to the structural context)
- Drifted usage: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:200` (`readiness: 'ready'` as a literal-narrow in `StructuralRoutingNudgeMeta`) and `memory-context.ts:425` (construction of that advisory block)

**Hardened sibling**: none strictly — this is not a sibling-asymmetry but adjacent vocabulary drift flagged while sweeping for the pattern. Included because it confuses consumers reading `readiness` across surfaces.

**Un-hardened sibling**: `handlers/memory-context.ts:200-204` and `:423-429`.

**Missing fields**: The advisory nudge's `readiness: 'ready'` is a constant flag, not a trust-state probe. A consumer keying off `canonicalReadiness` or the 3-state `'ready'|'stale'|'missing'` vocabulary will find only a literal narrow here, no `trustState`, no `lastPersistedAt`.

**Blast radius**: Low. This is an advisory nudge, not a structural read. But a future consumer that tries to treat this `readiness` uniformly with the session-bootstrap / session-resume `readiness` field will be confused. Rename the field to `advisoryPreset` (or drop it — it's always the literal `'ready'`) to remove the overloaded name.

**Remediation seed**: Either (a) rename `readiness` → `advisoryPreset` in the `StructuralRoutingNudgeMeta` interface and the object literal, or (b) remove the always-literal field entirely since it never varies.

**Confidence**: 0.75 — clear vocabulary overlap; low severity; remediation is a 2-line rename.

## 4. Resolved questions

- [x] KQ-51-2: Yes. The R6-P1-001 sibling-asymmetry pattern recurs in TWO additional families: (i) the code-graph handler family (6 un-hardened peers vs 1 hardened `query.ts`) and (ii) the hooks runtime family (Copilot missing the full compact-cycle trustState writer + reader that both Claude and Gemini have). A third instance is the Gemini shared.ts transitively importing from Claude (R52-P2-001 structural asymmetry). The pattern does NOT recur as sibling-asymmetry in the memory or save handler families — those are whole-family gaps, not asymmetry pairs.

## 5. Ruled-out directions

- **Session handler family asymmetry** — `session-resume.ts`, `session-bootstrap.ts`, and `session-health.ts` all route trust-state through `trustStateFromStructuralStatus` with matching vocabulary. M8 hardening landed consistently here. No finding.
- **Memory handler family sibling-asymmetry** — `memory-*.ts` files have zero tokens uniformly; no sibling to form an asymmetry pair. The memory-context vocabulary drift is filed as R52-P2-002 but is not the R6-P1-001 pattern.
- **Save handler family sibling-asymmetry** — all 12 `handlers/save/*.ts` files have zero tokens. This is a whole-family gap already tracked under R6-P2-001, not sibling-asymmetry recurrence.
- **`hooks/index.ts` / `hooks/memory-surface.ts` / `hooks/response-hints.ts` / `hooks/mutation-feedback.ts`** — these are runtime-agnostic dispatchers/formatters. `memory-surface.ts` emits `codeGraphStatus: 'fresh'|'stale'|'empty'` but does NOT emit trustState, not flagged as a sibling-asymmetry because there is no parallel hardened sibling — it is the single point where the hook-level codeGraphStatus is derived.

## 6. Metrics

- Findings count: 4 (2× P1, 2× P2)
- Net-new findings vs iteration-051: 4 (all new; KQ-51-2 was not addressed in earlier iterations)
- New-info ratio: 1.0 (all 4 findings reveal patterns not previously catalogued at the file-pair granularity)
- Files grep-scanned: 47 (.ts files across handlers/code-graph, handlers/memory-*, handlers/save, handlers/session-*, hooks/claude, hooks/gemini, hooks/copilot)
- Tools used: 7 Bash + 3 Grep + 3 Read = 13 (note: slightly over 12 target due to one retry after a parallel-call cancellation, but effective query count was ≤ target)

## 7. Next-focus recommendation

Two promising next dimensions:

1. **Remediation-sequencing** (suggested as next KQ for iteration 053): Given R52-P1-001 (6 code-graph siblings) + R52-P1-002 (Copilot runtime) + R52-P2-001 (shared-provenance refactor), what is the minimum-risk ordering? Proposed answer seed: extract shared-provenance module FIRST (enables (2) and (3)), then replicate hardening in code-graph `status.ts` + `scan.ts` (highest-traffic), then ccc-*, then add Copilot compact-cache + session-prime trustState propagation LAST (depends on shared-provenance extraction).

2. **Test-coverage asymmetry** (alt): The 26 files with these tokens include `m8-trust-state-vocabulary.vitest.ts` (26 tokens — the canonical test). Do the 6 un-hardened code-graph siblings have test files that would FAIL once hardening is added (catching regressions) or will new tests be needed? Scan `tests/code-graph-*.vitest.ts` for each sibling.

Dimension (1) is the more actionable next step because it unblocks implementation planning. Dimension (2) is a prerequisite before the implementation lands — probably belongs to a later iteration after remediation sequencing is agreed.
