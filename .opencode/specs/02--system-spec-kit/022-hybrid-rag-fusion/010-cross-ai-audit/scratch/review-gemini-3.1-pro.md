# Gemini 3.1 Pro Code Review: ARCH-1 + CR-P0-1

**Model:** gemini-3.1-pro-preview
**Date:** 2026-03-03
**Invocation:** `gemini -m gemini-3.1-pro-preview -o text`

---

## Review Output

### 1. API Architecture & Re-exports (ARCH-1)

**The Good:**
* **Stable API Boundaries:** Creating domain-specific barrel files (`eval.ts`, `search.ts`, `providers.ts`) and unifying them in `index.ts` is exactly the right pattern. It completely isolates your `scripts/evals/` from internal refactoring in `lib/`.
* **Namespace Re-exports:** Using `export * as vectorIndex` is highly recommended here. It prevents scope pollution in your barrel file and makes the consumer code more readable (e.g., `vectorIndex.deleteMemory()` clearly communicates the domain).
* **Type Re-exports:** You correctly used `type { ... }` in your re-exports, which is excellent for tree-shaking and adherence to TypeScript's `isolatedModules` flag.

**Potential Watch-outs:**
* **Circular Dependencies:** You must enforce (perhaps via an ESLint rule like `import/no-cycle` or `no-restricted-imports`) that files inside `mcp_server/lib/` **never** import from `mcp_server/api/`. The `api/` folder must be a strict one-way boundary for external consumers only.

### 2. Test Cleanup (CR-P0-1) - CRITICAL FLAW

There is a major timing bug with the way you've implemented `it.skipIf()` in combination with asynchronous module loading.

**The Problem:**
In Vitest (and Jest), `it()` and `describe()` blocks are evaluated **synchronously** when the file is parsed. However, your test setup resolves the optional modules **asynchronously** inside `beforeAll()`:

```typescript
let checkpointsMod: any = null;

beforeAll(async () => {
  try { checkpointsMod = await import('../lib/storage/checkpoints'); } catch { /* optional */ }
});

// BUG: At parse time, checkpointsMod is null.
// !checkpointsMod is TRUE. This test will ALWAYS skip.
it.skipIf(!checkpointsMod)('should do X', () => { ... });
```

Because `checkpointsMod` is `null` when the test file is first read, `it.skipIf(!checkpointsMod)` evaluates to `it.skipIf(true)`. **This means those 21 tests are now unconditionally skipping**, even if the modules successfully load in `beforeAll()`. This is likely why your verification summary shows `21 skipped` tests.

**The Fix:**
To skip tests dynamically based on the result of an async `beforeAll` block, you must use the Vitest test context (`ctx.skip()`) *inside* the test execution phase, rather than at definition time:

```typescript
it('should do X', (ctx) => {
  if (!checkpointsMod) {
    ctx.skip(); // <--- Marks the test as skipped in the Vitest reporter
    return;
  }

  // Proceed with assertions...
});
```
*Note: If you are skipping a whole block, you can also use `beforeAll((ctx) => { if (!mod) ctx.skip(); })` inside a `describe` block.*

### Summary
* **ARCH-1** is implemented perfectly and represents a solid architectural improvement.
* **CR-P0-1** introduces a false-positive regression by unconditionally skipping tests. You will need to rewrite the 21 `it.skipIf()` statements to use runtime `ctx.skip()` checks to ensure those tests actually run when the optional modules are present.
