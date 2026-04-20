// ───────────────────────────────────────────────────────────────
// MODULE: Working Set Tracker
// ───────────────────────────────────────────────────────────────
// Tracks files and symbols accessed during a session for compaction
// context prioritization. Stored in hook state.

/** A tracked file access entry */
export interface FileAccess {
  filePath: string;
  accessCount: number;
  lastAccessedAt: number; // timestamp ms
  symbolRefs: string[];   // fqNames referenced
}

/** In-memory working set for the current session */
export class WorkingSetTracker {
  private files = new Map<string, FileAccess>();
  private readonly maxFiles: number;

  constructor(maxFiles: number = 20) {
    this.maxFiles = maxFiles;
  }

  /** Record a file access */
  trackFile(filePath: string, symbolRefs: string[] = []): void {
    const existing = this.files.get(filePath);
    if (existing) {
      existing.accessCount++;
      existing.lastAccessedAt = Date.now();
      for (const ref of symbolRefs) {
        if (!existing.symbolRefs.includes(ref)) {
          existing.symbolRefs.push(ref);
        }
      }
    } else {
      this.files.set(filePath, {
        filePath,
        accessCount: 1,
        lastAccessedAt: Date.now(),
        symbolRefs,
      });
    }

    // Evict least-recent if over capacity
    if (this.files.size > this.maxFiles) {
      this.evictOldest();
    }
  }

  /** Get top N files by recency-weighted score */
  getTopRoots(n: number = 10): FileAccess[] {
    const entries = [...this.files.values()];
    const now = Date.now();

    // Score: frequency * recency_decay
    // recency_decay = 1 / (1 + age_in_minutes / 10)
    entries.sort((a, b) => {
      const scoreA = a.accessCount / (1 + (now - a.lastAccessedAt) / 600_000);
      const scoreB = b.accessCount / (1 + (now - b.lastAccessedAt) / 600_000);
      return scoreB - scoreA;
    });

    return entries.slice(0, n);
  }

  /** Get all tracked file paths */
  getTrackedFiles(): string[] {
    return [...this.files.keys()];
  }

  /** Serialize to JSON (for hook state persistence) */
  serialize(): Record<string, FileAccess> {
    const obj: Record<string, FileAccess> = {};
    for (const [key, value] of this.files) {
      obj[key] = value;
    }
    return obj;
  }

  /** Restore from serialized state */
  static deserialize(data: Record<string, FileAccess>): WorkingSetTracker {
    const tracker = new WorkingSetTracker();
    for (const [key, value] of Object.entries(data)) {
      tracker.files.set(key, value);
    }
    return tracker;
  }

  /** Remove oldest entries to stay within capacity */
  private evictOldest(): void {
    const entries = [...this.files.entries()]
      .sort((a, b) => a[1].lastAccessedAt - b[1].lastAccessedAt);

    while (this.files.size > this.maxFiles) {
      const oldest = entries.shift();
      if (oldest) this.files.delete(oldest[0]);
    }
  }

  /** Get current size */
  get size(): number {
    return this.files.size;
  }

  /** Clear all tracked files */
  clear(): void {
    this.files.clear();
    this.symbols.clear();
  }

  // ─── Symbol-level tracking ───

  private symbols = new Map<string, SymbolAccess>();

  /** Record a symbol access */
  trackSymbol(symbolId: string, fqName: string, filePath: string): void {
    const existing = this.symbols.get(symbolId);
    if (existing) {
      existing.accessCount++;
      existing.lastAccessedAt = Date.now();
    } else {
      this.symbols.set(symbolId, {
        symbolId,
        fqName,
        filePath,
        accessCount: 1,
        lastAccessedAt: Date.now(),
      });
    }

    // Also track the file
    this.trackFile(filePath, [fqName]);
  }

  /** Get top N symbols by recency-weighted score */
  getTopSymbols(n: number = 10): SymbolAccess[] {
    const entries = [...this.symbols.values()];
    const now = Date.now();

    entries.sort((a, b) => {
      const scoreA = a.accessCount / (1 + (now - a.lastAccessedAt) / 600_000);
      const scoreB = b.accessCount / (1 + (now - b.lastAccessedAt) / 600_000);
      return scoreB - scoreA;
    });

    return entries.slice(0, n);
  }

  /** Get symbol count */
  get symbolCount(): number {
    return this.symbols.size;
  }
}

/** A tracked symbol access entry */
export interface SymbolAccess {
  symbolId: string;
  fqName: string;
  filePath: string;
  accessCount: number;
  lastAccessedAt: number;
}
