function Flyer() {
    // kilograms, kilogram * meters**2
    this.state = {
        engine_distance: 0.5,
        mass: 10,
        moment_inertia: 1
    };

    this.reset();

    this.sensors = new Sensors(this);
}

Flyer.prototype.setPosition = function(x, y) {
    this.linear.x = x;
    this.linear.y = y;
};

Flyer.prototype.setController = function(ctrl) {
    this.controller = ctrl;
};

Flyer.prototype.reset = function() {
    this.linear = {
        x: 0,
        y: 0,
        v_x: 0,
        v_y: 0
    };

    this.angular = {
        theta: 0,
        velocity: 0
    };

    this.engines = {
        left: 0,
        right: 0
    };
};
