# Deep Review Report - 003-deduplicate-entities

## 1. Executive summary

Verdict: PASS under the user-requested rule set (`P0 => FAIL`, `>=5 P1 => CONDITIONAL`, otherwise `PASS`). `hasAdvisories=true`.

The 10-iteration loop found no P0 findings and no security findings. It did find 2 P1 issues and 4 P2 advisories. The highest-impact problems are metadata/documentation drift: `description.json` still carries the old `010-search-and-routing-tuning` parent chain, and the packet repeatedly claims the old 16-entity cap even though current parser/test behavior is 24.

Stop reason: `maxIterationsReached`.

## 2. Scope

Reviewed:

| Artifact | Purpose |
|----------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` | Packet contract, plan, verification, and closeout |
| `description.json`, `graph-metadata.json` | Generated metadata surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Referenced implementation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Referenced focused tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | Referenced verification suite |

Not reviewed as writable scope: production code. This loop wrote only under `review/**`.

## 3. Method

The loop ran 10 iterations and rotated dimensions in the requested order: correctness, security, traceability, maintainability, then repeated. Each pass read prior state, selected one dimension, reviewed packet docs against live code/test evidence, wrote an iteration file, wrote a JSONL delta, updated the registry, and appended state events.

Convergence checks covered new-findings ratio, dimension coverage, P0 absence, and stuck threshold. The loop stopped at max iterations, not early convergence.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| None | - | No P0 findings. | - |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| F001 | traceability | `description.json` parentChain still points at the pre-renumbered `010-search-and-routing-tuning` phase while `specFolder` and `graph-metadata.json` point at `001-search-and-routing-tuning`. | `description.json:2`; `description.json:13-18`; `description.json:23-31`; `graph-metadata.json:3-5` |
| F002 | correctness | The packet claims the 16-entity cap is preserved, but live parser and test behavior now use a 24-entity cap. | `plan.md:16`; `tasks.md:10`; `checklist.md:12`; `implementation-summary.md:53`; `graph-metadata-parser.ts:912`; `graph-metadata-schema.vitest.ts:514-522` |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| F003 | maintainability | The packet's graph metadata keeps mixed-format duplicate `key_files` for the same parser/test files. | `graph-metadata.json:33-41`; `graph-metadata-parser.ts:938-942` |
| F004 | maintainability | The packet's entity list includes stop-word key phrases `a` and `the`, which waste entity slots. | `graph-metadata.json:137-146`; `graph-metadata-parser.ts:897-908`; `entity-extractor.ts:139-149` |
| F005 | traceability | `_memory.continuity.next_safe_action` still says to run repo-wide backfill even though this packet and the parent closeout claim completion. | `implementation-summary.md:17`; `implementation-summary.md:27`; `../implementation-summary.md:20-21` |
| F006 | traceability | Spec and plan line anchors for `deriveEntities()` point at stale parser line ranges. | `spec.md:18`; `plan.md:13-14`; `graph-metadata-parser.ts:820` |

## 5. Findings by dimension

| Dimension | Iterations | Findings | Summary |
|-----------|------------|----------|---------|
| correctness | 001, 005, 009 | F002 | Runtime behavior is consistent, but packet verification still describes the old cap. |
| security | 002, 006, 010 | None | No secrets, injection path, auth issue, or arbitrary write expansion found. |
| traceability | 003, 007 | F001, F005, F006 | Packet metadata and anchors need refresh after renumbering and parser movement. |
| maintainability | 004, 008 | F003, F004 | Generated metadata is deduped by entity name but still has low-signal references. |

## 6. Adversarial self-check for P0

Hunter position: A stale `description.json.parentChain` could misroute memory retrieval and graph traversal after migration.

Skeptic position: `specFolder`, `graph-metadata.json.packet_id`, and `graph-metadata.json.parent_id` are current, so the stale parentChain is not enough evidence for a P0 release blocker.

Referee decision: No P0. F001 remains P1 because it is a real metadata contradiction, but one canonical graph surface still points at the right parent.

## 7. Remediation order

1. Fix F001 by regenerating or patching `description.json.parentChain` so it uses `001-search-and-routing-tuning`.
2. Fix F002 by deciding whether 24 is the intended current cap. If yes, update `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`; if no, change parser/test behavior back to 16.
3. Refresh stale source anchors for F006 while touching the docs for F002.
4. Update `_memory.continuity.next_safe_action` for F005 after the metadata refresh is complete.
5. Consider a follow-up parser hygiene phase for F003/F004 if graph precision remains important.

## 8. Verification suggestions

| Check | Purpose |
|-------|---------|
| `jq -r '.parentChain[]' description.json` | Confirm the parent chain no longer contains `010-search-and-routing-tuning`. |
| `jq '.derived.entities | length' graph-metadata.json` | Confirm documented entity cap and generated metadata agree. |
| `rg -n "16-entry|16-entity|slice\\(0, 16\\)" 003-deduplicate-entities .opencode/skill/system-spec-kit/mcp_server` | Find remaining stale cap claims. |
| `jq '.derived.key_files' graph-metadata.json` | Confirm whether mixed-format duplicate references remain. |
| Focused tests: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-schema.vitest.ts` | Recheck parser contract after any cap or metadata changes. |

## 9. Appendix

### Iteration list

| Iteration | Dimension | New findings ratio | New findings | Notes |
|-----------|-----------|--------------------|--------------|-------|
| 001 | correctness | 0.45 | F002 | Found cap-contract drift. |
| 002 | security | 0.12 | None | No security issue. |
| 003 | traceability | 0.55 | F001, F006 | Found stale parentChain and line anchors. |
| 004 | maintainability | 0.25 | F003, F004 | Found metadata hygiene advisories. |
| 005 | correctness | 0.11 | None | Refined F002. |
| 006 | security | 0.10 | None | No security issue. |
| 007 | traceability | 0.18 | F005 | Found stale continuity action. |
| 008 | maintainability | 0.10 | None | Refined F003/F004. |
| 009 | correctness | 0.10 | None | Final correctness pass. |
| 010 | security | 0.09 | None | Final security pass; max iterations reached. |

### Delta churn

| Delta | Churn | Finding refs |
|-------|-------|--------------|
| `deltas/iter-001.jsonl` | 0.45 | F002 |
| `deltas/iter-002.jsonl` | 0.12 | - |
| `deltas/iter-003.jsonl` | 0.55 | F001, F006 |
| `deltas/iter-004.jsonl` | 0.25 | F003, F004 |
| `deltas/iter-005.jsonl` | 0.11 | F002 refined |
| `deltas/iter-006.jsonl` | 0.10 | - |
| `deltas/iter-007.jsonl` | 0.18 | F005 |
| `deltas/iter-008.jsonl` | 0.10 | F003/F004 refined |
| `deltas/iter-009.jsonl` | 0.10 | F002 refined |
| `deltas/iter-010.jsonl` | 0.09 | - |
