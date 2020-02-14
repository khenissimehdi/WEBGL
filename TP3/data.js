// WebGL - Aassif Benassarou

function RANGE (start, end, f = x => x)
{
  return Array.from ({length: end - start}, (v, k) => f (k + start));
}

// Création d'un tableau multidimensionnel à partir de ses dimensions.
function ARRAY (d, f)
{
  const g = function (t, d, k, j)
  {
    if (k < d.length)
      for (let i = 0; i < t.length; ++i)
        t[i] = g (new Array (d [k]), d, k+1, [...j, i]);
    else
      for (let i = 0; i < t.length; ++i)
        t[i] = f (...j, i);

    return t;
  }

  return (Array.isArray (d)) ? g (new Array (d [0]), d, 1, []) : [];
}

// Aplatissement d'un tableau multidimensionnel (nD > 1D).
function FLATTEN (t)
{
  return (Array.isArray (t)) ? t.reduce ((f, e) => f.concat (FLATTEN (e)), []) : t;
}

// Aplatissement et conversion en tableau typé "uint8".
function UINT8 (t)
{
  return new Uint8Array (FLATTEN (t));
}

// Aplatissement et conversion en tableau typé "uint16".
function UINT16 (t)
{
  return new Uint16Array (FLATTEN (t));
}

// Aplatissement et conversion en tableau typé "float32".
function FLOAT32 (t)
{
  return new Float32Array (FLATTEN (t));
}

// Concaténation de TRIANGLE_STRIPs.
function STRIPS (strips)
{
  return strips.reduce ((s1, s2) =>
    {
      if (s1.length == 0) return s2;
      if (s2.length == 0) return s1;
      return s1.concat (s1 [s1.length-1], s2[0], s2);
    }, []);
}

function SPLIT (data, separators, f)
{
  if (separators.length > 0)
  {
    const s0 = separators [0], s = separators.slice (1);
    return data.split (s0).map (d => SPLIT (d, s, f));
  }
  else
    return f ? f (data) : data;
}

function DECODE (d, s, base)
{
  return SPLIT (d, s, x => parseInt (x, base));
}

function BASE64 (d)
{
  const p = (d + '===').slice (0, 4 * Math.ceil (d.length / 4));
  return atob (p).split ('').map (s => s.charCodeAt (0));
}

export {
  RANGE,
  ARRAY,
  FLATTEN,
  UINT8, UINT16, FLOAT32,
  STRIPS,
  SPLIT, DECODE,
  BASE64
};

