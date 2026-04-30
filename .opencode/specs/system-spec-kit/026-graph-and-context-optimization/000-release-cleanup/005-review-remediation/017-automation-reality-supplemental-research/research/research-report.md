# Research Report: Automation Reality Supplemental (Continuation of 012)

## 1. Supplemental scope vs 012 baseline

012 produced a 50-row automation reality map with **Auto 14**, **Half 14**, **Manual 18**, and **Aspirational 4** (`specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/016-automation-self-management-deep-research/research/research-report.md:5`). It stopped on max_iterations with newInfoRatio=0.18, after surfacing four active P1 aspirational findings: structural code graph watcher overclaim, memory retention sweep missing, Copilot hook docs conflict, and Codex hook readiness mismatch (`research-report.md:123-136` in 012).

This supplemental packet extends that baseline only with new rows and reclassifications from iterations 1-4, then synthesizes a sequenced remediation backlog for packets 031-035. It does not repeat the 50 baseline rows.

## 2. Extended 4-column reality map (delta only - new rows + reclassifications)

| Surface | Auto-fire trigger (file:line) | Manual entry | Class | Severity | Source iter |
|---------|-------------------------------|--------------|-------|----------|-------------|
| deep_loop_graph_query | None found; registered as MCP coverage graph dispatcher at `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:31-47` and implemented at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-43`. | Direct MCP call `mcp__spec_kit_memory__deep_loop_graph_query`; schema at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:844-859`. | manual | none | iter 1 |
| deep_loop_graph_upsert | Research auto/confirm YAML at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:817-836` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:687-705`; review auto/confirm at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:841-863` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:832-853`; all paths require latest-iteration `graphEvents`. | `/spec_kit:deep-research:auto|confirm`, `/spec_kit:deep-review:auto|confirm`, or direct MCP call. | half | none | iter 1 |
| deep_loop_graph_convergence | Auto-fired by research YAML at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:392-408` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:399-410`; review YAML at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410-425` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:423-438`. | Slash-command workflows or direct MCP call. | auto | none | iter 1 |
| deep_loop_graph_status | None found; registered dispatcher at `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:31-47` and status handler at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-34`. | Direct MCP call `mcp__spec_kit_memory__deep_loop_graph_status`; schema at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:862-873`. | manual | none | iter 1 |
| ccc_reindex | None found; session/bootstrap paths check CocoIndex availability through helpers instead of invoking CCC (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:609-615`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:451-468`). | Direct MCP call `mcp__spec_kit_memory__ccc_reindex({ full })`; handler shells out to `ccc index` or `ccc index --full` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:45-54`. | manual | P1 docs-home mismatch | iter 2 |
| ccc_feedback | None found; dispatcher only invokes feedback when requested at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:91-96`. | Direct MCP call `mcp__spec_kit_memory__ccc_feedback(...)`; handler appends feedback JSONL at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:44-60`. | manual | none | iter 2 |
| ccc_status | None found; lifecycle paths probe `isCocoIndexAvailable()` directly, not `ccc_status` (`.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:155-185`). | Direct MCP call `mcp__spec_kit_memory__ccc_status({})`; handler reports binary/index availability at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:22-58`. | manual | none | iter 2 |
| eval_run_ablation | None found; `/memory:search ablation` is explicit operator trigger at `.opencode/command/memory/search.md:726-729`; no hook/CI scheduler path found. | `/memory:search ablation`, direct MCP call, or `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts`. | manual | none | iter 2 |
| eval_reporting_dashboard | None found; `/memory:search dashboard` is explicit operator trigger at `.opencode/command/memory/search.md:767-769`; hook scripts do not call it. | `/memory:search dashboard` or direct MCP call `mcp__spec_kit_memory__eval_reporting_dashboard(...)`. | manual | none | iter 2 |
| CCC command-home documentation | No runtime trigger; `.opencode/command/memory/README.txt:271-273` maps CCC tools to `/memory:manage`, but `.opencode/command/memory/manage.md:1-4` cannot call them. | Direct MCP calls only unless `/memory:manage` is amended. | documented-mismatch | P1 | iter 2 |
| CCC architecture handler paths | No runtime trigger; `.opencode/skill/system-spec-kit/ARCHITECTURE.md:306-308` lists stale `handlers/ccc-*` paths while actual exports live at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:9-11`. | Source navigation through actual `mcp_server/code_graph/handlers` paths. | doc-drift | P2 | iter 2 |
| validate.sh on PostToolUse (Claude) | None found; Claude hooks are UserPromptSubmit/PreCompact/SessionStart/Stop at `.claude/settings.local.json:24`; Stop is configured at `.claude/settings.local.json:61`. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`. | manual | none | iter 3 |
| validate.sh on PostToolUse (Codex) | None found; Codex has PreToolUse only at `.codex/settings.json:25`, and handler is a Bash deny policy at `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:3`. | Direct validator invocation. | manual | none | iter 3 |
| validate.sh on postToolUse (Copilot wrapper) | `.github/hooks/superset-notify.json:25` defines `postToolUse`, but `.github/hooks/scripts/superset-notify.sh:4` only forwards externally or returns `{}`. | Direct validator invocation. | manual | none | iter 3 |
| validate.sh on PostToolUse (Gemini) | None found; Gemini hooks are SessionStart/PreCompress/BeforeAgent/SessionEnd at `.gemini/settings.json:70`. | Direct validator invocation. | manual | none | iter 3 |
| validate.sh on OpenCode plugin events | None found; OpenCode plugins expose advisor/compact handlers at `.opencode/plugins/spec-kit-skill-advisor.js:632` and `.opencode/plugins/spec-kit-compact-code-graph.js:365`, not validation. | Direct validator invocation. | manual | none | iter 3 |
| validate.sh after authored spec-doc write | Documented obligation at `AGENTS.md:334` and `.opencode/skill/system-spec-kit/SKILL.md:63`; no runtime hook config fires validator after writes. | Direct validator invocation after writes. | aspirational | P1 | iter 3 |
| completion validation auto-runs | `AGENTS.md:146` says validation runs automatically when claiming completion, but concrete surface remains `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87`. | Manual completion workflow plus direct validator invocation. | aspirational | P2 | iter 3 |
| generate-context.js after arbitrary spec edit | None found; generate-context is save-context tooling at `.opencode/command/memory/save.md:120` and `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:58`. | `/memory:save`, `save context`, `save memory`, or explicit `node .../generate-context.js --json ...`. | manual | none | iter 3 |
| generate-context.js on Claude Stop | `.claude/settings.local.json:61` configures Stop; `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:58` spawns generate-context conditionally. | `/memory:save` or explicit generate-context invocation. | half | none | iter 3 |
| generate-context.js on Gemini SessionEnd | `.gemini/settings.json:113` configures SessionEnd, but `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:97` persists hook state only. | `/memory:save` or explicit generate-context invocation. | manual | P2 | iter 3 |
| generate-context.js on Codex/Copilot/OpenCode lifecycle | Codex has no Stop hook in `.codex/settings.json:1`; Copilot wrapper forwards through `.github/hooks/scripts/superset-notify.sh:4`; OpenCode plugin context transforms are not generation at `.opencode/plugins/spec-kit-compact-code-graph.js:401`. | `/memory:save` or explicit generate-context invocation. | manual | P2 | iter 3 |
| generate-context.js Step 11.5 re-indexing | Canonical save auto-indexes touched canonical spec docs and graph metadata at `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1498`. | `/memory:save` or explicit generate-context invocation. | half | none | iter 3 |
| memory_save MCP indexing | `memory_save` validates/indexes/persists one file at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2681`, filters canonical docs at `:2737`, and indexes at `:3060`. | Explicit `memory_save` tool call. | manual | none | iter 3 |
| MCP startup re-index | Context server schedules startup scan at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2116`, discovers docs at `:1305`, and indexes at `:1343`. | Explicit `memory_index_scan` for refresh on demand. | auto | none | iter 3 |
| optional markdown file watcher re-index | Starts only when enabled at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2047`; default off at `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:350`; watcher reindexes, not validates, at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:377`. | Set `SPECKIT_FILE_WATCHER=true` or run `memory_index_scan`. | half | P2 | iter 3 |
| P1-1 code graph watcher overclaim | Re-test found markdown/spec-doc and skill-graph watcher paths only; code graph query/context self-heal on read at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087`, while file watcher rejects non-markdown at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:274`. | `code_graph_scan`, `code_graph_query`, `code_graph_context`, or implement/retract watcher. | aspirational | P1 validated | iter 4 |
| P1-2 memory retention sweep missing | Re-test found session cleanup and bulk delete, but session cleanup deletes session tables at `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737` and bulk delete selection omits `delete_after` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183`. | Implement retention sweep or downgrade docs to metadata-only. | aspirational | P1 validated | iter 4 |
| P1-3 Copilot hook docs conflict | Current checked-in `.github/hooks/superset-notify.json:3` path exists; conflict remains with Copilot README at `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27`. | Use `.github/hooks` Copilot wiring; patch shared hook docs. | doc-drift | P2 demoted | iter 4 |
| P1-4 Codex hook readiness mismatch | Current user runtime has `~/.codex/hooks.json:2` and `~/.codex/config.toml:42`, but local policy checks hooks registration and feature enablement at `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:123` and `:285`. | Use user/workspace `hooks.json` plus `[features].codex_hooks`; clarify repo examples. | doc/config ambiguity | P2 demoted | iter 4 |
| session-manager cleanup interval | Timer-driven cleanup is real at `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202`, but scoped to session-state tables, not governed memory retention. | No standalone trigger; treat as evidence separating session cleanup from retention sweep. | auto | P2 | iter 4 |
| code graph freshness checks | `code_graph_query`/`code_graph_context` can self-heal stale selective slices on invocation, but full scans are intentionally manual (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163`). | Invoke `code_graph_context`/`code_graph_query`; run `code_graph_scan` when required. | half | P2 | iter 4 |
| skill_graph_scan and skill_graph_validate auto-fire | Skill graph scan can run at startup/watcher/daemon paths (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1507`); validation remains manual diagnostic. | `skill_graph_scan` and `skill_graph_validate` direct tool calls. | half/manual | P2 | iter 4 |
| memory_drift_why auto-fire | Causal tools dispatch only requested tool names at `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:23`; no drift detector auto-calls it. | Direct `memory_drift_why` call with `memoryId`. | manual | P2 | iter 4 |
| memory_get_learning_history feedback loop | Handler reads session learning rows at `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:659`; no automated feedback-loop consumer found. | Direct `memory_get_learning_history` call. | manual | P2 | iter 4 |
| advisor_status freshness remediation | Advisor status computes freshness/trust at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:86`, but rebuild helper is separate at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:54`. | Invoke status, then explicit rebuild/scan path if needed. | manual diagnostic | P2 | iter 4 |
| code_graph_context auto-fire | Tool dispatcher calls `code_graph_context` only when requested at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60`; routing paths recommend it at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:262`. | Direct `code_graph_context` call. | half | P2 | iter 4 |
| memory_health diagnostic auto-run | Handler can repair only with explicit confirmation at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:425`; context server recommends it instead of running it at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:808`. | Direct `memory_health` call with confirmed repair when appropriate. | manual/confirmed repair | P2 | iter 4 |

## 3. Per-RQ answers (RQ1-RQ6)

### RQ1: Deep-loop graph automation

Deep-loop graph automation is real but narrow. `deep_loop_graph_convergence` auto-fires in deep-research and deep-review YAML workflows before stop voting (`iteration-001.md:40`). `deep_loop_graph_upsert` is half-automated because the workflow step exists but is conditional on emitted `graphEvents` (`iteration-001.md:39`, `iteration-001.md:48`). `deep_loop_graph_query` and `deep_loop_graph_status` are manual MCP surfaces with no YAML, bootstrap, watcher, or after-tool auto-fire path found (`iteration-001.md:38`, `iteration-001.md:41`).

### RQ2: CCC + eval + ablation reality

CCC tools are direct MCP/operator surfaces, not background automation. `ccc_reindex`, `ccc_feedback`, and `ccc_status` dispatch only when requested (`iteration-002.md:75-77`). Eval ablation and dashboard reporting are also explicit `/memory:search` or MCP/CLI paths, with ablation feature-gated by `SPECKIT_ABLATION=true` (`iteration-002.md:78-79`). The main new P1 is documentation drift: the memory command README maps CCC tools to `/memory:manage`, while `manage.md` cannot invoke them (`iteration-002.md:83`).

### RQ3: Validator auto-fire surface

No runtime-level PostToolUse validator auto-fire was found for Claude, Codex, Copilot wrapper, Gemini, or OpenCode plugins (`iteration-003.md:70-75`). Validation after authored spec-doc writes is governance-required but not mechanically enforced, which remains P1 (`iteration-003.md:88`). By contrast, indexing has real automation in specific paths: MCP startup re-index is automatic, canonical save Step 11.5 auto-indexes touched docs, and the markdown watcher can reindex when explicitly enabled (`iteration-003.md:81-84`).

### RQ4: Adversarial 4-P1 retest (verdicts)

Two 012 P1 findings stand. The code graph watcher overclaim remains P1 because found watchers are markdown/spec-doc or skill graph scoped, while structural graph freshness is read-path/manual (`iteration-004.md:67-72`). The memory retention sweep remains P1 because cleanup infrastructure targets session tables or bulk-delete filters, not governed `delete_after` retention (`iteration-004.md:73-78`).

Two 012 P1 findings demote to P2. Copilot has a live checked-in `.github/hooks` path, so the remaining issue is stale/conflicting docs (`iteration-004.md:79-83`). Codex is live in the current user runtime through `hooks.json`, `codex_hooks`, and wrapper enablement, so the remaining issue is repo-example/config ambiguity (`iteration-004.md:85-89`).

### RQ5: NEW gap hunt

Iteration 4 found eight additional surfaces. The important pattern is not hidden P0 risk; it is diagnostic or read-path behavior being easy to over-describe as automation. Session cleanup is real but not retention (`NEW-013-001`), code graph read-path checks are half-auto (`NEW-013-002`, `NEW-013-007`), skill graph and advisor status expose freshness without fully automatic repair (`NEW-013-003`, `NEW-013-006`), and memory drift/history/health tools are manual or confirmed-repair surfaces (`NEW-013-004`, `NEW-013-005`, `NEW-013-008`).

### RQ6: Sequenced remediation backlog

The remediation order should start with doc truth, then decide whether the two validated P1s get implementation or explicit retraction. Packet 031 fixes hook contracts and automation language. Packet 032 decides structural code graph watcher vs read-path/manual contract. Packet 033 decides retention sweep vs metadata-only docs. Packet 034 upgrades or labels half-auto runtime freshness and default-off feature flags. Packet 035 executes the full validation matrix from packet 030 after the decisions have landed.

## 4. Adversarial outcomes for 012's 4 P1 findings

| ID | 012 finding | New evidence (file:line) | Verdict | Rationale |
|----|-------------|--------------------------|---------|-----------|
| P1-1 | Code-graph watcher overclaim | `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:274`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1087` | Validated, still P1 | File watcher rejects non-markdown; structural graph freshness is selective read-path remediation plus manual full scan. |
| P1-2 | Memory retention sweep missing | `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183` | Validated, still P1 | Session cleanup and bulk delete exist, but neither sweeps governed `memory_index.delete_after`. |
| P1-3 | Copilot hook docs conflict | `.github/hooks/superset-notify.json:3`; `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27` | Demoted to P2 | Current checked-in Copilot hook wiring exists; the remaining issue is stale shared documentation that can mislead setup. |
| P1-4 | Codex hook readiness mismatch | `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:123`; `~/.codex/config.toml:42`; `~/.codex/hooks.json:2` | Demoted to P2 | Current user runtime is live; repo-local settings alone remain insufficient and need clearer docs/config wording. |

## 5. NEW gap-findings discovered

| ID | Surface | Class | Final severity | Evidence | Summary |
|----|---------|-------|----------------|----------|---------|
| F-013-011 | CCC command-home documentation | documented-mismatch | P1 | `.opencode/command/memory/README.txt:271-273`; `.opencode/command/memory/manage.md:1-4` | README maps CCC tools to `/memory:manage`, but `manage.md` cannot invoke them. |
| F-013-012 | CCC architecture handler paths | doc-drift | P2 | `.opencode/skill/system-spec-kit/ARCHITECTURE.md:306-308`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:9-11` | Architecture docs point to stale handler paths. |
| F-013-018 | validate.sh after authored spec-doc write | aspirational | P1 | `AGENTS.md:334`; `.opencode/skill/system-spec-kit/SKILL.md:63` | Post-write validation is governance-required, not runtime-hook enforced. |
| F-013-019 | completion validation auto-runs | aspirational | P2 | `AGENTS.md:146`; `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87` | Completion validation automatic wording is over-broad. |
| F-013-015 | cross-runtime context-save auto-generation | partial parity | P2 | `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:94`; `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:97` | Claude Stop can generate context; Gemini/Codex/Copilot/OpenCode inspected paths do not. |
| NEW-013-001 | session-manager cleanup interval | auto | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:202` | Timer-driven cleanup exists but is scoped to session tables rather than memory retention. |
| NEW-013-002 | code graph freshness checks | half | P2 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163` | Query/context can self-heal selective stale graph slices only after invocation. |
| NEW-013-003 | skill_graph_scan and skill_graph_validate auto-fire | half/manual | P2 | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1507` | Scan can run through startup/watcher/daemon paths; validation remains manual. |
| NEW-013-004 | memory_drift_why auto-fire | manual | P2 | `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:23` | Drift explanation is explicit-tool only and needs a memory id. |
| NEW-013-005 | memory_get_learning_history feedback loop | manual | P2 | `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:659` | Learning history is read-only; no automated consumer was found. |
| NEW-013-006 | advisor_status freshness remediation | manual diagnostic | P2 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:86` | Status detects freshness but does not invoke rebuild. |
| NEW-013-007 | code_graph_context auto-fire | half | P2 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:60` | Context self-checks readiness only after manual dispatch. |
| NEW-013-008 | memory_health diagnostic auto-run | manual/confirmed repair | P2 | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:425` | Health repair is explicit-confirmation driven, not automatic. |

## 6. Sequenced remediation backlog packets 031-035

### Packet 031: doc-truth-pass (Tier A)

Packet: 018-doc-truth-pass
Tier: A
Class: doc-fix
Effort estimate: 6-10 hours of cli-codex work
Dependencies: []
Operator triggers: [`/spec_kit:plan specs/system-spec-kit/026-graph-and-context-optimization/018-doc-truth-pass`, `/spec_kit:implement specs/system-spec-kit/026-graph-and-context-optimization/018-doc-truth-pass`]
Maps to findings: [F-013-011, F-013-012, F-013-018, F-013-019, F-013-015, P1-3/F5.CopilotDocs, P1-4/F5.CodexConfig]
Scope:
- Patch Copilot and Codex hook contract docs so the authoritative config surfaces are explicit.
- Add an automation language reality matrix with trigger, default state, manual entry, and runtime caveat columns.
- Correct CCC command-home and stale architecture handler path docs.
Risks:
- Over-correcting into implementation decisions that belong in packets 032-034.
- Missing one duplicated hook matrix and leaving conflicting guidance alive.
Verification:
- Search for "auto", "watcher", "Codex hooks", "Copilot", "ccc_" and verify every claim names a trigger/default/manual fallback.
- Run markdown lint or targeted doc checks where available.

### Packet 032: code-graph-watcher-decision (Tier B)

Packet: 032-code-graph-watcher-decision
Tier: B
Class: hybrid
Effort estimate: 4-8 hours for doc retraction, or 14-22 hours of cli-codex work for a scoped watcher implementation
Dependencies: [018-doc-truth-pass]
Operator triggers: [`/spec_kit:plan specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-decision`, `/spec_kit:implement specs/system-spec-kit/026-graph-and-context-optimization/032-code-graph-watcher-decision`]
Maps to findings: [P1-1/F2.9, NEW-013-002, NEW-013-007]
Scope:
- Decide whether structural graph freshness remains read-path/manual or gains a scoped source watcher.
- If retracting, update README/feature docs to state read-path selective repair plus manual full scan.
- If implementing, define watched roots, debounce, full-scan escape hatch, and safety limits.
Risks:
- A broad watcher can make edits expensive or mutate graph state unexpectedly.
- Retraction may disappoint operators who expected real-time structural freshness.
Verification:
- For retraction: exact-search docs for watcher claims and confirm they all say read-path/manual.
- For implementation: add tests for source change detection, selective scan, disabled default, and full-scan refusal behavior.

### Packet 033: memory-retention-sweep (Tier B)

Packet: 020-memory-retention-sweep
Tier: B
Class: hybrid
Effort estimate: 3-5 hours for docs downgrade, or 12-18 hours of cli-codex work for sweep implementation
Dependencies: [018-doc-truth-pass]
Operator triggers: [`/spec_kit:plan specs/system-spec-kit/026-graph-and-context-optimization/020-memory-retention-sweep`, `/spec_kit:implement specs/system-spec-kit/026-graph-and-context-optimization/020-memory-retention-sweep`]
Maps to findings: [P1-2/F4.11, NEW-013-001]
Scope:
- Decide whether governed `delete_after` metadata should be enforced by background interval, explicit maintenance command, or documented metadata-only policy.
- If implementing, add a retention sweep over governed memory rows and preserve auditability.
- If downgrading, remove claims that ephemeral memory retention is automatically swept.
Risks:
- Incorrect sweep filters could delete durable memories; this is the only packet with real deletion risk.
- A background interval may surprise operators unless dry-run/status modes exist.
Verification:
- Unit tests over expired/non-expired rows, tier filters, dry-run output, and audit records.
- Manual fixture run against a temporary DB before any real-memory mutation path is enabled.

### Packet 034: half-auto-upgrades (Tier C)

Packet: 021-half-auto-upgrades
Tier: C
Class: hybrid
Effort estimate: 16-24 hours of cli-codex work plus 2-4 human design hours for runtime behavior choices
Dependencies: [018-doc-truth-pass, 032-code-graph-watcher-decision, 020-memory-retention-sweep]
Operator triggers: [`/spec_kit:plan specs/system-spec-kit/026-graph-and-context-optimization/021-half-auto-upgrades`, `/spec_kit:implement specs/system-spec-kit/026-graph-and-context-optimization/021-half-auto-upgrades`]
Maps to findings: [F1.CopilotFreshness, F1.CodexFreshness, F4.FeatureFlags, NEW-013-003, NEW-013-006]
Scope:
- Improve Copilot freshness from next-prompt-only where feasible, or make next-prompt semantics mechanically visible.
- Harden Codex cold-start fallback so stale advisor context is labeled and smoke-checkable.
- Add default-state columns for watcher/enrichment/reconsolidation/search feature flags in user-facing docs.
- Decide whether advisor/skill graph stale states should offer explicit repair commands or remain diagnostics.
Risks:
- Runtime hook behavior differs by carrier; trying to force parity can create fragile wrappers.
- Feature-flag defaults can drift unless generated from the env reference or tested.
Verification:
- Runtime smoke tests or scripted fixture checks for Copilot and Codex hook state.
- Docs/source consistency check for feature flag names, defaults, and operator commands.

### Packet 035: full-matrix-execution-validation (Tier D)

Packet: 022-full-matrix-execution-validation
Tier: D
Class: hybrid
Effort estimate: 10-16 hours of cli-codex work
Dependencies: [018-doc-truth-pass, 032-code-graph-watcher-decision, 020-memory-retention-sweep, 021-half-auto-upgrades, external: 030 matrix design]
Operator triggers: [`/spec_kit:plan specs/system-spec-kit/026-graph-and-context-optimization/022-full-matrix-execution-validation`, `/spec_kit:implement specs/system-spec-kit/026-graph-and-context-optimization/022-full-matrix-execution-validation`]
Maps to findings: [all supplemental P1/P2 findings, NEW-013-004, NEW-013-005, NEW-013-008]
Scope:
- Execute packet 030's full automation matrix design across supported runtimes and command/tool surfaces.
- Record actual triggers, outputs, fail-open behavior, feature flags, and manual fallbacks.
- Convert remaining manual-only diagnostic surfaces into either accepted manual status or scoped remediation tickets.
Risks:
- Matrix breadth can balloon; freeze rows before execution.
- Local operator-specific Codex/Copilot state can hide clean-room setup failures.
Verification:
- Produce a signed-off matrix with pass/fail/blocked evidence for each row.
- Re-run a clean-room or fixture-mode subset for runtime-hook claims.

Dependency graph: 031 gates the language and source-of-truth cleanup for every later packet. 032 and 033 can run in parallel after 031 because they touch different subsystems. 034 should wait for 032/033 decisions so it does not upgrade or document behavior that those packets retract. 035 should run last, using packet 030's design as the execution matrix.

## 7. Open questions for downstream phases

- Should packet 032 implement a structural source watcher, or should docs make read-path/manual graph freshness the explicit product contract?
- Should packet 033 enforce `delete_after` through background interval, explicit maintenance command, post-save sweep, or metadata-only downgrade?
- What is the authoritative Codex setup contract for portable docs: user-level `hooks.json`, workspace `hooks.json`, `[features].codex_hooks`, wrapper `--enable`, or a required combination?
- Should Copilot docs delete legacy Claude-style wrapper language entirely, or keep it as historical context clearly marked unsupported?
- Should feature-flag default-state tables be generated from `ENV_REFERENCE.md` to avoid another stale-doc pass?
- Should manual diagnostic tools like `memory_health`, `memory_drift_why`, and `memory_get_learning_history` be accepted manual surfaces or given explicit scheduled/checkpoint triggers?

## Convergence Report

- Stop reason: converged
- Total iterations: 5
- newInfoRatio sequence: iter 1: 0.82, iter 2: 0.78, iter 3: 0.86, iter 4: 0.74, iter 5: 0.12
- Honest assessment: the final synthesis did not push numeric newInfoRatio below 0.10, but it closed RQ6 and consolidated the packet backlog. Another research iteration is not justified before remediation; the remaining uncertainty is design/execution work for packets 032, 033, and 035.
