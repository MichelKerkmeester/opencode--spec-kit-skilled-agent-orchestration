# Deep-Review Iteration 4 of 7 — cli-codex gpt-5.5 high

You are the @deep-review LEAF agent. Do NOT dispatch sub-agents. READ-ONLY review. Max 12 tool calls. **GATE 3 PRE-APPROVED — paths below.**

## STATE

Iter 4 of 7 | Open: 9 P1 + 2 P2 | Verdict so far: CONDITIONAL (no P0)
Ratios: 1.00 → 0.50 → 0.40

## STATE FILES (absolute)

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`
Artifact dir: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/review/015-code-graph-advisor-refinement-pt-01`

- Prior iter narratives (read iter-001, iter-002, iter-003 for context — do NOT duplicate findings)
- Write iteration narrative to: `<artifact-dir>/iterations/iteration-004.md`
- Write delta to: `<artifact-dir>/deltas/iter-004.jsonl`
- Append iteration record to: `<artifact-dir>/deep-review-state.jsonl`

## ITER-4 FOCUS

**Security deep-dive across the implementation surface:**

1. **PR 5 metrics emission — input trust:** Read `mcp_server/skill-advisor/lib/metrics.ts` new `spec_kit.*` namespace. For each label that comes from external/user-controlled input (e.g. `runtime`, `mode`, `language`, `skill_id`, `cache_layer`, `freshness_state`), check whether the value is validated/sanitized OR comes from a closed enum. An attacker-controlled label with high cardinality could explode the cardinality envelope. Identify any label that:
   - reads from request/handler input
   - is interpolated into a metric series key without validation
   - lacks a closed enum at the type level

2. **PR 2 (settings.local.json) command injection surface:** The new `command` strings are wrapped in `bash -c '...'`. Check whether any field in the settings file is interpolated into the bash command without escaping. The `git rev-parse --show-toplevel` subshell is fine because the output is piped to `cd`, but verify there's no `$VAR` expansion of user-controlled fields.

3. **PR 4 vocab unification — type narrowing safety:** With the V2 enum widened to 5 states (`fresh|stale|empty|error|unavailable`), verify no consumer code assumes the legacy 4-state set. Search for switch/case statements over freshness state in `mcp_server/code-graph/handlers/`, `mcp_server/skill-advisor/lib/`, and any external consumer. Missing `default` case + missing arm = silent fall-through = security/correctness risk.

4. **PR 7 parity test — assertion completeness:** Verify the test catches the EXACT regression class that PR 2 fixed (top-level `bash:` field or copilot adapter ref). Try to construct a counterexample settings file that would pass the test but trigger the F23.1 bug. If you find one, that's a P1 (test is incomplete).

5. **Hook command path resolution security:** `bash -c 'cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/<event>.js'` — verify:
   - the `cd` target is git-toplevel or pwd; what if neither resolves to the user's intended repo (e.g. git submodule, detached worktree)?
   - the relative path `.opencode/...` could resolve outside expected scope under unusual cwd
   - is `node` the system node or a specific version?

## OUTPUT CONTRACT

Three artifacts (narrative md, JSONL iteration record appended to state log, delta jsonl). Schema same as iter 3.

For each iter-3 P1 finding, add a `{"type":"validation","relatedTo":"R3-P1-N","verdict":"upheld|softened|invalidated","evidence":"..."}` record if you re-examined it.

Target newFindingsRatio 0.3+ (security dim is high signal).

Start now. Do NOT ask for clarification.
