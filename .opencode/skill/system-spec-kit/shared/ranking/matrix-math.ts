// ---------------------------------------------------------------
// MODULE: Matrix Math
// ---------------------------------------------------------------
// Inline matrix math utilities for the learned combiner.
// Extracted from learned-combiner.ts for modularization.
//
// No external dependencies — pure numeric computations.

/* ---------------------------------------------------------------
   1. TRANSPOSE
   --------------------------------------------------------------- */

/**
 * Transpose a matrix represented as an array of row arrays.
 * Input: m x n, Output: n x m.
 */
export function transpose(matrix: number[][]): number[][] {
  if (matrix.length === 0) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}

/* ---------------------------------------------------------------
   2. MATRIX MULTIPLICATION
   --------------------------------------------------------------- */

/**
 * Multiply two matrices: A (m x k) * B (k x n) = C (m x n).
 */
export function matMul(a: number[][], b: number[][]): number[][] {
  const m = a.length;
  const k = a[0].length;
  const n = b[0].length;
  const c: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += a[i][p] * b[p][j];
      }
      c[i][j] = sum;
    }
  }
  return c;
}

/* ---------------------------------------------------------------
   3. MATRIX-VECTOR MULTIPLICATION
   --------------------------------------------------------------- */

/**
 * Multiply a matrix by a column vector: A (m x n) * v (n x 1) = result (m x 1).
 * Returns a flat array of length m.
 */
export function matVecMul(a: number[][], v: number[]): number[] {
  const m = a.length;
  const n = a[0].length;
  const result = new Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += a[i][j] * v[j];
    }
    result[i] = sum;
  }
  return result;
}

/* ---------------------------------------------------------------
   4. SCALED IDENTITY ADDITION
   --------------------------------------------------------------- */

/**
 * Add a scalar multiple of the identity matrix to a square matrix.
 * result = A + lambda * I
 */
export function addScaledIdentity(a: number[][], lambda: number): number[][] {
  const n = a.length;
  const result = a.map(row => [...row]);
  for (let i = 0; i < n; i++) {
    result[i][i] += lambda;
  }
  return result;
}

/* ---------------------------------------------------------------
   5. LINEAR SYSTEM SOLVER
   --------------------------------------------------------------- */

/**
 * Solve a linear system Ax = b using Gaussian elimination with partial pivoting.
 * Returns x, or null if the system is singular.
 *
 * Modifies copies of the input (non-destructive to caller).
 */
export function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = A.length;
  // Augmented matrix [A | b]
  const aug: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Partial pivoting: find the row with largest absolute value in this column
    let maxRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let row = col + 1; row < n; row++) {
      const val = Math.abs(aug[row][col]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = row;
      }
    }

    // Swap rows
    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    }

    // Check for singular matrix
    if (Math.abs(aug[col][col]) < 1e-12) {
      return null;
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= aug[i][j] * x[j];
    }
    x[i] = sum / aug[i][i];
  }

  return x;
}
