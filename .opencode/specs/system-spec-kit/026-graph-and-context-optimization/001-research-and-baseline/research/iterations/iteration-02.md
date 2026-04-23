## Iteration 02
### Focus
Test whether the archived "trust-axis separation" prerequisite is still only a recommendation, or whether later work turned it into an actual runtime contract.

### Findings
- The archived synthesis treated trust-axis separation as the replacement for old R10 and as a prerequisite for any structural packaging. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/research.md:41-42`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/research.md:184-197`
- Current shared-payload code now enforces that structural trust must carry separate `parserProvenance`, `evidenceStatus`, and `freshnessAuthority` fields, and it explicitly rejects collapsed scalar trust fields. That means a major archived "missing contract" has since landed as executable validation logic. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:671-713`
- The code-graph readiness layer now maps graph freshness into both canonical readiness and shared payload trust-state vocabulary (`fresh -> live`, `stale -> stale`, `empty -> absent`), so trust separation is no longer isolated to prose. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:12-18`; `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:77-105`; `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:150-157`
- The environment reference now states that publication-facing metric rows must obey the shared measurement contract and that no environment variable can bypass it. That strengthens the case that measurement honesty also moved from recommendation to policy. Evidence: `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:30-37`

### New Questions
- Which current handlers still emit legacy or collapsed trust fields despite the shared-payload validator now existing?
- Does the archived roadmap still over-prioritize trust-axis work that is already partly shipped?
- Which remaining trust gaps are now about consumer coverage and live acceptance rather than schema design?

### Status
new-territory
