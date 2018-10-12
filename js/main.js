'use strict';

/**
 * Add page load event listeners and set global selectors
 */
(function () {
  var MAX_PINS = 5;

  var map = document.querySelector('.map');
  var pin = map.querySelector('.map__pin--main');
  var filter = map.querySelector('.map__filters');
  var filters = filter.querySelectorAll('select, fieldset');
  var form = document.querySelector('.ad-form');
  var fields = form.querySelectorAll('.ad-form fieldset');
  var items = [];

  /**
   * Start pin position
   */
  var Start = {
    TOP: 375,
    LEFT: 570
  };

  /**
   * Gets position of main pin
   * @param {boolean} split - flag to get coordinates in object form
   * @return {string}
   */
  var getPinPosition = function () {
    var pinX = parseInt(pin.style.left, 10) - window.utils.Pin.GAP_X;
    var pinY = parseInt(pin.style.top, 10) - window.utils.Pin.GAP_Y;

    return [pinX, pinY].join(', ');
  };

  /**
   * Updates position of main pin
   * @param {number} left
   * @param {number} top
   */
  var resetPinPosition = function () {
    pin.style.left = Start.LEFT + 'px';
    pin.style.top = Start.TOP + 'px';
  };

  /**
   * Handler for drag & drop start
   * @param {MouseEvent} evt - mouse hold
   */
  var pinMousedownHandler = function (evt) {
    var startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
     * Handler for move element
     * @param {MouseEvent} moveEvt - drag & drop
     */
    var pinMousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var currentPoints = {
        x: startPoints.x - moveEvt.clientX,
        y: startPoints.y - moveEvt.clientY
      };

      var currentY = startPoints.y - currentPoints.y
        - window.utils.Pin.MAIN_GAP_BIG / 2;
      var currentX = startPoints.x - currentPoints.x - map.offsetLeft
        - window.utils.Pin.MAIN_GAP;
      var startY = window.utils.Coordinate.MIN + window.utils.Pin.MAIN_GAP_BIG;
      var stopY = window.utils.Coordinate.MAX - window.utils.Pin.MAIN_GAP_BIG;
      var stopLeftX = 0;
      var stopRightX = map.offsetWidth - window.utils.Pin.MAIN_GAP_BIG;

      if (stopY > currentY && startY < currentY) {
        pin.style.top = currentY + 'px';
      }

      if (stopRightX > currentX && stopLeftX < currentX) {
        pin.style.left = currentX + 'px';
      }
    };

    /**
     * Handler for drag & drop end
     * @param {MouseEvent} upEvt - mouse release
     */
    var mouseupHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', pinMousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', pinMousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  };

  /**
   * Inits map
   */
  var initMap = function () {
    map.classList.remove('map--faded');
  };

  /**
   * Deactivates map
   */
  var hideMap = function () {
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }
  };

  /**
   * Removes all pins, but not main
   */
  var removePins = function () {
    var hosts = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    hosts.forEach(function (host) {
      host.remove();
    });
  };

  /**
   * Gets data and sets pins without sort
   * @param {Array<Object>} hosts
   */
  var getItems = function (hosts) {
    items = hosts;

    window.pin.render(items.slice(0, MAX_PINS));
  };

  /**
   * Error callback
   * @param {string} error
   * @return {string} error message
   */
  var setError = function (error) {
    return error;
  };

  /**
   * Load data and show pins without sort
   */
  var showPins = function () {
    window.backend.load(getItems, setError);
  };

  /**
   * Render host pins and remove disabled classes from search form.
   * Updates adress field coordinates value.
   */
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
  };

  /**
   * Sets fields disabled property
   */
  var disableFields = function () {
    window.form.setDisabled(filters, true);
    window.form.setDisabled(fields, true);
  };

  /**
   * Removes fields disabled property
   */
  var activateFields = function () {
    window.form.setDisabled(filters, false);
    window.form.setDisabled(fields, false);
  };

  /**
   * Sets disabled state for page elements
   * Add event listeners.
   */
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

  /**
   * Set active state for page elements on mouseup.
   * Removes keydown event listener.
   */
  var mouseupHandler = function () {
    setPageActive();

    document.removeEventListener('mouseup', mouseupHandler);
  };

  /**
   * Handler for activate page by enter button
   * @param {KeyboardEvent} evt - keyboard event
   */
  var pinKeydownHandler = function (evt) {
    window.utils.enterKeyCheck(evt.keyCode, setPageActive);
  };

  var filterChangeHandler = window.utils.setDebounce(function () {
    var results = window.filter.getFiltered(items);

    window.card.hide();

    removePins();

    window.pin.render(results.slice(0, MAX_PINS));
  });

  /**
   * Disables elements on load
   */
  setPageDisabled();

  /**
   * Returns page to default state
   */
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
