function Flyer() {
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

    // kilograms, kilogram * meters**2
    this.state = {
        engine_distance: 0.1,
        mass: 10,
        moment_inertia: 1
    };
}

Flyer.prototype.setPosition = function(x, y) {
    this.linear.x = x;
    this.linear.y = y;
};
