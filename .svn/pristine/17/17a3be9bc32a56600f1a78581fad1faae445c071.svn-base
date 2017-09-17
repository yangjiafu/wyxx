(function () {
    angular.module("app")
    .controller("MyInfo.BaseInfoCtrl", ["$scope", "dataService", function ($scope, dataService) {
        $scope.account = dataService.userInfo.account;
        $scope.personName = dataService.userInfo.userName;
        $scope.personPhone = "";
        $scope.personInfo = null;

        $scope.init = function () {
            dataService.getPersonInfo({
                account: dataService.userInfo.account
            }).then(function (args) {
                $scope.personInfo = args;
            })
        };

        $scope.save = function () {
            if (!dataService.userInfo) {
                alert("请先登录");
                return;
            }
            if ($scope.personInfo.name == "") {
                alert("必须填写姓名");
                return;
            }

            if ($scope.personInfo.mobilePhone == "") {
                alert("必须填写电话号码");
                return;
            }
            // if ($scope.personName == "") {
            //     alert("必须填写姓名");
            //     return;
            // }
            //
            // if ($scope.personPhone == "") {
            //     alert("必须填写电话号码");
            //     return;
            // }
            dataService.savePersonBaseInfo({
                personName: $scope.personInfo.name,
                personPhone: $scope.personInfo.mobilePhone
            }).then(function (args) {
                alert("信息已经保存");
            }, function (args) {
                alert("信息保存失败");
            });
        };

        $scope.init();
    }]);
})();