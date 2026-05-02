---
title: "Rename Log: 047 matrix_runners Snake Case Rename"
description: "Ledger for the matrix_runners runtime directory rename and literal reference replacement."
trigger_phrases:
  - "034-matrix-runners-snake-case-rename"
  - "matrix_runners rename"
  - "kebab-to-snake convention"
  - "mcp_server folder convention"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/034-matrix-runners-snake-case-rename"
    last_updated_at: "2026-04-29T22:47:36+02:00"
    last_updated_by: "codex"
    recent_action: "Logged rename"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-matrix-runners-snake-case-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Rename Log: 047 matrix_runners Snake Case Rename

## Summary

- Runtime directory moved to `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/`.
- `git mv` was attempted first and failed because the sandbox could not create `.git/index.lock`.
- Filesystem `mv` completed the directory rename.
- Literal old folder references replaced before packet docs were added: **301**.
- Text files updated by the literal replacement before packet docs were added: **57**.
- Runtime files moved with the directory: **23**.

## Moved Runtime Files

- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F10-deep-loop.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F11-hooks.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F12-validators.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F13-stress-cycle.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F14-search-w3-w13.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F2-skill-advisor.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F3-memory-search.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F4-memory-context.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F5-code-graph-query.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F6-code-graph-scan.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F7-causal-graph.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F8-cocoindex.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/templates/F9-continuity.md`

## Text Files Updated

- `README.md`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/282-code-graph-cell-coverage-evidence.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-claude-code.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-test-utils.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/checklist.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/plan.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners/tasks.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit/audit-findings.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/001-sk-code-opencode-audit/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio/discovery-notes.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/002-feature-catalog-trio/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/003-testing-playbook-trio/discovery-notes.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment/audit-findings.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment/audit-target-list.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/006-readme-cascade-refresh/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/006-readme-cascade-refresh/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/006-readme-cascade-refresh/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/006-readme-cascade-refresh/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/006-readme-cascade-refresh/target-list.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/027-evergreen-doc-packet-id-removal/audit-findings.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/027-evergreen-doc-packet-id-removal/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/029-root-readme-refresh/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/029-root-readme-refresh/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/009-documentation-truth/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/graph-metadata.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/plan.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/research/prompts/iteration-001.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/tasks.md`
- Current packet `research/prompts/iteration-001.md`

## Verification Commands

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build
npx vitest run matrix-adapter
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/034-matrix-runners-snake-case-rename --strict
grep -rln '<old-folder-fragment>' .opencode/ specs/ AGENTS.md CLAUDE.md README.md 2>/dev/null
```
