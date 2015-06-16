function Sensors(flyer) {
    this._flyer = flyer;

    this.engines = {
        left: 0,
        right: 0
    };

    this.velocity = {
        x: 0,
        y: 0,
        theta: 0
    };

    this.position = {
        x: 0,
        y: 0,
        theta: 0
    };
}

Sensors.prototype.update = function() {
    // TBD introduce variance options
    var f = this._flyer;

    this.engines.left = f.engines.left;
    this.engines.right = f.engines.right;

    this.velocity.x = f.linear.v_x;
    this.velocity.y = f.linear.v_y;
    this.velocity.theta = f.angular.velocity;

    this.position.x = f.linear.x;
    this.position.y = f.linear.y;

    // Set angular position
    var t = f.angular.theta % (Math.PI * 2);
    if (t > Math.PI) {
        t -= 2 * Math.PI;
    }
    else if (t < -1 * Math.PI) {
        t += 2 * Math.PI;
    }
    this.position.theta = t;
};
