import * as vao from "./vao.js";
import * as data from "./data.js";

class Etoile extends vao.DirectVAO {

    

    constructor(gl, n, r1,r2) {
        Etoile.VERTICES = [];
        n=n*2
        for (var i = 1; i <= n; i++) {

            if(i%2 == 0)
            {
                Etoile.VERTICES.push([Math.cos((2*Math.PI/n)*i)*r2,Math.sin((2*Math.PI/n)*i)*r2]);
                //Etoile.VERTICES.push([]);
            }
            else
            {
                Etoile.VERTICES.push([Math.cos((2*Math.PI)/n*i)*r1,Math.sin((2*Math.PI)/n*i)*r1]);
                //Etoile.VERTICES.push([]);
            }

        }
     
       
        //Etoile.VERTICES.push(Etoile.VERTICES.push[1]);
        const v = data.FLOAT32(Etoile.VERTICES);
        const a = { size: 2, type: gl.FLOAT };
        const cmd = { mode: gl.TRIANGLE_FAN, first: 0, count: n };
        super(gl, { data: v, attribs: [a] }, cmd);

    }

}

export default Etoile;
