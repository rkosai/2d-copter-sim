function KeyControls() {
    this.q = false; // 81
    this.e = false; // 69

    $(window).keydown(function (event) {
        if (event.which === 81) {
            this.q = true;
        }
        else if (event.which === 69){
            this.e = true;
        }
    }.bind(this));

    $(window).keyup(function (event) {
        if (event.which === 81) {
            this.q = false;
        }
        else if (event.which === 69){
            this.e = false;
        }
    }.bind(this));
}

KeyControls.prototype.getThrust = function(sensors) {
    return ({
        left: this.q ? 20 : 0,
        right: this.e ? 20 : 0
    });
};
