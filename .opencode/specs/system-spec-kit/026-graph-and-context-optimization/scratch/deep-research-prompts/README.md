---
title: "Deep Research Prompt Packs"
description: "Paste-ready deep research prompt packs for /spec_kit:deep-research. Mirrors the deep-review prompt structure but targets investigation workflows instead of audit workflows. Use when you need iterative convergent research on a technical question with externalized state + P0/P1/P2-analogue severity."
importance_tier: "normal"
contextType: "research-prompts"
---

# Deep Research Prompt Packs

Paste-ready prompts for kicking off `/spec_kit:deep-research :auto` campaigns on
common research workflows. Same structural pattern as the manual-test-prompts
pack — scenario-based with expected signals, fail modes, and a results log.

## Files

| File | Use-case | When |
|---|---|---|
| [technical-investigations.md](./technical-investigations.md) | "How does X actually work" — deep code dive | Unknown subsystem, need grounded understanding before touching it |
| [architecture-audits.md](./architecture-audits.md) | System mapping + weak-point identification | Before a refactor; when taking over unfamiliar area |
| [cross-project-comparisons.md](./cross-project-comparisons.md) | Compare approach A vs B across codebases / docs | Choosing between patterns; benchmarking our approach against prior art |
| [pattern-mining.md](./pattern-mining.md) | Extract common patterns / best practices from N sources | Building a new skill/agent; writing a style guide |
| [refactor-surveys.md](./refactor-surveys.md) | Risk assessment for a proposed change | Pre-refactor recon; "what'll break if I move X" |
| [unknown-unknowns.md](./unknown-unknowns.md) | Exploratory "what don't we know yet" | New research area; ambiguous problem space |

## How to Use

1. Pick the pack closest to your workflow.
2. Pick a scenario inside that pack.
3. Fill in the `__PLACEHOLDERS__` (topic, target folder, scope).
4. Paste into your chosen CLI. All scenarios use `/spec_kit:deep-research :auto`
   which auto-pilots the loop. Stop reading until the campaign converges.
5. Collect the `research/research.md` synthesis when complete.

## Deep-review vs deep-research: structural parity

| Aspect | `/spec_kit:deep-review :auto` | `/spec_kit:deep-research :auto` |
|---|---|---|
| Loop protocol | 4 phases: init, iterate, synthesize, save | 4 phases: init, iterate, synthesize, save |
| State location | `{spec}/review/` | `{spec}/research/` |
| State writer | `scripts/reduce-state.cjs` | `scripts/reduce-state.cjs` |
| Per-iteration output | `iteration-NNN.md` + `iter-NNN.jsonl` delta | `iteration-NNN.md` + `iter-NNN.jsonl` delta |
| Severity buckets | P0 / P1 / P2 findings | P0 / P1 / P2 findings (same) |
| Final artifact | `review/review-report.md` | `research/research.md` |
| Convergence | Severity-weighted newFindingsRatio < threshold | Same metric, research-tuned |
| Dimensions | correctness / security / traceability / maintainability | topic-specific (varies per scenario) |

## Executor options (apply to any scenario below)

All scenarios here work with any executor. Append `--executor=<kind>` +
`--model=<id>` flags. Examples:

```
# Default: native @deep-research agent (Opus)
/spec_kit:deep-research :auto "topic"

# cli-codex gpt-5.4 high fast
/spec_kit:deep-research :auto "topic" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast

# cli-copilot gpt-5.4 high
/spec_kit:deep-research :auto "topic" --executor=cli-copilot --model=gpt-5.4

# cli-gemini (single supported model)
/spec_kit:deep-research :auto "topic" --executor=cli-gemini --model=gemini-3.1-pro-preview

# cli-claude-code
/spec_kit:deep-research :auto "topic" --executor=cli-claude-code --model=claude-opus-4-7
```

## Spec folder contract

`/spec_kit:deep-research` requires a spec folder (Gate 3). Most scenarios below
assume you'll create a fresh spec folder under `specs/NN-track/NNN-<slug>/`
for the research question. The command handles scaffolding. If you have an
existing folder (e.g., a feature track), pass `--spec-folder=PATH`.

## Results Log Template

Each pack ends with an identical log template. Append runs below the default
block so the same doc accumulates history across campaigns.

```markdown
## YYYY-MM-DD — Run name / topic

Command: `/spec_kit:deep-research :auto "..." --executor=... --model=...`
Scenario ID: DR-XX-NN
Iterations until converge: N (threshold=0.10)
Artifacts: research/research.md + N iteration files + deltas
Verdict: PASS / CONDITIONAL / FAIL (hasAdvisories?)
Findings summary: P0=N P1=N P2=N
Top themes: [list]
Key evidence: [file:line citations]
Follow-ups: [open questions, proposed next spec-folder, implementation hooks]
```

## Source

Based on:
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/command/spec_kit/deep-research.md` + `assets/spec_kit_deep-research_auto.yaml`
- `.opencode/skill/sk-deep-review/` (for parallel structure — review ↔ research symmetry)
