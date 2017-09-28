(function () {
    angular.module("app")
        .controller("courseItemCtrl", ["$scope", "$state", "$stateParams", "dataService", "myConfig", "$log", "utilityService",
            function ($scope, $state, $stateParams, dataService, myConfig, $log, utilityService) {
                var scope = $scope;

                $scope.parentId = $stateParams.id;
                // console.log($scope.parentId+'这里是id');
                $scope.coursePlate = '课程目录';//课程页面的显示的按钮；

                $scope.$emit('showNav');
                $scope.modalText = '';//弹出框上的文字


                $scope.m = {};
                $scope.m.score = 0;         // 评分
                $scope.m.discuss = "";      // 评论
                $scope.m.learnType = "";    // 学习|测试
                $scope.m.isOldLearn = false;
                $scope.m.isLearnEasy = true;
                $scope.m.isLearnNormal = false;
                $scope.m.isLearnHard = false;
                $scope.m.isExam = true;

                $scope.m.divContent = "目录";       // 学习记录|我要评论|查看评论
                $scope.m.difficultyValue = "一般";          // 无难度|容易|一般|困难

                $scope.courseInfo = null;
                $scope.m.courseClassify = null;
                $scope.m.nav = [];

                $scope.goAllCourse = function (id) {
                    $state.go('AllCourseList',{showMenu:id})
                }

                var getNavInfo = function (list, classifyId, node) {
                    var tcid = node.id.split("_")[1];
                    if (classifyId == tcid) {
                        list.push(node);
                        return true;
                    }
                    for (var i = 0; i < node.nodes.length; i++) {
                        var value = arguments.callee(list, classifyId, node.nodes[i]);
                        if (value == true)
                        {
                            list.push(node);
                            return true;
                        }
                    }
                    return false;
                }

                $scope.loadData = function () {
                    dataService.getCourseInfoAll({
                        personId: dataService.userInfo.personId,
                        courseId: $stateParams.id
                    }).then(function (args) {
                        $scope.courseInfo = args;
                        if ($scope.courseInfo.baseInfo.courseMode) {
                            $scope.m.isLearnEasy = $scope.courseInfo.baseInfo.courseMode.indexOf("学习简单") >= 0;
                            $scope.m.isLearnNormal = $scope.courseInfo.baseInfo.courseMode.indexOf("学习一般") >= 0;
                            $scope.m.isLearnHard = $scope.courseInfo.baseInfo.courseMode.indexOf("学习困难") >= 0;
                            $scope.m.isExam = $scope.courseInfo.baseInfo.courseMode.indexOf("考试") >= 0;
                        }
                        else {
                            $scope.m.isOldLearn = true;
                        }
                        return dataService.getCourseClassify();
                    }).then(function (args) {
                        $scope.m.nav = [];
                        $scope.m.courseClassify = args;
                        getNavInfo($scope.m.nav, $scope.courseInfo.baseInfo.classifyId, args);
                        $scope.m.nav.reverse();
                    });
                };


                $scope.showLearn = function (difficulty) {
                    // if (!dataService.userInfo || !dataService.userInfo.personId) {
                    //     utilityService.alert("请先登录");
                    //     return;
                    // }

                    if ($scope.judgeId())//判断是否登陆
                    {
                        //var difficulty = 2;
                        var courseId = $scope.courseInfo.baseInfo.id;
                        var courseName = $scope.courseInfo.baseInfo.title;
                        var courseNameEx = $scope.courseInfo.baseInfo.titleEx;

                        if ($scope.courseInfo.baseInfo.version == "1") {
                            $state.go('learnCourse', {
                                courseId: courseId,
                                courseName: courseName,
                                difficulty: difficulty,
                                parent: 'courseItem',
                                parentID: $scope.parentId,
                            });
                        }
                        else {
                            $state.go('learnCourse1', {
                                courseId: courseId,
                                courseName: courseName,
                                difficulty: difficulty,
                                parent: 'courseItem',
                                parentID: $scope.parentId,
                                courseNameEx: courseNameEx
                            });
                        }
                        $scope.$emit('hiddenNav');
                        // $scope.$emit("hiddenMenu");
                        // $scope.$emit("hiddenScreen");
                    }
                    else
                    {
                        $scope.modalText = '请先登录！'
                        $('#hintLogin').modal();
                    }
                        // utilityService.alert("请先登录");
                };

                $scope.judgeId = function () { //用判断token是否为空的方法暂时判断用户是否登陆
                    if(dataService.userInfo.token == ''){
                        return false;
                    }
                    else
                    {
                        return  true
                    };
                }

                $scope.showExam = function () {
                    // if (!dataService.userInfo || !dataService.userInfo.personId) {
                    if($scope.judgeId()){//判断是否登陆
                        var difficulty = 2;
                        var courseId = $scope.courseInfo.baseInfo.id;
                        var courseName = $scope.courseInfo.baseInfo.title;
                        if ($scope.courseInfo.baseInfo.version == "1") {
                            $state.go('examCourse', { courseId: courseId, courseName: courseName, difficulty: difficulty,parent:'courseItem',parentID:$scope.parentId });
                        }
                        else {
                            $state.go('examCourse1', { courseId: courseId, courseName: courseName, difficulty: difficulty,parent:'courseItem',parentID:$scope.parentId });
                        }
                        // $scope.$emit("hiddenMenu");
                        // $scope.$emit("hiddenScreen");
                        $scope.$emit('hiddenNav');
                    }else {
                        {
                            $scope.modalText = '请先登录！'
                            $('#hintLogin').modal();
                        }
                        // utilityService.alert("请先登录");
                    }
                };

                // $scope.toSearchCourse = function (item) {
                //     $state.go("searchCourse");
                // }

                $scope.doKeep = function () {
                    // if (!dataService.userInfo || !dataService.userInfo.personId) {
                    //     utilityService.alert("请先登录");
                    //     return;
                    // }
                    if ($scope.judgeId()) {
                        var data = {
                            personId: dataService.userInfo.personId,
                            courseId: $scope.courseInfo.baseInfo.id
                        };
                        dataService.saveKeep(data).then(function (args) {
                                // utilityService.alert("课程已经收藏");
                                $scope.modalText = '课程已经收藏!';
                                $('#hintLogin').modal();
                                dataService.clearMyCourseListCache({});
                                dataService.clearGetCourseInfoAllCache(data);
                                scope.loadData();
                            },
                            function (args) {

                            });
                    }else {
                        $scope.modalText = '请先登录！'
                        $('#hintLogin').modal();
                        // utilityService.alert("请先登录");
                    }
                };

                $scope.submitDiscuss = function () {
                    if (!dataService.userInfo || !dataService.userInfo.personId) {
                        $scope.modalText = '请先登录！';
                        $('#hintLogin').modal();
                        // utilityService.alert("请先登录");
                        return;
                    }
                    var courseParams = {
                        personId: dataService.userInfo.personId,
                        courseId: $scope.courseInfo.baseInfo.id
                    };
                    dataService.saveDiscuss({
                        personId: dataService.userInfo.personId,
                        courseId: $scope.courseInfo.baseInfo.id,
                        score: $scope.m.score,
                        discuss: $scope.m.discuss
                    })
                        .then(function (args) {
                            dataService.getDiscuss({
                                courseId: courseParams.courseId,
                                start: 0,
                                limit: 10
                            }).then(function (args) {
                                $scope.courseInfo.baseInfo.discussCount = args.count;
                                $scope.courseInfo.discusses = args.list;
                            }, function (args) { });
                        }, function (args) {

                        });
                };

                $scope.$on("onPageChanged", function (event, data) {
                    discussPageNumber = data.activePage;
                    $scope.m.refreshDiscuss();
                });
                $scope.$emit('showFooter');//显示底部框

                var discussPageNumber = 0;
                $scope.m.refreshDiscuss = function () {
                    //discussPageNumber++;
                    $log.debug("load more discuss : " + discussPageNumber);
                    dataService.getDiscuss({
                        courseId: $scope.courseInfo.baseInfo.id,
                        start: discussPageNumber * 10,
                        limit: 10
                    }).then(function (args) {
                        $scope.courseInfo.baseInfo.discussCount = args.count;
                        //angular.extend(args.list, $scope.courseInfo.discusses);
                        if (args.list.length > 0) {
                            for (var i = 0; i < args.list.length; i++) {
                                $scope.courseInfo.discusses.push(args.list[i]);
                            }
                        }
                        else {
                            m_enableRefreshDiscuss = false;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    }, function (args) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                };
                $scope.loadData();
            }]);
})();
