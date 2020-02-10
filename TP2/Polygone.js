import * as vao from "./vao.js";
import * as data from "./data.js";

class Polygone extends vao.DirectVAO {

    constructor(gl, n, r) {
        Polygone.VERTICES = [];
        for (var i = 1; i < n; i++) {
            Polygone.VERTICES.push([Math.cos((2*MATH.PI)/n*i)*r,Math.sin((2*MATH.PI)/n*i)*r]);
        }
      
        const v = data.FLOAT32(Polygone.VERTICES);
        const a = { size: 2, type: gl.FLOAT };
        const cmd = { mode: gl.TRIANGLE_FAN, first: 0, count: n };
        super(gl, { data: v, attribs: [a] }, cmd);

    }

}

export default Polygone;