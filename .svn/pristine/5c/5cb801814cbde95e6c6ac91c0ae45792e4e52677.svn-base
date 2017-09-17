(function () {
    angular.module('app')
        .controller('myCourseCtrl',['$scope','$state','dataService','myConfig',function ($scope,$state,dataService,myConfig) {
            var scope = $scope;
            $scope.m = {
                courseList: [],
                config: myConfig
            };
            if (userInfo.token==''){
                alert('请登录');
                $state.go('home');
            }
            // $scope.$emit('navBtn','我的课程');
            $scope.$emit('showNav');

            $scope.loadData = function () {
                dataService.getMyCourseList({}).then(function (args) {
                    $scope.m.courseList = args;
                    for (var i = 0; i < $scope.m.courseList.length; i++) {
                        if ($scope.m.courseList[i].version == "1") {
                            $scope.m.courseList[i].isOldLearn = true;
                            $scope.m.courseList[i].isLearnEasy = false;
                            $scope.m.courseList[i].isLearnNormal = false;
                            $scope.m.courseList[i].isLearnHard = false;
                            $scope.m.courseList[i].isExam = true;
                        }
                        else {
                            $scope.m.courseList[i].isOldLearn = false;
                            $scope.m.courseList[i].isLearnEasy = false;
                            $scope.m.courseList[i].isLearnNormal = false;
                            $scope.m.courseList[i].isLearnHard = false;
                            $scope.m.courseList[i].isExam = false;

                            if ($scope.m.courseList[i].courseMode.indexOf("学习简单") >= 0) {
                                $scope.m.courseList[i].isLearnEasy = true;
                            }
                            if ($scope.m.courseList[i].courseMode.indexOf("学习一般") >= 0) {
                                $scope.m.courseList[i].isLearnNormal = true;
                            }
                            if ($scope.m.courseList[i].courseMode.indexOf("学习困难") >= 0) {
                                $scope.m.courseList[i].isLearnHard = true;
                            }
                            if ($scope.m.courseList[i].courseMode.indexOf("考试") >= 0) {
                                $scope.m.courseList[i].isExam = true;
                            }
                        }
                    }
                });
            };

            $scope.learn = function (item, difficulty) {
                if (!dataService.userInfo || !dataService.userInfo.personId) {
                    alert("请先登录");
                    return;
                }
                $state.go('learnCourse1', { courseId: item.course_id, courseName: item.courseName, difficulty: difficulty,parent:'myCourse' });
                // $scope.$emit("hiddenScreen");
                // $scope.$emit("hiddenMenu");
            };

            $scope.exam = function (item, difficulty) {
                if (!dataService.userInfo || !dataService.userInfo.personId) {
                    alert("请先登录");
                    return;
                }
                $state.go('examCourse1', { courseId: item.course_id, courseName: item.courseName, difficulty: difficulty,parent:'myCourse' });
                // $scope.$emit("hiddenScreen");
                // $scope.$emit("hiddenMenu");
            };

            $scope.unkeep = function (id) {
                var data = {
                    personId: dataService.userInfo.personId,
                    courseId: id
                };
                dataService.removeKeep(data).then(function (args) {
                    dataService.clearGetCourseInfoAllCache(data);
                    dataService.clearMyCourseListCache(data);
                    scope.loadData();
                }, function (args) { });
            };

            $scope.toSearchCourse = function () {
                $state.go("searchCourse");
            };

            $scope.loadData();
        }])
})();