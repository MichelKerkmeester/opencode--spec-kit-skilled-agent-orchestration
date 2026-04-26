# cli-opencode Manual Testing Playbook — Execution Summary

**Run date**: 2026-04-26
**Runtime**: Claude Code (CLAUDECODE=1)
**opencode binary**: `/Users/michelkerkmeester/.superset/bin/opencode`
**Total wall time**: 63.25 seconds (real CLI dispatch wall time only; not agent thinking time)

## Verdict counts

| Verdict | Count | % |
| --- | --- | --- |
| PASS | 9 | 29.0% |
| FAIL | 21 | 67.7% |
| SKIP | 1 | 3.2% |
| **Total** | **31** | **100%** |

## Per-category breakdown

| Category | Range | PASS | FAIL | SKIP |
| --- | --- | --- | --- | --- |
| CLI invocation | CO-001..CO-005 | 1 (CO-004) | 4 | 0 |
| External dispatch | CO-006..CO-008 | 1 (CO-008) | 2 | 0 |
| Multi-provider | CO-009..CO-012 | 0 | 3 | 1 (CO-011) |
| Agent routing | CO-013..CO-017 | 1 (CO-015) | 4 | 0 |
| Session continuity | CO-018..CO-020 | 0 | 3 | 0 |
| Integration patterns | CO-021..CO-022 | 0 | 2 | 0 |
| Prompt templates | CO-023..CO-025 | 3 (all) | 0 | 0 |
| Parallel detached | CO-026..CO-028 | 1 (CO-027) | 2 | 0 |
| Cross-repo / cross-server | CO-029..CO-031 | 2 (CO-030, CO-031) | 1 | 0 |

## Root-cause analysis — one issue dominates

**Primary blocker (18 of 21 FAILs)**: `ProviderModelNotFoundError -- model anthropic/claude-opus-4-7 not in opencode registry`. The anthropic provider is **NOT** in `~/.local/share/opencode/auth.json`; only `openai`, `github-copilot`, `deepseek`, `opencode-go` are registered. Every scenario whose default canonical model is `anthropic/claude-opus-4-7` errored at provider lookup before any tool dispatch.

**Affected scenarios**: CO-001, CO-002, CO-003, CO-005, CO-006, CO-007, CO-009, CO-013, CO-014, CO-016, CO-017, CO-018, CO-019, CO-020 (partial), CO-021, CO-022, CO-026, CO-029.

**Recommended fix**: `opencode auth login anthropic` and re-run all 18 affected scenarios. Expected outcome: most or all flip to PASS once the provider resolves.

**Secondary blocker (CO-010)**: `openai/gpt-5.5` model not in opencode model registry. Available openai models per registry: `gpt-5.2`, `gpt-5.3`, `gpt-5.4` plus codex variants. `gpt-5.5` is referenced in scenario commands but not registered. Either drop the scenario back to `gpt-5.4`, or update the opencode model registry.

**Tertiary finding (CO-013/CO-014)**: cli-opencode skill defaults to `--agent general` but `.opencode/agent/general.md` does NOT exist on disk. Opencode falls back to a default. Other agents (`context`, `write`, `ultra-think`) exist. Either add `.opencode/agent/general.md` or change the cli-opencode default.

**Genuine ratio failures (CO-012, CO-028)**: max/min byte-ratio assertions returned `1128 vs 1128` — output sizes were equal across variants, expected ratio ≥ 2.0. May indicate the variant flag (e.g., `--variant high` vs `--variant low`) is not being honored by the dispatch path, or that opencode is producing identical output regardless of variant. Worth a focused investigation independent of the auth fix.

## Self-invocation refusal verification (CO-008, CO-031)

Both PASS. The skill's layered guard works as documented:
- **CO-008**: in-OpenCode self-dispatch refusal path. Guard refused with documented refusal message. PASS.
- **CO-031**: cross-repo nested guard. Layer 1 trips on `OPENCODE_CONFIG_DIR`; `has_parallel_session_keywords` is the documented bypass (NOT `--dir`); 3+ remediation keywords found in `integration_patterns.md`. PASS.

## Confirmed-working surface (9 PASSes)

CO-004 (attachment summarization), CO-008 (self-invoke refusal), CO-015 (agent routing path), CO-023, CO-024, CO-025 (prompt templates — all three), CO-027 (parallel detached: 3 distinct session ids), CO-030 (--attach + opencode attach subcommand documented), CO-031 (cross-repo guard).

## SKIP

- **CO-011**: Google/Gemini provider not authenticated in opencode auth.json. SKIPped with documented reason.

## Outputs

- Per-scenario JSONL: `results.jsonl` (31 lines)
- Per-scenario evidence: `evidence/CO-NNN/` (31 directories)

## Recommended next actions

1. **`opencode auth login anthropic`** — unblocks 18 FAILs; re-run those scenarios.
2. **Add `.opencode/agent/general.md`** OR change cli-opencode skill's default agent — unblocks default-agent path.
3. **Fix CO-010** — drop to `gpt-5.4` in scenario or register `gpt-5.5` in opencode model list.
4. **Investigate CO-012 / CO-028** — variant flag may not be honored by dispatch.
