---
title: "Research: Codex Command Discoverability via system-spec-kit [03--commands-and-skills/039-cmd-spec-kit-codex-skill-routing/research]"
description: "Research into the smallest, highest-signal way to help Codex discover spec_kit and memory commands when system-spec-kit is selected by skill advisor."
trigger_phrases:
  - "codex"
  - "system-spec-kit"
  - "skill advisor"
  - "command discoverability"
  - "quick reference"
  - "memory commands"
importance_tier: "normal"
contextType: "research"
---
# Research: Codex Command Discoverability via system-spec-kit

## 1. Executive Summary

This research examined how Codex can most reliably discover `spec_kit` and `memory` commands after `system-spec-kit` is selected by skill advisor, especially in runtimes where command or prompt surfaces are not prominent. Across two iterations, the result converged quickly: the repository already has the needed command docs, but the main discoverability surface Codex sees first is the always-loaded `references/workflows/quick_reference.md`, and that surface currently spends its prime space on levels, templates, shell snippets, and save/handover details instead of a compact command shortlist.

The smallest-correct recommendation is to add a four-command "Start Here" shortlist near the top of `quick_reference.md` and keep the deeper command docs as the canonical detail source. The four commands are:
- `/spec_kit:resume`
- `/spec_kit:plan`
- `/memory:search`
- `/memory:save`

An optional one-line pointer in `SKILL.md` back to the shortlist is acceptable, but duplicating a full command matrix in multiple places is not.

Decision update after research: the user explicitly overrode the minimal shortlist recommendation with, "add all commands though in short list." That means the chosen implementation direction is now broader than the research recommendation. The research finding still stands as the minimal recommendation, but the downstream docs change should now reflect an expanded all-commands short list in the quick reference while keeping `.opencode/skill/system-spec-kit/SKILL.md` as a pointer only.

---

## 2. Research Context

**Topic:** Determine the most concise, high-signal way for Codex to discover `spec_kit` or `memory` commands when `system-spec-kit` is selected by skill advisor.

**Scope:** Research only. No implementation changes were made to the target runtime surfaces in this session.

**Why this matters:** Codex may not reliably surface repository-local slash commands or prompt menus in the UI, so command discoverability must work through the text surfaces the skill router already loads. [SOURCE: `.opencode/skill/cli-codex/references/codex_tools.md:119-205`]

---

## 3. Key Questions & Answers

### Q1. What command surfaces already exist?

The repository already contains the core command surfaces under `.opencode/command/spec_kit/` and `.opencode/command/memory/`. This is not primarily a missing-docs problem. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`, `.opencode/command/memory/search.md:1-80`]

### Q2. What surface does Codex most likely see first?

The first-touch surface is `references/workflows/quick_reference.md` because `system-spec-kit` sets it as the default resource and loads ALWAYS resources before intent-specific docs. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135`, `.opencode/skill/system-spec-kit/SKILL.md:226-233`, `.opencode/skill/system-spec-kit/SKILL.md:306-323`]

### Q3. What is the smallest high-signal change?

The smallest high-signal change is a narrow four-command shortlist, not a generated index or broad command catalog. The four commands cover the main user branches with the least duplication risk:
- `/spec_kit:resume` for recovering/resuming work
- `/spec_kit:plan` for starting planning or spec workflow
- `/memory:search` for retrieving prior context and analysis
- `/memory:save` for preserving session context

[SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/search.md:1-80`, `.opencode/command/memory/save.md:1-76`]

### Q4. Where should the fix live?

The primary fix should live in `references/workflows/quick_reference.md` because that file is already the always-loaded first-touch surface. `SKILL.md` may include a tiny pointer back to that shortlist, but should not duplicate another full command matrix. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/SKILL.md:373`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`]

### Q5. What exact recommendation should be implemented next?

Insert a concise "Start Here" command shortlist immediately under `## 4. ESSENTIAL COMMANDS` in `references/workflows/quick_reference.md`. Keep exactly the four must-show commands in that block. Optionally add a one-line note in `SKILL.md` pointing readers to the shortlist. Do not create new command docs, do not generate a new registry, and do not promote lower-priority commands into the first-touch set. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/SKILL.md:561-562`]

### Q6. What changed after the user decision override?

The implementation direction changed, not the research conclusion. The packet should keep the four-command shortlist as the minimal recommendation, but the approved downstream docs change now uses an expanded all-commands short list covering these commands:

- `/spec_kit:resume`
- `/spec_kit:plan`
- `/spec_kit:implement`
- `/spec_kit:complete`
- `/spec_kit:debug`
- `/spec_kit:handover`
- `/spec_kit:deep-research`
- `/spec_kit:deep-review`
- `/memory:save`
- `/memory:search`
- `/memory:manage`
- `/memory:learn`

The quick reference remains the primary surface, and `.opencode/skill/system-spec-kit/SKILL.md` should only point to it rather than duplicate the matrix in full.

---

## 4. Findings

1. The default loading path matters more than command doc existence for Codex discoverability. The core problem is visibility order. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135`, `.opencode/skill/system-spec-kit/SKILL.md:226-233`, `.opencode/skill/system-spec-kit/SKILL.md:306-323`]
2. The current quick reference does not act like a first-step routing map. Its early sections emphasize progressive documentation mechanics rather than the highest-value command entrypoints. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:13-188`]
3. The current quick reference over-represents lower-priority items for a first-touch user, such as save mechanics, handover, and phase shortcuts, compared with `resume`, `plan`, and `search`. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]
4. Historical repo work already exposed command-surface drift around `/memory:save`, so any solution that duplicates command inventories broadly is likely to regress over time. [SOURCE: `specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`]

---

## 5. Recommended Implementation

### Required change

Update `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`:
- Add a compact short-list block immediately under `## 4. ESSENTIAL COMMANDS`
- Preserve the research note that the minimal recommendation was four commands
- Implement the approved expanded surface as a grouped 12-command short list
- Give each command a one-line why/when description

### Optional change

Update `.opencode/skill/system-spec-kit/SKILL.md`:
- Add a brief pointer that the quick reference contains the first-touch command shortlist
- Do not restate the 12-command matrix in full

### Proposed shortlist

#### Minimal recommendation from research

| Command | Why it belongs first |
|---------|----------------------|
| `/spec_kit:resume` | Recover or continue existing spec-folder work |
| `/spec_kit:plan` | Start or refine a planned workflow/spec packet |
| `/memory:search` | Retrieve prior context, decisions, or analysis |
| `/memory:save` | Preserve session context for future recovery |

#### Approved expanded implementation direction

| Command | Why it belongs in the short list |
|---------|----------------------------------|
| `/spec_kit:resume` | Resume or recover spec-folder work |
| `/spec_kit:plan` | Start planning and level selection work |
| `/spec_kit:implement` | Move from plan into execution workflow |
| `/spec_kit:complete` | Drive completion and verification workflow |
| `/spec_kit:debug` | Route stuck work into debug delegation |
| `/spec_kit:handover` | Preserve continuation context for the next session |
| `/spec_kit:deep-research` | Start the autonomous research loop |
| `/spec_kit:deep-review` | Start the autonomous review loop |
| `/memory:save` | Save session context for later recovery |
| `/memory:search` | Retrieve prior context, decisions, and analysis |
| `/memory:manage` | Handle memory operations and maintenance |
| `/memory:learn` | Manage constitutional memory deliberately |

---

## 6. Ruled Out Directions

- Creating brand-new command docs as the primary fix. The docs already exist. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`]
- Building a generated command index as the primary solution. The existing always-loaded quick reference is a lower-drift surface. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`]
- Promoting every `memory` or `spec_kit` command into the first-touch set. That recreates noise and drift risk. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:561-612`]
- Treating `/spec_kit:handover` as a first-touch command. It is end-of-session oriented rather than initial navigation. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:499-513`]

---

## 7. Open Questions

- Whether the optional `SKILL.md` pointer is worth adding immediately, or whether a `quick_reference.md` change alone already provides enough improvement.
- Exact wording of the four-command shortlist so it remains concise without becoming too abstract.

---

## 8. Methodology

- Read the YAML workflow and deep-research skill contract.
- Initialized a fresh research packet in the selected spec folder.
- Compared the `system-spec-kit` loading order against the quick reference and command docs.
- Used two deep-research LEAF iterations to answer discovery-surface, shortlist, and placement questions.
- Stopped when all scoped research questions were answered.

---

## 9. Sources

- `.opencode/skill/system-spec-kit/SKILL.md:135`
- `.opencode/skill/system-spec-kit/SKILL.md:226-233`
- `.opencode/skill/system-spec-kit/SKILL.md:306-323`
- `.opencode/skill/system-spec-kit/SKILL.md:373`
- `.opencode/skill/system-spec-kit/SKILL.md:561-612`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:13-188`
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`
- `.opencode/command/spec_kit/resume.md:1-33`
- `.opencode/command/spec_kit/plan.md:1-40`
- `.opencode/command/memory/search.md:1-80`
- `.opencode/command/memory/save.md:1-76`
- `specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`
- `.opencode/skill/cli-codex/references/codex_tools.md:119-205`

---

## 10. Convergence Report

- Stop reason: all_questions_answered
- Total iterations: 2
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: first-touch discovery surfaces (0.75), run 2: minimal first-touch shortlist (0.88)
- Convergence threshold: 0.05
- Quality guard note: evidence came from the skill router, quick reference, concrete command docs, and historical drift evidence; no single weak source dominated the recommendation.
