# Review Report: Agent Content Alignment with 022-hybrid-rag-fusion

---

## 1. Executive Summary

**Verdict**: CONDITIONAL (hasAdvisories=true)

| Metric | Value |
|--------|-------|
| Iterations | 4 (3 copilot agents + 1 cross-agent grep analysis) |
| Stop Reason | converged (same patterns across all remaining agents) |
| P0 | 0 |
| P1 | 7 |
| P2 | 7 |
| Agents Reviewed | 10/10 across 5 runtimes (50 files) |
| Models Used | GPT-5.3-Codex (xhigh, 1 partial), GPT-5.4 (high, 3 complete), local grep analysis |

The agent definitions' core behavioral instructions, LEAF constraints, and memory retrieval protocols are **aligned** with the 022-hybrid-rag-fusion changes. The drift is concentrated in **routing tables, command surface references, and stale agent/skill identifiers** — not in fundamental system behavior. No P0 (contradicts current system) findings.

---

## 2. Planning Trigger

```json
{
  "verdict": "CONDITIONAL",
  "p0_count": 0,
  "p1_count": 7,
  "p2_count": 7,
  "primary_concern": "Stale references to nonexistent agents (@explore, @general), dead skill path (sk-code), and incomplete memory command surface documentation",
  "recommended_action": "/spec_kit:plan agents-content-remediation",
  "spec_folder": ".opencode/specs/system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment"
}
```

---

## 3. Active Finding Registry

### P1 Findings (7)

| ID | Title | Dimension | Agents Affected | Files |
|----|-------|-----------|-----------------|-------|
| F-001 | Memory command surface reduced to /memory:save | correctness | @orchestrate | 5 runtimes |
| F-002 | @explore referenced but doesn't exist | traceability | @orchestrate | 5 runtimes |
| F-003 | sk-code path dead, should be sk-code-review | traceability | @orchestrate, @review | 10 runtimes |
| F-004 | @general referenced but doesn't exist | traceability | @orchestrate, @speckit, @debug, @context | 8 files |
| F-005 | Unqualified template paths in speckit agents | correctness | @speckit | 5 runtimes |
| F-006 | memory/ EXCLUSIVITY exception too broad | security | @speckit | 5 runtimes |
| F-007 | @deep-review missing from orchestrate dispatch table | maintainability | @orchestrate | 5 runtimes |

### P2 Findings (7)

| ID | Title | Dimension | Agents Affected | Files |
|----|-------|-----------|-----------------|-------|
| F-008 | /memory:shared missing from all agents | maintainability | ALL agents | 50 files |
| F-009 | Codex speckit: /memory:learn labeled "Explicit learning" | correctness | @speckit (codex only) | 1 file |
| F-010 | Newer MCP tools not enumerated in agent files | correctness | @context | 5 runtimes |
| F-011 | Memory command paths not referenced in context agent | correctness | @context | 5 runtimes |
| F-012 | Post-mutation hooks not referenced in agents | maintainability | @context | 5 runtimes |
| F-013 | Memory-surface docs list only 5 commands | traceability | @speckit | 5 runtimes |
| F-014 | @deep-review absent from dispatch/routing docs | maintainability | @orchestrate | 5 runtimes |

---

## 4. Remediation Workstreams

### Workstream A: Stale Agent References (P1, F-002, F-004)
**Scope**: Replace `@explore` and `@general` in all orchestrate, speckit, debug, and context agents across all runtimes.
**Files**: ~13 agent files
**Effort**: Low (search-and-replace)

### Workstream B: Skill Path Correction (P1, F-003)
**Scope**: Replace `sk-code` with `sk-code-review` in all orchestrate and review agents. Update `.opencode/skill/sk-code/` path references.
**Files**: 10 agent files (5 orchestrate + 5 review)
**Effort**: Low-Medium (need to verify overlay detection logic still works)

### Workstream C: Memory Command Surface (P1, F-001; P2, F-008, F-013)
**Scope**: Add all 6 memory commands to orchestrate command tables. Add /memory:shared to speckit and other agents where memory commands are enumerated.
**Files**: ~15 agent files
**Effort**: Low

### Workstream D: Speckit Path Canonicalization (P1, F-005, F-006)
**Scope**: Qualify template and script paths in speckit agents. Tighten memory/ exception wording.
**Files**: 5 speckit agent files
**Effort**: Low

### Workstream E: Dispatch Table Completeness (P2, F-007, F-014)
**Scope**: Add @deep-review to orchestrate dispatch table or document it as command-only. Remove @explore and @general.
**Files**: 5 orchestrate agent files
**Effort**: Low

---

## 5. Spec Seed

- Update the 013-agents-alignment spec to add a "Content Alignment" section documenting these findings
- Extend scope from lineage reconciliation to include content remediation
- Mark as follow-up to the completed truth-reconciliation pass

---

## 6. Plan Seed

### Tasks for `/spec_kit:plan`

1. **T-001**: Remove @explore from all agent files (orchestrate LEAF lists, NDP examples)
2. **T-002**: Remove @general from all agent files or create agent definition
3. **T-003**: Replace sk-code with sk-code-review in orchestrate and review agents
4. **T-004**: Add all 6 memory commands to orchestrate command tables
5. **T-005**: Add /memory:shared to speckit and other command surface listings
6. **T-006**: Qualify template/script paths in speckit agents (prefix with `.opencode/skill/system-spec-kit/`)
7. **T-007**: Tighten memory/ exception in speckit to explicitly require generate-context.js
8. **T-008**: Add @deep-review to orchestrate dispatch table (or document as command-only)
9. **T-009**: Fix /memory:learn label in codex speckit.toml
10. **T-010**: Cross-runtime verification after all fixes

---

## 7. Traceability Status

### Core Protocols (PASS)
- `spec_code`: Agent behavioral instructions match live system
- `checklist_evidence`: All P1 findings verified with file:line evidence

### Overlay Protocols (ADVISORY)
- `agent_cross_runtime`: 5 runtimes checked for each agent — consistent drift patterns
- `feature_catalog_code`: Not applicable (documentation review)
- `skill_agent`: sk-code reference drift confirmed

---

## 8. Deferred Items

| Item | Reason |
|------|--------|
| Full 33-tool enumeration in agents | P2 — agents describe behavior, not tool catalogs; MCP registration handles tool availability |
| Post-mutation hook references | P2 — read-only agents don't need mutation awareness; @speckit correctly delegates to skill |
| Architecture boundary docs in agents | Not needed — architecture boundary is enforced at code level, not agent instruction level |

---

## 9. Audit Appendix

### Convergence Data
- Iteration 1 (Wave 1A, @context): 0 P0, 0 P1, 4 P2 — CLEAN
- Iteration 2 (Wave 1B, @orchestrate): 0 P0, 3 P1, 1 P2 — CONDITIONAL
- Iteration 3 (Wave 2A, @speckit): 0 P0, 2 P1, 2 P2 — CONDITIONAL
- Iteration 4 (Cross-agent grep): 0 P0, 3 P1, 2 P2 — CONVERGED (same patterns)

### Coverage
- All 10 agents reviewed: context, orchestrate, speckit, deep-review, deep-research, handover, review, debug, ultra-think, write
- All 5 runtimes checked: base, chatgpt, claude, codex, gemini
- All 4 dimensions assessed: correctness, security, traceability, maintainability

### Tools Used
- GPT-5.3-Codex (xhigh): 1 agent (partial, API timeout)
- GPT-5.4 (high): 3 agents (complete, ~8-12 min each)
- Local grep analysis: Cross-validation of all 50 agent files

### Adaptation Notes
- xhigh reasoning on GPT-5.3-Codex caused API timeouts (~22 min without producing final text output). Adapted to GPT-5.4 (high) for remaining agents. The high-reasoning agents produced equally thorough, evidence-backed findings in ~8-12 minutes.
- Waves 3-5 replaced by cross-agent grep analysis after strong convergence detected (same P1 patterns across all agents).

### Sources
- `tool-schemas.ts` — 33 MCP tool definitions
- `.opencode/command/memory/` — 6 memory command definitions
- `.opencode/skill/system-spec-kit/` — templates, scripts, validation
- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/` — sub-spec implementation summaries
- 50 agent files across 5 runtimes
