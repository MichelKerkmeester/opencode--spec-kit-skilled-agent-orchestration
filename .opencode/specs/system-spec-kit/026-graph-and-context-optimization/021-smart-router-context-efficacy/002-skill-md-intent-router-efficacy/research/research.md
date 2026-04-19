# Research Synthesis: SKILL.md Smart-Router Section Efficacy

## 1. Executive Summary

The Smart Routing section pattern has a real static savings opportunity, but there is no evidence that the runtime enforces it today. The deterministic measurements show a median savings ceiling of about 76.3% when comparing `SKILL.md + ALWAYS` against `SKILL.md + loadable resource tree`. The behavioral artifact scan shows frequent skill-resource citation, including broad multi-resource citations, but those artifacts are not live `Read` telemetry. The correct conclusion is: keep the pattern as a declarative manifest, but do not claim live context savings until an instrumented harness measures actual file reads.

## 2. Scope and Non-Goals

This packet studies the `## SMART ROUTING` section inside `.opencode/skill/*/SKILL.md`. It does not re-open advisor-hook research from `021/001`; that surface chooses which skill to use, while this packet studies which resources inside an already-chosen skill are loaded. It also does not modify runtime code or existing spec folders outside this `002` research packet.

## 3. Methodology

The research used deterministic local measurement wherever possible: `rg` for inventory, AST parsing of fenced Python pseudocode, byte accumulation from local files, exact keyword matching over the 200-prompt 019/004 corpus, and `rg`/config reads for enforcement surfaces. Behavioral claims use `.opencode/specs/**/research/iterations/iteration-*.md` as an observational proxy, not raw telemetry.

## 4. Evidence Classes

Strong evidence covers V1, V2, V6, V7, V8, and V9. Moderate evidence covers V3, V4, and V5 because artifact logs and corpus labels are indirect. V10 is design-only because no live instrumentation was run.

## 5. V1 Inventory and Shape Variance

There are 20 top-level `.opencode/skill/*/SKILL.md` files with Smart Routing sections. Fourteen use the canonical `INTENT_SIGNALS + RESOURCE_MAP + LOADING_LEVELS` trio. Important variants include `sk-code-opencode` language routing, `sk-code-full-stack` `INTENT_MODEL`/`LOAD_LEVELS`, `sk-code-review` `DEFAULT_RESOURCES` plus `ON_DEMAND_KEYWORDS`, and `sk-improve-prompt` command-prefix routing. Any harness must support these aliases.

Decision: adopt-now.

## 6. V2 Resource Budget

Median ALWAYS resource bytes are 15,296. Median `SKILL.md + ALWAYS` bytes are 41,009. Median loadable resource tree bytes are 129,215. The median savings ceiling is about 76.3% against `SKILL.md + loadable resource tree`. This is a theoretical ceiling: it assumes the assistant would otherwise load the full loadable resource tree and that the routed subset is sufficient.

Decision: adopt-now.

## 7. V3 Behavioral Signal

The requested scan scope contained 1,014 research iteration files. Of those, 334 mention at least one `.opencode/skill/...` path, 200 mention a concrete `SKILL.md`, and 197 mention a `references/` or `assets/` path. Forty-four files cite more than two resources for the same skill and 22 cite five or more. This is evidence that skill resources are commonly used, but not proof of exact `Read` calls.

Decision: prototype-later.

## 8. V4 Intent Classification Accuracy

On a deterministic first-30 sample from the 019/004 corpus, 26 prompts had concrete top-skill labels. The extracted router scoring produced a non-UNKNOWN route for 17 of those 26, or 65.4%. File-extension based routing in `sk-code-opencode` performed well, while natural documentation and review phrasing produced many UNKNOWN results. This sample is useful but not definitive because the corpus labels skill choice, not intra-skill resource intent.

Decision: prototype-later.

## 9. V5 Compliance Gap

Current artifacts cannot support a numeric tier-compliance estimate. The evidence shows broad resource citation in some iterations, especially for `system-spec-kit`, but not the exact runtime decision process. The right value for `tier_compliance_estimate` is `needs-harness`.

Decision: prototype-later.

## 10. V6 ALWAYS Bloat

Using `SKILL.md + loadable resource tree` as the denominator, four skills exceed 50% ALWAYS share: `sk-code-review`, `mcp-figma`, `mcp-chrome-devtools`, and `mcp-clickup`. Using resource-tree-only denominator, only `sk-code-review` exceeds 50%. Raw full-subtree denominator is not suitable for primary interpretation because some skill folders contain large implementation or environment trees outside routable docs.

Decision: adopt-now.

## 11. V7 ON_DEMAND Keyword Coverage

The 200-prompt corpus produced 11 prompt-level hits for any ON_DEMAND keyword, a 5.5% hit rate. All hits came from `sk-code-review` phrases such as `deep review`. Phrases like `full reference`, `all templates`, and `complete reference` are rare in ordinary task prompts. ON_DEMAND is therefore safe but likely under-triggered.

Decision: adopt-now.

## 12. V8 UNKNOWN_FALLBACK Safety

The CLI skills `cli-codex`, `cli-copilot`, and `cli-gemini` fall back to `GENERATION` when no route scores. `cli-claude-code` falls back to `DEEP_REASONING`. Several non-CLI skills use UNKNOWN checklists instead. The safest pattern is an explicit UNKNOWN/disambiguation path, not silent default to a productive intent.

Decision: adopt-now.

## 13. V9 Enforcement Mechanism

No runtime enforcement mechanism was found. Runtime configs define session/prompt hooks and permissions, but no PreToolUse or read-wrapper rule compares `.opencode/skill/...` reads against Smart Routing output. `skill_advisor.py` chooses skills, not intra-skill resources. Smart Routing is currently advisory.

Decision: prototype-later.

## 14. V10 Measurement Plan

Build a telemetry harness that logs prompt id, selected skill, predicted route, allowed resources, actual skill-resource reads, and compliance class. Compliance classes should include `always`, `conditional_expected`, `on_demand_expected`, `extra`, `missing_expected`, and `unknown_unparsed`. Start in observe-only mode before considering warnings or hard blocks.

Decision: adopt-now.

## 15. Assumptions and Limitations

The byte parser handles current pseudocode shapes but is not a production parser. Behavioral scans use markdown artifacts, not actual transcript telemetry. The 019/004 corpus is useful for prompt realism but labels gate/skill routing rather than intra-skill intent. The CocoIndex semantic MCP call was cancelled by the MCP layer during this run, so V9 used exact search and config reads.

Primary packet evidence is recorded in the iteration series. [SOURCE: `research/iterations/iteration-001.md` through `research/iterations/iteration-020.md`]

## 16. Recommendations

1. Keep Smart Routing as a declarative manifest.
2. Fix stale route paths in `mcp-code-mode` and `sk-improve-agent`.
3. Tune ON_DEMAND trigger phrases toward real prompt language.
4. Replace silent `GENERATION` zero-score fallbacks with UNKNOWN/disambiguation in CLI skills, or require stronger evidence before generation defaults.
5. Build observe-only telemetry before adding enforcement.
6. Add a static CI check that validates route paths and reports ALWAYS bloat.

<!-- ANCHOR:sources -->
## Sources

- [SOURCE: `.opencode/skill/*/SKILL.md` inventory and router section parsing]
- [SOURCE: `.opencode/specs/**/research/iterations/iteration-*.md` behavioral artifact scan]
- [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl` prompt corpus sample]
- [SOURCE: `.claude/settings.local.json`, `.codex/config.toml`, and `.gemini/settings.json` enforcement-surface review]
<!-- /ANCHOR:sources -->

## 17. Conclusion

The pattern is worth keeping, but its efficacy is not yet proven in live AI behavior. It provides a useful resource manifest and a large theoretical savings ceiling. The missing piece is enforcement or telemetry. The next best step is a harness, not a claim that AIs already follow the tiers.
