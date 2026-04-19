# Iteration 010 - X10 Final Synthesis and Convergence

## Focus

Consolidate wave 1 and wave 2 into one execution-ready synthesis, verify whether any wave-2 finding changes the `002-009` decomposition, and reduce open questions to validation-only items.

## Inputs Read

- Wave-1 synthesis:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Wave-2 state:
  - `deep-research-config.json`
  - `deep-research-state.jsonl`
  - `deep-research-strategy.md`
- Wave-2 iteration narratives:
  - `iterations/iteration-001.md`
  - `iterations/iteration-002.md`
  - `iterations/iteration-003.md`
  - `iterations/iteration-004.md`
  - `iterations/iteration-005.md`
  - `iterations/iteration-006.md`
  - `iterations/iteration-007.md`
  - `iterations/iteration-008.md`
  - `iterations/iteration-009.md`
- Wave-2 structured deltas:
  - `deltas/iter-008.jsonl`
  - `deltas/iter-009.jsonl`

## Synthesis Result

### 1. Wave-1 architecture stands

Wave 2 did not overturn the parent architecture. The wave-1 contract-first rollout remains correct:

```text
002 -> 003 -> 004 -> 005 -> 006 -> 007 -> 008 -> 009
```

The most important synthesis result is negative knowledge: no wave-2 finding requires a new parent redesign, a reordering of the child specs, or a runtime-first implementation shortcut. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:309-379]

### 2. Wave-2 changed scope precision, not sequencing

Wave 2 closed the packet's open questions in four clusters:

1. **Runtime contracts** - Claude, Copilot, and Codex now have explicit prompt-time or policy boundaries. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:56-308] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-003.md:46-127] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-004.md:41-129]
2. **Validation and observability** - the packet now has a full 200-prompt harness design, metric namespace, log schema, and health-section contract. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:70-201] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:63-251]
3. **Freshness, migration, and concurrency** - cache reuse now has explicit per-skill, per-generation, and per-session constraints. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:59-142] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:50-151]
4. **Trust boundary hardening** - prompt-derived reasoning stays diagnostic-only, and the visible skill label must be canonical-folded and suppressed when instruction-shaped. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:64-87] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:58-138]

## Refined Cluster Decomposition

| Child | Iteration-10 synthesis verdict |
| --- | --- |
| `002-shared-payload-advisor-contract` | Unchanged order. Scope now explicitly excludes prompt-derived `reason` text from model-visible output. |
| `003-advisor-freshness-and-source-cache` | Expanded to include per-skill fingerprints, graph snapshot generations, and inventory-parity reuse rules. |
| `004-advisor-brief-producer-cache-policy` | Expanded to include prompt normalization, metalinguistic skill-name suppression, and deleted-skill fail-open logic. |
| `005-advisor-renderer-and-regression-harness` | Upgraded into the hard rollout gate: 200-prompt harness, Unicode-label suppression fixture, and observability/privacy assertions. |
| `006-claude-hook-wiring` | Narrowed to the dedicated Claude `UserPromptSubmit` adapter with JSON `additionalContext` as the default path. |
| `007-gemini-copilot-hook-wiring` | Split Copilot into SDK `additionalContext` preferred path and shell-wrapper prompt fallback when notification-only transport is all that exists. |
| `008-codex-integration-and-hook-policy` | Narrowed to prompt-time advice plus Bash-only enforcement semantics. |
| `009-documentation-and-release-contract` | Expanded to document alarms, degraded freshness, migration, and concurrency behavior. |

## New Findings by Angle

### X1

The wave now has a concrete parity harness contract: source corpus, derived fixture, baseline confidence file, four timing lanes, and fixed performance gates. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-001.md:28-201]

### X2

Claude `UserPromptSubmit` is the best first runtime because it supports pre-prompt model-visible `additionalContext` and a native structured block path. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-002.md:80-304]

### X3

Copilot is not blocked by platform capability; it is blocked by the repo's current notification-only transport. That means `007` is still valid, but its contract is now split. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-003.md:46-127]

### X4

Codex should be described precisely: advice path on `UserPromptSubmit`, partial enforcement on Bash-only `PreToolUse`, and no claim of general mutation governance. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-004.md:63-129]

### X5

Prompt poisoning is a live scoring risk today, but prompt-to-brief injection is still mostly latent until the renderer crosses the trust boundary with user-derived text. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-005.md:34-87]

### X6

Observability is fully specified and should ship with the rollout, not after it. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-006.md:63-247]

### X7

Migration-safe cache reuse now requires both whole-inventory and per-skill freshness checks; rename is delete-plus-add, never silent aliasing. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-007.md:61-138]

### X8

Concurrent-session correctness depends on generation-aware cache reuse and semantic serialization of hook-state updates, not on TTLs or process restarts. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-008.md:52-147]

### X9

The renderer must canonical-fold and sanitize the single visible skill label and suppress the brief if that normalized label becomes instruction-shaped. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/iterations/iteration-009.md:58-138]

## Wave-1 vs Wave-2 Convergence / Divergence

| Area | Final synthesis |
| --- | --- |
| Sequencing | Converged: no reordering needed. |
| Shared renderer | Converged with stronger label-sanitization and whitelist rules. |
| Claude | Converged: dedicated `UserPromptSubmit` adapter remains the first runtime slice. |
| Copilot | Divergence only in transport evidence: local repo is notification-only, platform SDK still supports model-visible injection. |
| Codex | Divergence only in scope: upstream capability exists, but enforcement remains Bash-only. |
| Security | Converged: renderer-owned trust boundary remains correct, now with explicit prompt-bias and Unicode-label rules. |
| Observability | Converged and closed: metrics, logs, alarms, and health section now specified. |
| Freshness / concurrency | Converged with deeper cache and locking model; no architecture reversal. |

## Final Open Questions

No architecture blocker remains. Remaining work is validation-only:

1. Run the final 200-prompt harness in `005`.
2. Prove the shipped Claude adapter behavior in `006`.
3. Prove the shipped Copilot transport path in `007`.

## Handoff Contract

1. Start implementation at `002`, not a new research pass.
2. Treat `005` as the hard rollout gate for all runtimes.
3. Keep visible brief text to freshness + confidence + uncertainty + one sanitized skill label only.
4. Bind cache reuse to source signatures, per-skill fingerprints, graph snapshot generation, and session-ID-first continuity.
5. Ship observability with the feature.

## Ruled Out

- Reordering the child-spec train based on wave-2 findings.
- Treating Copilot's current `{}` notification wrapper as model-visible prompt injection.
- Expanding label sanitization into the full recovered-payload provenance contract for one-line advisor briefs.

## Decisions

- **Mark X10 answered and converged.** Wave 1 plus wave 2 now provides an execution-ready contract for `002-009`.
- **Keep the architecture stable.** Wave 2 refines implementation scope instead of rewriting the plan.
- **Reduce remaining questions to validation tasks only.**

## Question Status

- **X10 answered**: wave-1 and wave-2 findings are now consolidated in `research-extended.md`, the cluster decomposition is refined, convergence/divergence is explicit, and the remaining items are validation-only.
