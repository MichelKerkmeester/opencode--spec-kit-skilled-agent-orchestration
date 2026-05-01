I’ll frame this as a scoped research plan only, not a conclusion. I’ll quickly surface relevant repo memory/skill routing context, then answer directly with concrete questions, options, experiments, and convergence criteria.

● advisor_recommend (MCP: spec_kit_memory) · prompt: "Research scope proposal for greenfield redesi…
  └ {"status":"ok","data":{"workspaceRoot":"/Users/michelkerkmeester/MEGA/De...

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Independent analysis request — template s…
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":...

The routing signal points to the deep-research/spec-kit workflow, so I’ll use that framing while keeping this at proposal level only.

● skill(sk-deep-research)

## Research scope proposal: greenfield template backend

### 1. Research questions

1. **What is the smallest set of canonical template source files needed to scaffold every supported packet shape?**  
   Testable answer: inventory required output docs and map each output section to exactly one source unit.

2. **Can “Level 1/2/3/3+” be replaced by capability flags without losing validation clarity?**  
   Testable answer: define a schema such as `requires: ["verify", "architecture", "governance"]` and prove it can reproduce today’s required-file matrix plus phase-parent behavior.

3. **Which template units must be mandatory, optional, or workflow-owned?**  
   Testable answer: classify each document/section as `core`, `addon`, `on-demand`, or `generated/runtime-owned`, especially `handover.md`, `research.md`, `debug-delegation.md`, `resource-map.md`, and `context-index.md`.

4. **Should templates be stored as full documents, reusable section fragments, or structured metadata that renders markdown?**  
   Testable answer: compare source LOC, generator complexity, anchor reliability, and authoring ergonomics for each storage model.

5. **What is the minimum anchor/frontmatter contract memory parsers actually need?**  
   Testable answer: identify parser expectations for YAML frontmatter, `<!-- ANCHOR:* -->`, generated fences, and section IDs; separate hard requirements from incidental current formatting.

6. **Can validation be derived from the same manifest that drives scaffolding?**  
   Testable answer: prototype a manifest that produces both scaffold file lists and validator rules, eliminating duplicated logic in `create.sh` and `check-files.sh`.

7. **How should phase-parent semantics compose with child packet scaffolding?**  
   Testable answer: model phase parent as either a distinct packet kind, a capability flag, or a template profile, then check which produces the least special-case code.

8. **What is the lifecycle model for addon docs: copied at creation, generated on demand, or command-owned?**  
   Testable answer: define trigger rules for each addon doc and verify no workflow expects a missing optional doc to exist by default.

9. **What authoring workflow gives maintainers confidence after changing templates?**  
   Testable answer: specify golden snapshots, parser tests, scaffold smoke tests, or byte-stability checks required for template edits.

### 2. Candidate greenfield designs

1. **Design A: Keep rendered `level_N/`, clean up composition**  
   Pro: least disruptive and easy to inspect. Con: preserves the level taxonomy and duplicated rendered outputs.

2. **Design B: Single manifest + full-document templates**  
   Store one full template per doc type and a JSON/YAML manifest deciding which files belong to each packet kind. Pro: simple mental model. Con: repeated sections across documents may remain duplicated.

3. **Design C: Capability-based addons over core documents**  
   Replace levels with flags like `verify`, `architecture`, `governance`, `phase-parent`, `research-enabled`. Pro: smarter than LOC-based levels and maps to actual needs. Con: requires clear capability naming and conflict rules.

4. **Design D: Section-fragment library with renderer**  
   Store atomic markdown sections with IDs, frontmatter metadata, and composition rules. Pro: maximal reuse and anchor control. Con: higher generator complexity and less friendly direct editing.

5. **Design E: Packet-kind profiles**  
   Define explicit profiles such as `simple-change`, `validated-change`, `architecture-change`, `governed-change`, `phase-parent`, `research-only`. Pro: user-facing language is clearer than levels. Con: profile sprawl if not constrained.

6. **Design F: Minimal core scaffold + command-owned addons**  
   Scaffold only `spec.md`, `plan.md`, `tasks.md`, and metadata; create checklist, ADRs, handover, research, debug, resource-map only when workflows need them. Pro: radical simplification and fewer stale empty docs. Con: validators and resume logic must tolerate absent docs intentionally.

7. **Design G: Schema-first generator**  
   Store template structure as typed data and render markdown from schema. Pro: validation, anchors, docs, and generation can share one source of truth. Con: markdown authorship becomes less natural and may over-engineer the problem.

### 3. Critical experiments

1. **Scaffold comparison experiment**  
   Pick three representative packets: simple bugfix, architecture-heavy change, phase-parent with child. Scaffold each under Designs B, C, E, and F. Measure file count, generated LOC, number of empty/stub sections, and number of special cases.

2. **Single-source validation experiment**  
   Prototype a small manifest that can drive both `create` behavior and required-file validation for 4 packet shapes. Success criterion: no separate hardcoded level matrix is needed.

3. **Anchor/parser compatibility experiment**  
   Generate sample docs from two non-current designs and run memory/parser checks against frontmatter, anchors, generated fences, and section extraction. Success criterion: parser-visible semantics remain stable without preserving old template layout.

4. **Addon lifecycle experiment**  
   For each addon doc, simulate the command that first needs it: resume, debug delegation, deep research, resource-map emission, phase migration. Determine whether the doc should be scaffolded, lazily created, or exclusively workflow-owned.

### 4. Proposed loop shape

Run **5 iterations**, with a hard cap of **7** if contradictions appear.

Suggested convergence threshold: stop when the loop has answered at least **8/9 research questions**, each candidate design has been scored against the same criteria, and the last two iterations add **<15% new decision-relevant information** while surfacing no unresolved P0/P1 parser, validator, or workflow conflicts.

### 5. Top risks / tradeoffs to surface

1. **False simplicity:** removing levels may simplify templates but push hidden complexity into validators, commands, or user decisions.

2. **Anchor/frontmatter fragility:** the real constraint may not be folder layout; it may be undocumented parser assumptions around anchors, generated fences, and section names.

3. **Addon ownership confusion:** docs like `research.md`, `debug-delegation.md`, and `resource-map.md` may look like templates but behave like workflow state. The research should separate human-authored scaffold docs from command-owned artifacts before proposing any storage model.

