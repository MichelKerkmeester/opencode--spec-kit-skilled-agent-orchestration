# Iteration 009 Review

Scope: `009-perfect-session-capturing` children `010`-`019`

Dimensions: `D1 Correctness` + `D2 Security`

## Findings

### P1-001 [P1] Container phase `016` is still marked complete even though its own tracker and summary say work remains

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md:1-5`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/tasks.md:5-10,24-30,35-44`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/implementation-summary.md:1-3,23-27`
- Evidence: The container spec still says `Status: Complete` and `Level: 3+`, but the task tracker explicitly records `2` items `In Progress` and `3` `Planned`, with `T-009`, `T-011`, and `T-012` still unchecked.
- Evidence: The implementation summary also contradicts the spec metadata by declaring `## Status: In Progress` and listing the same three remaining tasks under `What Remains`.
- Risk: Release readers will treat `016` as shipped and fully reconciled even though container-level work is still open. That undermines the handoff into `017` and makes later completion claims harder to trust.
- Recommendation: Reopen `016` everywhere until the remaining container tasks close, or split the leftover container work into a new follow-up phase and leave `016` as a historical umbrella only after its own docs agree.

### P1-002 [P1] Phase `016` advertises a `Level 3+` packet but does not carry the companion docs that level implies

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md:3-5`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/:1-12`
- Evidence: The container spec declares `Level: 3+`, but the folder currently contains `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and `research.md` plus children. There is no `checklist.md` or `decision-record.md` in the container folder.
- Risk: The only reviewed child in this slice that lacks required gate-style companion docs is also the one with remaining open work. That means there is no container-level checklist to prove release readiness and no decision record for the still-open container tradeoffs.
- Recommendation: Add the missing companion docs for the actual level, or downgrade the container to the documentation level it really satisfies.

### P1-003 [P1] Phase `017` documents stateless capture as recovery-only, but the shipped CLI appears to have removed that path entirely

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/spec.md:82-85,101-111,121-124`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/implementation-summary.md:34-45,56-68,78-82,88-91`
  - `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51-69,75-81,403-408`
- Evidence: The phase spec says `REQ-004` is that "Recovery mode must remain valid," and `SC-004` says "JSON routine saves and explicit recovery saves remain functional." The implementation summary repeats that claim and says routine positional stateless saves are rejected unless `--recovery` is supplied.
- Evidence: The actual CLI help text exposes only JSON file input, `--stdin`, `--json`, and `--session-id`; it does not advertise any `--recovery` flag. More importantly, `parseArguments()` now hard-fails direct spec-folder mode with `Direct spec folder mode is no longer supported. Use structured JSON via --json, --stdin, or a JSON temp file.`
- Risk: The deprecated feature is not handled as documented. Instead of a guarded recovery-only path, the runtime appears to have removed the path outright. That breaks the documented crash-recovery fallback and makes the phase's completion claim materially incorrect.
- Recommendation: Either restore and test an explicit `--recovery` path end-to-end, or rewrite the phase packet to state that stateless capture was removed rather than deprecated to recovery-only behavior.

### P2-001 [P2] Phase `019` still has stale validation tracking inside an analysis-only packet

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/tasks.md:76-80,98-106`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/implementation-summary.md:86-97,102-107`
- Evidence: `tasks.md` still leaves `T019 Run validate.sh on spec folder and resolve any errors` unchecked, and the completion criteria still leave validation unresolved.
- Evidence: The implementation summary's verification table already reports `validate.sh exit code | PASS (analysis phase)`.
- Risk: This is not a false-complete signal by itself because the phase still says remediation is pending, but it leaves the packet internally inconsistent and reduces confidence in the analysis-phase evidence trail.
- Recommendation: Either mark `T019` complete with the exact validation evidence or downgrade the implementation-summary verification row back to pending.

## Sweep Notes

| Child | Companion docs | Status check | Notes |
|---|---|---|---|
| `010-integration-testing` | Present | `Complete` | Level-2-style packet is present and the checklist, tasks, and implementation summary all carry concrete verification evidence. |
| `011-template-compliance` | Present | `Complete` | Companion docs are present and the closeout story is internally consistent. |
| `012-auto-detection-fixes` | Present | `Complete` | Companion docs are present and the verification narrative is detailed and current. |
| `013-spec-descriptions` | Present | `Complete` | Companion docs are present; completion claims are heavily evidenced and no open-task drift surfaced in the reviewed packet. |
| `014-stateless-quality-gates` | Present | `Complete` with minor plan drift | The packet is broadly coherent, though `plan.md` still leaves the rollback pre-deployment checklist unchecked. On the security side, the runtime still preserves hard-block rules and aborts writes for critical validation failures (`scripts/lib/validate-memory-quality.ts:159-161`, `scripts/core/workflow.ts:1429-1453`). |
| `015-runtime-contract-and-indexability` | Present (Level 1 set) | `Complete` | The Level 1 document set is present and consistent. Runtime spot-check shows the explicit write/index contract is live and still protects API-error/request-id leakage via `abort_write` dispositions (`scripts/core/workflow.ts:1429-1453`, `.opencode/specs/.../015-runtime-contract-and-indexability/spec.md:13,23-25`). |
| `016-json-mode-hybrid-enrichment` | Incomplete for declared level | False-complete | This is the clearest release-readiness problem in this slice: it is marked complete, still has open work, and lacks Level `3+` companion docs. |
| `017-json-primary-deprecation` | Present | Archive move good; deprecation contract bad | The archival/disposition side looks structurally correct because `000-dynamic-capture-deprecation` now has real parent docs and the moved child branch is navigable (`000-dynamic-capture-deprecation/spec.md:41-45,74-80`, `000-dynamic-capture-deprecation/implementation-summary.md:33-37`). The remaining issue is the missing recovery-only runtime path. |
| `018-memory-save-quality-fixes` | Present | `Complete` | Companion docs are present. Security/correctness spot-check looks healthy: explicit data-file loading still sanitizes the path and validates JSON before normalization (`scripts/loaders/data-loader.ts:87-105`), and Fix 6 only treats a compound `filesModified` prefix as a path when it actually looks path-like (`scripts/utils/input-normalizer.ts:490-493`). |
| `019-architecture-remediation` | Present | Not falsely complete overall | The phase truthfully says `Analysis Complete; Remediation Pending`, so the many unchecked sprint tasks/checklist items are expected. The only issue I found here is stale validation tracking between `tasks.md` and the implementation summary. |

## Review Summary

- Files reviewed: children `010`-`019`, plus targeted runtime/doc surfaces for `014`, `015`, `017`, `018`, and archived branch parent `000`
- Overall assessment: `REQUEST_CHANGES`
- Companion-doc check: pass for `010`-`015`, `017`-`019`; fail for `016` relative to its declared `Level 3+`
- False-complete check: `016` is still falsely closed; `019` is not falsely closed overall, but it has stale validation bookkeeping
- Security check: no new P0 security blocker surfaced in the spot-checked runtime; hard-block validation, explicit JSON/file validation, and path-guard hardening are still present in `014`/`015`/`018`
- Deprecated-feature check (`017`): archive/disposition handling is good, but the advertised recovery-only fallback is not evidenced in the shipped CLI and currently looks removed rather than deprecated
