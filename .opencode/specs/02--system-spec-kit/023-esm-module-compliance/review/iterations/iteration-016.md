# Iteration 016

## Scope
`system-spec-kit` SKILL.md, references, templates, and contract alignment.

## Verdict
findings

## Findings

### P0
1. Placeholder-enforcement contract is broken; completed phases can retain template placeholder text.
- Evidence:
  - ../../../../skill/system-spec-kit/SKILL.md:783
  - ../../../../skill/system-spec-kit/SKILL.md:806
  - ../../../../skill/system-spec-kit/references/validation/validation_rules.md:153
  - ../../../../skill/system-spec-kit/references/validation/validation_rules.md:161
  - ../../../../skill/system-spec-kit/templates/level_1/implementation-summary.md:43
  - ../001-shared-esm-migration/implementation-summary.md:43
  - ../002-mcp-server-esm-migration/implementation-summary.md:43
  - ../003-scripts-interop-refactor/implementation-summary.md:43

### P1
1. `context_template.md` recovery commands contradict memory tool contracts and script behavior.
- Evidence:
  - ../../../../skill/system-spec-kit/templates/context_template.md:646
  - ../../../../skill/system-spec-kit/templates/context_template.md:655
  - ../../../../skill/system-spec-kit/templates/context_template.md:658
  - ../../../../skill/system-spec-kit/templates/context_template.md:667
  - ../../../../skill/system-spec-kit/references/memory/memory_system.md:155
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:58
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:421

2. `templates/memory/README.md` documents unsupported invocation modes.
- Evidence:
  - ../../../../skill/system-spec-kit/templates/memory/README.md:40
  - ../../../../skill/system-spec-kit/templates/memory/README.md:53
  - ../../../../skill/system-spec-kit/templates/memory/README.md:56
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:58
  - ../../../../skill/system-spec-kit/scripts/memory/generate-context.ts:421

3. Validation remediation guidance points to non-existent template path.
- Evidence:
  - ../../../../skill/system-spec-kit/references/validation/validation_rules.md:135
  - ../../../../skill/system-spec-kit/templates/README.md:46
  - ../../../../skill/system-spec-kit/templates/README.md:67

### P2
1. `generate-context.ts` vs `generate-context.js` terminology is inconsistent.
- Evidence:
  - ../../../../skill/system-spec-kit/SKILL.md:506
  - ../../../../skill/system-spec-kit/SKILL.md:910
  - ../../../../skill/system-spec-kit/references/templates/template_guide.md:595
  - ../../../../skill/system-spec-kit/references/templates/template_guide.md:616
