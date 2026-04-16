# Iteration 35 - traceability - commands

## Dispatcher
- iteration: 35 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:19:53.795Z

## Files Reviewed
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
- .opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts
- .opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Deep-review still executes a deferred `completed-continue` path on completed sessions** — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:178-181`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:742`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:842`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:847-848`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:33`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:186-189`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:825`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:949`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:954-955`
   - Both command assets tell operators that `completed-continue` is deferred and "no longer runtime-supported", but the `on_completed_session` branch still jumps into `phase_synthesis`. That phase appends a fresh `synthesis_complete` event and rewrites `deep-review-config.json` status, so rerunning the command on an already-complete packet still performs the forbidden continuation path instead of forcing archive/restart.

```json
{
  "claim": "The deep-review command assets still implement completed-session continuation by routing directly to phase_synthesis, despite advertising that `completed-continue` is deferred and unsupported.",
  "evidenceRefs": [
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:178-181",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:742",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:842",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:847-848",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:33",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:186-189",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:825",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:949",
    ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:954-955"
  ],
  "counterevidenceSought": "I checked whether phase_synthesis was read-only or whether completed sessions halted before any writes; instead both YAMLs append a new synthesis_complete event and edit deep-review-config.json.",
  "alternativeExplanation": "If the product intentionally allows idempotent regeneration of synthesis artifacts after completion, the note that `completed-continue` is deferred is wrong rather than the branch logic.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if phase_synthesis is explicitly sanctioned as a non-lineage, read-only replay path for completed sessions and the deferred-branch note is updated accordingly."
}
```

### P2 Findings
- **Deep-research advertises the wrong archive root** — `state_paths.archive_root` and `step_create_directories` still point at `{spec_folder}/research/archive`, but both restart branches archive to `{spec_folder}/research_archive/{timestamp_slug}` instead (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:87-89`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:115-116`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:153-159`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:88-89`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:116`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:153-159`). The precreated `research/archive` directory is dead configuration now, and the parity test never asserts archive destinations (`.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:73-83`).
- **The command parity tests are lexical and miss lifecycle behavior drift** — the deep-review test only checks for token presence like `completed-continue`, `on_restart:`, and canonical filenames, while the deep-research test only checks substring presence for reducer invocation and lifecycle terms (`.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts:70-114`, `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts:73-83`). They do not assert that completed sessions halt vs continue or that declared archive roots match executed archive destinations, so both command/runtime mismatches can ship unnoticed.

## Traceability Checks
- **Mismatch:** `spec_kit_deep-review_{auto,confirm}` say `completed-continue` is deferred, but `on_completed_session` still routes into `phase_synthesis`, which mutates review artifacts.
- **Partial alignment:** `spec_kit_deep-research_{auto,confirm}` correctly halt on completed sessions in line with their deferred-branch note, but their declared `archive_root` and created archive directory no longer match the restart destination they actually use.

## Confirmed-Clean Surfaces
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:161-165` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:161-165` consistently reject completed-session reuse instead of silently continuing into synthesis.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:83-90` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:83-90` still use the canonical `review/deep-review-*` file names for config, state log, findings registry, dashboard, and final report; no new path drift surfaced in those state artifact names.

## Next Focus
- Inspect reducer/runtime support for the same lifecycle branches and archive destinations so iteration 36 can confirm whether the command drift is isolated to YAML assets or reflected deeper in the execution stack.
