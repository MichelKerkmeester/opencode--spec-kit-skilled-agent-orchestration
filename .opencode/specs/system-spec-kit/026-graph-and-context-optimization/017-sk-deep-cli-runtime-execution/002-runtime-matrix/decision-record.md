---
title: "Decision Record: CLI Runtime Matrix"
description: "ADRs for Phase 019: per-kind validation vs discriminated union, cross-CLI delegation as docs not code, cli-copilot positional prompt strategy, gemini model whitelist."
trigger_phrases: ["019 decisions", "cli matrix adr"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-sk-deep-cli-runtime-execution/002-runtime-matrix"
    last_updated_at: "2026-04-18T11:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "ADRs drafted"
    next_safe_action: "Begin Phase A"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: CLI Runtime Matrix

---

<!-- ANCHOR:adr-001 -->
## ADR-006: Flat config with per-kind validation, not discriminated Zod union

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Claude Opus (continuing Phase 018 pattern) |

<!-- ANCHOR:adr-001-context -->
### Context

Phase 018 shipped a flat `executor` config block with six fields. When only cli-codex was wired, flat-with-all-fields was fine because the unwired kinds rejected at config load before flag validation mattered.

With four CLIs wired, each CLI has a different supported-flag subset:
- cli-codex: model, reasoningEffort, serviceTier, sandboxMode, timeoutSeconds
- cli-copilot: model, timeoutSeconds (reasoning-effort is `~/.copilot/config.json` only; no serviceTier; no sandbox flag)
- cli-gemini: model, sandboxMode, timeoutSeconds (no reasoning-effort flag; no serviceTier)
- cli-claude-code: model, reasoningEffort, sandboxMode, timeoutSeconds (no serviceTier; sandboxMode is really permission-mode)

A user who sets `serviceTier: "fast"` with `kind: "cli-gemini"` is wrong — the flag doesn't apply. Two ways to handle this:

**(A) Flat config + per-kind runtime validation**: reject at parse time with clear messages.
**(B) Zod discriminated union**: each kind's schema declares only the fields it accepts.

### Constraints

- Phase 018's shared config block structure is referenced by both `deep_research_config.json` and `deep_review_config.json` as "identical six-field block". Breaking that symmetry with per-kind sub-schemas is disruptive.
- Users write config JSON by hand. A flat schema is easier to author.
- The optimizer manifest tracks flat field names.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the flat config. Add a per-kind flag-compatibility validator inside `parseExecutorConfig`.

**How it works**: A new constant `EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]>` declares supported flags per kind. After Zod parses the flat object, the validator iterates over non-default-valued fields on the parsed config and checks each against the kind's support list. Any mismatch throws `ExecutorConfigError` with a message naming the unsupported flag, the kind, and the kind's supported flag list.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Flat + per-kind validator** | Preserves Phase 018 schema symmetry; easy to hand-author config; clear error messages | Validator logic grows as kinds diverge | 9/10 |
| Zod discriminated union | Type-safe at schema level; unsupported fields impossible to express | Breaks symmetry; optimizer manifest churn; harder to hand-author; each kind needs its own schema object | 6/10 |
| Lenient flat (silent ignore) | Simplest code | Users silently lose intent; hard to debug | 3/10 |

**Why this one**: The validator overhead is trivial (~20 lines). It catches user mistakes with precise errors. It keeps the config surface predictable. It doesn't cascade into per-kind schema objects the optimizer manifest would need to track.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: Users get clear errors when they set flags that don't apply to their chosen kind. Schema symmetry between research/review configs survives.

**What it costs**: The flag-compatibility map must be updated when any kind's supported flags change (e.g., if Copilot adds a CLI-level reasoning-effort flag). Mitigation: centralized map in one file; single point of update.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Map drifts from actual CLI capabilities | M | Keep map next to per-kind invocation code; update in same PR when CLI capabilities change |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Each CLI has distinct flag surface; users need guardrails |
| 2 | Beyond Local Maxima? | PASS | 3 alternatives evaluated; union rejected for symmetry cost |
| 3 | Sufficient? | PASS | Covers every supported-flag mismatch at parse time |
| 4 | Fits Goal? | PASS | Directly enables 4-CLI wiring without runtime surprises |
| 5 | Open Horizons? | PASS | Adding a 5th CLI only requires a new enum value + new map entry + new YAML branch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `executor-config.ts` gains `EXECUTOR_KIND_FLAG_SUPPORT` map + validator logic in `parseExecutorConfig`.
- `executor-config.vitest.ts` gains ~12 new cases covering per-kind supported/unsupported matrices.

**How to roll back**: Single-commit revert restores Phase 018's `ExecutorNotWiredError` rejection for the 3 kinds.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-007: Cross-CLI delegation as documentation, not runtime enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

### Context

User asked: *"And that within every cli runtime they can use the other CLI skills in theory."* This raises whether we should:
- (A) Detect at dispatch time if an executor is invoking itself recursively (e.g., running codex iteration that invokes `codex exec` via bash)
- (B) Document the design intent and anti-patterns in SKILL.md; leave enforcement to user discipline

### Decision

**We chose**: Document only. No runtime enforcement in this phase.

**How it works**: Both SKILL.md files get a Cross-CLI Delegation subsection stating: (1) each CLI executor can invoke other CLIs via its shell/sandbox; (2) self-recursion is an anti-pattern that each CLI skill already warns about; (3) auth propagation is user-responsibility.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Docs only** | Minimal change; honors each CLI skill's existing guardrails | User can still wire recursion; runtime won't catch | 8/10 |
| Runtime detection | Enforced guardrail | Requires parsing iteration JSONL or command strings for CLI invocations; cross-CLI recursive detection is non-trivial | 5/10 |
| Block recursion at dispatch | Strictest | Complicated: detecting "the iteration command contains another CLI" requires static analysis of prompt content | 3/10 |

**Why this one**: Runtime enforcement is expensive to build correctly and would fail in non-obvious ways (a CLI might invoke `/usr/bin/env codex` or a shell alias). The anti-pattern guidance from each CLI's own skill already covers the main case. Runtime enforcement can be a separate future spec if users report issues.

### Consequences

**What improves**: Ships without enforcement complexity. Each CLI skill's documentation is the source of truth.

**What it costs**: A user can wire `cli-codex` executor and write a prompt that tells the iteration to invoke `codex exec` recursively. Nothing catches that.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recursive invocation exhausts API quota | M | Existing stuck_recovery handles repeated failures; user feedback loop |
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-008: cli-copilot prompt-as-positional, with tempfile fallback for large prompts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

### Context

cli-copilot has no stdin support. Its only non-interactive prompt input is positional via `-p "PROMPT"`. Our iteration prompts can be 3-8 KB; most shells handle this fine, but `ARG_MAX` on some systems is 32 KB and our prompts can approach that with state summaries embedded.

### Decision

**We chose**: Use positional prompt via `-p "$(cat prompt-path)"` by default. For prompts approaching `ARG_MAX`, fall back to a wrapper prompt that references the rendered prompt file via `@path` syntax (a Copilot CLI feature that lets the agent read files referenced in the prompt).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Positional + @path fallback** | Works for all prompt sizes; no custom file handling | Two dispatch shapes; detection logic needed for fallback | 8/10 |
| Always positional | Simplest | Fails on ARG_MAX systems with long prompts | 5/10 |
| Always @path reference | Uniform | Adds a wrapper prompt layer that changes Copilot's behavior subtly | 6/10 |

**Why this one**: The hybrid matches Copilot's documented patterns. The fallback kicks in only when needed. Most users never hit it.

### Consequences

**What improves**: Handles the full prompt-size range.

**What it costs**: Slightly more YAML complexity. The fallback branch inside `if_cli_copilot` needs a size check. Acceptable given the ARG_MAX risk.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-009: cli-gemini model whitelist (strict enum)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |

### Context

Gemini CLI currently supports a single model: `gemini-3.1-pro-preview`. Future Google releases will add more. Our config schema needs a validation policy.

### Decision

**We chose**: Strict enum whitelist. `GEMINI_SUPPORTED_MODELS = ['gemini-3.1-pro-preview'] as const`. Config rejects any other value with an error listing supported models.

When Google ships a new model, users file a PR updating the whitelist.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Strict whitelist** | Users get immediate feedback on invalid model IDs; no silent failures | Requires update when Google ships new models | 8/10 |
| Open string (any value) | No maintenance | Typos silently dispatch with wrong model ID; Gemini CLI rejects at invocation with a less-clear error | 4/10 |
| Regex (`^gemini-.*$`) | Partially lenient | Passes invalid-but-gemini-looking IDs | 5/10 |

**Why this one**: The Gemini CLI's model surface is small and stable. Strict enum is the smallest risk of misdispatch.

### Consequences

**What improves**: Users get parse-time errors for typos or deprecated models.

**What it costs**: One-line update per new Google release. Low friction.
<!-- /ANCHOR:adr-004 -->
