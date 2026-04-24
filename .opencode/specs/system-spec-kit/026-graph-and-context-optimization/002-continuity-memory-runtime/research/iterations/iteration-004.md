## Focus

Audit **Q3**: which continuity-refactor Gates A-F are actually enforced by live runtime code, which are only asserted in tests, and where the gate reporter contract drifted from the packet specs.

## Actions Taken

1. Read the parent `003-continuity-refactor-gates` packet plus all six child gate specs to extract the documented Gate A-F contract and promoted-follow-on notes.
2. Read the active research state (`deep-research-state.jsonl`, `deep-research-strategy.md`) to confirm the iteration target, session lineage, and prior findings.
3. Searched the runtime for explicit Gate A-F enforcers and gate/continuity runners under `.opencode/skill/system-spec-kit/scripts/`; only generic validators and continuity checks surfaced.
4. Read the six requested Gate D regression suites and compared their asserted invariants with the live reader handlers.
5. Read the live reader/runtime files (`memory-context.ts`, `session-resume.ts`, `session-bootstrap.ts`, `memory-search.ts`) plus Gate C/B enforcement files (`spec-doc-structure.ts`, `reconsolidation-bridge.ts`, `validate.sh`, `vector-index-schema.ts`, `causal-edges.ts`).
6. Read `003-continuity-refactor-gates/handover.md` and sibling promoted-phase implementation summaries (`008-runtime-executor-hardening`, `009-hook-package`) to confirm whether any later packet introduced an A-F reporter surface.

## Findings

### Gate-by-Gate drift table

| Gate | Documented check | Runtime enforcer file:line (or "none") | Test coverage file:line | Reporter output (yes/no) | Drift verdict |
| --- | --- | --- | --- | --- | --- |
| A | Template blockers fixed; validator exemptions; backup/restore/warmup before B (`001-gate-a-prework/spec.md:71-75,106-111`) | Partial only: `scripts/spec/validate.sh:625-627` (template exemption). No live runtime check found for backup/restore/warmup. | none found in this sweep | no | **drift** - mostly operational/doc-only |
| B | Causal-edge anchor migration plus archive behavior (`002-gate-b-foundation/spec.md:77-81,113-129`) | `mcp_server/lib/search/vector-index-schema.ts:611-637,1230-1320`; `mcp_server/lib/storage/causal-edges.ts:67-101,253-305,619-623` | none found in this sweep | no | **drift** - schema live, archive/ranking contract stale |
| C | Five writer rules + routed save safety (`003-gate-c-writer-ready/spec.md:69-72,103-106,131-136`) | `mcp_server/lib/validation/spec-doc-structure.ts:100-132,1023-1035`; partial save-side bridge in `handlers/save/reconsolidation-bridge.ts:485-524` | `tests/gate-d-regression-quality-gates.vitest.ts:89-118`; `tests/gate-d-regression-reconsolidation.vitest.ts:83-120` | no | **reporter-missing / cross-gate test drift** |
| D | 4-level resume ladder + archived fallback/D0 metrics (`004-gate-d-reader-ready/spec.md:69-72,101-104,121-124,144-154`) | `handlers/memory-context.ts:211-221,887-915`; `handlers/session-resume.ts:670-676`; `handlers/session-bootstrap.ts:94-95,182-183`; `handlers/memory-search.ts:165-228,900-1107` | `tests/memory-context.resume-gate-d.vitest.ts:6-8,99-120`; `tests/session-bootstrap-gate-d.vitest.ts:14-15,83-91`; `tests/gate-d-regression-intent-routing.vitest.ts:1-120`; `tests/gate-d-regression-4-stage-search-pipeline.vitest.ts:83-120` | no | **live drift** - runtime is 3-level and disables archive/legacy fallback |
| E | Canonical cutover + command/agent/skill/doc parity (`005-gate-e-runtime-migration/spec.md:65-80,108-120`) | none as a gate-local runner; later sibling work exists in `008-runtime-executor-hardening/implementation-summary.md:57-79` and `009-hook-package/implementation-summary.md:65-99` but not as an A-F reporter | none found in this sweep | no | **doc-only / promoted** |
| F | Cleanup verification of DB/filesystem/runtime cleanup (`006-gate-f-cleanup-verification/spec.md:57-64,92-105,125-129`) | none in active user-traffic handlers from this sweep | none found in this sweep | no | **doc-only / audit-only** |

### P1

- `FIND-iter004-gate-d-archived-fallback-doc-drift`  
  Gate D's packet still describes a **4-level** `resumeLadder` with archived fallback and D0 `archived_hit_rate` monitoring, but the live reader contract is a **3-level** canonical-only ladder with archived and legacy fallback explicitly disabled. The spec still promises `handover -> _memory.continuity -> spec docs -> archived memory` and D0 archive metrics (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:71-72,103-104,121-124,148-150`), while the runtime hard-codes `RESUME_LADDER_ORDER = ['handover', 'continuity', 'spec_docs']` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:211-221`), reports `legacyMemoryFallback: false` and `archivedTierEnabled: false` (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:902-909`), and emits user-facing hints that "No archived tier or legacy memory fallback is enabled" (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:913-915`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-95,182-183`). The packet handover agrees with the runtime, not the spec (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:41`).

- `FIND-iter004-gate-d-regression-suite-crosses-into-writer-surface`  
  The named Gate D regression catalog is not reader-only: two of the requested "Gate D" suites actually enforce Gate C writer invariants, so the packet's reader-ready test surface is overstated. `gate-d-regression-quality-gates.vitest.ts` imports `runSpecDocStructureRule` from `lib/validation/spec-doc-structure` and asserts `FRONTMATTER_MEMORY_BLOCK` / `MERGE_LEGALITY` (`.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts:7,89-118`), while `gate-d-regression-reconsolidation.vitest.ts` imports `runReconsolidationIfEnabled` from `handlers/save/reconsolidation-bridge` and exercises save-time reconsolidation (`.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts:83-84,104-120`). Those invariants belong to the writer path that Gate D explicitly marked out of scope (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:74-77`), so the test suite is partly test-only scaffolding for adjacent gates, not pure live reader enforcement.

- `FIND-iter004-gate-c-live-rules-no-gate-reporter`  
  Gate C's five writer-structure checks are genuinely live, but they surface only as **rule-level** validator results, not as an A-F gate report. The spec names the five rules and treats them as gate closure authority (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/003-gate-c-writer-ready/spec.md:69-72,101-106,131-136`). The runtime implements them in `spec-doc-structure.ts` (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:100-132,1023-1035`) and wires validator entrypoints through `validate.sh` (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:23-25`). But the emitted surface is per-rule `RuleResult`, not a gate-level A-F status envelope, so operators cannot recover "Gate C passed/failed" from the runtime reporter contract alone.

- `FIND-iter004-gate-b-archive-penalty-doc-runtime-drift`  
  Gate B's packet still carries a retired archived-tier/ranking contract even though the post-cleanup runtime and packet handover say that branch is gone. The spec's scope says archive-ranking was removed and Gate B no longer owns archive telemetry (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/002-gate-b-foundation/spec.md:80-87`), yet `REQ-006` still requires an archived `x0.3` multiplier and sample-search demotion (`.../002-gate-b-foundation/spec.md:117-120`). The packet handover records the cleanup that removed the `x0.3` penalty and `archived_hit_rate` metric (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:37-38`), and the live search handler advertises `archivedTierEnabled: false` / `legacyFallbackEnabled: false` in its source contract (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1102-1107`). So Gate B is partially live (schema landed) but its archive/ranking close criteria are stale.

- `FIND-iter004-gate-reporter-contract-is-prose-not-structured`  
  The parent packet presents Gates A-F as a coordinated program, but the closest thing to a gate reporter is a **human prose table** in `handover.md`, while runtime validators return unrelated local shapes (`RuleResult`, `ContinuityFreshnessResult`, search/source contracts). The parent packet defines `003-continuity-refactor-gates` as the authoritative A-F coordination surface (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/spec.md:56-61,98-103`), yet the current status surface is the hand-authored handover table (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:36-43`). The runtime outputs instead use rule-local contracts such as `ContinuityFreshnessResult { rule, status, code, message, details }` (`.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts:16-37`) and `runSpecDocStructureRule(...) => RuleResult` (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:1023-1035`). That is the reporter-contract drift: docs imply coordinated gate enforcement, but runtime only emits local validator/result payloads with no A-F aggregation.

### P2

- `FIND-iter004-gate-a-prework-mostly-operational-not-runtime-enforced`  
  Gate A is only partially encoded in live tooling. The packet treats template fixes, implementation-summary backfills, DB backup/restore rehearsal, and `memory_context({ mode: "resume" })` warmup as close criteria (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework/spec.md:71-75,106-111,126-135`), but the live validator sweep exposes only the changelog/sharded template exemption and a generic continuity-freshness rule (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:625-627,672-783`). I found no live runtime gate that blocks user traffic on Gate A's backup/restore/warmup conditions, so most of Gate A remains packet-local operational evidence rather than runtime enforcement.

## Questions Answered

Q3 is **fully answered**.

1. **Live gates**: Gate B schema work, Gate C writer rules, and Gate D reader routing are implemented in runtime code.
2. **Test-only / cross-scoped enforcement**: part of the Gate D regression catalog is actually enforcing Gate C writer behavior.
3. **Doc-only / operational gates**: Gate A, Gate E, and Gate F are mostly coordination/audit packets with no gate-local runtime blocker on user traffic in this sweep.
4. **Reporter drift**: the runtime exposes local validator/search contracts, but no A-F structured gate reporter; the packet handover table is prose, not machine-readable enforcement output.

## Questions Remaining

1. **Q4 D1-D8 remediation landing status** - verify which packet-002 remediation slices landed in runtime code versus tests/docs only.
2. **Q5 Cache-warning hook transcript identity + replay coverage** - inspect Stop-hook identity handoff and parallel replay paths.
3. **Q6 Reducer / state rehydration schema agreement** - compare reducer schema assumptions with live JSONL/hook/continuity emitters.
4. **Q7 JSONL audit events vs live emitters** - enumerate documented vs emitted event types.

## Next Focus

Audit **Q4** next: the D1-D8 memory-quality-remediation slices, with emphasis on silent-drop paths, enum/schema drift, and test-only remediations that never reached runtime handlers.
