# Wave 1: Context Investigation Dispatches

## Investigation 1: Anchor System Architecture
**Agent:** @context (chatgpt/context.md)
**Status:** Preparing dispatch...
**Focus:** ANCHOR tag system, validation mechanisms, format enforcement
**Key Areas:**
- ANCHOR tag syntax and valid IDs (summary, state, decisions, context, artifacts, next-steps, blockers)
- anchor-generator.ts implementation
- check-anchors.sh validation script
- generate-context.js ANCHOR handling
- Memory system ANCHOR integration

## Investigation 2: Template Structure & Validation
**Agent:** @context (chatgpt/context.md)
**Status:** Preparing dispatch...
**Focus:** Template architecture, compliance validation, level requirements
**Key Areas:**
- CORE + ADDENDUM v2.2 architecture
- Level 1/2/3/3+ template files
- validate.sh, check-placeholders.sh, recommend-level.sh
- Template composition process
- Placeholder detection and enforcement

## Investigation 3: Existing Spec Compliance Analysis
**Agent:** @context (chatgpt/context.md)
**Status:** Preparing dispatch...
**Focus:** Current anchor usage patterns, compliance gaps, real-world examples
**Key Areas:**
- Scan specs/**/memory/*.md for ANCHOR usage
- Identify specs missing ANCHOR tags
- Analyze partial vs full compliance
- Pattern: when anchors are used vs skipped

## Investigation 4: Speckit Agent Utilization
**Agent:** @context (chatgpt/context.md)
**Status:** Preparing dispatch...
**Focus:** How speckit agent is invoked, routing patterns, under-utilization causes
**Key Areas:**
- Gate 3 routing logic in AGENTS.md
- speckit.md agent definition and workflow
- Orchestrator dispatch patterns for spec creation
- Alternative paths that bypass speckit
- Manual spec creation patterns

---

**Dispatch Timestamp:** Starting now
**Expected Completion:** ~5-7 minutes (parallel execution)
**Output Format:** Context Packages → consolidated findings
