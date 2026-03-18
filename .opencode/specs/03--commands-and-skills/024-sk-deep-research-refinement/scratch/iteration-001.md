# Iteration 1: Error Recovery Patterns at CODE Level (RQ1)

## Focus
Investigate what error recovery patterns AGR, pi-autoresearch, and autoresearch-opencode implement at the CODE level (not just documentation). Compare against our P1.1 Tiered Error Recovery proposal and our current loop_protocol.md error handling spec. Wave 1 recon indicated AGR's 5-tier system is prompt-only -- this iteration verifies that claim and examines pi-autoresearch's newly added security hardening and segment-aware reconstruction.

## Findings

### Finding 1: pi-autoresearch has the MOST sophisticated code-level error handling of all 3 repos

pi-autoresearch's `extensions/pi-autoresearch/index.ts` (~2000+ LOC TypeScript) implements a comprehensive, layered error handling system at the code level. Key patterns discovered:

**a) State reconstruction cascade (3 tiers):**
1. Primary: Parse `autoresearch.jsonl` with per-line try/catch (malformed lines silently skipped)
2. Segment-aware: Each `type: "config"` header in JSONL increments a segment counter, filtering results per-segment
3. Fallback: If JSONL loading fails entirely, reconstruct state from Pi Agent session history (`ctx.sessionManager.getBranch()`)

**b) Process-level error handling in `run_experiment`:**
- Configurable timeout (default 600s) with `killTree()` that tries process group SIGTERM first, then single-process fallback
- AbortSignal integration for external cancellation
- Temp file streaming for large outputs (auto-triggers when output > DEFAULT_MAX_BYTES)
- Backpressure checks (`autoresearch.checks.sh`) run separately with independent timeout (default 300s)
- Rate-limited auto-resume: max N turns, 5-minute cooldown between auto-resumes

**c) Error propagation to AI:**
All errors return structured `{ content: [{ type: "text", text: "..." }], details: {...} }` objects. The AI sees formatted error messages (prefixed with specific emoji) and can retry with corrected parameters. This is NOT just logging -- it's a feedback loop.

[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts]

### Finding 2: pi-autoresearch implements security hardening absent from all other repos (and our proposals)

Two security patterns not present in AGR, autoresearch-opencode, or our 18 v2 proposals:

**a) Prototype pollution prevention:**
```typescript
const DENIED_METRIC_NAMES = new Set(["__proto__", "constructor", "prototype"]);
```
Metric names from parsed output are checked against a deny list before being stored. This prevents injection via crafted benchmark output.

**b) Command guard (autoresearch.sh enforcement):**
When `autoresearch.sh` exists in the working directory, the `run_experiment` tool REJECTS any command that isn't running that script. The guard strips env variable prefixes and known harmless wrappers (env, time, nice, nohup) and uses regex to verify the command targets `autoresearch.sh` specifically. This prevents the AI from circumventing the benchmark script.

```typescript
function isAutoresearchShCommand(command: string): boolean {
  // Strips env vars, harmless wrappers, validates path pattern
  return /^(?:(?:bash|sh|source)\s+(?:-\w+\s+)*)?(?:\./|\/[\w/.-]*\/)?autoresearch\.sh(?:\s|$)/.test(cmd);
}
```

[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts]

### Finding 3: AGR's error handling is CONFIRMED prompt-only (no code-level implementation)

The `skills/agr/` directory contains only 2 items: `SKILL.md` and `references/`. The SKILL.md specifies error handling rules as instructions to the AI agent:
- "Build crashed? -> Fix (3 attempts) or CRASH"
- "Benchmark timeout? -> CRASH"
- "GUARD FAILED + Metric improved? -> REWORK (max 2 attempts)"
- "GUARD FAILED + Metric didn't? -> DISCARD"
- "Stuck detection (>5 discards) -> re-read everything, try opposites, combine successes"

However, `run_agr.sh` is GENERATED at runtime by the AI, not provided in the repo. The actual shell template is in `references/templates.md` (not fetched). AGR has NO TypeScript/JavaScript code, NO compiled binary, NO runtime error handler. All error recovery relies on the AI following prompt instructions.

**Key insight**: AGR's approach is pure "prompt engineering for error recovery" -- the 5-tier system (build fix, guard rework, stuck detection, approach exhaustion, metric+guard separation) exists entirely in the AI's instruction set. The AI is responsible for implementing the retry logic at each invocation.

[SOURCE: https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/SKILL.md]
[SOURCE: https://github.com/JoaquinMulet/Artificial-General-Research/tree/main/skills/agr (directory listing)]

### Finding 4: autoresearch-opencode's error handling is also prompt-driven, not code-level

The `autoresearch.sh` file in autoresearch-opencode is actually a benchmark runner (BogoSort execution script), NOT the research loop. It uses `set -euo pipefail` and simple timeout handling per iteration, but has:
- No sentinel file checks (`.autoresearch-off` not implemented in shell)
- No state validation
- No retry logic
- No recovery mechanisms

The `.autoresearch-off` sentinel, data integrity protocol, and missing-state-file recovery documented in Wave 1 recon are likely in `skills/autoresearch/SKILL.md` (prompt-level, not code-level). The `plugins/` directory may contain TypeScript code (not fetched this iteration), but the primary loop is prompt-driven.

[SOURCE: https://github.com/dabiggm0e/autoresearch-opencode/blob/master/autoresearch.sh]

### Finding 5: Our current system (sk-deep-research) has the MOST DETAILED error specification but NO code enforcement

Our `loop_protocol.md` specifies:
- 7-row error handling table (dispatch timeout, WebFetch fails, state file missing, JSONL malformed, 3+ consecutive failures, API overload, memory save fails)
- 5-priority state recovery cascade (JSONL -> Strategy rebuild -> JSONL reconstruction -> Config restart -> Abort)
- Direct mode fallback (reference-only)
- Stuck recovery protocol with specific steps
- Pause sentinel mechanism

However, all of this is YAML workflow + agent prompt instructions. There is no TypeScript/JavaScript runtime enforcing these rules. The YAML workflow manages the loop lifecycle, but error handling within an iteration is entirely the agent's responsibility.

**Comparison with pi-autoresearch**: pi-autoresearch enforces error handling in TypeScript code that the AI CANNOT bypass. Our system relies on the AI following instructions, which is the same approach as AGR and autoresearch-opencode.

[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md (local)]

### Finding 6: Three-tier architecture pattern emerges across all repos

| Tier | Description | AGR | pi-autoresearch | autoresearch-opencode | sk-deep-research |
|------|-------------|-----|-----------------|----------------------|-----------------|
| T1: Code enforcement | Runtime code catches/handles errors | None | YES (TypeScript) | None | None |
| T2: Workflow enforcement | External loop/YAML manages lifecycle | run_agr.sh (generated) | Pi Agent extension | autoresearch.sh (benchmark only) | YAML workflow |
| T3: Prompt enforcement | AI follows written error rules | YES (primary) | YES (supplementary) | YES (primary) | YES (primary) |

Only pi-autoresearch operates at all 3 tiers. The other 3 systems (including ours) rely primarily on T3 (prompt enforcement) with some T2 support.

[INFERENCE: based on analysis of all 4 systems' source code and documentation]

## Sources Consulted
- https://github.com/JoaquinMulet/Artificial-General-Research (repo root, skills/agr/ listing, SKILL.md)
- https://github.com/davebcn87/pi-autoresearch (repo root, extensions/pi-autoresearch/index.ts full source)
- https://github.com/dabiggm0e/autoresearch-opencode (repo root, autoresearch.sh full source)
- .opencode/skill/sk-deep-research/references/loop_protocol.md (local, 459 lines)

## Assessment
- New information ratio: 0.75
- Questions addressed: RQ1 (primary), RQ3 (partial -- validates P1.1 Tiered Error Recovery proposal context), RQ4 (partial -- security hardening is a new discovery)
- Questions answered: RQ1 is ~85% answered. The remaining 15% would require fetching AGR's `references/templates.md` and autoresearch-opencode's `plugins/` directory for completeness.

## Reflection
- What worked and why: Fetching pi-autoresearch's index.ts via GitHub web UI yielded the richest findings. The WebFetch tool was able to extract nearly complete TypeScript source from the GitHub blob view. This approach works because GitHub renders source files as HTML that WebFetch can parse.
- What did not work and why: Raw GitHub URLs (raw.githubusercontent.com) returned 404 for all 3 repos. This is likely because the repos are private or the raw content CDN has access restrictions. Always use the GitHub blob view URL instead.
- What I would do differently: Start with GitHub blob URLs rather than raw URLs. Also, fetching the directory listing first to confirm file paths saved a failed attempt on the actual content fetch.

## Recommended Next Focus
RQ2: Convergence/stopping logic evolution. pi-autoresearch's segment-aware architecture (segment counter incrementing on each config header, baseline recalculation per segment) suggests their convergence model may have evolved significantly. Compare their `maxExperiments` enforcement and segment boundaries against our convergence.md algorithm. Also check AGR's `references/` for the run_agr.sh template to see if loop termination is code-enforced or prompt-enforced.
