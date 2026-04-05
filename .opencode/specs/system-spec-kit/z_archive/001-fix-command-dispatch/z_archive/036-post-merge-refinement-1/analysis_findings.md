---
id: 036-post-merge-refinement
title: Analysis Findings
created: 2025-12-25
status: Draft
---

# Analysis Findings

## Summary
- The post-merger audit surfaced 29 distinct issues across four priority tiers (3 P0, 8 P1, 10 P2, 8 P3) per spec.md.
- P0 and P1 items directly block or degrade system-spec-kit workflows and require immediate remediation before additional work continues.
- P2 and P3 items primarily capture documentation gaps, consistency problems, and future-proofing tasks that should follow once higher-severity fixes land.

| Priority | Count | Focus |
|----------|-------|-------|
| P0 | 3 | Missing core scripts and tool references that break Gate 6 and MCP usage |
| P1 | 8 | High-severity workflow mismatches, missing assets, and documentation drift |
| P2 | 10 | Medium impact alignment work (command conventions, doc accuracy, spec hygiene) |
| P3 | 8 | Long-tail improvements (guides, automation, refactors) |

## Methodology
- Source material: 035 memory-speckit-merger outputs, spec.md problem statement, plan.md phase outlines, and tasks.md breakdown.
- Approach: Normalize overlapping observations from the analysis session into a single canonical list, mapped to existing task IDs where possible, and call out any coverage gaps versus the reported counts.
- Validation criteria: Each entry must capture location, current impact, and a concrete next action that can translate into implementation tasks.

## Priority Findings

### P0 — Critical blockers
1. **Missing validate-spec.sh script**
   - Location: Referenced extensively in system-spec-kit/SKILL.md (Gate 6) but absent under `.opencode/skill/system-spec-kit/scripts/`.
   - Impact: Completion workflow cannot execute automated validation, leaving checklist enforcement and evidence collection unverified.
   - Action: Implement the script with documented exit codes, rule evaluations, and strict-mode options; integrate into Gate 6 path immediately.

2. **MCP semantic memory tool naming mismatch**
   - Location: SKILL.md tables still reference shorthand functions (e.g., `memory_save`) instead of the actual `semantic_memory_memory_*` tool set defined by the MCP server.
   - Impact: Copy/paste steps from documentation fail, leading to runtime errors and broken workflows during `/memory:save` or resume commands.
   - Action: Update every callout (not just the tables) to include the fully qualified tool names and explain shorthand usage expectations.

3. **Missing recommend-level.sh script**
   - Location: Plan references a helper for automatic documentation level selection (SKILL.md:172), but the script is absent from `scripts/`.
   - Impact: Agents cannot rely on automated level recommendations, forcing manual calculations and undermining Level selection consistency.
   - Action: Either implement the script (LOC + complexity heuristics) or remove every reference and adjust guidance accordingly.

### P1 — High priority issues
1. **Placeholder validation gap**
   - Issue: Validation tooling only checks `[YOUR_VALUE_HERE:]` markers and misses Mustache-style placeholders still present in templates.
   - Impact: Partially completed documents can pass Gate 6 with hidden placeholders, reducing documentation quality.
   - Action: Extend `check-placeholders.sh` (or equivalent) to detect `{{...}}` syntax and add tests covering context templates.

2. **Duplicate library logic**
   - Issue: `scripts/lib/` and `mcp_server/lib/` each host overlapping helper modules, diverging over time.
   - Impact: Bug fixes or enhancements must be implemented twice, increasing drift risk.
   - Action: Choose a canonical location (recommended: `mcp_server/lib/`), consolidate modules, and update every consumer import.

3. **Missing YAML assets for /spec_kit:plan**
   - Issue: Command definitions reference `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`, but these files are missing or misnamed.
   - Impact: Plan command cannot auto-execute, forcing manual fallback flows.
   - Action: Confirm actual filenames, create the missing YAMLs if necessary, and align all documentation references.

4. **Constitutional tier omitted from context template**
   - Issue: `context_template.md` only lists five tiers, omitting the constitutional tier mandated by the merged memory system.
   - Impact: Generated memory files fail to capture top-tier guidance, reducing enforcement reliability.
   - Action: Update every tier list and example block to include `Constitutional` with weight 1.0.

5. **Phantom memory_load tool reference**
   - Issue: `resume.md` cites a non-existent `memory_load` tool.
   - Impact: Agents following the document encounter tooling errors and cannot recover prior context cleanly.
   - Action: Replace the reference with `semantic_memory_memory_search({ includeContent: true })` (or equivalent) and audit for any other phantom tools.

### P2 — Medium priority issues
1. **Command path separator drift**
   - Observation: Command documentation mixes `:` and `/` separators when referencing command names, creating confusion during invocation.
   - Risk: Inconsistent references slow down command discovery and increase agent error rate.
   - Action: Standardize on `:` everywhere and update YAMLs plus docs accordingly.

2. **Incorrect template count in SKILL.md**
   - Observation: Template inventory states 13 templates even though only 11 exist after the merger.
   - Risk: Mismatched expectations hinder onboarding and can misdirect maintenance tasks.
   - Action: Update the table and reconcile any references that rely on the old number.

3. **035 spec status outdated**
   - Observation: The merger spec (035) still lists status "Draft" despite completion.
   - Risk: Future audits may attempt to reopen or duplicate already-finished work.
   - Action: Update the metadata to "Complete" and note completion date for traceability.

4. **Undocumented MCP parameter sets**
   - Observation: Several memory and spec_kit commands expose parameters not reflected in documentation.
   - Risk: Agents guess parameter names or omit required flags, leading to inconsistent tool usage.
   - Action: Expand the command docs with current parameter tables, using live definitions as source of truth.

### P3 — Low priority improvements
1. **Cross-command workflow guide missing**
   - Need: A reference mapping spec_kit and memory commands into end-to-end flows is absent, leaving steep learning curves.
   - Action: Draft a guide tying high-level workflows to command sequences and embed within documentation or assets.

2. **Step counting ambiguity in complete.md**
   - Need: `/spec_kit:complete` documentation counts steps inconsistently, confusing agents verifying completion gates.
   - Action: Rewrite the step list with unambiguous numbering and cross-link to Gate 6 verification.

3. **Command alias coverage**
   - Need: No alias list exists, so agents cannot discover shorthand triggers quickly.
   - Action: Define and document approved aliases (or confirm that none exist) to reduce cognitive load.

4. **Automated test suite absence**
   - Need: There are no automated regression tests for SpecKit workflows post-merger.
   - Action: Design and implement a basic test harness that exercises key commands (plan, implement, complete, memory save).

5. **generate-context.js complexity**
   - Need: The script has grown after the merger and now needs refactoring for maintainability.
   - Action: Profile the script, break it into smaller modules, and add unit tests before future feature work.

## Coverage Gaps and Follow-Ups
- The analysis confirmed the total counts reported in spec.md, but only five of the eight P1 items and four of the ten P2 items are explicitly documented. Remaining issues should be identified and appended once surfaced.
- Document every item with a task ID plus evidence link during implementation to maintain traceability between `analysis_findings.md` and `tasks.md`.
- Integrate this file into the checklist workflow so that completion reviews can cite the specific finding(s) addressed by each PR or session.

## Next Actions
1. Use this findings document as the canonical reference when implementing TASK-001 through TASK-017 in tasks.md.
2. Update this file whenever a finding is resolved or when additional P1/P2 details are captured, keeping the counts synchronized with spec.md.
3. Once all P0 and P1 issues are closed, rerun the original analysis agents or validation suite to verify no new gaps emerged during remediation.
