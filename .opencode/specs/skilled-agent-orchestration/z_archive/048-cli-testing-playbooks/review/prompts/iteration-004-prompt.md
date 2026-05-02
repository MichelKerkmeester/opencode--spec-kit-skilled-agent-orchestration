You are running iteration 4 of a 5-iteration deep review on spec folder `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/`.

## Iteration 4 Dimension: MAINTAINABILITY

Audit how easy it will be to maintain, extend, and update these playbooks. Read prior iterations first:
- `iteration-001.md` (correctness — found 51 broken 9-col rows, root H2 invariant mismatch, spec strict fail)
- `iteration-002.md` (security — found unsafe --share, destructive recovery gaps, codex fast-tier issues, hardcoded paths)
- `iteration-003.md` (traceability — found CO-006 prompt mismatch, broken CX-004 anchor, stale impl-summary counts, missing ADR cross-links)

## Scope

1. **HVR residual classification accuracy** — implementation-summary claims all remaining em-dashes/semicolons/Oxford commas live in protected zones (frontmatter description, inline backtick code, 9-column table cells, parenthesized ID lists). Verify by sampling 20 random remaining hits and classifying each: is it actually in a protected zone, or is it a true HVR violation that the cleanup pass missed?
2. **Naming consistency** — feature ID prefixes (CC/CX/CP/CG/CO), category folder naming (`NN--lowercase-hyphenated`), per-feature file naming (`NNN-feature-slug.md`). Are they consistent across all 5 playbooks? Any drift?
3. **Cross-CLI invariants** — categories `01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates` are claimed invariant. Verify their CONTENT shape is also reasonably similar across CLIs (not just the position). Are the per-feature files inside these invariant categories teaching consistent lessons across CLIs, or do they diverge so much that the invariant is cosmetic?
4. **Section-rename completeness** — earlier audit found 504 files now carry `## 2. SCENARIO CONTRACT`. Spot-check 10 files at random and verify the new heading + the prose intro line under it actually read coherently. Also verify the 3-way prompt sync (Prompt: field, scenario row Exact Prompt, root summary prompt) was preserved through the rename.
5. **Future-update friction** — if a maintainer needs to add a new scenario to (say) cli-claude-code, what is the cognitive load? Are there hidden coupling points that would force them to update multiple files? Is the cross-reference index manually maintained or auto-generatable?
6. **DQI / readability** — sample 5 per-feature files. Are the prompts realistic orchestrator-led prompts (Role → Context → Action → Format), or are some bare command paraphrases? Are scenarios redundant (multiple files testing essentially the same flag)?
7. **Spec docs maintainability** — is implementation-summary.md actually keeping pace with reality? Are checklist items marked [x] still accurate after the section-rename pass and HVR pass?

## Severity contract

- **P0 (Blocker)**: a major maintenance footgun (e.g. cross-reference index that must be updated in 3 places when adding a scenario), a misclassified HVR residual that is actually a body-text violation, a broken-by-rename file
- **P1 (Required)**: naming drift, content-divergence inside invariant categories, redundant scenarios
- **P2 (Suggestion)**: prose tightening, scenario consolidation opportunities

## Output (REQUIRED)

Write findings to `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-004.md` using same template format. Read-only.
