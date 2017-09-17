(function () {
    angular.module("app",["ui.router","yang.pages"])
        .constant("templateConfig", {
            programName: "我要学习",
            userRegist: {
                templateName: "userRegist_private"
            }
        })
        .constant("serviceUrl", "http://www.kmztsoftware.com/ZSDT")
        .constant("filesUrl", "http://www.kmztsoftware.com/CourseFiles")
        .constant("platform", "wx")
        .constant("myConfig", {
            programName: "九君网校",
            platform: "wx",
            videoPlatform: "aly",
            version: "1.0.47",
            //serviceUrl: "http://localhost:57322/",
            serviceUrl: "http://www.kmztsoftware.com/ZSDT",
            filesUrl: "http://www.kmztsoftware.com/CourseFiles",
            // serviceUrl: "http://www.ynjjxx.com/ZSDT",
            // filesUrl:"http://www.ynjjxx.com/CourseFiles",
            needSelectDifficulty:false,
            templates: [
                {
                    key: "userRegist",
                    value:{
                        templateName: "userRegist_private"
                    }
                }
            ],
            debug: {
                videoFrom : "fwq"
            }
        })
        .config(["$stateProvider","$urlRouterProvider",function ($stateProvider,$urlRouterProvider) {
            $stateProvider
                .state('AllCourseList',{
                    url:'/allCourseList/:showMenu',
                    controller: 'allCourseListCtrl',
                    templateUrl: 'WebView/allCourseList.html'
                })
                .state('home',{
                    url: '/home',
                    controller: 'homeCtrl',
                    templateUrl: 'WebView/home.html'
                })
                .state('myCourse',{
                    url:'/myCourse',
                    controller: 'myCourseCtrl',
                    templateUrl: 'WebView/mycourse.html'
                })
                .state('myInformation',{
                    url:'/myInformation',
                    controller:'MyInfo',
                    templateUrl:'WebView/myinformation.html'
                })
                .state('new',{
                    url:'/new',
                    controller:'newCtrl',
                    templateUrl:'WebView/new.html'
                })
                .state('stars',{
                    url:'/stars',
                    controller:'stars',
                    templateUrl: 'WebView/starshtml.html'
                })
                .state('courseItem',{
                    url:'/courseItem/:id',
                    cache:'false',
                    controller:'courseItemCtrl',
                    templateUrl: 'WebView/courseitem.html'
                })
                .state('learnCourse',{
                    url: '/learnCourse/:courseId/:courseName/:difficulty',
                    controller: 'LearnCourseCtrl',
                    templateUrl: 'WebView/learnCourse.html'
                })
                .state('learnCourse1',{
                    url: '/learnCourse1/:courseId/:courseName/:difficulty/:parent/:parentID',
                    cache:'false',
                    controller: 'LearnCourse1Ctrl',
                    templateUrl: 'WebView/learnCourse1.html'
                })
                .state('examCourse1',{
                    url: '/examCourse1/:courseId/:courseName/:difficulty/:parent/:parentID',
                    cache:'false',
                    controller: 'examCourse1Ctrl',
                    templateUrl: 'WebView/examCourse1.html'
                })
                .state('messageItemUrl',{
                    url:'/messageItemUrl/:classifyId/:url',
                    controller: 'messageItemUrlCtrl',
                    templateUrl: 'WebView/messageItemUrl.html'
                })
                .state('messageItem',{
                    url:'/messageItem/:id',
                    controller: 'messageItemCtrl',
                    templateUrl: 'WebView/messageItem.html'
                });
        }])
        .controller("appCtrl",["$scope","$state","$rootScope","dataService",
            function ($scope,$state,$rootScope,dataService) {
            $state.go('home');
            $scope.showLogin = false;
            $scope.showNav = true;
            $scope.footerNav = true; //底部
            $scope.actives =''; //判断显示的是登陆还是注册
            $scope.loginInfo = "";
            $scope.loginMenu = '';
            $scope.loginInfo = "";
            $scope.navMenu = '首页';


            $scope.goAllCorse = function () {
                $scope.navMenu='全部课程';
                $state.go('AllCourseList');
            };
            $scope.goHome = function () {
                $scope.navMenu='首页';
                $state.go('home');
            };
            $scope.goMyCourse = function () {
                $scope.navMenu='我的课程';
                $state.go('myCourse');
            };
            $scope.goMyInformation = function () {
                $scope.navMenu='我的信息';
                $state.go('myInformation');
            };
            $scope.goNew = function () {
                $state.go('new');
            };
            $scope.goStars = function () {
                // console.log('stars');
            };


            $scope.showLoginBox = function (menu) {
                // console.log(loginBg.style);
                // $('#loginBox').css({'display':'block'});
                $scope.showLogin = true;
                $scope.actives = menu;
                // $scope.loginMenu = menu;
                // $scope.$broadcast('showloginMenu',menu);
                // $state('LoginCtrl',{ loginMenu:menu })
            };
            $scope.$watch('appCtrl',function () {

            });


                // 退出登录方法
                $scope.exitLogin = function () {
                    dataService.exitLogin();
                    $scope.loginInfo='';
                    $state.go('home');
                    // $scope.$emit("showLogin", null);
                };



                //收起登录窗口
                $scope.hiddenBox = function () {
                    // $scope.$emit('hiddenLogin');
                    $scope.showLogin = false;
                };

                $scope.$on('showLogin',function (event) {
                $scope.showLogin = true;
                });

                $scope.$on('hiddenLogin',function (event,args) {
                    $scope.loginInfo = args;
                    $scope.showLogin = false;
                });
                $scope.$on('hiddenNav',function () {
                    $scope.showNav = false;
                });
                $scope.$on('showNav',function () {
                    $scope.showNav = true;
                });
                $scope.$on('showFooter',function () {
                    $scope.footerNav = true;
                });
                $scope.$on('hiddenFooter',function () {
                    $scope.footerNav = false;
                });
                $scope.$on('navBtn',function (e,data) {
                    $scope.navMenu = data;
                });


                $('#findPwd').css('display','none');


        }])
}());