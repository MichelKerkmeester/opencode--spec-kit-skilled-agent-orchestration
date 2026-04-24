# Iteration 004: Maintainability audit of packet durability

## Focus
Maintainability review of packet evidence durability and safe follow-on change cost across the packet docs and the live router implementation.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1 - Required
- **F004**: Packet evidence anchors still point at pre-growth code line ranges — `plan.md:13-16`, `checklist.md:7-12`, `content-router.ts:409-411`, `content-router.ts:1001-1014`, `content-router.ts:1039-1049` — The packet docs and checklist still cite `content-router.ts:369-378`, `868-877`, and `904-920`, but the implemented seam now lives at later lines, so the packet's own evidence no longer lands on the claimed code. [SOURCE: plan.md:13-16] [SOURCE: checklist.md:7-12] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409-411] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1001-1014] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1039-1049]
- **F005**: Continuity metadata hides the packet's remaining verification follow-up — `implementation-summary.md:15-17`, `implementation-summary.md:26-29`, `implementation-summary.md:108-110`, `checklist.md:13-16` — The continuity block declares `completion_pct: 100`, `blockers: []`, and no open questions even though the packet still records unresolved evidence work and a broader benchmark follow-up. [SOURCE: implementation-summary.md:15-17] [SOURCE: implementation-summary.md:26-29] [SOURCE: implementation-summary.md:108-110] [SOURCE: checklist.md:13-16]

### P2 - Suggestion
- **F006**: Decision record frontmatter still says `planned` after the packet completed — `decision-record.md:1-3`, `spec.md:1-3` — The ADR body reflects a shipped decision, but the frontmatter status remains `planned`, leaving the packet's doc state internally inconsistent. [SOURCE: decision-record.md:1-3] [SOURCE: spec.md:1-3]

## Cross-Reference Results
Not run in this dimension-focused pass.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: maintainability
- Novelty justification: the first maintainability pass found three distinct packet-maintenance drifts that increase follow-on review and edit cost.

## Ruled Out
- A packet-only wording cleanup would not be sufficient; the continuity and evidence surfaces need substantive re-anchoring.

## Dead Ends
- Reusing the packet's existing line-number evidence without live code inspection did not produce a stable audit trail.

## Recommended Next Focus
Return to correctness and security for clean revalidation before deciding whether the loop has converged on packet-only issues.
