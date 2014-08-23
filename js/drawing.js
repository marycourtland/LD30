// Requires math2D.js

var draw = {

  configContext: function(ctx, params) {
    if (!params) { return; }
    ctx.fillStyle = params.fill || "";
    ctx.strokeStyle = params.stroke || "black";
    ctx.lineWidth = params.linewidth || 1;
    ctx.lineCap = params.linecap || 'butt';
    ctx.globalAlpha = params.alpha || 1;
  },

  doDrawing: function(ctx, params, draw_function) {
    ctx.save();
    this.configContext(ctx, params);
    ctx.beginPath();
    draw_function();
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },

  clear: function(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },


  fill: function(ctx, color) {
    this.doDrawing(ctx, {fill:color}, function() {
      ctx.fillRect(x, y, ctx.canvas.width, ctx.canvas.height);
    })
  },


  line: function(ctx, p0, p1, params) {
    this.doDrawing(ctx, params, function() {
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
    })
  },

  rect: function(ctx, p0, p1, params) {
    this.doDrawing(ctx, params, function() {
      ctx.rect(p0.x+0.5, p0.y+0.5, p1.x-p0.x, p1.y-p0.y);
    })
  },

  rect_rounded: function(ctx, p0, p1, corner_radius, params) {
    var r = corner_radius;
    this.doDrawing(ctx, params, function() {
      ctx.moveTo(p0.x + r, p0.y);
      ctx.lineTo(p1.x - r, p0.y)
      ctx.arcTo(p1.x, p0.y, p1.x, p0.y + r, r);
      ctx.lineTo(p1.x, p1.y - r);
      ctx.arcTo(p1.x, p1.y, p1.x - r, p1.y, r);
      ctx.lineTo(p0.x + r, p1.y);
      ctx.arcTo(p0.x, p1.y, p0.x, p1.y - r, r);
      ctx.lineTo(p0.x, p0.y + r);
      ctx.arcTo(p0.x, p0.y, p0.x + r, p0.y, r);
    })
  },

  circle: function(ctx, center, radius, params) {
    this.doDrawing(ctx, params, function() {
      ctx.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
    })
  },

  bezier: function(ctx, p0, p1, c0, c1, params) {
    this.doDrawing(ctx, params, function() {
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(c0.x, c0.y, c1.x, c1.y, p1.x, p1.y);
    })
    if (params.show_controls) {
      marker(ctx, xy(c0.x, c0.y));
      marker(ctx, xy(c1.x, c1.y));
    }
  },

  text: function(ctx, txt, pos, pos_loc, params) {
    // Valid values for pos_loc:
    //  "centered"  the given pos will be in the center of the text
    //  "nw"        the given pos will be on the NW corner of the text
    //  "ne"        the given pos will be on the NE corner of the text
    //  "se"        the given pos will be on the SE corner of the text
    //  "sw"        the given pos will be on the SW corner of the text
    //  Anything else: same as "sw"

    if (!_.isArray(txt)) txt = [txt];
    ctx.save();

    this.configContext(params);
    console.log(params)

    if (pos != "center") pos = pos.copy();
    
    if (pos == "center")
      pos = xy(ctx.canvas.width/2 - ctx.measureText(txt).width/2, ctx.canvas.height/2 + ctx.fontsize/2);
    else if (!pos_loc || pos_loc.toLowerCase()=="nw")
      pos.add(xy(0, ctx.fontsize));
    else if (pos_loc.toLowerCase()=="ne")
      pos.add(xy(-ctx.measureText(txt).width, ctx.fontsize));
    else if (pos_loc.toLowerCase()=="se")
      pos.add(xy(ctx.measureText(txt).width, 0));
    else if (pos_loc.toLowerCase()=="centered")
      pos.add(xy(-ctx.measureText(txt).width/2, ctx.fontsize/2));
    
    for (var i=0; i < txt.length; i++) {
      if (typeof(txt[i]) != "string") continue;
      ctx.fillText(txt[i], pos.x, pos.y);
      pos.add(xy(0, ctx.fontsize));
    }
    ctx.restore();
  },

  marker: function(ctx, pos, params) {
    var size = params.size || 2;
    this.circle(ctx, pos, size, params);
  },

  // This requires colors.js
  getPixel: function(ctx, pos) {
    pos = vround(pos);
    var imd = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var index = 4 * ((pos.y * ctx.canvas.width) + pos.x);
    var rgba = [];
    for (var i=0; i<4; i++) rgba.push(imd.data[index + i]);
    return colors.rgb(rgba[0], rgba[1], rgba[2]);
  }
}