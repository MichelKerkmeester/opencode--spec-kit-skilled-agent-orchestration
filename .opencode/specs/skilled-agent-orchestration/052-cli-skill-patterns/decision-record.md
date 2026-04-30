---
title: "Decision Record: cli-* skill consistency patterns"
description: "ADRs capturing what to harmonize and what to keep provider-native across the 5 cli-* skills."
trigger_phrases:
  - "cli skill ADRs"
  - "cli harmonization decisions"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: cli-* skill consistency patterns

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep provider-native flag names — do NOT rename to a single canonical form

<!-- ANCHOR:adr-001-context -->
### Context

The 5 cli-* skills expose the same intent but wrap different upstream binaries. Each upstream binary has its own conventions for the "reasoning effort" knob and for agent routing:

| Skill | Reasoning-effort flag | Agent-routing syntax |
|-------|------------------------|----------------------|
| cli-claude-code | `--effort high` (Opus only) | `--agent <slug>` |
| cli-codex | `-c model_reasoning_effort="<level>"` | `-p <profile>` |
| cli-copilot | `--effort` | `--agent explore | task` |
| cli-gemini | (none — single model, no reasoning knob) | `@prefix` (in prompt content) |
| cli-opencode | `--variant <level>` | `--agent <slug>` |

A naïve harmonization pass might rename all of these to a single canonical form (e.g. force `--variant` everywhere). That would silently break every dispatch the skill emits, since the AI agent has to invoke the *real* upstream binary with the flag the binary actually accepts.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Keep all provider-native flag names exactly as the upstream binaries accept them. Harmonize only the *call-out subsection name* (e.g. each SKILL.md §3 has a "Reasoning-Effort Knob" subsection that documents the per-CLI-native flag), not the flag itself.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

1. **Rename to a single canonical flag (`--variant` everywhere)** — rejected. Would emit dispatches that the upstream binaries silently fail on. The grep gate in checklist.md CHK-010..CHK-056 would catch the regression but it would be a wasted edit cycle.
2. **Wrap upstream invocation in a translator layer per skill** — rejected as over-engineering. The skill already documents the native flag; a translator adds a maintenance surface for no functional benefit.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- The harmonized §3 subsection name is consistent (e.g. "Reasoning-Effort Knob") but the documented flag value remains native.
- Any AI consumer of the skill must read the subsection body, not just the subsection name, to learn the actual flag.
- Downstream agents that try to share a single `--effort` shim across cli-* dispatches will keep failing — that's by design.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

1. **Necessary?** YES — the user explicitly said "without removing unique context". Provider-native flags are unique context.
2. **Beyond Local Max?** YES — alternative 1 (rename canonical) and alternative 2 (translator wrapper) both considered.
3. **Sufficient?** YES — keeping flags native + harmonizing subsection names is the simplest approach that satisfies the user's constraint.
4. **Fits Goal?** YES — the goal is sibling consistency, which is achieved at the structural level without touching native semantics.
5. **Open Horizons?** YES — when upstream binaries add new flags, this decision keeps the skill flexible: each skill updates its own §3 entry independently.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

- Verified by `checklist.md` per-skill rows CHK-010 through CHK-056 (do-not-collapse grep gate).
- spec.md §3 "Out of Scope" bullet 1 captures this rule.
<!-- /ANCHOR:adr-001-impl -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: cli-opencode SKILL.md serves as the donor template for §3 Provider Auth Pre-Flight

<!-- ANCHOR:adr-002-context -->
### Context

Packet 051 added a "Provider Auth Pre-Flight (Smart Fallback)" subsection to cli-opencode SKILL.md §3. The pattern (one-shot pre-flight check on first dispatch, 3-state decision table, ASK-not-substitute user-prompt templates, cache invalidation on auth-error mid-dispatch) is generic enough to apply to every cli-* skill. The 4 sibling skills currently have NO equivalent subsection — auth failure surfaces only in their Error Handling table (and cli-copilot is missing even that).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

Use cli-opencode's §3 "Provider Auth Pre-Flight (Smart Fallback)" block as the donor template. For each of the 4 sibling skills, port the block verbatim with these substitutions:

1. Pre-flight detection command — substitute the CLI-native equivalent: `claude auth list` / `codex auth status` / `gh auth status copilot` / `gemini auth status`.
2. Provider names in the 3-state decision table — substitute primary + fallback per CLI.
3. Login command shapes — substitute the CLI-native login commands.

Keep identical: the ASK-not-substitute user-prompt template language, the cache-invalidation-on-auth-error contract, the 3-state table column structure.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

1. **Re-author the pattern from scratch per skill** — rejected. Increases drift risk; the four siblings would inevitably end up with subtly different ASK templates.
2. **Extract to a shared reference under `system-spec-kit/references/cli/auth_preflight.md`** — deferred. Could be a future step; for the 052 packet, donor-and-recipient pattern is faster and the substitutions are skill-specific enough that a shared file would still need per-CLI adaptation tables.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- All 5 skills surface the same "ask before substituting a model" contract, which protects users from unexpected costs/latency/capability swaps across the entire family.
- If the cli-opencode pattern is later refined (e.g. a 4th decision-table state added), the change must be backported to the 4 siblings — captured as a follow-on packet, not part of 052.
- Future cli-* additions (e.g. cli-anthropic-direct, cli-anthropic-bedrock) inherit the pattern from day 1.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

1. **Necessary?** YES — auth failures are a real pain point. cli-opencode just shipped the protocol in 051; siblings have the same need.
2. **Beyond Local Max?** YES — alternative 2 (shared reference file) considered and deferred to a future packet.
3. **Sufficient?** YES — port + substitute satisfies sibling consistency.
4. **Fits Goal?** YES — direct match for "make them more consistent without removing unique context".
5. **Open Horizons?** YES — extraction to a shared reference is a future option; current donor-and-recipient does not block it.
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

- T008 extracts the donor template to `scratch/provider-auth-preflight-template.md`.
- T011, T015, T018 port + substitute per sibling.
- Verified by checklist.md CHK-063 (all 5 skills have the subsection).
<!-- /ANCHOR:adr-002-impl -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Load-bearing extra reference/asset files stay (codex `hook_contract.md`, copilot `shell_wrapper.md`)

<!-- ANCHOR:adr-003-context -->
### Context

The structural audit found that 4 skills have 4 reference files each, but cli-codex has 5 (adds `hook_contract.md`); 4 skills have 2 asset files each, but cli-copilot has 3 (adds `shell_wrapper.md`). A naïve "make folder counts equal" pass would delete the extras to enforce parity.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

Keep both load-bearing extras. They encode provider-specific functionality:

- `cli-codex/references/hook_contract.md` — codex is the only CLI in this family with native hooks support (`SessionStart`, `UserPromptSubmit` hook contract; `codex_hooks` feature flag). The hook contract documentation has no equivalent in any sibling skill.
- `cli-copilot/assets/shell_wrapper.md` — copilot is the only CLI in this family that requires a shell wrapper to inject the `SPEC-KIT-COPILOT-CONTEXT` markers into `~/.copilot/copilot-instructions.md` (Copilot CLI does not support hooks for prompt injection). The wrapper has no equivalent in any sibling skill.

Folder count parity is a structural surface; load-bearing files are functional substance. Substance wins.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

1. **Delete the extras to enforce numeric parity** — rejected. Would erase provider-specific functionality.
2. **Add empty-stub equivalents to the other 3 skills** — rejected. Pure stubs are noise.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- The folder-count metric in any future audit must call out these 2 known exceptions (documented here).
- spec.md §3 "Out of Scope" bullet 5 captures the rule.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

1. **Necessary?** YES — both files encode unique provider functionality.
2. **Beyond Local Max?** YES — alternatives 1 (delete) and 2 (empty stubs) considered.
3. **Sufficient?** YES — keeping them as-is is the minimum-edit path.
4. **Fits Goal?** YES — preserves unique context.
5. **Open Horizons?** YES — if a sibling later adopts hooks or wrapper-style injection, the precedent is set.
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

- Verified by checklist.md CHK-091 / CHK-092 (file existence checks).
- spec.md §3 "Out of Scope" final bullet captures the rule.
<!-- /ANCHOR:adr-003-impl -->

---
