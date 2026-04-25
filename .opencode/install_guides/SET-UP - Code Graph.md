# SET-UP - Code Graph

User-facing diagnostic guide for `/doctor:code-graph` (Phase A — diagnostic-only). Audit the code-graph index for stale + missed files and bloat directories without modifying any source files. Phase B (apply mode) is gated on the resilience-research packet 007.

> **Part of OpenCode Installation.** See the [Master Installation Guide](./README.md) for complete setup.
> **Command:** `/doctor:code-graph` (auto + confirm modes) — full reference in `.opencode/command/doctor/code-graph.md`.
> **Phase:** A (read-only). Phase B (apply mode) coming after research packet 007 stabilizes.

---

## 0. AI-FIRST PROMPT

Paste this into your AI client to run a guided code-graph health diagnostic:

```text
Run the code-graph diagnostic command to audit my code-graph index health.

PREREQUISITE CHECK (verify before proceeding):
- [ ] system-spec-kit MCP server is built (dist/ exists)
- [ ] code_graph_status MCP tool is in your tool list
- [ ] Repo has source files indexed (run code_graph_scan once if not)

If any prerequisite fails: STOP and report which one. Do NOT proceed.

Steps:
1. Invoke /doctor:code-graph:auto (or :confirm for the proposal gate review).
2. At setup: scope=A (all) for first run; B/C/D to focus on stale/missed/bloat only.
3. Walk through Phase 0 (Discovery) → Phase 1 (Analysis) → Phase 2 (Proposal report).
4. Read the report at <packet_scratch>/code-graph-diagnostic-<timestamp>.md.
5. Decide manually whether to act on the recommendations (Phase A is read-only).

Phase A invariant: zero mutations to source files. Only the report is written.
```

**Expected duration:** 1–2 minutes for repos with <10k files.

---

## 1. PREREQUISITES

| Requirement | Check |
| --- | --- |
| MCP server is built | `ls .opencode/skill/system-spec-kit/mcp_server/dist/` shows JS |
| `code_graph_status` available | Tool appears in your AI client's tool list |
| Index has been populated at least once | `code_graph_status({})` shows non-zero indexed_count |

**Build first if needed:**
```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server install
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

**Initial scan if index is empty:**
```bash
# In your AI client:
code_graph_scan({})
```

---

## 2. RUN

| Use case | Command |
| --- | --- |
| First diagnostic | `/doctor:code-graph:auto` |
| Review before report | `/doctor:code-graph:confirm` (pauses at proposal gate) |
| Stale files only | `/doctor:code-graph:auto --scope=stale` |
| Missed files only | `/doctor:code-graph:auto --scope=missed` |
| Bloat dirs only | `/doctor:code-graph:auto --scope=bloat` |

**The three phases:**

```
Phase 0 Discovery  → Phase 1 Analysis  → Phase 2 Proposal-as-report
```

No Phase 3 / Phase 4 in Phase A. Phase B will add mutation + verification once research packet 007 produces the verification battery.

---

## 3. WHAT IT TOUCHES

**Mutates only:** the diagnostic report at `<packet_scratch>/code-graph-diagnostic-<timestamp>.md`.

**Never touches:**
- Any source file in the workspace
- Any code under `.opencode/skill/system-spec-kit/mcp_server/`
- The code-graph SQLite database
- Any scanner config

After running, `git status` should show no diffs outside the packet scratch path.

---

## 4. UNDERSTANDING THE REPORT

The diagnostic report has four sections:

| Section | Content |
| --- | --- |
| Discovery | indexed_count, file_count, lang_histogram, last_scan_at |
| Analysis | stale_set, missed_set, bloat_set, overlap_set |
| Proposed Recommendations | exclude-rule + language-filter recommendations with confidence tiers |
| Limitations | gaps in detection (what the diagnostic could not verify) |

### Confidence tiers

| Tier | Meaning | Action |
| --- | --- | --- |
| High | Standard pattern that should always be excluded (`node_modules/`, `.git/`, `__pycache__/`) | Apply when ready |
| Medium | Common build-output pattern that usually benefits from exclusion (`dist/`, `build/`) | Review per-repo |
| Low | Custom-named pattern detected via heuristics | Manual decision required |

(Authoritative tier definitions land in research packet 007's `assets/exclude-rule-confidence.json` once that loop completes.)

---

## 5. ACTING ON THE REPORT

Phase A is diagnostic-only; you decide whether to apply changes manually. To apply an exclude rule today:

1. Read the report and pick recommendations you trust.
2. Edit the scanner config (location depends on your code-graph version).
3. Run `code_graph_scan({})` to re-index with new rules.
4. Run `/doctor:code-graph:auto` again to confirm the exclude took effect.

When Phase B ships, this entire flow (apply → verify → rollback if regressed) will run automatically inside the command.

---

## 6. TROUBLESHOOTING

| Problem | Fix |
| --- | --- |
| `"empty repo"` | No source files found; the diagnostic exits cleanly with STATUS=OK |
| `"code_graph_status unavailable"` | Falls back to filesystem-only diagnosis with a warning in the report |
| `"detect_changes unavailable"` | Falls back to git status + index timestamp comparison |
| Report path missing on completion | Check packet scratch directory exists; check disk space |
| Bloat detection over-flags `dist/` | Expected for medium-tier patterns; review per-repo |
| Command not found | Verify `.opencode/command/doctor/code-graph.md` exists; restart your AI client |

---

## 7. RESOURCES

- **Command reference:** `.opencode/command/doctor/code-graph.md`
- **Workflow YAML:** `.opencode/command/doctor/assets/doctor_code-graph_{auto,confirm}.yaml`
- **Spec packet:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/`
- **Research packet (gates Phase B):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/`
- **Sibling doctor commands:** `/doctor:mcp_install`, `/doctor:mcp_debug`, `/doctor:skill-advisor`
- **Related guides:** [SET-UP - Skill Advisor](./SET-UP%20-%20Skill%20Advisor.md) (sibling 5-phase doctor command pattern)
