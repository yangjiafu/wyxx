(function () {
    angular.module("app")
        .controller("examCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
            "convertService", "$state", "myConfig", "$log", "courseService1", "$q", "$timeout",
            function ($scope, $interval, $stateParams, dataService, convertService, $state, myConfig, $log, courseService1, $q, $timeout) {

                var scope = $scope;
                $scope.parent = $stateParams.parent;
                $scope.parentID= $stateParams.parentID;
                $scope.$emit('hiddenNav');
                console.log($scope.parentID+'父id为');
                $scope.m = {
                    params: {
                        courseId: $stateParams.courseId,
                        courseName: $stateParams.courseName,
                        difficulty: $stateParams.difficulty
                    },
                    exam: courseService1.exam,
                    examInfo: {
                        courseId: $stateParams.courseId,
                        learnMode: "测试",
                        questionNumber: 0,
                        answerNumber: 0,
                        answerRightNumber: 0,
                        score: 0,
                        startTime: new Date(),
                        endTime: new Date(),
                        useTime: ""
                    },
                    isShowExamInfo: false,
                    isDoAllQuestion :false
                };
                $scope.$emit('hiddenFooter');

                $scope.loadData = function () {
                    dataService.getCourseContent({
                        courseId: $scope.m.params.courseId
                    }).then(function (args) {
                        courseService1.loadExamInfo(args[0], false);
                        $scope.m.exam.curQuestion = $scope.m.exam.questions[0];
                    }, function (args) {
                    });
                };

                // 退出的时候显示本次学习信息
                $scope.showExamCompleteInfo = function () {

                    $scope.pause(); //点击退出后暂停播放

                    $scope.m.isShowExamInfo = true;
                    var score = courseService1.getExamScore();
                    $scope.m.examInfo.questionNumber = score.questionCount;
                    $scope.m.examInfo.answerNumber = score.doQuestionCount;
                    $scope.m.examInfo.answerRightNumber = score.doRightQuestionCount;
                    $scope.m.examInfo.score = score.score;
                    $scope.m.examInfo.endTime = new Date();
                    //$scope.m.examInfo.startTime = $scope.modal.startTime;
                    //$scope.m.examInfo.useTime = $scope.modal.useTime;
                };

                // 退出课程
                $scope.examCompleted = function () {
                    $scope.m.examInfo.startTime = moment($scope.m.examInfo.startTime).format("YYYY-MM-DD HH:mm:ss");
                    $scope.m.examInfo.endTime = moment($scope.m.examInfo.endTime).format("YYYY-MM-DD HH:mm:ss");

                    dataService.saveLearnInfo($scope.m.examInfo)
                        .then(function (args) {
                            angular.element('#learnInfo').on('hidden.bs.modal', function () {
                                $state.go($scope.parent,{id:$scope.parentID});
                                // $scope.$emit("showMenu");
                                // $scope.$emit("showScreen");
                                $scope.$emit('showNav');
                            });
                            angular.element('#learnInfo').modal('hide');
                        }, function (args) {
                            utilityService.alert(args);
                        });
                };

                $scope.closeTimer = function () {
                    $interval.cancel($scope.timer);
                };



                $scope.next = function () {
                    var tempIndex = $scope.m.exam.index;
                    courseService1.checkExamQuestionAnswer($scope.m.exam.curQuestion);
                    courseService1.nextExam();
                    $scope.m.isDoAllQuestion = tempIndex == $scope.m.exam.index;
                };

                $scope.prior = function () {
                    courseService1.priorExam();
                };

                var t1 = moment().unix();
                $scope.timer = $interval(function () {

                    $scope.m.examInfo.endTime = new Date();
                    var t2 = moment().unix();
                    var t3 = t2 - t1;
                    $scope.m.examInfo.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
                }, 1000);




                $scope.m.isShowExamInfo = false;
                $scope.loadData();

                //播放的js
                $scope.play = function() {
                    window.speechSynthesis.cancel();//先对之前暂停的清除缓存
                    var utterThis = new window.SpeechSynthesisUtterance($('#selectTxt').text());
                    window.speechSynthesis.speak(utterThis);
                };
                $scope.pause = function() {
                    window.speechSynthesis.pause();
                };
                $scope.resume = function() {
                    window.speechSynthesis.resume()
                }
            }]);
})();