(function () {
   angular.module('app')
       .controller('homeCtrl',['$scope','$state','$timeout','dataService','platform',function ($scope,$state,$timeout,dataService,platform) {

           $scope.m={
               courseClassify: null
           };
           $scope.$emit('navBtn','首页');
           $scope.$emit('showNav');

           //轮播图定时器
           var item = 1;
           var Bgurl = document.getElementById('bannerImg');
           var swiperImg = setInterval(function () {
                    if(item < 5) {
                        Bgurl.style.backgroundImage = "url('img/banner/banner" + item + ".jpg')";
                         item++;
                    }
                    else{
                        item = 1;
                        Bgurl.style.backgroundImage = "url('img/banner/banner" + item + ".jpg')";
                    }
            },2500);
           // swiperImg;


           var _loadCourseClassify = function () {
               dataService.getCourseClassify()
                   .then(function (args) {
                       $scope.m.courseClassify = args;
                   });
           };

               _loadCourseClassify ();



            //点击轮播列表上的跳转事件的方法
           $scope.goContentItem = function (title) {
              $state.go('AllCourseList',{showMenu:title})
           };

           //轮播图下方几个小模块
           // $scope.contentPlateTopItem = [
           //     {
           //         id:63,
           //         contentPlateTitle:'中国法制史',
           //         type:'夏朝的法律制度',
           //         imgUrl:'img/bg/images/第一章夏朝的法律制度.jpg'
           //     },
           //     {
           //         id:33,
           //         contentPlateTitle:'财政与金融',
           //         type:'财政与金融概述',
           //         imgUrl:'img/bg/images/第一章财政概述.jpg'
           //     },
           //     {
           //         id:31,
           //         contentPlateTitle:'实用管理基础',
           //         type:'实用基础管理总论',
           //         imgUrl:'img/bg/images/第一章总论.jpg'
           //     }
           // ];
            $scope.contentPlateTopItem = [];
           $scope._loadNew = function () {
               dataService.getCourseList({
                   type:'最新课程',
                   limit: 3
               }).then(function (args) {
                   for (var i =0;i<args.length;i++){

                       args[i].starRating = parseInt(args[i].starRating);
                   }
                   $scope.contentPlateTopItem = args;
               })
           };
           $scope._loadNew();


           //精品课程与热门课程模块
           $scope.fineIems = [];
           $scope.hotItems = [];
           $scope._loadFind = function () {
               dataService.getCourseList({
                   type:'精品课程',
                   limit: 6
               }).then(function (args) {
                   for (var i =0;i<args.length;i++){

                       args[i].starRating = parseInt(args[i].starRating);
                   }
                   $scope.fineIems = args;
               })
           };
           $scope._loadHotItems =function () {
               dataService.getCourseList({
                   type:'热门课程',
                   limit:6
               }).then(function (args) {
                   $scope.hotItems = args
               })
           }

           //点击小模块跳转到课程页面
           $scope.goCourseItem = function (id) {
               $state.go("courseItem",{id:id});
           }



           $scope._loadFind();
           $scope._loadHotItems();
       }])
})();