(function () {
    angular.module("app")
    .controller("learnRecordCtrl", ["$scope", "dataService", "myConfig", "$state", "$log",
        function ($scope, dataService, myConfig, $state, $log) {
            $scope.m = {
                learnInfoCount: 0,
                learnInfoList: []
            };

            $scope.$on("onPageChanged", function (event, data) {
                learnInfoPageNumber++;
                $scope.m.refreshLearnInfo();
            });
            $scope.goCourseItem = function (courseId) {
                $state.go('courseItem',{id:courseId})
            }


            var learnInfoPageNumber = 0;
            $scope.m.refreshLearnInfo = function () {
                dataService.getLearnRecord({
                    personId: dataService.userInfo.personId,
                    start: learnInfoPageNumber * 10,
                    limit: 10
                }).then(function (args) {
                    $scope.m.learnInfoCount = args.count;
                    $scope.m.learnInfoList = args.list;
                    for (var i = 0; i < args.list.length; i++) {
                        args.list[i].img = myConfig.filesUrl + "/courses/" + args.list[i].courseName + args.list[i].courseNameEx+".jpg";
                    }
                }, function (args) {
                });
            };

            $scope.m.refreshLearnInfo();
        }]);
})();