// WebGL - Aassif Benassarou

import * as vbo from "./vbo.js";

/**
  VAO générique.
  Privilégier l'utilisation des classes filles :
  - DirectVAO : sommets seuls (gl.drawArrays),
  - IndirectVAO : sommets + indices (gl.drawElements).
**/

class VAO
{

  /**
    Construction d'un VAO générique.
    @param {WebGLRenderingContext} gl - Contexte WebGL
  **/

  constructor (gl)
  {
    // Création du VAO.
    this.id = gl.createVertexArray ();
    this.gl = gl;
  }

  /**
    Activation temporaire du VAO.
    @param {BufferBoundCallback} func - Fonction exécutée quand le VAO est actif
  **/

  bind (func)
  {
    this.gl.bindVertexArray (this.id);
    func (); // Appel du "callback".
    this.gl.bindVertexArray (null);
  }

}

/**
  VAO direct.
  @extends VAO
**/

class DirectVAO extends VAO
{

  /**
    Construction d'un VAO direct.
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {Object} v - Paramètres du tableau de sommets
      @param {ArrayBuffer} v.data - Données du VBO (tableau typé)
      @param {Object[]} v.attribs - Description des attributs du VBO
      @param {number=} v.usage - Type d'utilisation (gl.STATIC_DRAW, etc.)
    @param {Object} cmd - Commande de dessin
      @param {number} cmd.mode - Type de primitives à interpréter
      @param {number=} cmd.first - Indice de départ
      @param {number} cmd.count - Nombre de sommets
    @see vbo.ATTRIBS
  **/

  constructor (gl, v, cmd)
  {
    super (gl);

    // Création du VBO de type "Array Buffer".
    this.vertices = new vbo.ArrayBuffer (gl, v.data, v.attribs, v.usage);
    this.cmd      = Object.assign ({first: 0}, cmd);

    // Activation et description des attributs.
    super.bind (() => {
      this.vertices.bind (() => {}, false);
    });
  }

  /**
    Dessin du VAO en mode direct (gl.drawArrays).
    @param {number=} primcount - Nombre d'instances
  **/

  draw (primcount = 1)
  {
    this.bind (() => this.gl.drawArraysInstanced (this.cmd.mode, this.cmd.first, this.cmd.count, primcount));
  }

};

/**
  VAO indirect.
  @extends VAO
**/

class IndirectVAO extends VAO
{

  /**
    Construction d'un VAO indirect.
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {Object} v - Paramètres du tableau de sommets
      @param {ArrayBuffer} v.data - Données du VBO (tableau typé)
      @param {Object[]} v.attribs - Description des attributs du VBO
      @param {number=} v.usage - Type d'utilisation (gl.STATIC_DRAW, etc.)
    @param {Object} e - Paramètres du tableau d'indices
      @param {Uint8Array|Uint16Array|Uint32Array} e.data - Tableau typé d'indices
      @param {number} e.type - gl.UNSIGNED_BYTE | gl.UNSIGNED_SHORT | gl.UNSIGNED_INT
      @param {number=} e.usage - Type d'utilisation (gl.STATIC_DRAW, etc.)
    @param {Object} cmd - Commande de dessin
      @param {number} cmd.mode - Type de primitives à interpréter
      @param {number} cmd.count - Nombre de sommets
      @param {number=} cmd.offset - Point de départ (en octets)
    @see vbo.ATTRIBS
  **/

  constructor (gl, v, e, cmd)
  {
    super (gl);

    // Création des VBO.
    this.vertices = new vbo.ArrayBuffer (gl, v.data, v.attribs, v.usage);
    this.elements = new vbo.ElementArrayBuffer (gl, e.data, e.type, e.usage);
    this.cmd      = Object.assign ({offset: 0}, cmd);

    // Activation et description des attributs.
    super.bind (() => {
      this.vertices.bind (() => {}, false);
      this.elements.bind (() => {}, false);
    });
  }

  /**
    Dessin du VAO en mode indirect (gl.drawElements).
    @param {number=} primcount - Nombre d'instances
  **/

  draw (primcount = 1)
  {
    this.bind (() => this.gl.drawElementsInstanced (this.cmd.mode, this.cmd.count, this.elements.type, this.cmd.offset, primcount));
  }

};

export {VAO, DirectVAO, IndirectVAO};

