---
title: "Decision Record: Reverse-Engineer Doc Visual Skill [037-reverse-engineer-doc-visual/decision-record]"
description: "The doc-visual source material contains 5 commands, 11 diagram types, 9 aesthetic profiles, a CSS pattern library (~15KB), a library guide (~16KB), and 3 HTML templates. P..."
trigger_phrases:
  - "decision"
  - "record"
  - "reverse"
  - "engineer"
  - "visual"
  - "decision record"
  - "037"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Reverse-Engineer Doc Visual Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Skill Graph Architecture Over Monolithic SKILL.md

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The doc-visual source material contains 5 commands, 11 diagram types, 9 aesthetic profiles, a CSS pattern library (~15KB), a library guide (~16KB), and 3 HTML templates. Putting all of this into a single SKILL.md file would far exceed the 5,000-word limit enforced by package_skill.py. We needed to decide how to structure the skill to fit within framework constraints while preserving all content.

### Constraints

- SKILL.md hard limit of 5,000 words (enforced by package_skill.py validation)
- Total content exceeds 10,000 words across all sections
- Skill must be discoverable as a single unit via skill_advisor.py
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Skill Graph architecture with SKILL.md as a lean router, index.md as a Map of Content, and 10 node files for detailed content.

**How it works**: SKILL.md (~1,683 words) contains the Smart Router pseudocode and high-level overview. index.md organizes nodes into 4 groups (Foundation, Workflow, Design System, Reference) via wikilinks. Each node file is self-contained and loaded on demand by the AI agent based on the task at hand.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skill Graph (chosen)** | Fits word limit; progressive loading; modular maintenance | More files to manage; wikilink resolution needed | 9/10 |
| Monolithic SKILL.md | Single file; simple to maintain | Exceeds 5,000-word limit; wastes context on irrelevant sections | 3/10 |
| Split into multiple skills | Each skill stays small | Breaks discoverability; 5 separate routing entries needed | 4/10 |

**Why this one**: Skill Graph is the only approach that keeps SKILL.md under the 5,000-word limit while preserving all content in a discoverable, progressively-loadable structure.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- SKILL.md stays at 1,683 words (66% under the 5,000-word limit)
- Agents load only the nodes they need, reducing context usage
- Each node can be updated independently without affecting others

**What it costs**:
- 12 files instead of 1 for the skill core. Mitigation: index.md MOC provides clear navigation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken wikilinks if files are renamed | M | Verification step checks all 10 links resolve |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Content exceeds 5,000-word limit; decomposition is mandatory |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives considered; monolithic and multi-skill rejected |
| 3 | **Sufficient?** | PASS | 10 nodes cover all content without over-fragmentation |
| 4 | **Fits Goal?** | PASS | Directly enables skill integration within framework constraints |
| 5 | **Open Horizons?** | PASS | New diagram types or commands can be added as new nodes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Created `.opencode/skill/sk-doc-visual/SKILL.md` (router, 1,683 words)
- Created `.opencode/skill/sk-doc-visual/index.md` (MOC, 4 groups, 10 wikilinks)
- Created 10 files in `.opencode/skill/sk-doc-visual/nodes/`

**How to roll back**: Delete the entire `.opencode/skill/sk-doc-visual/` directory.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: `workflows-` Prefix Naming Convention

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The OpenCode skill framework uses naming prefixes to classify skills by type. We needed to decide the correct prefix for the sk-doc-visual skill. The skill defines a multi-phase workflow (Think > Structure > Style > Deliver) with defined step sequences, which aligns with the `workflows-` convention.

### Constraints

- Existing convention: `workflows-` prefix for process-oriented skills with defined phase sequences
- Existing examples: `sk-doc`, `sk-git`, `sk-code--opencode`
- Must be discoverable via skill_advisor.py naming patterns
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: `sk-doc-visual` as the skill directory name.

**How it works**: The `workflows-` prefix signals that this skill follows a defined multi-phase process (Think > Structure > Style > Deliver). This matches the naming convention used by other process-oriented skills in the framework.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **sk-doc-visual (chosen)** | Matches convention; signals process orientation | Longer name | 9/10 |
| doc-visual (no prefix) | Shorter name | Breaks convention; no type signal | 4/10 |
| tools-doc-visual | Alternative prefix | `tools-` implies utility, not workflow | 5/10 |

**Why this one**: The 4-phase workflow (Think > Structure > Style > Deliver) is the defining characteristic of this skill, making `workflows-` the correct classification.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Consistent naming with existing skills (sk-doc, sk-git)
- Users and agents can infer the skill type from the prefix

**What it costs**:
- Longer directory path. Mitigation: Tab completion and skill_advisor.py handle discovery.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| None significant | L | Convention is well-established |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Naming convention must be followed for framework consistency |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered |
| 3 | **Sufficient?** | PASS | Prefix alone is sufficient to classify |
| 4 | **Fits Goal?** | PASS | Enables discovery and classification |
| 5 | **Open Horizons?** | PASS | Convention scales to future workflow skills |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Skill directory created as `.opencode/skill/sk-doc-visual/`
- skill_advisor.py entries reference `sk-doc-visual`

**How to roll back**: Rename the directory and update all skill_advisor.py references.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Progressive Disclosure via 3-Tier Loading

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The skill contains ~46KB of reference material (quick_reference ~4KB, css_patterns ~15KB, library_guide ~16KB, navigation_patterns ~5KB, quality_checklist ~6KB). Loading all references on every skill invocation would consume excessive context window space. We needed a strategy to load only what is needed.

### Constraints

- AI agent context windows have finite capacity
- Most tasks need only the command cheat sheet and CDN snippets
- CSS-heavy tasks need the full CSS pattern library
- Library-specific tasks need the library guide
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Three-tier progressive loading: ALWAYS (loaded automatically), CONDITIONAL (loaded when task type matches), ON_DEMAND (loaded only when explicitly needed).

**How it works**: SKILL.md's Smart Router classifies the task and determines which loading tier to activate. quick_reference.md is always loaded. css_patterns.md and navigation_patterns.md load for CSS-heavy or multi-section tasks. library_guide.md and quality_checklist.md load only when specifically requested.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-tier loading (chosen)** | Optimizes context usage; only loads what is needed | Requires Smart Router logic to classify tasks | 9/10 |
| Load all references always | Simple; no classification needed | Wastes ~42KB of context on every invocation | 3/10 |
| Load nothing by default | Maximum context savings | User must manually request each reference | 5/10 |

**Why this one**: The 3-tier approach balances context efficiency with usability. The most common reference (quick_reference.md at ~4KB) is always available, while heavier references (~31KB combined) load only when needed.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Initial context usage reduced by ~31KB compared to loading all references
- Most common operations (generate, diff-review) work with ALWAYS tier only
- Agents self-serve additional context when needed

**What it costs**:
- Smart Router must correctly classify task types. Mitigation: Fallback to ALWAYS tier if classification is uncertain.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Smart Router misclassifies task, loads wrong tier | L | ALWAYS tier covers most cases; agent can manually load additional references |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 46KB of references would consume significant context |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered (all, none, tiered) |
| 3 | **Sufficient?** | PASS | 3 tiers cover all usage patterns |
| 4 | **Fits Goal?** | PASS | Context optimization directly improves agent performance |
| 5 | **Open Horizons?** | PASS | New references can be assigned to appropriate tiers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- ALWAYS: `references/quick_reference.md`
- CONDITIONAL: `references/css_patterns.md`, `references/navigation_patterns.md`
- ON_DEMAND: `references/library_guide.md`, `references/quality_checklist.md`
- Loading tiers documented in SKILL.md Smart Router section

**How to roll back**: Change all references to ALWAYS loading by updating SKILL.md.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: MULTI_SKILL_BOOSTERS for Conflicting Keywords

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

Several keywords relevant to the sk-doc-visual skill (diagram, flowchart, review, architecture, data) already exist in skill_advisor.py's INTENT_BOOSTERS mapped to other skills. Adding them as INTENT_BOOSTERS for sk-doc-visual would overwrite the existing mappings and break routing for other skills.

### Constraints

- INTENT_BOOSTERS uses a dictionary where each keyword maps to exactly one skill
- Keywords like "diagram", "flowchart", "review" are already mapped to other skills
- Cannot break existing skill routing for these keywords
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Use MULTI_SKILL_BOOSTERS for the 5 conflicting keywords (diagram, flowchart, review, architecture, data), and INTENT_BOOSTERS for the 11 unique keywords.

**How it works**: MULTI_SKILL_BOOSTERS allows multiple skills to be boosted by the same keyword. When "diagram" appears in a query, both the existing skill and sk-doc-visual get boosted, and the final routing score determines which one wins based on other context signals.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **MULTI_SKILL_BOOSTERS for conflicts (chosen)** | Preserves existing routing; both skills can match | Slightly more complex routing logic | 9/10 |
| Overwrite INTENT_BOOSTERS | Simpler; direct mapping | Breaks existing skill routing for those keywords | 2/10 |
| Avoid conflicting keywords entirely | No risk to existing routing | Reduces discoverability for common queries | 4/10 |

**Why this one**: MULTI_SKILL_BOOSTERS is the framework's built-in mechanism for exactly this scenario. Using it preserves existing routing while enabling sk-doc-visual discovery.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Existing skill routing remains intact for all 5 conflicting keywords
- sk-doc-visual becomes discoverable for queries containing these common terms
- Multiple skills can compete fairly on routing score

**What it costs**:
- Routing for ambiguous queries (e.g., just "diagram") may require more context to disambiguate. Mitigation: sk-doc-visual-specific keywords in INTENT_BOOSTERS provide strong signal.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ambiguous queries route to wrong skill | L | 11 unique INTENT_BOOSTERS provide strong baseline; MULTI_SKILL_BOOSTERS are secondary |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5 keywords already mapped; must use MULTI_SKILL_BOOSTERS |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered |
| 3 | **Sufficient?** | PASS | Framework mechanism handles the conflict |
| 4 | **Fits Goal?** | PASS | Enables routing without breaking existing skills |
| 5 | **Open Horizons?** | PASS | Pattern can be reused for future skill conflicts |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- 11 entries added to INTENT_BOOSTERS in `.opencode/skill/scripts/skill_advisor.py`
- 5 entries added to MULTI_SKILL_BOOSTERS in `.opencode/skill/scripts/skill_advisor.py`

**How to roll back**: Remove the 11 INTENT_BOOSTERS and 5 MULTI_SKILL_BOOSTERS entries from skill_advisor.py.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Expanded Quality Checks (9 from Original 7)

<!-- ANCHOR:adr-005-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The original doc-visual repo defines 7 quality checks for generated HTML output. During reverse-engineering, we identified two gaps: accessibility (color contrast, semantic HTML, screen reader support) and reduced-motion support (respecting `prefers-reduced-motion` media query). These are standard web quality concerns that the original did not explicitly address.

### Constraints

- Original 7 checks must be preserved exactly (no removal or modification)
- Additional checks must be additive and non-breaking
- validate-html-output.sh must be updated to include the new checks
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Add 2 new quality checks (accessibility and reduced-motion) to the original 7, bringing the total to 9.

**How it works**: success-criteria.md documents all 9 checks. quality_checklist.md provides detailed verification steps. validate-html-output.sh includes static checks for both new criteria where feasible (e.g., checking for `prefers-reduced-motion` media query presence).
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add 2 checks (chosen)** | Covers important accessibility gap; non-breaking | Slightly more verification work | 9/10 |
| Keep original 7 only | Exact parity with source | Misses accessibility and reduced-motion | 6/10 |
| Add 5+ additional checks | More comprehensive | Over-engineering for initial release; diminishing returns | 5/10 |

**Why this one**: Accessibility and reduced-motion are high-impact, low-effort additions that address real gaps in the original. Adding more checks would be speculative.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Generated HTML is more accessible by default
- Animations respect user motion preferences
- Quality bar is higher than the original with minimal added complexity

**What it costs**:
- Agents must verify 9 checks instead of 7. Mitigation: The 2 new checks are straightforward and fast.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| None significant | L | Checks are additive and optional to enforce |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Accessibility is a standard web requirement |
| 2 | **Beyond Local Maxima?** | PASS | Considered keeping original 7 vs. adding more |
| 3 | **Sufficient?** | PASS | 2 additions cover the most impactful gaps |
| 4 | **Fits Goal?** | PASS | Improves output quality without complexity |
| 5 | **Open Horizons?** | PASS | More checks can be added in future iterations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `nodes/success-criteria.md` lists 9 quality checks (7 original + accessibility + reduced-motion)
- `references/quality_checklist.md` includes detailed steps for all 9
- `scripts/validate-html-output.sh` checks for `prefers-reduced-motion` and semantic HTML markers

**How to roll back**: Remove checks 8 and 9 from the three files above.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: snake_case Filenames for References

<!-- ANCHOR:adr-006-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

Reference files were initially created with kebab-case filenames (e.g., `quick-reference.md`, `css-patterns.md`). package_skill.py validation rejected these filenames, requiring snake_case (e.g., `quick_reference.md`, `css_patterns.md`).

### Constraints

- package_skill.py enforces snake_case for reference files
- Validation must PASS for the skill to be considered valid
- Node files use kebab-case (different convention, validated differently)
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Rename all reference files from kebab-case to snake_case before final validation.

**How it works**: All 5 reference files use snake_case: `quick_reference.md`, `css_patterns.md`, `library_guide.md`, `navigation_patterns.md`, `quality_checklist.md`. This passes package_skill.py validation.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **snake_case (chosen)** | Passes validation; follows convention | Inconsistent with node file naming | 9/10 |
| Keep kebab-case | Consistent with node naming | Fails package_skill.py validation | 2/10 |

**Why this one**: package_skill.py validation is a hard gate. snake_case is required for references regardless of other naming conventions.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- package_skill.py validation passes cleanly
- Reference filenames follow the enforced convention

**What it costs**:
- Slight naming inconsistency between nodes (kebab-case) and references (snake_case). Mitigation: This is a framework convention, not a project decision.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| None | L | Convention is enforced by tooling |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | package_skill.py rejects kebab-case references |
| 2 | **Beyond Local Maxima?** | PASS | Only 2 options; snake_case is the only valid one |
| 3 | **Sufficient?** | PASS | Renaming files is sufficient to pass validation |
| 4 | **Fits Goal?** | PASS | Directly unblocks validation |
| 5 | **Open Horizons?** | PASS | Convention is stable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- Renamed 5 reference files from kebab-case to snake_case
- Updated all internal references (SKILL.md, index.md, related-resources.md)

**How to roll back**: Rename files back to kebab-case (will fail validation).
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: HTML Templates Ported As-Is

<!-- ANCHOR:adr-007-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The original repo contains 3 production-quality HTML templates (architecture, mermaid-flowchart, data-table) totaling ~46KB. These templates use specific color schemes, CSS Grid layouts, and CDN library integrations. We needed to decide whether to port them as-is or modify them for the OpenCode context.

### Constraints

- Templates are production-quality exemplars (not boilerplate)
- They demonstrate specific aesthetic profiles (terracotta/sage, teal/cyan, rose/cranberry)
- Modifications risk breaking working templates without adding value
- MIT license permits use without modification
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Port all 3 HTML templates as-is from the original repo, without modification.

**How it works**: Templates are placed in `assets/templates/` and serve as exemplars that agents can reference when generating new doc visuals. They demonstrate best practices for structure, styling, and library integration.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Port as-is (chosen)** | Preserves working quality; zero risk of regression | May contain patterns not optimal for OpenCode context | 8/10 |
| Modify and customize | Tailored to OpenCode conventions | Risk breaking working templates; significant effort | 5/10 |
| Create new templates from scratch | Fully custom | Massive effort; loses proven quality | 3/10 |

**Why this one**: The templates are production-quality exemplars. Modifying them risks introducing bugs without adding meaningful value. They work as reference implementations.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Zero regression risk on template quality
- Agents have proven, working exemplars to reference
- Significant time saved (no custom template development)

**What it costs**:
- Templates may use patterns or libraries that differ from other OpenCode conventions. Mitigation: Templates are exemplars, not enforced patterns.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| CDN URLs in templates may become stale | L | library_guide.md documents current versions; CDN URLs are standard |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Templates provide concrete examples agents can learn from |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered |
| 3 | **Sufficient?** | PASS | As-is templates are fully functional |
| 4 | **Fits Goal?** | PASS | Exemplars serve the skill's purpose |
| 5 | **Open Horizons?** | PASS | New templates can be added alongside existing ones |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- Ported `assets/templates/architecture.html` (~17KB, terracotta/sage, CSS Grid)
- Ported `assets/templates/mermaid-flowchart.html` (~13KB, teal/cyan, Mermaid+ELK)
- Ported `assets/templates/data-table.html` (~16KB, rose/cranberry, data table)

**How to roll back**: Delete the 3 template files from `assets/templates/`.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Project-Local Output Directory

<!-- ANCHOR:adr-008-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The original doc-visual repo outputs generated HTML to `~/.agent/diagrams/`, a user-home directory. In the OpenCode framework, skills should produce output in project-local directories to maintain portability and avoid polluting the user's home directory.

### Constraints

- OpenCode convention: output stays within the project directory
- Output must be easily discoverable by the user
- cleanup-output.sh must be able to manage the output directory
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: Output generated HTML to `.opencode/output/visual/` within the project directory.

**How it works**: All generated doc visual HTML files are written to `.opencode/output/visual/`. The cleanup-output.sh script manages this directory. This keeps output project-local and follows the `.opencode/` convention for framework-managed files.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.opencode/output/visual/` (chosen)** | Project-local; follows convention; easy cleanup | Adds files to project directory | 9/10 |
| `~/.agent/diagrams/` (original) | Matches source repo | Pollutes home directory; not portable; breaks convention | 3/10 |
| `/tmp/doc-visual/` | No project pollution | Lost on restart; not discoverable | 4/10 |

**Why this one**: Project-local output follows OpenCode conventions, is portable across machines, and is manageable via cleanup-output.sh.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Output is project-local and portable
- cleanup-output.sh can manage the directory
- Users can find output in a predictable location

**What it costs**:
- Adds files to the project directory. Mitigation: `.opencode/output/` should be in `.gitignore`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Output directory grows large over time | L | cleanup-output.sh provides automated maintenance |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must define output location; original path violates convention |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered |
| 3 | **Sufficient?** | PASS | Single directory with cleanup script |
| 4 | **Fits Goal?** | PASS | Follows OpenCode conventions |
| 5 | **Open Horizons?** | PASS | Path can be configured if needed in future |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- SKILL.md and commands reference `.opencode/output/visual/` as output directory
- `scripts/cleanup-output.sh` manages this directory
- Documented in nodes/integration-points.md

**How to roll back**: Change output path references back to `~/.agent/diagrams/`.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: CSS-First Image Generation

<!-- ANCHOR:adr-009-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-21 |
| **Deciders** | AI Agent, User |

---

### Context

The source repository (nicobailon/doc-visual v0.1.1) relies on surf-cli for placeholder image generation. surf-cli is an external headless browser dependency that may not be available in all environments — it requires a system-level installation and network access to function. During gap analysis, this was classified as gap C1 (Critical) because the dependency blocks a core use case in environments where surf-cli is absent.

### Constraints

- surf-cli requires a separate system installation outside the OpenCode framework
- Not all CI/CD environments or developer machines have surf-cli available
- Placeholder images are used for layout demonstration, not final output
- CSS gradients and geometric shapes are sufficient fidelity for placeholder purposes
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: CSS-first placeholder generation using CSS gradients, geometric shapes, and `background-image` patterns as a drop-in replacement for surf-cli-generated images.

**How it works**: Placeholder image areas in generated HTML use CSS `background` properties (linear-gradient, radial-gradient, repeating-linear-gradient) to render colored geometric shapes that visually indicate image zones. These render in any browser without external dependencies. The patterns are documented in css_patterns.md and available to agents generating doc visual output.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CSS-first placeholders (chosen)** | No external deps; reproducible; zero cost; works everywhere | Less photorealistic than AI-generated images | 9/10 |
| Keep surf-cli dependency | Matches source repo exactly; higher visual fidelity | Breaks in environments without surf-cli; non-portable | 3/10 |
| External image API (e.g., picsum.photos) | Simple; photorealistic placeholders | Requires network access; introduces external dependency; potential cost | 5/10 |

**Why this one**: CSS-first approach eliminates all external dependencies, ensuring the skill works in any environment. Placeholder fidelity is sufficient for layout demonstration purposes, which is the primary use case.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Skill works in any environment without additional installation steps
- No network calls for placeholder generation
- Zero API cost; no rate limits or keys required
- Output is fully deterministic and reproducible

**What it costs**:
- Placeholders are geometric/gradient-based, not photorealistic. Mitigation: Placeholder zones are clearly labeled with text overlays indicating the image intent; users replace them with real assets for final output.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users expect photorealistic placeholders matching source repo | L | Document the design choice in skill notes; CSS patterns are clearly labeled as placeholders |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | surf-cli creates a hard environmental dependency that blocks portability |
| 2 | **Beyond Local Maxima?** | PASS | 3 options considered (CSS-first, keep surf-cli, external API) |
| 3 | **Sufficient?** | PASS | CSS gradients provide adequate visual fidelity for placeholder use cases |
| 4 | **Fits Goal?** | PASS | Eliminates C1 Critical gap while preserving skill functionality |
| 5 | **Open Horizons?** | PASS | Users can substitute real images; CSS patterns can be enhanced without breaking changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- CSS placeholder patterns documented in `references/css_patterns.md` (gap C1 remediation)
- SKILL.md Smart Router updated to reference CSS-first approach for image placeholder use cases
- surf-cli removed from dependencies and from `nodes/integration-points.md`

**How to roll back**: Re-add surf-cli as a dependency in integration-points.md and replace CSS placeholder patterns with surf-cli invocations in generated output.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!--
Level 3 Decision Record: 9 ADRs covering all key architectural decisions.
ADR-009 added during gap remediation phase (Phase 2).
All decisions have status: Accepted.
All alternatives documented with pros/cons/scores.
All Five Checks evaluations: 5/5 PASS.
Written in human voice: active, direct, specific.
-->
