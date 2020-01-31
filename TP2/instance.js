// WebGL - Aassif Benassarou

import * as vbo from "./vbo.js";

// InstanceBuffer //////////////////////////////////////////////////////////////

class InstanceBuffer extends vbo.ArrayBuffer
{
  constructor (gl, attribs, usage = gl.STREAM_DRAW)
  {
    super (gl, 0, attribs, usage);
    super.bind (() => {}, false);
  }

  update (d)
  {
    let gl = this.gl;

    // Activation du VBO.
    super.bind (() => {
      // La taille actuelle est-elle suffisante ?
      const n = gl.getBufferParameter (gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
      if (n >= d.byteLength)
        gl.bufferSubData (gl.ARRAY_BUFFER, 0, d);
      else
      {
        // Sinon, allocation d'un nouveau "buffer".
        const u = gl.getBufferParameter (gl.ARRAY_BUFFER, gl.BUFFER_USAGE);
        gl.bufferData (gl.ARRAY_BUFFER, d, u);
      }
    }, false);
  }
}

// DefaultInstanceBuffer ///////////////////////////////////////////////////////

class DefaultInstanceBuffer extends InstanceBuffer
{
  constructor (gl, program)
  {
    const T = gl.getAttribLocation (program.id, 'T');
    const c = gl.getAttribLocation (program.id, 'c');

    super (gl, [
      {index: T+0, size: 4, type: gl.FLOAT, stride: 20 * 4, offset:  0 * 4, divisor: 1}, // T0
      {index: T+1, size: 4, type: gl.FLOAT, stride: 20 * 4, offset:  4 * 4, divisor: 1}, // T1
      {index: T+2, size: 4, type: gl.FLOAT, stride: 20 * 4, offset:  8 * 4, divisor: 1}, // T2
      {index: T+3, size: 4, type: gl.FLOAT, stride: 20 * 4, offset: 12 * 4, divisor: 1}, // T3
      {index: c+0, size: 3, type: gl.FLOAT, stride: 20 * 4, offset: 16 * 4, divisor: 1}  // c
    ]);
  }

  update (d)
  {
    const f = new Float32Array (20 * d.length);
    d.forEach ((e, k) => f.set (DefaultInstanceBuffer.SERIALIZE (e), 20 * k));
    super.update (f);
  }
}

DefaultInstanceBuffer.SERIALIZE = function (o)
{
  return [].concat (...o['M'], o['c']);
};

// InstanceList ////////////////////////////////////////////////////////////////

class InstanceList
{
  // "primitives" héritent de VAO.
  // "factory" crée un InstanceBuffer.
  constructor (gl, primitives, factory)
  {
    this.gl     = gl;
    this.levels = [];
    for (let p of primitives)
      p.bind (() => {
        this.levels.push ({primitive: p, instances: [], buffer: factory ()});
      });
  }

  clear ()
  {
    for (let l of this.levels)
      l.instances.length = 0;
  }

  add (instance, lod = 0)
  {
    let k = Math.max (0, Math.min (lod, this.levels.length - 1));
    this.levels[k].instances.push (instance);
  }

  draw ()
  {
    for (let l of this.levels)
    {
      l.buffer.update (l.instances);
      l.primitive.draw (l.instances.length);
    }
  }
}

// DefaultInstanceList /////////////////////////////////////////////////////////

class DefaultInstanceList extends InstanceList
{
  constructor (gl, program, primitives)
  {
    super (gl, primitives, () => new DefaultInstanceBuffer (gl, program));
  }
}

export default DefaultInstanceList;

export {
  InstanceBuffer, DefaultInstanceBuffer,
  InstanceList,   DefaultInstanceList
};

