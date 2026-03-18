// TEST: Tool Sanitizer shared utilities
// Covers sanitizeToolInputPaths, normalizeToolStatus, isApiErrorContent
import { describe, expect, it } from 'vitest';

import {
  sanitizeToolDescription,
  sanitizeToolInputPaths,
  normalizeToolStatus,
  isApiErrorContent,
} from '../utils/tool-sanitizer';

describe('sanitizeToolInputPaths', () => {
  const projectRoot = '/Users/dev/my-project';

  it('relativizes single-value path keys', () => {
    const input = {
      filePath: '/Users/dev/my-project/src/index.ts',
      file_path: '/Users/dev/my-project/scripts/build.ts',
      path: '/Users/dev/my-project/README.md',
      description: 'Read the file',
    };

    const result = sanitizeToolInputPaths(projectRoot, input);

    expect(result.filePath).toBe('src/index.ts');
    expect(result.file_path).toBe('scripts/build.ts');
    expect(result.path).toBe('README.md');
    expect(result.description).toBe('Read the file');
  });

  it('relativizes array-value path keys', () => {
    const input = {
      paths: [
        '/Users/dev/my-project/src/a.ts',
        '/Users/dev/my-project/src/b.ts',
      ],
      filePaths: ['/Users/dev/my-project/lib/c.ts'],
      file_paths: ['/Users/dev/my-project/test/d.ts'],
    };

    const result = sanitizeToolInputPaths(projectRoot, input);

    expect(result.paths).toEqual(['src/a.ts', 'src/b.ts']);
    expect(result.filePaths).toEqual(['lib/c.ts']);
    expect(result.file_paths).toEqual(['test/d.ts']);
  });

  it('deletes single path keys that resolve outside project', () => {
    const input = {
      filePath: '/tmp/other-project/file.ts',
      description: 'Outside path',
    };

    const result = sanitizeToolInputPaths(projectRoot, input);

    expect(result.filePath).toBeUndefined();
    expect(result.description).toBe('Outside path');
  });

  it('deletes array path keys when all entries resolve outside project', () => {
    const input = {
      paths: ['/tmp/other/a.ts', '/tmp/other/b.ts'],
    };

    const result = sanitizeToolInputPaths(projectRoot, input);

    expect(result.paths).toBeUndefined();
  });

  it('does not mutate the original input object', () => {
    const input = {
      filePath: '/Users/dev/my-project/src/index.ts',
    };

    sanitizeToolInputPaths(projectRoot, input);

    expect(input.filePath).toBe('/Users/dev/my-project/src/index.ts');
  });

  it('passes through non-path keys unchanged', () => {
    const input = {
      command: 'npm test',
      timeout: 5000,
      verbose: true,
    };

    const result = sanitizeToolInputPaths(projectRoot, input);

    expect(result).toEqual(input);
  });
});

describe('normalizeToolStatus', () => {
  it('returns canonical values unchanged', () => {
    expect(normalizeToolStatus('pending')).toBe('pending');
    expect(normalizeToolStatus('completed')).toBe('completed');
    expect(normalizeToolStatus('error')).toBe('error');
    expect(normalizeToolStatus('snapshot')).toBe('snapshot');
    expect(normalizeToolStatus('unknown')).toBe('unknown');
  });

  it('maps success aliases to completed', () => {
    expect(normalizeToolStatus('success')).toBe('completed');
    expect(normalizeToolStatus('done')).toBe('completed');
    expect(normalizeToolStatus('ok')).toBe('completed');
  });

  it('maps failure aliases to error', () => {
    expect(normalizeToolStatus('failed')).toBe('error');
    expect(normalizeToolStatus('failure')).toBe('error');
    expect(normalizeToolStatus('errored')).toBe('error');
  });

  it('maps in-progress aliases to pending', () => {
    expect(normalizeToolStatus('running')).toBe('pending');
    expect(normalizeToolStatus('in_progress')).toBe('pending');
    expect(normalizeToolStatus('started')).toBe('pending');
  });

  it('returns unknown for unrecognized values', () => {
    expect(normalizeToolStatus('banana')).toBe('unknown');
    expect(normalizeToolStatus('')).toBe('unknown');
    expect(normalizeToolStatus(null)).toBe('unknown');
    expect(normalizeToolStatus(undefined)).toBe('unknown');
    expect(normalizeToolStatus(42)).toBe('unknown');
  });

  it('is case-insensitive', () => {
    expect(normalizeToolStatus('SUCCESS')).toBe('completed');
    expect(normalizeToolStatus('Pending')).toBe('pending');
    expect(normalizeToolStatus('ERROR')).toBe('error');
  });
});

describe('isApiErrorContent', () => {
  it('detects API Error: NNN pattern', () => {
    expect(isApiErrorContent('API Error: 429 Rate limited')).toBe(true);
    expect(isApiErrorContent('Something went wrong. API Error: 500')).toBe(true);
    expect(isApiErrorContent('API Error: 503 Service Unavailable')).toBe(true);
  });

  it('detects JSON error payloads', () => {
    expect(isApiErrorContent('{"type": "error", "error": {"type": "overloaded_error"}}')).toBe(true);
    expect(isApiErrorContent('{"error": "api_error", "message": "Internal server error"}')).toBe(true);
    expect(isApiErrorContent('{"type": "error", "error": {"type": "rate_limit_error"}}')).toBe(true);
  });

  it('does not flag normal content', () => {
    expect(isApiErrorContent('I read the file and found the API endpoint.')).toBe(false);
    expect(isApiErrorContent('The error handling in this function needs improvement.')).toBe(false);
    expect(isApiErrorContent('Fixed the 500 error in the middleware.')).toBe(false);
  });

  it('returns false for empty or non-string input', () => {
    expect(isApiErrorContent('')).toBe(false);
    expect(isApiErrorContent(null as unknown as string)).toBe(false);
    expect(isApiErrorContent(undefined as unknown as string)).toBe(false);
  });
});

describe('sanitizeToolDescription', () => {
  it('replaces absolute paths', () => {
    const result = sanitizeToolDescription('Read /Users/dev/my-project/src/index.ts');
    expect(result).toContain('[path]');
    expect(result).not.toContain('/Users/');
  });

  it('truncates long descriptions', () => {
    const long = 'A'.repeat(200);
    const result = sanitizeToolDescription(long);
    expect(result.length).toBeLessThanOrEqual(80);
  });
});
