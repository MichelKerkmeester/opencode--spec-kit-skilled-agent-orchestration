---
title: "Decision Record: Deep-Loop CLI Executor Selection"
description: "ADRs for Phase 018 architectural choices: dispatch-branch vs. loop-replacement, config-block vs. runtime_capabilities.json extension, cli-codex-first vs. cli-copilot-first, stdin-piping vs. positional-prompt, sk-deep-review co-ship vs. sequential."
trigger_phrases:
  - "018 decisions"
  - "deep-loop executor adr"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-cli-runtime-executors/001-executor-feature"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "ADRs drafted"
    next_safe_action: "Begin Phase A implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Deep-Loop CLI Executor Selection

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Dispatch-branch inside YAML, not a loop replacement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | User (architecture principle) + Claude Opus (implementation design) |

<!-- ANCHOR:adr-001-context -->
### Context

`sk-deep-research` and `sk-deep-review` have a SINGLE canonical loop — the YAML workflow — that owns state (JSONL + strategy + registry + dashboard), convergence detection, lifecycle events, and the reducer. SKILL.md:46-50 forbids custom bash dispatchers or in-loop CLI invocation precisely because any loop-replacement approach loses all of those guarantees.

SKILL.md:61 (research) and :63 (review) acknowledged that users might want executor CLIs, with the explicit design intent: *"the executor still runs INSIDE the command's workflow. The CLI executor is a tool inside the command, not a replacement for the command."*

When the user asked for cli-codex dispatch on 2026-04-18, the choice was: (a) honor the forward-looking note by wiring executor selection INSIDE the existing dispatch step, or (b) give up on the constraint and let a bash driver wrap the loop.

### Constraints

- Must preserve every invariant in SKILL.md:46-52 (state ownership, reducer exclusivity, dispatch invariants, lifecycle routing).
- Must not introduce a parallel loop or custom bash driver.
- Must not force users into migration (default behavior stays identical).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add executor selection as a two-branch inside the existing `step_dispatch_iteration` YAML step.

**How it works**: The YAML evaluates `config.executor.kind` and dispatches either via the current `@deep-research`/`@deep-review` agent (native) or via `codex exec` (cli-codex). Both branches share a single pre_dispatch step (prompt-pack render) and a single post_dispatch_validate step (iteration file + JSONL delta invariants). The YAML still owns everything else.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Dispatch-branch in YAML** | Preserves all invariants; minimal surface; honors SKILL.md:61 intent verbatim | Two branches in YAML (modest complexity); variable substitution needed for CLI prompt | 9/10 |
| Custom bash loop wrapping codex exec | Easy to implement | Violates SKILL.md:47; loses state/convergence/lifecycle; loses audit trail; not recoverable | 2/10 |
| Extend `runtime_capabilities.json` to carry executor choice | Reuses existing config surface | Conflates WHERE agent lives (mirror path) with WHICH dispatch mechanism; hard to evolve separately | 5/10 |
| Separate `executor-config.json` top-level file | Cleanest separation | Adds a new file users/optimizer must track; increases surface area | 7/10 |

**Why this one**: Dispatch-branch is the only option that satisfies both the user's architectural principle (CLI inside YAML) and existing skill contracts. Alternative 2 fails spec; alternatives 3-4 work but are heavier.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Users can select cli-codex (and future CLIs) without bypassing the loop contract.
- Every iteration's executor is auditable via the JSONL audit field.
- Existing tests pass unchanged (native default preserves behavior).

**What it costs**:
- YAML dispatch step grows from ~30 lines to ~60 (modest). Mitigation: shared pre/post scaffolding keeps per-branch code small.
- Prompt-pack template must be explicit about context the agent implicitly had. Mitigation: integration test surfaces fidelity drift early.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Prompt-pack fidelity drift (agent-context vs CLI-prompt divergence) | M | Integration test with mocked codex exec; native-path regression asserts bit-identical |
| YAML complexity growth if more executors land | M | Branches follow same shape; patterns generalize cleanly |
| Breaking change risk if native default changes accidentally | H | Explicit test: `executor.kind=="native"` produces pre-feature byte-identical output |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User's explicit request + SKILL.md:61 unfinished design |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives evaluated; bash-driver rejected as invariant-breaking |
| 3 | **Sufficient?** | PASS | Single branch covers user's ask; stubs reserve future CLI kinds |
| 4 | **Fits Goal?** | PASS | Directly unblocks 30-iter cli-codex deep-research (Track 2) |
| 5 | **Open Horizons?** | PASS | Extension point for cli-copilot/gemini/claude-code reserved without further YAML changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `spec_kit_deep-research_auto.yaml:465-498` → two-branch dispatch
- `spec_kit_deep-research_confirm.yaml:527-560` → same mirror
- `spec_kit_deep-review_auto.yaml:575-608` → same mirror
- `spec_kit_deep-review_confirm.yaml` → same mirror
- New `mcp_server/lib/deep-loop/{executor-config,prompt-pack,post-dispatch-validate}.ts`
- New `prompt_pack_iteration.md.tmpl` under each skill's `assets/`

**How to roll back**: Single-commit revert of the atomic-ship PR restores the hardcoded `model: opus` dispatch. Config schema additions are additive (optional fields); `mcp_server/lib/deep-loop/` modules become dead code but don't affect runtime.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Config block (`executor.*`) in per-skill configs, not `runtime_capabilities.json`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Claude Opus (during plan drafting, ratified by user via plan approval) |

### Context

`runtime_capabilities.json` (both skills) already describes per-runtime agent mirror paths (opencode/claude/codex/gemini). An apparent fit would be: extend it to include executor dispatch options.

But runtime_capabilities describes WHERE the agent definition lives (for syncing across runtimes); executor config describes WHICH dispatch mechanism is selected at invocation time. These are orthogonal concerns.

### Decision

**We chose**: Add `executor` block to `deep_research_config.json` and `deep_review_config.json` (the per-skill runtime configs).

**How it works**: `executor.kind` defaults to `"native"`. When set via CLI flag or config-file edit, it overrides the default. `runtime_capabilities.json` stays focused on agent definition paths.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Per-skill config block** | Clear separation; config file is already the runtime-tunable surface | Two files to keep symmetric | 9/10 |
| Extend runtime_capabilities.json | Reuses existing structure | Conflates concerns; harder to evolve executor config independently | 5/10 |
| New top-level `executor.json` | Cleanest isolation | Adds a file; optimizer manifest must track it | 6/10 |

**Why this one**: Executor config is a RUNTIME SETTING (like `maxIterations`, `convergenceThreshold`) — belongs with other runtime settings. runtime_capabilities.json is a BUILD-TIME REGISTRY of where agent definitions mirror across runtimes; different lifecycle.

### Consequences

**What improves**: Config surface stays flat (one file per skill); optimizer manifest doesn't need tracking changes.

**What it costs**: Two files (research + review) to keep symmetric. Mitigation: unit test asserts bit-identical executor block structure.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Ship cli-codex, stub cli-copilot/gemini/claude-code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Claude Opus (scope decision) |

### Context

User asked for cli-codex with gpt-5.4 + reasoning-effort=high + service_tier=fast. Three other CLI skills exist (cli-copilot, cli-gemini, cli-claude-code). Tempting to wire all four for symmetry.

But each CLI has different invocation syntax, sandbox semantics, streaming support, and failure modes. Shipping all four at once multiplies test surface 4× and risks shipping poorly-tested variants.

### Decision

**We chose**: Ship cli-codex fully; reserve `cli-copilot`, `cli-gemini`, `cli-claude-code` in the kind enum but reject at config load with a clear message pointing to a future spec.

**How it works**: Zod schema accepts all four values structurally, but the loader throws `ExecutorNotWired` with a message like: *"cli-copilot is reserved but not wired; see spec 019-... when available"* when the user tries to select them. This reserves the namespace without committing to implementation.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Ship cli-codex only; stub others** | Focused scope; matches user's ask; future CLIs ship in dedicated packets | Three CLIs remain unsupported until separate work | 9/10 |
| Ship all four together | One PR covers everything | 4× test surface; higher regression risk; delays user's 30-iter research | 4/10 |
| Ship cli-codex; don't reserve enum values | Smallest surface | Forces schema change when adding each future CLI (breaking) | 6/10 |

**Why this one**: User's immediate ask is cli-codex; shipping that fast unblocks Track 2 (30-iter research). Reserving the enum keeps future additions non-breaking.

### Consequences

**What improves**: Fast time-to-first-research; clear spec boundary; future packets for cli-copilot/gemini/claude-code are non-breaking additions.

**What it costs**: Users who want other CLIs must wait for their respective packets. Mitigation: error message points to tracked future work.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Stdin piping for codex exec, not positional prompt

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | Claude Opus (after `codex exec --help` inspection) |

### Context

Initial plan proposed `codex exec --prompt-file /path/to/prompt.md`. But `codex exec --help` confirms: **no `--prompt-file` flag exists**. Prompts come from positional arg OR stdin (with `-` sentinel OR by omitting the positional). The plan needed correction before implementation.

### Constraints

- Prompt content is often > 4KB (iteration context). Passing as shell arg risks arg-length limits on some shells.
- Template content includes shell metacharacters (backticks in code blocks). Quoting into a positional arg is error-prone.

### Decision

**We chose**: Pipe the rendered prompt file via stdin using the `-` sentinel: `codex exec -m X -c ... --sandbox workspace-write - < /path/to/prompt.md`.

**How it works**: The YAML dispatcher renders `prompt_pack_iteration.md.tmpl` with variables to `{spec_folder}/research/prompts/iteration-NNN.md`, then invokes `codex exec` with stdin redirected from that file.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Stdin piping with `- < file`** | Explicit; codex-documented pattern; no arg-length concerns; no quoting risk | Requires shell-level redirect in YAML command | 9/10 |
| Positional prompt (`codex exec "$(cat file)"`) | Simpler-looking | Shell command substitution fragile; quoting breaks on template backticks; arg length limits | 4/10 |
| Omit positional, rely on piped stdin detection | Same robustness as `-` | Less explicit; codex docs recommend `-` as the canonical form for clarity | 7/10 |

**Why this one**: `-` is the explicit canonical form; unambiguous in logs; no shell-arg pitfalls.

### Consequences

**What improves**: Robust against large prompts, template metacharacters, and shell quirks.

**What it costs**: YAML command must include `<` redirect (a single extra character). Negligible.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Ship sk-deep-review symmetry in the SAME PR, not a follow-up

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-18 |
| **Deciders** | User (explicit preference — "both sk-deep-research AND sk-deep-review") |

### Context

Option existed to ship sk-deep-research first, then sk-deep-review in a follow-up PR. Smaller PR, faster to first use. But asymmetry creates the exact bug class Phase 017's Cluster D was built to prevent (code-graph sibling handler asymmetry — 6 handlers lacked contract vocabulary for months).

### Decision

**We chose**: Ship both skills' executor support in the same atomic PR.

**How it works**: All four YAMLs + both configs + both templates + both SKILL.md updates + both loop_protocol updates ship together. Tests cover both skills.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Co-ship both skills** | No asymmetry period; identical UX between skills; prevents Cluster-D-class bugs | Larger PR; more to review | 9/10 |
| Research first, review follow-up | Faster first ship | Creates asymmetry window; user-confusing UX if docs mention both but only one works | 4/10 |
| Research + review stub docs only, review impl later | Doc parity without full code parity | Docs lie; failing review smoke | 3/10 |

**Why this one**: User explicitly chose symmetric scope. Phase 017's Cluster D (R52-P1-001, 5 code-graph handlers lacking readiness vocabulary) was EXACTLY the bug class that asymmetric shipping creates.

### Consequences

**What improves**: Single atomic ship; no asymmetry; tests cover both skills at once.

**What it costs**: Larger PR (≈600-800 LOC estimate vs. ≈300-400 for single-skill). Mitigation: atomic-ship groups in tasks.md help reviewers see the structure.
<!-- /ANCHOR:adr-005 -->

---

<!--
Level 3 Decision Record — 5 ADRs covering major architectural choices.
Follows Phase 017 precedent of capturing scope-boundary, symmetry, and mechanism decisions.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
