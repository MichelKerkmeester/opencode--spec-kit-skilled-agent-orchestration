# Changelog: 041/006-command-rename

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 006-command-rename — 2026-04-04

Renamed the command entrypoint to `/spec_kit:recursive-agent` (later renamed again in Phase 008 to `/improve:agent`). Updated canonical command markdown, YAML workflow assets, wrapper TOMLs, and runtime docs to the new command path.

> Spec folder: `.opencode/specs/03--skilled-agent-orchestration/041-sk-recursive-agent-loop/006-sk-recursive-agent-command-rename/`

---

## Changed (1)

### Command entrypoint renamed

**Problem:** The command path did not follow the emerging convention for skill-specific namespaces.

**Fix:** Renamed the command entrypoint to `/spec_kit:recursive-agent`, updating canonical markdown, YAML workflow assets, wrapper TOMLs, and runtime documentation to the new path.

---

<details>
<summary>Files Changed (4)</summary>

| File | What changed |
| --- | --- |
| `.opencode/command/spec_kit/recursive-agent.md` | Canonical command markdown moved to new path. |
| `.opencode/command/spec_kit/assets/*.yaml` | YAML workflows renamed to match new command. |
| `.codex/agents/*.toml` | Wrapper TOMLs updated with new command reference. |
| Packet docs | Runtime docs and history updated to new command path. |

</details>

---

## Upgrade

No migration required. This rename was superseded by Phase 008's rename to `/improve:agent`.
