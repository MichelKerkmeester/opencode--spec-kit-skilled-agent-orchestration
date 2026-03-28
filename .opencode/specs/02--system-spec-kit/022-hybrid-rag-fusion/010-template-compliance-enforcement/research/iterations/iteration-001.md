# Iteration 1: Template Compliance Failure Modes -- Full Validation Surface Analysis

## Focus
Analyze the current template compliance failure modes by examining validate.sh, all rule scripts, the template-structure.js helper, and the template files themselves. Goal: map the complete validation surface to understand exactly what agents get wrong and what the validator checks.

## Findings

### 1. The Validation System Has 18 Rules Organized Into 3 Severity Tiers

The validate.sh orchestrator (v2.0.0) executes modular rule scripts from `rules/check-*.sh`. Each rule is sourced and runs a `run_check()` function. The severity tiers are:

- **Error-severity (hard failures):** FILE_EXISTS, PLACEHOLDER_FILLED, ANCHORS_VALID, TOC_POLICY, TEMPLATE_HEADERS, SPEC_DOC_INTEGRITY
- **Warning-severity:** SECTIONS_PRESENT, PRIORITY_TAGS, EVIDENCE_CITED, PHASE_LINKS, LINKS_VALID
- **Info-severity:** LEVEL_DECLARED

Additional rules discovered: AI_PROTOCOLS, COMPLEXITY_MATCH, FOLDER_NAMING, FRONTMATTER_VALID, LEVEL_MATCH, SECTION_COUNTS, TEMPLATE_SOURCE

[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:68-75, 316-323]

### 2. TEMPLATE_HEADERS Is the Most Structurally Demanding Rule

The `check-template-headers.sh` rule delegates to `template-structure.js` which:
1. Resolves the correct template for the detected level (1/2/3/3+) and document type
2. Extracts H2 headers from both template and actual document
3. Normalizes headers (strips numbering, placeholders, converts to uppercase)
4. Reports three deviation types:
   - `missing_header`: Required H2 section absent from the document
   - `out_of_order_header`: Required H2 present but in wrong position relative to template
   - `extra_header`: Custom H2 not in template (warning-only)

Additionally, for checklist.md it enforces:
- H1 must start with `# Verification Checklist:`
- Items must use `CHK-NNN [P0/P1/P2]` format, not bare `**[P0]**`

[SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:39-94]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/template-structure.js:144-289]

### 3. ANCHORS_VALID Enforces Both Syntax and Order

The anchor validation has 4 sub-checks:
1. **Missing anchors**: Major spec docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md) must have at least 1 ANCHOR tag
2. **Malformed syntax**: Both opening `<!-- ANCHOR:id -->` and closing `<!-- /ANCHOR:id -->` must match exact regex
3. **Pair matching**: Every open must have a matching close (detects unclosed and orphaned anchors)
4. **Required order**: Delegates to template-structure.js to check that required anchors appear in template-specified order

This is particularly problematic for agents because anchors are invisible structural metadata that agents tend to omit entirely or misspell.

[SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:17-252]

### 4. template-structure.js Is the Central Contract Engine

The template-structure.js module powers both TEMPLATE_HEADERS and ANCHORS_VALID. It:
- Maps level + basename to the correct template file in `templates/level_N/`
- Supports 4 levels: 1, 2, 3, 3+ (each with different file sets and sections)
- Loads "contracts" from templates: required headers, optional headers, required anchors, optional anchors, allowed anchors
- Has special handling for decision-record.md (dynamic ADR/DR headers)
- Supports addendum merging for phase folders and level upgrades
- Normalizes headers by stripping number prefixes and placeholders before comparison

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/template-structure.js:18-48, 218-289]

### 5. The Template Files Define ~7 Required Sections and ~7 Required Anchors per Document

For spec.md at Level 1 (the core template), the required structure is:
- H1: `# Feature Specification: [NAME]`
- SPECKIT_LEVEL comment marker
- SPECKIT_TEMPLATE_SOURCE comment marker
- 7 H2 sections: METADATA, PROBLEM & PURPOSE, SCOPE, REQUIREMENTS, SUCCESS CRITERIA, RISKS & DEPENDENCIES, OPEN QUESTIONS
- 7 matching anchors: metadata, problem, scope, requirements, success-criteria, risks, questions
- Each anchor pair wraps its corresponding H2 section

Agents typically fail by: (a) using different section names (e.g., "Overview" instead of "Problem & Purpose"), (b) omitting anchor tags entirely, (c) reordering sections, (d) omitting the SPECKIT_LEVEL comment.

[SOURCE: .opencode/skill/system-spec-kit/templates/core/spec-core.md:1-120]

### 6. The Known Context Confirms: 54 Errors Across 3 Categories in Real Agent Writes

From the strategy's known context, the 014-manual-testing rewrite produced 54 validation errors across 20 spec folders. The three dominant error categories were:
- **TEMPLATE_HEADERS**: Wrong section names (e.g., "Implementation" vs "Implementation Approach")
- **SPEC_DOC_INTEGRITY**: Broken file cross-references
- **ANCHORS_VALID**: Missing or misordered anchors

These required 3 fix waves and ~270 individual edits -- a 5:1 ratio of fix edits to original files created.

[SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/research/deep-research-strategy.md:36]
[INFERENCE: based on known context data and validation rule analysis]

### 7. Validation Has No Pre-Write Integration -- It Is Purely Post-Hoc

The validate.sh script runs AFTER files are written. There is no mechanism to:
- Intercept agent writes before they reach disk
- Provide the agent with the exact template content inline in its prompt
- Auto-fix common deviations programmatically

The pre-commit hook (`pre-commit-spec-validate.sh`) exists but only gates commits, not initial writes. There is a `progressive-validate.sh` variant but it too runs after the fact.

[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh (file exists)]
[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:14-18 (skip flag)]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` (full file, 642 lines)
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` (full file, 129 lines)
- `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh` (full file, 256 lines)
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` (320 lines read)
- `.opencode/skill/system-spec-kit/templates/core/spec-core.md` (full file, 120 lines)
- `.opencode/skill/system-spec-kit/templates/` (directory listing, 76 template files)

## Assessment
- New information ratio: 1.0
- Questions addressed: Q1 (fully), Q2 (partially)
- Questions answered: Q1 -- fully mapped the validation surface and failure modes

## Reflection
- What worked and why: Direct examination of validation scripts and template files gave complete structural understanding. The code itself is the authoritative source -- no external documentation was needed.
- What did not work and why: N/A (first iteration, all approaches productive)
- What I would do differently: For future iterations on Q2 (limitations), I would also examine the test fixtures (055-058 range) which encode specific failure scenarios as regression tests.

## Recommended Next Focus
Q2: Deeper into validate.sh architectural limitations -- specifically, examine what the validator CANNOT catch (semantic correctness, content quality, cross-file consistency beyond links). Also examine the progressive-validate.sh variant and quality-audit.sh to understand the full validation toolchain.
