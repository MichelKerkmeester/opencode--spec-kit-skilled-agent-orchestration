# Implementation Dispatch: Routing Accuracy Hardening

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast` per autonomous-completion directive.

**Gate 3 pre-answered**: Option **E** (phase folder). All file writes pre-authorized. Autonomous run, no gates.

## SCOPE

Read first:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/004-routing-accuracy-hardening/{spec.md,plan.md,tasks.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/research.md`
- `.../005-routing-accuracy/corpus/labeled-prompts.jsonl` (200-prompt regression fixture)

Implement Wave A + Wave B (Wave C conditional):

**Wave A — Advisor command-surface normalization:**
- In `.opencode/skill/skill-advisor/scripts/skill_advisor.py`: add command-bridge → owning-skill mapping
- Normalize commands `command-memory-save` → `system-spec-kit`, `command-spec-kit-resume` → `system-spec-kit`, `command-spec-kit-deep-research` → `sk-deep-research`, `command-spec-kit-deep-review` → `sk-deep-review`
- Guard: DO NOT normalize when prompt explicitly quotes a command string or names a specific command-target (implementation-level references)
- Wire normalization into final ranking step
- Add unit tests: normalization path + guard carve-outs
- Run labeled corpus: advisor exact-match accuracy must be ≥ 60% (baseline 53.5%)

**Wave B — Gate 3 deep-loop positive markers:**
- Extend `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` `classifyPrompt()` positive trigger list with deep-loop markers: `deep research`, `deep review`, `:auto` (when paired with spec_kit prefix), `convergence`, `iteration loop`, `autoresearch`, `continue iteration`
- Add test cases to `gate-3-classifier.vitest.ts`
- Run labeled corpus: Gate 3 F1 must be ≥ 83% (baseline 68.6%)
- Verify no regression on historical false-positive tokens (`analyze`, `decompose`, `phase`) — they must still route as read-only when no write-tail present

**Wave C — Optional follow-ons (conditional on re-measurement):**
- Compute joint matrix after Wave A+B
- If FF mass still > 20, add:
  - Broader resume/context markers (3 additional triggers)
  - Narrow mixed-tail write exception (read-only prefix + explicit write target)
- Re-measure; commit only if gains justify

## CONSTRAINTS

- Run routing-accuracy regression (corpus scorer) after each Wave
- Self-correct up to 3 attempts on failure, then HALT
- Mark `tasks.md` items `[x]` with evidence (accuracy numbers + test status)
- Update checklist.md + implementation-summary.md
- DO NOT git commit or git push (orchestrator commits at end)

## OUTPUT EXPECTATION

Wave A+B land with target accuracy gains. Wave C decision documented. Tests green. Spec docs updated.
