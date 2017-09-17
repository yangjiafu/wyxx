(function () {
    angular.module("app")
    .service("utilityService", [function () {
        this.alert = function (message) {
            alert(message);
        };

        this.confirm = function (message, okFunction) {
            if (confirm(message))
                okFunction();
        };

        this.getDateDbString = function (date) {
            return moment(date).format("YYYY-MM-DD HH:mm:ss");
        };

    }]);
})();
