(function() {
    angular.module("app")
    .controller("LoginCtrl", ["$scope", "$state", "dataService", "$location", "myConfig","$stateParams",
        function ($scope, $state, dataService, $location, myConfig,$stateParams) {
        // 账号
        $scope.account = "";
        // 密码
        $scope.password = "";

        // 注册注册信息
        $scope.inputs = {
            idCard: '',
            phone:''
        };

        // var menu = $stateParams.loginMenu;
        // 登录方法
            $scope.info= {
                userName:'',
                pwd:''
            };

        $scope.login = function () {
            if ($location.absUrl().toLowerCase().indexOf("wxmain") > 0) {
                dataService.wxLogin({ account: $scope.account, password: $scope.password })
            .then(function (args) {
                // 处理微信登录
                $state.go("index");
            }, function (args) {
                alert(args);
            });
            }
            else {
                dataService.login({ account: $scope.info.userName, password: $scope.info.pwd})
            .then(function (args) {
                // 处理 IE 登录
                // $scope.toggleLoginBox();
                // $state.go('home');
                $scope.$emit('navBtn','首页');
                $scope.$emit('hiddenLogin');
                // $scope.$emit("onLogin", "欢迎您:" + args.personName);
            }, function (args) {
                alert(args);
            });
            }
        };


        //收起登录窗口
            $scope.hiddenBox = function () {
                $scope.$emit('hiddenLogin');
            };

        // 收起登录窗口
        // $scope.toggleLoginBox = function () {
        //     var box = angular.element('#loginBox');
        //     box.toggle();
        // };


            // $scope.$on('showloginMenu',function (event, data) {
            //     console.log('LoginCtrl',data);
            // });

            $scope.actives= 'entry' ;
            // $scope.actives=  $stateParams.showloginMenu ;

        // 用户注册
        $scope.regist = function () {
            if (myConfig.platform == "app") {
                $state.go("userRegist");
            }
            else {
                var box = angular.element('#loginBox');
                box.hide();
                $state.go("userRegist");
                $scope.$emit('hiddenScreen', {});
            }
        };

        // 验证身份证和手机号码格式
        //    532722199508140710
        var idCard=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
        var phone=/^1[34578]\d{9}$/;
         $scope.submitInfo = function () {
             // console.log($scope.inputs.idCard);
            //  if(idCard.test($scope.inputs.idCard)) {
            //     console.log('正确');
            // }
            // else {
            //     console.log('错误');
            // }
             // console.log($scope.inputs.phone);
             if(phone.test($scope.inputs.phone)){
                console.log('yes');
            }else{
                console.log('no');
            }
         };


        // 找回密码
        $scope.findPassword = function () {
            // if (myConfig.platform == "app") {
            //     $state.go("findPassword");
            // }
            // else {
            //     $scope.toggleLoginBox();
            //     $state.go("findPassword");
            //     $scope.$emit('hiddenScreen', {});
            // }
            $('#findPwd').css({'display':'block'})
            $('#login').css({'display':'none'})
        };


    }]);
})();