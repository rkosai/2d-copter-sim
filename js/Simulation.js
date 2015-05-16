function Simulation(env) {
    this.step = 0.1;
    this.env = env;
    this.flyers = [];
    this._tickCompleteHandler = null;
}

Simulation.prototype.addFlyer = function(flyer) {
    this.flyers.push(flyer);
};

Simulation.prototype.start = function() {
    window.setInterval(this._tick.bind(this), 1000 * this.step);
};

Simulation.prototype._tick = function() {
    // TBD: Do simulation here

    if (this._tickCompleteHandler) {
        this._tickCompleteHandler();
    }
};

Simulation.prototype.onTickComplete = function(func) {
    this._tickCompleteHandler = func;
};
