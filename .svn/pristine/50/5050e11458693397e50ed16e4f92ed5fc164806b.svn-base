(function () {
    angular.module('app')
        .directive('star',function () {
            return {
                priority:-10,
                restrict: 'AE',
                template: '<ul class="rating" ng-mouseleave="leave()">' +
                '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' +
                '<span class="iconfont ">&#xe6ec;</span>' +
                '</li>' +
                '</ul>',
                scope: {
                    ratingValue: '=',
                    max: '=',
                    readonly: '@',
                    onHover: '=',
                    onLeave: '='
                },
                controller: function($scope){
                    $scope.ratingValue = $scope.ratingValue || 0;
                    $scope.max = $scope.max || 5;
                    $scope.click = function(val){
                        if ($scope.readonly && $scope.readonly === 'true') {
                            return;
                        }
                        // console.log('val'+val);
                        $scope.ratingValue = val;
                    };


                    $scope.over = function(val){
                        // $scope.onHover(val);
                    };
                    $scope.leave = function(){
                        // $scope.onLeave();
                    }
                },
                link: function (scope, elem, attrs) {
                    elem.css("text-align", "center");
                    var updateStars = function () {
                        scope.stars = [];
                        for (var i = 0; i < scope.max; i++) {
                            scope.stars.push({
                                filled: i < scope.ratingValue
                            });
                        }
                    };
                    updateStars();

                    scope.$watch('ratingValue', function (newVal, oldVal) {
                        if (newVal) {
                            updateStars();
                        }
                    });
                    scope.$watch('max', function (newVal, oldVal) {
                        if (newVal) {
                            updateStars();
                        }
                    });
                }
            };
        })
})()