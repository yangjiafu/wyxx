(function () {
    angular.module('app')
        .controller('MyInfo',['$scope','$state',function ($scope,$state) {
            // console.log('myInformation');
            // 判断身份证的格式
            // var card=$(".ID-card").val();
            // var isIDCard=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            $scope.judgeFormat="";

            $scope.$emit('navBtn','我的信息');
            $scope.$emit('showNav');

            //计算时间差
            $scope.jetLag = function (start,end){
                var startTime = start.replace(/[^0-9]/ig,"");
                var endTime = end.replace(/[^0-9]/ig,"");
                return parseInt((endTime-startTime)/1000/60)+'分'+(endTime-startTime)/1000%60+'秒';
            };


            $scope.actives = 'infor';
            $scope.goMyInfor = function (item) {
                $scope.actives = item;
            };
            $scope.goLearn = function (item) {
                $scope.actives = item;
            };
            $scope.goEdit = function (item) {
                $scope.actives = item;
            }
        }])
})();