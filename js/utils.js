'use strict';

/**
 * Global arrays methods, helps get to and sort data
 */
(function () {
  var DEBOUNCE_INTERVAL = 500;

  /**
   * KeyCode
   * @enum {number}
   */
  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  /**
   * Pin params
   * @enum {number}
   */
  var Pin = {
    WIDTH: 50,
    WIDTH_BIG: 200,
    GAP_X: 25,
    HEIGHT: 70,
    GAP_Y: 35,
    MAIN_GAP: 30,
    MAIN_GAP_BIG: 50
  };

  /**
   * Coordinates limit
   * @enum {number}
   */
  var Coordinate = {
    MIN: 130,
    MAX: 630
  };

  /**
   * Server request result
   * @enum {number}
   */
  var StatusCode = {
    SUCCESS: 200,
    ERROR_REQUEST: 400,
    ERROR_NOT_FOUND: 404,
    ERROR_SERVER: 500
  };

  /**
   * Translate types
   */
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

  /**
   * Gets number value from min to max
   * @param {number} minNumber
   * @param {number} maxNumber
   * @return {number}
   */
  var getRandomNumber = function (minNumber, maxNumber) {
    return Math.floor((Math.random() * (maxNumber - minNumber) + minNumber));
  };

  /**
   * Gets random item
   * @param {Array} array
   * @return {string|number}
   */
  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length)];
  };

  /**
   * Gets random sorted items
   * @param {Array} list
   * @return {Array}
   */
  var getSortedList = function (list) {
    for (var i = list.length - 1; i > 0; i--) {
      var sort = Math.floor(Math.random() * (i + 1));
      var swap = list[i];

      list[i] = list[sort];
      list[sort] = swap;
    }

    return list;
  };

  /**
   * Gets host title and price Object
   * @param {string} type
   * @return {Object<string,number>}
   */
  var getHostType = function (type) {
    return hostType[type];
  };

  /**
   * Wrapper for esc key events
   * @param {number} keyCode
   * @param {function} callback
   */
  var escKeyCheck = function (keyCode, callback) {
    if (keyCode === KeyCode.ESC) {
      callback();
    }
  };

  /**
   * Wrapper for enter key events
   * @param {number} keyCode
   * @param {function} callback
   */
  var enterKeyCheck = function (keyCode, callback) {
    if (keyCode === KeyCode.ENTER) {
      callback();
    }
  };

  /**
   * Handler for server errors process
   * @param {XMLHttpRequest} xhr
   * @param {function} successCallback
   * @param {function} errorCallback
   */
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

  /**
   * Debounce for any method
   * @param {function} fun
   * @return {function}
   */
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
