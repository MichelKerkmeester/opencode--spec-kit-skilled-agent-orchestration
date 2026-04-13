## Final Synthesis

Across iterations 001 through 009, the skill graph work converged on a consistent conclusion: the system is promising as a lightweight routing assist, but it is not yet production-ready as an authoritative routing substrate.

The strongest positive signals are:
- the metadata schema is stable enough to validate cleanly,
- the current regression harness is green (`44/44`),
- direct `depends_on` and most `siblings` relationships are internally coherent, and
- graph boosts can improve companion-skill recall in some real prompts.

The strongest negative signals are:
- several high-value hub and utility skills are still graph-orphans or graph-invisible,
- the compiler drops routing-critical metadata and one full edge type at runtime,
- family and sibling propagation can manufacture graph-only candidates with no lexical evidence, and
- runtime confidence/uncertainty currently treats derived graph evidence as if it were direct evidence.

Taken together, this means the current system is acceptable as an experimental assist layer, but not yet as the canonical production routing layer the packet is aiming for.

## All Findings by Category

### Schema Issues

1. The validator is shape-correct but semantics-light. It enforces schema/version/category/family/target existence/weight range, but it does not reject self-edges, dependency cycles, zero-edge skills, or asymmetric `enhances` data. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:80-154`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:157-204`. Provenance: iterations 003 and 006.
2. The schema/runtime contract is misleading for compiled output. `domains` and `intent_signals` are required in every per-skill metadata file, but the compiler validates them and then discards them from the runtime artifact. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:148-152`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:233-292`. Provenance: iterations 004 and 005.
3. The `hub_skills` description overstates what is measured. The docstring says "across all types", but hub detection only sees the compiled adjacency subset, which excludes `prerequisite_for` and all metadata-only signals. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:211-230`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:253-264`. Provenance: iteration 003.

### Edge Data Issues

1. `system-spec-kit` is under-modeled as a zero-edge hub even though its own docs describe downstream flows to `sk-code-opencode`, `sk-git`, and `sk-doc`, and it routes semantic queries to CocoIndex. Evidence: `.opencode/skill/system-spec-kit/graph-metadata.json:6-15`, `.opencode/skill/system-spec-kit/SKILL.md:775-777`, `.opencode/skill/system-spec-kit/SKILL.md:919-923`, `.opencode/skill/system-spec-kit/SKILL.md:943-951`. Provenance: iterations 001, 004, 006, and 007.
2. `mcp-coco-index` is also a zero-edge orphan despite clear workflow coupling to semantic/concept code search. Evidence: `.opencode/skill/mcp-coco-index/graph-metadata.json:6-15`, `.opencode/skill/system-spec-kit/SKILL.md:775-777`. Provenance: iterations 005 and 007.
3. `sk-doc` is a zero-edge orphan despite explicit integration with `system-spec-kit` on documentation-quality flows. Evidence: `.opencode/skill/sk-doc/graph-metadata.json:6-15`, `.opencode/skill/system-spec-kit/SKILL.md:921-923`, `.opencode/skill/system-spec-kit/SKILL.md:948-950`, `.opencode/skill/sk-doc/SKILL.md:802-808`. Provenance: iterations 006 and 007.
4. `sk-git` is also zero-edge, but the evidence supports a narrower workflow link than a broad code-quality overlay. Evidence: `.opencode/skill/sk-git/graph-metadata.json:6-15`, `.opencode/skill/system-spec-kit/SKILL.md:948-949`. Provenance: iterations 006 and 007.
5. `sk-improve-prompt` is under-connected. It only models a sibling tie to `sk-improve-agent`, while all four CLI skills now ALWAYS load `assets/prompt_quality_card.md` before dispatch. Evidence: `.opencode/skill/sk-improve-prompt/graph-metadata.json:6-17`, `.opencode/skill/cli-claude-code/SKILL.md:112-113`, `.opencode/skill/cli-claude-code/SKILL.md:429-432`, `.opencode/skill/cli-codex/SKILL.md:108-109`, `.opencode/skill/cli-codex/SKILL.md:446-448`, `.opencode/skill/cli-copilot/SKILL.md:106-107`, `.opencode/skill/cli-copilot/SKILL.md:384-386`, `.opencode/skill/cli-gemini/SKILL.md:105-106`, `.opencode/skill/cli-gemini/SKILL.md:373-375`. Provenance: iteration 006.
6. `mcp-code-mode` has a source/runtime mismatch: its `prerequisite_for` edges exist in metadata but are dropped from compiled runtime adjacency, and its frontmatter names downstream integrations that are not all represented as graph nodes. Evidence: `.opencode/skill/mcp-code-mode/graph-metadata.json:6-18`, `.opencode/skill/mcp-code-mode/SKILL.md:2-3`, `.opencode/skill/mcp-code-mode/SKILL.md:19-20`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:253-264`. Provenance: iterations 001 and 004.
7. `sk-code-review` and the `sk-code-*` overlays are intentionally asymmetric, but that asymmetry is currently unchecked and materially affects routing strength (`0.7` outbound from review vs `0.3` reverse). Evidence: `.opencode/skill/sk-code-review/graph-metadata.json:8-17`, `.opencode/skill/sk-code-opencode/graph-metadata.json:8-19`, `.opencode/skill/sk-code-web/graph-metadata.json:8-19`, `.opencode/skill/sk-code-full-stack/graph-metadata.json:8-19`. Provenance: iterations 001 and 003.
8. `sk-deep-review <-> sk-deep-research` is structurally valid but semantically risky as a routing sibling because it leaks the wrong autonomous mode into review-only prompts. Evidence: `.opencode/skill/sk-deep-review/graph-metadata.json:7-18`. Provenance: iterations 007 and 008.
9. `mcp-chrome-devtools -> sk-code-web` is directionally correct and useful; any weight change should wait until the broader graph-noise issues are fixed. Evidence: `.opencode/skill/mcp-chrome-devtools/graph-metadata.json:7-18`. Provenance: iterations 005 and 007.

### Compiler Gaps

1. The compiler excludes `prerequisite_for` from runtime adjacency, making those source edges inert for graph-based boosting. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:253-264`. Provenance: iterations 001, 003, and 007.
2. The compiler emits topology only, so the runtime graph cannot replace or even directly consume canonical `intent_signals` or `domains`. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:233-292`. Provenance: iterations 004 and 005.
3. Zero-edge skills disappear from compiled adjacency entirely, which hides important hub/orphan modeling gaps at runtime and during audits. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:249-267`. Provenance: iterations 003, 004, and 007.
4. There is no compiler-side drift check between `PHRASE_INTENT_BOOSTERS` and graph metadata, so exact duplicates and partially graph-backed phrase pairs can silently diverge. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` plus `.opencode/skill/skill-advisor/scripts/skill_advisor.py:613-760`. Provenance: iteration 004.
5. If richer routing metadata becomes canonical, the current `~2KB` target is unrealistic for a single artifact. Iteration testing showed roughly `3.5KB` for a compact indexed single-file design and `5.2KB` for naive raw inclusion. Primary design surface: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`, `.opencode/skill/skill-advisor/scripts/skill-graph.json`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/spec.md:31`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/spec.md:139`. Provenance: iteration 005.

### Advisor Integration Issues

1. Graph-derived boosts can create visible candidates that have zero lexical or direct intent evidence. This is most obvious in family and sibling propagation. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:81-143`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1496-1498`. Provenance: iterations 007 and 008.
2. Family affinity is the highest-risk live mechanism. It already caused one top-1 winner flip in the regression corpus (`1/44`) and eleven top-3 membership changes (`11/44`). It also injects unrelated MCP and utility skills into ranked tails. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:123-143`. Provenance: iterations 007 and 008.
3. The current transitive coefficients and `0.1` floor make some legitimate edges nearly inert (`siblings`, `family`) and others only weakly substitutable for hardcoded phrase companions. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:98-119`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:123-143`. Provenance: iterations 002 and 004.
4. Graph-derived reasons are mixed into the same evidence bucket as direct phrase, intent, and semantic matches, so confidence and uncertainty overstate certainty when graph signals are only transformed evidence. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1244-1289`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1292-1318`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1524-1580`. Provenance: iteration 005.
5. The reason field is alphabetically sorted and truncated, which hurts explainability because graph tokens can crowd out stronger direct evidence. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1573-1580`. Provenance: iteration 007.
6. Built-in CocoIndex search fails closed to `[]` on any subprocess problem, so semantic/graph interaction silently disappears in restricted environments. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1038-1065`. Provenance: iteration 005.
7. The runtime still relies on a large manual phrase table for canonical routing, including several multi-skill pairs that either duplicate metadata or should be promoted into the graph. Primary edit surface: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:613-760`. Provenance: iteration 004.

### Improvement Opportunities

1. Compile canonical routing metadata (`intent_signals`, optionally `domains`) and auto-generate the exact phrase layer from that compiled source instead of hand-maintaining both systems. Provenance: iterations 004 and 005.
2. Add a small deterministic alias-expansion layer for canonical signals and skill identities (`use X`, `delegate to X`, slash variants, hyphen/space normalization) instead of duplicating near-match phrases manually. Provenance: iteration 004.
3. Distinguish routing-only versus observability-only relationships. Some pairs, such as `sk-deep-review <-> sk-deep-research`, may belong in docs or diagnostics but not in runtime ranking. Provenance: iterations 007 and 008.
4. Improve explainability and debuggability by surfacing graph provenance, semantic-search failure reasons, and possibly an explicit reverse view for prerequisite relationships. Provenance: iterations 005 and 007.
5. Re-tune transitive weights only after the gating and data-model fixes land; otherwise weight changes will optimize noise instead of signal. Provenance: iterations 002, 004, 005, and 007.

## Actionable Recommendations

### P0: Required Before Calling This Production-Ready

1. Prevent graph-only candidate creation.
   - Change `.opencode/skill/skill-advisor/scripts/skill_advisor.py:81-143` so `siblings` and `family` boosts can only refine candidates that already have lexical, phrase, explicit-name, semantic, or direct intent evidence.
   - Minimum implementation expectation: do not let `_apply_graph_boosts()` or `_apply_family_affinity()` create a brand-new skill solely from graph propagation.

2. Close the hub/orphan edge gaps with explicit high-signal relationships.
   - Add workflow edges in:
     - `.opencode/skill/system-spec-kit/graph-metadata.json:6-15`
     - `.opencode/skill/mcp-coco-index/graph-metadata.json:6-15`
     - `.opencode/skill/sk-doc/graph-metadata.json:6-15`
     - `.opencode/skill/sk-improve-prompt/graph-metadata.json:6-17`
   - Highest-confidence initial set:
     - `sk-doc -> system-spec-kit` as `enhances`
     - `mcp-coco-index -> system-spec-kit` as `enhances` or another workflow-facing edge type if introduced
     - `sk-improve-prompt -> cli-claude-code|cli-codex|cli-copilot|cli-gemini` as `enhances`
     - `system-spec-kit -> sk-doc` and `system-spec-kit -> sk-git` only if the packet wants symmetric hub traversal, not just directional routing.

3. Eliminate the compiler/runtime contract drift.
   - Update `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:233-292` so the compiled runtime artifact includes canonical routing metadata, or emit a second compact sidecar dedicated to routing metadata.
   - The current topology-only artifact is not enough if the project expects graph metadata to become the source of truth for routing.

4. Resolve the inert `prerequisite_for` path.
   - Update `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:253-264` so `prerequisite_for` either compiles into runtime adjacency, is materialized as a reverse view, or is explicitly removed from source metadata in favor of normalized reverse `depends_on`.
   - Keep `mcp-code-mode` aligned at `.opencode/skill/mcp-code-mode/graph-metadata.json:11-15`; right now those edges are present in source but not active in runtime graph scoring.

5. Separate derived graph evidence from direct evidence in scoring.
   - Update `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1244-1318` and `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1524-1580` so graph-propagated evidence does not reduce uncertainty or increase confidence as strongly as direct phrase, lexical, or semantic matches.
   - This is necessary for trustworthy thresholds and explanations once graph routing becomes more complete.

### P1: Should Land Soon After P0

1. Harden validation in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:80-204`.
   - Add warnings or errors for self-edges, zero-edge skills, dependency cycles, and `enhances` asymmetry/weight drift.
   - At minimum, zero-edge hubs like `system-spec-kit` should not pass silently.

2. Add a compiler-side drift audit between metadata and phrase routing.
   - Compare `.opencode/skill/skill-advisor/scripts/skill_advisor.py:613-760` against compiled `intent_signals`.
   - Report exact duplicates, graph-backed secondary phrase pairs, and phrase pairs still missing graph representation.

3. Reclassify or de-route the `sk-deep-review <-> sk-deep-research` relationship.
   - Review `.opencode/skill/sk-deep-review/graph-metadata.json:11-13`.
   - If the relationship is useful only for documentation or discoverability, keep it out of runtime ranking.

4. Improve reason ordering for audits.
   - Update `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1573-1580` so reasons preserve score order or group by source (`direct`, `semantic`, `graph`) instead of sorting alphabetically.

5. Make CocoIndex failure debuggable.
   - Update `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1038-1065` to emit a non-fatal diagnostic or trace reason when built-in semantic search fails.

### P2: Nice-to-Haves After the Core Fixes

1. Revisit transitive multipliers and floors in `.opencode/skill/skill-advisor/scripts/skill_advisor.py:98-119`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:123-143`.
   - Do this only after graph-only candidate creation is blocked and the missing edge data is filled in.

2. Decide whether the compiled runtime surface should be:
   - one richer artifact in the `3-4KB` range, or
   - a topology-only `skill-graph.json` plus a compact routing-metadata sidecar.

3. Clarify `hub_skills` semantics in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:211-230`.
   - Either rename/document the current behavior accurately or move to a richer centrality definition once the compiled data model stabilizes.

4. Re-evaluate directional weights such as:
   - `sk-code-review -> sk-code-*` vs reverse overlays,
   - `mcp-chrome-devtools -> sk-code-web`,
   - family affinity for broad families like `mcp` and `sk-util`.
   - These are tuning questions, not current blockers.

## Production Readiness Verdict

Verdict: not production-ready yet as a canonical routing system.

If the bar is "safe to ship as an experimental assist layer behind the existing hardcoded routing," the answer is yes. The current build is stable enough for controlled use:
- validation passes,
- the regression harness is green (`44/44`),
- only one current regression-case winner flips with graph enabled, and
- direct prerequisite and overlay edges can help companion-skill recall.

If the bar is "ready to become the authoritative production routing substrate," the answer is no.

### Blocking Issues

1. Graph-only candidate creation is still happening through family and sibling propagation in `.opencode/skill/skill-advisor/scripts/skill_advisor.py:81-143`.
2. The compiler/runtime contract is incomplete because canonical routing metadata is validated but dropped at compile time in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:233-292`.
3. Important hub and utility skills are still graph-orphans or graph-invisible: `system-spec-kit`, `mcp-coco-index`, `sk-doc`, `sk-improve-prompt`.
4. `prerequisite_for` is modeled in source but inert in runtime graph scoring because it is excluded in `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:253-264`.
5. Confidence and uncertainty are not epistemically sound once graph evidence is mixed with direct evidence in `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1244-1318`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1524-1580`.

### Nice-to-Haves

1. Better compiler warnings for asymmetry, cycles, self-edges, and orphan skills.
2. Auto-generated exact phrase routing from compiled metadata plus alias expansion.
3. Better reason ordering and richer graph provenance in advisor output.
4. CocoIndex failure diagnostics.
5. Post-fix tuning of edge weights, family affinity, and hub computation.

Bottom line: ship only as a guarded assist layer until the P0 items above are complete. Do not yet treat the graph as the production source of truth for routing decisions.

## Metrics

- `newInfoRatio`: `0.12`
