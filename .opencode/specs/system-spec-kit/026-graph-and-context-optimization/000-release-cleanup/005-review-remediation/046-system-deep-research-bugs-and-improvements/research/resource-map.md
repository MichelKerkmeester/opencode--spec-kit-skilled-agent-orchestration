# Resource Map: System Bugs and Improvements

This map lists file paths that appeared in the iteration findings, grouped by subsystem. Line ranges are the cited ranges from the findings and supporting evidence inside those finding rows.

## `mcp_server/code_graph/`

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts`:265-274,289-319 — C4 / iter 014 / `F-014-C4-04`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`:1089 — A2 / iter 002 / `F-002-A2-03`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`:218-224 — C4 / iter 014 / `F-014-C4-02`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts`:501-526 — A4 / iter 004 / `F-004-A4-02`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`:159,253-296,421-423,457-459 — A2 / iter 002 / `F-002-A2-02`; A4 / iter 004 / `F-004-A4-03`; C4 / iter 014 / `F-014-C4-01`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`:156-183,166-196,199-208,271 — A2 / iter 002 / `F-002-A2-01`; C4 / iter 014 / `F-014-C4-01`, `F-014-C4-02`, `F-014-C4-03`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`:137-140 — C4 / iter 014 / `F-014-C4-03`

## `mcp_server/skill_advisor/`

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts`:116-135,220-238 — A5 / iter 005 / `F-005-A5-02`, `F-005-A5-03`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts`:8,49 — D1 / iter 016 / `F-016-D1-04`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts`:6,45 — D1 / iter 016 / `F-016-D1-08`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`:85-94 — A1 / iter 001 / `F-001-A1-02`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`:9,9-13,155-172,304-310,321,333,336-343,354,361-368,387,423,463,479,486-493,505-514 — A1 / iter 001 / `F-001-A1-01`; A3 / iter 003 / `F-003-A3-01`, `F-003-A3-02`; A4 / iter 004 / `F-004-A4-04`; D1 / iter 016 / `F-016-D1-06`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts`:71-80,123-127 — A1 / iter 001 / `F-001-A1-03`, `F-001-A1-04`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts`:7,57 — D1 / iter 016 / `F-016-D1-05`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts`:38 — D3 / iter 018 / `F-018-D3-01`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/age-haircut.ts`:5 — D1 / iter 016 / `F-016-D1-07`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts`:149-157 — B1 / iter 006 / `F-006-B1-01`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts`:9-12 — C2 / iter 012 / `F-012-C2-04`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`:120-124 — C2 / iter 012 / `F-012-C2-03`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts`:5,50 — D1 / iter 016 / `F-016-D1-07`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts`:89-90 — C2 / iter 012 / `F-012-C2-01`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts`:146-147,237-240 — A4 / iter 004 / `F-004-A4-01`; C2 / iter 012 / `F-012-C2-02`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts`:10 — D3 / iter 018 / `F-018-D3-02`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`:47 — D3 / iter 018 / `F-018-D3-03`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`:92-95 — A5 / iter 005 / `F-005-A5-01`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`:26 — C3 / iter 013 / `F-013-C3-01`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`:1256,1442,2359,2547,2759 — C3 / iter 013 / `F-013-C3-01`

## `mcp_server/lib/` (other)

- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`:9,505,557 — D1 / iter 016 / `F-016-D1-02`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts`:8 — D2 / iter 017 / `F-017-D2-02`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`:658-663 — D4 / iter 019 / `F-019-D4-01`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`:223-232,235-239 — A3 / iter 003 / `F-003-A3-03`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`:513-543,872,882 — A5 / iter 005 / `F-005-A5-05`; B3 / iter 008 / `F-008-B3-01`
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`:9,622 — D1 / iter 016 / `F-016-D1-03`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts`:47 — C1 / iter 011 / `F-011-C1-04`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`:31 — C1 / iter 011 / `F-011-C1-03`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`:1270 — C1 / iter 011 / `F-011-C1-05`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts`:42 — C1 / iter 011 / `F-011-C1-02`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts`:9 — D2 / iter 017 / `F-017-D2-01`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`:13,203 — D1 / iter 016 / `F-016-D1-01`
- `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts`:23-38 — D4 / iter 019 / `F-019-D4-03`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`:263,274,283,340 — B3 / iter 008 / `F-008-B3-02`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`:1568-1578 — A5 / iter 005 / `F-005-A5-06`

## `.opencode/skill/`

- `.opencode/skill/cli-claude-code/SKILL.md`:209-215,344 — B2 / iter 007 / `F-007-B2-05`
- `.opencode/skill/cli-claude-code/assets/prompt_templates.md`:52-55,70-72 — B2 / iter 007 / `F-007-B2-05`
- `.opencode/skill/cli-codex/SKILL.md`:247,350,359 — B2 / iter 007 / `F-007-B2-04`
- `.opencode/skill/cli-codex/assets/prompt_templates.md`:37,52-55 — B2 / iter 007 / `F-007-B2-04`
- `.opencode/skill/cli-copilot/SKILL.md`:202,269-272,280 — B2 / iter 007 / `F-007-B2-03`
- `.opencode/skill/cli-copilot/references/cli_reference.md`:137-142 — B2 / iter 007 / `F-007-B2-03`
- `.opencode/skill/cli-gemini/SKILL.md`:232,312 — B2 / iter 007 / `F-007-B2-06`
- `.opencode/skill/cli-gemini/assets/prompt_templates.md`:45-47,131-143 — B2 / iter 007 / `F-007-B2-06`
- `.opencode/skill/cli-opencode/SKILL.md`:292-294,331-347 — B2 / iter 007 / `F-007-B2-01`
- `.opencode/skill/cli-opencode/assets/prompt_templates.md`:221-230 — B2 / iter 007 / `F-007-B2-02`
- `.opencode/skill/cli-opencode/references/agent_delegation.md`:202-205,224-225 — B2 / iter 007 / `F-007-B2-02`
- `.opencode/skill/sk-code-review/SKILL.md`:30,36 — C3 / iter 013 / `F-013-C3-01`
- `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs`:87-102,200-204 — D4 / iter 019 / `F-019-D4-02`

## `.opencode/command/`

- `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml`:95-97 — C4 / iter 014 / `F-014-C4-04`
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml`:100-104 — C4 / iter 014 / `F-014-C4-04`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`:179-182,235-249,851-853 — B5 / iter 010 / `F-010-B5-01`, `F-010-B5-02`, `F-010-B5-04`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`:152-155 — B5 / iter 010 / `F-010-B5-01`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`:301-322,812-814 — B5 / iter 010 / `F-010-B5-03`, `F-010-B5-04`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`:56-61 — D4 / iter 019 / `F-019-D4-02`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`:59-64 — D4 / iter 019 / `F-019-D4-03`
- `.opencode/command/spec_kit/deep-research.md`:73 — B5 / iter 010 / `F-010-B5-04`
- `.opencode/command/spec_kit/deep-review.md`:71 — B5 / iter 010 / `F-010-B5-04`

## `scripts/`

- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`:1301 — B3 / iter 008 / `F-008-B3-01`
- `.opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts`:95 — D5 / iter 020 / `F-020-D5-02`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`:419-425,439-445 — D4 / iter 019 / `F-019-D4-01`
- `.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh`:57,78 — B4 / iter 009 / `F-009-B4-02`, `F-009-B4-03`
- `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh`:72-74 — B4 / iter 009 / `F-009-B4-03`
- `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh`:63 — B4 / iter 009 / `F-009-B4-01`
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`:73,91 — B4 / iter 009 / `F-009-B4-04`, `F-009-B4-05`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`:622-626 — B4 / iter 009 / `F-009-B4-04`

## Other

- `.opencode/plugins/spec-kit-skill-advisor.js`:40,407-412,499-502,629-630 — B1 / iter 006 / `F-006-B1-02`; D5 / iter 020 / `F-020-D5-01`, `F-020-D5-04`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`:300 — D2 / iter 017 / `F-017-D2-03`
- `.opencode/skill/system-spec-kit/mcp_server/dist/tests/search-quality/harness.js`:11 — D5 / iter 020 / `F-020-D5-03`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`:807-808 — A5 / iter 005 / `F-005-A5-04`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`:405 — B3 / iter 008 / `F-008-B3-02`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`:125-133 — B1 / iter 006 / `F-006-B1-02`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`:194,281-289 — B1 / iter 006 / `F-006-B1-01`, `F-006-B1-02`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`:157-165 — B1 / iter 006 / `F-006-B1-02`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`:139-147 — B1 / iter 006 / `F-006-B1-02`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`:6-15 — D5 / iter 020 / `F-020-D5-02`
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`:117,128-147,150,150-151,232-255,286-295,316 — B1 / iter 006 / `F-006-B1-02`, `F-006-B1-03`; D5 / iter 020 / `F-020-D5-01`, `F-020-D5-04`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts`:109 — D5 / iter 020 / `F-020-D5-03`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts`:10 — C1 / iter 011 / `F-011-C1-01`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts`:176-195 — C5 / iter 015 / `F-015-C5-02`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts`:15,122-124 — C5 / iter 015 / `F-015-C5-01`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`:68-74,141-152 — C5 / iter 015 / `F-015-C5-04`
- `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts`:305-319,332-356 — C5 / iter 015 / `F-015-C5-03`
- `.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts`:41-60 — C5 / iter 015 / `F-015-C5-05`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts`:58-76 — C5 / iter 015 / `F-015-C5-05`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts`:33-35,272-274,325-326 — C5 / iter 015 / `F-015-C5-06`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`:50 — D3 / iter 018 / `F-018-D3-04`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json`:20 — D5 / iter 020 / `F-020-D5-04`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/graph-metadata.json`:6-12,57-58 — D4 / iter 019 / `F-019-D4-01`
