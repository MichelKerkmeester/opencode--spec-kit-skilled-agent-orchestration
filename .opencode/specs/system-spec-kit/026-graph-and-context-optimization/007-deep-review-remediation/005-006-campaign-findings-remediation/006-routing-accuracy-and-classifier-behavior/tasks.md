---
title: "Tasks: 006-routing-accuracy-and-classifier-behavior Routing Accuracy and Classifier Behavior Remediation"
description: "Task ledger for 006-routing-accuracy-and-classifier-behavior Routing Accuracy and Classifier Behavior Remediation."
trigger_phrases:
  - "tasks 006 routing accuracy and classifier behavior routing accuracy and "
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/006-routing-accuracy-and-classifier-behavior"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 006-routing-accuracy-and-classifier-behavior Routing Accuracy and Classifier Behavior Remediation
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Confirm consolidated findings source is readable
- [ ] T002 [P0] Verify severity counts against the source report
- [ ] T003 [P1] Identify target source phases before implementation edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] [P0] CF-052: [F001] Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint. _(dimension: security)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier. Evidence: SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040 SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343 SOURCE: implementation-summary.md:53
- [ ] T011 [P] [P1] CF-141: [F005] Tier3 LLM routing research closes without a security objective _(dimension: security)_ Source phase: 001-search-and-routing-tuning. Evidence: 002-content-routing-accuracy/spec.md:14; 002-content-routing-accuracy/spec.md:35-45; 002-content-routing-accuracy/spec.md:67-73
- [ ] T012 [P] [P1] CF-029: [F001] Continuity fixture validates a handover-first packet state that this packet does not ship _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation. Evidence: spec.md:102, .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:45-47, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation:1-7
- [ ] T013 [P] [P1] CF-053: [F002] Built-in Tier 3 cache keys ignore routing context and can replay stale destinations. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier. Evidence: SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:313 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756 SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:26
- [ ] T014 [P] [P1] CF-069: [F001] The Tier 3 prompt still leaks the internal drop_candidate alias inside a contract that says only the existing 8 public categories are valid. _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment. Evidence: spec.md:24; .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1275; .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582
- [ ] T015 [P] [P1] CF-157: [F005] Current prompt-leakage release gates are omitted from the packet acceptance scope. _(dimension: security)_ Source phase: 002-skill-advisor-graph/002-manual-testing-playbook. Evidence: spec.md:120, spec.md:132, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:101, .opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:56
- [ ] T016 [P] [P1] CF-269: [F002] Analyzer artifact mixes static unknown records into the live telemetry stream while the static stream is absent. _(dimension: traceability)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: smart-router-analyze-report-2026-04-19T17-57-07-192Z.md:3, smart-router-analyze-report-2026-04-19T17-57-07-192Z.md:19, smart-router-analyze-report-2026-04-19T17-57-07-192Z.md:20, smart-router-measurement.ts:107, smart-router-measurement.ts:637, .opencode/skill/.smart-router-telemetry/compliance.jsonl:1
- [ ] T017 [P] [P2] CF-031: [F003] Tier 3 prompt contract mixes canonical drop with the internal drop_candidate alias _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273-1288, .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582-585, implementation-summary.md:59
- [ ] T018 [P] [P2] CF-056: [F005] Shared Tier 3 cache keeps session entries forever with no bound or eviction. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier. Evidence: SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806
- [ ] T019 [P] [P2] CF-072: [F002] The new continuity paragraph discloses more internal topology to the external Tier 3 classifier than before. _(dimension: security)_ Source phase: 001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273
- [ ] T020 [P] [P2] CF-230: [DR-P2-001] Status diagnostics are called prompt-safe but do not define a redaction allowlist. _(dimension: security)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: research/research-validation.md:31, research/research-validation.md:33, research/research-validation.md:46, research/research-validation.md:49
- [ ] T021 [P] [P2] CF-257: [F008] Prompt-cache HMAC default secret uses Math.random() entropy. _(dimension: security)_ Source phase: 005-skill-advisor-docs-and-code-alignment. Evidence: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:39 through line 41
- [ ] T022 [P] [P2] CF-263: [F004] Telemetry sanitizes control characters but does not bound caller-supplied field length _(dimension: security)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:59
- [ ] T023 [P] [P2] CF-267: [F010] Static router checker has no fixture-level regression coverage for parser variants _(dimension: maintainability)_ Source phase: 006-smart-router-remediation-and-opencode-plugin. Evidence: .opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:55
- [ ] T024 [P] [P2] CF-270: [F003] Static parser leaves a large unknown/zero-resource slice, limiting savings conclusions. _(dimension: correctness)_ Source phase: 007-deferred-remediation-and-telemetry-run. Evidence: smart-router-measurement-report.md:23, smart-router-measurement-report.md:25, smart-router-measurement-report.md:30, smart-router-measurement-report.md:32, smart-router-measurement-report.md:38, smart-router-measurement-results.jsonl:199
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T900 [P0] Run strict packet validation
- [ ] T901 [P1] Update graph metadata after implementation
- [ ] T902 [P1] Add implementation summary closeout evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or explicitly deferred
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
