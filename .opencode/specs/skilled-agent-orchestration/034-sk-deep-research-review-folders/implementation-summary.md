---
title: "Implementation Summary [skilled-agent-orchestration/034-sk-deep-research-review-folders/implementation-summary]"
description: "Review mode now stores its durable packet under review/, including the final report, with a legacy scratch-to-review migration path, synchronized runtime and documentation contracts, and follow-up command-surface compatibility fixes."
trigger_phrases:
  - "review folder implementation summary"
  - "review folder summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/034-sk-deep-research-review-folders"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["implementation-summary.md"]
---
# Implementation Summary: sk-deep-research Review Folder Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

This packet is now implemented. Review mode no longer treats `scratch/` as the durable home for state and synthesis output. The canonical review packet now lives under `{spec_folder}/review/`, and the runtime contract, assets, docs, and operator playbooks were updated together so review-mode state is stored consistently. A follow-up remediation pass also aligned the shared command surfaces so both `specs/` and `.opencode/specs/` alias roots remain valid and the parallel `.agents` wrapper reflects the review-mode entrypoints.

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Completed** | 2026-03-27 |
| **Level** | 3 |
| **Primary Outcome** | Review-mode config, JSONL state, strategy, dashboard, iteration files, pause sentinel, and final report now live under `review/` |
| **Implementation Footprint** | Workflow, runtime, asset, wrapper, and documentation surfaces updated across the deep-research command family |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the full review-folder contract across the planned surfaces:

- Review auto and confirm workflows now use `{spec_folder}/review/` for config, JSONL state, strategy, dashboard, iteration files, the pause sentinel, and the final review report inside the review packet.
- Both review workflows now include explicit legacy scratch-to-review migration steps with a review-artifact whitelist and conflict-halting behavior.
- Runtime `deep-review` agents across `.opencode`, `.claude`, `.codex`, and `.gemini` now read and write only `review/` artifacts inside the active spec folder.
- The review-mode asset layer now matches the runtime contract via `review_mode_contract.yaml` plus the deep-review strategy and dashboard templates.
- User-facing docs, review references, review-mode playbooks, and the shared pause-resume playbooks were synchronized so review mode points at the durable `review/` packet while research mode keeps its existing `scratch/` behavior.
- The shared deep-research command surfaces now accept both `specs/` and `.opencode/specs/` alias roots for spec-folder validation without changing the research-mode scratch storage contract.
- The parallel `.agents` TOML wrapper now advertises the `:review`, `:review:auto`, and `:review:confirm` entrypoints instead of exposing only research-mode suffixes.
- Recovery docs now distinguish research-mode scratch backups from review-mode preservation of the durable `review/` packet.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation was delivered in three coordinated tracks:

- Main-thread workflow and asset changes:
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`
  - `.opencode/skill/sk-deep-research/assets/review_mode_contract.yaml`
  - `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
  - `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
- Shared command-surface compatibility follow-up:
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
  - `.opencode/command/spec_kit/deep-research.md`
  - `.agents/commands/spec_kit/deep-research.toml`
- Parallel runtime parity pass:
  - `.opencode/agent/deep-review.md`
  - `.claude/agents/deep-review.md`
  - `.codex/agents/deep-review.toml`
  - `.gemini/agents/deep-review.md`
- Parallel documentation and playbook sync:
  - `.opencode/command/spec_kit/deep-research.md`
  - `.opencode/skill/sk-deep-research/SKILL.md`
  - `.opencode/skill/sk-deep-research/README.md`
  - review-focused references under `.opencode/skill/sk-deep-research/references/`
  - review playbooks under `.opencode/skill/sk-deep-research/manual_testing_playbook/07--review-mode/`
  - shared pause or resume playbooks `015` and `016`
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the full review packet into `review/` | This resolves the conflict between durable review state and the repo rule that `scratch/` is disposable |
| Add targeted legacy migration | Existing scratch-based review sessions should not be stranded by the folder change |
| Keep review-mode basenames stable | The change stays scoped to folder relocation rather than introducing a second contract change through mass renaming |
| Keep manual sync explicit | No generator surfaced during implementation, so runtime, asset, and doc parity were updated together as one manual contract sweep |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Review YAML parse | PASS via `ruby -e 'require "yaml"; ... YAML.load_file(...)'` for the two review YAMLs and `review_mode_contract.yaml` |
| Diff hygiene | PASS via `git diff --check` across the deep-research workflow, wrapper, documentation, and packet files touched in this packet |
| Diff footprint | PASS via focused `git diff --stat` on the changed deep-research command surfaces and follow-up packet sync |
| Shared spec-root compatibility guard | PASS via direct inspection of `spec_folder_is_within` in the deep-research auto, confirm, review-auto, and review-confirm YAMLs after widening alias-root acceptance |
| Research-mode storage contract drift | PASS because the research auto and confirm YAMLs changed only in the shared spec-root validation guard; their scratch-based state paths and storage contract were left intact |
| Runtime parity sweep | PASS via worker verification over `.opencode`, `.claude`, `.codex`, and `.gemini` deep-review files |
| Doc and playbook sweep | PASS via worker verification over the review-mode docs, references, and playbooks, plus the follow-up recovery-text corrections in the shared loop protocol and README |
| `.agents` command wrapper parity | PASS via direct inspection of `.agents/commands/spec_kit/deep-research.toml` after updating its description and argument hint to match the shared command entrypoint |
| Review-path contract sweep | PASS for targeted surfaces; remaining review-side `scratch/` references are deliberate legacy-migration inputs |
| Strict packet validation | PASS via `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh 'specs/03--commands-and-skills/034-sk-deep-research-review-folders' --strict` |
| Live review-run replay | NOT RUN in this session |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. This session did not execute a fresh review run or a legacy scratch-based fixture replay, so CHK-020 and CHK-021 remain open until runtime behavior is exercised.
2. The implementation searched first-party consumers for the review report path, but unknown external or downstream consumers of the former spec-root review report were not proven absent.
3. Contract sync remains manual; there is still no discovered generator enforcing parity from `review_mode_contract.yaml` into every consumer surface, including the parallel `.agents` command wrappers.
<!-- /ANCHOR:limitations -->
