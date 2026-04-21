# Iteration 001 - Correctness

## Scope

Audited executable/runtime implementation from the graph-metadata claims, using the current relocated package because the packet paths under `.opencode/skill/skill-advisor/` no longer exist.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill-graph.json`

Verification:
- Git history checked: `106d394ca0 refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/`
- Vitest run 001 passed: 8 files, 54 tests.

## Findings

### IMPL-F001 - P1 Correctness - Semantic-hit attribution maps nested skill-advisor paths to system-spec-kit

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1846` defines `_SKILL_PATH_RE = re.compile(r'\.opencode/skill/([^/]+)/')`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1967` starts `_resolve_skill_from_path`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1976` applies `_SKILL_PATH_RE` to semantic hit paths.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1981` returns the direct folder match when `folder_name in skills`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2084` applies semantic boosts using this resolver.

Why this matters:
The current skill-advisor package lives under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`. Semantic evidence for that package matches `system-spec-kit` as the first folder after `.opencode/skill/`, so the boost is applied to the wrong skill.

Reproduction evidence:
`python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py "advisor route me" --force-local --semantic-hits '[{"path":".opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py","score":0.95}]' --threshold 0.5 --show-rejections` returned top skill `system-spec-kit` with reason `!semantic(rank=1,score=0.95)`.

## Delta

New findings: 1 P1.
No P0 findings.
