---
title: "Feature Specification: Deep-Loop CLI Executor Selection for Iterative Skills"
description: "Executor-selection for sk-deep-research + sk-deep-review honoring YAML-owned dispatch. Adds native (default) and cli-codex (gpt-5.4 + reasoning-effort + service-tier). Preserves state, convergence, dispatch invariants. Symmetric across both iterative skills."
trigger_phrases: ["cli executor selection", "deep-loop cli executor", "sk-deep-research executor", "sk-deep-review executor", "cli-codex deep research", "executor kind config"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Spec folder scaffolded from approved plan"
    next_safe_action: "Approve spec → begin Phase A (config schema additions)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Deep-Loop CLI Executor Selection for Iterative Skills

---

## EXECUTIVE SUMMARY

`sk-deep-research` and `sk-deep-review` hardcode `model: opus` at iteration dispatch and forbid in-loop CLI invocation (SKILL.md:46-50), leaving the forward-looking executor-CLI note (SKILL.md:61) as unimplemented design intent. This packet ships executor selection as a branch INSIDE the YAML dispatch step, covering `native` (preserves current behavior) and `cli-codex` (new: `codex exec` with configurable model + reasoning effort + service tier). YAML continues to own state, convergence, lifecycle, and the reducer — the CLI is a tool inside the workflow, not a replacement.

**Key Decisions**: Dual-branch dispatch in YAML (not a new loop engine); symmetric implementation across both iterative skills; stdin-piped prompt to `codex exec` (no `--prompt-file` flag exists).

**Critical Dependencies**: `codex` CLI on PATH; installed version must support `-c config.key=value`, `--sandbox workspace-write`, `-m model`, and stdin-piped prompt with `-` sentinel (verified via `codex exec --help`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (user-requested feature blocking a 30-iteration cli-codex research pass) |
| **Status** | Spec Ready, Plan Approved (plan file: `/Users/michelkerkmeester/.claude/plans/research-and-refinements-improvements-cheerful-scott.md`) |
| **Created** | 2026-04-18 |
| **Branch** | `main` (no dedicated branch; per Phase 017 convention, commit prefixes mark track) |
| **Parent Packet** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` |
| **Immediate Predecessor** | `017-review-findings-remediation/` (shipped v3.4.0.2 2026-04-17) |
| **Effort Estimate** | ~35h total / ~25h critical-path / 3-4 working days at 1 engineer |
| **Phase Structure** | Flat (no sub-waves). 5 phases: A config schema → B prompt-pack template → C research YAML → D review YAML → E setup flags → F docs → G tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Both iterative skills (`sk-deep-research`, `sk-deep-review`) statically dispatch `@deep-research` / `@deep-review` LEAF agents with `model: opus` hardcoded in their YAML workflows (`spec_kit_deep-research_auto.yaml:469`, `spec_kit_deep-review_auto.yaml:578`). SKILL.md explicitly forbids direct CLI-in-a-loop (line 47-50 in both skills) to protect the state machine, convergence detector, and reducer. However, SKILL.md:61 (deep-research) / :63 (deep-review) acknowledges executor selection as forward-looking design — *"the executor still runs INSIDE the command's workflow"* — without wiring the mechanism.

Users who want `cli-codex` (or other CLIs) for reasons like cost, model choice (gpt-5.4), or latency (service_tier=fast) cannot route through the supported command surface. Bypassing via custom bash dispatchers violates SKILL.md:47 and loses audit trail, convergence detection, lifecycle events, and dispatch invariants.

### Purpose

Implement executor selection AS A BRANCH inside the YAML dispatch step, preserving every skill-owned invariant. Two executor kinds ship:
- `native` — current behavior (dispatches `@deep-research`/`@deep-review` agent via Task, model: opus). DEFAULT.
- `cli-codex` — invokes `codex exec` with the iteration prompt piped via stdin (`-` sentinel), honoring `--model`, `-c model_reasoning_effort=...`, `-c service_tier=...`, `--sandbox workspace-write`.

Extension-point stubs for `cli-copilot`, `cli-gemini`, `cli-claude-code` are reserved in the enum and rejected at config load until wired.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Config schema additions to both `deep_research_config.json` and `deep_review_config.json` (new `executor` block).
- YAML dispatch-step branch in both auto+confirm YAMLs for both skills (4 YAMLs total).
- Executor-agnostic prompt-pack templates (2 files: one per skill).
- Setup-phase flag parsing in both command docs (`.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`).
- Skill documentation updates: `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-review/SKILL.md`, plus the two loop-protocol references at `.opencode/skill/sk-deep-research/references/loop_protocol.md` and `.opencode/skill/sk-deep-review/references/loop_protocol.md`.
- JSONL iteration records gain an optional `executor: {kind, model, reasoningEffort, serviceTier}` audit field.
- Unit + integration test suites.

### Out of Scope

- `cli-copilot`, `cli-gemini`, `cli-claude-code` wiring — these are stubbed in the enum but rejected at config load. Separate specs will implement each. Rationale: user's immediate ask is cli-codex; scope creep risks shipping poorly-tested variants of less-critical CLIs.
- Parallel executor dispatches (e.g., 3-concurrent cli-copilot per `feedback_copilot_concurrency_override`) — current skills dispatch sequentially; parallelization is a separate architectural concern.
- `reduce-state.cjs` schema changes — executor field is passthrough; reducer reads the existing `newInfoRatio`/`status`/`focus` fields unchanged.
- Prompt optimization / prompt-pack variants per executor — single canonical template per skill. Executor-specific prompt tuning is Phase 4b of optimizer work (deferred per command doc §15).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add `executor` block (kind/model/reasoningEffort/serviceTier/sandboxMode/timeoutSeconds) |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Same schema addition |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Refactor lines 465-498 (`step_dispatch_iteration`) into two-branch dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Mirror auto: lines 527-560 |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Mirror: lines 575-608 dispatch block |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Mirror review confirm dispatch step |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Setup phase: add flag parsing for --executor, --model, --reasoning-effort, --service-tier, --executor-timeout |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Same flag parsing addition |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Replace line 61 forward-looking note with CONTRACT section |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Same at line 63 |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | §3 add Executor Resolution subsection |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Same |
| `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl` | Create | Executor-agnostic iteration prompt template |
| `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` | Create | Same, review-flavored |
| `mcp_server/lib/deep-loop/executor-config.ts` | Create | Config loader + validator (shared between both skills) |
| `mcp_server/lib/deep-loop/prompt-pack.ts` | Create | Template renderer (variable substitution) |
| `mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Create | Iteration-file + JSONL-delta invariant checker |
| `__tests__/deep-loop/executor-config.vitest.ts` | Create | Config validation tests |
| `__tests__/deep-loop/prompt-pack-render.vitest.ts` | Create | Template rendering tests |
| `__tests__/deep-loop/dispatch-branch.vitest.ts` | Create | YAML branch resolution tests |
| `__tests__/deep-loop/jsonl-audit-field.vitest.ts` | Create | Audit field tests |
| `__tests__/deep-loop/cli-codex-dispatch.int.vitest.ts` | Create | End-to-end integration test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Config schema accepts `executor` block with valid `kind` values | Unit test: `executor.kind=="native"` or `"cli-codex"` passes validator; `"cli-copilot"`/`"cli-gemini"`/`"cli-claude-code"` parse but reject with clear error pointing to future spec |
| REQ-002 | Native-path regression: no behavior change when `executor.kind=="native"` (default) | Integration test: 1-iter run with no executor flags produces bit-identical iteration file + JSONL delta vs. pre-feature baseline |
| REQ-003 | cli-codex path successfully dispatches iteration | Integration test: 1-iter run with `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast` (codex mocked) produces valid iteration-001.md + JSONL delta |
| REQ-004 | JSONL audit field present on every iteration when non-native executor used | Integration test: iteration records include `executor: {kind, model, reasoningEffort, serviceTier}` in both research and review paths |
| REQ-005 | Post-dispatch validator catches missing iteration file or JSONL delta | Unit test: validator emits `schema_mismatch` event when iteration file missing OR JSONL delta lacks `newInfoRatio`/`status`/`focus` |
| REQ-006 | Symmetric implementation across sk-deep-research and sk-deep-review | Both skills' dispatch YAMLs have identical branch structure; both SKILL.md contract sections parallel |
| REQ-007 | cli-codex invocation uses stdin piping (no `--prompt-file` flag) | YAML emits: `codex exec --model X -c ... --sandbox workspace-write - < {prompt-path}` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Prompt-pack template is executor-agnostic and renders cleanly for both agent and CLI paths | Unit test: same template renders identically when consumed by `@deep-research` agent context OR `codex exec` stdin |
| REQ-011 | Setup-phase flag parsing: CLI flags override config-file values override defaults | Unit test: three-tier precedence validated |
| REQ-012 | Both skill contract sections document supported kinds, invariants, failure modes, audit field, template path | DQI score ≥ 0.85 (per `validate_document.py`) on both `.opencode/skill/sk-deep-research/SKILL.md` and `.opencode/skill/sk-deep-review/SKILL.md` |
| REQ-013 | Loop-protocol §3 adds Executor Resolution subsection with `schema_mismatch` interaction documented | Manual review: subsection references existing stuck_recovery path in `.opencode/skill/sk-deep-research/references/loop_protocol.md` |
| REQ-014 | Dispatch invariants preserved: iteration-NNN.md + JSONL delta both required regardless of executor | Integration test: forced missing-file OR missing-JSONL → `schema_mismatch` emission |
| REQ-015 | Config validator rejects `cli-codex` without `model` set (required field when kind==cli-codex) | Unit test |
| REQ-016 | Three consecutive executor failures trigger stuck_recovery (existing path) | Integration test with mocked codex exec failure |

### P2 - Optional (documented deferral acceptable)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Dashboard shows executor kind per iteration | Dashboard markdown includes executor column |
| REQ-021 | Configurable retry count for transient codex exec failures | Defaults to 1 retry; exposed as `executor.retryOnTransient` |
| REQ-022 | Prompt-pack template validates required variables are bound before rendering | Unit test catches unbound variable; runtime emits clear error |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: User can invoke `/spec_kit:deep-research :auto "topic" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --max-iterations=30` and get 30 iterations executed via `codex exec` with the YAML workflow owning state, convergence, and lifecycle events.
- **SC-002**: Same invocation pattern works for `/spec_kit:deep-review :auto` (symmetric).
- **SC-003**: Default-path users (no `--executor` flag) see zero behavior change; existing tests pass unchanged.
- **SC-004**: JSONL state log for any cli-codex run shows `executor` audit field on every iteration record; dashboard displays executor kind.
- **SC-005**: Post-implementation: `validate.sh --strict` exits 0 on the 018 packet; `tsc --noEmit` clean; all vitest suites green.
- **SC-006**: Track 2 deep-research pass (30 iters, Phase 017 refinements topic, cli-codex) successfully converges or exhausts max-iterations with `answered_ratio > 0.7`, producing a Phase-019 scoping synthesis.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `codex` CLI on PATH | cli-codex path fails at dispatch | Pre-flight check in Phase E setup; Phase 017's DEPLOYMENT.md already documents codex CLI as a runtime dep |
| Dependency | `codex exec --help` flag stability | Future codex versions may deprecate stdin-piping | Pin version in DEPLOYMENT.md; post_dispatch_validate catches unexpected failures |
| Risk | Prompt-pack fidelity drift | agent-context vs. CLI-prompt behavioral divergence | Same template consumed by both paths; regression test ensures bit-for-bit iteration-file parity for native path |
| Risk | gpt-5.4 + reasoning=high + tier=fast unavailability | CLI returns error mid-run | Surface error via existing stuck_recovery; don't silent-fallback to different model |
| Risk | Sandbox permissions blocking file writes | iteration-NNN.md or JSONL delta not written | Explicit `--sandbox workspace-write`; post_dispatch_validate catches missing outputs |
| Risk | JSONL delta schema drift from codex exec output | reducer rejects delta | post_dispatch_validate asserts required fields BEFORE reducer sees them |
| Dependency | Phase 017 `feedback_codex_cli_fast_mode` memory rule | Service tier must be explicit | Honored: --service-tier=fast → `-c service_tier="fast"` in YAML |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Post-dispatch validation adds < 200ms per iteration.
- **NFR-P02**: Prompt-pack template rendering < 50ms (text substitution only, no network).

### Security
- **NFR-S01**: codex exec runs in `--sandbox workspace-write` (not `danger-full-access`). Iteration output paths are bounded to `{spec_folder}/research/iterations/` or `{spec_folder}/review/iterations/`.
- **NFR-S02**: No secrets embedded in prompt-pack template. User-supplied research topics are treated as opaque strings (no interpolation into shell commands other than via file contents).

### Reliability
- **NFR-R01**: Native-path zero-regression: 100% of existing iteration tests pass unchanged with default config.
- **NFR-R02**: cli-codex dispatch succeeds on first attempt ≥ 95% of the time under normal load (subject to codex API availability).

---

## 8. EDGE CASES

### Data Boundaries
- Empty topic: rejected at setup phase (existing behavior).
- Topic with shell-metacharacters: safe — topic is written into prompt-pack markdown file, not into the shell command.
- Extremely long topic (> 4KB): passes through to prompt file; codex exec stdin accepts multi-MB prompts.

### Error Scenarios
- `codex` CLI missing from PATH: post_dispatch_validate fails on first iteration; YAML emits `executor_unavailable` conflict event; loop halts with clear error (not stuck_recovery — this is unrecoverable without user fix).
- `codex exec` exits non-zero: retry once (REQ-021); then emit `schema_mismatch` via existing path; stuck_recovery after 3 consecutive.
- `codex exec` succeeds but writes no iteration file: post_dispatch_validate catches missing file → `schema_mismatch`.
- `codex exec` writes iteration file but no JSONL delta: post_dispatch_validate catches missing delta → `schema_mismatch`.
- JSONL delta missing required fields (`newInfoRatio`, `status`, `focus`): `schema_mismatch` + warn (reducer's existing `malformed_delta` path handles gracefully).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~22, LOC: ~600-800, Systems: 2 skills + 4 YAMLs + command docs |
| Risk | 14/25 | Auth: N, API: N (internal CLI), Breaking: Conditional (native default preserved) |
| Research | 6/20 | Investigation: moderate (codex CLI flag verification, prompt-pack fidelity) |
| Multi-Agent | 3/15 | Workstreams: sequential feature build, not parallel |
| Coordination | 8/15 | Dependencies: sk-deep-research + sk-deep-review must mirror |
| **Total** | **49/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | codex exec stdin piping mechanism varies across codex versions | H | L | Integration test with mocked codex; documented pinned version |
| R-002 | Prompt-pack template misses context the agent implicitly had | M | M | First cli-codex iteration smoke test surfaces gaps; template iterates in Phase B |
| R-003 | sk-deep-review symmetry drift (research ships first, review lags) | H | L | Atomic-ship gate: both skills' YAML+config+template ship in same PR |
| R-004 | Hardcoded `model: opus` leak: a code path bypasses executor resolution | H | L | YAML refactor fully replaces the hardcoded line; grep pre-commit blocks re-introduction |
| R-005 | JSONL audit field breaks existing dashboard/renderer code | M | L | Audit field is optional; existing consumers ignore unknown fields |
| R-006 | Phase 017's 16-folder sweep invariant broken if dispatch touches metadata | L | L | No spec-folder metadata mutation in dispatch step; executor only writes to iterations/ + JSONL |

---

## 11. USER STORIES

### US-001: Run deep-research via cli-codex gpt-5.4 high fast (Priority: P0)

**As a** researcher invoking `/spec_kit:deep-research :auto`, **I want** to specify cli-codex with gpt-5.4 + reasoning-effort=high + service_tier=fast as the executor, **so that** I can leverage Codex's model for a 30-iteration pass without bypassing the YAML-owned loop contract.

**Acceptance Criteria**:
1. Given `codex` CLI is on PATH and configured, When I invoke `/spec_kit:deep-research :auto "topic" --max-iterations=30 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast`, Then 30 iterations execute via `codex exec`, YAML owns state/convergence/lifecycle, and artifacts land at `{spec_folder}/research/`.
2. Given the same invocation, When I inspect `deep-research-state.jsonl`, Then every iteration record has an `executor` audit field with all four values.

### US-002: Run deep-review via cli-codex with identical UX (Priority: P0)

**As a** reviewer invoking `/spec_kit:deep-review :auto`, **I want** the same flag set to work symmetrically, **so that** I don't have to learn two different executor configurations.

**Acceptance Criteria**:
1. Given `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast` is valid for deep-research, When I use the same flags on `/spec_kit:deep-review :auto`, Then review iterations execute via cli-codex with the review-flavored prompt pack.

### US-003: Default-path users see zero change (Priority: P0)

**As a** user who hasn't opted into cli-codex, **I want** my existing `/spec_kit:deep-research :auto "topic"` invocation to work identically to before, **so that** this feature doesn't force migration.

**Acceptance Criteria**:
1. Given no `--executor` flag and no `executor` block in config, When I invoke the command as before, Then iterations dispatch via `@deep-research` agent with `model: opus` identically to pre-feature behavior.

### US-004: Diagnose a failed cli-codex iteration (Priority: P1)

**As a** user whose cli-codex iteration failed mid-run, **I want** clear error surfacing and automatic stuck_recovery, **so that** the loop doesn't hang or silently skip iterations.

**Acceptance Criteria**:
1. Given codex exec returns non-zero OR writes no outputs, When post_dispatch_validate inspects the iteration, Then a `schema_mismatch` event is emitted, one retry is attempted, and 3 consecutive failures trigger stuck_recovery with diagnostic context.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q-001**: Does codex exec invoke with `- < file` vs. omitted prompt + stdin redirect produce identical behavior? (spot-check during Phase C implementation; settle on whichever form is documented in codex CLI docs)
- **Q-002**: Should the prompt-pack template be shared between sk-deep-research and sk-deep-review (one template) or per-skill (two templates)? Current plan: per-skill, to accommodate dimension-review-specific content in sk-deep-review. Revisit if content converges.
- **Q-003**: If codex exec is invoked from a process whose cwd is NOT the repo root, do relative paths in the prompt resolve correctly? (Mitigation: dispatcher pwd-s to repo root before invoking; verify in integration test.)
- **Q-004**: Can we expose `executor.configProfile` (`-p, --profile <CONFIG_PROFILE>`) as an override for users with named codex profiles? Deferred to P2 REQ-021 extension.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Approved Plan (session-local)**: `/Users/michelkerkmeester/.claude/plans/research-and-refinements-improvements-cheerful-scott.md`
- **Immediate Predecessor**: `../017-review-findings-remediation/implementation-summary.md`
- **Skill Contracts**: `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-review/SKILL.md`
</content>
</invoke>