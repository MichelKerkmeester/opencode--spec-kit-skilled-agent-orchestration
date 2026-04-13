# Iteration 2: Security re-review of the compiler boundary fix and graph setup surfaces

## Focus
D2 Security review of `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`, and `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` after the F010 remediation.

## Findings
### P0 - Blocker
- None.

### P1 - Required
- None.

### P2 - Suggestion
- None.

## Remediation Status
- **F010**: Direct `../` and absolute-path traversal are no longer reproducible in derived metadata validation. `validate_derived_metadata()` now normalizes candidate paths for `source_docs`, `key_files`, and `entities[].path`, then rejects normalized paths that escape `skill_dir` or `repo_root` before the `os.path.isfile()` existence check runs. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:206-255]

## Ruled Out
- `skill-graph-db.ts` does not expose a SQL-injection sink in the reviewed paths. Metadata reads, writes, deletes, and upserts all use `better-sqlite3` prepared statements with bound parameters, and the only dynamic SQL fragment is a placeholder-count string used with separately bound `skillIds`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:231-245] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:433-580]
- `init-skill-graph.sh` does not build shell commands from untrusted strings. It computes fixed repository-local paths, then dispatches fixed `python3` commands through `run_from_repo()` using quoted `"$@"` argument forwarding. [SOURCE: .opencode/skill/skill-advisor/scripts/init-skill-graph.sh:23-31] [SOURCE: .opencode/skill/skill-advisor/scripts/init-skill-graph.sh:53-60]

## Dead Ends
- None.

## Recommended Next Focus
D3 Traceability - verify that the restarted gen2 review packet rebuilt its live strategy / lineage artifacts consistently and that the remediation docs now reflect the current security verdict.
