(function() {
    angular.module("app")
        .controller("LearnCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
            "$state", "myConfig", "$log", "courseService1", "$timeout", "$q", "dataShareService","utilityService","storeService",
            function ($scope, $interval, $stateParams, dataService,
                      $state, myConfig, $log, courseService1, $timeout, $q, dataShareService,utilityService,storeService) {
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
                // $scope.inputId = '';
                $scope.hotList = [];//热门评论列表
                $scope.newList = []; //最新列表

                $scope.valueId = '';//定义bootstrap显示的模态框的数据传递变量
                $scope.valuePersonId = '';
                $scope.NodeType = '';

                $scope.userId = dataService.userInfo.personId;
                // $scope.showask = '';//显示回复的input
                $scope.showdelete1 = false;
                $scope.start = 0; //开始加载的条数

                $scope.m = {
                    params:{
                        courseId:$stateParams.courseId,
                        courseName:$stateParams.courseName,
                        courseNameEx: $stateParams.courseNameEx,
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
                        // askContent:'',//问问题的内容
                        // replyContent:'',//回复问题的内容
                        exampleContent: '',//提交案例的内容
                        // loginLodin: '',//提交时候的提示
                        // loginExamplLodin: '' //提交案例时候的提示
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


                $scope.getContent = function (courseItem) {
                    var defer = $q.defer();
                    if (!courseItem){
                        defer.resolve("");
                    }
                    else
                        if (courseItem.file.indexOf(".txt") < 0)
                        {defer.resolve("");}
                        else {
                         var courseNameEx = $scope.m.params.courseNameEx ?   $scope.m.params.courseNameEx : "";
                    dataService.getTextContent({
                        courseName: $scope.m.params.courseName + courseNameEx,
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
                    var score = courseService1.getLearnScore();
                    $scope.m.learnInfo.score = score.score;
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




                var random = function(array) {
                    var arr = array;
                    var arr1 =  arr.sort(function() {
                        return .5 - Math.random();
                    });
                    return arr1;
                };



                //提交案例内容
                $scope.addCourseSimpleItem = function(nodeId,nodeType){
                    if(nodeType=='question')
                        return;
                    if (!$scope.userId){
                        utilityService.alert("请登录");
                        return;
                    }
                    else
                    if ($scope.m.learnInfo.exampleContent ==''){
                        utilityService.alert("填写内容再提交");
                        return;
                    }
                    dataService.addCourseNodeSimpleItem({
                      courseId:$scope.m.params.courseId,
                      nodeId:nodeId,
                      parentId:  0,
                      type: '',
                      learnMode:$scope.m.params.difficulty,
                      content:$scope.m.learnInfo.exampleContent,
                      personId:$scope.userId
                  }).then(function (args) {
                      $scope.getCourseSimpleList(nodeId,'最新',100);
                      $scope.m.learnInfo.exampleContent = '';
                  })
                };
                //获取案例内容
                $scope.getCourseSimpleList = function (nodeId,orderType,limit) {
                    dataService.getCourseNodeSimpleList({
                        courseId:$scope.m.params.courseId,
                        nodeId:nodeId,
                        personId: $scope.userId,
                        type: '',
                        learnMode: $scope.m.params.difficulty,
                        orderType: orderType,//热门或最新
                        start:0,
                        limit:limit
                    }).then(function (args) {
                        // if (args.length>0){
                            if (orderType == '最新')
                                $scope.newList = args;
                            // {
                            //     // $scope.newList=[];
                            //     for (var item in args)
                            //     $scope.newList.push(args[item]);
                            // }
                            if (orderType == '热门')
                            // {
                                $scope.hotList = args;
                            //        for (var item in args)
                            //         $scope.hotList.push(args[item]);
                            // }
                        // }
                    },function (args) {
                        //alert(args);
                    })
                };

                //点击删除按钮时给变量赋值
                $scope.deleteNews = function (userId,personId,nodeType) {
                    $scope.valueId = userId,
                    $scope.valuePersonId = personId,
                    $scope.NodeType = nodeType
                };
                //确认删除时调用删除方法
                $scope.deleteConframe = function () {
                    $scope.deleteExample($scope.valueId,$scope.valuePersonId,$scope.m.learn.curQuestion.guid,$scope.NodeType);
                };

                //删除案例内容
                $scope.deleteExample = function (id,personId,nodeId,orderType) {
                    if (!$scope.userId){
                        utilityService.alert("请登录！");
                        return;
                    }
                    if (personId!=$scope.userId)
                    {
                        utilityService.alert("不是本人不能删除！");
                        return;
                    }
                    dataService.deleteCourseNodeSimpleItem({
                        id:id
                    }).then(function (args) {
                        $scope.getCourseSimpleList(nodeId,'热门',6);
                        $scope.getCourseSimpleList(nodeId,'最新',100);
                    })
                };

                //案例点赞
                $scope.likeCourseSimple = function (id,nodeid,orderType) {
                    if (!$scope.userId){
                        utilityService.alert('请先登录');
                        return
                    }
                    dataService.likeCourseNodeSimple({
                        id:id,
                        personId:$scope.userId,
                        isLike: 1
                    }).then(function (args) {
                        // $scope.getCourseSimpleList(nodeid,orderType);
                        $scope.getCourseSimpleList(nodeid,'最新',100);
                        $scope.getCourseSimpleList(nodeid,'热门',6);
                    })
                };
                //点击加载六条
                // $scope.addNewList = function (nodeId) {
                    // $scope.start+=6;
                //     $scope.getCourseSimpleList(nodeId,'最新',$scope.start+=6)
                // };



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
                        // $scope.getCourseASList(newValue.guid);
                        //提交案例
                        // $scope.addCourseSimpleItem(newValue.guid);
                        //获取案例
                         $scope.getCourseSimpleList(newValue.guid,'热门',6);
                         $scope.getCourseSimpleList(newValue.guid,'最新',100);
                    }
                    $scope.m.learnInfo.exampleContent = '';
                });
                //点击回复按钮是显示input
                // $scope.showInput = function(id){
                //     $scope.inputId = id;
                // };





                var alyPlay = null;
                var createVideo = function (item, video) {

                }
                var pauseVideo = function () {
                    var myVideo = document.getElementById("myVideo");
                    if (!myVideo)return;
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

                var token = storeService.getLocalValue("token");
                if (token){
                    dataService.loginByToken({
                        token:token
                    })
                }
                $scope.getUserId = function () {
                    $scope.userId = dataService.userInfo.personId;
                };
                // $scope.getUserId();
                $scope.loadData();

            }]);
})();