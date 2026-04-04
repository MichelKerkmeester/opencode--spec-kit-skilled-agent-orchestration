# Changelog: 041/005-package-runtime-alignment

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 005-package-runtime-alignment — 2026-04-03

Tightened template fidelity for the skill package and renamed the runtime mutator to match the evolving naming convention. The `.agents` mirror was resynchronized and verified by script-parse checks.

> Spec folder: `.opencode/specs/03--skilled-agent-orchestration/041-sk-recursive-agent-loop/005-sk-recursive-agent-package-runtime-alignment/`

---

## Changed (2)

### Stricter template fidelity

**Problem:** The skill package had minor gaps in sk-doc template conformance that slipped through earlier doc alignment.

**Fix:** Enforced stricter sk-doc template fidelity across the package, closing remaining formatting and structural gaps.

### Runtime mutator rename

**Problem:** The runtime mutator was still named `agent-improvement-loop`, which did not match the skill's naming convention.

**Fix:** Renamed the runtime mutator from `agent-improvement-loop` to `recursive-agent` and resynchronized the `.agents` mirror with script-parse verification.

---

<details>
<summary>Files Changed (3)</summary>

| File | What changed |
| --- | --- |
| `.opencode/agent/agent-improver.md` | Mutator name updated to match naming convention. |
| `.agents/agents/agent-improver.md` | Mirror resynchronized with canonical. |
| `sk-agent-improver/` | Template fidelity corrections across package surfaces. |

</details>

---

## Upgrade

No migration required.
