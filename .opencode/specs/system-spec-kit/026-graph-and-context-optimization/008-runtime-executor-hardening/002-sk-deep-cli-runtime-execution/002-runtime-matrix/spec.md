---
title: "Feature Specification: CLI Runtime Matrix for Iterative Skills"
description: "Wire cli-copilot, cli-gemini, cli-claude-code as executors alongside the existing cli-codex in sk-deep-research + sk-deep-review. Document cross-CLI delegation. Per-kind flag-compatibility validation in executor-config.ts."
trigger_phrases: ["cli runtime matrix", "cli-copilot executor", "cli-gemini executor", "cli-claude-code executor", "cross-cli delegation"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix"
    last_updated_at: "2026-04-18T11:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Spec scaffolded following 018 pattern"
    next_safe_action: "Approve spec → begin Phase A (per-kind config validation)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: CLI Runtime Matrix for Iterative Skills

---

## EXECUTIVE SUMMARY

Phase 018 shipped executor selection with two kinds: `native` (default) and `cli-codex` (new). Three more kinds were reserved in the enum (`cli-copilot`, `cli-gemini`, `cli-claude-code`) but rejected at config load with `ExecutorNotWiredError`. This packet wires all three. Both iterative skills (sk-deep-research + sk-deep-review) gain support for four CLI executors plus native. Each CLI has a different invocation surface, so `executor-config.ts` grows per-kind flag-compatibility validation. Cross-CLI delegation is documented: any CLI executor CAN, in theory, invoke the other CLI skills from within its iteration via its shell/sandbox, with the anti-pattern being self-recursive invocation.

**Key Decisions**: Per-kind validation (not union-type) keeps the shared config block flat; stdin-or-positional prompt dispatch per CLI capability; documented cross-CLI delegation as a design intent, not a code path.

**Critical Dependencies**: All four CLI binaries on PATH for smoke tests (`codex`, `copilot`, `gemini`, `claude`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (user-requested expansion of Phase 018) |
| **Status** | Spec Ready |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` |
| **Immediate Predecessor** | `017-sk-deep-cli-runtime-execution/001-executor-feature/` (shipped 2026-04-18) |
| **Effort Estimate** | ~20h total at 1 engineer using cli-codex dogfooding pattern |
| **Phase Structure** | Flat. 5 phases: A config + validation → B YAML dispatch branches → C cross-CLI docs → D setup flags + tests → E changelogs + ship |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 018 explicitly scoped (ADR-003) executor selection to cli-codex only, reserving cli-copilot / cli-gemini / cli-claude-code in the enum but rejecting them at config load with a `ExecutorNotWiredError` pointing to a future spec. Users who want to run iterations through Copilot, Gemini, or Claude Code CLI currently cannot. Additionally, the question of whether a CLI executor can itself invoke other CLIs from within an iteration has not been documented — leading to the risk that users wire contradictory patterns (recursive invocation, missing auth propagation) by assumption.

### Purpose

Wire all three reserved CLI kinds so the executor matrix covers every standalone CLI the orchestration layer supports. Preserve every YAML-owned invariant from Phase 018 (state, convergence, lifecycle, reducer). Document cross-CLI delegation as a deliberate design intent with explicit anti-patterns so users know what they can and cannot compose.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Per-kind config validation in `executor-config.ts`: each kind declares which executor flags it supports and which it ignores. Schema rejects configs that set unsupported flags for a kind (e.g., `serviceTier` with `cli-gemini`).
- Three new YAML dispatch branches per YAML (`if_cli_copilot`, `if_cli_gemini`, `if_cli_claude_code`) across all 4 YAMLs (research auto + confirm, review auto + confirm).
- Canonical non-interactive invocation per CLI (see Per-CLI Matrix §12).
- Per-kind smoke tests (mocked exec).
- Cross-CLI delegation documentation in both SKILL.md files and both loop_protocol.md files.
- Updated setup flag parsing to accept the three new kinds.
- Symmetric ship across sk-deep-research + sk-deep-review.

### Out of Scope

- Parallel multi-CLI dispatch (e.g., 3-concurrent cli-copilot). Current skills are sequential; parallelization is a separate architectural concern.
- Cross-CLI auth mediation. Each CLI brings its own auth (OPENAI_API_KEY for codex, GitHub OAuth for copilot, Google creds for gemini, Anthropic API key for claude). Propagating or mediating these is user-responsibility, documented but not coded.
- Full cli-codex-dispatch.int.vitest.ts integration test from Phase 018's deferred list. Still deferred.
- Per-CLI prompt-pack variants. One template per skill serves all executors (the template is executor-agnostic by design from Phase 018).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | Modify | Remove ExecutorNotWiredError rejection for 3 kinds; add per-kind flag-compatibility validator |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` | Modify | Add cases for all 4 CLI kinds + compatibility rejections |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add 3 new executor branches |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Mirror auto |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add 3 new executor branches |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Mirror auto |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Update Executor Selection Contract table; add cross-CLI delegation section |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Same |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Update Executor Resolution subsection with 3 new kinds + delegation notes |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Same |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Flag parsing accepts 4 CLI kinds |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Same |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | Create | Per-CLI smoke tests (mocked exec) |
| sk-deep-research changelog v1.9.0.0 (under `.opencode/changelog/12--sk-deep-research/`) | Create | Changelog file for this release |
| sk-deep-review changelog v1.6.0.0 (under `.opencode/changelog/13--sk-deep-review/`) | Create | Changelog file for this release |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Config schema accepts all 4 CLI kinds as wired (no ExecutorNotWiredError for cli-copilot, cli-gemini, cli-claude-code) | Unit test: all 4 kinds parse successfully with their minimum-required fields |
| REQ-002 | Per-kind flag compatibility: each kind rejects config that sets unsupported flags | Unit test: `cli-gemini` with `serviceTier` set rejects; `cli-copilot` with CLI-level `reasoningEffort` rejects with pointer to config.json; `cli-claude-code` with `serviceTier` rejects |
| REQ-003 | Each CLI's dispatch branch invokes the CLI with its canonical non-interactive flags | Integration test (mocked exec): each branch produces the expected command line given a config |
| REQ-004 | Native-path regression unchanged | Existing 40 tests pass unchanged |
| REQ-005 | Symmetric across sk-deep-research + sk-deep-review | Both skills have identical branch structure for each CLI kind |
| REQ-006 | Post-dispatch validator works for all 4 CLI kinds | Invariant check (iteration file + JSONL delta + required fields) runs identically regardless of executor |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | cli-copilot handles prompt-as-positional (no stdin) | Dispatch escapes or references prompt file via `@path/to/prompt.md` syntax in a wrapper prompt |
| REQ-011 | cli-gemini model whitelist enforced | Config rejects unknown gemini model names at parse time |
| REQ-012 | cli-claude-code permission-mode defaults to `acceptEdits` (writes allowed, no approval prompts) | Documented in SKILL.md contract |
| REQ-013 | Cross-CLI delegation documented | Both SKILL.md files have a dedicated section naming what executors CAN invoke and the anti-pattern list |
| REQ-014 | Executor audit field records every non-native run | JSONL audit test covers all 4 CLI kinds |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Per-CLI timeout defaults per CLI's documented latency | timeoutSeconds default differs per kind (900 codex; 600 gemini/claude; 1200 copilot) |
| REQ-021 | `executor.configProfile` optional field for codex `-p` profile support | Deferred if not strictly needed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: User can invoke `/spec_kit:deep-research :auto "topic" --executor=cli-copilot --model=gpt-5.4` and iterations run via Copilot.
- **SC-002**: Same for `cli-gemini` (model `gemini-3.1-pro-preview`) and `cli-claude-code` (model `claude-opus-4-6`).
- **SC-003**: Default-path users see zero behavior change; existing 40 tests + new per-CLI tests all green.
- **SC-004**: `validate.sh` on 019 packet exits 0 errors (warnings acceptable per Phase 017 precedent).
- **SC-005**: Cross-CLI delegation section is discoverable in both SKILL.md files and cites the cli-* skills' documented patterns.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `copilot` on PATH | cli-copilot smoke fails | Document install in DEPLOYMENT.md |
| Dependency | `gemini` on PATH | cli-gemini smoke fails | Same |
| Dependency | `claude` CLI on PATH | cli-claude-code smoke fails | Same |
| Risk | cli-copilot prompt size limit with positional args | Arg-length limit breaks large prompts | Fallback: write prompt to tempfile, reference via `@path` in a wrapper prompt |
| Risk | cli-gemini only supports one model currently | User sets non-existent gemini model; invocation fails | Enforce model whitelist in Zod schema |
| Risk | cli-claude-code permission-mode confusion (plan vs acceptEdits) | Iteration cannot write files | Default to acceptEdits; document in contract |
| Risk | Cross-CLI delegation leads to runaway recursion | Infinite loops if one CLI invokes itself | Document anti-pattern; no code enforcement (out of scope) |
| Risk | Each CLI has different rate limits | Iterations stall mid-run | Surface CLI errors via existing stuck_recovery path |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-kind branch resolution adds < 50ms per iteration.
- **NFR-P02**: Config validation (per-kind flag check) completes in < 10ms.

### Security
- **NFR-S01**: Each CLI dispatch uses its most-restrictive permissive mode that still allows iteration file writes (`--sandbox workspace-write` for codex/gemini; `--allow-all-tools` for copilot; `--permission-mode acceptEdits` for claude-code).
- **NFR-S02**: No cross-CLI auth mediation: each CLI uses its own environment-provided credentials.

### Reliability
- **NFR-R01**: Native-path zero regression: 100% of existing iteration tests pass unchanged.

---

## 8. EDGE CASES

- User selects `cli-gemini` with a model not in the whitelist → config rejects with model-list error.
- User selects `cli-copilot` with `reasoningEffort: "high"` → config rejects with message pointing to `~/.copilot/config.json`.
- User sets `serviceTier: "fast"` with any of `cli-copilot`, `cli-gemini`, `cli-claude-code` → config rejects (not supported by that CLI).
- Prompt size exceeds `ARG_MAX` for cli-copilot → dispatch uses tempfile + `@path` reference.
- CLI binary missing from PATH → dispatch fails cleanly; `post_dispatch_validate` catches missing iteration file; stuck_recovery after 3 consecutive.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~15, LOC: ~400-500, Systems: 4 CLI runtimes |
| Risk | 10/25 | Each CLI has distinct invocation semantics; per-CLI validation needed |
| Research | 8/20 | Done (Explore agents resolved each CLI's canonical invocation) |
| Multi-Agent | 2/15 | Sequential feature build |
| Coordination | 6/15 | Both skills must mirror; 4 YAMLs total |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | cli-copilot arg-length overflow on large prompts | M | L | Tempfile + `@path` reference fallback |
| R-002 | cli-gemini model string drift (Google renames) | L | M | Enum validator catches drift; update spec |
| R-003 | cli-claude-code permission-mode wrong default blocks writes | H | L | Default acceptEdits, document explicitly |
| R-004 | Per-kind validation rejects legitimate future config fields | M | L | Validation is additive; new fields ignored unless whitelisted |

---

## 11. USER STORIES

### US-001: Run research via cli-copilot (Priority: P0)

**As a** researcher with GitHub Copilot Pro+, **I want** to pick `cli-copilot` as my executor, **so that** I can use Copilot's GPT-5.4 model at the rate-limit tier my subscription provides.

**Acceptance Criteria**:
1. Given `copilot` is on PATH and authenticated, When I invoke `/spec_kit:deep-research :auto "topic" --executor=cli-copilot --model=gpt-5.4 --max-iterations=10`, Then 10 iterations run via `copilot -p ... --model gpt-5.4 --allow-all-tools --no-ask-user`.
2. Given the same invocation but adding `--service-tier=fast`, When the config loads, Then it rejects with a message explaining copilot has no service-tier flag.

### US-002: Run review via cli-gemini (Priority: P0)

**As a** reviewer wanting a second perspective via Google Gemini, **I want** to pick `cli-gemini` as my executor, **so that** my review iteration runs on Gemini with JSON output capture.

**Acceptance Criteria**:
1. Given `gemini` is on PATH, When I invoke `/spec_kit:deep-review :auto "target" --executor=cli-gemini --model=gemini-3.1-pro-preview`, Then iterations run via `gemini "..." -m gemini-3.1-pro-preview -y -o json`.
2. Given a model string like `gemini-ultra-foo`, Then config rejects with a list of supported gemini models.

### US-003: Run research via cli-claude-code (Priority: P0)

**As a** researcher who prefers Claude Code CLI's permission model, **I want** to pick `cli-claude-code` as my executor, **so that** iterations run with Claude Code's `acceptEdits` permission mode.

**Acceptance Criteria**:
1. Given `claude` is on PATH, When I invoke `/spec_kit:deep-research :auto "topic" --executor=cli-claude-code --model=claude-opus-4-6 --reasoning-effort=high`, Then iterations run via `claude -p ... --model claude-opus-4-6 --effort high --permission-mode acceptEdits --output-format text`.

### US-004: Discover cross-CLI delegation (Priority: P1)

**As a** user curious whether my cli-codex iteration can itself call gemini for a sub-task, **I want** SKILL.md to document what's possible and what's forbidden, **so that** I don't wire a recursive anti-pattern by accident.

**Acceptance Criteria**:
1. Given I read `.opencode/skill/sk-deep-research/SKILL.md`, Then I find a dedicated Cross-CLI Delegation section that states: (a) each CLI's iteration can invoke other CLIs via its shell; (b) self-recursive invocation is forbidden; (c) auth/env propagation is user-responsibility.

---

## 12. PER-CLI INVOCATION MATRIX

Canonical non-interactive commands derived from each CLI skill's SKILL.md (researched via Explore agents prior to this spec):

| CLI | Command Shape | Prompt Input | Model Flag | Reasoning/Thinking | Service Tier | Sandbox / Perms | Notes |
|-----|---------------|--------------|------------|-------------------|--------------|-----------------|-------|
| **cli-codex** (shipped in 018) | `codex exec [flags] - < prompt.md` | stdin via `-` sentinel | `--model X` | `-c model_reasoning_effort=Y` | `-c service_tier=Z` | `--sandbox workspace-write` | Fully flag-driven |
| **cli-copilot** | `copilot -p "PROMPT" [flags]` | **positional only** via `-p` | `--model X` | NONE (config.json only) | NONE | `--allow-all-tools --no-ask-user` | Large prompts need tempfile + `@path` reference |
| **cli-gemini** | `gemini "PROMPT" [flags]` | positional OR stdin | `-m X` | NONE | NONE | `-s none -y` | Model whitelist: `gemini-3.1-pro-preview` |
| **cli-claude-code** | `claude -p "PROMPT" [flags]` | positional via `-p` | `--model X` | `--effort high` | NONE | `--permission-mode acceptEdits` | Default `plan` is read-only; must override to write |

---

## 13. CROSS-CLI DELEGATION (DESIGN INTENT)

When a CLI executor runs an iteration, it operates inside its own sandbox/permissions. In theory, the iteration CAN shell out to other CLIs:

- **Possible**: cli-codex iteration invokes `gemini "..." -y` via bash (codex's `workspace-write` sandbox permits shell).
- **Possible**: cli-gemini iteration invokes `codex exec ...` via a shell step.
- **Possible**: cli-claude-code iteration (with `acceptEdits` permission mode) invokes other CLIs.
- **Possible**: cli-copilot iteration (with `--allow-all-tools`) invokes other CLIs.

**Anti-patterns** (each CLI's own SKILL.md warns):
- **Self-recursion**: do not invoke `codex` from within a codex-CLI session. Similarly forbidden for the other three. Circular.
- **Auth propagation assumptions**: do not assume the parent CLI's env has credentials for child CLIs. Each CLI brings its own auth.

**Documented in**: both SKILL.md files' Executor Selection Contract sections get a Cross-CLI Delegation subsection.

**Not coded**: no runtime detection or blocking of recursion. This is design intent documented in prose.

---

<!-- ANCHOR:questions -->
## 14. OPEN QUESTIONS

- **Q-001**: Should per-kind validation log warnings (lenient) or reject (strict) when a user sets a flag that the chosen kind ignores? Current plan: reject (strict) — users get clear errors rather than silent no-ops.
- **Q-002**: Should `cli-gemini` accept future model IDs via an "unknown but not-yet-whitelisted" bypass flag? Current plan: strict enum; users file an update when Google ships new models.
- **Q-003**: Should cross-CLI delegation be enforced (e.g., detect self-recursion at dispatch time) or purely documented? Current plan: documented only; runtime enforcement is a separate, harder feature.
- **Q-004**: Does cli-copilot's max-5-concurrency apply when used as a deep-loop executor? Current plan: yes, but sequential dispatch means we're well under the cap — document only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Immediate Predecessor**: `../001-executor-feature/implementation-summary.md`
- **Per-CLI References**: `.opencode/skill/cli-codex/SKILL.md`, `.opencode/skill/cli-copilot/SKILL.md`, `.opencode/skill/cli-gemini/SKILL.md`, `.opencode/skill/cli-claude-code/SKILL.md`
