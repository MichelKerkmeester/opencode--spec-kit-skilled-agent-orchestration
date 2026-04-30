## Packet 045/008: validator-spec-doc-integrity — Deep-review angle 8 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/008-validator-spec-doc-integrity/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/lib/` (validator helpers)
- `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` (TS phase-parent detector)
- `.opencode/skill/system-spec-kit/scripts/dist/spec/is-phase-parent.js` (compiled JS)
- `.opencode/skill/system-spec-kit/shared/lib/shell-common.sh` (shell phase-parent detector — SOT pair)
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/templates/` (Level 1, 2, 3 templates)
- A representative sample of `.opencode/specs/**/*.md` (spec docs)

### Audit dimensions + integrity-specific questions

For correctness: strict validator catches all documented contract violations; Level 1/2/3 boundary enforcement; phase-parent detection (shell + TS) MUST agree (per CLAUDE.md / SKILL.md); evidence marker lint; anchor balance; template_source enforcement.

For security: validator can't be tricked into passing malicious spec content (e.g., injected paths, oversized blocks, anchor confusion).

For traceability: validator output is operator-actionable (clear file + rule + reason); strict mode reports both errors AND warnings.

For maintainability: validator rules are codified in one place; Level boundary logic is centralized.

### Specific questions

- Do `is_phase_parent` (shell) and `isPhaseParent` (TS) ALWAYS agree? Run both on a sample of spec folders; flag any divergence.
- Does the validator correctly distinguish phase-parent (lean) from Level 2 (full)?
- Are there any spec folders in the repo that currently pass strict but shouldn't (false negative)?
- Are there any spec folders that should pass but currently fail (false positive)?
- The recently-added FRONTMATTER_MEMORY_BLOCK rule (compact recent_action / next_safe_action): does it correctly reject narrative violations?
- The TEMPLATE_HEADERS rule: does it allow the documented exceptions (e.g., extra "Research Context" sections in research packets)?
- The LINKS_VALID rule: opt-in via SPECKIT_VALIDATE_LINKS=true — should this be on by default?

### Read also

- 010 phase-parent documentation packet
- Validator commit history for recent rule additions
- 037/004 sk-doc template alignment (validator interactions)

### Output

Same 9-section review-report.md format. Severity rubric: P0=validator passes broken specs / fails valid specs / detector disagreement, P1=missing rule coverage, P2=ergonomics.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-008-validator-spec-doc-integrity","validator audit","spec doc integrity review","phase-parent detection consistency"]`.

**Causal summary**: `"Deep-review angle 8: validator + spec-doc structural integrity — strict mode coverage, Level 1/2/3 boundaries, phase-parent detection (shell+TS agreement), evidence markers, template enforcement."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
