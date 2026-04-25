---
title: "Feature Specification: Code Graph Backend Resilience [system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec]"
description: "Land the backend changes that close the resilience gaps surveyed in 007 — content-hash staleness predicate, resolver upgrades, edge-weight tuning, self-healing observability, gold-battery verifier, and code_graph_verify MCP tool."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
trigger_phrases:
  - "code graph backend resilience"
  - "008-code-graph-backend-resilience"
  - "code graph hash predicate"
  - "code_graph_verify MCP tool"
  - "edge-weight tuning code graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
    last_updated_at: "2026-04-25T22:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created 008 spec from iter 12 roadmap"
    next_safe_action: "Dispatch implementation tasks via cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0260000000007008000000000000000000000000000000000000000000000001"
      session_id: "008-code-graph-backend-resilience"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Code Graph Backend Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 008 |
| **Folder** | 008-code-graph-backend-resilience |
| **Level** | 2 |
| **Created** | 2026-04-25 |
| **Status** | Draft |
| **Upstream** | 007-code-graph-resilience-research |
| **Sibling** | 006-code-graph-doctor-command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 007 resilience-research packet identified five concrete backend resilience gaps and produced design-ready patch plans for each (iter 8-12 markdowns). This packet (008) lands the actual TypeScript patches that make the live code-graph backend match those design targets. Without this packet the staleness predicate stays mtime-only, the resolver misses cross-file edges through path aliases / type-only imports / re-export barrels, edge weights are unconfigurable, self-healing is invisible to operators, and the gold-battery verification contract from `assets/code-graph-gold-queries.json` has no runtime to execute against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope (5 streams)

1. **Content-hash staleness predicate** — extend `isFileStale()` to use `content_hash` as a fallback when mtime matches.
2. **Resolver upgrades** — capture module specifiers + import kind + re-export source; resolve cross-file imports including tsconfig.json `paths` aliases.
3. **Edge-weight tuning surface** — extend `IndexerConfig` with `edgeWeights` overrides; centralize weight constants; add edge-distribution drift detection (PSI / JSD / share drift).
4. **Self-healing observability** — extend `ReadyResult` with `selfHealAttempted`, `selfHealResult`, `verificationGate`, `lastSelfHealAt`. Preserve `detect_changes` hard block.
5. **Gold-battery verifier + `code_graph_verify` MCP tool** — execute the 28-query battery, persist last verification in `code_graph_metadata`, surface in `code_graph_status`.

### Out of scope (deferred)

- Database schema migration (stays at current version)
- Tree-sitter parser replacement (only extending capture metadata)
- Network calls (all changes are local file I/O + sqlite)
- /doctor:code-graph YAML changes (already wires to 008 outputs)
- Edge schema changes (`code_edges` table shape unchanged)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional

- **REQ-001 (Hash predicate):** `isFileStale(filePath, options?)` returns true when stored mtime matches but stored content_hash differs from current file hash. Falls back to mtime-only when stored hash is null.
- **REQ-002 (Hash production):** Scan handler passes `currentContentHash` to `isFileStale` when calling post-parse stale guard, reusing the hash already in `ParseResult`.
- **REQ-003 (Resolver capture):** Tree-sitter parser records `moduleSpecifier`, `importKind` ('value' | 'type'), and `exportKind` ('named' | 'star' | 'declaration') on import/export captures.
- **REQ-004 (Path alias resolution):** Indexer reads `tsconfig.json` once per scan, resolves `baseUrl` + `paths` aliases, and emits cross-file edges to resolved targets.
- **REQ-005 (Type-only edge class):** Type-only imports produce a `TYPE_ONLY` edge class (or a flag on existing edges) at weight 0.5.
- **REQ-006 (Re-export chain):** `export * from './foo'` is captured + tracked; outline queries can chase to the original symbol.
- **REQ-007 (Edge-weight overrides):** `IndexerConfig.edgeWeights?: Partial<Record<EdgeType, number>>` overrides hard-coded weights at scan time.
- **REQ-008 (Drift detection):** `edge-drift.ts` computes edge share, PSI, JSD between current scan and stored baseline. Status surfaces drift summary.
- **REQ-009 (Drift baseline persistence):** Baseline distribution lives in `code_graph_metadata` under key `edge_distribution_baseline`.
- **REQ-010 (Gold verifier library):** `gold-query-verifier.ts` loads `assets/code-graph-gold-queries.json`, derives outline probes from `source_file:line`, runs them via `handleCodeGraphQuery`, and returns per-query + aggregate pass rates.
- **REQ-011 (`code_graph_verify` MCP tool):** New handler at `handlers/verify.ts` registered through `tool-schemas.ts` + `code-graph-tools.ts` dispatch. Inputs: `{rootDir?, batteryPath?, category?, failFast?, includeDetails?, persistBaseline?, allowInlineIndex?}`. Default: `allowInlineIndex:false`.
- **REQ-012 (Self-heal metadata):** `ReadyResult` extended with `selfHealAttempted`, `selfHealResult`, `verificationGate`, `lastSelfHealAt`. `ensureCodeGraphReady` populates these in selective-reindex branches.
- **REQ-013 (`detect_changes` hard block preserved):** Verification failure or stale graph still returns `status:"blocked"` from `detect_changes` without inline mutation.
- **REQ-014 (Verification persistence):** Last gold verification stored in `code_graph_metadata` under `last_gold_verification`. Status surfaces `lastGoldVerification` + `goldVerificationTrust` + `verificationPassPolicy`.
- **REQ-015 (Tests):** Each stream has unit + integration tests covering hash predicate edge cases, resolver type-only / path-alias / re-export, edge-weight overrides + drift, verifier blocking + missing-symbol detection, and detect_changes hard block.
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

### Scenario 1: Hash-aware staleness detection

**Given** a file is indexed with `mtime=T1` and `content_hash=H1`,
**When** the file is edited but its mtime is preserved (e.g. `touch -t` after edit) so stored mtime equals current mtime but content has changed,
**Then** `isFileStale(filePath)` returns true because the on-disk hash now differs from `H1`, and `ensureCodeGraphReady` reports the file in `staleFiles`.

### Scenario 2: Path alias resolution emits cross-file edge

**Given** `tsconfig.json` defines `paths: { "@spec-kit/shared/*": ["./shared/*"] }` and `context-server.ts` imports from `@spec-kit/shared/embeddings/factory`,
**When** the indexer scans the workspace,
**Then** an `IMPORTS` edge is emitted from `context-server.ts` to the resolved target file `shared/embeddings/factory.ts`, with `importKind:"value"`.

### Scenario 3: Type-only import produces TYPE_ONLY-class edge

**Given** a file contains `import type { Foo } from './bar'`,
**When** the indexer parses the file,
**Then** the captured edge has `importKind:"type"` and resolves to a TYPE-class edge with weight ≤ 0.5 (or a `TYPE_ONLY` flag).

### Scenario 4: `code_graph_verify` blocks on stale graph

**Given** the code-graph is stale (`freshness != "fresh"`),
**When** `code_graph_verify` is invoked with `allowInlineIndex:false` (the default),
**Then** the response is `{ status: "blocked", readiness: { ... } }` with no probe execution and no inline mutation.

### Scenario 5: Edge-distribution drift surfaces in status

**Given** a baseline edge distribution exists in `code_graph_metadata.edge_distribution_baseline`,
**When** a full scan completes and `code_graph_status` is called,
**Then** the response includes `edgeDriftSummary: { share_drift, psi, jsd }` computed against the baseline; values exceeding configured thresholds (PSI ≥ 0.25, JSD ≥ 0.10, absolute share drift ≥ 5%) are flagged.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 15 tasks (T01-T15) marked complete with verified evidence
- `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` exits 0
- `npm --prefix .opencode/skill/system-spec-kit/mcp_server test` passes 100%
- `code_graph_verify` MCP tool reachable; returns `{status:"blocked",...}` when graph stale
- `/doctor:code-graph:auto` smoke test succeeds against modified backend
- Strict spec validation passes 0 errors / 0 warnings on this packet
- All 5 acceptance scenarios verified against modified code
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Risk | Mitigation |
|------|-----------|
| Hash compute cost spikes scan time | Lazy hashing only on mtime-match path; eager mode is opt-in |
| Path-alias resolution misses edge cases (e.g. nested tsconfig extends) | Add `readJsonWithExtends` helper; keep current behavior when tsconfig parse fails |
| Type-only edges flood the graph | Use weight ≤ 0.5 so they don't dominate ranking; gate behind config flag if needed |
| Self-heal triggers full-scan loop | Preserve `allowInlineFullScan:false` default; detect_changes contract unchanged |
| Gold-battery v1 not directly executable by `code_graph_query` | Adapter derives outline probes from `source_file:line`; v2 schema documented for future |
| Edge-weight changes break existing query results | Defaults match current hard-coded values; overrides are opt-in |

### Dependencies

- **Upstream:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/`
- **Sibling:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/`
- **Backend target:** `.opencode/skill/system-spec-kit/mcp_server/code_graph/`
- **No external deps**
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-001 (Hash compute cost):** Per-file hash on stale check ≤ 5ms for files <100KB; lazy (only when mtime matches stored mtime). Eager hashing path documented but not on by default.
- **NFR-002 (Build clean):** `npm run build` in mcp_server passes with zero TS errors after all 15 tasks land.
- **NFR-003 (Test pass):** Existing test suite passes 100%; new tests added per stream.
- **NFR-004 (No regressions in current /doctor:code-graph):** Phase A diagnostic still works against the modified backend.
- **NFR-005 (Backwards compatibility):** Existing `IndexerConfig` callers continue to work without specifying `edgeWeights` / `tsconfigPath`. New fields are optional with sensible defaults.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Empty `tsconfig.json`** — falls back to current resolver behavior; no crash.
- **Nested tsconfig `extends`** — resolver follows extends chain via `readJsonWithExtends`; circular extends rejected.
- **Missing `content_hash` for legacy rows** — predicate falls back to mtime-only; backfill happens on next scan.
- **Concurrent scans** — verifier uses readiness blocking; no race on metadata writes.
- **Gold battery v2 entries before adapter exists** — adapter ignores unknown probe types with warning; v1 entries continue to work.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Domain count:** 5 streams (hash, resolver, edge weight, self-heal, verifier) → 1.0
- **File count:** 14+ files modified or created → 1.0
- **LOC estimate:** ~800-1200 LOC across all tasks → 1.0
- **Parallel opportunity:** sequential by design (per iter 12 dependency graph) → 0.0
- **Task type:** complex (new MCP tool + new modules) → 1.0

**Complexity score:** ~0.80 (Level 2 confirmed; bordering on Level 3 but research packet 007 already provides the architecture decisions, reducing implementation risk)
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. All design decisions are answered in 007 iter 8-12 markdowns and decision-record.md.
<!-- /ANCHOR:questions -->
