# Deep Research Strategy: SKILL.md Smart-Router Section Efficacy

## Topic

Every `.opencode/skill/*/SKILL.md` has a `## SMART ROUTING` section with INTENT_SIGNALS + RESOURCE_MAP + ALWAYS/CONDITIONAL/ON_DEMAND loading tiers + a Python pseudocode router function. The pattern claims AIs should follow these tiers and load only relevant sub-resources.

**Question**: does this pattern actually reduce AI context load, or do AIs load everything anyway?

## Research Questions (V1-V10)

| ID | Question | Success Criterion |
|----|----------|-------------------|
| V1 | Inventory + shape variance | Count skills with section + taxonomy of vocabulary |
| V2 | Per-skill byte budget | ALWAYS/CONDITIONAL/ON_DEMAND bytes per skill + savings ceiling |
| V3 | Behavioral signal in iteration logs | Quantified tier-compliance evidence from ≥ 500 iterations |
| V4 | Intent scoring accuracy | Sample-labeled prompts vs pseudocode classification |
| V5 | Compliance gap | AI actual-vs-predicted read tool calls |
| V6 | ALWAYS bloat | Baseline tier size as % of full tree |
| V7 | ON_DEMAND keyword coverage | Hit rate of ON_DEMAND triggers in real prompt corpus |
| V8 | UNKNOWN_FALLBACK safety | Mis-routing risk analysis |
| V9 | Enforcement mechanism | Runtime filter yes/no + where |
| V10 | Harness design | Instrumented test harness blueprint |

## Known Context

- ~30 skills under `.opencode/skill/*/SKILL.md` use the Smart Routing pattern (cli-*, mcp-*, sk-*, system-spec-kit, etc.)
- The pseudocode shape is consistent (discovered during Phase 020 work)
- Phase 020 advisor hook addresses which skill to use; this phase addresses which RESOURCES within a chosen skill to load
- 019/004 labeled-prompts corpus (200 prompts) is available for V7 keyword-coverage analysis
- Phase 020 research log (994 iteration files scanned in 021/001) shows AIs frequently read SKILL.md + references — baseline for V5

## Stop Conditions

- Rolling 3-iter newInfoRatio < 0.05 across all V1-V10
- All V1-V10 answered with evidence
- 20 iterations completed

## Max Iterations

20

## Convergence Threshold

0.05
