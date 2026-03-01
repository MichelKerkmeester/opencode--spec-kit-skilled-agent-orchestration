---
title: "Decision Record: Fix Command Dispatch Vulnerability [118-fix-command-dispatch/decision-record]"
description: "When /spec_kit:complete and other spec_kit commands execute, OpenCode's runtime injects phantom dispatch text (\"Use the above message and context to generate a prompt and call t..."
trigger_phrases:
  - "decision"
  - "record"
  - "fix"
  - "command"
  - "dispatch"
  - "decision record"
  - "118"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Fix Command Dispatch Vulnerability

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Imperative Guardrail Approach (Fix A)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-13 |
| **Deciders** | Michel Kerkmeester + AI analysis |

---

<!-- ANCHOR:adr-001-context -->
### Context

When `/spec_kit:complete` and other spec_kit commands execute, OpenCode's runtime injects phantom dispatch text ("Use the above message and context to generate a prompt and call the task tool with subagent: debug/review") based on structural cues in command files. All 7 command files lack any explicit instruction telling the AI NOT to dispatch agents directly, leaving the runtime's injected text as the dominant instruction. A defensive guardrail block placed immediately after frontmatter would establish intent before any injected text can take effect.

### Constraints
- Cannot modify OpenCode runtime behavior (external dependency)
- Must preserve all existing frontmatter fields exactly (parser-sensitive)
- Fix must be non-breaking: commands must continue to function if guardrail is simply ignored by future runtime versions

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Add an imperative guardrail block immediately after frontmatter in ALL 7 spec_kit command files.

**Details**: The guardrail text reads: "EXECUTION PROTOCOL: This command runs a structured YAML workflow. Do NOT dispatch agents directly. First determine execution mode, then load the corresponding YAML file." This block is placed as the first content after the YAML frontmatter closing `---`, ensuring it is parsed before any @agent references or dispatch templates that appear later in the file.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add guardrail text (chosen)** | Defensive, non-breaking, works with any runtime version, easy to apply uniformly | Relies on AI reading and respecting the instruction; doesn't eliminate root triggers | 8/10 |
| Remove all @agent references entirely | Eliminates injection triggers completely | Too destructive; breaks documentation, routing tables, and template examples | 3/10 |
| Change allowed-tools to remove Task | Prevents Task tool dispatch entirely | Breaks legitimate functionality; many commands need Task for agent routing | 2/10 |
| Add frontmatter flag (e.g., `no-dispatch: true`) | Clean, declarative approach | No evidence OpenCode runtime respects custom frontmatter fields; speculative | 4/10 |

**Why Chosen**: The guardrail approach is the only option that is both defensive (counters injection) and non-breaking (preserves all existing functionality). It works regardless of whether the runtime injection behavior changes in future versions, and can be applied uniformly across all 7 files with minimal risk.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Establishes clear execution intent before any ambiguous content
- Uniform application across all 7 files creates consistent defense
- Zero risk of breaking existing command functionality

**Negative**:
- Does not eliminate the root cause (runtime injection) - Mitigation: Combined with Fixes B-E for defense in depth
- Adds ~3 lines of boilerplate to each file - Mitigation: Minimal overhead; serves as documentation for future authors

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| AI model may ignore guardrail if injected text is more prominent | Medium | Fix B moves execution instructions to top, reinforcing guardrail positioning |
| Future OpenCode versions may change parsing behavior | Low | Guardrail is plain markdown; worst case it becomes inert documentation |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | All 7 files confirmed missing any guardrail (V4 audit finding). Phantom dispatch actively occurring in production use. |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; removal and frontmatter flag approaches rejected with rationale. |
| 3 | **Sufficient?** | PASS | Simplest possible fix: 3 lines of text added per file. No structural changes, no logic modifications. |
| 4 | **Fits Goal?** | PASS | Directly addresses REQ-004 (pass V4 audit) and contributes to REQ-001 (eliminate phantom dispatch). |
| 5 | **Open Horizons?** | PASS | Non-breaking addition; easily removed or modified. No lock-in to specific runtime behavior. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/debug.md`
- `.opencode/command/spec_kit/handover.md`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/research.md`
- `.opencode/command/spec_kit/resume.md`
- `.opencode/command/spec_kit/implement.md`

**Rollback**: `git checkout -- .opencode/command/spec_kit/*.md` reverts all files. Individual files can be reverted with `git checkout -- .opencode/command/spec_kit/<file>.md`.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Document Restructuring Strategy (Fix B)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-13 |
| **Deciders** | Michel Kerkmeester + AI analysis |

---

<!-- ANCHOR:adr-002-context -->
### Context

Audit finding V2 confirmed that ALL 7 command files bury the critical "load YAML workflow" instruction deep in the document (range: line 140-183). The AI encounters @agent references, dispatch templates, and ambient context long before reaching the actual execution instruction. This means the runtime's injected dispatch text aligns with the file's @agent references while the intended instruction hasn't been parsed yet. Moving the execution instruction to within the first 15 lines of content ensures the AI encounters the correct instruction before any potentially ambiguous content.

### Constraints
- Must preserve the overall document structure (sections, headings, content)
- First 15 lines of content is the target window based on observed AI parsing priority
- Section number cross-references in YAML files may reference specific sections (breaking risk)

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Move the YAML loading instruction (INSTRUCTIONS section) to immediately after the guardrail block, within the first 15 lines of content after frontmatter.

**Details**: The INSTRUCTIONS section that tells the AI "determine execution mode, load the corresponding YAML file, execute the workflow" is relocated from its current buried position (L140-183) to become the first substantive section after the guardrail. Other sections (context, routing tables, templates) are pushed down. This ensures the imperative instruction is the first thing parsed after the guardrail.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move instruction to top (chosen)** | Minimal change, maximum impact; AI encounters correct instruction first | Section numbers may shift, breaking YAML cross-references | 8/10 |
| Keep current structure, rely only on guardrail (Fix A) | Zero structural risk | Insufficient alone; guardrail without proximate instructions still leaves 120+ lines of ambiguous content first | 4/10 |
| Complete rewrite of all command files | Could optimize entire structure holistically | Too risky; 7 files x complex structure = high regression probability | 3/10 |
| Duplicate instruction at both top and original location | Belt-and-suspenders; backward compatible | Maintenance burden of keeping duplicates in sync; cluttered files | 5/10 |

**Why Chosen**: Moving the instruction to top is the minimum structural change that achieves maximum positioning impact. It directly addresses the core V2 vulnerability (buried execution instructions) without requiring a complete rewrite of any file.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- AI encounters the execution instruction within first 15 lines of content
- Reinforces Fix A guardrail with immediately proximate instructions
- Makes command files more readable (purpose-first structure)

**Negative**:
- Section number cross-references in YAML workflow files may break - Mitigation: Phase 4 includes cross-reference verification step
- Alters document flow that authors may be accustomed to - Mitigation: Improved structure is more intuitive (instructions-first)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| YAML files reference section numbers that shift after restructuring | Medium | Audit all 13 YAML files for section references during Phase 3; update as needed |
| Content between guardrail and instruction could grow over time | Low | Document the "first 15 lines" rule in vulnerability pattern guide (REQ-006) |
| Other command files outside spec_kit may need same fix | Low | Out of scope per spec.md; document pattern for future application |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | V2 audit: ALL 7 files bury instructions at L140-183. Guardrail alone (Fix A) is insufficient without proximate instructions. |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated including full rewrite and duplication approaches. |
| 3 | **Sufficient?** | PASS | Moving one section per file; no new content created, no logic changed. |
| 4 | **Fits Goal?** | PASS | Directly addresses REQ-002 (execution instructions at top) and critical path to REQ-001. |
| 5 | **Open Horizons?** | PASS | Establishes instructions-first pattern applicable to all future command files. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- All 7 `.opencode/command/spec_kit/*.md` command files (section reordering)
- Potentially all 13 `.opencode/command/spec_kit/assets/*.yaml` files (cross-reference updates)

**Rollback**: `git checkout -- .opencode/command/spec_kit/` reverts all structural changes. Individual file rollback supported.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Dispatch Template Fencing (Fix C)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-13 |
| **Deciders** | Michel Kerkmeester + AI analysis |

---

<!-- ANCHOR:adr-003-context -->
### Context

Audit finding V3 identified 13 unfenced dispatch templates across 4 command files. These templates contain text like "call the task tool with subagent: debug" as regular prose, indistinguishable from actual execution instructions. The AI (and potentially the runtime) cannot differentiate between a template example and an imperative instruction when the template appears as undecorated text. Files affected: complete.md (6 unfenced), debug.md (3 unfenced), research.md (2 unfenced), plan.md (2 unfenced). Two files (implement.md, handover.md) already had properly fenced templates, confirming fencing is a viable pattern.

### Constraints
- Templates serve as documentation/reference and must be preserved (not deleted)
- Fencing must be clearly distinguishable from actual execution instructions
- Must work within markdown rendering constraints (code blocks, blockquotes, or HTML comments)

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Wrap all unfenced dispatch templates with explicit REFERENCE ONLY markers using a consistent fencing pattern.

**Details**: Each unfenced dispatch template is wrapped with markers indicating it is a reference example, not an execution instruction. The pattern uses a clearly labeled wrapper (e.g., `<!-- REFERENCE ONLY - DO NOT EXECUTE -->` before and `<!-- END REFERENCE -->` after, or a labeled code block). This preserves the template content for documentation while preventing the AI or runtime from treating it as an imperative.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Wrap with REFERENCE ONLY markers (chosen)** | Preserves documentation value; clearly marks intent; consistent pattern | Adds visual noise to files; markers must be maintained | 8/10 |
| Remove templates entirely | Eliminates all template-based injection risk | Loses documentation value; authors won't have dispatch examples | 3/10 |
| Move templates to separate reference file | Clean separation of concerns | Breaks file self-containedness; adds file management overhead | 5/10 |
| Use HTML comments to hide templates | Invisible in rendered markdown | AI still parses HTML comments; doesn't solve the parsing problem | 4/10 |

**Why Chosen**: The REFERENCE ONLY marker approach is proven to work (implement.md and handover.md already use fenced templates successfully). It preserves documentation value while making the non-imperative nature explicit. The pattern from existing files provides a tested implementation reference.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Eliminates 13 instances of unfenced dispatch text that could trigger injection
- Consistent fencing pattern across all command files
- Templates preserved as documentation for future command authors

**Negative**:
- Adds visual overhead to command files (~2 lines per template) - Mitigation: Minimal; markers are self-documenting
- Requires maintenance when templates are updated - Mitigation: Pattern is simple and self-evident

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| New templates added without fencing in future edits | Medium | Document fencing requirement in vulnerability pattern guide (REQ-006) |
| Marker syntax may interfere with OpenCode parsing | Low | Use markdown-standard syntax (comments, code blocks); test after application |
| AI may still parse fenced content as instructions | Low | Combined with Fix A guardrail and Fix B positioning for defense in depth |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 13 unfenced templates across 4 files. V3 pattern confirmed as injection vector. |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives including removal and separation evaluated; existing fenced files prove pattern works. |
| 3 | **Sufficient?** | PASS | Adding wrapper markers is minimal change; no content modification, no logic change. |
| 4 | **Fits Goal?** | PASS | Directly addresses REQ-003 (all dispatch templates properly fenced). |
| 5 | **Open Horizons?** | PASS | Establishes fencing standard for all future template content in command files. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/spec_kit/complete.md` (6 templates to fence)
- `.opencode/command/spec_kit/debug.md` (3 templates to fence)
- `.opencode/command/spec_kit/research.md` (2 templates to fence)
- `.opencode/command/spec_kit/plan.md` (2 templates to fence)

**Rollback**: `git checkout -- .opencode/command/spec_kit/{complete,debug,research,plan}.md` reverts affected files.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Agent Reference Density Reduction (Fix D)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-13 |
| **Deciders** | Michel Kerkmeester + AI analysis |

---

<!-- ANCHOR:adr-004-context -->
### Context

Audit finding V6 identified that complete.md contains 19 @agent references and debug.md contains 13 @agent references scattered throughout their content bodies. The `@agent` syntax (e.g., `@debug`, `@review`, `@speckit`) combined with `allowed-tools: Task` in frontmatter appears to be a structural trigger for OpenCode's runtime dispatch injection. High density of @agent mentions throughout a file increases the probability that the runtime identifies the file as needing agent dispatch, even when those mentions are purely documentary. Other files have lower counts (implement.md: 12, research.md: 7, plan.md: 5) and exhibit less severe injection behavior.

### Constraints
- @agent syntax in routing tables must be preserved (defines actual routing logic)
- @agent syntax in fenced templates must be preserved (Fix C handles their containment)
- Only prose/descriptive @agent mentions are candidates for replacement
- Must not change the semantic meaning of any instruction

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Replace prose @agent mentions with generic descriptive terms in complete.md and debug.md, targeting complete.md from 19 to <10 references and debug.md from 13 to <8 references.

**Details**: Occurrences of @agent syntax in descriptive prose (e.g., "dispatches to @debug for analysis" becomes "dispatches to the debug agent for analysis") are replaced with non-triggering descriptive terms. The @agent syntax is retained ONLY in: (1) routing tables that define actual agent selection logic, and (2) fenced dispatch templates (already contained by Fix C). This reduces the signal density that the runtime uses to determine dispatch behavior.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Replace prose @mentions with generic terms (chosen)** | Reduces injection triggers; preserves routing logic; semantic meaning unchanged | Tedious to identify prose vs. functional @mentions; requires careful review | 7/10 |
| Remove ALL @agent references (prose + routing) | Maximum trigger reduction | Breaks routing tables; loses agent selection logic | 2/10 |
| Replace @syntax with a custom non-triggering format | Could preserve visual distinction | No guarantee alternative syntax won't also trigger runtime; non-standard | 4/10 |
| Accept current density, rely on Fixes A-C | Zero change risk | complete.md and debug.md have empirically demonstrated injection; density is a factor | 4/10 |

**Why Chosen**: Replacing prose @mentions is a targeted, semantic-preserving change that reduces the trigger signal without breaking any functional logic. The distinction between prose mentions (documentary) and routing table mentions (functional) is clear and auditable.

<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Reduces @agent signal density by ~50% in the two most affected files
- Maintains all functional routing logic intact
- Makes files more readable (less @syntax noise in prose)

**Negative**:
- Manual review needed to classify each @mention as prose vs. functional - Mitigation: Clear classification rule: if it's in a routing table or fenced template, keep it; otherwise, replace
- Slightly less precise documentation (generic terms vs. @syntax) - Mitigation: Routing tables still contain authoritative @agent references

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrectly replacing a functional @mention | High | Review each replacement individually; test command after changes |
| Density threshold may not be the actual trigger | Medium | Combined with Fixes A-C; density reduction is one layer of defense in depth |
| Future edits may re-introduce high-density @mentions | Low | Document density guideline in vulnerability pattern guide (REQ-006) |

<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | complete.md (19 refs, CRITICAL severity) and debug.md (13 refs, MEDIUM severity) empirically exhibit injection. |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; total removal rejected as too destructive, custom syntax rejected as speculative. |
| 3 | **Sufficient?** | PASS | Text replacement only; no structural changes, no logic modifications beyond what Fix C already handles. |
| 4 | **Fits Goal?** | PASS | Addresses V6 audit finding; contributes to REQ-001 (eliminate phantom dispatch) and REQ-004 (pass vulnerability audit). |
| 5 | **Open Horizons?** | PASS | Establishes density guideline applicable to all future command files. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- `.opencode/command/spec_kit/complete.md` (target: 19 -> <10 @agent references)
- `.opencode/command/spec_kit/debug.md` (target: 13 -> <8 @agent references)

**Rollback**: `git checkout -- .opencode/command/spec_kit/{complete,debug}.md` reverts affected files.

<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---
---

<!-- ANCHOR:adr-005 -->
## ADR-005: YAML Agent Routing Comments (Fix E)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-13 |
| **Deciders** | Michel Kerkmeester + AI analysis |

---

<!-- ANCHOR:adr-005-context -->
### Context

The 13 YAML workflow files in `.opencode/command/spec_kit/assets/` contain `agent_routing` sections that define which agent handles each step. While the YAML routing logic itself is clear and correct (V5 audit finding), these sections could be misinterpreted by the runtime or AI as dispatch instructions rather than workflow configuration data. Adding explicit REFERENCE comments before these sections reinforces that the routing information is declarative configuration, not imperative dispatch.

### Constraints
- YAML syntax must remain valid after adding comments
- Comments must not interfere with YAML parsing by OpenCode runtime
- All 13 files must be treated consistently
- YAML workflow logic must not change (structural/formatting only)

<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: Add REFERENCE comments before `agent_routing` sections in all 13 YAML workflow files to clarify their declarative nature.

**Details**: A standardized YAML comment block (e.g., `# REFERENCE: Agent routing configuration below is declarative metadata, not dispatch instructions`) is added immediately before each `agent_routing:` key in all 13 YAML files. This serves as a parsing hint for the AI and as documentation for human authors, making explicit that routing sections define configuration rather than triggering dispatch.

<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add REFERENCE comments (chosen)** | Low risk; YAML comments are universally ignored by parsers; consistent documentation | May be unnecessary if runtime doesn't parse YAML comments for dispatch cues | 7/10 |
| Remove agent_routing sections | Eliminates any YAML-based dispatch triggers | Breaks workflow routing logic; removes essential configuration | 1/10 |
| Rename agent_routing key to non-triggering name | Avoids the word "agent" in key names | Requires updating all YAML parsers and command file references; high breakage risk | 3/10 |
| Do nothing (YAML routing is already clear) | Zero change risk; V5 finding was low severity | Inconsistent with defense-in-depth approach applied to .md files | 5/10 |

**Why Chosen**: Adding YAML comments is the lowest-risk change possible in a YAML file (comments are ignored by all parsers). It provides a consistent defense-in-depth layer across the YAML files that mirrors the guardrail approach (Fix A) applied to command .md files. Even if the comments have no effect on runtime behavior, they serve as documentation for future authors.

<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**Positive**:
- Consistent defense-in-depth pattern across both .md and .yaml files
- Zero functional risk (YAML comments are always ignored by parsers)
- Documents the declarative nature of routing sections for future authors

**Negative**:
- May be unnecessary overhead if YAML comments don't influence AI/runtime behavior - Mitigation: Minimal cost (1 comment line per file); documentation value justifies inclusion
- Adds maintenance surface for 13 files - Mitigation: One-line comment; trivial to maintain

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Comments have zero actual effect on dispatch behavior | Low | Worst case: comments serve as documentation; defense in depth principle still sound |
| YAML comment placement causes parsing issues | Very Low | Standard YAML comment syntax is universally supported; validate syntax after changes |
| Comment wording itself could trigger injection | Very Low | Use neutral language; avoid @agent syntax or dispatch-related terms in comments |

<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Defense-in-depth principle; YAML files are part of the command execution chain and should be hardened consistently with .md files. |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated including removal and renaming; both rejected due to high breakage risk. |
| 3 | **Sufficient?** | PASS | Single comment line per file; absolute minimum change possible in a YAML file. |
| 4 | **Fits Goal?** | PASS | Addresses REQ-005 (YAML files audited and remediated) and contributes to SC-003 (clear YAML routing). |
| 5 | **Open Horizons?** | PASS | Establishes pattern for annotating routing sections in any future YAML workflow files. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**Affected Systems**:
- All 13 `.opencode/command/spec_kit/assets/*.yaml` workflow files

**Rollback**: `git checkout -- .opencode/command/spec_kit/assets/*.yaml` reverts all YAML files.

<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
---

## Consolidated Risk Matrix

| ADR | Risk | Impact | Likelihood | Mitigation | Residual Risk |
|-----|------|--------|------------|------------|---------------|
| ADR-001 | AI ignores guardrail text | Medium | Medium | Combined with Fixes B-E for defense in depth | Low |
| ADR-001 | Runtime parsing changes | Low | Low | Guardrail is plain markdown; degrades gracefully | Very Low |
| ADR-002 | YAML section cross-references break | Medium | Medium | Audit during Phase 3; update references | Low |
| ADR-002 | Instruction window grows beyond 15 lines over time | Low | Medium | Document rule in pattern guide | Low |
| ADR-003 | New unfenced templates added in future | Medium | Medium | Document fencing requirement in pattern guide | Low |
| ADR-003 | AI parses fenced content as instructions | Low | Low | Defense in depth with Fixes A, B, D | Very Low |
| ADR-004 | Functional @mention incorrectly replaced | High | Low | Individual review per replacement; post-change testing | Low |
| ADR-004 | Density not the actual trigger factor | Medium | Medium | One layer in defense-in-depth; not sole fix | Low |
| ADR-005 | YAML comments have zero effect | Low | High | Minimal cost; documentation value remains | Very Low |

---

## Defense-in-Depth Summary

The five fixes form layered defenses that work independently and reinforce each other:

```
Layer 1 (Fix A): GUARDRAIL     - "Do NOT dispatch agents directly"
Layer 2 (Fix B): POSITIONING   - Execution instruction in first 15 lines
Layer 3 (Fix C): CONTAINMENT   - Dispatch templates fenced as REFERENCE ONLY
Layer 4 (Fix D): REDUCTION     - @agent signal density lowered in prose
Layer 5 (Fix E): ANNOTATION    - YAML routing sections marked as declarative
```

No single fix is expected to eliminate the vulnerability alone. The strategy relies on cumulative signal reduction: each layer decreases the probability that the runtime or AI interprets file content as a dispatch instruction rather than a workflow execution.

---

<!--
LEVEL 3+ DECISION RECORD - 5 ADRs documenting defense-in-depth approach
to command dispatch vulnerability across 7 .md files and 13 .yaml files.
All decisions evaluated with Five Checks framework.
-->
