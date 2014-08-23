/* 2D VECTOR MATH
  The vector class is easy to use, but it is NOT optimized!
  (Each vector operation has computational overhead so that
   the different coordinates are updated and easy to use.)

  Examples of vectors:
    v1 = xy(3, 4)
    v2 = rth(6, Math.PI/2)    // equivalent to xy(0, 6)
    v3 = rth(6, radians(90))  // same as v2
  
  The vectors will automatically compute the coordinates
  in both rectangular and polar coordinate systems:
    v1.r  =>  5
    v2.y  =>  6
  
  Display vectors:
    v1.toString()           =>  "xy(3,4)"
    v2.toString()           =>  "rth(6,1.5707963267948966)"
    round(v2, 2).toString() =>  "rth(6,1.57)"
    
  Create new vectors with sundry vector operations:
    v4 = add(v1, v2);             v4 =>  xy(3, 10)
    v5 = scale(v1, 10);           v5 =>  xy(30, 40)
    v6 = rotate(v1, Math.PI);     v6 =>  rth(3, -4)
  (see code for full list of operations)
  
  Perform an operation directly on a vector:
    v1.subtract(xy(1, 1));        v1 =>  xy(2, 3)
    v2.yreflect();                v2 =>  rth(-6, 1.57...)
    
  Declare a vector to be constant; operations will not affect it:
    v7 = xy(7, 70); v7.add(v1);   v7 =>  xy(7, 70)  
*/


// CONVENTIONS:
// Everything in this script is for two dimensions 
// All angles are in radians, unless otherwise specified

// Modes (coordinate systems)
modes = {
  xy: ["xy", "x", "y"],
  rth: ["r\u03B8", "r", "th"]};

// 2D vectors
function Vector(vec_params, mode) {
  this.x = vec_params.x;
  this.y = vec_params.y;
  this.r = vec_params.r;
  this.th = vec_params.th;
  
  
  this._set_rth = function(r, th, override_constant) {
    if (this.constant && !override_constant) return;
    this.r = r;
    this.th = mod(th, 2*Math.PI);
    this._update_xy(override_constant);
  }
  this._set_xy = function(x, y, override_constant) {
    if (this.constant && !override_constant) return;
    this.x = x;
    this.y = y;
    this._update_rth(override_constant);
  }
  this._update_rth = function(override_constant) {
    if (this.constant && !override_constant) return;
    this.r = Math.sqrt(this.x*this.x + this.y*this.y);
    this.th = mod(Math.atan2(this.y, this.x), 2*Math.PI);
  }
  this._update_xy = function(override_constant) {
    if (this.constant && !override_constant) return;
    this.x = this.r * Math.cos(this.th);
    this.y = this.r * Math.sin(this.th);
  }
  
  this.add = function(v) {
    this._set_xy(this.x + v.x, this.y + v.y);
    return this;
  }
  this.subtract = function(v) {
    this._set_xy(this.x - v.x, this.y - v.y);
    return this;
  }
  this.neg = function() {
    this._set_rth(-this.r, this.th);
    return this;
  }
  this.xshift = function(dx) {
    this._set_xy(this.x + dx, this.y);
    return this;
  }
  this.yshift = function(dy) {
    this._set_xy(this.x, this.y + dy);
    return this;
  }
  this.normalize = function(r) {
    if (r == null) r = 1;
    this._set_rth(r, this.th);
  }
  this.scale = function(c) {
    this._set_rth(this.r * c, this.th);
    return this;
  }
  this.rotate = function(radians) {
    this._set_rth(this.r, this.th + radians);
    return this;
  }
  this.xreflect = function() {
    this._set_xy(this.x * -1, this.y);
    return this;
  }
  this.yreflect = function() {
    this._set_xy(this.x, this.y * -1);
    return this;
  }
  this.reflect = function(v) { // reflect about this axis
    var dtheta = v.th - this.th;
    this._set_rth(this.r, mod360_symmetric(v.th + dtheta));
  }
  this._transform = function(args) { this.transform.apply(this, arguments); }
  this.transform = function(args) { // affine transform
    var matrix = getTransformationMatrix(arguments);
    if (isIdentMatrix(matrix)) return this;
    //console.log("Transforming point: " + this);
    //console.log("Using matrix:");
    //console.log(matrixString(matrix));
    var v = [this.x, this.y, 1];
    var vector = transpose(v);
    output = matrixMultiply(matrix, vector);
    this._set_xy(output[0][0]/output[2][0], output[1][0]/output[2][0]);
    //console.log("Output: " + this + "\n");
    return this;
  }
  this.round = function(decimals) {
    this._set_xy(round(this.x, decimals), round(this.y, decimals), true);
  }
  this.toString = function() {
    return this.mode[0] + "(" + this[this.mode[1]] + "," + this[this.mode[2]] + ")";
  }
  this.marker = function(ctx) {
    marker(ctx, this)
  }
  this.arrowOn = function(ctx, center, color) {
    if (!color) { color = 'black' };
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    if (!center) { center = xy(0, 0); }
    var end = add(center, this);
    draw.line(ctx, center, end, color);
    
    arrowhead1 = rth(-5, this.th);
    arrowhead1.rotate(radians(20));
    arrowhead1.add(end);
    
    arrowhead2 = rth(-5, this.th);
    arrowhead2.rotate(radians(-20));
    arrowhead2.add(end);
    
    ctx.beginPath()
    ctx.moveTo(arrowhead1.x, arrowhead1.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(arrowhead2.x, arrowhead2.y);
    ctx.fill();
  }
  this.copy = function() {
    return xy(this.x, this.y);
  }
  
  if (mode && !this.mode) { this.mode = mode; }
  if (this.x!=null && this.y!=null) {
    this._set_xy(this.x, this.y, true);
    if (!this.mode) { this.mode = modes.xy; }
  }
  else if (this.r!=null && this.th!=null) {
    this.th = mod(this.th, 2*Math.PI);
    this._set_rth(this.r, this.th, true)
    if (!this.mode) { this.mode = modes.rth; }
  }
  else {
    throw "argument error: a vector must be constructed with a complete set of coordinates."
  }
}
function xy(x, y, constant) { return new Vector({x:x, y:y, constant:constant}); }
function rth(r, th, constant) { return new Vector({r:r, th:th, constant:constant}); }

// Comparative operators
function equals(v1, v2) { return (v1.x == v2.x && v1.y == v2.y); }

// Additive operators
function neg(v) { return xy(-v.x, -v.y); }
function add(v1, v2) { return xy(v1.x+v2.x, v1.y+v2.y); }
function subtract(v1, v2) { return xy(v1.x-v2.x, v1.y-v2.y); }
function xshift(v, x) { return xy(v.x+x, v.y); }
function yshift(v, y) { return xy(v.x, v.y+y); }
function xyshift(v, x, y) { return xy(v.x+x, v.y+y); }

// Multiplicative operators
function scale(v, c) { return xy(v.x*c, v.y*c); }
function xscale(v, c) { return xy(v.x*c, v.y); }
function yscale(v, c) { return xy(v.x, v.y*c); }
function xreflect(v) { return xy(-v.x, v.y); }
function yreflect(v) { return xy(v.x, -v.y); }
function xy_inv(v) { return xy(1/v.x, 1/v.y); }
function dot(vectors) {
  // TODO: generalize this so that it will take a list OR multiple arguments.
  // TODO: also, make it recursive.
  x = 1; y = 1;
  for (var i = 0; i < arguments.length; i++) {
    x *= arguments[i].x;
    y *= arguments[i].y;
  }
  return xy(x, y);
}
function cross_mag(v1, v2) {
  return v1.r * v2.r * Math.sin(v1.th - v2.th);
}

// Other operations
function rotate(v, radians) { 
  return rth(v.r, v.th + radians);
}
function distance(v1, v2) {
  return Math.abs(subtract(v1, v2).r);
}
function midpoint(v1, v2) {
  return scale(add(v1, v2), 0.5);
}

// Specific vectors (constants)
vzero = xy(0, 0, true);
vunit = { // Unit vectors
  x: xy(1, 0, true),  // x direction
  y: xy(0, 1, true),  // y direction
  r: function(th) {   // r direction (depends on angle)
    return xy(Math.cos(th), Math.sin(th), true);
  },
  th: function(th) {  // theta direction (depends on angle)
    return xy(-Math.sin(th), Math.cos(th), true);
  }
}


function randXY(v1, v2) {
  if (v2 == null) {
    return xy(Math.random()*v1.x, Math.random()*v1.y);
  }
  return xy(v1.x+Math.random()*(v2.x-v1.x), v1.y+Math.random()*(v2.y-v1.y));
}
function randAngle(r, th1, th2) {
  if (th1 == null && th2 == null) {
    th1 = 0;
    th2 = Math.PI*2;
  }
  else if (th2 == null) {
    th2 = th1;
    th1 = 0;
  }
  return rth(r, th1+Math.random()*(th2-th1));
}

// Convert between degrees and radians
function radians(deg) {
  return 2*Math.PI*deg/360;
}
function degrees(rad) {
  return 360*rad/(2*Math.PI);
}

// This is a better mod function. (returns x mod n)
// Javascript mod:  -1 % n     ==>  1
// This function:   mod(-1, n) ==>  n-1
function mod(x, n) {
  return n*(x/n - Math.floor(x/n))
}

function vmod(v, n) {
  return xy(mod(v.x, n.x), mod(v.y, n.y))
}

// Specific mod cases that are useful
function mod360(th) { // puts the angle between 0 and 360deg (in radians)
  return mod(th, 2*Math.PI)
}
function mod360_symmetric(th) { // puts thie angle between -180deg and 180deg (in radians)
  return mod(th + Math.PI, 2*Math.PI) - Math.PI;
}


// Wrapper for Math.round
function round(x, decimals) {
  if (decimals == null) decimals = 0;
  return Math.round(x*Math.pow(10, decimals))/Math.pow(10, decimals)
}

// This applies the round function to the X and Y coords of a vector
function vround(v, decimals) {
  return xy(round(v.x, decimals), round(v.y, decimals));
}


 normalize = function(v, r) {
    if (r == null) r = 1;
    return rth(r, v.th);s
  }

// Computes the slope from p1 to p2
function slope(p1, p2) {
  return (p1.y - p2.y) / (p1.x - p2.x)
}

// Returns true if the line segment from p1 to p2 intersects that from eA to eB
function doLinesCross(p1, p2, eA, eB) {

    // These are vectors for the edge (in both directions)
    var vAB = subtract(eB, eA);
    var vBA = subtract(eA, eB);
    
    var vA1 = subtract(p1, eA);
    var vA2 = subtract(p2, eA);
    var vB1 = subtract(p1, eB);
    var vB2 = subtract(p2, eB);
    
    // This first pair of angles are the directions from eA to each point (with respect to eB)
    var thAB1 = mod360_symmetric(vA1.th - vAB.th);
    var thAB2 = mod360_symmetric(vA2.th - vAB.th);
    
    // The second pair
    var thBA1 = mod360_symmetric(vB1.th - vBA.th);
    var thBA2 = mod360_symmetric(vB2.th - vBA.th);
    
    // Condition 1: the points must be "between" eA and eB
    var condition1 = Math.abs(thAB1) + Math.abs(thAB2) < Math.PI
                  && Math.abs(thBA1) + Math.abs(thBA2) < Math.PI;
                  //&& Math.abs(thBA1) < Math.PI/2
                  //&& Math.abs(thAB2) < Math.PI/2
                  //&& Math.abs(thBA2) < Math.PI/2;
    // Condition 2: The given points must be on opposite sides of the eA/eB edge
    var condition2 = thAB1*thAB2 < 0 && thBA1*thBA2 < 0;

    return (condition1 && condition2);
}

// Finds the distance of point p from the line that goes through pos1 and pos2.
function distanceFromLine(p, pos1, pos2) {
  var posp1 = subtract(p, pos1);
  var pos12  = subtract(pos2, pos1);
  var theta = posp1.th - pos12.th;
  return Math.abs(posp1.r * Math.sin(theta));
}

// Determines whether the point p lies on the line segment from pos1 to pos2
// (within the given line width)
function isOnLineSegment(p, pos1, pos2, line_width) {
  var r = distance(pos1, pos2);
  var rmax = xy(r, line_width).r;
  var d = distanceFromLine(p, pos1, pos2);
  return d < line_width && distance(pos1, p) < rmax && distance(pos2, p) < rmax

}