# Deep Review Strategy - 024 Compact Code Graph

## 1. Overview

Fresh canonical deep-review session for `.opencode/specs/system-spec-kit/024-compact-code-graph`.

- Session ID: `rvw-2026-04-13T16-50-40Z`
- Mode: `review`
- Target type: `spec-folder`
- Max iterations: `20`
- Lifecycle classification: `new`
- Prior invalid deep-review artifacts archived under `review_archive/2026-04-13T16-50-40Z-invalid-root-deep-review/`
- Operator-requested extension resumed the completed run from iteration 006 so the untouched runtime and code-graph packet surfaces could be reviewed before closing.

## 2. Topic

Audit the root packet, representative child phases, and the runtime implementation/doc surfaces the packet claims to ship for compact code graph, query routing, structural context, startup priming, and cross-runtime recovery behavior.

## 3. Review Dimensions

- [x] Correctness
- [x] Security
- [x] Traceability
- [x] Maintainability

## 4. Non-Goals

- Modifying code or docs under review.
- Reusing archived findings without live-tree verification.
- Auditing unrelated packet families except where root or child packet references require a validity check.

## 5. Stop Conditions

- Maximum `20` iterations reached.
- Earlier stop allowed only when all four dimensions are covered, traceability protocols are covered, no new P0/P1 findings appear in stabilization passes, and the evidence/scope guards remain satisfied.

## 6. Known Context

- Existing root `review/` deep-review artifacts were invalid for resume because the canonical config, state log, and findings registry were missing.
- Prior repo memory indicates a historical `024-compact-code-graph` deep review existed; any prior claims must be revalidated against the current tree before reuse.
- Deep-research artifacts remain in `review/` and are out of scope for mutation during this review.
- CocoIndex semantic discovery may be unavailable in this environment, so direct file reads and exact search may be required.
- The first synthesis stopped at iteration 005 with advisory-only bootstrap/resume findings; the resumed extension targets the runtime/code-graph surfaces that first pass barely touched.

## 7. Cross-Reference Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | advisory | Bootstrap/resume contract still works, but the root packet lags current Gemini-hook and structural-tool-count reality. |
| `checklist_evidence` | core | advisory | Checked completion claims still lean too heavily on summary-only evidence. |
| `feature_catalog_code` | overlay | advisory | `session_resume` and cross-runtime fallback mirrors both drift from current runtime behavior. |
| `playbook_capability` | overlay | advisory | Session-resume playbook remains stale even though the runtime-detection playbooks are current. |

## 8. Files Under Review

| File or Group | Purpose |
|---------------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` | Root packet contract and completion evidence. |
| Child phases `001-034` | Validate cross-reference integrity, status carry-forward, and per-phase evidence where root claims depend on them. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Validate root recovery and structural bootstrap claims. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Validate resume surface referenced by packet docs. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` | Validate structural context and compact graph context claims. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | Validate graph query traversal and filters. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | Validate structural bootstrap budget and payload claims. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Validate autosave and packet-targeting claims. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Validate compact recovery and cross-runtime safety parity. |
| `.opencode/skill/system-spec-kit/mcp_server/README.md`, feature catalog, manual playbook | Validate overlay protocol truth-sync. |

## 9. Running Findings

- P0: `0`
- P1: `0`
- P2: `7`
- Last delta: `Iteration 006 extension traceability pass found three additional advisory packet/doc parity issues; iterations 007-010 found no new P0/P1 issues`

## 10. What Worked

- Root packet docs, handler code, and tool-schema registrations were enough to validate the bootstrap/resume happy-path contract without touching unrelated child packets.
- The resume ladder and structural bootstrap helpers expose enough local evidence to assess canonical recovery behavior directly from the runtime surfaces.
- Cached-summary reuse, structural trust validation, and hook-state persistence all fail closed in the reviewed security paths.
- The README already reflects the current canonical recovery ladder and bootstrap/resume split, which helped isolate drift to narrower mirrors.
- Bootstrap messaging and routing-nudge ownership are covered by focused maintainability tests instead of only broad integration suites.
- Stabilization re-check confirmed the advisory findings stay bounded and do not hide a release-blocking runtime defect.
- The untouched code-graph handlers and their targeted regression suites remained aligned during the extension pass.
- Runtime-detection playbooks already describe Codex/Copilot/Gemini hook policy more accurately than the stale feature summary.

## 11. What Failed

- Public schema coverage does not fully match the recovery handler signature (`sessionId` remains implementation-only).
- Missing-graph recovery guidance is not surface-aware, so bootstrap can emit a self-referential next step.
- No additional security weakness was reproduced after tracing transcript identity, scope, and trust-axis validation.
- Feature-catalog/playbook mirrors for `session_resume` still describe the older `memory_context` sub-call model and stale graph-status expectations.
- Root checklist evidence is too summary-heavy to act as a strong standalone audit artifact.
- No additional maintainability defect was confirmed beyond the already-logged source-surface action drift.
- Stabilization found no new P0/P1 issues after all four dimensions were covered.
- The root spec still documents Gemini as a future hook adapter even though phase 022 and the Gemini hook surfaces are now shipped.
- The cross-runtime fallback feature card still collapses Codex/Copilot/Gemini into one `session-prime.ts` hook story even though runtime detection and playbooks are config-driven.
- The root implementation summary undercounts the public structural MCP tool surface.

## 12. Exhausted Approaches

- Correctness pass across root packet contract, bootstrap/resume handlers, public tool schemas, and structural bootstrap helper.
- Security pass across cached-summary acceptance, structural trust validation, hook-state persistence, and bootstrap trust tests.
- Traceability pass across root checklist evidence, public README, session-resume feature catalog, and manual testing playbook mirrors.
- Maintainability pass across bootstrap message assembly, structural contract reuse, and focused bootstrap/routing regression tests.
- Extension traceability pass across Gemini runtime support wording, cross-runtime fallback docs, and root structural tool-surface summaries.
- Extension correctness, security, and maintainability passes across the untouched code-graph handlers, runtime-detection logic, stop-hook replay path, and Gemini SessionStart hook.

## 13. Ruled Out Directions

- Treating root packet wording drift as a correctness failure when handler behavior still matches the canonical recovery contract.

## 14. Next Focus

Synthesis complete: `PASS` with advisories after the extension converged at iteration 010.

## 15. Review Boundaries

- Per-iteration tool budget target: `8-11`, hard max `12`
- Evidence format: `[SOURCE: file:line]`
- Target files are read-only
- Review writes limited to `review/deep-review-*`, `review/iterations/iteration-NNN.md`, and final `review-report.md`
