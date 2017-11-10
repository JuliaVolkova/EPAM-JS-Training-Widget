'use strict';

window.widget = (function () {

        var CELSIUS_TO_KELVIN = 274.15;
        var currentCity = "Paris";
        var citiesList = [
            new City('Paris', 'fr', 'img/paris.jpeg'),
            new City('Amsterdam', 'nl', 'img/amsterdam.jpeg'),
            new City('Auckland', 'nz', 'img/auckland-nz.jpg'),
            new City('Dublin', 'ie', 'img/dublin.jpg'),
            new City('Irkutsk', 'ru', 'img/irkutsk.jpg'),
            new City('London', 'gb', 'img/london.jpg'),
            new City('New York', 'us', 'img/new-york.jpg'),
            new City('Reykjavik', 'is', 'img/reykjavik.jpg'),
            new City('Rio de Janeiro', 'br', 'img/rio.jpg'),
            new City('Saint-Petersburg', 'ru', 'img/st-petersburg.jpg'),
            new City('Tokyo', 'jp', 'img/tokyo.jpg')
        ];
        var widget;

        getForecastForCity(currentCity);

        /**
         * @param {String} userCity
         */
        function getForecastForCity(userCity) {
            currentCity = citiesList.find(function (city) {
                return city.name === userCity;
            });
            backend.load(currentCity.name, currentCity.code, renderData, showErrorMessage);
        }

        /**
         * @param {Object} data
         * @param {Array.<Object>} data.list
         * @param {Object} data.list.main
         * @param {String} data.list.main.temp
         * @param {String} data.list.wind.speed
         * @param {String} data.list.weather.main
         */
        function renderData(data) {
            var weathers = chunks(8, data.list).map(function (dayForecast) {
                var date = new Date(dayForecast[0].dt_txt);
                var temperature = (dayForecast[0].main.temp - CELSIUS_TO_KELVIN).toFixed();
                var wind = dayForecast[0].wind.speed;
                var type = dayForecast[0].weather[0].main.toLowerCase();
                return new Weather(date, temperature, wind, type);
            });

            if (widget) widget.destroy();
            widget = new Widget(currentCity, weathers);
            widget.render();

            var input = document.querySelector('#location');
            var searchButton = document.querySelector('.search');

            var getCity = function () {
                input.classList.remove('hidden');
                input.focus();
            };

            var closeCityInput = function () {
                input.classList.add('hidden');
            };

            var closeCityInputByKeyboard = function (evt) {
                if (evt.keyCode === 27) {
                    input.classList.add('hidden');
                }
            };

            var hideCityName = function () {
                document.querySelector('.city').classList.add('hidden');
            };

            searchButton.addEventListener('click', getCity);
            searchButton.addEventListener('click', hideCityName);
            input.addEventListener('blur', closeCityInput);
            input.addEventListener('keydown', closeCityInputByKeyboard);
            input.addEventListener('change', function() {
                getForecastForCity(input.value) });

        }

        /**
         * @param {Number} size
         * @param {Array.<*>} array
         * @return {Array.<Array.<*>>} в котором каждый элемент - это массив элементов массива {@code array} длиной {@code size}
         */
        function chunks(size, array) {
            var newArray = [];
            for (var i = 0; i < array.length; i += size) {
                newArray.push(array.slice(i, i + size));
            }
            return newArray;
        }

        function showErrorMessage(status) {
            var errorMessageTemplate = document.querySelector('#error').content.cloneNode(true);
            var message;
            switch (status) {
                case 404:
                    message = 'Error 404. Unauthorized';
                    break;

                case 401:
                    message = 'Error 401. Not found';
                    break;

                case 500:
                    message = 'Error 500. Sorry, something went wrong. Try it later please :)';
                    break;

                default:
                    message = 'Sorry, something went wrong. Try it later please :)';
            }
            errorMessageTemplate.querySelector('p').textContent = message;
            document.body.appendChild(errorMessageTemplate)
            document.querySelector('#error').classList.remove('hidden');
        }

        /**
         * @param {Object} city
         * @param {Array} weathers
         * @constructor
         */
        function Widget(city, weathers) {
            this.city = city;
            this.weathers = weathers;
            this.template = document.querySelector('#template');

            /**
             * @return {Node} Отрисовывает дату на странице на странице
             */
            Widget.prototype.render = function() {
                var element = this.template.content.querySelector('.widget').cloneNode(true);
                element.querySelector('img').src = city.background;
                var currentWeather = this.weathers.shift();
                element.querySelector('p').textContent = currentWeather.date.toLocaleDateString('en-GB', {weekday: 'long'});
                element.querySelector('time').textContent = currentWeather.date.toLocaleDateString('en-GB', {
                    month: 'long',
                    day: 'numeric'
                });
                element.querySelector('.degrees').textContent = currentWeather.temperature + '°';
                element.querySelector('.wind').textContent = currentWeather.wind + 'mph';
                element.querySelector('.city').textContent = currentCity.name;
                var list = element.querySelector('ol');
                var fragment = document.createDocumentFragment();
                this.weathers.forEach(function (day) {
                    var listElement = list.querySelector('li').cloneNode(true);
                    listElement.querySelector('.day').textContent = day.date.toLocaleDateString('en-GB', {weekday: 'long'});
                    console.log(day.type);
                    listElement.querySelector('.weather').textContent = day.type;
                    listElement.querySelector('.degrees').textContent = day.temperature + '℃';
                    fragment.appendChild(listElement);
                });
                list.innerHTML = '';
                list.appendChild(fragment);
                document.body.appendChild(element);
            };

            Widget.prototype.destroy = function() {
                document.body.removeChild(document.querySelector('.widget'));
            }
        }

        /**
         * @param {Date} date
         * @param {String} temperature
         * @param {String} wind
         * @param {String} type
         * @constructor
         */
        function Weather(date, temperature, wind, type) {
            this.date = date;
            this.temperature = temperature;
            this.wind = wind;
            this.type = type;
        }

        /**
         * @param {String} name
         * @param {String} code
         * @param {String} background
         * @constructor
         */
        function City(name, code, background) {
            this.name = name;
            this.code = code;
            this.background = background;
        }
    }
)();
