# Iteration 009 — B4: Spec-kit validator correctness

## Focus
Audited the spec-kit validation dispatcher plus the SPEC_DOC_INTEGRITY, EVIDENCE_CITED, and TEMPLATE_HEADERS rule paths for false positives and false negatives. I traced both shell wrappers and the template-structure helper, then verified representative cases in `/tmp`.

## Actions Taken
- Enumerated validator files with `rg --files .opencode/skill/system-spec-kit/scripts/spec .opencode/skill/system-spec-kit/scripts/rules`.
- Read `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, especially `get_rule_scripts`, `run_all_rules`, and strict validator dispatch.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` fully.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh` fully.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` fully.
- Read `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` for header extraction and compare behavior.
- Verified concrete examples with temporary folders: valid angle-bracket Markdown link, reference-style Markdown link, same-line second checkbox, bold P2 priority, extra mid-structure header, and uppercase checkbox variants.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-009-B4-01 | P1 | .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:63 | `extract_markdown_link_targets` uses one inline-link regex/sed pipeline. It mishandles valid angle-bracket Markdown links: `[Existing](<existing.md>)` is extracted as the whole `[Existing](<existing.md>)` token, so `resolve_markdown_reference_path` looks for that literal path and fails even when `existing.md` exists. The same extractor misses reference-style definitions like `[r]: missing-ref.md`, so missing referenced Markdown can pass. | Replace the grep/sed extraction with a Markdown-aware parser or at least handle inline, angle-bracket, and reference-style `.md` targets explicitly before path resolution. |
| F-009-B4-02 | P1 | .opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:78 | `run_check` treats any completed checklist line containing two checked boxes as evidence. A line like `- [x] CHK-001 [P1] Completed parent - [x] nested checkbox with no evidence` passes `EVIDENCE_CITED`, even though it contains no evidence marker. This is a false negative that can let P0/P1 completion claims through without evidence. | Remove the same-line multi-checkbox shortcut or require the second checkbox to be in a structured evidence field. Evidence should be semantic (`[EVIDENCE:]`, verified/tested note, etc.), not another task marker. |
| F-009-B4-03 | P2 | .opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:57 | `EVIDENCE_CITED` only recognizes inline `[P0]`/`[P1]`/`[P2]` priority tags. `check-priority-tags.sh` accepts `**P0**`, `**P1**`, and `**P2**` at `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:72-74`, but evidence checking does not. A completed `**P2**` item outside a P2 section is classified as `UNSPECIFIED` and warned for missing evidence even though P2 items are exempt. | Share priority parsing between `check-priority-tags.sh` and `check-evidence.sh`, or update `check-evidence.sh` to recognize the same inline priority formats. |
| F-009-B4-04 | P1 | .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:73 | `template-structure.js` reports `extra_header` entries via `compareRequiredSequence` at `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:622-626`, but `check-template-headers.sh` ignores every `extra_header`. The rule comment says custom sections after the required structure are valid, but the wrapper also ignores custom headers inserted in the middle of the required structure. That is a TEMPLATE_HEADERS false negative. | Preserve `extra_header` results and classify them by position: allow extras after all required headers, warn or fail when they appear before required structure is complete. |
| F-009-B4-05 | P2 | .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:91 | The checklist format guard counts bare-priority and CHK items with `[ x]`, not `[ xX]`. Other checklist rules accept uppercase `[X]` as completed, so `- [X] **[P0]** ...` bypasses the bare-priority rejection even though lowercase `- [x] **[P0]** ...` is rejected. | Make `bare_priority_count` and `chk_count` checkbox character classes match the rest of the validator, e.g. `[ xX]`. |

## Questions Answered
- SPEC_DOC_INTEGRITY has both false positives and false negatives around Markdown link formats.
- EVIDENCE_CITED does not consistently enforce evidence: it accepts a second checkbox as evidence and does not share priority parsing with the priority rule.
- TEMPLATE_HEADERS delegates comparison to a helper correctly enough to detect extras, but the shell rule drops those detections; its checklist regex also misses uppercase checked boxes.
- `validate.sh` routes default registry rules through `get_rule_scripts` and `run_all_rules` (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:473-486`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:573-695`), then strict-only checks through `run_strict_validators` (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:812-817`). I did not find a dispatcher-specific issue in that path during this pass.

## Questions Remaining
- Whether `EVIDENCE_MARKER_LINT` in `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-lint.ts` intentionally supersedes or duplicates `EVIDENCE_CITED` under `--strict`.
- Whether Markdown link validation should include images, autolinks, and URL-encoded spaces, or stay limited to spec-doc cross-links.
- Whether template extra headers should fail, warn, or pass based on exact position and spec level.

## Next Focus
Follow-on work should audit the TypeScript strict validators, especially `evidence-marker-lint.ts` and `spec-doc-structure.ts`, to see whether their semantics match the shell rules or create conflicting validation outcomes.
