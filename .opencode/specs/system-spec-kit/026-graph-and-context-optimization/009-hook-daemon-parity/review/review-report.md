# Deep Review Report: 009 Hook Daemon Parity

## 1. Executive Summary

**Verdict: CONDITIONAL.** Counts: P0=0, P1=5, P2=0. Confidence: high for documentation/metadata findings and medium-high for runtime diagnostic surfacing because the scoped tests pass while the task contract remains unmet. The reviewed code changes for OpenCode transport, Codex hooks, Copilot wrapper routing, and PreToolUse hardening are broadly present and the targeted runtime suites pass, but release evidence is not clean: Phase 003 fails strict spec validation, its detailed task list is still unchecked, and metadata still advertises scaffold/in-progress state.

## 2. Scope

Packets reviewed:
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/

Dimensions covered: correctness, security, traceability, maintainability. Iterations completed: 10 of 30, stopped by convergence/stuck threshold after three consecutive zero-new-finding passes.

## 3. Method

The loop followed the requested rotation: correctness -> security -> traceability -> maintainability, then deeper stabilization passes. Each iteration wrote a markdown narrative and JSONL delta. Convergence used severity-weighted new findings ratio, all-dimension coverage, P0 override, evidence/scope/coverage gates, and the configured stuck rule of three consecutive churn values <= 0.05.

Verification commands run during review:

- `npm run typecheck` in `.opencode/skill/system-spec-kit/mcp_server` -> exit 0.
- Targeted vitest set for session-resume, OpenCode plugin, Codex hook policy/user prompt/pre-tool, Copilot wiring, and advisor subprocess/observability -> 8 files, 57 tests passed.
- Parent `validate.sh --strict --no-recursive` -> passed.
- Phase 003 `validate.sh --strict --no-recursive` -> failed with 3 error groups.

Note: Spec Kit Memory/CocoIndex MCP calls were attempted for context retrieval but were cancelled by the runtime; review evidence therefore uses direct file reads, exact search, git commit inspection, and scoped tests.

## 4. Findings By Severity

### P0

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | - | - |

### P1

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| 009-C-001 | correctness | OpenCode transform can still silently no-op when the transport plan is absent or unparsable. | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/tasks.md:57<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/tasks.md:58<br>.opencode/plugins/spec-kit-compact-code-graph.js:202 |
| 009-T-001 | traceability | Phase 003 detailed task evidence remains unchecked despite closing status and implementation claims. | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/tasks.md:29<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/tasks.md:30<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/tasks.md:31 |
| 009-T-002 | traceability | Phase 003 checklist claims strict validation passes, but the current strict validation fails. | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/checklist.md:96<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/checklist.md:99<br>validation: bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation --strict --no-recursive -> exit 2; ANCHORS_VALID missing 34 anchors; TEMPLATE_HEADERS 35 deviations; SPEC_DOC_INTEGRITY missing .opencode/command/spec_kit/debug.md |
| 009-T-003 | traceability | The context-prime acceptance gate remains deferred and globally unverifiable inside the active spec tree. | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/spec.md:101<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/checklist.md:62<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation/checklist.md:65 |
| 009-M-001 | maintainability | Graph metadata and continuity state are stale relative to the packet summaries. | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/implementation-summary.md:30<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/implementation-summary.md:48<br>.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/graph-metadata.json:71 |

### P2

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | - | - |

## 5. Findings By Dimension

### Correctness

- **009-C-001 (P1)**: OpenCode transform can still silently no-op when the transport plan is absent or unparsable.

### Security

- No findings.

### Traceability

- **009-T-001 (P1)**: Phase 003 detailed task evidence remains unchecked despite closing status and implementation claims.
- **009-T-002 (P1)**: Phase 003 checklist claims strict validation passes, but the current strict validation fails.
- **009-T-003 (P1)**: The context-prime acceptance gate remains deferred and globally unverifiable inside the active spec tree.

### Maintainability

- **009-M-001 (P1)**: Graph metadata and continuity state are stale relative to the packet summaries.

## 6. Adversarial Self-Check Results For P0 Findings

No P0 findings were recorded. The closest candidates were strict validation failure and stale metadata, but both are release-blocking evidence-quality issues rather than demonstrated runtime breakage; they remain P1. The security sweep did not find an active P0 in Codex PreToolUse or shared-payload sanitization.

## 7. Remediation Order

1. Fix Phase 003 strict validation: restore required anchors/template headers and repair the missing `.opencode/command/spec_kit/debug.md` reference.
2. Reconcile Phase 003 tasks: mark detailed tasks `[x]` with evidence or `[~]` with blocker reasons.
3. Refresh parent and child graph metadata/description state after the task/checklist state is truthful.
4. Decide the context-prime evidence policy: either exempt historical remediation mentions or rewrite AC-5 and checklist evidence accordingly.
5. Add visible OpenCode plugin diagnostic behavior for missing/unparsable transport plans, with a malformed-bridge regression test.

## 8. Verification Suggestions

- Rerun `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation --strict --no-recursive` after doc repairs.
- Rerun the targeted vitest set from this report after plugin diagnostic changes.
- Run a metadata refresh via the canonical generate-context/graph-metadata path for the parent and 003 child after status reconciliation.
- Re-run the exact context-prime grep command named in AC-5 and record whether historical remediation mentions are intentionally exempt.

## 9. Appendix: Raw Iteration List + Delta Churn History

- iterations/iteration-001.md (correctness)
- iterations/iteration-002.md (security)
- iterations/iteration-003.md (traceability)
- iterations/iteration-004.md (maintainability)
- iterations/iteration-005.md (correctness)
- iterations/iteration-006.md (security)
- iterations/iteration-007.md (traceability)
- iterations/iteration-008.md (maintainability)
- iterations/iteration-009.md (correctness)
- iterations/iteration-010.md (security)

| Iteration | Dimension | New | Revalidated | Churn | NewFindingsRatio |
| --- | --- | ---: | ---: | ---: | ---: |
| 001 | correctness | 1 | 0 | 0 | 0.2 |
| 002 | security | 0 | 1 | 0 | 0 |
| 003 | traceability | 3 | 1 | 0.333 | 0.6 |
| 004 | maintainability | 1 | 3 | 0.067 | 0.2 |
| 005 | correctness | 0 | 1 | 0 | 0 |
| 006 | security | 0 | 1 | 0 | 0 |
| 007 | traceability | 0 | 3 | 0 | 0 |
| 008 | maintainability | 0 | 1 | 0 | 0 |
| 009 | correctness | 0 | 2 | 0 | 0 |
| 010 | security | 0 | 5 | 0 | 0 |
