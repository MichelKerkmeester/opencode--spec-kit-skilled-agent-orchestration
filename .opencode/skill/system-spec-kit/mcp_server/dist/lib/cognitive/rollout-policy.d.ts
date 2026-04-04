/** Read the global rollout percentage from SPECKIT_ROLLOUT_PERCENT (0-100, default 100).
 * @returns Clamped integer percentage
 */
declare function getRolloutPercent(): number;
/** Hash an identity string to a stable 0-99 bucket for rollout gating.
 * @param identity - Unique identity string (e.g., flagName, userId)
 * @returns Bucket number 0-99
 */
declare function deterministicBucket(identity: string): number;
/** Check if an identity falls within the current rollout percentage.
 * @param identity - Identity to check
 * @returns true if the identity's bucket is within rollout range
 */
declare function isIdentityInRollout(identity: string): boolean;
/** Check if a feature flag is enabled. Treats undefined/missing as enabled (default ON).
 * Explicitly set 'false' or '0' to disable. Rollout gating applies when percent < 100.
 * @param flagName - Environment variable name (e.g., SPECKIT_HYDE)
 * @param identity - Optional identity for deterministic rollout bucketing
 * @returns true if the feature is enabled for this identity
 */
declare function isFeatureEnabled(flagName: string, identity?: string): boolean;
export { getRolloutPercent, deterministicBucket, isIdentityInRollout, isFeatureEnabled, };
//# sourceMappingURL=rollout-policy.d.ts.map