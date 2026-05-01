---
title: "Deep Research Synthesis: SPAR-Kit UX patterns for system-spec-kit"
description: "Final synthesis for packet 057 comparing external SPAR-Kit against internal system-spec-kit across installer, instruction, command, template, tool-discovery, and persona UX axes."
sessionId: "a383574c-2a8d-47ef-a6a9-81ab0eb6d99b"
generation: 1
completedAt: "2026-05-01T11:03:48+02:00"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade"
    last_updated_at: "2026-05-01T11:03:48+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Synthesized research outputs"
    next_safe_action: "Start follow-on packet 058-gate-copy-and-question-budget or validate 061 prerequisites"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
      - "research/deep-research-state.jsonl"
    completion_pct: 100
    open_questions:
      - "Locate real fs-enterprises instruction root before 061 implementation"
      - "Run strict-validation baseline before 063 or 069 implementation"
      - "Decide diagnostic tool-ledger ownership before 062 implementation"
    answered_questions:
      - "Q1-Q8 resolved for research purposes"
---
# Deep Research Synthesis: SPAR-Kit UX patterns for system-spec-kit

## 1. Title + Frontmatter

This synthesis completes the 10-iteration deep-research loop for packet `057-cmd-spec-kit-ux-upgrade`.

- **External surface**: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/`
- **Internal surface**: `system-spec-kit`, `.opencode/command/spec_kit/`, `.opencode/command/memory/`, `.opencode/command/create/`, `.opencode/agent/`, root instruction files
- **Run**: 10 cli-codex / gpt-5.5 / high / fast iterations
- **Outcome**: converged ranked backlog, packets `058-*` through `069-*`

## 2. Executive Summary

- SPAR-Kit is most useful as a UX and ownership-language reference, not as a replacement architecture. Its lifecycle copy, asset-policy vocabulary, and operator-visible ledgers translate well; its tiny artifact model does not.
- Adoption verdict counts: `adopt-as-is`: 1, `adapt`: 6, `inspired-by`: 1, `reject-with-rationale`: 4.
- The highest-confidence immediate packet is `058-gate-copy-and-question-budget`: adapt SPAR's blocker-vs-refinement follow-up split into `Required To Proceed` and `Optional Refinements`.
- The highest-impact architectural packet is `061-declarative-ownership-manifest`: reuse SPAR policy vocabulary (`managed_block`, `seed_if_missing`, `replace`, `replace_managed_children`) as inventory and lint before any installer behavior.
- All six requested axes have evidence-backed findings. Remaining gaps are implementation prerequisites: locate the real `fs-enterprises` instruction root, baseline strict validation before template migration, and decide ownership for the future diagnostic tool ledger.

## 3. Research Charter

**Topic**: Compare external SPAR-Kit by jed-tech, npm `@spar-kit/install` Beta1, against internal `system-spec-kit` and produce ranked, evidence-backed UX and orchestration patterns.

**Axes covered**:

1. Installer and multi-target distribution: SPAR `@spar-kit/install` target configs vs internal manual/runtime installation.
2. Instruction-file management: SPAR managed blocks and 60-line warning vs internal hand-edited `AGENTS.md` / `CLAUDE.md` surfaces.
3. Command/skill granularity: SPAR Specify / Plan / Act / Retain vs internal `/spec_kit:*`, `/memory:*`, `/create:*`, suffixes, and command YAMLs.
4. Template architecture: SPAR two-template and asset-policy model vs internal CORE + ADDENDUM + level template tree.
5. Tool-discovery UX: SPAR `.spar-kit/.local/tools.yaml` vs internal skill-advisor, MCP routing, Code Mode, and native tool schemas.
6. Personas and UX tone: SPAR persona research and follow-up budgeting vs internal senior-engineer voice, consolidated-question protocol, and role-based agents.

**Success criteria copied from `spec.md` Section 3 In Scope and Section 5**:

- Produce 10-20 ranked recommendations.
- Cover all six axes with at least one finding.
- Cite at least one external path and one internal path per finding.
- Tag every finding as `adopt-as-is`, `adapt`, `inspired-by`, or `reject-with-rationale`.
- Assign each finding a follow-on packet.

## 4. Methodology

The loop ran 10 cli-codex / gpt-5.5 / high / fast iterations with fresh context per iteration and externalized state under `research/`.

- Iterations 1-5 performed axis-specific comparison: installer/commands, instruction files, templates, tool discovery, and personas/tone.
- Iterations 6-8 synthesized ranked adoption candidates and risk constraints.
- Iteration 9 revalidated source paths, answered Q1-Q8, and refined the command taxonomy boundary.
- Iteration 10 finalized axis coverage, ranked findings, thin-evidence notes, and follow-on packet ordering.

State was externalized in `research/deep-research-state.jsonl`, per-iteration markdown files, and `research/deep-research-strategy.md`. The reducer-owned `findings-registry.json` remained empty, so the iteration narratives are the source of truth for this synthesis.

## 5. Coverage Map

| Axis | Findings | Evidence depth | Gaps |
| --- | ---: | --- | --- |
| 1. Installer and multi-target distribution | 2 | High for SPAR target configs and internal runtime complexity | Runtime-target implementation should wait for ownership manifest |
| 2. Instruction-file management | 2 | Medium-high for Public and Codex files; Barter seen in iterations | Real `fs-enterprises` root not visible in this workspace |
| 3. Command/skill granularity | 2 | High for SPAR phase skills and internal command docs/YAML concepts | Full compatibility matrix deferred to `060-*` |
| 4. Template architecture | 2 | High for SPAR templates and internal composer/validator constraints | Strict-validation corpus baseline deferred to `063-*` / `069-*` |
| 5. Tool-discovery UX | 2 | High for SPAR ledger and internal advisor/MCP discovery | Ledger ownership decision deferred to `062-*` |
| 6. Personas and UX tone | 3 | High for SPAR persona file and internal voice/agent surfaces | Personas need evaluation fixtures, not runtime injection |

## 6. Findings Index

| ID | Axis | Verdict tag | Title | Risk | Follow-on packet |
| --- | --- | --- | --- | --- | --- |
| F-057-001 | 6 | `adapt` | Convert SPAR follow-up budgeting into Required vs Optional questions | Low | `058-gate-copy-and-question-budget` |
| F-057-002 | 3 | `adopt-as-is` | Add phase-boundary copy to command docs | Low | `059-phase-boundary-copy-pass` |
| F-057-003 | 3 | `adapt` | Use a four-axis command taxonomy, not a two-axis collapse | Medium | `060-command-taxonomy-and-compatibility-matrix` |
| F-057-004 | 1, 2, 4 | `adapt` | Build a declarative ownership manifest from SPAR policy vocabulary | Medium-high | `061-declarative-ownership-manifest` |
| F-057-005 | 5 | `adapt` | Add an operator-visible diagnostic tool ledger | Medium | `062-tool-discovery-ledger` |
| F-057-006 | 4 | `adapt` | Inventory templates by role before manifesting them | Medium | `063-template-inventory-and-manifest` |
| F-057-007 | 1 | `adapt` | Prototype runtime target manifests after ownership semantics | Medium-high | `064-runtime-target-manifest` |
| F-057-008 | 6 | `inspired-by` | Use SPAR personas as evaluation fixtures and audience maps | Low | `065-persona-evaluation-fixtures` |
| F-057-009 | 5 | `reject-with-rationale` | Reject static tools.yaml as routing authority | Low | `066-tool-discovery-authority-boundary` |
| F-057-010 | 2 | `reject-with-rationale` | Reject hard global instruction-file line caps | Low | `067-generated-block-budget` |
| F-057-011 | 6 | `reject-with-rationale` | Reject named personas inside runtime prompts | Low | `068-runtime-persona-boundary` |
| F-057-012 | 4 | `reject-with-rationale` | Reject SPAR's two-template consumer architecture | Medium | `069-template-compression-boundary` |

## 7. Detailed Findings

### F-057-001: Convert SPAR follow-up budgeting into Required vs Optional questions

**Verdict**: `adapt`

**Axis**: 6

SPAR's clearest immediate UX improvement is its separation between material blockers and optional exploration. Instead of asking every possible planning question with equal weight, SPAR distinguishes the answers needed to move forward from refinements that can wait.

Internal system-spec-kit already has the harder discipline underneath: consolidated question prompts, Gate 3 answer options, and command YAMLs that cap clarification. The adoption path is therefore copy and structure, not new control flow. Use `Required To Proceed` for blockers and `Optional Refinements` for non-blocking detail; omit optional questions when the prompt is already long or confidence is high.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.plan.recommendations.md`
- Internal: `AGENTS.md`
- Internal: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- Internal: `.opencode/command/spec_kit/plan.md`

**Adoption Risk**: Low. The main constraint is preserving machine-readable Gate 3 options while improving the surrounding copy.

**Follow-on Packet**: `058-gate-copy-and-question-budget`. Scope: update gate and planning prompt copy to split required blockers from optional refinements, then validate the prompt shapes against Gate 3 and command YAML expectations.

### F-057-002: Add phase-boundary copy to command docs

**Verdict**: `adopt-as-is`

**Axis**: 3

SPAR's phase-boundary language is portable as a copy pattern: each phase states what it does, what it does not do, and when it hands off. This does not require changing internal behavior. It only requires giving users the same first-glance orientation before they encounter the heavier system-spec-kit machinery.

The internal command surface is stronger and more granular than SPAR's, but its first page often leads with command mechanics and YAML ownership rather than the phase contract. A short phase-boundary block at the top of major `/spec_kit:*` commands would reduce first-use ambiguity while leaving execution semantics intact.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/README.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-act/SKILL.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-retain/SKILL.md`
- Internal: `.opencode/command/spec_kit/plan.md`
- Internal: `.opencode/command/spec_kit/implement.md`
- Internal: `.opencode/command/spec_kit/complete.md`
- Internal: `.opencode/skill/system-spec-kit/SKILL.md`

**Adoption Risk**: Low. The risk is only accidental contradiction with existing gates; keep the copy descriptive and phase-local.

**Follow-on Packet**: `059-phase-boundary-copy-pass`. Scope: add concise "this command owns / does not own / hands off to" blocks for plan, implement, complete, resume, deep-research, and deep-review docs.

### F-057-003: Use a four-axis command taxonomy, not a two-axis collapse

**Verdict**: `adapt`

**Axis**: 3

SPAR's four lifecycle verbs are useful navigation copy, but they do not model the internal command system. The internal surface has separate dimensions for execution mode, feature flags, lifecycle intent, and executor/provenance. A two-axis `mode x scope` model would hide important differences between `:auto`, `:confirm`, `:with-phases`, `:with-research`, doctor apply modes, intake-only planning, and deep-loop executor configuration.

The right adaptation is a compatibility matrix that preserves existing semantics while making them legible. SPAR's lifecycle should sit above the matrix as orientation, not replace the matrix.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/README.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`
- Internal: `.opencode/command/spec_kit/README.txt`
- Internal: `.opencode/command/spec_kit/deep-research.md`
- Internal: `.opencode/command/spec_kit/deep-review.md`
- Internal: `.opencode/command/create/agent.md`
- Internal: `.opencode/command/memory/README.txt`
- Internal: `.opencode/skill/sk-deep-research/SKILL.md`

**Adoption Risk**: Medium. Skill-advisor examples, command README syntax, YAML start conditions, Gate 3 classification, and docs need synchronized edits.

**Follow-on Packet**: `060-command-taxonomy-and-compatibility-matrix`. Scope: inventory command suffixes and flags across `/spec_kit`, `/create`, `/memory`, `/doctor`, and `/improve`, then publish a compatibility matrix and user-facing lifecycle overlay.

### F-057-004: Build a declarative ownership manifest from SPAR policy vocabulary

**Verdict**: `adapt`

**Axis**: 1, 2, 4

SPAR's most reusable architectural idea is its ownership vocabulary. Target configs declare whether an asset should be replaced, seeded only when missing, inserted into a managed block, or used to replace managed children. That vocabulary appears across installer behavior, instruction-file management, and template asset handling.

Internal system-spec-kit needs this vocabulary more than it needs a public installer. Ownership is currently distributed across instruction files, command docs, templates, agents, hooks, and memory tooling. A manifest can start as inventory and lint: document what the framework owns, what the host repo owns, and what can be generated without touching host-owned content.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/install-engine.mjs`
- Internal: `AGENTS.md`
- Internal: `.codex/AGENTS.md`
- Internal: `.opencode/skill/system-spec-kit/templates/`
- Internal: `.opencode/command/spec_kit/`
- Internal: `.opencode/agent/`

**Adoption Risk**: Medium-high. A manifest that mutates instruction files too early can damage hard-gate text; begin with read-only inventory, lint, and tiny generated-block rules.

**Follow-on Packet**: `061-declarative-ownership-manifest`. Scope: define manifest schema, classify internal surfaces by ownership policy, and prototype lint/reporting before any sync operation.

### F-057-005: Add an operator-visible diagnostic tool ledger

**Verdict**: `adapt`

**Axis**: 5

SPAR's `.spar-kit/.local/tools.yaml` improves discoverability because it gives users one repo-local place to inspect expected tools and observed status. It is not just a machine registry; it is an operator-facing dashboard with tool purpose, check commands, installed state, version, reason, and last checked timestamp.

Internal system-spec-kit has stronger live routing systems, but no single local inventory view. The future ledger should summarize capability families and health states: skill-advisor freshness, native MCP status, Code Mode configured servers, CocoIndex availability, and expected CLIs. It should be refreshed explicitly, not silently at prompt time.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/.spar-kit/.local/tools.yaml`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-init/SKILL.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/specs/completed/tools-check/tools-check_spec.md`
- Internal: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- Internal: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- Internal: `.opencode/skill/mcp-code-mode/SKILL.md`
- Internal: `.opencode/command/doctor/skill-advisor.md`

**Adoption Risk**: Medium. The ledger helps only if it remains diagnostic; if used as routing truth, it will drift from live schemas.

**Follow-on Packet**: `062-tool-discovery-ledger`. Scope: design a repo-local tools/status dashboard and decide whether refresh is owned by `/doctor`, install/init, memory-backed status, or an explicit command.

### F-057-006: Inventory templates by role before manifesting them

**Verdict**: `adapt`

**Axis**: 4

SPAR's two-template source model is attractive because it is easy to reason about, but the transferable idea is not the template count. The transferable idea is that source assets and install assets have explicit roles and policies.

Internal system-spec-kit already has a composer that materializes level outputs from CORE + ADDENDUM inputs. The next step is classification: source input, generated output, validation-critical consumer artifact, example, optional asset, cross-cutting template, and phase-parent template. That inventory should happen before any manifest becomes executable.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/spec.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/plan.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/pack-prep.mjs`
- Internal: `.opencode/skill/system-spec-kit/templates/`
- Internal: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- Internal: `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md`
- Internal: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

**Adoption Risk**: Medium. Template changes touch validators, existing spec folders, and resume contracts; classify first, generate later.

**Follow-on Packet**: `063-template-inventory-and-manifest`. Scope: create a file-by-file template inventory and dry-run manifest plan, including strict-validation baseline sampling.

### F-057-007: Prototype runtime target manifests after ownership semantics

**Verdict**: `adapt`

**Axis**: 1

SPAR's target configs show a compact way to describe per-runtime placement. That is useful for `.opencode`, `.codex`, `.claude`, `.gemini`, and other runtime-specific surfaces, but placement is not the hard part internally. The hard part is behavior: hooks, plugins, native MCP, YAML workflows, skill directories, and command surfaces do not have identical capabilities.

Runtime target manifests should therefore follow the ownership manifest. First define what the framework owns and how it may be materialized; then define where each runtime receives the relevant files.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/cli.mjs`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/install-engine.mjs`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/opencode.json`
- Internal: `.opencode/agent/README.txt`
- Internal: `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- Internal: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- Internal: `.codex/AGENTS.md`

**Adoption Risk**: Medium-high. A placement manifest without behavior semantics can create false confidence about cross-runtime parity.

**Follow-on Packet**: `064-runtime-target-manifest`. Scope: prototype target manifests for `.opencode`, `.codex`, `.claude`, and `.gemini`, constrained by the ownership manifest from `061-*`.

### F-057-008: Use SPAR personas as evaluation fixtures and audience maps

**Verdict**: `inspired-by`

**Axis**: 6

The charter listed five SPAR personas, but the actual persona file contains six: Vibe Vera, Promptwright Pete, Terminal Tess, Manager Maya, Maintainer Max, and Consultant Cass. That correction matters because it shows the persona layer is an evolving audience map, not a fixed runtime identity.

Internal system-spec-kit should use those personas to evaluate whether command docs and gate prompts are legible to different operator types. Terminal Tess, Maintainer Max, and Manager Maya map cleanly to internal priorities; Vera, Pete, and Cass are useful friction tests for onboarding, prompt clarity, and consultant-style portability.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.specify.recommendations.md`
- Internal: `.codex/AGENTS.md`
- Internal: `AGENTS.md`
- Internal: `.opencode/agent/orchestrate.md`
- Internal: `.opencode/agent/improve-prompt.md`
- Internal: `.opencode/agent/ultra-think.md`

**Adoption Risk**: Low. Keep personas in evaluation fixtures and design docs, outside runtime prompts.

**Follow-on Packet**: `065-persona-evaluation-fixtures`. Scope: create evaluation scenarios that test gate copy, command docs, and onboarding guidance against the six SPAR-style audiences.

### F-057-009: Reject static tools.yaml as routing authority

**Verdict**: `reject-with-rationale`

**Axis**: 5

SPAR's `tools.yaml` works because its v1 tool universe is small and CLI-focused. Internal system-spec-kit has dynamic tool exposure across native Spec Kit Memory schemas, prompt-time skill-advisor hooks, Code Mode discovery, CocoIndex, runtime plugins, and deferred tools.

The internal system should borrow the operator inventory UX but reject static registry authority. A ledger can say where truth lives and whether a subsystem is live, stale, absent, or unavailable; it should not mirror every tool or override live routing.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/.spar-kit/.local/tools.yaml`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/specs/completed/tools-check/tools-check_spec.md`
- Internal: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- Internal: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- Internal: `.opencode/skill/mcp-code-mode/SKILL.md`

**Adoption Risk**: Low. Documenting the authority boundary first prevents later ledger drift.

**Follow-on Packet**: `066-tool-discovery-authority-boundary`. Scope: define which surfaces are authoritative for routing, MCP schema truth, external MCP discovery, CLI inventory, and health dashboards.

### F-057-010: Reject hard global instruction-file line caps

**Verdict**: `reject-with-rationale`

**Axis**: 2

SPAR can warn about long instruction files because its installed `AGENTS.md` and `CLAUDE.md` are tiny boot pointers. Internal instruction files carry global voice, gates, skill routing, memory save rules, validation, code search, agent routing, MCP routing, and repo-level policy.

The portable pattern is a generated-block budget, not a full-file cap. A future managed block can warn when generated content exceeds a scan-friendly limit, but human-authored instruction files should not be forced under SPAR's 60-line model.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/AGENTS.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/CLAUDE.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-init/SKILL.md`
- Internal: `AGENTS.md`
- Internal: `.codex/AGENTS.md`
- Internal: `.opencode/skill/system-spec-kit/SKILL.md`

**Adoption Risk**: Low. The rejection is clear; the adaptation is only lint guidance for generated blocks.

**Follow-on Packet**: `067-generated-block-budget`. Scope: define generated-block line budgets and lint copy without capping full instruction files.

### F-057-011: Reject named personas inside runtime prompts

**Verdict**: `reject-with-rationale`

**Axis**: 6

SPAR's named personas are useful product-design material. They should not become runtime identities inside `/spec_kit:*` prompts. Internal behavior depends on a calibrated senior-engineer voice, hard gates, and explicit role contracts for agents. Adding Vera/Pete/Tess/Maya/Max/Cass to execution prompts would introduce competing priorities and tone drift.

Keep personas as external evaluators of the UX, not as identities the assistant is asked to inhabit while executing gated workflows.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`
- Internal: `.codex/AGENTS.md`
- Internal: `.opencode/agent/orchestrate.md`
- Internal: `.opencode/agent/improve-prompt.md`
- Internal: `.opencode/agent/ultra-think.md`

**Adoption Risk**: Low. The boundary is easy to enforce in command prompt review.

**Follow-on Packet**: `068-runtime-persona-boundary`. Scope: document where audience personas may be used and where runtime prompt identity must remain voice/role-contract based.

### F-057-012: Reject SPAR's two-template consumer architecture

**Verdict**: `reject-with-rationale`

**Axis**: 4

SPAR's two-template architecture is correct for SPAR's small artifact contract. It is not correct for system-spec-kit as a consumer-facing target. Internal validation and recovery rely on multiple document types, metadata, phase-parent detection, checklist policy, decision records, continuity anchors, and graph metadata.

The acceptable adaptation is source-layer compression: reduce duplicated fragments, classify assets, and tighten composition. Do not remove validation-critical consumer artifacts.

**Evidence**:

- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/spec.md`
- External: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/plan.md`
- Internal: `.opencode/skill/system-spec-kit/templates/`
- Internal: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- Internal: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Internal: `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`

**Adoption Risk**: Medium. A poorly scoped template cleanup could break existing packets; baseline validation before changes is mandatory.

**Follow-on Packet**: `069-template-compression-boundary`. Scope: define what source-layer compression may touch, what consumer artifacts remain required, and what strict-validation baseline is needed before migration.

## 8. Cross-cutting Themes

1. **Adopt vocabulary before automation**. SPAR's strongest contribution is naming ownership and phase boundaries. Internal adoption should start with manifests, lint, docs, and diagnostics before any mutating installer behavior.
2. **Use compact UX as an overlay, not a replacement**. Specify / Plan / Act / Retain makes the system easier to scan, but internal command semantics need a richer taxonomy.
3. **Separate operator inventory from agent routing**. SPAR's visible ledgers help users inspect state. Internal skill-advisor and MCP systems should remain live sources of routing truth.
4. **Compress source layers, not consumer contracts**. Template and instruction surfaces can be made clearer behind the scenes, but validation-critical artifacts and hard gates must remain visible.
5. **Personas are test lenses, not runtime identities**. SPAR's audience research is useful for evaluating command UX; internal execution should keep its senior-engineer voice and role contracts.

## 9. Reject-with-rationale Section

- **Static `tools.yaml` as routing authority**: rejected because internal capability truth is dynamic across hooks, native schemas, Code Mode, plugins, and runtime exposure. Keep only inventory UX.
- **Hard global 60-line instruction cap**: rejected because internal instruction files carry governance and runtime contracts. Use a generated-block budget instead.
- **Named personas in runtime prompts**: rejected because they conflict with calibrated senior-engineer voice and role-based agent contracts. Use personas in evaluation fixtures.
- **Two-template consumer architecture**: rejected because internal validators and recovery flows depend on multiple document types and metadata contracts. Compress only the source layer.
- **Npm installer as the lead adoption pattern**: rejected for now because internal system-spec-kit is private/local, hook-heavy, MCP-aware, and runtime-specific. Target manifests are the transferable subset.

## 10. Adoption Roadmap

1. `058-gate-copy-and-question-budget` should go first. It is low risk, improves day-to-day UX, and exercises the follow-up budget idea before deeper command changes.
2. `059-phase-boundary-copy-pass` can follow immediately. It adds SPAR-style phase orientation without altering behavior.
3. `060-command-taxonomy-and-compatibility-matrix` should precede command-surface simplification. It protects hooks, suffixes, YAML assets, and advisor examples from accidental collapse.
4. `061-declarative-ownership-manifest` should precede target manifests, instruction sync, and template manifest execution.
5. `062-tool-discovery-ledger` and `066-tool-discovery-authority-boundary` should be paired. Define authority boundaries before or alongside the ledger implementation.
6. `063-template-inventory-and-manifest` should precede `069-template-compression-boundary`. Inventory and baseline validation come before source-layer compression.
7. `064-runtime-target-manifest` depends on `061-*`. Placement should follow ownership semantics.
8. `065-persona-evaluation-fixtures` can run independently after `058-*` and `059-*` produce copy to test.
9. `067-generated-block-budget` depends on `061-*` enough to know what generated instruction regions exist.
10. `068-runtime-persona-boundary` can be a short governance packet paired with `065-*`.

## 11. Open Questions Resolved

- **Q1**: The smallest viable managed-block subset is manifest + lint + tiny generated-block budgets using `managed_block` semantics. Do not let an installer own full instruction files. Full triad validation is deferred to `061-declarative-ownership-manifest` because `fs-enterprises` was not visible in this workspace.
- **Q2**: A two-axis `mode x scope` collapse is unsafe. Use execution mode, feature flags, lifecycle intent, and executor/provenance. Deferred implementation: `060-command-taxonomy-and-compatibility-matrix`.
- **Q3**: The template tree cannot collapse to SPAR's two-template consumer model. A manifest can clarify source-layer ownership and optional asset sync. Deferred implementation: `063-template-inventory-and-manifest` and `069-template-compression-boundary`.
- **Q4**: SPAR personas translate to evaluation fixtures and audience maps. Tess, Max, and Maya map closest to internal priorities; Vera, Pete, and Cass are useful friction tests. Runtime persona injection is rejected.
- **Q5**: SPAR's ledger improves operator inventory but should not replace skill-advisor or MCP discovery. Deferred implementation: `062-tool-discovery-ledger` plus `066-tool-discovery-authority-boundary`.
- **Q6**: Npm installer distribution should not lead internal adoption. Runtime target manifests and ownership semantics are the transferable pieces. Deferred implementation: `064-runtime-target-manifest`.
- **Q7**: SPAR's Key vs Optional follow-up split should become Required To Proceed vs Optional Refinements in gate and planning copy. Deferred implementation: `058-gate-copy-and-question-budget`.
- **Q8**: No axis is missing evidence. Thin evidence is limited to follow-on prerequisites: `fs-enterprises` root validation, strict-validation corpus baseline, and diagnostic ledger ownership.

## 12. Open Questions Remaining

No charter-blocking questions remain.

Remaining implementation questions:

- Where is the real `fs-enterprises` instruction root, and does it share Public/Barter generated-block constraints?
- Which existing spec folders fail strict validation before template work starts?
- Should the diagnostic tool ledger be owned by `/doctor`, install/init, memory-backed status, or explicit refresh?

## 13. Negative Knowledge / Ruled-out Directions

- Do not replace internal `/spec_kit:*`, `/memory:*`, and `/create:*` surfaces with four SPAR commands.
- Do not treat SPAR's `tools.yaml` as an authoritative MCP registry.
- Do not impose a global 60-line cap on `AGENTS.md` or `.codex/AGENTS.md`.
- Do not inject Vera/Pete/Tess/Maya/Max/Cass into runtime execution prompts.
- Do not delete consumer-facing templates or required spec docs to mimic SPAR's two-template model.
- Do not lead with public npm installation for internal system-spec-kit.
- Do not mutate instruction files before an ownership manifest and generated-block policy exist.

## 14. Risks to Adoption

- **Sync triad**: Public and Barter instruction files were examined in iterations; `fs-enterprises` was not found. `061-*` must validate the full triad before any generated-block rollout.
- **Hook contracts**: Command taxonomy changes can break prompt-time skill-advisor briefs, Gate 3 classification, and command start conditions if suffix semantics are renamed casually.
- **Spec corpus migration**: Iterations counted hundreds of existing spec folders and `spec.md` files. Template or metadata migration needs strict-validation baselines and legacy handling.
- **Advisor scoring**: Local tool ledgers must not override skill-advisor confidence, uncertainty, lane attribution, or live/stale/absent/unavailable freshness states.
- **Authority drift**: Any diagnostic ledger or manifest can become stale if users treat it as source of truth. Every ledger should point to its authoritative live system.

## 15. Out of Scope For This Research

- Implementing any adoption candidate. Lands in packets `058-*` through `069-*`.
- Rewriting `external/`. It remains read-only reference content.
- Changing skill-advisor scoring. Authority boundaries land in `066-*`; scoring changes remain outside this packet.
- Touching production behavior of current commands. Copy/taxonomy work lands in follow-on packets.
- Running a full strict-validation baseline across the entire spec corpus. Required before `063-*` or `069-*`.
- Public packaging or npm distribution. Rejected for now; target manifest work lands in `064-*`.

## 16. Verification Hooks

Post-adoption packets should validate with targeted commands:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade --strict
```

```bash
rg ":auto|:confirm|:with-phases|:with-research|--intake-only|--dry-run|--skip-tests" .opencode/command .opencode/skill/system-spec-kit
```

```bash
rg "managed_block|seed_if_missing|replace_managed_children|replace" .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external .opencode/skill/system-spec-kit .opencode/command
```

```bash
rg "tools.yaml|skill-advisor|search_tools|list_tools|tool_info|tool-schemas" .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external .opencode/skill .opencode/command
```

```bash
find .opencode/specs -name spec.md | wc -l
```

For template packets, add a sampled strict-validation baseline before editing template contracts.

<!-- ANCHOR:research-citations -->
## 17. References

### External SPAR-Kit paths

- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/README.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/ROADMAP.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/technicalBrief.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/AGENTS.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/package.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/bin/spar-kit.mjs`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/cli.mjs`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/install-engine.mjs`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/pack-prep.mjs`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/AGENTS.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/CLAUDE.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/.spar-kit/.local/tools.yaml`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/default.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/opencode.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/claude.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-init/SKILL.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-act/SKILL.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-retain/SKILL.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/spec.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/templates/plan.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/specs/completed/tools-check/tools-check_spec.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.specify.recommendations.md`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.plan.recommendations.md`

### Internal system-spec-kit paths

- `AGENTS.md`
- `.codex/AGENTS.md`
- `CLAUDE.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- `.opencode/skill/system-spec-kit/templates/`
- `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/mcp-code-mode/SKILL.md`
- `.opencode/command/spec_kit/README.txt`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/implement.md`
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/resume.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- `.opencode/command/memory/README.txt`
- `.opencode/command/create/agent.md`
- `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`
- `.opencode/command/doctor/skill-advisor.md`
- `.opencode/agent/README.txt`
- `.opencode/agent/orchestrate.md`
- `.opencode/agent/improve-prompt.md`
- `.opencode/agent/ultra-think.md`
<!-- /ANCHOR:research-citations -->
