# Iteration 007 — Traceability+Maintainability, templates/ + assets/

**Agent**: A7 (codex 5.3, xhigh)
**Dimension**: Traceability + Maintainability
**Model**: gpt-5.3-codex
**Duration**: ~17m 56s (completed after synthesis; initially marked timeout)

## Findings

### Finding 007-F1
- **Severity**: P2
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/templates/addendum/phase/phase-child-header.md:22`
- **Title**: Neighbor references modeled as folder tokens, not spec links
- **Evidence**: Uses PREDECESSOR_FOLDER/SUCCESSOR_FOLDER placeholders; 022 uses explicit `../001-.../spec.md` links
- **Impact**: Generated phase docs lose deterministic click-through navigation
- **Fix**: Change to PREDECESSOR_SPEC/SUCCESSOR_SPEC emitting `../<phase>/spec.md`

### Finding 007-F2
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/templates/addendum/phase/phase-parent-section.md:23`
- **Title**: PHASE DOCUMENTATION MAP schema diverges from 022 coordination map
- **Evidence**: Template: Phase|Folder|Scope|Dependencies|Status. 022 root: Phase|Folder|Focus|Status
- **Impact**: Mixed schemas reduce comparability across packet families
- **Fix**: Align template to 4-column Focus map or document dual-schema conversion

### Finding 007-F3
- **Severity**: P2
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/templates/core/spec-core.md:25`
- **Title**: Core level placeholder omits 3+
- **Evidence**: Restricts level to [1/2/3]; 022 root is explicitly 3+
- **Impact**: Source-template drift reintroduces incorrect level markers
- **Fix**: Update placeholder to [1/2/3/3+]

### Finding 007-F4
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/assets/template_mapping.md:130`
- **Title**: Decision-record routing conflicts with canonical filename
- **Evidence**: Routes to decision-record-[topic].md; live 022 uses decision-record.md
- **Impact**: File-name drift breaks required-file checks and cross-doc references
- **Fix**: Standardize to decision-record.md; keep topic-specific ADRs as optional secondary

### Finding 007-F5
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:40`
- **Title**: Coordination-root work under-classified by 3+ threshold
- **Evidence**: Gates 3+ at 80-100; 022 root is 75/100 but treated as 3+
- **Impact**: Root coordination work down-leveled to Level 3, missing governance expectations
- **Fix**: Add override rule for coordination-root packets or lower threshold

### Finding 007-F6
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/references/template-compliance-contract.md:36`
- **Title**: Compliance contract stale vs live spec template section numbering
- **Evidence**: Contract says `## 10. OPEN QUESTIONS`; live templates use ## 7 (L1), ## 12 (L3), ## 16 (L3+)
- **Impact**: False compliance drift from wrong structure enforcement
- **Fix**: Regenerate contract from template-structure.js with per-level anchor/header mappings

### Finding 007-F7
- **Severity**: P2
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:56`
- **Title**: Dispatch policy and Task API example inconsistent
- **Evidence**: Says "No auto-dispatch" but YAML sets auto_dispatch_mode: true; uses subagent_type instead of agent_type
- **Impact**: Contradictory automation or invalid task payloads
- **Fix**: Reconcile policy/config text and update to agent_type

## Summary
- P0: 0, P1: 4, P2: 3
- newFindingsRatio: 0.184
