(function () {
    angular.module("app")
    .controller("MyInfo.UpdatePasswordCtrl", ["$scope", "dataService", function ($scope, dataService) {
        $scope.password = "";
        $scope.repeatPassword = "";
        $scope.savePassword = function () {
            if (!dataService.userInfo) {
                alert("请先登录");
                return;
            }

            if ($scope.password === "") {
                alert("必须填写密码");
                return;
            }
            if ($scope.repeatPassword === "") {
                alert("必须填写重复密码");
                return;
            }
            if ($scope.password != $scope.repeatPassword) {
                alert("两次输入的密码不一致");
                return;
            }

            dataService.saveNewPassword($scope.password).then(function (args) {
                alert("密码已经修改");
            }, function (args) {
                alert("密码修改失败");
            });
        };
    }]);
})();