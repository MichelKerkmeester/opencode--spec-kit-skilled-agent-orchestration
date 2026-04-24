---
title: "Task Breakdo [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation/tasks]"
description: "6-batch task list covering 54 findings across correctness, security, traceability, and maintainability."
trigger_phrases:
  - "042.009 tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
# Task Breakdown: Round 3 Review Remediation

## Batch 1: Correctness (8 P1)
- [ ] T001 Fix claim-adjudication event emission in review auto+confirm YAMLs [F-031-001]
- [ ] T002 Add continuedFromRun to restart event payloads [F-031-002]
- [ ] T003 Re-validate all active P0/P1 in veto check, not just new [F-031-003]
- [ ] T004 Add freshness check to buildActiveRisks() [F-031-004]
- [ ] T005 Coerce iteration numbers in trade-off trajectory extraction [F-035-001]
- [ ] T006 Replace synthetic mutation-coverage keys with real metadata [F-035-002]
- [ ] T007 Emit legal-stop events from improve-agent workflows or update reducer [F-035-003]
- [ ] T008 Port fail-closed JSONL pattern to improve-agent reducer [F-039-001]

## Batch 2: Security (7 P1, 3 P2)
- [ ] T009 Replace inline shell in 4 research/review YAMLs with helper scripts [F-040-001]
- [ ] T010 Remove node -e from improve-agent YAMLs, use checked-in scripts [F-040-002]
- [ ] T011 Add path containment to generate-profile.cjs and scan-integration.cjs [F-040-003]
- [ ] T012 Escape regex metacharacters in scan-integration.cjs [F-036-002]
- [ ] T013 Add path preflight and slug validation to session-boundary gate [F-036-001]
- [ ] T014 Apply containment to replay-corpus save/load helpers [F-044-001]
- [ ] T015 Validate path segments before mkdirSync in promote.cjs [F-044-002]
- [ ] T016 Replace residual sign-off wording in Level 3+ docs [F-048-001]
- [ ] T017 Add stakeholder tracking to level_specifications.md Level 3+ definition [F-048-002]
- [ ] T018 Fix schema_version migration edge case [F-043-001]

## Batch 3: Traceability — Reference Docs (7 P1, 1 P2)
- [ ] T019 Rewrite research convergence.md to blocked_stop schema [F-033-001]
- [ ] T020 Fix research loop_protocol.md delta-to-full replay [F-033-002]
- [ ] T021 Update review mode_contract.yaml reducer input model [F-033-003]
- [ ] T022 Replace abbreviated pause/resume examples with full payloads [F-033-004]
- [ ] T023 Fix root Phase 7 folder routing in tasks.md and spec.md [F-037-001, F-045-001]
- [ ] T024 Downgrade root verification or finish lifecycle cleanup [F-037-002]
- [ ] T025 Add Lane-to-Commit mapping to root implementation-summary [F-037-003, F-045-004]

## Batch 4: Traceability — Mirrors + Root Docs (8 P1, 6 P2)
- [ ] T026 Sync Claude deep-review mirror iteration skeleton [F-041-001]
- [ ] T027 Sync Gemini deep-review mirror [F-041-002]
- [ ] T028 Add archivedPath to confirm-mode resume events (review + research) [F-041-003, F-041-004]
- [ ] T029 Fix Claude deep-research mirror Step 1 reads [F-041-005]
- [ ] T030 Fix Gemini deep-research mirror config fields [F-041-006]
- [ ] T031 Restore Claude improve-agent runtime-truth section [F-041-007]
- [ ] T032 Fix Gemini improve-agent shell tool issue [F-041-008]
- [ ] T033 Rewrite root plan.md to 8-phase topology [F-045-002]
- [ ] T034 Re-open unverified root checklist items [F-045-003]
- [ ] T035 Remove /create:prompt from README or restore command [F-049-001]
- [ ] T036 Fix README count badges [F-049-002]
- [ ] T037 Remove stale static-mode language from improve-agent command doc [F-049-003]
- [ ] T038 Update Phase 002 spec to v2 DDL [F-043-002]

## Batch 5: Maintainability — Code (10 P1, 3 P2)
- [ ] T039 Require explicit session/generation at joinWave() boundary [F-034-001]
- [ ] T040 Add finalizeBoard() path to wave-coordination-board [F-034-002]
- [ ] T041 Use shared session helper in contradiction scanner [F-034-003, F-050-002]
- [ ] T042 Consolidate integration + cross-layer test suites [F-038-001]
- [ ] T043 Add archive exclusion to root vitest.config.ts [F-038-002]
- [ ] T044 Update Phase 008 docs to cite v1.x.2.0 releases [F-042-001, F-050-004]
- [ ] T045 Add version footer to deep-loop skill READMEs [F-042-002]
- [ ] T046 Isolate repeatedFindings to legacy adapter path [F-042-003, F-050-006]
- [ ] T047 Consolidate entity-length policy to shared constant [F-042-004, F-050-007]
- [ ] T048 Fix wave merge hidden defaults [F-050-001]

## Batch 6: Maintainability — Playbooks (4 P1, 4 P2)
- [ ] T049 Rewrite DRV-015 around flat event schema [F-046-001, F-050-003]
- [ ] T050 Rename E2E-022 around flat mutation-coverage artifact [F-046-002, F-050-005]
- [ ] T051 Fix RT-027 to verify via archive separation [F-046-003]
- [ ] T052 Reword RT-030 stability to last-N-samples range [F-046-004]

## Verification
- [ ] T053 Run tsc --noEmit on MCP server
- [ ] T054 Run vitest suite (0 failures)
- [ ] T055 Grep sweep for stale references
- [ ] T056 Commit and push to 026
