# Iteration 004: Traceability re-check for F007

## Focus
Traceability review of the six deep-review/deep-research/complete workflow YAMLs for any lingering `memory/*.md` checks or "support artifact" wording.

## Findings
### P0 - Blocker
- **F007**: The workflow-family remediation is not fully closed because both `spec_kit_complete_auto.yaml` and `spec_kit_complete_confirm.yaml` still carry retired `memory/*.md` path checks and "support artifact" placeholders in post-save indexing. That directly contradicts the expected routed-canonical-spec-document contract. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1036] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1046] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1048] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1117] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1133] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1135]

## Adversarial Self-Check
- Re-read both `spec_kit_complete_*` save blocks after the initial hit. The stale `paths: ["*/memory/*.md", "specs/*/memory/*"]`, `[generated-support-artifact-path]`, and "support artifact" timing text are still present in both files. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1036] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1117]

## Ruled Out
- The same blocks already name the intended canonical outputs (`decision-record.md / implementation-summary.md / handover.md`), so the residual drift is a partial cleanup rather than a missing canonical routing concept. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1037] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1041] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1118] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1122]

## Dead Ends
- This pass found the stale wording concentrated in `spec_kit_complete_*`; the broader family search did not surface equivalent `support artifact` matches in the deep-review or deep-research YAMLs.

## Recommended Next Focus
Inspect the feature catalog pair for F008, then branch to cross-runtime agent manuals and command surfaces to map whether the same continuity contract drifts elsewhere.
