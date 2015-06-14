function ClickControls(renderer) {
    this.autopilot = new PositionControl();
    this.renderer = renderer;

    // Add click handler
    renderer.view.click(
        function(e) {
            var c = this.renderer._pixelToPhysical(
                { x: e.clientX, y: e.clientY }
            );

            console.log('lock', c);
            this.autopilot.lockPosition(c);
        }.bind(this)
    );
}

ClickControls.prototype.getThrust = function(sensors) {
    return this.autopilot.getThrust(sensors);
};
