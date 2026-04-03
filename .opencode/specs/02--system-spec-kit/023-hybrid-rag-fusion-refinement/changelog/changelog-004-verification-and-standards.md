## [v0.4.0] - 2026-03-30

This release matters because it turns the ESM (the modern JavaScript module system) migration into something people can trust, not just something that compiles. Phase 4 re-checked the seven highest-risk boundaries, cleared the full verification matrix, aligned the standards documents with the verified behavior, restored reliable MCP (Model Context Protocol, a standard way for AI clients to call tools) compatibility, and closed the parent packet with evidence. The result was 7 of 7 high-risk retests passing, 8997+ server tests passing, 483/483 scripts tests passing, and both smoke checks passing. The phase used a risk-first approach: prove the likeliest failure points first, then widen to the full release checks and documentation sync.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/` (Level 1)

---

## Testing (2)

These checks proved the migration where it was most likely to fail, then confirmed it across the wider release surface.

### Highest-risk boundaries were checked before the broader sweep

**Problem:** After an ESM migration, the biggest risks often sit at the boundary between code that builds and code that actually runs. If those few high-risk paths are not checked first, a broad verification sweep can still leave a late surprise in the parts people depend on most.

**Fix:** Phase 4 started by re-checking the seven highest-risk boundaries before anything else. All seven passed, which made the wider verification work more trustworthy because the likeliest breakpoints had already proved they still worked.

### Full release verification proved the code in real use

**Problem:** A module migration is not finished when the source looks correct. It is finished when the system works across builds, automated tests, direct startup, and supporting scripts. Without that proof, the release could still fail in the places people actually use.

**Fix:** Phase 4 completed the full verification matrix and cleared every required gate. That changed the migration from a source-level conversion into a verified working state that can be run with confidence.

---

## Documentation (2)

These updates kept the written guidance aligned with what the verified system now does.

### Standards docs now describe the verified ESM state

**Problem:** During a migration, documentation can drift ahead of reality. Once that happens, later contributors start following guidance that describes the goal instead of the behavior that has actually been proved.

**Fix:** After verification passed, the standards and README documents were updated to match the verified ESM behavior. People reading the guidance now see the state that shipped, not an earlier plan.

### The parent packet now closes with one clear proof trail

**Problem:** Release work can feel finished while still lacking one place that records what was proved and what was intentionally left for later. Without that closure record, future readers have to reconstruct the finish line from scattered notes.

**Fix:** Phase 4 closed the parent packet with a single evidence-backed summary and final status update. That makes the completion state easier to audit and easier to trust.

---

## Bug Fixes (1)

This fix restored reliable tool-calling behavior without weakening validation.

### AI tool-calling compatibility was restored without dropping safety checks

**Problem:** Some MCP tool schemas (the machine-readable descriptions that tell AI clients how to call a tool) had become too complex for certain callers to read reliably. When that happened, a request could fail before the tool itself even had a chance to run.

**Fix:** The tool schemas were simplified so AI clients can read them consistently while the same validation still happens during execution. That restored reliable tool calling for clients such as Copilot without weakening the safety checks.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Highest-risk boundaries passing | 0/7 | 7/7 |
| Required verification tracks cleared | 0/5 | 5/5 |
| Smoke checks passing | 0/2 | 2/2 |
| `mcp-server` passing tests recorded in Phase 4 | 0 | 8997+ |
| `scripts` passing tests recorded in Phase 4 | 0 | 483/483 |

This phase did not add new test files. It closed the release by re-running the checks that prove the migrated behavior in real use.

---

<details>
<summary>Technical Details: Files Changed (9 total)</summary>

### Source (3 files)

| File | Changes |
| ---- | ------- |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Simplified affected MCP tool schemas by removing `superRefine` so generated tool contracts stay readable to AI callers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Kept request validation in the handler after the schema simplification so runtime checks still happen when requests execute. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Included in the highest-risk retest set and in the scripts-side verification sweep because it sits on a sensitive package boundary. |

### Tests (0 files)

No test files changed in this phase. Verification reran existing release checks instead:

| Verified surface | Evidence |
| ---- | ------- |
| `mcp_server` workspace tests | 8997+ passing |
| `scripts` workspace tests | 483/483 passing |
| `node dist/context-server.js` smoke start | PASS |
| `node scripts/dist/memory/generate-context.js --help` smoke run | PASS |

### Documentation (6 files)

| File | Changes |
| ---- | ------- |
| `.opencode/skill/sk-code--opencode/README.md` | Synced standards guidance to the verified ESM state. |
| `.opencode/skill/system-spec-kit/README.md` | Aligned top-level guidance with the verified module behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Updated server-facing guidance to match the verified native ESM behavior. |
| `.opencode/skill/system-spec-kit/scripts/README.md` | Updated scripts guidance to match the verified interop behavior. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/implementation-summary.md` | Recorded the phase result, delivery order, key decisions, and verification outcome. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md` | Recorded packet-wide verification evidence and final completion status. |

</details>

---

## Upgrade

No migration required.

A few optional follow-up checklist items remain deferred by design, but all required closure work for this phase is complete.
