'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  var Pin = {
    WIDTH: 50,
    WIDTH_BIG: 200,
    GAP_X: 25,
    HEIGHT: 70,
    GAP_Y: 35,
    MAIN_GAP: 30,
    MAIN_GAP_BIG: 50
  };

  var Coordinate = {
    MIN: 130,
    MAX: 630
  };

  var StatusCode = {
    SUCCESS: 200,
    ERROR_REQUEST: 400,
    ERROR_NOT_FOUND: 404,
    ERROR_SERVER: 500
  };

  var hostType = {
    'bungalo': {
      headerText: 'Бунгало',
      minCost: 0
    },
    'flat': {
      headerText: 'Квартира',
      minCost: 1000
    },
    'house': {
      headerText: 'Дом',
      minCost: 5000
    },
    'palace': {
      headerText: 'Дворец',
      minCost: 10000
    }
  };

  var getRandomNumber = function (minNumber, maxNumber) {
    return Math.floor((Math.random() * (maxNumber - minNumber) + minNumber));
  };

  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length)];
  };

  var getSortedList = function (list) {
    for (var i = list.length - 1; i > 0; i--) {
      var sort = Math.floor(Math.random() * (i + 1));
      var swap = list[i];

      list[i] = list[sort];
      list[sort] = swap;
    }

    return list;
  };

  var getHostType = function (type) {
    return hostType[type];
  };

  var escKeyCheck = function (keyCode, callback) {
    if (keyCode === KeyCode.ESC) {
      callback();
    }
  };

  var enterKeyCheck = function (keyCode, callback) {
    if (keyCode === KeyCode.ENTER) {
      callback();
    }
  };

  var getServerCallback = function (xhr, successCallback, errorCallback) {
    switch (xhr.status) {
      case StatusCode.SUCCESS:
        successCallback(xhr.response);
        break;
      case StatusCode.ERROR_REQUEST:
        errorCallback('Ошибка запроса');
        break;
      case StatusCode.ERROR_NOT_FOUND:
        errorCallback('Не найдено');
        break;
      case StatusCode.ERROR_SERVER:
        errorCallback('Внутренняя ошибка сервера');
        break;
      default:
        errorCallback('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    }
  };

  var setDebounce = function (fun) {
    var lastTimeout = null;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun();
      }, DEBOUNCE_INTERVAL);
    };
  };

  var checkObjVal = function (obj) {
    var keys = Object.keys(obj);

    return keys.every(function (key) {
      return obj[key] !== undefined;
    });
  };

  window.utils = {
    getServerCallback: getServerCallback,
    getRandomNumber: getRandomNumber,
    enterKeyCheck: enterKeyCheck,
    getRandomItem: getRandomItem,
    getSortedList: getSortedList,
    getHostType: getHostType,
    escKeyCheck: escKeyCheck,
    setDebounce: setDebounce,
    checkObjVal: checkObjVal,
    Coordinate: Coordinate,
    KeyCode: KeyCode,
    Pin: Pin
  };
})();
