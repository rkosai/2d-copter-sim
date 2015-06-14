function KeyControls() {
    this.q = false; // 81
    this.e = false; // 69
    this.w = false; // 87

    this.autopilot = new PositionControl();

    $(window).keydown(function (event) {
        if (event.which === 81) {
            this.q = true;
        }
        else if (event.which === 69){
            this.e = true;
        }
        else if (event.which === 87) {
            if (!this.w) { this.lockLatch = true; }
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
        }

    }.bind(this));
}

KeyControls.prototype.getThrust = function(sensors) {
    if (this.lockLatch) {
        this.autopilot.lockPosition(sensors.position);
        this.lockLatch = false;
    }

    if (this.w) {
        return this.autopilot.getThrust(sensors);
    }
    else {
        return ({
            left: this.q ? 20 : 0,
            right: this.e ? 20 : 0
        });
    }
};
