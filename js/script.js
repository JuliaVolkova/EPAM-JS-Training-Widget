'use strict';

window.widget = (function () {

        var CELSIUS_TO_KELVIN = 274.15;
        var currentCity = "Paris";
        var citiesList = [
            new City('Paris', 'fr', '../img/paris.jpeg'),
            new City('Amsterdam', 'nl', '../img/amsterdam.jpeg'),
            new City('Auckland', 'nz', '../img/auckland-nz.jpg'),
            new City('Dublin', 'ie', '../img/dublin.jpg'),
            new City('Irkutsk', 'ru', '../img/irkutsk.jpg'),
            new City('London', 'gb', '../img/london.jpg'),
            new City('New-york', 'us', '../img/new-york.jpg'),
            new City('Reykjavik', 'is', '../img/reykjavik.jpg'),
            new City('Rio de Janeiro', 'br', '../img/rio.jpg'),
            new City('Saint-Petersburg', 'ru', '../img/reykjavik.jpg'),
            new City('Tokyo', 'jp', '../img/tokyo.jpg')
        ];

        getForecastForCity(currentCity);

        /**
         * @param {String} userCity
         */
        function getForecastForCity(userCity) {
            var city = citiesList.find(function (city) {
                return city.name === userCity;
            });
            backend.load(city.name, city.code, renderData, showErrorMessage);
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

            var todayTemp = (data.list[0].main.temp - CELSIUS_TO_KELVIN).toFixed();
            var todayWindStrength = data.list[0].wind.speed;

            var weathers = chunks(8, data.list).map(function (dayForecast) {
                var location = currentCity;
                var date = new Date(dayForecast[0].dt_txt);
                var temperature = (dayForecast[0].main.temp - CELSIUS_TO_KELVIN).toFixed();
                var wind = dayForecast[0].wind.speed;
                return new Weather(location, date, temperature, wind);
            });

            var widgetWeather = new Weather(currentCity, new Date(), todayTemp, todayWindStrength);
            var forecast = new WeekForecast(weathers);
            forecast.render();
            widgetWeather.renderCurrentDate();
            widgetWeather.renderCurrentForecast();

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

            searchButton.addEventListener('click', getCity);
            input.addEventListener('blur', closeCityInput);
            input.addEventListener('keydown', closeCityInputByKeyboard);

            // var hideCityName = function () {
            //     document.querySelector('.city').classList.add('hidden');
            // };

            input.addEventListener('change', function() {
                getForecastForCity(input.value) });
            // searchButton.addEventListener('click', hideCityName);
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

        function showErrorMessage() {
            document.querySelector('.error').classList.remove('hidden');
        }

        /**
         * @param {Object} city
         * @param {Date} date
         * @param {String} temperature
         * @param {String} wind
         * @constructor
         */
        function Weather(city, date, temperature, wind) {
            this.city = city;
            this.date = date;
            this.temperature = temperature;
            this.wind = wind;
            this.templateDate = document.querySelector('#template-date');
            this.templateInfo = document.querySelector('#template-info');

            /**
             * @return {Node} Отрисовывает дату на странице на странице
             */
            Weather.prototype.renderCurrentDate = function () {
                var today = this.templateDate.content.querySelector('.date').cloneNode(true);
                today.querySelector('p').textContent = this.date.toLocaleDateString('en-GB', {weekday: 'long'});
                today.querySelector('time').textContent = this.date.toLocaleDateString('en-GB', {
                    month: 'long',
                    day: 'numeric'
                });
                document.querySelector('.wrapper').appendChild(today);
            };

            Weather.prototype.renderCurrentForecast = function () {
                var info = this.templateInfo.content.querySelector('.info').cloneNode(true);
                info.querySelector('.degrees').textContent = this.temperature + '°';
                info.querySelector('.wind').textContent = this.wind + 'mph';
                info.querySelector('.city').textContent = this.city.name;
                document.querySelector('.wrapper').appendChild(info);
            };
        }

        /**
         * @param {Array.<Weather>} list
         * @constructor
         */
        function WeekForecast(list) {
            this.list = list;
            this.templateDay = document.querySelector('#template-day');

            WeekForecast.prototype.add = function (day) {
                this.list.push(day);
                this.render();
            };

            WeekForecast.prototype.render = function () {
                var fragment = document.createDocumentFragment();
                this.list.forEach(function (day) {
                    var element = this.templateDay.content.querySelector('li').cloneNode(true);
                    console.log(day);
                    element.querySelector('.day').textContent = day.date.toLocaleDateString('en-GB', {weekday: 'long'});
                    element.querySelector('.weather').textContent = day.wind;
                    element.querySelector('.degrees').textContent = day.temperature + '℃';
                    fragment.appendChild(element);
                }.bind(this));
                document.querySelector('ol').appendChild(fragment);
            };
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
