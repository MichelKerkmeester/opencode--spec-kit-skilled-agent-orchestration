# Spec Kit And Memory Command Release Alignment Map

This phase document maps the current `spec_kit` and `memory` command surfaces that are available across the repo and identifies which paths are the most likely post-026 review targets.

It is the command-surface companion to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/001-sk-system-speckit/reference-map.md`.

## Scope and Method

- Analysis window: 2026-04-01 through 2026-04-10.
- Evidence base:
  - Git history for `.opencode/command/`, `.agents/commands/`, `.opencode/agent/`, root guidance files, and repo-level docs.
  - Live command files under `.opencode/command/spec_kit` and `.opencode/command/memory`.
  - Live wrapper surfaces under `.agents/commands/`.
  - Repo-wide command references found via `/spec_kit:` and `/memory:` searches.
- Current live counts:
  - markdown command files under `.opencode/command/spec_kit/`: **8**
  - YAML workflow assets under `.opencode/command/spec_kit/assets/`: **15**
  - markdown command files under `.opencode/command/memory/`: **4**
  - wrapper TOMLs under `.agents/commands/spec_kit/`: **7**
  - wrapper TOMLs under `.agents/commands/memory/`: **4**

## 026 Command-Relevant Work Summary

| Workstream | Evidence | Why it matters for command docs |
| --- | --- | --- |
| Memory save contract compaction | `7f0c057` `feat(026-memory-redundancy)` | `/memory:save` and any workflow that points at memory preservation need current contract wording. |
| Memory save heuristic calibration and post-save review | `eb1f49c` `feat(026-003-009)` and `03d26e2` `feat(026-003-010)` | Save flow, lineage handling, trigger sanitization, and review expectations changed. |
| Graph-first routing and FTS/runtime remediation | `8fa97d8` `fix(026)` and `33823d0` `feat(026-graph-context)` | `/memory:search`, `/spec_kit:resume`, and guidance files that route to search/recovery may drift. |
| Resume/bootstrap hardening | `11e584e` `fix(spec-kit): v3.2.0.1` | `/spec_kit:resume` entrypoints and wrapper assets need parity with current recovery behavior. |
| Context-prime deprecation and orchestration cleanup | `c01db61` `fix(026)` | Command-adjacent agent and guidance surfaces should no longer imply the deprecated context-prime route. |

## Priority Legend

- `HIGH`: Authoritative command definitions or high-traffic command catalogs.
- `MEDIUM`: Mirrors, wrappers, or guidance docs that route users into those commands.
- `LOW`: Historical or indirect surfaces not worth release-alignment churn unless explicitly requested.

## Priority Review Map

### 1. Authoritative Spec Kit Command Docs

- `HIGH` `.opencode/command/spec_kit/README.txt`
  Why: canonical 8-command index; its workflow progression and command inventory must reflect current reality.
- `HIGH` `.opencode/command/spec_kit/resume.md`
  Why: resume/recovery behavior sits directly on the 026 graph/context and bootstrap changes.
- `HIGH` `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
  Why: auto-mode resume flow is part of the live recovery contract.
- `HIGH` `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`
  Why: confirm-mode resume flow is part of the live recovery contract.
- `MEDIUM` `.opencode/command/spec_kit/plan.md`
  Why: plan routes into `/memory:search`, `:with-phases`, and follow-on implementation guidance.
- `MEDIUM` `.opencode/command/spec_kit/implement.md`
  Why: implement references planning gates, `/memory:search`, `/spec_kit:handover`, and debug routing.
- `MEDIUM` `.opencode/command/spec_kit/complete.md`
  Why: complete bundles search, research, implementation, handover, and phase decomposition guidance.
- `MEDIUM` `.opencode/command/spec_kit/deep-research.md`
  Why: deep-research routes to `/memory:save`, `/spec_kit:plan`, and `/spec_kit:deep-review`.
- `MEDIUM` `.opencode/command/spec_kit/deep-review.md`
  Why: deep-review closeout and remediation guidance should align with current review and save flows.
- `MEDIUM` `.opencode/command/spec_kit/debug.md`
  Why: debug escalation should stay aligned with the current agent and recovery model.
- `MEDIUM` `.opencode/command/spec_kit/handover.md`
  Why: handover is a core session-continuation surface adjacent to resume/save behavior.
- `MEDIUM` `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`
  Why: contains explicit `/memory:search` and `/memory:save` references in the confirm workflow.
- `MEDIUM` `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`
  Why: contains explicit `/memory:search` and `/spec_kit:handover` references.
- `MEDIUM` `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
  Why: complete mode orchestrates the highest number of downstream command transitions.
- `MEDIUM` `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`
  Why: same as auto, but with gated interaction text that can drift.

### 2. Authoritative Memory Command Docs

- `HIGH` `.opencode/command/memory/README.txt`
  Why: canonical 4-command index; should match current save/search/manage/learn behavior and the `/spec_kit:resume` split.
- `HIGH` `.opencode/command/memory/save.md`
  Why: the most directly impacted command from the 026 memory-quality and compact-save work.
- `HIGH` `.opencode/command/memory/search.md`
  Why: search, causal, ablation, and analysis behavior sit close to graph-first routing and FTS changes.
- `MEDIUM` `.opencode/command/memory/manage.md`
  Why: manage covers health, scan, ingest, and shared-memory lifecycle; some wording may need parity with current runtime.
- `MEDIUM` `.opencode/command/memory/learn.md`
  Why: learn is less central to 026, but remains a top-level command surface exposed repo-wide.

### 3. Repo-Wide Command Catalogs and Guidance

- `HIGH` `.opencode/README.md`
  Why: public command overview currently lists the `spec_kit` and `memory` families and is a major discovery surface.
- `MEDIUM` `README.md`
  Why: root repo onboarding and command mentions should stay aligned with current entrypoints.
- `HIGH` `AGENTS.md`
  Why: top-level operator contract embeds `/spec_kit:*` and `/memory:*` workflows throughout its quick reference and gate rules.
- `HIGH` `CLAUDE.md`
  Why: runtime guidance mirrors many of the same command contracts and should not drift.
- `MEDIUM` `.opencode/install_guides/README.md`
  Why: installation/onboarding docs list available commands and first-step workflows.
- `MEDIUM` `.opencode/install_guides/SET-UP - AGENTS.md`
  Why: setup guidance includes command catalogs, examples, and decision tables for both command families.

### 4. Agent Surfaces That Route Into Commands

- `HIGH` `.opencode/agent/context.md`
  Why: context loading, memory lookup, and graph-health guidance are downstream of 026 routing changes.
- `HIGH` `.opencode/agent/orchestrate.md`
  Why: orchestrate explicitly recommends `/memory:save`, `/spec_kit:debug`, `/spec_kit:handover`, and `/spec_kit:complete`.
- `MEDIUM` `.opencode/agent/handover.md`
  Why: tied directly to `/spec_kit:handover`.
- `MEDIUM` `.opencode/agent/deep-research.md`
  Why: dispatched by `/spec_kit:deep-research`.
- `MEDIUM` `.opencode/agent/deep-review.md`
  Why: dispatched by `/spec_kit:deep-review`.
- `LOW` historical context-prime agent surface
  Why: 026 history shows deprecation pressure here; treat it as superseded context, not a current live path to edit.

### 5. Wrapper and Alternate Runtime Surfaces

- `MEDIUM` `.agents/commands/spec_kit/plan.toml`
- `MEDIUM` `.agents/commands/spec_kit/implement.toml`
- `MEDIUM` `.agents/commands/spec_kit/complete.toml`
- `MEDIUM` `.agents/commands/spec_kit/deep-research.toml`
- `MEDIUM` `.agents/commands/spec_kit/deep-review.toml`
- `MEDIUM` `.agents/commands/spec_kit/debug.toml`
- `MEDIUM` `.agents/commands/spec_kit/handover.toml`
- `MEDIUM` `.agents/commands/spec_kit/resume.toml`
  Why: these are alternate command-entry wrappers and must stay aligned with the authoritative files in `.opencode/command/spec_kit/`.
- `MEDIUM` `.agents/commands/memory/search.toml`
- `MEDIUM` `.agents/commands/memory/save.toml`
- `MEDIUM` `.agents/commands/memory/manage.toml`
- `MEDIUM` `.agents/commands/memory/learn.toml`
  Why: these are alternate command-entry wrappers and must stay aligned with the authoritative files in `.opencode/command/memory/`.

## Suggested Review Order

1. `.opencode/command/memory/save.md`
2. `.opencode/command/memory/search.md`
3. `.opencode/command/spec_kit/resume.md`
4. `.opencode/command/spec_kit/README.txt`
5. `.opencode/command/memory/README.txt`
6. `.opencode/README.md`
7. `AGENTS.md` and `CLAUDE.md`
8. `.opencode/agent/context.md` and `.opencode/agent/orchestrate.md`
9. `.agents/commands/spec_kit/` and `.agents/commands/memory/`

## Release-Alignment Notes

- The highest-risk drift areas are:
  - save contract wording,
  - search/routing wording,
  - resume/bootstrap wording,
  - command-count and command-family catalogs.
- This phase intentionally focuses on current live command entrypoints and mirrors.
- Historical prompt-wrapper surfaces appeared in older history but are not part of the current live repo surface, so they are excluded from the current-state map.

## Canonical Outcome

This file is now the canonical release-alignment reference map for `016-release-alignment/002-cmd-memory-and-speckit`.
