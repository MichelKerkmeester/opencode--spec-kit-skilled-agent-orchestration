# Iteration 2: Security review of graph compiler and advisor trust boundaries

## Focus
D2 Security review of `skill_advisor.py`, `skill_graph_compiler.py`, the compiled `skill-graph.json`, and sampled `graph-metadata.json` files.

## Findings
### P0 - Blocker
- None.

### P1 - Required
- **F010**: Derived metadata validation accepts path traversal outside the intended skill and repository roots. `validate_derived_metadata()` rejects absolute `source_docs` paths, but it does not normalize or boundary-check `../` segments before calling `os.path.isfile()` on `source_docs`, `key_files`, or `entities[].path`, so malicious metadata can point at files outside the declared trust boundary as long as the target exists. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:205-245]

### P2 - Suggestion
- **F011**: `skill_advisor.py` trusts the compiled graph after syntax-only JSON parsing. `_load_skill_graph()` only catches file/JSON syntax errors, then `_apply_graph_boosts()`, `_apply_family_affinity()`, and `_apply_graph_conflict_penalty()` assume `adjacency`, `families`, `conflicts`, and edge weights already have the expected dict/list/float shapes. A tampered but syntactically valid `skill-graph.json` can therefore raise runtime exceptions and deny service to skill routing instead of degrading safely. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:70-80] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:92-127] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:139-171] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1512-1514] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1605-1611]

## Ruled Out
- The sampled metadata corpus I checked is currently well-formed and repo-relative, so I did not find an already-materialized traversal payload in the reviewed files. [SOURCE: .opencode/skill/cli-claude-code/graph-metadata.json:68-123] [SOURCE: .opencode/skill/mcp-code-mode/graph-metadata.json:67-129] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:77-146] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:71-168]

## Dead Ends
- I did not find unsafe deserialization beyond standard `json.load()` usage; the security issue is the missing trust-boundary validation around otherwise valid JSON content. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:75-80] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:68-74]

## Recommended Next Focus
Return to D1 Correctness and check whether graph-derived boosts can skew routing quality or stability even when the graph file is well-formed.
