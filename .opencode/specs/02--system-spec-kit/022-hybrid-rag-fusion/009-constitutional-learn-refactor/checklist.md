---
title: "Checklist: Refactor /memory:learn"
---
# Verification Checklist

## P0 — Must Pass
- [ ] learn.md rewritten with constitutional focus
- [ ] Old learning types (pattern, mistake, insight, optimization, constraint) removed
- [ ] Old subcommands (correct, undo, history) removed
- [ ] New subcommands (list, edit, remove, budget) present
- [ ] CREATE workflow includes budget check
- [ ] Constitutional directory path correct: `.opencode/skill/system-spec-kit/constitutional/`
- [ ] Uses Write tool (not generate-context.js) for file creation
- [ ] Uses memory_save() for indexing
- [ ] Token budget ~2000 referenced

## P1 — Should Pass
- [ ] README.txt updated with new description
- [ ] CLAUDE.md Quick Reference updated
- [ ] system-spec-kit README.md updated
- [ ] No stale references to old learning types
- [ ] Examples show constitutional memory creation
