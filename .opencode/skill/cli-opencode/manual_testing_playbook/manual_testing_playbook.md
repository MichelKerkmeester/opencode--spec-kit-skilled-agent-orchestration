---
title: "cli-opencode: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the cli-opencode CLI orchestrator skill."
---

# cli-opencode: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real - not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual `opencode run` invocations, inspect real outputs, capture real exit codes and verify real behavior. The only acceptable classifications are PASS, FAIL or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

> **SELF-INVOCATION GUARD**: The cli-opencode skill is the only cli-* skill that targets the same binary that runs OpenCode itself. Use cases 1 and 3 must be invoked from a non-OpenCode runtime (Claude Code, Codex, Copilot, Gemini, raw shell). Use case 2 (parallel detached session) is the documented exception that lets an in-OpenCode operator spawn a SEPARATE session via `--share --port <N>` with explicit parallel-session keywords. The skill refuses any other in-OpenCode self-dispatch with the documented refusal message (see ADR-001, SKILL.md §2 and integration_patterns.md §5).

This document combines the full manual-validation contract for the `cli-opencode` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide. It explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-opencode` skill. The root document acts as the directory, review surface and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--cli-invocation/`
- `02--external-dispatch/`
- `03--multi-provider/`
- `04--agent-routing/`
- `05--session-continuity/`
- `06--integration-patterns/`
- `07--prompt-templates/`
- `08--parallel-detached/`
- `09--cross-repo-cross-server/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CLI INVOCATION (`CO-001..CO-005`)](#7--cli-invocation-co-001co-005)
- [8. EXTERNAL DISPATCH (`CO-006..CO-008`)](#8--external-dispatch-co-006co-008)
- [9. MULTI-PROVIDER (`CO-009..CO-012`)](#9--multi-provider-co-009co-012)
- [10. AGENT ROUTING (`CO-013..CO-017`, `CO-032..CO-034`)](#10--agent-routing-co-013co-017-co-032co-034)
- [11. SESSION CONTINUITY (`CO-018..CO-020`)](#11--session-continuity-co-018co-020)
- [12. INTEGRATION PATTERNS (`CO-021..CO-022`)](#12--integration-patterns-co-021co-022)
- [13. PROMPT TEMPLATES (`CO-023..CO-025`)](#13--prompt-templates-co-023co-025)
- [14. PARALLEL DETACHED (`CO-026..CO-028`)](#14--parallel-detached-co-026co-028)
- [15. CROSS-REPO AND CROSS-SERVER (`CO-029..CO-031`)](#15--cross-repo-and-cross-server-co-029co-031)
- [16. AUTOMATED TEST CROSS-REFERENCE](#16--automated-test-cross-reference)
- [17. FEATURE FILE INDEX](#17--feature-file-index)

---

## 1. OVERVIEW

This playbook provides 34 deterministic scenarios across 9 categories validating the `cli-opencode` skill surface. Each feature keeps its global `CO-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-04-26): Covers the canonical default invocation (`opencode-go/deepseek-v4-pro` + `--variant high` + `--agent general` + `--format json`), the three documented use cases (external dispatch, parallel detached, cross-AI handback per ADR-002), the multi-provider matrix (opencode-go default with full variant range, deepseek direct API), the 8-agent routing surface (general / context / orchestrate / write / review / debug / deep-research / deep-review / ultra-think), session continuity surfaces (`-c`, `-s <id>`, `--fork`, `--share` gate), the 13-template inventory plus CLEAR quality card, the parallel-detached exception path with `</dev/null` worker farms, cross-repo dispatch via `--dir` and cross-server dispatch via `--attach`. Self-invocation refusal (ADR-001) is enforced upstream by the skill's layered detection guard and is exercised in CO-008 (refusal path) and CO-031 (cross-repo nested guard) respectively. Destructive scenarios are limited to operator-confirmed `--share` flows (CHK-033). The playbook never publishes share URLs without explicit operator approval.

### Realistic Test Model

1. A realistic user request is given to an orchestrator running on a non-OpenCode runtime (Claude Code, Codex, Copilot, Gemini or raw shell), OR an in-OpenCode operator with explicit parallel-session keywords.
2. The orchestrator decides whether to delegate to OpenCode CLI via cli-opencode, picks the right model + agent + variant + format + dir and constructs a Role -> Context -> Action -> Format prompt per the prompt quality card.
3. The operator captures both the dispatch command and the user-visible outcome (JSON event stream parsed, tool.calls surfaced, session.completed summary).
4. The scenario passes only when the dispatch is sound, the OpenCode output matches the expected signals and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the delegation
- The orchestrator brief or OpenCode-facing prompt that should drive the test
- The expected execution process, including model + agent + variant + format + dir choices and any session-management decisions
- The desired user-visible outcome
- The implementation or skill-doc anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and contains `.git/`.
2. OpenCode CLI is installed and on PATH: `command -v opencode` returns a non-empty path. If absent, install via `brew install opencode` (macOS) or `curl -fsSL https://opencode.ai/install | bash`.
3. OpenCode CLI version is at or near the v1.3.17 baseline pinned in `references/cli_reference.md`. Drift handled per `references/cli_reference.md` §9.
4. The GitHub Copilot subscription is active and registered in `opencode auth list` (the canonical default `opencode-go/deepseek-v4-pro` resolves through it). The `opencode-go/deepseek-v4-pro` Anthropic alternative also resolves through the same OAuth (no separate Anthropic credentials required). Multi-provider scenarios additionally need: opencode-go subscription registered when exercising `opencode-go/deepseek-v4-pro` and direct DeepSeek API credentials (`DEEPSEEK_API_KEY` / `auth login deepseek`) when exercising `deepseek/...`.
5. The active runtime for use case 1 and 3 scenarios is NOT OpenCode itself. Confirm by checking no `OPENCODE_*` env vars are set: `env | grep -q '^OPENCODE_' && echo IN-OPENCODE || echo OK`. Use case 2 scenarios (CO-026, CO-027, CO-028) explicitly include the parallel-session keywords required to permit the dispatch from inside OpenCode.
6. The skill's reference and asset files exist at `.opencode/skill/cli-opencode/{references,assets}/` so prompt-quality, template and routing scenarios resolve.
7. The project's MCP servers (Spec Kit Memory, CocoIndex Code) are registered in `opencode.json` so use case 1 (CO-006) and use case 3 (CO-021, CO-022) scenarios can call `memory_health`, CocoIndex search and `memory_search`.
8. The operator's repo root resolves via `REPO_ROOT="$(pwd)"` (run from the project root). Most scenarios pass `--dir "$(pwd)"` directly so they portably target whichever repo the operator runs them in. The `<repo-root>` placeholders in prose refer to the same value. Adapt to a different absolute path only if a scenario explicitly requires a non-default repo (e.g., CO-029 cross-repo dispatch derives a sibling path via `dirname "$(pwd)"`).
9. Destructive scenarios involving `--share` (CO-026, CO-027, CO-028) MUST follow strict sandboxing and recovery rules. Each MUST run with `--dir /tmp/co-share-sandbox-NNN/` (where NNN is the scenario ID). Each MUST NOT run with `--dir` pointing at the operator project tree. Each MUST NOT publish the share URL to anyone without explicit operator confirmation per CHK-033. Recovery is mandatory after every run (pass or fail). Step (a) revoke every captured share URL via `opencode session revoke ${SESSION_ID}`. Step (b) remove the sandbox tmpdir via `rm -rf /tmp/co-share-sandbox-NNN/`. The test only validates the session-creation path. No real URL publication occurs.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript including the exact `opencode run` invocation with all flags
- The user request that triggered the delegation
- The orchestrator-side reasoning for model + agent + variant + format + dir selection
- The Role -> Context -> Action -> Format prompt actually dispatched (not just paraphrased)
- OpenCode JSON event stream captured to file (`.jsonl`)
- Exit code from `opencode run`
- Session id captured from the `session.started` event
- The session.completed payload summary
- The final user-facing outcome and a PASS, PARTIAL or FAIL verdict with rationale
- For destructive `--share` scenarios, capture explicit operator confirmation per CHK-033 (or notation that the share URL was NOT published)

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `opencode run [args] "<prompt>"` (the canonical non-interactive invocation).
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `As @<agent>: <instruction>` when the prompt-time inline routing pattern is used (per `references/agent_delegation.md` §5).
- `->` separates sequential steps.
- All `opencode run` invocations MUST pipe to a `.jsonl` file with `2>&1` to capture both the JSON event stream and any stderr.
- File references inside dispatched prompts use `@/absolute/path` or `@./relative/path` notation (sk-code-review compatible).
- Memory Epilogue references use `<!-- MEMORY_HANDBACK_START -->` / `<!-- MEMORY_HANDBACK_END -->` HTML comment delimiters.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence including command transcripts, JSON event streams and captured session ids
4. Feature-to-scenario coverage map (every CO-NNN appears in section 17)
5. Triage notes for all non-pass outcomes including authentication failures, version drift and self-invocation refusals

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (especially `OPENCODE_*` env unset for use cases 1 and 3, parallel-session keywords present for use case 2 and the project MCP servers registered).
2. Prompt and command sequence were executed as written, with the documented model + agent + variant + format + dir.
3. Expected signals are present in the captured JSON event stream (session.started, message.delta, tool.call, session.completed events).
4. Evidence is complete and readable, including stderr captured via `2>&1` when documented.
5. Outcome rationale is explicit and references the user-visible deliverable (final summary, tool.call payloads, captured session id).

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete (e.g., JSON event captured but session id missing)
- `FAIL`: expected behavior missing, contradictory output, self-invocation guard tripped when it should not have, parallel-session keywords missing when needed or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (CO-001 base invocation, CO-008 self-invocation refusal, CO-013 general agent route or CO-026 parallel detached session) forces the feature verdict to `FAIL` and blocks release.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES == 34`).
4. No unresolved blocking triage item remains.
5. Self-invocation guard has been tested at least once (CO-008) and refused correctly.
6. The cross-repo nested guard (CO-031) has confirmed cross-repo alone does NOT bypass the self-invocation refusal.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats (provider availability, agent definition presence, parallel-session keyword presence) in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself. Because every scenario dispatches the same `opencode` binary through the same external-AI orchestrator (or in-OpenCode operator for use case 2), wave planning focuses on cost, rate-limit, port allocation and parallel-session isolation rather than runtime concurrency limits.

### Operational Rules

1. Probe runtime capacity at start - confirm OpenCode CLI version, provider auth, MCP server registration and budget headroom.
2. Reserve one external-AI conductor (Claude Code, Codex, Copilot, Gemini or raw shell) for use cases 1 and 3. Never use OpenCode itself as the conductor for those.
3. Saturate remaining worker slots only when scenarios are non-destructive AND independent.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run parallel detached scenarios (CO-026, CO-027, CO-028) in a dedicated wave with isolated port range (e.g., 4096-4299) to avoid port collisions with other workloads.
6. After each wave, save context and evidence (JSON event streams, session ids, ratio computations), then begin the next wave.
7. Record utilization table, per-feature file references and evidence paths in the final report.
8. Operator confirmation required per CHK-033 before any `--share` URL is actually published. The playbook validates session creation only.

### Recommended Wave Plan

- **Wave 1** (parallel-safe, read-only, fast): CO-001..CO-005 (CLI invocation), CO-009 (opencode-go default), CO-013..CO-017 (agent routing), CO-018..CO-020 (session continuity), CO-023..CO-025 (prompt templates), CO-029, CO-030, CO-031 (cross-repo plus nested guard).
- **Wave 2** (multi-provider, requires extra provider auth): CO-007 (Codex calling), CO-010 (OpenAI), CO-011 (Google), CO-012 (variant comparison).
- **Wave 3** (use-case-specific): CO-006 (Claude Code calling MCP), CO-008 (self-invocation refusal), CO-021 (cross-AI handback), CO-022 (memory epilogue).
- **Wave 4** (parallel detached, port-isolated): CO-026 (parallel detached session), CO-027 (worker farm with `</dev/null`), CO-028 (ablation suite).

### What Belongs In Per-Feature Files

- Real user request (the natural-language input to the external-AI conductor or in-OpenCode operator)
- Prompt field following the Role -> Context -> Action -> Format contract
- Expected delegation routing including model id, agent slug, variant level and format
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints (especially parallel-session keyword requirements and CHK-033 share URL gating)

---

## 7. CLI INVOCATION (`CO-001..CO-005`)

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises the cli-opencode default invocation shape (model + agent + variant + format + dir) plus output formats, file attachments and diagnostic flags.

### CO-001 | Base non-interactive invocation

#### Description

Verify the canonical `opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir <repo-root> "<prompt>"` returns a parseable JSON event stream and exits 0 from a non-OpenCode runtime.

#### Scenario Contract

Prompt summary: As an external-AI conductor dispatching a fresh OpenCode session via the cli-opencode default invocation shape, send a short request that exercises the full plugin/skill/MCP runtime. Verify the JSON event stream emits a session.started, at least one message.delta and a session.completed event and the process exits 0.

Expected signals: `command -v opencode` returns a path. No OPENCODE_* env vars set. JSON event stream contains session.started plus session.completed. Exit 0. Runtime under 90s.

#### Test Execution

> **Feature File:** [CO-001](01--cli-invocation/001-base-non-interactive-invocation.md)

### CO-002 | Output format default vs json

#### Description

Verify `--format default` returns formatted human-readable output and `--format json` returns a parseable newline-delimited event stream for the same prompt.

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying both opencode run output formats are intact, dispatch the same short prompt twice with --format default and --format json, then compare. Verify the default output is human-readable and the JSON output parses with jq and contains the documented event shape.

Expected signals: Both formats exit 0. Default output mentions the expected concept. JSON output enumerates session.started + message.delta + session.completed events.

#### Test Execution

> **Feature File:** [CO-002](01--cli-invocation/002-format-default-vs-json.md)

### CO-003 | Working directory pinning via --dir

#### Description

Verify `--dir <path>` pins the dispatched session's working directory rather than inheriting the caller's CWD, even when the caller is in a different directory.

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying --dir pinning works, change to /tmp before dispatching, but pin --dir to the Public repo root. Ask the dispatched session to use its bash tool to print the working directory and the first three entries it sees. Verify the working directory matches the pinned --dir, not /tmp.

Expected signals: Dispatched session reports CWD as the pinned path. Tool.result payloads do NOT mention `/tmp`. Project files (e.g., `AGENTS.md`, `.opencode/`) appear in the listing.

#### Test Execution

> **Feature File:** [CO-003](01--cli-invocation/003-dir-flag-working-directory.md)

### CO-004 | File attachment via -f / --file flag

#### Description

Verify `-f <path>` attaches a file to the message and the dispatched session references its contents in its reply without requiring inline embedding in the prompt body.

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying file attachment works without inline pasting, write a tiny TypeScript snippet to /tmp/co-004-sample.ts and dispatch opencode run with -f /tmp/co-004-sample.ts and a prompt that asks the session to summarize the attached file's purpose in one sentence. Verify the reply names the function defined in the attachment.

Expected signals: Dispatch exits 0. Reply mentions the unique function name `helloWorld_co004` from the attachment.

#### Test Execution

> **Feature File:** [CO-004](01--cli-invocation/004-file-attachment-via-f-flag.md)

### CO-005 | Plugin disable and verbose logs

#### Description

Verify `--pure` runs without external plugins, `--print-logs --log-level DEBUG` streams verbose logs to stderr and the stdout JSON event stream remains parseable in both cases.

#### Scenario Contract

Prompt summary: As an external-AI conductor exercising the diagnostic flag surface, dispatch the same short prompt three times: (1) baseline default. (2) with --pure to disable plugins. (3) with --print-logs --log-level DEBUG to capture verbose logs. Verify (1) and (3) produce parseable JSON event streams on stdout, (2) exits without plugin loader errors and (3) writes a non-empty stderr log.

Expected signals: All three exit 0. Baseline + debug stdout JSON parseable. --pure stderr has no plugin errors. --debug stderr is non-empty.

#### Test Execution

> **Feature File:** [CO-005](01--cli-invocation/005-pure-and-print-logs.md)

---

## 8. EXTERNAL DISPATCH (`CO-006..CO-008`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. Use case 1 (per ADR-002) is the canonical cross-AI dispatch path. The category exercises Claude Code calling, Codex calling and the self-invocation refusal that protects against circular dispatch.

### CO-006 | External dispatch from Claude Code into OpenCode

#### Description

Verify a Claude Code-led dispatch via cli-opencode reaches a fresh OpenCode session that loads the project's full plugin / skill / MCP runtime, with the dispatched session demonstrating access to a project-specific MCP tool (memory_health) it could not call without the runtime.

#### Scenario Contract

Prompt summary: You are Claude Code dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1. Goal: have OpenCode call the memory_health MCP tool and return the database status. Context: spec folder `<repo-root>/.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/` (pre-approved, skip Gate 3). Plugin runtime required (Spec Kit Memory MCP). Constraints: must load system-spec-kit skill. Must call memory_health and return its result. Success criteria: dispatched session emits a tool.call event for memory_health, returns the database status. The session.completed event includes the status summary. Memory Epilogue is NOT required for this test.

Expected signals: Dispatch exits 0. Tool.call event for memory_health appears. Session.completed references the database status.

#### Test Execution

> **Feature File:** [CO-006](02--external-dispatch/001-from-claude-code.md)

### CO-007 | External dispatch from Codex into OpenCode (use case 1)

#### Description

Verify a Codex-originated cli-opencode dispatch routes to use case 1 (general full-runtime) when the prompt does not name a spec-kit subsystem and the dispatched OpenCode session loads the project plugin runtime to call CocoIndex semantic search.

#### Scenario Contract

Prompt summary: You are Codex dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1. Goal: have OpenCode confirm CocoIndex semantic search MCP is loaded and reachable, then run a single small semantic search to validate. Context: this is use case 1 (general full-runtime), not use case 3 (spec-kit handback).

Expected signals: Dispatch exits 0. Tool.call event for CocoIndex search MCP appears. Session.completed references the search snippets.

#### Test Execution

> **Feature File:** [CO-007](02--external-dispatch/002-from-codex-handback.md)

### CO-008 | Self-invocation guard refusal (ADR-001)

#### Description

Verify the cli-opencode self-invocation guard (ADR-001 layered detection: env + ancestry + lockfile) refuses a dispatch when the originating runtime IS OpenCode AND the prompt does NOT include parallel-session keywords and the refusal message includes the three documented remediation options.

#### Scenario Contract

Prompt summary: As an in-OpenCode operator simulating a self-dispatch attempt, export OPENCODE_CONFIG_DIR=/tmp/co-008-fake to trip the layer 1 detection signal, then attempt to invoke cli-opencode for a generic dispatch (no parallel-session keywords). Verify the skill refuses with the documented message including all three remediation options.

Expected signals: Layer 1 (env var) detection trips. Refusal message in references/integration_patterns.md §5. All three remediation options documented (sibling cli-*, fresh shell, parallel-session keywords). No real opencode run dispatched.

#### Test Execution

> **Feature File:** [CO-008](02--external-dispatch/003-self-invocation-refusal.md)

---

## 9. MULTI-PROVIDER (`CO-011..CO-012`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises the documented provider matrix (opencode-go default routing, deepseek direct API) plus the variant-level reasoning effort range.

### CO-011 | deepseek direct API (deepseek-v4-pro)

#### Description

Verify `--model deepseek/deepseek-v4-pro --variant high` validates the deepseek direct API surface (bypasses opencode-go), resolves correctly, and produces a coherent response.

#### Scenario Contract

Prompt summary: As an external-AI conductor exercising the direct deepseek provider, dispatch --model deepseek/deepseek-v4-pro --variant high with a small implementation-planning prompt. Verify the dispatch exits 0 and the JSON event stream identifies the model as deepseek-v4-pro.

Expected signals: Exit 0. Model id `deepseek-v4-pro` in session.completed. Response is a coherent paragraph (non-empty, not an error).

#### Test Execution

> **Feature File:** [CO-011](03--multi-provider/003-deepseek-direct-api.md)

### CO-012 | Variant levels (minimal/low/medium/high/max)

#### Description

Verify `--variant minimal` and `--variant max` produce materially different response depth for the same prompt, proving the variant flag actually drives provider reasoning effort rather than being a no-op.

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying the variant flag truly drives reasoning depth, dispatch the same multi-dimensional architecture trade-off prompt twice with --variant minimal and --variant max. Verify both runs exit 0, the max-variant response is at least 2x longer than the minimal response and the max response weighs at least 2 more dimensions than the minimal response.

Expected signals: Both exit 0. Max-variant byte count >= 2x minimal-variant byte count. Max-variant covers more dimensions.

#### Test Execution

> **Feature File:** [CO-012](03--multi-provider/004-variant-levels-comparison.md)

---

## 10. AGENT ROUTING (`CO-013..CO-017`, `CO-032..CO-034`)

This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract. cli-opencode distinguishes 4 primary agents (directly invokable via --agent: general + plan as OpenCode built-ins; orchestrate + ultra-think as repo-defined primaries) from N subagents (context, review, write, debug, deep-research, deep-review, improve-agent, improve-prompt) which dispatch as Task subagents from a primary. CO-013..CO-017 + CO-032..CO-034 exercise both surfaces — direct primary invocation and primary-dispatches-subagent routing.

### CO-013 | General agent default route

#### Description

Verify `--agent general` loads the project's general agent definition from `.opencode/agent/general.md` and the dispatched session demonstrates implementation-style behavior with full read/write/dispatch tool permissions.

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying the general-agent default route, dispatch --agent general with a prompt that requires a Read tool call against a small project file and a multi-step reasoning summary. Verify the JSON event stream shows a tool.call for Read, the response references content from the file and the agent slug general is identified in the session metadata.

Expected signals: Exit 0. Read tool.call appears. Agent slug `general` in session metadata. Response references the read file's content.

#### Test Execution

> **Feature File:** [CO-013](04--agent-routing/001-general-agent-default.md)

### CO-014 | Context LEAF agent (read-only)

#### Description

Verify `--agent context` produces a structured architecture map of a target directory AND enforces the LEAF read-only constraint (no sub-dispatches, no writes, mtime-stable target files).

#### Scenario Contract

Prompt summary: As an external-AI conductor needing a safe read-only architecture map of an unfamiliar module, dispatch --agent context against .opencode/skill/cli-opencode/. Snapshot mtimes before and after. Verify the response identifies SKILL.md as the entry point, references/ and assets/ as supporting structure and that no mtimes changed and no Edit/Write tool.call events appear.

Expected signals: Exit 0. Mtime diff is empty. No Edit/Write tool.calls. Response identifies entry point + supporting structure.

#### Test Execution

> **Feature File:** [CO-014](04--agent-routing/002-context-leaf-agent.md)

### CO-015 | Review agent security audit

#### Description

Verify `--agent review` produces severity-tagged security findings (P0/P1/P2 OR critical/high/medium/low) with file:line citations against a target file with an obvious vulnerability, AND respects the read-only sandbox constraint.

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting an independent security audit before merging, write a small TS file with at least one obvious vulnerability to /tmp/co-015-target.ts. Dispatch --agent review against the file with an OWASP checklist (XSS, injection, auth bypass, hardcoded secrets). Verify the response surfaces findings with severity tags and line references and that the target file mtime does NOT change.

Expected signals: Exit 0. Severity tag present. Line reference present. Target file mtime unchanged. Zero Edit/Write tool.calls.

#### Test Execution

> **Feature File:** [CO-015](04--agent-routing/003-review-agent-security-audit.md)

### CO-016 | Write agent documentation generation

#### Description

Verify `--agent write` loads the sk-doc skill, applies the appropriate template (e.g., readme_template.md), runs the DQI score and produces a documentation file at the requested path within its workspace-write permission.

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting a template-driven README for a small documentation skill, dispatch --agent write to generate /tmp/co-016-readme/README.md for a fictional skill called Demo Skill. Verify the dispatch loads sk-doc, applies readme_template.md, writes the README file and the file contains a TABLE OF CONTENTS plus emoji-prefixed H2 sections.

Expected signals: Exit 0. Write tool.call for the README path. README file exists with TOC and >= 3 emoji-prefixed H2 headers.

#### Test Execution

> **Feature File:** [CO-016](04--agent-routing/004-write-agent-doc-generation.md)

### CO-017 | Ultra-think multi-strategy planning

#### Description

Verify `--agent ultra-think` produces at least 3 distinct solution strategies scored across at least 3 dimensions with an explicit recommendation, AND respects the planning-only constraint (no file modifications).

#### Scenario Contract

Prompt summary: As an external-AI conductor planning a CommonJS-to-ESM migration of a single hypothetical module, dispatch --agent ultra-think to compare three strategies (big-bang rewrite, incremental wrapper, dual-build). Verify the response presents three distinct strategies, scores each across risk/effort/timeline/reversibility, recommends one with rationale and does NOT modify any files in the repo.

Expected signals: Exit 0. Sentinel mtimes unchanged. Zero Edit/Write tool.calls. >=3 distinct strategies. >=3 dimensions scored. Explicit recommendation.

#### Test Execution

> **Feature File:** [CO-017](04--agent-routing/005-ultra-think-multi-strategy.md)

### CO-032 | Deep-research agent iteration loop

#### Description

Verify `--agent deep-research` executes a single research iteration against externalized JSONL state at a temp path, surfaces findings or hypotheses in the response, AND respects the LEAF constraint (no nested Task-tool dispatches).

#### Scenario Contract

Prompt summary: As an external-AI conductor (or `/spec_kit:deep-research` simulator) running a single research iteration, dispatch `opencode run --agent deep-research --variant high --format json --dir <repo-root>` with state externalized at `/tmp/co-032-state.jsonl` and a prompt asking for at least 2 findings or open hypotheses. Verify the dispatch exits 0, the JSON event stream contains a session.completed event referencing findings or hypotheses, and that no Task or sub-agent tool.call events appear. Return a verdict naming the iteration findings count and confirming LEAF compliance.

Expected signals: Exit 0. JSON parseable. >= 2 findings or hypotheses. Zero Task tool.call events. Zero nested `opencode run` invocations. Dispatch line includes `--agent deep-research`.

#### Test Execution

> **Feature File:** [CO-032](04--agent-routing/006-deep-research-agent-iterations.md)

### CO-033 | Deep-review agent audit loop

#### Description

Verify `--agent deep-review` executes a single review iteration that surfaces at least one severity-tagged finding (P0, P1, or P2) with file or line citation, AND respects the LEAF constraint (no nested Task-tool dispatches).

#### Scenario Contract

Prompt summary: As an external-AI conductor (or `/spec_kit:deep-review` simulator) running a single audit iteration, dispatch `opencode run --agent deep-review --variant high --format json --dir <repo-root>` against `@./.opencode/skill/cli-opencode/SKILL.md` with state externalized at `/tmp/co-033-state.jsonl`. Verify the dispatch exits 0, the JSON event stream contains a session.completed event with severity-tagged findings, and that no Task or sub-agent tool.call events appear. Return a verdict naming the highest-severity finding and confirming LEAF compliance.

Expected signals: Exit 0. JSON parseable. >= 1 severity tag (P0, P1, or P2). >= 1 file or line citation. Zero Task tool.call events. Zero nested `opencode run` invocations. Dispatch line includes `--agent deep-review`.

#### Test Execution

> **Feature File:** [CO-033](04--agent-routing/007-deep-review-agent-audit.md)

### CO-034 | Orchestrate agent multi-agent coordination

#### Description

Verify `--agent orchestrate` produces a sequenced multi-agent plan naming at least 3 distinct OpenCode agent slugs with explicit handoffs, AND that the JSON event stream contains zero nested `opencode run` tool.call events (per agent_delegation.md §6).

#### Scenario Contract

Prompt summary: As an external-AI conductor facing a complex task that requires multiple OpenCode specializations in sequence, dispatch `opencode run --agent orchestrate --variant high --format json --dir <repo-root>` and ask for a decomposition naming at least 3 specialist agents (for example context, review, write, ultra-think) and explicit handoffs. Verify the response names at least 3 distinct agent slugs in sequence with handoffs and that zero nested opencode-run tool.calls appear. Return a verdict naming the agents in planned order and confirming the no-nested-run constraint.

Expected signals: Exit 0. >= 3 distinct agent slugs in sequence. Handoffs described. Zero nested `opencode run` tool.call events. Working tree clean. Dispatch line includes `--agent orchestrate`.

#### Test Execution

> **Feature File:** [CO-034](04--agent-routing/008-orchestrate-agent-multi-agent.md)

---

## 11. SESSION CONTINUITY (`CO-018..CO-020`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises the documented session continuity surfaces, `-c`/`--continue` (resume last), `-s <id>`/`--session <id>` (resume by id) and `--fork` (branch a session). Plus the `--share` URL gate (CHK-033).

### CO-018 | Continue last session via -c

#### Description

Verify `-c` (alias `--continue`) resumes the most recent session in the project and the follow-up dispatch has direct access to the prior turn's context without re-explanation.

#### Scenario Contract

Prompt summary: As an external-AI conductor running a 2-step opencode workflow, dispatch the first opencode run to define a unique technical concept (the "snowflake reducer") in one paragraph. Then dispatch the second opencode run with -c and a follow-up question about the concept. Verify the second response references the snowflake reducer concept without asking for re-explanation.

Expected signals: Both exit 0. Second turn references "snowflake reducer" or its invariant. No re-explanation requests.

#### Test Execution

> **Feature File:** [CO-018](05--session-continuity/001-continue-last-session.md)

### CO-019 | Resume specific session by id (-s)

#### Description

Verify `-s <id>` (alias `--session <id>`) resumes the named session by its captured id and the resumed turn has access to that session's content.

#### Scenario Contract

Prompt summary: As an external-AI conductor managing a captured session id, dispatch a first opencode run with --format json and use jq to extract session_id from the session.started event. Then dispatch a second opencode run with -s <captured-id> and a follow-up question that requires access to the first turn's content.

Expected signals: Both exit 0. SID captured non-empty. Second turn references prior content. Second turn session id matches captured SID.

#### Test Execution

> **Feature File:** [CO-019](05--session-continuity/002-resume-by-session-id.md)

### CO-020 | Fork session and share URL gate

#### Description

Verify `--fork --continue` creates a new session id distinct from the parent, AND that `--share` is documented as opt-in requiring operator confirmation per CHK-033 (NEVER rule 2).

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying both --fork and --share contracts, (1) dispatch a first turn and capture its session id, (2) dispatch a second turn with --fork --continue and capture the new session id, (3) verify the new session id is distinct from the first turn's id, AND (4) grep the cli-opencode SKILL.md NEVER rules to confirm --share is documented as opt-in requiring operator confirmation per CHK-033.

Expected signals: Both exit 0. SID1 != SID2. SKILL.md NEVER rule 2 cites the `--share` confirmation requirement. CHK-033 referenced.

#### Test Execution

> **Feature File:** [CO-020](05--session-continuity/003-fork-and-share.md)

---

## 12. INTEGRATION PATTERNS (`CO-021..CO-022`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises the documented integration patterns. Use case 3 cross-AI handback (Codex calling OpenCode for spec-kit memory) and the Memory Epilogue handback to `generate-context.js`.

### CO-021 | Cross-AI orchestration handback (use case 3)

#### Description

Verify a Codex-originated cli-opencode dispatch routes to use case 3 (cross-AI handback) when the prompt names a spec-kit subsystem (memory_search) and the dispatched OpenCode session calls the named MCP tool successfully.

#### Scenario Contract

Prompt summary: You are Codex (or a non-Anthropic external runtime) dispatching from a fresh shell into OpenCode for a spec-kit-specific workflow via cli-opencode use case 3. Goal: have OpenCode call memory_search for the query "self-invocation guard" and return the top 3 results filtered by importance_tier in [critical, important].

Expected signals: Exit 0. Tool.call for memory_search appears. Session.completed references results (or no-results attestation).

#### Test Execution

> **Feature File:** [CO-021](06--integration-patterns/001-cross-ai-handback-codex.md)

### CO-022 | Memory Epilogue handback to generate-context.js

#### Description

Verify a cli-opencode dispatch with the Template 13 Memory Epilogue produces a properly-delimited MEMORY_HANDBACK block containing a structured JSON payload that parses successfully and includes the documented canonical fields.

#### Scenario Contract

Prompt summary: As an external-AI conductor preserving context from a cli-opencode dispatch, dispatch a small task with the Template 13 Memory Epilogue appended. Verify the response includes the MEMORY_HANDBACK_START / END delimiters, the contents between them parse as valid JSON and the JSON includes specFolder, sessionSummary, user_prompts, observations, recent_context, FILES and nextSteps.

Expected signals: Exit 0. Exactly one MEMORY_HANDBACK delimiter pair. Payload parses as JSON. Canonical fields present. NextSteps non-empty.

#### Test Execution

> **Feature File:** [CO-022](06--integration-patterns/002-memory-epilogue-handback.md)

---

## 13. PROMPT TEMPLATES (`CO-023..CO-025`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises the 13-template inventory in `assets/prompt_templates.md`, the CLEAR quality card and a real template-driven dispatch.

### CO-023 | Prompt templates inventory (13 templates)

#### Description

Verify `assets/prompt_templates.md` contains exactly 13 numbered templates (TEMPLATE 1 through TEMPLATE 13), each with a framework tag and an invocation shape (or refusal-message body for Template 12, Memory Epilogue for Template 13).

#### Scenario Contract

Prompt summary: As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt_templates.md and count the TEMPLATE N section headers. Verify all 13 templates are present, each named template includes a Framework tag and each invocation template includes a bash code block (Templates 1-11).

Expected signals: 13 unique TEMPLATE headers. >=12 Framework lines. >=11 bash code blocks. Templates 12 and 13 present.

#### Test Execution

> **Feature File:** [CO-023](07--prompt-templates/001-templates-inventory.md)

### CO-024 | CLEAR quality card 5-check

#### Description

Verify `assets/prompt_quality_card.md` documents the CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), the 7-framework selection table, the task-to-framework map and the escalation rule to `@improve-prompt` when complexity is `>= 7/10`.

#### Scenario Contract

Prompt summary: As an external-AI conductor about to construct a non-trivial OpenCode dispatch prompt, load the prompt quality card and verify it explicitly documents (a) the CLEAR 5-check, (b) the framework selection table with all 7 frameworks and complexity bands, (c) the task-to-framework map and (d) the escalation rule for complexity >= 7/10 to @improve-prompt.

Expected signals: All 5 CLEAR criteria listed. 7 frameworks present. Task map present. Escalation rule with threshold 7 present. @improve-prompt referenced.

#### Test Execution

> **Feature File:** [CO-024](07--prompt-templates/002-clear-quality-card.md)

### CO-025 | Template applied to a real dispatch

#### Description

Verify TEMPLATE 5 (Code Review, TIDD-EC, --agent review) populated with a real target file dispatches successfully and produces severity-tagged findings with file:line citations matching the template's documented output shape.

#### Scenario Contract

Prompt summary: As an external-AI conductor reusing a vetted template instead of authoring from scratch, load TEMPLATE 5 (Code Review, TIDD-EC framework, --agent review) from assets/prompt_templates.md and populate it for /tmp/co-025-target.ts with one obvious vulnerability. Dispatch with the populated prompt. Verify the dispatch exits 0, the response surfaces P0/P1/P2-tagged findings with file:line citations and the response respects the template's READ-ONLY constraint (no file writes).

Expected signals: Exit 0. Mtime unchanged. Zero Edit/Write tool.calls. Severity tag present. >=1 line reference.

#### Test Execution

> **Feature File:** [CO-025](07--prompt-templates/003-template-applied-to-real-dispatch.md)

---

## 14. PARALLEL DETACHED (`CO-026..CO-028`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises use case 2 (in-OpenCode parallel detached sessions per ADR-002). The documented exception to the self-invocation guard. All scenarios in this category MUST include explicit parallel-session keywords in their prompts to permit the dispatch.

### CO-026 | Parallel detached session (use case 2)

#### Description

Verify `opencode run --share --port <N>` (with explicit parallel-session keywords in the prompt) creates a SEPARATE session with its own session id and its own state directory under `~/.opencode/state/` and the dispatch is NOT refused by the self-invocation guard.

#### Scenario Contract

Prompt summary: As an in-OpenCode operator (or external runtime simulating one) spawning a parallel detached OpenCode session for a small isolated worker task, dispatch opencode run with --share --port 4096 and a prompt that explicitly says "parallel detached session" + "ablation suite" so the smart router permits use case 2. Verify the dispatch creates a new session with its own session id, its own state directory at ~/.opencode/state/<id>/ and that the dispatch is NOT refused.

Expected signals: Exit 0. New SID captured non-empty. State directory exists. Zero refusal messages.

#### Test Execution

> **Feature File:** [CO-026](08--parallel-detached/001-parallel-detached-session.md)

### CO-027 | Worker farm loop with `</dev/null`

#### Description

Verify a 3-worker farm loop with the documented `</dev/null` redirect spawns all 3 sessions and produces 3 distinct session ids, demonstrating the canonical fix for silent stdin consumption (per `references/integration_patterns.md` §6).

#### Scenario Contract

Prompt summary: As an in-OpenCode operator (or fresh shell) running a parallel worker farm, dispatch a 3-worker loop using TEMPLATE 8 from prompt_templates.md. Each worker uses opencode run with --share --port (4100 + N) and a small isolated task. Critically, append the documented </dev/null redirect to each backgrounded invocation. After the loop, wait for all workers to complete and verify all 3 produced output files.

Expected signals: WAIT exit 0. 3 logs with content. 3 distinct session ids. Each worker references its own number.

#### Test Execution

> **Feature File:** [CO-027](08--parallel-detached/002-worker-farm-loop.md)

### CO-028 | Ablation suite via parallel detached sessions

#### Description

Verify two parallel detached sessions running an ablation comparison (variant high vs variant minimal) produce two distinct outputs with measurably different reasoning depth, demonstrating the variant flag drives the depth difference under parallel load.

#### Scenario Contract

Prompt summary: As an in-OpenCode operator (or fresh shell) running an ablation suite per TEMPLATE 7 (CIDI framework), dispatch two parallel detached opencode run sessions on different ports, one with --variant high and one with --variant minimal, both asking the same multi-dimensional architecture trade-off question. Capture each session's output to its own log file. Compute the byte-count ratio between the two responses. Verify the high-variant response is at least 2x larger than the minimal-variant response.

Expected signals: WAIT exit 0. Distinct session ids. HIGH/MIN ratio >= 2.0.

#### Test Execution

> **Feature File:** [CO-028](08--parallel-detached/003-ablation-suite.md)

---

## 15. CROSS-REPO AND CROSS-SERVER (`CO-029..CO-031`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract. The category exercises cli-opencode's unique cross-repo dispatch capability via `--dir` (per `references/opencode_tools.md` §6), the documented cross-server dispatch contract via `--attach` (operator-environment-dependent) and the critical safety contract that cross-repo alone does NOT bypass the self-invocation guard.

### CO-029 | Cross-repo dispatch via --dir

#### Description

Verify `--dir <other-repo-path>` targets a different repository's plugin / skill / MCP runtime and the dispatched session reports the cross-repo path as its working directory rather than the caller's CWD.

#### Scenario Contract

Prompt summary: As an external-AI conductor verifying cross-repo dispatch, dispatch opencode run with --dir set to a different valid repo path on the machine. Ask the dispatched session to use the bash tool to list the top 5 entries in its working directory. Verify the listed files match the cross-repo path, not the Public repo.

Expected signals: Exit 0. Cross-repo path referenced in tool.result. Zero references to Public-only files in the listing.

#### Test Execution

> **Feature File:** [CO-029](09--cross-repo-cross-server/001-cross-repo-dispatch.md)

### CO-030 | Cross-server dispatch via --attach

#### Description

Verify the documented `--attach <url>` flag combined with `--dir <remote-path>` is part of the cli-opencode skill surface. Live remote server execution is out of scope. The test validates documentation and CLI surface contract.

#### Scenario Contract

Prompt summary: As an external-AI conductor preparing to dispatch into a remote OpenCode server, verify the cli-opencode documentation contract for cross-server dispatch is intact. Grep the cli_reference.md flag table for --attach, grep the subcommand map for opencode attach and run opencode run --help to confirm the flag is in the live binary's help output.

Expected signals: cli_reference.md §4 + §3 document `--attach` and `opencode attach`. Live binary help includes `--attach`. SKILL.md activation triggers reference cross-server dispatch.

#### Test Execution

> **Feature File:** [CO-030](09--cross-repo-cross-server/002-attach-remote-server.md)

### CO-031 | Self-invocation guard fires on nested cross-repo dispatch

#### Description

Verify the documented self-invocation guard correctly refuses a nested cli-opencode dispatch even when the nested target is a different repo via `--dir`. Cross-repo does NOT bypass the guard. Only the explicit parallel-session keywords do.

#### Scenario Contract

Prompt summary: As an in-OpenCode operator (simulated by exporting OPENCODE_CONFIG_DIR=/tmp/co-031-fake) attempting a nested cross-repo dispatch, restate the request as a generic cross-repo cli-opencode invocation with --dir pointing at a different path but WITHOUT any parallel-session keywords. Verify the smart router refuses with the documented self-invocation message AND the refusal message includes the parallel-session keyword option among the three remediation paths.

Expected signals: Layer 1 trips. SKILL.md `has_parallel_session_keywords` is the only bypass. Integration_patterns.md §5 lists parallel-session keywords as remediation. Cross-repo NOT a bypass. No real dispatch.

#### Test Execution

> **Feature File:** [CO-031](09--cross-repo-cross-server/003-self-invocation-guard-nested.md)

---

## 16. AUTOMATED TEST CROSS-REFERENCE

The cli-opencode skill is a thin orchestration wrapper around the external `opencode` binary, so it does not ship its own automated test suite. Coverage is therefore manual-only by design. Adjacent cross-AI skills follow the same pattern:

| Adjacent Skill | Test Coverage | Playbook Overlap |
|---|---|---|
| `cli-claude-code` | Manual playbook only | Cross-AI delegation pattern parallels (generate-review-fix, structured output, agent routing) |
| `cli-codex` | Manual playbook only | Cross-AI delegation pattern parallels (sandbox modes, reasoning effort, agent profiles, web search) |
| `cli-copilot` | Manual playbook only | Cross-AI delegation pattern parallels (cloud delegation, autonomous task execution) |
| `cli-gemini` | Manual playbook only | Cross-AI delegation pattern parallels (research, web grounding) |
| `system-spec-kit` | Validator script + manual playbook | Spec folder workflows (use case 3 handback target) |

Validator support: the shared `validate_document.py` validates this root playbook structurally but does not recurse into category folders. Per-feature file completeness is checked manually via the link integrity and feature ID count gates documented in section 5.

---

## 17. FEATURE FILE INDEX

### CLI INVOCATION

- CO-001: [Base non-interactive invocation](01--cli-invocation/001-base-non-interactive-invocation.md)
- CO-002: [Output format default vs json](01--cli-invocation/002-format-default-vs-json.md)
- CO-003: [Working directory pinning via --dir](01--cli-invocation/003-dir-flag-working-directory.md)
- CO-004: [File attachment via -f / --file flag](01--cli-invocation/004-file-attachment-via-f-flag.md)
- CO-005: [Plugin disable and verbose logs](01--cli-invocation/005-pure-and-print-logs.md)

### EXTERNAL DISPATCH

- CO-006: [External dispatch from Claude Code into OpenCode](02--external-dispatch/001-from-claude-code.md)
- CO-007: [External dispatch from Codex into OpenCode (use case 1)](02--external-dispatch/002-from-codex-handback.md)
- CO-008: [Self-invocation guard refusal (ADR-001)](02--external-dispatch/003-self-invocation-refusal.md)

### MULTI-PROVIDER

- CO-011: [deepseek direct API (deepseek-v4-pro)](03--multi-provider/003-deepseek-direct-api.md)
- CO-012: [Variant levels (minimal/low/medium/high/max)](03--multi-provider/004-variant-levels-comparison.md)

### AGENT ROUTING

- CO-013: [General agent default route](04--agent-routing/001-general-agent-default.md)
- CO-014: [Context LEAF agent (read-only)](04--agent-routing/002-context-leaf-agent.md)
- CO-015: [Review agent security audit](04--agent-routing/003-review-agent-security-audit.md)
- CO-016: [Write agent documentation generation](04--agent-routing/004-write-agent-doc-generation.md)
- CO-017: [Ultra-think multi-strategy planning](04--agent-routing/005-ultra-think-multi-strategy.md)
- CO-032: [Deep-research agent iteration loop](04--agent-routing/006-deep-research-agent-iterations.md)
- CO-033: [Deep-review agent audit loop](04--agent-routing/007-deep-review-agent-audit.md)
- CO-034: [Orchestrate agent multi-agent coordination](04--agent-routing/008-orchestrate-agent-multi-agent.md)

### SESSION CONTINUITY

- CO-018: [Continue last session via -c](05--session-continuity/001-continue-last-session.md)
- CO-019: [Resume specific session by id (-s)](05--session-continuity/002-resume-by-session-id.md)
- CO-020: [Fork session and share URL gate](05--session-continuity/003-fork-and-share.md)

### INTEGRATION PATTERNS

- CO-021: [Cross-AI orchestration handback (use case 3)](06--integration-patterns/001-cross-ai-handback-codex.md)
- CO-022: [Memory Epilogue handback to generate-context.js](06--integration-patterns/002-memory-epilogue-handback.md)

### PROMPT TEMPLATES

- CO-023: [Prompt templates inventory (13 templates)](07--prompt-templates/001-templates-inventory.md)
- CO-024: [CLEAR quality card 5-check](07--prompt-templates/002-clear-quality-card.md)
- CO-025: [Template applied to a real dispatch](07--prompt-templates/003-template-applied-to-real-dispatch.md)

### PARALLEL DETACHED

- CO-026: [Parallel detached session (use case 2)](08--parallel-detached/001-parallel-detached-session.md)
- CO-027: [Worker farm loop with `</dev/null`](08--parallel-detached/002-worker-farm-loop.md)
- CO-028: [Ablation suite via parallel detached sessions](08--parallel-detached/003-ablation-suite.md)

### CROSS-REPO AND CROSS-SERVER

- CO-029: [Cross-repo dispatch via --dir](09--cross-repo-cross-server/001-cross-repo-dispatch.md)
- CO-030: [Cross-server dispatch via --attach](09--cross-repo-cross-server/002-attach-remote-server.md)
- CO-031: [Self-invocation guard fires on nested cross-repo dispatch](09--cross-repo-cross-server/003-self-invocation-guard-nested.md)
