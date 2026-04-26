---
title: "cli-copilot: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the cli-copilot skill."
---

# cli-copilot: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real, not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, dispatch the real `copilot` binary and verify real outputs. The only acceptable classifications are PASS, FAIL or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `cli-copilot` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-copilot` skill. The root document acts as the directory, review surface and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `MANUAL_TESTING_PLAYBOOK.md`
- `01--cli-invocation/`
- `02--multi-model/`
- `03--autopilot-mode/`
- `04--agent-routing/`
- `05--session-continuity/`
- `06--integration-patterns/`
- `07--prompt-templates/`
- `08--cloud-delegation/`

The cli-copilot playbook fills all eight category positions because Copilot CLI exposes a first-class repository-memory surface (validated under category `05--session-continuity`) on top of the cross-CLI invariants. Cross-CLI position invariants (`01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates`) hold across the spec 048 cli-* family.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CLI INVOCATION](#7--cli-invocation)
- [8. MULTI-MODEL](#8--multi-model)
- [9. AUTOPILOT MODE](#9--autopilot-mode)
- [10. AGENT ROUTING](#10--agent-routing)
- [11. SESSION CONTINUITY](#11--session-continuity)
- [12. INTEGRATION PATTERNS](#12--integration-patterns)
- [13. PROMPT TEMPLATES](#13--prompt-templates)
- [14. CLOUD DELEGATION](#14--cloud-delegation)
- [15. AUTOMATED TEST CROSS-REFERENCE](#15--automated-test-cross-reference)
- [16. FEATURE FILE INDEX](#16--feature-file-index)

---

## 1. OVERVIEW

This playbook provides 21 deterministic scenarios across 8 categories validating the `cli-copilot` skill surface. Each feature keeps its stable `CP-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-04-26): the playbook covers cli-copilot's documented behaviour at SKILL.md v1.3.4.0. It includes non-interactive `-p` invocation, `--allow-all-tools` autonomy, `--no-ask-user` autonomous mode, the five recommended models (`gpt-5.4`, `gpt-5.3-codex`, `claude-opus-4.6`, `claude-sonnet-4.6`, `gemini-3.1-pro-preview`), GPT-5.x reasoning-effort tuning via `~/.copilot/config.json`, Autopilot autonomous execution, the `@Explore` and `@Task` built-in agents (with documented `@copilot` cloud routing), repository memory persistence, mid-session model switching, three integration patterns (cross-AI generate-review-fix, MCP support, shell-wrapper same-invocation context injection), the two ALWAYS-loaded prompt assets (`prompt_quality_card.md` and `cli_reference.md`) and both cloud-delegation surfaces (`/delegate` command and `&prompt` shorthand).

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and has `.git/`.
2. Copilot CLI is installed and resolvable via `command -v copilot`. Version is recent enough to support `-p`, `--allow-all-tools`, `--no-ask-user`, `--model`, the five recommended model IDs, `/delegate` and the `@<agent>` prefix routing in prompts.
3. Authentication is configured (GitHub OAuth via `copilot login` or `GH_TOKEN` / `GITHUB_TOKEN` PAT) and the operator's GitHub account has an active Copilot subscription with remaining quota for the wave being executed.
4. The cli-copilot skill files (SKILL.md, references/, assets/) are present at `.opencode/skill/cli-copilot/` and unmodified during the test run.
5. The orchestrator runtime is NOT itself Copilot CLI (the skill refuses to load on self-invocation per SKILL.md §1, detection signals: `$COPILOT_SESSION_ID`, `GH_COPILOT_*` env vars, `copilot` in process ancestry or `~/.copilot/state/<id>/lock`).
6. **Concurrency cap**: Routine automation MUST cap at 3 parallel `copilot -p` calls per the auto-memory rule "Copilot CLI max 3 concurrent dispatches" (upstream GitHub Copilot API throttles above 3 per account. SKILL.md §4 lists 5 as the absolute hard ceiling). Verify `pgrep -f "copilot" | wc -l` before launching parallel scenarios. Use per-iteration delta files when scenarios need parallel writes to avoid shared-write races.
7. Destructive scenarios `CP-002` (`--allow-all-tools` sandboxed write), `CP-008` (Autopilot autonomous build in sandbox), `CP-013` (repo memory write to sandboxed `~/.copilot/`), `CP-017` (shell wrapper writing to sandboxed instructions file), `CP-020` (`/delegate` cloud write) and `CP-021` (`&prompt` cloud write) MUST verify recovery is possible. All use `/tmp/cp-NNN-sandbox/` directories and tripwire the operator's real project tree (and real `~/.copilot/` for memory tests) so unintended mutations are caught immediately.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript (full Bash invocation including flags, target and model)
- User request used (the human-language ask the operator started from)
- Orchestrator or agent-facing prompt used (the exact text passed to `copilot -p`)
- Delegation or runtime-routing notes when applicable (which Copilot agent prefix `@Explore`/`@Task`, which `--model`, which cloud routing `/delegate` vs `&prompt`)
- Output snippets (saved to `/tmp/cp-NNN*.txt` / `.json` / `.md` per scenario)
- Final user-facing response or outcome summary
- Artifact paths or output references for every captured file
- Pre-launch concurrency check (`pgrep -f "copilot" | wc -l`) when the scenario participates in parallel waves
- Scenario verdict (`PASS` / `PARTIAL` / `FAIL` / `SKIP`) with rationale plus the highest-severity finding when applicable

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `copilot -p "[prompt]" [flags]`.
- Bash commands shown as `bash: <command>`.
- Agent prefixes shown as `As @<agent>: <instruction>` inside the prompt body (e.g. `As @Explore:`, `As @Task:`).
- Cloud delegation shown as `/delegate <task>` (explicit command) or `&<task>` (inline shorthand) inside the prompt body.
- Reasoning-effort changes for GPT-5.x shown as JSON edits to `~/.copilot/config.json` (no CLI flag exists per SKILL.md §3).
- `->` separates sequential steps inside a scenario's Exact Command Sequence.
- All evidence files live under `/tmp/cp-NNN*`. The playbook never writes to project paths outside `/tmp/` sandboxes.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `MANUAL_TESTING_PLAYBOOK.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (command transcripts, captured `/tmp/cp-NNN*` artifacts, concurrency-cap probe outputs)
4. Feature-to-scenario coverage map (the §16 FEATURE FILE INDEX)
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (auth, subscription, quota, sandbox setup, concurrency cap respected).
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable (the `/tmp/cp-NNN*` artifacts exist and contain the documented content).
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete (e.g. supplemental check skipped, but the main 9-column row passed)
- `FAIL`: expected behavior missing, contradictory output or critical check failed
- `SKIP`: a sandbox blocker prevented execution (e.g. no `copilot` binary, expired Copilot subscription, GH_TOKEN missing). Document the blocker and the remediation step

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rules:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.
- All destructive scenarios (`CP-002`, `CP-008`, `CP-013`, `CP-017`, `CP-020`, `CP-021`) MUST have an empty tripwire diff against the operator's real project tree and (for memory/instructions tests) real `~/.copilot/` contents. A non-empty diff is automatically `FAIL` for the scenario AND escalates regardless of how the rest of the row scored.
- Concurrency-cap violations (more than 3 simultaneous `copilot -p` processes detected during a wave) automatically downgrade the affected wave to `PARTIAL` and require a re-run with proper throttling.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES = 21`).
4. No unresolved blocking triage item remains.
5. All destructive scenarios (`CP-002`, `CP-008`, `CP-013`, `CP-017`, `CP-020`, `CP-021`) are PASS with empty tripwire diffs.
6. No concurrency-cap violations remain unresolved across any wave.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put feature-specific acceptance caveats (e.g. CP-007 reasoning-effort config-file persistence, CP-013 sandboxed `~/.copilot/` discipline, CP-020 / CP-021 cloud-delegation timeout sensitivity) in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (verify `copilot` is installed, auth works, the active Copilot subscription has quota for the planned wave).
2. **Hard cap parallelism at 3 `copilot -p` processes** per the auto-memory rule and SKILL.md §4 CONCURRENCY LIMIT. Use `pgrep -f "copilot" | wc -l` before launching each new dispatch in a parallel wave.
3. Reserve one coordinator (the calling AI or operator who reads this playbook).
4. Saturate remaining worker slots with read-only scenarios first (Wave 1), respecting the 3-process cap.
5. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
6. Run destructive scenarios (`CP-002`, `CP-008`, `CP-013`, `CP-017`, `CP-020`, `CP-021`) in dedicated sandbox-only waves. `CP-013` and `CP-017` use sandboxed `HOME` / `SPECKIT_COPILOT_INSTRUCTIONS_PATH` overrides. The cloud-delegation scenarios run serially because they hit the same upstream GitHub cloud agent quota.
7. Use per-iteration delta files when parallel scenarios need to write artifacts (e.g. each CP-NNN scenario writes to `/tmp/cp-NNN-iter-${RUN_ID}/...` so concurrent runs do not clobber shared paths).
8. After each wave, save context and evidence, then begin the next wave.
9. Record utilization table (target ≤ 3 concurrent), per-feature file references and evidence paths in the final report.

### Suggested Wave Plan

- **Wave 1, Read-only baseline (parallel-safe, ≤ 3 concurrent)**: `CP-001`, `CP-003`, `CP-004`, `CP-005`, `CP-006`, `CP-009`, `CP-010`, `CP-012`, `CP-018`, `CP-019`. Pure read-only / shape-only checks, safe to run 3-at-a-time within the upstream cap.
- **Wave 2, Multi-model and reasoning-effort (rate-limit sensitive, ≤ 3 concurrent)**: `CP-007` (GPT-5.x reasoning-effort xhigh via `~/.copilot/config.json`). Touches a real config-file mutation under sandboxed `HOME`. Adjacent multi-model scenarios from Wave 1 may rerun here if model quota throttles.
- **Wave 3, Destructive sandbox-only (serial)**: `CP-002` (`--allow-all-tools` sandboxed write), `CP-008` (Autopilot autonomous build), `CP-013` (repo memory in sandboxed `HOME`), `CP-017` (shell-wrapper instructions-file write). Run one at a time, verify tripwire diffs are empty after each.
- **Wave 4, Agent + integration patterns (parallel-safe, ≤ 3 concurrent)**: `CP-011` (`@Task` execution in sandbox), `CP-014` (mid-session model switch persistence), `CP-015` (cross-AI generate-review-fix cycle), `CP-016` (MCP support). Each touches multiple Copilot calls. Respect the 3-process cap.
- **Wave 5, Cloud delegation (serial)**: `CP-020` (`/delegate` cloud write), `CP-021` (`&prompt` cloud write). These hit GitHub's cloud coding agent on a shared quota. Serial dispatch isolates timeout and quota behaviour.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role -> Context -> Action -> Format contract
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints (e.g. `~/.copilot/config.json` write/restore for CP-007, sandboxed `HOME` for CP-013, `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override for CP-017, cloud-delegation quota notes for CP-020/CP-021)

---

## 7. CLI INVOCATION

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CP-001 | Direct prompt with non-interactive `-p` flag

#### Description

Confirm `copilot -p "[prompt]" 2>&1` returns a non-empty plain-text response in a single non-interactive invocation without entering the interactive TUI.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator delegating from Claude Code, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository. Verify a single-shot `-p` prompt returns a readable response without opening the TUI and without leaving the calling shell blocked on input. Return a concise pass/fail verdict with the main reason and the first ~10 lines of Copilot's response.

Expected signals: `command -v copilot` resolves to a binary path. The single-shot `-p` call exits 0 with a non-empty multi-sentence response in plain text. No TUI banner blocks stdin.

Desired user-visible outcome: a short paragraph (1-3 sentences) summarising cli-copilot's role + a PASS verdict.

#### Test Execution
> **Feature File:** [CP-001](01--cli-invocation/001-direct-prompt-non-interactive.md)

### CP-002 | `--allow-all-tools` sandboxed file write **(DESTRUCTIVE)**

#### Description

Confirm `--allow-all-tools` auto-approves a sandboxed file-write tool call without prompting and without touching project files.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator with explicit sandbox approval, invoke Copilot CLI with --allow-all-tools against the cli-copilot skill in this repository. Verify the auto-approve flag lets Copilot perform a documented file-write tool call inside the sandbox directory /tmp/cp-002-sandbox/ without prompting the operator. Constrain all writes to the provided sandbox directory. Return a concise pass/fail verdict with the main reason and the resulting file path.

Expected signals: `EXIT=0`. `/tmp/cp-002-sandbox/hello-copilot.md` exists with the expected content. `git status --porcelain` diff before vs after is empty (project tree unchanged). No operator prompt blocked stdin.

Desired user-visible outcome: PASS verdict reporting the absolute sandbox path and approximate file size.

#### Test Execution
> **Feature File:** [CP-002](01--cli-invocation/002-allow-all-tools-sandboxed-write.md)

### CP-003 | `--no-ask-user` autonomous read

#### Description

Confirm `--no-ask-user` lets a read-only prompt complete without operator interaction or project mutation.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator running unattended, invoke Copilot CLI with --no-ask-user against the cli-copilot skill in this repository for a strictly read-only prompt. Verify the call exits 0, returns a non-empty answer and never blocks stdin asking a clarifying question. Return a concise pass/fail verdict with the main reason and the parsed answer.

Expected signals: `EXIT=0`. Stdout contains a multi-sentence answer naming Copilot CLI capabilities. `git status --porcelain` diff is empty. No operator prompt appears.

Desired user-visible outcome: PASS verdict + a one-line note that the autonomous read completed without operator interaction.

#### Test Execution
> **Feature File:** [CP-003](01--cli-invocation/003-no-ask-user-autonomous-read.md)

---

## 8. MULTI-MODEL

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract. Coverage spans 3 of the 5 recommended models with explicit selection (`gpt-5.4`, `gpt-5.3-codex`, `claude-opus-4.6`) plus the GPT-5.x reasoning-effort tuning surface. `claude-sonnet-4.6` and `gemini-3.1-pro-preview` are exercised indirectly through cross-AI integration patterns in §12 and the multi-model decision matrix in `references/integration_patterns.md` §5.

### CP-004 | Explicit model selection (GPT-5.4)

#### Description

Confirm `--model gpt-5.4` succeeds for a frontier-reasoning prompt and an unsupported model name fails fast with a non-zero exit.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator preparing reproducible scripts, invoke Copilot CLI with the GPT-5.4 model pinned explicitly against the cli-copilot skill in this repository. Verify the supported model accepts the prompt and an unsupported model name is rejected with a clear non-zero exit. Return a concise pass/fail verdict with the main reason plus the parsed answer from the supported run.

Expected signals: supported `--model gpt-5.4` call exits 0 with a parseable plain-text answer. Unsupported `--model gpt-bogus-99` call exits non-zero with a model-related error in stdout/stderr.

Desired user-visible outcome: PASS verdict with the supported-model answer + a one-line note that the bogus-model call was correctly rejected.

#### Test Execution
> **Feature File:** [CP-004](02--multi-model/001-explicit-model-selection-gpt54.md)

### CP-005 | GPT-5.3-Codex for code generation

#### Description

Confirm `--model gpt-5.3-codex` returns a syntactically valid code snippet for a code-generation prompt.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator routing code generation to the codex-tuned model, invoke Copilot CLI with --model gpt-5.3-codex against the cli-copilot skill in this repository. Verify the model returns a syntactically valid Python function for the requested signature without side effects on the project tree. Return a concise pass/fail verdict with the main reason and the function signature line.

Expected signals: `EXIT=0`. Stdout contains a Python function definition matching the requested signature. `python3 -c "import ast; ast.parse(open('/tmp/cp-005-out.py').read())"` succeeds. `git status --porcelain` diff is empty.

Desired user-visible outcome: PASS verdict + the parsed function signature + a one-line note that AST parsing succeeded.

#### Test Execution
> **Feature File:** [CP-005](02--multi-model/002-gpt-codex-code-generation.md)

### CP-006 | Claude Opus 4.6 for architectural reasoning

#### Description

Confirm `--model claude-opus-4.6` returns a multi-option architectural comparison for a reasoning-heavy prompt.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator routing deep architectural reasoning to Claude Opus, invoke Copilot CLI with --model claude-opus-4.6 against the cli-copilot skill in this repository. Verify the model returns a structured comparison naming at least two distinct architectural approaches with trade-offs. Return a concise pass/fail verdict with the main reason and the names of the compared approaches.

Expected signals: `EXIT=0`. Response names at least 2 distinct architectural approaches. Each named approach has at least one trade-off bullet. Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + a 2-3 line summary listing the compared approaches and the recommended one.

#### Test Execution
> **Feature File:** [CP-006](02--multi-model/003-claude-opus-architectural-reasoning.md)

### CP-007 | Reasoning-effort tuning via `~/.copilot/config.json` **(DESTRUCTIVE, sandboxed `HOME`)**

#### Description

Confirm setting `"reasoning_effort": "xhigh"` in `~/.copilot/config.json` (sandboxed `HOME`) is read by `copilot -p --model gpt-5.4` and a paired call with `"low"` produces a faster but shorter response, all without touching the operator's real config file.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator tuning GPT-5.x reasoning depth for the same prompt, invoke Copilot CLI twice against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: write `"reasoning_effort": "xhigh"` to the sandbox `~/.copilot/config.json` and dispatch a complex reasoning prompt. Second call: rewrite the same field to `"low"` and re-dispatch the same prompt. Verify the xhigh response is meaningfully longer or more detailed than the low response, both calls exit 0 and the operator's real `~/.copilot/config.json` is unchanged. Return a concise pass/fail verdict with the main reason and the response-length comparison (xhigh chars vs low chars).

Expected signals: `EXIT_XHIGH=0`. `EXIT_LOW=0`. Sandbox config contains the documented field after each write. Xhigh response is meaningfully longer than low (e.g. >= 1.3x character count) OR contains more enumerated steps. Tripwire diff against the operator's real `~/.copilot/config.json` is empty.

Desired user-visible outcome: PASS verdict + the character-count comparison + a one-line note that no CLI flag exists for reasoning effort (config-file is the only non-interactive surface).

#### Test Execution
> **Feature File:** [CP-007](02--multi-model/004-reasoning-effort-config-tuning.md)

---

## 9. AUTOPILOT MODE

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CP-008 | Autopilot autonomous build **(DESTRUCTIVE, SANDBOXED)**

#### Description

Confirm `--allow-all-tools` plus `--no-ask-user` lets Autopilot complete a multi-step sandboxed build (create file, modify file, verify with bash) without operator intervention.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator running Autopilot for autonomous multi-step execution, invoke Copilot CLI with --allow-all-tools --no-ask-user against the cli-copilot skill in this repository, scoped to /tmp/cp-008-sandbox/. Ask Copilot to (1) create a small Python module greet.py with a greet(name) function, (2) add a docstring documenting the function, (3) verify by running `python3 -c "from greet import greet; print(greet('Copilot'))"` from inside the sandbox. Verify all three steps execute without operator approval prompts and the final python invocation prints the expected greeting. Constrain all writes to the sandbox directory. Return a concise pass/fail verdict with the main reason and the verification output.

Expected signals: `EXIT=0`. `/tmp/cp-008-sandbox/greet.py` exists with a `greet(name)` function and a docstring. The verification python call prints `Hello, Copilot!` (or equivalent). No operator prompt blocked stdin. Tripwire diff against project tree is empty.

Desired user-visible outcome: PASS verdict + the verification stdout line + a one-line note that all 3 Autopilot steps completed without approval prompts.

#### Test Execution
> **Feature File:** [CP-008](03--autopilot-mode/001-autopilot-autonomous-build.md)

### CP-009 | `--no-ask-user` autonomy contract under read-only constraint

#### Description

Confirm `--no-ask-user` honours its autonomy contract for a read-only prompt, Copilot returns a clear "I cannot do that without write access" or proceeds with read-only analysis instead of blocking on operator input.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator probing the autonomy contract, invoke Copilot CLI with --no-ask-user (without --allow-all-tools) against the cli-copilot skill in this repository for a prompt that asks for read-only analysis of references/cli_reference.md. Verify the call completes without operator interaction, returns a non-empty analysis and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and a one-line note about whether Copilot honoured the read-only autonomy contract or escalated.

Expected signals: `EXIT=0`. Stdout contains a multi-sentence analysis naming at least 2 documented flags from cli_reference.md. No operator prompt appears. Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + the named flags + a one-line note that read-only autonomy completed without escalation.

#### Test Execution
> **Feature File:** [CP-009](03--autopilot-mode/002-no-ask-user-autonomy-contract.md)

---

## 10. AGENT ROUTING

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. Coverage spans the two built-in non-cloud agents (`@Explore` read-only, `@Task` read-write) plus mid-session model switching. Cloud-routed `@copilot` is exercised in §14 CLOUD DELEGATION.

### CP-010 | `@Explore` read-only codebase mapping

#### Description

Confirm `As @Explore: ...` produces a read-only architectural summary naming real local files without mutating the working tree.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator using Copilot agent routing, dispatch the @Explore agent against the cli-copilot skill in this repository to produce a structured map of the references/ folder. Verify the answer names at least three real reference files with a one-line purpose for each. Verify the working tree is unchanged after the call. Return a concise pass/fail verdict with the main reason and the names of the files Copilot cited.

Expected signals: `EXIT=0`. Response names at least 3 of (`cli_reference.md`, `copilot_tools.md`, `agent_delegation.md`, `integration_patterns.md`). `git status --porcelain` diff is empty.

Desired user-visible outcome: PASS verdict + a 3-5 line summary listing the cited reference files and their purposes.

#### Test Execution
> **Feature File:** [CP-010](04--agent-routing/001-explore-agent-codebase-mapping.md)

### CP-011 | `@Task` read-write sandboxed implementation **(SANDBOXED)**

#### Description

Confirm `As @Task: ...` with `--allow-all-tools` implements a small documented function in the sandbox directory without touching the project tree.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator delegating implementation work, dispatch the @Task agent against the cli-copilot skill in this repository to implement a small documented function in /tmp/cp-011-sandbox/calc.py. Verify the resulting file exists, contains the requested function with a docstring and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the function signature line.

Expected signals: `EXIT=0`. `/tmp/cp-011-sandbox/calc.py` exists with the requested `add(a, b)` function and a docstring. `python3 -c "from calc import add; print(add(2, 3))"` from inside the sandbox prints `5`. Tripwire diff against project tree is empty.

Desired user-visible outcome: PASS verdict + the function signature + the verification stdout.

#### Test Execution
> **Feature File:** [CP-011](04--agent-routing/002-task-agent-sandboxed-implementation.md)

### CP-012 | Mid-session model switch via per-call `--model`

#### Description

Confirm two sequential `copilot -p` calls in the same operator session can target different models via `--model` and each model returns answers consistent with its strengths (Opus for deep reasoning, Sonnet for fast review).

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator switching models per task within one operator session, invoke Copilot CLI twice in sequence against the cli-copilot skill in this repository: first --model claude-opus-4.6 for a deep architectural question, then --model claude-sonnet-4.6 for a quick code-style review of a tiny snippet. Verify both calls exit 0, both return non-empty answers consistent with the requested model strength and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and a one-line summary per model call.

Expected signals: both calls exit 0. Opus response covers >= 2 architectural trade-offs. Sonnet response returns >= 1 specific style finding within ~5 seconds. Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + a one-line summary per model call.

#### Test Execution
> **Feature File:** [CP-012](04--agent-routing/003-mid-session-model-switch.md)

---

## 11. SESSION CONTINUITY

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. Both scenarios sandbox `HOME` so the operator's real `~/.copilot/` is never mutated.

### CP-013 | Repository memory recall **(DESTRUCTIVE, sandboxed `HOME`)**

#### Description

Confirm Copilot's repository memory persists a documented convention across two `-p` invocations in a sandboxed `HOME` and a follow-up call recalls it without touching the operator's real memory.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator running an isolated repo-memory persistence test, invoke Copilot CLI against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: ask Copilot to remember the project convention 'cli-copilot test marker is CP-013-MARKER for spec 048 wave 2'. Second call (in the same sandbox HOME): ask Copilot to recall any project conventions it knows about and report whether the marker is present. Verify the sandbox `~/.copilot/` directory contains memory artifacts after call 1 and call 2 surfaces the marker. Return a concise pass/fail verdict with the main reason and the recalled marker text.

Expected signals: `EXIT_SAVE=0`. Sandbox `~/.copilot/` contains memory artifacts after call 1 (any of `state/`, `memory.json` or equivalent persistence file). `EXIT_RECALL=0`. Recall response surfaces `CP-013-MARKER`. Tripwire diff against the operator's real `~/.copilot/` is empty.

Desired user-visible outcome: PASS verdict reporting the marker was both written and recalled inside the sandbox + the recalled marker text.

#### Test Execution
> **Feature File:** [CP-013](05--session-continuity/001-repository-memory-recall.md)

### CP-014 | Mid-session model switch persistence

#### Description

Confirm the documented selected-model surface (interactive `/model` selection writes back to `~/.copilot/config.json`) persists across two non-interactive `-p` invocations in a sandboxed `HOME`, sequential `--model claude-opus-4.6` then `--model gpt-5.3-codex` calls each report the requested model in their output, demonstrating the selection is honoured per-invocation.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator validating mid-session model-switch persistence, invoke Copilot CLI twice in sequence against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: --model claude-opus-4.6 with a prompt asking which model is responding. Second call: --model gpt-5.3-codex with the same prompt. Verify each response identifies the correct model (Anthropic Claude Opus 4.6 for the first, OpenAI GPT-5.3-Codex for the second) and the sandbox `~/.copilot/config.json` reflects the most recent model after each call (when written). Return a concise pass/fail verdict with the main reason and a one-line model-identification summary per call.

Expected signals: both calls exit 0. First response identifies Claude/Anthropic model family. Second response identifies GPT/OpenAI model family. Tripwire diff against operator's real `~/.copilot/` is empty.

Desired user-visible outcome: PASS verdict + a one-line per-call model identification.

#### Test Execution
> **Feature File:** [CP-014](05--session-continuity/002-mid-session-model-switch-persistence.md)

---

## 12. INTEGRATION PATTERNS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CP-015 | Cross-AI generate-review-fix cycle **(SANDBOXED)**

#### Description

Confirm two sequential Copilot calls (generate then fix, with an orchestrator-injected review note) produce two distinct sandbox artifacts and the fix addresses the review feedback. Mirrors the documented integration pattern in `references/integration_patterns.md` §2.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator running the generate-review-fix pattern documented in cli-copilot integration_patterns.md §2, dispatch two sequential Copilot calls against the cli-copilot skill in this repository, both scoped to /tmp/cp-015-sandbox/. First call: --model gpt-5.3-codex to generate a small Python module avg_list.py that averages a list of integers. Second call: --model claude-opus-4.6 with the orchestrator-supplied review note 'add explicit handling for empty list (return 0.0 instead of dividing by zero)' to ask Copilot to update the same file. Verify the second-pass file differs from the first-pass file and contains explicit empty-list handling. Return a concise pass/fail verdict with the main reason, the diff line count and a snippet of the empty-list handling.

Expected signals: both calls exit 0. V1 and v2 sandbox artifacts both exist. `diff v1 v2` produces non-empty output. V2 contains an explicit empty-list check (e.g. `if not lst:` or `len(lst) == 0`). Tripwire diff against project tree is empty.

Desired user-visible outcome: PASS verdict + the diff line count + a 2-3 line snippet showing the empty-list handling.

#### Test Execution
> **Feature File:** [CP-015](06--integration-patterns/001-cross-ai-generate-review-fix.md)

### CP-016 | MCP support discovery

#### Description

Confirm Copilot CLI surfaces its MCP support, either by listing connected MCP servers in response to a documented prompt or by acknowledging MCP capability per `references/copilot_tools.md` §2.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator probing Copilot's MCP integration surface, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and ask which MCP servers (if any) are currently connected and what categories of MCP capability the CLI supports per its documented feature surface. Verify the answer either (a) lists currently connected MCP servers or (b) acknowledges MCP support and explains how to connect a server, citing the documented capability from copilot_tools.md §2. Return a concise pass/fail verdict with the main reason and a one-line summary of the MCP-related content.

Expected signals: `EXIT=0`. Response mentions `MCP` or `Model Context Protocol`. Response either lists connected servers OR explains connection mechanism (e.g. config file, `/config`). Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + a one-line summary of MCP servers listed or the documented connection mechanism.

#### Test Execution
> **Feature File:** [CP-016](06--integration-patterns/002-mcp-support-discovery.md)

### CP-017 | Shell-wrapper same-invocation context injection **(DESTRUCTIVE, sandboxed instructions file)**

#### Description

Confirm the `cpx()` shell wrapper from `assets/shell_wrapper.md` prepends a managed `SPEC-KIT-COPILOT-CONTEXT` block to a `copilot -p` call when `SPECKIT_COPILOT_INSTRUCTIONS_PATH` points at a sandboxed instructions file, without touching the operator's real `~/.copilot/copilot-instructions.md`.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator validating same-invocation context injection per assets/shell_wrapper.md, source the documented cpx() function, point SPECKIT_COPILOT_INSTRUCTIONS_PATH at /tmp/cp-017-sandbox/copilot-instructions.md containing a documented SPEC-KIT-COPILOT-CONTEXT:BEGIN/END managed block with a unique marker 'CP-017-WRAPPER-MARKER' and dispatch a copilot -p prompt that asks Copilot to repeat any unique markers it sees in its custom instructions. Verify the wrapper prepends the marker into the prompt body, Copilot's answer surfaces the marker and the operator's real ~/.copilot/copilot-instructions.md is unchanged. Return a concise pass/fail verdict with the main reason and the recalled marker text.

Expected signals: `EXIT=0`. Sandbox instructions file is unchanged after the call (wrapper only reads). Response surfaces `CP-017-WRAPPER-MARKER`. Tripwire diff against operator's real `~/.copilot/copilot-instructions.md` is empty.

Desired user-visible outcome: PASS verdict + the recalled marker text + a one-line note that the wrapper succeeded without mutating real instructions.

#### Test Execution
> **Feature File:** [CP-017](06--integration-patterns/003-shell-wrapper-context-injection.md)

---

## 13. PROMPT TEMPLATES

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CP-018 | Prompt template substitution

#### Description

Confirm the Security Audit template from `assets/prompt_templates.md` §3 substitutes cleanly and Copilot returns severity-classified findings for an intentionally flawed snippet.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator using cli-copilot's documented prompt templates, take the Security Audit template from assets/prompt_templates.md §3, substitute [file] with /tmp/cp-018-snippet.py (a small Python file with an intentional eval() flaw), dispatch the resulting prompt to Copilot via --model gemini-3.1-pro-preview as documented in the template and verify the answer covers OWASP Top 10 framing and rates findings by severity. Return a concise pass/fail verdict with the main reason and the highest-severity finding.

Expected signals: `EXIT=0`. Response identifies the eval() flaw. Response includes at least one severity classifier (critical/high/medium/low or P0/P1/P2). Response references at least one OWASP-related concept (e.g. injection, untrusted input). Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + the highest-severity finding line + a one-line note that the template substituted cleanly.

#### Test Execution
> **Feature File:** [CP-018](07--prompt-templates/001-template-substitution.md)

### CP-019 | CLEAR quality card application

#### Description

Confirm applying RCAF (per the documented framework map in `assets/prompt_quality_card.md` §3) produces an answer that honours the requested Format slot.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator following cli-copilot's prompt-quality discipline, look up the documented framework for a Generation task in assets/prompt_quality_card.md §3 (expect RCAF). Build a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) and run the CLEAR 5-check before dispatch. Verify Copilot's answer follows the requested Format and addresses the Action without inventing scope. Return a concise pass/fail verdict with the main reason, the framework chosen and a one-line check that the requested Format was honoured.

Expected signals: `EXIT=0`. Response is a JSON object with exactly the requested keys (`name`, `purpose`, `flag`). Each key has a non-empty value. Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + a one-line note such as `framework=RCAF; format honoured (JSON keys: name, purpose, flag)`.

#### Test Execution
> **Feature File:** [CP-019](07--prompt-templates/002-clear-quality-card-application.md)

---

## 14. CLOUD DELEGATION

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. Both scenarios run serially because they share GitHub's cloud coding-agent quota.

### CP-020 | `/delegate` explicit cloud command **(DESTRUCTIVE, cloud write)**

#### Description

Confirm `/delegate <task>` inside the prompt body successfully pushes a small read-only analysis task to GitHub's cloud coding agent and returns a result that names files from the local repository context per `references/copilot_tools.md` §2 Cloud Delegation.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator validating the explicit cloud-delegation surface, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and use the /delegate command inside the prompt body to push a small read-only analysis task to GitHub's cloud agent: 'analyse the references/ folder structure and list the four reference filenames'. Verify the call completes (cloud round-trip may take longer than local), the response cites the four real reference filenames (cli_reference.md, copilot_tools.md, agent_delegation.md, integration_patterns.md) and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the cited filenames.

Expected signals: `EXIT=0`. Response cites at least 3 of (`cli_reference.md`, `copilot_tools.md`, `agent_delegation.md`, `integration_patterns.md`). Response indicates cloud routing (e.g. mentions `/delegate`, `cloud agent` or returns a delegation receipt). Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + the cited filenames + a one-line note that cloud delegation completed.

#### Test Execution
> **Feature File:** [CP-020](08--cloud-delegation/001-delegate-explicit-cloud.md)

### CP-021 | `&prompt` inline cloud shorthand **(DESTRUCTIVE, cloud write)**

#### Description

Confirm the `&<task>` inline shorthand inside the prompt body produces equivalent cloud-agent routing to `/delegate` per `references/copilot_tools.md` §2 Cloud Delegation. Confirm the response naturally surfaces the cloud-agent context.

#### Scenario Contract

Prompt summary: As a cross-AI orchestrator validating the inline cloud-delegation shorthand, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and use the &prompt shorthand inside the prompt body to push a small read-only analysis task to GitHub's cloud agent: '&summarise the role of the cli-copilot skill in 2-3 sentences and confirm you are running on a cloud agent'. Verify the call completes, the response provides the requested 2-3 sentence summary and the response indicates cloud-agent context (e.g. mentions cloud, remote, GitHub agent or returns a delegation receipt). Compare behaviour against /delegate (CP-020) and confirm the shorthand is functionally equivalent. Return a concise pass/fail verdict with the main reason and a one-line note comparing the &prompt vs /delegate routing.

Expected signals: `EXIT=0`. Response contains a 2-3 sentence cli-copilot summary. Response mentions cloud / remote / GitHub agent context. Behaviour is functionally equivalent to CP-020 (both produce cloud-routed responses). Tripwire diff is empty.

Desired user-visible outcome: PASS verdict + the 2-3 sentence summary + a one-line note that &prompt and /delegate behave equivalently.

#### Test Execution
> **Feature File:** [CP-021](08--cloud-delegation/002-ampersand-inline-cloud-shorthand.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

cli-copilot ships no in-repo automated test suite for the Copilot CLI binary itself (the binary is a third-party GitHub product and is exercised live during scenario execution). The skill's automated coverage is limited to the smart-router pseudocode, the schema documented in `references/cli_reference.md` and the documented self-invocation guard in SKILL.md §2. Scenarios in this playbook are therefore the primary regression surface for cli-copilot's documented behaviour.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `references/cli_reference.md` (schema documentation) | Non-interactive `-p`, `--allow-all-tools`, `--no-ask-user`, `--model`, reasoning-effort config-file surface, troubleshooting matrix | CP-001, CP-002, CP-003, CP-004, CP-005, CP-006, CP-007 |
| `references/copilot_tools.md` (capability catalog) | Autopilot, Repo Memory, Cloud Delegation, Multi-Provider models, MCP support | CP-008, CP-013, CP-016, CP-020, CP-021 |
| `references/agent_delegation.md` (agent catalog) | `@Explore`, `@Task`, Cloud Delegation routing, Custom Agents | CP-010, CP-011, CP-020, CP-021 |
| `references/integration_patterns.md` (cross-AI patterns) | Generate-review-fix, Multi-Model Strategy, Cloud Delegation, Plan-Then-Execute | CP-012, CP-014, CP-015 |
| `assets/prompt_templates.md` + `assets/prompt_quality_card.md` | Template substitution, framework selection, CLEAR 5-check | CP-018, CP-019 |
| `assets/shell_wrapper.md` (programmatic context wrapper) | `cpx()` wrapper, `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override, managed `SPEC-KIT-COPILOT-CONTEXT` block | CP-017 |
| `SKILL.md` §1-§2 (self-invocation guard) | `$COPILOT_SESSION_ID`, `GH_COPILOT_*`, process ancestry, `~/.copilot/state/<id>/lock` detection | Implicit precondition for ALL scenarios (Global Preconditions §2 item 5). No dedicated scenario because triggering the guard requires running this playbook from inside Copilot CLI itself, which is forbidden |
| SKILL.md §4 CONCURRENCY LIMIT | Hard cap at 5 parallel `copilot` processes (repo-safe default at 3) | Wave plans in §6 enforce a 3-process cap. Verified via `pgrep -f "copilot" | wc -l` in every parallel wave |

If automated tests for cli-copilot's smart-router pseudocode or self-invocation guard are added in a future spec, append the test module path here and map overlap to specific `CP-NNN` IDs.

---

## 16. FEATURE FILE INDEX

### CLI INVOCATION

- CP-001: [Direct prompt with non-interactive `-p` flag](01--cli-invocation/001-direct-prompt-non-interactive.md)
- CP-002: [`--allow-all-tools` sandboxed file write **(DESTRUCTIVE)**](01--cli-invocation/002-allow-all-tools-sandboxed-write.md)
- CP-003: [`--no-ask-user` autonomous read](01--cli-invocation/003-no-ask-user-autonomous-read.md)

### MULTI-MODEL

- CP-004: [Explicit model selection (GPT-5.4)](02--multi-model/001-explicit-model-selection-gpt54.md)
- CP-005: [GPT-5.3-Codex for code generation](02--multi-model/002-gpt-codex-code-generation.md)
- CP-006: [Claude Opus 4.6 for architectural reasoning](02--multi-model/003-claude-opus-architectural-reasoning.md)
- CP-007: [Reasoning-effort tuning via `~/.copilot/config.json` **(DESTRUCTIVE, sandboxed `HOME`)**](02--multi-model/004-reasoning-effort-config-tuning.md)

### AUTOPILOT MODE

- CP-008: [Autopilot autonomous build **(DESTRUCTIVE, SANDBOXED)**](03--autopilot-mode/001-autopilot-autonomous-build.md)
- CP-009: [`--no-ask-user` autonomy contract under read-only constraint](03--autopilot-mode/002-no-ask-user-autonomy-contract.md)

### AGENT ROUTING

- CP-010: [`@Explore` read-only codebase mapping](04--agent-routing/001-explore-agent-codebase-mapping.md)
- CP-011: [`@Task` read-write sandboxed implementation **(SANDBOXED)**](04--agent-routing/002-task-agent-sandboxed-implementation.md)
- CP-012: [Mid-session model switch via per-call `--model`](04--agent-routing/003-mid-session-model-switch.md)

### SESSION CONTINUITY

- CP-013: [Repository memory recall **(DESTRUCTIVE, sandboxed `HOME`)**](05--session-continuity/001-repository-memory-recall.md)
- CP-014: [Mid-session model switch persistence](05--session-continuity/002-mid-session-model-switch-persistence.md)

### INTEGRATION PATTERNS

- CP-015: [Cross-AI generate-review-fix cycle **(SANDBOXED)**](06--integration-patterns/001-cross-ai-generate-review-fix.md)
- CP-016: [MCP support discovery](06--integration-patterns/002-mcp-support-discovery.md)
- CP-017: [Shell-wrapper same-invocation context injection **(DESTRUCTIVE, sandboxed instructions file)**](06--integration-patterns/003-shell-wrapper-context-injection.md)

### PROMPT TEMPLATES

- CP-018: [Prompt template substitution](07--prompt-templates/001-template-substitution.md)
- CP-019: [CLEAR quality card application](07--prompt-templates/002-clear-quality-card-application.md)

### CLOUD DELEGATION

- CP-020: [`/delegate` explicit cloud command **(DESTRUCTIVE, cloud write)**](08--cloud-delegation/001-delegate-explicit-cloud.md)
- CP-021: [`&prompt` inline cloud shorthand **(DESTRUCTIVE, cloud write)**](08--cloud-delegation/002-ampersand-inline-cloud-shorthand.md)
