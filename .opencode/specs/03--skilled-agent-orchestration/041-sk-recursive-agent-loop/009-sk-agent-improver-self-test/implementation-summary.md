# Implementation Summary: Phase 009 — Agent-Improver Self-Test

| Field | Value |
| --- | --- |
| Status | Complete |
| Phase | 009 |
| Parent | 041-sk-agent-improver-loop |
| Date | 2026-04-04 |

## What Was Done

Ran the first self-referential test of the sk-agent-improver skill: the `/improve:agent` loop targeting `.opencode/agent/agent-improver.md` itself. This is the agent that describes the improvement workflow evaluating its own quality across 5 dimensions.

### Pre-Flight Verification

All 8 `.cjs` scripts parsed without errors. Standalone tests confirmed the scanner, profiler, and scorer work against the agent-improver target.

### Integration Scanner Results

The scanner discovered **9 surfaces** for `agent-improver`:

| Surface | Path | Status |
| --- | --- | --- |
| Canonical | `.opencode/agent/agent-improver.md` | Exists |
| Mirror (Claude) | `.claude/agents/agent-improver.md` | Aligned |
| Mirror (Codex) | `.codex/agents/agent-improver.toml` | Aligned |
| Mirror (.agents) | `.agents/agents/agent-improver.md` | Aligned |
| Command | `.opencode/command/improve/agent.md` | 1 reference |
| YAML (auto) | `.opencode/command/improve/assets/improve_agent-improver_auto.yaml` | 2 references |
| YAML (confirm) | `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml` | 2 references |
| Skill | `.opencode/skill/sk-agent-improver/SKILL.md` | 6 references |
| Skill Advisor | `.opencode/skill/scripts/skill_advisor.py` | Matched |

### Dynamic Profile Results

Profile extracted from `agent-improver.md`:

| Category | Count | Details |
| --- | --- | --- |
| Structural checks | 6 | CORE WORKFLOW, OUTPUT VERIFICATION, ANTI, CAPABILITY SCAN, RULES, RELATED RESOURCES |
| Always rules | 6 | Read charter, read manifest, read target, stay proposal-only, keep scope narrow, return structured metadata |
| Never rules | 5 | Edit canonical, edit mirrors, expand scope, score yourself, hide uncertainty |
| Output checks | 7 | Read control bundle, candidate in runtime area, target matches manifest, JSON fields, no canonical mutation, no placeholders, uncertainty stated |
| Capability mismatches | 0 | All permissions align with declared capabilities |

### Iteration Results

| Iteration | Score | Structural | Rule Coherence | Integration | Output Quality | System Fitness | Change |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline | 99 | 100 | 100 | 100 | 100 | 93 | N/A |
| 1 | 99 | 100 | 100 | 100 | 100 | 93 | Added halt condition for missing inputs, merged checklist blocks, corrected command path |
| 2 | 100 | 100 | 100 | 100 | 100 | 100 | Fixed invalid resource ref: `/improve:agent-improver` → `/improve:agent` |
| 3 | 100 | 100 | 100 | 100 | 100 | 100 | Precision fixes: scan report provenance note, summary box label consistency |

### Stop Condition

Loop exited via **max-iterations (3)**, not dimension plateau. The plateau detector requires ALL dimensions to have 3+ identical scores simultaneously. System Fitness had scores [93, 100, 100] — only 2 consecutive identical values at 100, not the required 3. This is a valid finding about the plateau detection logic: a dimension that improves mid-run resets its plateau counter.

## Self-Referential Observations

1. **Tautological rule coherence**: The profile extracts ALWAYS/NEVER rules from agent-improver.md, then the scorer checks the same content for those same rules. First iteration predictably scores 100 on ruleCoherence because the rules came from the content being scored.

2. **High skill reference count**: The integration scanner found 6 references to `agent-improver` in `sk-agent-improver/SKILL.md`. This is expected — the skill is literally about this agent — but stands out compared to typical agents (1-3 refs).

3. **No static fixtures**: The benchmark runner has no fixture directory for `agent-improver`. Dynamic-only mode correctly skips benchmarking without error. Benchmark runs = 0 in the dashboard.

4. **Real bug discovered**: The agent's RELATED RESOURCES section listed `/improve:agent-improver` as the command slug, but the actual file is `.opencode/command/improve/agent.md` (slug: `/improve:agent`). The scorer's `resource-refs-valid` check correctly flagged this as invalid (3/4 valid). The subagent identified and fixed it in iteration 2.

5. **Mutator reads itself**: The `@agent-improver` subagent reads its own definition as the target. The proposal-only boundary works correctly — it writes candidates to `improvement/candidates/`, never editing the canonical target. No circular issues.

6. **Convergence speed**: Well-maintained agent file converges in 2 iterations (baseline 99 → fix → 100). By iteration 3, only precision/consistency tweaks remain with no score impact.

## Key Decisions

| Decision | Why |
| --- | --- |
| Use `:confirm` mode | Interactive gates allow observing each iteration's behavior |
| Use dynamic scoring (not static) | No static profile exists for agent-improver |
| 3 iterations max | Sufficient to demonstrate improvement, plateau, and stop |
| No promotion | Test-only phase — candidates stay in runtime area |
| Record all artifacts | Full audit trail for the self-referential test |

## Verification Results

| Check | Result |
| --- | --- |
| All 8 scripts parse | OK |
| Scanner discovers 9 surfaces | OK |
| All mirrors aligned | OK |
| Profile extracts 11 rules + 7 output checks | OK |
| Baseline 5D score | 99 (systemFitness=93) |
| Iteration 2 score | 100 (all dimensions) |
| Dashboard + registry present | OK |
| No infra_failure | OK |
| 3 candidates generated | OK |
| Stop condition: max-iterations | OK |
