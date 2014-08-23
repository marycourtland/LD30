function solidify(obj) {
  obj.kind = "solid_" + obj.kind;
  obj.is_solid = true;
  obj.colliders = [];
  obj.checkCollision = function(obj2) {
    var colliding_point_indices = [];
    for (var i=0; i < this.points.length; i++) {
      if (_.isArray(this.points[i])) continue; // For now, ignore bezier control points
      if (obj2.contains(this.getPoint(i))) colliding_point_indices.push(i); // return the INDEX of the point which is colliding w/ the object
    }
    return colliding_point_indices;
  }
  obj.on('tick', function() {
    for (var i=0; i < this.colliders.length; i++) {
      var obj = this.colliders[i];
      var colliding_pt_indices = this.checkCollision(obj);
      for (var i=0; i < colliding_pt_indices.length; i++) {
        var pt_index = colliding_pt_indices[i];
        
        // find which edge got crossed
        var edge1 = obj.getCrossedEdge(this.getPoint(pt_index), this.getPoint(mod(pt_index - 1, this.points.length)));
        var edge2 = obj.getCrossedEdge(this.getPoint(pt_index), this.getPoint(mod(pt_index + 1, this.points.length)));
        
        // Designate points for test-marking
        var markerpts = [];
        markerpts.push(this.getPoint(pt_index));
        test_markers_big.push(this.getPoint(pt_index));
        if (edge1) {
          markerpts.push(edge1[0]);
          markerpts.push(edge1[1]);
        }
        if (edge2) {
          markerpts.push(edge2[0]);
          markerpts.push(edge1[1]);
        }
        test_markers.push(markerpts);
        
        //if (game.frame%100==0) console.log(this.id + " at " + this.getPoint(colliding_pt_index) + ": crossed edge: " + edge1 + " and " + edge2);;
      }
    }
  })
}

function collide(obj1, obj2) {
  if (obj1.is_solid) obj1.colliders.push(obj2);
  if (obj2.is_solid) obj2.colliders.push(obj1);
}
