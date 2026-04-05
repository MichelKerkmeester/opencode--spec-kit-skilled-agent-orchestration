# Iteration 029: Command Compaction References Audit

## Focus

Audit the live `.opencode/command/` surface for:

1. The exact `/spec_kit:resume` -> `memory_context` invocation
2. Missing `profile: "resume"` wiring
3. The real `/memory:save` execution flow
4. Double-save risk if a Stop hook already persisted context
5. Other command references to compaction, recovery, or context restoration
6. How command workflows resolve the active runtime
7. Which commands would need hook-awareness updates
8. The live command inventory across subdirectories

## Findings

1. `/spec_kit:resume` calls `memory_context` with the same four-field payload in both auto and confirm YAMLs: `input: "resume previous work continue session"`, `mode: "resume"`, `specFolder: "{...}"`, `includeContent: true`. The interactive workflow defines that payload once in `memory_loading.mcp_integration.parameters` and again in `workflow.step_3_load_memory.mcp_tool.parameters`; the autonomous workflow does the same in its `memory_loading` and `step_2_load_memory` blocks. The exact invocation is:
   `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "{spec_folder_path|detected_spec_folder}", includeContent: true })`. [.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:81-85] [.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:182-186] [.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:78-82] [.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:138-142]

2. `profile: "resume"` is missing from every executable `memory_context` parameter block in the resume workflow, even though the MCP contract explicitly supports `profile` for `memory_context` and enumerates `resume` as a valid value. In other words, the resume command is only selecting `mode: "resume"` today; it is not requesting the response formatter meant for resume-shaped output. The gaps are the four YAML parameter blocks above, while the schema and allowed-parameter lists already expose `profile`. [.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-44] [.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:100-116] [.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:453-455]

3. `/memory:save` is an inline workflow, not an asset-backed workflow. Its flow is:
   resolve `target_folder` from CLI or 3-tier auto-detection; run Phase 0 preflight checks (anchor format, duplicate session detection, token budget, folder existence, filename conflict); validate the folder and topic alignment; have the AI analyze the conversation; generate anchors; construct structured JSON; write that JSON to a temp file; run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "$TEMP_FILE"`; then report the saved path and optionally do immediate indexing/trigger editing. The command also documents immediate indexing via `spec_kit_memory_memory_save({ filePath })` and bulk retry via `memory_index_scan`. [.opencode/command/memory/save.md:7-47] [.opencode/command/memory/save.md:89-167] [.opencode/command/memory/save.md:169-320] [.opencode/command/memory/save.md:340-418] [.opencode/command/memory/save.md:490-556]

4. `/memory:save` could still double-save after a Stop hook save. The command has no Stop-hook-aware branch or "already saved by hook" guard; its protection is generic duplicate detection plus user choice. Preflight Check 2 compares the last session hash to the current conversation fingerprint and, on a recent match, asks whether to overwrite, append, create a new file, or cancel. Appendix B makes the intent explicit: session dedup exists to prevent accidental duplicates, including post-compaction saves, but it still offers paths that create or mutate another save rather than silently no-oping on hook-originated saves. This means a hook save followed by a manual `/memory:save` can still produce a second save unless the operator cancels or overwrites. [.opencode/command/memory/save.md:103-112] [.opencode/command/memory/save.md:629-645]

5. Recovery and compaction references are now centered on `/spec_kit:resume`, but they are spread across multiple command surfaces:
   the top-level command README tells users to use `/spec_kit:resume` for interrupted-session recovery; the `spec_kit` README says resume recovers from handover, resume-mode memory retrieval, and `CONTINUE_SESSION.md`; the `memory` README reroutes crash recovery to `/spec_kit:resume`; `handover.md` explicitly documents the compaction breadcrumb format (`CONTINUATION - Attempt ...`) and tells users to handover, then resume in a new session; `resume.md` itself contains a compaction-continuation safety rule; and `complete.md` lists `/spec_kit:resume` as the crash-recovery next step. [.opencode/command/README.txt:242-245] [.opencode/command/spec_kit/README.txt:228-230] [.opencode/command/memory/README.txt:150-155] [.opencode/command/memory/README.txt:308-310] [.opencode/command/spec_kit/handover.md:213-216] [.opencode/command/spec_kit/handover.md:291-297] [.opencode/command/spec_kit/resume.md:363-366] [.opencode/command/spec_kit/complete.md:486-491]

6. Command workflows do not appear to use one shared runtime-detector helper inside `.opencode/command/`; instead they use repeated runtime-path maps keyed by the active runtime/profile. `handover.md` and `debug.md` both tell the runner to resolve `[runtime_agent_path]` from Default/Copilot, Codex, Claude, or Gemini. Create-command YAMLs repeat the same mapping under `runtime_agent_path_resolution`. The deep-review auto YAML confirms the pattern: it shows a Claude default path in the file, but explicitly says the agent path should be resolved from the active runtime directory, and its review logic compares definitions across runtimes. [.opencode/command/spec_kit/handover.md:25-32] [.opencode/command/spec_kit/debug.md:29-36] [.opencode/command/create/assets/create_agent_auto.yaml:41-45] [.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:68-72] [.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:182-189]

7. The commands that would need hook-awareness updates are the ones that still assume manual memory persistence is always required:
   `/memory:save` itself; `/spec_kit:handover` (it both mandates `generate-context.js` after handover and separately recommends `/memory:save`); `/spec_kit:plan`; `/spec_kit:implement`; `/spec_kit:complete`; `/spec_kit:debug`; `/spec_kit:deep-research`; and `/spec_kit:deep-review`. Today each of those workflows still documents a manual save boundary, so a future "Stop hook already saved context" rule would need to either suppress, downgrade, or conditionalize those instructions. [.opencode/command/memory/save.md:73-75] [.opencode/command/spec_kit/handover.md:215-216] [.opencode/command/spec_kit/handover.md:256-264] [.opencode/command/spec_kit/plan.md:303-315] [.opencode/command/spec_kit/implement.md:195-201] [.opencode/command/spec_kit/complete.md:311-315] [.opencode/command/spec_kit/debug.md:304-309] [.opencode/command/spec_kit/deep-research.md:198-209] [.opencode/command/spec_kit/deep-review.md:234-245]

8. The live inventory and the documented inventory are out of sync. The docs still advertise a `phase.md` entry and inconsistent `spec_kit` totals: the top-level README says `spec_kit` has 9 commands and shows `phase.md`; the `spec_kit` README calls itself an "8-command index"; but the live filesystem currently contains 8 `spec_kit/*.md` entrypoints and no `phase.md`. From the filesystem audit, the current live inventory is 52 non-`.DS_Store` files under `.opencode/command/`, including 19 subdirectory command entrypoints (`create` 7, `memory` 4, `spec_kit` 8) and 20 total markdown command entrypoints when the root `agent_router.md` is included. [.opencode/command/README.txt:42-48] [.opencode/command/README.txt:68-97] [.opencode/command/spec_kit/README.txt:53-61] [.opencode/command/spec_kit/README.txt:82-108]

## Evidence

### Exact `/spec_kit:resume` invocation

```yaml
memory_context({
  input: "resume previous work continue session",
  mode: "resume",
  specFolder: "{spec_folder_path|detected_spec_folder}",
  includeContent: true
})
```

Source blocks:

- `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:81-85`
- `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:182-186`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:78-82`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:138-142`

### Live inventory commands run

```text
$ find '.opencode/command' -type f ! -name '.DS_Store' | wc -l
52

$ find '.opencode/command' -type f ! -name '.DS_Store' | grep -E '/(create|memory|spec_kit)/[^/]+\.md$' | wc -l
19

$ find '.opencode/command' -type f ! -name '.DS_Store' | grep -E '/(create|memory|spec_kit)/[^/]+\.md$' | sort
.opencode/command/create/agent.md
.opencode/command/create/changelog.md
.opencode/command/create/feature-catalog.md
.opencode/command/create/folder_readme.md
.opencode/command/create/prompt.md
.opencode/command/create/sk-skill.md
.opencode/command/create/testing-playbook.md
.opencode/command/memory/learn.md
.opencode/command/memory/manage.md
.opencode/command/memory/save.md
.opencode/command/memory/search.md
.opencode/command/spec_kit/complete.md
.opencode/command/spec_kit/debug.md
.opencode/command/spec_kit/deep-research.md
.opencode/command/spec_kit/deep-review.md
.opencode/command/spec_kit/handover.md
.opencode/command/spec_kit/implement.md
.opencode/command/spec_kit/plan.md
.opencode/command/spec_kit/resume.md
```

### Directory-level file counts

```text
create   21
memory    5
spec_kit 24
root      2

spec_kit/assets files: 15
create/assets files:   13
```

## New Information Ratio (0.0-1.0)

0.76

## Novelty Justification

This iteration surfaced three materially new audit points rather than only re-stating the prior resume consolidation:

1. The executable resume workflow is still missing `profile: "resume"` in all four `memory_context` parameter blocks even though the tool contract already supports it.
2. `/memory:save` has dedupe logic for post-compaction saves, but no explicit Stop-hook-aware short-circuit, so hook-driven saves can still overlap with manual saves.
3. The live command tree no longer matches the documented `spec_kit` inventory because `phase.md` is referenced in documentation but absent from the filesystem.

## Recommendations for Implementation

1. Add `profile: "resume"` to all four `memory_context` invocations in:
   `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`.

2. Make `/memory:save` hook-aware before it enters duplicate-resolution UX:
   check for a recent hook-originated save in the same spec folder and same session fingerprint, then default to no-op or "refresh index only" instead of treating it as a normal manual duplicate.

3. Add the same hook-awareness rule to the spec-kit commands that currently hardcode a manual save boundary:
   `handover`, `plan`, `implement`, `complete`, `debug`, `deep-research`, and `deep-review`.

4. Collapse save guidance to one canonical rule:
   "If hook already saved context, skip manual save unless the user explicitly wants a second artifact."

5. Fix command inventory drift in the docs:
   either restore a real `phase.md` command entrypoint or remove the stale `phase.md` / count references from `.opencode/command/README.txt` and `.opencode/command/spec_kit/README.txt`.

6. After implementation, run a full command-surface parity sweep across:
   `.opencode/command/`, `.gemini/commands/`, tests, and spec-packet references so the compacted recovery/save behavior stays consistent everywhere.
