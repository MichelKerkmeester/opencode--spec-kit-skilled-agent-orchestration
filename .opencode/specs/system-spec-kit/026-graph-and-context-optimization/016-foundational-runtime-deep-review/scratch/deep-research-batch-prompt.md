# Deep Research Batch Prompt — 016 Foundational Runtime Deep Review

**Target:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review`
**Mode:** `/spec_kit:deep-research :auto`
**Iterations:** 50
**Convergence threshold:** 0.08

---

## Research Question

Investigate the foundational runtime seams of the system-spec-kit MCP server that were under-reviewed by Phase 015's 120-iteration audit. Phase 015 concentrated on packets 009/010/012/014 but left earlier phases (002, 003, 005, 008, 010, 014) with less scrutiny. A copilot gpt-5.4 deep-dive identified 19 candidates with 4 cross-cutting systemic themes. Research these themes across the actual codebase to produce actionable findings that directly feed deep-review iterations.

## Research Domains (5 domains, ~10 iterations each)

### Domain 1: Silent Fail-Open Patterns (iterations 1-10)

Catalog every fail-open or silent-degrade path across these files:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` — autosave drops after 4s timeout with warning only (lines 85-101), producer-metadata failures absorbed (lines 199-218)
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` — schema-invalid JSON silently re-enters as "legacy" content (lines 223-255)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` — readiness failures produce output indistinguishable from empty graph
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` — scope filtering can silently erase all candidates (lines 283-294)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` — enrichment status booleans cannot distinguish success from skip/defer

For each path found: document the file, line range, what triggers the fail-open, what the caller sees vs what actually happened, and the blast radius (how many downstream consumers assume the happy path). Classify each by severity: P0 (data loss/corruption risk), P1 (silent quality degradation), P2 (observability gap).

### Domain 2: State Contract Honesty (iterations 11-20)

Map which files conflate semantically distinct states, then trace downstream consumers:
- `post-insert.ts`: booleans at lines 99, 112, 125, 133, 152, 155, 179, 181, 207, 208 — does `true` mean success, skip, or defer?
- `shared-payload.ts`: `trustStateFromGraphState()` collapses `missing`, `empty`, and `stale` — what do callers lose?
- `code-graph/query.ts`: readiness failure vs empty graph — how do consumers distinguish?
- `graph-metadata-parser.ts`: schema-invalid modern JSON → "legacy migration succeeded" — does the caller know?
- `hook-state.ts`: `JSON.parse(raw) as HookState` with no runtime validation — what happens on corrupt/truncated state?

For each collapse point: trace 2-3 downstream consumers, document what they assume, and assess whether the collapsed state could cause incorrect behavior. Research whether TypeScript's type system provides any runtime protection at these boundaries.

### Domain 3: Concurrency and Write Coordination (iterations 21-30)

Enumerate all read-modify-write paths without locks, shared temp paths, and write-then-read assumptions:
- `hook-state.ts`: `updateState()` at lines 221-241 is RMW with no lock, `saveState()` uses deterministic temp name at line 173
- `session-stop.ts`: write state at line 283, then `runContextAutosave()` re-reads at lines 308-309 — is visibility guaranteed?
- `reconsolidation-bridge.ts`: transactional inner writes but search/filter/pre-check is outside the transaction
- `graph-metadata-parser.ts`: `process.pid + Date.now()` temp naming at line 985, insertion-order entity cap at line 774
- Shared `/tmp/save-context-data.json` path used by both `AGENTS.md` save guidance and `spec_kit_plan_auto.yaml`

For each: determine whether the race is theoretical or practically triggerable (e.g., parallel copilot dispatches, concurrent stop hooks, overlapping save flows). Assess whether atomic rename provides sufficient protection or whether higher-level coordination is needed.

### Domain 4: Stringly Typed Governance (iterations 31-40)

Identify which prose/string contracts lack mechanical validation and carry runtime risk:
- `AGENTS.md`: gate behavior depends on prose + trigger-word lists, Gate 3 session persistence uses LLM context not durable state
- `spec_kit_plan_auto.yaml`: interpreter-dependent expressions like `intake_only == TRUE`, absorbed intake behavior
- `skill_advisor.py`: literal keyword dictionaries and phrase lists, `INTENT_BOOSTERS` vs `PHRASE_INTENT_BOOSTERS`
- `skill_graph_compiler.py`: advisory-only symmetry and weight-parity checks that are warnings not blockers
- `manual-playbook-runner.ts`: `Function(...)()` evaluating repository-owned content, regex-matched markdown shapes

For each: assess the likelihood and impact of drift (what breaks silently if the string changes?), whether a mechanical check could replace the social validation, and the effort to add one.

### Domain 5: Test Coverage Gaps (iterations 41-50)

Systematically verify adversarial test coverage across all 19 candidates:
- For each file: check if a direct test file exists (`.vitest.ts`, `.test.ts`, `_test.py`)
- Classify scenarios as: direct coverage, indirect-only coverage (through broader workflow tests), or no coverage
- Focus on these adversarial scenarios that the deep-dive identified as missing:
  - `session-stop.ts`: missing-session collision, autosave timeout, retargeting overwrite, end-to-end state ordering
  - `hook-state.ts`: concurrent writers, corrupt JSON, schema evolution, stale cleanup with filesystem tricks
  - `shared-payload.ts`: throwing predicates, zero-section envelopes, unknown status values
  - `graph-metadata-parser.ts`: legacy fallback activation, cross-track false positives, concurrent writers
  - `adaptive-fusion.ts`: malformed rollout config, dead causal bias, reported-vs-executed weight mismatch
  - `reconsolidation-bridge.ts`: zero-survivor filtering, complement double-write, array-property transport
  - `post-insert.ts`: deferred truthfulness, follow-up-action consumption, step-outcome semantics

Produce a coverage matrix: file × adversarial scenario → {covered, indirect, missing}.

## Scope Files

The research should read and analyze these files (full paths):

```
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts
.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts
.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts
.opencode/skill/skill-advisor/scripts/skill_advisor.py
.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py
.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml
.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts
```

Plus their corresponding test files (search for `.vitest.ts`, `.test.ts`, `_test.py` variants).

## Context Documents

Read these before starting iterations:
- `016-foundational-runtime-deep-review/spec.md` — full candidate list with priorities
- `016-foundational-runtime-deep-review/scratch/high-priority-deep-dive.md` — detailed per-file findings
- `016-foundational-runtime-deep-review/scratch/medium-priority-deep-dive.md` — medium-priority findings
- `016-foundational-runtime-deep-review/scratch/cross-cutting-patterns.md` — 4 systemic themes
- `016-foundational-runtime-deep-review/scratch/deep-review-prompts.md` — adversarial review prompts for HIGH files
- `015-implementation-deep-review/review/` — prior 120-iteration review findings (for deduplication)

## Output Expectations

Each iteration should:
1. Pick one specific investigation thread from the current domain
2. Read the actual source code (not just spec docs)
3. Produce concrete findings with file paths and line numbers
4. Cross-reference against existing test coverage
5. Build on prior iteration findings (don't repeat)

The research converges when new iterations stop producing novel findings (< 0.08 new information per iteration).

## Dispatch Command

```bash
/spec_kit:deep-research :auto
```

With spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review`
