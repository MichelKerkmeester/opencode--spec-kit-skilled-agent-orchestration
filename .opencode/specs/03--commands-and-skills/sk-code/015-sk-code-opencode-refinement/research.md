---
title: "Research: sk-code--opencode Refinement (043)"
description: "Evidence-first investigation of concrete 139 patterns, review-skill detection gaps, and minimally invasive recommendations for sk-code--opencode (+ optional sk-code--review alignment)."
status: "Complete"
created: "2026-02-22"
updated: "2026-02-22"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

# Research: sk-code--opencode Refinement

## 1. Scope and Evidence Base

This research focused on concrete implementation patterns and directly actionable standards deltas.

### In-scope questions

1. Which **code-adjusted** patterns from 139 should be reused (not theory-heavy abstractions)?
2. Where does `sk-code--review` currently miss explicit KISS/DRY or SOLID detection?
3. What minimal set of edits would harden `sk-code--opencode` (and optionally `sk-code--review`)?
4. What are the implications per language (`sh/js/ts/json/python`)?
5. What must the new global quality sweep verify before closure?

### Primary evidence (direct)

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/research.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/global-quality-sweep.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/spec.md`
- `.opencode/skill/sk-code--opencode/SKILL.md`
- `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`
- `.opencode/skill/sk-code--opencode/references/shared/code_organization.md`
- `.opencode/skill/sk-code--opencode/references/javascript/style_guide.md`
- `.opencode/skill/sk-code--opencode/references/typescript/style_guide.md`
- `.opencode/skill/sk-code--opencode/references/python/style_guide.md`
- `.opencode/skill/sk-code--opencode/references/shell/style_guide.md`
- `.opencode/skill/sk-code--opencode/references/config/style_guide.md`
- `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`
- `.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md`
- `.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md`
- `.opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md`
- `.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md`
- `.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md`
- `.opencode/skill/sk-code--review/SKILL.md`
- `.opencode/skill/sk-code--review/references/quick_reference.md`
- `.opencode/skill/sk-code--review/references/code_quality_checklist.md`
- `.opencode/skill/sk-code--review/references/solid_checklist.md`

### Supplemental synthesis inputs

- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/spec.md`
- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-1-139-code-adjusted.md`
- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-2-139-quality-patterns.md`
- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-3-global-sweep-pattern.md`
- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-4-review-skill-gaps.md`
- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-5-opencode-skill-delta.md`
- `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/scratch/agent-6-language-matrix.md`

## 2. Concrete Code-Adjusted Patterns from 139

The following patterns are concrete implementation behaviors that can be reused in standards language immediately.

| Pattern | What 139 concretely did | Reuse target for this spec |
|---|---|---|
| **Default-on with explicit opt-out** | Wired new retrieval features as enabled-by-default while preserving explicit `'false'` opt-out behavior and test assertions for `undefined` vs `'false'`. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`] | Encode policy defaults in skill docs as explicit enable/disable semantics, then add checklist checks that prevent ambiguous defaults. |
| **Single source of truth constants** | Exported scoring constants from production modules and changed tests to import production constants instead of copy literals. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`] | For standards docs, centralize policy constants (comment density, required prefixes, severity mapping) in shared docs and reference them from language guides/checklists. |
| **Invariant-at-source + regression at seam** | Moved dedup/tier invariants into parser/index/tier core modules and backed them with targeted regression suites. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md`] | Put global policy invariants in shared references (`universal_patterns.md`, `code_organization.md`) and enforce via language checklists rather than duplicating independent variants. |
| **Migration with idempotency proof** | Ran apply and dry-run migration paths, captured `changed`/`failed` metrics, and required idempotent rerun evidence. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md`] | For documentation-standard changes, require explicit rerunnable verification checks with pass/fail evidence (not one-off manual review claims). |
| **No-net-diff runtime when behavior already correct** | Avoided unnecessary code churn; added targeted regression tests and command guidance proof as completion evidence. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md`] | Keep changes minimal in `sk-code--review` optional path: only add detection/wording where there is measurable gap; avoid broad rewrite. |
| **Mandatory closure protocol with defect-zero gate** | Used global quality sweep protocol requiring testing round, defect sweep (`P0=0`, `P1=0`), compliance audit, and conditional standards path with evidence table + closure decision. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/global-quality-sweep.md`] | Reuse the same closure shape for this refinement so policy changes are validated and auditable before completion claim. |

## 3. Current-State Gaps

## 3.1 `sk-code--opencode` gaps relevant to this spec

1. **Inline comment policy is still broad**: current rule is repeated as "Maximum 5 comments per 10 lines" in core and language guides, which allows verbose narration to pass if ratio is respected. [SOURCE: `.opencode/skill/sk-code--opencode/SKILL.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/javascript/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/typescript/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/python/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/shell/style_guide.md`]
2. **Header conventions are strong but not explicitly guarded as non-regression invariant in checklists**: numbered ALL-CAPS sections are present throughout style/checklist docs, but preservation is not a named closure check. [SOURCE: `.opencode/skill/sk-code--opencode/references/javascript/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/typescript/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`] [SOURCE: `.opencode/specs/03--commands-and-skills/sk-code/015-sk-code-opencode-refinement/spec.md`]
3. **KISS/DRY/SOLID terms are effectively absent in opencode standards/checklists**: search signal is missing from `sk-code--opencode` core references and checklists. [SOURCE: `.opencode/skill/sk-code--opencode/SKILL.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md`]

## 3.2 `sk-code--review` detection gaps (KISS/DRY/SOLID)

1. **SOLID is keyword-gated too narrowly**: router intent for SOLID depends on a short keyword list (`solid`, `architecture`, `design`, `coupling`, `cohesion`), so architecture-risk reviews can miss `solid_checklist.md` when different vocabulary is used. [SOURCE: `.opencode/skill/sk-code--review/SKILL.md`]
2. **KISS/DRY are not explicit intents or checklist anchors**: baseline quick-reference and code-quality checklist mention maintainability signals but do not explicitly codify KISS/DRY checks as a required pass. [SOURCE: `.opencode/skill/sk-code--review/references/quick_reference.md`] [SOURCE: `.opencode/skill/sk-code--review/references/code_quality_checklist.md`]
3. **SOLID prompts exist but are conditional**: `solid_checklist.md` is well-structured and actionable, but it is not always loaded. [SOURCE: `.opencode/skill/sk-code--review/references/solid_checklist.md`] [SOURCE: `.opencode/skill/sk-code--review/SKILL.md`]

## 3.3 Language coverage implications (`sh/js/ts/json/python`)

1. `sh/js/ts/python` each have `quick_reference + style_guide + quality_standards`, so they already support layered enforcement. [SOURCE: `.opencode/skill/sk-code--opencode/references/shell/quality_standards.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/javascript/quality_standards.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/typescript/quality_standards.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/python/quality_standards.md`]
2. `json/jsonc` currently has only `quick_reference + style_guide`; there is no `quality_standards.md` in `references/config`. [SOURCE: `.opencode/skill/sk-code--opencode/references/config/quick_reference.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/config/style_guide.md`]
3. `sk-code--opencode` config routing reflects this reduced depth (config references are style + quick reference only). [SOURCE: `.opencode/skill/sk-code--opencode/SKILL.md`]

## 4. Priority Recommendations (Implementation-Ready, Minimal Invasiveness)

The recommendations below are intentionally incremental and scoped to existing files from `043`.

| ID | Priority | Target Files | Implementation-ready change |
|---|---|---|---|
| R1 | **P0** | `.opencode/skill/sk-code--opencode/SKILL.md`, `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`, all language `style_guide.md` files in `javascript/typescript/python/shell/config` | Replace current comment-density rule with stricter policy: **"max 3 comments per 10 LOC"** and add explicit allowlist: `WHY`, `GUARD`, `INVARIANT`, `REQ-/BUG-/SEC-/T- trace`, `RISK/PERF`. Keep existing good/bad examples but add one negative example for narrative/mechanical comments. |
| R2 | **P0** | `.opencode/skill/sk-code--opencode/references/shared/code_organization.md`, `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`, language checklists | Add explicit non-regression invariant: numbered ALL-CAPS primary section headers are mandatory in standards docs and examples (`## N. UPPERCASE`). Add checklist item and validation regex guidance for this invariant. |
| R3 | **P0** | `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`, `.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md`, `.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md`, `.opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md`, `.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md`, `.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md` | Add compact KISS/DRY/SOLID checks with pass/fail wording. Minimum: one KISS and one DRY check in every checklist; full SRP/OCP/LSP/ISP/DIP prompts in universal + JS/TS; SRP/DRY analog checks for Python/Shell/Config. |
| R4 | **P1** (Optional review alignment) | `.opencode/skill/sk-code--review/SKILL.md` | Expand intent detection: include architecture markers (`module`, `adapter`, `interface`, `abstraction`, `responsibility`, `dependency`, `boundary`) and add explicit KISS/DRY intents mapped to existing checklist resources. |
| R5 | **P1** (Optional review alignment) | `.opencode/skill/sk-code--review/references/quick_reference.md`, `.opencode/skill/sk-code--review/references/code_quality_checklist.md` | Add one short KISS/DRY reviewer checkpoint in quick flow and one explicit severity mapping cue for duplication/over-abstraction (P2 default, escalate when behavior risk exists). |
| R6 | **P1** | `.opencode/skill/sk-code--opencode/references/config/style_guide.md`, `.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md` | Close config parity gap without new file by adding a "CONFIG QUALITY GATES" subsection that mirrors P0/P1 policy style used in other languages. |
| R7 | **P2** | `.opencode/skill/sk-code--opencode/references/config/quality_standards.md` (new, optional) and `.opencode/skill/sk-code--opencode/SKILL.md` routing map | Optional parity enhancement: add dedicated config `quality_standards.md` and include it in config routing for full symmetry with `sh/js/ts/python`. |
| R8 | **P2** | Existing verification scripts/checklist workflow | Optional automation: add a narrow text-validation check that asserts comment-policy anchors, KISS/DRY/SOLID markers, and ALL-CAPS header invariant across scoped files. |

### Why these are minimally invasive

1. They reuse existing structure and references instead of introducing a new architecture layer. [SOURCE: `.opencode/skill/sk-code--opencode/SKILL.md`] [SOURCE: `.opencode/skill/sk-code--review/SKILL.md`]
2. They align with 139's "tight seam fixes + strong verification" behavior. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md`]
3. They preserve current baseline/overlay precedence while improving detection coverage. [SOURCE: `.opencode/skill/sk-code--review/SKILL.md`] [SOURCE: `.opencode/skill/sk-code--review/references/quick_reference.md`]

## 5. Language Coverage Implications Matrix

| Language | Current state | Risk if unchanged | Required update in this refinement |
|---|---|---|---|
| **Shell (`sh`)** | Full reference stack present; comment guidance currently 5/10 ratio. [SOURCE: `.opencode/skill/sk-code--opencode/references/shell/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/shell/quality_standards.md`] | Over-commented scripts and inconsistent architecture quality checks in review outputs. | Apply R1 comment tightening in shell style guide + R3 KISS/DRY/SRP analog checklist checks. |
| **JavaScript (`js`)** | Full reference stack present; strong style and checklist coverage. [SOURCE: `.opencode/skill/sk-code--opencode/references/javascript/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md`] | SOLID/KISS/DRY gaps stay implicit; reviewers may miss design drift unless explicitly asked. | Apply R1 + full R3 SOLID prompts + optional R4/R5 review routing expansion. |
| **TypeScript (`ts`)** | Full reference stack present with strict typing emphasis. [SOURCE: `.opencode/skill/sk-code--opencode/references/typescript/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md`] | Architecture/abstraction issues can pass when SOLID intent is not auto-detected. | Apply R1 + R3 SOLID prompts + R4 intent keyword expansion in review router. |
| **JSON/JSONC (`json`)** | No config `quality_standards.md`; only style + quick reference. [SOURCE: `.opencode/skill/sk-code--opencode/references/config/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/config/quick_reference.md`] | Severity and quality gating for config changes stay weaker than other languages. | Apply R6 now (minimal, no new file); optionally apply R7 for full parity. |
| **Python (`python`)** | Full reference stack present; comment guidance currently 5/10 ratio. [SOURCE: `.opencode/skill/sk-code--opencode/references/python/style_guide.md`] [SOURCE: `.opencode/skill/sk-code--opencode/references/python/quality_standards.md`] | DRY/SRP checks remain implicit and may vary reviewer-by-reviewer. | Apply R1 + R3 (KISS/DRY/SRP analog checks in python checklist). |

## 6. New Global Quality Sweep Definition (for 043)

This sweep should be required before any completion claim for this refinement and should mirror the successful 139 closure protocol shape. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/global-quality-sweep.md`]

### Step 1: Global validation round (required)

Verify all scoped standards artifacts together:

1. Inline comment policy anchors updated (`max 3/10`, allowlist present).
2. Numbered ALL-CAPS header invariant explicitly present in shared + checklist docs.
3. KISS/DRY/SOLID markers present in universal + language checklists.
4. `sh/js/ts/json/python` coverage remains complete (with explicit config gate strategy).
5. Optional review updates preserve baseline+overlay precedence contract.

Suggested command set:

```bash
rg -n "Maximum 3 comments per 10 lines|allowlist|WHY|GUARD|INVARIANT" .opencode/skill/sk-code--opencode
rg -n "ALL-CAPS|## [0-9]+\\. [A-Z0-9 ()/-]+" .opencode/skill/sk-code--opencode
rg -n "KISS|DRY|SRP|OCP|LSP|ISP|DIP" .opencode/skill/sk-code--opencode/assets/checklists
rg -n "INTENT_SIGNALS|RESOURCE_MAP|KISS|DRY|SOLID" .opencode/skill/sk-code--review
```

### Step 2: Global bug detection sweep (required)

1. Log all defects found during Step 1 with severity and owner.
2. Closure gate requires unresolved counts: `P0=0` and `P1=0`.
3. Any `P2` deferrals must have explicit owner and follow-up rationale.

### Step 3: `sk-code--opencode` compliance audit (required)

Audit changed files for:

1. Scope lock (only files in spec scope changed).
2. No unfinished marker tokens in final standards text.
3. Policy consistency between `SKILL.md`, shared references, and language checklists.

### Step 4: Conditional standards update pathway (conditional)

1. If evidence shows baseline/overlay mismatch unresolved by scoped edits, then apply optional `sk-code--review` changes (R4/R5).
2. If not triggered, mark `N/A` with explicit rationale and evidence.

### Required evidence table schema

Use one row per sweep step with columns:

- `Evidence ID`
- `Protocol Step`
- `Command / Check`
- `Result Summary`
- `Artifact / Link`
- `Defects (P0/P1/P2)`
- `Owner`
- `Status`

### Closure gate decision rule

Mark closure as `SATISFIED` only when all required steps are closed and unresolved defects are `P0=0`, `P1=0`.

## 7. Change-Impact Matrix (Copy/Paste for Planning)

| Change ID | Priority | Files (primary) | Expected impact | Regression risk | Verification hook |
|---|---|---|---|---|---|
| R1 | P0 | `SKILL.md`, `references/shared/universal_patterns.md`, `references/*/style_guide.md` | Reduces noisy inline narration; improves AI parse signal quality | Low-Medium | Comment-policy anchor grep + example spot-check |
| R2 | P0 | `references/shared/code_organization.md`, `assets/checklists/universal_checklist.md`, language checklists | Preserves deterministic section structure for docs/parsers | Low | Header-invariant grep + checklist item presence |
| R3 | P0 | `assets/checklists/universal_checklist.md` + all language checklists | Makes KISS/DRY/SOLID detection explicit and reviewable | Medium | Term presence grep + checklist walkthrough |
| R4 | P1 | `sk-code--review/SKILL.md` | Improves SOLID trigger recall and KISS/DRY routing sensitivity | Medium | Router keyword/resource-map validation |
| R5 | P1 | `sk-code--review/references/quick_reference.md`, `.../code_quality_checklist.md` | Standardizes severity framing for over-abstraction/duplication findings | Low | Quick-reference output contract review |
| R6 | P1 | `references/config/style_guide.md`, `assets/checklists/config_checklist.md` | Raises JSON/JSONC gate quality without creating new file | Low | Config checklist gate presence + syntax checks |
| R7 | P2 | `references/config/quality_standards.md` (optional), `SKILL.md` routing | Full language parity in reference stack | Medium | Resource discovery + routing map check |
| R8 | P2 | Verification scripts/check flow | Faster drift detection for future updates | Medium | CI/local script pass with zero false blockers |

## 8. Recommended Execution Order

1. Implement `R1`, `R2`, `R3` as one P0 batch in `sk-code--opencode` files.
2. Apply `R6` immediately after P0 batch to close JSON/JSONC enforcement gap without adding scope.
3. Decide whether to trigger optional review alignment (`R4`, `R5`) based on standards mismatch evidence during sweep.
4. Run the global quality sweep defined in Section 6 and record closure evidence.

## 9. Final Assessment

- The strongest reusable pattern from 139 is not any single retrieval algorithm; it is **tight policy deltas + deterministic verification + closure-gate governance**.
- `sk-code--opencode` needs explicit P0 hardening in comment policy + KISS/DRY/SOLID checklist language.
- `sk-code--review` can stay mostly intact, but optional targeted routing/wording updates materially improve SOLID/KISS/DRY detection consistency.
- JSON/JSONC remains the only language lane with weaker reference depth; this should be closed at least through checklist/style gates in this refinement.
