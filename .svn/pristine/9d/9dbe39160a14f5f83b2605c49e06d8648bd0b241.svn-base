(function() {
    angular.module("app")
        .controller("LearnCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
            "$state", "myConfig", "$log", "courseService1", "$timeout", "$q", "dataShareService",
            function ($scope, $interval, $stateParams, dataService,
                      $state, myConfig, $log, courseService1, $timeout, $q, dataShareService) {
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
                        questionNumber: 0,
                        answerNumber: 0,
                        answerRightNumber: 0,
                        score: 0,
                        startTime: new Date(),
                        endTime: new Date(),
                        useTime:""
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
                            //循环标题判断items是否有#
                            // for (var j in m.learn.curQuestion.items){
                            //     $scope.judgeNext(j.item.title);
                            // }

                        }
                        $scope.m.learn.curQuestion = $scope.m.learn.questions[0];
                        $scope.m.learn.index = 0;

                        //if (storeService.getLocalValue($scope.m.params.courseId + "_index")){
                        //    $scope.m.learn.index = storeService.getLocalValue($scope.m.params.courseId + "_index")
                        //}

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
                            // for (var item in array){
                            //     if (array[item] !== ''){
                            //         list.push(array[item]);
                            //     }
                            // }
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
                    //$scope.m.learnInfo.startTime = $scope.modal.startTime;
                    //$scope.m.learnInfo.useTime = $scope.modal.useTime;
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

                //过滤title的数组部分使它分级显示
                // $scope.filterTitle = function(titlearr){
                //
                //     for (var i in titlearr){
                //
                //     }
                // }


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



                // //过滤带有#号的文本
                // $scope.judgeText = function (item) {
                //     if(item.substr(0,1) == '#'){
                //         return '';
                //     }
                //     else
                //         return item;
                // };

                // //判断文本标题是否有#号如果有则调到下一页
                // $scope.judegeNext = function () {
                //     var show = false;
                //     var obj = $scope.m.learn.curQuestion.items;
                //     for (var item in obj){
                //         if(obj[item].title.substr(0,1) == '#' && obj[item].title!='图片' &&
                //             obj[item].title!='视频' && obj[item].type !='question'){
                //            show = true;
                //         }
                //     }
                //     return show;
                // };
                // $scope.noneContent = function () {
                //     if ($scope.m.learn.curQuestion.fileType == 'text'&&!$scope.m.curQuestion.TextContent){
                //         console.log('跳过这个页面123423');
                //         return true;
                //     }
                //     else
                //         return false;
                // };
                $scope.next = function () {
                    courseService1.nextLearn();
                    // if ($scope.judegeNext()){
                    //     $scope.next();
                    // }
                    // else if ($scope.noneContent()){
                    //     $scope.next();
                    // };
                };

                $scope.prior = function () {
                    courseService1.priorLearn();
                    // if ($scope.judegeNext()){
                    //     $scope.prior();
                    // }
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



                // $scope.toQustion = function (t) {
                //     var html = '';
                //     var arr=[];
                //     for (var i=0;i<t.length;i++){
                //         html += "<input type='checkbox' ng-checked='"+t[i].isUserChoice+"'/>";
                //         html += "<span class='lineHeight pointer' ng-if='"+$scope.m.learn.curQuestion.answerStatus == 0 || !t[i].isUserChoice+">"+t[i].title+"'</span>";
                //         html += "<span class='learnProper' ng-if='"+$scope.m.learn.curQuestion.answerStatus != 0 && t[i].type == 'rightAnswer' && t[i].isUserChoice+"'>"+t[i].title +"</span>";
                //         html += "<span class='text-danger' style='text-decoration:line-through' ng-if='" +$scope.m.learn.curQuestion.answerStatus != 0 && t[i].type == 'errorAnswer' && t[i].isUserChoice+"'>"+t[i].title+"</span>";
                //         arr.push(html);
                //     }
                //     return arr;
                //     // console.log($('.questionOnly')[0].html());
                // };

                var random = function(array) {
                    var arr = array;
                    var arr1 =  arr.sort(function() {
                        return .5 - Math.random();
                    });
                    return arr1;
                };








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
                });

                var alyPlay = null;
                createVideo = function (item, video) {
                    //// 从服务器获取资源
                    //alyPlay = new prismplayer({
                    //    id: "J_prismPlayer",
                    //    autoplay: true,
                    //    width: "100%",
                    //    source: video.video
                    //});
                }
                var pauseVideo = function () {
                    var myVideo = document.getElementById("myVideo");
                    myVideo.pause();
                };

                // $scope.toQustion();

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
                    //recorde = true;
                    //window.speechSynthesis.cancel();//先对之前暂停的清除缓存
                    //var utterThis = new window.SpeechSynthesisUtterance($('#selectTxt').text());
                    //window.speechSynthesis.speak(utterThis);
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
                }
            }]);
})();