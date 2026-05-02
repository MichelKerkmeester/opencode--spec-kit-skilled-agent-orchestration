## Per-Asset Gap Analysis

### complexity_decision_matrix.md
- Gap 1: Content Scaling Matrix tops out at 8-12 phases and 100+ tasks, failing to accommodate massive 51-folder programs, 16 main phases, or 189-feature catalogs. (P1)
- Gap 2: Lacks dimension scoring signals and architectural guidance for multi-child hierarchies (e.g., 21-child code audit, 6-child Hydra database roadmap). (P1)
- Gap 3: Missing risk/complexity scoring signals for metric-gated sprint models (where progression is gated by evaluation infrastructure rather than simple task completion). (P2)

### level_decision_matrix.md
- Gap 1: Fails to account for parent-child phase relationships and does not explain when or how to break a single phase into multiple independent children (like the 21-child audit). (P1)
- Gap 2: Over-indexes on LOC thresholds as soft guidance, failing to adequately guide level selection for non-code tasks like massive multi-agent audits or root synthesis tasks where LOC is zero but complexity is 3+. (P2)

### parallel_dispatch_config.md
- Gap 1: Only defines a limited "4-agent parallel exploration" and 3-agent tiered spec creation. Must be updated to reflect the 5-wave parallel execution model with up to 16 concurrent agents. (P0)
- Gap 2: Fails to address multi-model cross-agent mixing (e.g., combining GPT-5.4, Codex, and Sonnet agents in a single campaign). (P1)
- Gap 3: Missing dispatch configurations for "Root Synthesis" tasks involving massive delegation (e.g., 13 delegated agents concurrently extracting structured data across 51 folders). (P1)

### template_mapping.md
- Gap 1: Lacks template mappings and copy commands for "Code Audit Child" structures, which were shown to require their own independent specs, implementation summaries, and verification evidence. (P1)
- Gap 2: Missing template structures for "Root Synthesis" documents and "Sprint Gate" validation thresholds. (P1)

## Cross-Cutting Gaps
- **Scale Exhaustion**: The current System Spec Kit assets were designed for single-folder or modest multi-folder projects. They lack the architectural vocabulary and thresholds for "Epic-scale" programs involving 50+ specs, deep parent-child nesting, multi-wave verification, and 15+ concurrent AI agents.
- **Hierarchical Phasing**: None of the assets define the structural rules for how a parent folder (e.g., Phase 012) relates to its children (001-021) in terms of documentation inheritance, shared decision records, or rolled-up checklist verification.

## Recommendations
1. **Update `complexity_decision_matrix.md`**: Expand the Content Scaling Matrix to include an "Epic/Program" tier supporting 15+ phases, 50+ folders, and 150+ features.
2. **Revise `level_decision_matrix.md`**: Introduce explicit parent-child phase relationship rules. Provide guidance on breaking down large workstreams (e.g., systematic audits, database roadmaps) into independent children to prevent monolithic documentation bottlenecks.
3. **Overhaul `parallel_dispatch_config.md`**: Document the "Wave-based Execution" model, raise concurrency limits to reflect 16-agent campaigns, and add specific dispatch profiles for multi-model (Codex/Sonnet/GPT-5.4) mixing and Root Synthesis delegation.
4. **Expand `template_mapping.md`**: Add new template archetypes and composition commands for 'Audit Child Spec', 'Root Synthesis', and 'Sprint Gate Evaluation' to support the validation and synthesis patterns pioneered in the epic.