# Iteration 005 — Standalone Installation Assessment

**Focus:** Can Dual-Graph run alongside our existing system without conflicts?
**Status:** complete
**newInfoRatio:** 0.50
**Novelty:** Identified specific conflicts (CLAUDE.md override, port contention, workflow collision) that make standalone installation problematic.

---

## Findings

### 1. Compatibility Matrix

| Aspect | Conflict Level | Details |
|--------|---------------|---------|
| **CLAUDE.md** | HIGH | Dual-Graph auto-generates CLAUDE.md with its own workflow rules — would overwrite our 300+ line CLAUDE.md |
| **CODEX.md** | MEDIUM | Auto-generates CODEX.md — we have one but it's less critical |
| **MCP ports** | LOW | Uses 8080-8099 range — our MCP servers use stdio, not HTTP ports |
| **Project directory** | LOW | Creates `.dual-graph/` — won't conflict but adds cruft |
| **Python venv** | LOW | Creates `~/.dual-graph/venv` globally — isolated from our system |
| **Workflow mandate** | HIGH | Requires `graph_continue` FIRST — conflicts with our Gate system |
| **File exploration** | HIGH | Forbids `rg`, `grep` before `graph_continue` — breaks our Grep/Glob tools |
| **opencode.json** | MEDIUM | Would need manual MCP server addition — not auto-configured |

### 2. Critical Conflicts

**A. CLAUDE.md Override (BLOCKER)**
Dual-Graph's launcher auto-generates a CLAUDE.md with:
- Mandatory `graph_continue` first workflow
- Strict file-read caps
- Its own decision persistence rules
- Token counter integration

Our CLAUDE.md contains:
- 8-section behavioral framework
- Gate system (3 mandatory gates)
- Skill routing system
- Memory save protocols
- 300+ lines of carefully crafted rules

**These are fundamentally incompatible.** Installing Dual-Graph would destroy our CLAUDE.md.

**B. Workflow Collision (BLOCKER)**
Dual-Graph mandates: "Do NOT use `rg`, `grep`, or bash file exploration before calling `graph_continue`"
Our system mandates: Gate 1 triggers `memory_match_triggers()` first, then Gate 2 runs `skill_advisor.py`

These are **mutually exclusive** first-action requirements.

**C. MCP Server Coexistence (MANAGEABLE)**
Dual-Graph runs HTTP MCP, our servers run stdio. They could technically coexist:
- Our: `node context-server.js` (stdio transport)
- Theirs: HTTP on port 8080+

But adding their MCP to our `opencode.json` requires manual configuration.

### 3. Resource Costs

| Resource | Cost |
|----------|------|
| Disk (global) | ~50MB (`~/.dual-graph/` + venv) |
| Disk (project) | ~1-5MB (`.dual-graph/` + graph files) |
| Startup time | 5-15s (graph scan depends on project size) |
| Runtime memory | ~100-200MB (Python MCP server + graph in memory) |
| Network | Periodic version checks, heartbeat telemetry |

### 4. Vendor Lock-in Risks

| Risk | Severity |
|------|----------|
| Proprietary graperoot core | HIGH — cannot fork, audit, or self-maintain |
| Telemetry (identity.json) | MEDIUM — sends machine ID and platform |
| Auto-update mechanism | MEDIUM — downloads new versions automatically |
| Single maintainer | HIGH — appears to be a solo developer project |

### 5. Verdict: Standalone Installation NOT Recommended

Standalone installation of Dual-Graph would:
- Destroy our CLAUDE.md (HIGH impact)
- Create workflow conflicts with our Gate system (HIGH impact)
- Add a proprietary dependency with vendor lock-in (HIGH risk)
- Provide marginal benefit over our existing CocoIndex Code + Memory MCP (LOW value-add)

---

## Dead Ends
- Tried to find a "coexistence mode" in Dual-Graph docs — none exists
- Checked for CLAUDE.md merge capability — launcher always overwrites

## Sources
- [SOURCE: https://raw.githubusercontent.com/.../CLAUDE.md] — Dual-Graph's CLAUDE.md template
- [SOURCE: CLAUDE.md] — Our CLAUDE.md (300+ lines)
- [SOURCE: https://raw.githubusercontent.com/.../install.sh] — Installation process
- [SOURCE: https://raw.githubusercontent.com/.../bin/dual_graph_launch.sh] — MCP and CLAUDE.md generation
