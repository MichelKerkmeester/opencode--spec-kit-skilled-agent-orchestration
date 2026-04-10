---
title: Code Quality Checklist
description: Universal validation checklist for code quality and style compliance across all stacks.
---

# ✅ Code Quality Checklist

Universal validation checklist for code quality and style compliance across TypeScript/JavaScript, Go, and Swift.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Validate code against quality standards before claiming implementation is complete. This checklist ensures consistent, maintainable code across the codebase regardless of language or platform.

### Usage

1. **Load** this checklist when completing code implementation
2. **Identify** primary language (TypeScript/JavaScript, Go, or Swift)
3. **Validate** universal checks (Section 2-6) for ALL code
4. **Validate** language-specific checks (Section 7-9)
5. **Mark** items `[x]` when verified
6. **Block** completion if any P0 item fails
7. **Document** P2 deferrals with reasons

### Language Coverage

| Language | File Extensions | Checklist Sections |
|----------|-----------------|-------------------|
| TypeScript/JavaScript | `.ts`, `.tsx`, `.js`, `.jsx` | Sections 2-7 |
| Go | `.go` | Sections 2-6, 8 |
| Swift | `.swift` | Sections 2-6, 9 |
| All Languages | N/A | Sections 2-6 (Universal) |

### Review Baseline Handoff

For formal findings-first review output, run `sk-code-review` as the baseline and use this checklist as the stack overlay.

- Severity model and review output contract: `sk-code-review/references/quick_reference.md`
- Baseline security/quality/test review checks: `sk-code-review` references
- This checklist: stack-specific implementation and verification standards

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:universal-file-organization-checks -->
## 2. UNIVERSAL: FILE ORGANIZATION CHECKS

**Applies to:** All languages

### File Structure

- [ ] **[P0] CHK-ORG-01**: File has clear purpose (single responsibility)
- [ ] **[P0] CHK-ORG-02**: File name reflects content accurately
- [ ] **[P0] CHK-ORG-03**: No dead/unreachable code
- [ ] **[P1] CHK-ORG-04**: Imports/dependencies at top of file
- [ ] **[P1] CHK-ORG-05**: Consistent import ordering (stdlib, external, internal)
- [ ] **[P1] CHK-ORG-06**: Related functionality grouped together
- [ ] **[P2] CHK-ORG-07**: File length reasonable (< 500 lines preferred)

### Module/Package Structure

- [ ] **[P0] CHK-ORG-08**: Exports only what's needed (minimal public API)
- [ ] **[P1] CHK-ORG-09**: Circular dependencies avoided
- [ ] **[P1] CHK-ORG-10**: Clear separation of concerns
- [ ] **[P2] CHK-ORG-11**: Package/module purpose documented

---

<!-- /ANCHOR:universal-file-organization-checks -->
<!-- ANCHOR:universal-naming-convention-checks -->
## 3. UNIVERSAL: NAMING CONVENTION CHECKS

**Applies to:** All languages

### General Naming

- [ ] **[P0] CHK-NAM-01**: Names are descriptive and meaningful
- [ ] **[P0] CHK-NAM-02**: Abbreviations avoided (except universally understood: `id`, `url`, `http`)
- [ ] **[P0] CHK-NAM-03**: Names reveal intent (what, not how)
- [ ] **[P1] CHK-NAM-04**: Consistent naming style throughout file
- [ ] **[P1] CHK-NAM-05**: Boolean names indicate true/false clearly
- [ ] **[P2] CHK-NAM-06**: Length proportional to scope (short in small loops)

### Function/Method Naming

- [ ] **[P0] CHK-NAM-07**: Functions use verb phrases (`calculate`, `validate`, `fetch`)
- [ ] **[P1] CHK-NAM-08**: Getter/setter conventions followed
- [ ] **[P1] CHK-NAM-09**: Predicate functions start with `is`, `has`, `can`, `should`
- [ ] **[P1] CHK-NAM-10**: Factory functions clearly named (`create`, `make`, `new`)

### Constant Naming

- [ ] **[P0] CHK-NAM-11**: Magic numbers extracted to named constants
- [ ] **[P1] CHK-NAM-12**: Constant names describe meaning, not value
- [ ] **[P2] CHK-NAM-13**: Related constants grouped or enumerated

**Compliant Naming:**
```
// Variables - descriptive and clear
user_count, totalAmount, itemList, activeSession

// Functions - verb phrases revealing intent
calculateTax(), validateEmail(), fetchUserData()
isValid(), hasPermission(), canProceed()

// Constants - meaning over value
const MAX_RETRY_ATTEMPTS = 3;  // Not: THREE = 3
const SESSION_TIMEOUT_MS = 30000;  // Not: THIRTY_SECONDS
```

**Non-Compliant Naming:**
```
// WRONG: Meaningless names
const x = getData();
const temp = process(items);
const flag = check();

// WRONG: Implementation-focused names
const loopCounter = 0;  // Should be: itemIndex
const stringValue = "";  // Should be: userName

// WRONG: Vague names
const data = fetch();  // Should be: userData, orderDetails, etc.
const result = validate();  // Should be: isValidEmail, validationErrors
```

---

<!-- /ANCHOR:universal-naming-convention-checks -->
<!-- ANCHOR:universal-comment-quality-checks -->
## 4. UNIVERSAL: COMMENT QUALITY CHECKS

**Applies to:** All languages

### Comment Principles

- [ ] **[P0] CHK-CMT-01**: No commented-out code (git preserves history)
- [ ] **[P0] CHK-CMT-02**: Comments explain WHY, not WHAT
- [ ] **[P1] CHK-CMT-03**: Complex logic has explanatory comments
- [ ] **[P1] CHK-CMT-04**: API/library constraints documented
- [ ] **[P1] CHK-CMT-05**: Workarounds explained with context
- [ ] **[P2] CHK-CMT-06**: TODO comments include context and date

### Function Documentation

- [ ] **[P1] CHK-CMT-07**: Public functions have purpose comment
- [ ] **[P1] CHK-CMT-08**: Non-obvious parameters documented
- [ ] **[P2] CHK-CMT-09**: Return values described for complex functions
- [ ] **[P2] CHK-CMT-10**: Side effects documented

**Compliant Comments (WHY):**
```
// Retry with exponential backoff to avoid overwhelming the server
for attempt := 0; attempt < maxRetries; attempt++ {

// Safari requires explicit user gesture for autoplay
if (isSafari && !hasUserInteracted) {

// Rate limited to 100 requests/minute per API docs
await rateLimiter.acquire()
```

**Non-Compliant Comments (WHAT):**
```
// WRONG: States the obvious
// Loop through users
for user in users {

// WRONG: Describes implementation
// Add 1 to counter
counter += 1

// WRONG: Redundant with code
// Check if valid
if isValid {
```

---

<!-- /ANCHOR:universal-comment-quality-checks -->
<!-- ANCHOR:universal-error-handling-checks -->
## 5. UNIVERSAL: ERROR HANDLING CHECKS

**Applies to:** All languages

### Error Handling

- [ ] **[P0] CHK-ERR-01**: Errors are handled, not silently ignored
- [ ] **[P0] CHK-ERR-02**: Error messages are descriptive and actionable
- [ ] **[P0] CHK-ERR-03**: Errors include relevant context (what failed, why)
- [ ] **[P1] CHK-ERR-04**: Errors propagated appropriately (not swallowed)
- [ ] **[P1] CHK-ERR-05**: User-facing errors are helpful, not technical
- [ ] **[P1] CHK-ERR-06**: Logging captures sufficient debug information
- [ ] **[P2] CHK-ERR-07**: Error recovery attempted where appropriate

### Edge Cases

- [ ] **[P0] CHK-ERR-08**: Null/nil/undefined cases handled
- [ ] **[P0] CHK-ERR-09**: Empty collections handled
- [ ] **[P1] CHK-ERR-10**: Boundary conditions tested (0, 1, max)
- [ ] **[P1] CHK-ERR-11**: Invalid input rejected early (fail fast)
- [ ] **[P2] CHK-ERR-12**: Timeout handling for async operations

**Compliant Error Handling:**
```
// Descriptive error with context
if err != nil {
    return fmt.Errorf("failed to fetch user %s: %w", userID, err)
}

// Validate early
if (!email || !email.includes('@')) {
    throw new ValidationError('Invalid email format provided');
}

// Handle empty case
guard !items.isEmpty else {
    return .empty
}
```

**Non-Compliant Error Handling:**
```
// WRONG: Silent failure
catch (error) { }

// WRONG: Generic message
return errors.New("error occurred")

// WRONG: Unchecked null
const name = user.profile.name;  // Could be null
```

---

<!-- /ANCHOR:universal-error-handling-checks -->
<!-- ANCHOR:universal-code-quality-checks -->
## 6. UNIVERSAL: CODE QUALITY CHECKS

**Applies to:** All languages

### Complexity

- [ ] **[P0] CHK-QUA-01**: Functions do one thing well
- [ ] **[P0] CHK-QUA-02**: Nesting depth <= 3 levels
- [ ] **[P1] CHK-QUA-03**: Function length <= 50 lines (prefer smaller)
- [ ] **[P1] CHK-QUA-04**: Cyclomatic complexity reasonable (< 10)
- [ ] **[P1] CHK-QUA-05**: No deep callback nesting (callback hell)
- [ ] **[P2] CHK-QUA-06**: Complex conditionals extracted to named functions

### DRY (Don't Repeat Yourself)

- [ ] **[P0] CHK-QUA-07**: No copy-paste code blocks
- [ ] **[P1] CHK-QUA-08**: Repeated patterns extracted to functions
- [ ] **[P1] CHK-QUA-09**: Configuration not hardcoded multiple places
- [ ] **[P2] CHK-QUA-10**: Common utilities shared appropriately

### SOLID Principles

- [ ] **[P1] CHK-QUA-11**: Single responsibility per module/class
- [ ] **[P1] CHK-QUA-12**: Dependencies injected, not hardcoded
- [ ] **[P2] CHK-QUA-13**: Interfaces used for abstraction where appropriate
- [ ] **[P2] CHK-QUA-14**: Composition preferred over inheritance

### Immutability & State

- [ ] **[P1] CHK-QUA-15**: Prefer immutable data where possible
- [ ] **[P1] CHK-QUA-16**: State changes explicit and traceable
- [ ] **[P1] CHK-QUA-17**: Global state minimized
- [ ] **[P2] CHK-QUA-18**: Side effects isolated and documented

---

<!-- /ANCHOR:universal-code-quality-checks -->
<!-- ANCHOR:typescript-javascript-specific-checks -->
## 7. TYPESCRIPT/JAVASCRIPT SPECIFIC CHECKS

**Applies to:** `.ts`, `.tsx`, `.js`, `.jsx` files

### Type Safety (TypeScript)

- [ ] **[P0] CHK-TS-01**: No `any` type (use `unknown` or specific type)
- [ ] **[P0] CHK-TS-02**: Strict mode enabled (`strict: true`)
- [ ] **[P0] CHK-TS-03**: All function parameters typed
- [ ] **[P1] CHK-TS-04**: Return types explicit for public functions
- [ ] **[P1] CHK-TS-05**: Interfaces/types for complex objects
- [ ] **[P1] CHK-TS-06**: Discriminated unions for variant types
- [ ] **[P2] CHK-TS-07**: Generics used appropriately for reusability

### Modern JavaScript

- [ ] **[P0] CHK-JS-01**: `const` by default, `let` when needed, never `var`
- [ ] **[P0] CHK-JS-02**: Arrow functions for callbacks
- [ ] **[P0] CHK-JS-03**: Template literals for string interpolation
- [ ] **[P1] CHK-JS-04**: Destructuring for object/array access
- [ ] **[P1] CHK-JS-05**: Optional chaining (`?.`) for nullable access
- [ ] **[P1] CHK-JS-06**: Nullish coalescing (`??`) over `||` for defaults
- [ ] **[P2] CHK-JS-07**: Spread syntax over Object.assign

### Async Patterns

- [ ] **[P0] CHK-JS-08**: async/await over raw promises (except Promise.all)
- [ ] **[P0] CHK-JS-09**: All promises handled (no floating promises)
- [ ] **[P0] CHK-JS-10**: try/catch for async error handling
- [ ] **[P1] CHK-JS-11**: Concurrent operations use Promise.all
- [ ] **[P1] CHK-JS-12**: Race conditions prevented
- [ ] **[P2] CHK-JS-13**: AbortController for cancellable operations

### DOM & Browser (Frontend)

- [ ] **[P0] CHK-JS-14**: DOM queries cached (not repeated in loops)
- [ ] **[P0] CHK-JS-15**: Event listeners cleaned up on unmount
- [ ] **[P1] CHK-JS-16**: Event delegation for dynamic content
- [ ] **[P1] CHK-JS-17**: Intersection/Mutation observers over polling
- [ ] **[P1] CHK-JS-18**: requestAnimationFrame for visual updates
- [ ] **[P2] CHK-JS-19**: Web Workers for heavy computation

### React Specific (if applicable)

- [ ] **[P0] CHK-RCT-01**: Keys provided for list items
- [ ] **[P0] CHK-RCT-02**: useEffect dependencies complete
- [ ] **[P0] CHK-RCT-03**: useEffect cleanup for subscriptions
- [ ] **[P1] CHK-RCT-04**: useMemo/useCallback for expensive operations
- [ ] **[P1] CHK-RCT-05**: State lifted appropriately
- [ ] **[P2] CHK-RCT-06**: Custom hooks extract reusable logic

**Compliant TypeScript:**
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
}

// Async with proper error handling
const users = await Promise.all(userIds.map(id => fetchUserProfile(id)));
const validUsers = users.filter((u): u is UserProfile => u !== null);
```

**Non-Compliant TypeScript:**
```typescript
// WRONG: any type
function processData(data: any) {

// WRONG: var usage
var counter = 0;

// WRONG: Unhandled promise
fetch('/api/data');  // No await, no .then()

// WRONG: Missing cleanup
useEffect(() => {
  const subscription = observable.subscribe();
  // No return cleanup!
}, []);
```

---

<!-- /ANCHOR:typescript-javascript-specific-checks -->
<!-- ANCHOR:go-specific-checks -->
## 8. GO SPECIFIC CHECKS

**Applies to:** `.go` files

### Go Idioms

- [ ] **[P0] CHK-GO-01**: Error checked immediately after call
- [ ] **[P0] CHK-GO-02**: Named returns used sparingly (only for clarity)
- [ ] **[P0] CHK-GO-03**: Defer used for cleanup (close, unlock)
- [ ] **[P1] CHK-GO-04**: Short variable declaration (`:=`) preferred
- [ ] **[P1] CHK-GO-05**: Receiver names consistent and short
- [ ] **[P1] CHK-GO-06**: Interface names end with `-er` where appropriate
- [ ] **[P2] CHK-GO-07**: Blank identifier only for deliberate ignoring

### Error Handling (Go)

- [ ] **[P0] CHK-GO-08**: Errors wrapped with context (`fmt.Errorf %w`)
- [ ] **[P0] CHK-GO-09**: Sentinel errors defined for expected cases
- [ ] **[P1] CHK-GO-10**: Custom error types for complex scenarios
- [ ] **[P1] CHK-GO-11**: errors.Is/As used for error checking
- [ ] **[P2] CHK-GO-12**: Panic only for truly unrecoverable situations

### Concurrency

- [ ] **[P0] CHK-GO-13**: Goroutines have clear lifecycle
- [ ] **[P0] CHK-GO-14**: Channels closed by sender only
- [ ] **[P0] CHK-GO-15**: Context used for cancellation
- [ ] **[P1] CHK-GO-16**: Sync primitives used correctly (Mutex, WaitGroup)
- [ ] **[P1] CHK-GO-17**: Race conditions prevented (go run -race passes)
- [ ] **[P2] CHK-GO-18**: Select statements handle default/timeout

### Package Design

- [ ] **[P0] CHK-GO-19**: Package name lowercase, single word
- [ ] **[P1] CHK-GO-20**: Exported names start with capital letter
- [ ] **[P1] CHK-GO-21**: Internal packages for non-public code
- [ ] **[P1] CHK-GO-22**: Accept interfaces, return structs
- [ ] **[P2] CHK-GO-23**: Table-driven tests for comprehensive coverage

**Compliant Go:**
```go
// Error handling with context
user, err := db.GetUser(ctx, userID)
if err != nil {
    return nil, fmt.Errorf("fetching user %s: %w", userID, err)
}

// Defer for cleanup
func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return fmt.Errorf("opening file: %w", err)
    }
    defer f.Close()
    // ... process file
}

// Context for cancellation
func fetchData(ctx context.Context) ([]byte, error) {
    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    resp, err := client.Do(req)
    // ...
}
```

**Non-Compliant Go:**
```go
// WRONG: Error ignored
result, _ := riskyOperation()

// WRONG: No context wrapping
if err != nil {
    return err  // Should wrap with context
}

// WRONG: Goroutine leak
go func() {
    // No way to stop this goroutine
    for {
        process()
    }
}()

// WRONG: Panic for expected error
func GetUser(id string) User {
    user, err := db.Get(id)
    if err != nil {
        panic(err)  // Should return error
    }
    return user
}
```

---

<!-- /ANCHOR:go-specific-checks -->
<!-- ANCHOR:swift-specific-checks -->
## 9. SWIFT SPECIFIC CHECKS

**Applies to:** `.swift` files

### Swift Idioms

- [ ] **[P0] CHK-SW-01**: Optional unwrapping with `guard let` / `if let`
- [ ] **[P0] CHK-SW-02**: Force unwrap (`!`) only with guaranteed non-nil
- [ ] **[P0] CHK-SW-03**: Value types (struct/enum) preferred over class
- [ ] **[P1] CHK-SW-04**: Protocol-oriented design where appropriate
- [ ] **[P1] CHK-SW-05**: Extensions for protocol conformance
- [ ] **[P1] CHK-SW-06**: Access control explicit (`private`, `internal`, `public`)
- [ ] **[P2] CHK-SW-07**: Property wrappers for repeated patterns

### Error Handling (Swift)

- [ ] **[P0] CHK-SW-08**: Errors thrown, not returned as optionals
- [ ] **[P0] CHK-SW-09**: do-try-catch for error handling
- [ ] **[P1] CHK-SW-10**: Custom Error types for domain errors
- [ ] **[P1] CHK-SW-11**: Result type for async operations
- [ ] **[P2] CHK-SW-12**: rethrows used for error propagation functions

### Memory Management

- [ ] **[P0] CHK-SW-13**: Retain cycles broken with `[weak self]`
- [ ] **[P0] CHK-SW-14**: Closures capture list explicit when needed
- [ ] **[P1] CHK-SW-15**: deinit implemented for cleanup
- [ ] **[P1] CHK-SW-16**: Autoreleasepool for batch operations
- [ ] **[P2] CHK-SW-17**: Instruments profiling for memory leaks

### Concurrency (Swift 5.5+)

- [ ] **[P0] CHK-SW-18**: async/await for asynchronous code
- [ ] **[P0] CHK-SW-19**: Actor for shared mutable state
- [ ] **[P1] CHK-SW-20**: Task cancellation handled
- [ ] **[P1] CHK-SW-21**: MainActor for UI updates
- [ ] **[P2] CHK-SW-22**: Sendable conformance for cross-actor types

### SwiftUI Specific (if applicable)

- [ ] **[P0] CHK-SUI-01**: @State for view-local state
- [ ] **[P0] CHK-SUI-02**: @Binding for child view mutations
- [ ] **[P1] CHK-SUI-03**: @ObservedObject/@StateObject chosen correctly
- [ ] **[P1] CHK-SUI-04**: View extraction for reusability
- [ ] **[P2] CHK-SUI-05**: @EnvironmentObject for deep passing

**Compliant Swift:**
```swift
// Safe optional handling
guard let user = fetchUser(id: userID) else {
    throw UserError.notFound(id: userID)
}

// Proper memory management
class DataManager {
    func fetchData(completion: @escaping (Result<Data, Error>) -> Void) {
        networkClient.request { [weak self] result in
            guard let self = self else { return }
            self.processResult(result, completion: completion)
        }
    }
}

// Modern async/await
func loadUserProfile() async throws -> UserProfile {
    let user = try await api.fetchUser(id: currentUserID)
    let preferences = try await api.fetchPreferences(for: user)
    return UserProfile(user: user, preferences: preferences)
}

// Actor for thread safety
actor DataStore {
    private var cache: [String: Data] = [:]

    func store(_ data: Data, forKey key: String) {
        cache[key] = data
    }
}
```

**Non-Compliant Swift:**
```swift
// WRONG: Force unwrap
let name = user.name!  // Could crash

// WRONG: Retain cycle
fetchData { result in
    self.process(result)  // Should be [weak self]
}

// WRONG: Optional return for error
func getUser(id: String) -> User? {  // Should throw error
    guard let user = db.find(id) else {
        return nil  // Caller doesn't know why it failed
    }
    return user
}

// WRONG: Blocking main thread
DispatchQueue.main.sync {  // Can deadlock
    updateUI()
}
```

---

<!-- /ANCHOR:swift-specific-checks -->
<!-- ANCHOR:verification-summary-template -->
## 10. VERIFICATION SUMMARY TEMPLATE

After completing validation, document the results.

### Universal Template (All Languages)

```markdown
## Code Quality Verification Summary

**File**: [filename.ext]
**Language**: [TypeScript/JavaScript | Go | Swift]
**Date**: [YYYY-MM-DD]

### Results

| Category | P0 | P1 | P2 | Status |
|----------|----|----|----|---------
| File Organization | X/X | X/X | X/X | PASS/FAIL |
| Naming Conventions | X/X | X/X | X/X | PASS/FAIL |
| Comment Quality | X/X | X/X | X/X | PASS/FAIL |
| Error Handling | X/X | X/X | X/X | PASS/FAIL |
| Code Quality | X/X | X/X | X/X | PASS/FAIL |
| [Language-Specific] | X/X | X/X | X/X | PASS/FAIL |

**P0 Status**: All passed? [YES/NO]
**P1 Status**: All passed or deferred? [YES/NO]
**Gate Result**: [PASS/BLOCKED]

### Deferred Items (if any)
- [Item ID]: [Reason for deferral]
```

---

<!-- /ANCHOR:verification-summary-template -->
<!-- ANCHOR:quick-reference -->
## 11. QUICK REFERENCE

### Pass Criteria by Language

| Language | Universal Sections | Language-Specific |
|----------|-------------------|-------------------|
| TypeScript/JS | Sections 2-6 all P0 | Section 7 all P0 |
| Go | Sections 2-6 all P0 | Section 8 all P0 |
| Swift | Sections 2-6 all P0 | Section 9 all P0 |

### P0 Items Quick List (Must Pass)

**Universal:**
- CHK-ORG-01,02,03,08 (File organization)
- CHK-NAM-01,02,03,07,11 (Naming)
- CHK-CMT-01,02 (Comments)
- CHK-ERR-01,02,03,08,09 (Error handling)
- CHK-QUA-01,02,07 (Code quality)

**TypeScript/JavaScript:**
- CHK-TS-01,02,03 (Type safety)
- CHK-JS-01,02,03,08,09,10,14,15 (Modern JS, async)
- CHK-RCT-01,02,03 (React, if applicable)

**Go:**
- CHK-GO-01,02,03,08,09,13,14,15,19 (Idioms, errors, concurrency)

**Swift:**
- CHK-SW-01,02,03,08,09,13,14,18,19 (Idioms, errors, memory)
- CHK-SUI-01,02 (SwiftUI, if applicable)

### Gate Rule

**If ANY P0 item fails, completion is BLOCKED until fixed.**

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Companion Checklists

- [debugging_checklist.md](./debugging_checklist.md) - Systematic debugging workflow
- [verification_checklist.md](./verification_checklist.md) - Testing and verification

### Parent Skill

- [SKILL.md](../../../../SKILL.md) - sk-code-web skill (Phase 1.5: Code Quality Gate)
<!-- /ANCHOR:related-resources -->
