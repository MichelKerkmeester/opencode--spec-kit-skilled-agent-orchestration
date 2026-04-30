---
title: "Implementation Plan: cli-opencode provider realignment"
description: "Sequenced edits to drop github-copilot provider, promote opencode-go default, preserve deepseek direct API."
trigger_phrases:
  - "cli-opencode plan"
  - "provider realignment plan"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: cli-opencode provider realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Strip `github-copilot` as a provider from the cli-opencode skill (SKILL.md, README.md, four reference docs, prompt templates, manual testing playbook, graph-metadata.json), promote `opencode-go/deepseek-v4-pro --variant high` to the documented default, and keep the direct `deepseek/*` provider rows intact. Delete the two copilot-only playbook test entries; update remaining playbook entries to use the new default in example commands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:approach -->
## 2. APPROACH

**Edit order**: top-of-funnel docs first (SKILL.md, README.md), then references, then prompt templates, then playbook, then metadata. This keeps each downstream edit consistent with the upstream source-of-truth.

**Find/replace strategy**: Two passes per file.
1. *Replace pass*: `github-copilot/gpt-5.4` -> `opencode-go/deepseek-v4-pro` (same `--variant high`).
2. *Drop pass*: remove rows / sections that document `github-copilot` as its own provider entry, and rewrite default-invocation tables to drop the copilot row.

**Default-invocation canonical shape** (apply uniformly):
```
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir <repo-root> \
  "<prompt>"
```
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:phases -->
## 3. PHASES

| Phase | Activities | Outputs |
|-------|------------|---------|
| 1. Top-level docs | Edit SKILL.md and README.md to show opencode-go default with no copilot mentions | SKILL.md + README.md aligned |
| 2. References | Edit four reference files in `references/` | All references show opencode-go default |
| 3. Prompt templates | Edit `assets/prompt_templates.md` | Templates use opencode-go default |
| 4. Manual testing playbook | Delete the two copilot-only entries; update playbook root index; update remaining entries | Playbook only documents opencode-go + deepseek providers |
| 5. Graph metadata | Edit `graph-metadata.json` causal_summary + intent signals | Metadata reflects two-provider model |
| 6. Verification | grep verification of `github-copilot` removal and sibling/deepseek preservation | Clean grep, completed implementation-summary.md |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING STRATEGY

- Static verification: `grep -ri "github-copilot" .opencode/skill/cli-opencode/` must return zero hits (REQ-001)
- Static verification: `grep -ri "deepseek" .opencode/skill/cli-opencode/` must still return hits across SKILL.md, README.md, cli_reference.md, agent_delegation.md (REQ-003)
- Manual review: re-read SKILL.md §3 Default Invocation block end-to-end to confirm copy-paste invocation is internally consistent
- Manual review: re-read SKILL.md §3 Provider Auth Pre-Flight section end-to-end to confirm the decision tree is unambiguous and the user-prompt templates are copy-paste ready
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

- None - this is a documentation-only change inside one skill folder. No code, no package install, no schema migration.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN

`git checkout main -- .opencode/skill/cli-opencode/` reverts the skill to its pre-051 state. Spec folder `specs/051-cli-opencode-providers/` can stay (it's documentation of the change attempt) or be removed via `git clean -fd specs/051-cli-opencode-providers/` if the change is abandoned before merge.
<!-- /ANCHOR:rollback -->

---
