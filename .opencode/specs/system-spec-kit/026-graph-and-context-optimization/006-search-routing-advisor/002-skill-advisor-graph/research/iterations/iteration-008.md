## Summary

This iteration validated the current `skill_advisor.py` routing behavior against the compiled graph generated on `2026-04-13T08:50:16Z` and focused on whether graph-derived reasons help or hurt real routing decisions. The advisor still applies graph boosts after lexical and phrase boosts, then surfaces them directly in the `reason` field (`.opencode/skill/skill-advisor/scripts/skill_advisor.py:81-143`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1496-1498`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1573-1579`).

The most important result is that graph boosts are now visible enough to audit, but they are still doing two different jobs:

- Helpful: they preserve useful companion skills such as `sk-code-opencode` for OpenCode review requests and `sk-code-review` for deep-review requests.
- Harmful: they also create graph-only noise, especially via family and sibling propagation, including `mcp-coco-index` and `mcp-figma` on a DevTools query and `sk-deep-research` on a deep-review query.

This iteration also revalidated the structural gaps behind those behaviors:

- `system-spec-kit` still has zero declared edges in source metadata (`.opencode/skill/system-spec-kit/graph-metadata.json:1-15`) and therefore no compiled adjacency entry (`.opencode/skill/skill-advisor/scripts/skill-graph.json:39-145`).
- `mcp-coco-index` still has zero declared edges (`.opencode/skill/mcp-coco-index/graph-metadata.json:1-15`) and currently enters unrelated MCP results mainly through family affinity rather than an explicit workflow relationship.
- `sk-doc` still has zero declared edges (`.opencode/skill/sk-doc/graph-metadata.json:1-15`).
- `sk-improve-prompt` still compiles only a sibling edge to `sk-improve-agent` and no CLI-facing workflow edges (`.opencode/skill/sk-improve-prompt/graph-metadata.json:1-17`, `.opencode/skill/skill-advisor/scripts/skill-graph.json:136-145`).

## Test Results

Validation method:

- Ran the three required `skill_advisor.py --threshold 0` commands.
- Compared live results to a controlled no-graph run by monkey-patching `_apply_graph_boosts()` and `_apply_family_affinity()` to no-op in memory.
- Used the current compiled graph to check whether observed graph reasons were coming from explicit edges or family spillover.

### Query A

Command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py 'review my opencode typescript module' --threshold 0
```

Full output:

```json
[
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-opencode,0.3), !intent:review, !review, !review(multi), opencode"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.92,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7), !opencode, !typescript, opencode(name), typescript"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.62,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7), !graph:sibling(sk-code-opencode,0.4), opencode~"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.51,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7), !graph:sibling(sk-code-opencode,0.4)"
  }
]
```

Assessment:

- Graph boosts do appear in the `reason` field for the top two results.
- Routing accuracy improves slightly with graph enabled because `sk-code-opencode` stays strong as the correct companion to `sk-code-review`.
- The same boosts also inflate `sk-code-web` and `sk-code-full-stack` from irrelevant neighbors. In the no-graph comparison, both disappear from the top routing set while the correct top two remain intact.
- Conclusion: graph is helpful here for companion ranking, but sibling/enhance propagation is too permissive once the correct pair is already found.

### Query B

Command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py 'use chrome devtools to debug css layout' --threshold 0
```

Full output:

```json
[
  {
    "skill": "mcp-chrome-devtools",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !chrome, !css(multi), !debug, !devtools, !intent:tooling"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !css, !css(multi), !graph:enhances(mcp-chrome-devtools,0.5), !layout, !layout(multi)"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.88,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !graph:depends(mcp-chrome-devtools,0.7), !intent:tooling, chrome, devtools, use"
  },
  {
    "skill": "mcp-coco-index",
    "kind": "skill",
    "confidence": 0.67,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:family(mcp), use"
  },
  {
    "skill": "mcp-figma",
    "kind": "skill",
    "confidence": 0.56,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:family(mcp), devtools~"
  },
  {
    "skill": "mcp-clickup",
    "kind": "skill",
    "confidence": 0.44,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.44,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-web,0.3)"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.43,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:sibling(sk-code-web,0.4)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.4,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:sibling(sk-code-web,0.4)"
  }
]
```

Assessment:

- Graph boosts appear in the reasons for `sk-code-web`, `mcp-code-mode`, `mcp-coco-index`, `mcp-figma`, `sk-code-review`, `sk-code-opencode`, and `sk-code-full-stack`.
- `mcp-chrome-devtools` remains the correct primary route with or without graph.
- The `mcp-chrome-devtools -> sk-code-web` edge is helpful because it keeps web-debug context visible for a CSS layout problem.
- The `mcp-chrome-devtools -> mcp-code-mode` relationship is explainable and harmless, but it is not decisive here because lexical evidence already keeps `mcp-code-mode` in the top three.
- The biggest problem is family bleed. `mcp-coco-index` and `mcp-figma` rise mostly on `!graph:family(mcp)` even though the prompt never asks for semantic search or Figma. When family affinity is disabled, both drop below more honest low-signal candidates.
- Conclusion: graph helps the secondary web pairing, but family affinity hurts routing quality for tool-specific MCP requests.

### Query C

Command:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py 'deep review the spec folder' --threshold 0
```

Full output:

```json
[
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), review(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !folder, !spec, document~, folder, spec(name)"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.87,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !graph:depends(sk-deep-review,0.8), !intent:review, !review, !review(multi), review(name)"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.65,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:sibling(sk-deep-review,0.5), deep(name)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.64,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7), specification~, spec~"
  },
  {
    "skill": "sk-code-web",
    "kind": "skill",
    "confidence": 0.56,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7), spec~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.49,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !graph:enhances(sk-code-review,0.7)"
  },
  {
    "skill": "command-create-folder-readme",
    "kind": "command",
    "confidence": 0.73,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create(name), document~, folder(name)"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
    "confidence": 0.62,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create, plan~, spec(name), specification~"
  }
]
```

Assessment:

- Graph boosts appear in the reasons for `sk-code-review`, `sk-deep-research`, and the lower `sk-code-*` results.
- `sk-deep-review` is correctly first with or without graph, and `sk-code-review` is a legitimate supporting skill because `sk-deep-review` explicitly depends on it (`.opencode/skill/sk-deep-review/graph-metadata.json:6-19`, `.opencode/skill/sk-code-review/graph-metadata.json:6-20`).
- The sibling boost to `sk-deep-research` is harmful for this prompt. It is a mode-confusion false positive caused purely by the `sk-deep-review <-> sk-deep-research` sibling relation.
- `system-spec-kit` is correctly relevant for "spec folder", but that relevance still comes from direct lexical evidence rather than graph structure because it has no declared edges in source or compiled graph.
- Conclusion: graph improves the baseline-review companion story but still under-models the system hub and over-promotes the opposite autonomous mode.

## Prioritized Improvements

### P0

1. Prevent graph-only candidate creation for family and sibling affinity.
   - Evidence: `mcp-coco-index` and `mcp-figma` appear on the DevTools query mainly because of `!graph:family(mcp)`, and `sk-deep-research` appears on the deep-review query because of `!graph:sibling(sk-deep-review,0.5)`.
   - Recommendation: require a minimum lexical or intent evidence floor before family/sibling boosts can create a new candidate. If a skill has zero non-graph evidence, graph should only refine rank, not create it.

2. Add explicit edges for the current zero-edge hub and orphan skills.
   - Evidence: `system-spec-kit`, `mcp-coco-index`, and `sk-doc` still declare no edges at all (`.opencode/skill/system-spec-kit/graph-metadata.json:1-15`, `.opencode/skill/mcp-coco-index/graph-metadata.json:1-15`, `.opencode/skill/sk-doc/graph-metadata.json:1-15`), and none of them appear in compiled adjacency (`.opencode/skill/skill-advisor/scripts/skill-graph.json:39-145`).
   - Recommendation: model the real workflow relationships instead of letting these skills rely on keyword coincidence or family spillover. The minimum high-signal set still looks like:
     - `sk-doc -> system-spec-kit` as `enhances`
     - `system-spec-kit -> sk-doc` and `system-spec-kit -> sk-git` as explicit workflow edges if the packet wants hub traversal symmetry
     - `mcp-coco-index -> sk-code-opencode` and `mcp-coco-index -> sk-code-web` as semantic-search workflow edges

3. Add the missing CLI prompt-quality integration edges.
   - Evidence: `sk-improve-prompt` still compiles only a sibling edge to `sk-improve-agent` (`.opencode/skill/sk-improve-prompt/graph-metadata.json:6-16`, `.opencode/skill/skill-advisor/scripts/skill-graph.json:136-145`), so current CLI routing cannot use that relationship even though the prompt-quality card is a shared dependency surface.
   - Recommendation: add `enhances` edges from `sk-improve-prompt` to all four CLI skills so prompt-quality routing is explicit instead of invisible.

### P1

1. Keep `depends_on` as the main prerequisite routing primitive, but fix compiler completeness for explainability.
   - Evidence: current routing can already explain `mcp-code-mode` on the DevTools query via compiled `depends_on` from `mcp-chrome-devtools` (`.opencode/skill/mcp-chrome-devtools/graph-metadata.json:6-18`, `.opencode/skill/skill-advisor/scripts/skill-graph.json:68-88`), so missing `prerequisite_for` output is not blocking this routing path.
   - Recommendation: preserve the existing reverse-usable `depends_on` behavior, but also emit provenance or an explicit reverse view in the compiled artifact so audits do not treat valid prerequisite relationships as dropped.

2. Re-tune family affinity after the gating fix.
   - Evidence: `_apply_family_affinity()` currently adds `max_boost * 0.08` whenever a family member already exceeds `1.5` and the candidate has no score yet (`.opencode/skill/skill-advisor/scripts/skill_advisor.py:123-143`).
   - Recommendation: after P0 gating lands, lower the weight or add domain-aware exclusions for broad families like `mcp`. The current 0.08 value is small numerically but still large enough to leak unrelated MCP skills into the visible result set.

3. Improve reason-field ordering for audits.
   - Evidence: the advisor currently sorts the deduplicated reason set alphabetically and truncates to five entries (`.opencode/skill/skill-advisor/scripts/skill_advisor.py:1573-1579`).
   - Recommendation: preserve score order or group reasons by category so audits can see the strongest lexical/intent cause before graph decoration. Right now graph tokens can crowd out more informative evidence.

### P2

1. Reconsider whether `sk-deep-review <-> sk-deep-research` should remain a plain sibling pair.
   - Evidence: the edge is structurally valid, but it keeps leaking the wrong autonomous mode into clearly review-only prompts.
   - Recommendation: either keep the edge but mark it non-routing, or replace it with a weaker documentation-only relationship that does not feed runtime ranking.

2. Do not increase `mcp-chrome-devtools -> sk-code-web` yet.
   - Evidence: current live routing already ties `sk-code-web` with the primary tool route on the CSS-layout query, so this edge is not underpowered enough to justify immediate weight growth.
   - Recommendation: leave the weight at `0.5` until the family/sibling spillover fixes land, then re-measure.

3. Consider adding `intent_signals` to the compiled graph for future diagnostics.
   - Evidence: this would make routing audits easier and the earlier packet estimate suggested the compiled artifact would still remain manageable in size.
   - Recommendation: treat this as observability work, not a routing blocker.

## New Questions

1. Should zero-edge skills be allowed to participate in family affinity at all, or should the compiler require at least one explicit edge before family propagation is enabled for that node?
2. Does the packet want hub modeling to be symmetric for traversal (`system-spec-kit -> sk-doc` and `sk-doc -> system-spec-kit`), or should routing stay directional and rely on one edge plus lexical evidence?
3. For autonomous loop pairs like `sk-deep-review` and `sk-deep-research`, should the relationship remain in the graph but be excluded from runtime scoring, or is the better fix to reclassify the relation type entirely?

## Metrics

- `newInfoRatio`: `0.38`
