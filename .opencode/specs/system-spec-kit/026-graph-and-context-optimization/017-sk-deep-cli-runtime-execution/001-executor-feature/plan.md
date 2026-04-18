---
title: "Implementation Plan: Deep-Loop CLI Executor Selection for Iterative Skills"
description: "5-phase sequential plan implementing executor-selection branch in sk-deep-research + sk-deep-review YAML dispatch while preserving YAML-owned state, convergence, and lifecycle invariants. Ships native + cli-codex executor kinds; stubs cli-copilot/gemini/claude-code for future packets."
trigger_phrases:
  - "018 plan"
  - "deep-loop executor plan"
  - "cli executor implementation plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-sk-deep-cli-runtime-execution/001-executor-feature"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Plan scaffolded from approved session plan"
    next_safe_action: "Approve plan → execute Phase A"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

# Implementation Plan: Deep-Loop CLI Executor Selection for Iterative Skills

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server lib), YAML (command assets), JSON (config schemas), Markdown (docs + templates) |
| **Framework** | vitest (tests), Zod (schema validation), pnpm workspace |
| **Storage** | None (file-based iteration state under `{spec_folder}/research/` or `/review/`) |
| **Testing** | vitest (unit + integration) |
| **Runtime Dependency** | `codex` CLI (verified: `-c`, `-m`, `--sandbox workspace-write`, stdin piping via `-` or omitted prompt) |

### Overview

Add executor selection as a BRANCH inside `step_dispatch_iteration` of both iterative skills' YAMLs. Factor the hardcoded agent-dispatch block into two mutually exclusive branches (native / cli-codex) that share a rendered prompt pack, unified post-dispatch validation, and a JSONL audit field. State, convergence, lifecycle, reducer — all stay YAML-owned.

The shared logic (config loader, prompt-pack renderer, post-dispatch validator) lands in `mcp_server/lib/deep-loop/` as three small modules. YAML calls into them via existing TypeScript invocation patterns used elsewhere in the command framework.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented (spec.md §2, §3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (codex CLI, existing YAML structure)
- [ ] Approved plan file reviewed by user (already approved via /exit_plan_mode)
- [ ] Phase 017 closure verified (yes — v3.4.0.2 shipped 2026-04-17)
- [ ] No active Phase 018 commits conflict with these file paths (verify before Phase A start)

### Definition of Done

- [ ] All P0 acceptance criteria met (REQ-001 through REQ-007)
- [ ] All P1 acceptance criteria met OR deferred with user approval
- [ ] Native-path regression test: bit-identical output pre/post feature
- [ ] cli-codex smoke test: valid iteration + JSONL with executor audit field
- [ ] Both skills (research + review) parity verified
- [ ] `tsc --noEmit` clean across touched files
- [ ] vitest suites green (unit + integration)
- [ ] `validate.sh --strict` on 018 packet exits 0
- [ ] SKILL.md + loop_protocol.md contract sections documented (both skills)
- [ ] `implementation-summary` document populated (generated in Phase H)
- [ ] description.json + graph-metadata.json refreshed via generate-context.js
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**YAML-owned dispatch with executor branching.** A single control flow (the YAML loop) delegates ONE step (iteration execution) to a selectable backend (native agent OR CLI). All other steps — state mutation, convergence detection, reducer invocation, lifecycle events — stay in YAML.

### Key Components

- **`mcp_server/lib/deep-loop/executor-config.ts`**: Loads & validates `executor` block from config. Enforces `kind` enum, `model` required when cli-*, flags precedence (CLI > file > default).
- **`mcp_server/lib/deep-loop/prompt-pack.ts`**: Renders `prompt_pack_iteration.md.tmpl` with bound variables. Returns rendered markdown string. Shared between agent-context injection and CLI-stdin paths.
- **`mcp_server/lib/deep-loop/post-dispatch-validate.ts`**: Post-iteration invariant checker. Asserts iteration-NNN.md exists and JSONL delta appended with required fields. Emits `schema_mismatch` conflict event on failure.
- **`prompt_pack_iteration.md.tmpl`**: Executor-agnostic template. Same content whether rendered for `@deep-research` agent context (string field in Task dispatch) OR piped to `codex exec` stdin.
- **YAML `step_dispatch_iteration`**: Two-branch dispatch. Branches share pre_dispatch (render prompt), diverge on dispatch mechanism, rejoin at post_dispatch_validate + record_executor_audit.

### Data Flow

```
                                ┌─ pre_dispatch: render prompt_pack_iteration.md
                                │
step_dispatch_iteration ──────→ ├─ if_native:    Task(deep-research, model: opus, context: rendered)
                                │                         │
                                │                         ↓
                                │                 iteration-NNN.md + JSONL delta written
                                │
                                ├─ if_cli_codex: codex exec -m X -c ... -s workspace-write - < rendered-file
                                │                         │
                                │                         ↓
                                │                 iteration-NNN.md + JSONL delta written
                                │
                                ├─ post_dispatch_validate: assert both exist + required fields
                                │
                                └─ record_executor_audit: append `executor: {...}` to JSONL delta

               (continues to step_reduce_state → step_graph_upsert → convergence check)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Config schema + loader (5h)

1. Add `executor` block to `sk-deep-research/assets/deep_research_config.json` with defaults (`kind: "native"`).
2. Add identical block to `sk-deep-review/assets/deep_review_config.json`.
3. Create `mcp_server/lib/deep-loop/executor-config.ts` with Zod schema + loader + validator.
4. Write `__tests__/deep-loop/executor-config.vitest.ts` (accept native+cli-codex, reject unwired kinds, reject cli-codex without model, flag precedence tests).
5. `tsc --noEmit` green + vitest green.

### Phase B — Prompt-pack templates + renderer (5h)

1. Extract inline context (research auto:477-497, review auto:579-608) into `prompt_pack_iteration.md.tmpl` under each skill's `assets/`.
2. Create `mcp_server/lib/deep-loop/prompt-pack.ts` (variable substitution, unbound-variable error).
3. Write `__tests__/deep-loop/prompt-pack-render.vitest.ts` (render with all vars, unbound detection, identical output per invocation).
4. Update template to include explicit output paths (`iteration-{N}.md`), JSONL contract reminder, graphEvents optional, LEAF constraint, tool budget.

### Phase C — Research YAML dispatch branch + post_dispatch_validate (6h)

1. Refactor `spec_kit_deep-research_auto.yaml:465-498` into two-branch structure per spec §3.
2. Mirror into `spec_kit_deep-research_confirm.yaml:527-560`.
3. Create `mcp_server/lib/deep-loop/post-dispatch-validate.ts` (assert file, assert JSONL, required fields, emit conflict event on failure).
4. Wire invocation in YAML after each branch.
5. Write `__tests__/deep-loop/dispatch-branch.vitest.ts` (mock both branches, assert correct one selected per config) + `__tests__/deep-loop/jsonl-audit-field.vitest.ts`.
6. Native-path regression: run existing iteration tests; all must pass.

### Phase D — Review YAML dispatch branch mirror (4h)

1. Mirror Phase C changes into `spec_kit_deep-review_auto.yaml:575+` and `spec_kit_deep-review_confirm.yaml`.
2. Substitute the review-flavored prompt-pack template path.
3. Run existing review iteration tests for regression.

### Phase E — Setup flags in command docs (3h)

1. Add flag parsing to `.opencode/command/spec_kit/deep-research.md` setup phase.
2. Add same to `.opencode/command/spec_kit/deep-review.md`.
3. Document precedence (CLI > file > default).
4. Update consolidated setup prompt to include executor question only when unset in all sources.

### Phase F — SKILL.md + loop_protocol.md contract docs (3h)

1. Replace `sk-deep-research/SKILL.md:61` forward-looking note with CONTRACT section.
2. Replace `sk-deep-review/SKILL.md:63` equivalent.
3. Add Executor Resolution subsection to both skill loop-protocol docs at `.opencode/skill/sk-deep-research/references/loop_protocol.md` §3 and `.opencode/skill/sk-deep-review/references/loop_protocol.md` §3.
4. DQI score both SKILL.md files via `validate_document.py`.

### Phase G — Integration test + smoke verification (5h)

1. Write `__tests__/deep-loop/cli-codex-dispatch.int.vitest.ts` with mocked codex exec (writes valid iteration + JSONL).
2. Native-path regression: 1-iter throwaway run on a temp spec folder, no executor flags, bit-for-bit diff vs. golden output.
3. cli-codex smoke test: same setup with `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast`, assert success.
4. sk-deep-review parity: same two smokes.

### Phase H — Packet finalization (2h)

1. Populate the packet's implementation-summary document with shipped commits, files touched, test counts.
2. Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` to refresh `description.json` + `graph-metadata.json` + memory index.
3. `validate.sh --strict` exits 0.

**Critical path**: Phases A → B → C → D (dispatch wiring) → G (integration). Phases E + F parallelize with G. Phase H sequential at end.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | File |
|-----------|-------|-------|------|
| Unit | Config schema validation | vitest | `__tests__/deep-loop/executor-config.vitest.ts` |
| Unit | Prompt-pack rendering | vitest | `__tests__/deep-loop/prompt-pack-render.vitest.ts` |
| Unit | YAML dispatch branch resolution | vitest (mock YAML execution) | `__tests__/deep-loop/dispatch-branch.vitest.ts` |
| Unit | JSONL audit field append | vitest | `__tests__/deep-loop/jsonl-audit-field.vitest.ts` |
| Integration | End-to-end 1-iter cli-codex with mocked exec | vitest + temp dir | `__tests__/deep-loop/cli-codex-dispatch.int.vitest.ts` |
| Regression | All existing iteration tests pass with native default | vitest | existing suites |
| Smoke | Manual 1-iter cli-codex smoke on throwaway folder | bash + vitest | ad-hoc in Phase G |
| Smoke | Native-path bit-identical diff vs. pre-feature | bash diff | ad-hoc in Phase G |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `codex` CLI on PATH | External | Green (documented in Phase 017 DEPLOYMENT.md) | Blocks cli-codex integration tests only; native path unaffected |
| codex exec stdin piping (`-` sentinel) | External | Verified via `codex exec --help` | Fallback: omitted positional + stdin redirect |
| sk-deep-research + sk-deep-review file structures unchanged from 017 | Internal | Verified 2026-04-18 | Minor — rebaseline line numbers |
| `reduce-state.cjs` schema tolerance | Internal | Verified: accepts passthrough fields | None |
| Zod (schema validator) | Internal lib | Available | Used for config validation |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Internal | Available | §3 gets Executor Resolution subsection |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Post-ship regression where native-path iteration produces different output OR cli-codex dispatch hangs/fails for > 5% of invocations.
- **Procedure**:
  1. Revert the four YAML files to the version immediately before this PR (single commit revert — atomic-ship pattern from Phase 017 makes rollback clean).
  2. Keep config schema additions in place (they're optional/additive; no harm).
  3. Keep `mcp_server/lib/deep-loop/` modules; they're dead code until YAML wiring re-lands.
  4. Reopen the packet for Phase B-bis (fix) without re-scaffolding.
- **Blast radius if broken**: affects users running `/spec_kit:deep-research` or `/spec_kit:deep-review` explicitly. Does not affect any other skill or command.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:atomic-ship -->
## 8. ATOMIC-SHIP GROUPS

Following Phase 017's file-collision pattern, the following MUST ship in a single PR:

- **Group 1 (YAML ↔ config)**: research+review `.yaml` dispatch branches + research+review `config.json` executor block + prompt-pack templates. Rationale: partial ship leaves config with no YAML to consume it OR YAML referencing missing config.
- **Group 2 (docs ↔ contract)**: SKILL.md updates + loop_protocol.md updates (both skills). Rationale: contract documentation must match implementation.
- **Group 3 (tests ↔ behavior)**: all test files. Rationale: unshipped tests permit silent drift.

Recommended ship order (single PR): all of 1, 2, 3 together. Alternative: 1 + 3 first (gates on tests), then 2 immediately after — but this leaves a brief window with undocumented behavior; not preferred.
<!-- /ANCHOR:atomic-ship -->

---

<!-- ANCHOR:invariants -->
## 9. KEY INVARIANTS PRESERVED

From SKILL.md:46-52 (both skills), these invariants MUST survive:

1. YAML owns state (`deep-research-state.jsonl` / `deep-review-state.jsonl`, strategy doc, registry, dashboard).
2. `scripts/reduce-state.cjs` is the SINGLE state writer (executor contributes passthrough fields only).
3. Every iteration produces BOTH markdown narrative AND JSONL delta (post_dispatch_validate enforces).
4. Lifecycle events (new/resume/restart) continue to route through YAML.
5. Convergence detection stays YAML-driven; executor can't short-circuit.
6. No custom bash dispatcher wraps the loop. The YAML-declared `codex exec` invocation is ONE step inside the YAML, not a replacement for the loop.
<!-- /ANCHOR:invariants -->
