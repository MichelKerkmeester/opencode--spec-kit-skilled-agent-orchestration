# Audit A-04: 004-constitutional-learn-refactor
## Summary
| Metric | Result |
|--------|--------|
| Audited completion | 100% (14/14 checked, 0 unchecked) |
| Template compliance | FAIL |
| Evidence quality | WARN |

## Detailed Findings

### 1. Baseline status
- The folder contains the Level 2 file set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) and both `scratch/` and `memory/` directories are present. No `decision-record.md` is present in the folder listing. [Source: folder listing for `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-constitutional-learn-refactor`]
- During this audit, `./.opencode/skill/system-spec-kit/scripts/spec/validate.sh` and `calculate-completeness.sh` both reported a clean pass, with calculated completeness at 100%. This means the folder satisfies the current automated validator, but the stricter audit checks below still find standards drift in template provenance and level selection.

### 2. Template compliance
- All five audited documents include YAML frontmatter, so frontmatter presence is acceptable. `spec.md` also includes both frontmatter and comment-level template markers (`spec.md:1-16`), and `implementation-summary.md` does the same (`implementation-summary.md:1-16`).
- `plan.md`, `tasks.md`, and `checklist.md` drift from the Level 2 composed templates in two ways:
  1. Their template-source headers do not match real composed template locations.
  2. Their anchor structure is flattened relative to the shipped Level 2 templates.
- `plan.md` cites `<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/plan.md -->` (`plan.md:4`), but the actual composed template path is `.opencode/skill/system-spec-kit/templates/level_2/plan.md`, as required by v2.2 (`references/templates/level_specifications.md:229-234`; `templates/level_2/plan.md:1-16`).
- `tasks.md` cites `<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/tasks.md -->` (`tasks.md:4`), but the actual composed template is `.opencode/skill/system-spec-kit/templates/level_2/tasks.md` (`references/templates/level_specifications.md:229-234`; `templates/level_2/tasks.md:1-16`).
- `checklist.md` cites `<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/checklist.md -->` (`checklist.md:4`), but the actual composed template is `.opencode/skill/system-spec-kit/templates/level_2/checklist.md` (`references/templates/level_specifications.md:229-234`; `templates/level_2/checklist.md:1-16`).
- `spec.md` and `implementation-summary.md` use component identifiers rather than usable template paths (`spec.md:9,16`; `implementation-summary.md:10,15`). Those identifiers are semantically traceable to existing sources (`templates/core/spec-core.md`, `templates/addendum/level2-verify/spec-level2.md`, `templates/core/impl-summary-core.md`), but they still do not satisfy a literal “cited path exists at cited path” audit requirement.
- Section-anchor coverage is materially thinner than the Level 2 templates expect. The shipped templates use section anchors throughout (`templates/level_2/plan.md:20-118`; `templates/level_2/tasks.md:19-80`; `templates/level_2/checklist.md:19-103`), while the audited files collapse to one wrapper anchor in `plan.md` (`plan.md:5,86`), one wrapper anchor in `tasks.md` (`tasks.md:5,36`), and one wrapper anchor in `checklist.md` (`checklist.md:6,26`). This is syntactically valid, but it is not template-faithful.
- `plan.md` and `tasks.md` also omit the `<!-- SPECKIT_LEVEL: 2 -->` marker that exists in the Level 2 templates (`templates/level_2/plan.md:15-16`; `templates/level_2/tasks.md:14-15`).

### 3. Checklist accuracy
- The checklist contains 14 completed items and 0 open items (`checklist.md:10-25`). Numerically, the recorded completion percentage is accurate: **14 / 14 = 100%**.
- The file does not retain the richer category/summary structure used by the Level 2 checklist template (`templates/level_2/checklist.md:19-103`), but the raw completion math is still correct.

### 4. Evidence quality
- Every P0/P1 checklist item includes an evidence annotation, and that is why the validator passes. However, v2.2 guidance expects specific, durable evidence such as `[File: ...]`, `[Test: ...]`, `[Commit: ...]`, or `[Screenshot: ...]` for non-P2 items (`references/validation/validation_rules.md:406-466`).
- Only a minority of entries meet that bar cleanly. Most P0 items cite broad narrative evidence such as “grep confirms”, “Sections 7-10”, or “Section 11 Tool Signatures” rather than durable command output or file-line citations (`checklist.md:10-18`).
- The P1 items are somewhat stronger because they cite line ranges in external files (`checklist.md:21-25`), and spot checks confirm those updates exist in `README.txt` (`README.txt:50,70-74,116-122`), `CLAUDE.md` (`CLAUDE.md:53`), and the skill README (`.opencode/skill/system-spec-kit/README.md:544`).
- The implementation summary also contains verification claims that are not backed by embedded command evidence, especially the test-suite claim `PASS — all 5 learning test files pass` (`implementation-summary.md:95`). That may be true, but the spec folder itself does not preserve the execution evidence.

### 5. Level determination
- The folder declares Level 2 in `spec.md` (`spec.md:33`), checklist (`checklist.md:5`), and implementation summary (`implementation-summary.md:26`).
- Under v2.2, a spec should escalate to Level 3 when implementation scope grows past ~500 LOC or when major decisions need explicit documentation (`references/templates/level_specifications.md:220-225,289-307`; `references/templates/template_guide.md:165-205`).
- This spec’s own implementation summary states that the primary rewritten file grew to **550 lines** and documents multiple significant decisions such as complete rewrite vs incremental edit, dashboard-first routing, and destructive confirmation for remove (`implementation-summary.md:63-77`).
- Based on the spec’s own evidence, this work now fits **Level 3** better than Level 2. That means `decision-record.md` should likely exist, but it is missing from the folder. This is the most important standards gap in the audit.

### 6. Required files
- **If treated as declared Level 2:** the required file set is present.
- **If corrected to Level 3:** the folder is incomplete because `decision-record.md` is required (`references/templates/level_specifications.md:300-307`; `references/templates/template_guide.md:167-204`).

### 7. Template source verification
- **Verified as existing source components:**
  - `spec-core` → `.opencode/skill/system-spec-kit/templates/core/spec-core.md`
  - `level2-verify spec addendum` → `.opencode/skill/system-spec-kit/templates/addendum/level2-verify/spec-level2.md`
  - `impl-summary-core` → `.opencode/skill/system-spec-kit/templates/core/impl-summary-core.md`
- **Failed path verification:**
  - `.opencode/skill/system-spec-kit/templates/plan.md` (cited by `plan.md`) does not exist.
  - `.opencode/skill/system-spec-kit/templates/tasks.md` (cited by `tasks.md`) does not exist.
  - `.opencode/skill/system-spec-kit/templates/checklist.md` (cited by `checklist.md`) does not exist.
- Result: provenance is only partially verifiable and should be corrected to the real composed template paths under `templates/level_2/`.

## Issues [ISS-A04-NNN]

### ISS-A04-001 — Invalid template source paths in plan/tasks/checklist
`plan.md`, `tasks.md`, and `checklist.md` cite template paths that do not exist. Update them to the actual Level 2 composed template paths under `.opencode/skill/system-spec-kit/templates/level_2/`.

### ISS-A04-002 — Declared Level 2 no longer matches the documented implementation scope
The implementation summary records a 550-line primary rewrite and multiple material design decisions, which pushes this work into Level 3 territory under v2.2 escalation guidance. The folder should either justify remaining at Level 2 or be upgraded.

### ISS-A04-003 — Missing `decision-record.md` if level is corrected to Level 3
Once the spec is reclassified to Level 3, the folder becomes structurally incomplete because the required decision record is absent.

### ISS-A04-004 — Evidence is present but often weak or non-durable
Most P0 checklist entries use narrative proof (“grep confirms”, section references, tool-signature references) rather than durable `[File:]` or `[Test:]` evidence, and the implementation-summary test claim is not backed by preserved command output.

## Recommendations
1. Reclassify the spec as **Level 3** unless there is a documented exception for the 550-line rewrite; if upgraded, add `decision-record.md` from the Level 3 template set.
2. Normalize all `SPECKIT_TEMPLATE_SOURCE` markers to real v2.2 template paths, preferably the composed Level 2/3 template paths rather than ad hoc labels.
3. Restore template-faithful section anchors in `plan.md`, `tasks.md`, and `checklist.md` to improve traceability and future retrieval.
4. Strengthen checklist evidence by replacing narrative claims with durable citations such as `[File: path:line-line]`, `[Test: exact command + result]`, or `[Commit: sha]`.
5. Re-run `validate.sh` after metadata/source corrections so the automated validator and the stricter manual audit converge.
