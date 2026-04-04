# Research Report: 041 Recursive Agent

## 1. Executive Summary
`autoagent-main` is a benchmarked experiment loop, not a general research workflow. The human edits the policy in `program.md`, the loop mutates a narrow pre-boundary harness surface, a local ledger records each run, and the keep/discard rule is score-first with a simplicity tie-break. Rejected runs still matter because they feed the next iteration, and infrastructure failures are treated separately from real regressions. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:33] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:89] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204]

This repo already has strong reusable mechanics for a similar loop: disk-first state, fresh-context iteration dispatch, reducer-managed summaries, skill auto-discovery, and canonical create/update flows for new skills. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/README.md:42] [SOURCE: .opencode/command/create/sk-skill.md:239]

The 10 Copilot-led extension iterations made the key gap clearer: the hard part is not packaging a skill. The hard part is defining one canonical mutable surface, one independent evaluator, one experiment ledger, and one promotion contract that respects repo guardrails. [SOURCE: AGENTS.md:12] [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/README.md:330]

## 2. What `autoagent-main` Teaches
The external repo succeeds because three contracts line up:

1. A human-authored control surface (`program.md`) defines the task, mutable boundary, and acceptance rule. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:141]
2. The editable surface is narrow and protected from adjacent system complexity. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:40]
3. The evaluator is explicit, ledgered, and operationally disciplined: baseline row, reruns for variance, score-first selection, simplicity tie-break, and evidence-preserving rejection. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:33] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:89] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160]

That last point matters most. The loop is not "autonomy" in the abstract. It is bounded mutation under a trusted scoring contract.

## 3. What Makes Our Repo Different
Our repo can host the loop, but the mutation surface is more layered than the external harness:

- `.opencode/agent/` is the canonical source layer, while `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` behave like runtime-specific copies or translations. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421] [SOURCE: .codex/agents/context.toml:1]
- Some behavior is defined outside the agent files themselves. Codex uses `.codex/config.toml` for `codex exec -p <profile>` routing, Gemini delegation is partly encoded in the CLI skill and delegation reference, and deep-research workflow assets still pin runtime-specific files. [SOURCE: .codex/config.toml:47] [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:66]
- Repo safety rules are much stricter than the external snapshot: read-before-edit, spec-folder gating, scope lock, hard verification, evaluator independence, and `@speckit` exclusivity over most spec docs. [SOURCE: AGENTS.md:12] [SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: .opencode/agent/review.md:24]

That means a direct copy of `autoagent-main` would import the wrong trust boundary.

## 4. Strongest Repo-Native Design
The best fit is a sibling of `sk-deep-research`, not a clone of `autoagent-main`.

### 4.1 Canonical Mutable Surface
Start with one canonical `.opencode/agent/*.md` file, not all runtime mirrors. Runtime copies and adjacent control files should be treated as fixed or derived until the mirror/promotion contract is explicit. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41]

### 4.2 Control Bundle
The repo-native replacement for `program.md` should be a small bundle, not one freeform file:

- `improvement-charter.md`: human-authored goal, evaluator command(s), and keep/discard rule
- `target-manifest.jsonc`: canonical mutable files, fixed files, derived runtime copies, adjacent behavior files, and optional frontmatter/body section scopes
- `improvement-config.json`: execution mode, budgets, and promotion settings
- `improvement-state.jsonl`: append-only experiment ledger

This matches how iterative workflows already live here: command -> workflow -> leaf agent -> disk state -> reducer-managed summaries. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/README.txt:126] [SOURCE: .opencode/skill/sk-doc/assets/agents/agent_template.md:41]

### 4.3 Reuse the Packet Skeleton, Not the Research Semantics
Deep research already provides the right externalized-state skeleton: immutable config, append-only JSONL, mutable strategy, write-once iteration files, and reducer-owned dashboard/registry surfaces. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15] [SOURCE: .opencode/agent/deep-research.md:159]

What must change is the meaning of the ledger:

- replace question/finding registry with experiment ledger and accepted-candidate state
- replace convergence-by-novelty with score governance and plateau logic
- keep reducer ownership and append-only discipline

[SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:132] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25]

## 5. Evaluator and First Target
The extension clarified two important decisions.

### 5.1 Best Evaluator Shape
The repo's strongest near-term evaluator surfaces are not prompt rubrics. They are deterministic validators and artifact tests:

- document-integrity checks for references, metadata, and handover resume targets [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:82]
- regression tests for assistant-facing startup briefs [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49]
- thresholded quality-loop behavior with best-state retention [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:567]
- DQI-style structural/content/style scoring [SOURCE: .opencode/skill/sk-doc/scripts/extract_structure.py:940]

That strongly suggests phase 1 should score outputs or artifacts, not raw agent prompt text.

### 5.2 Best First Target
The safest first target is a structured artifact-producing agent surface, especially something handover-like, not deep-research itself.

Why:

- handover has seven required sections, strict pre-validation, a fixed output path, and mandatory follow-up steps [SOURCE: .opencode/command/spec_kit/handover.md:58] [SOURCE: .opencode/command/spec_kit/handover.md:195] [SOURCE: .opencode/command/spec_kit/handover.md:215]
- deep-research is synthesis-heavy and convergence-oriented, which makes scoring much more subjective [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25]

So the strongest phase-1 bet is not "improve research agents." It is "improve one tightly templated artifact generator under deterministic checks."

## 6. Rollout and No-Go Conditions
Recommended rollout:

1. Phase 1: propose-and-score only. Generate candidate changes or candidate outputs, run the evaluator, and write results to the experiment ledger without mutating canonical files.
2. Phase 2: bounded auto-edit on one canonical `.opencode/agent/*.md` target after the scorer and rollback/promotion contract are proven.
3. Phase 3: parity-aware expansion into derived runtime copies or adjacent control files after sync/promotion rules are explicit.

[SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:89]

Do not build `sk-agent-improver` yet if any of these stay unresolved:

- no independent evaluator/scorer
- no canonical mutable surface
- no append-only experiment ledger
- no promotion gate from proposal to accepted mutation
- no plan for runtime-copy drift

[SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/README.md:330] [SOURCE: AGENTS.md:14]

## 7. Feasibility Verdict
Yes, `sk-agent-improver` is feasible here.

The stronger, updated version of that verdict is:

- feasible as an experiment loop
- feasible if it reuses deep-research-style packet scaffolding
- feasible only if it starts evaluator-first
- feasible only if it targets one canonical source surface before runtime parity
- feasible only if scoring stays independent from mutation

Without those conditions, the skill would mostly automate prompt churn and create false confidence.

## 8. Extension Report
- Initial research iterations: 3
- Additional Copilot-led extension iterations: 10
- Total iterations: 13
- Extension method: `cli-copilot` with `gpt-5.4` and high reasoning, run in five waves of two
- Final stop reason: user-requested completed-continue synthesis

## 9. Bottom Line
`sk-agent-improver` is worth pursuing, but not as "let the repo rewrite all agents overnight."

The right next move is:

1. Pick one canonical `.opencode/agent` target.
2. Pick one deterministic evaluator, ideally around a structured artifact surface.
3. Define a control bundle and append-only experiment ledger.
4. Add an independent scorer and promotion gate.
5. Only then allow bounded auto-editing.
