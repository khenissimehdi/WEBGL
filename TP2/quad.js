// WebGL - Aassif Benassarou

import * as data from "./data.js";
import * as vao  from "./vao.js";

class Quad extends vao.DirectVAO
{
  /** @constructor */
  constructor (gl)
  {
    const v = data.FLOAT32 (Quad.VERTICES);
    const a = {size: 2, type: gl.FLOAT};
    const cmd = {mode: gl.TRIANGLE_STRIP, first: 0, count: 4};
    super (gl, {data: v, attribs: [a]}, cmd);
  }
};

Quad.VERTICES = [
  [-1, -1], 
  [+1, -1], 
  [-1, +1], 
  [+1, +1]
];

export default Quad;

