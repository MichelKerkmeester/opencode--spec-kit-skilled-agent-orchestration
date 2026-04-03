---
title: Deep Research Strategy - Codex Skill Routing Command Discoverability
description: Runtime strategy tracking research progress on helping Codex discover spec_kit and memory commands through system-spec-kit skill routing.
---

# Deep Research Strategy - Session Tracking

<!-- ANCHOR:overview -->
## 1. Overview

### Purpose
Determine the smallest reliable repo change that helps Codex discover the right `spec_kit` and `memory` command entrypoints when `system-spec-kit` is routed by skill advisor, especially in environments where slash commands or prompt surfaces are not prominently visible.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. Topic
Analyze the `system-spec-kit` skill and determine the most concise, high-signal way for Codex to discover `spec_kit` or `memory` commands when `system-spec-kit` is selected by skill advisor, without relying on command or prompt surfaces being visible in the runtime UI.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)
- None currently. All scoped research questions are answered pending implementation.

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. Non-Goals
- Redesigning the entire command system or skill-advisor pipeline
- Reworking Codex runtime UX outside this repository
- Building a new command registry unless existing surfaces are proven insufficient
- Implementing the fix during this research session
- Expanding beyond command discoverability for `system-spec-kit`, `spec_kit`, and `memory`

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. Stop Conditions
- All 5 key questions are answered with repo-backed evidence
- A smallest-correct recommendation is identified with clear file targets
- Convergence is reached because additional iterations stop producing materially new routing or discoverability insight
- 10 iterations are reached

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. Answered Questions
- [x] Q1: Existing command surfaces already exist in `.opencode/command/spec_kit/` and `.opencode/command/memory/`; the repo is not missing the core command docs, but those docs live deeper than the default first-touch skill resource. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`]
- [x] Q2: Codex most likely sees `references/workflows/quick_reference.md` first because `system-spec-kit` always loads it, and that surface is not currently sufficient as a high-signal command index. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135`, `.opencode/skill/system-spec-kit/SKILL.md:226-233`, `.opencode/skill/system-spec-kit/SKILL.md:306-323`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]
- [x] Q3: The smallest high-signal change is a four-command first-touch shortlist, not a broad command catalog: `/spec_kit:resume`, `/spec_kit:plan`, `/memory:search`, and `/memory:save`. This covers the core recover/start/search/save branches while minimizing drift. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/search.md:1-80`, `.opencode/command/memory/save.md:1-76`]
- [x] Q4: The fix should live primarily in the always-loaded `quick_reference.md`, with at most a tiny pointer from `SKILL.md` back to that shortlist; a generated index or duplicated command matrix would add maintenance surface without improving first-touch loading. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/SKILL.md:373`, `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`]
- [x] Q5: Recommended next implementation is to insert a concise “Start Here” command shortlist immediately under `## 4. ESSENTIAL COMMANDS` in `references/workflows/quick_reference.md`, optionally add one one-line `SKILL.md` pointer to that shortlist, and validate that the shortlist contains only the four must-show commands while lower-priority commands remain in deeper docs/sections. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/skill/system-spec-kit/SKILL.md:561-561`]

---

<!-- /ANCHOR:answered-questions -->
<!-- ANCHOR:what-worked -->
## 7. What Worked
- Iteration 1: Reading the skill router plus the default quick reference clearly established the real first-touch discovery surface and exposed the placement problem. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135`, `.opencode/skill/system-spec-kit/SKILL.md:226-233`, `.opencode/skill/system-spec-kit/SKILL.md:306-323`]
- Iteration 1: Reading the concrete command docs after the quick reference made it possible to distinguish “missing docs” from “existing docs with poor surfacing.” [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`]
- Iteration 2: Comparing the early `ESSENTIAL COMMANDS` section with the command docs made the minimal shortlist obvious and exposed the exact insertion point with the least drift risk. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/command/memory/search.md:1-80`, `.opencode/command/spec_kit/resume.md:1-33`]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. What Failed
- Iteration 1: Directory existence checks alone were too weak to answer discoverability because they showed that docs exist but not which surface Codex actually sees first. [SOURCE: `.opencode/command/spec_kit:directory`, `.opencode/command/memory:directory`]
- Iteration 2: Treating currently visible quick-reference commands as the desired shortlist failed because that surface biases toward save/handover details instead of the most common first actions. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:109-166`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches (do not retry)
- Generated command index as a primary solution: BLOCKED — adds maintenance surface when the always-loaded quick reference can carry a smaller, lower-drift shortlist. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135-180`, `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions
- Do not treat the current quick reference as already sufficient command discovery; it exposes only a narrow subset of the useful `spec_kit` and `memory` commands. [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:468-527`]
- Do not propose creating brand-new command docs as the primary fix; the key docs already exist and the gap is surfacing them. [SOURCE: `.opencode/command/spec_kit/resume.md:1-33`, `.opencode/command/spec_kit/plan.md:1-40`, `.opencode/command/memory/save.md:1-76`]
- Do not surface every `spec_kit` or `memory` command in the first-touch shortlist; that would recreate noise and increase drift risk versus a focused four-command entry set. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:561-561`, `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. Next Focus
Research is near convergence. If another iteration is needed, validate exact implementation wording and insertion point only: add the four-command shortlist to `references/workflows/quick_reference.md`, plus at most a one-line pointer from `SKILL.md`.

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 12. Known Context
- `system-spec-kit` says the memory command surface is four slash commands: `/memory:save`, `/memory:manage`, `/memory:learn`, and `/memory:search`, while `/spec_kit:resume` owns session recovery through the broader memory stack [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:561-562`].
- `system-spec-kit` smart routing always loads `references/workflows/quick_reference.md` as its default resource, which makes that file the strongest low-noise candidate for Codex-first command discovery when the skill is selected [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:135`, `.opencode/skill/system-spec-kit/SKILL.md:226-233`, `.opencode/skill/system-spec-kit/SKILL.md:306-323`].
- The current quick reference heavily emphasizes spec levels, template copy commands, folder naming, and manual context save, but the visible early sections do not provide a compact command matrix for the main `spec_kit` and `memory` entrypoints [SOURCE: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:13-188`].
- Concrete command docs already exist for the memory surface under `.opencode/command/memory/` and for `spec_kit` surfaces under `.opencode/command/spec_kit/`, including `resume.md`, `plan.md`, `implement.md`, `complete.md`, `debug.md`, `deep-research.md`, `deep-review.md`, and `handover.md` [SOURCE: `.opencode/command/memory/save.md:1-87`, `.opencode/command/memory/search.md:1-139`, `.opencode/command/memory/manage.md:1-140`, `.opencode/command/memory/learn.md:1-95`, `.opencode/command/spec_kit/resume.md:1-27`].
- Historical repo work identified a prior discoverability gap where `system-spec-kit` referenced `/memory:save` before a corresponding command document existed, which suggests command-surface drift is a recurring failure mode and any fix should minimize duplicated command lists [SOURCE: `specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/064-bug-analysis-and-fix/tasks.md:350-379`].
- Codex CLI has strong native capabilities like MCP access and session resume/fork, but that does not guarantee repo-local slash commands are discoverable in its UI, so a text-first in-repo routing surface is likely more reliable than assuming command menus are visible [SOURCE: `.opencode/skill/cli-codex/references/codex_tools.md:119-205`].

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Current generation: 1
- Started: 2026-04-03T09:01:36Z
<!-- /ANCHOR:research-boundaries -->
