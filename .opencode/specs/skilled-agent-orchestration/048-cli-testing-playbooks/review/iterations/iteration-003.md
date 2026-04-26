---
title: "Iteration 003 -- Traceability Review"
description: "Traceability audit between spec 048 docs, five cli-* manual testing playbooks, and the underlying CLI skill surfaces they document."
---

# Iteration 003: Traceability Review

## Metadata
- Dimension: traceability
- Executor: cli-copilot/gpt-5.5/high
- Files inspected: 131
- Prompt sync scope: 115 per-feature files, all 5 root playbooks
- Source-anchor scope: 502 cited source rows, with 5 sampled anchors per playbook plus full existence scan

## Findings

### P0 (Blockers)

- [P0] [CO-006:.opencode/skill/cli-opencode/manual_testing_playbook/02--external-dispatch/001-from-claude-code.md:28] The structured `Prompt:` in `## 2. SCENARIO CONTRACT` does not equal the `Exact Prompt` cell in the 9-column row at line 51. The row abbreviates the spec folder as `/Users/.../048-cli-testing-playbooks/` and drops the final `Memory Epilogue is NOT required for this test.` sentence, so the operator has two competing canonical prompts. Remediation: make the row's Exact Prompt byte-for-byte match the SCENARIO CONTRACT prompt, or update both locations together if the abbreviated path is intentional.
- [P0] [CX-004:.opencode/skill/cli-codex/manual_testing_playbook/01--cli-invocation/004-explicit-fast-service-tier.md:71] `## 4. SOURCE FILES` cites `~/.claude/projects/.../memory/feedback_codex_cli_fast_mode.md`, but that is an ellipsis path and no real file exists at the expanded path or under the repo/skill tree. This is a broken source anchor for the auto-memory rule that the scenario treats as authoritative. Remediation: replace the ellipsis reference with a real committed source, a spec-folder ADR/checklist reference, or a concrete memory artifact path that exists on disk.
- [P0] [.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/implementation-summary.md:141] The HVR residual-count claim is contradicted by current grep counts across the five cli-* playbook trees. The summary says em-dashes `251 -> 98`, semicolons `585 -> 150`, Oxford commas `770 -> 261`, and banned words `5 -> 0`; current raw counts are em-dashes `180`, semicolons `1058`, Oxford-style `, and/or` matches `377`, and banned words `simply=1`. Each claimed residual is off by more than 5%. Remediation: rerun the HVR counter with the documented scope and either update the summary to current numbers or rerun remediation until the claimed counts are true.
- [P0] [.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/implementation-summary.md:142] The section-rename count claim is also off by more than 5%. The summary claims 14 playbook trees plus source-of-truth files produce `504 files total` with `## 2. SCENARIO CONTRACT`; `find`/`grep` currently reports 14 `manual_testing_playbook/` trees, 590 playbook markdown files with the new heading, 0 old `## 2. CURRENT REALITY` headings in those playbook trees, and 598 `.opencode` markdown files with the new heading in the broader checked scope. Remediation: keep the PASS completeness claim, but replace the stale 504 count and source-of-truth-file count with the current grep evidence.

### P1 (Required)

- [P1] [.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/checklist.md:85] CHK-040/041/042 verify the ADR-001 category invariants, but none of the three checklist rows references ADR-001 even though the traceability contract requires that cross-link. Remediation: append `(ADR-001)` or an explicit `decision-record.md#adr-001...` reference to CHK-040, CHK-041, and CHK-042.
- [P1] [.opencode/skill/cli-claude-code/SKILL.md:208] The cli-claude-code SKILL.md documents a 9-agent delegation roster (`context`, `debug`, `handover`, `orchestrate`, `research`, `review`, `speckit`, `ultra-think`, `write`) plus `--max-budget-usd` and background-processing support, but the playbook exercises only four agents (`context`, `debug`, `review`, `ultra-think`) and has no scenario for cost caps/background processing. Remediation: add scenarios or root-level deferrals for `handover`, `orchestrate`, `research`, `speckit`, `write`, `--max-budget-usd`, and background dispatch so the playbook surface matches the skill surface.
- [P1] [.opencode/skill/cli-codex/SKILL.md:238] The cli-codex SKILL.md documents profile routing for `review`, `context`, `research`, `write`, `debug`, and `ultra-think`, plus unique `codex cloud` support at line 263. The playbook covers review/context/debug/ultra-think and separate `--search`, image, MCP, and TUI review paths, but it does not exercise `-p research`, `-p write`, or `codex cloud`. Remediation: add per-feature scenarios for the missing profiles/cloud command or document an explicit out-of-scope deferral in the root playbook and implementation summary.
- [P1] [.opencode/skill/cli-gemini/SKILL.md:188] The cli-gemini SKILL.md documents six Gemini agents including `@debug`; the playbook covers `@context`, `@review`, `@deep-research`, `@write`, and `@ultra-think`, but never exercises the documented debug route. Remediation: add a debug-agent scenario, or mark `@debug` as intentionally deferred with a reason tied to the skill surface.
- [P1] [.opencode/skill/cli-opencode/SKILL.md:245] The cli-opencode SKILL.md documents agent dispatch for `general`, `context`, `review`, `ultra-think`, `deep-research`, `deep-review`, `write`, and `orchestrate`, while the playbook's agent-routing category covers only `general`, `context`, `review`, `write`, and `ultra-think`. This leaves the deep-loop and orchestration agents unexercised despite being major advertised capability. Remediation: add scenarios for `--agent deep-research`, `--agent deep-review`, and `--agent orchestrate`, or add explicit deferral rows explaining why deep-loop/orchestration coverage is excluded from this manual playbook.

### P2 (Suggestions)

- [P2] [.opencode/skill/cli-opencode/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:301] Root category summaries are not byte-for-byte prompt echoes for 76 of 115 scenarios. Per-feature SCENARIO CONTRACT prompts and 9-column Exact Prompt cells are synced for 114/115 files, but root summaries frequently compress, add backticks, or omit context (examples: CC-001, CP-001, CG-002, CO-006). Remediation: either rename root fields to `Prompt summary` and relax the equality rule, or make each root prompt block quote the exact prompt from the per-feature file.

## Evidence

Commands run:

```bash
python3 - <<'PY'
# Parsed all 115 per-feature files:
# - extracted `- Prompt: ...`
# - parsed the 9-column table row with escaped-pipe/backtick awareness
# - compared root Prompt/Prompt summary blocks
# - checked root Feature File Index links both directions
# - resolved all SOURCE FILES entries against feature dir, playbook root, skill root, repo root, and ~
PY

find . -type d -name manual_testing_playbook | sort
rg -l '^## 2\. CURRENT REALITY$' .opencode/skill .opencode/command .opencode/specs
rg -l '^## 2\. SCENARIO CONTRACT$' .opencode/skill .opencode/command .opencode/specs
python3 - <<'PY'
# Counted per-feature files, prefixes, category folders, HVR residuals,
# SCENARIO CONTRACT files in 14 playbook trees, and old heading remnants.
PY
```

Relevant output snippets:

```text
== prompt sync + root index + source anchors ==
cli-claude-code files 20 prompt_mismatch 0 root_prompt_drift 20 links 20 unlinked 0 broken 0 sources 83 missing_sources 0
cli-codex      files 25 prompt_mismatch 0 root_prompt_drift 0  links 25 unlinked 0 broken 0 sources 134 missing_sources 1
cli-copilot    files 21 prompt_mismatch 0 root_prompt_drift 15 links 21 unlinked 0 broken 0 sources 86 missing_sources 0
cli-gemini     files 18 prompt_mismatch 0 root_prompt_drift 10 links 18 unlinked 0 broken 0 sources 72 missing_sources 0
cli-opencode   files 31 prompt_mismatch 1 root_prompt_drift 31 links 31 unlinked 0 broken 0 sources 127 missing_sources 0

source_refs_total 502 missing_flexible 1
MISS cli-codex CX-004 .../004-explicit-fast-service-tier.md:71 src= ~/.claude/projects/.../memory/feedback_codex_cli_fast_mode.md
```

```text
== source-anchor samples (5 per playbook) ==
cli-claude-code: MANUAL_TESTING_PLAYBOOK.md OK; ../../references/cli_reference.md OK; ../../SKILL.md OK; ../../references/integration_patterns.md OK; ../../references/claude_tools.md OK
cli-codex: MANUAL_TESTING_PLAYBOOK.md OK; ../../SKILL.md OK; ../../references/cli_reference.md OK; ../../references/codex_tools.md OK; ~/.claude/projects/.../memory/feedback_codex_cli_fast_mode.md MISS
cli-copilot: MANUAL_TESTING_PLAYBOOK.md OK; ../../SKILL.md OK; ../../references/cli_reference.md OK; ../../assets/prompt_quality_card.md OK; ../../references/copilot_tools.md OK
cli-gemini: MANUAL_TESTING_PLAYBOOK.md OK; ../../SKILL.md OK; ../../references/cli_reference.md OK; ../../assets/prompt_quality_card.md OK; ../../references/integration_patterns.md OK
cli-opencode: MANUAL_TESTING_PLAYBOOK.md OK; ../../references/cli_reference.md OK; ../../SKILL.md OK; ../../references/opencode_tools.md OK; ../../references/integration_patterns.md OK
```

```text
== ADR/checklist/summary consistency ==
ADR-001 implementation links: decision-record.md lines 37-123; implementation-summary.md line 122 references ADR-001.
Checklist gap: CHK-040/041/042 lines 85-87 name the invariant categories but do not cite ADR-001.
ADR-002 prefix verification: CC=20, CX=25, CP=21, CG=18, CO=31; bad_prefix=0 for all five playbooks.
ADR-005 provenance: implementation-summary.md lines 111 and 126 document @write dispatch through the canonical command path.
```

```text
== implementation-summary count checks ==
per_feature_counts: cli-claude-code=20, cli-codex=25, cli-copilot=21, cli-gemini=18, cli-opencode=31, total=115
category_counts: cli-claude-code=7, cli-codex=8, cli-copilot=8, cli-gemini=6, cli-opencode=9, total=38
hvr_raw_current_5_cli: emdash=180, semicolon=1058, oxford_and_or=377, banned_words={utilize:0, leverage:0, robust:0, seamless:0, simply:1}
manual_testing_playbook roots: 14
manual_playbook_current=590, manual_playbook_old=0, manual_playbook_intro=449
repo_scope_current=598, repo_scope_old=397
```

```text
== section-rename completeness ==
All 14 manual_testing_playbook trees contain 0 files with exact old heading `## 2. CURRENT REALITY`.
All 115 cli-* per-feature files contain the intro sentence pattern:
Operators run the exact prompt and command sequence for `<ID>` and confirm the expected signals without contradictory evidence.
The prose still makes sense under `## 2. SCENARIO CONTRACT`.
```

```text
== CLI skill surface alignment ==
cli-claude-code SKILL.md lines 208-218 list 9 agents; root playbook agent coverage is CC-011..CC-014 only.
cli-codex SKILL.md lines 238-247 list 6 profiles; line 263 lists `codex cloud`; root playbook does not cover research/write profiles or cloud.
cli-gemini SKILL.md lines 188-195 lists @debug; root playbook covers the other documented agents but not debug.
cli-opencode SKILL.md lines 245-254 lists deep-research/deep-review/orchestrate; root playbook CO-013..CO-017 covers only general/context/review/write/ultra-think.
cli-copilot SKILL.md lines 240-257 maps cleanly to existing playbook coverage: baseline `-p`, allow-all-tools, no-ask-user, all five models across scenarios, Autopilot, Explore/Task agents, repo memory, MCP, and cloud delegation.
```

## newFindingsRatio
1.0

## Convergence Signal
Traceability review should continue. The prompt-contract core is mostly strong (114/115 per-feature prompt pairs sync and all per-feature files are linked from their root index), but the remaining CO-006 prompt mismatch is a blocker because it creates two canonical prompts. Source anchors are also mostly intact after flexible path resolution, with one concrete broken anchor. The larger unresolved traceability risk is stale or overstated documentation: implementation-summary counts no longer match grep output, checklist rows miss ADR-001 links, and several playbooks under-cover major surfaces advertised by their SKILL.md files.
