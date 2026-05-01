# Focus

Deep dive Axis 2: instruction-file management. This pass compared SPAR's managed-block installer policy for `AGENTS.md` / `CLAUDE.md` against the internal hand-edited instruction files in Public and Barter, with special attention to the proposed 60-line cap and policy vocabulary.

# Actions Taken

1. Read the deep-research quick reference to confirm this single-iteration artifact contract.
2. Read SPAR's managed-block implementation in `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs`.
3. Read SPAR's instruction payloads and target configs:
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/AGENTS.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/CLAUDE.md`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json`
   - `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/claude.json`
4. Compared internal instruction-file shape:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/CLAUDE.md`
5. Searched for the named `fs-enterprises` instruction root. A targeted search under `/Users/michelkerkmeester/MEGA` did not find it; treat that as an unresolved source path, not as evidence that the repo does not exist.

# Findings

### F-004: Adapt SPAR's marker-bounded ownership model, not full-file replacement

SPAR's strongest Axis 2 pattern is a narrow ownership boundary. The installer extracts the payload block with `<!-- spar-kit:start -->` / `<!-- spar-kit:end -->`, writes the whole payload only when the target file is missing, prepends the managed block when an existing target lacks markers, and otherwise strips/replaces only SPAR-marked pairs while preserving host-owned content outside the pair. It also refuses to rewrite when malformed markers remain after stripping. [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs:17`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs:82`]

The internal files are not shaped like SPAR's tiny generated payload. Public `AGENTS.md` is a 383-line universal framework with hard gates, skill routing, memory rules, agent routing, MCP routing, and spec-folder documentation. Barter's `AGENTS.md` is 453 lines and adds repo-specific stack and git constraints. [SOURCE: `AGENTS.md:1`] [SOURCE: `AGENTS.md:182`] [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md:1`] [SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/AGENTS.md:75`]

Recommendation: adopt a `system-spec-kit` managed block for generated, cross-runtime routing copy only. Keep the surrounding `AGENTS.md` / `CLAUDE.md` text host-owned. This answers Q1's "smallest viable subset": marker pair, prepend-if-absent, replace-only-owned-block, malformed-marker fail-closed warning, and target manifest mapping.

### F-005: Reject the 60-line cap as a hard instruction-file rule; keep it as a generated-block budget

SPAR's shipped instruction payloads are 15 lines each. The cap works because SPAR uses those files as a compact boot pointer to `.spar-kit/.local/tools.yaml`, repo scripts, the four-phase workflow, and failure handling. [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/AGENTS.md:1`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/CLAUDE.md:1`]

Our instruction files carry much more governance load: Public and Barter both embed the full gate contract, code-search routing, completion verification, memory-save behavior, and skill routing. A literal 60-line full-file cap would either delete policy or push essential rules into less visible documents. That would be a regression for Codex/Claude startup behavior.

Recommendation: use "60 lines" as a soft budget for the managed block only. The policy language should be "generated block should stay short enough to scan; warn when the managed block exceeds 60 lines", not "AGENTS.md must be under 60 lines".

### F-006: Import SPAR's policy vocabulary into our installer/sync design

SPAR's target configs make instruction-file behavior explicit: `codex.json` maps `AGENTS.md` to `AGENTS.md` with `policy: "managed_block"`, while `claude.json` maps `CLAUDE.md` to `CLAUDE.md` with the same policy. Skills use `replace_managed_children`, and default assets use `replace` or `seed_if_missing`. [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/codex.json:1`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/targets/claude.json:1`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/lib/repo-bootstrap.mjs:158`]

That vocabulary maps well to our triad problem. A future sync tool could treat `AGENTS.md` / `CLAUDE.md` as host-owned files plus one generated managed block, `.codex/AGENTS.md` as a symlink or mirror contract, and skill/command folders as managed children. The policy vocabulary is safer than today's hand-edit mental model because the installer can explain exactly what it owns.

Recommendation: create a follow-on packet for an `instruction-sync-manifest` with four policies: `managed_block`, `seed_if_missing`, `replace`, and `replace_managed_children`. Do not start by rewriting existing instruction files.

# Questions Answered

- Q1 partial answer: The smallest viable subset is SPAR's managed-block boundary plus fail-closed malformed-marker handling, applied only to a compact generated block in `AGENTS.md` / `CLAUDE.md`. Do not adopt full-file replacement or a full-file 60-line cap.
- Axis 2 policy answer: SPAR's install policy vocabulary is directly portable as UX language for a future sync/installer design.

# Questions Remaining

- Resolve the real `fs-enterprises` instruction-file path before finalizing Q1. This iteration found Public and Barter but not `fs-enterprises` under the targeted MEGA search.
- Check whether `.codex/AGENTS.md` is always a symlink to Public `AGENTS.md` in the intended deployment model, and whether that should be represented as a policy in the manifest.
- Decide whether malformed-marker recovery should be purely warning-only, as SPAR does, or whether our stricter gate culture should require an explicit repair command.

# Next Focus

Axis 4 template architecture: compare SPAR's minimal `spec.md` / `plan.md` templates and asset policies against system-spec-kit's core/addendum/level template tree and `compose.sh`. Tie the pass back to F-006 by asking whether template composition can use the same manifest vocabulary as instruction-file sync.
