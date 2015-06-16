function Chart(opts) {
    this.div = opts.view;
    this.data_function = opts.data;
    this.max = opts.max;
    this.min = opts.min;
    this.fill = opts.fill;

    // Generate a canvas
    var h = this.div.height();
    var w = this.div.width();

    this.scale = h / (this.max - this.min);

    var c = $('<canvas>');
    c.height(h);
    c.width(w);
    c.attr("height", h);
    c.attr("width", w);
    c.css('position', 'absolute');
    this.div.append(c);

    this.canvas = c;
    this.ctx = this.canvas[0].getContext('2d');

    this.reset();
}

Chart.prototype.reset = function() {
    // Clear the canvas
    var h = this.ctx.canvas.height;
    var w = this.ctx.canvas.width;

    this.ctx.clearRect(0, 0, w, h);

    // Draw the baseline
    this.ctx.rect(0, h - ((0 - this.min) * this.scale) - 1, w, 1);
    this.ctx.fillStyle = '#CCC';
    this.ctx.fill();
};

Chart.prototype.update = function() {
    var ctx = this.ctx;
    var h = ctx.canvas.height;
    var w = ctx.canvas.width;
    var data = this.data_function();
    var y = (data - this.min) * this.scale;

    // Shift the existing data left by a pixel
    var imageData = ctx.getImageData(1, 0, w - 1, h);
    ctx.putImageData(imageData, 0, 0);

    // clear the right-most pixels
    ctx.clearRect(w - 1, 0, 1, h);

    // Draw the baseline
    this.ctx.rect(w - 1, h - ((0 - this.min) * this.scale) - 1, 1, 1);
    this.ctx.fillStyle = '#CCC';
    this.ctx.fill();

    // Draw the chart data
    ctx.beginPath();

    if (this.fill) {
        ctx.rect(
            ctx.canvas.width - 1,
            h - y - 1,
            1,
            y + this.min * this.scale
        );
    }
    else {
        ctx.rect(ctx.canvas.width - 1, h - y - 1, 1, 1);
    }

    ctx.strokeStyle = '#B7B';
    ctx.stroke();
    ctx.closePath();
};
