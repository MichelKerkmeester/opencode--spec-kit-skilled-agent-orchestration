MCP issues detected. Run /mcp list for status.## GEMINI-ALPHA: Architecture Decision Quality Audit

### ADR-by-ADR Analysis

#### ADR-001: API-First Boundary Contract
1. **DECISION QUALITY**: Excellent. The decision correctly identifies tight coupling as a risk and establishes a clean API boundary to resolve it. The chosen approach balances long-term maintainability with migration reality.
2. **ALTERNATIVES HONESTY**: Fair. The alternatives (status quo direct imports vs. duplicate wrappers) represent the actual realistic failure modes of this kind of architecture. The framing does not feel like a strawman setup.
3. **FIVE CHECKS INTEGRITY**: Honest. The assessment of "No tech debt" explicitly acknowledges that the allowlist *is* temporary tech debt, but argues it is controlled via expiry criteria. This is a mature evaluation.
4. **CONSEQUENCES ACCURACY**: Accurate on stated costs (migration/enforcement). Unstated consequence: Future script development velocity may be slightly reduced when new internals are needed, as developers will now have to go through an explicit `api/*` promotion process.
5. **HIDDEN ASSUMPTIONS**: Assumes that the `api/*` layer will actually act as a thoughtful facade/contract, and won't just devolve into a mindless pass-through layer that perfectly mirrors internal `lib/*` changes.
6. **IMPLEMENTATION FIDELITY**: High. The implementation summary confirms the creation of `ARCHITECTURE_BOUNDARIES.md`, `mcp_server/api/README.md`, the allowlist, and the enforcement script.
7. **TEMPORAL VALIDITY**: High. This is a foundational boundary definition that will age well unless the repository is fundamentally restructured (e.g., splitting into completely disjointed repos).

#### ADR-002: Transitional Compatibility Wrappers
1. **DECISION QUALITY**: Strong and pragmatic. Acknowledges that abruptly removing operational runbooks breaks user workflows, establishing a "pointer" system to gracefully transition ownership.
2. **ALTERNATIVES HONESTY**: Good. "Remove wrappers now" (pure but dangerous) vs "Keep wrappers indefinitely" (easy but confusing) accurately bracket the chosen middle-path solution.
3. **FIVE CHECKS INTEGRITY**: Slightly self-serving on "No tech debt". The claim that "transitional wrappers have explicit deprecation criteria; no hidden cost" ignores the reality that transitional states often become permanent if not aggressively monitored. It *is* tech debt, just documented tech debt.
4. **CONSEQUENCES ACCURACY**: Mostly complete. Unstated consequence: Users may bookmark the transitional wrapper paths and continue to use them, causing friction when the actual removal finally happens. 
5. **HIDDEN ASSUMPTIONS**: Assumes the team has the discipline to actually execute the final removal of the wrappers once the deprecation period ends.
6. **IMPLEMENTATION FIDELITY**: High. The summary confirms the READMEs were updated to point to the canonical source in `scripts/memory/README.md`.
7. **TEMPORAL VALIDITY**: Short-term by design. This ADR is designed to be invalidated/completed once the transitional wrappers are deleted.

#### ADR-003: Duplicate Helper Consolidation
1. **DECISION QUALITY**: Solid. Standardizing duplicate token estimation and quality extraction logic prevents subtle, hard-to-debug drift across different contexts (scripts vs runtime).
2. **ALTERNATIVES HONESTY**: The "Runtime-only ownership adapters" alternative is slightly weak (an awkward dependency inversion), making the chosen shared module approach the obvious winner. However, it is a realistic bad choice developers sometimes make.
3. **FIVE CHECKS INTEGRITY**: Good. The inclusion of the Addendum showing an AI review caught a missing piece of context (the token estimator) proves the checks are being scrutinized. Acknowledging that parity tests are required to prevent regressions shows a good understanding of risk.
4. **CONSEQUENCES ACCURACY**: Accurate. Unstated consequence: The shared modules now become high-traffic chokepoints. Changes to these utilities must now be heavily scrutinized as they impact multiple, potentially disjointed subsystems.
5. **HIDDEN ASSUMPTIONS**: Assumes the consolidated logic is perfectly generic and won't require context-specific branching (e.g., different token estimation heuristics for different contexts) in the near future.
6. **IMPLEMENTATION FIDELITY**: High. `shared/utils/token-estimate.ts` and `shared/parsing/quality-extractors.ts` were successfully extracted and integrated.
7. **TEMPORAL VALIDITY**: High. This is a classic DRY architectural refactor that should stand the test of time.

#### ADR-004: Enforcement Script Hardening
1. **DECISION QUALITY**: Practical and reactive. Breaking the hardening into Immediate, Short-term, and Long-term tiers ensures immediate bleeding is stopped without blocking on a massive AST parser rewrite.
2. **ALTERNATIVES HONESTY**: Fair. "Immediate AST rewrite" is a massive scope expansion, and "Accept current limitations" leaves critical evasion vectors open. The tiered approach is the only viable path.
3. **FIVE CHECKS INTEGRITY**: Optimistic on Check 5 ("No tech debt"). Claiming the P2 AST upgrade is "planned, not deferred indefinitely" is a classic trap. A planned P2 that isn't implemented *is* tech debt. The check should have acknowledged this as accepted debt.
4. **CONSEQUENCES ACCURACY**: Clear on the coverage expansion (60% -> 85%). Unstated consequence: Regex-based line scanning will continually be a game of whack-a-mole against creative JavaScript syntax until the AST upgrade happens.
5. **HIDDEN ASSUMPTIONS**: Assumes the remaining ~15% of evasion vectors will not be actively exploited by developers trying to bypass the boundary contract.
6. **IMPLEMENTATION FIDELITY**: The implementation summary shows the Phase 4 remediation tasks (T021-T045) were closed, meaning this was implemented.
7. **TEMPORAL VALIDITY**: Low to Medium. This is a stopgap measure that should ideally be rendered obsolete by the P2 AST-based parsing upgrade.

### Missing ADRs
1. **Handler Circular Dependency Break**: The implementation summary explicitly notes: *"Handler cycle broken: causal-links-processor.ts no longer imports from memory-save.ts"* via the creation of `mcp_server/handlers/handler-utils.ts`. Resolving circular dependencies by introducing a new shared utility layer is a structural architectural change that should have had an accompanying ADR explaining the chosen dependency flow.
2. **SQL Safety / Escaping Policy**: The summary notes a P0 blocker (T039) where `escapeLikePattern` lacked backslash escaping. Given this is a database safety/injection concern, a small ADR establishing the architectural policy for safe query construction and escaping boundaries would have been appropriate.

### Cross-ADR Consistency
The ADRs are consistent in their goals (reducing coupling, increasing clarity) but lack explicit cross-referencing. **ADR-001** defines the boundary policy, and **ADR-004** defines the enforcement mechanism for that exact policy. They should explicitly reference each other to show the relationship between the contract and the governance mechanism.

### Findings by Severity

#### CRITICAL
- **ADR-004 Status Mismatch**: ADR-004 is marked as "Proposed" in `decision-record.md`, but the `implementation-summary.md` explicitly states that Phase 4 remediation waves (T021-T073) are closed and enforcement hardening was executed. The document state lags the implementation reality. ADR-004 must be updated to "Accepted" or "Implemented".

#### MAJOR
- **Missing ADR for Handler Cycle**: The creation of `handler-utils.ts` to break circular dependencies between core handlers is a significant structural shift that lacks architectural documentation. 

#### MINOR
- **Five Checks Optimism in ADR-004**: Stating that an un-executed P2 AST upgrade means there is "No tech debt" is an incorrect application of the check. It should be logged as accepted, temporary tech debt.
- **Lack of Linkage**: ADR-001 (Policy) and ADR-004 (Enforcement) should be hyperlinked to each other.

#### PASS
- ADR-001, ADR-002, and ADR-003 generally demonstrate high reasoning quality, fair evaluation of alternatives, and strict adherence to implementation parity.

### Overall Verdict
**PASS WITH CONCERNS**
Confidence: 95/100

*The architectural decisions themselves are highly pragmatic and well-reasoned. The concerns stem purely from documentation lifecycle hygiene (leaving ADR-004 in a Proposed state after implementation) and a few missing records for structural changes discovered during the execution phase.*
