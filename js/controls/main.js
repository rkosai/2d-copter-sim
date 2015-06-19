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

app.controller('SelectCtrl', [
    '$scope',
    'ControlService',
    function ($scope, ControlService) {
        $scope.options = ControlService.getOptions();

        $scope.class = function(o) {
            var classes = ['box'];
            if($scope.selected === o) {
                classes.push('selected');
            }
            return classes;
        };

        $scope.select = function(o) {
            $scope.selected = o;
            ControlService.select(o);
        };

        // Initialize controller with manual controls
        $scope.select($scope.options[0]);
    }
]);

app.controller('StartingCtrl', [
    '$scope',
    'ControlService',
    function ($scope, ControlService) {
        $scope.started = false;

        $scope.select = function(o) {
            ControlService.select(o);
            sim.start();
            $scope.started = true;
        };
    }
]);

