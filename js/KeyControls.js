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
    });

    $(window).keyup(function (event) {
        if (event.which === 81) {
            this.q = false;
        }
        else if (event.which === 69){
            this.e = false;
        }
    });
}

KeyControls.prototype.getState = function() {
    return ({
        q: this.q,
        e: this.e
    });
};

