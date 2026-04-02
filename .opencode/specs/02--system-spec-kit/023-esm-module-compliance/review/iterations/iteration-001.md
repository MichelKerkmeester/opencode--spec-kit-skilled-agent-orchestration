# Review Iteration 001: D1 Correctness — core ESM boundary

## Focus
D1 Correctness — core ESM boundary

## Scope
- Review target: .opencode/specs/02--system-spec-kit/023-esm-module-compliance
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P1-023-001: Scripts boundary still uses direct sibling imports instead of a consistently explicit interop seam
- Dimension: D1 Correctness
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/spec.md:116]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/tasks.md:60]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/checklist.md:46]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:59]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:16]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:17]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:15]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/tsconfig.json:2]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:5]
- Impact: The packet claims the CommonJS scripts package now crosses a clean explicit interop boundary, but the current tree still contains direct sibling imports from a CommonJS package into migrated ESM packages.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "The spec-023 root packet overstates completion of the scripts-side ESM interoperability boundary.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/023-esm-module-compliance/spec.md:116",
    ".opencode/specs/02--system-spec-kit/023-esm-module-compliance/tasks.md:60",
    ".opencode/specs/02--system-spec-kit/023-esm-module-compliance/checklist.md:46",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:59"
  ],
  "counterevidenceSought": "Checked whether the imports are isolated to tests or type-only shims; several are live runtime or operator entrypoints.",
  "alternativeExplanation": "If the TypeScript pipeline always rewrites these imports into a safe runtime bridge, the docs could still be directionally right, but the source contract presented to maintainers is not explicit today.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade if the runtime pipeline proves these imports compile into a documented explicit bridge and the packet is updated to describe that mechanism precisely."
}
```
### P1-023-002: Node 25 interoperability proof is recorded as shipped while package engines still advertise Node 20.11 as sufficient
- Dimension: D1 Correctness
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:46]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:73]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:84]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:7]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/shared/package.json:19]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:40]
- Impact: The runtime-compatibility story is internally inconsistent: the packet celebrates Node 25-native `require(esm)` proof, but the shipped manifests still promise a lower engine floor.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "Spec-023 does not currently prove its advertised interoperability story on the declared engine minimum.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:46",
    ".opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:73",
    ".opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:84",
    ".opencode/skill/system-spec-kit/scripts/package.json:7"
  ],
  "counterevidenceSought": "Looked for matching Node-25-only engine bumps or scoped caveats in package metadata and packet docs; none were found in the cited surfaces.",
  "alternativeExplanation": "The team may intend Node 25 proof as supplemental rather than normative, but the implementation summary presents it as the key boundary decision.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if manifests or packet docs are updated to make Node 25 an explicit requirement or to narrow the claim to a verification-only environment."
}
```

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- Checked package metadata, tsconfig mode, and current runtime entrypoints for archived crash claims; no fresh top-level-await blocker surfaced.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:40]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:59]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:17]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:15]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:5]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:7]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:16]
- [SOURCE: .opencode/skill/system-spec-kit/shared/package.json:19]
- [SOURCE: .opencode/skill/system-spec-kit/tsconfig.json:2]
- [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/checklist.md:46]
- [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:46]
- [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:73]
- [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md:84]
- [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/spec.md:116]
- [SOURCE: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/tasks.md:60]

## Assessment
- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D1 Correctness — core ESM boundary

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.
