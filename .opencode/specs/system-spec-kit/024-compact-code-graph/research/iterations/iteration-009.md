# Iteration 009 — Risk Analysis: Dual-Graph Dependency & Alternatives

**Focus:** Risk analysis (vendor, security, stability, license)
**Status:** complete
**newInfoRatio:** 0.35
**Novelty:** Security review of install script reveals supply-chain concerns and telemetry that conflict with our privacy requirements.

---

## Findings

### 1. Risk Matrix

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| **Proprietary core abandoned** | HIGH | Medium | Total dependency failure | Build own graph layer |
| **Supply chain attack** | HIGH | Low | Code execution compromise | Don't use curl-pipe-bash install |
| **CLAUDE.md overwrite** | HIGH | Certain | Breaks our workflow system | Don't install standalone |
| **Telemetry/privacy** | MEDIUM | Certain | Machine ID + platform sent | Unacceptable for some orgs |
| **Auto-update mechanism** | MEDIUM | Medium | Breaking changes without notice | Pin version or disable |
| **License ambiguity** | MEDIUM | High | Can't audit graperoot | Build own, avoid dependency |
| **Port conflicts** | LOW | Low | MCP server collision | Configurable ports |
| **Disk usage** | LOW | Certain | ~50MB global + per-project | Manageable |

### 2. Security Concerns

**A. Install Script (curl-pipe-bash)**
```bash
curl -sSL https://raw.githubusercontent.com/kunal12203/Codex-CLI-Compact/main/install.sh | bash
```
- Downloads and executes arbitrary code from GitHub
- No checksum verification
- No signature validation
- Single point of compromise if repo is compromised

**B. Telemetry**
- Creates `identity.json` with machine ID
- Heartbeat telemetry sends: random install ID + platform
- "One-time optional feedback survey"
- No opt-out mechanism documented

**C. Auto-Update**
- Launcher scripts automatically check for and install new versions
- Downloads run silently (`>/dev/null 2>&1`)
- Could introduce malicious code via update mechanism

### 3. Project Health Assessment

| Metric | Value | Assessment |
|--------|-------|------------|
| Stars | 214 | Low for a critical dependency |
| Forks | 27 | Very low community engagement |
| Contributors | Appears to be 1 primary | Single point of failure |
| Commits | 371 | Active development |
| Issues | Unknown | Need to check |
| License clarity | Apache 2.0 (launchers), Unknown (graperoot) | Risky |

### 4. Vendor Lock-in Analysis

**Lock-in severity: HIGH**
- Core engine (graperoot) is the ONLY proprietary component
- No alternative implementations available
- If author stops maintaining → entire system breaks
- Can't fork → can't self-maintain
- Can't audit → can't verify security
- Can't modify → can't adapt to our needs

### 5. Comparison with Our System's Risk Profile

| Aspect | Dual-Graph | Our Spec Kit Memory |
|--------|-----------|---------------------|
| Core engine | Proprietary (graperoot) | Open source (our code) |
| Dependencies | PyPI + npm | npm (well-audited) |
| Install method | curl-pipe-bash | git clone + npm install |
| Telemetry | Machine ID + heartbeat | None |
| Auto-update | Yes (silent) | No (manual git pull) |
| License | Mixed (Apache + proprietary) | N/A (our own code) |
| Maintainers | ~1 | Our team |
| Audit capability | Partial (launchers only) | Full |

### 6. Verdict: Risk Level UNACCEPTABLE for Production Use

The combination of:
- Proprietary core with no audit capability
- Supply chain risk from curl-pipe-bash install
- Telemetry with no opt-out
- Single-maintainer project with low community
- License ambiguity for core engine

Makes Dual-Graph **unsuitable as a dependency** for our system. Building our own code graph layer eliminates all of these risks.

---

## Dead Ends
- Tried to find graperoot on PyPI for license info — no clear license
- Checked for privacy policy on the project — none found

## Sources
- [SOURCE: https://raw.githubusercontent.com/.../install.sh] — Install script analysis
- [SOURCE: https://github.com/kunal12203/Codex-CLI-Compact] — Repo metrics
- [SOURCE: https://raw.githubusercontent.com/.../bin/dual_graph_launch.sh] — Auto-update + telemetry
