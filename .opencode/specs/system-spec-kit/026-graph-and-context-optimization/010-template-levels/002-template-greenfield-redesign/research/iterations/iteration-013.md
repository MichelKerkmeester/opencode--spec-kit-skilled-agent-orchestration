# Iteration 13: AI Conversation Transcript Dry-Run

## Focus

AI-CONVERSATION TRANSCRIPT DRY-RUN under the workflow-invariant lens. Walk five user-facing scenarios end-to-end as realistic AI conversation transcripts using current Gate 3 and sk-doc/system-spec-kit routing behavior, then verify that every AI-visible user turn stays level-only.

## Actions Taken

- Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-012.md` first.
- Loaded `.opencode/skill/sk-deep-research/SKILL.md` to preserve the LEAF iteration contract, output requirements, and no-sub-dispatch constraint.
- Re-ran a focused leak search across:
  - `.opencode/skill/system-spec-kit/templates`
  - `.opencode/skill/system-spec-kit/scripts/tests/fixtures`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research`
- Read the current state log and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-012.jsonl` to preserve JSONL shape.
- Modeled five AI transcript dry-runs with under-the-hood actions separated from user-visible text.

## Findings

### Scenario A Transcript + Verdict

Routine implementation work, fresh spec folder. User-visible AI wording remains level-only.

```text
**USER**: Let's add a new validator for the import-resolver edge case.

**(under the hood):** Gate 3 classifier detects a file-modifying implementation request.
**(under the hood):** Skill routing selects system-spec-kit + sk-doc because this will create or update spec packet docs.
**(under the hood):** AI infers Level 2 because this is a small validator change that needs verification gates.

**AI**: This is a file change, so I need the documentation packet first. My read is Level 2: small validator work, but with checklist-level verification.

Choose the spec folder path:
A) Existing packet
B) New packet
C) Update a related packet
D) Skip documentation for this change
E) Phase folder

**USER**: B.

**(under the hood):** bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 2 --short-name 'import-resolver-edge' 'Add a new validator for the import-resolver edge case'

**AI**: Created a new Level 2 spec folder for `import-resolver-edge`.

Created files:
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `description.json`
- `graph-metadata.json`

`implementation-summary.md` is required after implementation. I’m starting `spec.md` from your request now: the packet is about adding validator coverage for the import-resolver edge case, with the checklist capturing the expected pass and failure paths.
```

Verdict: PASS (level-only). AI-visible turns use `Level 2`, file names, and packet language. No `preset`, `capability`, `kind`, or `manifest` vocabulary appears in AI-visible text.

### Scenario B

Architectural change requiring `decision-record.md`. User-visible AI wording remains level-only, and the confirmation names `decision-record.md` directly.

```text
**USER**: Refactor the memory-parser to support pluggable indexers.

**(under the hood):** Gate 3 classifier detects a file-modifying refactor.
**(under the hood):** Skill routing selects system-spec-kit + sk-doc.
**(under the hood):** AI infers Level 3 because the request changes architecture and requires design decisions.

**AI**: This is architectural work, so I’d document it as Level 3 before editing code. The change affects parser boundaries and indexing behavior, so `decision-record.md` should be part of the packet.

Choose the spec folder path:
A) Existing packet
B) New packet
C) Update a related packet
D) Skip documentation for this change
E) Phase folder

**USER**: B.

**(under the hood):** bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 3 --short-name 'pluggable-indexers' 'Refactor the memory-parser to support pluggable indexers'

**AI**: Created a new Level 3 spec folder for `pluggable-indexers`.

Created files:
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `description.json`
- `graph-metadata.json`

I’m drafting the first pass now: `spec.md` will define the parser problem and scope, while `decision-record.md` will capture the indexer boundary and the alternatives rejected.
```

Verdict: PASS (level-only). AI-visible turns use `Level 3`, `decision-record.md`, and normal architecture wording. No banned workflow vocabulary appears in AI-visible text.

### Scenario C

Phase-parent for multi-phase migration. One correction matters: the current Gate 3 contract labels phase folders as Option E, not Option D. The realistic transcript should use Option E even if older prompts or shorthand say D.

```text
**USER**: Plan a multi-phase migration from level system to manifest system.

**(under the hood):** Gate 3 classifier detects planning work that will create packet files.
**(under the hood):** Skill routing selects system-spec-kit + sk-doc.
**(under the hood):** AI infers a phase parent because the request names a multi-phase migration.
**(under the hood):** AI maps the user's target wording to an internal implementation topic, but keeps public wording level-only.

**AI**: This should be a phase-parent packet. It needs a Level 3 parent plus child phase folders so each migration slice can keep its own plan and tasks.

Choose the spec folder path:
A) Existing packet
B) New packet
C) Update a related packet
D) Skip documentation for this change
E) Phase folder

**USER**: E, phase folder.

**(under the hood):** bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 3 --phase --phases 4 --phase-names 'manifest-add,scaffolder-migrate,validator-migrate,legacy-delete' --short-name 'manifest-migration' 'Plan a multi-phase migration from level system to manifest system'

**AI**: Created a Level 3 phase-parent packet with four child phases.

Parent:
- `spec.md`
- `description.json`
- `graph-metadata.json`

Children:
- Four child phase folders were created from the requested phase names.

I’m going to author the parent `spec.md` as the coordination document, then keep detailed implementation work inside the child folders.
```

Verdict: PASS (level-only). The AI confirms the parent and child count without echoing internal phase slugs into user-visible text. The under-the-hood command contains `manifest-migration` because the scenario explicitly requires that short name; it is not user-visible confirmation wording.

### Scenario D

Validator failure remediation. The AI explains the error in level vocabulary and names the missing file directly.

```text
**USER**: validate.sh is failing on my new packet - what's wrong?

**(under the hood):** Read-only troubleshooting path. No Gate 3 write prompt yet.

**AI**: I’ll run strict validation against the packet and read the failing rule output.

**(under the hood):** bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign --strict
**(under the hood):** Validator output includes: Level 3 packet missing required file: decision-record.md

**AI**: The packet is Level 3, and it is missing a required file: `decision-record.md`.

That is why strict validation fails. The fix is to add `decision-record.md` from the Level 3 template and fill in the decision, alternatives, and consequences sections. I can scaffold that file, or leave it for you to add manually.
```

Verdict: PASS (level-only). The user-visible diagnosis says `Level 3 packet missing required file: decision-record.md`, not an internal rule origin.

### Scenario E

Resume work via `/spec_kit:resume`. The AI summarizes by level and packet state, without exposing internal template-routing terms.

```text
**USER**: /spec_kit:resume

**(under the hood):** Run resume protocol.
**(under the hood):** Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/handover.md` if present.
**(under the hood):** Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/implementation-summary.md` continuity if present.
**(under the hood):** Read canonical docs in order: `implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`.
**(under the hood):** If the selected packet is a phase parent, read `graph-metadata.json` for `derived.last_active_child_id` and redirect to the active child when present.

**AI**: Resumed the packet.

This is a Level 3 packet with implementation in progress. Last action: the validator work was mapped, and the next unresolved step is to update the Level 3 docs before changing code.

Next safe action: read `tasks.md` and `plan.md`, confirm the active task, then make the smallest code change tied to that task. I’ll run the packet validation again before calling the work complete.
```

Verdict: PASS (level-only). AI-visible summary uses `Level 3 packet`, doc file names, and task status. No banned workflow vocabulary appears in AI-visible text.

### 2 Open Questions Resolved

1. Split the workflow-invariance CI into two tests.

   Decision: use two tests:

   - `.opencode/skill/system-spec-kit/scripts/tests/workflow-invariance-live-surfaces.vitest.ts`
   - `.opencode/skill/system-spec-kit/scripts/tests/workflow-invariance-public-docs.vitest.ts`

   Reasoning: live templates and output-producing scripts can enforce a strict zero-leak rule immediately. Public docs need a separate test with explicit allowlists for historical research, ADR text, and implementation notes. Combining them would either make the live-surface test too permissive or make the docs test noisy enough that maintainers ignore it.

2. Rewrite existing generated fixtures immediately.

   Decision: update affected generated fixtures in the same leak-fix PR, not as a follow-on.

   Scope: rewrite only fixtures generated from the changed templates, especially `.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md`. Do not perform a broad fixture cleanup. The reason is simple: stale expected fixtures can reintroduce the banned words through snapshot churn even after live templates are fixed.

### 2 Leak Fixes (replacement wording)

1. Replace `[capability]` placeholders with `[needed behavior]`.

   Exact replacement:

   ```text
   **As a** [user type], **I want** [needed behavior], **so that** [benefit].
   ```

   Apply to:

   - `.opencode/skill/system-spec-kit/templates/level_3/spec.md`
   - `.opencode/skill/system-spec-kit/templates/level_3+/spec.md`
   - `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/spec-level3.md`
   - `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/spec-level3-suffix.md`
   - `.opencode/skill/system-spec-kit/templates/addendum/level3-plus-govern/spec-level3plus-suffix.md`
   - `.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md`

   Also replace addendum frontmatter strings:

   ```text
   title: "As a [user type], I want [needed behavior], so that [benefit]. [template:addendum/level3-arch/spec-level3-suffix.md]"
   description: "As a [user type], I want [needed behavior], so that [benefit]."
   ```

   Replace keyword entries:

   ```text
   - "capability"
   ```

   with:

   ```text
   - "needed behavior"
   ```

2. Replace phase-parent `Sub-phase manifest` with `Sub-phase list`.

   Exact replacement in `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md`:

   ```text
   - Sub-phase list: which child phase folders exist and what each one does
   ```

   Rationale: `Sub-phase list` is plain level-era user wording. `Sub-phase map` is also acceptable, but `list` is clearer in a generated `spec.md` purpose bullet.

## Questions Answered

1. Can the five common AI conversation paths stay level-only while still using the new internal implementation approach?

   Yes. The dry-runs pass as long as AI-visible text uses `Level 1/2/3/3+`, `phase-parent`, file names, and packet status. Internal command names and implementation mechanics must not be echoed into user summaries.

2. Does Gate 3 need a vocabulary change?

   No. The existing Gate 3 options can stay stable. The only finding is a scenario-label mismatch: current Gate 3 uses Option E for phase folders, while the prompt's scenario used Option D for phase folders. Do not change the current Gate 3 menu just to match the older scenario wording.

3. Is `decision-record.md` safe to mention?

   Yes. It is a public file name and the correct Level 3 confirmation wording is to name the file directly.

4. Should workflow-invariance CI be one test or two?

   Two. Keep live output surfaces strict, and give public docs a separate allowlist model.

5. Should affected generated fixtures wait?

   No. Rewrite affected generated fixtures immediately with the template leak fix.

## Questions Remaining

No new design questions remain for this iteration. Iteration 14 should decide the final synthesis wording and mark convergence.

## Next Focus

Iteration 14 is FINAL SYNTHESIS. Write a `research.md` addendum folding in iterations 10 through 13, declare convergence, and update recommendation language so public and AI-facing workflow remains level-only while the implementation can still use a private level-contract resolver.
