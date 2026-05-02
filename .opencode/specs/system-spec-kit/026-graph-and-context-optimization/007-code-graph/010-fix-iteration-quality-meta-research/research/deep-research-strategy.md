# Deep-Research Strategy — Fix-Iteration Quality Meta-Research

## Charter

Investigate WHY the 009-end-user-scope-default packet required 4 review rounds
(Run 1 CONDITIONAL → FIX-009 → Run 2 FAIL → FIX-009-v2 → Run 3 FAIL → FIX-009-v3
→ Run 4 PASS) to converge clean, despite each individual fix being focused and
verified. Recommend specific edits to FIX prompt templates, sk-code-review,
and sk-deep-review convergence rules to compress the cycle to 1-2 rounds for
security-sensitive code.

## 5 Hypothesized Failure Modes (from spec.md §1)

1. **Single-site fix when class-of-bug exists** — fix targets reported file:line; sibling sites missed
2. **One-consumer fix when cross-cutting** — fix flows through one path; parallel paths still buggy
3. **Algorithm choice with hidden edge cases** — regex-replace when split-and-process needed
4. **Partial test matrix** — describe.each with N-1 cases
5. **Test isolation regressions** — pre-existing pattern bugs surfaced when reviewing the fix's new tests

## Iteration Plan (5 iters, ~10-15 min each at xhigh)

1. **Empirical analysis of the 009 trajectory** — read all 4 review reports + 3 fix commit messages, classify each finding by failure mode, build a finding-cause-fix matrix
2. **Historical packet audit** — survey ≥3 sibling packets in 026-graph-and-context-optimization/ for similar trajectories. Quantify: how many packets have multi-round fix trajectories? Which failure modes appear most often?
3. **Algorithm/pattern catalog** — for each failure mode, document the WRONG pattern (regex-replace, single-site, etc.) and the RIGHT pattern (split-and-process, audit-all-siblings, etc.) with code examples
4. **Cost-benefit analysis** — quantify: 4-round trajectory cost (wall-clock + Premium) vs hypothetical 1-round broader-scope fix. When is broader-scope worth the per-fix cost overhead?
5. **Recommendations + ADR draft** — synthesize concrete edits to:
   - FIX prompt template (system-spec-kit/scripts/templates/level_*/FIX or equivalent)
   - sk-code-review SKILL.md (finding classification: class-of-bug vs instance-only)
   - sk-deep-review references/convergence.md (security-sensitive code stricter convergence?)
   - /spec_kit:plan flow (require "Affected Surfaces" enumeration in plan.md)
   - "Fix completeness checklist" — concrete grep/test commands the FIX prompt requires before declaring DONE

## Convergence

- Threshold: rolling avg newFindingsRatio ≤ 0.05
- Hard stop: 5 iters
- Output: research.md with ≥4 sections (Empirical, Audit, Patterns, Recommendations) + ADR-001 draft

## Research Questions (from spec.md §6)

(Reproduced from spec.md — research must answer at least 5 of 7)
1. Which of the 5 failure modes is most frequent across past packets?
2. Is multi-round pattern correlated with security-sensitive code?
3. Would broader-scope fix prompt produce longer wall-clock per fix vs save cycles?
4. Should sk-deep-review include hard-stop "gates re-checked after fix" requirement?
5. Should /spec_kit:plan for fix packets enumerate all consumers in plan.md "Affected Surfaces"?
6. Are LEAF-agent reviewers finding genuinely different findings each round (adversarial diversity working) vs. just finding same bugs in different locations (pure fix narrowness)?
7. What's the right default fix prompt: "fix this finding" vs. "fix + justify each sibling/consumer is unchanged"?
