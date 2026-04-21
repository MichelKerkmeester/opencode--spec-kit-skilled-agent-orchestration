# Deep Review Report: Smart-Router Remediation + OpenCode Plugin

## 1. Executive summary

Verdict: **PASS with advisories**. The packet has no P0 blockers and only three P1 findings, below the conditional threshold of five P1 findings. The strongest issues are one correctness bug in native advisor brief formatting and two traceability gaps where completion evidence is stronger in downstream docs than in the plan/full-suite acceptance record. Seven P2 advisories should be handled before using this packet as a release-readiness exemplar.

## 2. Scope

Reviewed the requested spec folder documents: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, and the missing decision-record.md slot. Reviewed referenced implementation/test surfaces: plugin, bridge, telemetry helper, smart-router checker, new tests, advisor renderer/compat, compact-code-graph plugin pattern, .gitignore, and scripts tsconfig. Production files were read-only.

## 3. Method

Ran 10 autonomous iterations rotating correctness, security, traceability, and maintainability. Each iteration read prior state, reviewed one dimension, wrote an iteration artifact, wrote a delta JSONL file, updated the registry, appended state/session events, and checked convergence. CocoIndex MCP was attempted but cancelled immediately, so direct file reads and rg discovery were used as fallback evidence.

## 4. Findings by severity

### P0

| ID | Dimension | Evidence | Finding | Remediation |
|----|-----------|----------|---------|-------------|
| None | - | - | - | - |

### P1

| ID | Dimension | Evidence | Finding | Remediation |
|----|-----------|----------|---------|-------------|
| F001 | correctness | .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122 | Native-path advisor brief hardcodes the second score as 0.00 | Replace renderNativeBrief with the canonical renderAdvisorBrief path or format top.uncertainty in the native renderer, then update the plugin fixture to reject the hardcoded 0.00 output. |
| F005 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/plan.md:61 | plan.md completion gates remain unchecked while downstream docs claim completion | Either mark the plan gates complete with evidence or change downstream completion claims to reflect incomplete plan gates. |
| F006 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:155 | Full test suite green acceptance is not evidenced | Run and record the full intended suite or narrow REQ-012/SC-006 to the targeted regression surface that was actually verified. |

### P2

| ID | Dimension | Evidence | Finding | Remediation |
|----|-----------|----------|---------|-------------|
| F002 | correctness | .opencode/plugins/spec-kit-skill-advisor.js:369 | Status reports runtime ready before any bridge/probe validation | Use a neutral initialized state until a bridge call or explicit probe succeeds, or expose readiness as unverified until first successful bridge response. |
| F003 | security | .opencode/plugins/spec-kit-skill-advisor.js:405 | Prompt-safe status still exposes local executable/path metadata | Report only basename or a boolean path_present/path_hash in normal status, with an explicit debug mode for full paths. |
| F004 | security | .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:59 | Telemetry sanitizes control characters but does not bound caller-supplied field length | Apply per-field and per-list caps before appendJsonl, and count truncations in the record metadata. |
| F007 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:40 | Phase and status metadata are stale after migration/renumbering | Refresh spec/graph metadata after migration so status, phase label, and completion state agree. |
| F008 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/decision-record.md:1 | decision-record.md is absent from the requested review corpus | Either add a short decision-record.md or document that this Level 2 packet intentionally keeps decisions in implementation-summary.md only. |
| F009 | maintainability | .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:99 | Bridge duplicates advisor rendering/sanitization logic for the native path | Make the native path call the shared renderer or a small adapter around it, then delete the duplicate renderer. |
| F010 | maintainability | .opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:55 | Static router checker has no fixture-level regression coverage for parser variants | Add a small fixture-driven test for check-smart-router.sh covering a missing path, dynamic {category}/{folder} expansion, and bloat warning exit behavior. |

## 5. Findings by dimension

### correctness

- P1 F001: Native-path advisor brief hardcodes the second score as 0.00
- P2 F002: Status reports runtime ready before any bridge/probe validation

### security

- P2 F003: Prompt-safe status still exposes local executable/path metadata
- P2 F004: Telemetry sanitizes control characters but does not bound caller-supplied field length

### traceability

- P1 F005: plan.md completion gates remain unchecked while downstream docs claim completion
- P1 F006: Full test suite green acceptance is not evidenced
- P2 F007: Phase and status metadata are stale after migration/renumbering
- P2 F008: decision-record.md is absent from the requested review corpus

### maintainability

- P2 F009: Bridge duplicates advisor rendering/sanitization logic for the native path
- P2 F010: Static router checker has no fixture-level regression coverage for parser variants

## 6. Adversarial self-check for P0

- Prompt exfiltration was considered but not elevated to P0: status tests assert raw prompt and sample secret absence, telemetry has no raw prompt field, and bridge stdout is JSON-only. Remaining status path disclosure is P2.
- Bridge failure behavior was considered but not elevated to P0: timeout, spawn error, parse failure, and nonzero exit return null additionalContext/fail_open in reviewed tests.
- Full-suite evidence gap was considered but not elevated to P0: it is a release traceability gap against REQ-012, not direct evidence of runtime breakage.
- Native renderer score drift was considered for P0 but kept P1 because it injects misleading advisor context without demonstrating data loss, execution, or fail-closed behavior.

## 7. Remediation order

1. Fix F001 and F009 together by routing native bridge output through the canonical renderer or formatting uncertainty correctly.
2. Resolve F005 and F006 by synchronizing plan checkboxes and either running/recording the full suite or narrowing the acceptance criteria.
3. Address F003 and F004 with status redaction and telemetry field caps.
4. Refresh migration/status metadata for F007 and clarify the decision-record policy for F008.
5. Add fixture coverage for check-smart-router.sh to close F010.

## 8. Verification suggestions

- Add a plugin test that fails when native brief output contains a hardcoded /0.00 denominator.
- Run the full intended suite from .opencode/skill/system-spec-kit, or update REQ-012 to name the targeted suite.
- Run validate.sh --strict after synchronizing plan.md and graph metadata.
- Add shell/fixture tests for check-smart-router.sh missing-path, dynamic expansion, and bloat-warning behavior.
- Add telemetry tests for long promptId/resource values and truncation metadata after field caps are introduced.

## 9. Appendix (iteration list + delta churn)

| Iteration | Dimension | New findings | Churn | Delta |
|-----------|-----------|--------------|-------|-------|
| 001 | correctness | F001, F002 | 0.35 | deltas/iter-001.jsonl |
| 002 | security | F003, F004 | 0.21 | deltas/iter-002.jsonl |
| 003 | traceability | F005, F006, F008 | 0.43 | deltas/iter-003.jsonl |
| 004 | maintainability | F009, F010 | 0.17 | deltas/iter-004.jsonl |
| 005 | correctness | none | 0.12 | deltas/iter-005.jsonl |
| 006 | security | none | 0.11 | deltas/iter-006.jsonl |
| 007 | traceability | F007 | 0.14 | deltas/iter-007.jsonl |
| 008 | maintainability | none | 0.10 | deltas/iter-008.jsonl |
| 009 | correctness | none | 0.10 | deltas/iter-009.jsonl |
| 010 | security | none | 0.04 | deltas/iter-010.jsonl |
