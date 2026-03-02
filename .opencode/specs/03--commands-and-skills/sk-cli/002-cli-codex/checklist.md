---
title: "Checklist: cli-gemini Model Consolidation + cli-codex Skill"
description: "Quality verification checklist."
trigger_phrases:
  - "cli-codex checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: cli-gemini Model Consolidation + cli-codex Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

## P0: Critical (Must Pass)

- [x] **No old model references in cli-gemini** — `grep -rn "gemini-2\." .opencode/skill/cli-gemini/` returns zero results
  [EVIDENCE: grep verification returned "No matches found"]
- [x] **cli-codex SKILL.md exists** with 8 standard sections
  [EVIDENCE: .opencode/skill/cli-codex/SKILL.md created, 22KB, 8 anchored sections]
- [x] **cli-codex all reference files exist** — cli_reference.md, agent_delegation.md, codex_tools.md, integration_patterns.md
  [EVIDENCE: ls -la confirms all 4 files in references/]
- [x] **cli-codex prompt_templates.md exists**
  [EVIDENCE: ls -la confirms file in assets/]
- [x] **Symlink works** — .claude/skills/cli-codex → ../../.opencode/skill/cli-codex
  [EVIDENCE: ls -la shows correct symlink target]

## P1: Important (Should Pass)

- [x] **skill_advisor.py recognizes cli-codex** — entries in INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS
  [EVIDENCE: agent confirmed 3 sections updated with codex entries]
- [x] **README files updated** — cli-codex listed in .opencode/skill/README.md, root README.md, .opencode/README.md
  [EVIDENCE: agent confirmed all 3 READMEs updated]
- [x] **Model standardization** — cli-codex uses only gpt-5.3-codex, cli-gemini uses only gemini-3.1-pro-preview
  [EVIDENCE: all files created/updated with single model references]

## P2: Nice to Have

- [ ] Skill advisor test: `python3 .opencode/skill/scripts/skill_advisor.py "use codex cli"` returns cli-codex with confidence ≥ 0.8
- [ ] Install guide for Codex CLI (future work)
