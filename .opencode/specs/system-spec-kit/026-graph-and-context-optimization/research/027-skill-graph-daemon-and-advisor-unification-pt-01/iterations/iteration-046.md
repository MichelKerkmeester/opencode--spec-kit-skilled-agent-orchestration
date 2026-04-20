# Iteration 046 — Follow-up Track F: F2 — Supersession routing

## Question
Supersession routing — how sk-X-v1 -> sk-X-v2 should surface in advisor.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:36-42` → The lifecycle gap explicitly calls out superseded skills as a source of routing pollution if old skills are not routed around.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:110-115` → F2 is specifically scoped as deciding how `sk-X-v1 -> sk-X-v2` should surface in the advisor.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:42` → The live graph compiler only recognizes `depends_on`, `enhances`, `siblings`, `conflicts_with`, and `prerequisite_for`; there is no `supersedes` edge today.
- `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/01-graph-metadata-schema.md:18-20` → Graph metadata validation currently allows only those five edge groups, so supersession cannot be expressed without a schema/runtime extension.
- `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/03-compiled-graph.md:18-20` → Runtime adjacency only materializes the routable edge groups, while conflicts are split into a separate pair list.
- `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/06-conflict-penalty.md:18-20` → Conflict handling keeps both skills visible and merely increases uncertainty when both pass, which is the wrong behavior for supersession because old and new versions are not just "in conflict."
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1352-1398` → The advisor already has a deprecation precedence pattern: specific new `/spec_kit:*` bridges are ordered before the deprecated generic bridge, while the legacy bridge remains for compatibility.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2505-2560` → Ranking preserves explicit-intent behavior by prioritizing explicit command/skill matches before thresholded confidence ordering.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:137-138` → Phase 027 explicitly requires backward compatibility while legacy surfaces are deprecated.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-030.md:65-72` → r01 adopted a thin compatibility-wrapper migration: keep legacy entry points working until parity/docs migration complete, even after authority shifts to the new runtime.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:151-152` → Explicit-skill prompts are a protected measurement slice: top-1/no-abstain must not regress, and derived lanes cannot displace direct support.

## Analysis
The current advisor stack has no native supersession concept. The compiler schema only allows five edge families, and the runtime graph only knows how to route via those adjacency edges plus a separate symmetric conflict list. That means F2 cannot be solved by reusing existing `conflicts_with` semantics: conflict logic intentionally keeps both candidates visible and only raises uncertainty, while supersession needs an asymmetric "old routes to successor" rule. `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:42`, `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/01-graph-metadata-schema.md:18-20`, `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/03-compiled-graph.md:18-20`, `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/06-conflict-penalty.md:18-20`

The best fit is the repo's existing deprecation-precedence pattern: newer, more specific surfaces should win by default, but the deprecated predecessor should remain available as a compatibility surface. The advisor already does this for `/spec_kit` command bridges by ordering the specific replacement bridges ahead of the deprecated generic bridge, and the wider Phase 027 migration policy repeatedly says to keep legacy entry points alive until parity and docs migration are complete. Supersession routing should therefore mirror that contract: for generic prompts, route to `sk-X-v2` and suppress `sk-X-v1` from normal winners; for explicit old-name prompts, still surface `sk-X-v1` as an explicit match but annotate it as superseded and point to `sk-X-v2`. `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1352-1398,2505-2560`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:137-138`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-030.md:65-72`

That policy also protects the measurement contract. r01 explicitly treats explicit-skill prompts as a no-regression slice and forbids derived-only displacement without direct support, so silently swapping an explicitly named legacy skill for its successor would violate the advisor's current ranking philosophy. The adopt-now answer is therefore an asymmetric supersession overlay: add a dedicated `supersedes`/`superseded_by` relation (or equivalent compiled alias), exclude or hard-demote superseded skills from implicit/default routing, but preserve explicit mention routing with a deprecation notice plus successor redirect metadata. F3/F5 can decide the exact schema field and archive interaction, but the routing rule itself is ready now. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:151-152`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2505-2560`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:36-42`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Add a first-class asymmetric supersession rule now: default routing should prefer the successor and route around the old skill, while explicit old-skill prompts still surface the deprecated skill with a clear redirect to its replacement.

## Dependencies
B6, D7, F1, F3, F5

## Open follow-ups
- Decide whether supersession is encoded as a new edge type, a derived-status field plus successor pointer, or both.
- Define the response shape for explicit old-skill prompts (`deprecated`, `superseded_by`, explanation text, threshold behavior).
- Align F5 archive handling so `superseded` and `archived` do not accidentally collapse into the same routing state.

## Metrics
- newInfoRatio: 0.58
- dimensions_advanced: [F]
