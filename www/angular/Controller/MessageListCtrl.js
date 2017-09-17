﻿(function() {
    angular.module("app")
        .controller("MessageListCtrl", ["$scope", "dataService", "dataShareService", "$log", "$stateParams", "$state",
            function ($scope, dataService, dataShareService, $log, $stateParams, $state) {
                $scope.modal = {
                    shareData: dataShareService,
                    classifyId: $stateParams.id
                };

                $scope.loadData = function () {
                    $scope.modal.shareData.messageList = [];
                    dataService.getMessageList({
                        userId: dataService.userInfo.userId,
                        classifyId: $stateParams.id,
                        isRead: ""
                    }).then(function (args) {
                        dataShareService.messageList = args;
                    }, function (args) { });
                };

                $scope.$on("$ionicView.enter", function (event, data) {
                    $log.debug("enter message list");
                    $scope.loadData();
                });

                $scope.toMessageClassify = function () {
                    $state.go("tab.messageClassify");
                };
        }]);
})();
