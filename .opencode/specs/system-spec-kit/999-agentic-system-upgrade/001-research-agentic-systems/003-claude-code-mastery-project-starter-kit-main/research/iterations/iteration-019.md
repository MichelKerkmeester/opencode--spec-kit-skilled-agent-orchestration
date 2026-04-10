# Iteration 019 — Human-Readable Readiness And Verification UX

## Research question
Does the external repo's developer experience suggest that `system-spec-kit` is under-serving users on plain-language readiness/progress reporting even when the underlying validation and research machinery are stronger?

## Hypothesis
The external repo will show a softer UX layer around status, checklists, and issues. `system-spec-kit` will likely already have the underlying data, but not always an equally legible operator summary.

## Method
Compared the external repo's `progress`, checklist, and issues artifacts to the local validation, research-state, and command surfaces already available in `system-spec-kit`.

## Evidence
- The external `progress` command is designed as a narrative status checkpoint: inspect docs, tests, source, and git activity, then explain what is done, what is missing, and what to do next. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
- The external repo pairs that with plain artifacts such as `tests/CHECKLIST.md` and `tests/ISSUES_FOUND.md`, which make project state scannable to a human without requiring them to reverse-engineer tool internals. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/CHECKLIST.md:1-55] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/ISSUES_FOUND.md:1-29]
- The local repo already has stronger underlying state in validators, deep-research dashboards, JSONL traces, memory health/reporting tools, and command families, but those surfaces are distributed and more tool-centric. [SOURCE: .opencode/command/README.txt:40-49] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:231-244]
- The local deep-research workflow already maintains a dashboard and synthesis report, which means the repo has enough structured state to support more human-readable readiness projections without inventing a new storage system. [SOURCE: .opencode/agent/deep-research.md:159-213]

## Analysis
This does not look like an architectural gap so much as a packaging gap. `system-spec-kit` already knows a lot about packet state, validation health, research convergence, and memory quality. What it lacks, in places, is a friendlier operator summary that answers "where am I, what is broken, and what should happen next?" without requiring the user to understand the mechanics behind each subsystem. The external repo is much weaker under the hood, but it is often stronger at turning state into an immediately readable human checkpoint.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Rich state exists, but it is spread across validators, dashboards, memory commands, and packet artifacts.
- **External repo's approach:** Expose simple progress, checklist, and issue surfaces that summarize current reality in plain language.
- **Why the external approach might be better:** Users get faster orientation and lower anxiety because the state is easy to scan.
- **Why system-spec-kit's approach might still be correct:** The local repo's richer internals are necessary; a shallow status view alone would not be enough.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** No subsystem rewrite. Add derived readiness/progress projections on top of existing validator and packet state instead.
- **Blast radius of the change:** medium
- **Migration path:** Start with generated read-only summaries for research and validation packets, then decide whether a generalized `status` or `readiness` command is warranted.

## Conclusion
confidence: medium

finding: `system-spec-kit` should probably expose more human-readable readiness summaries, but this is a packaging improvement layered on existing state, not a fundamental architecture change.

## Adoption recommendation for system-spec-kit
- **Target file or module:** command/reporting surfaces for validation and research workflows
- **Change type:** new module
- **Blast radius:** medium
- **Prerequisites:** choose which existing sources of truth should feed a human-readable readiness report
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that the local repo entirely lacks progress surfaces; it does not. The issue is more that those surfaces are specialized and distributed rather than absent. [SOURCE: .opencode/command/README.txt:40-49]

## Follow-up questions for next iteration
Should profile-style presets play any role in how readiness is presented, or would that import the wrong model from the external starter kit?
Where is the line between helpful projection layers and yet another synchronized artifact that increases maintenance cost?
