(function () {
    angular.module('app')
    .filter("customDate", function () {
        return function (input, params) {
            if (!input) return "";
            if (!(input instanceof Date)) {
                var timestamp = input.match(/\d+/);
                timestamp[0] /= 1000;
                if (params == "date") {
                    return moment.unix(timestamp[0]).format("YYYY-MM-DD");
                }
                else if (params == "time") {
                    return moment.unix(timestamp[0]).format("HH:mm:ss");
                }
                else {
                    return moment.unix(timestamp[0]).format("YYYY-MM-DD HH:mm:ss");
                }
            }
            else {
                if (params == "date") {
                    return moment(input).format("YYYY-MM-DD");
                }
                else if (params == "time") {
                    return moment(input).format("HH:mm:ss");
                }
                else {
                    return moment(input).format("YYYY-MM-DD HH:mm:ss");
                }
            }
        };
    })
    .filter("filterEmptyClass", function () {
        return function (input, params) {
            if (!input) return [];
            var tempArray = [];
            for (i = 0; i < input.length; i++) {
                if (input[i].nodes.length > 0) {
                    tempArray.push(input[i]);
                }
            }
            return tempArray;
        };
    })
    .filter("filterErrorQuestion", function () {
        return function (input, params) {
            // node.isRight!='false' && node.isKeep!='false'
            if (!input) return [];
            var tempArray = [];
            for (i = 0; i < input.length; i++) {
                if (input[i].isRight != "false") {
                    tempArray.push(input[i]);
                }
            }
            return tempArray;
        };
    })
    .filter("msgContentFormat", function () {
        return function (input, params) {
            // node.isRight!='false' && node.isKeep!='false'
            if (!input) return [];
            var tempArray = [];
            for (i = 0; i < input.length; i++) {
                var temp = input[i].split(":");
                if (temp.length <= 1)
                    temp = input[i].split("：");
                item = {};
                item.key = temp[0] + " : ";
                item.value = temp[1];
                tempArray.push(item);
            }
            return tempArray;
        };
    })
    .filter("titleList", function () {
        return function (input) {
            if (!input) return [];
            var tempArray = [];
            if (input instanceof Array) {
                tempArray = input;
                for (var i = 0; i < tempArray.length; i++) {
                    tempArray[i] = tempArray[i].replace("@check@", "");
                }
            }
            else {
                tempArray.push(input.replace("@check@", ""));
            }
            return tempArray;
        };
    })
    .filter("textLength", function () {
        return function (input, params) {
            if (!input) return "";
            try {
                if (input.length > parseInt(params)) {
                    return input.substring(0, parseInt(params)) + "...";
                }
            }
            catch (ex) {

            }
            return input;

        };
    })
    .filter("randomArr", function () {
        return function (input) {
            function randomsort(a, b) {
                return Math.random()>.5 ? -1 : 1;//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
            }
            if (!input) return [];
            try {
                return input.sort(randomsort);
            }
            catch (ex) {
                return [];
            }
            return input;

        };
    })
    .filter("msgFormat", function () {
        return function (input, params) {
            if (!input) return "";
            var tempArray = input.split(":");
            if (tempArray.length == 1)
                tempArray = input.split("：");
            if (tempArray.length >= 2) {
                if (params == 'title') {
                    return tempArray[0];
                }
                else if (params == 'content') {
                    var tempString = "";
                    for (var i = 1; i < tempArray.length; i++) {
                        tempString += tempArray[i];
                    }
                    return tempString;
                }
            }
            else {
                return input;
            }
        }
        })
        .filter("filterText",function () {
            return function (input) {
                if (input.substr(0,1) == '#' || input.substr(0,1) =='＃'){
                    return '';
                }
                else return input;
            }
        });
})();