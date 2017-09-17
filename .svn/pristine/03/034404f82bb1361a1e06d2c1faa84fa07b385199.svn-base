(function() {
    angular.module("app")
        .controller("MessageItemCtrl", ["$scope", "$stateParams", "dataService", "dataShareService", "$log", "$state",
            function ($scope, $stateParams, dataService, dataShareService, $log, $state) {
                $scope.messageItem = null;
                $scope.id = $stateParams.id;
                $scope.modal = {
                    shareData: dataShareService,
                    id: $stateParams.id
                };

                $scope.loadData = function () {
                    for (var i = 0; i < $scope.modal.shareData.messageList.length; i++) {
                        if ($scope.modal.shareData.messageList[i].msgId && $scope.modal.shareData.messageList[i].msgId == $scope.id) {
                            $scope.messageItem = $scope.modal.shareData.messageList[i];
                            break;
                        }

                        if ($scope.modal.shareData.messageList[i].msgList) {
                            for (var j = 0; j < $scope.modal.shareData.messageList[i].msgList.length; j++) {
                                if ($scope.modal.shareData.messageList[i].msgList[j].msgId &&
                                    $scope.modal.shareData.messageList[i].msgList[j].msgId == $scope.id) {
                                    $scope.messageItem = $scope.modal.shareData.messageList[i].msgList[j];
                                    $scope.messageItem.sendTime = $scope.modal.shareData.messageList[i].sendTime;
                                    break;
                                }
                            }
                        }
                    }
                };

                $scope.toMessageList = function () {
                    $state.go("tab.messageList", $scope.messageItem.msgClassifyId);
                };

                $scope.$on("$ionicView.enter", function (event, data) {
                    $log.debug("enter message item");
                    $scope.loadData();
                });

                $scope.loadData();
        }]);
})();
