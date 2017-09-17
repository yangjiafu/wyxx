(function() {
    angular.module("app")
        .controller("LearnCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
            "$state", "myConfig", "$log", "courseService1", "$timeout", "$q", "dataShareService","utilityService",
            function ($scope, $interval, $stateParams, dataService,
                      $state, myConfig, $log, courseService1, $timeout, $q, dataShareService,utilityService) {
                var scope = $scope;
                $scope.parent = $stateParams.parent;
                $scope.parentID = $stateParams.parentID;
                $scope.qustionRights = 0;
                $scope.qustionCheck = 0;
                $scope.continue = 'pause';
                $scope.size = 1;//定义文本类的样式
                $scope.$emit('hiddenNav');//避免出现刷新后显示导航栏的问题
                $scope.className = 'lineHeight1';//文本样式的默认字体
                // $scope.lineHeight = 25;
                $scope.showLoading = false;//加载音频文件显示loading
                $scope.generaTitle = 'question';
                $scope.inputId = '';
                $scope.asList = [];//节点的问答列表项
                $scope.simpleList = [];//节点案例列表
                $scope.sunasList =[];

                $scope.m = {
                    params:{
                        courseId:$stateParams.courseId,
                        courseName:$stateParams.courseName,
                        difficulty:$stateParams.difficulty
                    },
                    learn: courseService1.learn,
                    learnInfo: {
                        courseId: $stateParams.courseId,
                        learnMode: "学习",
                        nodeId:'',
                        questionNumber: 0,
                        answerNumber: 0,
                        answerRightNumber: 0,
                        score: 0,
                        startTime: new Date(),
                        endTime: new Date(),
                        useTime:"",
                        askContent:'',//问问题的内容
                        replyContent:'',//回复问题的内容
                        exampleContent: '',//提交案例的内容
                        loginLodin: '',//提交时候的提示
                        loginExamplLodin: '' //提交案例时候的提示
                    },
                    isShowLearnInfo: false
                };




                $scope.$emit('hiddenFooter');

                $scope.loadData = function () {
                    courseService1.loadLearnInfo([], $scope.m.params.difficulty);
                    $scope.m.learn.curQuestion = {};
                    dataService.getCourseContent({
                        courseId: $scope.m.params.courseId
                    }).then(function (args) {
                        courseService1.loadLearnInfo(args[0], $scope.m.params.difficulty);
                        for (var i = 0; i < $scope.m.learn.questions.length; i++) {
                            if ($scope.m.learn.questions[i].fileType == "video") {
                                $scope.m.learn.questions[i].video = splitVideo($scope.m.learn.questions[i].file);
                            }
                            if($scope.m.learn.questions[i].type=='question'){
                                $scope.m.learn.questions[i].items = random($scope.m.learn.questions[i].items);
                            }

                        }
                        $scope.m.learn.curQuestion = $scope.m.learn.questions[0];
                        $scope.m.learn.index = 0;
                    }, function (args) {
                    });

                };

                //获取课程节点问答列表
                $scope.getCourseASList = function (nodeid) {
                    dataService.getCourseNodeASList({
                        courseId: $scope.m.params.courseId,
                        nodeId: nodeid,
                        start:0,
                        limit:100
                    }).then(function (args) {
                        $scope.asList = args;

                        // if($scope.asList.length == 0)
                        // else
                        //     $scope.sunasList = args;
                    }, function (args) {
                    })
                };

                //判断是否登陆
                $scope.isLogin = function () {
                    if (dataService.userInfo.personId){
                        return dataService.userInfo.personId
                    }else {
                        return false
                    }
                };


                $scope.getContent = function (courseItem) {
                    var defer = $q.defer();
                    if (!courseItem){
                        defer.resolve("");
                    }
                    else
                        if (courseItem.file.indexOf(".txt") < 0)
                        {defer.resolve("");}
                        else {
                    dataService.getTextContent({
                        courseName: $scope.m.params.courseName,
                        fileName: courseItem.file
                    })
                        .then(function (args) {
                            //setContent(tempIndex, args, true);
                            var array = args.split("\n");
                            $scope.showarr = array;//赋值测试
                            var list = [];
                            for (var i = 0; i < array.length; i++) {
                                if (array[i].length > 1) {
                                    list.push(array[i]);
                                }
                            }
                            courseItem.TextContent = list;
                            defer.resolve(list);
                        }, function (args) { defer.reject(""); });}
                    return defer.promise;
                };

                // 退出的时候显示本次学习信息
                $scope.showLearnCompleteInfo = function () {
                    $scope.pause();
                    $scope.m.isShowLearnInfo = true;
                    var score = courseService1.getLearnScore();
                    $scope.m.learnInfo.questionNumber = score.questionCount;
                    $scope.m.learnInfo.answerNumber = score.doQuestionCount;
                    $scope.m.learnInfo.answerRightNumber = score.doRightQuestionCount;
                    $scope.m.learnInfo.score = score.score;
                    $scope.m.learnInfo.endTime = new Date();
                };

                // 退出课程
                $scope.learnCompleted = function () {

                    $scope.m.learnInfo.startTime = moment($scope.m.learnInfo.startTime).format("YYYY-MM-DD HH:mm:ss");
                    $scope.m.learnInfo.endTime = moment($scope.m.learnInfo.endTime).format("YYYY-MM-DD HH:mm:ss");

                    dataService.saveLearnInfo($scope.m.learnInfo)
                        .then(function (args) {
                            $scope.m.isShowLearnInfo = false;
                            //storeService.setLocalValue($scope.m.params.courseId + "_index", $scope.m.learn.index);
                            //$scope.loadData();
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

                $scope.doKeep = function () {
                    if (!dataService.userInfo || !dataService.userInfo.personId) {
                        utilityService.alert("请先登录");
                        return;
                    }
                    var data = {
                        personId: dataService.userInfo.personId,
                        courseId: $scope.courseInfo.baseInfo.id
                    };
                    dataService.saveKeep(data).then(function (args) {
                            utilityService.alert("课程已经收藏");
                            dataService.clearMyCourseListCache({});
                            dataService.clearGetCourseInfoAllCache(data);
                            scope.loadData();
                        },
                        function (args) {

                        });
                };


                $scope.closeTimer = function () {
                    $interval.cancel($scope.timer);
                };


                $scope.submitQuestion = function (rights) {
                    var item = $scope.m.learn.curQuestion;
                    if (item.type != 'question') return false;
                    var checkBock = $("#selectInput input[type='checkbox']:checked").length;
                    if (rights !=  checkBock)
                    {
                        $scope.qustionRights = rights;
                        $scope.qustionCheck = checkBock;
                        $('#questionError').modal();
                        return false
                    }
                    courseService1.checkLearnQuestionAnswer($scope.m.learn.curQuestion);
                };

                $scope.selectAnswer = function (item) {
                    $scope.m.learn.curQuestion.answerStatus = 0;
                    item.isUserChoice = !item.isUserChoice;
                };


                //点击改变字号
                $scope.changeSize = function(){
                    if ($scope.size <3){
                        $scope.size+=1;
                        // $scope.lineHeight+=10;
                        // $('#changeSize p').setAttribute('class','lineHeight'+$scope.size);
                         $scope.className = 'lineHeight'+$scope.size;
                    }
                    else
                        $scope.size =0;
                };


                $scope.next = function () {
                    courseService1.nextLearn();
                };

                $scope.prior = function () {
                    courseService1.priorLearn();
                };

                var splitVideo = function (video) {
                    var result = {
                        video: "",
                        ydVideo: "",
                        alyVideo: ""
                    };
                    var temp = video;
                    if (video.indexOf("@yd@") >= 0) {
                        var t = temp.split("@yd@");
                        result.video = t[0];
                        temp = t[1];
                    }
                    else if (video.indexOf("@aly@") >= 0) {
                        var tt = temp.split("@aly@");
                        if (result.video == "") {
                            result.video = tt[0];
                        }
                        else {
                            result.ydVideo = tt[0];
                        }
                        result.alyVideo = tt[1];
                    }
                    else {
                        result.video = temp;
                    }
                    return result;
                };

                var t1 = moment().unix();
                $scope.timer = $interval(function () {

                    $scope.m.learnInfo.endTime = new Date();
                    var t2 = moment().unix();
                    var t3 = t2 - t1;
                    $scope.m.learnInfo.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
                }, 1000);

                $scope.loadData();


                var random = function(array) {
                    var arr = array;
                    var arr1 =  arr.sort(function() {
                        return .5 - Math.random();
                    });
                    return arr1;
                };

                //提交问答项
                $scope.addCourseASItem = function (nodeid) {
                    //
                    // if($scope.m.learn.curQuestion.type=='question'){
                    //     utilityService.alert("答题界面禁止提交问答");
                    //     return;
                    // }
                    if(!$scope.isLogin()){
                        utilityService.alert("请登录");
                        return;
                    } else
                        if ($scope.m.learnInfo.replyContent == ''){
                        utilityService.alert("填写内容在提交");
                        return;
                    }
                    $scope.m.learnInfo.loginLodin = '正在提交!';
                    dataService.addCourseNodeASItem({
                        courseId: $scope.m.params.courseId,
                        nodeId: nodeid,
                        content: $scope.m.learnInfo.replyContent,
                        personId: $scope.isLogin()
                    }).then(function (args) {
                        $scope.m.learnInfo.replyContent = '';
                        $scope.getCourseASList(nodeid);
                        $scope.m.learnInfo.loginLodin = '提交成功!';
                    })
                };

                //提交案例内容
                $scope.addCourseSimpleItem = function(nodeId){
                    if (!$scope.isLogin()){
                        utilityService.alert("请登录");
                        return;
                    }
                    else
                    if ($scope.m.learnInfo.exampleContent ==''){
                        utilityService.alert("填写内容再提交");
                        return;
                    }
                    $scope.m.learnInfo.loginExamplLodin = '正在提交！';
                    dataService.addCourseNodeSimpleItem({
                      courseId:$scope.m.params.courseId,
                      nodeId:nodeId,
                      content:$scope.m.learnInfo.exampleContent,
                      personId:$scope.isLogin()
                  }).then(function (args) {
                      $scope.getCourseSimpleList(nodeId);
                      $scope.m.learnInfo.loginExamplLodin = '案例提交成功！';
                      $scope.m.learnInfo.exampleContent = '';
                  })
                };
                //获取案例内容
                $scope.getCourseSimpleList = function (nodeId) {
                    dataService.getCourseNodeSimpleList({
                        courseId:$scope.m.params.courseId,
                        nodeId:nodeId,
                        start:0,
                        limit:100
                    }).then(function (args) {
                        $scope.simpleList = args;
                    })
                };
                //删除案例内容
                $scope.deleteExample = function (id,personId,nodeId) {
                    if (!$scope.isLogin()){
                        utilityService.alert("请登录！");
                        return;
                    }
                    if (personId!=$scope.isLogin())
                    {
                        utilityService.alert("不是本人不能删除！");
                        return;
                    }
                    dataService.deleteCourseNodeSimpleItem({
                        id:id
                    }).then(function (args) {
                        $scope.getCourseSimpleList(nodeId);
                    })
                }
                //案例点赞
                $scope.likeCourseSimple = function (id,nodeid) {
                    if (!$scope.isLogin()){
                        utilityService.alert('请先登录');
                        return
                    }
                    dataService.likeCourseNodeSimple({
                        id:id,
                        // userId:dataService.userInfo.personId,
                        personId:$scope.isLogin(),
                        isLike: 1
                    }).then(function (args) {
                        $scope.getCourseSimpleList(nodeid);
                    })
                };
                //案例编辑
                $scope.editSimple = function (id,personid,content,nodeId) {
                    $scope.m.learnInfo.exampleContent = content;
                    if (!$scope.isLogin()){
                        utilityService.alert('请登录')
                    }
                    if(personid!=$scope.isLogin()){
                        utilityService.alert('不是本人不能编辑');
                    }
                    dataService.updateCourseNodeSimpleItem({
                        id:id,
                        content:$scope.m.learnInfo.exampleContent,
                        personId:$scope.isLogin()
                    }).then(function () {
                        $scope.getCourseSimpleList(nodeId);
                    })
                }


                $scope.$watch("m.learn.curQuestion", function (newValue, oldValue) {
                    if (newValue.fileType == 'video'){
                        createVideo(newValue, newValue.video);
                    }
                    else if (newValue.fileType == 'text') {
                        $scope.getContent(newValue);
                    }

                    if (newValue.fileType != 'video') {
                        pauseVideo();
                    }
                    if(newValue && newValue.guid)
                    {
                        //提交问题
                        // $scope.addCourseASItem(newValue.guid);
                        //获取问题
                        $scope.getCourseASList(newValue.guid);
                        //提交案例
                        // $scope.addCourseSimpleItem(newValue.guid);
                        //获取案例
                        $scope.getCourseSimpleList(newValue.guid);
                    }

                });
                //点击回复按钮是显示input
                $scope.showInput = function(id){
                    $scope.inputId = id;
                };





                var alyPlay = null;
                createVideo = function (item, video) {

                }
                var pauseVideo = function () {
                    var myVideo = document.getElementById("myVideo");
                    myVideo.pause();
                };


                //播放的js
                var recorde = false;
                $scope.play = function () {
                    $scope.showLoading = true;
                    var curQuestion = $scope.m.learn.curQuestion
                    if (curQuestion.fileType != 'text') return;
                    var arr = curQuestion.file.split("/");
                    if (arr.length < 1) return;
    
                    var txtFileName = arr[arr.length - 1];
                    var fileName = txtFileName.replace(".txt", "");

                    dataService.getTtsFile(fileName, curQuestion.TextContent.join(""))
                        .then(function (args) {
                            var media = $("#lessonAudio").attr("src", "http://www.ynjjxx.com/webttsfiles/" + fileName + ".mp3")[0];
                            //$("#lessonAudioSource").attr("src", "http://www.ynjjxx.com/webttsfiles/" + fileName + ".mp3");
                            media.play();
                            recorde = true;
                            $scope.continue = 'pause';
                            $scope.showLoading = false;
                        },
                        function (args) {
                            alert(args.data.ExceptionMessage);
                            $scope.showLoading = false;
                        });
                    return;
                };
                $scope.pause = function() {
                    if (recorde) {
                        $("#lessonAudio")[0].pause();
                        //window.speechSynthesis.pause();
                        $scope.continue = 'resume';
                    }
                };
                $scope.resume = function() {
                    if (recorde) {
                        $("#lessonAudio")[0].play();
                        //window.speechSynthesis.resume();
                        $scope.continue = 'pause';
                    }
                };



            }]);
})();