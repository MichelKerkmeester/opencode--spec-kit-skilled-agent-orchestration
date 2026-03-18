# ChatGPT vs Copilot Agent Diff

## Method

- Compared files one-to-one by basename between `.opencode/agent/chatgpt/*.md` and `.opencode/agent/copilot/*.md`.
- Focused on behavior and policy deltas (thresholds, routing, fast-path rules, validation semantics, model/tool policy), not wording-only edits.

## Scope

- Included only these 8 agent files: `context.md`, `debug.md`, `handover.md`, `orchestrate.md`, `research.md`, `review.md`, `speckit.md`, `write.md`.
- Excluded runtime code, command files, and non-ChatGPT/Copilot agent families.

## context.md

- ChatGPT sets `task: deny` in frontmatter permissions; nested sub-agent dispatch is illegal (Illegal Nesting Protocol enforced). Copilot sets `task: allow` and supports dispatch of `@explore`/`@research`.
- ChatGPT uses adaptive retrieval modes (Quick/Standard/Deep) with mode-specific output budgets: Quick `~1.8K/55 lines`, Standard `~3.5K/105 lines`, Deep `~5.5K/165 lines`. Copilot uses thorough-mode-only retrieval with a fixed `~4K/120 lines` budget.
- ChatGPT retrieval parameters table shows `Dispatches: 0 (nested dispatch illegal)` for all modes; the output format replaces the "Dispatched Analyses" section with a "Nested Dispatch Status" section. Copilot retains "Dispatched Analyses" and allows 0–2 dispatches per mode.
- ChatGPT file-based CWB row (`10+ agents`) returns a minimal summary plus a recommended write path (orchestrator handles persistence); Copilot instructs the agent to write findings to the specified file directly.
- ChatGPT NEVER rules include `Dispatch any sub-agents (nested dispatch is illegal)`. Copilot NEVER rules prohibit only implementation dispatch.

## debug.md

- ChatGPT includes an explicit **ILLEGAL NESTING RULE (HARD BLOCK)** statement: agent is LEAF-only, nested dispatch is illegal, prompt requests for delegation are ignored. Copilot has no equivalent statement.
- ChatGPT low-complexity fast path retains a minimal analyze step (`observe → minimal analyze → hypothesize → fix`); Copilot skips this analyze step.
- ChatGPT frontmatter pins model + reasoning effort; Copilot variant does not pin reasoning effort.

## handover.md

- ChatGPT includes an explicit **ILLEGAL NESTING RULE (HARD BLOCK)** statement (LEAF-only, delegation requests ignored). Copilot has no equivalent statement.
- ChatGPT low-complexity fast path allows up to 6 tool calls; Copilot allows up to 3.
- ChatGPT permission note aligns handover to a 5-section format; Copilot note still references a 7-section format.
- ChatGPT pins `openai/gpt-5.3-codex-spark` with explicit reasoning effort; Copilot uses `github-copilot/claude-sonnet-4.6`.

## orchestrate.md

- ChatGPT enforces **single-hop delegation** (NDP max depth: 2, levels 0–1 only). All non-orchestrator agents are LEAF; `@context` is classified LEAF with no dispatch authority. Copilot allows max depth 3 (levels 0–2) with `@context` classified as DISPATCHER (may spawn LEAF agents at depth 2).
- ChatGPT NDP legal examples explicitly forbid `Orch(0) → @context(1) → @explore(2)`. Copilot lists that chain as LEGAL.
- ChatGPT introduces a direct-first Codex Optimization Profile: default parallel width of 2 agents, minimum dispatch payload of 4 tool calls, split posture favoring larger bundles. Copilot has no equivalent profile section.
- ChatGPT adds anti-microtask safeguard: do not spawn an agent for work estimated under 4 tool calls unless isolation is required. Copilot has no equivalent guard.
- ChatGPT raises split thresholds and budgets (TCB safe range, CWB trigger, workflow token budget, per-task budgets) to reduce micro-task fan-out. Copilot uses lower, parallel-first defaults.

## research.md

- ChatGPT includes an explicit **ILLEGAL NESTING RULE (HARD BLOCK)** statement (LEAF-only, delegation requests ignored). Copilot has no equivalent statement.
- ChatGPT formalizes a trivial-research exception for Step 9 memory save (`<5 findings`) and requires documenting exception usage. Copilot wording is softer and does not enforce the same documented exception path in completion gates.
- ChatGPT labels the low-complexity path as a fast-path exception tied to explicit gate semantics. Copilot lacks this gate linkage.

## review.md

- ChatGPT includes an explicit **ILLEGAL NESTING RULE (HARD BLOCK)** statement (LEAF-only, delegation requests ignored). Copilot has no equivalent statement.
- ChatGPT clarifies blocking semantics: only P0 issues are immediate blockers; P1 issues are required for pass but not blockers. Copilot allows FAIL/BLOCK on P0 or P1.
- ChatGPT corrects native tool parameter naming to `filePath`; Copilot still references `file_path`.
- ChatGPT adds codex effort-calibration guidance for low-complexity vs high-risk review depth.

## speckit.md

- ChatGPT includes an explicit **ILLEGAL NESTING RULE (HARD BLOCK)** statement (LEAF-only, delegation requests ignored). Copilot has no equivalent statement.
- ChatGPT adds a pre-flight validation gate with hard stop conditions before documentation work begins; Copilot lacks this explicit gate section.
- ChatGPT corrects Level 3 decision-record semantics where Copilot still contains Level 3+ references in some places.
- ChatGPT fast-path explicitly keeps `implementation-summary.md` as required for Level 1 (completion phase); Copilot wording is less explicit.
- ChatGPT self-verification accepts `validate.sh` exit `0` or `1`; Copilot checklist states exit `0` only.

## write.md

- ChatGPT includes an explicit **ILLEGAL NESTING RULE (HARD BLOCK)** statement (LEAF-only, delegation requests ignored). Copilot has no equivalent statement.
- ChatGPT enforces template-first fast path (keeps mandatory template gates) and only skips extended loops; Copilot fast path skips steps 3-6.
- ChatGPT makes DQI completion mode-aware: baseline `>=75` plus higher mode target when applicable (for example Mode 2 `>=90`); Copilot uses flat `>=75`.
- ChatGPT changes Section 1 rule to match the selected template's required first H2; Copilot hardcodes Section 1 to OVERVIEW.
