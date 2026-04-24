## Iteration 02

### Focus
Cross-file PE lineage safety: verify the downgrade point, candidate-path plumbing, and the evidence that sibling docs no longer mutate each other's lineage chains.

### Findings
- `evaluateAndApplyPeDecision()` now compares the chosen PE candidate's canonical path to the current save target and rewrites cross-file `UPDATE`/`REINFORCE` decisions to `CREATE` before any mutation helper runs. (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:77-109`)
- Candidate canonical paths are preserved all the way out of vector search, including scope filtering and same-path exclusion against both `canonical_file_path` and `file_path`. (`.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:100-168`)
- The two dedicated regressions prove the exact sibling-doc failure mode: a `tasks.md` save facing a `checklist.md` candidate is downgraded to `CREATE` for both `UPDATE` and `REINFORCE`, and neither mutating helper is called. (`.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:46-159`)
- The downgrade is local to orchestration rather than search itself, which preserves candidate visibility for scoring and logging while moving the lineage safety rule to the last responsible moment. (`plan.md §3. ARCHITECTURE`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:69-99`)

### New Questions
- Does the canonical-path comparison still behave correctly for legacy rows whose `canonical_file_path` is null?
- Are there any remaining cross-path mutation routes outside `UPDATE` and `REINFORCE`, especially `SUPERSEDE`?
- What deeper lineage invariant would catch a missed downgrade if one slipped through?
- How does this PE-layer fix interact with scan-time batch concurrency?

### Status
new-territory
