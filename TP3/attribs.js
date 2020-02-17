// WebGL - Aassif Benassarou

const POSITION = gl =>
[
  {size: 3, type: gl.FLOAT}
];

const NORMAL = gl =>
[
  {size: 3, type: gl.FLOAT, offset:  0, stride: 24},
  {size: 3, type: gl.FLOAT, offset: 12, stride: 24}
];

const COLOR = gl =>
[
  {size: 3, type: gl.FLOAT, offset:  0, stride: 36},
  {size: 3, type: gl.FLOAT, offset: 12, stride: 36},
  {size: 3, type: gl.FLOAT, offset: 24, stride: 36}
];

const TEXTURE = gl =>
[
  {size: 3, type: gl.FLOAT, offset:  0, stride: 20},
  {size: 2, type: gl.FLOAT, offset: 12, stride: 20}
];

const TANGENT = gl =>
[
  {size: 3, type: gl.FLOAT, offset:  0, stride: 56}, // p
  {size: 3, type: gl.FLOAT, offset: 12, stride: 56}, // t
  {size: 3, type: gl.FLOAT, offset: 24, stride: 56}, // b
  {size: 3, type: gl.FLOAT, offset: 36, stride: 56}, // n
  {size: 2, type: gl.FLOAT, offset: 48, stride: 56}  // uv
];

export {POSITION, NORMAL, COLOR, TEXTURE, TANGENT};

