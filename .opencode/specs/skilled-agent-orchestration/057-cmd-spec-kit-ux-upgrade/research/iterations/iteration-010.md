# Focus

Final synthesis prep: ensure all 6 axes have at least one finding, all findings are tagged, cited, and assigned a follow-on packet. Flag any thin-evidence axis before synthesis.

# Actions Taken

1. Read the active strategy, registry, state-log tail, and iterations 7-9. The reducer-owned registry is still empty, so the ranked backlog in iteration narratives remains the working source of truth.
2. Re-checked the ranked findings against direct SPAR evidence: `external/README.md`, `external/install-root/targets/{default,codex}.json`, `external/lib/repo-bootstrap.mjs`, `external/install-root/.spar-kit/.local/tools.yaml`, `external/install-root/skills/spar-{specify,plan,act,retain}/SKILL.md`, `external/templates/{spec,plan}.md`, and `external/Research/Personas/Personas.md`.
3. Re-checked the internal comparison surfaces: `AGENTS.md`, `.codex/AGENTS.md`, `.opencode/command/spec_kit/README.txt`, `.opencode/command/spec_kit/{plan,implement}.md`, `.opencode/skill/system-spec-kit/templates/`, `.opencode/skill/system-spec-kit/scripts/templates/compose.sh`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, `.opencode/skill/mcp-code-mode/SKILL.md`, and `.opencode/agent/*.md`.
4. Performed the final axis-coverage pass. All six axes now have evidence-backed findings with verdict tags and follow-on packets. The only thin evidence is narrow: full instruction-triad validation still lacks a visible `fs-enterprises` instruction root.

# Findings

| Rank | Axis | Finding | Verdict | Follow-on | Evidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Personas/tone + intake | Adopt SPAR's blocker-vs-refinement question budget as `Required To Proceed` vs `Optional Refinements`. | `adapt` | `058-gate-copy-and-question-budget` | SPAR Plan splits material follow-ups from optional follow-ups in `external/install-root/skills/spar-plan/SKILL.md`; internal `AGENTS.md` already requires consolidated questions and command YAML already caps clarification to high-impact items. |
| 2 | Command/skill granularity | Add SPAR-style phase-boundary copy above the internal command set. | `adapt` | `059-phase-boundary-copy-pass` | SPAR's README and four phase skills make Specify, Plan, Act, Retain legible; `.opencode/command/spec_kit/README.txt` has stronger workflow machinery but weaker first-glance phase framing. |
| 3 | Command/skill granularity | Use a four-axis command taxonomy, not a two-axis mode-by-scope collapse. | `adapt` | `060-command-taxonomy-and-compatibility-matrix` | SPAR has a compact lifecycle; internal command docs encode execution mode, feature flags, lifecycle intent, and executor/provenance separately. |
| 4 | Instruction files + installer | Build a declarative ownership manifest using SPAR's policy vocabulary, but start with inventory and lint. | `adapt` | `061-declarative-ownership-manifest` | SPAR targets use `replace`, `seed_if_missing`, `managed_block`, and `replace_managed_children`; internal `AGENTS.md`, `.codex/AGENTS.md`, commands, templates, and agents lack one ownership ledger. |
| 5 | Tool-discovery UX | Add an operator-visible tool ledger as diagnostic inventory. | `adapt` | `062-tool-discovery-ledger` | SPAR seeds `.spar-kit/.local/tools.yaml` with CLI checks and stale status; internal skill-advisor hooks and MCP discovery are live routing surfaces without one local inventory view. |
| 6 | Template architecture | Classify templates by source input, generated output, validation-critical artifact, example, and optional asset. | `adapt-narrowly` | `063-template-inventory-and-manifest` | SPAR's `templates/spec.md` and `templates/plan.md` are small; internal CORE + ADDENDUM composition and strict validation require richer consumer artifacts. |
| 7 | Installer + runtime targets | Prototype runtime target manifests after ownership semantics are explicit. | `adapt` | `064-runtime-target-manifest` | SPAR target JSON maps payloads to runtime paths; internal `.opencode`, `.codex`, `.claude`, `.gemini`, hook, plugin, and MCP behavior makes placement dependent on ownership contracts. |
| 8 | Personas/tone | Use SPAR personas as evaluation fixtures and audience maps, not runtime identities. | `adapt` | `065-persona-evaluation-fixtures` | SPAR has six personas in `external/Research/Personas/Personas.md`; internal `.codex/AGENTS.md` and `.opencode/agent/*.md` are voice and role-contract based. |
| 9 | Tool-discovery UX | Reject static `tools.yaml` as routing authority while preserving its inventory UX. | `reject-with-rationale` plus `take-inspiration` | `066-tool-discovery-authority-boundary` | SPAR's ledger fits a small CLI prerequisite list; internal tool truth is dynamic across Skill Advisor hooks, MCP schemas, Code Mode discovery, and runtime tool exposure. |
| 10 | Instruction files | Reject hard global instruction-file line caps; adapt only generated-block budgets. | `reject-with-rationale` plus `adapt-narrowly` | `067-generated-block-budget` | SPAR's installed instruction files are tiny boot pointers; internal instruction files carry hard gates, memory rules, validation, routing, and runtime precedence. |
| 11 | Personas/tone | Reject named personas inside runtime prompts. | `reject-with-rationale` | `068-runtime-persona-boundary` | SPAR personas are useful design inputs; internal runtime behavior depends on calibrated senior-engineer voice plus explicit agent role contracts. |
| 12 | Template architecture | Reject SPAR's two-template consumer architecture; keep source-layer compression only. | `reject-with-rationale` plus `adapt-narrowly` | `069-template-compression-boundary` | SPAR can run with spec and plan templates; internal validators, phase-parent detection, graph metadata, continuity, and completion gates require more artifacts. |

Axis coverage is complete:

- Axis 1 installer: findings 4, 7.
- Axis 2 instruction files: findings 4, 10.
- Axis 3 command/skill granularity: findings 2, 3.
- Axis 4 template architecture: findings 6, 12.
- Axis 5 tool-discovery UX: findings 5, 9.
- Axis 6 personas/tone: findings 1, 8, 11.

Thin evidence:

- The `fs-enterprises` instruction root is still not visible from this workspace. Q1 is answered enough for adoption direction, but `061-declarative-ownership-manifest` should treat full Public + Barter + fs-enterprises validation as a prerequisite.
- Corpus migration risk is understood at the contract level, but `063-*` and `069-*` still need a strict-validation baseline before changing template architecture.
- Diagnostic tool-ledger ownership remains a design decision for `062-*`: likely `/doctor` or explicit refresh, not prompt-time routing.

# Questions Answered

- Q1: Answered with a constraint. The viable subset is ownership manifest + lint + generated-block budgets. Do not let an installer own full instruction files. Full triad validation waits on the missing `fs-enterprises` root.
- Q2: Answered. A two-axis mode x scope matrix would obscure real command contracts. Use execution mode, feature flags, lifecycle intent, and executor/provenance.
- Q3: Answered. A manifest can compress source-layer ownership, but the consumer artifact set cannot collapse to SPAR's two-template model.
- Q4: Answered. SPAR personas translate cleanly to evaluation fixtures and audience maps; they clash when used as runtime identities.
- Q5: Answered. SPAR's local ledger improves discoverability only as diagnostic inventory, not routing authority.
- Q6: Answered. The npm installer pattern is not worth leading with internally; target manifests and ownership semantics are the transferable pieces.
- Q7: Answered. The Key vs Optional split should become Required To Proceed vs Optional Refinements in gate and planning copy.
- Q8: Answered. No axis is missing evidence; thin evidence is confined to follow-on prerequisites, not the research conclusion.

# Questions Remaining

No charter-blocking questions remain.

Follow-on prerequisites:

- Locate and validate the real `fs-enterprises` instruction root before implementing `061-*`.
- Run strict-validation baseline sampling before `063-*` or `069-*`.
- Decide whether the diagnostic tool ledger is owned by `/doctor`, install/init, memory-backed status, or an explicit refresh command.

# Next Focus

Proceed to final synthesis for packet 057. Preserve the ranked backlog `058-*` through `069-*`, carry forward the three prerequisites above, and keep the adoption boundary clear: SPAR contributes lifecycle UX, ownership vocabulary, and diagnostic inventory patterns; system-spec-kit keeps its stronger runtime, validation, and memory contracts.
