(function () {
    angular.module("app")
        .controller("allCourseListCtrl", ["$scope", "$log", "dataShareService", "dataService", "$state", "myConfig", "utilityService",
            "$ionicScrollDelegate",
            function ($scope, $log, dataShareService, dataService, $state, myConfig, utilityService, $ionicScrollDelegate) {
                $scope.m = {
                    sd: dataShareService
                };

                $scope.doDrag = function ($event) {
                    $log.debug("do drag ");
                    //$scope.m.args = $event.gesture;
                    var dy = $event.gesture.deltaY;
                    var ds = $ionicScrollDelegate.$getByHandle('myscroll');
                    ds.scrollBy(0, -1 * dy, true);
                    //$scope.m.args = dy;
                };
                //var gesture = $ionicGesture.on('swipe', myscroll, event, {});

                $scope.toCourse = function (courseId) {
                    $state.go("tab.allCourseItem", { id: courseId, parent: "allCourse" });
                };

                var _loadAdvertisement = function () {
                    dataService.getAdvertisementList().then(function (args) {
                        $scope.m.advertisement = args;
                    }, function (args) {
                    });
                };
                $scope.getImgPath = function(url){
                    return myConfig.filesUrl + "/Advertisement/" + url;
                }

                var _loadClassifyCourse = function () {
                    $scope.m.sd.classifyCourse = [];
                    for (var i = 0; i < $scope.m.sd.treeCourse.length; i++) {
                        var newNode = {
                            id: $scope.m.sd.treeCourse[i].id,
                            type: $scope.m.sd.treeCourse[i].type,
                            title: $scope.m.sd.treeCourse[i].title,
                            nodes: []
                        };
                        $scope.m.sd.classifyCourse.push(newNode);
                        _loadClassifyCourseRecursive($scope.m.sd.treeCourse[i], newNode);
                    }
                };

                var _loadClassifyCourseRecursive = function (node, newNode) {
                    if (node.type == "课程") {
                        for (var i = 0; i < $scope.m.sd.allCourseList.length; i++) {
                            var temp = node.id.split("_");
                            if ($scope.m.sd.allCourseList[i].id == temp[1]) {
                                var tt = {
                                    id: $scope.m.sd.allCourseList[i].id,
                                    title: $scope.m.sd.allCourseList[i].title,
                                    img: $scope.m.sd.allCourseList[i].img,
                                    status: $scope.m.sd.allCourseList[i].status,
                                    starRating: $scope.m.sd.allCourseList[i].starRating,
                                    commentNumber: $scope.m.sd.allCourseList[i].commentNumber
                                };
                                newNode.nodes.push(tt);
                                break;
                            }
                        }

                    }
                    else {
                        for (var j = 0; j < node.nodes.length; j++) {
                            arguments.callee(node.nodes[j], newNode);
                        }
                    }
                };

                var loadIndex = function () {
                    dataService.getCourseList({
                        type: "精品课程",
                        limit: 100
                    }).then(function (args) {
                        $scope.m.sd.allCourseList = args;

                        dataService.getCourseIndexTree({
                            personId: dataService.userInfo.personId,
                            isAll: true
                        }).then(function (args) {
                            $scope.m.sd.treeCourse = args;
                            _loadClassifyCourse();
                        }, function (args) {
                        });

                        _loadAdvertisement();
                    }, function (args) {
                    });
                };

                $log.debug("do load index");
                var swiper = new Swiper('.swiperImg',
                {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 5000
                });

                $scope.getSwiperClass = function (index) {
                    return "mySwiper" + index;
                }
                $scope.createSwiper = function (index) {
                    var swiper = new Swiper('.mySwiper', {
                        pagination: '.swiper-pagination',
                        slidesPerView: 3,
                        paginationClickable: true,
                        spaceBetween:10
                    });
                };
                loadIndex();
            }]);
})();
