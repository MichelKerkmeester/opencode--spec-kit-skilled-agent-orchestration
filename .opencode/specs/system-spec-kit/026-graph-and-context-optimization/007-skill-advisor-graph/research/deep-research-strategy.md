# Deep Research Strategy: Skill Advisor Graph Quality Audit

## Research Charter

**Topic:** Audit the skill graph system: 20 per-skill graph-metadata.json files, skill_graph_compiler.py, compiled skill-graph.json (1950 bytes), and skill_advisor.py integration (4 new functions).

**Non-Goals:**
- Reimplementing the skill advisor from scratch
- Changing the existing booster maps (INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
- Adding new skills or removing existing ones

**Stop Conditions:**
- All key questions answered with evidence
- Convergence ratio below 0.05 for 3 consecutive iterations
- 10 iterations reached

## Key Questions

- [ ] Q1: Are all 20 edge inventories accurate? (Do relationships match actual skill behavior?)
- [ ] Q2: Are the damping factors (0.30 enhances, 0.20 depends_on, 0.15 siblings, 0.08 family) correctly calibrated?
- [ ] Q3: Does the snapshot pattern in _apply_graph_boosts() actually prevent feedback loops?
- [ ] Q4: Is the compiler validation robust enough? (Missing edge cases?)
- [ ] Q5: Could the graph replace some hardcoded boosters instead of supplementing them?
- [ ] Q6: Are there missing edges or relationships between skills?
- [ ] Q7: Is the 2KB size target appropriate? Could the graph carry more useful data?
- [ ] Q8: How does the graph interact with CocoIndex semantic search?
- [ ] Q9: Are there edge weight inconsistencies (e.g., A enhances B at 0.7 but B enhances A at 0.3)?
- [ ] Q10: What improvements would have the highest ROI?

## Known Context

No prior memory found. This is a fresh research session on newly implemented code.

## Next Focus

Start with Q1 and Q6: Validate edge data accuracy across all 20 skills by cross-referencing with actual SKILL.md descriptions and existing booster maps.

## What Worked

(Machine-owned — populated by reducer)

## What Failed

(Machine-owned — populated by reducer)

## Exhausted Approaches

(Machine-owned — populated by reducer)

## Ruled-Out Directions

(Machine-owned — populated by reducer)
