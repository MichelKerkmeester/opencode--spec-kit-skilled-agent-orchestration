# Deep Review Strategy: Command Alignment

## Review Target
- `.opencode/command/spec_kit/` (8 commands + 17 YAML assets + README.txt)
- `.opencode/command/memory/` (6 commands + README.txt)

## Dimensions

| Dimension | Status | Covered In | Findings |
|-----------|--------|------------|----------|
| correctness | pending | Waves 1-2 | P0=0 P1=0 P2=0 |
| security | pending | Wave 3 | P0=0 P1=0 P2=0 |
| traceability | pending | Wave 4 | P0=0 P1=0 P2=0 |
| maintainability | pending | Wave 5 | P0=0 P1=0 P2=0 |

## Files Under Review

### Memory Commands (7 files, 4,158 lines)

| File | Lines | Assigned To |
|------|-------|-------------|
| analyze.md | 943 | A1 (W1), A3 (W3), A4 (W4), A5 (W5) |
| save.md | 683 | A1 (W1), A3 (W3), A4 (W4), A5 (W5) |
| manage.md | 977 | A1 (W1), A3 (W3), A4 (W4), A5 (W5) |
| continue.md | 344 | B3 (W3), A5 (W5) |
| learn.md | 519 | B3 (W3), A5 (W5) |
| shared.md | 362 | B3 (W3), A5 (W5) |
| README.txt | 330 | A3 (W3), A4 (W4) |

### Spec Kit Commands (9 files, 2,950 lines)

| File | Lines | Assigned To |
|------|-------|-------------|
| plan.md | 351 | B1 (W1), B3 (W3), A4 (W4), A5 (W5) |
| implement.md | 356 | B1 (W1), B3 (W3), A4 (W4), A5 (W5) |
| complete.md | 346 | B1 (W1), B3 (W3), A4 (W4), A5 (W5) |
| deep-research.md | 403 | B1 (W1), B3 (W3), A4 (W4), A5 (W5) |
| phase.md | 227 | B3 (W3), A5 (W5) |
| debug.md | 331 | B3 (W3), A5 (W5) |
| handover.md | 321 | B3 (W3), A5 (W5) |
| resume.md | 379 | B3 (W3), A5 (W5) |
| README.txt | 236 | A4 (W4) |

### Spec Kit YAML Assets (17 files, 9,084 lines)

| File | Lines | Assigned To |
|------|-------|-------------|
| spec_kit_deep-research_review_auto.yaml | 694 | A2 (W2), B4 (W4), B5 (W5) |
| spec_kit_deep-research_review_confirm.yaml | 825 | A2 (W2), B4 (W4), B5 (W5) |
| spec_kit_deep-research_auto.yaml | 480 | A2 (W2), B4 (W4), B5 (W5) |
| spec_kit_deep-research_confirm.yaml | 596 | A2 (W2), B4 (W4), B5 (W5) |
| spec_kit_plan_auto.yaml | 513 | B2 (W2), B4 (W4), B5 (W5) |
| spec_kit_plan_confirm.yaml | 566 | B2 (W2), B4 (W4), B5 (W5) |
| spec_kit_implement_auto.yaml | 589 | B2 (W2), B4 (W4), B5 (W5) |
| spec_kit_implement_confirm.yaml | 665 | B2 (W2), B4 (W4), B5 (W5) |
| spec_kit_complete_auto.yaml | 1030 | B2 (W2), B4 (W4), B5 (W5) |
| spec_kit_complete_confirm.yaml | 1096 | B2 (W2), B4 (W4), B5 (W5) |
| spec_kit_phase_auto.yaml | 324 | B5 (W5) |
| spec_kit_phase_confirm.yaml | 400 | B5 (W5) |
| spec_kit_debug_auto.yaml | 279 | B5 (W5) |
| spec_kit_debug_confirm.yaml | 334 | B5 (W5) |
| spec_kit_handover_full.yaml | 246 | B5 (W5) |
| spec_kit_resume_auto.yaml | 191 | B5 (W5) |
| spec_kit_resume_confirm.yaml | 256 | B5 (W5) |

## Reference Files (validation sources)

| File | Purpose |
|------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Canonical 33-tool inventory |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Tool parameter schemas |
| `.opencode/command/memory/README.txt` | Coverage matrix |
| `.opencode/command/spec_kit/README.txt` | Command overview |

## Known Context

- 012-command-alignment was truth-reconciled on 2026-03-21
- Live surface: 33 MCP tools, 6 memory commands, 8 spec_kit commands, 17 YAML assets
- Retrieval ownership: merged into /memory:analyze
- No standalone context.md command
- Runtime-doc drift in analyze.md and shared.md was resolved during 2026-03-21 pass
- Since 012 completion: phases 013-019 completed, deep-research review mode added (4 YAML assets)

## Review Boundaries

- READ-ONLY review: no file modifications by review agents
- Scope: only files listed in "Files Under Review" + reference files for validation
- Out of scope: MCP server implementation code, skill SKILL.md files, agent definitions

## Running Findings

Total: P0=0, P1=0, P2=0
Waves completed: 0/5
Iterations completed: 0/10
