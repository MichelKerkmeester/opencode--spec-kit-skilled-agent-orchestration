# Iteration 3: Machine-Readable Template Contract & Prompt Injection Surface

## Focus
Q5 + Q7: Extract the machine-readable template contract from template-structure.js. Understand the exact structure of required headers, anchors, and optional headers per document type per level. Then analyze the @speckit agent definition to understand the current prompt injection surface and identify how the contract could be embedded into agent prompts for pre-write compliance.

## Findings

### Finding 1: template-structure.js is a fully extractable contract engine with CLI interface
The `loadTemplateContract(level, basename)` function returns a structured JSON object for any (level, document-type) pair. It can be invoked from the command line: `node template-structure.js contract <level> <basename>`. The output is already machine-readable and includes: `headerRules` (required H2 headers in order), `optionalHeaderRules` (level-gated optional sections), `requiredAnchors` (ANCHOR IDs that must appear in sequence), `optionalAnchors`, and `allowedAnchors`. This is the canonical truth source -- the validation rule `check-template-headers.sh` delegates to this exact function.
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/template-structure.js:218-289, 644-666]

### Finding 2: Level 2 spec.md contract defines 7 required headers, 3 optional, 7 required anchors, 10 allowed
The exact contract for Level 2 spec.md:
- **Required H2s (in order):** METADATA, PROBLEM & PURPOSE, SCOPE, REQUIREMENTS, SUCCESS CRITERIA, RISKS & DEPENDENCIES, OPEN QUESTIONS
- **Optional H2s:** L2: NON-FUNCTIONAL REQUIREMENTS, L2: EDGE CASES, L2: COMPLEXITY ASSESSMENT
- **Required anchors (in order):** metadata, problem, scope, requirements, success-criteria, risks, questions
- **Allowed anchors:** metadata, problem, scope, requirements, success-criteria, risks, questions, nfr, edge-cases, complexity
[SOURCE: CLI output of `node template-structure.js contract 2 spec.md`]

### Finding 3: All 5 Level 2 document types have extractable contracts with anchor-header parity
Every document type at Level 2 has a 1:1 mapping between required anchors and required H2 headers:
- **spec.md:** 7 required headers, 7 required anchors
- **plan.md:** 7 required headers, 7 required anchors (+ 3 optional anchors)
- **tasks.md:** 6 required headers, 6 required anchors
- **checklist.md:** 8 required headers, 8 required anchors
- **implementation-summary.md:** 6 required headers, 6 required anchors
This 1:1 parity means a compact table format (header | anchor-id) could represent the entire contract for each document.
[SOURCE: CLI output of `node template-structure.js contract 2 <basename>` for all 5 types]

### Finding 4: @speckit agent already has a partial scaffold injection (section 8) but it is incomplete
The Claude Code @speckit agent (`speckit.md`) contains an "Inline Scaffold Contract" section (section 8) that includes a quick reference for Level 2 spec.md showing the ANCHOR:header pattern. However, this scaffold covers ONLY spec.md at Level 2. The other 4 document types (plan.md, tasks.md, checklist.md, implementation-summary.md) have NO inline scaffold. This means agents writing plan.md, tasks.md, etc. must read templates at runtime -- a step that is frequently skipped or done incorrectly.
[SOURCE: .claude/agents/speckit.md:319-339]

### Finding 5: The contract is compact enough for full inline injection
The full Level 2 contract for all 5 document types can be represented in approximately 45 lines of compact markdown table format:
```
| Document | Required H2 (in order) | Required Anchors (in order) |
```
At roughly 9 lines per document type, this is well within agent prompt budget limits. Even including Levels 1, 2, and 3, the total would be approximately 135 lines -- feasible for inclusion in agent definitions or SKILL.md references.
[INFERENCE: based on contract output sizes across all 5 documents at Level 2]

### Finding 6: The contract engine supports phase addendum merging
`loadTemplateContractForDocument()` automatically detects phase parent/child relationships via `inferPhaseSpecAddenda()` and merges addendum contracts. This means the contract for a phase-parent spec.md will include additional optional headers and anchors (e.g., phase-map). This dynamic merging is important: any static injection into agent prompts would need to document this phase-aware behavior separately.
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/template-structure.js:432-495]

### Finding 7: Agent definitions exist in 4 CLI directories, creating a multi-surface injection challenge
The @speckit agent is defined in at least:
- `.claude/agents/speckit.md` (Claude Code)
- `.opencode/agent/speckit.md` (Copilot/OpenCode base)
- `.opencode/agent/chatgpt/speckit.md` (ChatGPT)
- `.codex/agents/speckit.toml` (Codex CLI)
Any prompt injection strategy must be applied to ALL of these surfaces OR use a shared resource (like SKILL.md or a generated contract file) that all agents reference.
[SOURCE: Glob results across .claude/agents/, .opencode/agent/, .codex/agents/]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` (full source, 685 lines)
- `.claude/agents/speckit.md` (full source, 566 lines)
- CLI output: `node template-structure.js contract 2 spec.md`
- CLI output: `node template-structure.js contract 2 plan.md`
- CLI output: `node template-structure.js contract 2 tasks.md`
- CLI output: `node template-structure.js contract 2 checklist.md`
- CLI output: `node template-structure.js contract 2 implementation-summary.md`
- Glob results: `.opencode/agent/`, `.codex/agents/`

## Assessment
- New information ratio: 0.86
- Questions addressed: Q5 (template injection strategies), Q7 (machine-readable contract structure)
- Questions answered: Q7 (fully answered -- the contract structure is now completely documented)

## Reflection
- What worked and why: Running the CLI contract extraction for all 5 document types gave authoritative, complete data. The JSON output format is the exact machine truth -- no interpretation needed. Reading the @speckit agent definition revealed the existing partial scaffold, which provides both a model for injection and evidence of the gap.
- What did not work and why: N/A -- all research actions yielded useful data this iteration.
- What I would do differently: Could have also extracted Level 1 and Level 3 contracts for completeness, but Level 2 is sufficient to prove the concept and design the injection strategy. Levels 1 and 3 can be done in a follow-up iteration.

## Recommended Next Focus
Q4: Pre-write/post-write validation hooks. Now that we know (a) the contract is extractable and compact enough for inline injection, and (b) the current @speckit agent has only partial scaffolding, the next question is: What hook mechanisms could automatically validate compliance before a file is committed? This connects the pre-write injection (Q5, partially answered) with the post-write enforcement gap. Also address Q3 (CLI enforcement mechanisms) since examining Copilot/Codex/ChatGPT agent definitions would reveal what enforcement patterns already exist across CLIs.
