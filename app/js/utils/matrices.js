import "./math";

function det(matrix) {
  return (matrix[0][0]*matrix[1][1])-(matrix[0][1]*matrix[1][0]);
}

export function solveMatrix(matrix, r) {
   const determinant = det(matrix);
   const x = det([
      [r[0], matrix[0][1]],
      [r[1], matrix[1][1]]
    ]) / determinant;

   const y = det([
     [matrix[0][0], r[0]],
     [matrix[1][0], r[1]]
   ]) / determinant;

  return {x: Math.approx(x), y: Math.approx(y)};
}
