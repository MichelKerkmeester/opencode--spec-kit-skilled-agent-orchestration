# MCP Server Restart Required

## Why
The SPECKIT-003 fix has been applied to `checkpoints.js`, but the MCP server is running cached (old) code. Node.js caches `require()` calls, so the server must be restarted to load the new code.

## How to Restart

1. **Quit OpenCode completely** (Cmd+Q on Mac, or close the terminal)
2. **Wait 5 seconds** for the MCP server to fully stop
3. **Restart OpenCode**
4. **Verify the fix** by running:
   ```
   spec_kit_memory_checkpoint_create({ name: "verify-restart" })
   spec_kit_memory_checkpoint_restore({ name: "verify-restart" })
   ```
   
   You should see log output like:
   ```
   [checkpoints] DEDUP: X memories in snapshot, Y have valid file_paths
   [checkpoints] DEDUP: Found Z existing memories to delete before restore
   ```

## Expected Behavior After Restart

- `checkpoint_restore` should NOT duplicate memories
- Memory count before and after restore should be the SAME
- The DEDUP log lines should appear in the output

## Verification Test

After restart, run this test:
1. `spec_kit_memory_memory_stats({})` - Note the count
2. `spec_kit_memory_checkpoint_create({ name: "test-dedup" })`
3. `spec_kit_memory_checkpoint_restore({ name: "test-dedup" })`
4. `spec_kit_memory_memory_stats({})` - Count should be SAME

If count doubles, the fix is not loaded. Try restarting again.
