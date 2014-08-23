function configImages(obj, images) {
  obj.graphics.images = images;
  obj.on('draw', function() {
    for (var i=0; i < this.images.length; i++) {
      img = this.images[i];
      offset = img.offset ? img.offset : xy(0, 0);
      this.ctx.drawImage(img, round(this.pos.x + offset.x, 0), round(this.pos.y + offset.y, 0));
    }
  });
  return obj
}
