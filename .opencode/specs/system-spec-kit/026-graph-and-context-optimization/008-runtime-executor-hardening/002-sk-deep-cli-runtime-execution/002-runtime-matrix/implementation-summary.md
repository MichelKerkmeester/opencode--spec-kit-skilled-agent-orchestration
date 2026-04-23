---
title: "Implementation Summary: CLI Runtime Matrix for Iterative Skills"
description: "Phase 019 shipped the CLI runtime matrix, and the 2026-04-24 CF-026 remediation made codex/gemini/claude permission controls executable while adding subprocess smoke coverage for the Copilot wrapper and audited failure paths."
trigger_phrases: ["019 implementation summary", "cli matrix shipped", "phase 019 verdict"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "CF-026 remediation shipped"
    next_safe_action: "Run broader executor-matrix smoke only in environments with real vendor CLIs installed"
    blockers:
      - "cli-copilot still requires fixed --allow-all-tools; there is no narrower CLI permission surface to wire today"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: CLI Runtime Matrix for Iterative Skills

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Packet** | `system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix` |
| **Verdict** | **PASS** |
| **Shipped** | 2026-04-18 |
| **Effort (actual)** | ~1.5 hours wall-clock using cli-codex dogfooding (same pattern Phase 018 established) |
| **Effort (planned)** | ~20 hours |
| **Predecessor** | Phase 018 (`017-sk-deep-cli-runtime-execution/001-executor-feature`, shipped same day) |
| **Test coverage** | 54/54 vitest pass across 5 suites |
| **Type-check** | `tsc --noEmit` clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. What Was Built

Phase 018 reserved three executor kinds in the enum but rejected them at config load with `ExecutorNotWiredError`. Phase 019 wires all three: `cli-copilot`, `cli-gemini`, `cli-claude-code` now flow through real dispatch branches alongside the existing `cli-codex` and `native` paths. Each CLI has a different invocation surface, so the shared config schema gained per-kind flag-compatibility validation.

### 2.1 Config schema changes

`executor-config.ts` gained three new exports:

- `EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]>` — maps each kind to the optional flags it supports.
- `GEMINI_SUPPORTED_MODELS` — whitelist for cli-gemini's single currently-supported model.
- `GeminiSupportedModel` — type alias.

The `parseExecutorConfig` function now runs a per-kind flag-compatibility pass after the Zod schema check. Unsupported flag combinations throw `ExecutorConfigError` with messages naming the unsupported field, the kind, and the kind's supported fields.

The `ExecutorNotWiredError` class is preserved as a type export even though it is no longer thrown. Consumers that caught it in Phase 018 still type-check.

### 2.2 YAML dispatch branches

Each of the 4 YAMLs (`spec_kit_deep-research_auto.yaml`, `..._confirm.yaml`, `spec_kit_deep-review_auto.yaml`, `..._confirm.yaml`) gained three new branches:

- `if_cli_copilot`: `copilot -p ... --model X --allow-all-tools --no-ask-user`, with a 16 KB `@PROMPT_PATH` wrapper fallback for oversized prompts. This branch keeps a fixed broad permission posture because the CLI exposes no narrower autonomous mode in this packet.
- `if_cli_gemini`: `gemini "$(cat PROMPT)" -m X -s {docker|none} -y -o text`, with `sandboxMode` now mapped into the live `-s` flag instead of being ignored.
- `if_cli_claude_code`: `claude -p "$(cat PROMPT)" --model X --permission-mode {plan|acceptEdits|bypassPermissions} --output-format text [--effort Y]`, with `sandboxMode` now mapped into the live permission mode instead of always forcing `acceptEdits`.

The `cli-codex` branch now also consumes `sandboxMode` directly instead of hardcoding `workspace-write`.

All three new branches share the Phase 018 pre-dispatch prompt rendering, post-dispatch validation, and executor audit steps. Review YAMLs use `review/prompts/` instead of `research/prompts/`.

### 2.3 Contract documentation

Both skill docs (`.opencode/skill/sk-deep-research/SKILL.md` and `.opencode/skill/sk-deep-review/SKILL.md`) had their Executor Selection Contract tables updated so all four CLI kinds now report "Shipped (spec 019)" instead of "Not wired — awaits future spec." A new **Cross-CLI Delegation** subsection documents design intent: any executor CAN invoke other CLIs from within its iteration, self-recursion is forbidden, auth propagation is user-responsibility, runtime enforcement is out of scope.

`references/loop_protocol.md §3 Executor Resolution` in both skills was expanded to describe all five kinds (native + 4 CLIs) with their canonical dispatch shapes.

### 2.4 Setup flags

`.opencode/command/spec_kit/deep-research.md` and its review counterpart Q-Exec questions expanded from 2 options (native + cli-codex) to 5 (all kinds). Each option notes the CLI's canonical flags and its notable limitations (copilot lacks CLI-level reasoning-effort, gemini has a single model, claude-code has no service-tier).

### 2.5 New test suite

`tests/deep-loop/cli-matrix.vitest.ts` now does two jobs: it still verifies the expected dispatch command shape per kind, and it also runs subprocess smoke checks for the two CF-026 gaps that were previously only unit-covered. The smoke layer exercises the Copilot large-prompt `@path` wrapper with real temp files and validates that audited crash/timeout paths append `dispatch_failure` events to the state log.

`tests/deep-loop/executor-config.vitest.ts` was extended from 16 to 28 cases covering acceptance paths for the 3 new kinds, unsupported-flag rejections per kind, and the gemini model whitelist rejection.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files -->
## 3. Files Touched (10)

### 3.1 Modified (8)

| File | Purpose |
|------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | Removed ExecutorNotWiredError rejection for 3 kinds; added EXECUTOR_KIND_FLAG_SUPPORT map + per-kind validator + GEMINI_SUPPORTED_MODELS whitelist |
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` | Extended 16 → 28 cases |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | 3 new dispatch branches |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | 3 new dispatch branches |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | 3 new dispatch branches with review/prompts/ path |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | 3 new dispatch branches with review/prompts/ path |
| `.opencode/command/spec_kit/deep-research.md` | Q-Exec options A-E |
| `.opencode/command/spec_kit/deep-review.md` | Q-Exec options A-E |
| `.opencode/skill/sk-deep-research/SKILL.md` | Contract table updated; Cross-CLI Delegation subsection added |
| `.opencode/skill/sk-deep-review/SKILL.md` | Same |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Executor Resolution subsection expanded to 5 kinds |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Same |

### 3.2 Created (1)

| File | Purpose |
|------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | 6 tests verifying per-kind dispatch command shape |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:how-delivered -->
## 4. How It Was Delivered

### 4.1 Delegation pattern (continued dogfooding)

Phase 019 continued the cli-codex dogfooding pattern from Phase 018. Three codex dispatches:

| Phase | Files touched | Result |
|-------|---------------|--------|
| 019-A (config + validator + tests) | 2 | 48 tests (was 40), tsc clean |
| 019-B (YAML dispatch branches) | 4 | 48 tests still green |
| 019-C+D (docs + setup flags + new test suite) | 7 | 54 tests, tsc clean |

Every dispatch used `codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`. No manual interventions required this time (Phase 018 had 3 manual corrections; Phase 019 had 0).

### 4.2 Phase 018 patterns respected

- **Atomic-ship groups**: config + YAML + tests + docs all ship together per plan §8.
- **Symmetric implementation**: bit-identical treatment across research / review.
- **Invariant preservation**: `if_native` and `if_cli_codex` branches are untouched from Phase 018.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 5. Key Decisions

See `decision-record.md` for the four ADRs that drove this implementation:

- **ADR-006**: Flat config with per-kind validation, not Zod discriminated union. Preserves Phase 018 schema symmetry.
- **ADR-007**: Cross-CLI delegation documented, not runtime-enforced. Scope discipline.
- **ADR-008**: cli-copilot positional prompt via command substitution. Matches copilot's documented patterns (no stdin).
- **ADR-009**: Strict cli-gemini model whitelist. Smallest risk of misdispatch given Gemini CLI's stable single-model surface.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 6. Verification

```
cd .opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json
# → clean (no output)

npx vitest run tests/deep-loop/
# → Test Files  5 passed (5)
# → Tests  54 passed (54)

grep -c "Shipped (spec 019)" .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-review/SKILL.md
# → at least 3 occurrences each (all 3 newly-shipped kinds)

grep -l "Cross-CLI Delegation" .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-review/SKILL.md
# → both files present

grep -n "if_cli_copilot\|if_cli_gemini\|if_cli_claude_code" .opencode/command/spec_kit/assets/spec_kit_deep-*.yaml
# → 12 markers across 4 files

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix
# → Errors: 0, warnings non-blocking
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 7. Known Limitations

1. **No vendor-CLI end-to-end smoke tests**: The matrix now has subprocess smoke coverage for the Copilot wrapper plus audited crash/timeout failure paths, but it still does not prove a real `copilot`, `gemini`, `claude`, or `codex` binary can complete the full iteration artifact contract in this packet's automated suite.
2. **Cross-CLI delegation is prose-only**: No runtime detection of self-recursive invocation. A user who tells a cli-codex iteration to invoke `codex exec ...` recursively gets no guardrail. ADR-007 explains why.
3. **cli-gemini model whitelist requires code updates**: When Google ships a new Gemini CLI model, the whitelist in `executor-config.ts` needs a one-line update. Users cannot bypass the whitelist at config-time. ADR-009 explains why.
4. **cli-copilot reasoning-effort surface**: Copilot has no CLI-level reasoning-effort flag. Users who want it must set `~/.copilot/config.json` ahead of time. The config rejects `reasoningEffort` with cli-copilot at parse time, pointing to config.json.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deferred -->
## 8. Deferred

| Item | Reason | Deferred to |
|------|--------|-------------|
| Full vendor-CLI end-to-end test per CLI | Local subprocess smoke now covers wrapper/failure behavior, but real vendor binaries still need an environment-owned smoke gate | Track 2 or dedicated smoke-test packet |
| Runtime cross-CLI recursion detection | ADR-007 documents why; complicated to implement correctly | Separate future spec if users report issues |
| Gemini model whitelist update mechanism (e.g., env-var bypass) | Strict enum is the right default; bypass complicates testing | ADR-009 |
| Per-kind timeout defaults (instead of flat 900) | Current flat default is adequate; per-kind tuning is premature optimization | Phase 020 if latency data warrants |
<!-- /ANCHOR:deferred -->

---

<!-- ANCHOR:handoff -->
## 9. Handoff

Phase 019 ships a complete executor matrix: native + 4 CLIs. After CF-026 remediation, `sandboxMode` is executable for `cli-codex`, `cli-gemini`, and `cli-claude-code`, while `cli-copilot` is explicitly documented as fixed to `--allow-all-tools`.

Track 2 from the original approved plan (30-iteration deep-research on Phase 017 refinements via cli-codex) is still pending and now has the option of using any of the four CLIs instead, with local smoke coverage in place for the Copilot wrapper and audited failure logging before broader vendor-CLI proof is attempted.
<!-- /ANCHOR:handoff -->
