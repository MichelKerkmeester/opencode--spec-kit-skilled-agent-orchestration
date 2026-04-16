# Q-E — License + Runtime Feasibility

> Iteration 6 of master consolidation. Cross-phase synthesis #3 of 6.

## TL;DR
- `001 Settings` stays `concept-transfer-only`: it is a Reddit field report, not a licensed source tree to fork. [SOURCE: phase-1/decision-record.md:36-43] [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:15-24]
- `002 CodeSight` is `mixed`: the Node runtime fits Public cleanly, but this checkout has no `002-codesight/external/LICENSE`, so direct source lift stays gated even though `package.json` says MIT. [SOURCE: 002-codesight/external/package.json:1-50] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package.json:11-13]
- `003 Contextador` is `concept-transfer-only`: AGPL-3.0-or-later plus Bun-only execution blocks direct reuse in Public's stack. [SOURCE: 003-contextador/external/LICENSE:1-26] [SOURCE: 003-contextador/external/package.json:6-53]
- `004 Graphify` is `mixed`: Python 3.10+ and hook/MCP patterns are technically portable, but this checkout has no `004-graphify/external/LICENSE`, so direct copy/fork remains gated despite MIT metadata in `pyproject.toml`. [SOURCE: 004-graphify/external/pyproject.toml:5-45] [SOURCE: 004-graphify/external/README.md:30-38]
- `005 Claudest` is `mixed`: the Python runtime partially aligns with Public, but the checkout has no `005-claudest/external/LICENSE` and the repo assumes Claude's plugin host. [SOURCE: 005-claudest/external/pyproject.toml:1-10] [SOURCE: 005-claudest/external/README.md:15-29] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:11-22]
- System count: `source-portable = 0`, `concept-transfer-only = 2`, `mixed = 3`. Across the 28 Q-C candidates scored below, none are fully `source-portable` under the evidence available in this checkout.

## System-level gating table

| System | License | Runtime | Public has runtime? | Verdict | Rationale |
|---|---|---|---|---|---|
| 001 Claude Optimization Settings | `n/a` | `n/a` | `n/a` | `concept-transfer-only` | Research artifact only; there is no source package or license grant to port. [SOURCE: phase-1/decision-record.md:36-43] |
| 002 CodeSight | `unclear` | `Node >=18` CLI/MCP projection | `yes` | `mixed` | Runtime fits Public's Node stack, but the checked-in repo snapshot lacks a `LICENSE` file, so direct code copy is still gated. [SOURCE: 002-codesight/external/package.json:1-50] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package.json:11-13] |
| 003 Contextador | `AGPL-3.0-or-later` | `Bun >=1.0` CLI + MCP | `partial` | `concept-transfer-only` | AGPL is a hard legal gate for direct reuse, and Public does not already run Bun as a first-class runtime. [SOURCE: 003-contextador/external/LICENSE:1-26] [SOURCE: 003-contextador/external/package.json:27-53] |
| 004 Graphify | `unclear` | `Python >=3.10` CLI/skill/MCP | `partial` | `mixed` | Public already tolerates Python via CocoIndex, but the checkout lacks a `LICENSE` file, so direct source lift remains gated. [SOURCE: 004-graphify/external/pyproject.toml:5-45] [SOURCE: 004-graphify/external/README.md:30-38] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:415-421] |
| 005 Claudest | `unclear` | `Python >=3.7` Claude plugin/hooks stack | `partial` | `mixed` | Python exists in Public's wider toolchain, but the repo snapshot lacks a `LICENSE` file and the host model assumes Claude plugin lifecycle hooks rather than Public-native wrappers. [SOURCE: 005-claudest/external/pyproject.toml:1-10] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:11-22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:415-421] |

## Per-system rationale (deeper)

### 001 Settings
Phase 001 already decided to treat the Reddit post as field evidence rather than an implementation specification. That makes the entire system legally non-portable by construction: there is nothing to fork, only patterns to reimplement. [SOURCE: phase-1/decision-record.md:36-43]

The runtime story is also non-applicable. The concrete deliverable is a narrative about Claude settings, hooks, and an auditor, not a checked-in package with a manifest or install surface. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:15-24] [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:64-76]

### 002 CodeSight
CodeSight is technically the cleanest runtime fit of the five systems. `package.json` shows a normal Node ESM CLI with `node >=18.0.0`, which lands inside Public's existing Node-first `system-spec-kit` runtime. [SOURCE: 002-codesight/external/package.json:5-15] [SOURCE: 002-codesight/external/package.json:44-50] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package.json:11-13]

The legal evidence is weaker than the runtime evidence. `package.json` declares `"license": "MIT"`, but this checkout does not contain `002-codesight/external/LICENSE`, which means a strict copy/fork gate should stay closed until the actual license text is present and verified. That is why the verdict is `mixed`, not `source-portable`. [SOURCE: 002-codesight/external/package.json:37-50]

### 003 Contextador
Contextador is the only system in the set with an actual checked-in license file, and that file is AGPL-3.0-or-later with an explicit commercial-license upsell. That makes the legal gate decisive: direct source borrowing into Public is out of bounds unless Public is willing to accept AGPL obligations or negotiate a separate license. [SOURCE: 003-contextador/external/LICENSE:1-26]

The runtime gate points the same direction. Contextador's manifest is Bun-native from top to bottom: `bun` drives `dev`, `build`, `test`, `setup`, and the MCP entrypoint, with `engines.bun >=1.0.0`. Public's existing runtimes are Node for `system-spec-kit` and Python for CocoIndex, not Bun. [SOURCE: 003-contextador/external/package.json:27-53] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package.json:11-13] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:415-421]

### 004 Graphify
Graphify is technically plausible to port: `pyproject.toml` declares `requires-python >=3.10`, exposes a standard `graphify` console script, and keeps its core modules as ordinary Python files. Public already has a Python lane through CocoIndex, so the runtime boundary is real but not alien. [SOURCE: 004-graphify/external/pyproject.toml:5-45] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:415-421]

The legal gate is still incomplete in this checkout. `pyproject.toml` says MIT, but no `004-graphify/external/LICENSE` file is present. Under this iteration's stricter rule, that means the system is only `mixed`: technically portable ideas and even small modules exist, but direct source lift should wait for upstream license verification. [SOURCE: 004-graphify/external/pyproject.toml:8-12]

### 005 Claudest
Claudest is similarly split. The root manifest requires only Python `>=3.7`, and the `claude-memory` plugin README makes clear that the hook/search stack is stdlib-only Python plus SQLite. That lines up well with Public's partial Python support and existing SQLite-heavy memory layer. [SOURCE: 005-claudest/external/pyproject.toml:1-10] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:9-14]

But two gates keep it out of `source-portable`. First, the checkout has no `005-claudest/external/LICENSE` file; second, the runtime assumes Claude's plugin marketplace and Claude lifecycle hooks rather than Public-native entrypoints. So the system is best scored `mixed`: many implementation ideas are technically reusable, but direct code adoption remains blocked today. [SOURCE: 005-claudest/external/README.md:15-29] [SOURCE: 005-claudest/external/plugins/claude-memory/README.md:72-80] [SOURCE: 005-claudest/external/README.md:199-201]

## AGPL implications for Contextador

Contextador is the only system whose checked-in license text is explicit enough to be a hard blocker by itself. The `LICENSE` file grants AGPL-3.0-or-later terms and separately advertises a commercial license. That means Public should treat the repo as `concept-transfer-only`, not as a source-borrowing candidate. [SOURCE: 003-contextador/external/LICENSE:1-26]

For this packet, the practical implication is stricter than "do not copy files." Avoid importing:

- code,
- test fixtures,
- prompt templates that are effectively program logic,
- schema/type signatures copied from the source tree,
- and API shapes that are distinctive enough to recreate the same implementation contract.

That caution matters because Contextador's own research packet already framed its recommendations as "study plus reimplementation inside `Code_Environment/Public`, not direct reuse of Contextador source." Iteration 6 keeps that boundary. [SOURCE: phase-3/research/research.md:269-283]

## Candidate-level gating addendum

No selected candidate upgrades to `source-portable` under the evidence available in this checkout.

- All selected `003 Contextador` candidates inherit `concept-transfer-only` from the AGPL+Bun parent gate. [SOURCE: phase-3/research/research.md:269-283] [SOURCE: 003-contextador/external/LICENSE:1-26]
- All selected `002 CodeSight`, `004 Graphify`, and `005 Claudest` candidates inherit `mixed`: the runtime can fit or be adapted, but each checkout is missing a canonical `LICENSE` file, so direct source lift stays gated pending upstream license verification. [SOURCE: 002-codesight/external/package.json:37-50] [SOURCE: 004-graphify/external/pyproject.toml:8-12] [SOURCE: 005-claudest/external/README.md:199-201]
