# Phase E+F Implementation — Setup Flags + Contract Documentation (6 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor/`
**Phases A-D COMPLETE**: 40/40 tests green, all 4 YAMLs refactored, shared modules shipped.
**Your role**: Execute Phase E + Phase F tasks (T-FLG-01/02 + T-DOC-01/02/03/04). Bundled because both are markdown documentation edits with low blast radius.

**First line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 018 Phase E+F`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Phase E — Setup Flag Parsing in Command Docs

### T-FLG-01 — Add executor flags to deep-research command setup

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/deep-research.md`

Locate the consolidated setup prompt section (the markdown block that parses `--max-iterations`, `--convergence`, `--spec-folder` flags from user input during Phase 0 setup). Extend the parser to also recognize these new flags:

```
--executor=<kind>            → config.executor.kind  (accepts: native | cli-codex)
--model=<id>                 → config.executor.model  (e.g. "gpt-5.4")
--reasoning-effort=<level>   → config.executor.reasoningEffort  (none/minimal/low/medium/high/xhigh)
--service-tier=<tier>        → config.executor.serviceTier  (priority/standard/fast)
--executor-timeout=<seconds> → config.executor.timeoutSeconds  (positive integer; default 900)
```

Requirements:

1. **Precedence**: CLI flag > config file > schema defaults. Document this explicitly in the setup section.
2. **Q Prompt inclusion**: Add a new question (Q-Exec) to the consolidated setup prompt that asks about executor selection ONLY when:
   - `--executor` flag is NOT present, AND
   - The research topic text does not mention "cli-codex", "codex", "gpt-5.4", etc.
   
   When omitted, default is `native`. Q-Exec wording:
   
   > **Q-Exec. Executor (optional, press enter for default):**
   >   A) Native (default) — dispatch via @deep-research agent with Opus.
   >   B) cli-codex — dispatch via codex exec. Requires --model. Example: `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast`.

3. **Parsing-to-config mapping**: Explicitly document how each flag maps to the `config.executor.*` block in the generated `deep-research-config.json`.

4. **Validation hook**: Note that `parseExecutorConfig` from `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` is invoked at config-write time; invalid combinations (cli-codex without model, unwired kinds) fail fast with clear errors.

5. **Reply format example**: Extend the existing "Reply format examples" section to include at least one with executor flags, e.g.:
   
   `"WebSocket reconnection strategies, B, A, 10, 0.05, B, gpt-5.4, high, fast"`

Keep the existing flag parsing for max-iterations, convergence, spec-folder intact.

### T-FLG-02 — Mirror to deep-review command setup

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/deep-review.md`

Add the SAME executor flag parsing + Q-Exec question. Substitute the agent reference (`@deep-review` instead of `@deep-research`) where applicable. Reply format examples should mention review-specific topics.

---

## Phase F — Contract Documentation

### T-DOC-01 — Replace sk-deep-research SKILL.md forward-looking note with CONTRACT

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md`

**Current content at line 61** (inside FORBIDDEN INVOCATION PATTERNS section, after ALWAYS list):

> **If the user specifies an executor CLI** ("use cli-copilot gpt-5.4 high"), that selects the HOW — the executor still runs INSIDE the command's workflow. The CLI executor is a tool inside the command, not a replacement for the command.

Replace the single line with a full **CONTRACT** section that documents the now-shipped feature:

```markdown
### Executor Selection Contract

The YAML workflow supports executor selection via `config.executor.kind`. Current shipped kinds:

| Kind | Dispatch | Required fields | Status |
|------|----------|----------------|--------|
| `native` | `@deep-research` agent via Task tool, `model: opus` | none (default) | Shipped. Default. |
| `cli-codex` | `codex exec` via stdin-piped rendered prompt | `model` (e.g. gpt-5.4) | Shipped (spec 018). |
| `cli-copilot` | Reserved | — | Not wired — awaits future spec. |
| `cli-gemini` | Reserved | — | Not wired — awaits future spec. |
| `cli-claude-code` | Reserved | — | Not wired — awaits future spec. |

**Invariants** the executor MUST satisfy regardless of kind:

1. Produce an iteration markdown file at `{state_paths.iteration_pattern}` (non-empty).
2. Append a JSONL delta record to `{state_paths.state_log}` with required fields: `type`, `iteration`, `newInfoRatio`, `status`, `focus`. Optional: `graphEvents`.
3. Respect the LEAF-agent constraint: no sub-dispatch, no nested loops. Max 12 tool calls per iteration.

**Failure modes**:

- Missing iteration file → `iteration_file_missing` from `post-dispatch-validate.ts`, emits `schema_mismatch` conflict event.
- Empty iteration file → `iteration_file_empty`, same downstream.
- JSONL not appended → `jsonl_not_appended`.
- JSONL missing required fields → `jsonl_missing_fields`.
- JSONL malformed → `jsonl_parse_error`.
- 3 consecutive failures → existing `stuck_recovery` event (unchanged).

**JSONL audit field**: Non-native executor runs append an `executor: {kind, model, reasoningEffort, serviceTier}` block to the iteration's JSONL record via `executor-audit.ts`. Native runs are NOT audited (the default path is recoverable from YAML alone).

**Template**: The executor-agnostic iteration prompt lives at `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl`. It is rendered by `prompt-pack.ts` before dispatch and either (a) injected as the agent's context (native) or (b) piped to `codex exec` stdin (cli-codex).

**Config surface**: Defined in `assets/deep_research_config.json` under the `executor` key. Schema is in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. CLI flag precedence is: `--executor/--model/--reasoning-effort/--service-tier/--executor-timeout > config file > schema default`.

**What NEVER changes regardless of executor kind**:

- YAML owns state (`deep-research-state.jsonl`, strategy.md, registry, dashboard).
- `reduce-state.cjs` is the single state writer.
- Convergence detection, lifecycle events (new/resume/restart), and stuck_recovery all stay YAML-driven.
- The `@deep-research` LEAF agent definition is untouched — it is the native executor, not the only one.
```

Preserve everything before line 46 (the FORBIDDEN INVOCATION section opener) and everything after the current line 61 (the "Keyword Triggers" section). The replacement block goes in place of just the single forward-looking paragraph.

### T-DOC-02 — Mirror to sk-deep-review SKILL.md

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`

Locate the equivalent forward-looking paragraph (around line 63). Replace with the SAME CONTRACT section structure from T-DOC-01, with substitutions:

- `@deep-research` → `@deep-review`
- `newInfoRatio`, `status`, `focus` → `type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, `newFindingsRatio` (review's JSONL schema).
- Template path → `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`.
- Config path → `assets/deep_review_config.json`.
- "convergence detection" bullet: also mention review dimensions pass (correctness, security, traceability, maintainability).

Preserve surrounding SKILL.md structure.

### T-DOC-03 — Add Executor Resolution subsection to sk-deep-research loop_protocol.md

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md`

Locate Section 3 (PHASE: ITERATION LOOP → Step 3: Dispatch Agent). Add a new subsection immediately after Step 3's current content:

```markdown
#### Executor Resolution (spec 018)

Before dispatching, the YAML resolves the executor via `parseExecutorConfig` from `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects the dispatch branch:

- `native`: the loop proceeds exactly as documented below (dispatch `@deep-research` with model Opus).
- `cli-codex`: the rendered prompt pack is piped via stdin to `codex exec --model <gpt-5.4|other> -c model_reasoning_effort="<level>" -c service_tier="<tier>" -c approval_policy=never --sandbox workspace-write`.

Both branches share:
1. Pre-dispatch prompt rendering via `renderPromptPack` (writes to `{spec_folder}/research/prompts/iteration-{n}.md`).
2. Post-dispatch validation via `validateIterationOutputs` (asserts iteration file + JSONL delta + required fields).
3. Executor audit append via `appendExecutorAuditToLastRecord` (skipped when kind=='native').

Failure handling within `post_dispatch_validate` follows the existing `schema_mismatch` → conflict event → 3-consecutive-failures → `stuck_recovery` path. Executor kind does not alter recovery semantics.
```

Preserve Section 3's existing content (do not delete the agent dispatch documentation — the new subsection is additive).

### T-DOC-04 — Mirror to sk-deep-review loop_protocol.md

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md`

Find the equivalent Section 3 Dispatch Agent subsection. Add the SAME Executor Resolution subsection with `@deep-research` → `@deep-review` substitutions.

---

## Invariants (Phases E + F)

- No new code. No new tests.
- No deletion of existing content (these are additive documentation edits).
- Cross-file consistency: both SKILL.md CONTRACT sections must be structurally parallel; both loop_protocol.md subsections must be parallel.
- Technical accuracy: all file paths and function names referenced must match what Phases A-D shipped. Spot-check by grepping for the referenced symbols.

## Verification

Run:

```bash
# Confirm docs mention the new flags
grep -l "executor" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/deep-research.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/deep-review.md

# Confirm CONTRACT sections exist
grep -A 2 "Executor Selection Contract\|Executor Resolution" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md | head -30

# Re-run tests (should still pass unchanged)
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx vitest run tests/deep-loop/ 2>&1 | tail -5
```

## Output format (final line)

```
PHASE_EF_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
COMMAND_DOCS_UPDATED: [deep-research.md, deep-review.md]
SKILL_DOCS_UPDATED: [sk-deep-research/SKILL.md, sk-deep-review/SKILL.md, both loop_protocol.md]
VITEST_RESULT: [<n>/<m> passed]
SYMMETRY_CHECK: [research ↔ review docs parallel: yes | no + detail]
NEXT_STEPS: <follow-ups>
```
</content>
</invoke>
