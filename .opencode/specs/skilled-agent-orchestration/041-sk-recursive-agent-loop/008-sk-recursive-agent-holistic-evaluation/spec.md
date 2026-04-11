# Spec: Holistic Agent Evaluation & Integration-Aware Improvement

| Field | Value |
| --- | --- |
| Status | Complete |
| Priority | P1 |
| Level | 3 |
| Parent | 041-sk-improve-agent-loop |
| Phase | 008 |
| Estimated LOC | 800-1000 |

## Problem

The sk-improve-agent skill evaluates agents by checking **keyword presence in markdown** (~15-20% of what a true agent improvement system needs). The scorer tests "does the file mention `spec.md`?" rather than "does the agent understand spec folders?". The benchmark tests "does output have required headings?" rather than "is the output correct and useful?".

This means:
- A structurally perfect but behaviorally broken candidate can pass all checks
- Only handover and context-prime are supported as targets (hardcoded profiles)
- Integration surfaces (mirrors, commands, YAML workflows, skill routing) are not evaluated
- No cross-validation between an agent's stated rules and its actual workflow steps

## Solution

Transform evaluation from structural keyword-checking to a **5-dimension integration-aware scoring framework**:

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Template compliance, section order, size bounds |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands resolve, YAML valid |
| Output Quality | 0.15 | File references exist, format matches contract |
| System Fitness | 0.15 | Gate routing, permissions match capabilities |

Two new foundation scripts:
1. **Integration Scanner** (`scan-integration.cjs`) — discovers all surfaces an agent touches
2. **Dynamic Profile Generator** (`generate-profile.cjs`) — derives scoring rubric from any agent's own rules

## Scope

### In Scope

- New scripts: scan-integration.cjs, generate-profile.cjs
- Refactored scripts: score-candidate.cjs (5-dimension), run-benchmark.cjs (integration-aware), reduce-state.cjs (dimensional tracking)
- Updated docs: SKILL.md, agent, command, YAML workflows, references, assets
- Runtime mirror sync after canonical changes
- Backward compatibility with existing handover/context-prime profiles

### Out of Scope

- Docker-based behavioral execution (autoagent-main pattern)
- LLM-as-judge scoring (non-deterministic, breaks promotion gates)
- New target onboarding beyond dynamic profiles
- Changes to promote-candidate.cjs or rollback-candidate.cjs gates

## Requirements

1. Any agent in `.opencode/agent/` must be a valid evaluation target via dynamic profiles
2. Integration scanner must discover canonical + mirrors + commands + YAML + skills + global docs
3. Scorer must produce per-dimension scores alongside backward-compatible aggregate score
4. Existing handover/context-prime hardcoded checks must still work unchanged
5. All scoring must remain deterministic (no LLM calls, no network, no randomness)
6. Reducer dashboard must show dimensional progress
7. SKILL.md must pass `package_skill.py --check` after changes

## Success Criteria

- `scan-integration.cjs` correctly discovers all surfaces for handover, context-prime, and debug agents
- `generate-profile.cjs` produces valid profiles from any agent .md file
- `score-candidate.cjs --dynamic` produces 5-dimension scores
- `score-candidate.cjs --profile handover` produces backward-compatible scores
- `run-benchmark.cjs --profile handover` existing fixtures still pass
- `package_skill.py --check` returns PASS
- End-to-end `/improve:agent-improver` loop works with new dimensional scoring
