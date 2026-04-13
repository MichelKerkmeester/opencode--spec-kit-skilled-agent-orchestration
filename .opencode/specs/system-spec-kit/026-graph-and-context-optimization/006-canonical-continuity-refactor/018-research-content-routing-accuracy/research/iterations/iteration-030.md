# Iteration 30: save.md And SKILL.md Parity Audit

## Focus
Read the operator-facing save command doc and the main `system-spec-kit` skill doc against the shipped router and save-handler code, then check whether the major post-implementation claims are materially aligned.

## Findings
1. `save.md` and `SKILL.md` both describe the live eight-category router correctly: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, and `drop`. [SOURCE: .opencode/command/memory/save.md:76] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:549] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:389]
2. Their Tier flow description matches the code: Tier 1 uses strong heuristics, Tier 2 uses prototype similarity, and Tier 3 is wired into the save handler by default with a safe Tier 2 penalty fallback or refusal. [SOURCE: .opencode/command/memory/save.md:89] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:549] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569]
3. The delivery and handover boundary language is aligned with the code. Delivery is documented as sequencing, gating, rollout, and verification oriented, while handover explicitly keeps state-first stop/resume notes even when soft operational commands appear. [SOURCE: .opencode/command/memory/save.md:95] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:549] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:384] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:935]
4. The override and context wording is also correct. Both docs say `routeAs` preserves the natural decision for audit, and that `packet_kind` comes from spec metadata first with a parent-phase fallback only when metadata is silent. [SOURCE: .opencode/command/memory/save.md:101] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:549] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:479] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:858]
5. I found no material mismatch between these two primary docs and the shipped router behavior. The post-implementation packet claims are now source-of-truth aligned at the operator level. [INFERENCE: parity read across save.md, SKILL.md, and the shipped runtime]

## Ruled Out
- Treating the packet as still documentation-drifted just because earlier research was written before implementation landed.

## Dead Ends
- Looking for a missing category or stale Tier 3 flag claim in the primary save docs after the doc-alignment phase was already shipped.

## Sources Consulted
- `.opencode/command/memory/save.md:76`
- `.opencode/skill/system-spec-kit/SKILL.md:549`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:384`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:858`

## Assessment
- New information ratio: 0.29
- Questions addressed: RQ-14
- Questions answered: none

## Reflection
- What worked and why: The docs are concise enough that a line-by-line read against the code surfaces parity quickly.
- What did not work and why: The save docs do not preserve every low-level threshold detail, so code still has to be the authority for exact acceptance behavior.
- What I would do differently: Keep future routing-doc updates centered on the same five claims checked here: categories, tiers, boundary rules, overrides, and packet-kind derivation.

## Recommended Next Focus
Audit `save_workflow.md` the same way, then decide whether any wording still overstates endpoint availability or other environmental guarantees the code does not actually enforce.
