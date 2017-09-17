(function () {
    angular.module('app')
        .directive('linec',function () {
            return{
                template:
                '<div class="lines">'+
                '<div class="linesc" ></div>'
                +'</div>'
            }
        })
        .directive('lineh',function () {
            return{
                template:
                '<div class="lines">'+
                '<div class="linesh" ></div>'
                +'</div>'
            }
        })
        .directive('linex',function () {
            return{
                template:
                '<div class="liness">'+
                '<div class="linesx" ></div>'
                +'</div>'
            }
        })
})()