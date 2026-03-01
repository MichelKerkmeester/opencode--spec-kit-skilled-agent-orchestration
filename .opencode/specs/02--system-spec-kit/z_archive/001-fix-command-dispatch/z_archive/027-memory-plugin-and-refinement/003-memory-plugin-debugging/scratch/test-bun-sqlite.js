/**
 * Test script to verify bun:sqlite works with the plugin's patterns
 * Run with: bun run test-bun-sqlite.js
 */

import { Database } from "bun:sqlite";
import { existsSync } from "fs";
import { join } from "path";

const dbPath = join(
  process.cwd(),
  ".opencode",
  "skills", 
  "system-memory",
  "database",
  "memory-index.sqlite"
);

console.log("=== bun:sqlite Compatibility Test ===\n");

// Test 1: Check database exists
console.log("Test 1: Database exists");
console.log(`  Path: ${dbPath}`);
console.log(`  Exists: ${existsSync(dbPath)}`);

if (!existsSync(dbPath)) {
  console.log("\n❌ Database not found. Cannot continue tests.");
  process.exit(1);
}

// Test 2: Open database in readonly mode
console.log("\nTest 2: Open database (readonly)");
let db;
try {
  db = new Database(dbPath, { readonly: true });
  console.log("  ✅ Database opened successfully");
} catch (err) {
  console.log(`  ❌ Failed: ${err.message}`);
  process.exit(1);
}

// Test 3: Test db.prepare().all() pattern
console.log("\nTest 3: db.prepare().all() pattern");
try {
  const memories = db.prepare(`
    SELECT id, title, importance_tier 
    FROM memory_index 
    LIMIT 5
  `).all();
  console.log(`  ✅ Query returned ${memories.length} rows`);
  if (memories.length > 0) {
    console.log(`  Sample: ${JSON.stringify(memories[0])}`);
  }
} catch (err) {
  console.log(`  ❌ Failed: ${err.message}`);
}

// Test 4: Test db.prepare().get() pattern
console.log("\nTest 4: db.prepare().get() pattern");
try {
  const countResult = db.prepare(`
    SELECT COUNT(*) as total FROM memory_index
  `).get();
  console.log(`  ✅ Query returned: ${JSON.stringify(countResult)}`);
  console.log(`  Total memories: ${countResult.total}`);
} catch (err) {
  console.log(`  ❌ Failed: ${err.message}`);
}

// Test 5: Test the exact query from the plugin
console.log("\nTest 5: Plugin's exact UNION query");
try {
  const MAX_CONSTITUTIONAL = 3;
  const MAX_CRITICAL = 3;
  const MAX_IMPORTANT = 3;
  const MAX_RECENT = 5;
  
  const memories = db.prepare(`
    SELECT * FROM (
      SELECT id, title, spec_folder, trigger_phrases, importance_tier, updated_at, 1 as priority
      FROM memory_index
      WHERE importance_tier = 'constitutional'
      ORDER BY updated_at DESC
      LIMIT ${MAX_CONSTITUTIONAL}
    )
    UNION ALL
    SELECT * FROM (
      SELECT id, title, spec_folder, trigger_phrases, importance_tier, updated_at, 2 as priority
      FROM memory_index
      WHERE importance_tier = 'critical'
      ORDER BY updated_at DESC
      LIMIT ${MAX_CRITICAL}
    )
    UNION ALL
    SELECT * FROM (
      SELECT id, title, spec_folder, trigger_phrases, importance_tier, updated_at, 3 as priority
      FROM memory_index
      WHERE importance_tier = 'important'
      ORDER BY updated_at DESC
      LIMIT ${MAX_IMPORTANT}
    )
    UNION ALL
    SELECT * FROM (
      SELECT id, title, spec_folder, trigger_phrases, importance_tier, updated_at, 4 as priority
      FROM memory_index
      WHERE importance_tier NOT IN ('constitutional', 'critical', 'important', 'deprecated')
      ORDER BY updated_at DESC
      LIMIT ${MAX_RECENT}
    )
  `).all();
  
  console.log(`  ✅ UNION query returned ${memories.length} rows`);
  
  // Group by tier
  const byTier = {};
  for (const m of memories) {
    byTier[m.importance_tier] = (byTier[m.importance_tier] || 0) + 1;
  }
  console.log(`  By tier: ${JSON.stringify(byTier)}`);
} catch (err) {
  console.log(`  ❌ Failed: ${err.message}`);
}

// Test 6: Test db.close()
console.log("\nTest 6: db.close()");
try {
  db.close();
  console.log("  ✅ Database closed successfully");
} catch (err) {
  console.log(`  ❌ Failed: ${err.message}`);
}

console.log("\n=== All Tests Complete ===");
