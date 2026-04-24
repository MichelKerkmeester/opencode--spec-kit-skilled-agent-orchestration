# Iteration 3 - traceability - spec/plan/tasks/checklist/DR/impl-summary ↔ code/DB alignment

## Dispatcher
- iteration: 3 of 7
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T10:30:00Z
- budget profile: verify (protocol evidence re-reads + DB queries)
- tool-calls used: 11 of 13

## Files Reviewed
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/spec.md`
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/plan.md`
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/tasks.md`
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/checklist.md`
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/decision-record.md`
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/implementation-summary.md`
- `.opencode/specs/.../011-index-scope-and-constitutional-tier-invariants/research/research.md`
- `.opencode/specs/.../026-graph-and-context-optimization/description.json`
- `.opencode/specs/.../026-graph-and-context-optimization/graph-metadata.json`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` (grep only)
- `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` (grep only)
- live DB: `.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`

## DB Truth Audit (critical signal)

All six DB claims from `implementation-summary.md` VERIFIED GREEN against the live Voyage-4 SQLite DB:

| Claim | Query result | Expected | Status |
|-------|--------------|----------|--------|
| `constitutional_total = 2` | `2` | `2` | PASS |
| `z_future_rows = 0` | `0` | `0` | PASS |
| `external_rows = 0` | `0` | `0` | PASS |
| `gate_enforcement_rows = 1` | `1` | `1` | PASS |
| `constitutional/README.md not indexed` | `0` | `0` | PASS |
| Two constitutional paths = gate-enforcement.md + gate-tool-routing.md | confirmed both paths present | both | PASS |

No DB-verified claim is falsified. The implementation-summary.md verification table is fully accurate.

## Findings - New

### P0 Findings
- None.

### P1 Findings

1. **spec.md Status field contradicts delivered state** — `.opencode/specs/.../011/spec.md:56` — Metadata table declares `Status | In Progress` while `implementation-summary.md:35` declares `Completed | Yes`, `checklist.md:117` records `Verification Date: 2026-04-24`, and tasks.md:16 carries `completion_pct: 100`. Downstream consumers (graph-metadata status derivation, resume ladder) that anchor on spec.md truth will report wrong state. Clear traceability drift because spec.md was never updated post-implementation despite being the canonical entry point.

```json
{
  "claim": "spec.md declares Status=In Progress while every other packet artifact declares complete, so the canonical entry-point contradicts the verified final state.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/spec.md:56",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/implementation-summary.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/checklist.md:117",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/tasks.md:16"
  ],
  "counterevidenceSought": "Checked whether 'In Progress' could refer to a sub-phase (none exist under 011); checked description.json/graph-metadata.json for explicit status (derived via implementation-summary fallback, which reports complete).",
  "alternativeExplanation": "Could be a template-boilerplate artifact the user intentionally left, but checklist + impl-summary + tasks are all post-implementation updated while spec.md frontmatter and Status row are frozen at scaffolding time — pattern matches stale-drift, not intent.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "User states spec.md Status is intentionally kept at 'In Progress' as a convention, OR a downstream consumer is demonstrated to ignore spec.md Status and prefer impl-summary."
}
```

2. **plan.md + decision-record.md + spec.md `_memory.continuity` frontmatter is stale** — `.opencode/specs/.../011/plan.md:11-23`, `.opencode/specs/.../011/decision-record.md:11-21`, `.opencode/specs/.../011/spec.md:13-27` — All three files carry `completion_pct: 20` and scaffolding-era `recent_action` values (`"Packet scaffolded"`, `"Plan drafted"`, `"ADRs drafted"`), while `tasks.md:19-21`, `checklist.md:12-21`, `implementation-summary.md:11-20` correctly carry `completion_pct: 100` and `recent_action: "Implementation, README reversal, and verification completed"`. Memory resume ladder reads `_memory.continuity` from these exact frontmatter blocks per the user's global rule; stale blocks cause resume to show 20% complete for half the packet's artifacts. Directly affects `/spec_kit:resume` correctness.

```json
{
  "claim": "plan.md, decision-record.md, and spec.md _memory.continuity blocks report completion_pct=20 and scaffolding-era recent_action strings while the packet is fully delivered — these three frontmatter blocks were never refreshed after implementation.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/plan.md:11-23",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/decision-record.md:11-21",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/spec.md:13-27",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/tasks.md:19-21",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/implementation-summary.md:13-20"
  ],
  "counterevidenceSought": "Confirmed the global memory rule that AI may directly edit _memory.continuity blocks, so these are actively consumed by resume ladder, not just template residue. Verified tasks.md + checklist.md + impl-summary.md were updated in tandem (last_updated_at=2026-04-24T06:50:00Z) while plan/DR/spec carry 2026-04-24T00:00:00Z.",
  "alternativeExplanation": "Could be an explicit author choice to keep planning-phase frontmatter frozen as a historical record — but this contradicts how three sibling docs were updated and contradicts the documented resume ladder contract. Pattern matches forgotten-update, not intentional versioning.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "User confirms they deliberately keep scaffolding-era continuity in planning docs (not observed elsewhere in this codebase)."
}
```

3. **plan.md Implementation Phases + Definition of Done checkboxes all unchecked after completion** — `.opencode/specs/.../011/plan.md:59-62, 87-100` — `Definition of Done` block lists three `[ ]` items ("All acceptance criteria met", "Tests passing", "Docs updated"), and every `[ ]` entry in `Phase 1`, `Phase 2`, `Phase 3` remains unchecked, while tasks.md T001-T014 are all `[x]` and CHK-001 through CHK-122 in checklist.md are all `[x]`. Plan.md was never brought into alignment with the verified final state, so its DoD audit trail is misleading. Any reviewer auditing "is the plan satisfied?" by reading plan.md alone gets a false negative.

```json
{
  "claim": "plan.md DoD and Implementation Phases checkboxes are all unchecked despite tasks.md and checklist.md recording full completion — plan.md was not synchronized post-delivery.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/plan.md:59-62",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/plan.md:87-100",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/tasks.md:79-106",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/checklist.md:45-137"
  ],
  "counterevidenceSought": "Checked whether plan.md DoD is intentionally pointer-to-checklist rather than a live checklist; it's written as live checkboxes, not a reference, so unchecked state implies not done.",
  "alternativeExplanation": "Some teams treat plan.md DoD as frozen planning artifact and rely on checklist.md for verification truth. But this codebase's Level 3 template uses both, and other completed packets in 026 typically flip plan.md DoD to [x] after finalization.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Evidence that plan.md DoD is template-frozen convention in this repo (grep completed sibling packets for [x] vs [ ] pattern shows inconsistent convention → downgrade to P2)."
}
```

### P2 Findings

1. **spec.md Section 13 OPEN QUESTIONS references stale 2-or-3 README ambiguity** — `.opencode/specs/.../011/spec.md:291-294` — Open question text: "The only runtime-sensitive question is whether the final README indexing count lands at `2` or `3`, depending on whether the README reindex is run during verification." After ADR-005 (Accepted, supersedes ADR-004), the answer is unambiguously `2` — the README must stay excluded. The open-question text should either be removed or annotated as `RESOLVED by ADR-005: final count = 2`.

2. **Feature catalog + manual testing playbook carry zero references to the three invariants** — `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` + `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — Grep for `z_future`, `external`, `constitutional-tier`, `index-scope` returns ONLY incidental hits ("external ML dependencies", "external MCP", "constitutional-tier and trigger-matched memories" in unrelated contexts, "external files" in 254-code-graph-scan-query.md). NO entry describes the three permanent invariants landed by packet 011 or the shared `index-scope.ts` helper. The spec.md `Files to Change` table did not list these two surfaces in scope, so this is an acknowledged-scope gap rather than a broken promise; however, `README.md` WAS in scope and was updated (`mcp_server/README.md:111-116`), and the feature-catalog/testing-playbook drift will compound as the packet ages unacknowledged. Flag as P2 future-work traceability gap.

3. **decision-record.md does not reference packet 010 A2 post-filter or fromScan Fix B2 beyond a scope lock note** — `.opencode/specs/.../011/decision-record.md:51` — ADR-001 Constraints mentions "The packet must not change unrelated save semantics or refactor the `fromScan` work from packet 010." That is a scope lock, not a cross-reference. Packet 011's save-time guard at `memory-save.ts:306` + `memory-save.ts:2695` directly complements packet 010's canonical-path post-filter (Fix A) and fromScan transactional recheck (Fix B2) to form defense-in-depth across scan-originated and direct saves. No ADR documents that layering or explains why packet 011's guard still works when packet 010 is active. Reviewers tracing the save-path invariant history cannot reconstruct the composition from either packet alone.

4. **Duplicate backslash in 026 graph-metadata.json child reference** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:17` — Path `"system-spec-kit/026-graph-and-context-optimization//011-index-scope-and-constitutional-tier-invariants"` contains a double-slash `//`. Spec-doc classification normalizes `\\` but graph traversal that treats `//` as a significant separator or uses the string as a key prefix could mismatch. Adjacent keys in description.json use single-slash convention. Cosmetic drift with low blast radius; flagged for consistency.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` (spec claims ↔ code) | pass | spec.md claims about `z_future` exclusion, `/external/` exclusion, constitutional path gate, README exclusion, cleanup CLI all resolve to the cited files and line regions in `lib/utils/index-scope.ts`, `handlers/memory-save.ts`, `handlers/memory-index-discovery.ts`, `lib/parsing/memory-parser.ts`, `scripts/memory/cleanup-index-scope-violations.ts`. |
| `checklist_evidence` (P0/P1 items cite verifiable evidence) | pass | CHK-001 through CHK-122 each cite file:line or command-output evidence; every cited test file exists (`index-scope.vitest.ts`, `memory-save-index-scope.vitest.ts`, `handler-memory-index.vitest.ts`, `memory-parser-extended.vitest.ts`, `full-spec-doc-indexing.vitest.ts`, `gate-d-regression-constitutional-memory.vitest.ts`). Checklist summary counts (P0=14, P1=16) match actual enumeration. |
| `spec_code` (implementation-summary DB claims ↔ live DB) | pass | Six DB claims (constitutional_total, z_future_rows, external_rows, gate_enforcement_rows, README row count, constitutional path enumeration) all match live SQLite queries. |
| `feature_catalog_code` overlay | partial | No feature-catalog entry describes the three invariants or `lib/utils/index-scope.ts` helper. Not in declared scope but surfaced as P2 future-work. |
| `playbook_capability` overlay | partial | No manual-testing-playbook entry covers invariant enforcement. Same scope treatment as feature catalog. |
| Research.md reference integrity | pass | Sampled six specific file:line citations (stage1-candidate-gen.ts:1075, vector-index-store.ts:630, structural-indexer.ts:1186, memory-parser.ts:335/822/829, memory-save.ts:297, create-record.ts:347) — all resolve to the claimed concepts even where exact line may have drifted ±few lines during final edits. |
| DR ↔ implementation | partial | ADR-002 (delete z_future), ADR-003 (downgrade to important), ADR-005 (exclude README) all accurately reflect implementation. ADR-004 correctly marked Superseded with reversal note. ADR does not document packet 010 composition (see P2-new-3 above). |
| Parent 026 topology references 011 | pass | `description.json:41` and `graph-metadata.json:17` both list the child packet (with cosmetic `//` drift noted as P2-new-4). |

Summary: 6 protocols executed, 5 pass, 3 partial (overlay scope gaps + DR 010 cross-ref gap). Zero gating failures.

## Confirmed-Clean Surfaces

- Live DB state fully matches implementation-summary.md — no falsified quantitative claim.
- Test file references in checklist.md all resolve (8 test files exist at the cited paths).
- ADR-004 Superseded note correctly acknowledges the README reversal chain and points to ADR-005.
- Research.md file:line citations are sound — lines may drift ±3 but the claimed concept is at the cited region.
- Parent 026 `description.json` + `graph-metadata.json` include packet 011 as a child.
- `mcp_server/README.md:111-116` documents the three invariants and the shared helper location as promised by CHK-043.
- Checklist enumeration matches summary counts (P0=14, P1=16, P2=0).
- The `009/012-docs-impact-remediation` reference in spec.md lines 92 and 265 is valid — that packet exists at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation/`.

## Cross-Reference to Iter-1/Iter-2

- Iter-1 (correctness) and iter-2 (security) findings are code/runtime-side and were issued AFTER the packet docs were finalized on 2026-04-24T06:50:00Z. The packet cannot reference them, and the checklist's "all P0/P1 resolved" claim applies to the packet's own verification scope (implementation + tests + cleanup), not to deep-review findings. No retroactive traceability drift.
- Iter-1 P1-006 (stripDeletedIdsFromMutationLedger no-op stub) is NOT cross-referenced in implementation-summary.md Cleanup Apply Details table (line 121 reports `rewritten_mutation_ledger_rows=0`). The report correctly reflects runtime output, but runtime output is misleading because the stub always returns `0` regardless of input. This is iter-1's finding, not a new traceability issue — noted for synthesis.
- No iter-1/iter-2 finding contradicts this iteration's traceability assessment.

## Coverage

- filesReviewed: 19 of 19 targeted (all spec docs + code evidence + live DB + parent topology + overlay surfaces)
- dimensionsComplete: correctness, security, traceability
- remaining dimension: maintainability

## Next Focus

maintainability (iteration 4). Priorities:
- Single-source-of-truth consistency: do `EXCLUDED_FOR_MEMORY` (`index-scope.ts:25`) and `SPEC_DOC_EXCLUDE_DIRS` (`memory-index-discovery.ts:27`) + `spec-doc-paths.ts` exclusion list stay aligned over time, or are there duplicate lists that will drift?
- Cleanup CLI readability + idempotence ergonomics (cross-ref iter-1 P1-005 + P1-006 from a maintainability angle — is the CLI easy to run in CI?).
- Test isolation: do `index-scope.vitest.ts` + `memory-save-index-scope.vitest.ts` share fixtures safely, or is there hidden state?
- Dead code: is `stripDeletedIdsFromMutationLedger` (iter-1 P1-006 stub) called anywhere that would make its no-op status painful to remove?
- Type-level clarity: does `index-scope.ts` export enough of the internal pattern-compilation machinery that consumers can write equivalent tests without mocks?
