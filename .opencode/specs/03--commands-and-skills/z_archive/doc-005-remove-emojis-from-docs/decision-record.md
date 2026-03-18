---
title: "Decision Record: Remove Emojis from All Documentation [005-remove-emojis-from-docs/decision-record]"
description: "H2 heading emojis were originally enforced as blocking validation errors across all template-based document types (SKILL, README, asset, reference). After extended use, the emoj..."
trigger_phrases:
  - "decision"
  - "record"
  - "remove"
  - "emojis"
  - "from"
  - "decision record"
  - "019"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Remove Emojis from All Documentation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Remove Emoji Enforcement Rather Than Keep It

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User |

---

<!-- ANCHOR:adr-001-context -->
### Context

H2 heading emojis were originally enforced as blocking validation errors across all template-based document types (SKILL, README, asset, reference). After extended use, the emojis were found to consume context window tokens without adding semantic value to section headings. The user decided that documentation should be clean and emoji-free, with the exception of AGENTS.md and the repo root README.md.

### Constraints
- 287 files across the codebase already contain emoji H2 headings
- Validation engine must be updated before files can be modified (otherwise they would fail validation)
- Semantic H3 emojis in RULES sections must be preserved (they serve a functional purpose)
- AGENTS.md and repo root README.md are exempt from changes
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Remove emoji enforcement from the validation engine and strip emojis from all existing H2 headings across the codebase.

**Details**: The implementation follows a two-stage approach: (1) Update the sk-doc skill to stop enforcing emojis (Phase 0, completed), then (2) deploy an AI swarm to strip emojis from all 287 remaining files organized into 12 parallel workstreams by component group. The `section_emojis` lookup data is preserved in `template_rules.json` as reference data (not enforcement).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove enforcement + strip emojis** | Clean, consistent, saves tokens | Large batch operation needed | 9/10 |
| Remove enforcement only (keep existing emojis) | Less work, backward compatible | Inconsistent: new docs without, old with | 5/10 |
| Keep emoji enforcement | No changes needed | Wastes tokens, visual noise, user dislikes | 2/10 |
| Make emojis optional (no enforcement, no stripping) | Minimal effort | Permanent inconsistency across codebase | 4/10 |

**Why Chosen**: Full removal achieves the cleanest result. The AI swarm approach makes the batch operation feasible within a single session. Partial approaches create permanent inconsistency that compounds over time.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Consistent documentation format across entire codebase
- Reduced token usage in AI context windows
- Cleaner visual appearance for document headings
- Simpler validation rules (fewer checks needed)

**Negative**:
- Large batch operation touching 287 files - Mitigation: AI swarm parallel execution
- Historical spec files may have emoji references in prose - Mitigation: P2 priority, can defer

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Semantic H3 emojis accidentally removed | High | Regex targets `^## ` lines only, not `### ` |
| Body-text emojis removed | Medium | Line-level targeting, not file-level |
| TOC anchors break | Medium | Anchors already exclude emojis in slug |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly requested emoji removal from all docs |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives explored, full removal scores highest |
| 3 | **Sufficient?** | PASS | Regex substitution is the simplest approach for text removal |
| 4 | **Fits Goal?** | PASS | Directly addresses documentation consistency goal |
| 5 | **Open Horizons?** | PASS | No future feature depends on emoji presence in H2s |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `template_rules.json` - Emoji enforcement flags
- `validate_document.py` - Validation checks
- `extract_structure.py` - Structure analysis and DQI scoring
- 287 markdown files across `.opencode/`

**Rollback**: `git checkout -- .opencode/` to restore all files from last commit
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: AI Swarm Parallel Execution Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User, AI |

---

<!-- ANCHOR:adr-002-context -->
### Context

287 files need emoji stripping. Processing them sequentially would take too long. The files are naturally grouped by component (skill folders, agent folders, command folders) with no cross-group dependencies, making parallel execution feasible.

### Constraints
- Each file must be read before editing (no blind writes)
- Files within the same directory may be edited by only one agent
- Verification must wait until all editing phases complete
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Organize files into 12 phases by component group, run phases 1-11 in parallel via independent AI agents, then run phase 12 (verification) sequentially.

**Details**: Each agent receives a standardized prompt with the file list for its phase, the transformation rules, and the verification command. Agents are independent and do not communicate during execution. A single sync point (SYNC-001) gates verification.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **12 parallel agents by component** | Fast, natural grouping, no conflicts | Requires coordination at verification | 9/10 |
| Single sequential agent | Simple, no coordination | Very slow (~45 min) | 4/10 |
| File-level parallelism (287 agents) | Maximum speed | Agent overhead, hard to manage | 3/10 |
| Batch script (no AI) | Fastest possible | Cannot handle edge cases, code blocks | 6/10 |

**Why Chosen**: Component-based grouping provides natural file ownership boundaries with zero overlap. 11 parallel agents process the bulk of work while a 12th verifies.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- ~15 minutes wall-clock time instead of ~45 minutes sequential
- Natural ownership boundaries (no file conflicts)
- Each agent can verify its own phase before reporting

**Negative**:
- Higher total token usage across agents - Mitigation: Acceptable trade-off for speed
- Coordination overhead at sync point - Mitigation: Simple "all complete" gate

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent fails mid-phase | Low | Other phases unaffected, retry failed phase |
| File list incomplete | Medium | Phase 12 catches any missed files |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 287 files too many for sequential processing |
| 2 | **Beyond Local Maxima?** | PASS | Four strategies compared |
| 3 | **Sufficient?** | PASS | Component grouping is simplest parallel approach |
| 4 | **Fits Goal?** | PASS | Enables completion within a single session |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future batch operations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- AI agent orchestration (Task tool with parallel subagents)
- File system (read/write operations across `.opencode/`)

**Rollback**: Individual phase can be reverted via `git checkout -- .opencode/skill/[component]/`
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
