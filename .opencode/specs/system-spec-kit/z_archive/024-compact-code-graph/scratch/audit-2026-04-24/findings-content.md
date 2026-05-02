# Audit Findings — Content, Paths & Cross-References
Generated: 2026-04-24
Scope: 024-compact-code-graph + 34 sub-phases + 030 nested sub-packets

## Summary
- Markdown files scanned: 733
- P0 findings: 66 (broken path refs to non-existent files/scripts)
- P1 findings: 13 (cross-phase drift, structural anomalies)
- P2 findings: 5 (placeholder text, stale dates)

## P0 Findings (broken refs that will fail validation or confuse readers)
### F-P0-001: Stale SessionStart hook build path
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:137
- Issue: Reference `.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-prime.js` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-prime.js
- Proposed fix: replace `.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-prime.js` with `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js`

### F-P0-002: Stale Stop hook build path
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/spec.md:174
- Issue: Reference `.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js
- Proposed fix: replace `.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js` with `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`

### F-P0-003: Missing feature_catalog_in_simple_terms.md reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/006-documentation-alignment/checklist.md:130
- Issue: Reference `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
- Proposed fix: delete the plain-language catalog reference or replace it with `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` after confirming that is the intended reader surface

### F-P0-004: Missing feature_catalog_in_simple_terms.md reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/006-documentation-alignment/implementation-summary.md:107
- Issue: Reference `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
- Proposed fix: delete the plain-language catalog reference or replace it with `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` after confirming that is the intended reader surface

### F-P0-005: Missing feature_catalog_in_simple_terms.md reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/006-documentation-alignment/implementation-summary.md:122
- Issue: Reference `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
- Proposed fix: delete the plain-language catalog reference or replace it with `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` after confirming that is the intended reader surface

### F-P0-006: Missing feature_catalog_in_simple_terms.md reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/006-documentation-alignment/tasks.md:96
- Issue: Reference `../../../../skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
- Proposed fix: delete the plain-language catalog reference or replace it with `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` after confirming that is the intended reader surface

### F-P0-007: Relative path still points at removed passive-enrichment.js
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration/implementation-summary.md:88
- Issue: Reference `./lib/enrichment/passive-enrichment.js` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration/lib/enrichment/passive-enrichment.js
- Proposed fix: replace `./lib/enrichment/passive-enrichment.js` with `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts`

### F-P0-008: Relative path still points at removed passive-enrichment.js
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration/plan.md:123
- Issue: Reference `./lib/enrichment/passive-enrichment.js` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration/lib/enrichment/passive-enrichment.js
- Proposed fix: replace `./lib/enrichment/passive-enrichment.js` with `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts`

### F-P0-009: Relative path still points at removed passive-enrichment.js
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration/spec.md:128
- Issue: Reference `./lib/enrichment/passive-enrichment.js` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration/lib/enrichment/passive-enrichment.js
- Proposed fix: replace `./lib/enrichment/passive-enrichment.js` with `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts`

### F-P0-010: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/023-context-preservation-metrics/implementation-summary.md:53
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-011: Root CODEX.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/checklist.md:100
- Issue: Reference `../../../../../CODEX.md` resolves to a missing path.
- Target: CODEX.md
- Proposed fix: delete `../../../../../CODEX.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-012: Root GEMINI.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/checklist.md:101
- Issue: Reference `../../../../../GEMINI.md` resolves to a missing path.
- Target: GEMINI.md
- Proposed fix: delete `../../../../../GEMINI.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-013: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/implementation-summary.md:60
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-014: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/implementation-summary.md:151
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-015: Root CODEX.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/plan.md:108
- Issue: Reference `../../../../../CODEX.md` resolves to a missing path.
- Target: CODEX.md
- Proposed fix: delete `../../../../../CODEX.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-016: Root GEMINI.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/plan.md:109
- Issue: Reference `../../../../../GEMINI.md` resolves to a missing path.
- Target: GEMINI.md
- Proposed fix: delete `../../../../../GEMINI.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-017: Root CODEX.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:159
- Issue: Reference `../../../../../CODEX.md` resolves to a missing path.
- Target: CODEX.md
- Proposed fix: delete `../../../../../CODEX.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-018: Root GEMINI.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/spec.md:160
- Issue: Reference `../../../../../GEMINI.md` resolves to a missing path.
- Target: GEMINI.md
- Proposed fix: delete `../../../../../GEMINI.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-019: Root CODEX.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/tasks.md:83
- Issue: Reference `../../../../../CODEX.md` resolves to a missing path.
- Target: CODEX.md
- Proposed fix: delete `../../../../../CODEX.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-020: Root GEMINI.md reference has no live target
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/tasks.md:84
- Issue: Reference `../../../../../GEMINI.md` resolves to a missing path.
- Target: GEMINI.md
- Proposed fix: delete `../../../../../GEMINI.md` or replace it with an existing runtime guidance surface such as `AGENTS.md` or the current `.opencode/command/spec_kit/*.md` docs

### F-P0-021: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/026-session-start-injection-debug/implementation-summary.md:12
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-022: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/implementation-summary.md:12
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-023: Missing `code-graph-db.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/plan.md:94
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`

### F-P0-024: Missing `code-graph-db.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/spec.md:69
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`

### F-P0-025: Missing `code-graph-db.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/028-startup-highlights-remediation/tasks.md:59
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`

### F-P0-026: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/001-shared-payload-provenance-layer/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-027: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/001-shared-payload-provenance-layer/implementation-summary.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-028: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/002-opencode-transport-adapter/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-029: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-030: Missing `ops-hardening.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/implementation-summary.md:32
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts`

### F-P0-031: Missing `ops-hardening.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/implementation-summary.md:52
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts`

### F-P0-032: Missing `code-graph-ops-hardening.vitest.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/implementation-summary.md:56
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-ops-hardening.vitest.ts`

### F-P0-033: Missing `ops-hardening.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/spec.md:87
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ops-hardening.ts`

### F-P0-034: Missing `code-graph-ops-hardening.vitest.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/003-code-graph-operations-hardening/spec.md:91
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-ops-hardening.vitest.ts`

### F-P0-035: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-036: Missing `startup-brief.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity/implementation-summary.md:51
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`

### F-P0-037: Missing `startup-brief.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity/spec.md:89
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`

### F-P0-038: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-039: Missing `ensure-ready.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/spec.md:89
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts`

### F-P0-040: Missing `context.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/spec.md:90
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts`

### F-P0-041: Missing `query.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/spec.md:91
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts`

### F-P0-042: Missing `code-graph-query-handler.vitest.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/spec.md:93
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`

### F-P0-043: Missing `code-graph-context` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/spec.md:94
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context
- Proposed fix: replace `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context` with `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`

### F-P0-044: Missing `session-start.sh` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/checklist.md:57
- Issue: Reference `./.github/hooks/scripts/session-start.sh` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/.github/hooks/scripts/session-start.sh
- Proposed fix: delete `./.github/hooks/scripts/session-start.sh` or replace it with the current existing path

### F-P0-045: Missing `superset-notify.sh` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/checklist.md:57
- Issue: Reference `./.github/hooks/scripts/superset-notify.sh` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/.github/hooks/scripts/superset-notify.sh
- Proposed fix: delete `./.github/hooks/scripts/superset-notify.sh` or replace it with the current existing path

### F-P0-046: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-047: Missing `session-start.sh` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/implementation-summary.md:80
- Issue: Reference `./.github/hooks/scripts/session-start.sh` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/.github/hooks/scripts/session-start.sh
- Proposed fix: delete `./.github/hooks/scripts/session-start.sh` or replace it with the current existing path

### F-P0-048: Missing `superset-notify.sh` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/implementation-summary.md:81
- Issue: Reference `./.github/hooks/scripts/superset-notify.sh` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/.github/hooks/scripts/superset-notify.sh
- Proposed fix: delete `./.github/hooks/scripts/superset-notify.sh` or replace it with the current existing path

### F-P0-049: Missing `runtime-detection.ts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/spec.md:92
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts
- Proposed fix: delete `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts` or replace it with the current existing path

### F-P0-050: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/decision-record.md:14
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-051: Missing `session-start.sh` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/implementation-summary.md:129
- Issue: Reference `./.github/hooks/scripts/session-start.sh` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/.github/hooks/scripts/session-start.sh
- Proposed fix: delete `./.github/hooks/scripts/session-start.sh` or replace it with the current existing path

### F-P0-052: Missing `002-implement-cache-warning-hooks` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/checklist.md:35
- Issue: Reference `../002-implement-cache-warning-hooks` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002-implement-cache-warning-hooks
- Proposed fix: replace `../002-implement-cache-warning-hooks` with `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook`

### F-P0-053: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/decision-record.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-054: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/implementation-summary.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-055: Missing `002` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/plan.md:108
- Issue: Reference `../002` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002
- Proposed fix: replace `../002` with `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook`

### F-P0-056: Missing `002` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/plan.md:145
- Issue: Reference `../002` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002
- Proposed fix: replace `../002` with `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook`

### F-P0-057: Missing `002-implement-cache-warning-hooks` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/spec.md:33
- Issue: Reference `../002-implement-cache-warning-hooks` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002-implement-cache-warning-hooks
- Proposed fix: replace `../002-implement-cache-warning-hooks` with `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook`

### F-P0-058: Missing `002` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/spec.md:151
- Issue: Reference `../002` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002
- Proposed fix: replace `../002` with `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook`

### F-P0-059: Missing `002-implement-cache-warning-hooks` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/tasks.md:37
- Issue: Reference `../002-implement-cache-warning-hooks` resolves to a missing path.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002-implement-cache-warning-hooks
- Proposed fix: replace `../002-implement-cache-warning-hooks` with `.opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook`

### F-P0-060: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/032-cached-summary-fidelity-gates/decision-record.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-061: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/032-cached-summary-fidelity-gates/implementation-summary.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-062: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/033-fts-forced-degrade-hardening/decision-record.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-063: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/033-fts-forced-degrade-hardening/implementation-summary.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-064: Missing `sqlite-fts` reference
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/033-fts-forced-degrade-hardening/spec.md:78
- Issue: Reference `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts` resolves to a missing path.
- Target: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts
- Proposed fix: delete `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts` or replace it with the current existing path

### F-P0-065: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts/decision-record.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

### F-P0-066: sk-doc HVR rules path drifted
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/034-workflow-split-and-token-insight-contracts/implementation-summary.md:15
- Issue: Reference `.opencode/skill/sk-doc/references/hvr_rules.md` resolves to a missing path.
- Target: .opencode/skill/sk-doc/references/hvr_rules.md
- Proposed fix: replace `.opencode/skill/sk-doc/references/hvr_rules.md` with `.opencode/skill/sk-doc/references/global/hvr_rules.md`

## P1 Findings (drift / anomalies)
### F-P1-001: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/implementation-summary.md:83
- Issue: Phase slug `020-mcp-working-memory-hybrid-rag` does not match on-disk folder `020-query-routing-integration`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/020-query-routing-integration
- Proposed fix: replace `020-mcp-working-memory-hybrid-rag` with `020-query-routing-integration`

### F-P1-002: Archived review content still looks active at root
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/026-session-start-injection-debug
- Issue: `.opencode/specs/system-spec-kit/024-compact-code-graph/026-session-start-injection-debug/review/archived` exists, but root packet docs still mention phase `026` without any archived qualifier.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/026-session-start-injection-debug/review/archived
- Proposed fix: mark phase `026` review status as archived in root docs or move the archived review content out of the active packet surface

### F-P1-003: Archived review content still looks active at root
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming
- Issue: `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/review/archived` exists, but root packet docs still mention phase `027` without any archived qualifier.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/review/archived
- Proposed fix: mark phase `027` review status as archived in root docs or move the archived review content out of the active packet surface

### F-P1-004: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md:71
- Issue: Phase slug `030-opencode-plugin` does not match on-disk folder `030-opencode-graph-plugin`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin
- Proposed fix: replace `030-opencode-plugin` with `030-opencode-graph-plugin`

### F-P1-005: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/spec.md:62
- Issue: Phase slug `030-opencode-plugin` does not match on-disk folder `030-opencode-graph-plugin`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin
- Proposed fix: replace `030-opencode-plugin` with `030-opencode-graph-plugin`

### F-P1-006: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md:33
- Issue: Phase slug `030-opencode-plugin` does not match on-disk folder `030-opencode-graph-plugin`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin
- Proposed fix: replace `030-opencode-plugin` with `030-opencode-graph-plugin`

### F-P1-007: Nested numbering collision under 030
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin
- Issue: Nested sub-packet `031-copilot-startup-hook-wiring` reuses `031`, which is also a top-level phase number (`031-normalized-analytics-reader`). This can confuse readers and any tooling that assumes numbers are unique within the 024 tree.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring vs .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader
- Proposed fix: document the nested-scope exception explicitly in root/030 docs, or renumber the nested sub-packet to a local 006-style sequence

### F-P1-008: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/checklist.md:35
- Issue: Phase slug `002-implement-cache-warning-hooks` does not match on-disk folder `002-session-start-hook`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook
- Proposed fix: replace `002-implement-cache-warning-hooks` with `002-session-start-hook`

### F-P1-009: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/spec.md:33
- Issue: Phase slug `002-implement-cache-warning-hooks` does not match on-disk folder `002-session-start-hook`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook
- Proposed fix: replace `002-implement-cache-warning-hooks` with `002-session-start-hook`

### F-P1-010: Top-level phase slug drift
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/tasks.md:37
- Issue: Phase slug `002-implement-cache-warning-hooks` does not match on-disk folder `002-session-start-hook`.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/002-session-start-hook
- Proposed fix: replace `002-implement-cache-warning-hooks` with `002-session-start-hook`

### F-P1-011: Placeholder text in iteration artifact
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md:108
- Issue: Iteration artifact still contains placeholder content.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md
- Proposed fix: replace the placeholder text with actual iteration content or archive the file

### F-P1-012: Placeholder text in iteration artifact
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md:340
- Issue: Iteration artifact still contains placeholder content.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md
- Proposed fix: replace the placeholder text with actual iteration content or archive the file

### F-P1-013: Placeholder text in iteration artifact
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md:374
- Issue: Iteration artifact still contains placeholder content.
- Target: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-015.md
- Proposed fix: replace the placeholder text with actual iteration content or archive the file

## P2 Findings (polish / placeholders)
### F-P2-001: Reference to non-existent packet slash command
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/005-command-agent-alignment/spec.md:91
- Issue: Packet command `/spec_kit:handover` is not present in current `.opencode/command/` inventory.
- Target: Current command inventory under `.opencode/command/`
- Proposed fix: delete `/spec_kit:handover` or replace it with a current packet command from `.opencode/command/`

### F-P2-002: Reference to non-existent packet slash command
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-012.md:29
- Issue: Packet command `/spec_kit:handover` is not present in current `.opencode/command/` inventory.
- Target: Current command inventory under `.opencode/command/`
- Proposed fix: delete `/spec_kit:handover` or replace it with a current packet command from `.opencode/command/`

### F-P2-003: Reference to non-existent packet slash command
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-017.md:139
- Issue: Packet command `/memory:continue` is not present in current `.opencode/command/` inventory.
- Target: Current command inventory under `.opencode/command/`
- Proposed fix: delete `/memory:continue` or replace it with a current packet command from `.opencode/command/`

### F-P2-004: Reference to non-existent packet slash command
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-029.md:34
- Issue: Packet command `/spec_kit:handover` is not present in current `.opencode/command/` inventory.
- Target: Current command inventory under `.opencode/command/`
- Proposed fix: delete `/spec_kit:handover` or replace it with a current packet command from `.opencode/command/`

### F-P2-005: Reference to non-existent packet slash command
- File: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-029.md:34
- Issue: Packet command `/spec_kit:debug` is not present in current `.opencode/command/` inventory.
- Target: Current command inventory under `.opencode/command/`
- Proposed fix: delete `/spec_kit:debug` or replace it with a current packet command from `.opencode/command/`

## Summary Tables
### Broken paths by directory
| Dir | Count |
|---|---|
| 002-session-start-hook | 1 |
| 003-stop-hook-tracking | 1 |
| 006-documentation-alignment | 4 |
| 020-query-routing-integration | 3 |
| 023-context-preservation-metrics | 1 |
| 025-tool-routing-enforcement | 10 |
| 026-session-start-injection-debug | 1 |
| 027-opencode-structural-priming | 1 |
| 028-startup-highlights-remediation | 3 |
| 030-opencode-graph-plugin | 2 |
| 030-opencode-graph-plugin/001-shared-payload-provenance-layer | 2 |
| 030-opencode-graph-plugin/002-opencode-transport-adapter | 1 |
| 030-opencode-graph-plugin/003-code-graph-operations-hardening | 6 |
| 030-opencode-graph-plugin/004-cross-runtime-startup-surfacing-parity | 3 |
| 030-opencode-graph-plugin/005-code-graph-auto-reindex-parity | 6 |
| 030-opencode-graph-plugin/031-copilot-startup-hook-wiring | 6 |
| 031-normalized-analytics-reader | 8 |
| 032-cached-summary-fidelity-gates | 2 |
| 033-fts-forced-degrade-hardening | 3 |
| 034-workflow-split-and-token-insight-contracts | 2 |

### Cross-phase reference drift
| From phase | References | Status |
|---|---|---|
| 025-tool-routing-enforcement | 020-mcp-working-memory-hybrid-rag | top-level slug drift |
| 029-review-remediation | 030-opencode-plugin | top-level slug drift |
| 029-review-remediation | 030-opencode-plugin | top-level slug drift |
| 029-review-remediation | 030-opencode-plugin | top-level slug drift |
| 031-normalized-analytics-reader | 002-implement-cache-warning-hooks | top-level slug drift |
| 031-normalized-analytics-reader | 002-implement-cache-warning-hooks | top-level slug drift |
| 031-normalized-analytics-reader | 002-implement-cache-warning-hooks | top-level slug drift |
| root | Nested numbering collision under 030 | Nested numbering collision under 030 |
