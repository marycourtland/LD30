// requires mouse.js
// requires math2D.js

function Game(params) {
  // Initialize game settings
  if (params == null) params = {};
  this.fps = 60,
  this.t0 = new Date().getTime(),
  this.mouse = null,
  this.display = {
    bg_color: params.bg_color? params.bg_color : 'white',
    font: null
  },
  this.state = {
    win: false,
    frame: 0
  },
  this.stage = null,
  this.objects = [],
  this.addObject = function(obj) { this.objects.push(obj); }
  this.setSize = function(size) {
    this.size = size;
    this.canvas.width = size.x;
    this.canvas.height = size.y;
  }
  this.setTitle = function(title) {
    this.title = title;
    window.document.title = title;
  }
  this.setFont = function(font) {
    this.display.font = font;
    this.ctx.font = this.display.font.size.toString() + "px " + this.display.font.type;
    this.ctx.fontsize = this.display.font.size;
    this.ctx.fontcolor = this.display.font.color || 'black';
  }
  
  // Create game canvas
  if (window.document.getElementById("game_canvas") == null) {
    this.canvas = window.document.createElement("canvas");
    window.document.body.appendChild(this.canvas);
  } else {
    this.canvas = window.document.getElementById("game_canvas")
  }
  this.canvas.style.backgroundColor = this.display.bg_color;

  // Initialize canvas context
  this.ctx = this.canvas.getContext("2d");
  
  this.setFont(params.font? params.font : {size: 18, type: 'Arial', color: 'black'});
  this.setSize(params.size? params.size : xy(600,400));
  this.setTitle(params.title? params.title : "New Game");
  mouse.init(this);
  keyboard.init(this);
  
  // Game loop
  this.start = function() {
    this.objects.forEach(function(obj) {
      if (obj.kind.indexOf('dynamic') == -1) actuate(obj);
    });
    this.setFont(this.display.font);
    this.next();
  }
  this.tick = function() {
    this.state.frame++;
    this.mouse.update();
    this.stage();
  }
  this.next = function() {
    if (!this.win) setTimeout(function() { game.tick() }, 1000/this.fps);
  }

  // Game stages
  this.titlescreen = function() {
    draw.clear(this.ctx);
    var old_font = this.display.font;
    this.setFont({size: 36, type: 'Arial', color: 'black'});
    draw.text(this.ctx, this.title, "center", "centered");
    this.setFont(old_font);
    setTimeout(function() { game.stage = game.gameplay; game.next(); }, 5*1000);
  }

  this.gameplay = function() {
    draw.clear(this.ctx);
    this.objects.forEach(function(obj) { obj.tick(); })
    this.objects.forEach(function(obj) { obj.draw(); })
    this.next();
  }
  
  this.stage = this.gameplay; // default stages
  
  // GAME EVENTS
  this.ctx.canvas.addEventListener("click", function(event) {
    console.log("Clicked at " + mouse.pos);
  })

}