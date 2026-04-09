---
title: "Consolidated Cross-Phase Research Report — 999 Agentic System Upgrade"
description: "Synthesis of 9 parallel deep-research phases (10 iterations each) investigating external agentic systems for system-spec-kit improvement opportunities. 19 must-have, 38 should-have, 14 nice-to-have findings aggregated after deduplicating 2 cross-phase overlaps."
importance_tier: "critical"
contextType: "research"
---

# Consolidated Cross-Phase Research Report — 999 Agentic System Upgrade

## 1. Executive Summary

- Phases surveyed: 9 / 9
- Total iterations executed: 90
- External repos researched:
  - `001-agent-lightning-main` — Microsoft Research agent-optimization framework centered on tracing, rewards, adapters, and trainer/store orchestration. [SOURCE: 001-agent-lightning-main/research/research.md:10-21]
  - `002-babysitter-main` — TypeScript process-as-code runtime with append-only journals, replay, harness discovery, and lifecycle hooks. [SOURCE: 002-babysitter-main/research/research.md:10-27]
  - `003-claude-code-mastery-project-starter-kit-main` — Claude-first starter kit with command metadata, hooks, `.mdd/` artifacts, and a dense `CLAUDE.md` operator surface. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:10-27]
  - `004-get-it-right-main` — retry-based coding workflow for brownfield work with explicit implement/check/review/refactor loop control. [SOURCE: 004-get-it-right-main/research/research.md:10-39]
  - `005-intellegix-code-agent-toolkit-master` — autonomous loop toolkit with completion gates, orchestrator guards, council synthesis, and portfolio governance overlays. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:10-24]
  - `006-ralph-main` — minimal Bash loop that keeps work fresh-context, one-task-at-a-time, and durable through git plus append-only progress. [SOURCE: 006-ralph-main/research/research.md:10-46]
  - `007-relay-main` — transport-first agent messaging system for multi-provider spawning, routing, readiness, and delivery semantics. [SOURCE: 007-relay-main/research/research.md:10-43]
  - `008-bmad-autonomous-development` — skill-packaged sprint/story orchestrator with staged execution, model tiering, and optional PR/CI follow-through. [SOURCE: 008-bmad-autonomous-development/research/research.md:10-46]
  - `009-xethryon` — OpenCode fork adding memory lifecycle hooks, reflection, git-aware continuity, autonomy toggles, and file-backed swarm artifacts. [SOURCE: 009-xethryon/research/research.md:10-33]
- Total actionable findings before deduplication: 73
  - Must-have: 19
  - Should-have: 40
  - Nice-to-have: 14
- Total actionable findings after deduplication: 71
  - Cross-phase duplicates merged: 2
  - Merged overlaps:
    - `004-F-003` + `006-F-003` into `CF-007`
    - `005-F-008` + `008-F-007` into `CF-019`
- Total rejected recommendations: 17
- Total tokens consumed: ~2.4M
- Synthesis note: blast radius, bundle boundaries, and adoption ordering below are synthesis judgments inferred from the phase reports plus current target-file verification in `.opencode/command/spec_kit/`, `.opencode/agent/`, `.opencode/skill/system-spec-kit/`, and sibling skill surfaces.

- **Top 10 cross-phase adoption opportunities for system-spec-kit**:
  1. `CF-001` — add a runtime manifest/resolver so autonomous workflows stop hardcoding runtime-specific agent paths. [SOURCE: 002-babysitter-main/research/research.md:92-97]
  2. `CF-002` — move high-risk workflow gates from documentation-only guidance into machine-readable runtime gate states. [SOURCE: 002-babysitter-main/research/research.md:64-69]
  3. `CF-004` — add a packet-level completion gate with explicit stop reasons for deep-research closeout. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:52-57]
  4. `CF-003` — require a claim-verification ledger in deep research so docs-vs-code mismatches are explicit artifacts. [SOURCE: 009-xethryon/research/research.md:57-62]
  5. `CF-008` — gate implementation retries behind objective pre-review validation. [SOURCE: 004-get-it-right-main/research/research.md:64-69]
  6. `CF-012` — split autonomous implementation into named, resumable stage contracts. [SOURCE: 008-bmad-autonomous-development/research/research.md:71-76]
  7. `CF-013` — introduce standard-vs-quality model tiering across autonomous YAML workflows. [SOURCE: 008-bmad-autonomous-development/research/research.md:78-83]
  8. `CF-005` — enrich deep-loop dashboards with richer operational metrics and liveness signals. [SOURCE: 001-agent-lightning-main/research/research.md:120-127]
  9. `CF-019` — expand deep-research tests from parity checks to runtime-behavior guarantees. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:101-106] [SOURCE: 008-bmad-autonomous-development/research/research.md:92-97]
  10. `CF-006` — add narrow Claude-only secret guardrails on top of the existing recovery-first hook stack. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:82-86]

- **Critical bundles**:
  - `Runtime Governance Core` — phases `002`, `005`, `007`, `009`; converges on runtime manifests, gate states, closeout controls, and explicit evidence ledgers.
  - `Autonomous Implement Control Plane` — phases `004`, `006`, `008`; converges on fresh-context retries, validation-first loops, task sizing, and staged execution.
  - `Coordination Contract Parity` — phases `001`, `005`, `007`, `008`, `009`; converges on stronger orchestrator boundaries, machine-readable role semantics, and cross-provider vocabulary.
  - `Continuity And Audit Trail` — phases `001`, `002`, `005`, `006`, `009`; converges on journals, richer loop metrics, resumable summaries, git lineage, and progress artifacts.
  - `Operator Guardrails And UX` — phases `002`, `003`, `005`, `009`; converges on thinner but more enforceable operator surfaces, runtime-specific guardrails, and explicit publication critique.

## 2. Per-Phase Summary Table

| Phase | External repo | Iterations | Must | Should | Nice | Rejected | Headline finding |
|-------|---------------|------------|------|--------|------|----------|------------------|
| 001 | Agent Lightning | 10 | 1 | 5 | 1 | 3 | Deep-research and deep-review loops need richer operational metrics before more ambitious RL-style ideas. |
| 002 | Babysitter | 10 | 2 | 6 | 1 | 1 | A runtime manifest plus machine-readable gate states is the clearest orchestration upgrade. |
| 003 | Claude Code Mastery Starter Kit | 10 | 1 | 5 | 2 | 2 | Narrow Claude-only secret guardrails are a low-risk, high-value hook-layer addition. |
| 004 | Get It Right | 10 | 5 | 4 | 0 | 1 | An opt-in retry controller should validate objectively before review and stay phase-scoped. |
| 005 | Intellegix Code Agent Toolkit | 10 | 2 | 4 | 2 | 2 | Deep research needs a real completion gate, explicit stop taxonomy, and runtime-level tests. |
| 006 | Ralph | 10 | 2 | 4 | 2 | 2 | Reliability improves upstream when tasks are one-window-sized and one-task-per-run is enforced. |
| 007 | Relay | 10 | 3 | 4 | 2 | 1 | Delegation docs need shared event, provider, and coordination vocabularies before any live broker work. |
| 008 | BMad Autonomous Development | 10 | 2 | 4 | 1 | 3 | Autonomous implementation should become a staged pipeline, and model tiers should stop treating every step as premium. |
| 009 | Xethryon | 10 | 1 | 4 | 3 | 2 | Deep research should explicitly record whether external claims were verified, contradicted, or unresolved. |

## 3. Aggregated Must-Have Findings

### CF-001 — Runtime Manifest And Resolver For Autonomous Workflows
- **Origin phase(s)**: `002-F-007` (`iteration-007`)
- **External source**: [SOURCE: 002-babysitter-main/external/plugins/babysitter-opencode/plugin.json:2-10] [SOURCE: 002-babysitter-main/external/packages/sdk/src/harness/discovery.ts:49-126]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, new runtime-manifest helper under `.opencode/skill/system-spec-kit/scripts/core/`
- **Change type**: modified existing + new helper
- **Blast radius**: medium
- **Cross-phase convergence**: aligns with `007-F-005` provider-capability docs and `003-F-007` command metadata, but only phase `002` recommends a resolver layer.
- **Adoption summary**: This is the most direct fix for a live mismatch: the deep-research YAML still points at a Claude-specific agent path even though the repo-wide routing rule expects runtime-specific resolution. A manifest/resolver would turn runtime selection into data, reduce drift across auto/confirm assets, and create a clean seam for future provider capability checks.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:92-97] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-74]
- **Risk / dependencies**: Requires choosing a single manifest schema before editing the current YAML assets and any future helper that resolves runtime directories.

### CF-002 — Machine-Readable Runtime Gate States For High-Risk Workflows
- **Origin phase(s)**: `002-F-003` (`iteration-003`)
- **External source**: [SOURCE: 002-babysitter-main/external/README.md:319-376] [SOURCE: 002-babysitter-main/external/packages/sdk/src/runtime/orchestrateIteration.ts:106-114]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: reinforced by `003-F-005`, `005-F-005`, and `009-F-003`, which all push toward thinner prompt text and stronger runtime enforcement.
- **Adoption summary**: Several phases converged on the same weakness from different angles: `system-spec-kit` has strong gate language, but most of it still lives in markdown and prompts instead of executable control flow. Converting the highest-risk deep-research approvals and stop conditions into machine-readable states would make auto mode auditable, keep confirm mode semantically consistent, and reduce the current gap between constitutional guidance and runtime behavior.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:64-69] [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173]
- **Risk / dependencies**: Best implemented alongside `CF-001` so gate logic is runtime-neutral rather than immediately coupled to one harness.

### CF-003 — Claim-Verification Ledger For Deep Research
- **Origin phase(s)**: `009-F-001` (`iteration-010`)
- **External source**: [SOURCE: 009-xethryon/external/README.md:11-18] [SOURCE: 009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171]
- **system-spec-kit target**: `.opencode/agent/deep-research.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: complements `005-F-001` and `007-F-007`, which both push for more explicit deep-research closeout contracts.
- **Adoption summary**: This is the smallest high-leverage research-quality change in the entire wave. Instead of assuming that phase reports will naturally record README-vs-code mismatches, the deep-research contract should require a compact ledger that marks important external claims as `verified`, `contradicted`, or `unresolved`. That turns a recurring review concern into a standard artifact and raises the reliability of every future external-system packet.
- **Evidence**: [SOURCE: 009-xethryon/research/research.md:57-62] [SOURCE: .opencode/agent/deep-research.md:113-120]
- **Risk / dependencies**: Low-risk; requires only a small contract change and a matching synthesis expectation.

### CF-004 — Packet-Level Completion Gate And Explicit Stop Reasons
- **Origin phase(s)**: `005-F-001` (`iteration-001`)
- **External source**: [SOURCE: 005-intellegix-code-agent-toolkit-master/external/automated-loop/loop_driver.py:33-37] [SOURCE: 005-intellegix-code-agent-toolkit-master/external/automated-loop/loop_driver.py:541-587]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: reinforced by `001-F-002`, `005-F-004`, and `007-F-007`, which all point toward clearer terminal-state semantics.
- **Adoption summary**: Deep research already converges; it just does not yet close out with a strong enough taxonomy. A completion gate with explicit terminal causes such as `complete`, `converged`, `budget_stop`, and `stagnation` would make autonomous runs easier to interpret, easier to test, and easier to compare across packets. This is the natural companion to `CF-003` because one improves evidence quality and the other improves stop-state quality.
- **Evidence**: [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:52-57] [SOURCE: .opencode/command/spec_kit/deep-research.md:177-185]
- **Risk / dependencies**: Medium; it touches user-visible reporting strings, YAML flow, and the loop protocol reference together.

### CF-005 — Richer Loop Metrics And Dashboard Signals
- **Origin phase(s)**: `001-F-008` (`iteration-008`)
- **External source**: [SOURCE: 001-agent-lightning-main/external/agentlightning/store/base.py:75-101] [SOURCE: 001-agent-lightning-main/external/docs/deep-dive/store.md:74-82]
- **system-spec-kit target**: `.opencode/command/spec_kit/deep-research.md`, reducer-owned dashboard/reporting surfaces
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: reinforced by `005-F-004`, `002-F-001`, and `006-F-005`, all of which push toward better operational visibility and continuity.
- **Adoption summary**: Public already has dashboards and trend reporting; it just does not extract enough of the right loop telemetry. Adding source-diversity counts, no-signal streaks, blocked-approach counts, files-read totals, and duration metrics is a low-risk observability upgrade that will make later governance work far easier to debug.
- **Evidence**: [SOURCE: 001-agent-lightning-main/research/research.md:120-127] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:59-112]
- **Risk / dependencies**: Best paired with `CF-004` so metrics line up with explicit stop states instead of free-form narrative.

### CF-006 — Claude-Only Secret Guardrails
- **Origin phase(s)**: `003-F-006` (`iteration-006`)
- **External source**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:13-29] [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/verify-no-secrets.sh:42-77]
- **system-spec-kit target**: `.claude/settings.local.json`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: pairs well with `002-F-003` and `005-F-005`, but remains deliberately runtime-specific rather than a repo-wide governance change.
- **Adoption summary**: This is the clearest narrow-scope hardening finding: add a pre-tool secret blocker and a stop-time staged-file secret scan for Claude runs only. It complements the existing recovery-first hook stack without forcing a new cross-runtime enforcement abstraction.
- **Evidence**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:82-86]
- **Risk / dependencies**: Low-risk, but intentionally scoped to Claude until other runtimes have equivalent hook surfaces.

### CF-007 — Fresh-Context Iteration Semantics As A First-Class Retry Pattern
- **Origin phase(s)**: `004-F-003` (`iteration-003`), convergent support from `006-F-003` (`iteration-001`)
- **External source**: [SOURCE: 004-get-it-right-main/external/docs/thread-architecture.md:152-170] [SOURCE: 006-ralph-main/external/ralph.sh:84-107]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: phases `004` and `006` independently validated fresh-context execution as the durable-state-friendly pattern for long autonomous work.
- **Adoption summary**: Two unrelated repos landed on the same principle: keep long-running autonomy reliable by externalizing continuity and spawning each attempt with a clean context window. For `system-spec-kit`, that means future retry-capable implementation flows should inherit deep-research-style fresh contexts instead of growing transcript state between attempts.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:57-62] [SOURCE: 006-ralph-main/research/research.md:64-69]
- **Risk / dependencies**: Depends on clear retry-state ownership so packet-local state, not chat accumulation, carries continuity.

### CF-008 — Pre-Review Validation Gate For Retryable Implementation
- **Origin phase(s)**: `004-F-004` (`iteration-004`)
- **External source**: [SOURCE: 004-get-it-right-main/external/workflow.yaml:310-317]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: reinforced by `008-F-004`, which also argues for finer-grained staged execution inside autonomous implementation.
- **Adoption summary**: The cheapest reliability win in the implementation track is to fail broken attempts before semantic review. `system-spec-kit` already has objective validators; the missing piece is wiring them into retry-oriented flow control so review only runs when a candidate clears the baseline checks.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:64-69] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:445-452]
- **Risk / dependencies**: Depends on defining a reusable verification matrix or at least a minimal default validator set.

### CF-009 — Configurable Parallel Verification Matrix
- **Origin phase(s)**: `004-F-008` (`iteration-009`)
- **External source**: [SOURCE: 004-get-it-right-main/external/workflow.yaml:165-181]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: complements `CF-008` and `008-F-004`; phase `004` is the only report that makes the matrix itself a first-class recommendation.
- **Adoption summary**: A pre-review gate becomes much more useful when the checks are explicit, configurable, and parallelizable. This finding turns the abstract "run validation first" idea into a concrete orchestration primitive: choose the right objective checks for a project, run them concurrently, and feed the combined result into the retry controller.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:92-97] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-405]
- **Risk / dependencies**: Needs a bounded first version so the matrix does not become an everything-runner.

### CF-010 — Keep The Retry Design Internal To Spec Kit, Not Platform-Specific
- **Origin phase(s)**: `004-F-006` (`iteration-007`)
- **External source**: [SOURCE: 004-get-it-right-main/external/docs/thread-architecture.md:7-15]
- **system-spec-kit target**: `.opencode/command/spec_kit/implement.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: reinforced by `006-F-008`, which also treats external loop models as overlays rather than replacement runtimes.
- **Adoption summary**: This finding is architectural hygiene: borrow the retry controller pattern, not the Reliant runtime assumptions. The local docs should frame any future implementation-retry mode as a `system-spec-kit` workflow built from its own YAML, validators, and packet artifacts.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:78-83] [SOURCE: .opencode/command/spec_kit/implement.md:171-183]
- **Risk / dependencies**: Low-risk, but it should be documented before any retry-mode implementation starts to avoid scope drift.

### CF-011 — Keep The Retry Loop Opt-In And Phase-Scoped
- **Origin phase(s)**: `004-F-009` (`iteration-010`)
- **External source**: [SOURCE: 004-get-it-right-main/external/docs/when-to-use.md:5-52]
- **system-spec-kit target**: `.opencode/command/spec_kit/implement.md`
- **Change type**: added option
- **Blast radius**: small
- **Cross-phase convergence**: aligned with `006-F-002` and `008-F-004`, which also argue for tighter scope and explicit execution boundaries.
- **Adoption summary**: The retry controller should be a targeted mode for hard brownfield implementation cases, not a universal replacement for `/spec_kit:implement`. Keeping it opt-in protects current workflows while still letting the repo adopt the most transferable part of Get It Right.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:99-104]
- **Risk / dependencies**: Best decided at the same time as the initial entrypoint and user-facing invocation syntax.

### CF-012 — Stage Contracts For Autonomous Implementation
- **Origin phase(s)**: `008-F-004` (`iteration-005`)
- **External source**: [SOURCE: 008-bmad-autonomous-development/external/skills/bad/SKILL.md:189-205] [SOURCE: 008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:1-88]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: strengthens `CF-008` and `CF-009` by giving implementation flow named resume points and checkpoint boundaries.
- **Adoption summary**: `system-spec-kit` autonomous implementation already has strong gates around development, but its central execution step is still too coarse. Breaking it into explicit create/build/review/closeout-style stage contracts would make resumes safer, error attribution clearer, and any future controller logic easier to reason about.
- **Evidence**: [SOURCE: 008-bmad-autonomous-development/research/research.md:71-76] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:392-449]
- **Risk / dependencies**: Depends on agreeing whether stage outputs are narrative-only, machine-readable, or both.

### CF-013 — Model Tiering For Autonomous Workflows
- **Origin phase(s)**: `008-F-005` (`iteration-006`)
- **External source**: [SOURCE: 008-bmad-autonomous-development/external/skills/bad/SKILL.md:51-64]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, adjacent autonomous YAML assets
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: complements `005-F-003` and `005-F-004`, which both argue for more explicit runtime controls in long autonomous runs.
- **Adoption summary**: The current one-premium-model default leaks cost into every autonomous step, even when the work is mechanical. A standard-vs-quality tier split is a pragmatic optimization because it preserves premium synthesis/review where it matters while lowering the cost of initialization, routing, or repetitive substeps.
- **Evidence**: [SOURCE: 008-bmad-autonomous-development/research/research.md:78-83] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66-75]
- **Risk / dependencies**: Requires explicit quality-sensitive boundaries so cheaper tiers do not silently degrade synthesis quality.

### CF-014 — One-Window Task Sizing Rules
- **Origin phase(s)**: `006-F-001` (`iteration-005`)
- **External source**: [SOURCE: 006-ralph-main/external/skills/ralph/SKILL.md:46-126] [SOURCE: 006-ralph-main/external/skills/prd/SKILL.md:69-92]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: reinforced by `004-F-009` and `008-F-004`, which both assume more tightly bounded implementation units.
- **Adoption summary**: This is the highest-value upstream planning change. Rather than treating task sizing as an informal estimate, Spec Kit should explicitly require tasks that fit one context window, carry verifiable acceptance criteria, and respect dependency order. That makes the later automation work far more reliable.
- **Evidence**: [SOURCE: 006-ralph-main/research/research.md:50-55]
- **Risk / dependencies**: Low-risk, but templates and task-writing guidance should be updated together.

### CF-015 — One Task Per Autonomous Implementation Run
- **Origin phase(s)**: `006-F-002` (`iteration-009`)
- **External source**: [SOURCE: 006-ralph-main/external/prompt.md:10-17]
- **system-spec-kit target**: `.opencode/command/spec_kit/implement.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: pairs naturally with `CF-014` and with the opt-in retry architecture from phase `004`.
- **Adoption summary**: Planning constraints are not enough if runtime behavior can still sprawl. `/spec_kit:implement` should state that one autonomous run owns one verified task or story at a time, which makes retries, checklists, and handovers all easier to reason about.
- **Evidence**: [SOURCE: 006-ralph-main/research/research.md:57-62] [SOURCE: .opencode/command/spec_kit/implement.md:171-183]
- **Risk / dependencies**: Low-risk documentation-plus-contract change; strongest when introduced together with `CF-014`.

### CF-016 — Shared Event Glossary Across Delegation Surfaces
- **Origin phase(s)**: `007-F-002` (`iteration-002`)
- **External source**: [SOURCE: 007-relay-main/external/packages/sdk/README.md:38-73] [SOURCE: 007-relay-main/external/packages/sdk/src/relay.ts:1219-1294]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`, `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: supported by `001-F-006`, `005-F-005`, `008-F-001`, and `009-F-005`, all of which push for clearer machine-readable coordination semantics.
- **Adoption summary**: Public delegation guidance is currently conceptually strong but terminologically thin. A shared event glossary for spawn, ready, message receipt, output, idle, and release states would make current docs clearer now and future transport work much less fragmented.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:53-57]
- **Risk / dependencies**: Needs one repo-wide vocabulary owner so the three CLI delegation references stay aligned after the first pass.

### CF-017 — Provider Capability Matrix Across Delegation References
- **Origin phase(s)**: `007-F-005` (`iteration-005`)
- **External source**: [SOURCE: 007-relay-main/external/packages/sdk/README.md:107-143] [SOURCE: 007-relay-main/external/packages/sdk/src/client.ts:326-377]
- **system-spec-kit target**: `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: aligns with `003-F-007` and `007-F-009`, which both ask for more metadata-driven parity across command/delegation surfaces.
- **Adoption summary**: Relay makes capability differences explicit at the provider boundary instead of burying them in narrative docs. Public should do the same with a shared matrix for PTY/headless expectations, runtime constraints, and delegation affordances across Codex, Gemini, and Copilot.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:71-75]
- **Risk / dependencies**: Requires agreeing which capability dimensions are canonical so the matrix does not become prose-only documentation drift.

### CF-018 — Shared Coordination Taxonomy: Team, Fan-Out, Pipeline
- **Origin phase(s)**: `007-F-006` (`iteration-006`)
- **External source**: [SOURCE: 007-relay-main/external/README.md:70-85] [SOURCE: 007-relay-main/external/docs/plugin-claude-code.md:27-53]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`, `.opencode/command/spec_kit/deep-research.md`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: supported by `008-F-001` and `009-F-005`, which both ask for sharper coordinator and role-transition contracts.
- **Adoption summary**: Public already uses team-led decomposition, parallel fan-out, and sequential pipeline flows; it just does not name them consistently. Naming these shapes would immediately improve prompts, docs, and future automation logic without committing the repo to a live broker design.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:77-81]
- **Risk / dependencies**: Low-to-medium; terminology needs to be introduced consistently across command, asset, and agent surfaces.

### CF-019 — Runtime-Behavior Test Expansion For Deep Research
- **Origin phase(s)**: `005-F-008` (`iteration-010`), convergent support from `008-F-007` (`iteration-009`)
- **External source**: [SOURCE: 005-intellegix-code-agent-toolkit-master/external/automated-loop/tests/test_loop_driver.py:2213-2468] [SOURCE: 008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:9-23]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: phases `005` and `008` both concluded that new automation contracts should be protected by runtime assertions, not only docs or parity snapshots.
- **Adoption summary**: The research program repeatedly found design improvements that only stay real if the runtime contract is executable in tests. Expanding deep-research tests to assert stop reasons, completion-gate rejection, fallback boundaries, and path/config parity is the best protection against the exact documentation/runtime drift this packet is trying to prevent.
- **Evidence**: [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:101-106] [SOURCE: 008-bmad-autonomous-development/research/research.md:92-97]
- **Risk / dependencies**: Best done alongside `CF-004` so new stop states and gates land with matching test coverage from day one.

## 4. Aggregated Should-Have Findings

### Convergence Theme S-001 — Loop Runtime Resilience And Auditability

### CF-020 — Checksummed Event Journal For Research Workflows
- **Origin phase(s)**: `002-F-001` (`iteration-001`)
- **External source**: [SOURCE: 002-babysitter-main/external/packages/sdk/src/storage/journal.ts:27-49]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, new helper under `.opencode/skill/system-spec-kit/scripts/core/`
- **Change type**: new module + modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: aligns with `CF-021`, `CF-029`, `CF-054`, and `CF-056` in the broader continuity theme.
- **Adoption summary**: An append-only event journal would give deep-research and deep-review runs an auditable recovery spine without replacing the current narrative artifacts.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:50-55]
- **Risk / dependencies**: Needs a small event schema and a clear boundary between journal entries and human-readable state artifacts.

### CF-021 — Journal-Head Validation For Cached Session Summaries
- **Origin phase(s)**: `002-F-002` (`iteration-002`)
- **External source**: [SOURCE: 002-babysitter-main/external/packages/sdk/src/runtime/replay/createReplayEngine.ts:95-129]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: complements `009-F-004` runtime-agnostic continuity synopsis and `CF-020` event journaling.
- **Adoption summary**: Current cached continuity already validates fidelity aggressively; a journal-head check would add a stronger producer/consumer consistency guarantee for long-running autonomous sessions.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:57-62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-249]
- **Risk / dependencies**: More valuable if `CF-020` lands first or if a smaller event-head surrogate is introduced.

### CF-022 — Auto-Mode Approval Audit Records
- **Origin phase(s)**: `002-F-004` (`iteration-004`)
- **External source**: [SOURCE: 002-babysitter-main/external/packages/sdk/src/runtime/intrinsics/breakpoint.ts:43-55]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: supports `CF-002` by keeping auto approvals explicit instead of silently bypassed.
- **Adoption summary**: Auto mode should mean "approved under policy," not "approval never existed." Logging that distinction would strengthen auditability without changing user-facing flow.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:71-76]
- **Risk / dependencies**: Low-risk; easiest when implemented alongside gate-state work.

### CF-023 — Pending-Action Queues For Research And Review
- **Origin phase(s)**: `002-F-005` (`iteration-005`)
- **External source**: [SOURCE: 002-babysitter-main/external/packages/sdk/src/runtime/intrinsics/parallel.ts:19-38]
- **system-spec-kit target**: `.opencode/agent/deep-research.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: reinforced by `009-F-008`, which proposes packet-local coordination artifacts for higher-scale work.
- **Adoption summary**: A small structured queue of unresolved next actions would make blocked or partially parallel runs easier to resume safely than today’s narrative-only state.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:78-83]
- **Risk / dependencies**: Should stay reducer-owned and packet-local so it does not become a second durable memory system.

### CF-024 — Headless Internal Runner For Overnight And CI-Style Work
- **Origin phase(s)**: `002-F-008` (`iteration-009`)
- **External source**: [SOURCE: 002-babysitter-main/external/packages/sdk/src/harness/discovery.ts:209-237]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/scripts/`, `.opencode/command/spec_kit/`
- **Change type**: new module
- **Blast radius**: medium
- **Cross-phase convergence**: complements `CF-013`, `CF-019`, and `008-F-006` by making autonomous execution more operationally coherent.
- **Adoption summary**: A thin internal runner would help overnight and CI-style flows share the same contract as interactive runs instead of depending on one-off scripts.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:99-104]
- **Risk / dependencies**: Needs strict scope or it will expand into a second orchestration surface.

### CF-025 — First-Class Workflow Lifecycle Hooks
- **Origin phase(s)**: `002-F-009` (`iteration-010`)
- **External source**: [SOURCE: 002-babysitter-main/external/packages/sdk/src/hooks/types.ts:7-22]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/mcp_server/hooks/`, `.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`, `.opencode/command/spec_kit/assets/*.yaml`
- **Change type**: architectural shift
- **Blast radius**: large
- **Cross-phase convergence**: reinforced by `003-F-005` and `005-F-005`, which also argue for thinner prompt guidance and stronger runtime-enforced boundaries.
- **Adoption summary**: If more deterministic workflow execution lands, the hook system should expand from response/mutation cleanup into explicit init/iteration/approval/convergence/save lifecycle events.
- **Evidence**: [SOURCE: 002-babysitter-main/research/research.md:106-111]
- **Risk / dependencies**: High coupling risk; should follow, not precede, manifest and gate-state work.

### CF-026 — Attempt Lifecycle Vocabulary For Long-Running Loops
- **Origin phase(s)**: `001-F-002` (`iteration-002`)
- **External source**: [SOURCE: 001-agent-lightning-main/external/docs/deep-dive/store.md:22-72]
- **system-spec-kit target**: `.opencode/command/spec_kit/deep-research.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: aligns with `CF-004`, `CF-022`, and `CF-031`.
- **Adoption summary**: A smaller operational vocabulary for states like preparing, running, timeout, retry, and recovery would make overnight research runs easier to understand.
- **Evidence**: [SOURCE: 001-agent-lightning-main/research/research.md:75-82]
- **Risk / dependencies**: Works best if the stop taxonomy is already agreed.

### CF-027 — Structured Evaluator Payloads
- **Origin phase(s)**: `001-F-003` (`iteration-003`)
- **External source**: [SOURCE: 001-agent-lightning-main/external/agentlightning/emitter/reward.py:148-210]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: complements `CF-005` because richer evaluator structure improves what later dashboards can actually report.
- **Adoption summary**: Optional multi-dimensional evaluator payloads would preserve current simple validation paths while leaving room for richer scoring later.
- **Evidence**: [SOURCE: 001-agent-lightning-main/research/research.md:84-91]
- **Risk / dependencies**: Needs careful backward compatibility with the current `wasUseful`-style feedback contract.

### CF-028 — Reducer Adapter Boundary For Deep-Research Outputs
- **Origin phase(s)**: `001-F-004` (`iteration-004`)
- **External source**: [SOURCE: 001-agent-lightning-main/external/agentlightning/adapter/base.py:13-20]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type**: architectural shift
- **Blast radius**: medium
- **Cross-phase convergence**: pairs with `CF-019` because explicit normalization seams are easier to test than implicit reducer behavior.
- **Adoption summary**: A stable normalization contract between raw iteration artifacts and downstream dashboards/registries would reduce coupling and make later reporting changes safer.
- **Evidence**: [SOURCE: 001-agent-lightning-main/research/research.md:93-100]
- **Risk / dependencies**: Needs a narrow first version to avoid over-abstracting the current reducer.

### CF-029 — Runtime Session Continuity Beside Lineage
- **Origin phase(s)**: `005-F-002` (`iteration-002`)
- **External source**: [SOURCE: 005-intellegix-code-agent-toolkit-master/external/automated-loop/state_tracker.py:65-76]
- **system-spec-kit target**: `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: fits the same continuity bucket as `CF-021` and `CF-056`.
- **Adoption summary**: Separating resumable runtime session handles from higher-level lineage would help capable runtimes preserve continuity more precisely without forcing that model on all runtimes.
- **Evidence**: [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:59-64]
- **Risk / dependencies**: Must remain capability-gated so runtimes without true resume handles do not accumulate dead fields.

### CF-030 — Operational Backoff, Cooldown, And Single-Step Fallback
- **Origin phase(s)**: `005-F-003` (`iteration-003`)
- **External source**: [SOURCE: 005-intellegix-code-agent-toolkit-master/external/automated-loop/config.py:36-71]
- **system-spec-kit target**: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: related to `CF-013` and `CF-031`; all three introduce operational shaping for long autonomous runs.
- **Adoption summary**: Bounded cooldown and fallback behavior would make overnight autonomy more robust without changing the happy-path workflow.
- **Evidence**: [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:66-71]
- **Risk / dependencies**: Should remain optional; default behavior should stay simple for lighter runtimes.

### CF-031 — Session-Health Signals Before Stagnation
- **Origin phase(s)**: `005-F-004` (`iteration-004`)
- **External source**: [SOURCE: 005-intellegix-code-agent-toolkit-master/external/automated-loop/loop_driver.py:1064-1143]
- **system-spec-kit target**: `.opencode/skill/sk-deep-research/references/convergence.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: complements `CF-005`, `CF-026`, and `CF-030`.
- **Adoption summary**: Stagnation should not always mean "research is conceptually done"; sometimes it means the session is tired. A session-health layer would let compatible runtimes refresh context before escalation.
- **Evidence**: [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:73-78]
- **Risk / dependencies**: Needs clear heuristics so it does not mask true convergence or failure.

### Convergence Theme S-002 — Operator Workflows, UX, And Guardrails

### CF-032 — Claude-Only Quick Reference Layer
- **Origin phase(s)**: `003-F-001` (`iteration-001`)
- **External source**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-31]
- **system-spec-kit target**: `.claude/CLAUDE.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: complements `CF-006` and `CF-035`; all three aim to make Claude-specific operation sharper without replacing root governance.
- **Adoption summary**: The local root `CLAUDE.md` should remain canonical, but the runtime-specific Claude surface could be more compressed and action-oriented.
- **Evidence**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:52-56]
- **Risk / dependencies**: Low-risk as long as it mirrors, not forks, root guidance.

### CF-033 — Guided Doc-First Front Door
- **Origin phase(s)**: `003-F-002` (`iteration-002`)
- **External source**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:44-71]
- **system-spec-kit target**: `.opencode/command/spec_kit/README.txt`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: aligns with `006-F-001` because both try to reduce cognitive overload before execution begins.
- **Adoption summary**: A more guided front door could make the existing Spec Kit lifecycle easier to enter without weakening any of the current governance.
- **Evidence**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:58-62]
- **Risk / dependencies**: Needs careful wording so it routes into existing commands instead of inventing a parallel workflow.

### CF-034 — Lightweight Working-Brief Template
- **Origin phase(s)**: `003-F-004` (`iteration-004`)
- **External source**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-13]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/templates/`
- **Change type**: new module
- **Blast radius**: small
- **Cross-phase convergence**: aligns with `006-F-005` progress artifact and `003-F-003` compressed-brief nice-to-have.
- **Adoption summary**: A lighter mid-session brief would improve scanability without replacing the durable packet and handover surfaces.
- **Evidence**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:70-74]
- **Risk / dependencies**: Keep it explicitly supplementary so it does not become a competing packet document.

### CF-035 — Thin Enforcement Layer On Top Of Recovery Hooks
- **Origin phase(s)**: `003-F-005` (`iteration-005`)
- **External source**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:2-64]
- **system-spec-kit target**: `.claude/settings.local.json`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: strongly aligned with `CF-002`, `CF-006`, and `CF-046`.
- **Adoption summary**: The best hook architecture is hybrid: keep recovery and continuity as the core, then add a minimal enforcement layer where it provides clear operator safety value.
- **Evidence**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:76-80]
- **Risk / dependencies**: Depends on scoping the enforcement hooks narrowly enough to avoid breaking current recovery behavior.

### CF-036 — Command Audience And Distribution Metadata
- **Origin phase(s)**: `003-F-007` (`iteration-008`)
- **External source**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-25]
- **system-spec-kit target**: `.opencode/command/README.txt`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: overlaps with `CF-017` and `CF-050`, both of which want metadata-driven parity instead of static prose drift.
- **Adoption summary**: Audience and distribution metadata would let command help stay more adaptive and less copy-maintained across surfaces.
- **Evidence**: [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:88-92]
- **Risk / dependencies**: Requires deciding whether metadata lives in frontmatter, a registry, or both.

### CF-055 — Explicit One-Pass Publication Critique
- **Origin phase(s)**: `009-F-003` (`iteration-005`)
- **External source**: [SOURCE: 009-xethryon/external/packages/opencode/src/session/prompt.ts:1383-1431]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: complements `CF-003` and `CF-004`; all three improve the last mile of research publication.
- **Adoption summary**: A single explicit critique pass before publication would make deep-research synthesis quality easier to audit than today’s mostly implicit guardrail stack.
- **Evidence**: [SOURCE: 009-xethryon/research/research.md:71-76]
- **Risk / dependencies**: Should stay bounded and logged, not become a hidden multi-pass reflection runtime.

### Convergence Theme S-003 — Autonomous Implementation Ergonomics

### CF-037 — Opt-In Attempt Controller
- **Origin phase(s)**: `004-F-001` (`iteration-001`)
- **External source**: [SOURCE: 004-get-it-right-main/external/workflow.yaml:111-134]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: supported by `CF-012`, `CF-014`, and `CF-015`.
- **Adoption summary**: A first-class attempt controller would make difficult implementation retries less ad hoc and easier to supervise.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:43-48]
- **Risk / dependencies**: Should not ship without the validation and scope boundaries captured in the must-have section.

### CF-038 — Feedback-Only Bridge Between Attempts
- **Origin phase(s)**: `004-F-002` (`iteration-002`)
- **External source**: [SOURCE: 004-get-it-right-main/external/workflow.yaml:14-24]
- **system-spec-kit target**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: aligns with `CF-007`; both prefer fresh attempts plus compressed state over transcript carryover.
- **Adoption summary**: Retry attempts should consume a reviewer-authored corrective summary, not a full prior-attempt transcript.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:50-55]
- **Risk / dependencies**: Depends on defining a good summary format from the reviewer/controller step.

### CF-039 — Review Strategy Field
- **Origin phase(s)**: `004-F-005` (`iteration-005`)
- **External source**: [SOURCE: 004-get-it-right-main/external/workflow.yaml:191-223]
- **system-spec-kit target**: `.opencode/agent/review.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: supports `CF-037` because a retry controller needs an explicit pass/continue/refactor-style branch decision.
- **Adoption summary**: The review agent is already a good scorer; this finding asks it to become a clearer controller output when retries are in play.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:71-76]
- **Risk / dependencies**: Only valuable if a retry-capable implementation mode is actually introduced.

### CF-040 — Keep Retry Feedback Packet-Local
- **Origin phase(s)**: `004-F-007` (`iteration-008`)
- **External source**: [SOURCE: 004-get-it-right-main/external/docs/thread-architecture.md:11-15]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/SKILL.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: aligns with `009-F-008`, which also prefers reducer-owned packet artifacts over a second durable memory channel.
- **Adoption summary**: Retry-state should live in packet-local workflow artifacts, not in long-term semantic memory by default.
- **Evidence**: [SOURCE: 004-get-it-right-main/research/research.md:85-90]
- **Risk / dependencies**: Low-risk if reducer-owned artifacts are already the chosen retry-state home.

### CF-053 — Opt-In PR Watch And Repair Loop
- **Origin phase(s)**: `008-F-006` (`iteration-007`)
- **External source**: [SOURCE: 008-bmad-autonomous-development/external/skills/bad/SKILL.md:270-336]
- **system-spec-kit target**: `.opencode/skill/sk-git/references/finish_workflows.md`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: complements the broader staged-automation theme from phases `004` and `008`, but remains intentionally opt-in.
- **Adoption summary**: Treating PR creation as the middle of an automation loop rather than the end could be valuable, but only as an explicit advanced mode above today’s basic finish workflow.
- **Evidence**: [SOURCE: 008-bmad-autonomous-development/research/research.md:85-90]
- **Risk / dependencies**: Needs clear user opt-in and strong scoping so the git skill does not become a hidden batch scheduler.

### Convergence Theme S-004 — Coordination And Orchestrator Contracts

### CF-044 — Backend-Agnostic Tracer Contract
- **Origin phase(s)**: `001-F-001` (`iteration-001`)
- **External source**: [SOURCE: 001-agent-lightning-main/external/agentlightning/tracer/base.py:27-39]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`
- **Change type**: architectural shift
- **Blast radius**: medium
- **Cross-phase convergence**: aligns with `CF-016`, `CF-045`, and `CF-046`, but remains a prototype-later observability seam.
- **Adoption summary**: A narrow trace envelope around orchestration could become useful if Public later needs richer evaluation or coordination telemetry.
- **Evidence**: [SOURCE: 001-agent-lightning-main/research/research.md:66-73]
- **Risk / dependencies**: Should wait for a concrete trace consumer before implementation.

### CF-045 — Stable Agent-Role Labels For Targeted Analysis
- **Origin phase(s)**: `001-F-006` (`iteration-006`)
- **External source**: [SOURCE: 001-agent-lightning-main/external/agentlightning/adapter/triplet.py:317-359]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: complements `CF-016`, `CF-017`, and `CF-057`.
- **Adoption summary**: Stable machine-readable role labels would make future evaluation and coordination analysis easier without redesigning the orchestrator.
- **Evidence**: [SOURCE: 001-agent-lightning-main/research/research.md:111-118]
- **Risk / dependencies**: Low-risk if labels are introduced as metadata rather than user-facing prose only.

### CF-046 — Sentinel-Based Orchestrator Enforcement
- **Origin phase(s)**: `005-F-005` (`iteration-006`)
- **External source**: [SOURCE: 005-intellegix-code-agent-toolkit-master/external/hooks/orchestrator-guard.py:130-250]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: strongly aligned with `CF-002`, `CF-035`, and `CF-057`.
- **Adoption summary**: Optional runtime enforcement of orchestrator boundary rules would strengthen an area where the repo already has strong prompt-level governance.
- **Evidence**: [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:80-85]
- **Risk / dependencies**: Best after a manifest/gate model exists; otherwise enforcement logic will be brittle and runtime-specific.

### CF-047 — Ready-State Handshake Before Messaging
- **Origin phase(s)**: `007-F-001` (`iteration-001`)
- **External source**: [SOURCE: 007-relay-main/external/packages/sdk/src/relay.ts:889-940]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`, future transport module under `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type**: prototype later
- **Blast radius**: medium
- **Cross-phase convergence**: complements `CF-016` and `CF-048` if live coordination is ever prototyped.
- **Adoption summary**: If Public ever adds live message handoff, it should reserve the distinction between "spawned" and "message-safe" from the start.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:47-51]
- **Risk / dependencies**: Only valuable if a live coordination prototype is actually planned.

### CF-048 — Address Types: Channel, DM, Thread
- **Origin phase(s)**: `007-F-003` (`iteration-003`)
- **External source**: [SOURCE: 007-relay-main/external/packages/sdk/src/protocol.ts:30-41]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`, future transport-routing module under `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type**: prototype later
- **Blast radius**: medium
- **Cross-phase convergence**: pairs with `CF-047`; both belong to a future live-coordination abstraction, not to current docs-only improvements.
- **Adoption summary**: Conversation-scope address types should be defined before any future live coordination grows past generic task delegation.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:59-63]
- **Risk / dependencies**: Future-facing only; do not let it pre-empt simpler doc-contract work.

### CF-049 — Evidence-Based Completion Ladder
- **Origin phase(s)**: `007-F-007` (`iteration-007`)
- **External source**: [SOURCE: 007-relay-main/external/packages/sdk/src/workflows/README.md:210-254]
- **system-spec-kit target**: `.opencode/command/spec_kit/deep-research.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: directly reinforces `CF-004` and `CF-003`.
- **Adoption summary**: Deep-research closeout should document a clear order: verify, decide, then cite evidence.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:83-87]
- **Risk / dependencies**: Low-risk and mostly documentary if `CF-004` already lands.

### CF-050 — Cross-Surface Parity Rubric
- **Origin phase(s)**: `007-F-009` (`iteration-009`)
- **External source**: [SOURCE: 007-relay-main/external/packages/sdk/README.md:31-150] [SOURCE: 007-relay-main/external/packages/sdk-py/README.md:32-159]
- **system-spec-kit target**: `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: closely related to `CF-017` and `CF-036`.
- **Adoption summary**: Public’s delegation docs should keep the same mental model across provider surfaces even when the syntax differs.
- **Evidence**: [SOURCE: 007-relay-main/research/research.md:95-99]
- **Risk / dependencies**: Requires a single parity rubric owner or these docs will drift again quickly.

### CF-051 — Tighter Coordinator Boundaries
- **Origin phase(s)**: `008-F-001` (`iteration-001`)
- **External source**: [SOURCE: 008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: fits the same orchestrator-tightening trend as `CF-016`, `CF-046`, and `CF-057`.
- **Adoption summary**: The orchestrator should state even more explicitly that it selects work, delegates, monitors, and reports, but does not become an implementation agent.
- **Evidence**: [SOURCE: 008-bmad-autonomous-development/research/research.md:50-55]
- **Risk / dependencies**: Low-risk documentation refinement.

### CF-057 — Compact Role-Transition Trigger Matrix
- **Origin phase(s)**: `009-F-005` (`iteration-007`)
- **External source**: [SOURCE: 009-xethryon/external/packages/opencode/src/xethryon/autonomy.ts:35-77]
- **system-spec-kit target**: `.opencode/agent/orchestrate.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: closely aligned with `CF-051`, `CF-045`, and `CF-046`.
- **Adoption summary**: A compact trigger matrix would make correct role transitions easier to follow without weakening the current richer governance model.
- **Evidence**: [SOURCE: 009-xethryon/research/research.md:85-90]
- **Risk / dependencies**: Keep it as a summary layer over existing routing rules, not a replacement for them.

### Convergence Theme S-005 — Continuity, Planning, And Promotion Artifacts

### CF-041 — Git Lineage In Generated Memory Context
- **Origin phase(s)**: `006-F-004` (`iteration-003`)
- **External source**: [SOURCE: 006-ralph-main/external/README.md:165-168]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: aligns with `009-F-007` bootstrap-time git snapshot and the broader continuity theme.
- **Adoption summary**: Saved context would be easier to map back to code history if it carried small git references such as branch and HEAD commit.
- **Evidence**: [SOURCE: 006-ralph-main/research/research.md:71-76]
- **Risk / dependencies**: Low-risk if git metadata remains additive and optional.

### CF-042 — Append-Only Progress Artifact
- **Origin phase(s)**: `006-F-005` (`iteration-004`)
- **External source**: [SOURCE: 006-ralph-main/external/prompt.md:18-48]
- **system-spec-kit target**: new template such as `.opencode/skill/system-spec-kit/templates/progress-log.md`
- **Change type**: new module
- **Blast radius**: small
- **Cross-phase convergence**: related to `CF-034` working briefs and `CF-020` event journaling, but scoped to human-readable progress continuity.
- **Adoption summary**: An append-only progress log would fill the gap between full handovers and raw git history during long autonomous runs.
- **Evidence**: [SOURCE: 006-ralph-main/research/research.md:78-83]
- **Risk / dependencies**: Needs a crisp contract so it stays lightweight and does not become a second handover template.

### CF-043 — Guidance-Promotion Checkpoint
- **Origin phase(s)**: `006-F-006` (`iteration-008`)
- **External source**: [SOURCE: 006-ralph-main/external/prompt.md:50-74]
- **system-spec-kit target**: `.opencode/agent/deep-research.md`
- **Change type**: modified existing
- **Blast radius**: small
- **Cross-phase convergence**: complements `CF-003`; both make research learnings easier to operationalize instead of leaving them implicit.
- **Adoption summary**: Deep research should more explicitly ask whether a finding should be promoted into memory, references, or constitutional guidance.
- **Evidence**: [SOURCE: 006-ralph-main/research/research.md:85-90]
- **Risk / dependencies**: Low-risk if it remains a checkpoint, not an automatic mutation step.

### CF-052 — Readiness Ledger For Phased Work
- **Origin phase(s)**: `008-F-002` (`iteration-002`)
- **External source**: [SOURCE: 008-bmad-autonomous-development/external/skills/bad/references/phase0-dependency-graph.md:7-33]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: complements `CF-014` and `CF-015` by sharpening what "ready" means before execution begins.
- **Adoption summary**: A readiness ledger would let future phased automation distinguish planned dependencies from actually merged or satisfied dependencies.
- **Evidence**: [SOURCE: 008-bmad-autonomous-development/research/research.md:57-62]
- **Risk / dependencies**: Needs a clear source of truth policy or it will duplicate existing phase metadata without resolving ambiguity.

### CF-054 — Deferred Reconsolidation Cadence
- **Origin phase(s)**: `009-F-002` (`iteration-004`)
- **External source**: [SOURCE: 009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:76-167]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Change type**: added option
- **Blast radius**: medium
- **Cross-phase convergence**: pairs with `CF-020`, `CF-021`, and `CF-056`.
- **Adoption summary**: Spec Kit’s reconsolidation is safer than Xethryon’s, but it is still save-time only. A deferred cadence would let the system reconsolidate when enough time and enough activity have accumulated.
- **Evidence**: [SOURCE: 009-xethryon/research/research.md:64-69]
- **Risk / dependencies**: Needs explicit pending-state and locking semantics to avoid surprise background mutations.

### CF-056 — Runtime-Agnostic Continuity Synopsis
- **Origin phase(s)**: `009-F-004` (`iteration-003`)
- **External source**: [SOURCE: 009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:148-168]
- **system-spec-kit target**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Change type**: modified existing
- **Blast radius**: medium
- **Cross-phase convergence**: supports `CF-021` and `CF-029` in the broader continuity bucket.
- **Adoption summary**: A runtime-agnostic continuity synopsis would strengthen resumes for environments that do not benefit from the current hook-driven producer path.
- **Evidence**: [SOURCE: 009-xethryon/research/research.md:78-83] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:174-188]
- **Risk / dependencies**: Needs a consistent producer contract so resumes do not mix incomparable synopsis formats.

## 5. Nice-to-Have Findings (brief)

- `CF-058` / `001-F-005` — Keep a future-facing component registry idea in reserve for deep-loop drivers, but only if multiple reducers or evaluator backends actually appear. Target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`. [SOURCE: 001-agent-lightning-main/research/research.md:102-109]
- `CF-059` / `002-F-006` — Pilot executable methodology packs for a few repeatable workflows after runtime enforcement work stabilizes. Target: `.opencode/skill/system-spec-kit/references/workflows/` plus future workflow-pack modules. [SOURCE: 002-babysitter-main/research/research.md:85-90]
- `CF-060` / `003-F-003` — Add a compressed-brief convention, not token-marketing claims, to the quick-reference workflow surface. Target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:64-68]
- `CF-061` / `003-F-008` — Expose operator-facing observability as a read-only command surface instead of keeping telemetry mostly internal. Target: `.opencode/command/memory/manage.md`. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:94-98]
- `CF-062` / `005-F-006` — Offer an optional council-style synthesis profile when multiple model families are available, but keep it advanced-only. Target: `.opencode/command/spec_kit/deep-research.md`, `deep_research_strategy.md`, `templates/research.md`. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:87-92]
- `CF-063` / `005-F-007` — Adapt anti-overbuilding heuristics into planning or decision-record guidance without importing product-tier portfolio semantics. Target: new decision-record template guidance. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:94-99]
- `CF-064` / `006-F-007` — Prototype only a thin shell wrapper over existing validated commands; do not create a second runtime. Target: new `scripts/spec/fresh-loop.sh` prototype. [SOURCE: 006-ralph-main/research/research.md:92-97]
- `CF-065` / `006-F-008` — Document Ralph-style execution as a complementary overlay, not a replacement for Spec Kit memory and lifecycle governance. Target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`. [SOURCE: 006-ralph-main/research/research.md:99-104]
- `CF-066` / `007-F-004` — If live coordination is ever prototyped, default it to the active spec/session boundary before allowing wider routing. Target: `resume.md`, `context-prime.md`, and future coordination modules. [SOURCE: 007-relay-main/research/research.md:65-69]
- `CF-067` / `007-F-008` — Keep delivery-state and idle-state tracking on the roadmap, but only after glossary, readiness, and evidence rules exist. Target: future coordination modules. [SOURCE: 007-relay-main/research/research.md:89-93]
- `CF-068` / `008-F-003` — Defer backlog-wide queue scheduling until a true sprint runner exists; it is above today’s implement responsibilities. Target: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`. [SOURCE: 008-bmad-autonomous-development/research/research.md:64-69]
- `CF-069` / `009-F-006` — Prototype an additive project-orientation surface derived from packet artifacts, not a free-form repo-global memory replacement. Target: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`. [SOURCE: 009-xethryon/research/research.md:92-97]
- `CF-070` / `009-F-007` — Add a small git snapshot to bootstrap/resume output so continuation choices are safer without always-on git prompt injection. Target: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`. [SOURCE: 009-xethryon/research/research.md:99-104]
- `CF-071` / `009-F-008` — Consider a reducer-owned packet-local coordination board for unusually high-scale agentic work instead of live mailbox IPC. Target: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`. [SOURCE: 009-xethryon/research/research.md:106-111]

## 6. Rejected Recommendations (brief)

- `001-R-001` — Do not merge live execution wrappers into the current hook system; the hook layer stays valuable by remaining focused on recovery and continuity. [SOURCE: 001-agent-lightning-main/research/research.md:131-135]
- `001-R-002` — Do not turn canonical templates into runtime resource snapshots; template contracts are not RL-tunable resources. [SOURCE: 001-agent-lightning-main/research/research.md:137-141]
- `001-R-003` — Do not use Agent Lightning to justify generic orchestrator redesign; keep only RL-specific observability/evaluator lessons. [SOURCE: 001-agent-lightning-main/research/research.md:143-147]
- `002-R-001` — Do not import Babysitter’s full plugin marketplace; borrow the manifest boundary, not the installer ecosystem. [SOURCE: 002-babysitter-main/research/research.md:115-117]
- `003-R-001` — Do not copy starter-kit branch/port/E2E hooks wholesale; they assume app-template conventions this repo does not share. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:102-104]
- `003-R-002` — Do not import the external mini-agent architecture; the local agent plus skill-routing system is already richer. [SOURCE: 003-claude-code-mastery-project-starter-kit-main/research/research.md:106-108]
- `004-R-001` — Do not adopt default undo-only refactoring in dirty worktrees; current safety posture should remain non-destructive. [SOURCE: 004-get-it-right-main/research/research.md:108-110]
- `005-R-001` — Do not add multi-agent file locks to today’s serial deep-research loop. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:110-113]
- `005-R-002` — Do not make browser automation a default deep-research dependency. [SOURCE: 005-intellegix-code-agent-toolkit-master/research/research.md:115-118]
- `006-R-001` — Do not replace Spec Kit Memory with Ralph’s minimal continuity model; that would be a governance regression. [SOURCE: 006-ralph-main/research/research.md:108-110]
- `006-R-002` — Do not add `.last-branch` rotation to deep research; current lineage/archive handling already covers that state. [SOURCE: 006-ralph-main/research/research.md:112-114]
- `007-R-001` — Do not replace current Task-tool orchestration with a full Relay-style broker now. [SOURCE: 007-relay-main/research/research.md:103-105]
- `008-R-001` — Do not let `sk-git` autonomously create worktrees; local git safety requires explicit user choice first. [SOURCE: 008-bmad-autonomous-development/research/research.md:101-103]
- `008-R-002` — Do not fold BAD’s sequential auto-merge model into default git finish behavior. [SOURCE: 008-bmad-autonomous-development/research/research.md:105-107]
- `008-R-003` — Do not claim BAD proved a portable guard-enforcement mechanism; the snapshot documents the idea more strongly than it implements it. [SOURCE: 008-bmad-autonomous-development/research/research.md:109-111]
- `009-R-001` — Do not port Xethryon’s default retrieval engine; Spec Kit Memory is already stronger and more governed. [SOURCE: 009-xethryon/research/research.md:115-117]
- `009-R-002` — Do not add autonomous skill execution; it bypasses the explicit packet-binding and gate steps Spec Kit is designed to enforce. [SOURCE: 009-xethryon/research/research.md:119-121]

## 7. Cross-Phase Themes

### Theme T-001 — Deterministic Loop Governance Beats Prompt-Only Governance
- **Phases converging**: `002`, `003`, `005`, `009`
- **Core insight**: the strongest external systems push important stop, approval, and publication logic into runtime structures instead of trusting prose alone.
- **Combined adoption story**: `CF-001`, `CF-002`, `CF-003`, `CF-004`, `CF-022`, `CF-025`, and `CF-055` compose into a coherent runtime-governance packet: runtime-neutral resolution, explicit gate states, explicit stop reasons, and explicit publication evidence. This is the clearest architecture-level theme in the entire wave.

### Theme T-002 — Autonomous Implementation Needs Smaller Units And Stronger Checkpoints
- **Phases converging**: `004`, `006`, `008`
- **Core insight**: long autonomous implementation succeeds when work is one-task-sized, context-fresh, stage-bounded, and objectively checked before expensive semantic review.
- **Combined adoption story**: `CF-007` through `CF-015` plus `CF-037` through `CF-040` form one implementation-control plane: task sizing rules upstream, one-task-per-run enforcement at runtime, staged execution in the YAML, and a validation-first retry controller.

### Theme T-003 — Coordination Contracts Need Shared Vocabulary Before New Transport
- **Phases converging**: `001`, `005`, `007`, `008`, `009`
- **Core insight**: the repo already has real coordination patterns, but they are not named or typed consistently enough across agent docs, provider docs, and workflow assets.
- **Combined adoption story**: `CF-016`, `CF-017`, `CF-018`, `CF-045`, `CF-046`, `CF-050`, `CF-051`, and `CF-057` suggest a documentation-and-metadata wave first, with any live transport prototype deferred until the vocabulary is stable.

### Theme T-004 — Continuity Should Be Auditable, Layered, And Packet-Local
- **Phases converging**: `001`, `002`, `005`, `006`, `009`
- **Core insight**: robust long-running work needs multiple continuity layers: event-level audit, resumable synopsis, lightweight progress, and targeted git context, but not a second uncontrolled memory system.
- **Combined adoption story**: `CF-005`, `CF-020`, `CF-021`, `CF-029`, `CF-041`, `CF-042`, `CF-054`, `CF-056`, and `CF-070` fit together as a continuity stack that remains safer than Xethryon/Ralph minimalism while still becoming easier to recover and inspect.

### Theme T-005 — Runtime-Specific Guardrails Are Worth Doing Even Before Cross-Runtime Uniformity
- **Phases converging**: `002`, `003`, `005`, `009`
- **Core insight**: some high-value guardrails are worth adding in one runtime first if the scope is clear and the user benefit is immediate.
- **Combined adoption story**: `CF-006`, `CF-032`, `CF-035`, `CF-036`, and `CF-046` support a pragmatic pattern: land narrow runtime-specific safety and clarity improvements now, but do not mislabel them as universal enforcement until the cross-runtime manifest/gate work exists.

## 8. Adoption Priority Queue

### Bundle B-001 — Runtime Manifest And Gate State Core
- **Proposed packet name**: `002-runtime-manifest-and-gates`
- **Findings included**: `CF-001`, `CF-002`, `CF-022`, `CF-025`
- **Blast radius**: large
- **Dependencies**: none; this is the base runtime-governance packet
- **Estimated complexity**: Level 3
- **First-step suggestion**: start in `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`

### Bundle B-002 — Research Closeout And Evidence Controls
- **Proposed packet name**: `003-research-closeout-controls`
- **Findings included**: `CF-003`, `CF-004`, `CF-005`, `CF-019`, `CF-049`, `CF-055`
- **Blast radius**: medium
- **Dependencies**: benefits from `B-001`, but can start with `CF-003` independently
- **Estimated complexity**: Level 2-3
- **First-step suggestion**: start in `.opencode/agent/deep-research.md`

### Bundle B-003 — Autonomous Implement Retry And Validation Plane
- **Proposed packet name**: `004-implement-retry-control-plane`
- **Findings included**: `CF-007`, `CF-008`, `CF-009`, `CF-010`, `CF-011`, `CF-012`, `CF-037`, `CF-038`, `CF-039`, `CF-040`
- **Blast radius**: large
- **Dependencies**: none, but task-sizing rules from `B-004` improve it immediately
- **Estimated complexity**: Level 3
- **First-step suggestion**: start in `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`

### Bundle B-004 — Task Sizing And Execution Economy
- **Proposed packet name**: `005-task-sizing-and-model-tiers`
- **Findings included**: `CF-013`, `CF-014`, `CF-015`, `CF-030`, `CF-031`
- **Blast radius**: medium
- **Dependencies**: pairs naturally with `B-003`
- **Estimated complexity**: Level 2
- **First-step suggestion**: start in `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`

### Bundle B-005 — Coordination Vocabulary And Provider Parity
- **Proposed packet name**: `006-coordination-contract-parity`
- **Findings included**: `CF-016`, `CF-017`, `CF-018`, `CF-045`, `CF-046`, `CF-050`, `CF-051`, `CF-057`
- **Blast radius**: medium
- **Dependencies**: none; mostly documentation/contract work
- **Estimated complexity**: Level 2
- **First-step suggestion**: start in `.opencode/agent/orchestrate.md`

### Bundle B-006 — Continuity And Audit Trail Layer
- **Proposed packet name**: `007-continuity-and-audit-layer`
- **Findings included**: `CF-020`, `CF-021`, `CF-023`, `CF-024`, `CF-029`, `CF-041`, `CF-042`, `CF-043`, `CF-054`, `CF-056`, `CF-070`
- **Blast radius**: medium to large
- **Dependencies**: benefits from `B-001` if journals become part of runtime truth
- **Estimated complexity**: Level 3
- **First-step suggestion**: start in `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`

### Bundle B-007 — Claude Guardrails And Operator UX
- **Proposed packet name**: `008-claude-guardrails-and-front-door`
- **Findings included**: `CF-006`, `CF-032`, `CF-033`, `CF-034`, `CF-035`, `CF-036`
- **Blast radius**: small to medium
- **Dependencies**: none
- **Estimated complexity**: Level 2
- **First-step suggestion**: start in `.claude/settings.local.json`

## 9. What the Research Did NOT Cover

- **Out of scope in the research**:
  - non-Claude secret-guardrail implementations for Codex, Gemini, or Copilot runtimes
  - concrete storage/schema migration design for journals, readiness ledgers, or coordination boards
  - actual cost/latency benchmarking for proposed model-tier splits
  - UI implementation detail for dashboard/telemetry surfacing beyond report-level recommendations
  - live broker/transport implementation details beyond documentation and prototype boundary work
- **Evidence gaps**:
  - `CF-042`, `CF-063`, and `CF-064` point at target files that do not yet exist in the current tree and would need first-pass file design before implementation.
  - `CF-047`, `CF-048`, `CF-066`, and `CF-067` are future-transport recommendations whose value depends on a live coordination prototype that has not been selected.
  - `CF-024` and `CF-054` are higher-complexity operational ideas with clear value narratives but less concrete fit-testing against current runtime constraints than the top-ranked governance items.
- **External repos with lowest signal**:
  - `001-agent-lightning-main` — valuable but often RL-specific, so many ideas narrowed down to observability rather than direct runtime adoption.
  - `003-claude-code-mastery-project-starter-kit-main` — yielded useful operator/hook lessons, but much of the repo assumed generated-app conventions that do not transfer.
  - `006-ralph-main` — strong on simplicity and task-sizing discipline, but intentionally too minimal to justify replacing richer local continuity/governance systems.
- **Phase overlaps that need arbitration**:
  - phases `002` and `007` both touch multi-runtime execution; `002` should own runtime resolution/governance while `007` owns coordination vocabulary and transport semantics.
  - phases `004` and `008` both touch autonomous implementation; `004` should own retry/controller semantics while `008` owns stage contracts and model economy.
  - phases `005` and `009` both touch deep-research runtime quality; `005` should own loop-closeout/runtime-test semantics while `009` owns claim verification and memory-lifecycle critique.
  - phases `003`, `007`, and `005` all touch metadata-driven docs; the team should decide whether audience/provider metadata lives in command frontmatter, delegation references, or a shared registry.

## 10. Recommended Next Step

Plan `B-002` first, but start with only `CF-003` as the first implementation slice: add the claim-verification ledger to `.opencode/agent/deep-research.md`, then mirror it into the deep-research synthesis expectations. It is the smallest blast-radius must-have in the highest-value research-quality bundle, it directly reduces future external-research hallucination/drift risk, and it does not depend on runtime manifest or orchestration refactors before becoming useful.
