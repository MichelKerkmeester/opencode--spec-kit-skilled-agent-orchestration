# Single-Pass Deep Review — 008/007 Skill-Advisor Hook Surface

**GATE 3 PRE-ANSWERED — A**: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface`. Pre-approved. Proceed directly.

You are dispatched as a deep-review agent. This is a SINGLE-PASS review of the **skill-advisor hook surface** packet. Cover all 4 dimensions (correctness, security, traceability, maintainability) in one pass.

## CONTEXT

Per the original 026 release-readiness program assessment:
- **Status**: in_progress, but implementation shipped and verified — 4-runtime parity 200/200, cache p95 0.016ms, DQI 97.
- **Specific concern**: Copilot SDK fallback path remains UNTESTED (SDK unavailable during dev).
- **Review angle**: subprocess timeout error paths; verify wrapper fallback semantics actually match SDK semantics on the contract level.

Note: this packet has prior review archives at `review-archive-r01-copilot/` and `review-archive-r02-codex-copilot/` — read them as priors but do NOT duplicate findings.

## YOUR TASK

1. **Read inputs**:
   - `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/{spec,plan,tasks,checklist,implementation-summary,decision-record,handover,battle-plan}.md`
   - Sample 1-2 prior review reports under `review-archive-*/` to see what's already known
   - Code under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/hook/` and `.opencode/plugins/spec-kit-skill-advisor.js` (Copilot SDK fallback paths)

2. **4-dimension review (single pass, mark dimension boundaries)**:
   - **D1 Correctness**: Does the wrapper fallback semantically match the SDK? Specifically `buildCopilotPromptArg`, subprocess invocation, timeout handling, error envelope translation.
   - **D2 Security**: Subprocess timeout paths — orphan processes? Trust boundaries on prompt forwarding?
   - **D3 Traceability**: REQ-* → code; checklist evidence quality; do prior review archives' findings still apply or have they been closed?
   - **D4 Maintainability**: Pattern consistency for adding a new runtime adapter (Codex SDK arrives, etc.).

3. **Output review-report.md** at `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/review/007-skill-advisor-hook-surface-tier2-pt-01/review-report.md`

## REPORT STRUCTURE (9 sections + Planning Packet)

Use the standard 9-section structure: Executive Summary (verdict, P0/P1/P2 counts, hasAdvisories) → Planning Trigger (with `Planning Packet` JSON block) → Active Finding Registry → Remediation Workstreams → Spec Seed → Plan Seed → Traceability Status (core + overlay) → Deferred Items → Audit Appendix.

For any P0/P1: include claim-adjudication packet (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) + Hunter→Skeptic→Referee adversarial self-check inline.

## CONSTRAINTS

- LEAF agent — no sub-agents.
- Target 12 tool calls; soft max 18; hard max 22 (single-pass = larger budget than per-iter).
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line.
- If prior review archives already covered something, cite the archive and do not re-flag.
- Final verdict: PASS / CONDITIONAL / FAIL with hasAdvisories flag.

GO.
