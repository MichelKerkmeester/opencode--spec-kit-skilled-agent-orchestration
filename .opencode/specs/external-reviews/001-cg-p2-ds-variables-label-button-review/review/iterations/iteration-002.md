# Iteration 002 — Focus: Testability + Implementation-Readiness

## Focus

Review dimensions covered in this pass:
- testability
- implementation-readiness

Specific checks performed:
- Classified every Resolution Checklist item as mechanically verifiable, visual-inspection, or judgment-call.
- Pressure-tested whether a zero-context developer could execute each checklist item from the task text alone.
- Evaluated the scope-control validation for a mechanical confirmation path instead of reviewer intuition.
- Looked for validation steps that depend on undocumented file structure, naming normalization, or alias semantics.

## Findings

### P0

None.

### P1

1. **The alias/parity acceptance checks are not executable from the spec alone because they depend on undocumented CSS↔TS representation rules.**  
   [testability] [implementation-readiness]  
   The task asks reviewers to confirm that positive transparent hover/active neutral mappings "resolve through" updated transparency tokens and that CSS and TS remain aligned for all named updates, but it never states what the TS surface looks like or how parity should be proven across two different syntaxes. A developer with zero prior context cannot tell whether the TS file stores kebab-case names, normalized keys, alias objects, or raw CSS variable strings, so these checks cannot be turned into a reliable grep/diff/script workflow from the task alone.  
   [SOURCE: target-snapshot.md:L17-L18] [SOURCE: target-snapshot.md:L102-L107] [SOURCE: target-snapshot.md:L131-L149]  
   **Recommendation:** Add one explicit parity recipe, such as "extract normalized token-name/value pairs from both files and diff them," and give the exact CSS variable names plus TS identifiers for the transparent-alias checks.

### P2

1. **The written scope-control validation only guards unrelated size-tier edits, even though the task scope also includes multiple label-token families.**  
   [testability] [implementation-readiness]  
   The requirements add new label background/state aliases, change CTA label content tokens, and remap positive transparent label states, yet the final validation line only says to verify that no unrelated size tiers changed. That means an implementation could modify unrelated label tokens and still satisfy the literal scope-control checklist as written.  
   [SOURCE: target-snapshot.md:L41-L51] [SOURCE: target-snapshot.md:L59-L64] [SOURCE: target-snapshot.md:L98-L107] [SOURCE: target-snapshot.md:L148-L149]  
   **Recommendation:** Expand the final validation to cover both label and size scope, and prescribe an allowlist-based diff check against the two canonical files.

2. **The close-icon acceptance line is not self-contained enough for a zero-context implementer because it omits the canonical token identifiers to edit and verify.**  
   [testability] [implementation-readiness]  
   Requirement 4 lists seven size tiers and target values, but the checklist compresses that work into "All named label close icon sizes match this task on both canonical surfaces." Without the exact CSS variable names or TS keys for those seven existing entries, a new developer must inspect both files and infer which tokens the task means before they can implement or script-check the change.  
   [SOURCE: target-snapshot.md:L17-L18] [SOURCE: target-snapshot.md:L72-L82] [SOURCE: target-snapshot.md:L123-L123]  
   **Recommendation:** Enumerate the seven canonical close-icon token identifiers, or at minimum cite the nearest existing anchor tokens/section headings in each file.

## Coverage

Resolution Checklist classification:

| Line | Checklist item | Classification | Notes |
|---|---|---|---|
| L123 | All named label close icon sizes match this task on both canonical surfaces | (c) judgment-call | Too vague from the spec alone because the exact token identifiers are not named. |
| L124 | `--size-extra-large-button-size-container` equals `4rem` | (a) mechanically verifiable | Straight grep/diff assertion on both files. |
| L125 | `--size-extra-large-button-size-icon` equals `1.75rem` | (a) mechanically verifiable | Straight grep/diff assertion on both files. |
| L126 | Secondary neutral label background tokens exist on both canonical surfaces | (c) judgment-call | Still depends on knowing how the Notion-style token labels map to canonical CSS/TS identifiers. |
| L127 | Secondary ghost neutral and positive, caution, and negative transparent-neutral label state aliases exist on both canonical surfaces | (c) judgment-call | Same normalization problem; exact aliases are not spelled out in canonical identifier form. |
| L128 | `--label-content-enabled-cta` equals `var(--content-highlight-primary)` on the canonical surfaces | (a) mechanically verifiable | Exact token/value check. |
| L129 | `--label-content-hover-cta` equals `var(--tertiary-darker)` on the canonical surfaces | (a) mechanically verifiable | Exact token/value check, although it still conflicts with Requirement 3 from iteration 001. |
| L130 | `--size-large-dropdown-padding-top` equals `0.625rem` | (a) mechanically verifiable | Exact token/value check. |
| L131 | Positive transparent hover and active neutral mappings resolve through the updated label transparency tokens | (c) judgment-call | "Resolve through" requires undocumented alias/indirection knowledge. |
| L139 | CSS and TS sources expose the same named value changes | (c) judgment-call | Becomes mechanical only if the spec defines a normalization/diff method. |
| L140 | Token naming stays consistent across canonical sources | (c) judgment-call | No mapping rule defines what "consistent" means across CSS custom properties and TS identifiers. |
| L148 | Verified: canonical CSS and TS remain aligned for all named token updates | (c) judgment-call | Redundant with L139 and still missing a prescribed comparison method. |
| L149 | Verified: no unrelated size tiers changed outside the named update set | (c) judgment-call | Needs an explicit allowlist and diff baseline; no visual inspection is sufficient or required. |

Classification summary:
- Mechanically verifiable: `L124-L125`, `L128-L130`
- Visual-inspection: none
- Judgment-call / under-specified: `L123`, `L126-L127`, `L131`, `L139-L140`, `L148-L149`

Mechanical tooling the current scope-control check would need:
- `git diff --unified=0 -- <css-file> <ts-file>` to isolate changed token lines
- A small allowlist script or regex set containing the exact permitted button/label/dropdown token identifiers
- A normalization step that converts CSS and TS token names to the same comparable key space before diffing values

Validation steps that still require undocumented file knowledge:
- Knowing how Notion-style label names map to canonical CSS and TS identifiers (`L126-L127`)
- Knowing what "resolve through" means on the TS side for transparent alias mappings (`L131`)
- Knowing how CSS/TS parity should be compared despite different surface syntaxes (`L139-L148`)

## Sources Consulted

- `review/target-snapshot.md`
- `review/deep-review-config.json`
- `review/deep-review-strategy.md`
- `review/deep-review-state.jsonl`
- `review/iterations/iteration-001.md`
- `.claude/skills/sk-deep-review/references/quick_reference.md`

## Assessment

- `newFindingsRatio`: `0.75`
- Findings by severity: `P0=0`, `P1=1`, `P2=2`
- Total findings: `3`

## Reflection

- **What worked:** Enumerating the checklist line-by-line made it clear that the problem is not missing validation volume; it is that most cross-surface checks still lack a mechanical execution recipe.
- **What failed:** Several testability gaps collapse back to undocumented canonical naming/parity conventions, so the task still assumes local DS knowledge that the packet does not carry.
- **What to do differently:** The next pass should revisit completeness/clarity with this testability lens and decide whether the task needs a compact "implementation notes" block that defines normalization, scope allowlist, and file-local anchors.

## Recommended Next Focus

Return to **completeness + clarity** for a stabilization pass: test whether the task now has a fully explicit out-of-scope boundary, whether parity/naming language can be collapsed into one unambiguous rule, and whether any remaining checklist lines should be rewritten as exact mechanical assertions.
