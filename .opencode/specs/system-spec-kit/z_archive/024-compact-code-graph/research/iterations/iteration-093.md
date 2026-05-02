# Iteration 93: Updated Implementation Roadmap After Verification Corrections

## Focus
Rebuild the iteration-068 implementation phasing using the review cross-reference from iteration-072 and the verification wave from iterations 076-091, so the roadmap reflects what is **actually verified** in current code rather than what remains design-only.

**Verification caveat:** I found no local `iteration-090.md` artifact and no `run: 90` JSONL entry in `deep-research-state.jsonl`, so this synthesis uses the available evidence from iterations 076-089 and 091 plus the current strategy state. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-068.md:221-236`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-072.md:81-101`]

## Findings

### 1. Verification flips the roadmap from "auto-enrichment first" to "correctness and boundary fixes first"
The original roadmap in iteration-068 treated Phase A as a narrow `endLine` fix and Phase B as the main investment area (stale-on-read, first-call priming, and `GRAPH_AWARE_TOOLS`). Iteration-072 already widened Phase A/B after the review. The verification wave sharpened that further:

- **Confirmed current defects with externally visible impact:** collapsed symbol ranges (`endLine`), stripped manual/graph seed identity, unrestricted `rootDir` in `code_graph_scan`, raw exception text reflection, false-positive hook persistence success, stale compact cache reuse, and compact payload lifecycle fragility all remain live. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-076.md:12-18`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:12-31`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:26-39`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:14-18`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:23-31`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:56-65`]
- **Downgraded from roadmap foundations to future features:** `GRAPH_AWARE_TOOLS`, MCP first-call priming/T1.5, near-exact seed resolution, stale-triggered auto-reindex-on-read, hybrid query execution, and most of the original Q14-Q16 Phase B logic are still proposals, not shipped behavior. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-077.md:8-12`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:25-29`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-079.md:8-17`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-079.md:38-52`]
- **Narrowed or removed claims:** the stop-hook recursion guard finding was a false positive, the repo-wide "no `SQLITE_BUSY` handling anywhere" claim was overstated, and the earlier performance headroom numbers were mostly architecture estimates rather than measured facts. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-083.md:14-23`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:15-27`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:32-48`]

**Consequence:** the roadmap should now front-load verified correctness/security repairs and hook durability, keep cross-runtime parity narrowly scoped to proven instruction/config seams, and push server-side priming + tree-sitter modernization behind a stabilization gate.

### 2. UPDATED 4-phase roadmap (verification-corrected)

| Phase | Focus | Revised LOC | Risk | Dependency posture |
|---|---|---:|---|---|
| **1** | Critical correctness + boundary repair | **180-270** | Medium | Independent foundation |
| **2** | Hook durability + recovery truthfulness | **170-260** | Medium-High | After Phase 1 preferred |
| **3** | Runtime parity via verified instruction/config seams | **110-180** | Low-Medium | After Phases 1-2 |
| **4** | Deferred feature work: auto-enrichment + tree-sitter modernization | **330-530** | High | After Phase 1 mandatory; after 2-3 strongly preferred |

**Revised totals:**
- **Stabilization path (Phases 1-3): 460-710 LOC**
- **Full roadmap including deferred Phase 4: 790-1,240 LOC**

This replaces the earlier `654-932 LOC` framing by pulling more real bug work into the front of the plan and separating speculative feature work from mandatory stabilization. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-068.md:223-236`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-080.md:67-82`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:141-154`]

### 3. Phase-by-phase roadmap

#### Phase 1 — Critical correctness and boundary repair
**Why this is first:** these are the highest-confidence, highest-severity fixes with direct correctness or security impact.

**Primary files now in scope:**
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts` (only if shared sanitization is centralized)
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-endline-fix.vitest.ts` (**new**)

**Concrete goals:**
1. Fix `endLine` computation so multi-line bodies stop collapsing to declaration lines.
2. Preserve manual/graph seed identity through the public `code_graph_context` handler.
3. Constrain `code_graph_scan.rootDir` to the active workspace boundary.
4. Sanitize externally returned exception strings from `memory_context` and `code_graph_context`.

**LOC estimate:**
- Production: **140-200 LOC**
- Tests: **40-70 LOC**
- Total: **180-270 LOC**

**Risk:** **Medium** — the changes are localized, but they touch externally exposed boundaries and graph correctness. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-076.md:12-18`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-080.md:8-18`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:49-75`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:14-18`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:56-65`]

#### Phase 2 — Hook durability and recovery truthfulness
**Why this moved up:** iterations 088, 089, and 091 show that the hook path still has durability, freshness, and accounting defects that were not central in the original roadmap.

**Primary files now in scope:**
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts`

**Concrete goals:**
1. Stop reporting cache/persistence success when disk writes fail.
2. Replace or redesign the `pendingCompactPrime` consumption flow so recovery payloads are not destroyed before successful handoff.
3. Enforce freshness checks on compact recovery payloads.
4. Replace the stop-hook surrogate auto-save with a dedicated, truthfully named path.
5. Include cache-token buckets in surfaced totals/costs.
6. Remove or wire the unreachable startup `workingSet` branch.

**LOC estimate:**
- Production: **120-180 LOC**
- Tests: **50-80 LOC**
- Total: **170-260 LOC**

**Risk:** **Medium-High** — hook semantics are narrow but brittle, and the recovery handoff is lifecycle-sensitive. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-083.md:28-39`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:12-31`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:12-25`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:23-31`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:32-47`]

#### Phase 3 — Runtime parity using verified instruction/config seams
**Why this is now narrower:** the verification wave showed that the repo's reliable parity surfaces are instruction files, command YAML, and a small number of runtime-specific context agents — not a universal server-side priming layer that already exists.

**Primary files now in scope:**
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `.opencode/agent/context.md`
- `.codex/agents/context.toml`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- `.github/copilot-instructions.md` (**optional new file, if Copilot-specific reinforcement is wanted**)
- `.gemini/settings.json` (**optional new file, if Gemini MCP parity is pursued**)

**Concrete goals:**
1. Add one shared Session Start Protocol that forces `memory_*` recovery and `code_graph_status()` on first relevant code work.
2. Update resume flow to surface graph readiness without auto-running heavy graph expansion.
3. Make Copilot parity rest on `AGENTS.md` / optional `.github/copilot-instructions.md`, not on optional agent profiles.
4. Treat Gemini parity as `GEMINI.md` + `.gemini/settings.json` work; do **not** assume `.mcp.json` is sufficient.

**LOC estimate:** **110-180 LOC** total (mostly instructions/YAML/config)

**Risk:** **Low-Medium** — behavior is indirect, but the seams are now well verified. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:45-79`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-085.md:28-49`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:55-67`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:98-121`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:67-92`]

#### Phase 4 — Deferred feature work: auto-enrichment and parser modernization
**Why this moved last:** most of the original Phase B/Q14/Q15/Q16 roadmap items were verified as **future enhancements**, not current defects. They remain valuable, but they should ship behind a stabilization gate and feature flags.

**Primary files now in scope if this phase proceeds:**
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts` (**new**)
- `.opencode/skill/system-spec-kit/mcp_server/package.json` (if tree-sitter dependencies are added)
- `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-integration-e2e.vitest.ts` (**new**)
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-edge-types.vitest.ts` (**new**)

**Concrete goals:**
1. If still desired, implement server-side first-call priming and graph-aware dispatch from the **verified** `context-server.ts` seam.
2. Add stale-on-read or near-exact seed-resolution improvements only after product confirmation.
3. Implement tree-sitter adapter/parser migration and new edge kinds behind a staged rollout.
4. Extend existing runtime/session/auto-surface suites instead of creating six all-new test files.

**LOC estimate:**
- Production: **260-420 LOC**
- Tests: **70-110 LOC**
- Total: **330-530 LOC**

**Risk:** **High** — this phase now explicitly contains the design-heavy work that verification showed was not yet grounded in current implementation. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-077.md:20-24`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:25-29`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-079.md:48-84`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-080.md:31-43`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:141-154`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:115-137`]

### 4. Updated dependency graph

```text
Phase 1: Correctness + boundary repair
   |
   +--> Phase 2: Hook durability + recovery truthfulness
   |        |
   |        +--> Phase 3: Runtime parity via verified instruction/config seams
   |        |
   |        +--> Phase 4: Deferred feature work (first-call priming, graph-aware dispatch, tree-sitter)
   |
   +-----------------------------------------------> Phase 4
```

**Critical path:** **Phase 1 -> Phase 2 -> Phase 3**

**Phase 4 is intentionally gated** behind Phase 1 and should preferably follow Phase 2 so future enrichment does not build on broken ranges, unsafe handlers, or misleading hook-state behavior.

### 5. Priority reordering based on verified severity
1. **Immediate:** `rootDir` boundary check, handler error sanitization, `endLine`, seed-identity preservation, hook-state truthfulness, compact payload freshness/lifecycle.
2. **Next:** dedicated stop-time save semantics, cache-token accounting, cleanup of dead/unwired recovery branches.
3. **Then:** shared session-start protocol and resume-graph readiness across the verified runtime instruction surfaces.
4. **Last / optional:** server-side first-call priming, `GRAPH_AWARE_TOOLS`, near-exact seed resolution, stale-on-read auto-reindex, hybrid query patterns, tree-sitter migration.

### 6. Items to REMOVE from the roadmap (false positives, already-covered work, or downgraded assumptions)
- **Remove the stop-hook `isAutoSurface` recursion bug** from the backlog — verification marked it a false positive against current code. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:32-48`]
- **Remove the repo-wide claim that no `SQLITE_BUSY` handling exists anywhere** — narrow it to the code-graph path only if still needed. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-083.md:14-23`]
- **Remove "Phase B foundations already exist" assumptions** for `GRAPH_AWARE_TOOLS`, `FirstCallTracker`, `ensureFreshFiles()`, near-exact seed tiers, and hybrid query execution; keep them only as deferred feature work. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-077.md:20-24`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-079.md:38-52`]
- **Remove the 6-all-new-test-files / 40-all-new-cases assumption** — the verified plan is 2-3 new files plus targeted extensions to existing runtime/session/auto-surface suites. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:141-154`]
- **Remove Copilot parity work from optional agent-profile-only scope** — Copilot should anchor on `AGENTS.md` and optional `.github/copilot-instructions.md`. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:55-67`] 
- **Remove any Gemini parity assumption that treats `.mcp.json` as native runtime configuration** — Gemini needs `.gemini/settings.json` if runtime parity is implemented. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:98-121`]
- **Remove performance-headroom numbers as sequencing evidence** — iteration-082 found them mostly uninstrumented. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:115-137`]

## Sources Consulted
- Original phasing: `iteration-068.md`
- Review cross-reference adjustment: `iteration-072.md`
- Verification corpus used in this synthesis: `iteration-076.md` through `iteration-089.md`, `iteration-091.md`
- Current strategy state: `deep-research-strategy.md`
- Evidence gap check: `deep-research-state.jsonl` (no local `run: 90` entry found)

## Assessment
- New information ratio: **0.64**
- Questions addressed:
  - How should the original 4-phase roadmap change after verification?
  - Which files move into or out of early-phase scope?
  - Which items should be removed entirely versus merely deferred?
- Questions answered:
  - The roadmap should front-load verified correctness/security + hook durability, not auto-enrichment.
  - Mandatory scope now centers on handlers, hook-state files, and a narrower runtime-instruction surface.
  - Several prior Phase B/D assumptions are future-feature work, and one review P1 finding is a false positive.

## Reflection
- What worked and why: Cross-reading the verification wave as a correction layer on top of iterations 068 and 072 made the key pattern obvious: most roadmap drift came from treating design proposals as implementation facts. The verification passes gave enough evidence to split the plan cleanly into **stabilization** versus **feature expansion**.
- What did not work and why: The missing local artifact/state for iteration 090 leaves one small evidentiary hole in the 076-091 window. It does not block the roadmap rewrite, but it prevents claiming a perfectly continuous artifact trail for every requested iteration number.
- What I would do differently: In future research waves, I would label roadmap items explicitly as `verified defect`, `verified seam`, or `proposal` at the moment they are discovered. That would make later roadmap correction much cheaper.

## Recommended Next Focus
Carry this revised phase ordering into the final synthesis/parity-matrix work: shared Session Start Protocol first, stabilized handler/hook fixes second, and only then any optional MCP first-call priming or tree-sitter rollout.
