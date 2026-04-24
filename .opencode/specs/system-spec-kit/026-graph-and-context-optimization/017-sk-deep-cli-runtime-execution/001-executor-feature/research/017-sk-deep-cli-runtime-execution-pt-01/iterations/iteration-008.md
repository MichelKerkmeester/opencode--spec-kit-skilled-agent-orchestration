# Iteration 008

## Focus

Q7: Copilot autonomous-execution hardening preconditions. Inspect what observability or recovery assumptions still differ between Copilot and the other CLI executors after Cluster E, and whether any remaining gaps would block reliable unattended execution in Phase 019.

## Actions Taken

1. Read the active deep-loop session state in `research/017-sk-deep-cli-runtime-execution-001-executor-feature/deep-research-config.json`, `deep-research-strategy.md`, and `iterations/iteration-007.md` to confirm the current question framing and prior conclusions.
2. Read the Copilot skill surface in `.opencode/skill/cli-copilot/SKILL.md` and `references/copilot_tools.md` to extract the runtime promises around Autopilot, repository memory, and out-of-band configuration.
3. Read the live deep-loop runtime contract in `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`, `.opencode/skill/sk-deep-research/references/capability_matrix.md`, and the Phase 015 review artifact `review/015-deep-review-and-remediation/iterations/iteration-062.md` to check whether Copilot bootstrap/recovery assumptions are internally consistent.
4. Read the Phase 019 implementation and decision docs in `017-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md` and `decision-record.md`, plus the live runtime surfaces in `mcp_server/lib/deep-loop/executor-config.ts`, `post-dispatch-validate.ts`, `executor-audit.ts`, `tests/deep-loop/cli-matrix.vitest.ts`, and the `if_cli_copilot` branch in `spec_kit_deep-research_auto.yaml`.

## Findings

### P1. Copilot still has an unresolved bootstrap-observability contract split, so operators and tooling can disagree on whether startup recovery context is expected automatically

Reproduction path:
- Read `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`.
- Read `.opencode/skill/sk-deep-research/references/capability_matrix.md`.
- Read `review/015-deep-review-and-remediation/iterations/iteration-062.md`.

Evidence:
- The machine-readable runtime matrix marks the shared `OpenCode / Copilot` bucket with `"hookBootstrap": false`.
- The human-readable capability matrix says the same runtime has hook bootstrap support and explicitly describes OpenCode/Copilot as using plugin or session-start bootstrap behavior.
- Phase 015 review iteration 62 already recorded this as a parity-contract failure rather than a resolved documentation detail.

Impact on unattended execution:
- This does not prove a present runtime bug in Cluster E's `compact-cache` or `session-prime` code, but it does leave Copilot with an ambiguous recovery/observability contract.
- A Phase 019 operator or future reducer/tooling consumer could reasonably assume Copilot gets automatic startup context injection, while the machine-readable contract says not to rely on it.
- That makes autonomous recovery behavior less predictable than Codex/Claude/Gemini, where the hook-bootstrap stance is internally consistent.

Risk-ranked remediation candidates:
- P1: make the markdown and JSON contracts agree on whether Copilot is hook-bootstrapped, then keep only one authoritative answer.
- P2: add one explicit runtime note in the deep-loop setup flow telling operators whether Copilot requires packet-local prompt-pack context only, or whether session-start bootstrap is expected to contribute recovery state.

### P1. Phase 019 promised a Copilot large-prompt fallback, but the shipped branch and tests still use only positional `-p "$(cat prompt)"`, leaving a real unattended-execution brittleness gap

Reproduction path:
- Read `017-sk-deep-cli-runtime-execution/002-runtime-matrix/decision-record.md` ADR-008.
- Read `017-sk-deep-cli-runtime-execution/002-runtime-matrix/spec.md` REQ-010 / risk table.
- Read `tests/deep-loop/cli-matrix.vitest.ts`.
- Read `spec_kit_deep-research_auto.yaml` and the other deep-loop YAML branches around `if_cli_copilot`.

Evidence:
- ADR-008 says Copilot should default to positional `-p` but fall back to an `@path` wrapper prompt when the rendered prompt approaches `ARG_MAX`.
- The Phase 019 spec, task text, and risk table repeat that fallback as the mitigation for large prompts.
- The live `if_cli_copilot` branches in the YAMLs only run `copilot -p "$(cat PROMPT)" --model X --allow-all-tools --no-ask-user`; there is no size check and no `@path` fallback branch.
- `cli-matrix.vitest.ts` asserts only the positional command shape and contains no coverage for an oversized-prompt fallback path.

Impact on unattended execution:
- This is the clearest Copilot-specific hardening gap remaining after Cluster E. Codex can stream prompt content through stdin; Gemini and Claude also avoid the same positional-only constraint profile. Copilot alone is documented as needing a size-aware mitigation, but the mitigation is not actually wired.
- A long prompt pack with accumulated state summaries can therefore fail in a way that Phase 019's docs claim is already handled, which is exactly the kind of silent unattended-execution brittleness Phase 019 was supposed to eliminate.

Risk-ranked remediation candidates:
- P1: implement the promised prompt-size check plus `@path` fallback in all 4 Copilot YAML branches and mirror it in `cli-matrix.vitest.ts`.
- P2: until that lands, downgrade Copilot from "fully hardened" to "works for normal prompt sizes; large prompt packs remain unproven" in the runtime docs.

### P2. Copilot still depends on out-of-band user configuration for reasoning intensity, and the runtime cannot audit that effective setting

Reproduction path:
- Read `mcp_server/lib/deep-loop/executor-config.ts`.
- Read `017-sk-deep-cli-runtime-execution/002-runtime-matrix/implementation-summary.md` §Known Limitations.
- Read `.opencode/skill/cli-copilot/SKILL.md`.

Evidence:
- `EXECUTOR_KIND_FLAG_SUPPORT` allows `cli-copilot` only `model` and `timeoutSeconds`; `reasoningEffort` is rejected at parse time.
- The Phase 019 implementation summary states that Copilot has no CLI-level reasoning-effort flag and requires `~/.copilot/config.json` to be prepared ahead of time.
- `executor-audit.ts` records only requested executor config fields; it cannot confirm what Copilot actually picked from user-global configuration.

Impact on unattended execution:
- Copilot can still run autonomously, but its execution quality depends on a pre-existing local configuration that the deep-loop workflow cannot observe or verify.
- That means Copilot remains weaker than Codex or Claude for "auditable requested runtime" guarantees: the run can succeed while still being unable to prove the intended effort profile was actually active.

Risk-ranked remediation candidates:
- P2: document `~/.copilot/config.json` as a hard preflight requirement for high-trust unattended runs, not just a note in limitations.
- P2: add a pre-dispatch advisory or emitted audit note when `kind=cli-copilot`, making the out-of-band reasoning configuration explicit in the iteration record or dashboard.

## Questions Answered

- Q7. What are the remaining Copilot-specific observability gaps post-Cluster E, and how do they affect autonomous execution?
  Partially answered. I did not find evidence that Cluster E's `compact-cache` or `session-prime` fixes themselves remain functionally broken for Copilot. The remaining Copilot-specific gaps are around contract clarity and hardening preconditions:
  - bootstrap/recovery observability is still contradictory across machine-readable vs human-readable runtime docs;
  - the promised `@path` large-prompt fallback is not implemented, which is a concrete unattended-execution brittleness gap;
  - reasoning-effort still depends on unverifiable user-global Copilot config.
  Together these gaps mean Copilot is usable, but not yet as operationally predictable or auditable as the other CLI executors.

## Questions Remaining

- Is there any checked-in real Copilot iteration run proving that a long rendered prompt pack stays below practical argument-size limits on the supported environments, or does the lack of `@path` fallback remain purely untested?
- Should the runtime capability matrix split `OpenCode` and `Copilot` into separate rows so bootstrap assumptions stop leaking across two different execution surfaces?
- Does the project want Copilot treated as "autonomous but operator-preconditioned" until a preflight check can verify `~/.copilot/config.json` and prompt-size safety?

## Next Focus

Q8: Wave-D deferred P2 coupling risk (`R55-P2-002/003/004`). Inspect whether the deferred helper/DRY/YAML-evolution items are still truly isolated, or whether any now couple directly to the Copilot/Phase-019 hardening gaps uncovered here.
