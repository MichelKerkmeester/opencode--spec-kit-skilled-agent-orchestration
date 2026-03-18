---
title: "Task Breakdown: Autonomous Deep Research Loop"
description: "Ordered task list for 5-phase autoresearch implementation"
trigger_phrases:
  - "autoresearch tasks"
importance_tier: "normal"
contextType: "general"
---
# Task Breakdown: Autonomous Deep Research Loop

<!-- SPECKIT_LEVEL: 3 -->

---

## Phase 1: Spec Folder Completion

- [x] T-001: Create description.json
- [x] T-002: Create spec.md (Level 3 template)
- [x] T-003: Create plan.md
- [x] T-004: Create tasks.md (this file)
- [x] T-005: Create checklist.md (Level 3 template)
- [x] T-006: Create decision-record.md (Level 3 template)

## Phase 2: Skill (sk-deep-research)

- [x] T-010: Create templates/deep-research-config.json
- [x] T-011: Create templates/deep-research-strategy.md
- [x] T-012: Create references/loop-protocol.md
- [x] T-013: Create references/state-format.md
- [x] T-014: Create references/convergence.md
- [x] T-015: Create references/quick_reference.md
- [x] T-016: Create SKILL.md (8 sections)
- [x] T-017: Create README.md

## Phase 3: Agent (@deep-research)

- [x] T-020: Create .claude/agents/autoresearch.md

## Phase 4: Command (/spec_kit:deep-research)

- [x] T-030: Create .agents/commands/autoresearch.toml
- [x] T-031: Create .opencode/command/autoresearch/autoresearch.md
- [x] T-032: Create assets/autoresearch_auto.yaml
- [x] T-033: Create assets/autoresearch_confirm.yaml

## Phase 5: Registration Updates

- [x] T-040: Update CLAUDE.md (agent routing table)
- [x] T-041: Update .claude/agents/orchestrate.md (agent selection)
- [x] T-042: Update .opencode/skill/README.md (catalog count)
- [x] T-043: Update .opencode/skill/scripts/skill_advisor.py (keywords)
- [x] T-044: Update .opencode/specs/descriptions.json (add entry)

---

## v2: Research-Validated Improvements (18 Proposals from 14-Iteration Deep Research)

> Source: `scratch/improvement-proposals.md` v2 -- derived from code-level analysis of 4 autoresearch repos + 322 community issues

## Phase 6: P1 -- Robustness & Convergence (Adopt Now)

- [ ] T-100: **JSONL Fault Tolerance** (REQ-010, Effort: S)
  - Wrap each JSONL line parse in try/catch, skip malformed lines
  - Add default values for missing fields: `status ?? "complete"`, `newInfoRatio ?? 0`
  - Log warning count after parse: "N of M lines skipped"
  - Files: `references/state-format.md`, `references/convergence.md`

- [ ] T-101: **Exhausted Approaches Enhancement** (REQ-011, Effort: S)
  - Add structured format: `### [Category] -- BLOCKED (iteration NNN, N attempts)`
  - Add positive selection: `### [Category] -- PRODUCTIVE (newInfoRatio > 0.70)`
  - Agent MUST check exhausted approaches BEFORE choosing iteration focus
  - Files: `templates/deep-research-strategy.md`, `.claude/agents/autoresearch.md`

- [ ] T-102: **State Recovery Fallback** (REQ-012, Effort: S)
  - Add recovery function: scan `scratch/iteration-*.md` `## Assessment` sections
  - Extract: run number, newInfoRatio, questions addressed/answered
  - Reconstruct JSONL from parsed data when primary JSONL corrupted
  - Files: `references/loop-protocol.md`, `references/state-format.md`

- [ ] T-103: **Iteration Reflection Section** (REQ-013, Effort: S)
  - Add `## Reflection` section to iteration template between Assessment and Next Focus
  - Requires: (1) what worked and why, (2) what failed and why, (3) what to do differently
  - Files: `.claude/agents/autoresearch.md` (iteration output format)

- [ ] T-104: **Tiered Error Recovery Protocol** (REQ-014, Effort: S)
  - Define 5 research-adapted tiers in agent protocol:
    - Tier 1: Tool/source failure -- retry alternative, max 2 retries
    - Tier 2: Focus exhaustion -- widen scope, reverse approach, after 2 low-value iterations
    - Tier 3: State corruption -- reconstruct from iteration files (T-102)
    - Tier 4: Repeated systemic failure -- escalate to user with diagnostic
    - Tier 5: Agent dispatch failure -- orchestrator absorbs work in direct mode
  - Files: `references/convergence.md`, `.claude/agents/autoresearch.md`

- [ ] T-105: **Composite Convergence Algorithm** (REQ-015, Effort: M)
  - Replace single-signal `shouldContinue()` with 3-signal weighted vote:
    - Signal 1: Rolling 3-iteration average of newInfoRatio (weight 0.30)
    - Signal 2: MAD-based noise detection -- ratio within noise floor? (weight 0.35)
    - Signal 3: Question-coverage entropy -- residual unanswered questions (weight 0.35)
  - Stop when weighted stop-score > 0.60 consensus threshold
  - Graceful degradation: if < 4 iterations, omit MAD signal, redistribute weights
  - Expose individual signal values in JSONL event record
  - Files: `references/convergence.md`, YAML workflows (convergence check step)

## Phase 7: P2 -- Enrichment & User Control (Adopt Next)

- [ ] T-110: **Ideas Backlog File** (REQ-016, Effort: S)
  - Add convention for `scratch/research-ideas.md` as parking lot
  - Check at 3 points: strategy init, stuck recovery, auto-resume message
  - Protocol-only change -- no code, just agent + loop protocol update
  - Files: `references/loop-protocol.md`, `.claude/agents/autoresearch.md`

- [ ] T-111: **Sentinel Pause File** (REQ-017, Effort: S)
  - Before each dispatch, check for `scratch/.deep-research-pause`
  - If present: log `{"type":"event","event":"paused"}`, halt with message
  - On resume: log `{"type":"event","event":"resumed"}`
  - Files: `references/loop-protocol.md`, YAML workflows (pre-dispatch check)

- [ ] T-112: **Compact State Summary Injection** (REQ-018, Effort: S)
  - Generate 200-token structured summary at dispatch time:
    - Current segment, iterations completed, questions answered/remaining
    - Last 2 iteration focuses + newInfoRatios
    - Active stuck recovery state, current "Next Focus"
  - Inject as preamble to every agent dispatch prompt
  - Files: `references/loop-protocol.md`, YAML workflows (dispatch step)

- [ ] T-113: **Enriched Stuck Recovery Heuristics** (REQ-019, Effort: S)
  - Add 3 explicit strategies to stuck recovery:
    - (1) Try Opposites: if N iterations searched X, search NOT-X
    - (2) Combine Prior Findings: synthesize 2 highest-ratio iterations into new question
    - (3) Audit Low-Value: re-read iterations with ratio < 0.20, extract buried insights
  - Orchestrator selects strategy based on stuck condition type
  - Files: `references/convergence.md`

- [ ] T-114: **Segment-Based State Partitioning** (REQ-020, Effort: S)
  - Add `"segment"` field to JSONL iteration records (default: 1)
  - Add `{"type":"event","event":"segment_start","segment":N}` record type
  - Convergence algorithm filters by current segment for rolling averages
  - Cross-segment analysis available by reading full JSONL
  - Files: `references/state-format.md`, `references/convergence.md`, `templates/`

- [ ] T-115: **Scored Branching with Pruning** (REQ-021, Effort: L)
  - Extend wave orchestration: Wave 1 → score all branches by newInfoRatio → Wave 2 prunes below-median
  - Add breakthrough detection: if any branch > 2x wave average, explore ADJACENT questions
  - Post-breakthrough: don't refine the breakthrough, explore what it enables
  - Requires orchestrator scoring+dispatch loop (not pre-assigned focuses)
  - Files: `references/loop-protocol.md`, YAML workflows, SKILL.md

## Phase 8: P3 -- Polish (Consider Later)

- [ ] T-120: **Statistical newInfoRatio Validation** (REQ-022, Effort: M)
  - Compute MAD of all historical newInfoRatio values after each iteration
  - Compare latest ratio against noise floor (MAD * 1.4826)
  - Log advisory event `{"type":"event","event":"ratio_within_noise"}` if within 1.0x floor
  - Does not override convergence, provides diagnostic signal
  - Files: `references/convergence.md`

- [ ] T-121: **Progress Visualization** (REQ-023, Effort: S)
  - Generate markdown convergence summary after each iteration:
    - newInfoRatio trend (ASCII sparkline or table)
    - Questions progress: N answered / M total (progress bar)
    - Findings count, wave completion status
  - Append to strategy.md or emit as `scratch/progress.md`
  - Files: `references/quick_reference.md`, agent output format

- [ ] T-122: **Git Commit Per Iteration** (REQ-024, Effort: S)
  - After each iteration: `git add scratch/deep-research-state.jsonl scratch/iteration-NNN.md scratch/deep-research-strategy.md`
  - Commit: `chore(deep-research): iteration NNN complete`
  - Targeted git add (NOT `-A`) to avoid binary/artifact bloat
  - Sanitize commit messages (lesson from pi-autoresearch PR #13)
  - Files: `references/loop-protocol.md`, YAML workflows

## Phase 9: P4 -- Track (Future)

- [ ] T-130: **File Mutability Declarations** (REQ-025, Effort: S)
  - Add `"fileProtection"` map to config JSON:
    `{"config.json":"immutable","state.jsonl":"append-only","strategy.md":"mutable","iteration-*.md":"write-once"}`
  - Orchestrator validates agent outputs against declarations before writing
  - Files: `templates/deep-research-config.json`, `references/state-format.md`

- [ ] T-131: **True Context Isolation via `claude -p`** (REQ-026, Effort: L)
  - Replace Task tool dispatch with `claude -p` shell invocation per iteration
  - Generate self-contained prompt from strategy.md + config + last N summaries
  - Execute: `claude -p "$(cat prompt.md)" --max-turns 50 --effort high`
  - Claude-only backend (Codex confirmed unreliable per karpathy Issue #57)
  - Files: `references/loop-protocol.md`, YAML workflows (major restructure)

- [ ] T-132: **Research Simplicity Criterion** (REQ-027, Effort: S)
  - Add soft quality criterion to iteration assessment
  - Consolidation/simplification iterations get newInfoRatio bonus even without new external data
  - Incentivizes synthesis alongside discovery
  - Files: `.claude/agents/autoresearch.md` (assessment section)
