---
title: "Claude Code CLI Orchestrator: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the cli-claude-code cross-AI delegation skill."
---

# Claude Code CLI Orchestrator: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real - not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual `claude` commands, inspect real outputs and verify real behavior. The only acceptable classifications are PASS, FAIL or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `cli-claude-code` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide while the per-feature files carry the scenario-specific execution truth for cross-AI delegation to Anthropic's Claude Code CLI.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-claude-code` skill. The root document acts as the directory, review surface and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--cli-invocation/`
- `02--permission-modes/`
- `03--reasoning-and-models/`
- `04--agent-routing/`
- `05--session-continuity/`
- `06--integration-patterns/`
- `07--prompt-templates/`
- `08--cost-and-background/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CLI INVOCATION](#7--cli-invocation)
- [8. PERMISSION MODES](#8--permission-modes)
- [9. REASONING AND MODELS](#9--reasoning-and-models)
- [10. AGENT ROUTING](#10--agent-routing)
- [11. SESSION CONTINUITY](#11--session-continuity)
- [12. INTEGRATION PATTERNS](#12--integration-patterns)
- [13. PROMPT TEMPLATES](#13--prompt-templates)
- [14. COST AND BACKGROUND](#14--cost-and-background)
- [15. AUTOMATED TEST CROSS-REFERENCE](#15--automated-test-cross-reference)
- [16. FEATURE FILE INDEX](#16--feature-file-index)

---

## 1. OVERVIEW

This playbook provides 27 deterministic scenarios across 8 categories validating the `cli-claude-code` cross-AI delegation skill. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals and feature-file reference.

Coverage note (2026-04-26): all categories validate the orchestrator-led cross-AI delegation contract where an external AI (Gemini, Codex, Copilot, OpenCode) acts as conductor and dispatches the `claude` binary for supplementary tasks. Scenarios CC-006 (acceptEdits permission mode) and CC-007 (bypassPermissions) are destructive and MUST run only against rebuildable, non-production scratch files.

### Realistic Test Model

1. A realistic user request is given to an external-AI orchestrator (NOT Claude Code itself - this skill is cross-AI only).
2. The orchestrator decides whether to delegate to `claude -p`, choose a model tier, route to a Claude Code agent via `--agent` or escalate prompt construction to `@improve-prompt`.
3. The operator captures both the dispatch command and the user-visible Claude Code output.
4. The scenario passes only when the workflow is sound, the self-invocation guard fires when relevant and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic external-AI user request that should trigger the cross-AI delegation
- The orchestrator brief or prompt that should drive the `claude` dispatch
- The expected execution process, including `--model`, `--permission-mode`, `--agent` and `--output-format` selection
- The desired user-visible outcome
- The implementation or reference anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root.
2. Claude Code CLI is installed and resolvable via `command -v claude`. If absent, install with `npm install -g @anthropic-ai/claude-code`.
3. `ANTHROPIC_API_KEY` is set in the environment OR `claude auth status` reports an authenticated session.
4. The orchestrator runtime is NOT Claude Code itself - the `CLAUDECODE` environment variable MUST be unset (verify with `[ -z "$CLAUDECODE" ] && echo OK`). Cross-AI scenarios cannot run inside a nested Claude Code session.
5. Destructive scenarios CC-006 (acceptEdits) and CC-007 (bypassPermissions) MUST only target a rebuildable scratch file under `/tmp/cli-claude-code-playbook/`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript including the full `claude -p ...` invocation
- User request used (the natural-language input to the external-AI orchestrator)
- Orchestrator or agent-facing prompt used (the exact `-p "..."` payload)
- Delegation or runtime-routing notes (model chosen, permission mode, agent selected, framework tag)
- Output snippets including any session_id surfaced in JSON output
- Final user-facing response or outcome summary
- Artifact path or output reference (for example `/tmp/claude-output.txt` or `/tmp/security-audit.json`)
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `claude -p "<prompt>" [flags]` (the canonical non-interactive invocation).
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>` when an external-AI agent is the conductor.
- `->` separates sequential steps.
- All `claude` invocations MUST end with `2>&1` to capture stderr alongside stdout.
- File references use `@./path/to/file` notation inside prompts.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence including command transcripts and Claude Code output
4. Feature-to-scenario coverage map (every CC-NNN appears in section 15)
5. Triage notes for all non-pass outcomes including rate-limit, budget-cap and authentication failures

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (especially `CLAUDECODE` unset and `ANTHROPIC_API_KEY` resolvable).
2. Prompt and command sequence were executed as written, with the documented model and flags.
3. Expected signals are present in the captured `claude` output.
4. Evidence is complete and readable, including stderr captured via `2>&1`.
5. Outcome rationale is explicit and references the user-visible deliverable.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, self-invocation guard tripped when it should not have or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (CC-001 base invocation, CC-005 plan permission mode or any CC-011..014 agent dispatch) forces feature verdict to `FAIL` and blocks release.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES == 27`).
4. No unresolved blocking triage item remains.
5. Self-invocation guard has been tested at least once and refused correctly.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats (model availability, agent definition presence, schema constraints) in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself. Because every scenario dispatches the same `claude` binary through the same external-AI orchestrator, wave planning focuses on cost, rate-limit and destructive-isolation concerns rather than runtime concurrency.

### Operational Rules

1. Probe runtime capacity at start - confirm Claude Code CLI version, model availability and budget headroom.
2. Reserve one external-AI conductor (Gemini, Codex, Copilot or OpenCode) - never use Claude Code itself as the conductor.
3. Saturate remaining worker slots only when scenarios are non-destructive AND independent.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenarios (CC-006 acceptEdits, CC-007 bypassPermissions) in a dedicated sandbox-only wave with isolated `/tmp/cli-claude-code-playbook/` scratch directory.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references and evidence paths in the final report.

### Recommended Wave Plan

- **Wave 1** (parallel-safe, read-only): CC-001..CC-005, CC-008..CC-016, CC-018..CC-020 - all use `--permission-mode plan` or are inherently read-only.
- **Wave 2** (sandboxed destructive): CC-006 (acceptEdits) and CC-007 (bypassPermissions) against `/tmp/cli-claude-code-playbook/scratch.ts`.
- **Wave 3** (cost-sensitive): CC-008 (Opus extended thinking) and CC-017 (generate-review-fix cycle requiring multi-call cumulative cost). Apply `--max-budget-usd 1.00` to every scenario in this wave.

### What Belongs In Per-Feature Files

- Real user request (the natural-language input to the external-AI conductor)
- Prompt field following the Role -> Context -> Action -> Format contract
- Expected delegation routing including model tier, permission mode, agent name and framework tag
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints (especially destructive scenarios)

---

## 7. CLI INVOCATION

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CC-001 | Base non-interactive invocation

#### Description

Verify the `claude -p "<prompt>" --output-format text 2>&1` baseline returns a coherent text response and exits cleanly.

#### Scenario Contract

Prompt summary: As an external-AI conductor delegating a quick code-explanation task to Claude Code CLI, dispatch a single non-interactive `claude -p` call against a small TypeScript snippet. Verify the binary returns plain-text output and exits 0. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Command exits 0. Stdout contains a coherent natural-language explanation of the snippet. Stderr is empty or contains only warnings. Total runtime under 60 seconds for a simple prompt.

#### Test Execution

> **Feature File:** [CC-001](01--cli-invocation/001-base-non-interactive-invocation.md)

### CC-002 | Default model selection (Sonnet)

#### Description

Verify that omitting `--model` defaults to Sonnet (`claude-sonnet-4-6`) and an explicit `--model claude-sonnet-4-6` produces equivalent behavior.

#### Scenario Contract

Prompt summary: As an external-AI conductor needing a balanced general-purpose dispatch, run two parallel `claude -p` invocations - one without `--model`, one with `--model claude-sonnet-4-6` - and confirm both produce equivalently-shaped responses for a standard refactor question. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Both invocations exit 0. Both responses describe the same refactor approach with comparable depth. JSON output (when requested) reports `claude-sonnet-4-6` as the model. Cost metadata is in the same order of magnitude.

#### Test Execution

> **Feature File:** [CC-002](01--cli-invocation/002-default-model-selection-sonnet.md)

### CC-003 | Output format text vs json

#### Description

Verify that `--output-format text` returns plain stdout while `--output-format json` returns a JSON envelope containing `result`, `cost`, `duration` and `session_id` fields.

#### Scenario Contract

Prompt summary: As an external-AI conductor needing both a human-readable answer and machine-parseable metadata for the same prompt, run the same `claude -p` request twice with `--output-format text` and `--output-format json`. Verify the text output is plain prose and the JSON output is parseable with `jq` and includes the expected metadata keys. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1 returns plain text. Step 2 returns valid JSON. `jq -r '.result'` extracts the same answer content from JSON output. JSON output includes a non-empty `session_id` string.

#### Test Execution

> **Feature File:** [CC-003](01--cli-invocation/003-output-format-text-vs-json.md)

### CC-004 | Stream-json incremental output

#### Description

Verify that `--output-format stream-json` emits newline-delimited JSON events suitable for real-time progress tracking by an external-AI orchestrator.

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting incremental progress events for a longer Claude Code analysis, run `claude -p` with `--output-format stream-json` against a multi-step analysis prompt and stream the result through a line-by-line consumer. Verify each stdout line is independently parseable JSON and that distinct event types appear before the final result. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Each non-empty stdout line parses as a single JSON object via `jq`. At least 2 distinct event types appear (for example a progress/intermediate event and a final result event). The stream terminates cleanly with the process exiting 0.

#### Test Execution

> **Feature File:** [CC-004](01--cli-invocation/004-stream-json-incremental-output.md)

---

## 8. PERMISSION MODES

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CC-005 | Plan mode read-only enforcement

#### Description

Verify `--permission-mode plan` blocks file writes and shell command execution while permitting all read-only tools (Read, Glob, Grep).

#### Scenario Contract

Prompt summary: As an external-AI conductor running a safety-critical code review, dispatch `claude -p` with `--permission-mode plan` and a prompt that intentionally asks Claude Code to "fix" a small issue in a target file. Verify the run exits 0, produces only suggestions or analysis text and that no actual file writes occur. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Output describes proposed changes in prose or markdown but does not claim to have written any file. The target file's mtime is unchanged after the run. No Edit or Write tool invocations appear in verbose logs.

#### Test Execution

> **Feature File:** [CC-005](02--permission-modes/001-plan-mode-read-only-enforcement.md)

### CC-006 | AcceptEdits mode auto-approve writes **(SANDBOXED)**

#### Description

Verify `--permission-mode acceptEdits` allows file writes without per-edit prompts while still requiring approval for shell commands. Runs only against `/tmp/cli-claude-code-playbook/scratch.ts`.

#### Scenario Contract

Prompt summary: As an external-AI conductor delegating a small refactor of an isolated scratch file, dispatch `claude -p` with `--permission-mode acceptEdits` against `/tmp/cli-claude-code-playbook/scratch.ts`. Verify Claude Code applies the requested edit without interactive approval and that the file mtime advances. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Run exits 0. The scratch file's mtime advances. The file's contents reflect the requested change. No shell commands were executed without prompting (verify via verbose log).

#### Test Execution

> **Feature File:** [CC-006](02--permission-modes/002-accept-edits-auto-approve-writes-sandboxed.md)

### CC-007 | BypassPermissions guard rail **(SANDBOXED)**

#### Description

Verify `--permission-mode bypassPermissions` is a documented dangerous flag that the orchestrator must NOT use without explicit user approval and that the skill documentation surfaces this rule. Runs in dry-run mode against the sandbox file - the test validates orchestrator policy, not the destructive bypass itself.

#### Scenario Contract

Prompt summary: As an external-AI conductor evaluating whether to dispatch with `--permission-mode bypassPermissions` for a batch operation, consult the cli-claude-code skill rules and confirm the skill explicitly forbids this flag without explicit user approval. Then verify the orchestrator path refuses to construct such a command without an `[user-approved-bypass]` token in the request. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Skill rule lookup surfaces the explicit "NEVER use --permission-mode bypassPermissions without explicit user approval" rule from cli-claude-code SKILL.md. Dispatch attempt without approval token is refused by the orchestrator with a documented escalation message. Dispatch attempt with approval token may proceed (but the destructive payload itself is replaced with a noop in the playbook).

#### Test Execution

> **Feature File:** [CC-007](02--permission-modes/003-bypass-permissions-guard-rail-sandboxed.md)

---

## 9. REASONING AND MODELS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CC-008 | Opus extended thinking

#### Description

Verify `--model claude-opus-4-6 --effort high` produces deeper, more detailed chain-of-thought analysis than the Sonnet default for a multi-dimensional architecture trade-off prompt.

#### Scenario Contract

Prompt summary: As an external-AI conductor facing a complex architecture trade-off (event sourcing vs CRUD for an order management system), dispatch `claude -p` with `--model claude-opus-4-6 --effort high --permission-mode plan` and capture the response. Verify the response weighs at least 4 dimensions (consistency, query performance, learning curve, scalability), produces a recommendation with confidence level and is materially longer than a Sonnet baseline for the same prompt. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response weighs at least 4 trade-off dimensions explicitly. Produces an explicit recommendation with confidence level (high/medium/low or numeric). Response token count is materially larger than a Sonnet-default baseline for the same prompt. Cost metadata (when JSON output is captured) reflects Opus pricing tier.

#### Test Execution

> **Feature File:** [CC-008](03--reasoning-and-models/001-opus-extended-thinking.md)

### CC-009 | Sonnet balanced default

#### Description

Verify Sonnet (`claude-sonnet-4-6`) handles a standard code review prompt with reasonable depth and cost without requiring `--effort high`.

#### Scenario Contract

Prompt summary: As an external-AI conductor running a routine security review on a single auth handler file, dispatch `claude -p --model claude-sonnet-4-6 --permission-mode plan` against `@./src/auth/handler.ts` (or any small auth file in the repository) and capture the response. Verify the response identifies at least one concrete issue or confirms the file is clean with stated reasoning, completes within 90 seconds and stays within a sub-dollar cost budget. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response either flags concrete issues with line references OR explicitly states the file is clean with reasoning. Runtime under 90 seconds. Cost (when JSON output captured) under USD 0.50 for a small file.

#### Test Execution

> **Feature File:** [CC-009](03--reasoning-and-models/002-sonnet-balanced-default.md)

### CC-010 | Haiku fast classification

#### Description

Verify Haiku (`claude-haiku-4-5-20251001`) handles batch classification of a small list of error messages quickly and cheaply, completing within seconds rather than tens of seconds.

#### Scenario Contract

Prompt summary: As an external-AI conductor needing fast bulk classification of 5-10 error messages by category (syntax/runtime/logic/config/network), dispatch `claude -p --model claude-haiku-4-5-20251001` and capture the categorized output. Verify the response classifies every input item, completes in under 15 seconds and reports a cost noticeably lower than the equivalent Sonnet dispatch. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Every input error message receives a category label. Response time under 15 seconds. Cost (when JSON output captured) is at least 5x lower than the equivalent Sonnet call for the same prompt.

#### Test Execution

> **Feature File:** [CC-010](03--reasoning-and-models/003-haiku-fast-classification.md)

---

## 10. AGENT ROUTING

This category covers 9 scenario summaries while the linked feature files remain the canonical execution contract. Claude Code agents are defined in `.opencode/agent/<name>.md` and dispatched via the `--agent` flag. The cli-claude-code skill documents 9 agent slots (context, debug, handover, orchestrate, research, review, speckit, ultra-think, write) and this section covers all 9.

### CC-011 | Context agent codebase exploration

#### Description

Verify `--agent context --permission-mode plan` produces a structured architecture map of a target directory in read-only mode.

#### Scenario Contract

Prompt summary: As an external-AI conductor needing to understand an unfamiliar module before implementing a change, dispatch `claude -p --agent context --permission-mode plan` against `@./src/services/` (or any non-trivial source directory) and capture the architecture map. Verify the response identifies entry points, key modules, dependency flow and notable patterns and that no file writes occur. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response identifies entry points and key modules by name. Describes dependency flow or import relationships. Mentions notable patterns or conventions. Target directory's file mtimes are unchanged after the run.

#### Test Execution

> **Feature File:** [CC-011](04--agent-routing/001-context-agent-codebase-exploration.md)

### CC-012 | Debug agent fresh-perspective root cause

#### Description

Verify `--agent debug` accepts a "what I tried" context block plus a paste of relevant files and returns a ranked list of possible root causes with diagnostic next steps.

#### Scenario Contract

Prompt summary: As an external-AI conductor stuck on a debugging task after multiple local attempts, dispatch `claude -p --agent debug` with the prior debugging analysis embedded in the prompt and the relevant files referenced via `@./path`. Verify the response ranks possible root causes by likelihood, suggests at least 2 concrete diagnostic steps per cause and does not recycle the analysis the conductor already tried. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response lists at least 2 distinct ranked root causes. For each cause provides at least 2 concrete diagnostic steps. Explicitly distinguishes itself from the "already tried" set provided in the prompt.

#### Test Execution

> **Feature File:** [CC-012](04--agent-routing/002-debug-agent-fresh-perspective-root-cause.md)

### CC-013 | Review agent security audit

#### Description

Verify `--agent review --permission-mode plan` produces a structured security review of a target file with severity-tagged findings.

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting an independent security audit before merging a change, dispatch `claude -p --agent review --permission-mode plan` against `@./src/auth/` (or any auth-related directory) with an explicit OWASP-style checklist (XSS, CSRF, injection, auth bypass, hardcoded secrets, insecure defaults). Verify the response either flags concrete severity-tagged findings (critical/high/medium/low) with line references OR explicitly attests to the absence of each checked vulnerability. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Each checklist item (XSS, CSRF, injection, auth bypass, hardcoded secrets, insecure defaults) has an explicit verdict. Flagged findings include line references and severity tags. Response would be actionable to a human reviewer.

#### Test Execution

> **Feature File:** [CC-013](04--agent-routing/003-review-agent-security-audit.md)

### CC-014 | Ultra-think multi-strategy planning

#### Description

Verify `--agent ultra-think --model claude-opus-4-6 --permission-mode plan` produces multiple distinct strategies scored across at least 3 dimensions for a complex planning task.

#### Scenario Contract

Prompt summary: As an external-AI conductor planning a complex migration (for example MongoDB to PostgreSQL) and wanting multiple strategies evaluated by rubric, dispatch `claude -p --agent ultra-think --model claude-opus-4-6 --permission-mode plan` and capture the structured plan. Verify the response generates at least 3 distinct strategies (for example big-bang, gradual, dual-write), scores each across risk/effort/timeline/rollback and recommends one with rationale. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response presents at least 3 distinct strategies. Each strategy scored across at least 3 dimensions (risk/effort/timeline/rollback). Explicit recommendation with rationale. Uses `--effort high` style depth (multi-paragraph reasoning per strategy).

#### Test Execution

> **Feature File:** [CC-014](04--agent-routing/004-ultra-think-multi-strategy-planning.md)

### CC-021 | Handover agent context transfer

#### Description

Verify `--agent handover --permission-mode plan` produces a structured session-state capture covering active work, modified files, decisions, blockers, and next steps in a single read-only dispatch.

#### Scenario Contract

Prompt summary: As an external-AI conductor closing out a multi-step task and preparing handoff for a follow-up session, dispatch `claude -p --agent handover --permission-mode plan` against the active task scope and capture a structured handover document. Verify the response identifies active work, modified files, key decisions, blockers, and next steps. Return a concise pass/fail verdict naming the captured fields and confirming no file writes.

Expected signals: Response names the active task. Lists at least 2 modified or referenced files. Surfaces at least 1 decision or rationale. Declares at least 1 blocker or open question (or attests to none). Names at least 1 concrete next step. No file mtimes change.

#### Test Execution

> **Feature File:** [CC-021](04--agent-routing/005-handover-agent-context-transfer.md)

### CC-022 | Orchestrate agent multi-step coordination

#### Description

Verify `--agent orchestrate --permission-mode plan` decomposes a complex task into a sequenced multi-agent pipeline naming at least 3 distinct Claude Code agents with explicit handoffs.

#### Scenario Contract

Prompt summary: As an external-AI conductor facing a complex task that requires multiple Claude Code specializations in sequence, dispatch `claude -p --agent orchestrate --permission-mode plan` and ask for a decomposition naming at least 3 specialist agents (for example context, review, debug, ultra-think) and explicit handoffs between them. Verify the plan reads as a sequenced workflow rather than monolithic analysis. Return a verdict naming the agents in the planned order and confirming no file writes occur.

Expected signals: Response names at least 3 distinct Claude Code agents. Sequences them in a clear order (Step 1, Step 2, Step 3 or equivalent). Describes handoff content between steps. No file mtimes change.

#### Test Execution

> **Feature File:** [CC-022](04--agent-routing/006-orchestrate-agent-multi-step.md)

### CC-023 | Research agent deep investigation

#### Description

Verify `--agent research` produces a comparative analysis of at least 2 candidate approaches across at least 3 trade-off dimensions and surfaces an explicit recommendation with rationale.

#### Scenario Contract

Prompt summary: As an external-AI conductor facing an architecture decision between two candidates, dispatch `claude -p --agent research` and ask for a comparative analysis across multiple trade-off dimensions. Verify the response surfaces explicit pros and cons per candidate and ends with a recommendation plus rationale. Return a verdict naming the candidates, dimensions, and recommendation.

Expected signals: Response names both candidates explicitly. Compares them across at least 3 dimensions. Surfaces pros and cons per candidate. Ends with an explicit recommendation. Provides rationale tied to the evidence.

#### Test Execution

> **Feature File:** [CC-023](04--agent-routing/007-research-agent-investigation.md)

### CC-024 | Speckit agent spec folder workflow

#### Description

Verify `--agent speckit` produces a spec-folder scaffolding plan that names the appropriate documentation level and lists the required canonical files for that level.

#### Scenario Contract

Prompt summary: As an external-AI conductor preparing a spec folder for a small feature, dispatch `claude -p --agent speckit` and ask for a Level recommendation plus a file list. Verify the response names a documentation level (1, 2, or 3), lists the required canonical files for that level, and explains the level choice in one sentence. Return a verdict naming the level, the files, and the rationale.

Expected signals: Response names a documentation level explicitly. Lists at least 4 canonical files (spec.md, plan.md, tasks.md, implementation-summary.md). Provides level rationale tied to LOC or risk. Surfaces the spec-folder path convention.

#### Test Execution

> **Feature File:** [CC-024](04--agent-routing/008-speckit-agent-spec-folder.md)

### CC-025 | Write agent doc generation

#### Description

Verify `--agent write` writes a sk-doc template-driven README to a temp path with a TABLE OF CONTENTS and at least 3 emoji-prefixed H2 headers.

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting a template-driven README for a small skill, dispatch `claude -p --agent write` to generate `/tmp/cc-025-readme/README.md` for a fictional skill. Verify the file is written, contains a TABLE OF CONTENTS section, and has at least 3 emoji-prefixed H2 headers. Return a verdict naming the file path and the H2 emoji count.

Expected signals: Dispatch exits 0. README file exists at the requested path. README contains a TABLE OF CONTENTS section. H2 headers include emojis (per sk-doc template enforcement).

#### Test Execution

> **Feature File:** [CC-025](04--agent-routing/009-write-agent-doc-generation.md)

---

## 11. SESSION CONTINUITY

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CC-015 | Continue previous conversation

#### Description

Verify `--continue` resumes the most recent Claude Code session and the follow-up prompt has access to the prior turn's context without re-explanation.

#### Scenario Contract

Prompt summary: As an external-AI conductor running a 2-step analysis (initial architecture review, then a follow-up with concrete improvements based on what was identified), dispatch the first `claude -p` call to establish context and the second `claude -p ... --continue` call with a follow-up that depends on the first turn's findings. Verify the second response references concrete details from the first turn rather than re-deriving them or asking the user to re-paste context. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: First call exits 0 and returns architecture analysis. Second call with `--continue` returns improvements that reference specific items from the first turn by name. No "I don't have context" or "please re-share" language in the second response.

#### Test Execution

> **Feature File:** [CC-015](05--session-continuity/001-continue-previous-conversation.md)

### CC-016 | Resume specific session by ID

#### Description

Verify `--resume SESSION_ID` resumes a specific session captured from a prior JSON output and that the resumed turn has access to the original session's context.

#### Scenario Contract

Prompt summary: As an external-AI conductor managing multiple parallel Claude Code investigations, dispatch an initial `claude -p ... --output-format json` call, capture its `session_id` via `jq`, then dispatch a later `claude -p "..." --resume "$SESSION_ID"` call that explicitly references content from the first turn. Verify the resumed turn correctly references the prior context. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: First call's JSON output includes a non-empty `session_id`. Resume call exits 0. Resumed response references specific content from the original turn rather than asking for re-paste.

#### Test Execution

> **Feature File:** [CC-016](05--session-continuity/002-resume-specific-session-by-id.md)

---

## 12. INTEGRATION PATTERNS

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CC-017 | Generate-review-fix cycle

#### Description

Verify the canonical cross-AI pattern where the calling AI generates code, Claude Code reviews it in `--permission-mode plan` and the calling AI applies the suggested fixes.

#### Scenario Contract

Prompt summary: As an external-AI conductor running the most reliable cross-AI cycle, generate a small TypeScript module locally and save it to `/tmp/cli-claude-code-playbook/generated.ts`, then dispatch `claude -p` with `--permission-mode plan` to review it for bugs/security/style with explicit line numbers. Capture the review, apply the fixes locally and confirm the resulting file would pass a second review. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1 produces a generated file with at least one intentional defect. Step 2 review identifies that defect with a line reference. Step 3 application of fix removes the defect. Step 4 second review either reports no critical issues or only flags items the conductor knowingly accepted.

#### Test Execution

> **Feature File:** [CC-017](06--integration-patterns/001-generate-review-fix-cycle.md)

### CC-018 | Structured output with json-schema

#### Description

Verify `--json-schema '...' --output-format json` produces a Claude Code response that conforms to the supplied schema and can be safely parsed into a downstream pipeline.

#### Scenario Contract

Prompt summary: As an external-AI conductor needing pipeline-grade structured output for a security audit (severity-tagged findings with line numbers and recommendations), dispatch `claude -p` with `--json-schema '...' --output-format json --permission-mode plan` and a schema describing `findings[]` with severity enum, line number, description and recommendation. Validate the returned JSON against the schema using `jq` or a JSON validator and verify each finding includes the required fields. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Response is valid JSON parseable by `jq`. The inner `result` payload conforms to the supplied schema. Every finding has `severity` (one of critical/high/medium/low), `description` and a recommendation. The response can be piped into a downstream tool without ad-hoc reshaping.

#### Test Execution

> **Feature File:** [CC-018](06--integration-patterns/002-structured-output-with-json-schema.md)

---

## 13. PROMPT TEMPLATES

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CC-019 | Prompt template usage from assets

#### Description

Verify the prompt templates inventory at `assets/prompt_templates.md` is loadable and that a representative template (for example security review or unit test generation) produces well-formed output when populated and dispatched.

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting to reuse a vetted prompt template instead of authoring one from scratch, load `assets/prompt_templates.md` from the cli-claude-code skill, select the security review template, populate the placeholders for a real target file and dispatch the resulting `claude -p` command. Verify the command runs successfully and the response matches the template's intended structure (severity-tagged findings, etc.). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Template file is readable and contains the labeled template (Security Review under section 3). Populated placeholders produce a syntactically valid `claude -p` invocation. Dispatched command exits 0 and the response shape matches the template's documented intent (severity ratings, line refs).

#### Test Execution

> **Feature File:** [CC-019](07--prompt-templates/001-prompt-template-usage-from-assets.md)

### CC-020 | CLEAR quality card 5-check

#### Description

Verify the prompt quality card at `assets/prompt_quality_card.md` defines the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), the framework selection table and the escalation rule to `@improve-prompt` when complexity is `>= 7/10`.

#### Scenario Contract

Prompt summary: As an external-AI conductor about to construct a non-trivial Claude Code prompt, load the prompt quality card and apply the CLEAR 5-check to a draft prompt for an architecture analysis task. Verify the card explicitly documents the 5-check, the framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) with complexity bands and the escalation rule for complexity >= 7. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Card lists all 5 CLEAR criteria explicitly. Framework selection table includes all 7 frameworks with complexity bands. Escalation rule for complexity >= 7 to `@improve-prompt` is explicitly documented. Failure-pattern checklist is present.

#### Test Execution

> **Feature File:** [CC-020](07--prompt-templates/002-clear-quality-card-5-check.md)

---

## 14. COST AND BACKGROUND

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises the cost-control surface (`--max-budget-usd`) and the background-execution pattern (`&` plus `</dev/null` redirect) that load-bearing cross-AI workloads rely on.

### CC-026 | Max budget USD cap behavior

#### Description

Verify `--max-budget-usd 0.50` is accepted by the CLI, that the dispatch completes successfully for a small read-only prompt, and that the JSON output reports a `cost` value not exceeding the supplied budget.

#### Scenario Contract

Prompt summary: As an external-AI conductor enforcing cost discipline on an unattended run, dispatch `claude -p --max-budget-usd 0.50 --output-format json --permission-mode plan` against a small file. Verify the dispatch exits 0, the JSON envelope contains a numeric cost field, and that cost is at or below 0.50. Return a verdict naming the cost value reported and confirming it is within the cap.

Expected signals: Dispatch exits 0. JSON output is parseable via `jq`. JSON output contains a numeric `cost` (or `total_cost_usd`) field. Reported cost is at or below 0.50. Dispatched command line includes `--max-budget-usd 0.50`.

#### Test Execution

> **Feature File:** [CC-026](08--cost-and-background/001-max-budget-usd-cap.md)

### CC-027 | Background execution

#### Description

Verify a backgrounded `claude -p` dispatch with `</dev/null` runs without blocking the parent shell, that `wait` collects exit 0, and that the captured stdout file contains the expected response.

#### Scenario Contract

Prompt summary: As an external-AI conductor running a parallel workload, dispatch `claude -p` in the background with stdout captured to a temp file and stdin redirected from `/dev/null` so the parent shell does not block. Run a small read-only analysis prompt. Verify `wait` returns exit 0, the temp file contains a non-empty response, and the parent shell remained responsive. Return a verdict naming the temp file, the wait exit code, and the first 80 characters of the captured response.

Expected signals: `wait` returns exit 0. Captured stdout file is non-empty. Parent shell remained responsive. Dispatched command line includes `&` and `</dev/null`.

#### Test Execution

> **Feature File:** [CC-027](08--cost-and-background/002-background-execution.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

The cli-claude-code skill is a thin orchestration wrapper around the external Anthropic `claude` binary, so it does not ship its own automated test suite. Coverage is therefore manual-only by design. Adjacent cross-AI skills follow the same pattern:

| Adjacent Skill | Test Coverage | Playbook Overlap |
|---|---|---|
| `cli-codex` | Manual playbook only | Cross-AI delegation pattern parallels (generate-review-fix, structured output) |
| `cli-gemini` | Manual playbook only | Cross-AI delegation pattern parallels (research, web grounding) |
| `cli-copilot` | Manual playbook only | Cross-AI delegation pattern parallels (autonomous task execution) |
| `cli-opencode` | Manual playbook only | Cross-AI delegation pattern parallels (cross-runtime handback) |

Validator support: the shared `validate_document.py` validates this root playbook structurally but does not recurse into category folders. Per-feature file completeness is checked manually via the link integrity and feature ID count gates documented in section 5.

---

## 16. FEATURE FILE INDEX

### CLI INVOCATION

- CC-001: [Base non-interactive invocation](01--cli-invocation/001-base-non-interactive-invocation.md)
- CC-002: [Default model selection (Sonnet)](01--cli-invocation/002-default-model-selection-sonnet.md)
- CC-003: [Output format text vs json](01--cli-invocation/003-output-format-text-vs-json.md)
- CC-004: [Stream-json incremental output](01--cli-invocation/004-stream-json-incremental-output.md)

### PERMISSION MODES

- CC-005: [Plan mode read-only enforcement](02--permission-modes/001-plan-mode-read-only-enforcement.md)
- CC-006: [AcceptEdits mode auto-approve writes **(SANDBOXED)**](02--permission-modes/002-accept-edits-auto-approve-writes-sandboxed.md)
- CC-007: [BypassPermissions guard rail **(SANDBOXED)**](02--permission-modes/003-bypass-permissions-guard-rail-sandboxed.md)

### REASONING AND MODELS

- CC-008: [Opus extended thinking](03--reasoning-and-models/001-opus-extended-thinking.md)
- CC-009: [Sonnet balanced default](03--reasoning-and-models/002-sonnet-balanced-default.md)
- CC-010: [Haiku fast classification](03--reasoning-and-models/003-haiku-fast-classification.md)

### AGENT ROUTING

- CC-011: [Context agent codebase exploration](04--agent-routing/001-context-agent-codebase-exploration.md)
- CC-012: [Debug agent fresh-perspective root cause](04--agent-routing/002-debug-agent-fresh-perspective-root-cause.md)
- CC-013: [Review agent security audit](04--agent-routing/003-review-agent-security-audit.md)
- CC-014: [Ultra-think multi-strategy planning](04--agent-routing/004-ultra-think-multi-strategy-planning.md)
- CC-021: [Handover agent context transfer](04--agent-routing/005-handover-agent-context-transfer.md)
- CC-022: [Orchestrate agent multi-step coordination](04--agent-routing/006-orchestrate-agent-multi-step.md)
- CC-023: [Research agent deep investigation](04--agent-routing/007-research-agent-investigation.md)
- CC-024: [Speckit agent spec folder workflow](04--agent-routing/008-speckit-agent-spec-folder.md)
- CC-025: [Write agent doc generation](04--agent-routing/009-write-agent-doc-generation.md)

### SESSION CONTINUITY

- CC-015: [Continue previous conversation](05--session-continuity/001-continue-previous-conversation.md)
- CC-016: [Resume specific session by ID](05--session-continuity/002-resume-specific-session-by-id.md)

### INTEGRATION PATTERNS

- CC-017: [Generate-review-fix cycle](06--integration-patterns/001-generate-review-fix-cycle.md)
- CC-018: [Structured output with json-schema](06--integration-patterns/002-structured-output-with-json-schema.md)

### PROMPT TEMPLATES

- CC-019: [Prompt template usage from assets](07--prompt-templates/001-prompt-template-usage-from-assets.md)
- CC-020: [CLEAR quality card 5-check](07--prompt-templates/002-clear-quality-card-5-check.md)

### COST AND BACKGROUND

- CC-026: [Max budget USD cap behavior](08--cost-and-background/001-max-budget-usd-cap.md)
- CC-027: [Background execution](08--cost-and-background/002-background-execution.md)
