function Simulation(env) {
    this.env = env;
    this.step = env.step;
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

Simulation.prototype._tickFlyer = function(f) {
    f.sensors.update();

    // Apply gravity
    f.linear.v_y += this.step * -9.81;

    // Check for thrust
    // TBD: fix this interface
    if (f.controller) {
        var thrust = f.controller.getThrust(f.sensors);

        // Linear adjustments
        f.linear.v_y += this.step * thrust.left * Math.cos(f.angular.theta);
        f.linear.v_y += this.step * thrust.right * Math.cos(f.angular.theta);
        f.linear.v_x -= this.step * thrust.left * Math.sin(f.angular.theta);
        f.linear.v_x -= this.step * thrust.right * Math.sin(f.angular.theta);

        // Torque adjustments
        f.angular.velocity += this.step * thrust.right / f.state.moment_inertia;
        f.angular.velocity -= this.step * thrust.left / f.state.moment_inertia;

        // Update f state
        f.engines.left = thrust.left;
        f.engines.right = thrust.right;
    }

    // TBD: Apply terminal velocity

    // If the f is at the ground, reset the simulation
    if (f.linear.y <= 0) {
        f.linear.y = 0;
        f.angular.theta = 0;

        if (f.linear.v_y < 0) {
            f.linear.v_y = 0;
            f.angular.velocity = 0;
        }

        for (var i = 0; i < this._resetHandlers.length; i++) {
            this._resetHandlers[i]();
        }
    }

    // Adjust linear position based on velocities
    f.linear.y += f.linear.v_y * this.step;
    f.linear.x += f.linear.v_x * this.step;

    // Adjust angular position based on velocities
    f.angular.theta += f.angular.velocity * this.step;
};

Simulation.prototype.onTickComplete = function(func) {
    this._tickCompleteHandlers.push(func);
};

Simulation.prototype.onSimulationReset = function(func) {
    this._resetHandlers.push(func);
};
