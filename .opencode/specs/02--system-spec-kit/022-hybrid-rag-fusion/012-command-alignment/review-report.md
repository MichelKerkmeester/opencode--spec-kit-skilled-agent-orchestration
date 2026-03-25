# Review Report: Command Alignment Post Hybrid-RAG-Fusion

**Generated:** 2026-03-25
**Spec Folder:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/`
**Review Target:** `.opencode/command/spec_kit/` + `.opencode/command/memory/`
**Verdict:** **CONDITIONAL** (0 P0, 22 P1, 29 P2 — after dedup: 0 P0, 20 P1, 27 P2)

---

## 1. Executive Summary

This deep review audited 33 files (~16,200 lines) across the spec_kit command suite (8 commands + 17 YAML assets) and the memory command suite (6 commands + README) for alignment with the hybrid-rag-fusion program changes. The review used 10 cli-copilot agents (5 Codex 5.3 xhigh + 5 GPT 5.4 high) across 5 waves covering all 4 dimensions.

**Key Metrics:**
- Iterations: 10 | Waves: 5 | Stop reason: converged (newFindingsRatio 0.06)
- Raw findings: 62 | After dedup: ~59 unique
- Severity: P0=0, P1=20 (unique), P2=27 (unique)
- Dimensions: correctness (16), security (10), traceability (8), maintainability (13)

**Verdict Rationale:** CONDITIONAL because:
- No P0 blockers
- 20 P1 findings require remediation before release
- Several P1s affect workflow correctness (missing YAML assets, contradictory prerequisites, non-binding safety gates)
- Security P1s need hardening (shell injection paths, missing authorization, heredoc injection risk)

---

## 2. Planning Trigger

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 20, "P2": 27 },
  "remediationWorkstreams": [
    "WS-1: Tool ownership reconciliation (F-001, F-002)",
    "WS-2: Missing/broken asset references (F-007, F-039)",
    "WS-3: Workflow contract alignment (F-008, F-009/F-019, F-010/F-020, F-017, F-018, F-021)",
    "WS-4: Convergence algorithm fixes (F-011, F-013, F-014)",
    "WS-5: Security hardening (F-024, F-025, F-026, F-027, F-028)",
    "WS-6: Information disclosure mitigation (F-036, F-037)",
    "WS-7: Cross-runtime path normalization (F-034, F-038, F-040)",
    "WS-8: Structural consistency (F-050, F-051-053, F-058-062)"
  ],
  "specSeed": "012-command-alignment remediation",
  "planSeed": "Fix 20 P1 findings across 8 workstreams"
}
```

---

## 3. Active Finding Registry

### P1 Findings (20 unique, sorted by workstream)

#### WS-1: Tool Ownership Reconciliation
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-001 | `/memory:save` tool ownership conflicts with canonical coverage matrix | save.md:4 | correctness |
| F-002 | `/memory:manage` includes `memory_search`, breaking 15-tool ownership contract | manage.md:4 | correctness |

#### WS-2: Missing/Broken Asset References
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-007 | `:with-research` wired to nonexistent `spec_kit_research_*.yaml` | complete.md:98 | correctness |
| F-039 | Broken skill path to sk-code--review in deep-review YAMLs | review_auto.yaml:359 | traceability |

#### WS-3: Workflow Contract Alignment
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-008 | Plan→implement handoff contradicts `tasks.md` prerequisite | plan.md:160 | correctness |
| F-017 | Plan save-context never invokes `generate-context.js` | plan_auto.yaml:419 | correctness |
| F-018 | Command tool allowlists don't permit memory tools YAMLs require | plan.md:1-4, implement.md:1-4 | correctness |
| F-019 | Implement PRE/POSTFLIGHT 0-100 vs 0-10 score mismatch | implement.md:282 | correctness |
| F-020 | `:with-research` inserted before specification, not at Step 6 | complete.md:98 | correctness |
| F-021 | Checklist evidence required before implementation exists | implement_auto.yaml:352 | correctness |
| F-045 | Phase workflows use undefined `parent_spec_path` token | phase_auto.yaml:186,223 | traceability |
| F-046 | Resume advertises 4-source context priority but implements only 2 | resume_auto.yaml:70 | traceability |
| F-047 | Handover binds agent dispatch to wrong workflow shape/step | handover_full.yaml:178 | traceability |

#### WS-4: Convergence Algorithm Fixes
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-011 | Review hard-stop bypasses quality-gate check | review_auto.yaml:286 | correctness |
| F-013 | Research convergence omits thought-iteration filtering | deep-research_auto.yaml:227 | correctness |
| F-014 | Claim-adjudication failure is non-binding (no STOP block) | review_auto.yaml:401 | correctness |

#### WS-5: Security Hardening
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-024 | Unsafe filename-to-shell delete path in `/memory:learn remove` | learn.md:385 | security |
| F-025 | Conversation content can reach shell heredoc in `/memory:save` | save.md:179 | security |
| F-026 | Governance/provenance parameters not strictly validated | save.md:644 | security |
| F-027 | `/memory:shared status` allows principal probing without actor binding | shared.md:260 | security |
| F-028 | Constitutional memory mutation lacks authorization model | learn.md:77 | security |

#### WS-6: Information Disclosure Mitigation
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-036 | Debug delegation forwards raw diagnostics without redaction | debug.md:63 | security |
| F-037 | Handover auto-persists conversation context without secret-scrub | handover_full.yaml:37 | security |

#### WS-7: Cross-Runtime Path Normalization
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-034 | CONTINUE_SESSION.md location inconsistent (root vs spec folder) | resume.md:75 | correctness |
| F-040 | Deep-research YAMLs hardcode Claude agent paths | deep-research_auto.yaml:68 | traceability |

#### WS-8: Structural Consistency (P1 subset)
| ID | Title | File | Dimension |
|----|-------|------|-----------|
| F-050 | Spec_kit files don't share one structural skeleton | complete.md:29 | maintainability |
| F-054 | complete.md mixes execution modes with feature flags | complete.md:12 | maintainability |
| F-058 | Markdown-to-YAML ownership contract not uniformly defined | plan.md:11-18 | maintainability |

### P2 Findings (27 unique)

| ID | Title | Dimension |
|----|-------|-----------|
| F-003 | Trigger-edit workflow in save.md lacks concrete memory_update path | correctness |
| F-004/F-055 | save.md contradictory Write tool instructions | correctness/maintainability |
| F-005 | Stale validation claim for governance params in save.md | correctness |
| F-006 | analyze.md mislabels manual search option number | correctness |
| F-009/F-010 | (Subsumed by P1 F-019/F-020 with more evidence) | correctness |
| F-012 | dimensionCoverage emitted as string, not numeric | correctness |
| F-015 | Error JSONL uses unresolved placeholders | correctness |
| F-016 | reviewDimensions type may drift from array schema | correctness |
| F-022 | Complete auto/confirm variants emit different outputs | correctness |
| F-023 | Task completion markers inconsistent ([X] vs [x]) | correctness |
| F-029 | Checkpoint delete without second confirmation | security |
| F-030 | TOCTOU window in checkpoint restore | security |
| F-031 | continue.md trusts CONTINUE_SESSION.md without integrity checks | security |
| F-032 | Ingest accepts arbitrary paths with weak scope controls | security |
| F-033 | Internal DB path disclosure in save.md | security |
| F-035 | Phase-link validation only greps names, doesn't parse metadata | correctness |
| F-038 | Claude runtime agent path rooted at `/` not repository | traceability |
| F-041 | README.txt omits review YAML files from inventory | traceability |
| F-042 | README.txt omits deep-review mode suffixes | traceability |
| F-043 | manage.md health shows stale schema version (v13 vs v23) | traceability |
| F-044 | save.md filePath examples conflict with absolute-path contract | traceability |
| F-048 | Debug workflows split spec reference across placeholder families | maintainability |
| F-049 | phase_confirm premature "Done" exit before Step 7 | maintainability |
| F-051 | Setup phase numbering inconsistent (0 vs 1) | maintainability |
| F-052 | Consolidated prompt phrase not standardized | maintainability |
| F-053 | FIRST MESSAGE PROTOCOL only in subset of files | maintainability |
| F-056 | Error-handling sections consistent in memory, fragmented in spec_kit | maintainability |
| F-057 | Formatting conventions not uniform | maintainability |
| F-059 | YAML node naming uses three different schemas | maintainability |
| F-060 | Spec-folder concept named four different ways | maintainability |
| F-061 | Auto/confirm variant symmetry not uniform | maintainability |
| F-062 | handover_full missing recovery-section contract | maintainability |

---

## 4. Remediation Workstreams

| Workstream | P1 Count | P2 Count | Estimated LOC | Priority |
|------------|----------|----------|---------------|----------|
| WS-1: Tool ownership | 2 | 0 | ~50 | High |
| WS-2: Asset references | 2 | 0 | ~30 | Critical |
| WS-3: Contract alignment | 9 | 4 | ~200 | Critical |
| WS-4: Convergence fixes | 3 | 2 | ~80 | High |
| WS-5: Security hardening | 5 | 5 | ~150 | High |
| WS-6: Info disclosure | 2 | 0 | ~60 | High |
| WS-7: Path normalization | 2 | 2 | ~40 | Medium |
| WS-8: Structural consistency | 3 | 14 | ~200 | Low |

**Recommended order:** WS-2 → WS-3 → WS-5 → WS-4 → WS-1 → WS-6 → WS-7 → WS-8

---

## 5. Spec Seed

```
Title: Remediate 012 command alignment review findings
Trigger: Deep review verdict CONDITIONAL with 20 P1 findings
Scope: .opencode/command/spec_kit/ + .opencode/command/memory/
Predecessor: 012-command-alignment (this review)
```

---

## 6. Plan Seed

```
Phase 1: Fix critical asset references (WS-2) — create/rename missing YAML files
Phase 2: Align workflow contracts (WS-3) — resolve contradictions between .md and YAML
Phase 3: Harden security (WS-5 + WS-6) — add input validation, redaction gates
Phase 4: Fix convergence algorithm (WS-4) — quality gates, thought filtering
Phase 5: Reconcile tool ownership (WS-1) — update README coverage matrix
Phase 6: Normalize paths (WS-7) — standardize CONTINUE_SESSION.md location, runtime paths
Phase 7: Structural cleanup (WS-8) — template standardization (can be deferred)
```

---

## 7. Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code (commands → tool-schemas.ts) | VERIFIED | A4 confirmed 33-tool mapping holds |
| checklist_evidence | N/A | No checklist verification in scope |
| command_yaml (commands → YAML assets) | PARTIAL | F-007 broken; F-041/F-042 README gaps |
| skill_agent (YAML → skill/agent paths) | PARTIAL | F-039 broken; F-040 hardcoded |
| cross_runtime (agent paths across runtimes) | FAILED | F-040 Claude-only paths in YAMLs |

---

## 8. Deferred Items

| Item | Reason | When to Address |
|------|--------|-----------------|
| F-057 (formatting) | Cosmetic only | Next documentation pass |
| F-059-062 (YAML schema drift) | Low risk | Architecture review of YAML workflow engine |
| WS-8 structural consistency | Large scope, low urgency | Dedicated template standardization project |

---

## 9. Audit Appendix

### Convergence Summary

| Wave | Agents | Dimension | Findings | newFindingsRatio |
|------|--------|-----------|----------|-----------------|
| 1 | A1 (Codex), B1 (GPT) | correctness | 10 | 0.86, 1.00 |
| 2 | A2 (Codex), B2 (GPT) | correctness | 13 | 0.83, 0.71 |
| 3 | A3 (Codex), B3 (GPT) | security + correctness | 15 | 0.30, 0.13 |
| 4 | A4 (Codex), B4 (GPT) | traceability + maint. | 11 | 0.14, 0.10 |
| 5 | A5 (Codex), B5 (GPT) | maintainability | 13 | 0.16, 0.06 |

### Duplicate Findings (merged)
- F-009 ≈ F-019 (implement PREFLIGHT/POSTFLIGHT) → kept as single P1
- F-010 ≈ F-020 (research step placement) → kept as single P1
- F-004 ≈ F-055 (save.md Write tool) → kept as single P2

### Agent Resource Usage
- 5 Codex 5.3 (xhigh): ~5.4M tokens in, ~181K tokens out
- 5 GPT 5.4 (high): ~8.6M tokens in, ~91K tokens out
- Total: ~14M tokens processed across 10 agents
- API time: ~93 minutes cumulative

### Sources
- Canonical tool inventory: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (33 tools)
- Parameter schemas: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- Prior spec: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md`
- Convergence reference: `.opencode/skill/sk-deep-research/references/convergence.md`
- State format reference: `.opencode/skill/sk-deep-research/references/state_format.md`
