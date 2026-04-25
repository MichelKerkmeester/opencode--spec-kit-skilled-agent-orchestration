---
title: "Phase 027 Post-Implementation Deep-Review Remediation Report"
description: "Closure evidence for 21 unique findings from review/027-skill-graph-daemon-and-advisor-unification-pt-01."
importance_tier: "high"
contextType: "review-remediation"
---

# Remediation Report — Phase 027 Review 027

## Summary

All 21 unique findings from the Phase 027 post-implementation deep-review were remediated: 15 P1 findings and 6 P2 findings.

Primary themes:
- Sanitizer coverage now wraps public advisor recommendations, redirect metadata, bridge output, and Python shim metadata.
- `advisor_recommend` now fails open on absent freshness without scoring.
- `advisor_status` now returns `skillCount` and `lastScanAt`.
- `advisor_validate` now measures real corpus, holdout, parity, safety, and latency slices instead of hard-coded pass values.
- Promotion gates now include the missing §11 correctness slices.
- Python native shim honors caller thresholds.
- Compat entrypoints route through a stable package-local `skill-advisor/compat/index.ts`.
- Advisor test coverage is consolidated under `mcp_server/skill-advisor/tests/`.
- Parent and child packet docs were corrected for shipped state and evidence citations.

## Findings

| Finding | Fix | Files touched | Evidence |
|---|---|---|---|
| R1-P1-001 | Replaced hard-coded deterministic validate slices with measured 200-prompt corpus, holdout, Python-correct parity, ambiguity, derived-lane, adversarial-stuffing, regression-suite, and latency measurements. | `handlers/advisor-validate.ts`, `schemas/advisor-tool-schemas.ts`, `tests/handlers/advisor-validate.vitest.ts` | `advisor-validate.ts:116`, `advisor-validate.ts:172`, `advisor-validate.ts:191`, `advisor-validate.ts:269`; advisor suite 167/167 |
| R1-P1-002 | Added missing promotion gates: UNKNOWN≤10, gold-`none` no-increase, explicit-skill no-regression, ambiguity stability, derived-lane attribution, adversarial-stuffing rejection. | `lib/promotion/gate-bundle.ts`, `tests/promotion/promotion-gates.vitest.ts` | `gate-bundle.ts:103`, `gate-bundle.ts:109`, `gate-bundle.ts:115`, `gate-bundle.ts:121`, `gate-bundle.ts:127`, `gate-bundle.ts:133`; `promotion-gates.vitest.ts:123` |
| R2-P1-001 | Sanitized public recommendation skill labels, lifecycle status, redirect metadata, and recommendation envelopes before response. | `handlers/advisor-recommend.ts`, `lib/render.ts`, `tests/handlers/advisor-recommend.vitest.ts` | `advisor-recommend.ts:92`, `advisor-recommend.ts:98`, `advisor-recommend.ts:124`, `advisor-recommend.vitest.ts:174` |
| R3-P1-001 | Corrected parent packet from research draft to complete shipped packet; added completion date, ship SHAs, review remediation pointer, and ADR-007 pointer. | `027-skill-graph-daemon-and-advisor-unification/spec.md` | Parent `spec.md` metadata table now shows `Status: Complete`, ship SHAs, and remediation report pointer. |
| R3-P1-002 | Replaced vague checklist claims with file:line citations or explicit verification evidence. | `004-mcp-advisor-surface/checklist.md`, `006-promotion-gates/checklist.md` | Checklist evidence now cites `advisor-recommend.ts:92`, `advisor-status.ts:60`, `gate-bundle.ts:103`, `promotion-gates.vitest.ts:123`, and related lines. |
| R6-P1-001 | Applied prompt-safe label sanitizer to native bridge output and legacy bridge metadata, including redirect fields. | `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`, `tests/compat/plugin-bridge.vitest.ts` | Bridge sanitizer at `spec-kit-skill-advisor-bridge.mjs:99`; native metadata sanitation at `spec-kit-skill-advisor-bridge.mjs:199`; plugin bridge tests 3/3. |
| R7-P1-001 | Replaced scaffolded 027/006 summary with shipped-state summary, SHA `5696acf4a`, real modules, and verification counts. | `006-promotion-gates/implementation-summary.md`, `006-promotion-gates/spec.md`, `006-promotion-gates/checklist.md` | 006 summary now lists `gate-bundle.ts`, promotion tests, `advisor-validate.ts`, 167/167 advisor tests, typecheck/build, and 52/52 Python regression. |
| R10-P1-001 | Removed prompt-derived `lane.evidence` from public `includeAttribution`; only lane contribution metadata is returned. | `handlers/advisor-recommend.ts`, `schemas/advisor-tool-schemas.ts`, `tests/handlers/advisor-recommend.vitest.ts` | `advisor-recommend.ts:115`; schema lane metadata at `advisor-tool-schemas.ts:16`; test assertion at `advisor-recommend.vitest.ts:114`. |
| R11-P1-001 | Re-certified 027/004 checklist only after sanitizer and attribution fixes landed; added concrete sanitizer and privacy evidence. | `004-mcp-advisor-surface/checklist.md`, `004-mcp-advisor-surface/implementation-summary.md` | 004 checklist security section cites sanitizer and attribution code/tests. |
| R21-P1-001 | Added absent-freshness fail-open behavior: return empty recommendations with freshness `absent` and do not score. | `handlers/advisor-recommend.ts`, `tests/handlers/advisor-recommend.vitest.ts` | `advisor-recommend.ts:83`, `advisor-recommend.ts:132`, `advisor-recommend.vitest.ts:232`. |
| R21-P1-002 | Added `skillCount` and `lastScanAt` to advisor status output and schema. | `handlers/advisor-status.ts`, `schemas/advisor-tool-schemas.ts`, `tests/handlers/advisor-status.vitest.ts` | `advisor-status.ts:41`, `advisor-status.ts:84`, `advisor-tool-schemas.ts:80`, `advisor-status.vitest.ts:33`. |
| R22-P1-001 | Confirmed R2 sanitizer fix also covers native redirect metadata at the original line-79 public-envelope path. | `handlers/advisor-recommend.ts`, `tests/handlers/advisor-recommend.vitest.ts` | `advisor-recommend.ts:101`, `advisor-recommend.ts:124`, `advisor-recommend.vitest.ts:174`. |
| R25-P1-001 | Passed caller thresholds through the Python native shim into `advisor_recommend` options. | `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, `tests/compat/shim.vitest.ts` | `skill_advisor.py:133`, `skill_advisor.py:360`, `skill_advisor.py:3210`; shim tests 4/4. |
| R29-P1-001 | Duplicate of R21-P1-001; fixed by the single absent-freshness fail-open implementation. | `handlers/advisor-recommend.ts` | `advisor-recommend.ts:132`. |
| R29-P1-002 | Duplicate of R21-P1-002; fixed by the single status-envelope implementation. | `handlers/advisor-status.ts`, `schemas/advisor-tool-schemas.ts` | `advisor-status.ts:84`, `advisor-tool-schemas.ts:80`. |
| R1-P2-001 | Extended MCP tool schemas with full status/trust envelope and measured validate-slice schema additions. | `schemas/advisor-tool-schemas.ts` | `advisor-tool-schemas.ts:46`, `advisor-tool-schemas.ts:70`, `advisor-tool-schemas.ts:102`. |
| R3-P2-001 | Canonicalized ADR-007 in the parent decision record. | `decision-record.md` | ADR-007 added: Python parity is regression protection, not byte-for-byte freeze. |
| R4-P2-001 | Added stable package-local compat entrypoint and switched plugin source signature to it instead of private handler/probe internals. | `skill-advisor/compat/index.ts`, `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` | `compat/index.ts:5`, `spec-kit-skill-advisor.js:23`, `spec-kit-skill-advisor-bridge.mjs:143`. |
| R20-P2-001 | Same stable compat-entrypoint hardening as R4-P2-001. | `skill-advisor/compat/index.ts`, `.opencode/plugins/spec-kit-skill-advisor.js` | `compat/index.ts:5`, `spec-kit-skill-advisor.js:23`. |
| R8-P2-001 | Consolidated advisor freshness generation path onto the skill-graph generation ledger and documented the decision through ADR/remediation. | `lib/generation.ts`, `lib/generation.ts` tests via legacy freshness suite | `generation.ts:161`, `generation.ts:167`, legacy freshness tests 11/11. |
| R16-P2-001 | Moved remaining `advisor-*.vitest.ts` files from `mcp_server/tests/` into package-local `mcp_server/skill-advisor/tests/legacy/`; copied advisor fixtures locally while leaving shared hook fixtures intact. | `skill-advisor/tests/legacy/**`, removed old `mcp_server/tests/advisor-*.vitest.ts` | No `advisor-*.vitest.ts` remain under `mcp_server/tests`; advisor suite now runs 23 package-local files / 167 tests. |

## Verification

- Advisor vitest: `../scripts/node_modules/.bin/vitest run mcp_server/skill-advisor/tests/ --reporter=default` → 23 files / 167 tests passed.
- Typecheck + build: `npm run typecheck && npm run build` → exit 0.
- Python regression: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` → `overall_pass: true`, 52/52 passed.
- Code-graph regression: `../scripts/node_modules/.bin/vitest run mcp_server/code-graph/tests/ --reporter=default` → 7 files / 52 tests passed.

## Blockers

None.
