// WebGL - Aassif Benassarou

const SYNC = Date.now ();

function NOW ()
{
  return 0.001 * (Date.now () - SYNC);
}

function CLAMP (min, f, max)
{
  return (f < min ? min : (f < max ? f : max));
}

function CONST (k)
{
  return t => k;
}

function LINEAR (x, y)
{
  return t => {
    const c = CLAMP (0, t, 1);
    return x * (1 - c) + y * c;
  };
}

function HERMITE (x, y)
{
  return t => {
    const c = CLAMP (0, t, 1);
    return x + c * c * (3 - 2 * c) * (y - x);
  };
}

function STEP (t0)
{
  return t => (t < t0 ? 0 : 1);
}

function DELAY (t0)
{
  return t => (t < t0 ? 0 : t - t0);
}

/**
  @param {number} t0
  @param {number} t1
  @param {function(number):number=} f
**/

function MIX (t0, t1, f = HERMITE (0, 1))
{
  return t => f ((t - t0) / (t1 - t0));
}

function PULSE (v0, v1, t0, w)
{
  return t =>
    v0 + (v1 - v0) * (MIX (t0 - w/2, t0) (t) - MIX (t0, t0 + w/2) (t));
}

function BPM (v0, v1, dt, w)
{
  return t =>
    (Math.abs ((t % dt) - dt/2) < w/2 ? v1 : v0);
}

function SIN (v0, v1, dt)
{
  return t =>
    v0 + (v1 - v0) * (0.5 - 0.5 * Math.cos (2 * Math.PI * t / dt));
}

export {
  SYNC, NOW,
  CLAMP,
  CONST, LINEAR, HERMITE,
  STEP, DELAY, MIX, PULSE, BPM, SIN
};

