# Automation Self-Management Deep Research Report

## 1. Executive Summary

The automation estate is not purely self-managing. Across 50 unique reality-map rows, the distribution is **Auto 14**, **Half 14**, **Manual 18**, and **Aspirational 4**. The strongest pattern is read-path or startup automation surrounded by explicit operator commands and runtime-specific fallbacks.

No P0 findings surfaced. The top P1 findings are: structural code graph watcher claims are documented more broadly than the implementation supports (`research/iterations/iteration-002.md:32`, `research/iterations/iteration-002.md:35-38`); retention metadata exists but no sweep path was found (`research/iterations/iteration-004.md:36`, `research/iterations/iteration-004.md:40-43`); Copilot hook wiring docs conflict (`research/iterations/iteration-005.md:27`, `research/iterations/iteration-005.md:30-33`); and Codex hook readiness docs/config disagree (`research/iterations/iteration-005.md:28`, `research/iterations/iteration-005.md:35-38`).

Convergence reached the requested 7 iterations. New info ratios were 0.82, 0.74, 0.68, 0.71, 0.63, 0.39, and 0.18. The early-stop rule did not trigger because there were not two consecutive iterations below 0.10 and new P1 synthesis remained active through iteration 6.

## 2. Research Questions Answered

### RQ1 - Skill Advisor Entry Points

The skill advisor has real automatic entry points for Claude, Gemini, and OpenCode plugin flows, but Copilot and Codex depend on weaker or runtime-gated paths. Manual CLI and MCP advisor paths remain important operator tools. Evidence: Claude hook returns `additionalContext` (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:149-190`), Gemini hook returns `additionalContext` (`.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:139-204`), Copilot writes custom instructions because hook output is ignored (`.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1-7`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:101-190`), Codex has timeout fallback behavior (`.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:174-180`), and the OpenCode plugin appends advisor briefs in-process (`.opencode/plugins/spec-kit-skill-advisor.js:567-663`).

| Claim | Actual behavior | Gap class | Recommended action |
|-------|-----------------|-----------|--------------------|
| Claude advisor hook auto-surfaces guidance. | UserPromptSubmit builds a brief and returns `additionalContext` (`hooks/claude/user-prompt-submit.ts:149-190`). | Auto | Keep doc; cite trigger. |
| Gemini advisor hook auto-surfaces guidance. | BeforeAgent-style hook builds and returns `additionalContext` (`hooks/gemini/user-prompt-submit.ts:139-204`). | Auto | Keep doc; cite trigger. |
| OpenCode plugin bridge auto-injects advisor context. | Local plugin `transform` path appends advisor brief (`.opencode/plugins/spec-kit-skill-advisor.js:567-663`). | Auto | Keep doc; cite plugin auto-load separately. |
| Copilot advisor is in-turn prompt context. | Copilot output is ignored; hook refreshes a managed custom-instructions block for the next prompt (`hooks/copilot/user-prompt-submit.ts:1-7`, `hooks/copilot/custom-instructions.ts:101-190`). | Half | Fix doc to "next-prompt freshness." |
| Codex advisor is always live when configured. | Codex hook returns context, but fallback can serve stale cold-start on timeout (`hooks/codex/user-prompt-submit.ts:174-180`, `hooks/codex/user-prompt-submit.ts:249-343`). | Half | Add smoke check and readiness wording. |
| Advisor brief generation is automatic. | `buildSkillAdvisorBrief` has skip, freshness, cache, and fail-open logic; it only runs when called by a hook/plugin/CLI (`skill_advisor/lib/skill-advisor-brief.ts:397-539`). | Half | Document caller requirement. |
| Skill graph stays warm automatically. | Daemon/watcher paths exist for some runtimes, but startup/plugin wiring controls whether they run (`context-server.ts:2047-2090`). | Half | Document runtime-specific triggers. |
| Python advisor CLI is automatic. | `skill_advisor.py` is an explicit fallback path documented for scripts and unsupported runtimes (`CLAUDE.md:169-210`, `skill-advisor-hook.md:171-194`). | Manual | Keep as fallback, not auto claim. |
| Advisor MCP recommendation is automatic. | `advisor_recommend` exposes status/scoring when invoked (`skill_advisor/lib/advisor-recommend.ts:207-318`). | Manual | Label as MCP operator/tool path. |
| Advisor tuner auto-optimizes production. | Doctor asset can analyze, optimize, re-index, and validate but has explicit apply/verify phases (`.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:1-6`, `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:162-194`). | Manual | Keep as diagnostic/remediation tool. |

### RQ2 - Code Graph Scan, Verify, Status, Ensure-Ready, Watcher

The structural code graph has useful read-path freshness support, not continuous whole-repo auto-reindexing. `ensureCodeGraphReady` can selectively reindex changed tracked files (`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442`), while query/context block or instruct the operator when a full scan is required (`code_graph/handlers/query.ts:787-828`, `code_graph/handlers/query.ts:1087-1092`, `mcp_server/context.ts:163-220`). Manual `code_graph_scan`, verify, status, and doctor commands remain the control plane.

| Claim | Actual behavior | Gap class | Recommended action |
|-------|-----------------|-----------|--------------------|
| Code graph is automatically ready before reads. | `ensureCodeGraphReady` runs from query/context paths with selective inline indexing (`ensure-ready.ts:329-442`, `query.ts:1087-1092`). | Auto | Keep, but scope to read paths. |
| Deleted/stale tracked entries self-heal. | Readiness helper checks tracked file state and can reconcile selective changes (`ensure-ready.ts:329-442`). | Auto | Keep doc with timeout caveat. |
| Full repo scan auto-runs when required. | Query blocks and returns required action when full scan is needed (`query.ts:787-828`). | Manual | Fix broad auto wording. |
| Context retrieval auto-recovers every stale state. | Context calls readiness but blocks on full-scan requirements (`context.ts:62-96`, `context.ts:163-220`). | Half | Document degraded readiness behavior. |
| `code_graph_scan` is self-firing. | Handler is explicit/manual and supports incremental/full behavior (`code_graph/handlers/scan.ts:177-356`). | Manual | Keep as command/MCP operation. |
| `code_graph_status` mutates freshness. | Status is a read-only snapshot first (`code_graph/handlers/status.ts:158-280`). | Manual | Keep as read-only diagnostic. |
| `code_graph_verify` repairs by default. | Verify blocks unless fresh and only persists baseline with an explicit option (`code_graph/handlers/verify.ts:141-178`). | Manual | Keep as validation command. |
| `detect_changes` auto-indexes. | It uses `allowInlineIndex:false` and reports the need for `code_graph_scan` (`code_graph/handlers/detect-changes.ts:241-262`). | Manual | Keep as preflight detector. |
| A filesystem watcher keeps structural graph current. | README claims real-time watching, but iteration absence search found no watcher under `mcp_server/code_graph/`; watcher evidence is memory/spec-doc scoped (`mcp_server/README.md:515-518`, `context-server.ts:2047-2090`, `research/iterations/iteration-002.md:18`, `research/iterations/iteration-002.md:32`). | Aspirational | Fix docs or implement watcher. |
| Doctor code-graph command can mutate graph. | Doctor contract is diagnostic-only and forbids invoking `code_graph_scan` (`.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:1-24`, `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204`). | Manual | Keep as diagnostic. |

### RQ3 - System-Spec-Kit Validator, Generate-Context, Auto-Indexing

System-spec-kit has strong manual validation and creation automation, plus startup/post-mutation indexing hooks. It does not auto-validate every packet unless the command or agent workflow invokes validation. Evidence: strict validation is a shell command (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-130`), `create.sh` generates metadata (`scripts/spec/create.sh:330-356`, `scripts/spec/create.sh:948-989`, `scripts/spec/create.sh:1184-1195`), and `context-server.ts` performs startup and post-mutation indexing (`mcp_server/context-server.ts:1320-1374`, `mcp_server/context-server.ts:2032-2090`).

| Claim | Actual behavior | Gap class | Recommended action |
|-------|-----------------|-----------|--------------------|
| Spec validation auto-runs globally. | `validate.sh` is an explicit command with strict flags (`scripts/spec/validate.sh:87-130`). | Manual | Fix doc to "required gate." |
| Strict validator checks evidence and continuity. | Strict mode enforces continuity/evidence checks when invoked (`scripts/spec/validate.sh:669-786`). | Half | Keep as workflow-enforced, not runtime-auto. |
| Spec folder creation auto-writes graph metadata. | `create.sh` creates scratch and graph metadata files (`scripts/spec/create.sh:330-356`). | Auto | Keep doc. |
| Spec creation auto-writes descriptions. | `create.sh` generates parent/child and normal folder descriptions (`scripts/spec/create.sh:948-989`, `scripts/spec/create.sh:1184-1195`). | Auto | Keep doc. |
| `generate-context` saves memory and metadata automatically. | Full-auto path exists, but JSON input/CLI invocation is explicit and planner mode defaults to plan-only (`scripts/memory/generate-context.ts:58-92`, `scripts/memory/generate-context.ts:481-590`). | Half | Document mode split. |
| Phase parent pointer updates are automatic after save. | `updatePhaseParentPointer` runs in after-save flow (`scripts/memory/generate-context.ts:404-446`). | Half | Keep with save-path caveat. |
| Spec docs are indexed at startup. | Context server performs startup scan and queue initialization (`mcp_server/context-server.ts:1320-1374`, `mcp_server/context-server.ts:2032-2045`). | Auto | Keep doc. |
| File watcher always keeps spec docs current. | Watcher is optional and feature-flagged (`mcp_server/context-server.ts:2047-2090`, `mcp_server/lib/search/search-flags.ts:348-355`). | Half | Add default-state column. |
| Gate 3 creates documentation automatically. | Gate 3 is a conversational hard block and operator answer; docs are authored by the agent/workflow (`CLAUDE.md:169-210`, `CLAUDE.md:276`). | Manual | Keep as governance requirement. |
| Post-save quality fixes are automatic. | Post-save review can report issues; auto-fix defaults are off (`mcp_server/ENV_REFERENCE.md:96-103`). | Half | Document manual patch expectation. |

### RQ4 - Memory/DB Save, Index Scan, Triggers, Bootstrap, Checkpoints, Retention, Causal

Memory automation is mixed. Startup scans, async ingest recovery, session cleanup, and some post-save hooks are real auto paths. Most operator-facing memory surfaces remain manual MCP/CLI calls. Feature flags convert several advertised automations into half-automated behavior. Evidence: memory save has planner and full-auto branches (`mcp_server/memory-tools/memory-save.ts:3028-3058`, `mcp_server/memory-tools/memory-save.ts:3120-3330`), index scan is explicit and rate-limited (`mcp_server/memory-tools/memory-index.ts:185-245`), trigger matching requires a prompt (`mcp_server/memory-tools/memory-triggers.ts:183-280`), and session cleanup runs scheduled intervals (`mcp_server/lib/session/session-manager.ts:202-257`).

| Claim | Actual behavior | Gap class | Recommended action |
|-------|-----------------|-----------|--------------------|
| `memory_save` fires automatically. | Handler is explicitly invoked and accepts governed ingest fields (`memory-save.ts:2681-2770`). | Manual | Keep as command/tool path. |
| Memory save always mutates state. | Planner mode can return a non-mutating plan (`memory-save.ts:3028-3058`). | Half | Document planner/full-auto split. |
| Post-insert enrichment/reconsolidation always runs. | Enrichment and reconsolidation are feature-flagged/default-off (`memory-save.ts:1723-1888`, `mcp_server/lib/search/search-flags.ts:140-152`). | Half | Add default-off note. |
| `memory_index_scan` auto-runs after every edit. | Scan handler is explicit/rate-limited (`memory-index.ts:185-245`, `memory-index.ts:420-560`). | Manual | Keep as manual index command. |
| Memory index starts warm at server boot. | Startup scan is initialized by context server (`context-server.ts:1320-1374`). | Auto | Keep doc. |
| File watcher keeps memory index current. | Watcher is optional under `SPECKIT_FILE_WATCHER=true` (`context-server.ts:2047-2090`, `search-flags.ts:348-355`). | Half | Fix "always-on" wording. |
| `memory_match_triggers` auto-runs for every prompt. | Tool requires an explicit prompt and DB check (`memory-triggers.ts:183-280`). | Manual | Keep as gate/tool expectation. |
| Session bootstrap/resume is automatic. | Bootstrap/resume are composite explicit tools (`session-bootstrap.ts:1-11`, `session-resume.ts:1-16`). | Manual | Keep as fallback path. |
| Checkpoints are automatic snapshots. | Checkpoint create/list/restore/delete are handlers (`checkpoints.ts:28-32`, `checkpoints.ts:301`, `checkpoints.ts:362`, `checkpoints.ts:407`, `checkpoints.ts:568`). | Manual | Keep as operator recovery tool. |
| Session cleanup is automatic. | Session manager schedules cleanup intervals (`session-manager.ts:202-257`, `session-manager.ts:737-840`). | Auto | Keep doc; separate from retention. |
| Retention expiry is swept automatically. | Governance persists retention/delete-after metadata, but no sweep entry was found for `memory_index.delete_after` (`scope-governance.ts:225-333`, `research/iterations/iteration-004.md:36`, `research/iterations/iteration-004.md:40-43`). | Aspirational | Add sweep or downgrade docs. |
| Causal graph linking is always automatic. | Processor resolves and inserts causal links when invoked by supported save/enrichment paths (`causal-links-processor.ts:344-420`). | Half | Document triggering path. |

### RQ5 - Per-Runtime Hook Reality

Hook wiring is not uniform. Claude, Gemini, and OpenCode plugin bridge have the strongest auto paths; Copilot is a next-prompt workaround; Codex has checked-in hook commands but a documented readiness predicate mismatch; native/no-CLI paths are manual. The fallback chain is explicit: if hook context is unavailable, use `/spec_kit:resume`, memory context, or manual tools (`.opencode/skill/system-spec-kit/references/config/hook_system.md:64-78`).

| Runtime | Wired hooks / config evidence | Fallback chain | Gap class | Recommended action |
|---------|-------------------------------|----------------|-----------|--------------------|
| Claude (claude-code) | `.claude/settings.local.json` wires UserPromptSubmit, PreCompact, SessionStart, and Stop (`.claude/settings.local.json:24-74`). | Hook fail-open, then `/spec_kit:resume` or manual memory/context tools (`hook_system.md:64-78`). | Auto | Keep doc. |
| Gemini | `.gemini/settings.json` enables SessionStart, PreCompress, BeforeAgent, and SessionEnd hooks (`.gemini/settings.json:67-125`). | Hook fail-open, then resume/manual fallback (`hook_system.md:64-78`). | Auto | Keep doc. |
| OpenCode plugin bridge | `.opencode/plugins/README.md` says local plugin files auto-load; advisor plugin appends brief (`.opencode/plugins/README.md:1-16`, `.opencode/plugins/spec-kit-skill-advisor.js:567-663`). | Bridge supports disabled/native/legacy/fail-open states (`plugin_bridges/spec-kit-skill-advisor-bridge.mjs:316-360`). | Auto | Keep doc with bridge modes. |
| Copilot | Hook script exists, but output is ignored and custom instructions are refreshed for next prompt (`hooks/copilot/user-prompt-submit.ts:1-7`, `hooks/copilot/README.md:14-36`). | Next prompt reads managed block; otherwise resume/manual context (`hooks/copilot/custom-instructions.ts:101-190`). | Half | Say "next-prompt" everywhere. |
| Codex | `.codex/settings.json` wires SessionStart/UserPromptSubmit/PreToolUse, but `.codex/config.toml` lacks documented `codex_hooks` feature (`.codex/settings.json:2-36`, `.codex/config.toml:43-45`, `hook_system.md:44`). | Prompt wrapper exists only where invoked (`hooks/codex/prompt-wrapper.ts:123-199`). | Half | Resolve authoritative config. |
| Native / no CLI dispatch | No runtime hook carrier; docs point to explicit memory/context fallback (`hook_system.md:64-78`). | Manual `/spec_kit:resume`, `memory_match_triggers`, `session_bootstrap`. | Manual | Keep as manual path. |
| Copilot wrapper docs | `hook_system.md` describes stale `.claude/settings.local.json` wrapper language, while Copilot README forbids that shape (`hook_system.md:22`, `hooks/copilot/README.md:27-34`). | Manual correction by operator if miswired. | Aspirational | Fix `hook_system.md`. |
| Codex readiness docs | Docs require `[features].codex_hooks=true` and `hooks.json`; repo uses `.codex/settings.json` with no feature flag (`hook_system.md:44`, `.codex/settings.json:2-36`, `.codex/config.toml:43-45`). | Prompt-wrapper fallback is partial. | Aspirational | Align docs and config. |

### RQ6 - Cross-Cutting Gaps and Claims-Without-Paths

Four patterns repeat across subsystems. First, documentation often says "auto" when the implementation is "auto only on a hook/read/startup path." Second, feature flags silently move claims from Auto to Half (`mcp_server/ENV_REFERENCE.md:96-103`, `mcp_server/lib/search/search-flags.ts:140-152`, `mcp_server/lib/search/search-flags.ts:348-355`). Third, operator commands are sometimes documented beside automatic hooks without a trigger column. Fourth, absence-based claims require adversarial review, which confirmed the P1 aspirational findings in iterations 2, 4, 5, and 6 (`research/iterations/iteration-002.md:35-38`, `research/iterations/iteration-004.md:40-43`, `research/iterations/iteration-005.md:30-38`, `research/iterations/iteration-006.md:29-32`).

### RQ7 - Reality Map and Planning Packet

The reality map above should become the source table for remediation. The Planning Packet in section 6 prioritizes high-leverage, feasible work: doc/contract repairs first, then optional implementation for retention sweeping and structural graph watching.

## 3. Top Workstreams

| Workstream | Aspirational count | Main risk | Evidence | Recommended owner |
|------------|--------------------|-----------|----------|-------------------|
| Runtime hook contract cleanup | 2 | Operators may wire Copilot/Codex against stale or conflicting docs. | `research/iterations/iteration-005.md:27-38` | Packet 028 hook/runtime config remediation |
| Graph freshness documentation | 1 | Users may expect structural graph freshness from a watcher that does not exist. | `research/iterations/iteration-002.md:32-38` | Packet 028 or follow-on graph freshness packet |
| Memory retention maintenance | 1 | Metadata can imply lifecycle cleanup without an observed sweep. | `research/iterations/iteration-004.md:36-43` | Memory/database maintenance packet |
| Feature-flag truth tables | 0 aspirational, many Half | Auto claims hide default-off behavior. | `research/iterations/iteration-006.md:22-27` | Documentation cleanup packet |

## 4. Cross-System Insights

1. **Trigger specificity is the missing doc primitive.** Most gaps vanish when each claim names the trigger: hook, startup, read path, post-save, feature flag, or operator command.
2. **Read-path self-heal is real but narrow.** Code graph readiness is safer than a watcher because it reacts at query time and degrades explicitly (`code_graph/lib/ensure-ready.ts:329-442`).
3. **Runtime parity is the wrong frame.** The hook layer intentionally has different behavior per runtime (`hook_system.md:64-78`), so "parity" should mean "equivalent fallback surface," not identical freshness.
4. **Feature flags need to appear in user-facing automation claims.** Reconsolidation, enrichment, and watcher defaults are off unless configured (`ENV_REFERENCE.md:96-103`).
5. **Manual commands are not failures.** Many commands are correctly manual because they mutate durable state, validate packets, or provide recovery surfaces.

## 5. Active Findings Registry

| ID | Severity | Status | Gap class | Finding | Evidence | Recommended action |
|----|----------|--------|-----------|---------|----------|--------------------|
| F2.9 | P1 | Active | Aspirational | Structural code graph watcher claim lacks a located structural watcher path. | `mcp_server/README.md:515-518`, `context-server.ts:2047-2090`, `research/iterations/iteration-002.md:18`, `research/iterations/iteration-002.md:32-38` | Fix docs or implement structural watcher. |
| F4.11 | P1 | Active | Aspirational | Retention metadata exists, but no sweep path was found. | `scope-governance.ts:225-333`, `research/iterations/iteration-004.md:36`, `research/iterations/iteration-004.md:40-43` | Add sweep or downgrade to metadata-only. |
| F5.CopilotDocs | P1 | Active | Aspirational | Copilot config docs conflict with Copilot-local README. | `hook_system.md:22`, `hooks/copilot/README.md:27-34`, `research/iterations/iteration-005.md:27`, `research/iterations/iteration-005.md:30-33` | Make Copilot README contract authoritative. |
| F5.CodexConfig | P1 | Active | Aspirational | Codex hook readiness docs and repo config disagree. | `hook_system.md:44`, `.codex/settings.json:2-36`, `.codex/config.toml:43-45`, `research/iterations/iteration-005.md:28`, `research/iterations/iteration-005.md:35-38` | Align config file names and readiness check. |
| F1.CopilotFreshness | P1 | Active | Half | Copilot advisor guidance is next-prompt freshness, not in-turn context. | `hooks/copilot/user-prompt-submit.ts:1-7`, `hooks/copilot/custom-instructions.ts:101-190` | Update hook matrix wording. |
| F1.CodexFreshness | P1 | Active | Half | Codex hook can fall back to stale cold-start context on timeout. | `hooks/codex/user-prompt-submit.ts:174-180` | Add smoke check/status flag. |
| F2.FullScan | P1 | Active | Manual | Full structural graph scan remains explicit. | `query.ts:787-828`, `scan.ts:177-356` | Document required action flow. |
| F3.Validate | P1 | Active | Manual | Spec validation is workflow-required, not background automatic. | `validate.sh:87-130`, `validate.sh:669-786` | Keep gates; fix wording. |
| F4.FeatureFlags | P1 | Active | Half | Reconsolidation, enrichment, and watcher are default-off. | `ENV_REFERENCE.md:96-103`, `search-flags.ts:140-152`, `search-flags.ts:348-355` | Add default-state column. |
| F6.RuntimeSpecific | P1 | Active | Half | Hook reliability differs by runtime. | `hook_system.md:64-78`, `research/iterations/iteration-006.md:27` | Replace parity claims with runtime matrix. |
| F6.SessionCleanup | P2 | Closed as real-auto | Auto | Session cleanup is true automatic maintenance, separate from memory retention. | `session-manager.ts:202-257`, `session-manager.ts:737-840` | Document as real auto path. |
| F6.SpeculationGuard | P2 | Active, speculation: true | Manual | A differently named retention maintenance command could exist outside searched paths. | `research/iterations/iteration-004.md:41-43` | Verify in remediation before implementation. |

## 6. Planning Packet

| Priority | Gap finding | Leverage x feasibility | Owning packet | Recommended phase | Dependencies |
|----------|-------------|------------------------|---------------|-------------------|--------------|
| 1 | Fix runtime hook contract docs for Copilot and Codex. | High x High | 028 hook/runtime contract | Phase 1: doc/config reconciliation | Decide authoritative Codex config file and Copilot wrapper shape. |
| 2 | Replace broad "auto-managing" language with trigger-specific reality matrix. | High x High | 028 documentation remediation | Phase 1: docs | Use this report's 50-row map as source. |
| 3 | Decide structural code graph watcher vs explicit read-path/manual contract. | High x Medium | Graph freshness packet | Phase 2: graph behavior | If implementing watcher, define scope and safety; otherwise amend README. |
| 4 | Add or explicitly defer memory retention sweep. | Medium x Medium | Memory/database maintenance packet | Phase 2: lifecycle maintenance | Confirm schema target for `delete_after` rows. |
| 5 | Add hook smoke checks for Codex/Copilot freshness. | Medium x Medium | Runtime QA packet | Phase 3: verification harness | Requires agreed config contract. |

## 7. Convergence Audit

| Iteration | Focus | New info ratio | P0 | P1 | P2 | Signal |
|-----------|-------|----------------|----|----|----|--------|
| 1 | Skill advisor entry-point catalog | 0.82 | 0 | 7 | 2 | continue |
| 2 | Code graph scan/verify/status/ensure-ready + watcher | 0.74 | 0 | 8 | 2 | continue |
| 3 | System-spec-kit validator + generate-context + auto-indexing | 0.68 | 0 | 9 | 0 | continue |
| 4 | Memory/DB automation | 0.71 | 0 | 12 | 1 | continue |
| 5 | Per-runtime hook wiring reality | 0.63 | 0 | 8 | 0 | continue |
| 6 | Cross-cutting gaps | 0.39 | 0 | 6 | 2 | approaching |
| 7 | Reality map synthesis + Planning Packet | 0.18 | 0 | 4 | 1 | converged |

Stop reason: max iterations reached; early-stop condition not met. The loop did not pad beyond convergence because iteration 7 was synthesis required by the user contract and still produced the final planning packet.

## 8. Sources

- `spec.md:51-59` - documented automation claim set.
- `spec.md:63-70` - purpose and 4-class taxonomy.
- `spec.md:81-87` - RQ1-RQ7 contract.
- `spec.md:137-144` - acceptance criteria.
- `spec.md:158-167` - success metrics and hook/reindex scenarios.
- `research/deep-research-strategy.md:10-17` - taxonomy.
- `research/deep-research-strategy.md:21-29` - iteration focus map.
- `research/deep-research-strategy.md:40-46` - entry-point emphasis.
- `research/deep-research-strategy.md:61-64` - synthesis targets.
- `CLAUDE.md:51-57` - mandatory tools and automation claims.
- `CLAUDE.md:90-101` - session start/recovery fallback.
- `CLAUDE.md:141-159` - common workflows.
- `CLAUDE.md:169-210` - gates.
- `CLAUDE.md:227-232` - memory save rules.
- `CLAUDE.md:276` - metadata generation requirement.
- `.opencode/skill/system-spec-kit/SKILL.md:61-63` - governance and deep research exception.
- `.opencode/skill/system-spec-kit/SKILL.md:766-803` - code graph docs.
- `.opencode/skill/system-spec-kit/SKILL.md:828-845` - rules.
- `.opencode/skill/system-spec-kit/SKILL.md:935-963` - quick reference.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:31-41` - default hook flow.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:55-65` - runtime matrix.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:76-85` - shared behavior/fail-open.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:171-194` - operator states.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md:37-45` - lifecycle and Codex readiness.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md:64-78` - runtime matrix/fallback.
- `.opencode/skill/system-spec-kit/references/config/hook_system.md:93-107` - OpenCode bridge.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:149-190` - Claude brief.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:139-204` - Gemini brief.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1-7` - Copilot output ignored.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:149-238` - Copilot writer.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:101-190` - Copilot managed block.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:14-36` - Copilot contract.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:174-180` - Codex stale fallback.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:249-343` - Codex brief.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:123-199` - Codex wrapper fallback.
- `.opencode/plugins/README.md:1-16` - OpenCode plugin auto-load.
- `.opencode/plugins/spec-kit-skill-advisor.js:567-663` - advisor plugin transform.
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:316-360` - bridge states.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:397-539` - brief skip/cache/fail-open.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/advisor-recommend.ts:207-318` - MCP advisor scoring.
- `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:1-6` - doctor purpose.
- `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:162-194` - doctor apply/verify.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442` - read-path readiness.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828` - full scan block.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087-1092` - ensure-ready call.
- `.opencode/skill/system-spec-kit/mcp_server/context.ts:62-96` - context block/fallback.
- `.opencode/skill/system-spec-kit/mcp_server/context.ts:163-220` - context readiness.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-356` - manual scan handler.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158-280` - read-only status.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:141-178` - verify behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:241-262` - no inline index.
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:1-24` - diagnostic-only intent.
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204` - no mutations.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-130` - validator args.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:669-786` - strict checks.
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh:330-356` - metadata creation.
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh:948-989` - parent/child description generation.
- `.opencode/skill/system-spec-kit/scripts/spec/create.sh:1184-1195` - normal description generation.
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:58-92` - save CLI modes.
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:404-446` - phase parent pointer.
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:481-590` - structured args.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1320-1374` - startup scan.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2032-2045` - async ingest recovery.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047-2090` - optional watcher.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:140-152` - enrichment/reconsolidation defaults.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-355` - watcher default.
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:96-103` - feature flag defaults.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-save.ts:1723-1888` - planner advisories.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-save.ts:2518-2565` - post-insert enrichment.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-save.ts:2681-2770` - save handler.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-save.ts:3028-3058` - plan-only response.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-save.ts:3120-3330` - full-auto save path.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-index.ts:185-245` - explicit index scan.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-index.ts:420-560` - incremental scan.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/memory-triggers.ts:183-280` - explicit prompt matching.
- `.opencode/skill/system-spec-kit/mcp_server/session-bootstrap.ts:1-11` - bootstrap composite.
- `.opencode/skill/system-spec-kit/mcp_server/session-resume.ts:1-16` - resume composite.
- `.opencode/skill/system-spec-kit/mcp_server/checkpoints.ts:28-32` - checkpoint catalog.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202-257` - cleanup intervals.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737-840` - cleanup handlers.
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-333` - retention metadata.
- `.opencode/skill/system-spec-kit/mcp_server/memory-tools/causal-links-processor.ts:344-420` - causal links.
- `.claude/settings.local.json:24-74` - Claude hooks.
- `.gemini/settings.json:67-125` - Gemini hooks.
- `.codex/settings.json:2-36` - Codex hooks.
- `.codex/config.toml:43-45` - Codex features without `codex_hooks`.
- `.codex/policy.json:1-44` - Codex policy.
- `opencode.json:10-57` - native MCP config.
- `research/iterations/iteration-002.md:18` - code graph watcher absence check.
- `research/iterations/iteration-002.md:35-38` - adversarial check for structural watcher.
- `research/iterations/iteration-004.md:40-43` - adversarial check for retention sweep.
- `research/iterations/iteration-005.md:30-38` - adversarial checks for Copilot/Codex configs.
- `research/iterations/iteration-006.md:29-32` - adversarial check for watcher overclaim.

## 9. Open Questions

1. Which Codex hook config is authoritative for this repo: `.codex/settings.json`, `~/.codex/hooks.json`, or both?
2. Should structural code graph freshness remain read-path/manual, or should a scoped watcher be implemented?
3. Should memory retention cleanup run as a background interval, an explicit maintenance command, or a post-save sweep?
4. Should Copilot support legacy wrapper language anywhere, or should `hook_system.md` delete that path entirely?
5. Should the automation docs expose feature-flag defaults inline or via a generated runtime status table?
