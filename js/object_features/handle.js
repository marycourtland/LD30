function handle(obj) {  // Allow the user to click & drag it
  obj.is_handled = true;
  obj.kind = "draggable_" + obj.kind;
  obj.onmousedown = function() {
    if (this.is_dynamic) this.freeze();
  }
  obj.ondrag = function() {
    this.move(mouse.velocity);
  }
  obj.onmouseup = function() {
    if(this.is_dynamic) {
      this.unfreeze();
    }
  }
  return obj;
}
