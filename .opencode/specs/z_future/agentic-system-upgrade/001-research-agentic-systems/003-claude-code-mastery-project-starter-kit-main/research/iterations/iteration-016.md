# Iteration 016 — Validation Pipeline Versus Executable Invariants

## Research question
Is `system-spec-kit`'s validation pipeline too broad and document-shaped, and does the external repo suggest the local system should center more of its trust model on executable invariants with human-readable summaries generated from those checks?

## Hypothesis
The external repo will show a lighter pattern: concrete file/script assertions plus executable tests, with human-readable checklists layered on top. The local repo will still need stronger doc validation, but it will look like too much of the operator burden is currently carried by prose-oriented rule families.

## Method
Compared the external repo's starter-kit verification document, test checklist, and unit-test style to the local spec validator's rule stack and configuration model.

## Evidence
- The external starter-kit verification flow is explicit and executable: it checks file existence, hook wiring, package scripts, and dependency declarations with concrete shell commands rather than a large documentation-governance taxonomy. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/STARTER-KIT-VERIFICATION.md:21-57] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/STARTER-KIT-VERIFICATION.md:190-259]
- The external checklist is intentionally a reporting layer, not the enforcement engine itself: it summarizes test coverage and status in a human-readable artifact. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/CHECKLIST.md:1-55]
- The external unit tests encode behavior directly with concrete assertions for hooks, markdown processing, content config validation, and SEO generation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/unit/hooks.test.ts:1-100] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/tests/unit/content-config-validation.test.ts:30-149]
- The local validator currently advertises ten rule families, level-specific document requirements, recursive child-phase validation, and environment-driven rule-subset configuration. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:138-159]

## Analysis
The external repo's validation story is lighter, but the core lesson is not "validation should be shallow." It is "machine-check what you can, and let the human-readable status view be downstream of that." `system-spec-kit` appears to ask one validator to serve as both enforcement engine and operator education surface. That creates breadth, but it also makes the system look more ceremonious than it needs to. The local repo likely still needs richer doc-integrity checks than the external starter kit, yet the enforcement model would be easier to maintain if its rule families were consolidated into fewer, more obviously executable invariants.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** One validator orchestrates many named rule families across required files, section structure, evidence, anchors, phase links, and integrity semantics.
- **External repo's approach:** Keep executable checks concrete and narrow, then layer a checklist/reporting surface on top for humans.
- **Why the external approach might be better:** It separates enforcement from explanation, making both easier to understand and evolve.
- **Why system-spec-kit's approach might still be correct:** Documentation governance really is part of the product here, so a purely code/test-centric validator would miss important failure modes.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Collapse the validation engine into a smaller invariant taxonomy such as required artifacts, integrity/linkage, evidence quality, and completion state; generate human-readable readiness/checklist views from those invariants instead of encoding so much operator guidance directly into the rule surface.
- **Blast radius of the change:** large
- **Migration path:** First group existing rules into higher-level invariant families without changing pass/fail semantics, then generate operator summaries from validator output, and only after parity is proven remove redundant rule-specific prose and duplicated checklists.

## Conclusion
confidence: high

finding: The external repo suggests `system-spec-kit`'s validation story would benefit from simplification. The likely win is not fewer guarantees, but a smaller executable core with clearer derived reporting.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, validation rule docs, derived checklist/reporting surfaces
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** map the current rules into a reduced invariant model without losing the behaviors that actually catch packet drift
- **Priority:** must-have

## Counter-evidence sought
I looked for proof that the external repo protects documentation integrity at the same depth as `system-spec-kit`; it does not. That means the local system should not copy the external validation stack literally, only its separation between executable checks and human-readable reporting. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:94-99]

## Follow-up questions for next iteration
If validation summaries become generated views, should the command system also become manifest-driven instead of README-driven?
How much of the current operator friction is caused by static command/documentation surfaces not sharing one metadata source?
