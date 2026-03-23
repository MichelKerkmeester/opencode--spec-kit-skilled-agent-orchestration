---
title: Deep Research Strategy Template
description: Strategy file for speckit template compliance enforcement research.
---

# Research Strategy

## Topic
How to make sure speckit documentation that gets written by any agent, from any CLI is always 100% template compliant

## Key Questions (remaining)
(All questions answered -- research complete)

## Answered Questions
- [x] Q1: What are the current template compliance failure modes? -- **Answer**: 18 validation rules in 3 severity tiers. The 3 dominant agent failure modes are: (1) TEMPLATE_HEADERS -- agents use wrong section names or reorder H2 sections; (2) ANCHORS_VALID -- agents omit anchor tags entirely or misspell them; (3) SPEC_DOC_INTEGRITY -- broken cross-file references. Confirmed by real data: 54 errors across 20 spec folders, requiring ~270 edits in 3 fix waves. The root cause is that validation is purely post-hoc with no pre-write enforcement.
- [x] Q2: How does validate.sh work -- what are its architectural limitations? -- **Answer**: validate.sh is a source-and-execute orchestrator with 20 rule scripts covering ONLY structural compliance (headings, files, anchors, links). It delegates header validation to template-structure.js (a machine-readable contract engine). The 6-dimensional gap: cannot catch (a) semantic emptiness, (b) cross-document consistency, (c) content completeness, (d) stylistic compliance, (e) factual accuracy, (f) template version drift. progressive-validate.sh adds auto-fix only for low-impact issues (dates, whitespace, heading levels). quality-audit.sh is just a batch runner. The key enabler for solutions: template-structure.js contract is extractable and machine-readable.
- [x] Q3: What enforcement mechanisms exist across different CLIs? -- **Answer**: All 4 CLIs (Copilot, Claude Code, Codex, Gemini) have @speckit agent definitions with identical compliance instructions (template-first, validate before completion). Enforcement is PURELY INSTRUCTIONAL -- no CLI has write-time validation triggers. The instructions contain 3 conflicting timing directives: "after each write" (rules), "before next step" (scaffold contract), and "once at end" (workflow diagram). Only spec.md has an inline scaffold in the agent prompt; plan.md, tasks.md, checklist.md, and impl-summary.md have none. A pre-commit hook script exists but is NOT installed.
- [x] Q4: Could pre-write/post-write validation hooks guarantee compliance? -- **Answer**: Yes, through a 3-layer architecture. Layer 1 (pre-generation contract injection) prevents ~50-60% of errors by embedding template contracts in agent prompts. Layer 2 (post-write auto-validation loop) catches ~95% cumulative by mandating `validate.sh` after each file write with a fix loop. Layer 3 (pre-commit gate) catches 100% by blocking non-compliant commits. The pre-commit hook script already exists at `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` but is not installed. No CLI supports native post-tool-call hooks, so Layer 2 must be instructional ("run validate.sh after each write"). The 3 conflicting timing directives must be collapsed into one: "validate after each write."
- [x] Q6: What are the specific failure patterns per document type? -- **Answer**: Quantified from the clean-slate rewrite (commit b88c07f82) across 20 phase spec folders: plan.md (273 header/anchor changes, HIGHEST), spec.md (267, HIGHEST), implementation-summary.md (57, MEDIUM), checklist.md (22, LOW), tasks.md (18, LOW). spec.md and plan.md together account for 84.5% of all structural compliance changes. The "scaffold paradox": spec.md has the only inline scaffold yet still had the most absolute changes, because scaffolds alone are necessary but insufficient -- phase addenda, content adaptation, and alternative prompt pathways cause deviation.
- [x] Q7: What does template-structure.js define as the canonical header contract for each document type at each level? -- **Answer**: loadTemplateContract(level, basename) returns a JSON object with headerRules (required H2s in order), optionalHeaderRules (level-gated), requiredAnchors (in order), optionalAnchors, and allowedAnchors. For Level 2, all 5 doc types have 1:1 header-anchor parity (spec.md: 7/7, plan.md: 7/7, tasks.md: 6/6, checklist.md: 8/8, impl-summary.md: 6/6). The CLI supports `contract` and `compare` commands. Phase addenda are auto-merged via inferPhaseSpecAddenda(). The full contract for all 5 Level 2 docs fits in ~45 lines of compact markdown -- feasible for inline agent prompt injection.
- [x] Q8: What does a concrete 3-layer enforcement architecture look like? -- **Answer**: Layer 1 (Pre-Generation): Inject compact template contracts (~45 lines for L2) into all 4 @speckit agent definitions. Priority: plan.md first (highest failure, zero scaffold), then impl-summary.md. Layer 2 (Post-Write): Collapse 3 conflicting timing directives into one mandatory instruction: "after writing ANY spec folder .md file, immediately run validate.sh; if errors, fix before proceeding." Layer 3 (Pre-Commit): Install the existing pre-commit-spec-validate.sh hook via git hooks path configuration. Implementation priority: (1) plan.md scaffold, (2) impl-summary.md scaffold, (3) install pre-commit hook, (4) resolve timing directives, (5) tasks.md + checklist.md scaffolds.
- [x] Q5: What template injection strategies could embed compliance constraints directly into agent prompts so docs are correct at generation time? -- **Answer**: A 49-line compact contract table covering all 5 Level 2 doc types + Level 3 decision-record.md. Uses anchor-to-H2 mapping tables per doc type. Deployment via HYBRID approach: (a) shared reference file at `.opencode/skill/system-spec-kit/references/template-compliance-contract.md` as canonical source, (b) compact summary embedded inline in all 4 CLI @speckit agent definitions. The contract replaces the current spec.md-only scaffold (lines 327-339 in `.claude/agents/speckit.md`). Phase addenda handled automatically by validate.sh -- no extra agent knowledge needed. Level 3 decision-record.md uses parametric anchor pattern (adr-NNN with 6 sub-anchors). Implementation sequence: create shared reference, update 4 CLI agents, collapse timing directives, add sync check.

## What Worked
- Direct source code examination of validate.sh + rule scripts: Gave authoritative understanding of the validation surface far faster than any documentation would (iteration 1)
- Reading template-structure.js: Revealed the contract engine that powers both TEMPLATE_HEADERS and ANCHORS_VALID rules -- the two highest-impact failure modes (iteration 1)
- Systematic reading of all 3 pipeline scripts (validate.sh, progressive-validate.sh, quality-audit.sh) in one pass: Gave complete architectural picture and revealed the 6-dimensional gap taxonomy (iteration 2)
- Examining individual rule scripts (check-template-headers.sh, check-spec-doc-integrity.sh): Confirmed that template-structure.js is the extractable machine-readable contract -- key enabler for solution design (iteration 2)
- Running the CLI contract extraction for all 5 Level 2 document types: Gave complete, authoritative JSON contracts. The 1:1 header-anchor parity across all types means a compact table can represent the full contract (iteration 3)
- Cross-referencing contract output with @speckit agent definition: Revealed that only spec.md has an inline scaffold in the agent prompt -- the other 4 document types are unscaffolded, explaining why agents fail more on those types (iteration 3)
- Parallel comparison of all 4 CLI @speckit agent definitions: Confirmed enforcement is identical across CLIs (same instructions, same gaps) -- the problem is universal, not CLI-specific (iteration 4)
- Finding the uninstalled pre-commit hook: High-value discovery showing a designed-but-undeployed solution exists at `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` with matching `.speckit-enforce.yaml` config (iteration 4)
- Identifying 3 conflicting validation timing directives in the agent definition: Revealed that even the instructional enforcement is self-contradictory (iteration 4)
- Quantitative per-doc-type analysis via git diff line counting: Gave concrete failure distribution evidence (plan.md 273, spec.md 267, impl-summary 57, checklist 22, tasks 18) that directly informed prioritization (iteration 5)
- Direct template file reading instead of CLI contract command: More reliable than the JS CLI entry point which had path resolution issues (iteration 5)
- Extracting all 5 template anchor/header contracts in a single batch pass: Gave complete data for drafting the injection text without multiple iterations (iteration 6)
- Focusing purely on drafting after prior iterations established feasibility: The ~45-line estimate from iteration 3 held (actual: 49 lines), so this iteration could be pure synthesis rather than exploration (iteration 6)
- Targeted verification of specific claims against source code: Consolidation pass confirmed all key findings with exact line numbers and discovered two genuine gaps (boundary clarifications, risk assessment) that improve research quality (iteration 7)
- Checking description.json scope: Confirmed it is machine-generated (outside template compliance scope), resolving a potential edge case question (iteration 7)
- Pure synthesis from well-established findings: With all 8 questions answered, this iteration produced actionable implementation blueprints (exact diffs, installation commands, effort estimates) without needing new external research (iteration 8)
- Cross-referencing current source code against proposed changes: Reading the actual speckit.md lines (109, 238, 318-339, 325) confirmed the exact edit locations and validated that the proposed diffs target the right content (iteration 8)
- Running template-structure.js CLI to verify iteration 6 contract data: Confirmed all 5 Level 2 contracts match the manually extracted data, validated automation feasibility, and gave authoritative confidence for the shared reference file content (iteration 9)
- Consolidating 8 iterations into two actionable artifacts (reference file + phased plan): Reduced cognitive load for implementer from 521-line research to copy-pasteable content + sequenced checklist (iteration 9)

## What Failed
- (No failed approaches in iteration 1)
- Looking for test fixtures 055-058: These appear to be checklist item IDs, not fixture directories. No test fixtures directory exists within the rules/ folder (iteration 2)
- Looking for CLI-specific hook mechanisms (Claude Code settings, Codex config): No CLI supports post-tool-call hooks -- the hook infrastructure does not exist at the CLI level (iteration 4)
- template-structure.js CLI contract command: Failed with path resolution error when called via node directly; the dist build path differs from source path (iteration 5)

## Exhausted Approaches (do not retry)
[Populated when an approach has been tried from multiple angles without success]

## Next Focus
RESEARCH COMPLETE. All 8 questions answered. All artifacts drafted. Iteration 9 produced the complete shared reference file content (~140 lines, copy-pasteable) and a 5-phase prioritized implementation plan. The research is ready for convergence detection and final synthesis by the orchestrator.

If the orchestrator determines another iteration is needed, the only remaining work would be:
- Draft the actual `generate-compliance-contract.sh` script (Phase E1 from the plan)
- Verify whether `.gemini/agents/speckit.md` exists as a 5th agent surface to update
- No further web or codebase research is needed

## Known Context
From the current session: We just completed a clean-slate rewrite of 015-manual-testing-per-playbook (20 spec folders). The initial agent writes produced 54 validation errors across three categories: TEMPLATE_HEADERS (wrong section names), SPEC_DOC_INTEGRITY (broken file references), and ANCHORS_VALID (missing/misordered anchors). These required 3 additional fix waves with ~270 individual edits to reach 0 errors. This is the exact problem we're researching — agents don't inherently produce template-compliant output.

## Research Boundaries
- Max iterations: 15
- Convergence threshold: 0.05
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Current segment: 1
- Started: 2026-03-22T17:42:00.000Z
