---
title: "225 -- Runtime remediation, revalidation, and auto-repair workflows"
description: "This scenario validates Runtime remediation, revalidation, and auto-repair workflows for `225`. It focuses on Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals."
---

# 225 -- Runtime remediation, revalidation, and auto-repair workflows

## 1. OVERVIEW

This scenario validates Runtime remediation, revalidation, and auto-repair workflows for `225`. It focuses on Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `225` and confirm the expected signals without contradicting evidence.

- Objective: Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals
- Prompt: `Validate the runtime remediation surface for the Spec Kit Memory MCP server. Capture the evidence needed to prove save-time remediation enforces preflight, V-rule, quality-loop, and pre-storage quality gates, that the V-rule bridge resolves the compiled validate-memory-quality runtime at the documented ../../../ path, that operator-facing repair stays confirmation-gated inside memory_health, and that checkpoint plus memory_validate paths still preserve rollback-aware revalidation signals. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the remediation surface enforces save-time guards, bounded operator repair, and rollback-aware revalidation behavior end to end

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 225 | Runtime remediation, revalidation, and auto-repair workflows | Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals | `Validate the runtime remediation surface for the Spec Kit Memory MCP server. Capture the evidence needed to prove save-time remediation enforces preflight, V-rule, quality-loop, and pre-storage quality gates, that the V-rule bridge resolves the compiled validate-memory-quality runtime at the documented ../../../ path, that operator-facing repair stays confirmation-gated inside memory_health, and that checkpoint plus memory_validate paths still preserve rollback-aware revalidation signals. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts` 2) `cd .opencode/skill/system-spec-kit/mcp_server && node -e "const fs=require('fs'); const path=require('path'); const p=path.resolve(process.cwd(),'handlers','../../../scripts/dist/memory/validate-memory-quality.js'); console.log(p); console.log(fs.existsSync(p) ? 'exists' : 'missing')"` 3) inspect assertions covering `memory_save` preflight, V-rule disposition handling, quality-loop rejection or repair, and downstream save-quality-gate outcomes 4) inspect assertions covering `memory_health` confirmation-required auto-repair and bounded repair metadata 5) inspect assertions covering `memory_validate` and checkpoint pathways that preserve revalidation or rollback signals | Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence | Test transcript + load-path check output + key assertion output for save-time guards, confirmation gating, repair metadata, and checkpoint or validation signals | PASS if the targeted suites pass, the compiled validator path resolves, and the evidence confirms the remediation surface enforces save-time guards, bounded operator repair, and rollback-aware revalidation behavior end to end | Inspect `mcp_server/handlers/memory-save.ts`, `mcp_server/lib/validation/preflight.ts`, `mcp_server/handlers/v-rule-bridge.ts`, `mcp_server/handlers/quality-loop.ts`, `mcp_server/lib/validation/save-quality-gate.ts`, `mcp_server/handlers/checkpoints.ts`, and `mcp_server/handlers/memory-crud-health.ts` if any remediation-stage signal is missing or contradictory |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [20--remediation-revalidation/01-category-stub.md](../../feature_catalog/20--remediation-revalidation/01-category-stub.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 225
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `20--remediation-revalidation/225-remediation-runtime-surface.md`
