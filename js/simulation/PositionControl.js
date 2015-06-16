function PositionControl() {
    this.env = new Environment();
    this.lock = { x: 0, y: 0 };
}

PositionControl.prototype.lockPosition = function(coord) {
    this.lock.x = coord.x;
    this.lock.y = coord.y;
};

PositionControl.prototype.getThrust = function(sensors) {
    var left = 0, right = 0;

    var future_angle = sensors.position.theta +
        sensors.velocity.theta * this.env.step * 15;


    // Special case for out-of-control
    if (sensors.velocity.theta > Math.PI / 2) {
        return { left: 20, right: 0 };
    }
    else if (sensors.velocity.theta < -1 * Math.PI / 2) {
        return { left: 0, right: 20 };
    }

    // TBD: Special case for low velocity and upside down

    // Calculating error
    var t = this._targetDelta(sensors, this.lock);

    // Drive future angle to zero
    var recovery_angle = t.dx * 0.1;
    recovery_angle = Math.min(recovery_angle, Math.PI / 4);
    recovery_angle = Math.max(recovery_angle, -1 * Math.PI / 4);

    var s = future_angle - recovery_angle;

    if (s > 0.05) {
        left = Math.min(s * 150, 4);
        right = 0;
    }
    else if (s < -0.05) {
        right = Math.min(Math.abs(s * 150), 4);
        left = 0;
    }

    // If we're below the target height, and we're pointed in the right
    // direction, run both engines.

    if ( (t.dy < 0) && (Math.abs(s) < (Math.PI / 4)) ) {
        left += Math.min(Math.abs(t.dy) * 10, 15);
        right += Math.min(Math.abs(t.dy) * 10, 15);
    }

    return {
        left: Math.min(left, 20),
        right: Math.min(right, 20)
    };

};

PositionControl.prototype._targetDelta = function(sensors, target) {
    var dx = sensors.position.x +
             sensors.velocity.x * this.env.step * 50 -
             target.x;

    var dy = sensors.position.y +
             sensors.velocity.y * this.env.step * 30 -
             target.y;

    return { dx: dx, dy: dy };
};

