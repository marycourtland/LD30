num_canvas_objects = 1;
function GameObject(game, params) {
  if (params == null) params = {};
  
  this.id = params.id? params.id : 'obj' + (num_canvas_objects-1).toString();
  this.kind ="object";
  this.reset = function() {};

  // Event actions
  // mouse-related actions should take 1 argument: the position of the mouse
  // except for drag, which takes the velocity of the mouse (see mouse.js)
  this.actions = {
    tick: [],
    draw: [],
    click: [],
    drag: [],
    mouseup: [],
    mousedown: [],
    mouseover: [],
    key_space: []
  }

  this.on = function(event_action, callback) {
    if (!(event_action in this.actions)) {
      this.actions[event_action] = [];
    }
    this.actions[event_action].push(callback);
  }

  // obj.do can be called with arguments, like this: obj.do('click', pos)
  this.do = function(event_action) {
    if (!(event_action in this.actions)) { return; }
    args = Array.prototype.slice.call(arguments, 1)
    for (var i = 0; i < this.actions[event_action].length; i++) {
      this.actions[event_action][i].apply(this, args);
    }
  }

  // aliases
  this.tick = function() { this.do('tick'); }
  this.draw = function() { this.do('draw'); }
  
  // Position and graphics-related settings
  this.ctx = game.ctx;
  this.pos = params.pos? params.pos : xy(0, 0);
  this.dir = 0; // in radians
  this.graphics = {
    color: "gray",
    lineWidth: 2,
    images: []
  };

  this.getPos = function() {
    return this.pos;
  };
  
  this.setPos = function(pos) {
    this.pos._set_xy(pos.x, pos.y);
  }

  this.placeAt = function(pos) { this.setPos(pos); } // alias

  this.replacePos = function(pos) {
    this.pos = pos;
  }

  this.contains = function(p) {
    return false;
  };

  this.move = function(delta) {
    this.pos.add(delta);
  };

  this.setImage = function(image_url, params) {
    if (params == null) params = {}
    var image = utility.loadImage(this.ctx, image_url);
    image.offset = params.offset ? params.offset : xy(0, 0);
    if (params.rotate) image.rotate = true;
    this.graphics.images.push(image);
  };

  this.on('draw', function() {
    for (var i = 0; i < this.graphics.images.length; i++) {
      img = this.graphics.images[i];
      offset = img.offset? img.offset : xy(0, 0);
      offset = add(offset, xy(-img.width/2, -img.height/2)); // By default, position the image's center at the pos
      if (img.rotate) {
        this.ctx.save();
        this.ctx.translate(this.pos.x, this.pos.y);
        this.ctx.rotate(this.dir);
        this.ctx.translate(-this.pos.x, -this.pos.y);
        this.ctx.drawImage(img, round(this.pos.x + offset.x, 0), round(this.pos.y + offset.y, 0));
        //this.ctx.rotate(-this.dir);
        this.ctx.restore();
      }
      else { 
        this.ctx.drawImage(img, round(this.pos.x + offset.x, 0), round(this.pos.y + offset.y, 0));
      }
    }
  })
  
  game.objects.push(this);
  
  if (!game.ctx.canvas.objects) game.ctx.canvas.objects = [];
  game.ctx.canvas.objects.push(this);
}
