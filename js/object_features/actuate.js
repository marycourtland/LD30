function actuate(obj) { // Allow it to move & obey forces
  // todo: add mass or something (or include it in the vector field)
  obj.kind = "dynamic_" + obj.kind;
  obj.is_dynamic = true;
  obj.velocity = xy(0, 0);
  obj.frozen = false;
  obj.forces = {};
  
  obj.getVelocity = function() { return this.velocity; }
  
  obj.on('tick', function() {
    if (this.frozen) return;
    for (i in this.forces) {
      if (!this.forces[i]) continue;
      type = this.forces[i].type;
      
      if (type.length >= 4 && type.slice(0, 4) == 'temp') {
        this.forces[i].countdown -= 0;
        if (this.forces[i].countdown < 0) continue;
        type = type.replace('temp ', '');
      }
      
      if (type == 'effect') {
        this.forces[i].at(this);
      }
      else if (type == 'acceleration') {
        this.velocity.add(this.forces[i].at(this));
      }
      else if (type == 'velocity') {
        this.move(this.forces[i].at(this));
      }
    }
  })
  
  obj.on('tick', function() {
    if (this.frozen) return;
    this.move(this.velocity);
  })
  
  obj.on('tick', function() {
    if (this.velocity.r > 0) this.dir = this.velocity.th;
  });
  
  obj.obey = function(id, vectorfield) { this.forces[id] = vectorfield;}
  obj.ignore = function(id) { if (!(id in this.forces)) return; delete this.forces[id];}
  
  obj.freeze = function(){ this.frozen = true; }
  obj.unfreeze = function(){ this.frozen = false; }
  
  return obj;
}