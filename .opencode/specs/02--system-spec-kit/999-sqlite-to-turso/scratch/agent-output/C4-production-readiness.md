# C4: Turso Production Readiness

**Agent:** general-purpose | **Duration:** ~225s | **Tokens:** 63,447

## Key Findings

- **THREE distinct products:** Turso Database (Rust, beta), libSQL (C fork, production), Turso Cloud (GA SaaS)
- Latest: v0.4.0 (Jan 2026 stable), v0.5.0 (Mar 2026 dev). First alpha Jul 2025, beta Dec 2025
- **No production users of the Rust rewrite** — even Turso Cloud still runs on libSQL
- Known corruption bugs: ptrmap (PR #3894, $800 bounty), async IO ordering (#772), MVCC version chain (#4877)
- $1,000 bug bounty for data corruption bugs
- January 2025 data loss incident on Turso Cloud (EBS volume deletion during AWS migration)
- MVCC is explicitly "experimental" — the word is in the pragma name itself
- **No 1.0 roadmap or timeline published**
- Server going closed-source; client remains open
- 418 open issues on GitHub
- 17.7K GitHub stars, 22 employees
- libSQL: 16.4K stars, 55 releases, 32.5K commits — significantly more mature
