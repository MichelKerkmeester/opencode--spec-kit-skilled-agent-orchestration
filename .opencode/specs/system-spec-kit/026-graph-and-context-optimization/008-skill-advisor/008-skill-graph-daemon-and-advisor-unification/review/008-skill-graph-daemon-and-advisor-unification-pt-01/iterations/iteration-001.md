# Iteration 1 — Correctness + Inventory

## Dimension

Correctness, with the requested inventory pass.

## Files Reviewed

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `decision-record.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/text.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts`
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- Focused tests under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/`.

## Findings — P0

None.

## Findings — P1

**DR-008-D1-P1-001: `advisor_recommend` keeps returning normal recommendations when freshness is `unavailable`, so direct MCP callers can receive authoritative-looking routing during corrupt or unavailable graph states.**

Evidence: `readAdvisorStatus()` converts corrupted generation metadata and other status failures into `freshness: 'unavailable'` with errors (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:151-172`). The compat probe treats `unavailable` as not available (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts:51-60`). But the direct MCP recommendation path only fail-opens for `absent` freshness (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:161-164`), then still calls `scoreAdvisorPrompt()` and emits recommendations (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:194-220`). Existing tests cover disabled, absent, and stale behavior, but not unavailable fail-open behavior (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:238-260`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:338-345`).

Impact: when the generation file is corrupt, the daemon is explicitly unavailable, or a rebuild is in an unavailable window, the native MCP surface can still return `status: ok` and skill recommendations. That contradicts the packet reliability claim that refresh failures degrade to stale or unavailable rather than corrupting advisor output (`spec.md:171-173`) and diverges from the shim availability contract.

Concrete fix: add an `unavailableOutput()` path equivalent to `absentOutput()` and branch on `status.freshness === 'unavailable'` before scoring. Add a regression that mocks `readAdvisorStatus()` as unavailable and asserts no scorer call, empty recommendations, warning/error reason propagation, and prompt-safe abstain text.

## Findings — P2

**DR-008-D1-P2-001: Checklist evidence is not file-line evidence.**

The iteration contract asks each completed `CHK-*` item to cite `file:line`, but completed items cite broad documents such as `implementation-summary.md`, `plan.md`, or `spec.md` without line anchors (`checklist.md:43-45`, `checklist.md:53-57`, `checklist.md:75-77`, `checklist.md:85-96`). This weakens the `checklist_evidence` cross-reference protocol.

**DR-008-D1-P2-002: Packet docs mix stale hyphenated paths with the shipped underscore runtime path.**

The spec says the runtime lives under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/**` and names `.opencode/skill/skill-advisor/scripts/skill_advisor.py` (`spec.md:91-93`), while the reviewed shipped files are under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/**`, including `watcher.ts`, `advisor-recommend.ts`, and `scripts/skill_advisor.py`. The decision record repeats the hyphenated package name (`decision-record.md:39`). This is documentation drift, not a runtime failure.

**DR-008-D1-P2-003: Strict-validation completion remains visibly open.**

The top-level inventory is present, but the packet still marks root status as in progress (`spec.md:44`, `implementation-summary.md:34`) and leaves parent/child validation tasks unchecked (`tasks.md:76-78`, `checklist.md:65-67`). This matches the prior "95% complete" state, but it should remain visible in the review ledger until the follow-up sweep closes it.

## Traceability Checks

| Protocol | Result | Notes |
|----------|--------|-------|
| `inventory` | pass | Required top-level docs are present: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`. |
| `subpacket_inventory` | pass | Implementation summary enumerates seven delivered areas and child rows (`implementation-summary.md:46-57`, `implementation-summary.md:66-76`). |
| `spec_code` | partial | REQ-001 maps to watcher debounce/reindex/generation publication (`watcher.ts:306-429`); REQ-002 maps to daemon lifecycle lease usage (`lifecycle.ts:28-70`); REQ-003 maps to parity tests (`python-ts-parity.vitest.ts:99-162`); REQ-006 maps to advisor handler files; REQ-007 maps to shim/probe/plugin paths. The path spelling drift prevents a clean pass. |
| `checklist_evidence` | fail | Completed checklist items cite docs without line anchors, so the requested `file:line` evidence standard is not met. |

## Claim Adjudication Packets

### DR-008-D1-P1-001

- **Claim:** Direct `advisor_recommend` does not fail open when status freshness is `unavailable`.
- **Hunter evidence:** `advisor-status.ts` can return unavailable with errors on status failures (`advisor-status.ts:151-172`); `advisor-recommend.ts` only branches on `absent` before scoring (`advisor-recommend.ts:161-164`, `advisor-recommend.ts:194-220`).
- **Skeptic check:** Stale freshness is intentionally usable with a warning, and compat callers correctly treat live/stale as available. That does not cover unavailable, which `daemon-probe.ts` explicitly treats as unavailable (`daemon-probe.ts:51-60`).
- **Referee verdict:** Valid P1. This is a direct MCP-surface correctness bug under unavailable/corrupt states, with focused remediation and missing regression coverage.

## Verdict

CONDITIONAL for D1. No P0s found. One P1 should be fixed before treating the native advisor MCP surface as release-ready under daemon/corruption failure modes. Daemon debounce, graceful shutdown publication, SQLite corruption rebuild helper, SIGTERM/SIGKILL plugin timeout handling, and Python-vs-TS regression-protection parity all had positive evidence in this pass.

## Next Dimension

Security. Focus on cache corruption recovery, SIGKILL and timeout paths, MCP error handling, prompt-safe diagnostics, and whether unavailable/stale/error surfaces can leak sensitive prompt or filesystem details.
