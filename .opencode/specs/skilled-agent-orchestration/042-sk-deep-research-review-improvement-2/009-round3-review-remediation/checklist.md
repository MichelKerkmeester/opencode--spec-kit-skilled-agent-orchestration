---
title: "Verifica [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation/checklist]"
description: "QA checklist for 54-finding remediation across correctness, security, traceability, and maintainability."
trigger_phrases:
  - "042.009 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
# Verification Checklist: Round 3 Review Remediation

## P0 — Must Complete

- [ ] CHK-001 [P0] No new P0 findings introduced by fixes
- [ ] CHK-002 [P0] `tsc --noEmit` passes on MCP server after all batches
- [ ] CHK-003 [P0] Vitest suite passes (0 failures) after all batches

## P1 — Required

### Correctness
- [ ] CHK-010 [P1] Claim-adjudication events emitted in both review workflow YAMLs
- [ ] CHK-011 [P1] Restart lineage carries continuedFromRun
- [ ] CHK-012 [P1] Stale STOP veto cleared when findings resolve
- [ ] CHK-013 [P1] ACTIVE RISKS uses timestamp freshness
- [ ] CHK-014 [P1] Improve-agent reducer throws on corrupt JSONL
- [ ] CHK-015 [P1] Legal-stop events emitted from improve-agent workflows

### Security
- [ ] CHK-020 [P1] No inline shell interpolation of spec_folder in any workflow YAML
- [ ] CHK-021 [P1] No `node -e` in improve-agent YAMLs
- [ ] CHK-022 [P1] Regex metacharacters escaped in scan-integration.cjs
- [ ] CHK-023 [P1] Path containment enforced in generate-profile.cjs
- [ ] CHK-024 [P1] Replay-corpus save/load helpers enforce root boundary
- [ ] CHK-025 [P1] Promotion validates paths before mkdir

### Traceability
- [ ] CHK-030 [P1] Research convergence.md uses blocked_stop schema throughout
- [ ] CHK-031 [P1] Both loop protocols describe full-history replay
- [ ] CHK-032 [P1] Root Phase 7 routes to correct folder (007-skill-rename-improve-agent-prompt)
- [ ] CHK-033 [P1] All 6 runtime mirrors synced with canonical agent definitions
- [ ] CHK-034 [P1] Root plan.md describes 8-phase topology
- [ ] CHK-035 [P1] README count badges internally consistent

### Maintainability
- [ ] CHK-040 [P1] joinWave() requires explicit session/generation
- [ ] CHK-041 [P1] Contradiction scanner uses shared session helper
- [ ] CHK-042 [P1] Phase 008 docs cite v1.x.2.0 patch releases
- [ ] CHK-043 [P1] repeatedFindings isolated to legacy path
- [ ] CHK-044 [P1] All 4 playbooks (DRV-015, E2E-022, RT-027, RT-030) match shipped code

## P2 — Nice to Have
- [ ] CHK-050 [P2] Archived test exclusion in root vitest.config.ts
- [ ] CHK-051 [P2] Entity-length policy consolidated to shared constant
- [ ] CHK-052 [P2] No stale enterprise/sign-off/HYDRA references in active docs
- [ ] CHK-053 [P2] Skill READMEs have version footer
