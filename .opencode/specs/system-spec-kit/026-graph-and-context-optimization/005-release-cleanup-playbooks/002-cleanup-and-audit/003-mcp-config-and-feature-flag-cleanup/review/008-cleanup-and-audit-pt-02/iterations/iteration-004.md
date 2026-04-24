# Iteration 4: Correctness revalidation of five-config parity

## Focus
Revalidate the five checked-in Public MCP config surfaces after remediation, with emphasis on shared env-block parity, repo-relative execution roots, and the removal of the prior Gemini-only host-specific path.

## Findings

### P0
- None.

### P1
- None.

### P2
- None.

## Ruled Out
- Five-config parity drift — the checked-in Spec Kit Memory env block is identical across `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `opencode.json`, and Gemini now uses `cwd: "."` instead of a host-specific absolute path [SOURCE: .mcp.json:16-24] [SOURCE: .claude/mcp.json:15-23] [SOURCE: .vscode/mcp.json:16-24] [SOURCE: .gemini/settings.json:31-40] [SOURCE: opencode.json:25-33].
- Checked-in `MEMORY_DB_PATH` regression — the five env blocks now expose only `EMBEDDINGS_PROVIDER` plus note fields, with no database-path override reintroduced into the checked-in config surface [SOURCE: .mcp.json:16-24] [SOURCE: .claude/mcp.json:15-23] [SOURCE: .vscode/mcp.json:16-24] [SOURCE: .gemini/settings.json:32-40] [SOURCE: opencode.json:25-33].

## Dead Ends
- None.

## Recommended Next Focus
Validate the graduated/default-on rollout-policy contract against the live code, tests, and operator docs now that the five checked-in config surfaces are aligned.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness, security, traceability
- Novelty justification: The remediation removed the only active config defect, so this revalidation pass found parity restored and no replacement regression.
