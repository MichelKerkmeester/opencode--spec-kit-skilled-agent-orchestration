# Iteration 014 Review

Scope: documentation rewrite phases `016-rewrite-memory-mcp-readme`, `017-update-install-guide`, `018-rewrite-system-speckit-readme`, and `019-rewrite-repo-readme`

Dimensions: `D7 Documentation Quality` + `D3 Spec-Alignment`

## Findings

### P1-001 [P1] The delivered root `README.md` does not satisfy Phase 019's own agent-inventory acceptance criteria: `@deep-review` is missing and the agent counts are now stale

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/spec.md:84-107`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/implementation-summary.md:27-29,61-68`
  - `README.md:48-60`
  - `README.md:307-334`
  - `README.md:752-753`
  - `README.md:820`
  - `.opencode/agent/` (directory listing)
  - `.claude/agents/` (directory listing)
- Evidence: Phase 019 requires that "Every agent definition appears with name, role, and capabilities summary" and its implementation summary says that all 11 agents were listed.
- Evidence: The shipped root README still claims "11 agents total" and "All 11 Agents," but the table at `README.md:315-325` lists only `@general`, `@explore`, `@orchestrate`, `@context`, `@speckit`, `@debug`, `@deep-research`, `@review`, `@write`, `@handover`, and `@ultra-think`. The source-of-truth agent directories also contain `deep-review.md`, which is omitted.
- Evidence: The same README says the runtime adapter directories contain "9 adapter files," but `.claude/agents/` now includes `deep-review.md` alongside the other custom-agent adapters.
- Risk: The repo's top-level entry point is now inaccurate on one of its core inventory promises. Reviewers and users relying on the README for routing will not discover `@deep-review`, and the phase packet's "PASS" claim for RR-002 is not supportable.
- Recommendation: Update Phase 019's deliverable and companion docs together: add `@deep-review` to the agent inventory, recompute total/custom/adapter counts from live directories, and re-verify RR-002 before treating this rewrite as release-ready.

### P1-002 [P1] All four rewrite packets claim `Complete`, but every `tasks.md` still shows `0/N tasks complete` with all completion criteria unchecked

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/spec.md:24-32`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/tasks.md:57-95`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/implementation-summary.md:60-68`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-update-install-guide/spec.md:24-32`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-update-install-guide/tasks.md:51-87`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-update-install-guide/implementation-summary.md:60-68`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/spec.md:24-32`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/tasks.md:56-95`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/implementation-summary.md:60-68`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/spec.md:24-32`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/tasks.md:60-101`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-rewrite-repo-readme/implementation-summary.md:60-68`
- Evidence: Each `spec.md` metadata block says `Status | Complete`, and each implementation summary records PASS verification rows.
- Evidence: Each corresponding `tasks.md` retains unchecked verification/completion rows plus a frozen footer that still reads `0/22`, `0/15`, `0/22`, and `0/27 tasks complete — In Progress`.
- Risk: These phase packets are not trustworthy as release evidence. A release reviewer cannot tell whether the work was actually executed and verified, or whether only the summary prose was updated after the fact.
- Recommendation: Either bring the task trackers up to date with completed checkmarks and explicit evidence, or stop marking these packets `Complete`. Right now the packets present mutually exclusive execution states.

### P1-003 [P1] Phase 018's companion docs still validate the Spec Kit README against a 13-command inventory, while the deliverable and live command directories now reflect 14 commands

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/spec.md:42-46,87-99`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/tasks.md:30-32,45-47,59-61`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/implementation-summary.md:27-29,63-68`
  - `.opencode/skill/system-spec-kit/README.md:47-57`
  - `.opencode/command/spec_kit/` (directory listing)
  - `.opencode/command/memory/` (directory listing)
- Evidence: The Phase 018 spec says the old surface was a "14-command suite (8 spec_kit + 5 memory)," which already sums incorrectly, and SR-006 defines completeness as "All 8 spec_kit commands and 5 memory commands listed."
- Evidence: The task plan continues that stale inventory in three places: `T003` says "List all 13 commands," `T011` says "all 13 commands," and `T018` says "Verify all 13 commands present."
- Evidence: The delivered Spec Kit README advertises `Commands | 14 | 8 spec_kit + 6 memory`, and the live command directories match that 8+6 split.
- Risk: Phase 018's verification packet can mark the rewrite complete even if one current memory command is missing, because the packet's own acceptance logic is still based on the pre-rewrite 13-command inventory.
- Recommendation: Normalize the spec, tasks, and plan to the current command surface before using this phase as release evidence. The supporting packet should verify the same inventory the shipped README actually documents.

### P2-001 [P2] Phase 016 still contains stale 32-tool language even though the packet's own success criteria, implementation summary, and shipped README all use 33

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/spec.md:42-47,58-60,85-99,105-107`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/tasks.md:30,45,61,73-76`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/implementation-summary.md:27-29,63-68`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md:44-46,52-55`
- Evidence: The packet's problem statement, purpose, scope table, blocker requirement MR-001, task list, and completion criteria all still say `32` tools.
- Evidence: The same `spec.md` switches to `33` in `SC-001`, the implementation summary says "All 33 tools documented | PASS," and the shipped README says the server exposes 33 MCP tools.
- Risk: This is not blocking by itself because the deliverable appears to use the newer 33-tool framing, but it leaves the packet internally contradictory and weakens confidence in the rewrite's verification trace.
- Recommendation: Sweep Phase 016's companion docs and standardize every inventory reference to the same tool count used by the deliverable and implementation summary.

### P2-002 [P2] The rewritten root README still carries stale/inconsistent runtime references for memory totals and storage paths

- Files:
  - `README.md:58-60`
  - `README.md:298-300`
  - `README.md:820`
  - `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:104-112`
- Evidence: The root README's key-stats table says the framework now has `40` MCP tools (`33 memory + 7 code mode`), but the footer still says `Framework: 11 agents, 18 skills, 22 commands, 33 MCP tools`.
- Evidence: The same README says the default memory database lives under `.opencode/skill/system-spec-kit/shared/mcp_server/database/...`, while the rewritten install guide explicitly calls `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` the canonical runtime database and `mcp_server/database/...` the compatibility view.
- Risk: These stale cross-document references reintroduce the pre-rewrite ambiguity that the README refresh was supposed to remove. Operators can come away with conflicting totals and conflicting storage-path guidance depending on which section they read.
- Recommendation: Reconcile the root README against the install guide and current runtime conventions: use one authoritative MCP-tool total and one authoritative database-path story everywhere.

## Sweep Notes

| Check | Result | Notes |
|---|---|---|
| Required companion docs present? | Yes | All four Level 1 phase folders contain `description.json`, `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, plus `memory/` and `scratch/`. |
| Do the rewritten docs exist at target locations? | Yes | Verified presence of `mcp_server/README.md`, `mcp_server/INSTALL_GUIDE.md`, `system-spec-kit/README.md`, and repo-root `README.md`, plus all four `.bak` files. |
| Are the phase docs structurally consistent? | Mostly | The packet shapes are consistent, but completion-state metadata is not: all four still carry in-progress task trackers under `Complete` status. |
| Does Phase 017's deliverable match its claimed structural goals? | Yes | The install guide exists, preserves the 5-phase validation flow, and includes a rollback section. |
| Any stale pre-rewrite state still visible? | Yes | Confirmed in Phase 016's `32`-tool references, Phase 018's `13`-command references, and multiple Phase 019 root-README inventory/path statements. |

## Review Summary

- Files reviewed: Phase packets `016`-`019`, their target deliverables, and the live agent/command directories those docs claim to inventory
- Overall assessment: `REQUEST_CHANGES`
- Main blockers: the Phase 019 deliverable omits `@deep-review`, and all four phase packets still claim completion without task-level evidence. The remaining issues are stale inventory/path references that should be cleaned up before release sign-off.
