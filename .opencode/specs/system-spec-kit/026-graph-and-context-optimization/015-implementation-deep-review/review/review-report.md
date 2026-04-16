# Combined Deep Review Report — 120 Iterations

**Packets reviewed:** 009-playbook-and-remediation, 010-continuity-research, 012-canonical-intake-and-middleware-cleanup, 014-memory-save-planner-first-default
**Scope:** 920 files (200 spec docs + 326 code files + 394 operational docs)
**Dispatcher:** cli-copilot gpt-5.4 high, concurrency 3
**Review runs:** 015 doc-layer (50 iters) + 016 code+ops-layer (70 iters)

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| Total iterations | 120 |
| Raw findings | 260 |
| After dedup | 242 |
| **P0 (Blockers)** | **1** |
| **P1 (Required)** | **114** |
| **P2 (Suggestions)** | **133** |
| Verdict | **CONDITIONAL** — 1 P0 + 114 P1 must be triaged before release |

### Per-Packet Breakdown

| Packet | P0 | P1 | P2 | Total |
|---|---|---|---|---|
| 009 | 0 | 7 | 10 | 17 |
| 010 | 0 | 10 | 10 | 20 |
| 012 | 0 | 2 | 5 | 7 |
| 014 | 0 | 5 | 10 | 15 |
| cross-cutting | 1 | 90 | 98 | 189 |

### Per-Layer Breakdown

| Layer | P0 | P1 | P2 |
|---|---|---|---|
| code-layer | 1 | 92 | 99 |
| doc-layer | 0 | 22 | 34 |

---

## 2. P0 Findings (Blockers)

**1. [P0] [cross-cutting] Governed save-time reconsolidation can cross scope boundaries and then persist the survivor without governance metadata.**
  - Layer: code-layer | Iter: 19
  - Evidence: `create-record.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:250`
  - **Governed save-time reconsolidation can cross scope boundaries and then persist the survivor without governance metadata.** The normal save path treats `tenant_id`, `user_id`, `agent_id`, and `sess


---

## 3. Findings by Theme

### 3.1. Command & Workflow Issues (16 findings: 0 P0, 14 P1, 2 P2)

*Command YAML workflows, dispatch logic, entry-point integrity*

**1. [P1] [cross-cutting] List-style frontmatter values keep trailing YAML comments as data**
  - Layer: code-layer | Iter: 12
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:581`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:592`, `.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:179`
  - **List-style frontmatter values keep trailing YAML comments as data** - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:581-624` (`parseSectionValue`): inline scalars correctly

**2. [P1] [cross-cutting] Quoted trigger phrases generate invalid YAML inside `## MEMORY METADATA`**
  - Layer: code-layer | Iter: 12
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:627`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:627`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1170`
  - **Quoted trigger phrases generate invalid YAML inside `## MEMORY METADATA`** - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:627-639,1170-1180`: the main frontmatter serializ

**3. [P1] [cross-cutting] [P1] `spec_kit_implement_{auto,confirm}` default scope blocks non-spec code edits**
  - Layer: code-layer | Iter: 16
  - Evidence: `scope_policy.defau`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:57`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:401`
  - 1. **[P1] `spec_kit_implement_{auto,confirm}` default scope blocks non-spec code edits**

**4. [P1] [cross-cutting] P1-SEC-01: `skill_graph_scan` can traverse outside the workspace because the skill-graph dispatch path never applies the runtime schema/safe-path guar**
  - Layer: code-layer | Iter: 23
  - #### P1-SEC-01: `skill_graph_scan` can traverse outside the workspace because the skill-graph dispatch path never applies the runtime schema/safe-path guard

**5. [P1] [cross-cutting] P1-026-01 [P1] `/spec_kit:resume` session detection can disclose cross-scope memory metadata before a folder is resolved**
  - Layer: code-layer | Iter: 26
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:50`, `session_detection.tier`, `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:50`
  - #### P1-026-01 [P1] `/spec_kit:resume` session detection can disclose cross-scope memory metadata before a folder is resolved

**6. [P1] [cross-cutting] `runWorkflow()` reports a perfect quality score even when the pipeline calculated something else.**
  - Layer: code-layer | Iter: 31
  - Evidence: `filterStats.quali`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1082`, `stats.quali`
  - **`runWorkflow()` reports a perfect quality score even when the pipeline calculated something else.** The workflow computes and logs `filterStats.qualityScore` from the active filter/scoring pipelin

**7. [P1] [cross-cutting] The 250 ms dispatch graph-context timeout does not actually cap tool-call latency.**
  - Layer: code-layer | Iter: 36
  - Evidence: `context-server.ts:631`, `graphDb.query`, `context-server.ts:509`
  - **The 250 ms dispatch graph-context timeout does not actually cap tool-call latency.** `context-server.ts:631-672:resolveDispatchGraphContext` races a `setTimeout(..., 250)` against `buildDispatchGr

**8. [P1] [cross-cutting] `/create:feature-catalog` documents the wrong root filename, so the command markdown and routed YAML disagree on the file the executor must create and**
  - Layer: code-layer | Iter: 51
  - Evidence: `feature_catalog/FEATURE_CATALOG.md`, `feature_catalog/feature_catalog.md`, `.opencode/command/create/feature-catalog.md:260`
  - 1. **`/create:feature-catalog` documents the wrong root filename, so the command markdown and routed YAML disagree on the file the executor must create and validate.** The markdown contract requires `

**9. [P1] [cross-cutting] `doctor_mcp_install.yaml` hard-codes runtime `guide_section` labels that do not exist across the install guides the workflow tells the agent to read.**
  - Layer: code-layer | Iter: 52
  - Evidence: `doctor_mcp_install.yaml`, `.opencode/command/doctor/assets/doctor_mcp_install.yaml:113`, `.opencode/command/doctor/assets/doctor_mcp_install.yaml:228`
  - **`doctor_mcp_install.yaml` hard-codes runtime `guide_section` labels that do not exist across the install guides the workflow tells the agent to read.** Step 4 says the agent should read each serve

**10. [P1] [cross-cutting] The save/index instructions in 10 reviewed SpecKit YAMLs point agents at a non-existent MCP symbol, `spec_kit_memory_memory_save(...)`, even though th**
  - Layer: code-layer | Iter: 53
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1009`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1095`, `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:550`
  - 1. **The save/index instructions in 10 reviewed SpecKit YAMLs point agents at a non-existent MCP symbol, `spec_kit_memory_memory_save(...)`, even though the live native tool is `memory_save`.** Becaus

**11. [P1] [cross-cutting] P1 - `config_checklist.md` publishes JSONC validation commands that are not safe for real JSONC input.**
  - Layer: code-layer | Iter: 66
  - Evidence: `config_checklist.md`, `json.tool`, `json.tool`
  - **P1 - `config_checklist.md` publishes JSONC validation commands that are not safe for real JSONC input.**

**12. [P1] [cross-cutting] 1. `sk-doc` command scaffolding teaches a multiline `description` even though the documented command frontmatter contract is single-line only**
  - Layer: code-layer | Iter: 67
  - Evidence: `.opencode/skill/sk-doc/assets/agents/command_template.md:308`, `.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:200`, `.opencode/command/create/feature-catalog.md:1`
  - #### 1. `sk-doc` command scaffolding teaches a multiline `description` even though the documented command frontmatter contract is single-line only

**13. [P1] [cross-cutting] Gate 3 carry-over rules drift across root runtime docs despite being presented as universal guidance.**
  - Layer: code-layer | Iter: 70
  - Evidence: `CLAUDE.md`, `CLAUDE.md:129`, `AGENTS.md`
  - **Gate 3 carry-over rules drift across root runtime docs despite being presented as universal guidance.** `CLAUDE.md` says Gate 3 answers apply only within the current workflow phase and must be re-

**14. [P1] [cross-cutting] All four root docs point the save workflow at a non-existent JS entrypoint.**
  - Layer: code-layer | Iter: 70
  - Evidence: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `AGENTS.md:201`, `CLAUDE.md:147`
  - **All four root docs point the save workflow at a non-existent JS entrypoint.** Each root doc instructs agents to run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` f

**15. [P2] [cross-cutting] The implement workflow assets contradict themselves about whether `implementation-summary.md` is mandatory for Level 1.**
  - Layer: code-layer | Iter: 4
  - Evidence: `implementation-summary.md`, `spec_kit_implement_auto.yaml:285`, `spec_kit_implement_confirm.yaml:286`
  - **The implement workflow assets contradict themselves about whether `implementation-summary.md` is mandatory for Level 1.** `spec_kit_implement_auto.yaml:285,441-442,471` and `spec_kit_implement_con

**16. [P2] [cross-cutting] P2**
  - Layer: doc-layer | Iter: 28
  - Evidence: `resume.md`, `.opencode/command/spec_kit/resume.md`, `resume.md`
  - **P2** - The M13 change trace overstates `resume.md` as a modified file: the spec's file-change map still lists `.opencode/command/spec_kit/resume.md` as a `Modify` surface, and T071 is phrased as a


### 3.2. Agent & Skill Document Issues (39 findings: 1 P0, 20 P1, 18 P2)

*Agent definitions, SKILL.md accuracy, cross-runtime alignment, reference staleness*

**[ADDED by Opus audit] [P1] [cross-cutting] Deep-review agent docs and reducer encode stale iteration schema**
  - Layer: code-layer | Iter: 56
  - Evidence: `.claude/agents/deep-review.md:148`, `.gemini/agents/deep-review.md:148`, `reduce-state.cjs:202`
  - Agent definitions and the reducer still describe the old iteration section schema (`Focus / Findings / Ruled Out / Dead Ends / Recommended Next Focus / Assessment`), but the live operational-review loop emits iterations with a different layout (`Dispatcher / Files Reviewed / Findings - New / Traceability Checks / Confirmed-Clean Surfaces / Next Focus`). The reducer at `reduce-state.cjs:202` would not recover structured findings from the newer artifacts.

**[ADDED by Opus audit] [P1] [cross-cutting] Root docs under-specify `@context` agent LEAF-only guardrail**
  - Layer: code-layer | Iter: 69
  - Evidence: `AGENTS.md:296-299`, `CODEX.md:296-299`, `GEMINI.md:296-299`, `.opencode/agent/context.md:25-40`
  - Three of four root docs (`AGENTS.md`, `CODEX.md`, `GEMINI.md`) summarize `@context` as a generic exploration helper, omitting the hard LEAF-only / exclusive-routing guardrail that all four shipped agent definitions enforce. `CLAUDE.md` is the only root doc that gets closer. This is a cross-runtime contract mismatch at the root-doc layer.

**1. [P0] [cross-cutting] Governed save-time reconsolidation can cross scope boundaries and then persist the survivor without governance metadata.**
  - Layer: code-layer | Iter: 19
  - Evidence: `create-record.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:250`
  - **Governed save-time reconsolidation can cross scope boundaries and then persist the survivor without governance metadata.** The normal save path treats `tenant_id`, `user_id`, `agent_id`, and `sess

**2. [P1] [cross-cutting] File:**
  - Layer: code-layer | Iter: 2
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:395`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1021`
  - **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:395-438` (`keepKeyFile`), `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562-

**3. [P1] [014] Invalid `--semantic-hits/--cocoindex-hits` payloads are accepted as success-shaped input instead of failing fast.**
  - Layer: code-layer | Iter: 4
  - Evidence: `skill_advisor.py:2014`, `skill_advisor.py:2057`, `skill_advisor.py`
  - 1. **Invalid `--semantic-hits/--cocoindex-hits` payloads are accepted as success-shaped input instead of failing fast.** `skill_advisor.py:2014-2021 (main)` prints an error when the supplied JSON is m

**4. [P1] [cross-cutting] Parseable schema drift crashes the reducer outside its advertised fail-closed path**
  - Layer: code-layer | Iter: 14
  - Evidence: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:39`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:487`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:831`
  - 1. **Parseable schema drift crashes the reducer outside its advertised fail-closed path** — `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:39-40`, `.opencode/skill/sk-deep-research/scripts

**5. [P1] [cross-cutting] `skill_advisor_bench.py` mis-parses valid prompts that start with `-`, so one-shot subprocess measurements can fail or benchmark different input than **
  - Layer: code-layer | Iter: 17
  - Evidence: `skill_advisor_bench.py`, `skill_advisor_bench.py:106`, `skill_advisor.py:1972`
  - 1. **`skill_advisor_bench.py` mis-parses valid prompts that start with `-`, so one-shot subprocess measurements can fail or benchmark different input than the other modes.** In `benchmark_subprocess`,

**6. [P1] [cross-cutting] 1. `skill_graph_scan` lets callers escape the documented skill root and turn `skill_graph_status` into a persistent filesystem-hash DoS**
  - Layer: code-layer | Iter: 20
  - #### 1. `skill_graph_scan` lets callers escape the documented skill root and turn `skill_graph_status` into a persistent filesystem-hash DoS

**7. [P1] [cross-cutting] The deep-review capability resolver advertises a legacy `agents` runtime that is not shipped in this repository.**
  - Layer: code-layer | Iter: 28
  - Evidence: `runtime_capabilities.json`, `.agents/agents/deep-review.md`, `.agents/commands/spec_kit/deep-review.toml`
  - **The deep-review capability resolver advertises a legacy `agents` runtime that is not shipped in this repository.** `listRuntimeCapabilityIds()` and the CLI entrypoint expose every row from `runtim

**8. [P1] [cross-cutting] Published schema contract is not the runtime contract for later tool families.**
  - Layer: code-layer | Iter: 44
  - Evidence: `tool-schemas.ts`, `tool-input-schemas.ts`, `tool-input-schemas.ts:408`
  - **Published schema contract is not the runtime contract for later tool families.** `tool-schemas.ts` advertises strict JSON schemas for `skill_graph_*`, `code_graph_*`, and `ccc_*`, but the shared r

**9. [P1] [cross-cutting] Several Claude agent mirrors tell the runtime to load OpenCode skill docs even though the corresponding Claude skill mirrors are present locally, so t**
  - Layer: code-layer | Iter: 54
  - Evidence: `.claude/agents/context.md`, `.opencode/agent/orchestrate.md`, `.opencode/agent/deep-research.md`
  - 1. **The Claude agent mirrors still hardcode OpenCode agent-definition paths in runtime instructions, even while the same files declare `.claude/agents/*.md` as the canonical path convention.** In `.c

**10. [P1] [cross-cutting] 1. **The Gemini runtime mirrors declare `.gemini/agents/*.md` as canonical, but the live load instructions inside `context`, `orchestrate`, and `write**
  - Layer: code-layer | Iter: 55
  - Evidence: `.gemini/agents/orchestrate.md:30`, `.gemini/agents/orchestrate.md:166`, `.gemini/agents/orchestrate.md:191`
  - 1. **The Gemini runtime mirrors declare `.gemini/agents/*.md` as canonical, but the live load instructions inside `context`, `orchestrate`, and `write` still send readers back to `.opencode/agent/*.md

**11. [P1] [cross-cutting] Gemini orchestrator still tells the Gemini runtime to load OpenCode agent definitions**
  - Layer: code-layer | Iter: 57
  - Evidence: `.gemini/agents/orchestrate.md`, `.gemini/agents/orchestrate.md:30`, `.gemini/agents/orchestrate.md:153`
  - **Gemini orchestrator still tells the Gemini runtime to load OpenCode agent definitions** — `.gemini/agents/orchestrate.md` declares `.gemini/agents/*.md` as the canonical runtime path, but its mand

**12. [P1] [cross-cutting] Review/orchestration docs require a baseline skill name that is not present in the shipped skill catalog**
  - Layer: code-layer | Iter: 57
  - Evidence: `.gemini/agents/review.md:31`, `.gemini/agents/review.md:47`, `.gemini/agents/review.md:76`
  - **Review/orchestration docs require a baseline skill name that is not present in the shipped skill catalog** — both runtime review agents and both orchestrators tell callers to load `sk-code` as the

**13. [P1] [cross-cutting] cli-claude-code points Claude delegations at the OpenCode agent directory instead of the Claude runtime directory.**
  - Layer: code-layer | Iter: 58
  - Evidence: `cli-claude-code/SKILL.md`, `.opencode/skill/cli-claude-code/SKILL.md:48`, `.opencode/skill/cli-claude-code/SKILL.md:308`
  - **cli-claude-code points Claude delegations at the OpenCode agent directory instead of the Claude runtime directory.** `cli-claude-code/SKILL.md` repeatedly tells callers that Claude Code agents liv

**14. [P1] [cross-cutting] mcp-clickup documents unprefixed ClickUp environment variables even though Code Mode requires prefixed names at runtime.**
  - Layer: code-layer | Iter: 58
  - Evidence: `.opencode/skill/mcp-clickup/SKILL.md:262`, `.opencode/skill/mcp-clickup/SKILL.md:412`, `.opencode/skill/mcp-clickup/SKILL.md:505`
  - **mcp-clickup documents unprefixed ClickUp environment variables even though Code Mode requires prefixed names at runtime.** The ClickUp skill tells users to provide `CLICKUP_API_KEY` and `CLICKUP_T

**15. [P1] [cross-cutting] 1. `.opencode/skill/sk-deep-research/SKILL.md:16-20` publishes a runtime path contract for OpenCode/Copilot, Claude, and Codex only, but the repo also**
  - Layer: code-layer | Iter: 59
  - Evidence: `.opencode/skill/sk-deep-research/SKILL.md:16`, `.gemini/agents/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md:16`
  - 1. `.opencode/skill/sk-deep-research/SKILL.md:16-20` publishes a runtime path contract for OpenCode/Copilot, Claude, and Codex only, but the repo also ships `.gemini/agents/deep-research.md`. The same

**16. [P1] [cross-cutting] cli-claude-code README points Claude custom-agent authors at the wrong runtime directory.**
  - Layer: code-layer | Iter: 60
  - Evidence: `.opencode/skill/cli-claude-code/README.md:331`, `AGENTS.md:281`, `cli-claude-code/README.md`
  - **cli-claude-code README points Claude custom-agent authors at the wrong runtime directory.** The README tells users to add Claude Code custom agents under `.opencode/agent/` (`.opencode/skill/cli-c

**17. [P1] [cross-cutting] cli-claude-code documents agent names that no longer line up with the mirrored runtime inventories.**
  - Layer: code-layer | Iter: 61
  - Evidence: `.opencode/skill/cli-claude-code/SKILL.md:308`, `.opencode/skill/cli-claude-code/README.md:54`, `.opencode/skill/cli-claude-code/README.md:172`
  - **cli-claude-code documents agent names that no longer line up with the mirrored runtime inventories.** The loaded skill/README surfaces still tell conductors to use `--agent handover`, `--agent res

**18. [P1] [cross-cutting] cli-copilot/SKILL.md normalizes full-autonomy as the default non-interactive invocation.**
  - Layer: code-layer | Iter: 61
  - Evidence: `cli-copilot/SKILL.md`, `.opencode/skill/cli-copilot/SKILL.md:261`, `.opencode/skill/cli-copilot/SKILL.md:396`
  - **cli-copilot/SKILL.md normalizes full-autonomy as the default non-interactive invocation.** Its core invocation pattern says all non-interactive calls are `copilot -p "prompt" --allow-all-tools 2>&

**19. [P1] [cross-cutting] Deep-research capability matrix contradicts its declared machine-readable source on OpenCode / Copilot hook bootstrap.**
  - Layer: code-layer | Iter: 62
  - Evidence: `capability_matrix.md`, `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`, `.opencode/skill/sk-deep-research/references/capability_matrix.md:13`
  - 1. **Deep-research capability matrix contradicts its declared machine-readable source on OpenCode / Copilot hook bootstrap.**

**20. [P2] [cross-cutting] `top1_accuracy` is inflated by excluding empty-result failures from its denominator.**
  - Layer: code-layer | Iter: 4
  - Evidence: `skill_advisor_regression.py:125`
  - **`top1_accuracy` is inflated by excluding empty-result failures from its denominator.** `skill_advisor_regression.py:125-155 (compute_metrics)` only counts cases toward `top1_cases` when `item["top

**21. [P2] [cross-cutting] `reviewPostSaveQuality()` cannot escalate PSR baseline HIGH findings into a rejected save.**
  - Layer: code-layer | Iter: 11
  - Evidence: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:635`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:449`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:1012`
  - **`reviewPostSaveQuality()` cannot escalate PSR baseline HIGH findings into a rejected save.** The reviewer emits HIGH severity for `PSR-1` and `PSR-2` (`.opencode/skill/system-spec-kit/scripts/core

**22. [P2] [cross-cutting] `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:98-112`, `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:118**
  - Layer: code-layer | Iter: 18
  - Evidence: `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:98`, `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:118`, `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:202`
  - `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:98-112`, `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs:118-127`, `.opencode/skill/system-spec-kit/scripts/

**23. [P2] [cross-cutting] `skill_graph_query` returns raw `SkillNode` objects, and those objects include `sourcePath` and `contentHash` (`lib/skill-graph/skill-graph-db.ts:27-3**
  - Layer: code-layer | Iter: 20
  - Evidence: `lib/skill-graph/skill-graph-db.ts:27`, `lib/skill-graph/skill-graph-db.ts:656`, `handlers/skill-graph/query.ts:55`
  - `skill_graph_query` returns raw `SkillNode` objects, and those objects include `sourcePath` and `contentHash` (`lib/skill-graph/skill-graph-db.ts:27-37`, `lib/skill-graph/skill-graph-db.ts:656-667`)

**24. [P2] [cross-cutting] `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:290-298,321-326` accepts empty-string merge identifiers as "valid" because both `p**
  - Layer: code-layer | Iter: 25
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:290`, `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:187`
  - `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:290-298,321-326` accepts empty-string merge identifiers as "valid" because both `parseJsonl()` and `validateMergeKeys()` only chec

**25. [P2] [014] `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2537-2613,2650-2745` — `handleMemorySave()` maintains two large dry-run branches t**
  - Layer: code-layer | Iter: 37
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2537`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1240`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:54`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2537-2613,2650-2745` — `handleMemorySave()` maintains two large dry-run branches that assemble near-duplicate success envelopes, h

**26. [P2] [cross-cutting] Duplicate reviewer check ID `DUP5` now represents two unrelated drift classes.**
  - Layer: code-layer | Iter: 39
  - Evidence: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:778`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:790`, `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22`
  - **Duplicate reviewer check ID `DUP5` now represents two unrelated drift classes.** `reviewPostSaveQuality()` emits `DUP5` for `context_type` drift at `.opencode/skill/system-spec-kit/scripts/core/po

**27. [P2] [cross-cutting] The core quality scorer hard-codes a double-quoted frontmatter title parser while sibling title parsing is quote-agnostic.**
  - Layer: code-layer | Iter: 39
  - Evidence: `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:85`, `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:71`, `.opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts:8`
  - **The core quality scorer hard-codes a double-quoted frontmatter title parser while sibling title parsing is quote-agnostic.** `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:85-101`

**28. [P2] [cross-cutting] The claimed shared semantic contract has already drifted across short-term allowlists**
  - Layer: code-layer | Iter: 40
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:289`, `.opencode/skill/system-spec-kit/scripts/lib/topic-keywords.ts:18`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:39`
  - **The claimed shared semantic contract has already drifted across short-term allowlists** - `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:289-314`, `.opencode/skill/syste

**29. [P2] [cross-cutting] Three exported simulation helpers are effectively orphaned inside this tree**
  - Layer: code-layer | Iter: 40
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:514`, `.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:908`
  - **Three exported simulation helpers are effectively orphaned inside this tree** - `.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:514-549`: `createFullSimulation`, `addSimulationW

**30. [P2] [cross-cutting] The two harnesses duplicate the same local infrastructure instead of sharing one helper, which creates easy drift points.**
  - Layer: code-layer | Iter: 42
  - Evidence: `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:43`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:38`, `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:207`
  - **The two harnesses duplicate the same local infrastructure instead of sharing one helper, which creates easy drift points.** `load_advisor_module()` is implemented twice (`.opencode/skill/skill-adv

**31. [P2] [cross-cutting] `.opencode/skill/sk-deep-research/SKILL.md:354-359` and `.opencode/skill/sk-deep-review/SKILL.md:446-451` still anchor framework/gate behavior to `CLA**
  - Layer: code-layer | Iter: 59
  - Evidence: `.opencode/skill/sk-deep-research/SKILL.md:354`, `.opencode/skill/sk-deep-review/SKILL.md:446`, `CLAUDE.md`
  - `.opencode/skill/sk-deep-research/SKILL.md:354-359` and `.opencode/skill/sk-deep-review/SKILL.md:446-451` still anchor framework/gate behavior to `CLAUDE.md` even though both skills present themselv

**32. [P2] [cross-cutting] mcp-code-mode README understates and self-contradicts its own tool surface.**
  - Layer: code-layer | Iter: 60
  - Evidence: `.opencode/skill/mcp-code-mode/README.md:44`, `.opencode/skill/mcp-code-mode/README.md:152`, `.opencode/skill/mcp-code-mode/README.md:148`
  - **mcp-code-mode README understates and self-contradicts its own tool surface.** It says the server exposes only four native tools and repeats "Native Tools (4 total)" (`.opencode/skill/mcp-code-mode

**33. [P2] [cross-cutting] cli-copilot's loaded auth guidance is internally inconsistent.**
  - Layer: code-layer | Iter: 61
  - Evidence: `.opencode/skill/cli-copilot/SKILL.md:246`, `.opencode/skill/cli-copilot/README.md:108`, `.opencode/skill/cli-copilot/README.md:223`
  - **cli-copilot's loaded auth guidance is internally inconsistent.** The skill prerequisite block says OAuth uses `copilot login` (`.opencode/skill/cli-copilot/SKILL.md:246-256`), while the README tel

**34. [P2] [cross-cutting] hook_system.md overstates Codex runtime parity.**
  - Layer: code-layer | Iter: 63
  - Evidence: `hook_system.md`, `session-prime.ts`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:48`
  - **hook_system.md overstates Codex runtime parity.** It says Codex CLI is hook-capable and uses shell-script `session-prime.ts` hooks alongside Claude/Copilot/Gemini (`.opencode/skill/system-spec-kit

**35. [P2] [cross-cutting] All three non-Copilot agent-catalog banners still claim "9" agents even though the live runtime inventories are now at 10 definitions each.**
  - Layer: code-layer | Iter: 64
  - Evidence: `.opencode/skill/cli-claude-code/references/agent_delegation.md:111`, `.opencode/skill/cli-codex/references/agent_delegation.md:1`, `.opencode/skill/cli-gemini/references/agent_delegation.md:1`
  - **All three non-Copilot agent-catalog banners still claim "9" agents even though the live runtime inventories are now at 10 definitions each.** See Claude's roster heading [`.opencode/skill/cli-clau

**36. [P2] [cross-cutting] P2 - ClickUp tool-count summary is internally inconsistent.**
  - Layer: code-layer | Iter: 65
  - Evidence: `.opencode/skill/mcp-clickup/assets/tool_categories.md:39`, `.opencode/skill/mcp-clickup/assets/tool_categories.md:121`
  - **P2 - ClickUp tool-count summary is internally inconsistent.** `.opencode/skill/mcp-clickup/assets/tool_categories.md:39-44` claims `LOW = 19` and `Total = 46`, but the low-priority table lists 20 

**37. [P2] [cross-cutting] P2 - Go backend checklists still name the wrong parent skill.**
  - Layer: code-layer | Iter: 65
  - Evidence: `../../../../SKILL.md`, `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/code_quality_checklist.md:665`, `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/debugging_checklist.md:360`
  - **P2 - Go backend checklists still name the wrong parent skill.** The links resolve to `../../../../SKILL.md`, but both assets label that parent as `sk-code-web skill` instead of `sk-code-full-stack


### 3.3. Status Drift (28 findings: 0 P0, 12 P1, 16 P2)

*Spec/plan docs say "planned" while checklist/graph-metadata say "complete"*

**1. [P1] [009] P1-INV-001 — `009/003-deep-review-remediation` exposes contradictory completion status across its own canonical inventory surfaces**
  - Layer: doc-layer | Iter: 1
  - Evidence: `spec.md`, `plan.md`, `graph-metadata.json`
  - #### P1-INV-001 — `009/003-deep-review-remediation` exposes contradictory completion status across its own canonical inventory surfaces

**2. [P1] [010] P1-010-002-status-drift — `002-content-routing-accuracy` child phases 001-003 still advertise `planned` after delivery**
  - Layer: doc-layer | Iter: 3
  - Evidence: `spec.md`, `plan.md`, `graph-metadata.json`
  - #### P1-010-002-status-drift — `002-content-routing-accuracy` child phases 001-003 still advertise `planned` after delivery

**3. [P1] [010] P1-006-01 — `010/003` closeout docs still point at the wrong root packet**
  - Layer: doc-layer | Iter: 6
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/plan.md:18`, `checklist.md:15`, `tasks.md:13`
  - #### P1-006-01 — `010/003` closeout docs still point at the wrong root packet

**4. [P1] [010] DR11-P1-001 — `010/003` child packets `006-key-file-resolution` and `007-entity-quality-improvements` still advertise `planned` after closure**
  - Layer: doc-layer | Iter: 11
  - Evidence: `spec.md`, `plan.md`, `010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/spec.md:4`
  - #### DR11-P1-001 — `010/003` child packets `006-key-file-resolution` and `007-entity-quality-improvements` still advertise `planned` after closure

**5. [P1] [010] P1-013-01 — `010/001-search-fusion-tuning` child packets still leave `plan.md` in `planned` after packet-local closeout**
  - Layer: doc-layer | Iter: 13
  - Evidence: `plan.md`, `001-remove-length-penalty/plan.md:3`, `002-add-reranker-telemetry/plan.md:3`
  - #### P1-013-01 — `010/001-search-fusion-tuning` child packets still leave `plan.md` in `planned` after packet-local closeout

**6. [P1] [010] ### P1-001 [P1] 010/002 phases 005 and 006 still advertise `planned` after their closure surfaces say complete**
  - Layer: doc-layer | Iter: 27
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/spec.md:4`, `005-task-update-merge-safety/spec.md:4`, `plan.md:4`
  - ### P1-001 [P1] 010/002 phases 005 and 006 still advertise `planned` after their closure surfaces say complete

**7. [P1] [cross-cutting] P1**
  - Layer: doc-layer | Iter: 28
  - Evidence: `tasks.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/tasks.md:50`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/tasks.md:226`
  - **P1** - `tasks.md` marks the manual integration-test ledger as completed even though the packet's own evidence says those tests were deferred, so the task-status surface is no longer a truthful ver

**8. [P1] [cross-cutting] `determineSessionStatus()` can mark sessions complete solely because the worktree is clean, even when unresolved next steps are still present.**
  - Layer: code-layer | Iter: 31
  - Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:408`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:428`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:943`
  - **`determineSessionStatus()` can mark sessions complete solely because the worktree is clean, even when unresolved next steps are still present.** The function returns `COMPLETED` as soon as `reposi

**9. [P1] [009] 009/001 closes the phase as complete while a required checklist item is still open.**
  - Layer: doc-layer | Iter: 32
  - Evidence: `009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:8`, `.../plan.md:8`, `.../implementation-summary.md:8`
  - 1. **009/001 closes the phase as complete while a required checklist item is still open.** `001-playbook-prompt-rewrite` still publishes complete status in the spec, plan, implementation summary, and 

**10. [P1] [010] ### P1-001 [P1] 010/002 sub-phases 005 and 006 still advertise `planned` after their own closure docs marked them done**
  - Layer: doc-layer | Iter: 35
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/spec.md:4`, `spec.md`, `plan.md`
  - ### P1-001 [P1] 010/002 sub-phases 005 and 006 still advertise `planned` after their own closure docs marked them done

**11. [P1] [cross-cutting] Deep-review still executes a deferred `completed-continue` path on completed sessions**
  - Layer: code-layer | Iter: 35
  - Evidence: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:178`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:742`
  - 1. **Deep-review still executes a deferred `completed-continue` path on completed sessions** — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33`, `.opencode/command/spec_kit/assets

**12. [P1] [cross-cutting] `/complete`'s repeated-failure path advertises `@debug`, but the executable dispatch is wired to the generic agent.**
  - Layer: code-layer | Iter: 43
  - Evidence: `/debug.md`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:329`, `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:917`
  - 1. **`/complete`'s repeated-failure path advertises `@debug`, but the executable dispatch is wired to the generic agent.** The same workflow file first defines the intended debug specialist path (`age

**13. [P2] [012] Broad tool grant normalized in the closeout narrative**
  - Layer: doc-layer | Iter: 20
  - Evidence: `012-canonical-intake-and-middleware-cleanup/implementation-summary.md:121`, `spec.md:53`, `decision-record.md:358`
  - **Broad tool grant normalized in the closeout narrative** — `012-canonical-intake-and-middleware-cleanup/implementation-summary.md:121,186` records the M14 documentation sweep as a `cli-copilot` run

**14. [P2] [010] `010-continuity-research` still leaves resolved security-boundary choices phrased as open questions in completed phase specs. `002-content-routing-acc**
  - Layer: doc-layer | Iter: 23
  - Evidence: `002-content-routing-accuracy/005-task-update-merge-safety/spec.md:36`, `.../implementation-summary.md:89`, `003-graph-metadata-validation/007-entity-quality-improvements/spec.md:36`
  - `010-continuity-research` still leaves resolved security-boundary choices phrased as open questions in completed phase specs. `002-content-routing-accuracy/005-task-update-merge-safety/spec.md:36` s

**15. [P2] [010] 010/003 root closeout evidence no longer traces the full child set.**
  - Layer: doc-layer | Iter: 33
  - Evidence: `tasks.md:13`, `checklist.md:15`, `graph-metadata.json:6`
  - **010/003 root closeout evidence no longer traces the full child set.** The parent root still records closeout only for sub-phases `001-004` (`tasks.md:13`, `checklist.md:15`), but the root packet d

**16. [P2] [009] P2 - 009/003 closeout evidence is still fragmented across task/checklist surfaces.**
  - Layer: doc-layer | Iter: 34
  - Evidence: `spec.md`, `plan.md`, `tasks.md`
  - **P2 - 009/003 closeout evidence is still fragmented across task/checklist surfaces.** `003-deep-review-remediation` is machine-indexed as complete, but its indexed `source_docs` stop at `spec.md`, 

**17. [P2] [cross-cutting] The command parity tests are lexical and miss lifecycle behavior drift**
  - Layer: code-layer | Iter: 35
  - Evidence: `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:70`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:73`
  - **The command parity tests are lexical and miss lifecycle behavior drift** — the deep-review test only checks for token presence like `completed-continue`, `on_restart:`, and canonical filenames, wh

**18. [P2] [009] P2-038-02 - Phase 003 has no single closeout narrative surface even though downstream metadata treats it as complete.**
  - Layer: doc-layer | Iter: 38
  - Evidence: `003-deep-review-remediation/checklist.md:2`, `003-deep-review-remediation/graph-metadata.json:29`, `003-deep-review-remediation/graph-metadata.json:196`
  - **P2-038-02 - Phase 003 has no single closeout narrative surface even though downstream metadata treats it as complete.** `003-deep-review-remediation/checklist.md:2-3` marks the packet complete, an

**19. [P2] [010] P2-039-01 - Packet 001 stays `planned` because cross-runtime Codex mirror sync is bundled into packet closeout.**
  - Layer: doc-layer | Iter: 39
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/001-search-fusion-tuning/spec.md:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/001-search-fusion-tuning/tasks.md:14`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/001-search-fusion-tuning/checklist.md:15`
  - **P2-039-01 - Packet 001 stays `planned` because cross-runtime Codex mirror sync is bundled into packet closeout.** Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-

**20. [P2] [009] Completed `009/003` packet still lacks an implementation summary**
  - Layer: doc-layer | Iter: 42
  - Evidence: `tasks.md:44`, `checklist.md:10`, `graph-metadata.json:29`
  - **Completed `009/003` packet still lacks an implementation summary** — the packet's execution surfaces are closed (`tasks.md:44-48`, `checklist.md:10-13`, `graph-metadata.json:29`), but `graph-metad

**21. [P2] [010] Sampled complete `010` child summaries still carry unresolved template placeholders**
  - Layer: doc-layer | Iter: 42
  - Evidence: `001-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:10`, `001-search-fusion-tuning/002-add-reranker-telemetry/implementation-summary.md:10`, `003-graph-metadata-validation/004-normalize-legacy-files/implementation-summary.md:10`
  - **Sampled complete `010` child summaries still carry unresolved template placeholders** — `001-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:10-12`, `001-search-fusion-tun

**22. [P2] [012] 012 records deferred manual verification as completed work, so the task ledger and checklist are not self-sufficient maintenance guides.**
  - Layer: doc-layer | Iter: 43
  - Evidence: `tasks.md`, `checklist.md`, `012-canonical-intake-and-middleware-cleanup/tasks.md:226`
  - **012 records deferred manual verification as completed work, so the task ledger and checklist are not self-sufficient maintenance guides.** `tasks.md` marks T090-T094 as `[x]` even though every row

**23. [P2] [cross-cutting] `spec_kit_complete_auto.yaml` contains a duplicated `D)` option in the debug-escalation prompt.**
  - Layer: code-layer | Iter: 43
  - Evidence: `spec_kit_complete_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:876`
  - **`spec_kit_complete_auto.yaml` contains a duplicated `D)` option in the debug-escalation prompt.** The prompt first prints `D) Pause workflow` and then immediately prints a second `D) Pause - Stop 

**24. [P2] [cross-cutting] Parity coverage currently skips the `/complete` command assets, which is why the escalation drift above can land unnoticed.**
  - Layer: code-layer | Iter: 43
  - Evidence: `spec_kit_complete_confirm.yaml`, `spec_kit_complete_auto.yaml`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:42`
  - **Parity coverage currently skips the `/complete` command assets, which is why the escalation drift above can land unnoticed.** The contract tests enumerate only the deep-research and deep-review co

**25. [P2] [012] Ghost M13 maintenance surface in 012.**
  - Layer: doc-layer | Iter: 44
  - Evidence: `.opencode/command/spec_kit/resume.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md:133`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/decision-record.md:277`
  - **Ghost M13 maintenance surface in 012.** The packet still models `.opencode/command/spec_kit/resume.md` as a maintained delivery surface even though its own closeout docs say no packet-local file c

**26. [P2] [010] Placeholder closeout metadata still lingers across completed 010 phases.**
  - Layer: doc-layer | Iter: 47
  - Evidence: `010-continuity-research/001-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:11`, `.../002-add-reranker-telemetry/implementation-summary.md:11`, `.../003-continuity-search-profile/implementation-summary.md:11`
  - **Placeholder closeout metadata still lingers across completed 010 phases.** Six completed implementation summaries still publish `closed_by_commit: TBD`, leaving future maintainers to reconstruct c

**27. [P2] [cross-cutting] Incomplete mode menu:**
  - Layer: code-layer | Iter: 51
  - Evidence: `.opencode/command/improve/prompt.md:105`, `.opencode/command/improve/prompt.md:245`, `.opencode/command/improve/prompt.md:335`
  - **Incomplete mode menu:** `/improve:prompt` advertises `$deep` in error recovery and the shipped `sk-improve-prompt` skill still supports `$deep`/`$d`, but the setup menu and mode table never expose

**28. [P2] [cross-cutting] `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:15-19` and `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:127-**
  - Layer: code-layer | Iter: 67
  - Evidence: `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:15`, `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:127`, `.opencode/skill/sk-deep-research/assets/deep_research_config.json:14`
  - `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:15-19` and `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:127-133` still describe `fork` and `completed-contin


### 3.4. Packet Identity Drift (5 findings: 0 P0, 2 P1, 3 P2)

*014 references "Packet 016" / SC-016 / CHK-016 across live docs*

**1. [P1] [014] P1-014-001 — `SC-016` misidentifies the validated packet as `016`**
  - Layer: doc-layer | Iter: 5
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:217`, `validate_document.py`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/description.json:2`
  - #### P1-014-001 — `SC-016` misidentifies the validated packet as `016`

**2. [P1] [014] 014 packet-level traceability still points at a fictitious `016` namespace instead of the live `014` packet.**
  - Layer: doc-layer | Iter: 33
  - Evidence: `description.json:2`, `graph-metadata.json:3`, `tasks.md:54`
  - **014 packet-level traceability still points at a fictitious `016` namespace instead of the live `014` packet.** The authoritative packet identity surfaces still say `014` (`description.json:2-14`, 

**3. [P2] [014] 014 checklist packet-identity drift extends beyond the already-known spec typo.**
  - Layer: doc-layer | Iter: 7
  - Evidence: `014/checklist.md:199`, `014/description.json:13`
  - **014 checklist packet-identity drift extends beyond the already-known spec typo.** `014/checklist.md:199-208` still labels the packet-verification block as `CHK-016-*`, so the packet's own verifica

**4. [P2] [014] 014 traceability surfaces still carry inherited packet-016 lineage, which makes the live 014 packet harder to maintain and search.**
  - Layer: doc-layer | Iter: 43
  - Evidence: `014-memory-save-planner-first-default/tasks.md:47`, `014-memory-save-planner-first-default/spec.md:214`, `014-memory-save-planner-first-default/checklist.md:197`
  - **014 traceability surfaces still carry inherited packet-016 lineage, which makes the live 014 packet harder to maintain and search.** The stale identity is no longer confined to the already-known s

**5. [P2] [014] 014 duplicated-packet identity drift stays spread across live docs.**
  - Layer: doc-layer | Iter: 49
  - Evidence: `014-memory-save-planner-first-default/spec.md:217`, `014-memory-save-planner-first-default/checklist.md:143`, `014-memory-save-planner-first-default/changelog/changelog-026-014-memory-save-planner-first-default.md:22`
  - **014 duplicated-packet identity drift stays spread across live docs.** `014-memory-save-planner-first-default/spec.md:217` still defines `SC-016`, `014-memory-save-planner-first-default/checklist.m


### 3.5. Traceability Gaps (25 findings: 0 P0, 15 P1, 10 P2)

*Missing spec↔code alignment, evidence not source-backed, broken cross-references*

**1. [P1] [cross-cutting] Evidence:**
  - Layer: code-layer | Iter: 2
  - Evidence: `path.is`, `derived.key`
  - **Evidence:** `keepKeyFile()` rejects `../` and command-like noise, but never rejects absolute paths. `buildKeyFileLookupPaths()` explicitly treats an absolute candidate as valid input (`path.isAbso

**2. [P1] [cross-cutting] `handleMemoryStats` advertises regex-based folder exclusion, but executes literal substring matching instead.**
  - Layer: code-layer | Iter: 6
  - Evidence: `memory-crud-stats.ts:78`, `tool-schemas.ts:231`, `memory-crud-stats.ts:186`
  - 1. **`handleMemoryStats` advertises regex-based folder exclusion, but executes literal substring matching instead.**

**3. [P1] [cross-cutting] Checkpoint scoped restore deletes causal edges through the wrong database handle**
  - Layer: code-layer | Iter: 7
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:849`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:591`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:693`
  - 1. **Checkpoint scoped restore deletes causal edges through the wrong database handle**

**4. [P1] [cross-cutting] `SPEC_DOC_SUFFICIENCY` ignores anchor-parse failures, so malformed required anchors can still produce a passing sufficiency result.**
  - Layer: code-layer | Iter: 8
  - Evidence: `document.conte`, `parsed.error`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:665`
  - 1. **`SPEC_DOC_SUFFICIENCY` ignores anchor-parse failures, so malformed required anchors can still produce a passing sufficiency result.**

**5. [P1] [cross-cutting] `generate-context` can silently retarget an explicit multi-segment spec path to a different packet by basename.**
  - Layer: code-layer | Iter: 10
  - Evidence: `path.basen`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:477`, `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts:39`
  - 1. **`generate-context` can silently retarget an explicit multi-segment spec path to a different packet by basename.**

**6. [P1] [cross-cutting] The shipped post-save reviewer is not wired into the real scripts pipeline, so its guardrails never execute outside tests.**
  - Layer: code-layer | Iter: 11
  - Evidence: `post-save-review.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1242`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1356`
  - 1. **The shipped post-save reviewer is not wired into the real scripts pipeline, so its guardrails never execute outside tests.**

**7. [P1] [010] 010/002/004 still tells operators that Tier 3 is always on and has no operator-controlled flag, which now contradicts 014's shipped opt-in/manual-revi**
  - Layer: doc-layer | Iter: 25
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/spec.md:164`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/004-doc-surface-alignment/checklist.md:91`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:59`
  - 1. **010/002/004 still tells operators that Tier 3 is always on and has no operator-controlled flag, which now contradicts 014's shipped opt-in/manual-review guard.** Evidence: `.opencode/specs/system

**8. [P1] [cross-cutting] P1-001 [P1] `renderDashboard()` lets unescaped metadata forge the human review surface**
  - Layer: code-layer | Iter: 25
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:487`, `board.sessi`, `board.targe`
  - #### P1-001 [P1] `renderDashboard()` lets unescaped metadata forge the human review surface

**9. [P1] [014] P1 - Packet verification evidence is not actually source-backed**
  - Layer: doc-layer | Iter: 29
  - Evidence: `014-memory-save-planner-first-default/checklist.md:3`, `014-memory-save-planner-first-default/tasks.md:220`, `014-memory-save-planner-first-default/checklist.md:3`
  - #### P1 - Packet verification evidence is not actually source-backed

**10. [P1] [014] P1 - 014 checklist evidence no longer traces back to first-order proof surfaces.**
  - Layer: doc-layer | Iter: 31
  - Evidence: `014/tasks.md:56`, `014/checklist.md:135`, `review/015-deep-review-snapshot/primary-docs/checklist.md`
  - **P1 - 014 checklist evidence no longer traces back to first-order proof surfaces.** `014/tasks.md:56` promises that "every line of evidence cites the right artifact" from the audit, research, or de

**11. [P1] [010] P1-036-01 - `010/003/006-key-file-resolution` broadens its delivered pruning rule beyond the approved packet contract**
  - Layer: doc-layer | Iter: 36
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/spec.md:20`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/plan.md:20`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution/tasks.md:17`
  - #### P1-036-01 - `010/003/006-key-file-resolution` broadens its delivered pruning rule beyond the approved packet contract

**12. [P1] [010] P1-036-02 - `010/003/007-entity-quality-improvements` expands the runtime-name rejection list beyond the approved requirement surface**
  - Layer: doc-layer | Iter: 36
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/spec.md:22`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/plan.md:20`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/007-entity-quality-improvements/tasks.md:20`
  - #### P1-036-02 - `010/003/007-entity-quality-improvements` expands the runtime-name rejection list beyond the approved requirement surface

**13. [P1] [cross-cutting] `gate-d-regression-intent-routing.vitest.ts` does not exercise the live canonical-filtering contract it claims to protect.**
  - Layer: code-layer | Iter: 47
  - Evidence: `gate-d-regression-intent-routing.vitest.ts`, `gate-d-regression-intent-routing.vitest.ts:27`, `gate-d-regression-intent-routing.vitest.ts:169`
  - 1. **`gate-d-regression-intent-routing.vitest.ts` does not exercise the live canonical-filtering contract it claims to protect.**

**14. [P1] [cross-cutting] `memory-search-integration.vitest.ts` is mostly a source-text snapshot, not the integration suite its T621-T650 labels claim to be.**
  - Layer: code-layer | Iter: 49
  - Evidence: `memory-search-integration.vitest.ts`, `mcp_server/tests/memory-search-integration.vitest.ts:35`, `fs.read`
  - 1. **`memory-search-integration.vitest.ts` is mostly a source-text snapshot, not the integration suite its T621-T650 labels claim to be.**

**15. [P1] [cross-cutting] P1 - `sk-code-full-stack` routes backend/mobile stacks to per-stack checklist folders, but the Node.js, React Native, and Swift debugging/verification**
  - Layer: code-layer | Iter: 66
  - Evidence: `Node.js`, `sk-code-full-stack/SKILL.md`, `Node.js`
  - **P1 - `sk-code-full-stack` routes backend/mobile stacks to per-stack checklist folders, but the Node.js, React Native, and Swift debugging/verification assets are still browser-web templates.**

**16. [P2] [014] P2 - machine-readable evidence indexing only exposes one of the three transcript proofs.**
  - Layer: doc-layer | Iter: 31
  - Evidence: `014/spec.md:220`, `014/implementation-summary.md:69`, `014/graph-metadata.json:41`
  - **P2 - machine-readable evidence indexing only exposes one of the three transcript proofs.** `014/spec.md:220` says the packet is validated by three real session transcripts, and `014/implementation

**17. [P2] [cross-cutting] The pipeline tests leave both traceability regressions unguarded.**
  - Layer: code-layer | Iter: 31
  - Evidence: `collect-session-data.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:141`, `describe.skip`
  - **The pipeline tests leave both traceability regressions unguarded.** `collect-session-data.vitest.ts` validates next-step handling only without the clean-repo metadata branch (`.opencode/skill/syst

**18. [P2] [014] P2-001 - 014 packet-verification evidence is still not self-locating.**
  - Layer: doc-layer | Iter: 37
  - Evidence: `014-memory-save-planner-first-default/tasks.md:54`, `014-memory-save-planner-first-default/implementation-summary.md:89`, `014-memory-save-planner-first-default/checklist.md:199`
  - **P2-001 - 014 packet-verification evidence is still not self-locating.** `014-memory-save-planner-first-default/tasks.md:54-57` says the packet preserves source-artifact lineage so evidence can cit

**19. [P2] [009] P2-038-03 - Phase 014 checklist evidence still uses shorthand placeholders that are hard to revalidate later.**
  - Layer: doc-layer | Iter: 38
  - Evidence: `001-playbook-prompt-rewrite/checklist.md:51`, `001-playbook-prompt-rewrite/checklist.md:62`, `001-playbook-prompt-rewrite/checklist.md:73`
  - **P2-038-03 - Phase 014 checklist evidence still uses shorthand placeholders that are hard to revalidate later.** `001-playbook-prompt-rewrite/checklist.md:51-55`, `001-playbook-prompt-rewrite/check

**20. [P2] [010] P2-039-02 - Graph metadata in 010 still carries heading-shaped and stopword-only entities after the entity-quality cleanup.**
  - Layer: doc-layer | Iter: 39
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/001-search-fusion-tuning/graph-metadata.json:138`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/graph-metadata.json:124`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/graph-metadata.json:125`
  - **P2-039-02 - Graph metadata in 010 still carries heading-shaped and stopword-only entities after the entity-quality cleanup.** Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optim

**21. [P2] [cross-cutting] Canonical packet truth still depends on an excluded review artifact.**
  - Layer: doc-layer | Iter: 40
  - Evidence: `review/review-report.md`, `spec.md:541`, `tasks.md:232`
  - **Canonical packet truth still depends on an excluded review artifact.** The packet's canonical docs and generated metadata all treat `review/review-report.md` as a first-class evidence surface or k

**22. [P2] [cross-cutting] Generated description metadata is noisy enough to obscure meaningful history.**
  - Layer: doc-layer | Iter: 40
  - Evidence: `description.json:19`
  - **Generated description metadata is noisy enough to obscure meaningful history.** `description.json:19-34` records fourteen `memoryNameHistory` entries, but ten are near-identical `verification-save

**23. [P2] [cross-cutting] Line-for-line duplicate resolver creates avoidable drift risk across the review/research runtimes.**
  - Layer: code-layer | Iter: 41
  - Evidence: `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs:32`, `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs:32`
  - **Line-for-line duplicate resolver creates avoidable drift risk across the review/research runtimes.**

**24. [P2] [cross-cutting] The deep-review parity suite does not exercise the resolver module or its machine-readable matrix, so this duplicated surface can drift silently.**
  - Layer: code-layer | Iter: 41
  - Evidence: `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:1`, `runtime-capabilities.cjs`, `runtime_capabilities.json`
  - **The deep-review parity suite does not exercise the resolver module or its machine-readable matrix, so this duplicated surface can drift silently.**

**25. [P2] [cross-cutting] Wrong follow-up command name:**
  - Layer: code-layer | Iter: 51
  - Evidence: `.opencode/command/doctor/mcp_install.md:146`, `.opencode/command/doctor/mcp_debug.md:18`
  - **Wrong follow-up command name:** `/doctor:mcp_install` tells users to run ``mcp_doctor:debug`` instead of the actual `/doctor:mcp_debug` command surface. Evidence: `.opencode/command/doctor/mcp_ins


### 3.6. Test Quality Issues (48 findings: 0 P0, 11 P1, 37 P2)

*False-positive tests, missing edge cases, brittle assertions, coverage gaps*

**[ADDED by Opus audit] [P1] [cross-cutting] Adaptive-fusion tests do not verify enabled-mode result ordering**
  - Layer: code-layer | Iter: 45
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:169-177,215-229,322-332`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:356-418`
  - The flag-on adaptive-fusion tests only validate weight metadata, never verifying that enabling adaptive mode actually changes the returned ranking. A no-op regression that returned `standardFuse()` results while preserving weight bookkeeping would leave the main flag-on suite green.

**1. [P1] [cross-cutting] P1-002 [P1] `coverage_gaps` reports the wrong thing for review graphs**
  - Layer: code-layer | Iter: 2
  - #### P1-002 [P1] `coverage_gaps` reports the wrong thing for review graphs

**2. [P1] [cross-cutting] Deep-review reducer drops `blendedScore`, so review dashboards can report the wrong graph convergence score.**
  - Layer: code-layer | Iter: 3
  - Evidence: `coverage-graph-convergence.cjs`, `signals.blend`, `sk-deep-review/scripts/reduce-state.cjs`
  - **Deep-review reducer drops `blendedScore`, so review dashboards can report the wrong graph convergence score.** `coverage-graph-convergence.cjs` emits `{ graphScore, blendedScore, components }` as 

**3. [P1] [cross-cutting] Why tests missed it:**
  - Layer: code-layer | Iter: 9
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:483`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:586`
  - **Why tests missed it:** The cache test only verifies a same-context cache hit; it does not vary `sourceField`, `likely_phase_anchor`, or packet metadata while keeping the text identical. `[SOURCE: 

**4. [P1] [cross-cutting] The intent-classifier suite's headline accuracy gates exclude two supported intents, so the tests can still report ">80% accuracy" while `find_spec` o**
  - Layer: code-layer | Iter: 32
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:131`
  - **The intent-classifier suite's headline accuracy gates exclude two supported intents, so the tests can still report ">80% accuracy" while `find_spec` or `find_decision` regress.** The classifier im

**5. [P1] [cross-cutting] `reconsolidation-bridge.vitest.ts` never exercises the planner-default safety branch it claims to protect.**
  - Layer: code-layer | Iter: 33
  - Evidence: `reconsolidation-bridge.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:90`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114`
  - 1. **`reconsolidation-bridge.vitest.ts` never exercises the planner-default safety branch it claims to protect.**

**6. [P1] [009] Archived constitutional filtering is broken in the implementation, and the remediation test hard-codes the broken behavior instead of catching it.**
  - Layer: code-layer | Iter: 34
  - Evidence: `vector-index-store.ts:609`, `vector-index-queries.ts:288`, `vector-index-store.ts:1093`
  - **Archived constitutional filtering is broken in the implementation, and the remediation test hard-codes the broken behavior instead of catching it.** `vector-index-store.ts:609-668:get_constitution

**7. [P1] [cross-cutting] `causal-fixes.vitest.ts` never executes the production `relations` filter path for `memory_drift_why`.**
  - Layer: code-layer | Iter: 45
  - Evidence: `causal-fixes.vitest.ts`, `fullChain.child`, `.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:163`
  - 1. **`causal-fixes.vitest.ts` never executes the production `relations` filter path for `memory_drift_why`.** The T203 cases build an unfiltered chain with `getCausalChain()` and then filter `fullChai

**8. [P1] [cross-cutting] `context-server.vitest.ts` validates a shadow copy of `parseArgs()` and source text instead of the shipped parser.**
  - Layer: code-layer | Iter: 46
  - Evidence: `context-server.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:77`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:83`
  - **`context-server.vitest.ts` validates a shadow copy of `parseArgs()` and source text instead of the shipped parser.** The suite defines its own local `parseArgs` implementation and exercises that r

**9. [P1] [cross-cutting] `intent-classifier.vitest.ts`'s "overall accuracy" guards exclude 2 of the 7 public intents, so the suite can stay green while `find_spec` or `find_de**
  - Layer: code-layer | Iter: 48
  - Evidence: `intent-classifier.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:32`
  - 1. **`intent-classifier.vitest.ts`'s "overall accuracy" guards exclude 2 of the 7 public intents, so the suite can stay green while `find_spec` or `find_decision` regresses.** The runtime contract is 

**10. [P1] [cross-cutting] Silent-skip guards let the main cross-encoder contract tests pass even if the exported API disappears.**
  - Layer: code-layer | Iter: 50
  - Evidence: `crossEncoder.reran`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:158`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:396`
  - **Silent-skip guards let the main cross-encoder contract tests pass even if the exported API disappears.** `T211-CE1` returns early when `crossEncoder.rerankResults` is missing, and `T211-LP1` throu

**11. [P2] [cross-cutting] `deep_loop_graph_query` collapses two documented query modes into the same implementation branch.**
  - Layer: code-layer | Iter: 1
  - Evidence: `handlers/coverage-graph/query.ts:66`, `tool-schemas.ts:797`, `lib/coverage-graph/coverage-graph-query.ts:91`
  - **`deep_loop_graph_query` collapses two documented query modes into the same implementation branch.** `handlers/coverage-graph/query.ts:66-77` maps both `uncovered_questions` and `coverage_gaps` to 

**12. [P2] [cross-cutting] The test net is largely string-based and missed the broken coverage-graph tool surface.**
  - Layer: code-layer | Iter: 1
  - Evidence: `tests/context-server.vitest.ts:202`, `tool-schemas.ts`, `tools/index.ts`
  - **The test net is largely string-based and missed the broken coverage-graph tool surface.** `tests/context-server.vitest.ts:202-205,208-258,2328-2331` checks that the names exist in `tool-schemas.ts

**13. [P2] [cross-cutting] P2-001:**
  - Layer: code-layer | Iter: 2
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:10`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:10`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:274`
  - **P2-001:** The only coverage-graph “tests” on this surface are archived Phase-3 contract stubs, not live behavior checks. Both archived files explicitly say the real MCP implementation “will be wir

**14. [P2] [cross-cutting] Test coverage is skewed toward helper smoke tests, not the shipped wrapping path.**
  - Layer: code-layer | Iter: 3
  - Evidence: `.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:638`, `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts:58`
  - **Test coverage is skewed toward helper smoke tests, not the shipped wrapping path.** The only anchor-generator module smoke test asserts `generateAnchorId()`, `categorizeSection()`, `validateAnchor

**15. [P2] [cross-cutting] `handleCoverageGraphStatus` fail-opens on signal computation errors.**
  - Layer: code-layer | Iter: 5
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:50`
  - **`handleCoverageGraphStatus` fail-opens on signal computation errors.** When `computeScopedSignals()` or `computeScopedMomentum()` throws, the handler swallows the exception and still returns `stat

**16. [P2] [cross-cutting] `search-archival.vitest.ts` is signature-only and would miss real archive-behavior regressions.**
  - Layer: code-layer | Iter: 7
  - Evidence: `search-archival.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:24`
  - **`search-archival.vitest.ts` is signature-only and would miss real archive-behavior regressions.** The suite just regex-matches `includeArchived = false` in source text instead of exercising runtim

**17. [P2] [cross-cutting] `getRelatedMemories` has no positive-path coverage in the main vector-index suite.**
  - Layer: code-layer | Iter: 7
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:955`
  - **`getRelatedMemories` has no positive-path coverage in the main vector-index suite.** The only assertions are “empty array for missing/no relations” [.opencode/skill/system-spec-kit/mcp_server/test

**18. [P2] [cross-cutting] Whitespace-only trigger phrases count as real trigger coverage.**
  - Layer: code-layer | Iter: 8
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:493`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:603`, `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:399`
  - **Whitespace-only trigger phrases count as real trigger coverage.** `scoreTriggerQuality()` uses raw array length with no trim/filter step, and `scoreContentQuality()` feeds that score straight into

**19. [P2] [cross-cutting] `test-template-comprehensive.js` is a misleading coverage surface for the renderer.**
  - Layer: code-layer | Iter: 10
  - Evidence: `test-template-comprehensive.js`, `.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:143`, `.opencode/skill/system-spec-kit/scripts/package.json:10`
  - **`test-template-comprehensive.js` is a misleading coverage surface for the renderer.** It defines a local `renderTemplate()` stub instead of importing the production renderer (`.opencode/skill/syst

**20. [P2] [cross-cutting] Frontmatter regression coverage misses the exact failure modes above**
  - Layer: code-layer | Iter: 12
  - Evidence: `.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:179`, `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:125`
  - **Frontmatter regression coverage misses the exact failure modes above** - `.opencode/skill/system-spec-kit/scripts/tests/test-frontmatter-backfill.js:179-203,306-330` only checks inline-array comme

**21. [P2] [cross-cutting] False-positive regression expectation:**
  - Layer: code-layer | Iter: 13
  - Evidence: `deep-loop-wave-merge.vitest.ts:101`, `deep-loop-wave-executor.vitest.ts:163`
  - **False-positive regression expectation:** the merge tests assert that cross-segment duplicates should be preserved (`deep-loop-wave-merge.vitest.ts:101-109`, `:281-291`, `deep-loop-wave-executor.vi

**22. [P2] [cross-cutting] Missing edge-case coverage:**
  - Layer: code-layer | Iter: 13
  - Evidence: `truncate-on-word-boundary.vitest.ts:78`, `deep-loop-wave-planner.vitest.ts:81`
  - **Missing edge-case coverage:** `truncate-on-word-boundary.vitest.ts:78-145` never exercises astral Unicode or grapheme-heavy inputs, and the planner tests only validate review activation with injec

**23. [P2] [cross-cutting] False-positive regression test**
  - Layer: code-layer | Iter: 14
  - Evidence: `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:246`, `signals.score`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:261`
  - **False-positive regression test** — `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:246-266` claims to verify direct consumption of the canonical handler shape, but the fi

**24. [P2] [cross-cutting] Missing coverage for parseable schema corruption**
  - Layer: code-layer | Iter: 14
  - Evidence: `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:69`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:267`
  - **Missing coverage for parseable schema corruption** — `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts:69-71` and `.opencode/skill/system-spec-kit/scripts/tests/deep-r

**25. [P2] [cross-cutting] False-positive hook coverage:**
  - Layer: code-layer | Iter: 15
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:28`, `session-prime.ts`
  - **False-positive hook coverage:** `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:28-50` and `:90-137` mostly assert serialized hook-state helpers and local string lit

**26. [P2] [cross-cutting] `test-phase-command-workflows.js` is a string-presence check only; it verifies phase-folder/template phrases but never asserts implementation scope se**
  - Layer: code-layer | Iter: 16
  - Evidence: `test-phase-command-workflows.js`, `.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:95`, `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:70`
  - `test-phase-command-workflows.js` is a string-presence check only; it verifies phase-folder/template phrases but never asserts implementation scope semantics or PREFLIGHT/POSTFLIGHT score contracts,

**27. [P2] [cross-cutting] These harnesses appear to have no direct automated coverage, which is why the CLI-only failure modes above can slip through.**
  - Layer: code-layer | Iter: 17
  - Evidence: `skill_advisor_bench.py`, `skill_advisor_regression.py`
  - **These harnesses appear to have no direct automated coverage, which is why the CLI-only failure modes above can slip through.** A repo-wide search under `.opencode/skill/**/tests/**/*.{py,ts,js}` f

**28. [P2] [cross-cutting] `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:117-174`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconso**
  - Layer: code-layer | Iter: 19
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:117`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:199`, `.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:1`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:117-174`, `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:199-220`, `.opencode/s

**29. [P2] [cross-cutting] `tests/resume-ladder.vitest.ts:115-243` only exercises workspace-relative packet names; there is no regression that asserts absolute or out-of-root `s**
  - Layer: code-layer | Iter: 21
  - Evidence: `tests/resume-ladder.vitest.ts:115`, `tests/graph-metadata-schema.vitest.ts:166`, `tests/graph-metadata-schema.vitest.ts:118`
  - `tests/resume-ladder.vitest.ts:115-243` only exercises workspace-relative packet names; there is no regression that asserts absolute or out-of-root `specFolder` values are rejected.

**30. [P2] [cross-cutting] P2-TEST-01:**
  - Layer: code-layer | Iter: 23
  - Evidence: `context-server.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:192`, `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301`
  - **P2-TEST-01:** The validation gap above was easy to ship because there is no dedicated schema/dispatcher coverage for `skill_graph_*`. The only assertions I found are tool-registration checks in `c

**31. [P2] [cross-cutting] `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:33-125` only exercises sort/limit/offset/specFolder behavior, whi**
  - Layer: code-layer | Iter: 26
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:33`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282`, `.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js:95`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-list-edge.vitest.ts:33-125` only exercises sort/limit/offset/specFolder behavior, while `.opencode/skill/system-spec-kit/mcp_server/t

**32. [P2] [009] `.opencode/skill/skill-advisor` currently has no automated test files adjacent to the reviewed scripts; discovery only surfaced `manual_testing_playbo**
  - Layer: code-layer | Iter: 27
  - Evidence: `manual_testing_playbook/manual_testing_playbook.md`, `skill_advisor_regression.py`, `skill_advisor_bench.py`
  - `.opencode/skill/skill-advisor` currently has no automated test files adjacent to the reviewed scripts; discovery only surfaced `manual_testing_playbook/manual_testing_playbook.md`, while the shippe

**33. [P2] [cross-cutting] Deep-review lacks executable coverage for `runtime-capabilities.cjs`.**
  - Layer: code-layer | Iter: 28
  - Evidence: `runtime-capabilities.cjs`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:3`, `runtime-capabilities.cjs`
  - **Deep-review lacks executable coverage for `runtime-capabilities.cjs`.** Unlike the deep-research parity suite, which imports its sibling resolver and asserts both runtime IDs and on-disk target ex

**34. [P2] [cross-cutting] The test surface never exercises the non-progress route categories that the validator is supposed to trace.**
  - Layer: code-layer | Iter: 30
  - Evidence: `spec-doc-structure.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts:243`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-quality-gates.vitest.ts:90`
  - **The test surface never exercises the non-progress route categories that the validator is supposed to trace.** `spec-doc-structure.vitest.ts` only probes `CROSS_ANCHOR_CONTAMINATION` with `routeCat

**35. [P2] [cross-cutting] `memory-context.vitest.ts` uses raw source-text assertions for key handler guarantees instead of exercising the runtime path.**
  - Layer: code-layer | Iter: 32
  - Evidence: `memory-context.vitest.ts`, `handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:62`
  - **`memory-context.vitest.ts` uses raw source-text assertions for key handler guarantees instead of exercising the runtime path.** The file reads `handlers/memory-context.ts` into `MEMORY_CONTEXT_SOU

**36. [P2] [cross-cutting] `hybrid-search.vitest.ts` leaves important integration contracts at smoke-test strength.**
  - Layer: code-layer | Iter: 32
  - Evidence: `hybrid-search.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:500`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:75`
  - **`hybrid-search.vitest.ts` leaves important integration contracts at smoke-test strength.** The enhanced-search `specFolder` case only checks that a result array exists (`.opencode/skill/system-spe

**37. [P2] [cross-cutting] `search-limits-scoring.vitest.ts` has source-grep integration checks whose names overstate what they prove.**
  - Layer: code-layer | Iter: 33
  - Evidence: `search-limits-scoring.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:239`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230`
  - **`search-limits-scoring.vitest.ts` has source-grep integration checks whose names overstate what they prove.** `T211-HI2`/`T211-HI3`/`T211-HI4` only assert that source files still contain the strin

**38. [P2] [cross-cutting] `vector-index-impl.vitest.ts:135-139` hard-codes `EMBEDDING_DIM` to `1024`, even though the implementation resolves dimensions from the active provide**
  - Layer: code-layer | Iter: 34
  - Evidence: `vector-index-impl.vitest.ts:135`, `vector-index-store.ts:121`, `vector-index-impl.vitest.ts:415`
  - `vector-index-impl.vitest.ts:135-139` hard-codes `EMBEDDING_DIM` to `1024`, even though the implementation resolves dimensions from the active provider (`vector-index-store.ts:121-129`) and the same

**39. [P2] [cross-cutting] `context-server-error-envelope.vitest.ts:5-17` is a pure source-regex test, and large sections of `context-server.vitest.ts` load source text once (`6**
  - Layer: code-layer | Iter: 36
  - Evidence: `context-server-error-envelope.vitest.ts:5`, `context-server.vitest.ts`
  - `context-server-error-envelope.vitest.ts:5-17` is a pure source-regex test, and large sections of `context-server.vitest.ts` load source text once (`66-72`) and assert lexical patterns such as `pars

**40. [P2] [cross-cutting] `search-flags.ts` has outgrown its dedicated parser coverage.**
  - Layer: code-layer | Iter: 38
  - Evidence: `search-flags.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:123`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:282`
  - **`search-flags.ts` has outgrown its dedicated parser coverage.** The module now owns many separately parsed env gates, including planner/save flags (`.opencode/skill/system-spec-kit/mcp_server/lib/

**41. [P2] [cross-cutting] The schema-validation suite never exercises the tool families implicated above.**
  - Layer: code-layer | Iter: 44
  - Evidence: `tests/tool-input-schema.vitest.ts`, `tool-schemas.ts`, `tool-input-schemas.ts`
  - **The schema-validation suite never exercises the tool families implicated above.** `tests/tool-input-schema.vitest.ts` covers memory/checkpoint/session/causal schemas, but there are no `code_graph_

**42. [P2] [cross-cutting] The only remaining coverage-graph suites in this slice are archived contract stubs, not live handler tests.**
  - Layer: code-layer | Iter: 46
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:11`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts:11`, `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:42`
  - **The only remaining coverage-graph suites in this slice are archived contract stubs, not live handler tests.** The requested live paths no longer exist under `tests/`; the surviving files are under

**43. [P2] [cross-cutting] `handler-helpers.vitest.ts` silently skips large chunks of coverage when imports fail.**
  - Layer: code-layer | Iter: 47
  - Evidence: `handler-helpers.vitest.ts`, `handler-helpers.vitest.ts:63`, `handler-helpers.vitest.ts:200`
  - **`handler-helpers.vitest.ts` silently skips large chunks of coverage when imports fail.** `handler-helpers.vitest.ts:63-94` catches import failures and stores `null`, and many tests then early-retu

**44. [P2] [cross-cutting] False-positive parameter tests in `handler-memory-triggers.vitest.ts`.**
  - Layer: code-layer | Iter: 48
  - Evidence: `handler-memory-triggers.vitest.ts`, `memory-triggers.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:231`
  - **False-positive parameter tests in `handler-memory-triggers.vitest.ts`.** `T517-7` and `T517-8` are labeled as `limit` / `turnNumber` validation, but they only re-check that `handleMemoryMatchTrigg

**45. [P2] [cross-cutting] `n3lite-consolidation.vitest.ts` leaves the positive heuristic contradiction path unpinned.**
  - Layer: code-layer | Iter: 49
  - Evidence: `n3lite-consolidation.vitest.ts`, `mcp_server/tests/n3lite-consolidation.vitest.ts:143`, `Array.is`
  - **`n3lite-consolidation.vitest.ts` leaves the positive heuristic contradiction path unpinned.** `mcp_server/tests/n3lite-consolidation.vitest.ts:143-153` seeds an explicit "Always use JWT" vs "Never

**46. [P2] [cross-cutting] `search-limits-scoring.vitest.ts` uses source-text presence/count assertions where behavior assertions are needed.**
  - Layer: code-layer | Iter: 50
  - Evidence: `search-limits-scoring.vitest.ts`, `memory-search.ts`, `cross-encoder.ts`
  - **`search-limits-scoring.vitest.ts` uses source-text presence/count assertions where behavior assertions are needed.** The `T211-HI1`-`T211-HI4` block opens `memory-search.ts`, `cross-encoder.ts`, a

**47. [P2] [cross-cutting] The shadow scheduler tests miss the concurrency/singleton guards that actually protect runtime correctness.**
  - Layer: code-layer | Iter: 50
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:395`, `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:487`, `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:509`
  - **The shadow scheduler tests miss the concurrency/singleton guards that actually protect runtime correctness.** Production code explicitly short-circuits overlapping cycles via `evaluationInFlight`,


### 3.7. Stale References (21 findings: 0 P0, 8 P1, 13 P2)

*References to removed features, renamed files, deprecated patterns*

**1. [P1] [cross-cutting] `deep_loop_graph_status` does not return the fields its own public contract promises.**
  - Layer: code-layer | Iter: 1
  - Evidence: `tool-schemas.ts:749`, `tools/index.ts:17`, `tools/lifecycle-tools.ts:38`
  - 1. **The published `deep_loop_graph_*` MCP surface is dead at runtime.** `tool-schemas.ts:749-842` advertises four L9 coverage-graph tools, but `tools/index.ts:17-39` never registers a coverage-graph 

**2. [P1] [009] P1-002: 001 packet still mixes the live `001-...` identity with stale `Phase 014` / `014-playbook-prompt-rewrite` references**
  - Layer: doc-layer | Iter: 2
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/description.json:2`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/graph-metadata.json:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md:67`
  - #### P1-002: 001 packet still mixes the live `001-...` identity with stale `Phase 014` / `014-playbook-prompt-rewrite` references

**3. [P1] [cross-cutting] `MEMORY METADATA` inline comments can override the real tier with stale frontmatter defaults**
  - Layer: code-layer | Iter: 12
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1032`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1032`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1092`
  - **`MEMORY METADATA` inline comments can override the real tier with stale frontmatter defaults** - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1032-1052,1092-1111,1232-1279

**4. [P1] [cross-cutting] Cross-anchor contamination is validating against stale route names, not the live 8-category router contract.**
  - Layer: code-layer | Iter: 30
  - Evidence: `contaminationPlan.route`, `validate.sh`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:138`
  - **Cross-anchor contamination is validating against stale route names, not the live 8-category router contract.** `validateCrossAnchorContamination()` still normalizes to legacy labels like `delivery

**5. [P1] [cross-cutting] `includeArchived` is also dead code in keyword and multi-concept search, and the impl suite never exercises the advertised option.**
  - Layer: code-layer | Iter: 34
  - Evidence: `vector-index-queries.ts:343`, `vector-index-impl.vitest.ts:681`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:343`
  - **`includeArchived` is also dead code in keyword and multi-concept search, and the impl suite never exercises the advertised option.** `vector-index-queries.ts:343-345:multi_concept_search` and `616

**6. [P1] [009] Stale canonical plan link in `009/003`**
  - Layer: doc-layer | Iter: 42
  - Evidence: `009-playbook-and-remediation/003-deep-review-remediation/plan.md:4`, `016-deep-review-remediation/spec.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/003-deep-review-remediation/plan.md:4`
  - **Stale canonical plan link in `009/003`** — `009-playbook-and-remediation/003-deep-review-remediation/plan.md:4` still points `parent_spec` at `016-deep-review-remediation/spec.md`, even though the

**7. [P1] [cross-cutting] Claude Code's agent-delegation reference still advertises removed agent IDs (`speckit`, `research`) as live runtime targets.**
  - Layer: code-layer | Iter: 64
  - Evidence: `.opencode/agent/research.md`, `.opencode/skill/cli-claude-code/references/agent_delegation.md:83`, `.opencode/skill/cli-claude-code/references/agent_delegation.md:92`
  - 1. **Claude Code's agent-delegation reference still advertises removed agent IDs (`speckit`, `research`) as live runtime targets.**

**8. [P1] [cross-cutting] 1. `CLAUDE.md` carries a stale Gate 3 phase-boundary rule that conflicts with the shared runtime contract and the current command trace.**
  - Layer: code-layer | Iter: 69
  - Evidence: `CLAUDE.md`, `CLAUDE.md:129`, `AGENTS.md:182`
  - 1. `CLAUDE.md` carries a stale Gate 3 phase-boundary rule that conflicts with the shared runtime contract and the current command trace.

**9. [P2] [014] 014 machine-readable freshness is stale against its own canonical metadata pair.**
  - Layer: doc-layer | Iter: 7
  - Evidence: `014/graph-metadata.json:123`, `014/description.json:12`
  - **014 machine-readable freshness is stale against its own canonical metadata pair.** `014/graph-metadata.json:123-125` still reports `last_save_at` as `2026-04-15T10:00:01Z`, while `014/description.

**10. [P2] [cross-cutting] Coverage is too shallow to catch either the dead wiring or the blocker bug above.**
  - Layer: code-layer | Iter: 11
  - Evidence: `post-save-review.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22`, `.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:50`
  - **Coverage is too shallow to catch either the dead wiring or the blocker bug above.** `post-save-review.vitest.ts` only asserts the all-green path and penalty cap (`.opencode/skill/system-spec-kit/s

**11. [P2] [009] `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/checklist.md:95` still de**
  - Layer: doc-layer | Iter: 26
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/checklist.md:95`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite/checklist.md:95` still defers CHK-052 to `memory/`, which is a deprecated

**12. [P2] [cross-cutting] Dead branch in adjacency construction hides the real invariant**
  - Layer: code-layer | Iter: 40
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:89`, `edge.sourc`
  - **Dead branch in adjacency construction hides the real invariant** - `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:89-92`: line 91 can never execute because line 90 already

**13. [P2] [cross-cutting] `gate-d-regression-memory-tiers.vitest.ts` pre-filters the failure case before it reaches the subject under test.**
  - Layer: code-layer | Iter: 47
  - Evidence: `gate-d-regression-memory-tiers.vitest.ts`, `gate-d-regression-memory-tiers.vitest.ts:76`, `lib/scoring/composite-scoring.ts`
  - **`gate-d-regression-memory-tiers.vitest.ts` pre-filters the failure case before it reaches the subject under test.** `gate-d-regression-memory-tiers.vitest.ts:76-91` removes deprecated rows with `i

**14. [P2] [010] 010/003 still forces maintainers through stale lineage aliases before the checklist is trustworthy.**
  - Layer: doc-layer | Iter: 49
  - Evidence: `010-continuity-research/003-graph-metadata-validation/checklist.md:13`
  - **010/003 still forces maintainers through stale lineage aliases before the checklist is trustworthy.** `010-continuity-research/003-graph-metadata-validation/checklist.md:13-15` records completion 

**15. [P2] [cross-cutting] Stale runtime note:**
  - Layer: code-layer | Iter: 51
  - Evidence: `.opencode/command/create/agent.md:221`, `.opencode/command/create/folder_readme.md:294`
  - **Stale runtime note:** `/create:agent` and `/create:folder_readme` say Gemini uses a “runtime-facing symlink to `.agents/agents`”, but there is no `.agents/**` surface in this repo. The primary `.g

**16. [P2] [cross-cutting] The changelog workflow's scale claim is stale.**
  - Layer: code-layer | Iter: 52
  - Evidence: `.opencode/command/create/assets/create_changelog_auto.yaml:41`, `.opencode/command/create/assets/create_changelog_confirm.yaml:41`
  - **The changelog workflow's scale claim is stale.** Both changelog variants still say they should match `370+ existing changelogs`, but the current tree contains 355 versioned changelog files, so the

**17. [P2] [cross-cutting] mcp-chrome-devtools troubleshooting escalates to a broad name-based kill recipe.**
  - Layer: code-layer | Iter: 60
  - Evidence: `.opencode/skill/mcp-chrome-devtools/README.md:459`
  - **mcp-chrome-devtools troubleshooting escalates to a broad name-based kill recipe.** After a stale-session error, the README tells users to run `pkill -f browser-debugger-cli` (`.opencode/skill/mcp-

**18. [P2] [cross-cutting] Copilot CLI reference has a stale default-model statement.**
  - Layer: code-layer | Iter: 64
  - Evidence: `.opencode/skill/cli-copilot/references/cli_reference.md:132`
  - **Copilot CLI reference has a stale default-model statement.** It marks `claude-sonnet-4.6` as the default model [`.opencode/skill/cli-copilot/references/cli_reference.md:132-139`], while the author

**19. [P2] [cross-cutting] P2 - Dead sibling reference across all four prompt quality cards.**
  - Layer: code-layer | Iter: 65
  - Evidence: `prompt_quality_card.md`, `../prompt_templates.md`, `.opencode/skill/cli-claude-code/assets/prompt_quality_card.md:91`
  - **P2 - Dead sibling reference across all four prompt quality cards.** Each `prompt_quality_card.md` points readers to `../prompt_templates.md` (`.opencode/skill/cli-claude-code/assets/prompt_quality

**20. [P2] [cross-cutting] P2 - The stale `sk-code-web` parent-skill label still propagates through the newly reviewed `sk-code-full-stack` checklist slice.**
  - Layer: code-layer | Iter: 66
  - Evidence: `../../../../SKILL.md`, `Node.js`, `.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/code_quality_checklist.md:665`
  - **P2 - The stale `sk-code-web` parent-skill label still propagates through the newly reviewed `sk-code-full-stack` checklist slice.** The companion link target resolves to `../../../../SKILL.md`, bu

**21. [P2] [010] Stale continuity contract in `level_decision_matrix.md`.**
  - Layer: code-layer | Iter: 68
  - Evidence: `level_decision_matrix.md`, `_memory.conti`, `implementation-summary.md`
  - **Stale continuity contract in `level_decision_matrix.md`.** The `ANCHORS_VALID` rule still says it applies to levels with `memory/` folders and describes semantic indexing in `memory/` artifacts, b


### 3.8. Error Handling Gaps (7 findings: 0 P0, 3 P1, 4 P2)

*Silent failures, missing null guards, swallowed exceptions*

**1. [P1] [cross-cutting] Absolute `specFolder` values let the resume handlers read markdown outside the packet roots.**
  - Layer: code-layer | Iter: 21
  - Evidence: `handover.md`, `implementation-summary.md`, `lib/resume/resume-ladder.ts:523`
  - 1. **Absolute `specFolder` values let the resume handlers read markdown outside the packet roots.** `buildResumeLadder()` accepts an absolute `specFolder`/`fallbackSpecFolder`, treats any existing dir

**2. [P1] [cross-cutting] P1-001 [P1] `discover_graph_metadata()` fails open on corrupt/unreadable skill metadata, so validation/export can succeed with a silently truncated gr**
  - Layer: code-layer | Iter: 27
  - Evidence: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:50`, `graph-metadata.json`, `skill_graph_compiler.py:69`
  - #### P1-001 [P1] `discover_graph_metadata()` fails open on corrupt/unreadable skill metadata, so validation/export can succeed with a silently truncated graph

**3. [P1] [cross-cutting] P1-002 [P1] `get_cached_skill_records()` silently drops unreadable/corrupt `SKILL.md` files, and `health_check()` still reports healthy routing**
  - Layer: code-layer | Iter: 27
  - Evidence: `SKILL.md`, `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:38`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1185`
  - #### P1-002 [P1] `get_cached_skill_records()` silently drops unreadable/corrupt `SKILL.md` files, and `health_check()` still reports healthy routing

**4. [P2] [cross-cutting] `session_bootstrap` silently converts malformed child payloads into `{}` and still reports the composite bootstrap as `"full"` unless the sub-handler **
  - Layer: code-layer | Iter: 29
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:71`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230`
  - `session_bootstrap` silently converts malformed child payloads into `{}` and still reports the composite bootstrap as `"full"` unless the sub-handler throws. `extractData()` swallows JSON parse fail

**5. [P2] [cross-cutting] `extractSpecTitle()` silently discards all read/parse failures, which obscures why title fallback happened.**
  - Layer: code-layer | Iter: 39
  - Evidence: `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:67`, `spec.md`, `.opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12`
  - **`extractSpecTitle()` silently discards all read/parse failures, which obscures why title fallback happened.** The helper returns `''` for every filesystem or frontmatter parse error at `.opencode/

**6. [P2] [cross-cutting] Dataset-shape validation is split across the two scripts and already diverges in operator-facing behavior.**
  - Layer: code-layer | Iter: 42
  - Evidence: `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py:54`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:49`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:68`
  - **Dataset-shape validation is split across the two scripts and already diverges in operator-facing behavior.** The bench loader silently drops rows whose `"prompt"` is missing or blank (`.opencode/s

**7. [P2] [cross-cutting] `session-prime` silently hides startup-brief regressions.**
  - Layer: code-layer | Iter: 44
  - Evidence: `../../lib/code-graph/startup-brief.js`, `hooks/claude/session-prime.ts:35`, `hooks/claude/session-prime.ts:117`
  - **`session-prime` silently hides startup-brief regressions.** The dynamic import for `../../lib/code-graph/startup-brief.js` swallows every failure without logging (`hooks/claude/session-prime.ts:35


### 3.9. Security Observations (5 findings: 0 P0, 1 P1, 4 P2)

*Trust boundaries, input validation, path handling, permission scope*

**1. [P1] [012] NFR-S05**
  - Layer: doc-layer | Iter: 16
  - Evidence: `spec.md:382`, `checklist.md:83`, `intake-contract.md`
  - #### P1-SEC-012-001: NFR-S05 is closed on documentary evidence only, so the fail-closed lock control is not packet-locally verified

**2. [P2] [014] P2-1 - Transcript snapshot hygiene is not packet-localized as a security requirement in 014.**
  - Layer: doc-layer | Iter: 22
  - Evidence: `014-memory-save-planner-first-default/spec.md:112`, `014-memory-save-planner-first-default/checklist.md:70`, `014-memory-save-planner-first-default/implementation-summary.md:69`
  - **P2-1 - Transcript snapshot hygiene is not packet-localized as a security requirement in 014.** `014-memory-save-planner-first-default/spec.md:112,141-143` requires validation against "three real s

**3. [P2] [009] P2-2 - Execution-artifact retention is specified in 009, but artifact sanitization is not.**
  - Layer: doc-layer | Iter: 22
  - Evidence: `009-playbook-and-remediation/002-full-playbook-execution/spec.md:115`, `implementation-summary.md:54`, `checklist.md:85`
  - **P2-2 - Execution-artifact retention is specified in 009, but artifact sanitization is not.** `009-playbook-and-remediation/002-full-playbook-execution/spec.md:115-117` requires manual runner JSON/

**4. [P2] [010] None. This pass only revalidated previously logged 010/012 security-adjacent documentary issues and did not surface a distinct new security regression**
  - Layer: doc-layer | Iter: 24
  - None. This pass only revalidated previously logged 010/012 security-adjacent documentary issues and did not surface a distinct new security regression.

**5. [P2] [cross-cutting] `sanitizeTriggerPhrases()` is order-sensitive when removing shadowed phrases**
  - Layer: code-layer | Iter: 40
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:190`
  - **`sanitizeTriggerPhrases()` is order-sensitive when removing shadowed phrases** - `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:190-198`: shadowing is only checked agains


### 3.10. Placeholder Residue (5 findings: 0 P0, 4 P1, 1 P2)

*Template tokens, TODO/FIXME markers in shipped code*

**1. [P1] [cross-cutting] P1 - Copilot prompt templates ship malformed copy-paste commands that collapse adjacent flags into invalid tokens.**
  - Layer: code-layer | Iter: 65
  - Evidence: `.opencode/skill/cli-copilot/assets/prompt_templates.md`, `.opencode/skill/cli-copilot/assets/prompt_templates.md:105`, `.opencode/skill/cli-copilot/assets/prompt_templates.md:255`
  - **P1 - Copilot prompt templates ship malformed copy-paste commands that collapse adjacent flags into invalid tokens.**

**2. [P1] [cross-cutting] P1 - Code Mode configuration assets contradict their own prefixed-env contract with unprefixed onboarding examples.**
  - Layer: code-layer | Iter: 65
  - Evidence: `config_template.md`, `env_template.md`, `.opencode/skill/mcp-code-mode/assets/config_template.md:347`
  - **P1 - Code Mode configuration assets contradict their own prefixed-env contract with unprefixed onboarding examples.**

**3. [P1] [cross-cutting] 2. The feature-catalog templates still generate `FEATURE_CATALOG.md`, but the shipped create workflow and live packages use `feature_catalog.md`**
  - Layer: code-layer | Iter: 67
  - Evidence: `FEATURE_CATALOG.md`, `feature_catalog.md`, `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md:29`
  - #### 2. The feature-catalog templates still generate `FEATURE_CATALOG.md`, but the shipped create workflow and live packages use `feature_catalog.md`

**4. [P1] [cross-cutting] Broken Level 1 copy command in `template_mapping.md`.**
  - Layer: code-layer | Iter: 68
  - Evidence: `template_mapping.md`, `spec.md`, `-name/spec.md`
  - 1. **Broken Level 1 copy command in `template_mapping.md`.**

**5. [P2] [cross-cutting] The sk-doc skill-template assets teach the anchor convention with self-contradictory examples.**
  - Layer: code-layer | Iter: 68
  - Evidence: `.opencode/skill/sk-doc/assets/skill/skill_asset_template.md:124`, `.opencode/skill/sk-doc/assets/skill/skill_md_template.md:104`, `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md:51`
  - **The sk-doc skill-template assets teach the anchor convention with self-contradictory examples.** Each file says `<!-- ANCHOR:... -->` markers are required immediately before H2 sections, but the e


### 3.11. Cross-Runtime Consistency (1 findings: 0 P0, 1 P1, 0 P2)

*Agent definitions diverge across .claude/ .opencode/ .codex/ .gemini/*

**1. [P1] [cross-cutting] The reviewed Claude/Gemini mirrors no longer share a single source-of-truth contract for agent definitions, so cross-runtime traceability is ambiguous**
  - Layer: code-layer | Iter: 56
  - Evidence: `.opencode/README.md:56`, `.codex/agents/README.txt:4`, `README.md:999`
  - 1. **The reviewed Claude/Gemini mirrors no longer share a single source-of-truth contract for agent definitions, so cross-runtime traceability is ambiguous.** Repo-level docs still describe `.opencode


### 3.12. Reducer & State Management (1 findings: 0 P0, 0 P1, 1 P2)

*JSONL state handling, convergence logic*

**1. [P2] [cross-cutting] Deep-research advertises the wrong archive root**
  - Layer: code-layer | Iter: 35
  - Evidence: `state_paths.archi`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:87`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:115`
  - **Deep-research advertises the wrong archive root** — `state_paths.archive_root` and `step_create_directories` still point at `{spec_folder}/research/archive`, but both restart branches archive to `


### 3.13. Other Findings (44 findings: 0 P0, 20 P1, 24 P2)

*Miscellaneous findings not fitting other categories*

**1. [P1] [cross-cutting] P1-001 [P1] Graph-metadata key file extraction accepts absolute paths and then indexes them verbatim**
  - Layer: code-layer | Iter: 2
  - #### P1-001 [P1] Graph-metadata key file extraction accepts absolute paths and then indexes them verbatim

**2. [P1] [cross-cutting] Impact:**
  - Layer: code-layer | Iter: 2
  - Evidence: `/Users/.../foo.ts`, `graph-metadata.json`
  - **Impact:** A canonical doc that backticks `/Users/.../foo.ts` or another workstation-local path will persist that absolute path into `graph-metadata.json` and surface it through packet indexing/sea

**3. [P1] [cross-cutting] Recommendation:**
  - Layer: code-layer | Iter: 2
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:395`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1021`
  - **Recommendation:** Reject absolute candidates in `keepKeyFile()` or normalize them to repo-relative paths before `resolveKeyFileCandidate()` returns them and before `graphMetadataToIndexableText()`

**4. [P1] [012] P1-012-future-save-timestamp — `graph-metadata.json` future-dates the packet's last-save timestamp**
  - Layer: doc-layer | Iter: 4
  - Evidence: `graph-metadata.json`, `graph-metadata.json`, `description.json`
  - #### P1-012-future-save-timestamp — `graph-metadata.json` future-dates the packet's last-save timestamp

**5. [P1] [cross-cutting] `handleMemoryContext` can return over-budget structural/hybrid payloads.**
  - Layer: code-layer | Iter: 5
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1558`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1582`, `.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:61`
  - 1. **`handleMemoryContext` can return over-budget structural/hybrid payloads.** `enforceTokenBudget()` runs before the handler appends `graphContext`, `queryIntentRouting`, and `structuralRoutingNudge

**6. [P1] [cross-cutting] P1-001 - Tier 3 routing cache can replay the wrong destination for the same text in a different context**
  - Layer: code-layer | Iter: 9
  - #### P1-001 - Tier 3 routing cache can replay the wrong destination for the same text in a different context

**7. [P1] [cross-cutting] P1-002 - Cross-encoder cache violates the `originalRank` contract when callers rerank the same document set in a different order**
  - Layer: code-layer | Iter: 9
  - #### P1-002 - Cross-encoder cache violates the `originalRank` contract when callers rerank the same document set in a different order

**8. [P1] [009] `009/003` execution-plan lineage still points at a non-existent `016` packet**
  - Layer: doc-layer | Iter: 12
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/003-deep-review-remediation/plan.md:4`, `016-deep-review-remediation/spec.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/003-deep-review-remediation/spec.md:6`
  - 1. **`009/003` execution-plan lineage still points at a non-existent `016` packet** — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/003-deep-review-r

**9. [P1] [cross-cutting] `truncateOnWordBoundary` is not actually code-point-safe for astral Unicode input, so it truncates strings that are already within the advertised limi**
  - Layer: code-layer | Iter: 13
  - Evidence: `text.lengt`, `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:14`, `...text`
  - 1. **`truncateOnWordBoundary` is not actually code-point-safe for astral Unicode input, so it truncates strings that are already within the advertised limit.** The helper decides whether truncation is

**10. [P1] [cross-cutting] 1. Compact recovery can drop the recovered payload while still clearing the cache**
  - Layer: code-layer | Iter: 15
  - #### 1. Compact recovery can drop the recovered payload while still clearing the cache

**11. [P1] [cross-cutting] 2. `resolveDatabasePaths()` does not actually enforce its documented realpath-based escape check**
  - Layer: code-layer | Iter: 15
  - #### 2. `resolveDatabasePaths()` does not actually enforce its documented realpath-based escape check

**12. [P1] [cross-cutting] Bounded search contract is broken for valid custom parameter spaces.**
  - Layer: code-layer | Iter: 18
  - Evidence: `Math.round`, `bounds.max`, `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:181`
  - **Bounded search contract is broken for valid custom parameter spaces.** `sampleConfig()` computes the number of admissible steps with `Math.round(range / step)` and then emits `min + stepIndex * st

**13. [P1] [009] P1-1: `003-deep-review-remediation/plan.md` points the remediation plan at a nonexistent `016-deep-review-remediation/spec.md`, so reviewers cannot tr**
  - Layer: doc-layer | Iter: 26
  - Evidence: `003-deep-review-remediation/plan.md`, `016-deep-review-remediation/spec.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/003-deep-review-remediation/plan.md:4`
  - #### P1-1: `003-deep-review-remediation/plan.md` points the remediation plan at a nonexistent `016-deep-review-remediation/spec.md`, so reviewers cannot trace the plan to its owning spec packet.

**14. [P1] [cross-cutting] 1. `session_resume(minimal)` does not honor its published minimal-mode contract. The public schema says minimal mode should omit the full memory paylo**
  - Layer: code-layer | Iter: 29
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:710`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:425`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:493`
  - 1. `session_resume(minimal)` does not honor its published minimal-mode contract. The public schema says minimal mode should omit the full memory payload, but the handler still runs the resume ladder a

**15. [P1] [cross-cutting] `resolveDatabasePaths()` promises late env override support, but the server core still runs on import-time path snapshots.**
  - Layer: code-layer | Iter: 36
  - Evidence: `core/config.ts:45`, `core/config.ts:83`, `context-server.ts`
  - **`resolveDatabasePaths()` promises late env override support, but the server core still runs on import-time path snapshots.** `core/config.ts:45-48` says the DB dir is re-checked at call time "to s

**16. [P1] [cross-cutting] 1. `memory_stats.excludePatterns` claims regex support, but `handleMemoryStats()` only performs literal substring checks**
  - Layer: code-layer | Iter: 37
  - Evidence: `memory_stats.exclu`
  - #### 1. `memory_stats.excludePatterns` claims regex support, but `handleMemoryStats()` only performs literal substring checks

**17. [P1] [cross-cutting] The Gate D latency benchmarks time mocked facsimiles, not the canonical hot paths they claim to guard.**
  - Layer: code-layer | Iter: 46
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:13`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-memory-search.vitest.ts:170`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts:11`
  - **The Gate D latency benchmarks time mocked facsimiles, not the canonical hot paths they claim to guard.** The memory-search benchmark replaces the pipeline, formatter, cache, intent, session, eval,

**18. [P1] [cross-cutting] mcp-code-mode README advertises configured servers and runnable examples that do not exist in the active Code Mode inventory.**
  - Layer: code-layer | Iter: 60
  - Evidence: `.opencode/skill/mcp-code-mode/README.md:42`, `.opencode/skill/mcp-code-mode/README.md:173`, `.opencode/skill/mcp-code-mode/README.md:282`
  - **mcp-code-mode README advertises configured servers and runnable examples that do not exist in the active Code Mode inventory.** The README says Code Mode applies to configured tools including Webf

**19. [P1] [010] folder_routing.md still documents a retired `[packet]/memory/` save contract instead of the live packet-first canonical save path.**
  - Layer: code-layer | Iter: 63
  - Evidence: `folder_routing.md`, `generate-context.js`, `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244`
  - **folder_routing.md still documents a retired `[packet]/memory/` save contract instead of the live packet-first canonical save path.** The runtime-loaded routing guide says `generate-context.js` wri

**20. [P1] [cross-cutting] The structure references still present `memory/` directories as the normal child-packet surface and miss current metadata expectations.**
  - Layer: code-layer | Iter: 63
  - Evidence: `folder_structure.md`, `phase_definitions.md`, `sub_folder_versioning.md`
  - **The structure references still present `memory/` directories as the normal child-packet surface and miss current metadata expectations.** `folder_structure.md`, `phase_definitions.md`, and `sub_fo

**21. [P2] [cross-cutting] Handler/storage scope logic is internally inconsistent.**
  - Layer: code-layer | Iter: 1
  - Evidence: `handlers/checkpoints.ts:245`, `lib/storage/checkpoints.ts:419`
  - **Handler/storage scope logic is internally inconsistent.** `handlers/checkpoints.ts:245-260` treats missing checkpoint metadata as a match for scoped requests, while `lib/storage/checkpoints.ts:419

**22. [P2] [cross-cutting] `wrapSectionsWithAnchors()` does not actually preserve all existing anchor layouts.**
  - Layer: code-layer | Iter: 3
  - Evidence: `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:178`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:326`, `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:155`
  - **`wrapSectionsWithAnchors()` does not actually preserve all existing anchor layouts.** The guard that decides whether a heading is already wrapped only looks back two lines for `<!-- ANCHOR:... -->

**23. [P2] [cross-cutting] deterministic-extractor parenthetical alias support is missing despite the module contract saying it exists.**
  - Layer: code-layer | Iter: 9
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:114`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:521`, `.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:126`
  - **deterministic-extractor parenthetical alias support is missing despite the module contract saying it exists.** `extractAliases()` documents support for `"X (Y)"`, but the implementation only handl

**24. [P2] [010] `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/**
  - Layer: doc-layer | Iter: 15
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/spec.md:2`, `tasks.md:3`, `checklist.md:17`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/002-content-routing-accuracy/005-task-update-merge-safety/spec.md:2-5` still marks the task-update safety 

**25. [P2] [cross-cutting] The exported vector-index write surface does not enforce the same file-boundary checks that the read surface assumes.**
  - Layer: code-layer | Iter: 22
  - Evidence: `SQLiteVectorStore.upser`, `metadata.file`, `process.cwd`
  - **The exported vector-index write surface does not enforce the same file-boundary checks that the read surface assumes.** `index_memory()` persists caller-supplied `filePath` values without any `val

**26. [P2] [009] `SQLiteVectorStore.close()` is process-global rather than instance-scoped.**
  - Layer: code-layer | Iter: 22
  - Evidence: `SQLiteVectorStore.close`, `storeA.close`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:379`
  - **`SQLiteVectorStore.close()` is process-global rather than instance-scoped.** The class supports per-instance `dbPath` pinning, and the remediation suite explicitly treats separate store instances 

**27. [P2] [012] 012 should add a planner-first caveat anywhere it repositions `/memory:save` as the canonical handover maintainer.**
  - Layer: doc-layer | Iter: 25
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/spec.md:53`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default/spec.md:59`
  - **012 should add a planner-first caveat anywhere it repositions `/memory:save` as the canonical handover maintainer.** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonic

**28. [P2] [014] `level` is a required public input, but this validator never consumes it.**
  - Layer: code-layer | Iter: 30
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:55`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1518`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1063`
  - **`level` is a required public input, but this validator never consumes it.** `SpecDocRuleOptions` and the CLI require `level`, and `memory-save` computes/passes packet level into the validator, but

**29. [P2] [012] P2 - 012 checklist's internal M10-M15 roll-up comment no longer matches the visible severity labels.**
  - Layer: doc-layer | Iter: 35
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/checklist.md:271`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup/checklist.md:311`
  - **P2 - 012 checklist's internal M10-M15 roll-up comment no longer matches the visible severity labels.** The visible body labels `CHK-092` as `[P2]`, but the embedded roll-up comment counts `CHK-092

**30. [P2] [009] P2-038-01 - Phase 015 repeats volatile execution totals in multiple packet docs.**
  - Layer: doc-layer | Iter: 38
  - Evidence: `002-full-playbook-execution/tasks.md:73`, `002-full-playbook-execution/tasks.md:92`, `002-full-playbook-execution/implementation-summary.md:58`
  - **P2-038-01 - Phase 015 repeats volatile execution totals in multiple packet docs.** `002-full-playbook-execution/tasks.md:73-77` and `002-full-playbook-execution/tasks.md:92-116` publish the automa

**31. [P2] [cross-cutting] Import-order-sensitive path allowlist in `vector-index-store.ts`.**
  - Layer: code-layer | Iter: 38
  - Evidence: `vector-index-store.ts`, `process.env`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:289`
  - **Import-order-sensitive path allowlist in `vector-index-store.ts`.** `ALLOWED_BASE_PATHS` is built once at module load from `process.env.MEMORY_ALLOWED_PATHS`, and both `validate_file_path_local()`

**32. [P2] [cross-cutting] `decision-record.md` collapses ADR-001 through ADR-007 under a single `adr-001` anchor block (`decision-record.md:41-42`, `decision-record.md:91`, `de**
  - Layer: doc-layer | Iter: 41
  - Evidence: `decision-record.md`, `decision-record.md:41`, `decision-record.md:91`
  - `decision-record.md` collapses ADR-001 through ADR-007 under a single `adr-001` anchor block (`decision-record.md:41-42`, `decision-record.md:91`, `decision-record.md:140`, `decision-record.md:187`,

**33. [P2] [014] `014-memory-save-planner-first-default/decision-record.md` keeps seven ADRs inside one shared `adr-001` anchor and models ADR-002 through ADR-007 as `**
  - Layer: doc-layer | Iter: 45
  - Evidence: `014-memory-save-planner-first-default/decision-record.md`, `decision-record.md:41`, `decision-record.md:91`
  - `014-memory-save-planner-first-default/decision-record.md` keeps seven ADRs inside one shared `adr-001` anchor and models ADR-002 through ADR-007 as `###` children of ADR-001 instead of sibling ADR 

**34. [P2] [cross-cutting] `T12` validates a hand-built `DegradedModeContract` object instead of driving `hybridAdaptiveFuse()` through its real error branch.**
  - Layer: code-layer | Iter: 45
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:233`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:397`
  - **`T12` validates a hand-built `DegradedModeContract` object instead of driving `hybridAdaptiveFuse()` through its real error branch.** The production degraded response is assembled only inside the 

**35. [P2] [009] P2-046-01**
  - Layer: doc-layer | Iter: 46
  - Evidence: `spec.md:30`, `plan.md:4`, `checklist.md:23`
  - **P2-046-01** `009-playbook-and-remediation/003-deep-review-remediation` still mixes retired packet aliases inside the live packet, which makes packet-local maintenance unnecessarily error-prone. `s

**36. [P2] [cross-cutting] Missing reference guide:**
  - Layer: code-layer | Iter: 51
  - Evidence: `Tools.md`, `.opencode/command/create/folder_readme.md:496`
  - **Missing reference guide:** `/create:folder_readme` points install-guide generation at `.opencode/install_guides/MCP - Chrome Dev Tools.md`, but no Chrome install guide exists under `.opencode/inst

**37. [P2] [cross-cutting] sk-code-full-stack gives a non-resolvable path for the review quick reference.**
  - Layer: code-layer | Iter: 58
  - Evidence: `sk-code-review/references/quick_reference.md`, `.opencode/skill/sk-code-full-stack/SKILL.md:57`, `.opencode/skill/sk-code-review/references/quick_reference.md`
  - **sk-code-full-stack gives a non-resolvable path for the review quick reference.** The review baseline contract tells consumers to load `sk-code-review/references/quick_reference.md` (`.opencode/ski

**38. [P2] [cross-cutting] mcp-code-mode troubleshooting claims `UTCP_CONFIG_FILE` must be absolute even though the live setup uses a relative path and the server resolves it co**
  - Layer: code-layer | Iter: 60
  - Evidence: `.opencode/skill/mcp-code-mode/README.md:388`, `.utcp_config.json`, `opencode.json:47`
  - **mcp-code-mode troubleshooting claims `UTCP_CONFIG_FILE` must be absolute even though the live setup uses a relative path and the server resolves it correctly.** The README says startup failures co

**39. [P2] [cross-cutting] troubleshooting.md still assumes current packets use `memory/` note files.**
  - Layer: code-layer | Iter: 63
  - Evidence: `troubleshooting.md`, `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:53`, `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:124`
  - **troubleshooting.md still assumes current packets use `memory/` note files.** It prescribes `mkdir -p specs/###-feature/memory/`, treats "memory folder empty" as a current retrieval problem, and te

**40. [P2] [cross-cutting] folder_routing.md's "moderate alignment" worked example is internally impossible.**
  - Layer: code-layer | Iter: 63
  - Evidence: `folder_routing.md`, `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:398`
  - **folder_routing.md's "moderate alignment" worked example is internally impossible.** It labels a 1/3 keyword overlap as a 50-69% case while also computing the score as 33%, then shows the moderate-

**41. [P2] [cross-cutting] environment_variables.md narrows `AUTO_SAVE_MODE` to hooks even though the live selector uses it in folder auto-detect and prompt suppression.**
  - Layer: code-layer | Iter: 63
  - Evidence: `environment_variables.md`, `.opencode/skill/system-spec-kit/references/config/environment_variables.md:108`, `folder-detector.ts`
  - **environment_variables.md narrows `AUTO_SAVE_MODE` to hooks even though the live selector uses it in folder auto-detect and prompt suppression.** The reference says `AUTO_SAVE_MODE` "Skip[s] alignm

**42. [P2] [cross-cutting] Copilot integration patterns file contains an unresolved duplicate tail/merge artifact.**
  - Layer: code-layer | Iter: 64
  - Evidence: `.opencode/skill/cli-copilot/references/integration_patterns.md:264`
  - **Copilot integration patterns file contains an unresolved duplicate tail/merge artifact.** The file cleanly closes one `CROSS-VALIDATION` + `ANTI-PATTERNS` pair at lines 264-309, then immediately a

**43. [P2] [cross-cutting] `CLAUDE.md:75-81` tells recovery to re-read `.claude/CLAUDE.md`, but the live workspace only ships `./CLAUDE.md` plus archived/spec copies under `spec**
  - Layer: code-layer | Iter: 69
  - Evidence: `CLAUDE.md:75`, `.claude/CLAUDE.md`, `./CLAUDE.md`
  - `CLAUDE.md:75-81` tells recovery to re-read `.claude/CLAUDE.md`, but the live workspace only ships `./CLAUDE.md` plus archived/spec copies under `specs/`; there is no live `./.claude/CLAUDE.md` path

**44. [P2] [cross-cutting] `CLAUDE.md` points recovery readers at a runtime-doc path that is not present in this repo.**
  - Layer: code-layer | Iter: 70
  - Evidence: `CLAUDE.md`, `.claude/CLAUDE.md`, `CLAUDE.md:80`
  - **`CLAUDE.md` points recovery readers at a runtime-doc path that is not present in this repo.** The recovery checklist says to re-read `.claude/CLAUDE.md` if runtime-specific instructions exist (`CL


### 3.14. Published Contract vs Live Runtime Drift (cross-cutting pattern)

*Recurring pattern where published tool schemas, README entrypoints, agent directories, and MCP tool inventories do not match the actual runtime. Found scattered across multiple sections but never named as a systemic pattern.*

**1. [P1] [cross-cutting] `deep_loop_graph_status` missing promised `schemaVersion` / DB-size fields**
  - Layer: code-layer | Iter: 1
  - Evidence: `iteration-001.md:45-80`
  - The MCP tool `deep_loop_graph_status` promises `schemaVersion` and database-size fields in its schema but the handler does not return them. Consumers relying on the published contract get undefined values.

**2. [P1] [cross-cutting] Compact recovery hook can clear cached state before stdout flush**
  - Layer: code-layer | Iter: 15
  - Evidence: `iteration-015.md:24-40`, `session-prime.ts`
  - The `session-prime` hook clears `pendingCompactPrime` and exits before the recovered payload is durably written to stdout, risking loss of post-compaction recovery context.

**3. [P1] [cross-cutting] Folder-scoped validators accept arbitrary absolute paths**
  - Layer: code-layer | Iter: 8
  - Evidence: `iteration-008.md:41-58`
  - `validateMergeLegality()` and `validatePostSaveFingerprint()` can be steered at unrelated absolute paths outside the spec folder, causing folder-scoped validation to succeed or fail on the wrong file entirely.

*Additional examples from iterations: wrong Claude custom-agent runtime directory in cli-claude-code (iter 60), overstated Code Mode inventory (iter 60), root docs' non-existent generate-context.js entrypoint (iter 70).*

### 3.15. Path / Scope-Boundary Hardening (cross-cutting pattern)

*Same class of bug recurring across different surfaces: out-of-folder absolute-path validation, symlink-based DB-directory escape, cross-root path handling. Related to the P0 reconsolidation scope-crossing but manifests more broadly.*

*Examples: folder-scoped validator absolute-path escape (iter 8), symlink-based DB-directory escape in `resolveDatabasePaths()` (iter 15), `skill_graph_scan` traversing outside workspace (iter 23). These should be treated as one systemic boundary-validation gap.*

---

## 4. Recommendations & Remediation Workstreams

### Workstream 0: P0 Reconsolidation Scope-Boundary Fix (P0, 1 finding) — BLOCKER

**Problem:** The sole P0 blocker: governed save-time reconsolidation in `reconsolidation-bridge.ts:208-250` can cross scope boundaries (`tenant_id`, `user_id`, `agent_id`, `session_id`) and persist the merged survivor without governance metadata. This is a data-integrity and security issue.

**Action:**
- Add scope-boundary validation before reconsolidation merge: verify `tenant_id`, `user_id`, `agent_id` match between candidate and survivor
- If scope mismatch, abort reconsolidation and preserve both records
- Add regression test covering cross-scope reconsolidation attempt
- Audit all callers of `reconsolidation-bridge` for similar boundary assumptions

**Estimated effort:** Medium (4-8 hours — critical path, blocks release)

### Workstream 0b: Path-Boundary Hardening (P1, ~5 findings)

**Problem:** Multiple surfaces accept absolute paths or symlinks that escape the intended scope: folder-scoped validators, DB-directory resolution, skill-graph scan. Same bug class as the P0 but in different components.

**Action:**
- Add `path.resolve()` + `startsWith(allowedRoot)` guard to all folder-scoped validators
- Reject symlinks in `resolveDatabasePaths()` or resolve them and re-validate
- Add workspace-root boundary check to `skill_graph_scan` dispatch
- Add regression tests for path-escape attempts

**Estimated effort:** Medium (4-6 hours)

### Workstream 0c: Public-Contract Verification Pass (P1, ~8 findings)

**Problem:** Published tool schemas, README entrypoints, agent directories, and MCP tool inventories do not match actual runtime behavior. Consumers relying on published contracts get undefined values or wrong paths.

**Action:**
- Diff every MCP tool-schema field list against the actual handler response
- Verify every README/SKILL.md entrypoint path exists on disk
- Cross-check agent runtime directories across all 4 runtimes
- Fix or remove dead tool registrations

**Estimated effort:** Medium (4-8 hours)

### Workstream 1: Status Drift Cleanup (P1, ~28 findings)

**Problem:** Across all four packets, spec.md and plan.md files still say `planned` or `Draft` while checklists are fully checked and graph-metadata reports `complete`.

**Action:** Batch update all spec/plan frontmatter `status` fields to match the actual completion state. Script-automatable:
- For each completed packet: set `spec.md` status → Complete, `plan.md` status → Complete
- Verify `graph-metadata.json` status field matches
- Run `validate.sh --strict` after each update

**Estimated effort:** Low (1-2 hours, mostly search-replace + validation)

### Workstream 2: Packet 014 Identity Fix (P1, ~5 findings)

**Problem:** Packet 014 (memory-save-planner-first-default) still references `Packet 016`, `SC-016`, `CHK-016-*` across spec, tasks, and checklist. The live packet ID is 014.

**Action:** Global search-replace `016` → `014` in all 014 packet docs, then verify no cross-contamination with the actual 016 (release-alignment).

**Estimated effort:** Low (30 min)

### Workstream 3: Command & Workflow Integrity (P1, ~16 findings)

**Problem:** Command YAML workflows have stale step references, missing error recovery paths, references to removed commands (e.g., `spec_kit:start` folded into `spec_kit:plan`), and inconsistent gate logic.

**Action:** Audit each `spec_kit_*.yaml` workflow against the current command surface. Remove references to retired commands. Verify gate logic matches the current runtime.

**Estimated effort:** Medium (4-8 hours)

### Workstream 4: Agent & Skill Doc Refresh (P1, ~37 findings)

**Problem:** Agent definitions across runtimes (.claude/, .opencode/, .codex/, .gemini/) have drifted. SKILL.md files reference removed capabilities, stale tool lists, or outdated integration patterns.

**Action:**
- Run a cross-runtime diff for each agent (deep-review, context, orchestrate, etc.)
- Update SKILL.md files to match current code behavior
- Remove references to deprecated tools/capabilities
- Verify all `references/` and `assets/` files are current

**Estimated effort:** Medium-High (8-16 hours)

### Workstream 5: Test Quality Improvements (P1/P2, ~47 findings)

**Problem:** Vitest suites have false-positive tests (tests that pass even when assertions are wrong), missing edge cases (null inputs, empty arrays, concurrent access), and brittle snapshot assumptions.

**Action:**
- Audit each flagged test file for assertion correctness
- Add negative test cases for critical paths (memory-save, search pipeline, convergence)
- Replace brittle snapshot tests with structural assertions

**Estimated effort:** High (16-24 hours)

### Workstream 6: Traceability & Evidence Gaps (P1, ~25 findings)

**Problem:** Checklist evidence doesn't trace to first-order proof surfaces. Implementation-summary.md files are missing or contain placeholder content. Cross-reference chains are broken.

**Action:**
- For each packet: verify every checklist item has a file:line evidence reference
- Write missing implementation-summary.md files (009/003, etc.)
- Fix broken cross-reference links in spec docs

**Estimated effort:** Medium (4-8 hours)

### Workstream 7: Error Handling & Security Hardening (P1/P2, ~12 findings)

**Problem:** Silent failures in error paths, missing null guards in handlers, overly broad tool permissions in agent definitions, and unvalidated inputs at system boundaries.

**Action:**
- Add explicit error propagation where failures are currently swallowed
- Add null/undefined guards at handler entry points
- Tighten agent tool permissions to minimum required set
- Validate all inputs at MCP handler boundaries

**Estimated effort:** Medium (4-8 hours)

### Workstream 8: Stale Reference & Placeholder Cleanup (P1/P2, ~26 findings — includes 12 P1s)

**Problem:** References to removed features, renamed files, deprecated patterns, and template placeholders still present in shipped code and docs. Contrary to prior labeling, this bucket contains ~12 P1-severity items including wrong agent directories, malformed copy-paste commands, and bad entrypoints that affect runtime behavior — not just cosmetic staleness.

**Action:**
- Grep-and-fix pass for known stale patterns (file renames, deprecated tool names)
- Prioritize the 12 P1 items (wrong paths, broken commands) over cosmetic P2s
- Verify all entrypoint references resolve to existing files

**Estimated effort:** Medium (4-6 hours — elevated from Low due to P1 content)

---

## 5. Priority Matrix

| Priority | Workstream | Findings | Effort | Impact |
|---|---|---|---|---|
| **0** | **P0 Reconsolidation scope-boundary fix** | **1** | **Medium** | **BLOCKER — data integrity + security** |
| **0b** | Path-boundary hardening | 5 | Medium | Production safety — scope escapes |
| **0c** | Public-contract verification | 8 | Medium | Runtime correctness — schema/entrypoint drift |
| **1** | Command & workflow integrity | 16 | Medium | Runtime correctness |
| **2** | Error handling & security | 12 | Medium | Production safety |
| **3** | Stale refs & placeholders (incl. 12 P1s) | 26 | Medium | Runtime correctness + maintainability |
| **4** | Packet 014 identity fix | 5 | Low | Blocks clean changelog |
| **5** | Status drift cleanup | 28 | Low | Blocks clean changelog |
| **6** | Traceability & evidence | 25 | Medium | Audit compliance |
| **7** | Agent & skill doc refresh | 37 | Medium-High | Cross-runtime correctness |
| **8** | Test quality | 47 | High | Regression prevention |

---

## 6. Audit Appendix

### Review Configuration

| Setting | Value |
|---|---|
| Doc-layer iterations | 50 (015-combined-deep-review-four-specs) |
| Code+ops iterations | 70 (015-implementation-deep-review) |
| Total iterations | 120 |
| Dispatcher | cli-copilot gpt-5.4, effort=high |
| Concurrency | 3 (capped due to GitHub API throttling) |
| Convergence threshold | 0.10 |
| Doc-layer scope | 200 spec artifacts across 4 packets |
| Code-layer scope | 326 code files (JS/TS/Python/Shell/YAML) |
| Ops-layer scope | 394 operational docs (commands, agents, skills, refs) |

### Dimension Coverage

| Dimension | Doc-Layer Iters | Code-Layer Iters | Total |
|---|---|---|---|
| Inventory | 1 | 4 | 5 |
| Correctness | 12 | 14 | 26 |
| Security | 12 | 10 | 22 |
| Traceability | 12 | 8 | 20 |
| Maintainability | 12 | 8 | 20 |
| Test Quality | 0 | 6 | 6 |
| Operational Docs | 0 | 20 | 20 |
| Final Sweep | 1 | 0 | 1 |

### Files Reviewed
Total unique files in scope: ~920
