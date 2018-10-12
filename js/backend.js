'use strict';

(function () {
  var TIMEOUT = 10000;

  /**
   * Link for request
   * @enum {string}
   */
  var Url = {
    GET: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };

  /**
   * Сonfigures request
   * @param {XMLHttpRequest} xhr
   * @param {function} loadCallback - request is successed
   * @param {function} errorCallback - request is failed
   * @return {XMLHttpRequest}
   */
  var configureRequest = function (xhr, loadCallback, errorCallback) {
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      window.utils.getServerCallback(xhr, loadCallback, errorCallback);
    });

    xhr.addEventListener('error', function () {
      errorCallback('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorCallback('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  /**
   * Gets data from remote host
   * @param {callback} loadCallback - request is successed
   * @param {callback} errorCallback - request is failed
   */
  var load = function (loadCallback, errorCallback) {
    var xhr = new XMLHttpRequest();

    configureRequest(xhr, loadCallback, errorCallback);

    xhr.open('GET', Url.GET);
    xhr.send();
  };

  /**
   * Sends data to remote host
   * @param {FormData} data - form field values
   * @param {callback} sendCallback - request is successed
   * @param {callback} errorCallback - request is failed
   */
  var send = function (data, sendCallback, errorCallback) {
    var xhr = new XMLHttpRequest();

    configureRequest(xhr, sendCallback, errorCallback);

    xhr.open('POST', Url.POST);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    send: send
  };
})();
