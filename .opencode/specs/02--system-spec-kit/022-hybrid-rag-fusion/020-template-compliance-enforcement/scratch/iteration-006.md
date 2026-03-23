# Iteration 6: Q5 Completion -- Compact Contract Injection Text for All Doc Types

## Focus
Draft the actual compact contract injection text that could be embedded in agent definitions (or a shared reference file) to ensure any agent from any CLI produces 100% template-compliant documentation at generation time. This addresses the remaining gap: only spec.md has an inline scaffold in the @speckit agent definition; plan.md, tasks.md, checklist.md, and implementation-summary.md have none.

## Findings

### 1. Current State: Only spec.md Has an Inline Scaffold
The @speckit agent definition (`.claude/agents/speckit.md`, lines 327-339) contains a "Quick Reference: Level 2 spec.md scaffold" block showing 7 required anchors and H2 headers. No equivalent exists for the other 4 Level 2 doc types, nor for Level 3's decision-record.md. This directly explains the "scaffold paradox" from iteration 5: spec.md still had many changes despite the scaffold, but plan.md (zero scaffold) had the MOST changes (273 vs 267).
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/agents/speckit.md:327-339]

### 2. Complete Level 2 Anchor/Header Contract Extracted From Templates
From direct template inspection, the complete Level 2 contracts are:

**spec.md** (7 required + 3 L2-addendum anchors):
- `metadata` -> `## 1. METADATA`
- `problem` -> `## 2. PROBLEM & PURPOSE`
- `scope` -> `## 3. SCOPE`
- `requirements` -> `## 4. REQUIREMENTS`
- `success-criteria` -> `## 5. SUCCESS CRITERIA`
- `risks` -> `## 6. RISKS & DEPENDENCIES`
- `questions` -> `## 10. OPEN QUESTIONS`
- L2 addenda: `nfr`, `edge-cases`, `complexity`

**plan.md** (7 required + 3 L2-addendum anchors):
- `summary` -> `## 1. SUMMARY`
- `quality-gates` -> `## 2. QUALITY GATES`
- `architecture` -> `## 3. ARCHITECTURE`
- `phases` -> `## 4. IMPLEMENTATION PHASES`
- `testing` -> `## 5. TESTING STRATEGY`
- `dependencies` -> `## 6. DEPENDENCIES`
- `rollback` -> `## 7. ROLLBACK PLAN`
- L2 addenda: `phase-deps`, `effort`, `enhanced-rollback`

**tasks.md** (6 required anchors, no L2 addenda):
- `notation` -> `## Task Notation`
- `phase-1` -> `## Phase 1: Setup`
- `phase-2` -> `## Phase 2: Implementation`
- `phase-3` -> `## Phase 3: Verification`
- `completion` -> `## Completion Criteria`
- `cross-refs` -> `## Cross-References`

**checklist.md** (8 required anchors, no L2 addenda):
- `protocol` -> `## Verification Protocol`
- `pre-impl` -> `## Pre-Implementation`
- `code-quality` -> `## Code Quality`
- `testing` -> `## Testing`
- `security` -> `## Security`
- `docs` -> `## Documentation`
- `file-org` -> `## File Organization`
- `summary` -> `## Verification Summary`

**implementation-summary.md** (6 required anchors, no L2 addenda):
- `metadata` -> `## Metadata`
- `what-built` -> `## What Was Built`
- `how-delivered` -> `## How It Was Delivered`
- `decisions` -> `## Key Decisions`
- `verification` -> `## Verification`
- `limitations` -> `## Known Limitations`

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_2/*.md -- all 5 files]

### 3. Level 3 decision-record.md Uses Dynamic ADR Anchors
Unlike the other doc types, decision-record.md uses a parametric anchor pattern: `adr-NNN` wraps each ADR, with sub-anchors `adr-NNN-context`, `adr-NNN-decision`, `adr-NNN-alternatives`, `adr-NNN-consequences`, `adr-NNN-five-checks`, `adr-NNN-impl`. The template ships with ADR-001 as an example. This means the contract cannot be a fixed table -- it must specify the PATTERN (e.g., "each ADR must have these 6 sub-anchors in this order") rather than fixed anchor names.
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates/level_3/decision-record.md:21-118]

### 4. Shared Reference File vs. Duplication: Analysis
All 4 CLIs have @speckit agent definitions:
- `.claude/agents/speckit.md` (Claude Code)
- `.opencode/agent/speckit.md` (Copilot / OpenCode default)
- `.codex/agents/speckit.toml` (Codex CLI -- TOML format, different structure)
- `.gemini/agents/speckit.md` (Gemini CLI)

**Arguments for shared reference file** (e.g., `.opencode/skill/system-spec-kit/references/template-compliance-contract.md`):
- Single source of truth -- update once, all CLIs benefit
- Templates already live in the skill folder; the contract is a derivative
- Claude Code, Copilot, and Gemini can all `Read()` a shared file at runtime
- Codex CLI uses TOML format and may not support inline markdown blocks well

**Arguments for duplication:**
- Zero latency -- no extra Read() call needed during generation
- Works even if skill folder is missing or CLI cannot resolve paths
- Each CLI can have format-specific optimizations

**Recommendation**: HYBRID approach -- create the shared reference file as canonical source of truth, AND embed a compact summary (just the anchor+header table, ~35 lines) in each agent definition. The shared file contains the full contract with examples; the agent definitions contain the minimal enforceable table. When templates change, a script or checklist item triggers updating both.
[INFERENCE: based on cross-CLI agent definition analysis from iterations 4-6]

### 5. The Drafted Compact Contract Injection Text

The following is the actual text block that should be added to all 4 CLI @speckit agent definitions. It replaces the current "Quick Reference: Level 2 spec.md scaffold" section with a comprehensive version covering all doc types.

```markdown
#### Template Compliance Contract (Level 2)

MANDATORY: Every spec document MUST follow the exact anchor + header structure below.
Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.

**spec.md** -- `# Feature Specification: [Title]`
| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## 10. OPEN QUESTIONS |
L2 addenda (after core): `nfr` (## L2: NON-FUNCTIONAL REQUIREMENTS), `edge-cases` (## L2: EDGE CASES), `complexity` (## L2: COMPLEXITY ASSESSMENT)

**plan.md** -- `# Implementation Plan: [Title]`
| Anchor | Required H2 |
|--------|-------------|
| summary | ## 1. SUMMARY |
| quality-gates | ## 2. QUALITY GATES |
| architecture | ## 3. ARCHITECTURE |
| phases | ## 4. IMPLEMENTATION PHASES |
| testing | ## 5. TESTING STRATEGY |
| dependencies | ## 6. DEPENDENCIES |
| rollback | ## 7. ROLLBACK PLAN |
L2 addenda (after core): `phase-deps` (## L2: PHASE DEPENDENCIES), `effort` (## L2: EFFORT ESTIMATION), `enhanced-rollback` (## L2: ENHANCED ROLLBACK)

**tasks.md** -- `# Tasks: [Title]`
| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

**checklist.md** -- `# Verification Checklist: [Title]`
| Anchor | Required H2 |
|--------|-------------|
| protocol | ## Verification Protocol |
| pre-impl | ## Pre-Implementation |
| code-quality | ## Code Quality |
| testing | ## Testing |
| security | ## Security |
| docs | ## Documentation |
| file-org | ## File Organization |
| summary | ## Verification Summary |

**implementation-summary.md** -- `# Implementation Summary`
| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

**Level 3 decision-record.md** -- `# Decision Record: [Title]`
Each ADR uses parametric anchors: `adr-NNN` wraps the ADR; sub-anchors: `adr-NNN-context`, `adr-NNN-decision`, `adr-NNN-alternatives`, `adr-NNN-consequences`, `adr-NNN-five-checks`, `adr-NNN-impl`. All 6 sub-anchors required per ADR, in this order.

**Enforcement**: After writing ANY spec folder .md file, run `validate.sh [SPEC_FOLDER] --strict`. Fix ALL errors before proceeding.
```

This is 49 lines including the blank separator lines -- within the ~45-line feasibility estimate from iteration 3, and compact enough for inline embedding.
[INFERENCE: synthesized from template analysis (finding 2), existing scaffold format (finding 1), and Level 3 pattern (finding 3)]

### 6. Phase Parent/Child Addenda Handling
Phase folders (e.g., `specs/NNN-name/001-phase/`) use `inferPhaseSpecAddenda()` in template-structure.js to auto-merge phase-specific addenda. The compact contract covers the BASE Level 2 structure. For phase addenda, the contract adds one instruction: "Phase child folders inherit the base contract plus any addenda from `inferPhaseSpecAddenda()`. The validate.sh script enforces these automatically -- no additional agent knowledge needed." This keeps the injection compact without phase-specific tables.
[INFERENCE: based on template-structure.js architecture from iteration 3 + phase workflow knowledge]

### 7. Implementation Sequence for Deploying the Contract
1. **Create shared reference file**: `.opencode/skill/system-spec-kit/references/template-compliance-contract.md` with full contract + examples
2. **Update `.claude/agents/speckit.md`**: Replace "Quick Reference: Level 2 spec.md scaffold" (lines 327-339) with the full 49-line contract
3. **Update `.opencode/agent/speckit.md`**: Same replacement (Copilot)
4. **Update `.gemini/agents/speckit.md`**: Same replacement
5. **Update `.codex/agents/speckit.toml`**: Embed contract in the agent instruction field (may need reformatting for TOML string format)
6. **Collapse timing directives**: In all agent definitions, replace the 3 conflicting timing directives with one: "After writing ANY spec folder .md file, run `validate.sh [SPEC_FOLDER] --strict`. Fix ALL errors before proceeding."
7. **Add sync check**: In the template-compliance-contract.md shared reference, add a version hash or date stamp that can be compared across CLI agent definitions to detect drift.
[INFERENCE: synthesized from all prior iteration findings]

## Sources Consulted
- `.claude/agents/speckit.md` (lines 317-339, 231-237) -- existing scaffold and rules
- `.opencode/skill/system-spec-kit/templates/level_2/spec.md` -- anchors and headers
- `.opencode/skill/system-spec-kit/templates/level_2/plan.md` -- anchors and headers
- `.opencode/skill/system-spec-kit/templates/level_2/tasks.md` -- anchors and headers
- `.opencode/skill/system-spec-kit/templates/level_2/checklist.md` -- anchors and headers
- `.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md` -- anchors and headers
- `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` -- ADR anchor pattern
- `.opencode/agent/speckit.md`, `.codex/agents/speckit.toml`, `.gemini/agents/speckit.md` -- cross-CLI agent definitions

## Assessment
- New information ratio: 0.71
- Questions addressed: Q5 (template injection strategies)
- Questions answered: Q5 (fully answered with concrete drafted text)

## Reflection
- What worked and why: Extracting complete anchor/header contracts from all 5 template files in one pass gave the exact data needed for the injection text. The prior iterations had already established that ~45 lines was feasible, so this iteration could focus purely on drafting the actual text rather than re-analyzing feasibility.
- What did not work and why: No failed approaches in this iteration -- the research was targeted and the data was readily available.
- What I would do differently: Could have drafted the contract text in iteration 3 when the feasibility was first established, rather than deferring it. The contract extraction (finding 2) and the actual drafted text (finding 5) could have been a single iteration.

## Recommended Next Focus
All 8 key questions are now answered. The research is ready for synthesis. Recommended: convergence check or final synthesis iteration that consolidates all findings into a coherent implementation proposal with exact file paths, code changes, and deployment sequence.
