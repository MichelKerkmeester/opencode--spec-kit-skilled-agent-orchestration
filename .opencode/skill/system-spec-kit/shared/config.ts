// ---------------------------------------------------------------
// MODULE: Shared Config
// ---------------------------------------------------------------

export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}
