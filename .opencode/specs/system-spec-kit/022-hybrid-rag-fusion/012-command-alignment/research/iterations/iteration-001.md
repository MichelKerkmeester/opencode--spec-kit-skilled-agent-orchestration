# Iteration 001 — D1 Correctness (Inventory Pass)
## Dimension: Correctness
## Focus: Inventory pass — verify all factual claims against live state

## Findings
### P2-001: Indexed historical memory artifacts still advertise obsolete command topology
- Severity: P2
- Dimension: correctness
- File: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_08-26__implemented-016-command-alignment-aligned-the.md:85
- Claim: Historical memory artifacts inside the 012 spec folder still describe the memory command surface as a `31-tool`/`8-command` system with `context.md` and `ingest.md` command files, and one follow-up artifact still says the spec reflects `7 commands` with `context.md` references.
- Reality: Live truth on 2026-03-25 is `33` MCP tools in `tool-schemas.ts`, `6` memory command files (`analyze`, `continue`, `learn`, `manage`, `save`, `shared`) plus `README.txt`, and no standalone `context.md` or `ingest.md` command files. The five canonical 012 docs already match that live state.
- Evidence: Verified `33` tool definitions in `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`; verified the 33-tool ownership matrix in `.opencode/command/memory/README.txt:249-297`; verified `analyze.md` owns 13 tools at `.opencode/command/memory/analyze.md:748`; stale matches remain in `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_08-26__implemented-016-command-alignment-aligned-the.md:85,190,201` and `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_11-13__implemented-sk-doc-dqi-alignment-across-all-8.md:85,194,311`.
- Impact: Future retrieval or audits that search the whole spec folder can surface obsolete command-count and file-layout claims, which risks reintroducing already-resolved alignment errors even though the canonical spec pack is correct.
- Fix: Mark these memory artifacts as explicitly historical/deprecated, archive or de-index them, or add a prominent note that they preserve superseded state and must not be used as current-source-of-truth evidence.

## Files Reviewed
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/plan.md
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/tasks.md
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/checklist.md
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/implementation-summary.md
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/command/memory/README.txt
- .opencode/command/memory/analyze.md
- .opencode/command/memory/continue.md
- .opencode/command/memory/learn.md
- .opencode/command/memory/manage.md
- .opencode/command/memory/save.md
- .opencode/command/memory/shared.md
- .opencode/specs/system-spec-kit/021-spec-kit-phase-system/spec.md
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_08-26__implemented-016-command-alignment-aligned-the.md
- .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/memory/15-03-26_11-13__implemented-sk-doc-dqi-alignment-across-all-8.md

## Summary
- New findings: P0=0 P1=0 P2=1
- Files reviewed: 17
- Dimension status: complete
