var app = angular.module('2d-copter-sim', []);

app.factory('ControlService', [function() {
    function ControlService() { }
    ControlService.MANUAL = 'MANUAL';
    ControlService.STABILIZE = 'STABILIZE';
    ControlService.AUTOPILOT = 'AUTOPILOT';

    ControlService.prototype.getOptions = function() {
        return [
            ControlService.MANUAL,
            ControlService.STABILIZE,
            ControlService.AUTOPILOT
        ];
    };

    ControlService.prototype.getSelected = function() {
        return this.selected;
    };

    ControlService.prototype.select = function(o) {
        var ctrl;

        this.selected = o;

        if (o === ControlService.MANUAL) {
            ctrl = new KeyControls();
        }
        else if (o === ControlService.STABILIZE) {
            ctrl = new StableKeyControls();
        }
        else if (o === ControlService.AUTOPILOT) {
            ctrl = new ClickControls(renderer);
        }

        flyer.setController(ctrl);

    };

    return new ControlService();
}]);

app.factory('MessageService', ['$timeout', function($timeout) {
    function MessageService() {
        this.visible = false;
        this.selected = null;
    }

    MessageService.MANUAL =
        "Press Q and E to control left and right engine.";
    MessageService.STABILIZE =
        "Press Q and E to control left and right engine, W to stabilize.";
    MessageService.AUTOPILOT =
        "Click to fly to target.";

    MessageService.prototype.getMessage = function() {
        return this.selected || "";
    };

    MessageService.prototype.setMessage = function(o) {
        if (o === 'MANUAL') {
            this.selected = MessageService.MANUAL;
        }
        else if (o === 'STABILIZE') {
            this.selected = MessageService.STABILIZE;
        }
        else if (o === 'AUTOPILOT') {
            this.selected = MessageService.AUTOPILOT;
        }

        $timeout(function () {this.selected = '';}.bind(this), 4000);
    };

    return new MessageService();
}]);


app.controller('SelectCtrl', [
    '$scope',
    'ControlService',
    'MessageService',
    function ($scope, ControlService, MessageService) {
        $scope.options = ControlService.getOptions();

        $scope.class = function(o) {
            var classes = ['box'];
            if(ControlService.getSelected() === o) {
                classes.push('selected');
            }
            return classes;
        };

        $scope.select = function(o) {
            ControlService.select(o);
            MessageService.setMessage(o);
        };
    }
]);

app.controller('StartingCtrl', [
    '$scope',
    'ControlService',
    'MessageService',
    function ($scope, ControlService, MessageService) {
        $scope.started = false;

        $scope.select = function(o) {
            ControlService.select(o);
            sim.start();
            $scope.started = true;

            MessageService.setMessage(o);
        };
    }
]);

app.controller('MessageCtrl', [
    '$scope',
    'MessageService',
    function ($scope, MessageService) {
        $scope.getText = function() {
            return MessageService.getMessage();
        };
    }
]);

