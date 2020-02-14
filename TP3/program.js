// WebGL - Aassif Benassarou

import * as data from "./data.js";

/**
  Déclaration globale d'un type de "callback" :
  fonction appelée pendant qu'un programme est actif.
  @callback ProgramUsedCallback
  @param {Program} p - Programme actif (raccourci)
**/

/** Classe représentant un programme de rendu. */
class Program
{

  /**
    Construction d'un programme de rendu.

    @constructor
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {Object} params - Paramètres du programme
    @param {string[]} params.attribs - Attributs (numérotation auto à partir de 0)
    @param {Object} params.uniforms - Uniformes ({id: type, ...})
    @param {string} params.vertex - Code source du "vertex shader"
    @param {string} params.fragment - Code source du "fragment shader"
  **/

  constructor (gl, params)
  {
    const id = gl.createProgram ();

    // Attachement des "shaders" compilés.
    gl.attachShader (id, Program.SHADER (gl, gl.VERTEX_SHADER,   params.vertex));
    gl.attachShader (id, Program.SHADER (gl, gl.FRAGMENT_SHADER, params.fragment));

    // Correspondance entre numéros et noms d'attributs.
    for (let i = 0; i < params.attribs.length; ++i)
      gl.bindAttribLocation (id, i, params.attribs[i]);

    // Édition des liens.
    gl.linkProgram (id);
    if (! gl.getProgramParameter (id, gl.LINK_STATUS))
      throw gl.getProgramInfoLog (id);

    // Création du tableau associatif "magique" :
    // - les clés correspondent aux noms des attributs,
    // - les valeurs sont des fonctions qui acceptent des arguments de types adéquats.
    this.uniforms = {};
    for (let name in params.uniforms)
      switch (params.uniforms[name])
      {
        case 'int'   : this.uniforms[name] = Program.UNIFORM1i (gl, id, name); break;

        case 'float' : this.uniforms[name] = Program.UNIFORM1f (gl, id, name); break;

        case 'vec2'  : this.uniforms[name] = Program.UNIFORM2fv (gl, id, name); break;
        case 'vec3'  : this.uniforms[name] = Program.UNIFORM3fv (gl, id, name); break;
        case 'vec4'  : this.uniforms[name] = Program.UNIFORM4fv (gl, id, name); break;

        case 'mat2'  : this.uniforms[name] = Program.UNIFORMMATRIX2fv (gl, id, name); break;
        case 'mat3'  : this.uniforms[name] = Program.UNIFORMMATRIX3fv (gl, id, name); break;
        case 'mat4'  : this.uniforms[name] = Program.UNIFORMMATRIX4fv (gl, id, name); break;
      }

    this.gl = gl;
    this.id = id;
  }

  /**
    Activation temporaire du programme.
    @param {Object} uniforms - Valeurs des uniformes ({id: valeur, ...})
    @param {ProgramUsedCallback} func - Fonction à exécuter
  **/

  use (uniforms, func)
  {
    this.gl.useProgram (this.id);

    for (let k in uniforms)
      this.uniforms[k] (uniforms[k]);

    func (this);

    this.gl.useProgram (null);
  }

};

/**
  Création et compilation d'un "shader".

  @param {WebGLRenderingContext} gl - Contexte WebGL
  @param {number} type - gl.VERTEX_SHADER ou gl.FRAGMENT_SHADER
  @param {string} source - Code source du "shader"
**/

Program.SHADER = function (gl, type, source)
{
  const shader = gl.createShader (type);
  gl.shaderSource (shader, source);
  gl.compileShader (shader);
  if (! gl.getShaderParameter (shader, gl.COMPILE_STATUS))
    throw gl.getShaderInfoLog (shader);

  return shader;
};

/*
// Code source extrait d'un script à partir de son identifiant
Program.SOURCE = function (id)
{
  return document.getElementById (id).textContent;
};
*/

Program.LOCATION = function (gl, id, name)
{
  return gl.getUniformLocation (id, name);
};

Program.UNIFORM1 = function (gl, id, name, f)
{
  const l = Program.LOCATION (gl, id, name);
  return x => f.call (gl, l, x);
};

Program.UNIFORM1i = (gl, id, name) => Program.UNIFORM1 (gl, id, name, gl.uniform1i);
Program.UNIFORM1f = (gl, id, name) => Program.UNIFORM1 (gl, id, name, gl.uniform1f);

Program.UNIFORMfv = function (gl, id, name, f)
{
  const l = Program.LOCATION (gl, id, name);
  return v => f.call (gl, l, new Float32Array (v));
}

Program.UNIFORM2fv = (gl, id, name) => Program.UNIFORMfv (gl, id, name, gl.uniform2fv);
Program.UNIFORM3fv = (gl, id, name) => Program.UNIFORMfv (gl, id, name, gl.uniform3fv);
Program.UNIFORM4fv = (gl, id, name) => Program.UNIFORMfv (gl, id, name, gl.uniform4fv);

Program.UNIFORMMATRIXfv = function (gl, id, name, f)
{
  const l = Program.LOCATION (gl, id, name);
  return m => f.call (gl, l, false, data.FLOAT32 (m));
}

Program.UNIFORMMATRIX2fv = (gl, id, name) => Program.UNIFORMMATRIXfv (gl, id, name, gl.uniformMatrix2fv);
Program.UNIFORMMATRIX3fv = (gl, id, name) => Program.UNIFORMMATRIXfv (gl, id, name, gl.uniformMatrix3fv);
Program.UNIFORMMATRIX4fv = (gl, id, name) => Program.UNIFORMMATRIXfv (gl, id, name, gl.uniformMatrix4fv);

export default Program;

