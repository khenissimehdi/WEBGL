// WebGL - Aassif Benassarou

import Quad    from "./quad.js";
import Program from "./program.js";

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
    this.quad       = new Quad (gl);
    this.program    = new Program (gl, RainbowQuad.PROGRAM);
    this.blue       = RainbowQuad.RANGE (r);

    this.animate ();
  }

  animate ()
  {
    this.gl.clear (this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.program.use ({'b': this.blue}, p => this.quad.draw ());

    requestAnimationFrame (() => this.animate ());
  }
};

RainbowQuad.PROGRAM =
{
  attribs: ['position'],

  uniforms: {'b': 'float'},

  vertex:
  [
    'precision mediump float;',
    'uniform float b;',
    'attribute vec2 position;',
    'varying vec4 color;',
    'void main ()',
    '{',
      'color = vec4 (0.5 * position + 0.5, b, 1);',
      'gl_Position = vec4 (position, 0, 1);',
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

