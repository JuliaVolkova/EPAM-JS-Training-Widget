'use strict';

var xhr = new XMLHttpRequest();

xhr.open('get', 'https://api.openweathermap.org/data/2.5/forecast?q=Paris,fr&APPID=1ce776c63fa744abd79089ebdecbf860');

xhr.addEventListener('load', getResult);

xhr.send();

function getResult (){
    if (xhr.status === 200) {
        console.log(xhr.responseText);
    }
}

/**
 * @param {String} location
 * @param {Date} date
 * @param {Number} temperature
 * @param {Number} wind
 * @constructor
 */
function Weather (location, date, temperature, wind) {
    this.location = location;
    this.date = date;
    this.temperature = temperature;
    this.wind = wind
}
