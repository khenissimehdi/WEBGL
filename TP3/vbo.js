// WebGL - Aassif Benassarou

/**
  Déclaration globale d'un type de "callback" :
  fonction appelée pendant qu'un VBO est actif.
  @callback BufferBoundCallback
**/

/**
  VBO générique.
  Privilégier l'utilisation des classes filles :
  - ArrayBuffer,
  - ElementArrayBuffer.
**/

class VBO
{

  /**
    Construction d'un VBO générique.
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {number=} target - gl.ARRAY_BUFFER ou gl.ELEMENT_ARRAY_BUFFER
    @param {ArrayBuffer=} data - Tableau typé à charger dans le VBO
    @param {number=} usage - Type d'utilisation (gl.STATIC_DRAW, etc.)
  **/

  constructor (gl, target = gl.ARRAY_BUFFER, data = 0, usage = gl.STATIC_DRAW)
  {
    this.target = target;

    this.id = gl.createBuffer ();
    this.gl = gl;

    gl.bindBuffer (this.target, this.id);
    gl.bufferData (this.target, data, usage);
    gl.bindBuffer (this.target, null);
  }

  /**
    Activation temporaire du VBO.
    @param {BufferBoundCallback} func - Fonction exécutée quand le VBO est actif
    @param {boolean=} unbind - Désactiver le "buffer" après utilisation ?
  **/

  bind (func, unbind = true)
  {
    this.gl.bindBuffer (this.target, this.id);

    func (); // Appel du "callback".

    if (unbind)
      this.gl.bindBuffer (this.target, null);
  }

};

/**
  Activation des attributs de sommets.
  @param {WebGLRenderingContext} gl - Contexte WebGL
  @param {Object[]} attribs - Tableau d'attributs
    @param {number=} attribs[].index - Indice de l'attribut (optionnel)
    @param {number} attribs[].size - Nombre de composantes (1, 2, 3 ou 4)
    @param {number} attribs[].type - Type d'un attribut (gl.FLOAT, etc.)
    @param {boolean=} attribs[].normalized - Normalisation des valeurs ?
    @param {number=} attribs[].stride - Distance entre deux attributs consécutifs (en octets)
    @param {number=} attribs[].offset - Point de départ dans le VBO (en octets)
    @param {number=} attribs[].divisor - Diviseur d'instanciation (0 = non instancié)
  @param {number=} divisor - Diviseur d'instanciation par défaut
**/

function ATTRIBS (gl, attribs, divisor = 0)
{
  for (let i = 0; i < attribs.length; ++i)
  {
    let {index = i,
         size, type, normalized = false,
         stride = 0, offset = 0,
         divisor: d = divisor} = attribs [i];

    gl.enableVertexAttribArray (index);
    gl.vertexAttribPointer (index, size, type, normalized, stride, offset);
    gl.vertexAttribDivisor (index, d);
  }
};

/**
  Tableau de sommets.
  @extends VBO
**/

class ArrayBuffer extends VBO
{

  /**
    Construction d'un VBO de type "Array Buffer".
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {ArrayBuffer} data - Données du VBO (tableau typé)
    @param {Object[]} attribs - Tableau d'attributs
    @param {number=} usage - Type d'utilisation (gl.STATIC_DRAW, etc.)
    @see ATTRIBS
  **/

  constructor (gl, data = 0, attribs = [], usage = gl.STATIC_DRAW)
  {
    super (gl, gl.ARRAY_BUFFER, data, usage);
    this.attribs = attribs;
  }

  /**
    Activation temporaire du VBO.
    @param {BufferBoundCallback} func - Fonction exécutée quand le VBO est actif
    @param {boolean=} unbind - Désactiver le "buffer" après utilisation ?
  **/

  bind (func, unbind = true)
  {
    super.bind (() => {
      // Activation et description des attributs.
      ATTRIBS (this.gl, this.attribs);
      // Appel du "callback".
      func ();
    }, unbind);
  }

  /**
    Dessin du VBO en mode direct (gl.drawArrays).
    @param {Object} cmd - Commande de dessin
      @param {number} cmd.mode - Type de primitives à interpréter
      @param {number=} cmd.first - Indice de départ
      @param {number} cmd.count - Nombre de sommets
  **/

  draw ({mode, first = 0, count})
  {
    this.bind (() => this.gl.drawArrays (mode, first, count));
  }

};

/**
  Typage optimal d'un tableau d'indices.
  @param {WebGLRenderingContext} gl - Contexte WebGL
  @param {Array} e - Tableau d'indices
**/

function ELEMENTS (gl, e)
{
  const n = Math.max (...e);
  if (n < 256) return {data: UINT8  (e), type: gl.UNSIGNED_BYTE};
  else         return {data: UINT16 (e), type: gl.UNSIGNED_SHORT};
}

/**
  Tableau d'indices.
  @extends VBO
**/

class ElementArrayBuffer extends VBO
{

  /**
    Construction d'un VBO de type "Element Array Buffer".
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {Uint8Array|Uint16Array|Uint32Array} data - Tableau typé d'indices
    @param {number} type - gl.UNSIGNED_BYTE | gl.UNSIGNED_SHORT | gl.UNSIGNED_INT
    @param {number=} usage - Type d'utilisation (gl.STATIC_DRAW, etc.)
  **/

  constructor (gl, data, type, usage = gl.STATIC_DRAW)
  {
    super (gl, gl.ELEMENT_ARRAY_BUFFER, data, usage);
    this.type = type;
  }

  /**
    Dessin du VBO en mode indirect (gl.drawElements).
    Un VBO.ArrayBuffer doit préalablement été activé.
    @param {Object} cmd - Commande de dessin
      @param {number} cmd.mode - Type de primitives à interpréter
      @param {number} cmd.count - Nombre de sommets
      @param {number=} cmd.offset - Point de départ (en octets)
  **/

  draw ({mode, count, offset = 0})
  {
    this.bind (() => this.gl.drawElements (mode, count, this.type, offset));
  }

};

export {VBO, ATTRIBS, ArrayBuffer, ELEMENTS, ElementArrayBuffer};

