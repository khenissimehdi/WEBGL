// WebGL - Aassif Benassarou

import Quad    from "./quad.js";
import Program from "./program.js";
import * as matrix from "./matrix.js";
import * as myCube from "./cube.js";

class RainbowQuad
{
  /** @constructor */
  constructor (canvas, range)
  {
    const c = document.getElementById (canvas);
    const gl = c.getContext ('webgl2', {antialias: true});

    const r = document.getElementById (range);
    r.oninput = RainbowQuad.ONINPUT (this);

    gl.clearColor (0, 1, 0, 1);

    this.gl         = gl;
    this.quad       = new myCube.NormalCube (gl);
    this.program    = new Program (gl, RainbowQuad.PROGRAM);
    this.blue       = RainbowQuad.RANGE (r);
    this.perspective = matrix.PERSPECTIVE( (Math.PI / 6), 1, 0.1, 10);
    this.translation = matrix.TRANSLATION(0, 0, -5);

    this.animate ();
  }

  animate ()
  {
    this.gl.enable (this.gl.DEPTH_TEST);

    this.gl.clear (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    /* FOR THE ROTATION THE 2 IS TO CHANGE THE RATATION SPEED */

    const rotation = matrix.ROTATION([0, 1, 0], this.blue * 2 * Math.PI);

    this.program.use ({'model' : matrix.MULTIPLY(this.translation, rotation), 'projection' : this.perspective}, p => this.quad.draw ());

    requestAnimationFrame (() => this.animate ());
  }
};

RainbowQuad.PROGRAM =
{
  attribs: ['position'],

  uniforms: {'model' : 'mat4', 'projection' : 'mat4'},

  vertex:
  [
    'precision mediump float;',
    'uniform mat4 projection;',
    'uniform mat4 model;',
    'attribute vec3 position;',
    'varying vec4 color;',
    'void main ()',
    '{',
      'color = vec4 (0.5 * position + 0.5, 1);',
      'gl_Position = projection * model * vec4 (position, 1);',
    '}'
  ].join ('\n'),

  fragment:
  [
    'precision mediump float;',
    'varying vec4 color;',
    'void main ()',
    '{',
      'gl_FragColor = color;',
    '}'
  ].join ('\n')
};

RainbowQuad.RANGE = function (r)
{
  return r.value / 100;
}

RainbowQuad.ONINPUT = function (quad)
{
  return function (e) {
    quad.blue = RainbowQuad.RANGE (e.target);
  };
}

export default RainbowQuad;

