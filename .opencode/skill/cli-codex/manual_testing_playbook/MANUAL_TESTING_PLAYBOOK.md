---
title: "cli-codex: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the cli-codex skill."
---

# cli-codex: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real - not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual `codex exec` invocations, inspect real outputs, capture real exit codes and verify real behavior. The only acceptable classifications are PASS, FAIL or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

> **SELF-INVOCATION GUARD**: This playbook validates the `cli-codex` skill from a non-Codex runtime (Claude Code, OpenCode, Copilot, Gemini or shell). Operators MUST NOT execute these scenarios from inside Codex CLI itself. The skill refuses to load when Codex env vars or process ancestry are detected. See SKILL.md §2 Self-Invocation Guard.

This document combines the full manual-validation contract for the `cli-codex` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide. It explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-codex` skill. The root document acts as the directory, review surface and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `MANUAL_TESTING_PLAYBOOK.md`
- `01--cli-invocation/`
- `02--sandbox-modes/`
- `03--reasoning-effort/`
- `04--agent-routing/`
- `05--session-continuity/`
- `06--integration-patterns/`
- `07--prompt-templates/`
- `08--built-in-tools/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CLI INVOCATION (`CX-001..CX-004`)](#7--cli-invocation-cx-001cx-004)
- [8. SANDBOX MODES (`CX-005..CX-008`)](#8--sandbox-modes-cx-005cx-008)
- [9. REASONING EFFORT (`CX-009..CX-011`)](#9--reasoning-effort-cx-009cx-011)
- [10. AGENT ROUTING (`CX-012..CX-015`)](#10--agent-routing-cx-012cx-015)
- [11. SESSION CONTINUITY (`CX-016..CX-017`)](#11--session-continuity-cx-016cx-017)
- [12. INTEGRATION PATTERNS (`CX-018..CX-020`)](#12--integration-patterns-cx-018cx-020)
- [13. PROMPT TEMPLATES (`CX-021..CX-022`)](#13--prompt-templates-cx-021cx-022)
- [14. BUILT-IN TOOLS (`CX-023..CX-025`)](#14--built-in-tools-cx-023cx-025)
- [15. AUTOMATED TEST CROSS-REFERENCE](#15--automated-test-cross-reference)
- [16. FEATURE FILE INDEX](#16--feature-file-index)

---

## 1. OVERVIEW

This playbook provides 25 deterministic scenarios across 8 categories validating the `cli-codex` skill surface. Each feature keeps its global `CX-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-04-26): Covers the canonical default invocation (`gpt-5.5` + `medium` reasoning + `service_tier="fast"`), every documented sandbox mode, every reasoning-effort level, every agent profile (`review`, `context`, `research`, `write`, `debug`, `ultra-think`), session continuity surfaces (`--full-auto`, native hooks, resume, fork), unique built-in capabilities (`/review`, `--search`, `--image`, `codex mcp`), prompt-template usage with the CLEAR quality card and cross-AI delegation patterns. Self-invocation refusal is enforced upstream by the skill's detection guard and is not retested here.

### Realistic Test Model

1. A realistic user request is given to an orchestrator running on a non-Codex runtime (Claude Code, OpenCode, Copilot, Gemini or shell).
2. The orchestrator decides whether to delegate to Codex CLI via the `cli-codex` skill, picks the right profile/sandbox/reasoning-effort and constructs a Role -> Context -> Action -> Format prompt.
3. The operator captures both the dispatch command and the user-visible outcome.
4. The scenario passes only when the dispatch is sound, the Codex output matches the expected signals and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the delegation
- The orchestrator brief or Codex-facing prompt that should drive the test
- The expected execution process, including profile choice, sandbox mode, reasoning effort and any session-management decisions
- The desired user-visible outcome
- The implementation or skill-doc anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and contains `.git/`.
2. Codex CLI is installed and on PATH: `command -v codex` returns a non-empty path. If not installed, run `npm i -g @openai/codex` first.
3. Codex CLI is authenticated: either `OPENAI_API_KEY` is exported OR `codex login` has succeeded (ChatGPT Plus/Pro/Business/Edu/Enterprise account).
4. The active runtime is NOT Codex CLI itself - the self-invocation guard in SKILL.md §2 must not trip. Verify by running `env | grep -i codex_` and confirming no `CODEX_SESSION_ID` or `CODEX_*` vars are set.
5. The skill's reference and asset files exist at `.opencode/skill/cli-codex/{references,assets}/` so prompt-quality and template scenarios resolve.
6. `gpt-5.5` is the documented and only supported model. Do not substitute alternative model IDs.
7. `service_tier="fast"` MUST be passed explicitly on every `codex exec` invocation in this playbook (per the auto-memory rule). Never rely on a global config default.
8. Destructive scenario `CX-007` (danger-full-access) MUST run only against rebuildable, non-production data and requires explicit human approval before execution.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript including the exact `codex exec` invocation with all flags
- The user request that triggered the delegation
- The orchestrator-side reasoning for profile, sandbox and reasoning-effort selection
- The Role -> Context -> Action -> Format prompt actually dispatched (not just paraphrased)
- Codex stdout (and stderr captured via `2>&1`)
- Exit code from `codex exec`
- The final user-facing outcome and a PASS, PARTIAL or FAIL verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `codex <subcommand> [args]` (e.g., `codex exec "..." --model gpt-5.5`)
- Bash commands shown as `bash: <command>` (e.g., `bash: command -v codex`)
- File capture shown as `> /tmp/<file>` (orchestrator captures Codex output to a temp file for inspection)
- `->` separates sequential steps in the command sequence column
- Always include `-c service_tier="fast"` on `codex exec` invocations

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `MANUAL_TESTING_PLAYBOOK.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (transcripts, captured stdout files, exit codes)
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (Codex installed, authenticated, non-Codex runtime).
2. Prompt and command sequence were executed as written, including `service_tier="fast"`.
3. Expected signals are present in Codex stdout / stderr / exit code.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence (e.g., timing data) is incomplete
- `FAIL`: expected behavior missing, contradictory output, dispatch broken or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (CX-001, CX-005, CX-006) forces feature verdict to `FAIL`. The default invocation, read-only sandbox and workspace-write sandbox are the load-bearing baseline. If any of them fail the skill cannot be released.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios (`CX-001`, `CX-005`, `CX-006`) are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`, currently 25).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats (e.g., danger-full-access approval evidence for CX-007, hook installation checks for CX-016) in the matching per-feature files.

### Destructive Scenarios

- `CX-007` (`danger-full-access` sandbox): MUST run with explicit user approval and against a sandbox folder, not the live workspace. Capture the approval acknowledgement as evidence.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (Codex CLI rate-limit headroom, OS sandbox availability).
2. Reserve one coordinator on the calling AI side. Do not nest Codex coordinators.
3. Saturate remaining worker slots with parallel `codex exec` calls (read-only sandbox is safe to fan out, workspace-write must serialize on overlapping files).
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenario `CX-007` in a dedicated, isolated wave with no parallel siblings.
6. After each wave, save context and evidence, then begin the next wave.
7. Record a utilization table, per-feature file references and evidence paths in the final report.

### Recommended Wave Layout

- Wave 1 (parallel-safe, read-only): `CX-001`, `CX-002`, `CX-003`, `CX-005`, `CX-009`, `CX-010`, `CX-011`, `CX-012`, `CX-015`, `CX-019`, `CX-021`, `CX-022`, `CX-024`
- Wave 2 (workspace-write, serial on overlapping paths): `CX-006`, `CX-013`, `CX-014`, `CX-018`, `CX-023`, `CX-025`
- Wave 3 (session continuity, requires hook setup): `CX-016`, `CX-017`
- Wave 4 (integration features, may require image asset / web): `CX-004`, `CX-008`, `CX-020`
- Wave 5 (DESTRUCTIVE, isolated, requires approval): `CX-007`

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role -> Context -> Action -> Format contract
- Expected delegation or alternate-CLI routing (profile choice, sandbox, reasoning effort)
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints (e.g., danger-full-access approval evidence)

---

## 7. CLI INVOCATION (`CX-001..CX-004`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-001 | Default invocation (gpt-5.5 medium fast)

#### Description

Verify the canonical zero-input default dispatch (`gpt-5.5` + `medium` reasoning + `service_tier="fast"`) returns a usable code-generation answer with exit code 0.

#### Current Reality

Prompt: `As a cross-AI orchestrator dispatching from a non-Codex runtime, generate a single TypeScript function fizzbuzz(n: number): string[] using the cli-codex default invocation. Verify the function compiles, has correct fizzbuzz semantics, and Codex returned exit code 0 with the function body printed to stdout. Return a concise pass/fail verdict naming the model, reasoning effort, and service tier actually used.`

Expected signals: `codex exec` exits 0. Stdout contains a TypeScript function named `fizzbuzz`. Output references `n`, `Fizz`, `Buzz`, `FizzBuzz` semantics. The dispatched command line includes `--model gpt-5.5`, `-c model_reasoning_effort="medium"` and `-c service_tier="fast"`.

Desired user-visible outcome: A working `fizzbuzz` function generated by Codex via the documented skill default, with operator-readable evidence that the default invocation pattern was used verbatim.

#### Test Execution

> **Feature File:** [CX-001](01--cli-invocation/001-default-invocation.md)

### CX-002 | gpt-5.5 model lock

#### Description

Verify `gpt-5.5` is the only supported model and that explicit `--model gpt-5.5` produces a successful response, while a deliberate alternate model attempt is documented as out-of-contract.

#### Current Reality

Prompt: `As a cross-AI orchestrator validating the cli-codex model contract, dispatch a small documentation-style request explicitly pinned to --model gpt-5.5 with -c service_tier="fast". Verify the response is coherent, exit code is 0, and confirm via the skill docs that no other model ID is in scope. Return a one-line PASS/FAIL with the observed exit code and the model named in the dispatch.`

Expected signals: `codex exec` exits 0 with `--model gpt-5.5` explicitly passed. Stdout contains a coherent answer to a small documentation prompt. The skill reference (`references/cli_reference.md` §5) confirms `gpt-5.5` is the only supported model.

Desired user-visible outcome: Confirmation that the documented model pin (`gpt-5.5`) works end-to-end, with a paper trail that the operator did not silently fall back to a different ID.

#### Test Execution

> **Feature File:** [CX-002](01--cli-invocation/002-gpt-5-5-model-lock.md)

### CX-003 | codex exec review subcommand

#### Description

Verify `codex exec review` performs diff-aware review of the current git working tree (e.g., `--uncommitted`) and produces structured findings with exit code 0.

#### Current Reality

Prompt: `As a cross-AI orchestrator preparing a pre-commit review, run codex exec review against the current uncommitted diff with --model gpt-5.5 and -c service_tier="fast". Verify Codex returns categorized findings (security/bugs/style/performance) referencing actual changed lines, exits 0, and produces no file modifications. Return a concise verdict noting the number of findings and whether at least one finding cites a real changed line.`

Expected signals: `codex exec review --uncommitted` exits 0. Stdout contains categorized findings (at minimum: a "security" or "correctness" or "style" or "performance" section). At least one finding references a line number that maps to a real change in the working tree. No files are modified.

Desired user-visible outcome: A reviewer-quality summary of the staged or uncommitted diff that the operator can hand to a human reviewer or use as a pre-commit gate.

#### Test Execution

> **Feature File:** [CX-003](01--cli-invocation/003-codex-exec-review.md)

### CX-004 | Explicit fast service tier

#### Description

Verify that `-c service_tier="fast"` is passed explicitly on every `codex exec` invocation per the auto-memory rule and that omitting it (negative case) is detected as a contract violation in operator review.

#### Current Reality

Prompt: `As a cross-AI orchestrator enforcing the cli-codex auto-memory rule "Codex CLI fast mode must be explicit", dispatch the same trivial generation prompt twice: first WITH -c service_tier="fast", then WITHOUT it. Verify the explicit-fast invocation succeeds with the documented flag visible in the dispatched command, and document the second invocation as a contract violation that operators must reject during review. Return a verdict identifying both invocations and naming the missing flag in the negative case.`

Expected signals: First invocation includes `-c service_tier="fast"` in the dispatched command and exits 0. Second invocation omits the flag (operator records this as the contract-violation control sample). The operator's review output explicitly flags the second invocation as non-conforming.

Desired user-visible outcome: Evidence that the playbook enforces the auto-memory rule and that operators can detect and reject invocations that drop the explicit fast-tier flag.

#### Test Execution

> **Feature File:** [CX-004](01--cli-invocation/004-explicit-fast-service-tier.md)

---

## 8. SANDBOX MODES (`CX-005..CX-008`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-005 | read-only sandbox (analysis)

#### Description

Verify `--sandbox read-only` permits file reads but blocks writes and that an analysis prompt completes successfully with no filesystem mutations.

#### Current Reality

Prompt: `As a cross-AI orchestrator running a safe code review, dispatch a read-only analysis of @./.opencode/skill/cli-codex/SKILL.md with --sandbox read-only --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify Codex returns a structured summary, makes no file modifications (git status clean for that path), and exits 0. Return a verdict naming the sandbox mode and confirming git status remains clean.`

Expected signals: `codex exec` exits 0. Stdout contains a structured analysis of SKILL.md (sections, anchors, key rules). `bash: git status --porcelain` shows no modifications to SKILL.md. The dispatch line includes `--sandbox read-only`.

Desired user-visible outcome: An analysis output with provable safety: the operator can show that read-only sandbox prevented all writes during a Codex inspection.

#### Test Execution

> **Feature File:** [CX-005](02--sandbox-modes/001-read-only-sandbox.md)

### CX-006 | workspace-write sandbox (generation)

#### Description

Verify `--sandbox workspace-write` permits file creation inside the workspace and that a code-generation prompt actually writes the requested file with exit code 0.

#### Current Reality

Prompt: `As a cross-AI orchestrator generating a small utility, dispatch a workspace-write task that creates /tmp/cli-codex-playbook-cx006/hello.ts with --sandbox workspace-write --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify the file is written, contains a TypeScript hello-world function, Codex exits 0, and no files outside /tmp/cli-codex-playbook-cx006/ are touched. Return a verdict naming the created path and confirming workspace-write succeeded.`

Expected signals: `codex exec` exits 0. `bash: ls /tmp/cli-codex-playbook-cx006/hello.ts` succeeds and the file contains a TypeScript hello-world function. `bash: git status --porcelain` shows no unintended modifications to the working tree (the temp dir is outside git). Dispatch line includes `--sandbox workspace-write`.

Desired user-visible outcome: A real generated file the operator can inspect and run, demonstrating that workspace-write is the correct sandbox for code-generation tasks.

#### Test Execution

> **Feature File:** [CX-006](02--sandbox-modes/002-workspace-write-sandbox.md)

### CX-007 | danger-full-access sandbox **(DESTRUCTIVE)**

#### Description

Verify `--sandbox danger-full-access` only runs after explicit user approval and that the elevated mode is paired with `--ask-for-approval untrusted` per SKILL.md §4 NEVER rule 1.

#### Current Reality

Prompt: `As a cross-AI orchestrator handling a system-level migration, FIRST capture explicit user approval to use --sandbox danger-full-access, THEN dispatch a benign read-then-write task to /tmp/cli-codex-playbook-cx007/ with --sandbox danger-full-access --ask-for-approval untrusted --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify the approval evidence exists, the dispatch includes both flags, the task completes, and no files outside /tmp/cli-codex-playbook-cx007/ are touched. Return a verdict naming the approval evidence path and confirming danger-full-access was paired with approval-untrusted.`

Expected signals: Operator records explicit user approval (in evidence transcript) BEFORE dispatch. Dispatch line contains both `--sandbox danger-full-access` AND `--ask-for-approval untrusted`. `codex exec` exits 0 after Codex requests approval at runtime. Only files inside `/tmp/cli-codex-playbook-cx007/` are touched.

Desired user-visible outcome: Evidence that destructive sandbox usage is gated by approval and that the operator can produce the approval transcript on demand.

#### Test Execution

> **Feature File:** [CX-007](02--sandbox-modes/003-danger-full-access-sandbox.md)

### CX-008 | --full-auto vs explicit approval policies

#### Description

Verify `--full-auto` (workspace-write + on-request approval) runs unattended without escalating and that explicit `--ask-for-approval` values (`untrusted`, `on-request`, `never`) behave as documented.

#### Current Reality

Prompt: `As a cross-AI orchestrator validating approval-policy variants, dispatch the same small generation task four times: (1) --full-auto, (2) --ask-for-approval untrusted with --sandbox workspace-write, (3) --ask-for-approval on-request with --sandbox workspace-write, (4) --ask-for-approval never with --sandbox workspace-write. All invocations use --model gpt-5.5 -c service_tier="fast". Verify each invocation exits 0, --full-auto needs no human input, and approval prompts surface only in the untrusted/on-request paths. Return a verdict mapping each variant to its observed approval behavior.`

Expected signals: All four invocations exit 0 (or document specific approval prompts in untrusted/on-request modes). `--full-auto` produces no approval prompts. `--ask-for-approval never` produces no approval prompts. Dispatch lines for all four invocations explicitly include the documented flag combinations.

Desired user-visible outcome: A verified mapping of approval-policy flags to observed runtime behavior so operators can pick the right mode for unattended vs interactive scenarios.

#### Test Execution

> **Feature File:** [CX-008](02--sandbox-modes/004-approval-policies.md)

---

## 9. REASONING EFFORT (`CX-009..CX-011`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-009 | low / minimal / none reasoning baseline

#### Description

Verify the lower reasoning-effort levels (`none`, `minimal`, `low`) are accepted via `-c model_reasoning_effort="<level>"` and produce successful, lower-latency responses for trivial tasks.

#### Current Reality

Prompt: `As a cross-AI orchestrator running a trivial lookup, dispatch the prompt "List the three primary colors as JSON" three times against --model gpt-5.5 -c service_tier="fast" with reasoning effort none, minimal, and low respectively. Verify all three exit 0, all three return valid JSON containing red/green/blue (or red/yellow/blue for the artistic primary set), and the dispatched command lines explicitly carry the documented effort flag. Return a verdict mapping each effort level to the exit code and validity of the returned JSON.`

Expected signals: All three invocations exit 0. All three responses contain a JSON array or object with three primary colors. Dispatched command lines include the documented `-c model_reasoning_effort="<level>"` flag verbatim for each level.

Desired user-visible outcome: Confirmation that low-end reasoning levels are real, supported and useful for trivial tasks where latency and cost matter more than depth.

#### Test Execution

> **Feature File:** [CX-009](03--reasoning-effort/001-low-minimal-none-baseline.md)

### CX-010 | medium reasoning (skill default)

#### Description

Verify `medium` is the documented skill default reasoning effort and that omitting `-c model_reasoning_effort` while setting it explicitly to `medium` produce equivalent behavior on a standard code-generation task.

#### Current Reality

Prompt: `As a cross-AI orchestrator confirming the skill default, dispatch the same generation prompt twice with --model gpt-5.5 -c service_tier="fast": once with -c model_reasoning_effort="medium" explicit, once relying on the documented skill default (still pass medium per the SKILL.md §3 default-invocation rule because the skill mandates explicit effort). Verify both exit 0 and produce comparable code-quality output for a small TypeScript utility. Return a verdict confirming both invocations match the documented default contract.`

Expected signals: Both invocations exit 0. Both produce a small TypeScript utility (e.g., a `clamp(n, min, max)` function). Both dispatched command lines include `-c model_reasoning_effort="medium"` explicitly per SKILL.md §4 ALWAYS rule 7. Outputs are functionally equivalent.

Desired user-visible outcome: Confirmation that `medium` is the load-bearing default and that the operator's explicit-effort discipline matches the documented contract.

#### Test Execution

> **Feature File:** [CX-010](03--reasoning-effort/002-medium-skill-default.md)

### CX-011 | high / xhigh override

#### Description

Verify `high` and `xhigh` reasoning levels are accepted via `-c model_reasoning_effort="<level>"` and produce deeper analysis on a security-audit prompt that benefits from depth.

#### Current Reality

Prompt: `As a cross-AI orchestrator routing a security-sensitive analysis, dispatch a security review of @./.opencode/skill/cli-codex/SKILL.md §4 (Rules) twice: once with -c model_reasoning_effort="high", once with -c model_reasoning_effort="xhigh". Both invocations use --model gpt-5.5 --sandbox read-only -c service_tier="fast". Verify both exit 0, both return categorized findings with explicit references to specific rules, and the xhigh response demonstrates measurably deeper reasoning (more rule citations, more nuanced trade-offs). Return a verdict mapping each level to the citation count and apparent depth.`

Expected signals: Both invocations exit 0. Both responses cite specific SKILL.md rules by number (e.g., "ALWAYS 1", "NEVER 4"). The `xhigh` response contains at least as many citations as the `high` response. Dispatched command lines include the documented effort flag verbatim.

Desired user-visible outcome: An audit-quality output the operator can hand to a security reviewer, with proof that the higher reasoning levels are actually engaged and produce richer analysis.

#### Test Execution

> **Feature File:** [CX-011](03--reasoning-effort/003-high-xhigh-override.md)

---

## 10. AGENT ROUTING (`CX-012..CX-015`)

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-012 | @review profile (read-only)

#### Description

Verify `codex exec -p review` routes to the read-only review profile and produces categorized findings without modifying files.

#### Current Reality

Prompt: `As a cross-AI orchestrator delegating a code review, dispatch codex exec -p review against @./.opencode/skill/cli-codex/references/cli_reference.md with --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast". Verify the dispatch routes via -p review, exits 0, returns categorized findings (style/correctness/clarity), makes no file modifications, and the dispatched command line includes -p review explicitly. Return a verdict naming the profile and the finding-category count.`

Expected signals: `codex exec -p review` exits 0. Stdout contains categorized findings. `bash: git status --porcelain` shows no modifications. Dispatch line includes `-p review`.

Desired user-visible outcome: A reviewer-quality output that demonstrates the `review` profile keeps Codex in read-only mode by configuration, freeing the operator from passing `--sandbox read-only` manually when the profile is set up correctly.

#### Test Execution

> **Feature File:** [CX-012](04--agent-routing/001-review-profile.md)

### CX-013 | @context profile (architecture mapping)

#### Description

Verify `codex exec -p context` routes to the read-only context-exploration profile and produces an architecture map of a small subtree.

#### Current Reality

Prompt: `As a cross-AI orchestrator gathering architecture context, dispatch codex exec -p context against the .opencode/skill/cli-codex/references/ folder with --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast". Verify the dispatch routes via -p context, exits 0, returns a dependency or anchor map naming each reference file, makes no file modifications, and the dispatched command line includes -p context. Return a verdict naming the profile and confirming the map enumerates all 5 reference files.`

Expected signals: `codex exec -p context` exits 0. Stdout enumerates the five reference files (`cli_reference.md`, `integration_patterns.md`, `codex_tools.md`, `hook_contract.md`, `agent_delegation.md`). No file modifications. Dispatch line includes `-p context`.

Desired user-visible outcome: A structural map the operator can use to onboard a teammate or feed into a planning step.

#### Test Execution

> **Feature File:** [CX-013](04--agent-routing/002-context-profile.md)

### CX-014 | @debug profile (workspace-write fix)

#### Description

Verify `codex exec -p debug` routes to a workspace-write profile and applies a minimal fix to a deliberately broken throwaway file.

#### Current Reality

Prompt: `As a cross-AI orchestrator handing off a stuck bug after 3+ failed attempts, FIRST create /tmp/cli-codex-playbook-cx014/broken.ts with a deliberate off-by-one bug, THEN dispatch codex exec -p debug "Fix the off-by-one bug in @/tmp/cli-codex-playbook-cx014/broken.ts. Apply the minimal fix and explain root cause." with --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify the dispatch routes via -p debug, the fix is applied to the file, the explanation cites the off-by-one nature, and Codex exits 0. Return a verdict naming the profile, the file path, and the root-cause sentence.`

Expected signals: Pre-step writes a broken `.ts` file with an off-by-one error. `codex exec -p debug` exits 0. Stdout contains a root-cause explanation referencing "off-by-one". The file on disk no longer contains the off-by-one bug. Dispatch line includes `-p debug`.

Desired user-visible outcome: A working corrected file plus a root-cause sentence the operator can paste into the bug ticket.

#### Test Execution

> **Feature File:** [CX-014](04--agent-routing/003-debug-profile.md)

### CX-015 | @ultra-think profile (multi-strategy planning)

#### Description

Verify `codex exec -p ultra-think` routes to the read-only multi-strategy planning profile and returns at least 3 distinct strategies for an architecture decision.

#### Current Reality

Prompt: `As a cross-AI orchestrator running an architecture review, dispatch codex exec -p ultra-think "Plan three caching strategies for a small Express API: in-memory, Redis, and CDN edge. Score each on correctness, maintainability, and performance, then recommend one." with --model gpt-5.5 -c model_reasoning_effort="xhigh" --sandbox read-only -c service_tier="fast". Verify the dispatch routes via -p ultra-think, exits 0, returns at least three distinct labeled strategies with scores and a final recommendation, makes no file modifications, and the dispatched command line includes -p ultra-think. Return a verdict naming the recommended strategy and the score breakdown.`

Expected signals: `codex exec -p ultra-think` exits 0. Stdout names at least 3 strategies (in-memory, Redis, CDN). Each strategy carries a score on the three axes (correctness, maintainability, performance). A single recommendation is named. No file modifications. Dispatch line includes `-p ultra-think`.

Desired user-visible outcome: A planning brief the operator can hand to an architect or paste into a spec folder's `decision-record.md`.

#### Test Execution

> **Feature File:** [CX-015](04--agent-routing/004-ultra-think-profile.md)

---

## 11. SESSION CONTINUITY (`CX-016..CX-017`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-016 | --full-auto + native hook integration

#### Description

Verify `codex --enable codex_hooks` (or `[features].codex_hooks = true` in config) plus `--full-auto` runs the documented Spec Kit Memory hooks at `SessionStart` and `UserPromptSubmit`, injecting the advisor brief into the model context.

#### Current Reality

Prompt: `As a cross-AI orchestrator validating Codex hook parity, FIRST verify ~/.codex/hooks.json contains entries for SessionStart and UserPromptSubmit pointing at .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/{session-start,user-prompt-submit}.js, THEN dispatch codex --enable codex_hooks exec --full-auto "Implement a tiny TypeScript hook smoke test in /tmp/cli-codex-playbook-cx016/hook.ts" with --model gpt-5.5 -c service_tier="fast". Verify the hook stdout contract is satisfied (session-start emits {} or hookSpecificOutput.additionalContext; user-prompt-submit emits an Advisor: brief). Return a verdict naming the hook script paths and confirming the advisor brief surfaced.`

Expected signals: `~/.codex/hooks.json` lists both hooks at the documented paths. `codex --enable codex_hooks exec --full-auto` exits 0. The hook smoke checks documented in `references/hook_contract.md` §6 succeed when invoked manually (`{}` for session-start, `Advisor:` prefix for user-prompt-submit). The test file is written.

Desired user-visible outcome: Evidence that Spec Kit Memory's startup context and skill-advisor brief are wired into Codex via the documented hook contract.

#### Test Execution

> **Feature File:** [CX-016](05--session-continuity/001-full-auto-hooks.md)

### CX-017 | session resume / fork

#### Description

Verify `codex exec` produces a session ID that can be resumed via `codex resume <session-id>` (or `--session-id`) and that `codex fork <session-id>` creates a divergent branch.

#### Current Reality

Prompt: `As a cross-AI orchestrator running a multi-turn task, dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" "Begin a 2-step plan: Step 1 sketch a TypeScript User type. Stop after Step 1 and announce the session ID." then resume the same session with codex exec --session-id <id> "Step 2: implement the validate(user) function for the type from Step 1." Verify Codex emits a session ID on Step 1, the resumed Step 2 references the User type, and a separate codex fork <session-id> creates a branch session ID distinct from the original. Return a verdict naming both session IDs and confirming continuity from Step 1 to Step 2.`

Expected signals: Step 1 stdout includes a session ID (or operator captures it from log). Step 2 dispatch with `--session-id` exits 0 and references the Step 1 `User` type. `codex fork <id>` returns a new ID different from the original. Step 1 state is preserved across the resume.

Desired user-visible outcome: A working multi-turn task plus a forked session ID the operator can use to explore an alternative implementation.

#### Test Execution

> **Feature File:** [CX-017](05--session-continuity/002-session-resume-fork.md)

---

## 12. INTEGRATION PATTERNS (`CX-018..CX-020`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-018 | Cross-AI generate-review-fix cycle

#### Description

Verify the documented Codex-generates-Codex-reviews pattern (`integration_patterns.md` §2) executes end-to-end and produces a fix that addresses an inserted defect.

#### Current Reality

Prompt: `As a cross-AI orchestrator executing the canonical generate-review-fix loop with two Codex calls: STEP 1 dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c service_tier="fast" "Create /tmp/cli-codex-playbook-cx018/middleware.ts: an Express rate-limiter middleware with deliberately missing input validation on the limit parameter." STEP 2 dispatch codex exec --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "@/tmp/cli-codex-playbook-cx018/middleware.ts Review for input validation gaps. Return a JSON list of issues." STEP 3 dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c service_tier="fast" "@/tmp/cli-codex-playbook-cx018/middleware.ts Fix the issues identified: $(cat /tmp/cx018-review.json)". Verify the final file passes a re-review (no input-validation issues remain). Return a verdict naming each step, the issue count, and the final review verdict.`

Expected signals: Step 1 writes `middleware.ts` with a deliberate gap. Step 2 returns a JSON-shaped review naming the input-validation gap. Step 3 writes a modified file that no longer has the gap. An optional Step 4 re-review confirms the fix.

Desired user-visible outcome: A working middleware with input validation, demonstrating that the documented cross-AI pattern produces real improvement when followed end-to-end.

#### Test Execution

> **Feature File:** [CX-018](06--integration-patterns/001-generate-review-fix-cycle.md)

### CX-019 | Web search via --search

#### Description

Verify `--search` enables live web browsing during `codex exec` and that the response cites URLs for time-sensitive information.

#### Current Reality

Prompt: `As a cross-AI orchestrator researching current information, dispatch codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "Search the web for the latest stable Express.js minor release as of April 2026 and cite at least one official source URL. Return a one-paragraph summary plus the cited URL(s)." Verify Codex exits 0, the response contains at least one URL, the URL is reachable in principle (https scheme + a plausible express-related domain), and the dispatched command includes --search. Return a verdict naming the cited URL(s) and the reported version.`

Expected signals: `codex exec --search` exits 0. Stdout contains at least one URL with `https://` scheme. URL points at a plausible source (expressjs.com, github.com/expressjs, npmjs.com, etc.). Dispatched command line includes `--search`.

Desired user-visible outcome: A version-and-source summary the operator can paste into a research note, with provable evidence that the live web tier was actually engaged.

#### Test Execution

> **Feature File:** [CX-019](06--integration-patterns/002-web-search.md)

### CX-020 | Image input via --image

#### Description

Verify `--image` (or `-i`) accepts a PNG/JPEG and that Codex incorporates the image into its response.

#### Current Reality

Prompt: `As a cross-AI orchestrator implementing from a design, FIRST create a tiny placeholder PNG at /tmp/cli-codex-playbook-cx020/wireframe.png (e.g., a 200x200 red square via ImageMagick or Python Pillow), THEN dispatch codex exec -i /tmp/cli-codex-playbook-cx020/wireframe.png --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "Describe the attached image in one sentence: name the dominant color and approximate dimensions." Verify Codex exits 0, the response names a red color and ~200x200 dimensions, and the dispatched command line includes -i. Return a verdict naming the image path, the described color, and the described dimensions.`

Expected signals: `codex exec -i <image>` exits 0. Stdout response names the dominant color (red) and approximate dimensions (~200x200). Dispatched command line includes `-i <path>`.

Desired user-visible outcome: Confirmation that the image-input surface works end-to-end so design-to-code workflows are unblocked.

#### Test Execution

> **Feature File:** [CX-020](06--integration-patterns/003-image-input.md)

---

## 13. PROMPT TEMPLATES (`CX-021..CX-022`)

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-021 | Use prompt_templates.md inventory

#### Description

Verify the documented prompt templates (`assets/prompt_templates.md` §2-§10) are real, copy-paste ready and produce a successful Codex dispatch when placeholders are filled in.

#### Current Reality

Prompt: `As a cross-AI orchestrator picking a documented template, copy the "Single-File Application" template from assets/prompt_templates.md §2, fill placeholders for a tiny TypeScript health-check HTTP server, and dispatch the resulting prompt verbatim with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast" against /tmp/cli-codex-playbook-cx021/. Verify Codex exits 0, the generated file matches the template requirements (single complete file, all imports, error handling, comments, /healthz endpoint), and the operator can identify the template line from prompt_templates.md that was used. Return a verdict naming the template anchor (e.g., "§2 Single-File Application") and confirming the generated file works.`

Expected signals: Generated file exists at `/tmp/cli-codex-playbook-cx021/server.ts`. File contains imports, error handling, comments and a `/healthz` endpoint. Operator records the template's anchor (e.g., `<!-- ANCHOR:code_generation -->` from `prompt_templates.md`). `codex exec` exits 0.

Desired user-visible outcome: A real working health-check server generated from the documented template inventory, demonstrating that the template asset is operationally trustworthy.

#### Test Execution

> **Feature File:** [CX-021](07--prompt-templates/001-prompt-templates-inventory.md)

### CX-022 | CLEAR scoring via prompt_quality_card.md

#### Description

Verify the prompt_quality_card.md CLEAR 5-check is applied before dispatch and that an under-scored prompt is escalated to `@improve-prompt` per the documented threshold.

#### Current Reality

Prompt: `As a cross-AI orchestrator constructing a non-trivial dispatch, FIRST take a deliberately weak prompt ("Fix auth"), score it with the prompt_quality_card.md CLEAR 5-check (Correctness, Logic, Expression, Arrangement, Reusability), THEN escalate it to a structured prompt by applying the RCAF framework from §3 of the card. Dispatch the improved prompt against /tmp/cli-codex-playbook-cx022/auth.ts with --model gpt-5.5 --sandbox workspace-write -c model_reasoning_effort="medium" -c service_tier="fast". Verify the operator records the CLEAR scores for both versions, names the framework selected, and Codex produces a meaningfully better implementation from the improved prompt than the weak prompt would have. Return a verdict including both CLEAR score sets and the framework selected.`

Expected signals: Operator records CLEAR scores for the weak prompt (low on Expression and Arrangement). Operator names the chosen framework from `prompt_quality_card.md` §2 (e.g., RCAF). Improved prompt scores higher. Dispatched command line uses the improved prompt and exits 0.

Desired user-visible outcome: An auditable trail showing the prompt-quality discipline was applied before the dispatch and a working file demonstrating the upgrade actually mattered.

#### Test Execution

> **Feature File:** [CX-022](07--prompt-templates/002-clear-scoring-quality-card.md)

---

## 14. BUILT-IN TOOLS (`CX-023..CX-025`)

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CX-023 | /review TUI command

#### Description

Verify the `/review` interactive command runs inside the Codex TUI against staged git changes and produces categorized review findings.

#### Current Reality

Prompt: `As a cross-AI orchestrator preparing a pre-commit review, FIRST stage a small change (e.g., a one-line edit to /tmp/cli-codex-playbook-cx023/scratch.md inside a throwaway git repo), THEN launch codex (no exec subcommand) and run /review interactively. Verify Codex enters the TUI, /review surfaces categorized findings (security/bugs/style/performance) referencing the staged change, the operator can exit cleanly, and no files are modified. Return a verdict naming the categories present and the line referenced.`

Expected signals: Codex TUI launches. `/review` slash command executes against staged changes. Output contains at least one category heading (security/bugs/style/performance). A finding references the staged line. No file modifications.

Desired user-visible outcome: A pre-commit review summary the operator can quote in a PR description.

#### Test Execution

> **Feature File:** [CX-023](08--built-in-tools/001-review-tui-command.md)

### CX-024 | --search live browsing in exec

#### Description

Verify `--search` works in non-interactive `codex exec` mode (distinct from CX-019, which validates URL citation. This scenario validates the flag's exec-mode wiring against a current-information question).

#### Current Reality

Prompt: `As a cross-AI orchestrator confirming --search works in exec mode (not just TUI), dispatch codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "What was the headline release of any major JavaScript runtime announced in March 2026? Cite one source." Verify Codex exits 0, the response indicates web access was used (URL citation, "according to" phrasing, or a date-stamped fact later than the model's training cutoff), and the dispatched command line includes --search. Return a verdict naming the cited release and the source URL.`

Expected signals: `codex exec --search` exits 0. Response contains a date-stamped fact, an "according to" phrasing or a URL citation. Dispatched command line includes `--search`. The answer is plausibly current rather than purely from training data.

Desired user-visible outcome: Operator-visible proof that `--search` is wired into `exec` mode and not just the interactive TUI.

#### Test Execution

> **Feature File:** [CX-024](08--built-in-tools/002-search-exec-mode.md)

### CX-025 | codex mcp server registration

#### Description

Verify `codex mcp` lists registered MCP servers (or a stub server defined in `.codex/settings.json`) and surfaces a usable tool inside an `exec` session.

#### Current Reality

Prompt: `As a cross-AI orchestrator extending Codex with a custom tool, FIRST register a stub MCP server in .codex/settings.json (or verify an existing entry), THEN run codex mcp to confirm it lists the server, THEN dispatch codex exec --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "List available MCP tools and pick one to call. Return the tool name and a one-line description." Verify codex mcp lists the server, codex exec exits 0, and the response names at least one MCP tool. Return a verdict naming the registered server and the surfaced tool.`

Expected signals: `.codex/settings.json` (or `~/.codex/settings.json`) defines at least one `mcpServers` entry. `codex mcp` lists the server. `codex exec` exits 0. Response names at least one MCP tool from the registered server.

Desired user-visible outcome: Confirmation that the MCP integration surface is reachable end-to-end so operators can extend Codex with custom data sources.

#### Test Execution

> **Feature File:** [CX-025](08--built-in-tools/003-mcp-server-registration.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

The `cli-codex` skill is an orchestrator wrapper around a third-party binary (`codex`) and does not own a Python or JavaScript test suite of its own. Cross-references in this section point at upstream and adjacent test surfaces:

| Test Surface | Coverage | Playbook Overlap |
|---|---|---|
| Upstream Codex CLI repo (`https://github.com/openai/codex`) | Codex binary correctness | Out of scope for this playbook. We validate that our skill dispatches the binary correctly, not that the binary itself is correct |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/{session-start,user-prompt-submit}.js` | Hook contract integration | `CX-016` exercises the hook scripts via the documented manual smoke checks in `hook_contract.md` §6 |
| `.opencode/skill/cli-codex/references/hook_contract.md` §6 manual smoke checks | Hook output shape | `CX-016` |
| `.opencode/skill/sk-doc/scripts/validate_document.py` | Markdown structure validation for this playbook | This playbook itself (root MUST validate cleanly) |

There is no automated coverage for default-invocation, sandbox-mode, reasoning-effort, agent-routing or built-in-tool scenarios. Manual playbook execution IS the canonical validation surface for those features. Re-run the wave plan in §6 before each release.

---

## 16. FEATURE FILE INDEX

### CLI INVOCATION

- CX-001: [Default invocation (gpt-5.5 medium fast)](01--cli-invocation/001-default-invocation.md)
- CX-002: [gpt-5.5 model lock](01--cli-invocation/002-gpt-5-5-model-lock.md)
- CX-003: [codex exec review subcommand](01--cli-invocation/003-codex-exec-review.md)
- CX-004: [Explicit fast service tier](01--cli-invocation/004-explicit-fast-service-tier.md)

### SANDBOX MODES

- CX-005: [read-only sandbox (analysis)](02--sandbox-modes/001-read-only-sandbox.md)
- CX-006: [workspace-write sandbox (generation)](02--sandbox-modes/002-workspace-write-sandbox.md)
- CX-007: [danger-full-access sandbox **(DESTRUCTIVE)**](02--sandbox-modes/003-danger-full-access-sandbox.md)
- CX-008: [--full-auto vs explicit approval policies](02--sandbox-modes/004-approval-policies.md)

### REASONING EFFORT

- CX-009: [low / minimal / none reasoning baseline](03--reasoning-effort/001-low-minimal-none-baseline.md)
- CX-010: [medium reasoning (skill default)](03--reasoning-effort/002-medium-skill-default.md)
- CX-011: [high / xhigh override](03--reasoning-effort/003-high-xhigh-override.md)

### AGENT ROUTING

- CX-012: [@review profile (read-only)](04--agent-routing/001-review-profile.md)
- CX-013: [@context profile (architecture mapping)](04--agent-routing/002-context-profile.md)
- CX-014: [@debug profile (workspace-write fix)](04--agent-routing/003-debug-profile.md)
- CX-015: [@ultra-think profile (multi-strategy planning)](04--agent-routing/004-ultra-think-profile.md)

### SESSION CONTINUITY

- CX-016: [--full-auto + native hook integration](05--session-continuity/001-full-auto-hooks.md)
- CX-017: [session resume / fork](05--session-continuity/002-session-resume-fork.md)

### INTEGRATION PATTERNS

- CX-018: [Cross-AI generate-review-fix cycle](06--integration-patterns/001-generate-review-fix-cycle.md)
- CX-019: [Web search via --search](06--integration-patterns/002-web-search.md)
- CX-020: [Image input via --image](06--integration-patterns/003-image-input.md)

### PROMPT TEMPLATES

- CX-021: [Use prompt_templates.md inventory](07--prompt-templates/001-prompt-templates-inventory.md)
- CX-022: [CLEAR scoring via prompt_quality_card.md](07--prompt-templates/002-clear-scoring-quality-card.md)

### BUILT-IN TOOLS

- CX-023: [/review TUI command](08--built-in-tools/001-review-tui-command.md)
- CX-024: [--search live browsing in exec](08--built-in-tools/002-search-exec-mode.md)
- CX-025: [codex mcp server registration](08--built-in-tools/003-mcp-server-registration.md)
