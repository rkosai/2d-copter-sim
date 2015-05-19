function Simulation(env) {
    this.step = 0.01;
    this.env = env;
    this.flyers = [];
    this._tickCompleteHandler = null;
    this.time = 0;

}

Simulation.prototype.addFlyer = function(flyer) {
    this.flyers.push(flyer);
};

Simulation.prototype.getFlyers = function() {
    return this.flyers;
};

Simulation.prototype.start = function() {
    window.setInterval(this._tick.bind(this), 1000 * this.step);
};

Simulation.prototype._tick = function() {
    this.time += this.step;

    // Apply physics to each flyer
    for (var i = 0; i < this.flyers.length; i++) {
        this._tickFlyer(this.flyers[i]);
    }

    if (this._tickCompleteHandler) {
        this._tickCompleteHandler();
    }
};

Simulation.prototype._tickFlyer = function(flyer) {
    // Apply gravity
    flyer.linear.v_y += this.step * -9.81;

    // Check for thrust
    if (flyer.controller) {
        var state = flyer.controller.getState();

        // Linear adjustments
        flyer.linear.v_y += this.step * state.q * Math.cos(flyer.angular.theta);
        flyer.linear.v_y += this.step * state.e * Math.cos(flyer.angular.theta);
        flyer.linear.v_x -= this.step * state.q * Math.sin(flyer.angular.theta);
        flyer.linear.v_x -= this.step * state.e * Math.sin(flyer.angular.theta);

        // Torque adjustments
        flyer.angular.velocity += this.step * state.e / flyer.state.moment_inertia;
        flyer.angular.velocity -= this.step * state.q / flyer.state.moment_inertia;
    }

    // TBD: Apply terminal velocity

    // If the flyer is at the ground, stop
    if (flyer.linear.y <= 0) {
        flyer.linear.y = 0;
        flyer.angular.theta = 0;

        if (flyer.linear.v_y < 0) {
            flyer.linear.v_y = 0;
            flyer.angular.velocity = 0;
        }
    }

    // Adjust linear position based on velocities
    flyer.linear.y += flyer.linear.v_y * this.step;
    flyer.linear.x += flyer.linear.v_x * this.step;

    // Adjust angular position based on velocities
    flyer.angular.theta += flyer.angular.velocity;
};

Simulation.prototype.onTickComplete = function(func) {
    this._tickCompleteHandler = func;
};
