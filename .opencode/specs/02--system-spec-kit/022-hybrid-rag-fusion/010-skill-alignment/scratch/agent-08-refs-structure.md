# Gap Analysis: references/structure/ and references/templates/ vs 022-hybrid-rag-fusion Deliverables

**Agent:** 08 — References & Structure Gap Analysis
**Date:** 2026-03-14
**Source files analyzed:**
- `references/structure/folder_routing.md`
- `references/structure/folder_structure.md`
- `references/structure/phase_definitions.md`
- `references/structure/sub_folder_versioning.md`
- `references/templates/level_specifications.md`
- `references/templates/template_guide.md`
- `references/templates/template_style_guide.md`
- `references/templates/level_selection_guide.md`
- `specs/02--system-spec-kit/022-hybrid-rag-fusion/implementation-summary.md`

---

## Per-File Gap Analysis

### folder_routing.md

- **Gap 1 (P0):** No routing support for 3-level deep paths (`02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit/001-retrieval`). Section 7 shows only two-level paths (`parent/child`). The epic's code audit produced children-of-children (e.g., `022.../012-code-audit/001-retrieval` through `/021`). The `generate-context.js` integration section in `sub_folder_versioning.md` acknowledges bare-child ambiguity but `folder_routing.md` never documents 3-level path resolution at all.

- **Gap 2 (P1):** Alignment scoring algorithm (Section 3) uses only the terminal folder name for keyword extraction. For a deeply nested path like `022-hybrid-rag-fusion/012-code-audit/006-analysis`, the score is computed only against `006-analysis`, losing the parent-program signal. No guidance exists on how to score against multi-level context or aggregate parent folder name as a secondary signal.

- **Gap 3 (P1):** Health check commands (Section 12) use `specs/*/memory/` glob patterns that stop at depth 1. They will silently miss memory files at `specs/NNN-parent/NNN-child/memory/` and deeper. The epic produced memory files at 3+ levels across 51 spec folders with no documented glob pattern covering them.

- **Gap 4 (P2):** Interactive prompt (Section 8) shows only top-level folder alternatives. When a user is working in a deep nested context and alignment fails, the alternatives should include sibling children of the same parent, not just top-level folders. No such behavior is defined.

---

### folder_structure.md

- **Gap 1 (P0):** Naming convention (Section 2) documents `NNN-short-descriptive-name` but shows only one level of nesting. The epic used a two-level grouping prefix (`02--system-spec-kit`) to classify programs within the top-level `specs/` directory. This `NN--category-name` convention is entirely undocumented. A reader following this file would not know it exists, and no guidance describes when to use it vs a plain `NNN-` folder.

- **Gap 2 (P0):** Level requirements (Section 3) list required files only for flat spec folders. No definition exists for an epic-root folder (the parent folder `022-hybrid-rag-fusion` itself) which held no `spec.md` at root until the implementation summary was added — a valid pattern for a "coordination-only parent" but one that violates the stated requirements. No exception is documented.

- **Gap 3 (P1):** Example structures (Section 6) show a maximum of one level of sub-folders under a parent. The actual `012-code-audit` structure had 21 child folders at a second sub-level. No diagram or guidance exists for a parent-with-many-children (10+ children) pattern or for numbering strategies within it.

- **Gap 4 (P1):** Archive pattern (Section 5) places archived folders under `z_archive/` at the root of `specs/`. No guidance covers archiving a completed child phase within a still-active parent program (e.g., completing `022-hybrid-rag-fusion/005-core-rag-sprints` while the parent `022` is still active).

- **Gap 5 (P2):** Special folders section (Section 4) does not mention the `.gitkeep` sentinel file pattern used by stub phases (e.g., `010-skill-alignment/memory/.gitkeep`). No guidance explains when stub phases are appropriate or how to signal that a child folder is a placeholder.

---

### phase_definitions.md

- **Gap 1 (P0):** Phase count cap is documented as "maximum recommended" at 4 phases for a score of 45+. The epic delivered 16 main phases and 34 children (50 total). No documentation exists for program-scale decomposition exceeding 4 phases, including how to number phases beyond 004, how to group phases into waves, or how to maintain a master phase registry when counts are 10+.

- **Gap 2 (P0):** Phase Documentation Map (Section 3) is defined as a table in `spec.md` with four columns: Phase, Folder, Status, Description. The epic required tracking 16 phases plus status across two dimensions (main phases and children). A flat four-column table does not express grouping, hierarchy, or wave/campaign structure. No hierarchical phase map format is documented.

- **Gap 3 (P0):** Sprint gate model is entirely absent. The epic's core RAG pipeline (Phase 005) enforced explicit exit gates with metric thresholds (e.g., precision > X, test suite pass rate) before permitting the next sprint to begin. This sprint-gate pattern — where a child phase is gated by measurable criteria from the previous child — has no representation in any lifecycle stage, status value, or validation rule in this file.

- **Gap 4 (P1):** Phase status values (Section 4) include `draft`, `active`, `paused`, `complete`. The epic used additional states: `stub` (scaffold only, no spec), `deferred` (explicitly deferred from scope), and `partial` (e.g., 012/016 Draft despite tests passing). None of these are defined.

- **Gap 5 (P1):** Cross-phase dependencies (Section 4) are documented as free-text in `plan.md`. For programs with 16+ phases, this becomes unwieldy. No structured dependency format (e.g., a dependency table, DAG notation, or gate-condition field) is defined for the parent `plan.md`. The epic's sprint gate model implicitly encoded dependencies via metric gates, but no template section captures this.

- **Gap 6 (P1):** Validation section (Section 5) defines `PHASE_LINKS` checking parent-child integrity but only at one level. The epic's two-level hierarchy (`022 → 012-code-audit → 001-retrieval`) requires recursive PHASE_LINKS validation that traverses grandchildren. No documentation covers grandchild validation or the expected depth limit.

- **Gap 7 (P2):** No guidance for wave-based campaign organization. The epic executed parallel multi-agent campaigns (5 waves, 16 concurrent agents; GPT-5.4 + Codex + Sonnet campaigns). Waves are execution-time groupings of phases, orthogonal to folder hierarchy, but there is no defined format for expressing campaign membership, wave assignment, or campaign status in phase documentation.

---

### sub_folder_versioning.md

- **Gap 1 (P0):** Deep nesting (3+ levels) is not covered. Section 9 (`generate-context.js` Integration) documents `003-parent/121-child` as the deepest supported path format. The epic required `02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit/006-analysis` (4 levels: category group, program, main phase, child phase). No path format, search logic, or ambiguity resolution is defined for 3+ level nesting.

- **Gap 2 (P0):** Parent root as coordination layer is not addressed. The epic's `022-hybrid-rag-fusion` parent folder operated as a "coordination-only root" — it had no spec.md/plan.md of its own for most of the program's life, serving purely to group children. This use of a versioned sub-folder as a program registry rather than a work unit has no defined pattern, naming convention, or documentation requirements.

- **Gap 3 (P1):** Section 8 (Phases vs Versions) distinguishes the two systems but does not address the case where a phase itself contains versioned children. In the epic, `012-code-audit` is a phase (spatial decomposition) whose 21 children (`001-retrieval` through `021-revalidation`) are also phases, not versions. The distinction table breaks down at multiple levels of nesting.

- **Gap 4 (P1):** The bare-child ambiguity error message (Section 9) correctly identifies the problem for `121-audit` existing under two parents. But with 50+ spec folders potentially containing same-numbered children (e.g., `001-retrieval` could exist under `005`, `012`, and `014`), no guidance covers disambiguation conventions to prevent collision at scale (e.g., requiring unique names within a program).

- **Gap 5 (P2):** No guidance for sequential child numbering at scale. The epic's `012-code-audit` used children `001` through `021`. No convention exists for when to reset numbering (always restart at `001` per parent, or use globally unique numbers), or how to handle gaps from deferred/removed children.

---

### level_specifications.md

- **Gap 1 (P0):** No template archetype for an audit child spec. The epic's `012-code-audit` children each followed a specific pattern: an audit-of-a-feature-category with a rubric, evidence table, test count, and findings. This is a distinct document type — neither a feature spec nor an architecture decision record. Using Level 1/2/3 templates for audit children requires significant stripping and adaptation with no guidance on what sections apply.

- **Gap 2 (P0):** No template archetype for a root synthesis document. The `implementation-summary.md` at `022-hybrid-rag-fusion/` root is not a standard implementation summary — it synthesizes outcomes from 51 child folders, references multi-agent campaigns, and covers a 16-phase program. The level_N implementation-summary templates are scoped to single-folder work and provide no guidance for cross-folder synthesis.

- **Gap 3 (P0):** No template archetype for a sprint gate evaluation. The epic's sprint model required per-sprint gate documents with metric thresholds, evaluation evidence, and gate pass/fail decisions. No existing template accommodates this pattern. The `decision-record.md` is the closest analog but is scoped to a single architectural decision, not to a repeating measurement gate.

- **Gap 4 (P1):** Phase-aware specifications (Section 10) states that child phase folders "independently follow the level requirements." But for audit children in `012`, the appropriate level varies: some children completed 5 tests (Level 1 scope) while others completed 483 (Level 3+ scope). No guidance covers heterogeneous child levels within a single parent phase.

- **Gap 5 (P1):** Level 3+ (Section 5) documents "Multi-agent implementation with 10+ parallel workstreams" as a good fit, but the actual multi-agent campaign pattern — where agents operate on different child spec folders concurrently, not on different workstreams within one spec folder — is not addressed. The workstream organization model in Level 3+ is intra-folder; the epic's pattern is inter-folder.

- **Gap 6 (P2):** Status field convention (Section 7) defines `draft`, `active`, `paused`, `complete`, `archived` but not `stub` or `deferred`. The epic's 015 and 016 phases are structurally legitimate "stub" states (scaffold only), and several sprint items were explicitly `deferred`. Without defined status values, validation scripts and phase maps cannot accurately represent these states.

---

### template_guide.md

- **Gap 1 (P0):** Section 10 (Sub-Folders for Organization) documents only two-tier manual sub-folder patterns. The entire epic-scale hierarchy (`category/program/phase/child`) and its coordination layer requirements are not addressed. The "umbrella project" pattern shown uses free-form names (`spec-enforcement-improvements/`) without numbering, which conflicts with the `NNN-` naming convention used throughout the epic.

- **Gap 2 (P0):** No guidance exists for creating a program-level parent folder that acts as a coordination root without itself being a work spec. The closest analog in Section 10 is the "parent spec.md ties everything together" comment, but no template, required files, or README content is specified for coordination-root folders.

- **Gap 3 (P1):** Phase template addendums (Section 11) document the Phase Documentation Map only at the one-level parent/child relationship. No guidance exists for two-level maps (parent → phase → child) or for expressing sprint gate criteria in the Phase Documentation Map table columns.

- **Gap 4 (P1):** The cross-reference guidance (Section 4, Step 6) covers sibling documents within one spec folder. For multi-level programs, children need to reference both their immediate parent and the root program. No convention or template section covers multi-level back-references.

- **Gap 5 (P2):** Quality standards Section 7 states "Only `research.md` may include a Table of Contents" (ToC policy). Root synthesis documents like `022-hybrid-rag-fusion/implementation-summary.md` — which span 16 phases across 250+ lines with distinct major sections — benefit from navigation aids. No exception or guidance exists for epic-scale summary documents.

---

### template_style_guide.md

- **Gap 1 (P1):** Template inventory (Section 1) lists 10 user-facing + 1 internal template. Missing from inventory: sprint-gate evaluation template, audit-child spec template, and program-synthesis implementation-summary template. These three archetypes are used at scale in the epic but have no canonical source.

- **Gap 2 (P1):** Frontmatter requirements (Section 7) define `parent:` and `phase:` metadata for child phase specs but only document a single `parent:` reference. For two-level deep children (`012/006-analysis`), the frontmatter should express both `parent: 012-code-audit` and `root: 022-hybrid-rag-fusion` (or a path). No multi-level back-reference format is defined.

- **Gap 3 (P2):** Validation rules (Section 8) check `###-short-name` folder naming pattern but will fail on the `NN--category-name` grouping prefix pattern (`02--system-spec-kit`). This pattern is used in production but not documented as a valid variant of the naming convention.

- **Gap 4 (P2):** Style guide does not address naming conventions for multi-decision-record files within one folder. The epic's parent program could logically hold multiple ADRs. The single `decision-record.md` file model becomes a naming collision problem at scale, but no multi-record convention (e.g., `decision-record-NNN-topic.md`) is specified in the style guide.

---

### level_selection_guide.md

- **Gap 1 (P1):** 5-dimension scoring (Section 2) uses `Multi-Agent` (15%) as a dimension, but the scoring indicators ("parallel workstreams mentioned", "agent coordination required") describe intra-spec-folder multi-agent work. The epic's inter-folder campaign pattern — where 13+ agents each independently work on their own child spec folder — scores zero on this dimension despite being highly complex multi-agent work.

- **Gap 2 (P1):** Phase score thresholds (from `phase_definitions.md`) cap at "4 phases for 45+ score." This file's complexity scoring does not produce a separate phase recommendation output. There is no documented path from a complexity score that would recommend a 16-phase program structure. The scoring tops out at a recommendation for 4 phases with no extension guidance.

- **Gap 3 (P2):** Dynamic section scaling (Section 5) defines task counts up to "100+" for Level 3+. The epic's single Phase 005 tasks across 8 sprints ran well beyond 100. No guidance exists for task breakdown strategies when a single phase will span multiple sessions over weeks with 500+ cumulative tasks.

---

## Cross-Cutting Gaps

### CC-1 (P0): No epic-scale program pattern defined anywhere
None of the 8 files define or reference a "program" as a distinct organizational unit above a single spec folder. The epic's 022 hierarchy — `category/program/phase/child` — is a 4-level nesting that the entire reference system treats as if it does not exist. A reader would need to invent this pattern from scratch.

### CC-2 (P0): Sprint-gate pattern is completely absent
The sprint-gate model (sequence of time-boxed children, each gated by measurable exit criteria from the previous) was the defining delivery mechanism of the core RAG pipeline (Phase 005). No reference file — in structure, templates, phase definitions, or level specs — contains the concept of a sprint, a sprint gate, exit criteria, or metric-based continuation decisions. This is a P0 gap because the pattern is used for the most complex work the system is designed to support.

### CC-3 (P0): No template archetypes for the three novel document types produced at scale
The epic created three document types that appear across dozens of spec folders with no template:
1. **Audit child spec** — rubric-based code audit against a feature catalog category
2. **Program synthesis implementation-summary** — cross-folder rollup of outcomes from 50+ children
3. **Sprint gate evaluation** — per-sprint metric gate document with threshold evidence

### CC-4 (P1): Folder routing alignment scoring breaks for deep hierarchies
The alignment scoring algorithm extracts keywords only from the terminal folder name. At depth 3+, the terminal name is often a short number-plus-category (e.g., `006-analysis`) that carries little context. The scoring system is systematically weaker at the exact depths where program-scale work operates.

### CC-5 (P1): Status vocabulary is insufficient for program-scale tracking
Across structure, templates, and level definitions, the valid status values are `draft`, `active`, `paused`, `complete`, `archived`. Programs of this scale require `stub`, `deferred`, `partial`, `gate-blocked`, and `campaign-pending` to accurately represent the states documented in the epic's implementation summary.

### CC-6 (P1): Multi-agent campaign pattern has no structural home
The epic executed 5 campaigns across the program lifetime. Campaigns are execution-time groupings with wave structure, agent assignments, and consolidated verification outcomes. No spec folder file — in structure, templates, or phase definitions — accommodates a campaign manifest, wave plan, or campaign retrospective as a defined artifact type.

### CC-7 (P2): Validation scripts are not documented as program-scope aware
`validate.sh --recursive` is the only documented tool for multi-level validation. The epic had distinct validation needs at the program level: cross-phase consistency checks, cumulative test count tracking, and campaign completion verification. No documentation covers how to run or interpret validation across a full program hierarchy.

---

## Recommendations

### Immediate (address in skill alignment)

1. **Document the `NN--category-name` grouping prefix** in `folder_structure.md` Section 2 as a first-class convention. Define when it is used (programs with 10+ spec folders benefit from category grouping) and how it differs from a plain `NNN-` folder.

2. **Add a program-coordination-root pattern** to `folder_structure.md` and `template_guide.md`. Define required files (program-index.md or README.md listing all phases), permitted absence of spec.md at root, and naming convention for the root folder.

3. **Add sprint gate status values** (`stub`, `deferred`, `gate-blocked`) to `level_specifications.md` Section 7 and `phase_definitions.md` Section 4.

4. **Extend phase count guidance** in `phase_definitions.md` Section 2 beyond the 4-phase maximum. Add a table row for "10+ phases (program-scale)" with guidance on grouping phases into tracks and maintaining a program registry.

### Near-term (new template archetypes)

5. **Create an audit-child spec template** for the feature-category code audit pattern. Minimum sections: audit scope (feature catalog reference), rubric, findings table (pass/fail/defer per finding), evidence, and test delta.

6. **Create a sprint-gate evaluation template** for metric-gated continuation decisions. Minimum sections: sprint identifier, exit criteria table (metric, threshold, measured value, pass/fail), decision, and next-sprint scope.

7. **Create a program-synthesis implementation-summary template** at Level 3+ that replaces the single-folder outcome model with a phase-rollup structure (table of phases with status, outcomes, and test counts) plus a program-level decisions table.

### Structural improvements

8. **Extend `folder_routing.md` Section 7** to document 3-level path format (`category/program/phase/child`), path normalization for grouping prefixes, and health check glob patterns covering all nesting depths.

9. **Update `template_style_guide.md` Section 7** to define a multi-level frontmatter format with `parent:`, `root:`, and `depth:` fields for child specs at depth 2+.

10. **Add a Multi-Agent Campaign section to `phase_definitions.md`** covering campaign manifest as a named artifact in `scratch/`, wave definition format, agent assignment, and campaign retrospective as an optional spec folder document.
