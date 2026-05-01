# Iteration 036: USER WORKFLOW IMPACT

## Focus
USER WORKFLOW IMPACT: How will adopted patterns change the agent developer experience? New commands, changed behaviors, migration guides needed.

## Findings
### Finding 1: Public should add one thin integrity surface instead of exposing drift work through several existing command families
- **Source**: `external/README.md`, `external/src/cli.ts`, `README.md`, `.opencode/command/memory/manage.md` [SOURCE: external/README.md:92-113; external/src/cli.ts:28-161; README.md:630-698; .opencode/command/memory/manage.md:33-62,72-140]
- **What it does**: Mex keeps the operator loop legible with a compact command set: setup, check, sync, init, watch, and commands. Public already has stronger underlying capabilities, but they are distributed across `spec_kit`, `memory`, and `doctor` namespaces, each optimized for a narrower responsibility.
- **Why it matters**: If we adopt the lexical integrity lane and guided maintenance planner, the main DX improvement should be a smaller mental model, not more knobs. The right addition is one explicit integrity entry point that routes to existing tools and preserves their authority boundaries.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 2: Session startup and recovery should stay on `session_bootstrap` and `/spec_kit:resume`, with integrity only as advisory context
- **Source**: `external/AGENTS.md`, `external/ROUTER.md`, `external/README.md`, `README.md`, `.opencode/command/spec_kit/resume.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` [SOURCE: external/AGENTS.md:37-42; external/ROUTER.md:20-24,43-69; external/README.md:178-198; README.md:522-547,657-665; .opencode/command/spec_kit/resume.md:202-223,248-280; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101-124,143-156,163-208]
- **What it does**: Mex assumes a markdown bootstrap flow: load the anchor file, read the router, then navigate context and patterns manually. Public already has a richer recovery path: `session_bootstrap` merges resume plus health, suggests next actions, and emits structural-routing nudges, while `/spec_kit:resume` owns interrupted-session recovery and context-loading priority.
- **Why it matters**: Replacing Public's recovery contract with a markdown-router-first cold start would be a UX regression for agents and operators who already depend on structured resume outputs. Adopted integrity work should annotate or advise the existing recovery path, not become the new startup authority.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Repair UX should borrow Mex's targeted-brief model, but Public must keep the flow as inspect -> plan -> confirm
- **Source**: `external/SYNC.md`, `external/src/sync/index.ts`, `.opencode/command/doctor/mcp_debug.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` [SOURCE: external/SYNC.md:9-20,23-62; external/src/sync/index.ts:29-210; .opencode/command/doctor/mcp_debug.md:18-45; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-490; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1301-1394]
- **What it does**: Mex turns drift into a file-scoped repair cycle: detect issues, build a targeted prompt, execute fixes, re-check, and optionally continue. Public's current maintenance surfaces already enforce non-mutating and confirmation-gated behavior: `memory_health` refuses auto-repair without `confirmed:true`, and `memory_save` dry-run paths explicitly return "no changes made" while exposing validation and sufficiency results.
- **Why it matters**: The adoptable UX pattern is not auto-fix itself; it is the clarity of a targeted repair brief. In Public, the safe developer experience is a planner-first command that can emit issue JSON, a repair plan, and explicit next steps before any write-capable operation is allowed to run.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 4: Mex's mandatory pattern-growth epilogue should not be migrated literally into Spec Kit workflows
- **Source**: `external/AGENTS.md`, `external/ROUTER.md`, `external/README.md`, `external/src/pattern/index.ts`, `README.md`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` [SOURCE: external/AGENTS.md:37-42; external/ROUTER.md:58-69; external/README.md:178-198; external/src/pattern/index.ts:6-68; README.md:573-589,677-698; .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-83]
- **What it does**: Mex treats scaffold growth as a built-in after-every-task ritual: update router state, revise context files, and create a new pattern when a task type is novel. Public already externalizes learning through spec-folder artifacts, research and handover documents, and `generate-context.js` memory saves that index structured session outcomes into the memory system.
- **Why it matters**: A literal `pattern add` closeout rule would duplicate Public's existing completion surfaces and make the post-task workflow heavier for agent developers. The useful transfer is softer: issue hints like "run integrity check" or "save context" when relevant, not mandatory pattern creation after normal work.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

### Finding 5: Shipping an integrity surface without a routing migration guide would create immediate namespace confusion
- **Source**: `external/README.md`, `README.md`, `.opencode/command/doctor/mcp_debug.md`, `.opencode/command/memory/manage.md`, `.opencode/command/memory/save.md` [SOURCE: external/README.md:92-113; README.md:630-698; .opencode/command/doctor/mcp_debug.md:18-45,113-119; .opencode/command/memory/manage.md:59-62,72-140; .opencode/command/memory/save.md:51-86]
- **What it does**: Mex presents one CLI family, so "use check/sync/watch" is unambiguous. Public already has distinct namespaces with overlapping "health", "save", "resume", and "doctor" language: `/doctor:mcp_debug` for broken MCP servers, `/memory:manage health` for DB/index health, `/memory:save` for session persistence, and `/spec_kit:resume` for recovery.
- **Why it matters**: If a new integrity command lands without an explicit routing matrix, operators will guess wrong about which surface owns markdown truthfulness versus runtime failures versus memory persistence. The migration guide is therefore part of the feature, not extra documentation.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `external/README.md:92-113,178-198`
- `external/AGENTS.md:37-42`
- `external/ROUTER.md:20-24,43-69`
- `external/SYNC.md:9-20,23-62`
- `external/SETUP.md:7-18`
- `external/src/cli.ts:28-161`
- `external/src/sync/index.ts:29-210`
- `external/src/pattern/index.ts:6-68`
- `README.md:522-547,573-589,630-698`
- `.opencode/command/spec_kit/resume.md:202-223,248-280`
- `.opencode/command/memory/manage.md:33-62,72-140`
- `.opencode/command/memory/save.md:51-86`
- `.opencode/command/doctor/mcp_debug.md:18-45,113-119`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101-124,143-156,163-208`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-490`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1301-1394`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-83`

## Assessment
- **New information ratio**: 0.14
- **Questions addressed**: what new command is justified; whether session startup and recovery should change; how repair should be surfaced; whether post-task scaffold growth should change; what migration guide is required
- **Questions answered**: one thin integrity surface is justified; `session_bootstrap` and `/spec_kit:resume` should stay canonical; repair should be planner-first and confirmation-gated; Mex-style mandatory pattern growth should not migrate; command-routing documentation is mandatory
- **Novelty justification**: earlier iterations established the integrity lane and planner direction; this pass adds the missing operator-facing command contract and migration-map constraints for a real rollout

## Ruled Out
- Replacing `/spec_kit:resume` or `session_bootstrap` with a markdown-router-first cold-start flow
- Reusing the existing `/doctor:*` namespace for spec-memory integrity
- Auto-running integrity checks inside `session_bootstrap`, `memory_context`, `memory_search`, or `generate-context.js`
- Adopting Mex's mandatory "create or update patterns after every task" rule as a default Spec Kit closeout requirement

## Reflection
- **What worked**: starting from Mex's user-facing command loop and then mapping each workflow step onto Public's existing command families exposed the real DX deltas faster than checker-level comparison alone
- **What did not work**: the existing `iteration-036.md` packet had become polluted with copied scaffolding and prior-iteration fragments, so continuity had to come from primary source re-reading rather than packet state
- **What I would do differently**: next pass, turn these findings into a literal routing matrix with example invocations, allowed side effects, and forbidden side effects for each command family

## Recommended Next Focus
Define the implementation-ready operator contract for the first DX slice:
1. choose the command name (`spec_kit:doctor` vs `memory:manage integrity`);
2. define modes (`check`, `--json`, `--plan`, and whether `--fix` is deferred);
3. publish the routing matrix against `/doctor:mcp_debug`, `/memory:manage health`, `/memory:save`, and `/spec_kit:resume`;
4. specify when integrity hints may appear during closeout without changing current recovery or save authority.
```


Total usage est:        1 Premium request
API time spent:         3m 45s
Total session time:     4m 4s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 15.8k out, 1.2m cached, 6.1k reasoning (Est. 1 Premium request)
