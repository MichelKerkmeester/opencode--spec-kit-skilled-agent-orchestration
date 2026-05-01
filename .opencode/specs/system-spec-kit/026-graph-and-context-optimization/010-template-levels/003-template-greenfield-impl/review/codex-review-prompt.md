# Independent Review Request — Implementation Packet 012

You are a fresh agent. Review the implementation planning packet at:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/`

This is NOT a code review (no code is written yet). It is a **planning quality review** of the spec-kit folder that will guide the actual implementation work.

## Context (read before reviewing)

The spec-kit framework documents every code-changing task in a "spec folder" with `spec.md`, `plan.md`, `tasks.md`, etc. There are TWO related packets:

- **Packet 011** (`011-template-greenfield-redesign/`) — DESIGN packet. 14-iteration deep-research loop. Converged on a chosen design (C+F hybrid manifest-driven greenfield). Includes 5 ADRs (ADR-001 through ADR-005). Full synthesis in `research/research.md` (51.4 KB, 17 sections + workflow-invariance addendum).

- **Packet 012** (`012-template-greenfield-impl/`) — IMPLEMENTATION packet (the one you're reviewing). Inherits 011's design. Documents the 4-phase execution plan with file-by-file blast radius.

The implementation will:
- Replace the current 86-file template tree (`templates/{core,addendum,level_1,level_2,level_3,level_3+,phase_parent}/`) with ~13 files in `templates/manifest/`
- Replace today's hardcoded level→files matrix in `create.sh` + `check-files.sh` with a single private manifest (`spec-kit-docs.json`) consumed by both
- Preserve the public `--level N` CLI flag, AI conversation flow, validator error messages, and Gate 3 classifier behavior — all byte-identical to today (this is ADR-005's "workflow invariance")
- Workflow-invariance is enforced by a CI test (`workflow-invariance.vitest.ts`) that fails the build if banned vocabulary (preset/capability/kind/manifest) leaks to any user/AI-facing surface

## Files to review (in this order)

1. **`012-template-greenfield-impl/resource-map.md`** — the AUTHORITATIVE file ledger. ~85 file references in 8 sections. Lists every ADD / MODIFY / DELETE / UNTOUCHED path with reasoning.

2. **`012-template-greenfield-impl/spec.md`** — problem framing, scope, requirements, success criteria, risks, user stories.

3. **`012-template-greenfield-impl/plan.md`** — 4-phase blueprint (the meat). Phases, gates, dependency graph, critical path, milestones, effort estimation.

4. **`012-template-greenfield-impl/tasks.md`** — T-101 through T-420. One task per concrete action.

5. **`012-template-greenfield-impl/decision-record.md`** — meta-ADR documenting that 012 inherits 011's ADR-001 through ADR-005 unchanged.

6. **`012-template-greenfield-impl/checklist.md`** — quality gates per phase.

For context, also skim:
- `011-template-greenfield-redesign/decision-record.md` (the 5 inherited ADRs)
- `011-template-greenfield-redesign/research/research.md` §1-2 (TL;DR + recommendation) and §18 (workflow-invariance addendum) — don't read all 51 KB; just enough to verify 012 inherits faithfully

## Review dimensions (in priority order)

### P0 — Must-be-right (blocks "ready to implement")

1. **Resource-map completeness.** Did the resource-map miss any file? Cross-check against:
   - `find .opencode/skill/system-spec-kit/templates -type d` — every template subdirectory accounted for in resource-map §1, §3, or §4?
   - `grep -rln "templates/level_\|templates/core\|templates/addendum\|templates/phase_parent\|copy_template\|compose\.sh" .opencode/skill/system-spec-kit/scripts/ .opencode/skill/system-spec-kit/mcp_server/` — every file that currently references the deleted paths covered in resource-map §2 (modifications) or §3 (deletions)?
   - `ls .opencode/skill/system-spec-kit/scripts/rules/check-*.sh` — every validator either in §2 (modified) or §4 (untouched with reasoning)?
2. **Phase-ordering correctness.** Phase 1 claims to be purely additive (zero existing-file changes). Verify by reading plan.md Phase 1 step list — are there any modifications hiding in there?
3. **Gate definitions completeness.** Each phase has a "GATE N" with checklist items. Do the gate items actually verify what the goal claims? E.g., does Gate 1 catch a workflow-invariance leak?
4. **ADR inheritance integrity.** Does 012's decision-record.md correctly cite ADR-001 through ADR-005 from 011 without re-deciding anything? Does the implementation in plan.md honor each ADR?
5. **Workflow-invariance enforcement.** The CI test (`workflow-invariance.vitest.ts`) is the central guardrail. Does Phase 1 actually create this test? Does the test scope (per ADR-005) cover all surfaces the iter-12 audit identified?

### P1 — Should-be-right (improves quality before implementation starts)

6. **Effort estimation realism.** Plan claims 17-27 focused hours total. For each phase, is the estimate plausible given the file count and complexity?
7. **Risk register coverage.** spec.md §6 + §10 risk matrix. Are there obvious risks not captured? E.g., what about the `template-structure.js` refactor potentially breaking tests not listed?
8. **Critical path correctness.** plan.md L3 critical path claims Phase 2 + 3 can run parallel. Is that actually true given the dependency on Phase 1's resolver API?
9. **Rollback plausibility.** Single-commit rollback is asserted. Is that actually achievable given that Phases 1-4 likely land as separate PRs in practice?
10. **Task granularity.** tasks.md has T-101 through T-420 (~50 tasks). Are any tasks too coarse to verify? Any too granular to be useful?

### P2 — Nice-to-have

11. **Consistency between docs.** Does `tasks.md` T-### match `plan.md` Phase steps? Do file paths in `resource-map.md` match those cited in `plan.md` and `spec.md`?
12. **Wording / clarity.** Spot any confusing or contradictory statements?
13. **Documentation of inherited ADRs.** Is the inheritance pointer system clear, or would future readers benefit from inline copies of ADR text?

## Output format

Write your review as plain markdown to stdout. Structure:

```markdown
# Independent Review of Packet 012

## Verdict
ONE OF: READY TO IMPLEMENT | READY WITH MINOR FIXES | NOT READY (P0 blockers)

## P0 Findings (blockers)
- [If any] file:line — finding — recommendation
- ...

## P1 Findings (should-fix)
- ...

## P2 Findings (nice-to-have)
- ...

## Strengths
- 3-5 bullets on what the packet does well

## Summary
2-3 sentences on overall quality and readiness
```

## Constraints

- Be SHARP and SPECIFIC. Cite exact file paths + line numbers when possible.
- Do NOT re-decide the design. Inherited ADRs are binding. Flag drift, not preferences.
- Do NOT propose net-new scope. Flag missing scope only if it's required to satisfy an existing ADR or P0 requirement.
- Stay UNDER 1500 words. Quality over volume.
- Be honest: if the packet is genuinely ready, say so. Don't manufacture findings.

Write the review. The orchestrator will read your stdout, save it as `012-template-greenfield-impl/review/codex-review.md`, and present the findings to the user.
