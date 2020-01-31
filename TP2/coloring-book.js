// WebGL - Aassif Benassarou

import * as matrix from "./matrix.js";
import Program     from "./program.js";

/**
  Programme de rendu simple :
  projection (optionnelle), modélisation et couleur.
  @extends Program
*/

class ColoringBook extends Program
{

  /**
    Construction d'un programme de rendu simple.

    @constructor
    @param {WebGLRenderingContext} gl - Contexte WebGL
    @param {number[][]=} projection - Matrice de projection (optionnelle)
  **/

  constructor (gl, projection = matrix.ID)
  {
    super (gl, ColoringBook.PROGRAM);
    this.projection = projection;
  }

  /**
    Activation temporaire du programme.
    @param {ProgramUsedCallback} f - Fonction à exécuter
  **/

  use (f)
  {
    super.use ({'P': this.projection}, f);
  }

  /**
    Mise à jour de la matrice de modélisation.
    @param {number[][]} M - Matrice 4×4 à émettre
  **/

  setModelView (M)
  {
    this.uniforms ['M'] (M);
  }

  /**
    Mise à jour de la couleur de remplissage.
    @param {number[]} c - Vecteur RGBA à émettre
  **/

  setColor (c)
  {
    this.uniforms ['c'] (c);
  }

};

// Paramètres du programme.
ColoringBook.PROGRAM =
{
  // Attribut unique : position 2D.
  attribs: ['p'],

  // 3 uniformes :
  // - matrice de modélisation (4×4),
  // - matrice de projection (4×4),
  // - couleur de remplissage (RGBA).
  uniforms: {'M': 'mat4', 'P': 'mat4', 'c': 'vec4'},

  // Code source du "vertex shader".
  vertex:
    [
      'precision mediump float;',
      'attribute vec2 p;',
      'uniform mat4 M, P;',
      'void main ()',
      '{',
        'gl_Position = P * M * vec4 (p, 0.0, 1.0);',
      '}'
    ].join ('\n'),

  // Code source du "fragment shader".
  fragment:
    [
      'precision mediump float;',
      'uniform vec4 c;',
      'void main ()',
      '{',
        'gl_FragColor = c;',
      '}'
    ].join ('\n')
};

export default ColoringBook;

