## [004-verification-and-standards] - 2026-03-30

This phase matters because it proved the move to ESM (JavaScript's modern module format) was safe to ship before the team locked new standards in place. It re-tested the riskiest runtime paths first, passed the full verification matrix, and only then synced standards and packet records to verified behavior instead of assumptions. Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/004-verification-and-standards/`

---

## What Changed

### Testing

- **Highest-risk runtime retests** -- The migration changed the parts of the system most likely to fail when modules load at runtime, and those areas needed focused proof before anything else. Re-tested all seven research-flagged risk surfaces and confirmed they still passed. This matters because it checked the most fragile paths first instead of hiding problems inside a larger test run.

- **Full verification matrix** -- A clean build alone does not prove a release is safe. Ran the root gates, workspace builds, package tests, module-sensitive test suites, runtime smoke checks, and script interop checks until the full matrix passed. This matters because the release now has end-to-end runtime proof, not just compile-time confidence.

### Documentation

- **Standards synced to verified behavior** -- Standards and README guidance can drift during a migration and end up describing the plan rather than the truth. Updated `sk-code--opencode` and related standards surfaces only after verification passed, so they now describe the proven ESM runtime state. This matters because future work will follow rules that match the system people actually run.

- **Parent packet closure** -- The migration still needed a final, evidence-backed record of what shipped and what was proven. Updated the parent implementation summary, marked all P0 and P1 checklist items with evidence, and set the parent spec status to complete. This matters because the packet now closes with a clear audit trail instead of scattered notes.

### Bug Fixes

- **Tool schema compatibility repair** -- Some GPT-style tool calls can fail when a tool schema (the machine-readable contract a caller reads) uses unsupported validation hooks. Removed `superRefine` from the affected schemas and moved that validation into handlers. This matters because automated callers stay compatible without losing the safety checks.

- **Deep review findings folded into the verified state** -- The 30-iteration deep review had identified issues that still needed to be reflected in the final standards pass. Absorbed those findings while syncing the documentation and verification results. This matters because the published guidance now reflects reviewed, corrected behavior instead of pre-review assumptions.

## Files Changed

| File | What changed |
|------|-------------|
| `.opencode/skill/sk-code--opencode/**/*.md` | Updated standards guidance to match the verified ESM runtime state |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Moved search-input validation out of schema `superRefine` for tool-calling compatibility |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/004-verification-and-standards/implementation-summary.md` | Recorded phase 4 verification results, delivery order, decisions, and limitations |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/004-verification-and-standards/tasks.md` | Captured evidence for the verification matrix, standards sync, and packet closure tasks |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/implementation-summary.md` | Updated the parent packet summary with final runtime evidence and completion status |

## Upgrade

No migration required. Three optional checklist items remain deferred: `CHK-020`, `CHK-021`, and `CHK-022`.
