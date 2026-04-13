# Iteration 012: D1 Correctness stabilization pass

## Focus
D1 Correctness - verify the advisor health-check graph extension, including healthy output, missing/corrupt graph fallback, and documentation field-name parity.

## Verified claims
- `health_check()` still emits the graph-status fields `skill_graph_loaded`, `skill_graph_skill_count`, and `skill_graph_path`, and the CLI prints that payload after CocoIndex enrichment. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1660] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1675] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1790]
- The operator docs still name the graph-status surface consistently: the feature catalog describes graph load state and count, the compiler playbook requires `skill_graph_loaded` plus `skill_graph_skill_count`, and the setup guide expects the same load flag in live output. [SOURCE: .opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md:18] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/005-health-check.md:26] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/005-health-check.md:29] [SOURCE: .opencode/skill/skill-advisor/SET-UP_GUIDE.md:127] [SOURCE: .opencode/skill/skill-advisor/SET-UP_GUIDE.md:132]
- `_load_skill_graph()` degrades gracefully when the compiled graph is missing or corrupt: it catches both `OSError` and `json.JSONDecodeError` and returns `None` instead of crashing callers such as `health_check()`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:70] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:79]

## Findings

### P1 - Required
- **F110**: The health-check extension does not surface graph failure as a degraded overall status and cannot distinguish a missing graph from a corrupt one. `_load_skill_graph()` collapses both `OSError` and `JSONDecodeError` into `None`, then `health_check()` keeps `"status": "ok"` whenever skill discovery succeeds and only flips `skill_graph_loaded` / `skill_graph_skill_count`. That leaves the top-level probe green even when graph-derived routing boosts are silently disabled, despite the feature catalog positioning `--health` as the operational readiness probe for graph readability. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:70] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:79] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1666] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1676] [SOURCE: .opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md:18] [SOURCE: .opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md:20]

## Ruled Out
- There is no field-name drift in the graph-status payload itself; code and docs still align on `skill_graph_loaded` and `skill_graph_skill_count`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1675] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1676] [SOURCE: .opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/005-health-check.md:28] [SOURCE: .opencode/skill/skill-advisor/SET-UP_GUIDE.md:132]
- Missing or corrupt `skill-graph.json` does not crash the health CLI. The failure mode is silent degradation, not an exception path. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:70] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:79] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1790]

## Dead Ends
- The README flag table only says `--health` "Runs diagnostics on skill discovery", so it does not constrain the graph-status semantics tightly enough to establish a separate documentation mismatch. [SOURCE: .opencode/skill/skill-advisor/README.md:181]

## Recommended Next Focus
Stabilization / convergence - decide whether the active P0/P1 set is stable enough to synthesize a final verdict now that the health-check extension has been re-checked for runtime degradation behavior.
