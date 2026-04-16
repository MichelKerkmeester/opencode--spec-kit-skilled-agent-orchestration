# Iteration 48 - test-quality - tests

## Dispatcher
- iteration: 48 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:38:23.134Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`intent-classifier.vitest.ts`'s "overall accuracy" guards exclude 2 of the 7 public intents, so the suite can stay green while `find_spec` or `find_decision` regresses.** The runtime contract is seven-way classification, but both aggregate accuracy tests only score `add_feature`, `fix_bug`, `refactor`, `security_audit`, and `understand`; `find_spec` / `find_decision` only get single canonical smoke checks later. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-8`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:32-39`, `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:255-272`, `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:504-596`, `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:652-666`.

```json
{
  "claim": "The suite's aggregate accuracy thresholds are a false positive for the full 7-intent contract because they omit find_spec and find_decision from the measured datasets.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-8",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:32-39",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:255-272",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:504-596",
    ".opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:652-666"
  ],
  "counterevidenceSought": "I looked for dataset-style accuracy checks covering find_spec and find_decision in this suite; the only coverage I found for them was single-query smoke assertions, not the advertised aggregate thresholds.",
  "alternativeExplanation": "The omission may be intentional because those two intents had smaller fixture sets during rollout, but the test names still claim overall/category accuracy without scoping that limitation.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if another CI-enforced suite already measures multi-sample accuracy for find_spec and find_decision with comparable thresholds."
}
```

2. **The dedicated governance/security suite never exercises the `agentId` actor branch, even though the implementation treats `agentId` as a first-class isolation boundary.** `validateGovernedIngest` allows `userId or agentId`, and both row predicates and audit filters enforce `agent_id`, but every reviewed fixture uses `user_id` only. A regression in agent-scoped isolation would therefore evade the suite meant to guard governance behavior. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:217-220`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:374-380`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:410-423`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:21-43`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:57-120`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:222-257`.

```json
{
  "claim": "memory-governance.vitest.ts leaves the agent-scoped security path untested, so a bug in agent_id enforcement could ship undetected.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:217-220",
    ".opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:374-380",
    ".opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:410-423",
    ".opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:21-43",
    ".opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:57-120",
    ".opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:222-257"
  ],
  "counterevidenceSought": "I looked for agent_id fixtures/assertions inside the reviewed governance suite and did not find any; the tested rows and filters are all tenant/user/session combinations.",
  "alternativeExplanation": "Agent-only coverage may exist in a different suite, but this file is the dedicated governance regression surface and currently leaves that branch uncovered.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if another governance-focused test suite already covers agent-only ingest validation, predicate filtering, and audit review paths."
}
```

### P2 Findings
- **False-positive parameter tests in `handler-memory-triggers.vitest.ts`.** `T517-7` and `T517-8` are labeled as `limit` / `turnNumber` validation, but they only re-check that `handleMemoryMatchTriggers` is a function. Meanwhile both parameters affect runtime behavior in `memory-triggers.ts` (`limit` is normalized and applied at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:231-233`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:287`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:441`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:476`; `turnNumber` is normalized and consumed at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:234-236`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398-399`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:467`). Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:123-131`.

## Traceability Checks
- **Gate D resume behavior matches the intended direct-read ladder.** `executeResumeStrategy()` goes straight to `buildResumeLadder()` and returns canonical-doc results without calling memory search (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883-925`). `memory-context.resume-gate-d.vitest.ts` verifies the intended `handover -> continuity -> spec_docs` fallback order and asserts `handleMemorySearch` is untouched (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:104-290`).
- **Dispatcher/repo mismatch:** the suggested file `.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts` does not exist at the provided path, so that surface could not be reviewed in this iteration.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts` — good end-to-end assertions for each rung of the Gate D ladder, plus an explicit guard that resume mode does not fall back to `handleMemorySearch`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts` — covers metric math, tie-breaking, experimental flag gating, and the continuity fixture that keeps baseline `K=60`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts` — solid env/default regression coverage, including shared DB-dir fallback and phase/capability independence.
- `.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts` — strong schema/alignment checks between `TOOL_DEFINITIONS`, layer prefixes, and layer maps.

## Next Focus
- Sweep the still-large unreviewed suites first in iteration 49: `hybrid-search.vitest.ts`, `memory-context.vitest.ts`, `memory-parser.vitest.ts`, `memory-parser-extended.vitest.ts`, and `memory-lineage-state.vitest.ts`.
