# Deep Review Report: system-spec-kit Post-022 Root-Packet Normalization

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | true |
| **Active Findings** | P0=0, P1=21, P2=12 |
| **Iterations** | 7 (all complete; A7 finished late after 18min) |
| **Stop Reason** | max_iterations_reached |
| **Dimensions Covered** | 4/4 (correctness, security, traceability, maintainability) |
| **Review Target** | `.opencode/skill/system-spec-kit/` (SKILL.md, references/, assets/, templates/) |
| **Review Context** | 022-hybrid-rag-fusion root-packet normalization (2026-03-25) |

The system-spec-kit skill documentation has **21 P1 findings** across all 4 dimensions. The core theme: after 022 normalized its root packet to a coordination document with direct-child phase navigation, the skill docs still teach pre-normalization patterns — flat spec folder definitions, YAML-style phase back-references, numeric routing fallbacks, and Level 3+ guidance that omits coordination-root contracts. Additionally, 3 security findings address missing redaction controls, undocumented governance parameters, and understated filesystem boundaries. Late-arriving A7 findings (templates + assets) added 4 P1: phase-parent-section schema divergence, decision-record routing conflict, complexity matrix under-classification, and stale compliance contract.

---

## 2. Planning Trigger

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 21, "P2": 12 },
  "remediationWorkstreams": [
    "WS-1: SKILL.md core updates (Gate 3, spec definition, ADR-001)",
    "WS-2: Structure references normalization (4 files)",
    "WS-3: Template references Level 3+ coordination (4 files)",
    "WS-4: Validation references modernization (5 files)",
    "WS-5: Security hardening (3 files)",
    "WS-6: Workflow references phase-aware update (4 files)"
  ],
  "specSeed": "Remediate 17 P1 findings across 6 workstreams in system-spec-kit skill docs to align with 022 root-packet normalization patterns",
  "planSeed": "Phase the remediation: WS-1+WS-2 first (highest drift risk), then WS-3+WS-4, finally WS-5+WS-6"
}
```

**`/spec_kit:plan` is required** to plan and implement the 17 P1 remediations.

---

## 3. Active Finding Registry

### P1 Findings (17 active)

| ID | Dimension | File | Title | Adjudication |
|----|-----------|------|-------|-------------|
| 001-F1 | correctness | SKILL.md:336 | Gate 3 missing Option E (phase folder) | Confirmed; CLAUDE.md already has E |
| 001-F2 | correctness | SKILL.md:20 | Spec-folder definition too narrow for parent/child topology | Confirmed |
| 002-F2 | traceability | folder_routing.md:254 | Fallback routing uses numeric heuristics, not phase-aware | Confirmed |
| 002-F4 | traceability | phase_definitions.md:207 | PHASE_LINKS rules omit predecessor/successor checks | Confirmed |
| 003-F1 | correctness | template_style_guide.md:52 | Level metadata format excludes Level 3+ | Confirmed |
| 003-F3 | correctness | level_specifications.md:374 | Level 3+ spec requirements omit coordination-root contract | Confirmed |
| 003-F4 | correctness | template_guide.md:227 | Level 3+ adaptation lacks coordination-root branch | Confirmed |
| 004-F1 | traceability | validation_rules.md:888 | PHASE_LINKS documents obsolete `parent:` frontmatter | Confirmed |
| 004-F3 | traceability | path_scoped_rules.md:57 | Path-scoped rules only describe shallow `specs/*/` | Confirmed |
| 004-F4 | traceability | decision_format.md:30 | Decision format models gate logs, not ADR records | Confirmed |
| 004-F5 | traceability | five_checks.md:32 | Five Checks wrongly exempt doc-only coordination decisions | Confirmed |
| 005-F1 | security | save_workflow.md:320 | Full-dialogue snapshot guidance lacks redaction controls | Confirmed |
| 005-F2 | security | memory_system.md:161 | Governance scope params omitted from memory_search() ref | Confirmed |
| 005-F3 | security | environment_variables.md:27 | MEMORY_ALLOWED_PATHS default understates read boundary | Confirmed |
| 006-F1 | maintainability | quick_reference.md:231 | Update/create guidance no phase distinction | Confirmed |
| 006-F2 | maintainability | quick_reference.md:481 | Resume/memory assumes single active packet | Confirmed |
| 006-F3 | maintainability | execution_methods.md:118 | Execution methods teach legacy subfolder creation | Confirmed |
| 007-F2 | traceability | phase-parent-section.md:23 | PHASE DOCUMENTATION MAP schema diverges from 022 (Scope/Dependencies vs Focus) | Confirmed |
| 007-F4 | traceability | template_mapping.md:130 | Decision-record routing conflicts with canonical filename | Confirmed |
| 007-F5 | maintainability | complexity_decision_matrix.md:40 | Coordination-root under-classified by 3+ threshold (75 vs 80 gate) | Confirmed |
| 007-F6 | maintainability | template-compliance-contract.md:36 | Compliance contract stale vs live template section numbering | Confirmed |

### P2 Advisories (9 active)

| ID | Dimension | File | Title | Notes |
|----|-----------|------|-------|-------|
| 001-F3 | correctness | SKILL.md:22 | No ADR-001 coordination-document mention | Enhancement |
| 002-F1 | traceability | folder_structure.md:252 | Sub-folder examples flatten phased packets | Enhancement |
| 002-F3 | traceability | phase_definitions.md:124 | Child phase example teaches YAML format | Downgraded from P1; verify 022 child format |
| 002-F5 | traceability | sub_folder_versioning.md:205 | Nested-path guidance stops at parent/child | Enhancement |
| 003-F2 | correctness | level_selection_guide.md:93 | Level 3+ hard-tied to 80-100 complexity | Downgraded from P1; needs override note |
| 004-F2 | traceability | phase_checklists.md:122 | Phase completion checklist omits recursive verification | Enhancement |
| 005-F4 | security | environment_variables.md:339 | Shared-memory governance env docs stale | Enhancement |
| 005-F5 | security | trigger_config.md:195 | Root-level fallback save contradicts governance | Enhancement |
| 006-F4 | maintainability | worked_examples.md:153 | No coordination-root worked example | Enhancement |
| 007-F1 | traceability | phase-child-header.md:22 | Neighbor refs use FOLDER tokens not spec links | Enhancement |
| 007-F3 | maintainability | spec-core.md:25 | Core level placeholder omits 3+ | Enhancement |
| 007-F7 | maintainability | parallel_dispatch_config.md:56 | Dispatch policy and Task API example inconsistent | Enhancement |

---

## 4. Remediation Workstreams

### WS-1: SKILL.md Core Updates (3 findings: 2 P1 + 1 P2)
**Priority: HIGH** — SKILL.md is the entry point for all spec-kit users.
1. **001-F1** (P1): Add Option E (Phase folder) to Gate 3 options, aligning with CLAUDE.md
2. **001-F2** (P1): Broaden spec-folder definition to include parent/child/coordination-root topology
3. **001-F3** (P2): Add ADR-001 coordination-document and snapshot truth model subsection

### WS-2: Structure References Normalization (5 findings: 2 P1 + 3 P2)
**Priority: HIGH** — Structure refs are the second resource loaded after SKILL.md.
1. **002-F2** (P1): Replace numeric fallback routing with phase-aware guidance in folder_routing.md
2. **002-F4** (P1): Expand PHASE_LINKS to include predecessor/successor checks in phase_definitions.md
3. **002-F1** (P2): Add coordination-root phased packet example in folder_structure.md
4. **002-F3** (P2): Verify and update child phase spec example format in phase_definitions.md
5. **002-F5** (P2): Add three-level nested path example in sub_folder_versioning.md

### WS-3: Template References Level 3+ Coordination (4 findings: 3 P1 + 1 P2)
**Priority: MEDIUM** — Affects Level 3+ template composition.
1. **003-F1** (P1): Update metadata format to include 3+ in template_style_guide.md
2. **003-F3** (P1): Add coordination-root content contract to level_specifications.md
3. **003-F4** (P1): Add coordination-root adaptation branch in template_guide.md
4. **003-F2** (P2): Add coordination-root override rule in level_selection_guide.md

### WS-4: Validation References Modernization (5 findings: 4 P1 + 1 P2)
**Priority: MEDIUM** — Ensures validators enforce the right patterns.
1. **004-F1** (P1): Rewrite PHASE_LINKS examples in validation_rules.md to metadata-table format
2. **004-F3** (P1): Replace shallow `specs/*/` with recursive patterns in path_scoped_rules.md
3. **004-F4** (P1): Add ADR section to decision_format.md
4. **004-F5** (P1): Narrow Five Checks doc-only exemption in five_checks.md
5. **004-F2** (P2): Add recursive phase-link verification to phase_checklists.md

### WS-5: Security Hardening (5 findings: 3 P1 + 2 P2)
**Priority: HIGH** — Security findings should not wait.
1. **005-F1** (P1): Add redaction controls to save_workflow.md
2. **005-F2** (P1): Document governance scope params in memory_system.md
3. **005-F3** (P1): Update MEMORY_ALLOWED_PATHS defaults in environment_variables.md
4. **005-F4** (P2): Correct shared-memory governance env docs
5. **005-F5** (P2): Remove workspace-root fallback from trigger_config.md

### WS-7: Templates + Assets Normalization (7 findings: 4 P1 + 3 P2)
**Priority: MEDIUM** — Late-arriving A7 findings on template files and asset configs.
1. **007-F2** (P1): Align phase-parent-section.md PHASE DOCUMENTATION MAP to 022's 4-column Focus schema
2. **007-F4** (P1): Standardize template_mapping.md decision-record routing to canonical filename
3. **007-F5** (P1): Add coordination-root override rule to complexity_decision_matrix.md
4. **007-F6** (P1): Regenerate template-compliance-contract.md from template-structure.js
5. **007-F1** (P2): Change phase-child-header.md FOLDER tokens to SPEC links
6. **007-F3** (P2): Update spec-core.md level placeholder to include 3+
7. **007-F7** (P2): Reconcile parallel_dispatch_config.md policy/example inconsistency

### WS-6: Workflow References Phase-Aware Update (4 findings: 3 P1 + 1 P2)
**Priority: MEDIUM** — Guides operators through phased work correctly.
1. **006-F1** (P1): Add phase distinction to update/create guidance in quick_reference.md
2. **006-F2** (P1): Add phased resume/save flow in quick_reference.md
3. **006-F3** (P1): Add phase creation and recursive validation examples in execution_methods.md
4. **006-F4** (P2): Add coordination-root worked example in worked_examples.md

---

## 5. Spec Seed

Bullets for follow-on spec updates:
- SKILL.md Gate 3 must include Option E; spec-folder definition must support coordination-root + nested packet topology
- All structure references (4 files) need phase-aware routing, predecessor/successor in PHASE_LINKS, and coordination-root examples
- Level 3+ template references (4 files) need coordination-root content contract and override rules
- Validation references (5 files) need metadata-table format, recursive path patterns, ADR support, and narrowed exemptions
- Security references (3 files) need redaction controls, governance param documentation, and accurate filesystem boundaries
- Workflow references (4 files) need phase-aware resume/update flows and coordination-root worked examples
- Tool count (33) and feature catalog count (221) verified as accurate — no changes needed

---

## 6. Plan Seed

Starter tasks for `/spec_kit:plan`:
1. **Phase 1 (WS-1 + WS-2)**: SKILL.md Gate 3 + spec definition + structure refs normalization (7 findings, ~200 LOC)
2. **Phase 2 (WS-3 + WS-4)**: Template refs Level 3+ coordination + validation refs modernization (9 findings, ~300 LOC)
3. **Phase 3 (WS-5)**: Security hardening across memory/config refs (5 findings, ~100 LOC)
4. **Phase 4 (WS-6)**: Workflow refs phase-aware update + worked example (4 findings, ~150 LOC)
5. **Verify**: Run `validate.sh --recursive` on all modified files; verify no regression in existing Level 1-3 template composition

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | SKILL.md and reference files checked against 022 spec.md/decision-record.md; templates/assets iteration timed out |
| checklist_evidence | partial | 022 checklist.md reviewed in iteration 004; evidence-based findings cite file:line |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| skill_agent | not_applicable | No agent definitions reviewed in this review (focus was skill docs, not agent files) |

---

## 8. Deferred Items

| Item | Reason | Suggested Follow-up |
|------|--------|---------------------|
| Templates + assets deep review (A7 late) | A7 completed 18min after synthesis; findings incorporated | No further action needed |
| SKILL.md sections 4-7 count verification | Not covered in this review | Counts verified in 011-skill-alignment (2026-03-22); low drift risk |
| Template compliance contract review | A7 read but did not report | Include in WS-3 remediation scope |
| Debugging references (2 files) | Low drift risk from spec-only changes | Skip unless bugs reported |

---

## 9. Audit Appendix

### Convergence Summary

| Iteration | Agent | Model | Effort | Dimension | newFindingsRatio | P1 New | P2 New |
|-----------|-------|-------|--------|-----------|-----------------|--------|--------|
| 001 | A1 | gpt-5.3-codex | xhigh | Correctness | 0.647 | 2 | 1 |
| 002 | A2 | gpt-5.4 | high | Traceability | 0.607 | 3 | 2 |
| 003 | A3 | gpt-5.3-codex | xhigh | Correctness | 0.417 | 4 | 0 |
| 004 | A4 | gpt-5.4 | high | Traceability | 0.304 | 4 | 1 |
| 005 | A5 | gpt-5.3-codex | xhigh | Security | 0.198 | 3 | 2 |
| 006 | A6 | gpt-5.4 | high | Maintainability | 0.188 | 3 | 1 |
| 007 | A7 | gpt-5.3-codex | xhigh | Traceability+Maint | 0.184 | 4 | 3 |

**Trend**: 0.647 → 0.607 → 0.417 → 0.304 → 0.198 → 0.188 → 0.184 (declining, approaching convergence)

### Coverage Summary

| Dimension | Iterations | Pass Count | Final Status |
|-----------|-----------|------------|--------------|
| Correctness | 001, 003 | 2 | Reviewed (6 P1, 2 P2) |
| Security | 005 | 1 | Reviewed (3 P1, 2 P2) |
| Traceability | 002, 004 | 2 | Reviewed (5 P1, 4 P2) |
| Maintainability | 006 | 1 | Reviewed (3 P1, 1 P2) |

### Adversarial Self-Check

| Finding | Original | Final | Reason |
|---------|----------|-------|--------|
| 002-F3 | P1 | P2 | 022 child format needs on-disk verification; grep didn't find Parent Spec/Predecessor/Successor in child specs |
| 003-F2 | P1 | P2 | Complexity override is a documentation note, not a core structural defect |
| All other P1s | P1 | P1 | Confirmed with file:line evidence |

### Cross-Reference Appendix

**Core Protocols:**
- spec_code: SKILL.md vs 022/spec.md (iteration 001), structure refs vs 022/spec.md (iteration 002), validation refs vs 022/checklist.md (iteration 004)
- checklist_evidence: All P1 findings cite file:line evidence from reviewed docs

**Overlay Protocols:**
- skill_agent: Not applicable (agent files not in scope)

### Sources Reviewed

**Primary review targets (20 files examined):**
- SKILL.md (sections 1-3)
- references/structure/ (4 files)
- references/templates/ (4 files)
- references/validation/ (5 files)
- references/memory/ (5 files)
- references/config/ (1 file)
- references/workflows/ (4 files)

**022 reference docs (for comparison):**
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/decision-record.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/checklist.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/spec.md

**Agents used:** 7 dispatched via cli-copilot (4 codex 5.3 xhigh, 3 gpt 5.4 high; all completed)
**Total API time:** ~52 minutes across 7 agents (A7 took 18min alone)
**Total premium requests:** 7
