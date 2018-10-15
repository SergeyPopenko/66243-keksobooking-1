'use strict';

(function () {
  var MAX_PINS = 5;

  var map = document.querySelector('.map');
  var pin = map.querySelector('.map__pin--main');
  var filter = map.querySelector('.map__filters');
  var filters = filter.querySelectorAll('select, fieldset');
  var form = document.querySelector('.ad-form');
  var fields = form.querySelectorAll('.ad-form fieldset');
  var items = [];

  var Start = {
    TOP: 375,
    LEFT: 570
  };

  var getPinPosition = function () {
    var pinX = parseInt(pin.style.left, 10) - window.utils.Pin.GAP_X;
    var pinY = parseInt(pin.style.top, 10) - window.utils.Pin.GAP_Y;

    return [pinX, pinY].join(', ');
  };

  var resetPinPosition = function () {
    pin.style.left = Start.LEFT + 'px';
    pin.style.top = Start.TOP + 'px';
  };


  var pinMousedownHandler = function (evt) {
    var startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };
      console.log(`startPoints `);
      console.log(startPoints);


    var pinMousemoveHandler = function (moveEvt) {
      console.log(`moveEvt`);
      console.log(moveEvt);
      moveEvt.preventDefault();

      var currentPoints = {
        x: startPoints.x - moveEvt.clientX,
        y: startPoints.y - moveEvt.clientY
      };

      startPoints = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      }

      console.log(`currentPoints `);
      console.log(currentPoints);

      var currentY = pin.offsetTop - currentPoints.y;
      var currentX = startPoints.x - currentPoints.x - map.offsetLeft - window.utils.Pin.MAIN_GAP;

      var startY = window.utils.Coordinate.MIN + window.utils.Pin.MAIN_GAP_BIG;
      var stopY = window.utils.Coordinate.MAX - window.utils.Pin.MAIN_GAP_BIG;
      var stopLeftX = 0;
      var stopRightX = map.offsetWidth - window.utils.Pin.MAIN_GAP_BIG;
      console.log(`currentY ` + currentY);

      if (stopY > currentY && startY < currentY) {
        pin.style.top = currentY + 'px';
      }

      if (stopRightX > currentX && stopLeftX < currentX) {
        pin.style.left = currentX + 'px';
      }
    };

    var mouseupHandler = function (upEvt) {
      upEvt.preventDefault();
      window.form.init(getPinPosition());

      document.removeEventListener('mousemove', pinMousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', pinMousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  var initMap = function () {
    map.classList.remove('map--faded');
  };

  var hideMap = function () {
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }
  };

  var removePins = function () {
    var hosts = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    hosts.forEach(function (host) {
      host.remove();
    });
  };

  var getItems = function (hosts) {
    items = hosts;

    window.pin.render(items.slice(0, MAX_PINS));
  };

  var setError = function (error) {
    return error;
  };

  var showPins = function () {
    window.backend.load(getItems, setError);
  };

  var setPageActive = function () {
    initMap();
    showPins();
    activateFields();

    window.form.init(getPinPosition());

    window.photo.addHandlers();

    filter.addEventListener('change', filterChangeHandler);

    pin.removeEventListener('mousedown', pinMousedownHandler);
    pin.removeEventListener('keydown', pinKeydownHandler);
    document.removeEventListener('mouseup', mouseupHandler);

    pin.addEventListener('mousedown', pinMousedownHandler);
  };

  var disableFields = function () {
    window.form.setDisabled(filters, true);
    window.form.setDisabled(fields, true);
  };

  var activateFields = function () {
    window.form.setDisabled(filters, false);
    window.form.setDisabled(fields, false);
  };

  var setPageDisabled = function () {
    disableFields();

    window.photo.removeHandlers();

    pin.tabIndex = 0;

    pin.addEventListener('mousedown', pinMousedownHandler);
    pin.addEventListener('keydown', pinKeydownHandler);
    document.addEventListener('mouseup', mouseupHandler);

    filter.removeEventListener('change', filterChangeHandler);

    window.form.setAdress([Start.LEFT, Start.TOP].join(', '));
  };

  var mouseupHandler = function (evt) {
    if (!evt.target.closest('.success')) {
      setPageActive();

      document.removeEventListener('mouseup', mouseupHandler);
    }
  };

  var pinKeydownHandler = function (evt) {
    window.utils.enterKeyCheck(evt.keyCode, setPageActive);
  };

  var filterChangeHandler = window.utils.setDebounce(function () {
    var results = window.filter.getFiltered(items);

    window.card.hide();

    removePins();

    window.pin.render(results.slice(0, MAX_PINS));
  });

  setPageDisabled();

  var resetPage = function () {
    hideMap();
    setPageDisabled();
    resetPinPosition();
    removePins();
  };

  window.main = {
    hideMap: hideMap,
    removePins: removePins,
    getPinPosition: getPinPosition,
    setPageDisabled: setPageDisabled,
    resetPinPosition: resetPinPosition,
    resetPage: resetPage
  };
})();
