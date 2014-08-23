function launch(obj) {  // Allow the user to "throw" it with the mouse
  obj.kind = "launchable_" + obj.kind;
  if (!obj.is_handled) handle(obj);
  obj.is_launchable = true;
  obj.onmouseup = function() {
    if(this.is_dynamic) {
      this.velocity.add(mouse.velocity);
      this.unfreeze();
    }
  }
  return obj;
}
