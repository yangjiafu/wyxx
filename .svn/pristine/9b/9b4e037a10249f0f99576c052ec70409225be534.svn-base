(function () {
    angular.module('app')
        .controller('newCtrl',['$scope','$state',"dataService","dataShareService","$log","$stateParams","utilityService",function ($scope,$state,dataService,dataShareService,$log,$stateParams,utilityService) {
            $scope.modal = {
                shareData: dataShareService,
                news: []
            };
            $scope.loginId = 0;

            $scope.loadData = function () {
                dataService.getMessageList({
                    userId: dataService.userInfo.personId,
                    classifyId: $scope.loginId,
                    isRead: ""
                }).then(function (args) {
                    dataShareService.messageList = args;
                    $scope.modal.news.push(args);
                }, function (args) { });
            };


            $scope.toMessageClassify = function () {
                $state.go("messageClassify");
            };

            $scope.toMessageItem = function (item) {
                if (item.url != "") {
                    //$location.url(item.url);
                    //window.open(encodeURI(item.url), '_self');

                    $state.go("messageItemUrl", { classifyId: item.msgClassifyId, url: encodeURI(item.url) });

                }
                else {
                    // $state.go("messageItem", { id: item.msgId });
                    utilityService.alert('提示，暂无页面！');
                    return
                }
            };

            for (var i=1 ;i<=6;i++)
            {
                $scope.loginId++;
                $scope.loadData();
            }
        }])
})();