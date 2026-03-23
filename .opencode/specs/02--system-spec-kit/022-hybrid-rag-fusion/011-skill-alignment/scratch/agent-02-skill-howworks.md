## Findings (numbered gaps with current vs expected state)

1) **Gate 3 integration is underspecified for phase programs**
- **Current (SKILL.md §3):** Gate 3 documents options A/B/C/D only and frames work as single-folder selection.
- **Expected (022 epic):** Delivery model is phase-centric with sprint gates, parent/child phase trees, and multi-agent campaigns (including 5-wave, up to 16 concurrent agents). Section 3 should explicitly cover phase workflows and campaign execution patterns.

2) **Complexity detection does not model epic-scale signals**
- **Current:** Complexity guidance is mostly LOC-based level mapping.
- **Expected:** The epic is explicitly scored **95/100**, **51 folders**, **25+ multi-agent campaigns**, and parent-child coordination. Complexity guidance should include these non-LOC triggers (coordination, campaign scale, phase topology, governance risk).

3) **Memory server footprint is stale (despite correct version)**
- **Current:** `@spec-kit/mcp-server` is documented as v1.7.2 with `context-server.ts` ~682 LOC, 12 handlers, 20 lib subdirs, and 25 tools.
- **Expected (runtime):** Version **v1.7.2 is correct**, but current footprint is materially larger: `context-server.ts` is 1073 LOC, handlers are 40 files, lib has 26 subdirectories, and `TOOL_DEFINITIONS` contains 31 tools.

4) **Tool-count references are internally inconsistent**
- **Current:** SKILL.md says 25 tools; memory reference says 23; MCP README architecture text references 28.
- **Expected:** A single canonical count/source of truth (prefer `mcp_server/tool-schemas.ts` `TOOL_DEFINITIONS`) and synchronized docs.

5) **Feature-flag section is not current relative to epic governance/runtime**
- **Current:** SKILL §3 lists 10 flags.
- **Expected:** Epic governance tracks a strict active scoring-flag ceiling (`<=8`) while runtime docs/catalog now include a much broader graduated/default-on set (search, telemetry, roadmap/Hydra metadata, governance). Section 3 should separate:
  - operationally gated scoring flags (ceiling-governed), and
  - broader platform/configuration flags.

6) **Validation workflow omits phase-recursive behavior used by the epic**
- **Current:** Validation flow mentions `validate.sh <spec-folder>` and alignment verifier.
- **Expected:** Include recursive/phase validation behavior (`--recursive`, auto-enable when phase children exist), since epic execution explicitly relied on sprint gates, phase sweeps, and recursive validation outcomes (including one recorded recursive failure in 012/021).

7) **Checklist guidance is accurate at folder level but incomplete at campaign level**
- **Current:** P0/P1/P2 semantics are defined correctly for single-folder completion.
- **Expected:** Epic practice includes campaign-level checklist burn-down across many folders/waves, with explicit deferred-item accounting while root remains in-progress. Section 3 should describe this multi-folder verification pattern.

8) **Spec Kit Memory subsection is mostly accurate on architecture features, but misses alignment framing**
- **Current:** 4-stage pipeline, adaptive fusion, mutation ledger, retrieval telemetry, and Hydra metadata are described.
- **Expected:** Keep these (they align with delivered architecture), but update surrounding inventory/governance context (tool counts + flag model) so this subsection does not conflict with live docs/runtime.

## Recommendations

1. Add a **Phase Workflow block** under Gate 3: parent/child phase folders, sprint-gate sequencing, and multi-agent campaign patterns.

2. Replace LOC-only complexity guidance with a **hybrid complexity rubric** (scope/risk/research/multi-agent/coordination), including explicit high-scale triggers from 022.

3. Make `mcp_server/tool-schemas.ts` `TOOL_DEFINITIONS` the **single source of truth** for tool inventory; generate counts in SKILL/docs from that source.

4. Split feature flags into two tables:
- **Gate-governed scoring flags** (ceiling policy),
- **Platform/telemetry/roadmap flags** (non-scoring operational flags).

5. Expand validation section with **recursive phase validation** and phase-sweep guidance used in large programs.

6. Add a short **campaign checklist model** explaining how P0/P1/P2 works across multi-folder waves (not just one folder).

## Priority (P0/P1/P2)

- **P0**
  - Finding 3 (stale server/tool footprint metadata)
  - Finding 5 (feature-flag model drift vs governance/runtime)

- **P1**
  - Finding 1 (Gate 3 phase/campaign integration gap)
  - Finding 2 (complexity model missing epic-scale signals)
  - Finding 6 (validation workflow missing recursive phase behavior)

- **P2**
  - Finding 4 (cross-doc tool-count inconsistency cleanup)
  - Finding 7 (campaign-level checklist guidance)
  - Finding 8 (memory subsection framing alignment)
