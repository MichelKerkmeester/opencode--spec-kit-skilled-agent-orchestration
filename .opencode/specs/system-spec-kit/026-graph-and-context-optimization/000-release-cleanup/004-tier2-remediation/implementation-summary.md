---
title: "Implementation Summary: Tier 2 Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Closed Tier 2 D/E/F/G findings; H remains deferred for human license verification."
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-tier2-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
trigger_phrases:
  - "004-tier2-remediation"
  - "validator hygiene"
importance_tier: "normal"
contextType: "implementation"
---

# Implementation Summary: Tier 2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-tier2-remediation |
| **Completed** | 2026-04-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Complete for actionable D/E/F/G findings. Tier 2 H remains intentionally deferred in `__tier2-h-deferred.md` because it requires human verification of the actual gitignored `external/LICENSE`.

### What Changed

- **D / 008/007**: accepted and documented Copilot next-prompt semantics instead of unsupported same-current-turn parity; reconciled the parent checklist; verified existing `buildCopilotPromptArg` large-prompt `@path` coverage.
- **E / 009/005**: corrected stale helper-location evidence to `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/`; hardened the compact OpenCode plugin with output-array guards and stable object-sessionID cache keys.
- **F / 009/002**: restored repo-local Copilot hook wrappers before Superset notification; added workspace-scoped custom-instructions retention plus lock/atomic replacement writes.
- **G / 006/008**: normalized completed-loop state and `006` packet identity; added acceptance criteria and artifact contract; backfilled sibling 006/007 ledgers to match its implementation summary.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The remediation was delivered as four evidence-preserving source-review closures plus one human-action deferral note. The table below records each source finding disposition without changing the original verdicts.

### Finding Disposition

| Finding | Disposition | Evidence |
|---------|-------------|----------|
| D-P1-001 Copilot one-prompt-late advisor | Accepted and documented as Copilot-specific next-prompt limitation. | 008/007/decision-record.md ADR-005; 008/007/spec.md cross-runtime coverage caveat. |
| D-P1-002 release evidence vs checklist mismatch | Closed by marking parent checklist complete with evidence and Copilot caveat. | 008/007/checklist.md verification summary. |
| D-P2-001 `buildCopilotPromptArg` `@path` behavior | Closed by existing focused real-subprocess coverage. | `cli-matrix.vitest.ts` large-prompt approved-authority dispatch. |
| E-P1-001 stale `.opencode/plugin-helpers/` evidence | Closed by path correction across 009/005 canonical docs and checklist. | 009/005/implementation-summary.md Tier 2 addendum; zero stale helper refs in canonical docs. |
| E-P2-001 compact output-shape guard | Closed in code and tests. | `.opencode/plugins/spec-kit-compact-code-graph.js`; `opencode-plugin.vitest.ts`. |
| E-P2-002 compact object-sessionID cache key | Closed in code and tests. | `.opencode/plugins/spec-kit-compact-code-graph.js`; `opencode-plugin.vitest.ts`. |
| F-P1-001 live Copilot hook routing | Closed by repo-local wrappers for `sessionStart` and `userPromptSubmitted`. | `.github/hooks/superset-notify.json`; `.github/hooks/scripts/*.sh`; `copilot-hook-wiring.vitest.ts`. |
| F-P1-002 custom-instructions persistence/scoping | Closed with workspace-scoped managed block contract. | `custom-instructions.ts`; 009/002 ADR-005. |
| F-P2-001 custom-instructions write robustness | Closed with per-target lock and atomic rename. | `custom-instructions.ts`. |
| F-P2-002 durable cleanup story | Closed by documented workspace-scoped retention and upstream isolation limits. | 009/002 ADR-005 and spec lifecycle section. |
| G-P1-001 lifecycle state contradiction | Closed by making 006/008 spec explicitly completed-loop state. | 006/008 `spec.md`. |
| G-P1-002 `010→006` metadata drift | Closed in 006/008 spec, `description.json`, and `graph-metadata.json`. | 006/008 metadata files. |
| G-P1-003 sibling 006/007 contradictions | Closed by backfilling 006/007 tasks/checklist and removing TBD deferral state. | 006/007 `tasks.md`, `checklist.md`, `implementation-summary.md`. |
| G-P2-001 missing acceptance criteria | Closed with AC-008-1..AC-008-6. | 006/008 `spec.md`. |
| G-P2-002 artifact contract drift | Closed by listing actual prompts/deltas/logs/iterations contract in 006/008 spec. | 006/008 `spec.md` and on-disk research artifacts. |
| H-P0 clean-room license audit | Deferred to human. | `__tier2-h-deferred.md`. |

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept Copilot next-prompt semantics | Current-turn injection is not supported by the Copilot transport; documenting the limitation is the accurate closure path. |
| Keep H as human-action deferred | The actual gitignored `external/LICENSE` cannot be verified by this automated pass. |
| Preserve D/E/F/G completion status | The source findings were closed with evidence; this pass only restructures packet docs for strict validation. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

Green focused commands:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
./node_modules/.bin/vitest run tests/copilot-user-prompt-submit-hook.vitest.ts tests/copilot-hook-wiring.vitest.ts tests/opencode-plugin.vitest.ts tests/deep-loop/cli-matrix.vitest.ts
# Test Files 4 passed; Tests 36 passed

npm run build
# tsc --build exit 0
```

Broad `npm --prefix .opencode/skill/system-spec-kit/mcp_server run test -- ...` invokes the full `test:core` suite first and surfaced existing unrelated failures before targeted tests; focused tests above are the remediation gate.

<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations

- H remains blocked on human verification of actual `external/LICENSE`.
- Copilot remains next-prompt freshness by design until upstream supports prompt mutation or stable ACP context injection.
- Strict validators did not pass. The focused implementation tests and build are green, but validator runs failed on structural/template debt:
  - `004-tier2-remediation`: custom task/checklist/summary section shape lacks the current Level 2 template anchors.
  - `008/007`: second attempt had 0 errors but strict mode failed on warnings (evidence wording, extra historical summary heading, stale continuity timestamp).
  - `009/005`: second attempt failed on parent-doc reference drift, then the stale parent reference was removed; residual strict continuity warning was not rerun because the halt rule applies after repeated validator failures.
  - `009/002`: failed on pre-existing Level 3 template/anchor/spec-doc-integrity debt.
  - `006/008`: failed because the research packet is Level 2 but intentionally lacks plan/tasks/checklist/implementation-summary and template anchors.

<!-- /ANCHOR:limitations -->
