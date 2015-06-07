function Simulation(env) {
    this.step = 0.02;
    this.env = env;
    this.flyers = [];
    this._tickCompleteHandlers = [];
    this._resetHandlers = [];
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

    if (this._tickCompleteHandlers.length > 0) {
        for (var i = 0; i < this._tickCompleteHandlers.length; i++) {
            this._tickCompleteHandlers[i](this.time);
        };
    }
};

Simulation.prototype._tickFlyer = function(flyer) {
    flyer.sensors.update();

    // Apply gravity
    flyer.linear.v_y += this.step * -9.81;

    // Check for thrust
    // TBD: fix this interface
    if (flyer.controller) {
        var thrust = flyer.controller.getThrust();

        // Linear adjustments
        flyer.linear.v_y += this.step * thrust.left * Math.cos(flyer.angular.theta);
        flyer.linear.v_y += this.step * thrust.right * Math.cos(flyer.angular.theta);
        flyer.linear.v_x -= this.step * thrust.left * Math.sin(flyer.angular.theta);
        flyer.linear.v_x -= this.step * thrust.right * Math.sin(flyer.angular.theta);

        // Torque adjustments
        flyer.angular.velocity += this.step * thrust.right / flyer.state.moment_inertia;
        flyer.angular.velocity -= this.step * thrust.left / flyer.state.moment_inertia;

        // Update flyer state
        flyer.engines.left = thrust.left;
        flyer.engines.right = thrust.right;
    }

    // TBD: Apply terminal velocity

    // If the flyer is at the ground, reset the simulation
    if (flyer.linear.y <= 0) {
        flyer.linear.y = 0;
        flyer.angular.theta = 0;

        if (flyer.linear.v_y < 0) {
            flyer.linear.v_y = 0;
            flyer.angular.velocity = 0;
        }

        for (var i = 0; i < this._resetHandlers.length; i++) {
            this._resetHandlers[i]();
        }
    }

    // Adjust linear position based on velocities
    flyer.linear.y += flyer.linear.v_y * this.step;
    flyer.linear.x += flyer.linear.v_x * this.step;

    // Adjust angular position based on velocities
    flyer.angular.theta += flyer.angular.velocity;
};

Simulation.prototype.onTickComplete = function(func) {
    this._tickCompleteHandlers.push(func);
};

Simulation.prototype.onSimulationReset = function(func) {
    this._resetHandlers.push(func);
};
