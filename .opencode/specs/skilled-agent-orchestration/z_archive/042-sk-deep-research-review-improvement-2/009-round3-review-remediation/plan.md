---
title: "Implementatio [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation/plan]"
description: "6-batch sequential fix plan using cli-codex GPT 5.4 high/fast primary with cli-copilot fallback."
trigger_phrases:
  - "042.009 plan"
  - "round 3 fix plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
# Implementation Plan: Round 3 Review Remediation

## Approach

Sequential batch execution via cli-codex (`codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" --full-auto`). If any batch fails, retry once via cli-copilot (`copilot -p --model gpt-5.4 --allow-all-tools`) as fallback.

Max 1 codex process at a time to stay within memory limits.

## Batch Plan

### Batch 1: Correctness Fixes (findings 1-10)
- Review reducer: claim-adjudication event emission, restart lineage, veto freshness, ACTIVE RISKS freshness
- Improve-agent reducer: fail-closed JSONL, legal-stop events, mutation-coverage real keys
- Trade-off detector: iteration number coercion
- Coverage-graph DB: schema_version migration edge case
- Phase 002 spec: update to v2 DDL

### Batch 2: Security Fixes (findings 12-20)
- All 4 research/review workflow YAMLs: replace inline shell with helper scripts for spec_folder
- Both improve-agent YAMLs: remove `node -e`, move to checked-in scripts
- `scan-integration.cjs`: escape regex metacharacters
- `generate-profile.cjs`: add containment checks
- `replay-corpus.cjs`: apply containment to save/load helpers
- `promote.cjs`: validate paths before mkdirSync
- Level 3+ docs: replace residual sign-off wording

### Batch 3: Traceability — Reference Docs (findings 21-27)
- Research convergence.md: legalStop to blocked_stop
- Research loop_protocol.md: delta to full replay
- Review mode_contract.yaml: delta to full input model
- Both loop protocols: full-field pause/resume examples
- Root tasks.md + spec.md: Phase 7 folder routing
- Root implementation-summary: Lane verification status and commit mapping

### Batch 4: Traceability — Agent Mirrors + Root Docs (findings 28-39)
- 3 Claude mirrors: deep-review, deep-research, improve-agent
- 3 Gemini mirrors: deep-review, deep-research, improve-agent
- 2 confirm YAMLs: archivedPath in resume events
- Root plan.md: 4-phase to 8-phase
- Root checklist.md: re-open unverified items
- Root README: remove /create:prompt, fix count badges

### Batch 5: Maintainability — Code (findings 40-48)
- wave-lifecycle.cjs: explicit session/generation at joinWave() boundary
- wave-coordination-board.cjs: finalizeBoard() path
- coverage-graph-contradictions.cjs: use shared session helper
- Consolidate integration + cross-layer test suites
- Root vitest.config.ts: archive exclusion
- Phase 008 docs: update release evidence to v1.x.2.0
- Skill READMEs: version footer + changelog links
- Review reducer: isolate repeatedFindings to legacy path
- graph-metadata-parser.ts + entity-extractor.ts: shared length constant

### Batch 6: Maintainability — Playbooks + Docs (findings 49-54)
- DRV-015: rewrite around flat event schema
- E2E-022: rename around flat mutation-coverage artifact
- RT-027: verify via archive separation, not missing fields
- RT-030: reword stability to last-N-samples range
- Improve-agent command doc: remove stale static-mode language
- level_specifications.md: add stakeholder tracking to Level 3+

## Verification Plan

After all 6 batches:
1. `tsc --noEmit` on MCP server
2. `npx vitest run` on scripts/tests
3. Grep sweep for stale references
4. Commit and push to 026 branch
