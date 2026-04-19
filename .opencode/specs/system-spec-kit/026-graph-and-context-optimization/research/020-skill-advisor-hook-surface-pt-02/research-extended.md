# Skill-Advisor Hook Surface Extended Research Synthesis

## Executive Summary

Wave 1 already established the architecture direction: ship the skill-advisor hook surface as a shared-payload, freshness-aware, renderer-first stack, then layer runtime adapters on top in child specs `002-009`. Wave 2 does **not** overturn that sequencing. It closes the remaining design gaps and turns the parent packet from "architecture plausible" into "implementation contract ready." [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:3-22] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:309-379]

The main wave-2 deltas are concrete, not directional:

1. X1 defines the exact 200-prompt parity harness, baseline layout, timing lanes, and pass/fail thresholds needed before prompt-hook rollout. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:16-201]
2. X2 proves Claude `UserPromptSubmit` is the cleanest first-class prompt-time surface, with model-visible `additionalContext` and explicit block semantics. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:56-308]
3. X3 shows the checked-in Copilot path is notification-only today, but the upstream SDK can still inject model-visible `additionalContext`, so Copilot is a transport split, not a dead end. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-003.md:28-127]
4. X4 narrows Codex enforcement claims: `UserPromptSubmit` is still the advice path, while `PreToolUse` and `PostToolUse` only support partial, Bash-only enforcement. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-004.md:27-129]
5. X5-X9 close the trust-boundary work: prompt poisoning is real at scoring time, observability must be first-class, migration and concurrency need generation-aware freshness, and the renderer must sanitize the visible skill label after canonical folding instead of rendering arbitrary free text. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:24-87] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:63-251] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:59-142] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:50-151] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:49-142]

Final verdict: keep the wave-1 critical path, but refine each child spec's scope with the wave-2 contracts below. No architecture blocker remains. The remaining unknowns are validation tasks, not research gaps.

## Refined Cluster Decomposition

Wave 1's decomposition remains the right backbone. Wave 2 changes **scope precision**, not ordering. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:309-379]

| Child | Wave-1 role | Wave-2 refinement |
| --- | --- | --- |
| `002-shared-payload-advisor-contract` | Producer/source vocabulary and transport | Keep the neutral transport contract, but explicitly exclude prompt-derived `reason` text from any model-visible surface and reserve only typed freshness/confidence fields plus one sanitized visible label. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:58-138] |
| `003-advisor-freshness-and-source-cache` | Source signatures and trust-state mapping | Expand freshness to cover per-skill fingerprints, discovery-vs-graph parity, generation-tagged graph snapshots, and deleted/renamed skill suppression instead of TTL-only reuse. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:61-138] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:52-147] |
| `004-advisor-brief-producer-cache-policy` | Core `AdvisorHookResult` producer and fail-open policy | Make prompt normalization, metalinguistic skill-name suppression, exact prompt-cache keys, and deleted-skill fail-open behavior first-class producer rules. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:95-105] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:64-87] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:69-138] |
| `005-advisor-renderer-and-regression-harness` | Shared renderer, fixtures, privacy tests | This child must now own the 200-prompt parity/timing harness, the Unicode instructional-skill-label fixture, token-cap assertions, and observability/privacy checks. It is the hard gate before any multi-runtime rollout. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:141-201] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:115-247] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:87-120] |
| `006-claude-hook-wiring` | First user-visible runtime slice | Narrow the target to `UserPromptSubmit` with JSON `hookSpecificOutput.additionalContext` as the default path and top-level `decision: "block"` for structured denial. Do not overload existing Claude SessionStart input types. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:35-55] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:80-304] |
| `007-gemini-copilot-hook-wiring` | Gemini/Copilot parity expansion | Keep Gemini on JSON `additionalContext`. Split Copilot into preferred SDK `onUserPromptSubmitted` `additionalContext` vs notification-only shell wrapper fallback. Do not treat current `{}` notification success as proof of model-visible injection. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-003.md:28-123] |
| `008-codex-integration-and-hook-policy` | Codex adapter and policy | Separate advice from enforcement: use `UserPromptSubmit` for model-visible advisor context, `PreToolUse deny` only for Bash policy gates, and `PostToolUse` for post-side-effect audit/repair context. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-004.md:41-129] |
| `009-documentation-and-release-contract` | Setup, flags, privacy, validation | Add explicit health/alert semantics, migration and concurrency caveats, runtime capability splits, and operator guidance for fail-open and degraded freshness. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:174-247] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:112-147] |

Refined implementation order stays:

```text
002 -> 003 -> 004 -> 005 -> 006 -> 007 -> 008 -> 009
```

The only substantive rollout refinement from wave 2 is that `005` is now a harder gate than wave 1 implied: no runtime adapter should ship before parity, Unicode-label suppression, and observability/privacy fixtures exist.

## New Findings by Angle (X1-X9)

### X1 - Corpus parity and timing harness

The research packet now has a complete validation contract for the full 200-prompt corpus: canonical source file, derived executable fixture, frozen confidence baseline, four measurement lanes, and explicit latency and cache-hit thresholds. This closes the biggest wave-1 validation gap and makes `005` measurable rather than aspirational. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:28-201]

### X2 - Claude `UserPromptSubmit` semantics

Claude's upstream prompt hook is stronger and cleaner than the local packet surface had captured: it accepts `prompt` plus standard session fields, can inject model-visible context through plain stdout or `hookSpecificOutput.additionalContext`, and uses top-level `decision: "block"` or exit code `2` for prompt denial. The adapter should therefore be a dedicated prompt-hook parser/output pair, not a reuse of current SessionStart input types. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:35-308]

### X3 - Copilot prompt-time transport split

The checked-in Copilot path is currently notification-only because the shell wrapper discards stdin and returns `{}`. But the upstream Copilot SDK can still inject `additionalContext` before prompt processing. That means `007` should target a first-class SDK adapter where available and fall back to prompt wrapping only when the runtime exposes notification hooks but not model-visible hook return objects. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-003.md:30-127]

### X4 - Codex policy boundary

Codex is no longer an "unknown later" surface. It has a real hook contract, but the enforcement portion is narrower than a generic write barrier. `PreToolUse` can deny current Bash invocations, `PostToolUse` only reshapes continuation after the side effect, and non-shell tools remain outside the hook boundary. Packet `008` should therefore be precise: Codex can host prompt-time advice and partial Bash enforcement, not universal mutation control. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-004.md:41-129]

### X5 - Adversarial advisor and prompt-injection boundary

The live integrity risk is routing bias, not renderer echo. Explicit skill-name mentions inside raw prompt text can still bias recommendation scoring today, while the current repo does not yet have a prompt-brief renderer that reflects arbitrary user text back into model-visible output. The future mitigation set is therefore: prompt normalization, metalinguistic-skill-name suppression, whitelist-only rendering, and phase-019/003 P0 carry-over for any user-derived text that ever crosses the prompt boundary. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:24-87]

### X6 - Observability contract

Wave 2 converts wave-1 telemetry placeholders into a concrete operational contract: a `speckit_advisor_hook_*` metric namespace, one JSONL `stderr` record per invocation, alert thresholds for fail-open and latency, and a peer `advisor-hook-health` section inside `session_health`. This is enough to make prompt-hook rollout observable without logging raw prompts. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:63-251]

### X7 - Migration semantics

Migration safety is now explicitly defined. Global source-signature invalidation remains necessary, but it is not sufficient. Exact brief reuse must also carry per-skill fingerprints, renames must be treated as delete-plus-add, and deleted skills must be suppressed rather than rendered from stale cache entries. This materially sharpens `003` and `004`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:59-142]

### X8 - Concurrent-session semantics

Concurrency risk is now correctly decomposed: SQLite readers are already snapshot-safe, JSON fallback export is not; process-global graph caches are generation-blind after warmup; hook-state writes are file-atomic but not merge-safe. The packet therefore needs workspace-scoped graph rebuild locking, generation-tagged reader reuse, and per-session lock or CAS semantics for hook-state updates. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:30-151]

### X9 - Unicode / NFKC boundary for visible labels

The renderer, not the advisor subprocess, is the actual trust boundary. Typed freshness/confidence fields are safe; the visible skill label is still repository-authored free text from `SKILL.md`. The minimal safe contract is to whitelist visible fields, canonical-fold the skill label, normalize it to a single line, deny instruction-shaped normalized labels, and emit no brief when sanitization fails. Reusing the full recovered-payload provenance gate would be overkill. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:49-142]

## Wave-1 vs Wave-2 Convergence / Divergence

| Area | Wave-1 position | Wave-2 result | Outcome |
| --- | --- | --- | --- |
| Child-spec sequencing | `002-009` with `002-006` first | Same order survives; `005` becomes an even stricter rollout gate | **Converged** |
| Shared renderer | One renderer across runtimes | Same, plus explicit label sanitization and reason-text exclusion | **Converged with tighter scope** |
| Claude path | Best first runtime, needs exact prompt-hook capture | Confirmed: `UserPromptSubmit` is the right first-class adapter surface | **Converged** |
| Copilot path | Open question: does prompt hook become model-visible? | Split answer: checked-in wrapper is notification-only, upstream SDK can still inject `additionalContext` | **Diverged from local assumption, converged architecturally** |
| Codex path | Open question, deferred | Resolved: prompt-time advice yes, Bash-only enforcement only | **Diverged from "unknown," converged on narrowed scope** |
| Security boundary | Renderer-owned, no raw prompt persistence | Same, plus prompt-bias mitigation and canonical-folded visible-label contract | **Converged with stronger safeguards** |
| Observability | Need metrics, logs, health section | Fully specified namespace, log schema, alarms, and `session_health` section | **Converged and completed** |
| Freshness / migration | Source-signature freshness needed | Now extended to per-skill fingerprints, rename/delete semantics, and generation-tagged graph snapshots | **Converged with deeper cache model** |
| Concurrency | Freshness matters; fail open on stale state | Now formalized into lock scope, JSON fallback policy, CAS/lock semantics, and session-ID-first continuity | **New detail, no architectural reversal** |

The important meta-result is that wave 2 produced **no reversal of the wave-1 architecture**. Every divergence narrowed an unresolved runtime detail; none invalidated the parent plan.

## Final Open Questions

Architecture-level open questions are now effectively zero. What remains are validation items that must be discharged during child-spec execution:

| Remaining item | Class | Owner child | Blocking? |
| --- | --- | --- | --- |
| Run the full 200-prompt parity + timing harness against the final renderer/producer stack | Validation | `005` | Yes for rollout |
| Capture or fixture-check the exact Claude adapter behavior inside the shipped repo runtime | Validation | `006` | Yes for Claude rollout |
| Prove whether the target Copilot runtime exposes the SDK-style return object or only the existing shell notification surface | Validation | `007` | Yes for Copilot rollout |

No remaining item requires a new parent-level research loop. The packet has enough evidence to proceed into implementation.

## Handoff Contract

1. **Treat this packet as converged.** Start child-spec execution from `002`, not another architecture research pass. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:309-379]
2. **Do not ship runtime-specific prompt text before `005` exists.** The shared renderer, 200-prompt harness, observability assertions, and Unicode-label suppression fixture are mandatory preconditions. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:141-201] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:87-120]
3. **Keep renderer output on a strict whitelist.** Visible brief content is limited to freshness, confidence, uncertainty, and one sanitized skill label. Never render `reason`, `description`, prompt fragments, or semantic snippets into model-visible context. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:64-87] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:58-138]
4. **Bind cache reuse to freshness, migration, and concurrency contracts together.** Exact brief reuse needs global source signature, per-skill fingerprints, generation-aware graph snapshots, and session-ID-first continuity selection. Fail open whenever those guarantees are unavailable. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:61-138] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:52-147]
5. **Keep runtime adapters transport-specific but text-identical.** Claude and Gemini should prefer JSON `additionalContext`; Copilot should use SDK `additionalContext` when present and wrapper fallback otherwise; Codex should separate prompt-time advice from Bash-only enforcement. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:80-304] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-003.md:57-123] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-004.md:74-129]
6. **Make observability part of the shipping contract, not a follow-up.** The `speckit_advisor_hook_*` metrics, JSONL `stderr` record, and `advisor-hook-health` section should land with the rollout, not after it. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:63-247]

This concludes the extended wave: wave 1 supplied the architecture and sequencing; wave 2 closed the runtime, safety, migration, concurrency, and renderer-boundary details needed to execute that plan cleanly.
