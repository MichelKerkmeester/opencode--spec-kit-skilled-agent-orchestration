You are running iteration 1 of 7 in a deep-review loop. Read this prompt fully, then perform the review and produce the required outputs.

# Iteration 1 — Correctness: Command Markdown + Setup Phase

## Focus
Audit `.opencode/command/spec_kit/skill-advisor.md` for correctness against:
- The sk-doc Mode-Based command template at `.opencode/skill/sk-doc/assets/agents/command_template.md` (Section 11)
- The convention used by sibling commands `.opencode/command/spec_kit/{resume,plan,deep-review}.md`
- Internal consistency: the SETUP PHASE prompt logic, GATE 3 EXEMPT block, USER INPUT block, KEY BEHAVIORS section, OUTPUT FORMATS, EXAMPLES, NEXT STEPS

## Required reads (in order)
1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-strategy.md`
2. `.opencode/command/spec_kit/skill-advisor.md` (the file under review)
3. `.opencode/command/spec_kit/resume.md` (parity reference)
4. `.opencode/command/spec_kit/deep-review.md` (parity reference for Mode-Based)
5. `.opencode/skill/sk-doc/assets/agents/command_template.md` (sk-doc standard)

## What to look for
- Frontmatter: description present, single-line; argument-hint format correct; allowed-tools enumerated
- Setup Phase: prompt logic captures all 4 questions with clear A/B/C/D options; flag parsing covers all four flags
- GATE 3 EXEMPT block: present, table format, accurate
- USER INPUT block: `$ARGUMENTS` placeholder present
- KEY BEHAVIORS: Autonomous + Interactive + Dry-Run subsections present and accurate
- WORKFLOW OVERVIEW table: 5 phases listed with consistent purpose/outputs
- Section numbering: sequential 1-13, no gaps
- Cross-references: links to YAML assets resolve to actual files

## Outputs (MANDATORY — produce all three)

### 1. Iteration markdown
Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-001.md`

Structure:
```
# Iteration 1 - Correctness: Command Markdown + Setup Phase

## Summary
[1-2 sentences]

## Findings

### P0 (Blockers)
- [Finding ID]: [description]
  - Evidence: file:line
  - Remediation: [concrete action]

### P1 (Required)
[same structure]

### P2 (Suggestions)
[same structure]

## Files Reviewed
- [list with line ranges]

## Convergence Signals
- newFindingsRatio: [number 0-1]
- dimensionsCovered: ["correctness"]
```

### 2. Delta JSON
Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deltas/iteration-001.json`

Schema:
```json
{
  "iteration": 1,
  "dimensions": ["correctness"],
  "filesReviewed": ["..."],
  "findings": {
    "p0": [{"id": "F-CORR-001", "title": "...", "evidence": "file.md:LL", "remediation": "..."}],
    "p1": [...],
    "p2": [...]
  },
  "newFindingsCount": N,
  "newFindingsRatio": 0.0-1.0,
  "timestamp": "2026-04-25T..."
}
```

### 3. State log append
Append one JSONL line to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-state.jsonl`:
```json
{"type":"iteration","iteration":1,"dimensions":["correctness"],"filesReviewed":[...],"findingsSummary":{"p0":N,"p1":N,"p2":N},"newFindingsRatio":0.0-1.0,"timestamp":"..."}
```

## Constraints
- Do NOT modify any reviewed file. Read-only review.
- Cite file:line for every finding.
- If you find zero issues, report zero — do not invent findings.
- Use exact paths in outputs (no `.../` shorthand).
- Stay within iteration 1's correctness focus; later iterations cover security, traceability, maintainability.
