// WebGL - Aassif Benassarou

/**
  Matrice identité 4×4 (sous la forme d'un tableau 2D).
  @type {number[][]}
**/

const ID = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];

/**
  Création d'une matrice de translation 3D
  à partir des trois composantes d'un vecteur.
  @param {number} x - Translation en abscisse
  @param {number} y - Translation en ordonnée
  @param {number} z - Translation en profondeur
  @returns {number[][]} Matrice de translation 4×4
**/

function TRANSLATION (x, y, z)
{
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1]
  ];
}

/**
  Création d'une matrice de rotation 3D à partir de deux paramètres :
  - un axe de rotation (sous la forme d'un vecteur unitaire),
  - un angle de rotation (exprimé en radians).

  @param {number[]} axis - Axe de rotation (unitaire)
  @param {number} angle - Angle de rotation (en radians)
  @returns {number[][]} Matrice de rotation 4×4
**/

function ROTATION (axis, angle)
{
  const c = Math.cos (angle);
  const s = Math.sin (angle);
  const t = 1 - c;
  const x = axis[0], y = axis[1], z = axis[2];
  const tx = t * x, ty = t * y;
  return [
    [tx * x + c,     tx * y + s * z, tx * z - s * y, 0],
    [tx * y - s * z, ty * y + c,     ty * z + s * x, 0],
    [tx * z + s * y, ty * z - s * x, t  * z * z + c, 0],
    [0,              0,              0,              1]
  ];
}

const RX1 = [[+1,  0,  0, 0], [ 0,  0, +1, 0], [ 0, -1,  0, 0], [0, 0, 0, 1]];
const RX2 = [[+1,  0,  0, 0], [ 0, -1,  0, 0], [ 0,  0, -1, 0], [0, 0, 0, 1]];
const RX3 = [[+1,  0,  0, 0], [ 0,  0, -1, 0], [ 0, +1,  0, 0], [0, 0, 0, 1]];

const RY1 = [[ 0,  0, -1, 0], [ 0, +1,  0, 0], [+1,  0,  0, 0], [0, 0, 0, 1]];
const RY2 = [[-1,  0,  0, 0], [ 0, +1,  0, 0], [ 0,  0, -1, 0], [0, 0, 0, 1]];
const RY3 = [[ 0,  0, +1, 0], [ 0, +1,  0, 0], [-1,  0,  0, 0], [0, 0, 0, 1]];

const RZ1 = [[ 0, +1,  0, 0], [-1,  0,  0, 0], [ 0,  0, +1, 0], [0, 0, 0, 1]];
const RZ2 = [[-1,  0,  0, 0], [ 0, -1,  0, 0], [ 0,  0, +1, 0], [0, 0, 0, 1]];
const RZ3 = [[ 0, -1,  0, 0], [+1,  0,  0, 0], [ 0,  0, +1, 0], [0, 0, 0, 1]];

/**
  Création d'une matrice d'échelle 3D
  à partir de trois facteurs d'échelle.
  @param {number} x - Échelle en abscisse
  @param {number} y - Échelle en ordonnée
  @param {number} z - Échelle en profondeur
  @returns {number[][]} Matrice d'échelle 4×4
**/

function SCALE (x, y, z)
{
  return [
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1]
  ];
}

/**
  Transposition d'une matrice m×n.
  @param {number[][]} m - Matrice à transposer
  @returns {number[][]} Matrice transposée n×m
**/

function TRANSPOSE (m)
{
  return m[0].map ((f, r) => m.map ((col, c) => col [r]));
}

function SPLICE (m, i, j)
{
  return m.filter ((col, c) => (c != i)).map (col => col.filter ((f, r) => (r != j)));
}

function COFACTOR (m, i, j)
{
  return (((i+j) & 1) ? -1 : +1) * DET (SPLICE (m, i, j));
}

function DET (m)
{
  return (m.length > 1) ? m.reduce ((det, col, c) => det + col [0] * COFACTOR (m, c, 0), 0) : m[0][0];
}

function ADJ (m)
{
  return m.map ((col, c) => col.map ((f, r) => COFACTOR (m, r, c)));
}

/**
  Inversion d'une matrice 4×4.
**/

function INV (m)
{
  const d = DET (m), a = ADJ (m);
  return (a.length > 1) ? a.map (col => col.map (f => f / d)) : 1 / d;
}

/**
  Matrice de transformation des normales issue d'une matrice donnée.
**/

function NORMAL (m)
{
  const m3 = m.slice (0, 3).map (col => col.slice (0, 3));
  return TRANSPOSE (INV (m3));
}

/**
  Multiplication de plusieurs matrices (m×n, n×p, ... q×r, r×s).
  @param {Array} m - Matrices à multiplier (au moins deux matrices)
  @returns {number[][]} Produit des matrices
**/

function MULTIPLY (...M)
{
  return M.reduceRight ((m2, m1) =>
    m2.map ((m2i, i) =>
      m1[0].map ((m10j, j) =>
        m2i.reduce ((sum, m2ik, k) =>
          sum + m1[k][j] * m2ik, 0))), M.pop ());
}

function MUL4 (...M)
{
  return M.reduce ((m1, m2) => {
    const m0 = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    for (let i = 0; i < 4; ++i)
      for (let j = 0; j < 4; ++j)
        for (let k = 0; k < 4; ++k)
          m0[i][j] += m1[k][j] * m2[i][k];
    return m0;
  }, ID);
}

// Transformation d'un vecteur à quatre composantes.
function TRANSFORM4 (M)
{
  return p => MULTIPLY (M, [p])[0];
}

// Transformation d'un vecteur à trois composantes.
function TRANSFORM3 (M)
{
  const T = TRANSFORM4 (M);
  return (p, w = 1) => T (p.concat ([w])).slice (0, 3);
}

/**
  Création d'une matrice de projection orthogonale 4×4.
  @param {number} l - Coordonnée du plan gauche
  @param {number} r - Coordonnée du plan droit
  @param {number} b - Coordonnée du plan bas
  @param {number} t - Coordonnée du plan haut
  @param {number} n - Coordonnée du plan proche
  @param {number} f - Coordonnée du plan lointain
  @returns {number[][]} Matrice de projection orthogonale 4×4
**/

function ORTHO (l, r, b, t, n, f)
{
  return [
    [    +2/(r-l),            0,            0, 0],
    [           0,     +2/(t-b),            0, 0],
    [           0,            0,     -2/(f-n), 0],
    [-(r+l)/(r-l), -(t+b)/(t-b), -(f+n)/(f-n), 1]
  ];
}

/**
  Création d'une matrice de projection perspective 4×4.
  @param {number} angle - Angle d'ouverture vertical (en radians)
  @param {number} r - Ratio horizontal/vertical
  @param {number} n - Distance du plan proche
  @param {number} f - Distance du plan lointain
  @returns {number[][]} Matrice de projection perspective 4×4
**/

function PERSPECTIVE (angle, r, n, f)
{
  const a = 1 / Math.tan (angle / 2);
  return [
    [a/r, 0,           0,  0],
    [  0, a,           0,  0],
    [  0, 0, (n+f)/(n-f), -1],
    [  0, 0, 2*n*f/(n-f),  0]
  ];
}

export {
  ID, RX1, RX2, RX3, RY1, RY2, RY3, RZ1, RZ2, RZ3,
  TRANSLATION, ROTATION, SCALE,
  TRANSPOSE,
  SPLICE, DET, ADJ, INV,
  NORMAL,
  MULTIPLY, MUL4,
  TRANSFORM3, TRANSFORM4,
  ORTHO, PERSPECTIVE
};

