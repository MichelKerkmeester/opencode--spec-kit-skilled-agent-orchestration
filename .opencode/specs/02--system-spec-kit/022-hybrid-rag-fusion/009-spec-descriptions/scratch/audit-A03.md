# Audit A-03: 003-speckit-quality-and-standards
## Summary
| Metric | Result |
|--------|--------|
| Audited completion | 87.0% (47 `[x]` / 7 `[ ]`, counting all literal checkboxes in `checklist.md`) |
| Template compliance | WARN |
| Evidence quality | WARN |

## Detailed Findings
### 1. Template compliance
- **PASS**: All required audit-target markdown files are present, and every audited artifact includes top-level YAML frontmatter plus a `SPECKIT_TEMPLATE_SOURCE` marker: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `decision-record.md`.[Source: 003-speckit-quality-and-standards/spec.md:1-10; 003-speckit-quality-and-standards/plan.md:1-10; 003-speckit-quality-and-standards/tasks.md:1-10; 003-speckit-quality-and-standards/checklist.md:1-10; 003-speckit-quality-and-standards/implementation-summary.md:1-10; 003-speckit-quality-and-standards/decision-record.md:1-10]
- **PASS**: Anchor pairs are balanced across all six markdown files; no unmatched `ANCHOR` / `/ANCHOR` tags were found during audit parsing.[Source: audit parser results for `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`]
- **WARN**: The folder is documented as a set of **consolidated** artifacts rather than a single canonical template instance. Multiple files contain mixed embedded source documents with conflicting level declarations, e.g. `spec.md` carries both Level 2 and Level 3 declarations, and the same pattern appears in `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.[Source: 003-speckit-quality-and-standards/spec.md:11-17,33,204-221; 003-speckit-quality-and-standards/plan.md:11-17,33,196-212; 003-speckit-quality-and-standards/tasks.md:11-17,33,109-126; 003-speckit-quality-and-standards/checklist.md:11-17,33,134-151; 003-speckit-quality-and-standards/implementation-summary.md:11-17,33,114-131]
- **WARN**: Some top-level `SPECKIT_TEMPLATE_SOURCE` markers under-report the effective content level. Example: top-level `plan.md` declares `plan-core + level2-verify | v2.2`, but the embedded second source is explicitly Level 3 with `plan-core + level2-verify + level3-arch | v2.2`.[Source: 003-speckit-quality-and-standards/plan.md:1-10,199-213]
- **Standard reference**: system-spec-kit validation expects frontmatter validity plus `SPECKIT_TEMPLATE_SOURCE` markers, especially for `spec.md` and `plan.md`.[Source: .agents/skills/system-spec-kit/references/validation/validation_rules.md:603-649]

### 2. Checklist accuracy
- **Literal checkbox count**: `checklist.md` contains **54** literal checkboxes total: **47 checked** and **7 unchecked**, which yields **87.0% completion**.
- **Bullet checklist items only**: excluding table sign-off boxes, the document contains **51** checklist bullets with **47 checked** and **4 unchecked** (**92.2%**). This higher figure overstates true completion because it omits the sign-off approvals.
- **Unchecked items**:
  - `CHK-052 [P2] Memory context save executed.`[Source: 003-speckit-quality-and-standards/checklist.md:117]
  - `CHK-313 [P2] Optional benchmark table is captured for future trend analysis.`[Source: 003-speckit-quality-and-standards/checklist.md:238]
  - `CHK-333 [P2] Optional OWASP-style review notes are captured where relevant.`[Source: 003-speckit-quality-and-standards/checklist.md:258]
  - `CHK-343 [P2] Non-phase docs follow-up list is recorded for future work.`[Source: 003-speckit-quality-and-standards/checklist.md:268]
  - Three unapproved sign-off rows remain unchecked.[Source: 003-speckit-quality-and-standards/checklist.md:278-280]
- **WARN**: The document-level verification summaries report per-source subsection totals, but they do not provide a single folder-wide completion total and do not account for the three unchecked sign-off boxes in the L3 section.[Source: 003-speckit-quality-and-standards/checklist.md:123-132,285-295,278-280]

### 3. Evidence quality
- **WARN**: The first merged checklist block uses the same generic evidence phrase (`[Evidence: verified in scoped spec artifacts and validation output.]`) for every P0/P1 claim. This is not specific evidence and does not meet the v2.2 expectation that non-P2 checklist items cite concrete file, test, commit, screenshot, or equivalent artifacts.[Source: 003-speckit-quality-and-standards/checklist.md:63-116; .agents/skills/system-spec-kit/references/validation/validation_rules.md:393-466]
- **PASS/WARN mixed**: The second merged checklist block is substantially better: most P0/P1 items cite concrete commands, artifacts, or files (for example `npx vitest`, `validate.sh`, `implementation-summary.md`, and `decision-record.md`). However, a few P1 entries still rely on narrative evidence rather than precise file+line or command output.[Source: 003-speckit-quality-and-standards/checklist.md:185-267]
- **Standard reference**: validation rules explicitly state that non-P2 checklist items must include evidence citations.[Source: .agents/skills/system-spec-kit/references/validation/validation_rules.md:396-422]

### 4. Level determination
- **PASS**: This folder should be treated as **Level 3** overall. The standards state that Level 3 requires Level 2 plus `decision-record.md`, and the validation rules map presence of `decision-record.md` to Level 3.[Source: .agents/skills/system-spec-kit/references/templates/template_guide.md:1154-1157; .agents/skills/system-spec-kit/references/validation/validation_rules.md:74,272]
- **PASS**: `decision-record.md` is present and populated with ADR content, so the folder does **not** need an additional decision record to satisfy the Level 3 requirement.[Source: 003-speckit-quality-and-standards/decision-record.md:1-40]
- **WARN**: Because the folder preserves both a historical Level 2 stream and a Level 3 stream inside the same canonical files, its metadata is internally inconsistent even though Level 3 is the correct overall classification.[Source: 003-speckit-quality-and-standards/spec.md:33,221; 003-speckit-quality-and-standards/plan.md:33,212; 003-speckit-quality-and-standards/tasks.md:33,125; 003-speckit-quality-and-standards/checklist.md:33,150; 003-speckit-quality-and-standards/implementation-summary.md:33,130]

### 5. Required files
- **PASS**: All Level 3-required artifacts are present: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `decision-record.md`.[Source: folder listing for `003-speckit-quality-and-standards`]
- **PASS**: No missing required file was identified for a Level 3 folder.

### 6. Template source verification
- **PASS**: The standards docs cite concrete template paths such as `.opencode/skill/system-spec-kit/templates/level_1/spec.md`, `.opencode/skill/system-spec-kit/templates/level_2/checklist.md`, `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md`, `.opencode/skill/system-spec-kit/templates/level_3+/decision-record.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/handover.md`.[Source: .agents/skills/system-spec-kit/references/templates/level_specifications.md:145,234,345,354,478,736; .agents/skills/system-spec-kit/references/templates/template_guide.md:84,135,172,177,219,538,1161-1175]
- **PASS**: Those cited template files exist under `.opencode/skill/system-spec-kit/templates/` in the repository tree.[Source: repository template inventory under `.opencode/skill/system-spec-kit/templates/`]
- **WARN**: `plan.md` cites `.opencode/skill/system-spec-kit/templates/level_2/*.md` in its dependency table, which is a directory glob rather than a concrete template path. It is directionally correct, but weaker as an audit trail than a specific file reference.[Source: 003-speckit-quality-and-standards/plan.md:132]

## Issues
- **ISS-A03-001**: Consolidated root artifacts mix Level 2 and Level 3 source documents, so folder-level template metadata is not canonical and top-level template declarations are not always aligned with the full file content.
- **ISS-A03-002**: `checklist.md` real completion is **87.0%**, not the more favorable bullet-only rate of 92.2%, because three unchecked sign-off approvals and four unchecked P2 items remain open.
- **ISS-A03-003**: The first merged checklist section fails the v2.2 specific-evidence standard for P0/P1 items by reusing a generic evidence phrase instead of concrete proof.
- **ISS-A03-004**: `plan.md` uses a wildcard template dependency reference (`templates/level_2/*.md`) instead of a concrete template file path, reducing exact template-traceability.

## Recommendations
1. Normalize the folder to a single canonical Level 3 metadata layer at the top of each root artifact, and move historical merged content to `scratch/` or explicitly archived source files if preservation is still needed.
2. Recompute and record one folder-wide checklist completion summary using all literal checkboxes, including sign-off rows.
3. Replace generic P0/P1 evidence in the first merged checklist section with specific command outputs, file references, or artifact paths.
4. Replace wildcard template references in dependency tables with concrete template files where possible (or list the exact expected template set).
