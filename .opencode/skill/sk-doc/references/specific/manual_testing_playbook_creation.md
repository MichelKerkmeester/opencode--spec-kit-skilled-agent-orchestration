---
title: Manual Testing Playbook Creation - Standards and Workflow
description: Standards and workflow guidance for creating integrated manual testing playbooks with root-level category folders, realistic orchestrator-led prompts, and evidence-driven release review.
---

# Manual Testing Playbook Creation - Standards and Workflow

Standards and workflow guidance for creating integrated manual testing playbooks with root-level category folders, realistic orchestrator-led prompts, and evidence-driven release review.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Manual testing playbooks are operator-facing validation packages for skills with meaningful runtime or orchestration behavior. They are not just command checklists: they define how a realistic user request should be executed, what evidence must be captured, and how release readiness is graded.

**Core Principle**: Keep shared rules in the root playbook, keep execution truth in per-feature files, and make every scenario deterministic enough that a different operator can reproduce the verdict.

**Primary Sources**:
- [manual_testing_playbook_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_template.md)
- [manual_testing_playbook_snippet_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md)
- `.opencode/skill/system-spec-kit/manual_testing_playbook/`
- `.opencode/skill/mcp-coco-index/manual_testing_playbook/`

**Current Reality Highlights**:
- The canonical package is a root `MANUAL_TESTING_PLAYBOOK.md` plus numbered category folders at the playbook root.
- Integrated review and orchestration guidance lives in the root playbook.
- Separate canonical `review_protocol.md` and `subagent_utilization_ledger.md` files are no longer part of the contract.
- Per-feature files should read like feature-catalog-style entries with frontmatter, numbered sections, and divider lines.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:when-to-create-a-playbook -->
## 2. WHEN TO CREATE A PLAYBOOK

Create a manual testing playbook when the documentation needs a reusable, reviewable manual validation surface.

**Strong signals**:
- 5+ distinct features need manual validation
- release decisions depend on structured evidence
- realistic orchestration behavior matters
- multiple operators or agents will execute the same scenarios
- automated tests cover internals but not operator-visible behavior

**Use a lighter alternative when**:
- test steps fit cleanly in a spec folder checklist
- the feature is one-off or experimental
- the system has only a few manually testable behaviors
- automated tests already cover the only meaningful acceptance criteria

Decision rule:

```text
Need reusable manual validation with captured evidence?
  YES -> Create a playbook package
  NO  -> Keep test steps in spec/checklist docs
```

<!-- /ANCHOR:when-to-create-a-playbook -->
<!-- ANCHOR:canonical-package-shape -->
## 3. CANONICAL PACKAGE SHAPE

The current playbook contract is:

```text
manual_testing_playbook/
├── MANUAL_TESTING_PLAYBOOK.md
├── 01--category-name/
│   ├── 001-feature-name.md
│   └── 002-feature-name.md
└── 02--another-category/
    └── 001-feature-name.md
```

**Invariants**:
- root file is always `MANUAL_TESTING_PLAYBOOK.md`
- per-feature files live in numbered root-level category folders
- category directories use `NN--category-name`
- per-feature files use stable numeric slugs such as `001-feature-name.md`
- every feature ID maps to exactly one per-feature file

**Do not use**:
- a `snippets/` subtree
- separate canonical `review_protocol.md`
- separate canonical `subagent_utilization_ledger.md`
- duplicated scenario truth across multiple sidecar files

<!-- /ANCHOR:canonical-package-shape -->
<!-- ANCHOR:root-playbook-responsibilities -->
## 4. ROOT PLAYBOOK RESPONSIBILITIES

The root playbook is the directory and review surface for the whole package.

It should own:
- frontmatter, H1 intro, and `TABLE OF CONTENTS`
- global overview and coverage note
- global preconditions
- global evidence requirements
- deterministic command notation rules
- integrated review protocol and release-readiness rules
- integrated orchestration and wave-planning guidance
- category sections with short per-feature summaries
- automated test cross-reference section
- feature catalog cross-reference index

**Root summaries should be concise but useful**:
- enough context to understand what each scenario covers
- enough prompt detail to preview the operator intent
- no need to duplicate the full execution matrix from the per-feature file

**Root-to-feature rule**:
- root document explains package-level policy
- per-feature files carry scenario-specific execution truth

<!-- /ANCHOR:root-playbook-responsibilities -->
<!-- ANCHOR:per-feature-file-responsibilities -->
## 5. PER-FEATURE FILE RESPONSIBILITIES

Each per-feature file is the canonical scenario contract for one feature ID.

Required structure:
1. `## 1. OVERVIEW`
2. `## 2. CURRENT REALITY`
3. `## 3. TEST EXECUTION`
4. `## 4. REFERENCES` or `## 4. SOURCE FILES`
5. `## 5. SOURCE METADATA`

**Per-feature files must include**:
- frontmatter with `title` and `description`
- realistic user request when that clarifies user intent
- operator prompt or orchestrator prompt
- exact prompt in the scenario table when a table is used
- exact command sequence
- expected signals
- evidence requirements
- pass/fail criteria
- failure triage
- root playbook link and feature catalog link when applicable

### Prompt Quality Rules

Prompts should be:
- realistic, not just command paraphrases
- deterministic enough to produce stable evidence
- explicit about what to capture
- explicit about the user-facing verdict or outcome

Weak prompt:
```text
Test search
```

Acceptable prompt:
```text
Use memory_context in auto mode for the flaky index scan retry issue, capture the returned bounded context, and return a concise pass/fail verdict with the main reason.
```

**Prompt sync rule**:
- the structured prompt field in `CURRENT REALITY`
- the `Exact Prompt` column in the execution table
- and any root summary prompt text

must agree.

<!-- /ANCHOR:per-feature-file-responsibilities -->
<!-- ANCHOR:authoring-workflow -->
## 6. AUTHORING WORKFLOW

Recommended workflow:

1. Define category directories and ID prefixes.
2. Create the root `manual_testing_playbook/` directory.
3. Copy the root scaffold from the playbook template.
4. Create one per-feature file for each feature ID.
5. Write the root category summaries and link every per-feature file.
6. Add automated-test and feature-catalog cross-references.
7. Review destructive scenarios and isolate them in the root guidance.
8. Validate the root document and manually spot-check per-feature links.

**Authoring sequence matters**:
- decide categories and IDs before writing summaries
- write root package policy before writing scenario-specific exceptions
- write the per-feature prompt and execution truth before polishing summary prose

**Cross-reference rule**:
- if a feature catalog exists, every playbook scenario should link back to the matching catalog entry or explicitly note when no dedicated catalog entry exists

<!-- /ANCHOR:authoring-workflow -->
<!-- ANCHOR:validation-and-release-workflow -->
## 7. VALIDATION AND RELEASE WORKFLOW

The current validation workflow is partly automated and partly manual.

**Automated checks**:
- validate the root playbook with `validate_document.py`
- grep or script-check for broken local links
- confirm feature ID counts between root index and per-feature files

**Manual checks**:
- per-feature files have frontmatter and numbered section headers
- divider lines appear between numbered sections
- prompts are synchronized between summary fields and execution tables
- destructive scenarios are clearly marked and isolated
- review/readiness rules in the root still match the package contract

**Validator limitation**:
- the current validator is root-doc focused
- it does not recurse into category folders
- it does not verify cross-file playbook links by itself

That limitation must be documented honestly in both the reference and the generated playbook docs.

<!-- /ANCHOR:validation-and-release-workflow -->
<!-- ANCHOR:common-mistakes -->
## 8. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Keeping separate canonical `review_protocol.md` or `subagent_utilization_ledger.md` files | Splits package truth across sidecar docs | Fold shared review/orchestration rules into the root playbook |
| Using a `snippets/` subtree | No longer matches the current package contract | Put per-feature files in numbered root-level category folders |
| Unsynced prompt fields | Operators do not know which prompt is canonical | Update `CURRENT REALITY`, table prompt, and root summary together |
| Broken feature-catalog links | Scenario traceability is lost | Link each scenario to its catalog entry or clearly document the exception |
| Bare command paraphrase prompts | Fails realistic orchestrator-led testing | Rewrite prompts around user intent, evidence, and verdict |
| Overloading root summaries with full execution detail | Root doc becomes noisy and hard to review | Keep full execution truth in the per-feature file |

<!-- /ANCHOR:common-mistakes -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

- [manual_testing_playbook_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_template.md) - root playbook scaffold
- [manual_testing_playbook_snippet_template.md](../../assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md) - per-feature file scaffold
- [feature_catalog_creation.md](./feature_catalog_creation.md) - companion reference for the feature-catalog side of the contract
- [quick_reference.md](../global/quick_reference.md) - condensed commands and file locations
- [workflows.md](../global/workflows.md) - execution-mode reference

<!-- /ANCHOR:related-resources -->
