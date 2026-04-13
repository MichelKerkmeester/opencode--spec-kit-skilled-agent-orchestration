# Phase 018 Research Prompts

Two research prompts for investigating Option C (Wiki-Style Spec Kit Updates) from phase 017. Both are designed to be driven by the **sk-deep-research loop engine** — they are **not** self-contained single-shot briefs.

## Prompt Index

| File | Goal | Iterations | Primary Deliverable | Expected Duration |
|---|---|---|---|---|
| [`research-prompt-implementation.md`](./research-prompt-implementation.md) | Design HOW to implement Option C with UX and usefulness at the forefront | 20 | `implementation-design.md` + 11 findings files | 2–4 hours wall clock |
| [`research-prompt-impact.md`](./research-prompt-impact.md) | Produce a file-by-file impact matrix with effort estimates and dependency ordering | 5 | `findings/impact-matrix.md` + `findings/dependency-graph.md` | 60–90 minutes |

## ⚠ MANDATORY: Use `/spec_kit:deep-research` — do NOT single-shot via Codex

**Both prompts MUST be driven by `/spec_kit:deep-research:auto` or `:confirm`.** They are **not** self-contained enough to run as a single-shot `codex exec` brief.

Why this is non-negotiable:

- The **sk-deep-research loop driver** is what creates the required state files (`deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, `research/iterations/iteration-NNN.md`).
- A single-shot Codex delegation does all the reasoning in one context window and writes outputs directly. It **bypasses** the init phase, the per-iteration dispatch, the convergence tracking, the reducer's machine-owned state updates, the quality guard checks, and the proper synthesis phase.
- **Phase 017 was produced via single-shot delegation** and is missing every state file except `research.md`. The folder is not resumable, not auditable, and the convergence metrics don't exist. We are not repeating that pattern here.
- The sk-deep-research loop provides: per-iteration fresh context (no context window degradation), externalized state that persists across crashes, quality guards that block premature stops, pause/resume via sentinel file, and a proper reducer that separates human-owned from machine-owned sections.

**If you catch yourself writing `cat prompt.md | codex exec ...`, stop. That is the wrong invocation for these prompts.**

## Decision Tree — Which Prompt First?

```
Need to understand HOW Option C should work?
  └── Run research-prompt-implementation.md FIRST
      └── Then run research-prompt-impact.md (impact analysis uses the HOW for precision)

Need a file change list for sprint planning / estimation?
  └── Run research-prompt-impact.md FIRST (faster, concrete)
      └── Then run research-prompt-implementation.md for design depth

Have time and want both in parallel?
  └── Run them in separate deep-research sessions (different spec folders).
      Never launch two deep-research loops against the same spec folder at once.
```

**Recommended default**: run `research-prompt-implementation.md` first. The design work informs the impact analysis and reduces UNCERTAIN rows.

## How to Run

Both prompts are launched via `/spec_kit:deep-research` with `--spec-folder` pointed at this phase 018 spec folder. The loop driver reads the prompt file as the strategy seed, then dispatches `@deep-research` once per iteration with fresh context.

### Implementation prompt (20 iterations)

**Autonomous mode (recommended):**
```bash
/spec_kit:deep-research:auto "Wiki-Style Spec Kit Updates — HOW to implement with UX and usefulness at the forefront. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-implementation.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 20 --convergence 0.05
```

**Confirm mode (pause at each iteration for approval):**
```bash
/spec_kit:deep-research:confirm "Wiki-Style Spec Kit Updates — HOW to implement with UX and usefulness at the forefront. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-implementation.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 20 --convergence 0.05
```

### Impact prompt (5 iterations)

**Autonomous mode (recommended):**
```bash
/spec_kit:deep-research:auto "Wiki-Style Spec Kit Updates — file-level impact analysis. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-impact.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 5 --convergence 0.05
```

**Confirm mode (pause at each iteration for approval):**
```bash
/spec_kit:deep-research:confirm "Wiki-Style Spec Kit Updates — file-level impact analysis. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-impact.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 5 --convergence 0.05
```

### Lifecycle controls

- **Pause the loop mid-run**: `touch .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/research/.deep-research-pause`. The loop will halt between iterations with a resume message. Delete the sentinel to resume.
- **Resume after crash**: re-run the same `/spec_kit:deep-research:auto` command. The driver auto-detects the existing config/state/strategy and continues from `last_iteration + 1`.
- **Restart with clean state**: `/spec_kit:deep-research:auto ... --lineage=restart` archives the prior packet under `research/archive/{oldSessionId}/` and starts fresh.
- **Fork from current state**: `--lineage=fork` branches from the current state as a new session.
- **Reopen a completed run**: `--lineage=completed-continue` snapshots `research.md` to `research/synthesis-v{generation}.md` and reopens as a new segment.

## Dry-Run / Sanity Checks

Before launching either prompt, verify the prompt file is well-formed:

```bash
# Both prompts should start with `# Research Prompt — ...` (no YAML `---`)
head -n 1 .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-*.md

# Count lines
wc -l .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-*.md

# Confirm all 11 numbered sections exist in each prompt
grep -cE '^## [0-9]+\. ' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-implementation.md
grep -cE '^## [0-9]+\. ' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-impact.md

# Verify iteration counts
grep -cE '^\*\*Iteration [0-9]+' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-implementation.md
grep -cE '^### Iteration [0-9]+' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-impact.md
```

Expected results:
- Both prompts start with `# Research Prompt — ...` (no YAML `---`).
- Implementation prompt: ~340 lines, 11 sections, 20 iterations.
- Impact prompt: ~430 lines, 11 sections, 5 iterations.

## Expected Output Locations

Once the loop runs, outputs land inside the phase 018 spec folder:

```
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/
├── prompts/                             # this folder (pre-existing inputs)
│   ├── README.md
│   ├── research-prompt-implementation.md
│   └── research-prompt-impact.md
├── research/                            # ALL created by the sk-deep-research loop
│   ├── research.md                      # progressive synthesis
│   ├── deep-research-config.json        # loop config (init phase)
│   ├── deep-research-state.jsonl        # iteration event stream (append-only)
│   ├── deep-research-strategy.md        # reducer-owned strategy
│   ├── findings-registry.json           # reducer-owned open/resolved questions
│   ├── deep-research-dashboard.md       # auto-generated lifecycle dashboard
│   ├── iterations/
│   │   ├── iteration-001.md             # per-iteration findings (write-once)
│   │   ├── iteration-002.md
│   │   └── ...
│   └── archive/                         # only populated on restart/fork
├── findings/                            # populated by each iteration as it answers questions
│   ├── routing-rules.md                 # implementation prompt
│   ├── feature-retargeting-map.md       # implementation prompt
│   ├── resume-journey.md                # implementation prompt
│   ├── save-journey.md                  # implementation prompt
│   ├── conflict-handling.md             # implementation prompt
│   ├── migration-strategy.md            # implementation prompt
│   ├── validation-contract.md           # implementation prompt
│   ├── thin-continuity-schema.md        # implementation prompt
│   ├── testing-strategy.md              # implementation prompt
│   ├── rollout-plan.md                  # implementation prompt
│   ├── impact-matrix.md                 # impact prompt (master file table)
│   ├── dependency-graph.md              # impact prompt (DAG)
│   ├── schema-migrations.md             # impact prompt
│   ├── mcp-handler-audit.md             # impact prompt
│   ├── template-validator-audit.md      # impact prompt
│   ├── command-agent-audit.md           # impact prompt
│   └── docs-tests-config-audit.md       # impact prompt
├── implementation-design.md             # executive summary (implementation prompt)
├── impact-summary.md                    # executive summary (impact prompt)
└── follow-up-investigations.md          # conditional — only if UNCERTAIN > 10%
```

## Anti-Patterns (Don't Do This)

1. **Don't single-shot via `codex exec`.** This is the primary failure mode. The prompts are not self-contained — they assume the sk-deep-research loop driver is orchestrating them. A single-shot run produces a flat `research.md` with no state files, no iteration history, no convergence tracking, and cannot be resumed or audited. Phase 017 was produced this way and had to be retrofitted after the fact.
2. **Don't run both prompts in the same deep-research session.** They have overlapping scope and would confuse the reducer's question registry. Launch them as separate `/spec_kit:deep-research` invocations.
3. **Don't modify the prompts during execution.** The reducer assumes the strategy file is stable across iterations. If you need to tweak a prompt, create the pause sentinel, edit, then delete the sentinel to resume — or kill the run and `--lineage=restart`.
4. **Don't let an iteration dispatch sub-agents.** `@deep-research` is a LEAF agent and has no `Task` tool. If you see it trying to spawn nested agents, the dispatch context is wrong.
5. **Don't skip the iteration-1 seed actions.** The seed actions in each prompt are calibration reads. Skipping them produces surface-level findings that fail the evidence standards.
6. **Don't let Codex design the architecture in the impact prompt.** The impact prompt is strictly about WHAT CHANGES. If the agent starts writing new system designs, stop the run and inspect `deep-research-strategy.md` — the focus has drifted.
7. **Don't run either prompt while the target files are being actively edited.** Both prompts read the repo state at iteration time; mid-run edits produce inconsistent findings.
8. **Don't assume the loop auto-commits.** The loop never touches git. If you see git commands in the output, kill the run.
9. **Don't launch without `--spec-folder`.** The default auto-detection can land outputs in the wrong packet. Always pass `--spec-folder` explicitly.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Run exits with no state files created | Prompt launched via `codex exec` instead of `/spec_kit:deep-research` | Use `/spec_kit:deep-research:auto` — this is the only valid launch path |
| Loop halts after iteration 1 with `INSUFFICIENT_CONTEXT_ABORT` | Iteration 1 seed actions not executed | Restart with `--lineage=restart` and verify the prompt's Section 9 (iteration-1 seed actions) is visible to the agent |
| `deep-research-state.jsonl` exists but `iterations/` is empty | Dispatch failed silently | Check `deep-research-state.jsonl` for `guard_violation` events; inspect the last iteration's error field |
| Loop stops at iteration 2 with convergence = 0 | Too-aggressive convergence threshold | Increase `--convergence 0.10` or use confirm mode to inspect what's happening |
| Outputs land in `~/` or `/tmp/` instead of the spec folder | `--spec-folder` flag missing | Always pass `--spec-folder` explicitly |
| Iteration 1 produces empty `research/research.md` | Seed actions skipped | Check `research/iterations/iteration-001.md` for the raw findings; the synthesis may have failed |
| Dependency graph in impact prompt has cycles | Iteration 5 regraph step skipped | Run a follow-up iteration or manually rederive from the matrix |
| Loop hangs indefinitely | Pause sentinel present | `ls -la research/.deep-research-pause` — delete the sentinel file to resume |

## Related Documents

- **Phase 017 research** (decided Option C): `../../z_archive/z_archive/017-memory-refactor-or-deprecation/`
- **Phase 017 recommendation**: `../../z_archive/z_archive/017-memory-refactor-or-deprecation/recommendation.md`
- **Phase 017 phase-018 proposal**: `../../z_archive/z_archive/017-memory-refactor-or-deprecation/phase-018-proposal.md`
- **sk-deep-research skill**: `.opencode/skill/sk-deep-research/SKILL.md`
- **Loop protocol reference**: `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- **Strategy template**: `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
- **Config template**: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- **Convergence reference**: `.opencode/skill/sk-deep-research/references/convergence.md`

## Lifecycle

These prompts are **inputs**, not outputs. Once both research runs complete and their findings are reviewed, phase 018 moves from research to planning. At that point:

1. Read both `implementation-design.md` and `impact-summary.md`.
2. Cross-check: does the recommended design (implementation prompt) match the change list (impact prompt)? Flag any gaps.
3. Write phase 018 `spec.md`, `plan.md`, `tasks.md`, `checklist.md` using the research findings as the evidence base.
4. Keep the research prompts and findings folders read-only as the audit trail for the refactor.
