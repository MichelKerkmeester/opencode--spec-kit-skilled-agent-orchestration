---
title: Universal Debugging Methodology
description: Stack-agnostic 4-phase debugging approach applicable to any technology.
---

# Universal Debugging Methodology

Stack-agnostic debugging framework that applies to any technology: frontend, backend, infrastructure, data, or mobile.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides a universal debugging methodology that works across all technology stacks. Whether debugging JavaScript in a browser, Python on a server, Go microservices, Docker containers, or SQL queries - the same 4-phase approach applies.

### When to Use

- Debugging any code issue (frontend, backend, infrastructure)
- When `@debug` is dispatched via the Task tool
- After 3+ failed fix attempts on the same error
- When systematic debugging approach is needed

### Core Principle

**Find root cause BEFORE fixing.** Symptom fixes are failure.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:the-four-phases -->
## 2. THE FOUR PHASES

Complete each phase before proceeding to the next.

### Phase 1: OBSERVE

**Goal:** Capture complete context before attempting any fix.

| Action | How |
|--------|-----|
| Capture full error output | Copy complete error message, stack trace, logs |
| Document reproduction steps | Exact sequence to trigger the issue |
| Identify affected locations | Files, functions, line numbers |
| Note environment details | Versions, configs, platform |

**Key questions:**
- What is the exact error message?
- Can I reproduce this consistently?
- What changed recently? (git log, deploys, configs)
- What's working vs. what's broken?

### Phase 2: ANALYZE

**Goal:** Understand the pattern before forming hypotheses.

| Action | How |
|--------|-----|
| Find working examples | Similar code that works correctly |
| Read documentation | Official docs, API references |
| List differences | What's different between working and broken? |
| Map dependencies | What does this code depend on? |

**Key questions:**
- Is there similar code that works?
- What does the documentation say?
- What assumptions is the code making?
- What dependencies might be involved?

### Phase 3: HYPOTHESIZE

**Goal:** Form and test specific theories.

| Action | How |
|--------|-----|
| State hypothesis clearly | "X causes Y because Z" |
| Make minimal change | Test ONE variable at a time |
| Verify result | Did it work or not? |
| Iterate or conclude | Form new hypothesis if needed |

**Rules:**
- One hypothesis at a time
- Smallest possible change to test
- Don't stack fixes - test each independently
- If hypothesis fails, form a NEW one (don't add more fixes)

### Phase 4: FIX

**Goal:** Implement and verify the root cause fix.

| Action | How |
|--------|-----|
| Fix root cause | Not the symptom |
| Verify thoroughly | Test across relevant contexts |
| Document why | Explain the fix in comments/commits |
| Check for regressions | Did fixing this break something else? |

**If 3+ fixes fail:** STOP. Question the architecture:
- Is the approach fundamentally sound?
- Are we fighting against the platform/framework?
- Should we refactor instead of patch?

---

<!-- /ANCHOR:the-four-phases -->
<!-- ANCHOR:verification-checklist -->
## 3. VERIFICATION CHECKLIST

After any debugging session:

```
□ Root cause identified and documented
□ Fix addresses cause, not symptom
□ Tested in relevant contexts
□ No new errors introduced
□ Code comments explain WHY fix was needed
□ Single fix resolved issue (not multiple attempts)
```

---

<!-- /ANCHOR:verification-checklist -->
<!-- ANCHOR:common-pitfalls -->
## 4. COMMON PITFALLS

| Pitfall | Solution |
|---------|----------|
| Skipping to fix without understanding | Complete Phase 1-2 first |
| Testing multiple changes at once | One variable at a time |
| Fixing symptoms | Trace back to root cause |
| Ignoring error messages | Read the FULL message and stack trace |
| Assuming you know the cause | Verify with evidence |
| Continuing after 3+ failed fixes | Stop and question approach |

---

<!-- /ANCHOR:common-pitfalls -->
<!-- ANCHOR:when-to-escalate -->
## 5. WHEN TO ESCALATE

Escalate (dispatch `@debug` via the Task tool) when:
- Same error persists after 3+ fix attempts
- Need fresh perspective on complex issue
- Stuck in a debugging loop
- Issue requires specialized knowledge

---

<!-- /ANCHOR:when-to-escalate -->
<!-- ANCHOR:stack-specific-notes -->
## 6. STACK-SPECIFIC NOTES

The 4-phase methodology is universal. Tools vary by stack:

| Stack | Error Capture | Debugging Tools |
|-------|---------------|-----------------|
| Browser/JS | DevTools Console | Chrome DevTools, debugger |
| Node.js | console, process | node --inspect, debugger |
| Python | traceback, logging | pdb, IDE debugger |
| Go | log, panic output | dlv (Delve) |
| Rust | Result/Error, panic | rust-analyzer, LLDB |
| Docker | container logs | docker logs, compose logs |
| SQL | query errors | EXPLAIN ANALYZE |

The methodology stays the same: **Observe → Analyze → Hypothesize → Fix**.

---

<!-- /ANCHOR:stack-specific-notes -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Commands

| Command | Purpose |
|---------|---------|
| `Task tool -> @debug` | Delegate debugging to the fresh-perspective specialist with full context |

### Templates

| Template | Purpose |
|----------|---------|
| `debug-delegation.md` | Debug report template for sub-agent handoff |
<!-- /ANCHOR:related-resources -->
