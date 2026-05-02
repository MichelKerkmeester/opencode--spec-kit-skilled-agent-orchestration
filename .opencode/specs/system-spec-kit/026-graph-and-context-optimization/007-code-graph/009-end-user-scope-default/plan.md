---
title: "Implementation Plan: End-User Scope Default for Code Graph Indexing"
description: "Level 3 implementation plan for making code graph scans end-user scoped by default while preserving explicit maintainer opt-in. The plan turns the completed five-iteration research synthesis into three gated phases: scope helpers and tests, migration/readiness messaging, and documentation plus verification."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "009 plan"
  - "end user scope default plan"
  - "code graph skill indexing plan"
  - "speckit code graph index skills"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T11:41:37Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Plan tasks checklist resource-map authored"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Implementation Plan: End-User Scope Default for Code Graph Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server code, Vitest tests, markdown documentation |
| **Framework** | Node.js ESM under `.opencode/skill/system-spec-kit/mcp_server/` |
| **Storage** | SQLite code graph database via `code_graph/lib/code-graph-db.ts`; metadata in `code_graph_metadata` |
| **Testing** | Focused Vitest suites plus `validate.sh --strict` against this packet and sibling 008 |

### METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default` |
| **Level** | 3 |
| **Branch Rule** | Stay on `main`; no commits |
| **Research Source** | `research/research.md` |
| **Decision Source** | `decision-record.md` ADR-001 |
| **Implementation Default** | End-user repository code only |
| **Maintainer Opt-In** | `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or `includeSkills:true` |
| **Migration Rule** | Explicit full scan deletes old out-of-scope rows |

### Context

The packet builds directly on the five-iteration research synthesis. Per research §1, the current structural graph is dominated by skill internals: 1,571 of 1,619 tracked files, 34,274 of 34,850 nodes, and 15,573 of 16,530 touched edges are under `.opencode/skill` or connected to those nodes (`research/research.md:7`). The implementation changes the default scan scope because the existing graph fails the end-user UX goal in `spec.md` §4: normal code graph reads should not be polluted by spec-kit internals (`spec.md:119`, `spec.md:127`).

The timing is right because research has already answered the ten packet questions and converged at 0.94 confidence. The remaining work is implementation planning and then surgical code changes. The high-confidence findings are practical: the scope decision lives in two layers (`research/research.md:19`, `research/research.md:41`), the scan schema is closed (`research/research.md:21`), full-scan pruning already deletes rows (`research/research.md:27`), and ADR-005 workflow language remains unchanged if this packet keeps wording concrete (`research/research.md:37`, `research/research.md:86`).

### Overview

Implement a default-off skill-indexing policy for the structural code graph. Phase 1 adds a shared scope policy, threads the opt-in through scan configuration and candidate walking, updates schema/tests, and proves the default excludes `.opencode/skill/**`. Phase 2 stores and compares a scope fingerprint so existing polluted databases require an explicit full scan instead of silently returning stale results. Phase 3 updates operator docs and runs the focused verification sequence.

### Source Evidence Map

| Research finding | Planning consequence |
|------------------|----------------------|
| Scope is split across defaults and hard guard (`research/research.md:19`, `research/research.md:41`) | Phase 1 must update `indexer-types.ts`, `index-scope.ts`, and `structural-indexer.ts` together. |
| Env plus one-call override is accepted (`research/research.md:43`, `research/research.md:45`) | Phase 1 wires `SPECKIT_CODE_GRAPH_INDEX_SKILLS` and `includeSkills:true`. |
| Full scan is the only pruning path (`research/research.md:27`, `research/research.md:57`) | Phase 2 must report scope mismatch and require `incremental:false`. |
| Adjacent systems are mostly separate (`research/research.md:29`, `research/research.md:72`) | Phase 2 focuses status/readiness/startup wording, not advisor or skill graph internals. |
| Public workflow wording must stay level-based (`research/research.md:84`, `research/research.md:86`) | Phase 3 docs avoid unrelated internal vocabulary and do not touch Gate 3/spec-level flows. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Deep research completed with five iterations and confidence 0.94.
- [x] All ten research questions are preserved in `_memory.continuity.answered_questions`.
- [x] ADR-001 accepted the default, opt-in surfaces, exclude list, and migration model.
- [x] Implementation blast radius identified in `research/resource-map.md`.
- [ ] Phase 1 implementer confirms live line ranges before editing.

### Definition of Done

- [ ] `code_graph_scan` excludes `.opencode/skill/**` by default and includes it only with explicit opt-in.
- [ ] `includeSkills` is accepted by the strict tool input schema and reaches scan configuration.
- [ ] The scope policy is shared by default config and walker guard, with tests for both default and opt-in behavior.
- [ ] Existing polluted databases report a full-scan requirement when stored scope differs from active scope.
- [ ] Readiness/status/context/query/startup surfaces use the existing blocked full-scan recovery shape.
- [ ] Docs describe the default, opt-in, and full-scan migration path without changing spec workflow language.
- [ ] Focused Vitest suites pass.
- [ ] This packet and sibling 008 validate with `validate.sh --strict`.

### Packet-Specific Gates

| Gate | Phase | Blocking criteria |
|------|-------|-------------------|
| G1 | Scope helpers + tests | CHK-G1-01 through CHK-G1-08 pass. |
| G2 | Migration + readiness | CHK-G2-01 through CHK-G2-06 pass. |
| G3 | Docs + verification | CHK-G3-01 through CHK-G3-08 pass. |

### Self-Correction Loop

If any gate fails, identify the exact failing rule, patch only the offending file, and rerun the failed gate. Repeat up to five loops. If the fifth loop still fails, stop with `BLOCKED: <details>` and leave the worktree intact.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared scope-policy helper threaded through scan defaults, walker guard, and readiness metadata. The important design point is not a new indexing subsystem; it is one consistent policy applied at both current scope layers. Per research §5, changing only `getDefaultConfig()` would still leave the walker guard as a separate truth, while changing only the guard would make default config and status text misleading (`research/research.md:41`).

### Key Components

- **`lib/utils/index-scope.ts`**: owns path-level exclusion semantics and should accept a small policy/options object.
- **`code_graph/lib/indexer-types.ts`**: owns default include/exclude globs and should expose the active scope identity.
- **`code_graph/lib/structural-indexer.ts`**: applies `shouldIndexForCodeGraph()` during candidate walking and workspace canonicalization.
- **`code_graph/handlers/scan.ts`**: parses scan arguments, reads env/defaults, creates config, runs indexing, and prunes on full scans.
- **`tool-schemas.ts`**: strict MCP schema, so `includeSkills` must be added here before callers can use it.
- **`code_graph/lib/ensure-ready.ts`**: detects freshness and should compare active scope fingerprint with stored metadata.
- **`code_graph/handlers/status.ts`**, **`context.ts`**, **`query.ts`**, **`verify.ts`**, **`detect-changes.ts`**: read surfaces that should route scope mismatch to an explicit full-scan instruction.
- **`code_graph/lib/startup-brief.ts`**: startup summary that should mention stale/mismatched graph scope concisely.

### High-Level Approach

Use an end-user default with explicit maintainer opt-in. The environment variable provides durable setup for maintainers running the MCP server. The per-call field gives tests and one-off manual scans deterministic control. The two inputs collapse into one active policy before `getDefaultConfig()` and the walker guard run.

Proposed helper shape:

```typescript
export interface IndexScopePolicy {
  includeSkills: boolean;
  source: 'default' | 'env' | 'scan-argument';
  fingerprint: string;
  excludedSkillGlobs: readonly string[];
}

export function resolveIndexScopePolicy(input?: {
  includeSkills?: boolean;
  env?: NodeJS.ProcessEnv;
}): IndexScopePolicy;
```

The exact helper names remain an implementation decision, but the policy needs these semantics:

- Default: `includeSkills:false`.
- Env: `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` enables skill indexing.
- Scan arg: `includeSkills:true` enables skill indexing for that call.
- `includeSkills:false` on the scan call should explicitly keep the default, even if no env var is present.
- `mcp-coco-index/mcp_server` stays excluded even when skill indexing is enabled, per research §7 (`research/research.md:49`).

### Data Flow

```
SPECKIT_CODE_GRAPH_INDEX_SKILLS env
        │
        ▼
scan.ts parses ScanArgs.includeSkills
        │
        ▼
resolveIndexScopePolicy({ includeSkills, env })
        │
        ├─────────────► getDefaultConfig(rootDir, policy)
        │                    │
        │                    └─ excludeGlobs includes .opencode/skill/** only when policy.includeSkills=false
        │
        ├─────────────► IndexerConfig.scopePolicy / includeSkills default
        │                    │
        │                    └─ structural-indexer.findFiles()
        │                           │
        │                           └─ shouldIndexForCodeGraph(path, policy)
        │
        └─────────────► scope fingerprint stored in code_graph_metadata
                             │
                             └─ ensure-ready/status compares active vs stored fingerprint
```

### ADR-005 Workflow Invariance

Per research §14, this packet does not change Gate 3, spec level wording, validator public prompts, or user conversation flow (`research/research.md:84`, `research/research.md:86`). The implementation should describe the behavior as "code graph scan scope" and "skill indexing opt-in" only. The only direct reference to `.opencode/skill/system-spec-kit/templates/manifest/` in this plan is the required template source path from the user request and the template header.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope helpers + tests

**Goal**: make end-user-only the default scan policy, while preserving an explicit maintainer opt-in path.

**Estimated effort**: 5-7 focused hours, 6-9 wall-clock hours.

**Step-by-step plan:**

1. Modify `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` around the current hard guard (`index-scope.ts:31`, `index-scope.ts:39`; cited in `research/research.md:41`). Add `.opencode/skill/**` to the default code graph exclusion policy and make the guard opt-in aware. Estimated delta: 35-55 LOC. Verification: unit or integration test proves a path under `.opencode/skill/example.ts` is rejected by default and accepted with the policy override.
2. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` near `getDefaultConfig()` (`indexer-types.ts:137`, `indexer-types.ts:138`; cited in `research/research.md:25`). Add a policy/options parameter, include `.opencode/skill/**` in default excludes when skill indexing is off, and expose a stable scope fingerprint. Estimated delta: 40-70 LOC. Verification: `code-graph-indexer.vitest.ts` checks the default exclude list and opt-in list.
3. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` at `ScanArgs` and config creation (`scan.ts:25`, `scan.ts:214`, `scan.ts:216`; cited in `research/research.md:39`, `research/research.md:45`). Add `includeSkills?: boolean`, resolve env plus scan argument once, and pass policy into `getDefaultConfig()`. Estimated delta: 30-55 LOC. Verification: schema and handler tests show `includeSkills:true` reaches config without relying on process-global test leakage.
4. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` at the walker guard (`structural-indexer.ts:1292`, `structural-indexer.ts:1298`; cited in `research/research.md:19`). Thread the scope policy to `shouldIndexForCodeGraph()` wherever candidate discovery and workspace canonicalization need it. Estimated delta: 35-65 LOC. Verification: candidate discovery excludes skill files by default before parsing and includes them with opt-in.
5. Modify `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` near the strict `code_graph_scan` schema (`tool-schemas.ts:562`, `tool-schemas.ts:566`; cited in `research/research.md:21`). Add `includeSkills` as a boolean with default `false` and maintainer-focused description. Estimated delta: 6-12 LOC. Verification: strict schema accepts `includeSkills` and still rejects unknown fields.
6. Modify `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` near the scan controls (`tool-input-schema.vitest.ts:534`, `tool-input-schema.vitest.ts:537`; cited in `research/research.md:82`). Add acceptance and rejection cases for `includeSkills`. Estimated delta: 15-25 LOC. Verification: focused Vitest file passes.
7. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` near `getDefaultConfig` tests (`code-graph-indexer.vitest.ts:242`; cited in `research/research.md:82`). Add default exclude, env opt-in, and one-call opt-in cases. Estimated delta: 35-60 LOC. Verification: focused indexer Vitest passes.
8. New file only if needed: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`. Justification: if adding policy resolution to `indexer-types.ts` would create an import cycle with `index-scope.ts`, put the shared resolver in a small code graph helper. Estimated delta: 40-70 LOC. Verification: imported by both default config and walker guard with no cycle.

**Gate 1 verification:**

- `node mcp_server/node_modules/vitest/vitest.mjs run tests/tool-input-schema.vitest.ts code_graph/tests/code-graph-indexer.vitest.ts --root . --config mcp_server/vitest.config.ts`
- `rg "includeSkills" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`
- `rg "\.opencode/skill" .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`

### Phase 2: Migration + readiness messaging

**Goal**: make existing polluted databases loudly require a full scan instead of returning stale skill-heavy graph data.

**Estimated effort**: 5-8 focused hours, 7-11 wall-clock hours.

**Step-by-step plan:**

1. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` near `code_graph_metadata` usage (`code-graph-db.ts:55`, `code-graph-db.ts:86`; cited in `research/research.md:78`). Reuse the metadata table rather than adding a new table; store active scope fingerprint and human-readable scope label after scans. Estimated delta: 35-60 LOC. Verification: metadata read/write round trip in existing DB tests or focused inline test.
2. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` near full-scan pruning (`scan.ts:241`, `scan.ts:247`; cited in `research/research.md:27`). Persist the active scope fingerprint after successful scan completion, including incremental scans that do not prune. Estimated delta: 20-35 LOC. Verification: full scan stores fingerprint and stale old value is replaced.
3. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` near candidate-manifest readiness (`ensure-ready.ts:301`, `ensure-ready.ts:322`; cited in `research/research.md:57`). Compare stored scope fingerprint with the active policy and return a full-scan-required state on mismatch. Estimated delta: 60-90 LOC. Verification: mismatch state cannot be satisfied by inline selective repair.
4. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` where blocked read payloads already set `requiredAction:"code_graph_scan"` (`context.ts:184`, `context.ts:196`, `query.ts:1089`; cited in `research/research.md:64`). Reuse the existing blocked shape, with block reason explaining scope mismatch and full scan. Estimated delta: 35-55 LOC total. Verification: no new response family; payload still includes readiness/trust metadata.
5. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` before optimistic stats reporting (`status.ts:158`, `status.ts:167`; cited in `research/research.md:65`). Show active scope, stored scope, mismatch status, and optional count of tracked `.opencode/skill` files before pruning. Estimated delta: 50-80 LOC. Verification: status reports mismatch without mutating DB.
6. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts` and `verify.ts` only if their readiness text needs the same reason string (`detect-changes.ts:246`, `detect-changes.ts:260`, `verify.ts:154`, `verify.ts:160`; cited in `research/research.md:66`, `research/research.md:67`). Estimated delta: 0-30 LOC. Verification: both still block and point to `code_graph_scan`.
7. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` around graph summary rendering (`startup-brief.ts:122`, `startup-brief.ts:131`; cited in `research/research.md:69`). Add a concise scope mismatch hint and recommended full scan action. Estimated delta: 25-45 LOC. Verification: startup brief is not noisy when stored and active scope match.

**Gate 2 verification:**

- Unit coverage for scope fingerprint write/read and mismatch detection.
- Manual status smoke with an intentionally stale fingerprint, if fixture setup is cheaper than a full DB test.
- Confirm blocked read payload still names `requiredAction:"code_graph_scan"` and does not silently run a full scan.

### Phase 3: Docs + verification

**Goal**: document the new default and complete focused regression checks without changing spec workflow language.

**Estimated effort**: 3-5 focused hours, 4-7 wall-clock hours.

**Step-by-step plan:**

1. Modify `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` around default excludes and full-scan pruning (`README.md:263`, `README.md:266`, `README.md:289`, `README.md:295`; cited in `research/research.md:35`, `research/research.md:82`). Document `.opencode/skill/**` default exclusion, `includeSkills:true`, env opt-in, and full scan migration. Estimated delta: 35-60 LOC. Verification: grep confirms all operator terms exist and no unrelated spec workflow text changed.
2. Modify `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` in the Graph section (`ENV_REFERENCE.md:17`, `ENV_REFERENCE.md:171`). Add `SPECKIT_CODE_GRAPH_INDEX_SKILLS` as default `false`, boolean, maintainer opt-in. Estimated delta: 10-20 LOC. Verification: env table entry is present and default-off.
3. Update any status/startup text touched in Phase 2 for concise operator wording. Evidence source: research §10 and §11 (`research/research.md:59`, `research/research.md:72`). Estimated delta: included in Phase 2 unless copy polish remains. Verification: no Gate 3/spec-level prompt wording changes.
4. Run focused Vitest suites: `tool-input-schema.vitest.ts`, `code-graph-indexer.vitest.ts`, and any added readiness/status tests. Verification: all focused suites pass.
5. Run strict packet validation for 009. Verification: `Summary: Errors: 0`.
6. Run workflow-invariance Vitest. Verification: existing suite remains green.
7. Run sibling 008 strict validation. Verification: `Summary: Errors: 0`.
8. Run a full-fleet sample regression. Use a small representative sample if all-packet validation is too slow: this packet, sibling 008, one Level 3 template packet, one phase child, and one archived packet. Verification: no new strict errors attributable to this packet.
9. Measure the performance baseline after implementation: compare tracked file/node counts before and after a full scan on the local workspace, and record the result in `implementation-summary.md`. Evidence target: research §12 expects a large reduction from the existing polluted DB (`research/research.md:76`, `research/research.md:78`).

**Gate 3 verification:**

```bash
PACKET=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$PACKET" --strict
(cd .opencode/skill/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/workflow-invariance.vitest.ts --root . --config mcp_server/vitest.config.ts)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience --strict
```
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Phase |
|-----------|-------|-------|-------|
| Schema | `includeSkills` accepted by strict scan schema and unknown fields still rejected | Vitest | 1 |
| Unit | `getDefaultConfig()` default excludes and opt-in behavior | Vitest | 1 |
| Unit | `shouldIndexForCodeGraph()` default and opt-in behavior | Vitest or indexer integration | 1 |
| Integration | Candidate walk excludes `.opencode/skill/**` before parse by default | Vitest fixture | 1 |
| Unit | Scope fingerprint stored and compared through `code_graph_metadata` | Vitest | 2 |
| Integration | Context/query blocked shape reused on mismatch | Vitest or focused handler test | 2 |
| Manual | `code_graph_status` reports mismatch and full-scan action with stale fingerprint | manual command | 2 |
| Docs | README and env reference mention default, opt-in, and full scan migration | `rg` plus review | 3 |
| Regression | Workflow-invariance suite remains green | Vitest | 3 |
| Spec validation | 009 and sibling 008 validate clean | `validate.sh --strict` | 3 |

### Manual Test Matrix

| Scenario | Setup | Expected |
|----------|-------|----------|
| Default end-user scan | No env var; call `code_graph_scan({ incremental:false })` | `.opencode/skill/**` candidates are absent. |
| Env opt-in | Start server with `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` | Skill files are eligible except `mcp-coco-index/mcp_server`. |
| One-call opt-in | Call `code_graph_scan({ includeSkills:true, incremental:false })` | Skill files are eligible for that call. |
| Existing stale graph | Store old fingerprint, active policy default-off | Status/read paths require full scan. |
| Migration full scan | Run `code_graph_scan({ incremental:false })` under default-off policy | Old skill rows are deleted from SQLite, not archived. |

### Performance Measurement

Record pre/post counts from `code_files`, `code_nodes`, and `code_edges` after the full scan. The research baseline is 1,571 of 1,619 tracked files and 34,274 of 34,850 nodes under `.opencode/skill` (`research/research.md:76`, `research/research.md:78`). The implementation should report actual local deltas, not extrapolated savings.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Completed 009 research synthesis | Internal | Done | Plan loses source evidence if ignored. |
| ADR-001 in this packet | Internal | Accepted | Implementation default and opt-in surfaces become ambiguous. |
| ADR-005 workflow invariance from `010-template-levels/002-template-greenfield-redesign/decision-record.md` | Internal | Accepted | Docs must avoid changing spec workflow vocabulary or prompts. |
| ADR-003 exit-code taxonomy from `010-template-levels/004-deferred-followups/decision-record.md` | Internal | Applicable if new CLI/script errors are introduced | New errors should follow existing exit-code expectations if a script path is added. |
| 008 backend resilience packet | Internal | Reference | Readiness/status wording should align with existing degraded/blocked graph behavior. |
| Vitest harness under `mcp_server/node_modules/vitest/vitest.mjs` | Internal | Available | Focused verification depends on it. |
| SQLite metadata table | Internal | Available | Scope fingerprint should reuse existing metadata storage. |
| External services | External | None expected | No network or third-party service dependency. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scope default breaks maintainer workflows despite documented opt-in, readiness mismatch blocks healthy graphs, or focused Vitest suites fail after five correction loops.
- **Procedure**: Revert the implementation patch on `main`, then run `code_graph_scan({ incremental:false, includeSkills:true })` if old skill-inclusive local graph content is needed temporarily. Do not archive old rows; the normal full-scan prune path deletes out-of-scope rows via `removeFile()` (`research/research.md:57`).
- **Recovery time**: Code revert is small. DB recovery depends on full-scan duration.
- **Data reversal**: No source files are deleted. SQLite graph rows can be recreated by running a full scan with skill indexing opted in.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1: scope helpers + tests
        │
        ▼
Phase 2: migration + readiness messaging
        │
        ▼
Phase 3: docs + verification
```

| Phase | Depends On | Blocks | Parallel-Safe Work |
|-------|------------|--------|--------------------|
| Phase 1 | Research and ADR-001 | Phase 2 | Schema test and docs draft can be prepared after helper shape is chosen. |
| Phase 2 | Active scope fingerprint from Phase 1 | Phase 3 | Status copy and startup copy can be drafted after readiness return shape is known. |
| Phase 3 | Phase 1 and Phase 2 behavior | Completion | Docs and verification can run in parallel with final copy polish. |

Serial dependency is real between Phase 1 and Phase 2: readiness cannot compare scope identity until Phase 1 defines it. Phase 3 has some parallel work, but final docs should wait for the actual helper names and response fields.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: scope helpers + tests | Medium-high, because the policy crosses config, schema, and walker guard | 5-7 focused hours |
| Phase 2: migration + readiness | Medium-high, because stale DB behavior needs careful blocked-read semantics | 5-8 focused hours |
| Phase 3: docs + verification | Medium, mostly documentation and targeted regression | 3-5 focused hours |
| **Total** | | **13-20 focused hours; 17-27 wall-clock hours with validation loops** |

### Cost Estimates

| Phase | LOC Added/Changed | Files Created | Files Modified | Hours Focused | Hours Wall-Clock |
|-------|-------------------|---------------|----------------|---------------|------------------|
| Phase 1 | 190-325 LOC | 0-1 | 6 | 5-7 | 6-9 |
| Phase 2 | 225-395 LOC | 0 | 6-8 | 5-8 | 7-11 |
| Phase 3 | 70-120 LOC docs/test polish | 0 | 2-4 | 3-5 | 4-7 |
| **Total** | **485-840 LOC** | **0-1** | **10-15** | **13-20** | **17-27** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Confirm `git branch --show-current` returns `main`.
- [ ] Confirm unrelated dirty files are not touched.
- [ ] Capture focused Vitest and strict validation output before final status.
- [ ] Capture current graph file/node/edge counts before running a migration full scan.

### Rollback Procedure

1. Revert only the implementation files changed by this packet.
2. Run focused Vitest suites to confirm old behavior compiles.
3. Run strict validation for 009 and sibling 008.
4. If local graph rows need old content, set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` and run an explicit full scan.

### Data Reversal

- **Has data migrations?** Yes, SQLite graph metadata and row pruning are affected by full scans.
- **Reversal procedure**: graph rows are reconstructed by a full scan under the desired active scope. Source files are not archived or moved.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────┐
│  Research synthesis + ADR   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Phase 1 scope policy        │
│ config + guard + schema     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Phase 2 scope fingerprint   │
│ readiness + status + reads  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Phase 3 docs + verification │
│ README + env + tests        │
└─────────────────────────────┘
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Resolve shared scope policy**: helper shape, env parsing, one-call override, fingerprint string. Estimate: 1-2 hours.
2. **Thread policy through scan and walker**: config defaults plus hard guard must agree. Estimate: 3-4 hours.
3. **Lock schema/tests**: strict input schema and default/opt-in tests prevent drift. Estimate: 1-2 hours.
4. **Persist and compare scope fingerprint**: metadata write/read plus readiness mismatch state. Estimate: 3-5 hours.
5. **Reuse blocked read shape**: context/query/status/startup messaging. Estimate: 2-3 hours.
6. **Document and verify**: README, env reference, focused Vitest, strict validation, sibling regression. Estimate: 3-5 hours.

**Total Critical Path**: 13-21 focused hours. Work inside Phase 1 is mostly serial until the policy helper is chosen; schema tests can proceed in parallel once the field name is confirmed. Phase 3 docs can be drafted during Phase 2, but final wording should wait for actual field names and response fields.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Completion Criteria | Target |
|-----------|---------------------|--------|
| M1 | Phase 1 gate green: default excludes skills, env/scan opt-in works, schema accepts `includeSkills` | Day 1 |
| M2 | Phase 2 gate green: stored scope fingerprint mismatch blocks reads with full-scan action | Day 2 |
| M3 | Phase 3 gate green: docs updated, focused Vitest green, strict validations pass | Day 2-3 |

No commit is required for any milestone. Each milestone should leave the worktree inspectable and the packet docs synchronized with implementation state.
<!-- /ANCHOR:milestones -->

---

## Risks & Mitigations

| Risk | Severity | Mitigation | Owner |
|------|----------|------------|-------|
| R1 silent maintainer breakage | P0 | Scope fingerprint warning, status counts for old skill paths, documented env opt-in, and explicit full scan. | Implementer |
| R2 advisor and skill graph breakage | P1 | Keep separate skill metadata scan and `skill-graph.sqlite` paths unchanged; add regression only if imports show direct dependency. | Implementer |
| R3 hook/session scope drift | P1 | Startup brief shows stale/mismatch hint and recommends explicit full scan. | Implementer |
| R4 CocoIndex stale semantic results | P2 | Track as follow-up; do not fold `.cocoindex_code` behavior into this structural graph packet. | Maintainer |
| R5 existing DB stale nodes | P2 | Use existing full-scan pruning and delete rows through `removeFile()`; optionally `VACUUM` if file size matters. | Operator |

## Open Decisions

| Decision | Status | Resolution |
|----------|--------|------------|
| Exact helper name | RESOLVED | Use `resolveIndexScopePolicy()`. |
| Fingerprint field name | RESOLVED | Use `scope_fingerprint` in `code_graph_metadata`. |
| Status payload field shape | RESOLVED | Include `activeScope`, `storedScope`, `scopeMismatch`, and optional `excludedTrackedFiles`. |
| Query/context warning breadth | RESOLVED | Put detailed counts in status; keep query/context blocked payload concise. |
| New helper file vs existing file | RESOLVED | Add `index-scope-policy.ts` to avoid import cycles. |
| Env/per-call precedence | RESOLVED | A boolean `includeSkills` scan argument takes precedence over `SPECKIT_CODE_GRAPH_INDEX_SKILLS`; env applies only when the per-call arg is missing. |

## Implementation Notes

- Do not change memory indexing scope.
- Do not change CocoIndex indexing scope.
- Do not change Gate 3, spec levels, or public spec workflow prompts.
- Do not archive graph rows. Existing full-scan pruning deletes stale rows.
- Keep `mcp-coco-index/mcp_server` excluded even when skill indexing is enabled.
