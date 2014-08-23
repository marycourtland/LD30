function castAsCharacter(obj) {
  if (obj.kind.indexOf("object") != -1) {
    obj.kind = obj.kind.replace("object", "character");
  }
  else obj.kind = obj.kind + "_character";
  obj.inventory = [];
  obj.holds = function(item, offset) {
    if (offset == null) offset = xy(-20, 0);
    item.hold_offset = offset;
    item.ignore('held');
    item.obey('held', heldBy(obj, offset));
    this.inventory.push(item);
  }
  obj.drops = function(item, relocation) {
    if (this.inventory.indexOf(item) == -1) return;
    item.ignore('held');
    this.inventory.splice(this.inventory.indexOf(item), 1);
    if (relocation != null) {
      item.move(relocation);
    }
  }
  obj.switchHands = function() {
    if (this.inventory.length == 0) return;
    this.inventory[0].hold_offset.xreflect();
    this.inventory[0].ignore('held');
    this.inventory[0].obey('held', heldBy(obj, this.inventory[0].hold_offset));
  }
  
  obj.comment = null;
  obj.commentOffset = null;

  obj.say = function(txt, offset) {
    duration = 4; // number of seconds to keep the text lingering
    obj.comment = txt;
    obj.comment_offset = offset? offset : xy(5, -35);
    _this = this;
    setTimeout(function() { _this.comment = null; }, duration*1000);
  }


  obj.on('draw', function() {
    if (obj.comment != null) {
      draw.text(obj.ctx, obj.comment, add(obj.pos, obj.comment_offset), 'sw', {fill: game.display.font.color});
    }
  });
  return obj
}
