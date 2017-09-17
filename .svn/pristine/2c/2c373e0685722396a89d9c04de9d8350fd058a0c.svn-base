(function() {
    angular.module("app")
    .controller("LearnCourseCtrl", ["$scope", "$interval", "$stateParams", "dataService", "examService", "convertService", "$state",
        function ($scope, $interval, $stateParams, dataService, examService, convertService, $state) {
            $scope.courseId = $stateParams.courseId;
            $scope.courseName = $stateParams.courseName;
            $scope.difficulty = $stateParams.difficulty;

            $scope.items = null;
            $scope.startTime = new Date();
            $scope.endTime = null;
            $scope.useTime = "";
            $scope.questionItem = {
                hasVideo: false,
                hasImg: false,
                hasText: false,
                node: null
            };

            $scope.times = [];
            $scope.questionCount = 0;
            $scope.currentQuestionNumber = 0;

            $scope.learnRecordInfo = {
                courseId: $scope.courseId,
                courseName: $scope.courseName,
                personId: dataService.userInfo.personId,
                learnMode: "学习",
                difficulty: convertService.getDifficultyName($scope.difficulty),
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                useTime: $scope.useTime,
                questionNumber: 0,
                answerNumber: 0,
                answerRightNumber: 0,
                score: 0
            };

            $scope._getFirstQuestion = function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (node.IsQuestion) {
                        return node;
                    }

                    var subNode = arguments.callee(nodes[i].nodes);
                    if (subNode)
                        return subNode;
                }
            };

            $scope._initNodeSelected = function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].selected = false;
                    arguments.callee(nodes[i].nodes);
                }
            };
            $scope.loadData = function () {
                $scope.times.push({ key: "开始加载", value: new Date() });
                dataService.getCourseContent({
                    courseId: $scope.courseId
                }).then(function (args) {
                    $scope.times.push({ key: "加载完成", value: new Date() });
                    $scope.items = args;
                    $scope._initNodeSelected($scope.items);
                    var node = $scope._getFirstQuestion($scope.items);
                    $scope.selectTreeNode(node);
                    $scope.loadQuestion();
                    $scope.times.push({ key: "初始化完成", value: new Date() });
                }, function (args) {
                }); 
            };

            $scope.getTextContent = function () {
                dataService.getTextContent(
                    {
                        courseName: $scope.courseName,
                        fileName: $scope.questionItem.node.Text
                    }
                    //$scope.questionItem.node.Text
                ).then(function (args) {
                    $scope.questionItem.node.TextContent = args;
                }, function (args) {
                });
            };

            // 退出的时候显示本次学习信息
            $scope.showLearnCompleteInfo = function () {
                var score = examService.getScore();
                $scope.learnRecordInfo.questionNumber = score.questionCount;
                $scope.learnRecordInfo.answerNumber = score.doQuestionCount;
                $scope.learnRecordInfo.answerRightNumber = score.doRightQuestionCount;
                $scope.learnRecordInfo.score = score.score;
                $scope.learnRecordInfo.endTime = new Date();
                $scope.learnRecordInfo.useTime = $scope.useTime;
            };

            // 退出课程
            $scope.learnCompleted = function () {
                dataService.saveLearnInfo($scope.learnRecordInfo)
                .then(function (args) {
                    angular.element('#learnInfo').modal('hide');
                    var obj = $interval(function () {
                        $scope.$emit("showMenu", {});
                        $state.go("index");
                        $interval.cancel(obj);
                    }, 500);
                }, function (args) {
                    alert(args);
                });
            };

            $scope.closeTimer = function () {
                $interval.cancel($scope.timer);
            };

            $scope.selectTreeNode = function (node) {
                if (node.IsQuestion) {
                    if ($scope.questionItem && $scope.questionItem.node) {
                        $scope.questionItem.node.selected = false;
                    }
                    $scope.questionItem.node = node;
                    $scope.questionItem.node.selected = true;
                    $scope.questionItem.hasVideo = node.Video ? true : false;
                    $scope.questionItem.hasImg = node.Image ? true : false;
                    $scope.questionItem.hasText = node.Text ? true : false;

                    $scope.moveToQuestionById(node.id);
                    $scope.getTextContent();

                    $scope.menu = false;
                }
            };
            $scope.selectTreeNodeById = function (nodes, id) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].id == id) {
                        $scope.selectTreeNode(nodes[i]);
                        return;
                    }

                    arguments.callee(nodes[i].nodes, id);
                }
            };

            $scope.currentQuestion = null;
            $scope.loadQuestion = function () {
                examService.loadData($scope.items, {
                    enableDisorder: true,          // 是否允许无序做题
                    isAllQuestionUse: true,        // 如果是true 的话，课程中的所有题目都将是题目。  如果是 false 的话， 题目数量由 questionNumber 决定
                    questionNumber: 0,
                    questionSore: 1,
                    difficulty: 2
                });
                $scope.questionCount = examService.getQuestionCount();
                $scope.currentQuestion = examService.getQuestionItem();
                $scope.currentQuestionNumber = 1;
            };

            $scope.moveToQuestionById = function (id) {
                if (examService.moveToQuestionById(id)) {
                    $scope.currentQuestion = examService.getQuestionItem();
                }
            };
            $scope.submitQuestion = function () {
                examService.checkQuestionAnswer($scope.currentQuestion);
            };
            $scope.next = function () {
                if (examService.nextQuestion()) {
                    $scope.currentQuestion = examService.getQuestionItem();
                    $scope.selectTreeNodeById($scope.items, $scope.currentQuestion.id);
                    $scope.currentQuestion.isUserAnswer = false;
                    $scope.currentQuestionNumber++;
                }
                else {
                    $scope.showLearnCompleteInfo();
                    angular.element('#learnInfo').modal('show');
                }
            };
            $scope.priso = function () {
                if (examService.pirsoQuestion()) {
                    $scope.currentQuestion = examService.getQuestionItem();
                    $scope.selectTreeNodeById($scope.items, $scope.currentQuestion.id);
                    $scope.currentQuestion.isUserAnswer = false;
                    $scope.currentQuestionNumber--;
                }
            };

            $scope.selectAnswer = function (item) {
                item.isUserSelect = !item.isUserSelect;
                $scope.currentQuestion.isUserAnswer = false;
            };


            $scope.treeNodeFilter = function (node) {
                return node.IsAnswer === false || (node.IsAnswer === true && node.isRight === true) || (node.IsAnswer === true && node.isUserSelect);
            };

            var t1 = moment().unix();
            $scope.timer = $interval(function () {

                $scope.endTime = new Date();
                var t2 = moment().unix();
                var t3 = t2 - t1;
                $scope.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
            }, 1000);

            $scope.$emit("hiddenLogin");
        }]);
})();