(function () {
    angular.module("app")
        .controller("allCourseListCtrl", ["$scope", "$log","dataShareService","dataService", "$state","myConfig","utilityService","$q","$timeout","$stateParams",
            function ($scope, $log, dataShareService, dataService, $state, myConfig, utilityService, $q, $timeout,$stateParams) {

            //
            // //分页
            //     $scope.paginationConf = {
            //         currentPage: 1,//默认在哪个分页
            //         totalItems: 64,//总数据量
            //         itemsPerPage: 16,//默认16条
            //         pagesLength: 16,//分页条目的长度
            //         perPageOptions: [10, 20, 30, 40, 50],//可以选择的显示条数的数组
            //         onChange: function(){
            //
            //         }
            //     };
                $scope.$emit('navBtn','全部课程');


            //星级评价事件
                $scope.onHover = function(val){
                    return 0
                };
                $scope.onLeave = function(){
                    return 0
                };
                $scope.onChange = function(val){
                    return 0
                };

                var scope = $scope;
                $scope.m = {
                    sd: dataShareService
                };
                
                
                //点击向下按钮显示更多的title
                $scope.showMore = function () {
                    // console.log('style');
                    // console.info(document.getElementById('allCourseList').style);
                    document.getElementById('allCourseList').style.height = '40px';
                };
                

                $scope.courseMenu = $stateParams.showMenu;
                if(!$scope.courseMenu)
                {$scope.courseMenu = '0_0'}
                //点击导航按钮时的事件
                $scope.goCourse = function (item) {
                    if (item == '0_0'){
                        $scope.courseMenu = '0_0';
                    }
                    else
                    $scope.courseMenu = item.id;
                    // console.log(item.id);

                };
                //点击小模块跳转到课程页面
                $scope.goCourseItem = function (id) {

                    // $state.go("courseItem",{id:id,arrId:arrId,arrTitle:arrTitle});
                    $state.go("courseItem",{id:id,parent:'AllCourseList'});
                };


                $scope.toCourse = function (courseId) {
                    $state.go("allCourseItem", { id: courseId, parent: "allCourseList" });
                };

                var _loadAdvertisement = function () {
                    dataService.getAdvertisementList().then(function (args) {
                        $scope.m.advertisement = args;
                        // for (var i = 0; i < args.length; i++) {
                        //     swiper.appendSlide('<div class="swiper-slide">' +
                        //         '<img style="width:100%;"  src="' + args[i] + '" />' +
                        //         '</div>')
                        // }
                        // $log.debug("do load 广告 completed : " + moment().format('h:mm:ss '));
                    }, function (args) {
                    });
                };
                $scope.getImgPath = function(url){
                    return myConfig.filesUrl + "/Advertisement/" + url;
                };

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
                            var titleEx = $scope.m.sd.allCourseList[i].titleEx ? $scope.m.sd.allCourseList[i].titleEx:'';
                            var temp = node.id.split("_");
                            if ($scope.m.sd.allCourseList[i].id == temp[1]) {
                                var tt = {
                                    id: $scope.m.sd.allCourseList[i].id,
                                    title: $scope.m.sd.allCourseList[i].title,
                                    img: $scope.m.sd.allCourseList[i].img+titleEx,
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


                var _getCourseList = function(){
                    var defer = $q.defer();
                    $log.debug("do load course list start : " + moment().format('h:mm:ss '));
                    dataService.getCourseList({
                        type: "精品课程",
                        limit: 100
                    }).then(function (args) {
                        $log.debug("do load course list end : " + moment().format('h:mm:ss '));
                        $scope.m.sd.allCourseList = args;
                        defer.resolve(args);
                    }, function (args) {
                        defer.reject(args);
                    })
                    return defer.promise;
                }

                var _getCourseIndexTree = function () {
                    var defer = $q.defer();
                    $log.debug("do load course index start : " + moment().format('h:mm:ss '));
                    dataService.getCourseIndexTree({
                        personId: dataService.userInfo.personId,
                        isAll: true
                    }).then(function (args) {
                        $log.debug("do load course index end : " + moment().format('h:mm:ss '));
                        $scope.m.sd.treeCourse = args;
                        defer.resolve(args);
                    }, function (args) {
                        defer.reject(args);
                    })
                    return defer.promise;
                }

                var loadIndexPromise = function () {
                    var defer = $q.defer();
                    var promiseList = [];
                    promiseList.push(_getCourseList());
                    promiseList.push(_getCourseIndexTree());
                    defer.all(promiseList).then(function(args){
                        defer.resolve(args);
                    },function(args){
                        defer.reject(args);
                    });
                    return defer.promise;
                }
                var loadIndex = function () {
                    $log.debug("do load course start : " + moment().format('h:mm:ss '));
                    var promiseList = [];
                    promiseList.push(_getCourseList());
                    promiseList.push(_getCourseIndexTree());
                    $q.all(promiseList).then(function (args) {
                        _loadClassifyCourse();

                        $log.debug("do load course completed : " + moment().format('h:mm:ss '));
                    }, function (args) {

                    });

                    _loadAdvertisement();
                };

                $log.debug("do load index : " + moment().format('h:mm:ss '));

                // var swiper = new Swiper('.swiperImg',
                //     {
                //         pagination: '.swiper-pagination',
                //         paginationClickable: true,
                //         autoplay: 5000
                //     });
                //
                // $scope.getSwiperClass = function (index) {
                //     return "mySwiper" + index;
                // }
                //
                // $scope.createSwiper = function (index) {
                //     $timeout(function () {
                //         var swiper = new Swiper('.mySwiper' + index, {
                //             pagination: '.swiper-pagination',
                //             slidesPerView: 3,
                //             paginationClickable: true,
                //             spaceBetween: 10
                //         });
                //     }, 10);
                // };

                loadIndex();


            }])
})();