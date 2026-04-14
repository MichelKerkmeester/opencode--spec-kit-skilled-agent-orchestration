# Iteration 004: Workflow YAML traceability sweep

## Focus
Traceability-only workflow sweep across the targeted spec-kit YAML family for canonical-spec-document wording, scratch checkpoint paths, and any residual workflow-side F007/NF002 drift.

## Findings
### P1 - Required
- **NF002**: the workflow slice remains partially open because the confirm variants for `plan` and `implement` still say "generated continuity artifact" even though their auto counterparts and the rest of the reviewed workflow family now use canonical-spec-document wording. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:589] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:608] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:567] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:588] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:538] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:551] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:503] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:519]

## Closure Checks
- F007 is closed in the original `complete_*` save blocks: both workflow files now index `[routed-canonical-spec-doc-path]` and describe the index step as running after the canonical spec document is refreshed on disk. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1031] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1046] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1048] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1112] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1133] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1135]
- The claimed checkpoint remediation is present: the complete/implement pairs now write checkpoint artifacts under `scratch/`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:783] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:945] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:842] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1020] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:442] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:494]
- The deep-review/deep-research workflow quartet no longer carries the old workflow-side NF002 memory-path/save-target wording; each now routes and indexes the canonical spec document. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822]

## Ruled Out
- The remaining `memory/*.md` mentions in the complete workflow pair are negative guardrails that forbid retired paths, not instructions to save there. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1036] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1117]
- `spec_kit_resume_auto.yaml`, `spec_kit_resume_confirm.yaml`, and `spec_kit_debug_confirm.yaml` use canonical artifact/document language and do not preserve support-artifact wording. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:33] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:33] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml:294]
- No residual `[generated-support-artifact-path]` token surfaced in the audited scope; the remaining drift is prose-only in the confirm variants.

## Dead Ends
- None beyond the prose-only confirm-variant drift; no unresolved placeholder/path token remained in the audited YAML family.

## Recommended Next Focus
Move to the remaining traceability overlays outside this workflow family: create-command surfaces, lifecycle docs, and cross-runtime agent manuals.
