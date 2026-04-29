# Audit Findings: Evergreen Doc Packet ID Removal

## Scope

Audit scope used the recent evergreen-doc history query from the operator directive, the last-14-commit variant for focused packet-era coverage, and the requested system-spec-kit evergreen self-check glob.

Spec-local docs outside this packet were excluded.

## Summary

| Status | Count | Notes |
|---|---:|---|
| PASS | 70+ | Candidate files with no real packet-history references |
| VIOLATION_FIXED | 40+ | High-confidence packet/phase history references rewritten |
| VIOLATION_DEFERRED | 2 groups | Legacy generated catalog/playbook historical labels and stable ID false positives |

## VIOLATION_FIXED

| File | Finding | Fix |
|---|---|---|
| `.opencode/skill/sk-doc/sk-doc skill` | No evergreen packet-ID rule | Added rule reference to doc-quality routing |
| `.opencode/skill/sk-doc/references/global/evergreen packet ID rule` | Missing canonical rule | Created rule with classes, examples, grep, and migration guidance |
| `.opencode/skill/sk-doc/references/global/quick_reference.md` | No quick audit command | Added evergreen packet-ID grep |
| `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | README template lacked evergreen instruction | Added no-packet-history authoring guidance |
| `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Install guide template lacked evergreen instruction | Added reference guidance |
| `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` | Catalog template allowed historical phrasing | Added packet-history-free catalog rule |
| `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` | Playbook template lacked packet-history rule | Added scenario-ID distinction and no packet-history note |
| `.opencode/skill/system-spec-kit/ARCHITECTURE` | Phase/package labels in runtime architecture | Reworded to current subsystem descriptions |
| `.opencode/skill/system-spec-kit/README` | Packet/phase release labels in current README | Reworded to current runtime contracts |
| `.opencode/skill/system-spec-kit/mcp_server/README` | Packet-history freshness and footer references | Replaced with current code-graph contracts |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE` | Phase-numbered smoke-test section | Reworded as current smoke tests |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE` | Historical P1 labels and phase wording | Reworded as graduated or opt-in current flags |
| `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/README` | Packet-numbered matrix provenance | Reworded as current matrix runner contract |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md` | "packet 033 catalog refresh" | Removed history, kept current tool count |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` | Packet 035/036 provenance | Reworded as local-runner and external-adapter surfaces |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/01-category-overview.md` | Spec/phase provenance | Reworded as current code-graph runtime surface |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Packet and phase provenance | Reworded as current readiness contract |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/**/* markdown` | Packet 012/013/035 classification prose | Reworded as current automation/readiness classifications |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/**/* markdown` | Phase 027 and packet 034 labels | Reworded as current native advisor and explicit rebuild contract |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/278-memory-retention-sweep-basic-flow.md` | Packet 033 references | Reworded as current retention sweep scenario |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-advisor-status-rebuild-separation.md` | Packet 034 references | Reworded as current status/rebuild contract |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` | Packet 036 references | Reworded as current matrix runner smoke |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/281-code-graph-read-path-selective-self-heal.md` | Packet 032 references | Reworded as current read-path/manual contract |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/282-code-graph-cell-coverage-evidence.md` | Packet 035 evidence wording | Reworded as stored matrix evidence |
| `.opencode/skill/cli-opencode/**/* markdown` | Example "packet 047" prompts | Replaced with "approved spec folder" examples |
| `.opencode/skill/cli-copilot/sk-doc skill` | Phase convention label | Reworded as repo convention |

## PASS

The following recent evergreen candidate classes had no high-confidence packet-history violations after fixes:

- `AGENTS`
- `CLAUDE`
- Recently touched `cli-claude-code`, `cli-codex`, `cli-gemini`, and most `cli-opencode` evergreen files after example rewrites.
- Newly added sk-doc rule and template files.
- Code-graph package README and per-feature catalog entries after classification wording fixes.

## VIOLATION_DEFERRED

| Group | Why Deferred | Follow-up |
|---|---|---|
| Generated root `feature catalog root` and `manual testing playbook root` legacy sections | These contain older generated feature histories, scenario titles, and remediation labels. Top audit/history blocks and current touched references were reduced, but full generated-corpus cleanup would rewrite thousands of stable entries and should be done by a dedicated catalog regeneration pass. | Regenerate catalogs from packet-history-free per-feature sources, then rerun the evergreen grep. |
| Stable feature/playbook IDs | The broad grep intentionally matches `001-feature-name`, `01--category`, `NC-006`, `P1-5`, and similar current artifact IDs. These are not spec or phase packet references when they identify a live scenario, feature, or file path. | Keep as documented exceptions unless a future naming migration changes catalog/playbook ID conventions. |

## Self-Check Result

The requested broad grep is not semantically empty because it matches stable current artifact IDs and legacy generated catalog/playbook labels. High-confidence recent packet-history prose was fixed. Remaining hits are documented above as deferred or stable-ID exceptions.
