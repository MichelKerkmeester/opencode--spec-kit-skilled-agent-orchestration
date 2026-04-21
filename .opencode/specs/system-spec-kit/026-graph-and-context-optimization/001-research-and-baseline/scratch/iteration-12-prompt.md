# ITERATION 12 — Killer-combo stress-test

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 12 of 18 max**. Rigor lane iter 4 of 10.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Prior outputs (READ before starting)

- `research/iterations/q-f-killer-combos.md` — the 3 combos to stress-test
- `research/iterations/q-c-composition-risk.md` — composition risk for components
- `research/iterations/q-a-token-honesty.md` — measurement methodology each combo must satisfy
- `research/iterations/iteration-9-skeptical-review.md` — any combo-related critiques
- `research/iterations/citation-audit-iter-11.json` — broken citations to avoid in stress-test rationale

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. Read all 5 phase folders + Public's `.opencode/` for failure-mode evidence.

---

## Iteration 12 mission: Try to FALSIFY each of the 3 killer combos

The previous synthesis was constructive ("here's why these combos are good"). This iter is destructive: **try to break each combo**. Look for failure modes, missing prerequisites, hidden assumptions, composition incompatibilities, and Q-A measurability gaps that would invalidate the synergy hypothesis.

### Stress-test protocol per combo

For each of the 3 combos:

1. **Restate the synergy hypothesis** (cite from q-f-killer-combos.md)
2. **Identify 5 failure modes** — concrete scenarios where the combo fails to deliver more than the sum of its parts
3. **Hidden prerequisites** — what does the combo SECRETLY assume that isn't called out?
4. **Composition collision check** — does any component conflict with another component's design assumptions?
5. **Q-A measurement gap** — can the combo's value actually be measured under Public's frozen-task methodology? If not, what's blocking?
6. **Counter-example from the codebase** — find at least 1 file in any of the 5 systems' externals that demonstrates why this combo might NOT work as advertised
7. **Survival verdict** — `survives | weakened | falsified`
   - `survives`: stress-test found no critical failure mode
   - `weakened`: failure modes exist but the combo is still net-positive with caveats
   - `falsified`: at least one failure mode kills the synergy hypothesis

### Severity calibration

Don't be a contrarian for the sake of it. If a combo genuinely survives, mark it `survives`. If iter-7 was right, the stress-test should converge to `survives` for at least 1-2 combos.

But also don't soften: if a combo is actually `falsified`, say so even if iter-7 scored it 9/10.

---

## Output 1 — `research/iterations/combo-stress-test-iter-12.md`

```markdown
# Iteration 12 — Killer Combo Stress-Test

> Adversarial pressure on the 3 combos surfaced in iter-7 q-f-killer-combos.md.

## TL;DR
- Combo 1: <verdict> — top failure mode: ...
- Combo 2: <verdict> — top failure mode: ...
- Combo 3: <verdict> — top failure mode: ...

## Combo 1 — <title from iter-7>

### Synergy hypothesis (restated)
> [quote from q-f-killer-combos.md]

### 5 failure modes
1. **<name>**: <description> — [SOURCE: …] (why this is plausible)
2. ...

### Hidden prerequisites
- <prerequisite>: <why it's hidden / not in iter-7>

### Composition collision check
- Component A vs Component B: <result>
- Component A vs Component C: <result>

### Q-A measurement gap
- Can the combo's value be measured under frozen-task methodology? <yes | no | partially>
- If no/partially: <what's blocking>

### Counter-example from codebase
- [SOURCE: <file>:<lines>] <one-paragraph explanation>

### Survival verdict
**<survives | weakened | falsified>**

Justification (≤200 words).

## Combo 2 — <title>
(repeat structure)

## Combo 3 — <title>
(repeat structure)

## Cross-combo patterns
- ≤4 bullets on patterns across the 3 stress-tests

## Recommendations for v2 combo language
- For each combo: how iter-17 should re-frame it given the stress-test verdict
```

---

## Output 2 — `research/iterations/iteration-12.md` (≤200 lines)

```markdown
# Iteration 12 — Per-iter report

## Method
- Adversarial stress-test of all 3 combos
- New external reads: <count>

## Survival summary
| Combo | Verdict | Top failure mode |
| 1 | … | … |
| 2 | … | … |
| 3 | … | … |

## Surprises
- ≤4 bullets

## Handoff to iter-13
- iter-13 will deep-inventory Public's existing infrastructure
- Stress-test conclusions about hidden prerequisites should inform what infra iter-13 looks for
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":12,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"combo_stress_test","combos_tested":3,"survives":<int>,"weakened":<int>,"falsified":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_12_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_12_COMPLETE survives=<n> weakened=<n> falsified=<n>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables
- DO NOT modify q-f-killer-combos.md
- Be specific: every failure mode needs a concrete scenario, not a generic concern
- Counter-examples MUST cite source files
- AVOID using the broken `phase-N/` literal-path citation form (use `00N-folder-name/...` instead — iter-11 found these don't resolve)
- Don't softball the verdicts but don't be contrarian either

## When done

Exit. Do NOT start iter-13.
