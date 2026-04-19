---
title: "Feature Specification: Advisor Freshness + Source Cache"
description: "getAdvisorFreshness() analogous to code-graph getGraphFreshness(). Per-skill fingerprints, generation-tagged graph snapshots, deleted/renamed skill suppression, 15-min source cache. Trust-state mapping matches Phase 016 M8 vocabulary."
trigger_phrases:
  - "020 advisor freshness"
  - "advisor source cache"
  - "getAdvisorFreshness"
  - "per-skill fingerprint"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 002 converges"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"

---
# Feature Specification: Advisor Freshness + Source Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../002-shared-payload-advisor-contract/ |
| **Successor** | ../004-advisor-brief-producer-cache-policy/ |
| **Position in train** | 2 of 8 |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (gate for 004 producer) |
| **Status** | Spec Ready, Blocked by 002 |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 0.75-1.25 engineering days |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`buildSkillAdvisorBrief()` (child 004) needs a trust-state authority identical in shape to `getGraphFreshness()` in `lib/code-graph/`. Without one, the producer must re-walk skill-graph + SKILL.md mtimes on every call (latency regression) OR serve stale recommendations when skills are edited mid-session (correctness regression). Wave-1 §Pattern Parallel Map defined the authority list; wave-2 X7 / X8 established migration + concurrency contracts that a naive TTL cache cannot satisfy.

Concrete gaps a TTL-only cache misses:
- **Rename/delete**: renaming `sk-git` to `sk-git-flow` with a TTL cache would serve the old name until TTL expires
- **Generation drift**: two sessions rebuilding skill-graph concurrently can serve pre-rebuild fingerprints from process-global caches
- **SQLite vs JSON fallback divergence**: fallback export must be flagged `stale`/`degraded`, never `live`

### Purpose

Ship `getAdvisorFreshness(workspaceRoot)` that returns a trust-state snapshot + per-skill fingerprint map + generation tag, backed by a 15-min source cache keyed by workspace root + advisor source signature. Delete / rename semantics: treat as `delete + add`. JSON fallback: always `stale` or `degraded`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New `mcp_server/lib/skill-advisor/freshness.ts` with `getAdvisorFreshness(workspaceRoot): AdvisorFreshnessResult`
- New `mcp_server/lib/skill-advisor/source-cache.ts` with 15-minute TTL LRU keyed by `workspaceRoot + advisor source signature`
- `AdvisorFreshnessResult` shape:
  ```ts
  {
    state: 'live' | 'stale' | 'absent' | 'unavailable';
    generation: number;  // monotonic counter per workspace, incremented on rebuild
    sourceSignature: string;  // hash of all source file paths + mtimes + sizes
    skillFingerprints: Map<skillSlug, skillFingerprint>;
    fallbackMode: 'sqlite' | 'json' | 'none';
    probedAt: string;  // ISO timestamp
    diagnostics: { reason?: string; missingSources?: string[] } | null;
  }
  ```
- Authority list (same order as research.md §Pattern Parallel Map):
  - `.opencode/skill/*/SKILL.md` (discovery signature)
  - `.opencode/skill/*/graph-metadata.json` (newer metadata → stale graph)
  - `skill_advisor.py` + `skill_advisor_runtime.py` (newer runtime → stale snapshot)
  - `skill_graph_compiler.py` (newer compiler → stale artifact)
  - `skill-graph.sqlite` (preferred artifact; missing → absent/unavailable)
  - `skill-graph.json` (fallback → `stale`/`degraded`, never `live`)
- Per-skill fingerprint: hash of SKILL.md mtime + size + graph-metadata.json mtime
- Generation tag: workspace-scoped monotonic counter; stored in `.opencode/skill/.advisor-state/generation.json` (file-atomic write)
- **Malformed / unreadable `generation.json` recovery (wave-3 V8 P1)**: If `generation.json` exists but fails schema validation (missing counter, non-integer, wrong shape) OR is unreadable (EACCES, EISDIR, EBUSY, truncated mid-write): (1) the probe MUST NOT silently reuse any in-memory generation value as `live` state; (2) the probe MUST either (a) recreate the file atomically from a fresh counter seeded to `max(observed_in_memory, 1) + 1` if write succeeds, OR (b) return `state: "unavailable"` with `diagnostics.reason: "GENERATION_COUNTER_CORRUPT"` and `diagnostics.recoveryPath: "regenerate" | "unrecoverable"` if write fails (read-only FS). Under no circumstance does a corrupt counter map to `state: "live"`.
- Rename/delete semantics: skill slug present in prior fingerprint map but missing in current probe is suppressed (not rendered from stale cache)
- `getAdvisorFreshness()` is non-mutating and fast (stat-only; no file-content parsing beyond graph-metadata.json header); respects the 15-min source cache
- Cache invalidation: source signature change triggers fresh probe; generation mismatch triggers fresh probe

### Out of Scope

- `buildSkillAdvisorBrief()` producer logic (belongs to 004)
- Hook-state persistence (belongs to 004's cache layer)
- Renderer (belongs to 005)
- Runtime adapter wiring (belongs to 006/007/008)
- Modifying the skill-graph compiler itself (out of entire 020 scope)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts` | Create | `getAdvisorFreshness(workspaceRoot)` + `AdvisorFreshnessResult` export |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts` | Create | 15-min LRU cache keyed by workspace + source signature |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts` | Create | Workspace-scoped monotonic counter with file-atomic write |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts` | Create | Unit tests for state mapping + fingerprint + fallback + rename/delete |
| `.gitignore` | Modify | Ignore `.opencode/skill/.advisor-state/` (transient generation counter) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `getAdvisorFreshness()` returns the four-state vocabulary | `live`, `stale`, `absent`, `unavailable` mappable from source + artifact state |
| REQ-002 | Per-skill fingerprint map populated for all `.opencode/skill/*/SKILL.md` files | Missing SKILL.md → skill absent from map (not stale fingerprint) |
| REQ-003 | Generation counter increments on rebuild, persists across sessions | Two back-to-back probes at same state return identical generation; rebuild advances counter |
| REQ-004 | Rename/delete suppression: skill absent from current probe is not served from cache | Acceptance scenario 4 |
| REQ-005 | JSON fallback flagged `stale` or `degraded`, never `live` | When SQLite missing but JSON present, state ≠ `live` |
| REQ-006 | Source cache respects 15-min TTL + signature invalidation | Cache hit only when signature matches AND probe timestamp within 15 min |
| REQ-007 | Probe latency p95 ≤ 30 ms on warm cache; ≤ 200 ms on cold | Measured by vitest bench |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | `diagnostics.reason` populated on every non-`live` state | `{ reason: "SKILL_GRAPH_SQLITE_MISSING" }` or similar |
| REQ-011 | Generation counter file uses file-atomic write (temp + rename) | No partial writes visible to readers |
| REQ-012 | Concurrent probes serialized via workspace-scoped lock | No duplicate rebuild side-effects (N/A here — probe is read-only, but cache write must be serialized) |
| REQ-013 | Corrupt / unreadable `generation.json` never maps to `state: "live"` | Unit test: seed corrupt file → probe returns either regenerated counter OR `state: "unavailable"` with `diagnostics.reason: "GENERATION_COUNTER_CORRUPT"`; never `"live"` |
| REQ-014 | `generation.json` recovery is deterministic: atomic regeneration when FS is writable, fail-closed to `unavailable` when read-only | Two unit tests (writable-FS path + read-only-FS path) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `advisor-freshness.vitest.ts` all green (≥8 tests covering the 6 acceptance scenarios)
- **SC-002**: No regression in existing `code-graph-freshness*.vitest.ts` suite
- **SC-003**: `tsc --noEmit` clean
- **SC-004**: Probe latency benchmarks (p50/p95/p99) recorded in implementation-summary.md

### Acceptance Scenario 1: Live state round-trip
**Given** all sources present and artifact SQLite fresher than all sources, **when** `getAdvisorFreshness()` runs, **then** state is `"live"` with populated fingerprint map and generation counter.

### Acceptance Scenario 2: Stale state on source edit
**Given** a user edits a skill's SKILL.md file (for example sk-code-opencode) after the skill-graph SQLite was built, **when** `getAdvisorFreshness()` runs, **then** state is `"stale"` with `diagnostics.reason` naming the edited source.

### Acceptance Scenario 3: Absent state on missing artifact
**Given** `skill-graph.sqlite` is missing and no JSON fallback exists, **when** probed, **then** state is `"absent"`.

### Acceptance Scenario 4: Rename/delete suppression
**Given** a skill slug `sk-git-old` exists in the cached fingerprint map but its SKILL.md file is now missing, **when** probed, **then** `sk-git-old` is absent from the returned fingerprint map (not served from cache).

### Acceptance Scenario 5: JSON fallback is stale
**Given** SQLite missing but `skill-graph.json` present and readable, **when** probed, **then** state is `"stale"` with `fallbackMode: "json"` — never `"live"`.

### Acceptance Scenario 6: Generation counter monotonicity
**Given** two back-to-back probes with no source change, **when** probed, **then** both return identical `generation`. After a rebuild, next probe returns generation+1.

### Acceptance Scenario 7: Source cache hit within TTL
**Given** a prior probe with unchanged source signature at T+0, **when** probed again at T+10 minutes, **then** the result is served from cache (stat-only re-validation, no full walk).

### Acceptance Scenario 8: Cache invalidation on signature change
**Given** a prior probe, **when** any SKILL.md or skill-graph file mtime changes, **then** the source signature differs and the next probe is a fresh walk.

### Acceptance Scenario 9: Corrupt generation counter — writable FS recovers atomically
**Given** `.advisor-state/generation.json` exists but contains malformed JSON or a non-integer counter field, **when** probed on a writable filesystem, **then** the probe atomically rewrites the file with a fresh counter seeded to `max(observed_in_memory, 1) + 1`, returns the recovered counter, and the returned state is never `"live"` on that first post-corruption probe (must reflect actual source/artifact state with `diagnostics.reason: "GENERATION_COUNTER_RECOVERED"`). Subsequent probes may return `"live"` once the rewritten counter stabilizes.

### Acceptance Scenario 10: Corrupt generation counter — read-only FS fails closed
**Given** `.advisor-state/generation.json` is malformed AND the filesystem is read-only (atomic write fails with EACCES/EROFS), **when** probed, **then** the probe returns `state: "unavailable"` with `diagnostics.reason: "GENERATION_COUNTER_CORRUPT"` and `diagnostics.recoveryPath: "unrecoverable"`. The probe MUST NOT silently reuse any in-memory generation value as `"live"`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| File-atomic write race on generation counter | Low | Temp + rename pattern; never partial read |
| SQLite read vs compiler write concurrent | Medium | SQLite readers are snapshot-safe per wave-2 X8; JSON fallback flagged stale |
| Cache TTL too aggressive (serves recently deleted skills) | Medium | Per-skill fingerprint suppression + signature invalidation covers delete/rename |
| `graph-metadata.json` header parse failure | Low | Treat as `unavailable` with `diagnostics.reason` |
| Generation counter file permission / filesystem read-only | Low | Fall back to in-memory counter for current session; log once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cold probe p95 ≤ 200 ms (full source walk)
- **NFR-P02**: Warm probe p95 ≤ 30 ms (cache hit with stat revalidation)
- **NFR-P03**: Memory per workspace ≤ 2 MB for fingerprint + generation state

### Security
- **NFR-S01**: Generation counter file contains only integer + workspace hash; no user data
- **NFR-S02**: Source-cache key derived from file paths + mtimes; never includes prompt content

### Reliability
- **NFR-R01**: Probe is read-only except for generation counter + cache write
- **NFR-R02**: Any probe failure yields `{ state: "unavailable", diagnostics: { reason } }`, never throws
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero skills present: `state: "absent"`, empty fingerprint map
- Workspace root without `.opencode/skill/` directory: `state: "absent"`
- Very large skill count (>100 skills): probe completes in ≤ 200 ms (scales linearly with stat calls, not content reads)

### Error Scenarios
- SQLite file corrupt / unreadable: state `"unavailable"`, `diagnostics.reason: "SKILL_GRAPH_SQLITE_CORRUPT"`
- `graph-metadata.json` header unparseable: treat that skill's fingerprint as based on SKILL.md mtime only; log once
- Generation counter file deleted mid-session: recreate with current counter; no rebuild trigger
- **Generation counter file malformed / unreadable (wave-3 V8)**: writable FS → atomic regeneration to `max(in_memory, 1) + 1` with `diagnostics.reason: "GENERATION_COUNTER_RECOVERED"`; read-only FS → `state: "unavailable"` with `diagnostics.reason: "GENERATION_COUNTER_CORRUPT"`. Never maps to `"live"` on the corrupted probe.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three new files + tests + .gitignore update |
| Risk | 10/25 | Concurrency + file-atomic + fallback branches |
| Research | 3/20 | Research converged; authority list in research.md |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1 (deferred to 004): Where does the per-session exact-prompt cache live — hook-state alongside `advisorCache`, or a separate module? Research left this as implementation-detail; recommend hook-state in 004.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessor: `../002-shared-payload-advisor-contract/`
- Research: `../../../research/020-skill-advisor-hook-surface-pt-01/research.md §Pattern Parallel Map`
- Extended research: `../../../research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X7 §X8`
- Code-graph analog: `../../../../../skill/system-spec-kit/mcp_server/lib/code-graph/freshness.ts`
