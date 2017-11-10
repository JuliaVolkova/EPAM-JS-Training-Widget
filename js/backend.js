'use strict';

window.backend = (function () {
    return {
        /**
         * @param {String} city
         * @param {String} code
         * @param {Function} success
         * @param {Function} error
         */
        load: function (city, code, success, error) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + ',' + code + '&APPID=1ce776c63fa744abd79089ebdecbf860');
            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    success(data);
                } else {
                    error(status);
                }
            });

            xhr.addEventListener('error', error);

            xhr.send();
        }
    };
})();
