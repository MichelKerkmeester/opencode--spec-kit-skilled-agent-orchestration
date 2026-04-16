# Iteration 62 - correctness - skill-refs-deep-review+research

## Dispatcher
- iteration: 62 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:07:16.240Z

## Files Reviewed
- `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-review/references/convergence.md`
- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
- `.opencode/skill/sk-deep-review/references/quick_reference.md`
- `.opencode/skill/sk-deep-review/references/state_format.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Deep-research capability matrix contradicts its declared machine-readable source on OpenCode / Copilot hook bootstrap.**
   - `capability_matrix.md` declares `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json` as the machine-readable source of truth, then marks OpenCode / Copilot `Hook Bootstrap` as `Yes (plugin)` and says both OpenCode and Copilot use hook bootstraps [`.opencode/skill/sk-deep-research/references/capability_matrix.md:13-15`, `.opencode/skill/sk-deep-research/references/capability_matrix.md:37-40`].
   - The corresponding machine-readable row sets `"hookBootstrap": false` for that same runtime bucket [`.opencode/skill/sk-deep-research/assets/runtime_capabilities.json:7-23`].
   - This is a parity-contract split inside the same operational surface: humans and tooling consulting the documented source of truth get opposite answers.

   ```json
   {
     "claim": "The deep-research runtime capability docs disagree on whether OpenCode / Copilot has hook bootstrap support.",
     "evidenceRefs": [
       ".opencode/skill/sk-deep-research/references/capability_matrix.md:13-15",
       ".opencode/skill/sk-deep-research/references/capability_matrix.md:37-40",
       ".opencode/skill/sk-deep-research/assets/runtime_capabilities.json:7-23"
     ],
     "counterevidenceSought": "Searched the surrounding deep-research runtime docs for another authoritative bootstrap declaration that would explain a deliberate split between markdown and JSON; none resolved the contradiction.",
     "alternativeExplanation": "The markdown row may have been updated for a planned Copilot/OpenCode hook path while the JSON still reflects the live runtime.",
     "finalSeverity": "P1",
     "confidence": 0.98,
     "downgradeTrigger": "Downgrade to P2 only if the JSON asset is intentionally non-authoritative for bootstrap parity and no runtime/tooling consumes it."
   }
   ```

2. **Deep-research references expose unsupported `fork` / `completed-continue` lineage modes as live contract.**
   - `capability_matrix.md` treats `fork` and `completed-continue` as invariant lifecycle vocabulary [`.opencode/skill/sk-deep-research/references/capability_matrix.md:22-29`].
   - `quick_reference.md` labels them as live lifecycle branches [`.opencode/skill/sk-deep-research/references/quick_reference.md:83-87`].
   - `state_format.md` allows `lineage.lineageMode` to emit `new`, `resume`, `restart`, `fork`, or `completed-continue` [`.opencode/skill/sk-deep-research/references/state_format.md:77-81`].
   - The canonical loop contract says the current release supports only `new`, `resume`, and `restart`, and that `fork` / `completed-continue` MUST NOT be exposed to operators [`.opencode/skill/sk-deep-research/references/loop_protocol.md:91-100`]. Both YAML workflows and all runtime mirrors repeat that deferred-only rule [`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:161`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:169`, `.opencode/agent/deep-research.md:79`, `.claude/agents/deep-research.md:79`, `.codex/agents/deep-research.toml:70`, `.gemini/agents/deep-research.md:79`].
   - Result: operator-facing references advertise lineage modes the live workflow does not wire or accept.

   ```json
   {
     "claim": "Deep-research operational references incorrectly present `fork` and `completed-continue` as live lineage modes.",
     "evidenceRefs": [
       ".opencode/skill/sk-deep-research/references/capability_matrix.md:22-29",
       ".opencode/skill/sk-deep-research/references/quick_reference.md:83-87",
       ".opencode/skill/sk-deep-research/references/state_format.md:77-81",
       ".opencode/skill/sk-deep-research/references/loop_protocol.md:91-100",
       ".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:161",
       ".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:169",
       ".opencode/agent/deep-research.md:79",
       ".claude/agents/deep-research.md:79",
       ".codex/agents/deep-research.toml:70",
       ".gemini/agents/deep-research.md:79"
     ],
     "counterevidenceSought": "Checked the YAML workflows and all four runtime agent mirrors for actual fork/completed-continue handling or emitted lineage events; each one treats those branches as deferred.",
     "alternativeExplanation": "The state and quick-reference docs may be carrying forward a future-facing schema allowance that never got removed after the runtime contract was narrowed.",
     "finalSeverity": "P1",
     "confidence": 0.99,
     "downgradeTrigger": "Downgrade to P2 if fork/completed-continue wiring, event emission, and replay fixtures are added in the live workflows and mirrors."
   }
   ```

3. **Deep-review references disagree on whether `fork` / `completed-continue` are supported runtime modes.**
   - `quick_reference.md` presents both as active lifecycle modes [`.opencode/skill/sk-deep-review/references/quick_reference.md:83-90`].
   - `state_format.md` says the current runtime only emits `new`, `resume`, and `restart`, with `fork` and `completed-continue` deferred [`.opencode/skill/sk-deep-review/references/state_format.md:112-116`].
   - `loop_protocol.md` repeats that deferred-only contract [`.opencode/skill/sk-deep-review/references/loop_protocol.md:530-538`].
   - The live YAML workflows and all runtime mirrors match the deferred contract, not the quick reference [`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:178`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:33`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:186`, `.opencode/agent/deep-review.md:308-309`, `.claude/agents/deep-review.md:308-309`, `.codex/agents/deep-review.toml:340-341`, `.gemini/agents/deep-review.md:308-309`].
   - Result: the quick reference tells operators to expect review lifecycle branches that the current runtime explicitly does not emit.

   ```json
   {
     "claim": "Deep-review operational references are internally inconsistent about whether `fork` and `completed-continue` are runtime-supported lifecycle modes.",
     "evidenceRefs": [
       ".opencode/skill/sk-deep-review/references/quick_reference.md:83-90",
       ".opencode/skill/sk-deep-review/references/state_format.md:112-116",
       ".opencode/skill/sk-deep-review/references/loop_protocol.md:530-538",
       ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33",
       ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:178",
       ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:33",
       ".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:186",
       ".opencode/agent/deep-review.md:308-309",
       ".claude/agents/deep-review.md:308-309",
       ".codex/agents/deep-review.toml:340-341",
       ".gemini/agents/deep-review.md:308-309"
     ],
     "counterevidenceSought": "Checked the state schema, loop protocol, command YAML, and all runtime mirrors for a live branch that would justify the quick-reference table; none were found.",
     "alternativeExplanation": "The quick reference likely preserved an earlier design draft after the runtime narrowed the lifecycle contract to `new`, `resume`, and `restart`.",
     "finalSeverity": "P1",
     "confidence": 0.99,
     "downgradeTrigger": "Downgrade to P2 if the runtime begins emitting those lineage modes and the YAML/agent mirrors are updated to support them."
   }
   ```

4. **Both deep-loop save protocols still require verification of `memory/*.md`, but continuity no longer writes memory artifacts there.**
   - Deep-research save steps say to verify `memory/*.md` after `generate-context.js` [`.opencode/skill/sk-deep-research/references/loop_protocol.md:497-499`].
   - Deep-review save steps say the same [`.opencode/skill/sk-deep-review/references/loop_protocol.md:490-497`].
   - The current system-spec-kit continuity contract says continuity no longer writes `[spec]/memory/*.md`; save updates canonical packet docs such as `implementation-summary.md`, `decision-record.md`, and `handover.md` instead [`.opencode/skill/system-spec-kit/README.md:95`, `.opencode/skill/system-spec-kit/README.md:149-150`].
   - The command entrypoints still mirror the same impossible verification step [`.opencode/command/spec_kit/deep-research.md:212-213`, `.opencode/command/spec_kit/deep-review.md:244-245`].
   - Result: an agent following the documented save protocol can falsely conclude save failed, or waste time looking for deprecated artifacts that should not exist.

   ```json
   {
     "claim": "The deep research and deep review save protocols still validate against deprecated `memory/*.md` outputs that the current continuity system no longer creates.",
     "evidenceRefs": [
       ".opencode/skill/sk-deep-research/references/loop_protocol.md:497-499",
       ".opencode/skill/sk-deep-review/references/loop_protocol.md:490-497",
       ".opencode/skill/system-spec-kit/README.md:95",
       ".opencode/skill/system-spec-kit/README.md:149-150",
       ".opencode/command/spec_kit/deep-research.md:212-213",
       ".opencode/command/spec_kit/deep-review.md:244-245"
     ],
     "counterevidenceSought": "Looked for any current continuity contract that still declares `[spec]/memory/*.md` as a post-save artifact; the checked system-spec-kit docs instead describe canonical packet-doc updates.",
     "alternativeExplanation": "The loop protocols and command docs may still be carrying pre-ADR save verification text from the old memory-artifact model.",
     "finalSeverity": "P1",
     "confidence": 0.97,
     "downgradeTrigger": "Downgrade to P2 only if `generate-context.js` still intentionally creates legacy `memory/*.md` sidecars alongside canonical packet-doc updates."
   }
   ```

### P2 Findings
- None.

## Traceability Checks
- **Cross-runtime consistency:** Failed for deep-research bootstrap parity (`capability_matrix.md` vs `runtime_capabilities.json`) and for lifecycle-mode exposure (`references/*.md` vs `.opencode` / `.claude` / `.codex` / `.gemini` mirrors plus YAML workflows).
- **Skill↔code alignment:** Failed for both deep-loop save phases; the reference contract still points at deprecated `memory/*.md` outputs instead of canonical continuity docs.
- **Command↔implementation alignment:** `.opencode/command/spec_kit/deep-research.md` and `.opencode/command/spec_kit/deep-review.md` repeat the same stale save-verification step, so the drift is duplicated across operator-facing entrypoints.

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` aligns with the deep-research command note about acquiring `research/.deep-research.lock` before `folder_state` classification and keeping `research/research.md` canonical [`.opencode/skill/sk-deep-research/references/spec_check_protocol.md:42-68`, `.opencode/skill/sk-deep-research/references/spec_check_protocol.md:132-156`, `.opencode/command/spec_kit/deep-research.md:33-35`].
- `.opencode/skill/sk-deep-review/references/convergence.md` default thresholds match the quick reference summary for `maxIterations`, `convergenceThreshold`, `rollingStopThreshold`, `stuckThreshold`, `minStabilizationPasses`, and `compositeStopScore` [`.opencode/skill/sk-deep-review/references/convergence.md:30-40`, `.opencode/skill/sk-deep-review/references/quick_reference.md:145-151`].

## Next Focus
- Review the mirrored command and agent entrypoints that duplicate deprecated save-verification language and deferred lifecycle-mode exposure, especially the non-reference runtime wrappers.
