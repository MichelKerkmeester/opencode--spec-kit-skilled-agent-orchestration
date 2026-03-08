MCP issues detected. Run /mcp list for status.## GEMINI-EPSILON: Cross-Spec Risk & Dependency Analysis

### Risk Inventory (Combined)
| Risk ID | Source | Description | Impact | Likelihood | Mitigation | Effective? |
|---------|--------|-------------|--------|------------|------------|------------|
| R-001 | 029 | Boundary policy not enforced in code checks | High | Low (after 030) | Add explicit check (029) + CI/pre-commit (030) | Yes, if CI is mandated |
| R-002 | 029 | Duplicate helper consolidation changes behavior | Medium | Medium | Parity tests | Yes, with good coverage |
| R-003 | 029 | Cycle break in handlers introduces regressions | High | Medium | Verify call order paths | Moderate |
| R-004 | 029 | Refactor scope expansion | Medium | Medium | Docs/policy first, code second | Yes |
| R-005 | 030 | Moving constants to shared/ breaks script dist builds | Medium | Low | Test scripts/ build | Yes |
| R-006 | 030 | `reindex-embeddings.ts` needs deep internals | Medium | High | Keep wildcard entry if legitimate | Moderate (creates tech debt) |
| R-007 | 030 | Pre-commit hook slows developer workflow | Low | Medium | Keep check fast (< 5s) | Moderate (devs may bypass) |

### Undocumented Risks
- **Time-Bomb Build Breakage**: If the enforcement script actively evaluates the `expiresAt` fields (e.g., 2026-06-04), all CI/CD pipelines and local pre-commit hooks will instantly fail on that date, halting development work across the team.
- **Pre-commit Bypass Culture**: If the enforcement checks added in 030 are even slightly flaky or slow, developers will use `git commit --no-verify`, rendering the local enforcement useless.
- **API Surface Bloat**: 030 proposes expanding `api/` to include `checkpoints` and `access-tracker` to satisfy `reindex-embeddings.ts`. This risks turning the `api/` boundary into a dumping ground for internal concerns, defeating the encapsulation goals of 029.
- **False Positive Evasion**: Evasion vectors (e.g., dynamic imports, alias paths) might still exist if Phase 4 of 012 didn't cover all AST edge cases, leading to silent enforcement failures.

### Dependency Chain Map
**[012 Phase 1: Boundary Contract]** → **[012 Phase 3: Enforcement Script (`npm run check`)]** → **[012 Phase 4: Evasion Fixes]** → *(012 COMPLETION)* → **[013 Phase 1: Move `DB_UPDATED_FILE` & Fix Indexer]** → **[013 Phase 2: Audit `reindex-embeddings` & Expand API]** → **[013 Phase 3: Add Automation]** → *(013 COMPLETION)*

*Critical Dependency:* 013 Phase 3 strictly depends on the performance and accuracy of 012's enforcement script. If the script is slow or inaccurate, 030 fails NFR-P01 (<5s) and blocks developer velocity.

### Cross-Spec Risk Interactions
- **029 Enforcement vs 030 Automation**: 029 built an enforcement script that runs manually. 030 will run it automatically on every commit. If 029's script isn't heavily optimized, 030 will cause severe developer friction.
- **029 Encapsulation vs 030 API Expansion**: 029 sought to hide runtime internals from scripts. 030 wants to expose `checkpoints` and `access-tracker` through `api/` just to remove a wildcard from `reindex-embeddings.ts`. This interaction directly conflicts, risking architectural purity for the sake of an empty allowlist.

### Allowlist Governance Assessment
- **Sustainability**: Poor. The current allowlist has hardcoded `expiresAt` dates (2026-06-04 and 2026-09-04) but no automated mechanism for review or extension. 
- **Expiry Behavior**: If the validation script strictly enforces `expiresAt`, the codebase has a ticking time bomb. If it doesn't enforce it, the dates are purely cosmetic and will rot.
- **Sunset Realism**: A 90-day sunset (June 4th) for deep internal coupling like `reindex-embeddings.ts` is highly optimistic given the complexity of decoupling vector-index and hybrid-search.

### Enforcement Gap Analysis
- **Current State**: Manual `npm run check`. Probability of developers skipping this locally is >80%.
- **Needed State**: CI/CD pipeline gate (GitHub Actions/GitLab CI) + optional fast pre-commit hook.
- **Blast Radius**: If enforcement fails silently or is bypassed via `--no-verify`, developers will slowly reintroduce `mcp_server/lib/*` imports, invalidating the entire 012 spec and requiring another costly architecture audit in the future.

### Findings by Severity
#### CRITICAL
- **Hardcoded Expiry Time-Bomb**: The `expiresAt` dates in `import-policy-allowlist.json` threaten to instantly break all CI/CD pipelines on 2026-06-04 without a graceful warning period.
- **Lack of CI Pipeline Mandate**: 030 mentions adding a pre-commit hook *or* CI config. A pre-commit hook alone is insufficient due to bypassability. CI enforcement is a non-negotiable blocker for maintaining 029's integrity.

#### MAJOR
- **API Surface Bloat**: Expanding `api/search.ts` to expose deep internals just to satisfy `reindex-embeddings.ts` in 030 contradicts the encapsulation goals of 029.
- **Documentation Rot**: `ARCHITECTURE_BOUNDARIES.md` contains a hardcoded list of exceptions that will diverge from `import-policy-allowlist.json` the moment an entry is updated or expires.

#### MINOR
- Pre-commit hook performance might exceed the 5-second NFR if AST parsing (029 P2) is fully implemented.

#### PASS
- Structural cleanup, duplicate helper consolidation, and dependency direction rules are conceptually sound, well-designed, and effectively compartmentalize the domains.

### Risk Mitigation Recommendations
1. **Mandate CI Enforcement**: Do not rely on pre-commit hooks alone. Enforce `npm run check` in the primary CI pipeline as a required status check.
2. **Implement Expiry Warnings, Not Errors**: Modify `check-no-mcp-lib-imports.ts` to emit warnings (exit 0) when an allowlist entry is within 14 days of expiry, and only fail (exit 1) if it is >7 days past expiry.
3. **Automate Doc Sync**: Remove the hardcoded exception table from `ARCHITECTURE_BOUNDARIES.md` and replace it with a script that injects that section directly from `import-policy-allowlist.json` during the build/check phase.
4. **Reject API Bloat**: Do not expand `api/` for `reindex-embeddings.ts`. Leave the wildcard allowlist entry intact. It is better to have one explicitly documented architectural exception than to pollute the public API boundary with internal maintenance endpoints.

### Overall Verdict
**MODERATE RISK**
Confidence: 92/100

The risk is moderate because while the architectural intent is excellent, the operationalization (manual checks, hardcoded expiry dates, and potential API bloat) introduces significant process and workflow vulnerabilities.
