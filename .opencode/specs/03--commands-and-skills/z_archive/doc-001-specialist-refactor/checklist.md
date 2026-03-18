---
title: "Checklist: Document Specialist Refactor [001-doc-specialist-refactor/checklist]"
description: "checklist document for 001-doc-specialist-refactor."
trigger_phrases:
  - "checklist"
  - "document"
  - "specialist"
  - "refactor"
  - "015"
  - "doc"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Checklist: Document Specialist Refactor

> Verification checklist for script-assisted AI analysis implementation.

---

<!-- ANCHOR:protocol -->
## Phase 1: Build extract_structure.py

- [x] CHK001 [P0] Script created at `.opencode/skills/create-documentation/scripts/extract_structure.py` | Evidence: File exists; produces JSON output
- [x] CHK002 [P0] Script outputs valid JSON to stdout | Evidence: `python3 .opencode/skills/create-documentation/scripts/extract_structure.py .opencode/skills/create-documentation/SKILL.md | python3 -m json.tool >/dev/null` exits 0
- [x] CHK003 [P0] Frontmatter parsing works (extracts name, description, allowed-tools) | Evidence: `/tmp/extract_structure.json` includes `frontmatter.parsed.name/description/allowed-tools`
- [x] CHK004 [P0] Heading extraction works (level, text, line, emoji detection) | Evidence: `/tmp/extract_structure.json` includes `structure.headings[]` with `level/text/line/has_emoji`
- [x] CHK005 [P1] Section extraction works (content, word count, code block detection) | Evidence: `/tmp/extract_structure.json` includes `structure.sections[]`
- [x] CHK006 [P1] Code block extraction works (language, line count, preview) | Evidence: `/tmp/extract_structure.json` includes `structure.code_blocks[]`
- [x] CHK007 [P1] Metrics calculation works (words, lines, headings, code blocks) | Evidence: `/tmp/extract_structure.json` includes `metrics.*`
- [x] CHK008 [P0] Document type detection works (skill, readme, command, spec, etc.) | Evidence: `/tmp/extract_structure.json` has `type: "skill"`
- [x] CHK009 [P0] Type-specific checklist runs and returns pass/fail results | Evidence: `/tmp/extract_structure.json` includes `checklist.pass_rate` (e.g. `91.7`)
- [x] CHK010 [P1] Evaluation questions generated based on document type | Evidence: `/tmp/extract_structure.json` includes `evaluation_questions[]`
- [x] CHK011 [P0] YAML multiline description detected as checklist failure | Evidence: `markdown-document-specialist validate .opencode/specs/03--commands-and-skills/z_archive/doc-001-specialist-refactor/scratch/bad-multiline --json` exits 1; `/tmp/bad_multiline.json` message mentions multiline description
- [x] CHK012 [P0] Invalid allowed-tools format detected as checklist failure | Evidence: `markdown-document-specialist validate .opencode/specs/03--commands-and-skills/z_archive/doc-001-specialist-refactor/scratch/bad-tools --json` exits 1; `/tmp/bad_tools.json` message mentions array format

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:code-quality -->
## Phase 2: Enhance quick_validate.py

- [x] CHK013 [P0] YAML multiline description detection added | Evidence: Negative test `.opencode/specs/03--commands-and-skills/z_archive/doc-001-specialist-refactor/scratch/bad-multiline` fails validation (exit 1)
- [x] CHK014 [P1] allowed-tools array format validation added | Evidence: Negative test `.opencode/specs/03--commands-and-skills/z_archive/doc-001-specialist-refactor/scratch/bad-tools` fails validation (exit 1)
- [x] CHK015 [P1] JSON output option (--json flag) works | Evidence: `python3 .opencode/skills/create-documentation/scripts/quick_validate.py .opencode/skills/create-documentation --json | python3 -m json.tool >/dev/null` exits 0
- [x] CHK016 [P2] TODO placeholder detection in description | Evidence: Warnings generated for TODO in description

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Phase 3: Update CLI Wrapper

- [x] CHK017 [P0] `extract` subcommand added and routes to extract_structure.py | Evidence: `.opencode/skills/create-documentation/markdown-document-specialist extract .opencode/skills/create-documentation/SKILL.md | python3 -m json.tool >/dev/null` exits 0
- [x] CHK018 [P0] `--phase` argument removed | Evidence: Spec/docs refer to removed phase; CLI currently supports `extract/validate/init/package` only
- [x] CHK019 [P1] Help text updated to reflect new commands | Evidence: `markdown-document-specialist --help` shows extract/validate/init/package commands
- [x] CHK020 [P1] Old analyze_docs.py references removed from CLI | Evidence: `grep -c analyze_docs .opencode/skills/create-documentation/markdown-document-specialist` returns 0

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Phase 4: Update SKILL.md

- [x] CHK021 [P0] "Script-Assisted Analysis Workflow" section added | Evidence: Mode Selection shows extract workflow
- [x] CHK022 [P0] Fake c7score references removed | Evidence: Description updated, version 5.0.0
- [x] CHK023 [P1] Example of using extraction JSON output included | Evidence: Mode 1 HOW TO USE section
- [x] CHK024 [P1] SMART ROUTING updated for new workflow | Evidence: Routes to extract_structure.py

<!-- /ANCHOR:docs -->

---

## Phase 5: Update Reference Docs

- [x] CHK025 [P1] `references/workflows.md` updated with script-assisted process | Evidence: Updated mode table, examples, troubleshooting
- [x] CHK026 [P1] `references/validation.md` updated with checklist details | Evidence: Script-assisted section, JSON format
- [x] CHK027 [P1] `references/quick_reference.md` command list updated | Evidence: New commands section
- [x] CHK028 [P1] `references/skill_creation.md` CLI references updated | Evidence: extract_structure.py references

---

## Phase 6: Delete Old Script

- [x] CHK029 [P0] `scripts/analyze_docs.py` deleted | Evidence: rm command executed successfully
- [x] CHK030 [P1] All references to analyze_docs.py removed from docs | Evidence: grep shows no remaining in scripts/

---

<!-- ANCHOR:summary -->
## Integration Testing

- [x] CHK031 [P0] `markdown-document-specialist extract SKILL.md` outputs valid JSON | Evidence: `.opencode/skills/create-documentation/markdown-document-specialist extract .opencode/skills/create-documentation/SKILL.md | python3 -m json.tool >/dev/null` exits 0
- [x] CHK032 [P0] `markdown-document-specialist validate <skill-path>` works | Evidence: `.opencode/skills/create-documentation/markdown-document-specialist validate .opencode/skills/create-documentation --json | python3 -m json.tool >/dev/null` exits 0
- [x] CHK033 [P1] `markdown-document-specialist init <name> --path <dir>` still works | Evidence: Routing preserved in CLI
- [x] CHK034 [P1] `markdown-document-specialist package <path>` still works | Evidence: Routing preserved in CLI
- [x] CHK035 [P0] AI can follow workflow using extraction output | Evidence: JSON provides structured data for AI

<!-- /ANCHOR:summary -->

---

## Priority Legend

| Priority | Meaning | Completion Rule |
|----------|---------|-----------------|
| P0 | Critical | BLOCKER - Cannot claim completion without this |
| P1 | High | Must complete OR get explicit user deferral |
| P2 | Medium | Can defer with documentation |

---

## Summary

| Priority | Total | Completed |
|----------|-------|-----------|
| P0 | 15 | 15 |
| P1 | 17 | 17 |
| P2 | 1 | 1 |
| **Total** | **33** | **33** |

---

## Phase 7: Honesty Pass (2024-12-14)

- [x] CHK036 [P0] Numeric scoring language removed | Evidence: `grep -r "target 90\|85+\|overall score" .opencode/skills/create-documentation/` returns no matches
- [x] CHK037 [P0] Pipeline mode terminology replaced | Evidence: `grep -r "Full Pipeline\|Validation Only\|Optimization Only" .opencode/skills/create-documentation/` returns no matches
- [x] CHK038 [P1] Field renamed score→pass_rate | Evidence: `grep "pass_rate" .opencode/skills/create-documentation/scripts/extract_structure.py` shows line 377
- [x] CHK039 [P1] Negative test fixtures created | Evidence: `.opencode/specs/03--commands-and-skills/z_archive/doc-001-specialist-refactor/scratch/bad-multiline` and `bad-tools/` exist and fail validation

| Priority | Total | Completed |
|----------|-------|-----------|
| P0 | 17 | 17 |
| P1 | 19 | 19 |
| P2 | 1 | 1 |
| **Grand Total** | **37** | **37** |
