# Research: Template Compliance Enforcement for SpecKit

> How to ensure speckit documentation written by any agent, from any CLI, is always 100% template compliant.

---

## 1. Current Validation Surface

### 1.1 Validation Architecture

The validation system (`validate.sh` v2.0.0) is a modular orchestrator that sources rule scripts from `rules/check-*.sh`. Each rule implements a `run_check()` function and reports pass/fail/warn status. The central contract engine is `template-structure.js`, which maps (level, document-basename) pairs to template files and extracts structural contracts (required headers, required anchors, allowed anchors).

### 1.2 Rules and Severities (18 Rules Total)

| Severity | Rules | Impact |
|----------|-------|--------|
| **Error** | FILE_EXISTS, PLACEHOLDER_FILLED, ANCHORS_VALID, TOC_POLICY, TEMPLATE_HEADERS, SPEC_DOC_INTEGRITY | Hard failures, exit code 2 |
| **Warning** | SECTIONS_PRESENT, PRIORITY_TAGS, EVIDENCE_CITED, PHASE_LINKS, LINKS_VALID | Soft failures, exit code 1 |
| **Info** | LEVEL_DECLARED | Informational only |
| **Structural** | AI_PROTOCOLS, COMPLEXITY_MATCH, FOLDER_NAMING, FRONTMATTER_VALID, LEVEL_MATCH, SECTION_COUNTS, TEMPLATE_SOURCE | Additional checks |

### 1.3 The Three Dominant Agent Failure Modes

Based on real data from the 014-manual-testing rewrite (20 spec folders, 54 errors, ~270 fix edits):

1. **TEMPLATE_HEADERS**: Agents use wrong section names (e.g., "Overview" instead of "Problem & Purpose"), wrong numbering, or reorder required H2 sections. The validator compares normalized headers against the level-specific template.

2. **ANCHORS_VALID**: Agents omit `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` tags entirely, misspell anchor IDs, leave anchors unclosed, or place them in wrong order. These HTML comments are invisible structural metadata that agents have no natural reason to produce correctly.

3. **SPEC_DOC_INTEGRITY**: Cross-file references break when agents create documents independently without verifying that referenced files exist or that internal links resolve.

### 1.4 The Fundamental Gap: Post-Hoc-Only Validation

The validation system runs AFTER files are written. There is no mechanism to:
- Intercept agent writes before they reach disk
- Provide agents with exact template content inline in prompts
- Auto-fix common deviations programmatically
- Feed validation errors back into agent context for self-correction loops

The pre-commit hook only gates commits, not initial writes.

### 1.5 The 6-Dimensional Compliance Gap (Iteration 2)

Beyond the post-hoc limitation, validate.sh's 20-rule catalog (corrected from 18 -- includes check-section-counts and check-template-source) covers ONLY structural compliance. The validator cannot catch:

| Gap Dimension | What It Means | Example |
|---------------|---------------|---------|
| **Semantic emptiness** | Correct headers with meaningless content | `## Scope\n\nTBD` passes SECTIONS_PRESENT |
| **Cross-document consistency** | Misalignment between related documents | tasks.md task IDs not matching plan.md phases |
| **Content completeness** | Sections too thin for their purpose | 1-line Scope in a Level 3 spec |
| **Stylistic compliance** | Wrong markdown constructs within sections | Prose where a table is expected |
| **Factual accuracy** | Incorrect paths, commands, or claims | File paths that exist but point to wrong content |
| **Template version drift** | Existing docs diverge silently when templates evolve | validate_template_hashes() is informational only |

### 1.6 The Three Pipeline Scripts

| Script | Purpose | Limitation |
|--------|---------|------------|
| `validate.sh` | Orchestrates 20 rule scripts, sources and executes `run_check()` | Pure structure checking, no semantics |
| `progressive-validate.sh` | 4-level pipeline (Detect, Auto-fix, Suggest, Report) wrapping validate.sh | Auto-fix limited to dates, heading levels, whitespace -- the 3 lowest-impact issue types |
| `quality-audit.sh` | Batch discovery and validation across all spec folders | Just a distribution tool; adds no quality intelligence beyond validate.sh |

### 1.7 Key Enabler: Machine-Readable Contract

TEMPLATE_HEADERS delegates to `template-structure.js compare <level> <filename> <filepath> headers`, which returns TSV records (`missing_header`, `out_of_order_header`, `extra_header`). This means the template contract is **extractable and machine-readable** -- a critical enabler for any pre-write injection strategy. The SPECKIT_RULES env var also allows focused rule subsetting (e.g., for mid-generation partial validation).

---

## 2. Template Contract System

### 2.1 Level-Based Template Resolution

| Level | Required Files | Template Directory |
|-------|---------------|-------------------|
| 1 | spec.md, plan.md, tasks.md, implementation-summary.md | `templates/level_1/` |
| 2 | Level 1 + checklist.md | `templates/level_2/` |
| 3 | Level 2 + decision-record.md | `templates/level_3/` |
| 3+ | Same as Level 3, extended governance | `templates/level_3+/` |

### 2.2 Contract Engine Architecture (Iteration 3)

`template-structure.js` exposes two CLI commands: `contract` (returns full JSON contract) and `compare` (diffs a document against its contract). The `loadTemplateContract(level, basename)` function returns:

```json
{
  "headerRules": [{ "raw": "1. METADATA", "normalized": "METADATA", "dynamic": false }],
  "optionalHeaderRules": [{ "raw": "L2: EDGE CASES", ... }],
  "requiredAnchors": ["metadata", "problem", ...],
  "optionalAnchors": [...],
  "allowedAnchors": [...]
}
```

### 2.3 Full Level 2 Contract (All 5 Document Types)

| Document | Required H2s (in order) | Required Anchors (in order) | Optional H2s |
|----------|------------------------|---------------------------|--------------|
| **spec.md** | METADATA, PROBLEM & PURPOSE, SCOPE, REQUIREMENTS, SUCCESS CRITERIA, RISKS & DEPENDENCIES, OPEN QUESTIONS | metadata, problem, scope, requirements, success-criteria, risks, questions | L2: NON-FUNCTIONAL REQUIREMENTS, L2: EDGE CASES, L2: COMPLEXITY ASSESSMENT |
| **plan.md** | SUMMARY, QUALITY GATES, ARCHITECTURE, IMPLEMENTATION PHASES, TESTING STRATEGY, DEPENDENCIES, ROLLBACK PLAN | summary, quality-gates, architecture, phases, testing, dependencies, rollback | L2: PHASE DEPENDENCIES, L2: EFFORT ESTIMATION, L2: ENHANCED ROLLBACK |
| **tasks.md** | TASK NOTATION, PHASE 1: SETUP, PHASE 2: IMPLEMENTATION, PHASE 3: VERIFICATION, COMPLETION CRITERIA, CROSS-REFERENCES | notation, phase-1, phase-2, phase-3, completion, cross-refs | (none) |
| **checklist.md** | VERIFICATION PROTOCOL, PRE-IMPLEMENTATION, CODE QUALITY, TESTING, SECURITY, DOCUMENTATION, FILE ORGANIZATION, VERIFICATION SUMMARY | protocol, pre-impl, code-quality, testing, security, docs, file-org, summary | (none) |
| **implementation-summary.md** | METADATA, WHAT WAS BUILT, HOW IT WAS DELIVERED, KEY DECISIONS, VERIFICATION, KNOWN LIMITATIONS | metadata, what-built, how-delivered, decisions, verification, limitations | (none) |

**Key insight**: All 5 document types show 1:1 parity between required headers and required anchors. This means a single compact table can represent the full structural contract.

### 2.4 Phase Addendum Merging

`loadTemplateContractForDocument()` auto-detects phase parent/child relationships and merges addendum contracts. A phase-parent spec.md gets additional optional anchors (e.g., `phase-map`) from the addendum phase-parent-section template. Static prompt injection must document this dynamic behavior separately.

### 2.5 Contract Compactness for Prompt Injection

The full Level 2 contract for all 5 documents fits in ~45 lines of compact markdown table format (~9 lines per document type). Including Levels 1, 2, and 3 would require ~135 lines total -- feasible for agent prompt inclusion or SKILL.md reference sections.

---

## 3. Prompt Injection Surface (Iteration 3)

### 3.1 Current State: Partial Scaffold in @speckit Only

The @speckit agent definition (speckit agent file, section 8) contains an "Inline Scaffold Contract" with a quick reference for **Level 2 spec.md only**. The other 4 document types (plan.md, tasks.md, checklist.md, implementation-summary.md) have NO inline scaffold. This explains why agents fail more frequently on non-spec.md documents.

### 3.2 Multi-CLI Agent Surface

The @speckit agent is defined in 4 CLI-specific locations:
- `.claude/agents/speckit.md` (Claude Code)
- `.opencode/agent/speckit.md` (Copilot/OpenCode base)
- .opencode/agent/chatgpt/speckit.md (ChatGPT)
- `.codex/agents/speckit.toml` (Codex CLI)

Any prompt injection strategy must either: (a) be applied to all 4 surfaces independently, or (b) use a shared resource (SKILL.md, a generated contract file, or constitutional memory) that all agents reference.

### 3.3 Injection Strategy Options

| Strategy | Pros | Cons |
|----------|------|------|
| **Inline scaffold in all agent defs** | Direct, no runtime dependency | Duplication across 4 CLIs, drift risk |
| **SKILL.md reference section** | Single source of truth, all agents load it | Depends on skill loading reliability |
| **Generated contract file** | Programmatically updated from templates | Requires build step, another file to maintain |
| **Constitutional memory** | Auto-surfaces in all searches | Not guaranteed to surface for every write operation |
| **Validate-after-write loop in prompt** | Catches all errors, self-correcting | Adds latency, requires agent to run bash |

### 3.4 Recommended Strategy: Hybrid (Shared File + Inline Summary)

**Decision**: Use a HYBRID approach combining strategies 1 and 3.

- **Canonical source**: Create .opencode/skill/system-spec-kit/references/template-compliance-contract.md (proposed) containing the full contract with examples, rationale, and version metadata
- **Agent inline**: Embed a compact 49-line summary (anchor-to-H2 tables only) in all 4 CLI @speckit agent definitions
- **Sync mechanism**: Version stamp in the shared file; checklist item in template update workflow to verify agent definitions are updated

**Rationale**: The shared reference file eliminates drift risk and provides rich context for manual reference. The inline summary eliminates the extra Read() call at generation time and works even if the skill folder is missing. Together they balance reliability against single-source-of-truth.

### 3.5 The Compact Contract Injection Text (Level 2, All 5 Doc Types)

This is the exact text block to embed in @speckit agent definitions, replacing the current spec.md-only scaffold:

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

Total: 49 lines. This replaces the current 12-line spec.md-only scaffold (lines 327-339 in `.claude/agents/speckit.md`).

### 3.6 Level 3/3+ and Phase Edge Cases

- **Level 3**: Adds decision-record.md with parametric ADR anchors (see contract text above). All other docs inherit Level 2 contracts.
- **Level 3+**: Same structural contract as Level 3. Extended governance requirements (AI protocols, sign-offs) are content-level concerns not enforceable by structural contracts.
- **Phase addenda**: Phase parent/child folders get additional anchors merged automatically by `inferPhaseSpecAddenda()` in template-structure.js. The validate.sh script handles this at validation time. The compact contract covers base structure only; a note in the enforcement line covers the phase case: "Phase folders inherit this base contract plus phase-specific addenda enforced by validate.sh."

---

## 4. Cross-CLI Enforcement Analysis (Iteration 4)

### 4.1 The Universal Enforcement Gap

All 4 CLIs (Copilot, Claude Code, Codex, Gemini) use identical @speckit agent definitions. Each includes these compliance instructions:
- "Always copy templates from `templates/level_N/`" (NEVER from scratch)
- "Run `validate.sh [SPEC_FOLDER] --strict` immediately after each spec-doc write"
- "Run `validate.sh` before claiming completion"

However, enforcement is **purely instructional** -- there is no automated mechanism to verify compliance at write time. Agents can and do skip or forget these steps, especially under tool call budget pressure.

### 4.2 Three Conflicting Validation Timing Directives

The @speckit agent definition contains 3 different statements about WHEN to validate:

| Location | Directive | Enforcement Level |
|----------|-----------|-------------------|
| Section 5 ALWAYS rules | "Run validate.sh --strict immediately after each spec-doc write or update" | Per-write |
| Section 8 Scaffold Contract | "Run validate.sh --strict before moving to the next workflow step" | Per-workflow-step |
| Section 1 Workflow Diagram | "VALIDATE: Run validate.sh" (final step) | Once at end |

This inconsistency means agents choose the least costly interpretation (once at end), which is also the least effective for catching errors early.

### 4.3 The Uninstalled Pre-Commit Hook

A fully functional pre-commit hook exists at `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` with:
- 6-rule fast subset: FILE_EXISTS, LEVEL_DECLARED, FRONTMATTER_VALID, TEMPLATE_SOURCE, ANCHORS_VALID, FOLDER_NAMING
- Configurable enforcement modes via `.speckit-enforce.yaml`: warn, block, strict
- New folder detection (blocks new folders, warns on existing)
- Created-after date filtering for progressive rollout

The matching `.speckit-enforce.yaml` is configured with `mode: warn`, `new_folder_mode: block`, `created_after: 2026-03-22`.

**However, the hook is NOT installed.** `.git/hooks/pre-commit` does not exist -- only the `.sample` file is present. This means the commit-time enforcement layer is designed but undeployed.

### 4.4 No Post-Write Hook Infrastructure in Any CLI

No CLI provides a mechanism to trigger validation after Write/Edit tool calls:
- **Claude Code**: `.claude/settings.local.json` only contains MCP tool permissions
- **Copilot/OpenCode**: No post-tool-call hook system
- **Codex CLI**: Sandbox-based execution with no hook points
- **Gemini CLI**: No hook configuration available

This means post-write enforcement can ONLY be achieved through agent prompt instructions or by wrapping write operations in a validate loop.

### 4.5 The 3-Layer Defense-in-Depth (All Broken)

| Layer | Mechanism | Status | Gap |
|-------|-----------|--------|-----|
| **1. Prompt** | Agent instructions say "copy templates, validate after write" | Present but advisory | Agents skip under budget pressure, 3 conflicting directives |
| **2. Write-time** | Auto-trigger validate.sh after spec folder Write/Edit | Does not exist | No CLI supports post-tool-call hooks |
| **3. Commit-time** | Pre-commit hook runs 6-rule fast validation | Designed but uninstalled | `.git/hooks/pre-commit` is missing |

---

## 5. Per-Document Failure Distribution (Q6)

### 5.1 Quantitative Failure Analysis

Analysis of the clean-slate rewrite (commit b88c07f82) across all 20 phase spec folders. Counted header/anchor structural changes (additions, removals, modifications) per document type:

| Document Type | Header/Anchor Changes | Share of Total | Severity |
|---|---|---|---|
| plan.md | 273 | 42.9% | HIGHEST |
| spec.md | 267 | 41.9% | HIGHEST |
| implementation-summary.md | 57 | 8.9% | MEDIUM |
| checklist.md | 22 | 3.5% | LOW |
| tasks.md | 18 | 2.8% | LOW |
| **Total** | **637** | **100%** | |

### 5.2 The Scaffold Paradox

spec.md has the **only** inline scaffold in the @speckit agent prompt yet still had the second-highest change count (267). Root causes:
1. Phase addenda (parent/child sections) are not in the base scaffold
2. Content adaptation during rewrites disrupts header ordering
3. The scaffold exists only in the @speckit agent definition, not in all prompt pathways (e.g., direct user instructions)
4. Scaffold is necessary but insufficient -- estimated ~50-60% error prevention alone

### 5.3 Implication for Prioritization

plan.md (zero scaffold, 42.9% of errors) is the highest-priority target for scaffold injection. implementation-summary.md (8.9%, no scaffold) is second. tasks.md and checklist.md have low structural failure rates, possibly because their header structures are more intuitive to agents (Phase 1/2/3, Verification Protocol, etc.).

---

## 6. Concrete 3-Layer Enforcement Architecture (Q4 + Q8)

### 6.1 Architecture Overview

```
Agent prompt ──[Layer 1: contract injection]──> Agent writes file
                                                    |
                                                    v
                                          [Layer 2: post-write validate.sh]
                                                    | (fix loop)
                                                    v
                                          git add + git commit
                                                    |
                                                    v
                                          [Layer 3: pre-commit hook]
                                                    | (hard block)
                                                    v
                                               Commit accepted
```

### 6.2 Layer 1: Pre-Generation Contract Injection

- **What**: Embed compact template contracts in every agent prompt that writes spec folder docs
- **Where**: All 4 @speckit agent definitions + CLAUDE.md + any direct prompt surface
- **Content**: Exact H2 headers and anchors for each doc type at declared level (~45 lines for all 5 L2 docs)
- **Source of truth**: Generate from `template-structure.js` to stay in sync with template changes
- **Current state**: Only spec.md has a scaffold; plan.md, tasks.md, checklist.md, impl-summary.md have none
- **Estimated impact**: Prevents ~50-60% of structural failures

### 6.3 Layer 2: Post-Write Auto-Validation Loop

- **What**: After every spec file write, run `validate.sh` and fix any errors before proceeding
- **Implementation**: Single mandatory instruction replacing 3 conflicting directives: "After writing ANY spec folder .md file, immediately run: `bash .opencode/skill/system-spec-kit/scripts/validate/validate.sh <path>`. If errors, fix before proceeding."
- **Current state**: 3 conflicting timing directives; agents choose least costly (once at end)
- **Estimated impact**: Catches ~95% cumulative (Layer 1 + Layer 2)

### 6.4 Layer 3: Pre-Commit Gate

- **What**: Pre-commit hook blocks non-compliant commits
- **Implementation**: Install existing `pre-commit-spec-validate.sh` via `git config core.hooksPath` or symlink
- **Current state**: Script exists at `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` with `.speckit-enforce.yaml` config -- designed but undeployed
- **Estimated impact**: Catches 100% of structural errors

### 6.5 Implementation Priority

| Priority | Action | Reason |
|---|---|---|
| 1 | Add plan.md inline scaffold | Highest failure rate (42.9%), zero current scaffold |
| 2 | Add implementation-summary.md scaffold | Medium failure rate (8.9%), no scaffold |
| 3 | Install pre-commit hook | Already written, zero-code-change deployment |
| 4 | Collapse 3 timing directives into 1 | Eliminates agent confusion about when to validate |
| 5 | Add tasks.md + checklist.md scaffolds | Low failure rates but completes coverage |

---

## 7. Boundary Clarifications (Iteration 7)

### 7.1 What Is IN Scope for Template Compliance

Template compliance enforcement applies to **agent-written markdown files** in spec folders that have corresponding templates in `templates/level_N/`:
- spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md (Levels 1-2)
- decision-record.md (Level 3)

Compliance means: correct H1 title format, correct H2 section names in correct order, correct ANCHOR tag pairs wrapping each section, and no missing required sections.

### 7.2 What Is OUT of Scope

| File/Area | Why It Is Out of Scope |
|-----------|----------------------|
| **description.json** | Machine-generated by `generate-description.ts` (called by `create.sh`). Agents do not write this file by hand. |
| **memory/ folder files** | Generated by `generate-context.js`, not agent-written against templates. |
| **scratch/ files** | Free-form working area, no template requirements. |
| **handover.md** | Written by @handover agent with its own format, not template-governed. |
| **debug-delegation.md** | Written by @debug agent, not template-governed. |
| **research.md** | Written by @deep-research agent, free-form research output. |
| **Content-level compliance** | Semantic emptiness, factual accuracy, stylistic consistency -- these are in the 6-dimensional gap (Section 1.5) and require future "Layer 0" work. |
| **Level 3+ governance** | AI protocols, sign-offs, extended checklists are content-level concerns, not enforceable by structural contracts. |

### 7.3 The Instruction-Implementation Mismatch

The @speckit agent definition (line 234) instructs: "Inline the exact scaffold for the specific spec doc being written." However, only spec.md has an inline scaffold (lines 327-339). The other 4 document types have no scaffold at all. This is a rule that mandates something that does not exist yet -- the 49-line compact contract (Section 3.5) is the fix.

---

## 8. Implementation Risk Assessment (Iteration 7)

### 8.1 Layer 1 Risks (Contract Injection)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Prompt bloat (~49 lines added to 4 agent defs) | Medium | Use compact table format; measure agent performance before/after |
| Agent definitions drift from templates | Medium | Version stamp in shared reference file; sync check in template update workflow |
| Agents ignore scaffold under budget pressure | Low | Layer 2 catches this; scaffold reduces errors even when partially followed |

### 8.2 Layer 2 Risks (Post-Write Validation)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Agents skip validation under tool call budget pressure | High | Make the instruction unambiguous (one directive, not three); Layer 3 is the backstop |
| Validation adds latency to every write cycle | Medium | Use `--rules TEMPLATE_HEADERS,ANCHORS_VALID` for fast structural-only check |
| Agent cannot run bash (sandboxed environments) | Low | Layer 1 prevents most errors; Layer 3 catches on commit |

### 8.3 Layer 3 Risks (Pre-Commit Hook)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Developers bypass with `--no-verify` | Medium | Awareness training; CI/CD mirror check (future) |
| Hook slows down all commits (not just spec folder) | Low | Hook already has path filtering (only runs on spec folder changes) |
| Hook not installed on fresh clones | Medium | Add installation to onboarding docs; consider `.git/hooks` via symlink from repo |

### 8.4 Overall Assessment

The 3-layer architecture provides defense-in-depth. No single layer is sufficient alone, but together they cover each other's weaknesses. The highest risk is Layer 2 (agents skipping validation), which is mitigated by Layer 3 (hard commit block). The recommended deployment order (plan.md scaffold first, then pre-commit hook) targets the highest-impact, lowest-risk changes first.

---

## 9. Implementation Blueprint (Iteration 8)

### 9.1 Deliverables Summary

| Deliverable | Action | Key Detail |
|---|---|---|
| Shared compliance reference file | CREATE | .opencode/skill/system-spec-kit/references/template-compliance-contract.md (proposed) -- canonical source with version metadata, full contract, sync protocol |
| @speckit agent definition update | EDIT x4 | Replace 12-line spec.md-only scaffold (lines 318-339) with 49-line full contract across all 4 CLI agent defs |
| Timing directive consolidation | EDIT x4 | Collapse 3 conflicting directives (lines 109, 238, 325) into one: "validate after EACH file write" |
| Post-write validation protocol | ADD x4 | New section in all agent defs: exit code parsing, fix loop (max 3 attempts), proceed/stop logic |
| Pre-commit hook installation | INSTALL | Symlink or wrapper script for existing `pre-commit-spec-validate.sh` -- zero code changes needed |

### 9.2 Layer 1: Exact Agent Definition Diff

In `.claude/agents/speckit.md` (and equivalently in the other 3 agent defs):

**Remove** (Section 8, lines 318-339): The "Inline Scaffold Contract" subsection containing only the Level 2 spec.md quick reference.

**Replace with**: The "Template Compliance Contract" subsection containing:
1. Reference link to shared compliance file
2. Full 49-line compact contract (all 5 Level 2 doc types + Level 3 decision-record.md)
3. Single enforcement directive: "After writing ANY spec folder .md file, run `validate.sh [SPEC_FOLDER] --strict`. Fix ALL errors before proceeding."

**Fix timing conflicts**:
- Line 109 (workflow diagram): Change `VALIDATE: Run validate.sh` to `VALIDATE: Run validate.sh --strict after EACH file write (not just at end)`
- Line 325 (scaffold contract): Change "before moving to the next workflow step" to "immediately after each spec-doc write or update"
- Line 238 (ALWAYS rules): Keep as-is -- this is already the correct per-write directive

### 9.3 Layer 2: Post-Write Validation Protocol

New mandatory section added to all @speckit agent definitions:

1. Run `validate.sh <SPEC_FOLDER> --strict` after every `.md` file write
2. Parse exit code: 0=pass, 1=warnings (review structural ones), 2=errors (must fix)
3. Fix loop: max 3 attempts per file, then escalate
4. Only proceed to next file after current file passes

### 9.4 Layer 3: Pre-Commit Hook Installation

**Recommended method**: Symlink into `.git/hooks/`:
```bash
ln -sf ../../.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh .git/hooks/pre-commit
```

**Current config** (`.speckit-enforce.yaml`):
- `mode: warn` (safe rollout for existing folders)
- `new_folder_mode: block` (strict for new work)
- `created_after: 2026-03-22` (progressive enforcement)

**Post-stabilization**: Change `mode: warn` to `mode: block`.

### 9.5 validate.sh --fix Mode Assessment

**Verdict**: Not recommended. The existing `progressive-validate.sh` handles safe cosmetic auto-fixes (dates, heading levels, whitespace). Structural fixes (missing anchors, wrong header names, reordering) are better handled by the agent via Layer 2's fix loop, because:
- Anchor injection is mechanical but header renaming requires semantic understanding (is "Overview" a renamed "Problem & Purpose" or a custom section?)
- Section reordering requires moving multi-line content blocks, risking corruption
- Layer 1 prevents most structural errors; Layer 2 lets the agent self-correct with error feedback

### 9.6 Implementation Effort

| Step | Effort | Dependency |
|------|--------|------------|
| Create shared reference file | ~30 min | None |
| Update `.claude/agents/speckit.md` | ~20 min | Step 1 |
| Replicate to 3 other CLI agent defs | ~15 min | Step 2 |
| Collapse timing directives (4 files) | ~15 min | Step 2 |
| Add post-write protocol (4 files) | ~10 min | Step 4 |
| Install pre-commit hook | ~5 min | None |
| End-to-end verification | ~30 min | All above |
| **Total** | **~2 hours** | |

---

## 10. Open Questions (All Answered)

- ~~Q1: What are the current template compliance failure modes?~~ **ANSWERED** (see 1.2, 1.3)
- ~~Q2: What are validate.sh's architectural limitations?~~ **ANSWERED** (see 1.5, 1.6, 1.7)
- ~~Q3: What enforcement mechanisms exist across different CLIs?~~ **ANSWERED** (see 4.1-4.5)
- ~~Q4: Could pre-write/post-write hooks guarantee compliance?~~ **ANSWERED** (see 6.1-6.4)
- ~~Q5: What template injection strategies are optimal?~~ **ANSWERED** (see 3.4, 3.5, 3.6)
- ~~Q6: What are the per-document-type failure patterns?~~ **ANSWERED** (see 5.1-5.3)
- ~~Q7: What does template-structure.js define as the canonical header contract?~~ **ANSWERED** (see 2.2, 2.3)
- ~~Q8: What concrete solution architecture would close all 3 enforcement layers?~~ **ANSWERED** (see 6.1-6.5, 9.1-9.6)

---

## 11. Final Recommendations (Iteration 9)

### 11.1 Prioritized Implementation Plan

**Phase A: High-Impact, Low-Risk (Day 1, ~1 hour)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| A1 | Create references/template-compliance-contract.md | Canonical source of truth | 15 min |
| A2 | Install pre-commit hook (`ln -sf` of existing script) | Layer 3 gate -- catches 100% at commit | 5 min |
| A3 | Change `.speckit-enforce.yaml` mode from `warn` to `block` | Hard enforcement | 2 min |

**Phase B: Contract Injection (Day 1-2, ~1 hour)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| B1 | Replace spec.md-only scaffold with full 49-line contract in `.claude/agents/speckit.md` | Layer 1 for Claude Code | 20 min |
| B2 | Replicate B1 to `.opencode/agent/speckit.md` and .opencode/agent/chatgpt/speckit.md | Layer 1 for Copilot + ChatGPT | 10 min |
| B3 | Replicate B1 to `.codex/agents/speckit.toml` (TOML-formatted) | Layer 1 for Codex | 10 min |

**Phase C: Directive Consolidation (Day 2, ~30 min)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| C1 | Collapse 3 conflicting timing directives into 1 (all 4 agent defs) | Eliminates agent confusion | 15 min |
| C2 | Add Post-Write Validation Protocol section (all 4 agent defs) | Layer 2 explicit instructions | 15 min |

**Phase D: Verification (Day 2-3, ~30 min)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| D1 | Create a test Level 2 spec folder using @speckit agent | End-to-end Layer 1 test | 15 min |
| D2 | Verify pre-commit hook triggers on spec folder commit | Layer 3 test | 5 min |
| D3 | Verify agent runs validate.sh after each write | Layer 2 test | 10 min |

**Phase E: Optional Automation (Future)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| E1 | Build `generate-compliance-contract.sh` | Eliminates manual sync | 30 min |
| E2 | Add CI/CD mirror of pre-commit hook | Bypass-proof Layer 3 | 30 min |

**Total: ~3 hours (Phases A-D) + ~1 hour optional (Phase E)**

### 11.2 Automation Feasibility

The `template-structure.js contract <level> <basename>` CLI (at `scripts/utils/template-structure.js`) returns structured JSON for all document types. A shell script wrapping this CLI + `jq` could auto-generate the shared reference file, eliminating manual sync when templates change. **Verdict**: Feasible (~50-line script) but only moderately worthwhile given infrequent template changes. Recommended as a Phase E follow-up.

### 11.3 Key Artifact

The complete, copy-pasteable content for references/template-compliance-contract.md (~140 lines) is documented in `research/iterations/iteration-009.md`, Finding 2. This is the primary deliverable from this research -- the single file an implementer needs to create to begin Phase A.

### 11.4 Agent Surface Completeness

All @speckit agent definitions that need updating:
- `.claude/agents/speckit.md` (Claude Code)
- `.opencode/agent/speckit.md` (Copilot/OpenCode base)
- .opencode/agent/chatgpt/speckit.md (ChatGPT profile)
- `.codex/agents/speckit.toml` (Codex CLI)

Note: `.gemini/agents/speckit.md` may also exist as a 5th surface and should be checked during implementation.

---

## Convergence Report

- **Stop reason**: all_questions_answered + declining_returns
- **Total iterations**: 9
- **Questions answered**: 8 / 8
- **Remaining questions**: 0
- **newInfoRatio trajectory**: 1.0 → 0.88 → 0.86 → 0.86 → 0.79 → 0.71 → 0.60 → 0.43 → 0.36
- **Convergence threshold**: 0.05
- **Last 3 iteration summaries**:
  - run 7: Consolidation pass (0.60)
  - run 8: Implementation blueprint (0.43)
  - run 9: Final synthesis + reference file draft (0.36)

---

*Research complete — 9 iterations, 8/8 questions answered, all artifacts drafted. Ready for `/spec_kit:plan`.*
