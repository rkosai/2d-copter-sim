function Sensors(flyer) {
    this.flyer = flyer;
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

    this.engines.left = this.flyer.engines.left;
    this.engines.left = this.flyer.engines.right;

    this.velocity.x = this.flyer.linear.v_x;
    this.velocity.y = this.flyer.linear.v_y;
    this.velocity.theta = this.flyer.angular.velocity;

    this.position.x = this.flyer.linear.x;
    this.position.y = this.flyer.linear.y;
    this.position.theta = this.flyer.angular.theta;
};
