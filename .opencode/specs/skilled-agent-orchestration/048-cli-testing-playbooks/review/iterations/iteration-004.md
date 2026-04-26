---
title: "Iteration 004 -- Maintainability Review"
description: "Maintainability audit of HVR residual classification, naming consistency, invariant-category content shape, section-rename completeness, future-update friction, DQI readability, and spec-doc accuracy across the five cli-* manual testing playbooks."
---

# Iteration 004: Maintainability Review

## Metadata
- Dimension: maintainability
- Executor: cli-copilot/gpt-5.5/high
- Files inspected: 131
- HVR sample: 20 deterministic random residual hits, seed 48004
- Section-rename spot-check: 10 deterministic random per-feature files, seed 48040
- DQI prompt sample: 5 deterministic random per-feature files, seed 48041

## Findings

### P0 (Blockers)

- [P0] [.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/implementation-summary.md:149] The implementation summary says all remaining HVR residuals live in protected zones, but a deterministic 20-hit sample found a true body-text violation, and the full classifier found 29 non-protected body-text hits. One sampled miss is `.opencode/skill/cli-copilot/manual_testing_playbook/02--multi-model/001-explicit-model-selection-gpt54.md:32`, where the prose line contains an Oxford-style `errors, or bogus call exits 0` clause outside frontmatter, inline code, a 9-column table cell, or a parenthesized ID list. This makes the HVR residual classification claim false and leaves the cleanup pass incomplete. Remediation: rerun HVR cleanup on non-protected narrative body text, expand the residual classifier to distinguish fenced/table/code/frontmatter zones consistently, then update the implementation summary with current counts and a reproducible classifier command.

### P1 (Required)

- [P1] [.opencode/command/create/assets/create_testing_playbook_auto.yaml:170] The section-rename pass did not fully update the future-update workflow: both create-testing-playbook YAML workflows still list `CURRENT REALITY` as a required feature-file section, while the sk-doc creation reference and snippet template now require `SCENARIO CONTRACT`. The auto workflow can therefore guide future update runs back toward the old section name even though the existing 115 target files have the new heading. Remediation: update the auto and confirm workflows' feature-file requirements from `CURRENT REALITY` to `SCENARIO CONTRACT`, then add a workflow-level validation check that rejects new playbook feature files with the old heading.
- [P1] [.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/decision-record.md:63] ADR-001 claims categories `01--cli-invocation`, `06--integration-patterns`, and `07--prompt-templates` are cross-CLI invariants, but category `06--integration-patterns` no longer teaches a consistent lesson across CLIs. In the same invariant slot, cli-codex mixes generate-review-fix, web search, and image input; cli-copilot mixes generate-review-fix, MCP discovery, and shell-wrapper context injection; cli-opencode focuses on Codex handback and Memory Epilogue handback. The shared number is stable, but the content shape is broad enough that the invariant is partly cosmetic. Remediation: either split `06--integration-patterns` into named subpatterns with a per-CLI mapping table, or narrow the invariant to the common generate/review/fix and handback lesson with CLI-specific extras clearly labeled as non-invariant add-ons.
- [P1] [.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md:158] The documented prompt-sync rule requires the SCENARIO CONTRACT prompt, the 9-column `Exact Prompt`, and any root summary prompt text to stay synchronized, but root playbooks manually duplicate prompt summaries and the sampled/root parser found 76 of 115 root prompts are not exact matches after normalization. The per-feature prompt and scenario-row prompt were synced in all 10 section spot-checks, but root summaries still require manual parallel maintenance and there is no validation gate for that third surface. Remediation: generate root prompt summaries from per-feature files, or change the root field to `Prompt summary` with an explicit non-equality rule and add a validator that checks semantic presence instead of byte-for-byte equality.

### P2 (Suggestions)

None.

## Evidence

Commands run:

```bash
python3 - <<'PY'
# Enumerated the 5 target cli-* manual_testing_playbook trees:
# - counted 120 markdown files (115 per-feature + 5 roots)
# - sampled 20 HVR hits from em-dash, semicolon and Oxford-comma residuals
# - classified each hit as protected or body text
# - checked feature ID prefixes, category folder names and per-feature filenames
# - summarized invariant category file inventories
PY

python3 - <<'PY'
# Parsed 115 per-feature files and 5 root playbooks:
# - sampled 10 per-feature files for ## 2. SCENARIO CONTRACT coherence
# - compared SCENARIO CONTRACT Prompt to 9-column Exact Prompt
# - compared root prompt text when present
# - sampled 5 prompts for Role / Context / Action / Format readability
# - grouped title keywords to detect obvious scenario redundancy
PY

rg "CURRENT REALITY|SCENARIO CONTRACT" \
  .opencode/command/create/assets/create_testing_playbook_auto.yaml \
  .opencode/command/create/assets/create_testing_playbook_confirm.yaml \
  .opencode/skill/sk-doc/assets/documentation/testing_playbook \
  .opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md
```

Relevant output snippets:

```text
file_count 120 per_feature 115 roots 5

== HVR raw counts ==
Counter({'semicolon': 1058, 'oxford': 377, 'emdash': 180})
total_hits 1615

== HVR sample seed=48004 ==
sample_class_counts Counter({'protected:table-cell': 12, 'protected:inline-backtick-code': 7, 'VIOLATION:body-text': 1})
full_class_counts Counter({'protected:table-cell': 986, 'protected:inline-backtick-code': 579, 'VIOLATION:body-text': 29, 'protected:frontmatter-description': 21})

sample body-text miss:
oxford  VIOLATION:body-text  .opencode/skill/cli-copilot/manual_testing_playbook/02--multi-model/001-explicit-model-selection-gpt54.md:32
```

```text
== Naming consistency ==
cli-claude-code categories 7 badcats [] files 20 badfiles 0 badids [] seq_minmax (1, 20) missing_seq []
cli-codex      categories 8 badcats [] files 25 badfiles 0 badids [] seq_minmax (1, 25) missing_seq []
cli-copilot    categories 8 badcats [] files 21 badfiles 0 badids [] seq_minmax (1, 21) missing_seq []
cli-gemini     categories 6 badcats [] files 18 badfiles 0 badids [] seq_minmax (1, 18) missing_seq []
cli-opencode   categories 9 badcats [] files 31 badfiles 0 badids [] seq_minmax (1, 31) missing_seq []
```

```text
== Invariant categories content ==
CATEGORY 01--cli-invocation
cli-claude-code count 4: base invocation, default model, output formats, stream-json
cli-codex      count 4: default invocation, model lock, exec review, fast service tier
cli-copilot    count 3: direct prompt, allow-all-tools, no-ask-user
cli-gemini     count 3: direct prompt, JSON output, explicit model
cli-opencode   count 5: base invocation, JSON format, --dir, --file, --pure/logs

CATEGORY 06--integration-patterns
cli-claude-code count 2: generate-review-fix, structured JSON schema
cli-codex      count 3: generate-review-fix, web search, image input
cli-copilot    count 3: generate-review-fix, MCP discovery, shell wrapper context injection
cli-gemini     count 3: generate-review-fix, JSON output processing, background parallel dispatch
cli-opencode   count 2: Codex handback, Memory Epilogue handback

CATEGORY 07--prompt-templates
cli-claude-code count 2: prompt template usage, CLEAR card
cli-codex      count 2: prompt template inventory, CLEAR scoring
cli-copilot    count 2: template substitution, CLEAR card
cli-gemini     count 2: template substitution, CLEAR card
cli-opencode   count 3: template inventory, CLEAR card, template applied to real dispatch
```

```text
== Section rename + prompt sync spot seed=48040 ==
10/10 sampled files had ## 2. SCENARIO CONTRACT
10/10 sampled files had coherent intro line:
  Operators run the exact prompt and command sequence for `<ID>` and confirm the expected signals without contradictory evidence.
10/10 sampled files had SCENARIO CONTRACT Prompt equal to the scenario-row Exact Prompt.
8/10 sampled files had root prompt text that was present but not byte-for-byte equal to the per-feature Prompt.

full_prompt_row_mismatch 5
full_root_prompt_drift 76
full_intro_bad 0
```

```text
== DQI prompt sample seed=48041 ==
CP-002 role=True context=True action=True format=True words=63
CC-019 role=True context=False action=True format=True words=69
CP-014 role=True context=True action=True format=True words=98
CO-021 role=True context=True action=True format=True words=99
CX-002 role=True context=True action=True format=True words=61

No sampled prompt was a bare command paraphrase.
```

```text
== Section source-of-truth drift ==
.opencode/command/create/assets/create_testing_playbook_auto.yaml:170:    - CURRENT REALITY
.opencode/command/create/assets/create_testing_playbook_confirm.yaml:184:    - CURRENT REALITY
.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md:122:2. `## 2. SCENARIO CONTRACT`
.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md:61:## 2. SCENARIO CONTRACT
```

## newFindingsRatio
0.75

## Convergence Signal
Maintainability review should continue into iteration 5. Naming consistency is strong and the sampled SCENARIO CONTRACT sections are coherent, but the HVR protected-zone claim is false, the create-testing-playbook workflows still carry the old section name, and the cross-CLI invariant categories need a content-shape contract rather than only folder-position parity. Iteration 5 should synthesize these with prior P0/P1 findings and re-check whether implementation-summary.md and checklist.md can be trusted as release-readiness sources without remediation.
