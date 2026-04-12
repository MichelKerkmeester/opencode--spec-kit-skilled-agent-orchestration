# Iteration 015 — Command Surface and Gate UX Simplification

## Research question
Does Ralph's developer experience suggest that `system-spec-kit`'s command and gate surface asks operators to do too much meta-navigation before useful work starts?

## Hypothesis
`system-spec-kit`'s safety model is stronger than Ralph's, but its operator UX likely exposes too many branches and auxiliary commands for common cases.

## Method
Compared Ralph's README workflow and single runtime entrypoint with `system-spec-kit`'s quick-reference command map, resume workflow, and memory command surfaces.

## Evidence
- Ralph's user-facing workflow is short: create PRD, convert it to `prd.json`, run one script, inspect `prd.json` and `progress.txt` if needed. [SOURCE: external/README.md:90-130] [SOURCE: external/README.md:209-221]
- `system-spec-kit`'s quick reference exposes eight `spec_kit:*` commands plus four `memory:*` commands, plus manual template copy commands and a pre-implementation checklist. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:56-105] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-187] [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:191-210]
- `/spec_kit:resume` alone contains a large consolidated setup phase with auto-detection, phase-child selection, continuation validation, artifact checks, and memory-choice routing before the main workflow begins. [SOURCE: .opencode/command/spec_kit/resume.md:37-141]
- The memory surface is powerful but sprawling: `/memory:search` multiplexes retrieval and analysis modes, while `/memory:manage` multiplexes scan, cleanup, tiering, checkpoints, ingest, and shared-memory lifecycle. [SOURCE: .opencode/command/memory/search.md:53-100] [SOURCE: .opencode/command/memory/search.md:113-140] [SOURCE: .opencode/command/memory/manage.md:48-99] [SOURCE: .opencode/command/memory/manage.md:113-140]

## Analysis
The problem is not that the repo has too much capability. It is that operators are exposed to too much of that capability up front. Ralph proves the value of one obvious path: the user can see the next move without first learning the whole system. `system-spec-kit` has already moved in that direction by preferring `/spec_kit:resume` for recovery, but the surrounding docs and command taxonomy still surface a large decision tree. The UX lesson is progressive disclosure: keep the safety model, keep the advanced surfaces, but make the default path much narrower and more obvious.

## Conclusion
confidence: medium

finding: `system-spec-kit` should SIMPLIFY its operator UX by presenting one recommended entrypoint per lifecycle phase and hiding advanced memory/management branches behind "only when needed" guidance.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** agree on the primary entrypoint for resume, research, plan, implement, and maintenance
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Rich command taxonomy plus gate-driven setup prompts expose many branches before work starts. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-187] [SOURCE: .opencode/command/spec_kit/resume.md:37-141]
- **External repo's approach:** One visible runtime path and a small set of supporting files keep operator choice simple. [SOURCE: external/README.md:90-130]
- **Why the external approach might be better:** It lowers onboarding and reduces the chance that the user is forced to think about management surfaces before they have even resumed the actual task. [SOURCE: external/README.md:122-130]
- **Why system-spec-kit's approach might still be correct:** The repo genuinely needs powerful recovery, analysis, and lifecycle management surfaces that Ralph does not attempt to provide. [SOURCE: .opencode/command/memory/search.md:75-100] [SOURCE: .opencode/command/memory/manage.md:48-61]
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Reframe docs and command help around a small "default path" map: `/spec_kit:resume`, `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:deep-research`, `/spec_kit:deep-review`, with memory commands presented as advanced or maintenance-only unless a workflow explicitly needs them.
- **Blast radius of the change:** medium
- **Migration path:** Update quick-reference and command intros first, then trim duplicated branching text from individual command docs.

## Counter-evidence sought
I looked for a single concise operator map that clearly demotes advanced memory/admin surfaces for normal flows and did not find one; the current quick reference still presents most capabilities at the same level. [SOURCE: .opencode/skill/system-spec-kit/references/workflows/quick_reference.md:116-187]

## Follow-up questions for next iteration
- Can Ralph's gitignored working-file pattern give `system-spec-kit` a lightweight operator-facing bridge without weakening archival memory?
- Which parts of Ralph's minimal runtime are safe to adopt as overlays, and which would be regressions?
- Is the "one context window" lesson actually stable across different tool runtimes?
