# Iteration 004: Maintainability audit of template and retrieval contracts

## Focus
Check whether the root packet docs still satisfy the active template, anchor, and retrieval requirements that current tooling expects.

## Findings
### P1 - Required
- **F004**: Root packet docs drift from the active Level-3 template contract badly enough to break tooling - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/review/validation-strict.txt:34` - The root `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all miss required anchors, `_memory` blocks, and template headers, so structured retrieval, validator guidance, and maintenance automation no longer have the packet shape they expect. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/review/validation-strict.txt:34-71] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/review/validation-strict.txt:134-182] [SOURCE: AGENTS.md:260-269]

### P2 - Suggestion
[None]

## Ruled Out
- This is not limited to cosmetic heading drift; the validator flags contract-level breakage across anchors, frontmatter, and structural headers.

## Dead Ends
- Reviewing only the human-readable prose would miss the machine-consumed retrieval contract breakage.

## Recommended Next Focus
Return to correctness and test whether the parent packet still preserves the original research deliverables it declared in `spec.md`.
