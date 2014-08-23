// Allow the user to move it around w/ keys
function navigate(obj, keydirs, nav_speed, freeze) {  
  obj.kind = "navigated_" + obj.kind;
  obj.is_navigated = true;
  obj.navigation = [];
  if (nav_speed == null) obj.nav_speed = 3;
  else obj.nav_speed = nav_speed;
  obj.on('tick', function() {
    if (this.navigation.length == 0) return;
    dx = xy(0, 0);
    for (var i=0; i < this.navigation.length; i++) {
      if (this.navigation[i] == 'left') dx.add(xy(-1, 0));
      if (this.navigation[i] == 'right') dx.add(xy(1, 0));
      if (this.navigation[i] == 'up') dx.add(xy(0, -1));
      if (this.navigation[i] == 'down') dx.add(xy(0, 1));
    }
    dx.normalize(this.nav_speed);
    this.move(dx);
    this.dir = dx.th;
  });
  
  window.addEventListener("keydown", function(event) {
    key = keyboard.getKey(event);
    if (key in keydirs) {
      for (var i=0; i < obj.navigation.length; i++) {
        if (obj.navigation[i] == keydirs[key]) return;
      }
      obj.navigation.push(keydirs[key]);
      if (obj.is_dynamic && freeze) obj.freeze();
    }
  }, false);
  window.addEventListener("keyup", function(event) {
    key = keyboard.getKey(event);
    if (obj.navigation.indexOf(keydirs[key]) != -1)
      obj.navigation.splice(obj.navigation.indexOf(keydirs[key]), 1);
    if (obj.navigation.length == 0 && obj.unfreeze) obj.unfreeze();
  });
  return obj;
}
function navigateDiscrete(obj, keydirs, speed, freeze) {  
  obj.kind = "navigated_" + obj.kind;
  obj.is_navigated = true;
  obj.navigation = [];
  if (speed == null) obj.speed = 3;
  else obj.speed = speed;
  obj.on('tick', function() {
    if (this.navigation.length == 0) return;
    dx = xy(0, 0);
    for (var i=0; i < this.navigation.length; i++) {
      if (this.navigation[i] == 'left') dx.add(xy(-1, 0));
      if (this.navigation[i] == 'right') dx.add(xy(1, 0));
      if (this.navigation[i] == 'up') dx.add(xy(0, -1));
      if (this.navigation[i] == 'down') dx.add(xy(0, 1));
    }
    dx.normalize(this.speed);
    obj.move(dx);
  });
  window.addEventListener("keydown", function(event) {
    var key = keyboard.getKey(event);
    if (key in keydirs) key = keydirs[key];
    if (key == 'left') obj.move(xy(-block_size.x, 0));
    if (key == 'right') obj.move(xy(block_size.x, 0));
    if (key == 'up') obj.move(xy(0, -block_size.y));
    if (key == 'down') obj.move(xy(0, block_size.y));
  });
  return obj;
}