// ---------------------------------------------------------------
// MODULE: Tool Sanitizer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TOOL SANITIZER
// ───────────────────────────────────────────────────────────────
// Sanitizes tool descriptions to prevent path leaks and spec contamination

const MAX_DESCRIPTION_LENGTH = 80;

/**
 * Sanitizes a tool description to remove paths that could trigger
 * contamination detection or foreign-spec-dominance (V8).
 */
function sanitizeToolDescription(description: string): string {
  if (!description || typeof description !== 'string') {
    return '';
  }

  let sanitized = description
    // Replace spec folder path patterns (specs/NNN-name/...)
    .replace(/specs\/\d{3,}-[a-z0-9-]+(?:\/\d{3,}-[a-z0-9-]+)*/gi, '[spec]')
    // Replace absolute paths (/Users/..., /home/..., C:\...)
    .replace(/(?:\/(?:Users|home|var|tmp|opt|etc|usr)\/|[A-Z]:\\)[^\s"'`,;)}\]]+/g, '[path]')
    // Replace .opencode/ internal paths
    .replace(/\.opencode\/[^\s"'`,;)}\]]+/g, '[internal-path]')
    // Replace .claude/ internal paths
    .replace(/\.claude\/[^\s"'`,;)}\]]+/g, '[internal-path]');

  // Truncate to max length
  if (sanitized.length > MAX_DESCRIPTION_LENGTH) {
    sanitized = sanitized.slice(0, MAX_DESCRIPTION_LENGTH - 3) + '...';
  }

  return sanitized.trim();
}

export { sanitizeToolDescription };
