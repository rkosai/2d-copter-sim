function Renderer(opts) {
    // TBD validation

    this.sim = opts.sim;
    this.view = opts.view;
    this.canvas = {};
    this.ctx = {};

    this.dimensions = {
        h: $(window).height(),
        w: $(window).width() - 400,
        scale: opts.scale
    };

    this._initializeView();
    this.sim.onTickComplete(this.render.bind(this));
}

Renderer.GROUND_OFFSET = 100;

Renderer.prototype._initializeView = function() {
    var dim = this.dimensions;

    // Set view size
    this.view.height(dim.h);
    this.view.width(dim.w);

    // Make canvas set
    this.canvas.background = this._generateBackground();
    this.canvas.dots = this._makeCanvas();
    this.canvas.flyer = this._makeCanvas();

    // Store the context for performance
    this.ctx.flyer = this.canvas.flyer[0].getContext('2d');
};

Renderer.prototype._generateBackground = function() {
    var dim = this.dimensions;

    this.canvas.background = this._makeCanvas();
    var ctx = this.canvas.background[0].getContext('2d');

    // Draw the ground
    ctx.rect(0, 0, dim.w, dim.h - Renderer.GROUND_OFFSET);
    ctx.fillStyle = '#C2E1F7';
    ctx.fill();

    var drawVerticalLine = function(pixel, x) {
        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        ctx.lineTo(pixel.x, 0);
        ctx.closePath();
        ctx.strokeStyle = '#AECADE';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#777';
        ctx.font = '11px Arial';
        ctx.fillText(x + 'm', pixel.x + 5, 15);
    };

    // Draw vertical grid lines and labels
    var x = 0;
    var pixel = this._physicalToPixel({x: x, y: 0});
    while (pixel.x >= 0) {
        drawVerticalLine(pixel, x);
        x -= 2;
        pixel = this._physicalToPixel({x: x, y: 0});
    }

    // Draw vertical grid lines and labels
    x = 2;
    pixel = this._physicalToPixel({x: x, y: 0});
    while (pixel.x <= dim.w) {
        drawVerticalLine(pixel, x);
        x += 2;
        pixel = this._physicalToPixel({x: x, y: 0});
    }

    // Draw horizontal
    var drawHorizontalLine = function(pixel, y) {
        ctx.beginPath();
        ctx.moveTo(pixel.x, pixel.y);
        ctx.lineTo(-1 * pixel.x, pixel.y);
        ctx.closePath();
        ctx.strokeStyle = '#AECADE';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#777';
        ctx.font = '11px Arial';
        ctx.fillText(y + 'm', 5, pixel.y - 5);
    };

    // Draw vertical grid lines and labels
    var y = 0;
    var pixel = this._physicalToPixel({x: x, y: y});
    while (pixel.y >= 20) {
        drawHorizontalLine(pixel, y);
        y += 2;
        pixel = this._physicalToPixel({x: x, y: y});
    }
};

Renderer.prototype._physicalToPixel = function(coord) {
    var dim = this.dimensions;

    var zeroX = Math.floor(dim.w / 2);
    var zeroY = dim.h - Renderer.GROUND_OFFSET;

    return {
        x: zeroX + coord.x * dim.scale,
        y: zeroY - coord.y * dim.scale
    };
};

Renderer.prototype._pixelToPhysical = function(coord) {
    var dim = this.dimensions;

    var zeroX = Math.floor(dim.w / 2);
    var height = dim.h - Renderer.GROUND_OFFSET;

    return {
        x: (coord.x - zeroX) / dim.scale,
        y: (height - coord.y) / dim.scale
    };

};

Renderer.prototype._makeCanvas = function() {
    var dim = this.dimensions;

    var c = $('<canvas>');
    c.height(dim.h);
    c.width(dim.w);
    c.attr("height", dim.h);
    c.attr("width", dim.w);
    c.css('position', 'absolute');
    this.view.append(c);
    return c;
};

Renderer.prototype.render = function() {
    this._drawFlyers();

    // TBD: remove me.
    this._checkFlyerBounds();
};

Renderer.prototype._drawFlyers = function() {
    var ctx = this.ctx.flyer;
    var dim = this.dimensions;

    // Clear the flyer canvas
    ctx.clearRect(0, 0, dim.w, dim.h);

    // Draw the flyers
    var flyers = this.sim.getFlyers();
    for (var i = 0 ; i < flyers.length; i++) {
        var f = flyers[i];
        var center = this._physicalToPixel({
            x: f.linear.x,
            y: f.linear.y
        });

        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(-1 * f.angular.theta);
        ctx.fillStyle = '#555';
        ctx.fillRect(-0.5 * dim.scale, 0, 1 * dim.scale, -3);
        ctx.fillRect(-0.2 * dim.scale, -3, 0.4 * dim.scale, -4);

        ctx.restore();
    }
};

Renderer.prototype._checkFlyerBounds = function() {
    var flyers = this.sim.getFlyers();
    for (var i = 0; i < flyers.length; i++) {
        var f = flyers[i];

        var center = this._physicalToPixel({
            x: f.linear.x,
            y: f.linear.y
        });

        if ((center.x < 0) || (center.x > this.dimensions.w)){
            f.reset();
        }

        if (center.y < 0) {
            f.reset();
        }
    }
};
