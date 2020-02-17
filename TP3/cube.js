// WebGL - Aassif Benassarou

import * as data    from "./data.js";
import * as vao     from "./vao.js";
import * as attribs from "./attribs.js";

class FastCube extends vao.IndirectVAO
{
  /** @constructor */
  constructor (gl)
  {
    const vertices = {data: data.FLOAT32 (Cube.VERTICES), attribs: attribs.POSITION (gl)};
    const elements = {data: data.UINT8 (FastCube.STRIP), type: gl.UNSIGNED_BYTE};
    const cmd = {mode: gl.TRIANGLE_STRIP, count: 14};
    super (gl, vertices, elements, cmd);
  }
};

// Indices des sommets en mode "TRIANGLE_STRIP".

//FastCube.STRIP = [3, 2, 7, 6, 4, 2, 0, 3, 1, 7, 5, 4, 1, 0];
FastCube.STRIP = data.DECODE ('32764203175410', [''], 8);

class Cube extends vao.IndirectVAO
{
  /** @constructor */
  constructor (gl, attribs, generator)
  {
    const v = data.ARRAY ([6, 4], generator);
    const vertices = {data: data.FLOAT32 (v), attribs: attribs};

    const e = data.ARRAY ([6], i => [0, 1, 2, 2, 1, 3].map (j => 4*i + j));
    const elements = {data: data.UINT8 (e), type: gl.UNSIGNED_BYTE};

    const cmd = {mode: gl.TRIANGLES, count: 36};
    super (gl, vertices, elements, cmd);
  }
};

class NormalCube extends Cube
{
  constructor (gl)
  {
    const generator =
      (f, v) => [Cube.VERTICES [Cube.FACES [f][v]], Cube.NORMALS [f]];

    super (gl, attribs.NORMAL (gl), generator);
  }
};

class TexturedCube extends Cube
{
  constructor (gl)
  {
    const generator =
      (f, v) => [Cube.VERTICES [Cube.FACES [f][v]], Cube.TEXTURE [v]];

    super (gl, attribs.TEXTURED (gl), generator);
  }
};

class TangentCube extends Cube
{
  constructor (gl)
  {
    const generator =
      (f, v) => [Cube.VERTICES [Cube.FACES [f][v]], Cube.TBN [f], Cube.TEXTURE [v]];

    super (gl, attribs.TANGENT (gl), generator);
  }
};

// Coordonnées des huit sommets d'un cube.

//    2--------3
//    |\       ·\
//    | \      · \
//    |  6--------7  Y
//    |  |     ·  |  |
//    0 ·|· · ·1  |  o-- X
//     \ |      · |   \
//      \|       ·|    Z
//       4--------5

/*
Cube.VERTICES =
[
  [-1, -1, -1], // LEFT  + BOTTOM + FAR
  [+1, -1, -1], // RIGHT + BOTTOM + FAR
  [-1, +1, -1], // LEFT  + TOP    + FAR
  [+1, +1, -1], // RIGHT + TOP    + FAR
  [-1, -1, +1], // LEFT  + BOTTOM + NEAR
  [+1, -1, +1], // RIGHT + BOTTOM + NEAR
  [-1, +1, +1], // LEFT  + TOP    + NEAR
  [+1, +1, +1]  // RIGHT + TOP    + NEAR
];
*/

Cube.VERTEX = k => [k&1, k&2, k&4].map (b => b ? +0.5 : -0.5);

Cube.VERTICES = data.RANGE (0, 8, Cube.VERTEX);

//console.log (Cube.VERTICES);

Cube.LEFT   = 0
Cube.RIGHT  = 1
Cube.BOTTOM = 2
Cube.TOP    = 3
Cube.FAR    = 4
Cube.NEAR   = 5

// Indices des quatre sommets composant chacune des six faces.

/*
Cube.FACES =
[
  [0, 4, 2, 6], // LEFT
  [5, 1, 7, 3], // RIGHT
  [0, 1, 4, 5], // BOTTOM
  [6, 7, 2, 3], // TOP
  [1, 0, 3, 2], // FAR
  [4, 5, 6, 7]  // NEAR
];
*/

Cube.FACES = data.DECODE ('0426|5173|0145|6723|1032|4567', ['|', ''], 8);

/*
    const e = Cube.FACES.reduce ((e, f) => e.concat (f[0], f[1], f[2], f[2], f[1], f[3]), []);
    this.elements = new vbo.ElementArrayBuffer (gl, data.UINT8 (e), gl.UNSIGNED_BYTE);
    this.cmd = {mode: gl.TRIANGLES, count: 36};
*/

// Espaces tangents associés aux six faces.

/*
Cube.TBN =
[
  [[ 0, 0, +1], [0, 1,  0], [-1,  0,  0]], // LEFT
  [[ 0, 0, -1], [0, 1,  0], [+1,  0,  0]], // RIGHT
  [[+1, 0,  0], [0, 0, +1], [ 0, -1,  0]], // BOTTOM
  [[+1, 0,  0], [0, 0, -1], [ 0, +1,  0]], // TOP
  [[-1, 0,  0], [0, 1,  0], [ 0,  0, -1]], // FAR
  [[+1, 0,  0], [0, 1,  0], [ 0,  0, +1]]  // NEAR
];
*/

Cube.TBN =
[
  [[ 0, 0, +1], [0, +1,  0], [-1,  0,  0]], // LEFT
  [[ 0, 0, -1], [0, +1,  0], [+1,  0,  0]], // RIGHT
  [[+1, 0,  0], [0,  0, +1], [ 0, -1,  0]], // BOTTOM
  [[+1, 0,  0], [0,  0, -1], [ 0, +1,  0]], // TOP
  [[-1, 0,  0], [0, +1,  0], [ 0,  0, -1]], // FAR
  [[+1, 0,  0], [0, +1,  0], [ 0,  0, +1]]  // NEAR
];

Cube.TANGENTS   = Cube.TBN.map (tbn => tbn[0]);
Cube.BITANGENTS = Cube.TBN.map (tbn => tbn[1]);
Cube.NORMALS    = Cube.TBN.map (tbn => tbn[2]);

Cube.TEXTURE =
[
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1]
];

export default Cube;

export {FastCube, Cube, NormalCube, TexturedCube, TangentCube};

