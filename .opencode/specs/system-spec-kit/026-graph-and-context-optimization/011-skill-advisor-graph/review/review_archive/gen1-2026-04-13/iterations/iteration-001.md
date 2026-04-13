# Iteration 1: D1 correctness review of graph integration

## Focus
Correctness review of `.opencode/skill/skill-advisor/scripts/skill_advisor.py` graph helpers (`_load_skill_graph`, `_apply_graph_boosts`, `_apply_family_affinity`, `_apply_graph_conflict_penalty`), their call sites, and `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` / `skill-graph.json`.

## Scorecard
- Dimensions covered: D1 Correctness
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20

## Findings

### P0 - Blocker
- None.

### P1 - Required
- **F001**: Conflict penalty never sees eligible recommendations — `.opencode/skill/skill-advisor/scripts/skill_advisor.py:163` — `_apply_graph_conflict_penalty()` builds `passing` from `passes_threshold`, but each recommendation is initialized with `"passes_threshold": False` and the real threshold check is only assigned after the helper runs. That makes the conflict path a no-op for freshly computed recommendations, so any future non-empty `conflicts` list from the compiler will be ignored. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1595] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:163] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1605-1619]

#### Claim Adjudication Packet — F001
```json
{
  "findingId": "F001",
  "claim": "_apply_graph_conflict_penalty() can never penalize same-pass recommendations because it filters on passes_threshold before that flag is computed for the current recommendation set.",
  "evidenceRefs": [
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:1595",
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:163",
    ".opencode/skill/skill-advisor/scripts/skill_advisor.py:1605-1619"
  ],
  "counterevidenceSought": "Re-read apply_confidence_calibration() and the downstream ranking/threshold path to check whether passes_threshold was populated earlier in the pipeline; it is only initialized to false at construction time and set after the conflict helper returns.",
  "alternativeExplanation": "The helper might have been intended to run after filter_recommendations(), but get_skill_recommendations() invokes it earlier on a freshly built list, so that interpretation does not match the shipped call order.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If the conflict helper is intentionally removed or rewritten to operate on score-ranked recommendations before thresholding, downgrade this to P2 historical cleanup.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2 - Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/skill/skill-advisor/scripts/skill_advisor.py:154-171`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:424-431`, `.opencode/skill/skill-advisor/scripts/skill-graph.json:1` | Producer/consumer contract checked for conflicts; broader spec trace deferred to D3. |
| checklist_evidence | pending | hard | - | Deferred to D3 Traceability. |
| feature_catalog_code | notApplicable | soft | - | D1 correctness pass did not inspect catalog docs. |
| playbook_capability | notApplicable | soft | - | D1 correctness pass did not inspect playbook docs. |

## Assessment
- New findings ratio: 0.20
- Dimensions addressed: D1 Correctness
- Novelty justification: One new logic defect was confirmed in the advisor consumer path after reading all four graph helpers, the graph-aware call sites, the compiler conflict emission, and the compiled graph payload.

## Ruled Out
- Transitive graph boosts compounding recursively within a single pass were ruled out because `_apply_graph_boosts()` reads from a frozen `snapshot` before mutating live scores. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:93-128]
- A compiler-side conflict serialization bug was ruled out for the current artifact because the compiler explicitly emits `conflicts` from `conflicts_with` edges and the checked payload currently contains an empty list. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:424-431] [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]

## Dead Ends
- Attempting to prove an active runtime conflict case from checked-in metadata went nowhere because no `conflicts_with` edges are currently compiled into `skill-graph.json`, so the broken helper stays latent in today's artifact set. [SOURCE: .opencode/skill/skill-advisor/scripts/skill-graph.json:1]

## Recommended Next Focus
D2 Security — review JSON/file loading and path handling in `skill_advisor.py` and `skill_graph_compiler.py`, especially graph file loading, metadata discovery, and derived path validation.
