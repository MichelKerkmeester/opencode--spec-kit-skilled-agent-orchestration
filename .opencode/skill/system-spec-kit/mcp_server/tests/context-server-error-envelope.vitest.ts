import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const sourcePath = path.resolve(__dirname, '../context-server.ts');
const sourceCode = fs.readFileSync(sourcePath, 'utf8');

describe('context-server error envelope handling', () => {
  it('wraps buildErrorResponse output with wrapForMCP', () => {
    expect(sourceCode).toMatch(/const errorResponse = buildErrorResponse\(name,\s*err,\s*args\)/);
    expect(sourceCode).toMatch(/return wrapForMCP\(errorResponse\s+as\s+any,\s*true\)/);
  });

  it('falls back to createMCPErrorResponse when envelope building fails', () => {
    expect(sourceCode).toMatch(/catch \(wrapError: unknown\)/);
    expect(sourceCode).toMatch(/Failed to build MCP error envelope/);
    expect(sourceCode).toMatch(/return createMCPErrorResponse\(\{/);
  });
});
