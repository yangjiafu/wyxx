(function () {
    angular.module("app")
    .controller("ExamCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
        "convertService", "$state", "myConfig", "utilityService", "$log", "courseService1",
    function ($scope, $interval, $stateParams, dataService, convertService, $state, myConfig, utilityService, $log, courseService1) {
        $scope.$log = $log;
        $scope.m = {
            slideBox: [],
            myActiveSlide: 1,
            params: {
                courseId: $stateParams.courseId,
                courseName: $stateParams.courseName,
                difficulty: $stateParams.difficulty
            },
            exam: courseService1.exam,
            examInfo: {
                questionNumber: 0,
                answerNumber: 0,
                answerRightNumber: 0,
                score: 0,
                startTime: new Date(),
                endTime: new Date(),
                useTime: ""
            },
            isShowExamInfo: false,
            slider1: {},
            slider2: {},
            slider3: {}
        };

        $scope.loadData = function () {
            dataService.getCourseContent({
                courseId: $scope.m.params.courseId
            }).then(function (args) {
                courseService1.loadExamInfo(args[0], false);
                $scope.m.exam.curQuestion = $scope.m.exam.questions[0];
                moveSlider(0);
            }, function (args) {
            });
        };

        $scope.getContent = function () {
            dataService.getTextContent(
                {
                    courseName: $scope.modal.courseName,
                    fileName: $scope.questionItem.node.Text
                }
            ).then(function (args) {
                $scope.m.exam.curQuestion.TextContent = args;
            }, function (args) {
            });
        };

        // 退出的时候显示本次学习信息
        $scope.showExamCompleteInfo = function () {
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
            $scope.m.examInfo.startTime = utilityService.getDateDbString($scope.m.examInfo.startTime);
            $scope.m.examInfo.endTime = utilityService.getDateDbString($scope.m.examInfo.endTime);

            dataService.saveLearnInfo($scope.m.examInfo)
            .then(function (args) {
                $scope.m.isShowExamInfo = false;
                $scope.loadData();
                $state.go("tab.allCourseList");
            }, function (args) {
                utilityService.alert(args);
            });
        };

        $scope.closeTimer = function () {
            $interval.cancel($scope.timer);
        };


        $scope.submitQuestion = function () {
            courseService1.checkExamQuestionAnswer($scope.m.exam.curQuestion);
        };

        $scope.selectAnswer = function (item) {
            $scope.m.exam.curQuestion.answerStatus = 0;
            if ($scope.m.exam.curQuestion.rightAnswerCount == 1) {
                for (var i = 0; i < $scope.m.exam.curQuestion.items.length; i++) {
                    $scope.m.exam.curQuestion.items[i].isUserChoice = false;
                }
            }
            item.isUserChoice = !item.isUserChoice;
            $scope.submitQuestion();
        };

        var moveSlider = function (index) {
            if (index === 0) {
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index - 1];
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index + 1];
            }
            else if (index === 1) {
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index - 1];
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index + 1];
            }
            else {
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index - 1];
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index + 1];
            }
        };
        var stopPrior = function (index) {
            if (index === 0) {
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index + 1];
            }
            else if (index === 1) {
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index + 1];
            }
            else {
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index + 1];
            }
        };
        var stopNext = function (index) {
            if (index === 0) {
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index - 1];
            }
            else if (index === 1) {
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider1 = $scope.m.exam.questions[$scope.m.exam.index - 1];
            }
            else {
                $scope.m.slider3 = $scope.m.exam.questions[$scope.m.exam.index];
                $scope.m.slider2 = $scope.m.exam.questions[$scope.m.exam.index - 1];
            }
        };
        $scope.next = function () {
            courseService1.nextExam();
            moveSlider(tempIndex);
        };

        $scope.prior = function () {
            courseService1.priorExam();
            moveSlider(tempIndex);
        };

        $scope.slideChanged = function (index) {
            var prior = (tempIndex + 2) % 3;
            var next = (tempIndex + 1) % 3;
            if (prior == index) {
                tempIndex = index;
                if ($scope.m.exam.index > 0) {
                    courseService1.priorExam();
                    moveSlider(tempIndex);
                }
                else {
                    stopPrior(index);
                }

            }
            else if (next == index) {
                tempIndex = index;
                if ($scope.m.exam.index < $scope.m.exam.questions.length - 1) {
                    courseService1.nextExam();
                    moveSlider(tempIndex);
                }
                else {
                    stopNext(index);
                }
            }
            else {
                moveSlider(tempIndex);
            }
        };
        var tempIndex = 0;

        var t1 = moment().unix();
        $scope.timer = $interval(function () {

            $scope.m.examInfo.endTime = new Date();
            var t2 = moment().unix();
            var t3 = t2 - t1;
            $scope.m.examInfo.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
        }, 1000);

        $scope.$on("$ionicView.enter", function () {
            $log.debug("enter exam course");
            $scope.m.isShowExamInfo = false;
            $scope.loadData();
        });
        $scope.loadData();

       
    }]);
})();