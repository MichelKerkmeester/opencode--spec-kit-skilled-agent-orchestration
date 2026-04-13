# Iteration 12: Checklist Completion as a Secondary Status Signal

## Focus
Use Spec Kit's existing completion gate to determine whether `checklist.md` can safely refine the phase-001 status fallback.

## Findings
1. `check-completion.sh` already defines a concrete `COMPLETE` state for `checklist.md`: all required P0/P1 items must be checked, evidence must be present, and untagged items fail the gate. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh]
2. Among the 340 currently planned folders, 180 already have both `implementation-summary.md` and a `COMPLETE` checklist. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. 39 planned folders have `implementation-summary.md` but no checklist at all, which likely reflects Level 1 or checklist-less packets. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. A safer precedence is: explicit frontmatter status wins; completed checklist means `complete`; `implementation-summary.md` with no checklist also means `complete`; otherwise keep `planned` (or normalize separately later). This avoids treating incomplete checklists as fully complete. [INFERENCE: from the parser order plus completion-gate counts]

## Ruled Out
- Ad-hoc checklist regexes that ignore existing Spec Kit completion semantics.

## Dead Ends
- Assuming implementation-summary presence and checklist completion always co-occur.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.76`
- Questions addressed: `FQ-1`
- Questions answered: `FQ-1`

## Reflection
- What worked and why: reusing the real completion gate gave a stronger answer than inventing a new checklist heuristic.
- What did not work and why: the phase-001 child spec alone was too narrow to answer the checklist tradeoff safely.
- What I would do differently: pull the completion script into the first status-design pass next time instead of treating it as a later refinement.

## Recommended Next Focus
Measure how much of the current `key_files` miss set falls to a narrow junk-token filter before adding a broader path-shape rule.
