function KeyControls() {
    this.q = false; // 81
    this.e = false; // 69
    this.w = false; // 87

    this.session = null;

    $(window).keydown(function (event) {
        if (event.which === 81) {
            this.q = true;
        }
        else if (event.which === 69){
            this.e = true;
        }
        else if (event.which === 87) {
            this.w = true;
        }

    }.bind(this));

    $(window).keyup(function (event) {
        if (event.which === 81) {
            this.q = false;
        }
        else if (event.which === 69){
            this.e = false;
        }
        else if (event.which === 87) {
            this.w = false;
            this.session = null;
        }

    }.bind(this));
}

KeyControls.prototype.getThrust = function(sensors) {
    if (this.w) {
        return this._stabilize(sensors);
    }
    else {
        return ({
            left: this.q ? 20 : 0,
            right: this.e ? 20 : 0
        });
    }
};

KeyControls.prototype._targetDelta = function(sensors, target) {
    var dx = sensors.position.x + sensors.velocity.x - target.x;
    var dy = sensors.position.y + sensors.velocity.y - target.y;

    return { dx: dx, dy: dy };
};

KeyControls.prototype._stabilize = function(sensors) {
    var left = 0, right = 0;

    // Cache starting location
    if (!this.session) {
        this.session = {
            x: sensors.position.x,
            y: sensors.position.y
        };
    }

    // Calculating error
    var t = this._targetDelta(sensors, this.session);

    // Drive future angle to zero
    var s = sensors.position.theta + sensors.velocity.theta;

    if (s > 0.05) {
        left = Math.min(s * 150, 4);
        right = 0;
    }
    else if (s < -0.05) {
        right = Math.min(Math.abs(s * 150), 4);
        left = 0;
    }

    // If we're off to the right, move it over a bit.
    if (t.dx > 1) {
        right += Math.min(t.dx * 0.10, 0.5);
    }
    else if (t.dx < -1) {
        left += Math.min(Math.abs(t.dx) * 0.10, 0.5);
    }

    // If we're below the target height, and we're pointed in the right
    // direction, run both engines.

    if ( (t.dy < 0.5) && (Math.abs(s) < (Math.PI / 4)) ) {
        left += Math.min(Math.abs(t.dy) * 3, 12);
        right += Math.min(Math.abs(t.dy) * 3, 12);
    }

    return {
        left: Math.min(left, 20),
        right: Math.min(right, 20)
    };
};
