# Iteration 14 — Adoption-Cost Reality Check

> Effort estimates grounded in Public's actual code, not feel.

## TL;DR
- P0/P1 reality check: `11 accurate`, `5 under-sized`, `1 over-sized`, `1 speculative`.
- Biggest under-size: `Static artifacts as default + MCP as overlay` moved from `M` to `L`; Public already has many static prompt, agent, and transport surfaces, so freshness-safe packaging is a cross-surface project.
- `Benchmark-honest token reporting` and `Deterministic summary computation at Stop time` both moved from `S` to `M`; the real implementation crosses telemetry, hooks, session state, and dashboard/reporting surfaces.
- `Runtime FTS capability cascade` moved from `M` to `S`; Public already ships `memory_fts`, `isFts5Available()`, and dedicated Vitest coverage.
- `Evidence-tagging contract + confidence_score` is not a clean local `M`; in this checkout the CocoIndex side is mostly docs/scripts, so the cross-surface runtime path is still speculative.
- Recommendation-only cross-check: `R9` still looks `M`; `R10` is now `Speculative` because combo 3 was falsified and the trust vocabulary is still split.
- Combo 1 and Combo 2 stay `M`; Combo 3 should not be sequenced as an implementation lane.

## Effort definitions (this iter's rubric)
| Tier | Definition | Boundary signals |
|---|---|---|
| S | `<500` LOC, `<3` modified files, no new schema/dep | bounded hook/helper/test addition inside one owner surface |
| M | `500-2000` LOC, `3-10` modified files, schema/tool/test work allowed | crosses handler + formatter + docs + tests in one lane |
| L | `>2000` LOC, `10+` modified files, architectural change | new durable surface, shared ledger, or cross-owner contract |

## Per-candidate cost reality

### Group P0 (9 candidates)

#### Candidate Benchmark-honest token reporting
**Iter-7 estimate:** S  
**Iter-14 estimate:** M  
**Delta:** under-sized  
**Concrete evidence:**
- New files: `mcp_server/lib/telemetry/token-ledger.ts`, `mcp_server/tests/token-ledger.vitest.ts`
- Modified files: `mcp_server/formatters/token-metrics.ts` (87 LOC, `+80-120`), `mcp_server/lib/telemetry/consumption-logger.ts` (453 LOC, `+140-220`), `mcp_server/lib/response/envelope.ts` (327 LOC, `+40-80`), `mcp_server/lib/eval/reporting-dashboard.ts` (748 LOC, `+60-120`)
- New schema: yes; `consumption_log` needs exact-vs-estimated prompt/completion/cache/pricing fields
- Hooks: optional touchpoint in `mcp_server/hooks/response-hints.ts`
- Tests: yes; Vitest around telemetry, envelope sync, and dashboard rollups
- Deps: no
- Documentation updates: `mcp_server/README.md`, `mcp_server/ENV_REFERENCE.md`, `mcp_server/lib/telemetry/README.md`
- Memory triggers / constitutional rules: no
- Integration points: `memory_search`, `memory_context`, MCP envelopes, eval dashboard
- Missing iter-13 prereqs: thin producer rows and no provider-counted publication surface
**Justification:** Telemetry exists, but honest reporting still spans schema, formatter, logger, and publishing surfaces.

#### Candidate Deterministic summary computation at Stop time
**Iter-7 estimate:** S  
**Iter-14 estimate:** M  
**Delta:** under-sized  
**Concrete evidence:**
- New files: `mcp_server/lib/session/context-summary.ts`, `mcp_server/tests/session-summary-stop-hook.vitest.ts`
- Modified files: `mcp_server/hooks/claude/session-stop.ts` (`+120-180`), `mcp_server/lib/session/session-manager.ts` (1441 LOC, `+80-140`), `mcp_server/hooks/claude/session-prime.ts` (235 LOC, `+40-80`), `mcp_server/handlers/session-bootstrap.ts` (226 LOC, `+30-60`)
- New schema: no; `session_state.context_summary` already exists in `lib/session/session-manager.ts`
- Hooks: `hooks/claude/session-stop.ts`, `hooks/claude/session-prime.ts`
- Tests: yes; session bootstrap/startup plus new Stop-hook fixture coverage
- Deps: no
- Documentation updates: `mcp_server/hooks/README.md`, `mcp_server/README.md`, `references/config/hook_system.md`
- Memory triggers / constitutional rules: no
- Integration points: Stop hook, SessionStart hook, `session_bootstrap`, `session_resume`
- Missing iter-13 prereqs: canonical persisted summary artifact is still incomplete today
**Justification:** The column exists, but producer-to-consumer wiring crosses hook state, session state, and startup paths.

#### Candidate `validate.py` schema-boundary validator
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/lib/context/shared-payload-validator.ts`, `mcp_server/tests/shared-payload-validator.vitest.ts`
- Modified files: `mcp_server/lib/context/shared-payload.ts` (158 LOC, `+40-70`), `mcp_server/handlers/session-bootstrap.ts` (226 LOC, `+20-40`), `mcp_server/lib/context/opencode-transport.ts` (155 LOC, `+20-40`)
- New schema: no
- Hooks: no
- Tests: yes; small Vitest contract suite
- Deps: no
- Documentation updates: `mcp_server/README.md`, `references/validation/validation_rules.md`
- Memory triggers / constitutional rules: no
- Integration points: startup/bootstrap/compaction shared-payload envelopes
- Missing iter-13 prereqs: stable durable artifact is still absent, but a validator can land before that
**Justification:** Public already has a shared payload envelope, so the first validator fits in one contract lane.

#### Candidate AST-first / regex-fallback / confidence labels
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: none required
- Modified files: `mcp_server/lib/code-graph/structural-indexer.ts` (1140 LOC, `+80-140`), `mcp_server/lib/code-graph/tree-sitter-parser.ts` (696 LOC, `+40-80`), `mcp_server/handlers/code-graph/query.ts` (238 LOC, `+30-60`)
- New schema: no
- Hooks: no
- Tests: yes; `mcp_server/tests/tree-sitter-parser.vitest.ts` plus query-handler assertions
- Deps: no; tree-sitter path already shipped
- Documentation updates: `mcp_server/ENV_REFERENCE.md`, `mcp_server/README.md`, graph feature docs
- Memory triggers / constitutional rules: no
- Integration points: `code_graph_scan`, `code_graph_query`, readiness messaging
- Missing iter-13 prereqs: none; the AST and regex substrate already exists
**Justification:** This is a hardening pass over shipped parser modes, not a net-new parser platform.

#### Candidate 4-phase consolidation contract
**Iter-7 estimate:** S  
**Iter-14 estimate:** M  
**Delta:** under-sized  
**Concrete evidence:**
- New files: `mcp_server/lib/storage/consolidation-contract.ts`, `mcp_server/tests/consolidation-contract.vitest.ts`
- Modified files: `mcp_server/handlers/memory-save.ts` (1799 LOC, `+120-180`), `mcp_server/lib/validation/save-quality-gate.ts` (874 LOC, `+60-100`), `mcp_server/handlers/save/response-builder.ts` (467 LOC, `+40-80`), `mcp_server/handlers/save/reconsolidation-bridge.ts` (453 LOC, `+40-80`), `references/memory/save_workflow.md` (606 LOC, `+40-70`)
- New schema: no for v1
- Hooks: no
- Tests: yes; memory-save and reconsolidation suites
- Deps: no
- Documentation updates: save workflow docs, feature catalog, manual playbook
- Memory triggers / constitutional rules: no
- Integration points: `memory_save`, reconsolidation, post-insert consolidation response
- Missing iter-13 prereqs: pipeline exists, but no explicit four-stage contract
**Justification:** Public already has a large save pipeline; making the phase contract explicit is multi-module work.

#### Candidate Generated `.mcp.json` scaffold plus setup hints
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: none required; `skill/mcp-coco-index/assets/config_templates.md` already contains repo-portable templates
- Modified files: `skill/mcp-coco-index/assets/config_templates.md` (227 LOC, `+40-80`), `skill/mcp-coco-index/INSTALL_GUIDE.md` (862 LOC, `+30-60`), optional command doc surface under `.opencode/command/`
- New schema: no
- Hooks: no
- Tests: optional JSON/template smoke checks only
- Deps: no
- Documentation updates: CocoIndex install/config docs and one command surface
- Memory triggers / constitutional rules: no
- Integration points: repo-root `.mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `opencode.json`
- Missing iter-13 prereqs: only command surfacing; the template content itself already exists
**Justification:** Most of the scaffold content is already written; the remaining work is packaging and surfacing.

#### Candidate F1 fixture harness for detector regression
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/tests/fixtures/code-graph-detectors/*`, `mcp_server/tests/code-graph-detector-regression.vitest.ts`
- Modified files: `mcp_server/tests/tree-sitter-parser.vitest.ts` (120 LOC, `+40-80`), optional small test utility additions
- New schema: no
- Hooks: no
- Tests: yes; Vitest only
- Deps: no
- Documentation updates: `mcp_server/tests/README.md`, manual testing note if desired
- Memory triggers / constitutional rules: no
- Integration points: parser/indexer regression lane
- Missing iter-13 prereqs: none; large test substrate already exists
**Justification:** Public already has the parser and test harness; this is mainly frozen-fixture coverage.

#### Candidate Per-tool profile overlay split
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Concrete evidence:**
- New files: likely profile partials under `.opencode/agent/` or `.opencode/command/spec_kit/assets/`
- Modified files: `.opencode/agent/orchestrate.md` (865 LOC, `+60-100`), `.opencode/agent/context-prime.md` (248 LOC, `+20-40`), `.opencode/command/spec_kit/deep-research.md` (279 LOC, `+20-40`), `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` (535 LOC, `+40-80`)
- New schema: no
- Hooks: no
- Tests: yes; command/contract parity tests
- Deps: no
- Documentation updates: agent docs, command docs, prompt assets
- Memory triggers / constitutional rules: no
- Integration points: orchestrator prompts, command auto assets, runtime-specific overlays
- Missing iter-13 prereqs: none; overlay patterns already exist, but split delivery still spans multiple static surfaces
**Justification:** The work is mostly prompt/config packaging, but it touches enough static artifacts to stay mid-sized.

#### Candidate Hot-file ranking by incoming import count
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: none required
- Modified files: `mcp_server/handlers/code-graph/query.ts` (238 LOC, `+40-70`), `mcp_server/lib/search/graph-search-fn.ts` (703 LOC, `+40-80`), `mcp_server/tool-schemas.ts` (837 LOC, `+20-40`)
- New schema: no; `IMPORTS` edges already exist
- Hooks: no
- Tests: yes; graph-search and code-graph-query suites
- Deps: no
- Documentation updates: code graph README and graph-signal catalog entry
- Memory triggers / constitutional rules: no
- Integration points: `code_graph_query`, graph ranking helpers, startup graph summaries
- Missing iter-13 prereqs: none; graph storage already contains import edges and typed-degree logic
**Justification:** Public already computes graph degree signals, so incoming-import ranking is a bounded extension.

### Group P1 (10 candidates)

#### Candidate Graph-first PreToolUse hook
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/hooks/claude/pre-tool-use.ts`, optional `mcp_server/hooks/shared/tool-routing.ts`
- Modified files: `mcp_server/hooks/README.md` (99 LOC, `+20-40`), `mcp_server/context-server.ts` (1787 LOC, `+20-40`), `references/config/hook_system.md` (`+20-40`)
- New schema: no
- Hooks: yes; new `PreToolUse` hook beside shipped `PreCompact`, `SessionStart`, and `Stop`
- Tests: yes; small hook formatting/routing fixture
- Deps: no
- Documentation updates: hook registration docs, runtime instructions, agent routing notes
- Memory triggers / constitutional rules: no
- Integration points: Claude runtime hooks, `code_graph_query`, CocoIndex routing hints
- Missing iter-13 prereqs: none; hook system and routing hints already exist
**Justification:** The expensive substrate already exists; the hook mostly reuses routing logic Public already emits.

#### Candidate Cached `context_summary` SessionStart fast path
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: none required for v1
- Modified files: `mcp_server/hooks/claude/session-prime.ts` (235 LOC, `+40-70`), `mcp_server/lib/session/session-manager.ts` (1441 LOC, `+20-40`), `mcp_server/handlers/session-bootstrap.ts` (226 LOC, `+20-40`)
- New schema: no; `session_state.context_summary` already exists
- Hooks: `SessionStart` hook in `hooks/claude/session-prime.ts`
- Tests: yes; `tests/session-bootstrap.vitest.ts`, `tests/startup-brief.vitest.ts`
- Deps: no
- Documentation updates: hooks docs, MCP README
- Memory triggers / constitutional rules: no
- Integration points: SessionStart, `session_bootstrap`, resume fallback
- Missing iter-13 prereqs: depends on the Stop-time producer becoming canonical
**Justification:** Once the producer exists, consuming `context_summary` at startup is a small follow-on.

#### Candidate Placement rubric for memory consolidation
**Iter-7 estimate:** S  
**Iter-14 estimate:** S  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/lib/storage/consolidation-placement.ts` or policy doc only
- Modified files: `references/memory/save_workflow.md` (606 LOC, `+40-60`), `mcp_server/handlers/memory-save.ts` (1799 LOC, `+30-60`), `mcp_server/lib/validation/save-quality-gate.ts` (874 LOC, `+20-40`)
- New schema: no
- Hooks: no
- Tests: yes; existing memory-save suites are enough for v1
- Deps: no
- Documentation updates: save workflow, command docs, feature catalog
- Memory triggers / constitutional rules: yes; rubric must respect importance tiers and shared-space boundaries
- Integration points: `memory_save`, save quality gate, governed save boundaries
- Missing iter-13 prereqs: none blocking
**Justification:** The placement lane can land as policy plus light enforcement before deeper consolidation redesign.

#### Candidate Static artifacts as default + MCP as overlay
**Iter-7 estimate:** M  
**Iter-14 estimate:** L  
**Delta:** under-sized  
**Concrete evidence:**
- New files: `mcp_server/lib/context/static-artifact.ts`, `scripts/renderers/static-context-artifact.ts`, `mcp_server/tests/static-artifact-overlay.vitest.ts`
- Modified files: `mcp_server/context-server.ts` (1787 LOC, `+120-180`), `mcp_server/lib/context/shared-payload.ts` (158 LOC, `+40-80`), `mcp_server/lib/context/opencode-transport.ts` (155 LOC, `+40-80`), `.opencode/agent/context-prime.md` (248 LOC, `+20-40`), `.opencode/agent/orchestrate.md` (865 LOC, `+40-80`), command assets/docs, freshness docs, feature catalog/manual playbook
- New schema: likely yes; artifact freshness/version metadata or sidecar persistence becomes necessary
- Hooks: likely yes; startup/resume consumers need artifact freshness checks
- Tests: yes; startup, artifact freshness, overlay fallback, stale-artifact behavior
- Deps: no
- Documentation updates: agent docs, command docs, runtime docs, feature/manual playbook
- Memory triggers / constitutional rules: no
- Integration points: startup bootstrap, agent prompts, transport envelopes, static prompt assets
- Missing iter-13 prereqs: no stable interchange artifact; no cross-surface confidence schema
**Justification:** Public already has many static surfaces; making one artifact authoritative without staleness regressions is architectural.

#### Candidate SQLAlchemy AST schema extraction
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/lib/code-graph/python/sqlalchemy-schema-extractor.ts`, SQLAlchemy fixtures under `tests/fixtures/`
- Modified files: `mcp_server/lib/code-graph/tree-sitter-parser.ts` (696 LOC, `+80-140`), `mcp_server/lib/code-graph/structural-indexer.ts` (1140 LOC, `+80-140`), optional `mcp_server/handlers/code-graph/query.ts` / type files
- New schema: no DB migration required for v1; existing node/edge tables can host new kinds
- Hooks: no
- Tests: yes; new parser fixtures plus existing tree-sitter suite
- Deps: no
- Documentation updates: code graph README, parser docs, feature catalog/manual playbook
- Memory triggers / constitutional rules: no
- Integration points: `code_graph_scan`, `code_graph_query`, graph context formatting
- Missing iter-13 prereqs: parser substrate exists, but ORM extraction logic does not
**Justification:** Public has the parser base, but ORM-aware extraction still means real parser/test work.

#### Candidate Evidence-tagging contract + `confidence_score`
**Iter-7 estimate:** M  
**Iter-14 estimate:** Speculative  
**Delta:** speculative  
**Concrete evidence:**
- New files: `mcp_server/lib/context/evidence-contract.ts`, `shared/contracts/evidence.ts`, cross-surface tests, plus CocoIndex runtime changes that are not present in this checkout
- Modified files: `mcp_server/lib/context/shared-payload.ts` (158 LOC), `mcp_server/handlers/code-graph/query.ts` (238 LOC), `skill/mcp-coco-index/README.md` (533 LOC), `skill/mcp-coco-index/INSTALL_GUIDE.md` (862 LOC)
- New schema: yes; new response fields and versioned contract
- Hooks: no
- Tests: yes; but one side of the runtime is missing locally
- Deps: no new library, but missing local server implementation path matters
- Documentation updates: CocoIndex docs plus shared payload docs
- Memory triggers / constitutional rules: no
- Integration points: `code_graph_query`, CocoIndex search, shared payload envelope, transport rendering
- Missing iter-13 prereqs: no cross-surface confidence schema; local CocoIndex checkout is docs/scripts-heavy, not a local TS server surface
**Justification:** There is no clean local implementation path for a real cross-surface confidence contract in this repo snapshot.

#### Candidate Stable JSON interchange artifact
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/lib/context/interchange-contract.ts`, `mcp_server/tests/interchange-contract.vitest.ts`
- Modified files: `mcp_server/lib/context/shared-payload.ts` (158 LOC, `+40-80`), `mcp_server/lib/context/opencode-transport.ts` (155 LOC, `+30-60`), `mcp_server/handlers/session-bootstrap.ts` (226 LOC, `+30-60`), `mcp_server/lib/code-graph/startup-brief.ts` (252 LOC, `+30-60`)
- New schema: yes; version/fingerprint field or artifact persistence is needed
- Hooks: no
- Tests: yes; contract serialization and backward-compat coverage
- Deps: no
- Documentation updates: MCP README, validation docs, transport docs
- Memory triggers / constitutional rules: no
- Integration points: startup, compaction, bootstrap, transport payloads
- Missing iter-13 prereqs: current shared payload is in-memory and not durable/versioned
**Justification:** Contract pieces exist, but making them durable and versioned is still mid-sized integration work.

#### Candidate Runtime FTS capability cascade
**Iter-7 estimate:** M  
**Iter-14 estimate:** S  
**Delta:** over-sized  
**Concrete evidence:**
- New files: `mcp_server/lib/search/sqlite-capabilities.ts`, optional `tests/sqlite-capabilities.vitest.ts`
- Modified files: `mcp_server/lib/search/sqlite-fts.ts` (153 LOC, `+40-70`), `mcp_server/handlers/memory-search.ts` (1270 LOC, `+40-80`), `mcp_server/tests/sqlite-fts.vitest.ts` (145 LOC, `+30-50`)
- New schema: no
- Hooks: no
- Tests: yes; existing FTS suite is already present
- Deps: no
- Documentation updates: `mcp_server/database/README.md`, lexical-search notes
- Memory triggers / constitutional rules: no
- Integration points: `memory_search`, fallback routing, lexical search path
- Missing iter-13 prereqs: none; `memory_fts` and `isFts5Available()` already ship
**Justification:** Public already has the table, detector, and tests, so capability probing is a refinement, not a rebuild.

#### Candidate Two-layer cache invalidation
**Iter-7 estimate:** M  
**Iter-14 estimate:** L  
**Delta:** under-sized  
**Concrete evidence:**
- New files: `mcp_server/lib/cache/invalidation-ledger.ts`, `mcp_server/tests/cache-invalidation-ledger.vitest.ts`
- Modified files: `mcp_server/core/db-state.ts` (612 LOC, `+80-140`), `mcp_server/handlers/code-graph/scan.ts` (187 LOC, `+40-70`), `mcp_server/hooks/README.md` (99 LOC, `+20-30`), `skill/mcp-coco-index/README.md` (533 LOC, `+40-80`), `skill/mcp-coco-index/INSTALL_GUIDE.md` (862 LOC, `+30-60`), plus command/runtime docs and likely hook feedback modules
- New schema: yes; a shared invalidation ledger or state table is required
- Hooks: likely yes; post-mutation invalidation feedback must propagate across both surfaces
- Tests: yes; DB reinit, code graph scan, and multi-surface invalidation cases
- Deps: no
- Documentation updates: CocoIndex docs, MCP runtime docs, hook docs, operational runbooks
- Memory triggers / constitutional rules: no
- Integration points: `code_graph_scan`, DB reinit, CocoIndex `refresh_index`, tool-cache invalidation
- Missing iter-13 prereqs: no shared invalidation ledger today
**Justification:** This is real cross-owner coherence work, not a local helper patch.

#### Candidate Per-tier pricing and cache normalization
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Concrete evidence:**
- New files: `mcp_server/lib/telemetry/pricing-normalizer.ts`, `mcp_server/tests/pricing-normalizer.vitest.ts`
- Modified files: `mcp_server/lib/telemetry/consumption-logger.ts` (453 LOC, `+100-160`), `mcp_server/formatters/token-metrics.ts` (87 LOC, `+30-50`), `mcp_server/lib/response/envelope.ts` (327 LOC, `+30-60`), `mcp_server/lib/eval/reporting-dashboard.ts` (748 LOC, `+60-120`)
- New schema: yes; pricing tier, cache-write/cache-read normalization fields
- Hooks: optional `response-hints.ts` token surfacing path
- Tests: yes; telemetry, normalization, dashboard aggregation
- Deps: no
- Documentation updates: telemetry docs, eval dashboard docs, env reference
- Memory triggers / constitutional rules: no
- Integration points: telemetry, reporting, token envelopes, eval dashboard
- Missing iter-13 prereqs: no dedicated tier-priced ledger today
**Justification:** The substrate exists, but normalized pricing still needs schema and reporting work.

### Group: Top 10 recommendations

R1-R8 are already covered by the P0/P1 candidate entries above. Only recommendation-only additions are listed here.

#### Recommendation R9 — Build the auditable-savings stack before publishing dashboards
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Concrete evidence:**
- New files: none beyond candidate lanes 1 and 19
- Modified files: `mcp_server/lib/eval/reporting-dashboard.ts` (748 LOC), `mcp_server/handlers/eval-reporting.ts` (426 LOC), `mcp_server/lib/telemetry/consumption-logger.ts` (453 LOC), `mcp_server/formatters/token-metrics.ts` (87 LOC)
- New schema: yes; same ledger expansion required by honest reporting/pricing normalization
- Hooks: optional response-hint/token sync path
- Tests: yes; telemetry + dashboard + contract formatting
- Deps: no
- Documentation updates: dashboard docs, methodology docs, env reference
- Memory triggers / constitutional rules: no
- Integration points: eval DB, dashboard handler, telemetry, token metrics
- Missing iter-13 prereqs: publication-grade rows still missing
**Justification:** Dashboard substrate is already shipped, but the upstream accounting contract is still mid-sized.

#### Recommendation R10 — Package trustworthy structural context as reusable static artifacts plus live overlays
**Iter-7 estimate:** M  
**Iter-14 estimate:** Speculative  
**Delta:** speculative  
**Concrete evidence:**
- New files: would require both static artifact generation and trust-contract split files
- Modified files: `mcp_server/context-server.ts` (1787 LOC), `mcp_server/lib/context/shared-payload.ts` (158 LOC), `.opencode/agent/context-prime.md` (248 LOC), `.opencode/agent/orchestrate.md` (865 LOC), `mcp_server/lib/code-graph/structural-indexer.ts` (1140 LOC)
- New schema: yes; freshness + provenance + evidence axes must separate cleanly
- Hooks: likely yes; startup and overlay consumers need freshness-aware arbitration
- Tests: yes; provenance calibration, stale-artifact, overlay fallback
- Deps: no
- Documentation updates: agents, runtime docs, artifact docs
- Memory triggers / constitutional rules: no
- Integration points: structural extraction, static prompt artifacts, startup transport
- Missing iter-13 prereqs: cross-surface confidence schema and stable artifact are both missing; combo 3 was falsified in iter-12
**Justification:** The recommendation assumes a trust model Public does not yet have.

### Group: 3 killer combos

#### Combo 1 — Stop summaries + cached startup + graph-first routing
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Stress-test verdict:** weakened  
**Concrete evidence:**
- New files: likely one summary helper plus one hook routing helper
- Modified files: `mcp_server/hooks/claude/session-stop.ts`, `mcp_server/lib/session/session-manager.ts`, `mcp_server/hooks/claude/session-prime.ts`, `mcp_server/handlers/session-bootstrap.ts`, optional `mcp_server/context-server.ts`
- New schema: no new table if `session_state.context_summary` is reused
- Hooks: `Stop` + `SessionStart` + new `PreToolUse`
- Tests: yes; startup fidelity, summary freshness, routing outcomes
- Deps: no
- Integration points: Stop hook, SessionStart hook, bootstrap, Code Graph, CocoIndex
- Missing iter-13 prereqs: summary fidelity and freshness-safe graph handoff
**Justification:** The combo is still mid-sized, but summary correctness is the real risk, not raw code volume.

#### Combo 2 — Honest reporting + pricing normalization + dashboard contract
**Iter-7 estimate:** M  
**Iter-14 estimate:** M  
**Delta:** accurate  
**Stress-test verdict:** survives  
**Concrete evidence:**
- New files: likely one pricing/ledger helper
- Modified files: `mcp_server/lib/telemetry/consumption-logger.ts`, `mcp_server/formatters/token-metrics.ts`, `mcp_server/lib/eval/reporting-dashboard.ts`, `mcp_server/handlers/eval-reporting.ts`, `mcp_server/lib/response/envelope.ts`
- New schema: yes; ledger enrichment remains the expensive piece
- Hooks: optional token-sync hook path
- Tests: yes; telemetry + dashboard + methodology assertions
- Deps: no
- Integration points: telemetry, eval DB, dashboard publication, MCP envelopes
- Missing iter-13 prereqs: provider-counted authority and exact-vs-estimated labeling
**Justification:** Dashboard code is already there, so the combo remains one medium reporting-governance lane.

#### Combo 3 — Provenance-aware structural extraction + evidence tags + static artifacts
**Iter-7 estimate:** M  
**Iter-14 estimate:** Speculative  
**Delta:** speculative  
**Stress-test verdict:** falsified  
**Concrete evidence:**
- New files: multiple trust-contract and freshness artifacts would be required
- Modified files: `mcp_server/lib/code-graph/structural-indexer.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/context/shared-payload.ts`, agent/static prompt artifacts, plus a missing CocoIndex-side runtime path
- New schema: yes; separate provenance, evidence, and freshness axes
- Hooks: likely yes
- Tests: yes; provenance calibration and stale-artifact regression
- Deps: no
- Integration points: structural extraction, artifact generation, overlay routing
- Missing iter-13 prereqs: cross-surface confidence schema and stable artifact; iter-12 falsified the merged-trust hypothesis
**Justification:** Do not size this as an implementation candidate until the trust model is decomposed.

## Mis-sized candidates summary

| Candidate | Iter-7 | Iter-14 | Delta | Why |
|---|---|---|---|---|
| Benchmark-honest token reporting | S | M | under-sized | Real work spans `token-metrics`, `consumption_log`, envelopes, and dashboard rollups |
| Deterministic summary computation at Stop time | S | M | under-sized | `context_summary` column exists, but producer wiring crosses Stop hook, session state, and startup consumers |
| 4-phase consolidation contract | S | M | under-sized | Memory save already spans `memory-save.ts` plus 13 submodules and docs |
| Static artifacts as default + MCP as overlay | M | L | under-sized | Needs new artifact generation, freshness/versioning, and prompt-surface consumers |
| Two-layer cache invalidation | M | L | under-sized | No shared invalidation ledger exists across Code Graph and CocoIndex today |
| Runtime FTS capability cascade | M | S | over-sized | `memory_fts`, `isFts5Available()`, and FTS Vitest coverage are already shipped |
| Evidence-tagging contract + `confidence_score` | M | Speculative | speculative | Cross-surface runtime contract needs CocoIndex behavior that is not locally implemented here |
| R10 structural packaging recommendation | M | Speculative | speculative | Iter-12 falsified combo 3 and Public still lacks a unified trust vocabulary |

## Recommendations for v2

- Iter-17 should re-tier P0/P1 using the corrected lanes: promote `Runtime FTS capability cascade`; demote `Static artifacts as default + MCP as overlay` and `Two-layer cache invalidation`.
- Treat `Benchmark-honest token reporting`, `Deterministic summary at Stop time`, and `4-phase consolidation contract` as real `M` tracks, not “quick wins.”
- Keep `Graph-first PreToolUse hook`, `F1 fixture harness`, `Hot-file ranking`, and `.mcp.json` scaffolding in the fast-win bucket.
- Mark `Evidence-tagging contract + confidence_score` and `R10` as speculative until Public owns a concrete cross-surface trust contract.
- Keep Combo 1 and Combo 2 alive, but only after the corrected prerequisite sizes are reflected in the roadmap.
