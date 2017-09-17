(function () {
    angular.module('app')
        .controller('messageItemUrlCtrl',['$scope','$state','$stateParams','dataService','dataShareService','$log',function ($scope,$state,$stateParams,dataService,dataShareService,$log) {
            $scope.m = {
                url: $stateParams.url
            };

            $scope.toMessageList = function () {
                $state.go("messageList", { id: $stateParams.classifyId });
            };

            var setFrameSize = function () {
                var fh = window.screen.height - 100;
                angular.element("#myframe")[0].height = fh;
                angular.element("#myframe")[0].src = $scope.m.url;
            };
            setFrameSize();
        }])
})()