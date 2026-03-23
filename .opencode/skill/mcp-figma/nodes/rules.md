---
description: "Mandatory ALWAYS, NEVER, and ESCALATE rules for using Figma MCP tools."
---
# Rules

Non-negotiable behavioral rules for every Figma MCP interaction.

## ALWAYS

1. **ALWAYS use Code Mode for Figma invocation**
   - Call via `call_tool_chain()` with TypeScript
   - Saves context tokens vs native MCP

2. **ALWAYS use full tool naming convention**
   - Format: `figma.figma_{tool_name}`
   - Example: `figma.figma_get_file({ fileKey: "abc" })`

3. **ALWAYS verify file key format**
   - Extract from Figma URL
   - Should be alphanumeric string

4. **ALWAYS handle pagination for team queries**
   - Use `page_size` and `cursor` parameters
   - Check for `cursor` in response for more pages

5. **ALWAYS check API key before operations**
   - Use `figma_check_api_key()` to verify
   - Token must be valid and not expired

## NEVER

1. **NEVER skip the `figma_` prefix in tool names**
   - Wrong: `await figma.get_file({})`
   - Right: `await figma.figma_get_file({})`

2. **NEVER hardcode Figma tokens**
   - Use environment variables
   - Store in `.env` file

3. **NEVER assume node IDs are stable**
   - Node IDs can change when designs are edited
   - Re-fetch if operations fail

4. **NEVER ignore rate limits**
   - Figma API has rate limits
   - Add delays for batch operations

## ESCALATE IF

1. **ESCALATE IF authentication fails repeatedly**
   - Token may be expired
   - Regenerate in Figma settings

2. **ESCALATE IF file not found**
   - Verify file key from URL
   - Check file permissions

3. **ESCALATE IF rate limited**
   - Wait before retrying
   - Reduce request frequency

## Cross References
- [[how-it-works]] —Correct invocation patterns
- [[success-criteria]] —How to verify operations succeeded
- [[integration-points]] —Authentication and configuration details
