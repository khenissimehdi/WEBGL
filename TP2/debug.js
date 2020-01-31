// https://bocoup.com/blog/counting-uniforms-in-webgl
function glProgramDebug (gl, program)
{
  let result =
  {
    attributes: [],
    uniforms: [],
    attributeCount: 0,
    uniformCount: 0
  };
  const uniforms   = gl.getProgramParameter (program, gl.ACTIVE_UNIFORMS);
  const attributes = gl.getProgramParameter (program, gl.ACTIVE_ATTRIBUTES);

  // Taken from the WebGl spec:
  // http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14
  const enums =
  {
    0x8B50: 'FLOAT_VEC2',
    0x8B51: 'FLOAT_VEC3',
    0x8B52: 'FLOAT_VEC4',
    0x8B53: 'INT_VEC2',
    0x8B54: 'INT_VEC3',
    0x8B55: 'INT_VEC4',
    0x8B56: 'BOOL',
    0x8B57: 'BOOL_VEC2',
    0x8B58: 'BOOL_VEC3',
    0x8B59: 'BOOL_VEC4',
    0x8B5A: 'FLOAT_MAT2',
    0x8B5B: 'FLOAT_MAT3',
    0x8B5C: 'FLOAT_MAT4',
    0x8B5E: 'SAMPLER_2D',
    0x8B60: 'SAMPLER_CUBE',
    0x1400: 'BYTE',
    0x1401: 'UNSIGNED_BYTE',
    0x1402: 'SHORT',
    0x1403: 'UNSIGNED_SHORT',
    0x1404: 'INT',
    0x1405: 'UNSIGNED_INT',
    0x1406: 'FLOAT'
  };

  for (let i = 0; i < uniforms; ++i) {
    const u = gl.getActiveUniform (program, i);
    //u.typeName = enums [u.type];
    result.uniforms.push (u);
    //result.uniformCount += u.size;
  }

  for (let i = 0; i < attributes; ++i)
  {
    const a = gl.getActiveAttrib (program, i);
    //a.typeName = enums [a.type];
    result.attributes.push (a);
    //result.attributeCount += a.size;
  }

  return result;
}

