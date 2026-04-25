# Strategy - 012-skill-advisor-setup-command Implementation Review

## Review Charter

### Goal
Audit the implementation of the new `/spec_kit:skill-advisor` slash command, its two YAML workflow assets, the user-facing install guide, the parent README updates, and the spec folder packet docs (012-skill-advisor-setup-command/) for correctness, security, traceability, and maintainability before this work merges.

### Non-Goals
- Re-evaluating whether the command was the right idea (planning-quality review).
- Editing or "fixing" the implementation files in-place.
- Re-running the advisor test suite from scratch (that is a runtime check, not a review concern).
- Auditing sibling 008-skill-advisor child packets (001-011) except where 012 docs explicitly cross-reference them.

### Stop Conditions
- A correctness or security regression is proven with file:line evidence (P0).
- Packet evidence cannot be reconciled because a cited artifact is missing on disk.
- 7 focused review iterations complete with `newFindingsRatio` below the convergence threshold (0.10).
- Three consecutive iterations produce zero new findings (stuck recovery).

### Success Criteria
- Every recorded finding cites file:line and includes a concrete remediation path.
- All four review dimensions (correctness, security, traceability, maintainability) get at least one full pass.
- The final report leaves a clear P0/P1/P2 backlog with recommended actions.

## Scope

### Files to audit (in-folder packet docs)
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `graph-metadata.json`
- `description.json`

### Files to audit (out-of-folder implementation)
- `.opencode/command/spec_kit/skill-advisor.md` (command markdown)
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml` (autonomous workflow)
- `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml` (interactive workflow)
- `.opencode/command/spec_kit/README.txt` (commands index update)
- `.opencode/install_guides/SET-UP - Skill Advisor.md` (user-facing setup guide)
- `.opencode/README.md` (Section 5 commands list + Current Counts table)
- `.opencode/skill/system-spec-kit/mcp_server/README.md` (Section 3.1.14 SKILL ADVISOR addendum)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/{context-index.md, spec.md, tasks.md}` (parent doc updates)

### Sources of evidence
- The packet docs in canonical read order: spec → plan → tasks → checklist → implementation-summary
- The implementation files listed above
- The strict spec-folder validator: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder> --strict`
- sk-doc's `extract_structure.py` for command markdown DQI baseline (already 94/100 Excellent)
- Existing `/spec_kit:resume`, `/spec_kit:plan`, `/spec_kit:deep-review` command markdown for cross-command convention parity
- The skill-advisor source files referenced by the new command's mutation boundaries: `lib/scorer/lanes/{explicit,lexical}.ts`, `lib/scorer/weights-config.ts`, per-skill `graph-metadata.json`
- sk-doc command_template.md (assets/agents/command_template.md) for Mode-Based template compliance

## Initial Hypotheses

1. **Correctness — mutation boundaries**: The YAML's `mutation_boundaries.allowed_targets` may not be enforced at runtime; if Phase 3 dispatches code that ignores the list, it could write to forbidden paths.
2. **Correctness — dry-run path**: Phase 3's `dry_run=TRUE` branch may not skip the full apply chain consistently; rebuild step may still run when no changes were applied.
3. **Correctness — token collision detection**: Phase 2's collision check claims to cross-reference proposed tokens against existing TOKEN_BOOSTS for OTHER skills, but the implementation is described in YAML, not in code that actually executes.
4. **Security — copilot prompt injection**: The cli-copilot dispatch puts user-provided spec docs into a prompt; if those docs contain injection-style strings, the command could be hijacked.
5. **Security — rollback hint**: The rollback command in failure paths does `git checkout HEAD -- <paths>`, which depends on a clean working tree; if there are unrelated WIP changes in the same paths they'd be lost without warning.
6. **Traceability — implementation-summary references**: The summary references several `.opencode/specs/.../012-skill-advisor-setup-command/<file>.md` paths; verify all listed paths actually resolve.
7. **Traceability — graph-metadata vs description.json packet identity**: Both files must have identical packet_id/spec_folder strings; any drift breaks memory routing.
8. **Traceability — parent docs sync**: Parent context-index.md, spec.md, and tasks.md were updated to add the 012 row; verify counts and entry text match the actual packet state.
9. **Maintainability — sk-doc command template compliance**: Command markdown should follow sk-doc Section 11 Mode-Based template; verify GATE 3 EXEMPT block, USER INPUT, KEY BEHAVIORS sections are present and consistently structured.
10. **Maintainability — duplicated content between command and install guide**: After the install guide refactor (455 → 144 lines), verify no critical content was orphaned only in the install guide.
11. **Maintainability — HVR compliance**: Check command markdown, install guide, and implementation-summary for banned HVR words (leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable).
12. **Maintainability — README counts**: `.opencode/README.md` was updated to commands=23 (10 spec_kit), YAML=31; verify these counts match `ls`/`find` reality.

## Iteration Plan

| Iter | Focus | Files |
|------|-------|-------|
| 1 | Correctness — command markdown + setup phase | skill-advisor.md, sample resume.md/plan.md/deep-review.md for parity |
| 2 | Correctness — auto YAML workflow + mutation boundaries | spec_kit_skill-advisor_auto.yaml |
| 3 | Correctness — confirm YAML approval gates + per-skill loop | spec_kit_skill-advisor_confirm.yaml |
| 4 | Security — prompt injection, rollback safety, secret leakage | both YAMLs, install guide, command markdown |
| 5 | Traceability — packet identity, cross-refs, parent doc sync | spec.md, plan.md, tasks.md, implementation-summary.md, graph-metadata.json, description.json, parent docs |
| 6 | Maintainability — sk-doc template compliance, HVR, install guide refactor | skill-advisor.md, install guide, sk-doc command_template.md |
| 7 | Final convergence pass — open items, P0 closure, P1 backlog hygiene | all files |

## Known Context

- Strict spec-folder validation already passes 0 errors / 0 warnings at packet creation time.
- Command markdown DQI: 94/100 Excellent (sk-doc), 0 HVR violations.
- Install guide DQI: 99/100 Excellent (sk-doc), 0 HVR violations.
- Both YAMLs parse cleanly via `python3 -c "import yaml; yaml.safe_load(...)"`.
- Command is registered at runtime (visible in skill list as `spec_kit:skill-advisor`).
- All 12 in-packet tasks marked [x]; all 5 P0 + 7 P1 + 2 P2 checklist items have inline evidence markers.
- Nested changelog generated: `008-skill-advisor/changelog/changelog-008-012-skill-advisor-setup-command.md`.
- Continuity refreshed via `generate-context.js`, 6 files indexed.

## Dispatch Notes

- Executor: cli-copilot, model gpt-5.5, reasoningEffort high, no service-tier (copilot CLI does not support it).
- Concurrency: sequential within this packet (each iteration depends on prior).
- Per-iteration prompt at `review/prompts/iteration-NNN.md`.
- Per-iteration findings at `review/iterations/iteration-NNN.md`.
- Per-iteration delta JSON at `review/deltas/iteration-NNN.json`.
- State log appended to `review/deep-review-state.jsonl`.
- Final report: `review/review-report.md`.
- Resource map: `review/resource-map.md`.
