---
title: "Decision Record: Playbook Template Alignment"
description: "Decisions on template choice, prompt pattern, and alignment strategy for playbook snippets."
trigger_phrases:
  - "002-manual-testing-playbook"
  - "playbook decisions"
importance_tier: "important"
contextType: "decisions"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created decision record"
    next_safe_action: "Implement playbook rewrites"
    key_files: ["decision-record.md"]
---
# Decision Record: Playbook Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: Use sk-doc Snippet Template as Canonical Format

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User, Claude Opus 4.6 |

---

### Context

The 24 playbook scenarios were created in two batches: 01--routing-accuracy was aligned with the sk-doc template (5 sections, RCAF prompts), while 02/03/04 categories were created as minimal stubs (command + expected + pass/fail). The user explicitly requested all snippets match the sk-doc template and system-spec-kit examples.

### Constraints

- Must use the sk-doc snippet template exactly (not a custom format)
- Must include RCAF prompt pattern per user request
- Must preserve existing test logic (commands, expected behavior)

### Decision

**We chose**: Use the sk-doc `manual_testing_playbook_snippet_template.md` as the canonical format for all 24 snippets.

**How it works**: Each stub is expanded from ~20 lines to ~80 lines following the 5-section template. The existing test command and expected output are preserved in sections 2-3. New content is added: "Why This Matters", RCAF prompt, failure triage, source files, and metadata.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **sk-doc template** | Consistent with system-spec-kit, user requested | More verbose per file | 9/10 |
| Keep minimal stubs | Less work, compact | Inconsistent with 01--, missing triage/context | 3/10 |
| Custom hybrid format | Could be more concise | Non-standard, harder to validate | 4/10 |

**Why this one**: User explicitly requested sk-doc template alignment. The 01--routing-accuracy files already prove the format works.

### Consequences

**What improves**:
- All 24 scenarios follow identical structure
- Operators get failure triage guidance for every scenario
- Source file anchors link scenarios to implementation code

**What it costs**:
- 16 files grow from ~20 lines to ~80 lines. Mitigation: added content is useful operational context, not boilerplate.

---

## ADR-002: RCAF Prompt Pattern for All Playbook Scenarios

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-13 |
| **Deciders** | User, Claude Opus 4.6 |

---

### Context

The sk-doc template specifies a prompt format: `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.` This is the RCAF (Role, Context, Action, Format) pattern from sk-improve-prompt. The user explicitly requested prompts be "written with sk-prompt-improver."

### Decision

**We chose**: All 24 playbook scenarios use RCAF-pattern prompts with role = `{category} validation operator`.

**How it works**: Each scenario's prompt follows the pattern exactly. The role is derived from the category (e.g., "graph boost validation operator", "compiler validation operator"). The action references the specific skill_advisor.py command. The expected outcome matches the pass criteria.

### Consequences

**What improves**:
- Prompts are structured and consistent across all scenarios
- AI agents executing playbooks can parse prompts uniformly

**What it costs**:
- Slightly longer prompts than bare commands. Mitigation: the structure improves clarity.
