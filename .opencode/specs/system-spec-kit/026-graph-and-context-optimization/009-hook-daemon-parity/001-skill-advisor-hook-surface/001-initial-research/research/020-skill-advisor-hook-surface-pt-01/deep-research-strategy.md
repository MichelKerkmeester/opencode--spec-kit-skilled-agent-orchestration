# Deep Research Strategy: 020 Skill-Advisor Hook Surface

Research Charter: converge on cross-runtime skill-advisor hook architecture with ranked implementation-cluster proposals + child-spec-folder mapping.

## Non-Goals

- Implementing any hook wiring (belongs to 020/002+ children)
- Changing advisor ranking algorithm
- Cross-repo skill discovery

## Stop Conditions

- newInfoRatio < 0.05 (rolling avg of last 3 iterations)
- 10 iterations max reached
- research.md + cluster-mapping written to completion

## Key Questions
<!-- REDUCER_ANCHOR:key-questions -->

- [x] Q1: Does Codex CLI expose a prompt-submit hook equivalent to Claude's `UserPromptSubmit`? If not, what wrapper strategy is cleanest?
- [x] Q2: What's the empirical cache TTL sweet spot? Measure using 019/004 200-prompt corpus; expect 1-15 min range.
- [x] Q3: What's the optimal brief length (40/60/80/120 tokens) that retains full routing quality?
- [x] Q4: How does `getAdvisorFreshness()` semantic map to `live/stale/absent/unavailable`? What's the freshness comparison (SKILL.md mtimes vs skill-graph SQLite mtime)?
- [x] Q5: What subprocess-error modes must the fail-open contract handle (binary missing, timeout, JSON parse error, concurrent write to skill-graph)?
- [x] Q6: Should the hook fire on ALL user prompts or only above a length threshold? What's the threshold?
- [x] Q7: Is prompt-fingerprint storage in hook-state a privacy concern? How should it be scoped (in-memory only, persisted with TTL, salted hash)?
- [x] Q8: What's the cross-runtime snapshot-test strategy to prevent format drift across 3 CLIs?
- [x] Q9: How many implementation clusters should this decompose into? (Parent spec proposes 7 — 002-advisor-brief-producer, 003-claude-hook-wiring, 004-gemini-hook-wiring, 005-copilot-hook-wiring, 006-codex-integration, 007-freshness-signal, 008-documentation.)
- [x] Q10: What's the interaction with phase 018 R4 shared-payload contract — does it need any extension for this use case?
<!-- /REDUCER_ANCHOR:key-questions -->

## Answered Questions
<!-- REDUCER_ANCHOR:answered-questions -->
- Q4 answered in iteration 002: `getAdvisorFreshness()` should be non-mutating and compare top-level `SKILL.md` signatures, `graph-metadata.json` mtimes, advisor script/runtime/compiler mtimes, and preferred `skill-graph.sqlite` / fallback `skill-graph.json` artifact freshness. Public trust semantics should map `fresh|ready -> live`, `stale -> stale`, `absent -> absent`, and `unavailable -> unavailable`.
- Q1 answered in iteration 004: modern Codex has `SessionStart`, `UserPromptSubmit`, and `Stop` hook evidence, and `UserPromptSubmit.hookSpecificOutput.additionalContext` is the right native advisor brief injection candidate. The repo still needs a first-class `hooks/codex/` adapter and dynamic Codex hook-policy detection.
- Q5 answered in iteration 005: prompt-time advisor hooks should fail open with a typed `AdvisorHookResult`, no model-visible brief on subprocess failures, public freshness of `live|stale|absent|unavailable`, one optional short SQLite-busy retry only when budget remains, and aggregate observability without raw prompt persistence.
- Q6 answered in iteration 006: do not fire on every prompt. Skip empty, casual, and control prompts; fire for explicit skill/command/governance markers; otherwise require 20 visible chars plus 4 meaningful tokens or a work-intent verb plus 3 meaningful tokens.
- Q7 answered in iteration 006: prompt fingerprints are privacy-sensitive. Use session-scoped HMAC-SHA256 over canonical prompt plus source/runtime config, keep it in memory by default, and persist only source freshness plus aggregate diagnostics unless an opt-in 5-minute exact-cache path is explicitly enabled.
- Q8 answered in iteration 006: use normalized custom-diff tests as the authoritative cross-runtime comparison, with small Vitest inline snapshots only for reviewed wrapper shapes. Auto-compare Claude, Gemini, and Copilot immediately; add Codex after the 020/006 adapter lands.
- Q9 answered in iteration 007: decompose into eight implementation children after research: 002 shared-payload contract, 003 advisor freshness/source cache, 004 advisor brief producer/cache policy, 005 renderer/regression harness, 006 Claude wiring, 007 Gemini/Copilot wiring, 008 Codex integration/policy, and 009 documentation/release contract.
- Q10 answered in iteration 007: extend shared payload with `producer: "skill_advisor_brief"` and structured advisor section metadata, but do not add `kind: "skill-advisor"` because `kind` is lifecycle/transport vocabulary rather than producer identity.
- Q2 answered in iteration 008 for architecture: use a 15-minute source freshness cache, optional 5-minute exact HMAC prompt-result cache, and no similarity-only result reuse. The full 019/004 200-prompt corpus run is assigned to the renderer/regression harness child as a validation gate, not a prerequisite for final research synthesis.
- Q3 answered in iteration 008 for architecture: use an 80-token default advisor brief and 120-token hard cap; 60 tokens is the minimum safe brief; 40-token-only output is rejected because it hides threshold and freshness state.
<!-- /REDUCER_ANCHOR:answered-questions -->

## Known Context

- Parent 020 charter committed research-first per ADR-001
- Pattern reference: `mcp_server/lib/code-graph/startup-brief.ts` (live in all 3 runtimes)
- Shared-payload envelope from phase 018 R4 is the cross-runtime transport
- 019/004 200-prompt corpus available at `research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
- Trust-state vocabulary canonical: `live | stale | absent | unavailable` (phase 016 M8)
- Fail-open contract ADR-003 in parent decision-record.md
- Pattern-reuse ADR-002 mandates mirror of code-graph shape

## Next Focus
<!-- REDUCER_ANCHOR:next-focus -->

Iteration 9: Draft the final `research.md` synthesis from iteration 8's outline. Keep it synthesis-only unless a cited claim still needs a targeted runtime/source verification pass. Explicitly call out that 005 owns the full 200-prompt parity/timing gate and that 007/008 are deferred parity children after the Claude slice proves the shared renderer.
<!-- /REDUCER_ANCHOR:next-focus -->

## What Worked
<!-- REDUCER_ANCHOR:what-worked -->
- Iteration 002 found a strong reuse path: keep the code-graph producer structure, reuse `createSharedPayloadEnvelope()` and transport coercion, and add a sibling advisor state/trust adapter.
- Iteration 005 found that the safest contract keeps hook execution status, advisor freshness, and recommendation threshold status separate; this prevents stale/degraded advisor state from masquerading as a mandatory skill instruction.
- Iteration 006 found that normalized adapter tests are better than raw snapshots for cross-runtime drift: compare model-visible advisor context semantically, then keep small inline snapshots for runtime wrapper review.
- Iteration 007 found a cleaner implementation graph by making shared-payload vocabulary and renderer/regression harness explicit prerequisites instead of burying them inside runtime wiring children.
- Iteration 008 found that Q2/Q3 are architecture-sufficient without rerunning the full corpus inside research: the full corpus becomes a child-owned validation gate, while the research synthesis can rank and sequence the implementation train now.
<!-- /REDUCER_ANCHOR:what-worked -->

## What Failed
<!-- REDUCER_ANCHOR:what-failed -->
- Shared-payload transport currently rejects unknown producer labels, so a first-class advisor envelope requires enum updates before runtime hooks emit it.
- `skill_advisor.py --health` currently reports degraded inventory parity because the SQLite graph includes `skill-advisor` while top-level `SKILL.md` discovery finds 20 skills and no `skill-advisor` SKILL.md.
- Reusing `kind: "startup"` for all prompt-time advisor output is semantically leaky; `startup` is acceptable only for session-start composite payloads.
- The parent plan/spec still mention `{ kind: 'skill-advisor' }` and a p95 <= 50 ms budget, while research rejects the lifecycle kind and iteration 003's shell-out sample sits slightly above 50 ms p95. Final synthesis must flag both as implementation-plan updates.
<!-- /REDUCER_ANCHOR:what-failed -->

## Exhausted Approaches
<!-- REDUCER_ANCHOR:exhausted-approaches -->
- Copying code-graph freshness directly is exhausted: advisor authority is skill inventory, graph metadata, graph artifacts, and advisor runtime source, not git HEAD plus tracked code-file mtimes.
- Retrying deterministic prompt-hook failures is exhausted: missing Python, missing script, malformed JSON, unsupported hook payloads, and non-zero config errors should not retry inside the prompt path.
<!-- /REDUCER_ANCHOR:exhausted-approaches -->

## Ruled Out Directions
<!-- REDUCER_ANCHOR:ruled-out-directions -->
- Do not run full advisor health checks on every prompt; use freshness/cache invalidation plus bounded prompt analysis for the hook hot path.
- Do not emit `skill_advisor_brief` as a new shared-payload producer until `SHARED_PAYLOAD_PRODUCER_VALUES` and section source vocabulary support it.
- Do not add remote/network fetches to prompt-time advisor hooks; future remote augmentation belongs to background warming or health surfaces only.
- Do not persist raw prompts, normalized prompts, token lists, or prompt fingerprints into hook-state by default; prompt-result cache is memory-only unless an explicit 5-minute HMAC exact-cache mode is enabled.
- Do not add `kind: "skill-advisor"` to the shared-payload lifecycle enum; advisor identity belongs in producer and section metadata.
- Do not block final research synthesis on a full 200-prompt rerun; preserve it as a required `005` regression gate before runtime rollout claims no regression.
- Do not let Gemini, Copilot, or Codex runtime children define independent advisor text; they must consume the shared renderer fixtures.
<!-- /REDUCER_ANCHOR:ruled-out-directions -->
