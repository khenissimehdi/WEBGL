// WebGL - Aassif Benassarou

/*
function FILL (n, f)
{
  return Array.from ({length: n}, () => f);
}
*/

function ADD (V1, V2)
{
  return V1.map ((v1, k) => v1 + V2[k]);
}

function SUB (V1, V2)
{
  return V1.map ((v1, k) => v1 - V2[k]);
}

function SUM (V)
{
  return V.reduce ((sum, v) => sum + v, 0);
}

function MUL1 (V, x)
{
  return V.map (v => v * x);
}

function MUL (V1, V2)
{
  return V1.map ((v1, k) => v1 * V2[k]);
}

function DOT (V1, V2)
{
  return SUM (MUL (V1, V2));
}

function LENGTH2 (V)
{
  return DOT (V, V);
}

function LENGTH (V)
{
  return Math.sqrt (LENGTH2 (V));
}

function NORMALIZE (V)
{
  const l = LENGTH (V);
  return V.map (l != 0 ? v => v / l : v => 0);
}

function CROSS (V1, V2)
{
  return [
    V1[1]*V2[2] - V1[2]*V2[1],
    V1[2]*V2[0] - V1[0]*V2[2],
    V1[0]*V2[1] - V1[1]*V2[0]
  ];
}

function REFLECT (I, N)
{
  return SUB (I, MUL1 (N, 2.0 * DOT (I, N)));
}

export {ADD, SUB, SUM, MUL1, MUL, DOT, LENGTH2, LENGTH, NORMALIZE, CROSS, REFLECT};

