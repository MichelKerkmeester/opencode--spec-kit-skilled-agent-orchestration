# Deep-Review Iteration 1

## Dimension

correctness

Inventory pass plus cognitive carve-out validation and cross-runtime parity audit for `002-memory-terminology`.

## Files Reviewed

- Review target scope: 41 files/target surfaces from the provided iteration packet.
- Identifier surfaces checked: `tool-schemas.ts`, 17 `memory-*.ts` handler filenames, 4 `/memory:*` command files, `_memory:` frontmatter in `spec.md`, `references/memory/`, `scripts/dist/memory/`, SQL table references, and `MEMORY_*` constants.
- Cognitive carve-out checked: 4 requested cognitive files plus the explicit `working_memory`/Miller evidence surface.
- Cross-runtime mirrors checked: 4 context agents and 12 memory slash-command mirrors.
- Operator-facing headline patterns checked across `SKILL.md`, `README.md`, `references/`, and `constitutional/`, excluding `cognitive/`.
- Spec consistency checked: `spec.md` REQ-001..REQ-008 against `phrasing-audit.md` vocabulary key and no-touch/cognitive sections.

## Findings by Severity

### P0

None.

Identifier rename audit passed: all 21 no-touch `memory_*` tool names are present in `tool-schemas.ts`, `/memory:save`, `/memory:search`, `/memory:learn`, and `/memory:manage` remain present in command docs, `_memory:` remains at `spec.md:15`, handler filename count is 17, `references/memory/` and `scripts/dist/memory/` exist, and SQL table names including `working_memory` remain present.

Cognitive loanword substitution audit passed for the checked surfaces: `FSRS` and `Free Spaced Repetition Scheduler` remain in `fsrs-scheduler.ts:5-11`, `working_memory` remains in `working-memory.ts:7` and `working-memory.ts:46`, and Miller's Law remains in `working-memory.ts:29`. Spec-kit row docstrings in the requested cognitive files now use `spec-doc record` where appropriate, for example `fsrs-scheduler.ts:186`, `prediction-error-gate.ts:198`, `temporal-contiguity.ts:113-114`, and `adaptive-ranking.ts:15`.

### P1

#### P1-001 [P1] REQ-004 headline-pattern gate still has operator-facing hits

- File: `.opencode/skill/system-spec-kit/README.md:56`
- Evidence: `spec.md:125` requires abstract `"your memory" / "the memory" / "a memory"` phrasings in `.md` prose to zero out outside cognitive-literature contexts. The required inventory grep still returns 13 hits outside `cognitive/`, including `.opencode/skill/system-spec-kit/SKILL.md:570`, `.opencode/skill/system-spec-kit/README.md:56`, `.opencode/skill/system-spec-kit/README.md:206`, `.opencode/skill/system-spec-kit/README.md:343`, `.opencode/skill/system-spec-kit/README.md:574`, `.opencode/skill/system-spec-kit/README.md:936`, `.opencode/skill/system-spec-kit/README.md:1056`, `.opencode/skill/system-spec-kit/constitutional/README.md:211`, `.opencode/skill/system-spec-kit/constitutional/README.md:225`, `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:205`, `.opencode/skill/system-spec-kit/references/memory/memory_system.md:377`, `.opencode/skill/system-spec-kit/references/memory/memory_system.md:630`, and `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:341`.
- Recommendation: Apply the phrasing-audit vocabulary key to these remaining prose hits, preserving command/tool/path identifiers such as `/memory:*`, `scripts/memory/`, and `references/memory/`.
- Claim: REQ-004 is not satisfied because the explicit zero-hit grep still returns 13 operator-facing matches.
- EvidenceRefs: `spec.md:125`; `.opencode/skill/system-spec-kit/README.md:56`; `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:341`.
- CounterevidenceSought: Excluded `cognitive/` per REQ-007; checked `Loaded [0-9]+ memor` separately and it returned zero.
- AlternativeExplanation: Some hits include identifier-adjacent phrases such as `scripts/memory/` or command names, but the matching noun phrase is still operator-facing prose and the required gate says the grep must zero out.
- finalSeverity: P1
- confidence: 0.93
- downgradeTrigger: Downgrade only if the spec explicitly exempts `the memory system` / identifier-adjacent prose from REQ-004 or the user approves deferral.

#### P1-002 [P1] REQ-005 Anthropic/MCP disambiguation callout is missing from both required READMEs

- File: `.opencode/skill/system-spec-kit/README.md:46`
- Evidence: `spec.md:126` requires a one-paragraph callout in both `.opencode/skill/system-spec-kit/README.md` section 1 and `.opencode/skill/system-spec-kit/mcp_server/README.md` section 1 that begins with `Note:` and names both Anthropic Claude Memory and the MCP reference `memory` server. Searching both READMEs for `Anthropic`, `Claude Memory`, `MCP reference`, `memory server`, and `Note:` returns zero matches. The relevant section starts are `.opencode/skill/system-spec-kit/README.md:46` and `.opencode/skill/system-spec-kit/mcp_server/README.md:41`.
- Recommendation: Add the required `Note:` callout to both overview sections with the same wording or intentionally mirrored wording.
- Claim: REQ-005 is not implemented on either required README surface.
- EvidenceRefs: `spec.md:126`; `.opencode/skill/system-spec-kit/README.md:46`; `.opencode/skill/system-spec-kit/mcp_server/README.md:41`.
- CounterevidenceSought: Searched both READMEs for `Anthropic`, `Claude Memory`, `MCP reference`, `memory server`, and `Note:`.
- AlternativeExplanation: A disambiguation paragraph could exist with completely different wording, but it would still fail the acceptance criterion requiring a sentence beginning `Note:` that names both systems.
- finalSeverity: P1
- confidence: 0.95
- downgradeTrigger: Downgrade only if REQ-005 is explicitly deferred or the acceptance text is amended to allow a non-`Note:` callout.

### P2

None.

## Traceability Checks

- `spec_code`: FAIL. REQ-001 passes; REQ-004 and REQ-005 fail acceptance checks.
- `checklist_evidence`: CONDITIONAL. Iteration evidence is grep/count based; no checklist file was required by the user for this LEAF iteration.
- `skill_agent`: PASS. Shared review doctrine loaded before severity calls.
- `agent_cross_runtime`: PASS. Context-agent counts match across `.opencode`, `.claude`, `.gemini`, and `.codex`: `spec-doc record` = 5, `Record #[ID]` = 2, banned legacy phrases = 0 for each.
- `command_cross_runtime`: PASS. `.opencode/command/memory/*.md` and `.claude/commands/memory/*.md` are md5-identical for `save`, `search`, `learn`, and `manage`; `.gemini/commands/memory/*.toml` `spec-doc record` counts are at least the corresponding `.md` counts.
- `cognitive_carveout`: PASS. Literature identifiers and algorithm constants are preserved on checked surfaces; spec-kit-row docstrings use concrete `spec-doc record` language.
- `feature_catalog_code`: NOT RUN in this focused inventory iteration.
- `playbook_capability`: NOT RUN in this focused inventory iteration.

## Verdict

FAIL.

The scope-freeze no-touch contract and cross-runtime mirror parity hold, but two required correctness gates still fail: REQ-004 headline-pattern zero-out and REQ-005 README disambiguation callouts.

## Next Dimension Recommendation

Proceed to security only after carrying these P1s forward in the registry/delta state. Security is unlikely to depend on the prose fixes, but the release-readiness verdict remains blocked until the two P1s are remediated or explicitly deferred.
