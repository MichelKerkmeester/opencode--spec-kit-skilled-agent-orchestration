---
title: "sk-code-full-stack"
description: "Stack-agnostic development orchestrator guiding developers through implementation, testing, and verification phases with automatic stack detection via marker files."
trigger_phrases:
  - "full stack development workflow"
  - "stack detection implementation"
  - "implement build create feature"
  - "debug fix error broken"
  - "verify done complete works"
  - "go nodejs react nextjs react native swift development"
---

# sk-code-full-stack

> Stack-agnostic development orchestrator that detects your stack automatically, guides implementation with stack-specific patterns, and enforces verification before any completion claim.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

`sk-code-full-stack` is a development orchestrator for any supported technology stack. It detects your stack from marker files in the workspace, loads the correct stack-specific knowledge, and guides work through three mandatory phases: Implementation, Testing and Debugging, and Verification. The skill prevents the most common source of defects in AI-assisted code work: claiming completion without running verification commands.

The skill covers Go, Node.js, React and Next.js, React Native and Expo, and Swift. Detection is ordered and deterministic. First match wins. Once the stack is identified, the router selects the right reference documents, checklists, and verification commands for that stack and loads them at the appropriate level. No cross-stack confusion, no generic advice.

The Iron Law governs all three phases: no completion claim is valid without command evidence from the detected stack. `done`, `works`, `complete`, and `fixed` are blocked until test, lint, and build commands have been run and their outputs documented.

### Key Statistics

| Statistic | Value |
| --- | --- |
| Version | 1.1.0.0 |
| Supported stacks | 5 (Go, Node.js, React/Next.js, React Native/Expo, Swift) |
| Development phases | 3 (Implementation, Testing/Debugging, Verification) |
| Stack verification command sets | 5, one per stack |
| Intent categories | 7 (Implementation, Debugging, Testing, Verification, Database, API, Deployment) |
| Resource loading levels | 4 (MINIMAL, DEBUGGING, FOCUSED, STANDARD) |
| Bundled reference domains | 5 (backend/go, backend/nodejs, frontend/react, mobile/react-native, mobile/swift) |

### How This Compares

| Without This Skill | With This Skill |
| --- | --- |
| Generic code patterns regardless of stack | Stack-specific patterns loaded from bundled references |
| Completion claimed without running commands | Completion blocked until verification commands pass |
| Manual stack identification | Automatic detection from marker files |
| Single-fix debugging with no isolation | Systematic root-cause workflow, one change at a time |
| No intent routing | Weighted intent scoring selects the right resource load level |
| Mixed stack patterns in one change | Single-stack enforcement with escalation on conflicts |

### Key Features

| Feature | Description |
| --- | --- |
| Automatic stack detection | Reads marker files (`go.mod`, `Package.swift`, `app.json`, `package.json`, `next.config.*`) to identify stack |
| Ordered detection logic | First match wins, preventing false positives for mixed-language repositories |
| Three-phase workflow | Implementation, Testing/Debugging, and Verification phases with distinct rules per phase |
| Weighted intent scoring | Classifies task intent across 7 categories and adjusts resource load accordingly |
| Bundled stack knowledge | All references and checklists live inside the skill, no external lookups needed |
| The Iron Law | Blocks completion claims without command evidence from the detected stack |
| Unknown fallback checklist | Guides disambiguation when no stack is detected or intent is ambiguous |
| Review delegation boundary | Owns stack-specific verification. Delegates findings-first review to `sk-code-review` |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Confirm the skill is active.** Gate 2 routing via `skill_advisor.py` loads this skill when implementation, debugging, testing, or verification keywords appear. Confirm the routing decision before proceeding.

**Step 2: Detect your stack.** Check the workspace root for marker files. Run the detection order mentally or check the SKILL.md §2 pseudocode: `go.mod` means Go, `Package.swift` means Swift, `app.json` with expo means React Native, `next.config.*` means React, `package.json` alone means Node.js. The first match sets the stack for the entire session.

**Step 3: Load stack references.** Open `references/{category}/{stack}/` for the detected stack. For Go: `references/backend/go/`. For React: `references/frontend/react/`. Read the standards document before writing any code.

**Step 4: Run verification before claiming done.** After implementing or fixing, run all three commands for your stack. For Go: `go test ./...`, `golangci-lint run`, `go build ./...`. For Node.js or React: `npm test`, `npx eslint .`, `npm run build`. Document the outputs. Only then claim completion.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The stack detection system is explicit and ordered. It reads real files from the workspace rather than guessing from file extensions or language statistics. A repository with both `go.mod` and `package.json` is correctly identified as Go, not Node.js, because the detection order places Go first. This prevents the most common detection error in polyglot repositories.

Intent scoring runs in parallel with stack detection. The router evaluates the task description against 7 intent categories using weighted keyword matching. A task containing "implement" and "feature" scores high for IMPLEMENTATION and loads the full standard reference set. A task containing "verify" or "done" scores high for VERIFICATION and loads only the verification checklist, keeping token usage low. When two intents score within 1 point of each other, both are activated and resources for both are loaded. Multi-symptom noise terms like "flaky", "janky", and "intermittent" trigger adaptive intent expansion to 3 intents.

The three-phase model separates concerns that are often conflated. Phase 1 is about writing correct code with stack patterns. Phase 2 is about finding and fixing root causes systematically. Phase 3 is about proving that the code works before claiming it does. Each phase has its own rules, its own resources, and its own escalation criteria. Mixing phases is a common source of poor outcomes: debugging code while also refactoring it, or claiming completion after writing code without running any tests.

The Iron Law exists because "should work" is not evidence. Every stack has a defined set of test, lint, and build commands. Verification means running those commands, reading the output, and documenting what passed. The skill blocks any completion statement that lacks this evidence. This single rule eliminates the most frequent class of AI code errors.

### 3.2 FEATURE REFERENCE

**Stack Detection Order**

| Priority | Stack | Marker File | Additional Condition |
| --- | --- | --- | --- |
| 1 | Go | `go.mod` | None |
| 2 | Swift | `Package.swift` | None |
| 3 | React Native | `app.json` | Contains "expo" |
| 4 | React Native | `package.json` | Contains react-native or expo |
| 5 | React/Next.js | `next.config.js/mjs/ts` | None |
| 6 | React/Next.js | `package.json` | Contains "next" or "react" |
| 7 | Node.js | `package.json` | Fallback if no React match |

**Verification Commands by Stack**

| Stack | Test | Lint | Build |
| --- | --- | --- | --- |
| Go | `go test ./...` | `golangci-lint run` | `go build ./...` |
| Node.js | `npm test` | `npx eslint .` | `npm run build` |
| React/Next.js | `npm test` | `npx eslint .` | `npm run build` |
| React Native | `npm test` | `npx eslint .` | `npx expo export` |
| Swift | `swift test` | `swiftlint` | `swift build` |

**Intent Model**

| Intent | Primary Keywords | Load Level |
| --- | --- | --- |
| IMPLEMENTATION | implement (4), build (3), create (3), feature (3) | STANDARD |
| DEBUGGING | bug (4), fix (4), error (4), broken (3) | DEBUGGING |
| TESTING | test (4), unit (2), integration (2), coverage (2) | FOCUSED |
| VERIFICATION | verify (4), done (3), complete (3), works (2) | MINIMAL |
| DATABASE | database (4), sql (3), migration (3), schema (2) | FOCUSED |
| API | api (4), endpoint (3), handler (3), route (2) | FOCUSED |
| DEPLOYMENT | deploy (4), release (3), docker (3), kubernetes (3) | FOCUSED |

**Stack Naming Conventions**

| Stack | Files | Variables | Functions/Types |
| --- | --- | --- | --- |
| Go | `snake_case` | `camelCase` | `PascalCase` exports |
| Node.js | `kebab-case` | `camelCase` | `camelCase` |
| React/Next.js | `kebab-case` | `camelCase` | `PascalCase` components |
| React Native | `kebab-case` | `camelCase` | `PascalCase` components |
| Swift | `PascalCase` | `camelCase` | `PascalCase` types |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
sk-code-full-stack/
├── SKILL.md                          # AI agent instructions, routing logic, phase rules
├── README.md                         # This file
├── CHANGELOG.md                      # Version history
├── references/
│   ├── backend/
│   │   ├── go/                       # Go standards, patterns, testing strategy
│   │   └── nodejs/                   # Node.js service layering, async patterns
│   ├── frontend/
│   │   └── react/
│   │       ├── api_patterns.md       # API integration patterns for React
│   │       ├── component_architecture.md  # Component structure and boundaries
│   │       └── data_fetching.md      # Server and client data fetching
│   └── mobile/
│       ├── react-native/             # React Native hooks, navigation, responsive
│       └── swift/                    # Swift MVVM, SwiftUI, async patterns
└── assets/
    ├── backend/
    │   ├── go/
    │   │   ├── checklists/
    │   │   │   ├── debugging_checklist.md
    │   │   │   └── verification_checklist.md
    │   │   └── patterns/
    │   └── nodejs/
    │       ├── checklists/
    │       └── patterns/
    ├── frontend/
    │   └── react/
    │       ├── checklists/
    │       └── patterns/
    └── mobile/
        ├── react-native/
        │   ├── checklists/
        │   └── patterns/
        └── swift/
            ├── checklists/
            └── patterns/
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

This skill has no external configuration files. All behavior is controlled by the router logic in `SKILL.md §2` and the bundled reference files.

**Tunable constants in the router pseudocode:**

| Constant | Default | Effect |
| --- | --- | --- |
| `AMBIGUITY_DELTA` | 1 | Score gap below which two intents are both activated |
| `base_max_intents` | 2 | Maximum intents activated in a normal task |
| `adaptive_max_intents` | 3 | Maximum intents when 3 or more multi-symptom noise terms appear |
| `DEFAULT_RESOURCE` | `references/frontend/react/react_nextjs_standards.md` | Resource loaded when no stack is detected |

**Stack detection is not configurable at runtime.** Detection reads the actual workspace file list. To change which stack is detected, add or remove the relevant marker files from the workspace root.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: Starting a new Go feature**

```bash
# 1. Confirm go.mod exists in workspace root
ls go.mod
# -> go.mod

# 2. Stack detected as GO. Load references.
# Read: references/backend/go/

# 3. Implement following Go patterns (domain layers, DI, table-driven tests).

# 4. Run verification before claiming done.
go test ./...
golangci-lint run
go build ./...
# -> All pass. Evidence documented.
```

**Example 2: Debugging a React/Next.js test failure**

```bash
# 1. Intent classified as DEBUGGING (keywords: "fix", "error", "failing").
# Load level: DEBUGGING. Resources: react debug references + debugging_checklist.md

# 2. Follow systematic debugging workflow.
#    a. Read full error output.
#    b. git diff to see recent changes.
#    c. Reproduce consistently.
#    d. Form one hypothesis. Apply one change.

# 5. After fix, run verification.
npm test
npx eslint .
npm run build
# -> All pass. Completion claim valid.
```

**Example 3: Verifying a Swift change before claiming done**

```bash
# 1. Intent classified as VERIFICATION (keyword: "done").
# Load level: MINIMAL. Resources: verification_checklist.md only.

# 2. Run stack verification commands.
swift test
swiftlint
swift build
# -> All pass.

# 3. Document outputs. State: "Verified: swift test clean, swiftlint clean, swift build clean."
# Completion claim now valid.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**Wrong stack detected**

What you see: The skill loads Go references but the project is Node.js.

Common causes: A `go.mod` file exists in the workspace root from a previous project or a nested subdirectory that was mistakenly copied up.

Fix: Remove or move the `go.mod` file. Stack detection reads the root-level file list only. Confirm with `ls go.mod` at the project root. If you need Go and Node.js in the same workspace, place them in separate subdirectories and run the skill from the correct subdirectory.

---

**Unknown stack / disambiguation checklist triggered**

What you see: The router returns `needs_disambiguation: true` and shows the UNKNOWN_FALLBACK_CHECKLIST.

Common causes: No marker file exists at the workspace root, or all intent scores are zero.

Fix: Answer the checklist questions. Confirm the target stack and provide its marker file name. Confirm the runtime path (web, mobile, backend, CI) and share one reproducible error snippet. State the current phase.

---

**Completion claim blocked despite running tests**

What you see: The skill continues to require verification evidence after tests were run.

Common causes: Tests were run but outputs were not documented in the completion message. The stack's full command set was not run (for example, tests passed but lint was skipped).

Fix: Run all three commands for the detected stack: test, lint, and build. Document each result explicitly in the completion statement. For example: "go test ./... clean, golangci-lint run clean, go build ./... clean."

---

**Multi-symptom terms triggering wrong intents**

What you see: A task about a flaky test is routed to IMPLEMENTATION instead of TESTING.

Common causes: The task description lacks explicit testing keywords. Noise terms like "flaky" add weight but may not overcome a high IMPLEMENTATION score if other implementation words dominate.

Fix: Include explicit phase keywords in the task description. Add "test", "unit test", or "test failure" to signal the TESTING intent clearly.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why does the skill block completion claims? Can I override this?**

A: The Iron Law exists because "should work" causes more regressions than any other single pattern in AI-assisted development. The skill does not have an override. If full verification is impossible (for example, the CI environment is unavailable), the completion message must explicitly state which commands were skipped and why, plus describe any known limitations. A partial verification with documented scope is acceptable. A claim with no evidence is not.

**Q: My project uses React inside a Go monorepo. Which stack gets detected?**

A: Go wins. Detection is ordered and the first match takes precedence. `go.mod` appears at priority 1 in the detection list. If you need React-specific patterns for a subproject within the monorepo, invoke the skill from the React subdirectory so its marker files (`next.config.*` or `package.json` with React) are detected first. Alternatively, name the stack explicitly in your task description: "React component in the frontend/ subproject."

**Q: What is the difference between this skill and sk-code-review?**

A: This skill owns implementation patterns, stack detection, and verification commands. It answers "how do I write correct code for this stack and prove it works?" The `sk-code-review` skill owns findings-first code review output with a severity model and merge-readiness decisions. It answers "what are the risks in this code and should it merge?" Use both together: this skill for development, `sk-code-review` for the formal review step.

**Q: Can I add a new stack?**

A: Yes. Add the detection condition to the `detect_stack_candidates` function in SKILL.md §2. Add a `STACK_VERIFICATION_COMMANDS` entry for the new stack. Create a `references/{category}/{stack}/` directory with the standards documents. Add `assets/{category}/{stack}/checklists/` with debugging and verification checklists. The router discovers all markdown resources recursively, so new files are picked up automatically.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource | Path | Purpose |
| --- | --- | --- |
| SKILL.md | `.opencode/skill/sk-code-full-stack/SKILL.md` | AI agent instructions, full routing pseudocode, phase rules |
| Go references | `.opencode/skill/sk-code-full-stack/references/backend/go/` | Go domain layers, DI, testing strategy |
| Node.js references | `.opencode/skill/sk-code-full-stack/references/backend/nodejs/` | Node.js service layering, async patterns |
| React references | `.opencode/skill/sk-code-full-stack/references/frontend/react/` | Component architecture, API patterns, data fetching |
| React Native references | `.opencode/skill/sk-code-full-stack/references/mobile/react-native/` | Hooks, navigation, responsive behavior |
| Swift references | `.opencode/skill/sk-code-full-stack/references/mobile/swift/` | MVVM, SwiftUI, async handling |
| sk-code-review | `.opencode/skill/sk-code-review/SKILL.md` | Findings-first code review, severity model, merge decisions |
| sk-doc | `.opencode/skill/sk-doc/SKILL.md` | Documentation quality, skill creation, markdown validation |
| sk-git | `.opencode/skill/sk-git/SKILL.md` | Git workflows, commit hygiene, PR creation |
| system-spec-kit | `.opencode/skill/system-spec-kit/SKILL.md` | Spec folder management, memory system, context preservation |
| mcp-chrome-devtools | `.opencode/skill/mcp-chrome-devtools/SKILL.md` | Browser debugging, screenshots, console access |

<!-- /ANCHOR:related-documents -->
