# Deep Review Report - Continuity Search Profile

## 1. Executive summary

**Verdict:** `CONDITIONAL`  
**Finding totals:** `P0=0`, `P1=5`, `P2=1`, `hasAdvisories=true`

The 10-iteration review did **not** find a correctness or security blocker in the shipped continuity-profile runtime. The conditional verdict is driven by packet drift instead: the scope/verification narrative is internally contradictory, `description.json` carries stale lineage after renumbering, and `graph-metadata.json` is no longer reliably canonical.

## 2. Scope

Reviewed packet artifacts:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed runtime evidence surfaces:

- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts`

## 3. Method

1. Ran 10 iterations, rotating `correctness -> security -> traceability -> maintainability` until the requested ceiling.
2. Read the packet state before each pass and re-used the prior findings registry and JSONL log.
3. Cross-checked packet claims against the live runtime path and tests to separate implementation defects from packet-only drift.
4. Recorded only evidence-backed findings with file-and-line citations.

## 4. Findings by severity

### P0

No P0 findings.

### P1

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F001 | traceability | `tasks.md` contradicts its own intent-classifier boundary | [SOURCE: tasks.md:8] [SOURCE: tasks.md:11] [SOURCE: tasks.md:15] |
| F002 | traceability | `plan.md` and `implementation-summary.md` never reconcile the intent-classifier exception | [SOURCE: plan.md:13-16] [SOURCE: implementation-summary.md:52-54] |
| F003 | traceability | `description.json` retained the pre-renumber parentChain | [SOURCE: description.json:14-19] [SOURCE: description.json:26] [SOURCE: graph-metadata.json:3-5] |
| F004 | maintainability | `graph-metadata.json` carries conflicting intent-classifier test paths | [SOURCE: graph-metadata.json:34-41] |
| F005 | traceability | Packet verification points at the wrong runtime seam for continuity handoff | [SOURCE: plan.md:13-16] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1227] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830-832] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:567-572] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209-210] |

### P2

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F006 | maintainability | `graph-metadata.json` entity extraction includes low-signal tokens | [SOURCE: graph-metadata.json:129] [SOURCE: graph-metadata.json:159] [SOURCE: graph-metadata.json:183] |

## 5. Findings by dimension

### Correctness

No open correctness finding. The live continuity implementation, handler/profile routing, and continuity-specific tests were internally consistent. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60-68] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830-832] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:417-431]

### Security

No open security finding. The review found no new public intent surface, secret exposure, or trust-boundary regression. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:141-171] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260-291]

### Traceability

Traceability is the dominant risk. The packet's plan, tasks, checklist, implementation summary, and generated lineage metadata no longer agree on what changed, where to verify it, or how the packet sits in the renumbered tree. [SOURCE: plan.md:13-16] [SOURCE: tasks.md:8-15] [SOURCE: implementation-summary.md:52-54] [SOURCE: description.json:14-19]

### Maintainability

Maintainability risk is concentrated in `graph-metadata.json`, which now carries conflicting path records and low-signal derived entities. [SOURCE: graph-metadata.json:34-41] [SOURCE: graph-metadata.json:57-60] [SOURCE: graph-metadata.json:129] [SOURCE: graph-metadata.json:159] [SOURCE: graph-metadata.json:183]

## 6. Adversarial self-check for P0

No P0 candidate survived adversarial re-read. I specifically challenged whether the continuity profile created a dead runtime path, a public intent expansion, or a release-blocking security regression, and the runtime files/tests stayed consistent under re-read. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830-832] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260-291] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:753-769]

## 7. Remediation order

1. Reconcile `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so the packet has one authoritative statement of scope and verification.
2. Regenerate `description.json` so `parentChain` matches the current `001-search-and-routing-tuning` lineage.
3. Regenerate `graph-metadata.json` so `key_files` and `entities` use one canonical `intent-classifier.vitest.ts` path and drop low-signal entity garbage.
4. Re-run a packet-local review once the doc and metadata surfaces have been regenerated.

## 8. Verification suggestions

- Re-run the packet metadata generators that produce `description.json` and `graph-metadata.json`.
- Re-check the packet after regeneration to confirm the traceability contradictions are resolved.
- If any runtime references move while reconciling the packet docs, re-run the continuity-targeted tests already named in the packet:
  - `tests/adaptive-fusion.vitest.ts`
  - `tests/adaptive-ranking.vitest.ts`
  - `tests/k-value-optimization.vitest.ts`
  - `tests/intent-classifier.vitest.ts`

## 9. Appendix

### Iteration list

| Iteration | Dimension | New refs | Ratio |
|---|---|---|---:|
| 001 | correctness | none | 0.08 |
| 002 | security | none | 0.06 |
| 003 | traceability | F001, F002 | 0.42 |
| 004 | maintainability | F004, F006 | 0.18 |
| 005 | correctness | F005 | 0.14 |
| 006 | security | none | 0.04 |
| 007 | traceability | F003 | 0.17 |
| 008 | maintainability | refinement only | 0.11 |
| 009 | correctness | none | 0.04 |
| 010 | security | none | 0.03 |

### Delta churn

`0.08 -> 0.06 -> 0.42 -> 0.18 -> 0.14 -> 0.04 -> 0.17 -> 0.11 -> 0.04 -> 0.03`
