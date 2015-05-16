function Renderer(opts) {
    // TBD validation

    this.sim = opts.sim;
    this.view = opts.view;
    this.scale = opts.scale;

    this._initializeView();
    this.sim.onTickComplete(this.render.bind(this));
}

Renderer.prototype._initializeView = function() {

};

Renderer.prototype.render = function() {
    //console.log('render');
};

