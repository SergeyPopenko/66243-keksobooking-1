'use strict';

(function () {
  var TIMEOUT = 10000;

  var Url = {
    GET: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };

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

  var load = function (loadCallback, errorCallback) {
    var xhr = new XMLHttpRequest();

    configureRequest(xhr, loadCallback, errorCallback);

    xhr.open('GET', Url.GET);
    xhr.send();
  };

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
