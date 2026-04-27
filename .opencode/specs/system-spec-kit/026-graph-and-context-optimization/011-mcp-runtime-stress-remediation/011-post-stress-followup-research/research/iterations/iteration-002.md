# Iteration 002 — Copilot authority boundary and isolated graph degradation

## Status
- Iteration: 2 / 10
- Focus: deepen Q-P0 and Q-P1; side-check P2/Q-OPP/Q-ARCH only where they affect the recommended fix shape
- newInfoRatio: 0.58
- Convergence trajectory: Q-P0 now points to an authority-propagation gap rather than a memory-save implementation bug; Q-P1 has a concrete, low-risk degraded-harness design using isolated `SPEC_KIT_DB_DIR`.

## Q-P0: cli-copilot /memory:save Gate 3 bypass

Iteration 001 asked where Copilot maps "save the context" into mutation. The source trail suggests the safer framing is not "find the one bad memory-save handler"; it is "Copilot receives mutable autonomy without a reliable target-authority contract."

Evidence:
- `.opencode/command/memory/save.md:7` makes spec-folder resolution the mandatory first action, before any other file content is read.
- `.opencode/command/memory/save.md:17` starts auto-detection only when arguments are empty, and `.opencode/command/memory/save.md:36` says Tier 3 guided selection must ask when no safe target exists.
- `.opencode/command/memory/save.md:43` says ambiguous cases always ask and must not guess.
- `.opencode/command/memory/save.md:78` says canonical saves default to planner-first behavior, while `.opencode/command/memory/save.md:79` reserves mutation-first behavior for explicit full-auto fallback.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:5` says Copilot ignores `userPromptSubmitted` hook output for prompt mutation, and `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:231` returns an empty JSON object after refreshing instructions.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:68` renders only a managed startup/advisor block, and `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:82` describes this as a freshness contract, not a hard pre-tool gate.
- `.opencode/skill/cli-copilot/SKILL.md:274` already names the delegation invariant: pass `Spec folder: <path> (pre-approved, skip Gate 3)` if one exists; otherwise ask before delegating because the delegated agent cannot answer Gate 3 interactively.
- `.opencode/skill/cli-copilot/references/integration_patterns.md:95` recommends plan-then-execute for Copilot, with `.opencode/skill/cli-copilot/references/integration_patterns.md:109` explicitly prompting "DO NOT modify any files yet" in the plan phase.
- The stress finding remains the load-bearing symptom: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:101` says Copilot selected a target from session-bootstrap context without asking, and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:113` recommends tightening planner-first default or adding explicit Gate 3 at the CLI entry point.

Refined diagnosis:
Copilot's hook surface is advisory and file-based. It can update `~/.copilot/copilot-instructions.md`, but the hook path does not transform the just-submitted prompt into a blocking Gate 3 exchange. Therefore, a non-interactive Copilot run that is allowed to mutate must carry target authority in the prompt itself, or it must be constrained to plan-only output. Bootstrap context must be treated as evidence for suggestions, never as target authority.

Recommended approach:
1. Add a Copilot-specific "mutating Spec Kit command preamble" to the CLI wrapper/delegation prompt path:
   - If the conductor has an active Gate 3 folder, inject `Spec folder: <path> (operator-approved target authority for this task)`.
   - If no active folder exists and the prompt contains `/memory:save`, `save context`, or another continuity-write trigger, force plan-only output: "Do not call tools or edit files. Return the Gate 3 folder-selection question/options only."
   - Never let `Last active spec folder`, startup brief, resume pointers, or read-only bootstrap matches satisfy this authority field.
2. Add a unit/replay test around Copilot prompt construction rather than only memory-save internals:
   - Input: "Save the context for this conversation", no active Gate 3 folder.
   - Expected prompt contains plan-only/Gate-3 language and excludes any pre-approved spec-folder marker.
   - Input: same request with active folder.
   - Expected prompt contains the pre-approved marker and the exact folder path.
3. Keep the memory-save command's planner-first contract as the server-side safety net, but do not rely on it as the only fix. Copilot's observed failure is upstream of canonical save semantics: it chose a target before the command contract could be faithfully applied.

Falsifiable success criteria:
- A future I1/cli-copilot cell with no explicit folder must produce a Gate 3 question or plan-only response, with zero writes.
- The score artifact must show no mutation under any spec folder unless the prompt included an explicit operator-approved folder.
- A startup/resume "last active" folder may appear in advisory context but must not appear as the selected save destination unless separately approved.

## Q-P1: code-graph fast-fail not testable

Iteration 001 established that unit tests already prove `fallbackDecision` behavior, but the stress harness failed to exercise weak graph state. The implementation details now point to a safe deterministic harness: run the graph read in a process with an isolated database directory.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:5` says `code-graph.sqlite` is separate and stored beside the memory index DB.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:158` creates `code-graph.sqlite` under the supplied DB directory, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:184` lazy-initializes from `DATABASE_DIR`.
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:67` reads `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR`, and `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:81` allows project, home, and temporary directory boundaries.
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:128` proves exported database path bindings can refresh after an env override; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:142` sets `SPEC_KIT_DB_DIR` and `.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:145` expects the resolved directory to match the temp override.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:151` treats zero graph nodes as `freshness:"empty"` and `action:"full_scan"`.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:200` switches to `full_scan` when stale files exceed the selective threshold, currently `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:56` at 50 files.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787` blocks read paths when full scan is needed and no inline full scan occurred; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` calls `ensureCodeGraphReady` with `allowInlineFullScan:false`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:76` covers empty graph routing to `code_graph_scan`, `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:92` covers stale full-scan routing, and `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:162` preserves the read-path full-scan boundary.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:137` blocks `code_graph_context` in the same full-scan condition, but `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:145` returns `requiredAction:"code_graph_scan"` without the `fallbackDecision` object required by packet 005 for `code_graph_query`.

Recommended v1.0.3 degraded sub-cell:
1. Create a temporary DB directory under `/tmp`, set `SPEC_KIT_DB_DIR=<tmpdir>`, and start the MCP/server process or direct handler process in that environment.
2. Do not run `code_graph_scan`. Call `code_graph_query` directly with a simple structural read, for example `operation:"outline", subject:".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts"`.
3. Assert the response is blocked and includes `data.fallbackDecision.nextTool:"code_graph_scan"`, `reason:"full_scan_required"`, and `retryAfter:"scan_complete"`.
4. In a second optional branch, seed more than 50 tracked files into `code_files` with stale mtimes, or copy a small fixture DB whose tracked rows point to changed files, then assert the same `stale + full_scan` routing.
5. Run cleanup by deleting the temp DB directory; never move, delete, or overwrite the real workspace `code-graph.sqlite`.

Scope decision:
Target `code_graph_query` first. Packet 005's acceptance criteria mention `code_graph_query` specifically, and this handler already emits a typed `fallbackDecision`. A follow-up can align `code_graph_context` to include the same fallback object, but that is a product-consistency improvement, not necessary to prove the original P1 acceptance path.

Falsifiable success criteria:
- The degraded cell remains blocked before any full scan.
- The artifact captures the actual JSON response with `fallbackDecision.nextTool:"code_graph_scan"`.
- A healthy control run against the normal DB does not emit `fallbackDecision`.

## Q-P2: file-watcher debounce

Not deeply re-opened; see iteration-001 for primary evidence. One refinement from Q-P1 matters: because `ensureCodeGraphReady` already detects stale/empty/full-scan states at read time, `code_graph_status` self-check should reuse readiness detection without mutating by default. That keeps status observational while making drift visible sooner. Lowering debounce is still secondary unless a watcher-specific burst/rename test reproduces missed events.

Suggested direction: status should surface "would require selective reindex/full scan" plus last scan age and suggested action. Only add automatic self-heal if explicit status options request it.

## Q-OPP: CocoIndex fork telemetry leverage

See iteration-001. No new source pass this iteration. The Q-P1/context side-read did expose one adjacent seam: `code_graph_context` normalizes CocoIndex seeds from `provider:"cocoindex"` in `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:76`, but this is seed provenance, not downstream adoption of fork telemetry fields such as `path_class`, `dedupedAliases`, or `raw_score`.

Iteration 3 should keep this as a side pass unless Q-P0/Q-P1 converge early.

## Q-ARCH: intelligence-system seams (light touch)

Two seams are now sharper:
- **Target-authority vs context-evidence seam**: startup/resume context can be helpful for suggestions, but mutating tools need an explicit authority field that is not derivable from "last active" context.
- **Readiness-contract consistency seam**: `code_graph_query` has `fallbackDecision`; `code_graph_context` has equivalent blocked/readiness fields without that object. Aligning these would reduce handler-specific model behavior.

## Sources read this iteration (delta from prior)
- `.opencode/command/memory/save.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts`
- `.opencode/skill/cli-copilot/SKILL.md`
- `.opencode/skill/cli-copilot/references/integration_patterns.md`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-fallback-decision.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md`

## Suggested focus for iteration 3
Deepen Q-P0 only enough to identify the exact prompt-construction or wrapper file that should receive the target-authority preamble. Then spend the main pass on Q-P2: read file-watcher tests and status handler tests to decide whether "status self-check" can be added without mutating status by default.
