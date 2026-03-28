# Iteration 008 — Skill Library Architecture (AI-Research-SKILLs)

## Focus
Q8: What skill library architecture from AI-Research-SKILLs suggests about our skill's modularity and extensibility?

## Key Delta Findings

### Finding 1: AI-Research-SKILLs uses a layered skill hierarchy, not a flat pile of skills
- **Source**: `README.md`, `WELCOME.md`, `0-autoresearch-skill/SKILL.md`, `20-ml-paper-writing/SKILL.md`, `packages/ai-research-skills/src/installer.js`
- **What is new vs Wave 1**: Wave 1 mostly compared single-skill research loops. AI-Research-SKILLs shows a library-level pattern: one thin orchestration skill (`autoresearch`), many leaf execution skills grouped by domain, and a second standalone endcap skill (`ml-paper-writing`) for final output.
- **Why it matters**: This is the clearest argument against keeping `sk-deep-research` as one ever-growing monolith. The scalable pattern is coordinator skill plus specialized companion skills.
- **Pattern**: Put loop orchestration, routing, and shared state contracts in one small meta-skill; move ideation, execution, synthesis, and paper/report outputs into narrower leaf skills.

### Finding 2: Composition is routing-based and soft-coupled, not shared-file-coupled
- **Source**: `0-autoresearch-skill/SKILL.md`, `0-autoresearch-skill/references/skill-routing.md`, `21-research-ideation/brainstorming-research-ideas/SKILL.md`
- **What is new vs Wave 1**: The important modular move here is not "many files"; it is that the orchestrator composes behavior by routing to the right skill at the right time. Specialized skills declare when to use them and when not to use them, rather than depending on deep nested imports from other skills.
- **Why it matters**: This suggests our future modularity should rely on stable role boundaries and dispatch rules, not on a dense web of cross-references between subskills.
- **Pattern**: Let a deep-research coordinator choose among adjacent skills such as ideation, iteration, synthesis, critique, or writing. Each leaf should stay useful on its own and only depend on shared contracts, not on each other's internals.

### Finding 3: Extensibility is enforced through strict authoring constraints, not ad hoc growth
- **Source**: `anthropic_official_docs/skills_overview.md`, `anthropic_official_docs/best_practices.md`, `docs/SKILL_CREATION_GUIDE.md`, `docs/SKILL_TEMPLATE.md`, `CONTRIBUTING.md`
- **What is new vs Wave 1**: AI-Research-SKILLs operationalizes Anthropic's progressive-disclosure model into library rules: concise frontmatter for discovery, SKILL bodies kept small, one-level-deep references, explicit workflows, direct dependencies, and "when to use vs alternatives" guidance.
- **Why it matters**: This is the missing extensibility discipline for our skill. Without a template and hard shape constraints, a split skill family will just recreate monolith sprawl across multiple files.
- **Pattern**: If we modularize `sk-deep-research`, each module should follow a fixed contract: short overview, explicit scope boundary, companion references only when needed, and a shared schema for state files and iteration outputs.

### Finding 4: The library architecture scales operationally because installation and packaging understand both standalone and nested skills
- **Source**: `README.md`, `packages/ai-research-skills/README.md`, `packages/ai-research-skills/src/installer.js`
- **What is new vs Wave 1**: The installer has first-class logic for two shapes: standalone category-root skills and nested category skills. It also supports global symlinked installs and local per-project copies.
- **Why it matters**: This is a real extensibility enabler, not just documentation. It means the skill ecosystem can add new leaf skills or standalone meta-skills without changing the mental model or the delivery mechanism.
- **Pattern**: Our deep-research ecosystem could support a small family such as `deep-research-core`, `deep-research-review`, `deep-research-synthesis`, or runtime overlays, while still being installable selectively rather than all-or-nothing.

### Finding 5: Hypothesis refutation lives in the orchestration loop, not in a separate "refutation skill"
- **Source**: `0-autoresearch-skill/SKILL.md`, `README.md`, `demos/README.md`, `demos/autoresearch-norm-heterogeneity/README.md`
- **What is new vs Wave 1**: AI-Research-SKILLs makes refutation a first-class project behavior. The autoresearch loop starts from hypotheses, logs negative results, treats refuted hypotheses as progress, and allows the outer loop to pivot into a stronger claim.
- **Why it matters**: This suggests our missing modular unit is not a separate hypothesis-refutation skill. The real gap is in the core loop contract: hypotheses, null results, ruled-out directions, and pivots need explicit state and output slots.
- **Pattern**: Keep hypothesis generation and refutation as loop-level artifacts in the coordinator. Use specialized leaf skills to execute evidence-gathering, but keep the "what was disproved and why" ledger in shared research state.

### Finding 6: Cross-skill dependency management is intentionally shallow and local
- **Source**: `docs/SKILL_CREATION_GUIDE.md`, `CONTRIBUTING.md`, representative skills including `10-optimization/flash-attention/SKILL.md`, `21-research-ideation/brainstorming-research-ideas/SKILL.md`, `20-ml-paper-writing/SKILL.md`
- **What is new vs Wave 1**: The reuse model is mostly conceptual and navigational, not file-sharing-heavy. Skills carry their own references and direct package dependencies. Cross-skill reuse happens through routing guidance and consistent naming, not a giant shared reference tree.
- **Why it matters**: This argues against building our modularity around shared markdown fragments or tightly shared references. That would create brittle coupling and make skills harder to evolve independently.
- **Pattern**: Share only the minimum common contract: state schema, iteration artifact format, and maybe a tiny router reference. Let each deep-research module own its own references and examples.

### Finding 7: The architecture is already absorbing growth beyond the marketed "86 skills"
- **Source**: `README.md`, `WELCOME.md`, `packages/ai-research-skills/README.md`, repository tree under numbered categories
- **What is new vs Wave 1**: The current checkout contains 90 `SKILL.md` entrypoints even though multiple docs still advertise 86 skills. That mismatch is messy documentation, but it is also evidence that the architecture itself kept scaling without needing a redesign.
- **Why it matters**: The category-plus-installer-plus-frontmatter model is robust enough to tolerate ongoing expansion. That is a strong signal that modular skill families age better than a single expanding flagship skill.
- **Pattern**: For `sk-deep-research`, optimize for growth tolerance: add modules without rewriting the core contract, and treat documentation drift as a governance problem rather than an architectural blocker.

## Implications for sk-deep-research

### Recommendation 1: Split the current monolith into a coordinator plus leaf modules
- Keep one coordinator skill for loop control, state discipline, convergence, and routing.
- Move distinct concerns into leaf modules such as hypothesis generation, evidence collection patterns, synthesis/reporting, and optional critique/review.
- Do not split by runtime first; split by responsibility first.

### Recommendation 2: Define one tiny shared contract and keep everything else local
- The shared contract should cover JSONL event shape, required iteration outputs, hypothesis/null-result fields, and any dashboard summary fields.
- Avoid broad shared reference folders across modules.
- Let each module own its own reference docs and examples.

### Recommendation 3: Make refutation and negative knowledge first-class in the coordinator
- Add explicit slots for hypothesis, prediction, outcome, ruled-out directions, and pivot rationale.
- Treat "refuted" as a valuable iteration result, not just a low `newInfoRatio` case.
- This is the AI-Research-SKILLs lesson that most directly improves research quality without requiring heavy new infrastructure.

### Recommendation 4: Use overlays for optional extensions, not forks of the whole skill
- Runtime-specific or reviewer-specific behavior should be a thin overlay or companion skill.
- The core research protocol should remain stable and host-neutral.
- This matches the library's broader packaging logic and keeps future extensions cheap.

## Bottom Line
AI-Research-SKILLs adds a stronger modularity lesson than Wave 1: successful research-skill systems scale by separating orchestration from specialized execution, enforcing a strict authoring contract, and keeping cross-skill coupling shallow. The best upgrade path for `sk-deep-research` is not "make the one skill bigger with more references." It is to turn it into a small skill family with one coordinator, narrow leaf modules, and a minimal shared state contract that preserves hypothesis refutation and negative knowledge at the core.

## Sources Consulted
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/README.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/WELCOME.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/0-autoresearch-skill/SKILL.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/0-autoresearch-skill/references/skill-routing.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/10-optimization/flash-attention/SKILL.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/20-ml-paper-writing/SKILL.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/21-research-ideation/brainstorming-research-ideas/SKILL.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/anthropic_official_docs/skills_overview.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/anthropic_official_docs/best_practices.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/docs/SKILL_CREATION_GUIDE.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/docs/SKILL_TEMPLATE.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/CONTRIBUTING.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/demos/README.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/demos/autoresearch-norm-heterogeneity/README.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/packages/ai-research-skills/README.md`
- `/tmp/deep-research-029-wave2/AI-Research-SKILLs/packages/ai-research-skills/src/installer.js`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md`

## Assessment
- newInfoRatio: 0.86
- findingsCount: 7
- status: complete
- keyInsights: AI-Research-SKILLs scales through a coordinator-plus-leaf architecture, not a single giant skill; hypothesis refutation is a loop-level concern, not a separate module; shallow routing contracts and strict authoring rules are what make a large skill library extensible

## Questions Answered
- Q8: AI-Research-SKILLs suggests that `sk-deep-research` should evolve from one monolithic skill into a small, responsibility-based skill family with a thin coordinator, shallow routing contracts, local references, and explicit support for null results and pivots in the shared research state.

## New Questions Raised
- What is the smallest useful leaf split for `sk-deep-research`: hypothesis generation, iteration execution, synthesis, critique, or runtime overlays?
- Should the shared contract live as a tiny reference file inside the coordinator, or as a reusable template asset consumed by all deep-research modules?
- Do we want modular installation and discovery from day one, or first refactor internally and expose separate skills only after the boundaries stabilize?
