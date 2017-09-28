(function () {
    angular.module("app")
    .controller("MyInfo.AccountManagerCtrl", ["$scope", "dataService", "$state", function ($scope, dataService, $state) {
        $scope.exitLogin = function () {
            dataService.exitLogin();
            $scope.$emit("exitLogin", null);
            $state.goto("login");
        };
    }]);
})();