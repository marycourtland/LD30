// Requires math2D.js

// Todo: separate references to the global game var (in the mouse.evt_down)
// Specifically: when searching for a clicked object, this needs to be done by the game, not the mouse.

var mouse = {

  STATE_DOWN: "mouse down",
  STATE_UP: "mouse up",
  STATE_DRAG: "mouse drag",
  MOTION_STILL: "still",
  MOTION_MOVING: "moving",
  MOTION_STOPPED: "stopped", // same as MOTION_STILL, but only for one frame after moving

  pos: xy(0, 0),
  delta: xy(0, 0),
  velocity: xy(0, 0),
  motion: "still",
  state: "mouse up",
  has_new_pos: false,
  clicked_object: null,
  canvas: null,
  game: null,


  init: function(game) {
    this.game = game;
    this.canvas = game.ctx.canvas;
    this.canvas.addEventListener("mousemove", function(event) { mouse.evt_move(event); });
    this.canvas.addEventListener("mousedown", function(event) { mouse.evt_down(event); });
    this.canvas.addEventListener("mouseup", function(event) { mouse.evt_up(event); });
    game.mouse = this;
  },

  calcCanvasPos: function(event) {
    if (navigator.userAgent.match(/Firefox/i)) {
      return xy(event.layerX - canvas.offsetLeft, event.layerY - canvas.offsetTop);
    }
    else if (navigator.userAgent.match(/Chrome/i)) {
      return xy(event.layerX, event.layerY);
    }
    else if (navigator.userAgent.match(/MSIE/i)) {
      return xy(event.x - canvas.offsetLeft, event.y - canvas.offsetTop);
    }
    else {
      // This is the same as the Chrome code
      return xy(event.layerX, event.layerY);
    }
  },
  
  update: function() {
    if (!this.has_new_pos) {
      if (this.motion == this.MOTION_MOVING) {
        this.motion = this.MOTION_STOPPED;
      }
      else {
        this.motion = this.MOTION_STILL;
        this.velocity = xy(0, 0);
      }
    }
    this.has_new_pos = false;
  },

  set_pos: function(new_pos) {
    this.pos = new_pos;
    this.has_new_pos = true;
  },

  evt_move: function(event) {
    var last_pos = this.pos;
    this.set_pos(this.calcCanvasPos(event));
    this.velocity = subtract(this.pos, last_pos);
    this.motion = this.MOTION_MOVING;
    
    if (this.state == this.STATE_DOWN) {
      this.state = this.STATE_DRAG;
    }

    // Pass drag event to the object which was clicked on the previous mousedown
    if (this.state == this.STATE_DRAG && this.clicked_object) {
      this.clicked_object.do('drag', this.pos, this.velocity);
    }
  },

  evt_down: function(event) {
    this.state = this.STATE_DOWN;

    if (!this.game) { return; }

    // determine which game object has been clicked
    // (i.e. the frontmost handle-able object)
    var _this = this;
    this.game.objects.forEach(function(obj) {
      if (obj.contains && obj.contains(_this.pos)) {
        _this.clicked_object = obj;
      }
    })

    // pass the event to the object
    if (this.clicked_object) {
      this.clicked_object.do('mousedown', this.pos);
    }
  },

  evt_up: function(event) {
    // Pass click to clicked object
    if (this.state == this.STATE_DOWN && this.clicked_object) {
      this.clicked_object.do('click', this.pos);
    }
    
    // Pass mouseup to clicked object
    if (this.clicked_object) {
      this.clicked_object.do('mouseup', this.pos);
    }
    
    this.state = this.STATE_UP;
    this.clicked_object = null;
  },

  // Calling this function on a GameObject ensures that clicks are passed to its child objects
  // The object must have a array of child objects
  // TODO: move this to the gameobject itself
  config_container_mouse_evts: function(parent) {
    parent.clicked_object = null;
    parent.on('drag', function(velocity) {
    })
    parent.on('mousedown', function(pos) {
      for (var i = 0; i < this.children.length; i++) { 
        obj = this.children[i]
        if (obj.contains && obj.contains(pos)) this.clicked_object = obj;
      }
      if (this.clicked_object) {
        this.clicked_object.do('mousedown', pos);
      }
    })
    parent.on('mouseup', function(pos) {
      if (this.clicked_object) {
        this.clicked_object.do('click', pos);
        this.clicked_object.do('mouseup', pos);
      }
      this.clicked_object = null;
    })
  }

}