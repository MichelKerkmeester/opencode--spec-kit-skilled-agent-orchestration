# Iteration 009 — Resource Versioning For Templates And Prompts

Date: 2026-04-10

## Research question
Should `system-spec-kit` adopt Agent Lightning's immutable resource-snapshot model for templates and prompts?

## Hypothesis
Agent Lightning's resource model is probably important for training-time prompt mutation, but it may be the wrong fit for Public's template system because Public treats templates as canonical documentation sources rather than tunable runtime artifacts.

## Method
I reviewed Agent Lightning's core resource types, resource versioning rationale, and examples that seed prompt templates and proxy-backed LLM resources. I compared those patterns against Public's template guide, level-specification rules, and the `system-spec-kit` source-of-truth documentation model.

## Evidence
- Agent Lightning's store contract includes immutable resource versioning as a first-class responsibility, explicitly naming prompt templates, model checkpoints, and proxy endpoints as managed snapshots. [SOURCE: external/agentlightning/store/base.py:104-119]
- Agent Lightning's resource types formalize this model. `LLM`, `ProxyLLM`, and `PromptTemplate` are tunable resources, and `ResourcesUpdate` carries `resources_id`, timestamps, version, and the full named-resource payload. [SOURCE: external/agentlightning/types/resources.py:36-54] [SOURCE: external/agentlightning/types/resources.py:65-143] [SOURCE: external/agentlightning/types/resources.py:146-204]
- The agent tutorials emphasize that algorithms send `NamedResources` to agents and that this design exists to support advanced features such as multi-resource tuning. [SOURCE: external/docs/tutorials/write-agents.md:132-145]
- The training tutorial seeds an initial `prompt_template` resource directly into the Trainer, showing how prompt content participates in the same tunable resource lifecycle as the rest of the runtime. [SOURCE: external/docs/how-to/train-first-agent.md:188-196]
- Public's template guidance describes an entirely different model: templates are copied from `templates/level_N/`, not generated from mutable runtime resources, and maintainers compose those templates from `core/` and `addendum/` sources. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:27-34] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:49-71]
- Public's level specification doubles down on that source-of-truth stance: `templates/level_N/` are the ready-to-use templates, while `core/` and `addendum/` are source components and should not be used directly for new specs. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-18] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:38-47]
- `system-spec-kit` also frames templates and scripts as operational sources of truth rather than as mutable optimization resources. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:102-118]

## Analysis
Agent Lightning's resource model is excellent for environments where prompts, endpoints, and policies mutate as part of the optimization loop. Public is not that environment. Its templates are governance-bearing documentation assets with stable provenance and validation rules. Recasting them as immutable snapshots in a resource store would add machinery without solving a real current problem.

The subtle lesson is still useful: if Public ever experiments with tunable runtime prompts for evaluators or prototype telemetry, that should be a separate resource system rather than a mutation of the current spec-template source of truth. But for `system-spec-kit` itself, store-backed template versioning would be an attractive distraction.

## Conclusion
confidence: high

finding: Agent Lightning's resource versioning should be rejected for `system-spec-kit`'s current template system. The external repo uses resources because prompts and endpoints are tunable training inputs. Public's templates are canonical documentation contracts, and turning them into runtime snapshots would complicate validation and provenance without adding equivalent value.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none for the rejection itself; any future tunable-prompt experiments should live outside the canonical template pipeline
- **Priority:** rejected

## Counter-evidence sought
I looked for signs that Public's templates are already treated as runtime-tunable resources and found the opposite: the docs emphasize copying from canonical level templates and maintaining source composition through `compose.sh`. I also looked for evidence that Agent Lightning's resource model was only about storage, but the tutorials make clear it exists to support tuning and proxy routing.

## Follow-up questions for next iteration
- Which generic loop ideas from Agent Lightning should be explicitly deferred to phase 005?
- How should the final synthesis distinguish RL-specific leverage from generic orchestration overlap?
- Which recommendations from the prior iterations deserve to be elevated as the top next-step packet candidates?
