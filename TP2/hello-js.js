﻿// WebGL - Aassif Benassarou

import * as matrix  from "./matrix.js";
import * as data    from "./data.js";
import * as vbo     from "./vbo.js";
import * as vao     from "./vao.js";
import Quad         from "./quad.js";
import ColoringBook from "./coloring-book.js";
import UnHexagone from "./UnHexagone.js";
import Polygone from "./Polygone.js";
import Etoile from "./Etoile.js";


class HelloJS
{
  constructor (id)
  {
    const canvas = document.getElementById (id);
    const gl = canvas.getContext ('webgl2');
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.clearColor (0, 1, 0, 1);

    const M = matrix.ORTHO(0, canvas.width, 0, canvas.height, 0, 1);
    this.program = new ColoringBook (gl, M);
    this.cof = 1;
    window.addEventListener('keydown',(keyCode) =>
    {
      var code = keyCode.key;
      if (code == '+')
         this.cof*=2;
      else if (code == '-')
      this.cof/=2;
    }
    )

    this.Etoile = new Etoile(gl,5,75,150);
    this.Etoile2 = new Etoile(gl,5,50,100);
    this.Etoile3 = new Etoile(gl,5,25,50);
    this.gl = gl;

    this.animate ();
  }

  animate ()
  {
    this.gl.clear (this.gl.COLOR_BUFFER_BIT);
    this.program.use (p => {
      //p.setModelView (matrix.SCALE (1,1000, 1));
      //p.setModelView(matrix.TRANSLATION(150, 300, 0));
      /** 
       * we have to pass only one matrix to get what we want a matrix of multiple transformations 
       */
      p.setModelView(matrix.MULTIPLY(matrix.TRANSLATION(150, 300, 0),
      (matrix.SCALE (this.cof,this.cof,this.cof))));
      p.setColor ([Math.random(), Math.random(), Math.random(),Math.random()]);
      this.Etoile.draw ();
    });
    this.program.use (p => {
      p.setModelView(matrix.MULTIPLY(matrix.TRANSLATION(450, 150, 0),
      (matrix.SCALE (this.cof,this.cof,this.cof))));
      p.setColor ([Math.random(), Math.random(), Math.random(),Math.random()]);
      this.Etoile2.draw ();
    });
    this.program.use (p => {
      p.setModelView(matrix.MULTIPLY(matrix.TRANSLATION(450, 450, 0),
      (matrix.SCALE (this.cof,this.cof,this.cof))));
      p.setColor ([Math.random(), Math.random(), Math.random(),Math.random()]);
      this.Etoile3.draw ();
    });

    requestAnimationFrame (() => this.animate ());
  }
}

export default HelloJS;
