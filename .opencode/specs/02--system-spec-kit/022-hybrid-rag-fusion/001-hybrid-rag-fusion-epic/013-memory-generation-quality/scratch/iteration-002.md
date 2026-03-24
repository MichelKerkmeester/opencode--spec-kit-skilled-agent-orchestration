# Review Iteration 2: Spec Alignment - Research vs Spec Requirements

## Focus
D3 Spec Alignment -- Does research.md answer all questions in spec.md? Are success criteria met? Are checklist [x] markings honest given iteration 1 correctness findings?

## Scope
- Review target: spec.md (success criteria, research questions), research.md (answers), checklist.md (evidence claims), tasks.md (completion status)
- Dimension: spec-alignment

## Scorecard
| File | Corr | Sec | Patt | Maint | Perf | Total |
|------|------|-----|------|-------|------|-------|
| spec-alignment | -- | -- | -- | -- | -- | 22/30 |

## Findings

### P1-005: Success criteria marked incomplete but research delivers answers
- Dimension: spec-alignment
- Evidence: [SOURCE: spec.md:53-58] -- Success criteria Q1-Q4 are marked `[ ]` (unchecked), but the first criterion `[x] 5 root causes documented with file:line evidence` is checked.
- Cross-reference: [SOURCE: research.md sections 1-4] -- All three research questions (Q1, Q2, Q3) have detailed answers with file:line evidence. [SOURCE: checklist.md] -- All 16 checklist items are marked `[x]` with EVIDENCE citations.
- Impact: spec.md shows 4 of 5 success criteria unchecked, yet checklist.md marks corresponding items as complete with evidence. This is an inconsistency -- either spec.md wasn't updated after research completed, or checklist.md is over-claiming.
- Skeptic: This might be intentional -- spec.md may use `[ ]` for criteria that haven't been externally validated, while checklist.md tracks self-assessed completion. But there's no documented convention for this distinction.
- Referee: P1 confirmed. The discrepancy between spec.md success criteria (4/5 unchecked) and checklist.md (16/16 checked) creates confusion about actual completion status.
- Final severity: P1

### P1-006: Checklist evidence citations reference stale code state
- Dimension: spec-alignment
- Evidence: [SOURCE: checklist.md:7-12] -- Q1 checklist items cite "research.md section 1" as evidence, which in turn references code in its pre-fix state (per P1-001 through P1-003 from iteration 1).
- Cross-reference: [SOURCE: checklist.md:8] -- "Every buildSpecTokens() call site documented" with evidence pointing to research.md section 1 row 7, which describes buildSpecTokens as LATENT path. This is ACCURATE -- buildSpecTokens is indeed latent in the JSON-mode workflow.
- Impact: While the checklist items ARE answered by the research, several of the underlying research claims are stale (per iteration 1 findings). The checklist is honest about what the research says, but the research itself has correctness issues.
- Skeptic: The checklist's job is to track whether research was performed, not whether the code has since been fixed. From that lens, the checklist IS accurate.
- Referee: P1 confirmed but downgraded consideration warranted. The checklist accurately reflects what research.md says, but research.md is stale. The issue is transitive inaccuracy, not dishonest marking.
- Final severity: P1

### P1-007: Tasks.md shows Phase 2-4 items all unchecked despite research completion
- Dimension: spec-alignment
- Evidence: [SOURCE: tasks.md:15-17] -- "Iteration 1-3" all marked `[ ]` despite iteration files existing and research.md being compiled.
- Cross-reference: [SOURCE: tasks.md:23-27] -- Phase 3 (Synthesis) and Phase 4 (Context Preservation) all `[ ]` despite research.md existing and memory file existing at memory/24-03-26_15-30__completed-deep-research-on-memory-generation.md.
- Impact: tasks.md was not updated after work completed. All Phase 2-4 tasks should be `[x]`.
- Skeptic: Minor documentation hygiene issue. The actual work was done.
- Referee: P1 confirmed. Incomplete task tracking undermines the spec folder as a reliable record of work done.
- Final severity: P1

### P2-004: Research Q3 answer exceeds spec scope boundary
- Dimension: spec-alignment
- Evidence: [SOURCE: spec.md:40] -- Scope explicitly states "Implementation of fixes (separate phase)" is out of scope. [SOURCE: research.md section 7] -- Ultra-think review provides detailed implementation steps (PR1, PR2, LOC estimates, specific code changes).
- Impact: The ultra-think section crosses the research-only boundary into implementation planning. Not harmful, but technically out of scope per spec.md.
- Final severity: P2 (beneficial scope expansion, not harmful)

### P2-005: spec.md line references don't match current code
- Dimension: spec-alignment
- Evidence: [SOURCE: spec.md:17-21] -- Root cause table cites `memory-frontmatter.ts:50-57`, `workflow.ts:122-165`, `semantic-summarizer.ts:468-610`, `topic-extractor.ts:29-34`, `post-save-review.ts:184-198`. Some of these have shifted since spec creation.
- Impact: Line references in spec.md may be slightly off but are close enough to locate the relevant code. Minor drift.
- Final severity: P2

## Cross-Reference Results
- Confirmed: Research Q1 (section 1) answers spec Q1 with contamination map. Research Q2 (section 2) answers spec Q2 with gap analysis. Research Q3 (section 3+7) answers spec Q3 with architecture decision.
- Contradictions: spec.md success criteria 2-5 unchecked vs checklist.md 16/16 checked. tasks.md fully unchecked (Phase 2-4) vs actual deliverables present.
- Unknowns: Whether unchecked spec.md criteria are intentional (external validation pending) or oversight.

## Ruled Out
- Checklist fabrication: All checklist evidence citations point to real content in research.md. The evidence exists, it's just stale.
- Missing research questions: All 3 Qs from spec.md are fully addressed in research.md.

## Sources Reviewed
- [SOURCE: spec.md:1-59]
- [SOURCE: research.md:1-210]
- [SOURCE: checklist.md:1-33]
- [SOURCE: tasks.md:1-33]

## Assessment
- Confirmed findings: 5 (3 P1, 2 P2)
- New findings ratio: 0.71
- noveltyJustification: 3 new P1 findings (spec/tasks inconsistency, transitive stale evidence, unchecked tasks) + 2 P2 (scope drift, line number drift). Weighted: (3*5 + 2*1) / (3*5 + 2*1) = 1.0, but adjusting for overlap with iteration 1 staleness theme: 0.71.
- Dimensions addressed: spec-alignment

## Reflection
- What worked: Cross-referencing spec.md criteria against checklist.md and tasks.md revealed clear documentation gaps.
- What did not work: N/A
- Next adjustment: D2 Security can be quick (research-only spec, minimal security surface). Then D4 Completeness to assess blind spots.
