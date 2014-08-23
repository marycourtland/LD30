function configShape(obj, points) {
  obj.points = points; 
  obj.getPoint = function(i) {
    if (i >= this.points.length) {
      throw "out of bounds: " + i + " > " + this.points.length-1;
    }
    return add(this.points[i], this.pos);
  },
  obj.pushPoint = function(pos, i) { // Given point should be in the external reference frame
    if (i == null) i = this.points.length;
    this.points.splice(i, 0, subtract(pos, this.pos));
    
  };
  obj.clearPoints = function() {
    this.points = [];
  }
  
  // Geometrical functions
  // This executes the function on each pair of adjacent points.
  // So the given function should take 2 points.
  // NOTE: currently, it ignores bezier points.
  obj.forEachPointPair = function(func) {
    for (var i=1; i < this.points.length; i++) {
      if (_isArray(this.points[i])) continue;
      func.call(this, this.getPoint(i-1), this.getPoint(i));
    }
    func.call(this, this.getPoint(this.points.length-1), this.getPoint(0));
  };
  obj.getTriangulation = function() {
    this._triangles = [];
    this.forEachPointPair(function(p1, p2) {
      // Triangle goes from the centerpoint to p1 to p2
      this._triangles.push([this.pos, p1, p2]);
    });
    var triangles = this._triangles;
    this._triangles = null;
    return triangles;
  };
  obj.computeTriangleCOM = function(triangle_corners) {
    // A triangle's COM is the average of its corners' coordinates
    return xy(
      (triangle_corners[0].x + triangle_corners[1].x + triangle_corners[2].x) / 3,
      (triangle_corners[0].y + triangle_corners[1].y + triangle_corners[2].y) / 3
    );
  },
  obj.computeTriangleArea = function(triangle_corners) {
    // A triangle's area is half the cross product of two of its sides
    var v1 = subtract(triangle_corners[1], triangle_corners[0]);
    var v2 = subtract(triangle_corners[2], triangle_corners[0]);
    //return (v1.x * v2.y + v2.x * v1.y) / 2;
    return Math.abs(cross_mag(v1, v2) / 2);
  };
  obj.computeCOM = function() {
    // Find the COM of each triangular component, and weight it by its area
    var triangles = this.getTriangulation();
    var weighted_coms = [];
    var area = 0;
    for (var i=0; i < triangles.length; i++) {
      var a = Math.abs(this.computeTriangleArea(triangles[i]));
      area += a;
      weighted_coms.push(scale(this.computeTriangleCOM(triangles[i]), a));
    }
    
    // Compute the average coordinates of all the weighted triangle COMs
    var com = xy(0, 0);
    for (var i=0; i < triangles.length; i++) com.add(weighted_coms[i]);
    com.scale(1 / (area));
    return com;
  },
  obj.computeArea = function() {
    var triangles = this.getTriangulation();
    var area = 0;
    for (var i=0; i < triangles.length; i++) area += this.computeTriangleArea(triangles[i]);
    return area;
  },
  
  obj.contains = function(p) {
    if (this.points.length < 2) return false;
    angle = 0;
    angles = [];
    anglepoints = {};
    for (var i=0; i < this.points.length; i++) {
      angles.push(mod(this.points[i].th, 360));
      anglepoints[mod(this.points[i].th, 360)] = this.points[i];
    }
    angles.sort(function(a1, a2){ return a1 - a2; });
    var a1 = 0;
    var a2 = 0;
    var ap = mod(subtract(p, this.pos).th, 360);
    for (var i=1; i < this.points.length; i++) {
      a1 = angles[i-1];
      a2 = angles[i];
      if (a2-a1 > Math.PI) return false;
      if (ap >= a1 && ap < a2) break;
      else { a1 = angles[angles.length - 1]; a2 = angles[0]; }
    }
    var v1 = neg(anglepoints[a1]);
    var v2 = add(anglepoints[a2], v1);
    var vp = add(subtract(p, this.pos), v1);
    return v2.th <= vp.th && vp.th < v1.th;
  }
  
    // Draw the object on the canvas
  obj.on('draw', function() {
    if (this.points.length < 1) return;
    this.pos.add(xy(0.5, 0.5));
    this.ctx.save();
    this.ctx.lineWidth = this.graphics.lineWidth != null? this.graphics.lineWidth : 1;
    this.ctx.globalAlpha = this.graphics.alpha != null? this.graphics.alpha : 1;
    this.ctx.strokeStyle = this.graphics.color;
    this.ctx.fillStyle = this.graphics.outline_color? this.graphics.outline_color : this.graphics.color;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pos.x+this.points[0].x, this.pos.y+this.points[0].y);
    var c0 = null;
    var c1 = null;
    for (var i=1; i < this.points.length; i++) {
      if (!this.points[i].length) {
        if (c0 && c1) {
          this.ctx.bezierCurveTo(
            this.pos.x+c0.x, this.pos.y+c0.y,
            this.pos.x+c1.x, this.pos.y+c1.y,
            this.pos.x+this.points[i].x, this.pos.y+this.points[i].y);
          //console.log("bz curve to " + this.points[i]);
        }
        else {
          //console.log("line to " + this.points[i])
          this.ctx.lineTo(this.pos.x+this.points[i].x, this.pos.y+this.points[i].y);
        }
        c0 = null;
        c1 = null;
      }
      else {
        //console.log("bz controls:  " + this.points[i][0] + " " + this.points[i][1]);
        c0 = this.points[i][0];
        c1 = this.points[i][1];
      }
          
    }
    this.ctx.lineTo(this.pos.x+this.points[0].x, this.pos.y+this.points[0].y);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
    this.pos.subtract(xy(0.5, 0.5));
    this.ctx.restore();
    marker(this.ctx, this.computeCOM(), 'black');
  });
}
