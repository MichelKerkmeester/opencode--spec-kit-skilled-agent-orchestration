# Iteration 004 - Maintainability

## Focus
- Dimension: `maintainability`
- Goal: audit the packet's long-lived decision surfaces and compatibility debt.

## Files reviewed
- `decision-record.md`
- `tasks.md`
- `implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`

## New findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| DR-P1-004 | P1 | `decision-record.md` is still tagged `status: planned` even though the packet and implementation summary are complete. | [SOURCE: decision-record.md:1-3] [SOURCE: spec.md:1-7] [SOURCE: implementation-summary.md:37-42] |
| DR-P1-005 | P1 | The ADR still says the retired `lp` cache split may remain active, but tasks and implementation-summary say the runtime fix already landed. | [SOURCE: decision-record.md:10] [SOURCE: tasks.md:11] [SOURCE: implementation-summary.md:52-53] |
| DR-P2-001 | P2 | The no-op `LENGTH_PENALTY` helpers remain public exports, extending the compatibility and test surface even though they no longer change behavior. | [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577] |

## Iteration outcome
- Severity delta: `+0 P0 / +2 P1 / +1 P2`
- `newFindingsRatio`: `0.43`
- Next focus: `correctness`
