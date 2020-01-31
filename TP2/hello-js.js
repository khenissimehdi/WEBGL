// WebGL - Aassif Benassarou

import * as matrix  from "../../js/matrix.js";
import * as data    from "../../js/data.js";
import * as vbo     from "../../js/vbo.js";
import * as vao     from "../../js/vao.js";
import Quad         from "../../js/quad.js";
import ColoringBook from "../../js/coloring-book.js";

class HelloJS
{
  constructor (id)
  {
    const canvas = document.getElementById (id);
    const gl = canvas.getContext ('webgl2');
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.clearColor (0, 1, 0, 1);

    this.program = new ColoringBook (gl);
    this.quad = new Quad (gl);
    this.gl = gl;

    this.animate ();
  }

  animate ()
  {
    this.gl.clear (this.gl.COLOR_BUFFER_BIT);

    this.program.use (p => {
      p.setModelView (matrix.SCALE (0.5, 0.5, 1));
      p.setColor ([1, 1, 1, 1]);
      this.quad.draw ();
    });

    requestAnimationFrame (() => this.animate ());
  }
}

export default HelloJS;

