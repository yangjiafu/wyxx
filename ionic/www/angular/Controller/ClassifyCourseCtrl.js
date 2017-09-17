(function () {
    angular.module("app")
        .controller("ClassifyCourseCtrl", ["$scope", "$stateParams", "$state", function ($scope, $stateParams, $state) {
            $scope.m = {};

            $scope.m.list = $stateParams.courseList;
            $scope.m.title = $stateParams.className;
            $scope.goBack = function () {
                $state.go("tab.allCourseList");
            };
            $scope.toCourse = function (courseId) {
                $state.go("tab.allCourseItem", { id: courseId, parent: "classifyCourse", className: $scope.m.title, courseList: $scope.m.list });
            };
        }])
})();