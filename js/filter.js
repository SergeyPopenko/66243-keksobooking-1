'use strict';

(function () {
  var FILTER_DEFAULT = 'any';

  var filter = document.querySelector('.map__filters');
  var filterType = filter.querySelector('#housing-type');
  var filterPrice = filter.querySelector('#housing-price');
  var filterRoom = filter.querySelector('#housing-rooms');
  var filterGuest = filter.querySelector('#housing-guests');

  /**
   * Price range
   * @enum {number}
   */
  var Price = {
    LOW: 10000,
    MIDDLE: 50000
  };

  /**
   * Find pins by type
   * @param {Array<string,number>} pin
   * @return {Array<string,number>}
   */
  var checkType = function (pin) {
    return filterType.value === FILTER_DEFAULT ? true
      : pin.offer.type === filterType.value;
  };

  /**
   * Find pins by price range
   * @param {Array<string,number>} pin
   * @return {Array<string,number>|boolean}
   */
  var checkPrice = function (pin) {
    switch (filterPrice.value) {
      case 'low':
        return pin.offer.price < Price.LOW;
      case 'middle':
        return pin.offer.price >= Price.LOW && pin.offer.price <= Price.MIDDLE;
      case 'high':
        return pin.offer.price >= Price.MIDDLE;
      default:
        return true;
    }
  };

  /**
   * Find pins by room count
   * @param {Array} pin
   * @return {Array}
   */
  var checkRoom = function (pin) {
    return filterRoom.value === FILTER_DEFAULT ? true
      : pin.offer.rooms === +filterRoom.value;
  };

  /**
   * Find pins by room capacity
   * @param {Array} pin
   * @return {Array}
   */
  var checkGuest = function (pin) {
    return filterGuest.value === FILTER_DEFAULT ? true
      : pin.offer.guests === +filterGuest.value;
  };

  /**
   * Find pins by avalaible features
   * @param {Array<string,number>} pin
   * @return {Array<string,number>}
   */
  var checkFeature = function (pin) {
    var features = Array.from(filter.querySelectorAll('.map__checkbox:checked'));

    return features.every(function (feature) {
      return pin.offer.features.includes(feature.value);
    });
  };

  /**
   * Repaint filtered pins
   * @param {Array} pins
   * @return {Array}
   */
  var getFiltered = function (pins) {
    return pins.filter(function (pin) {
      return checkType(pin) && checkPrice(pin) && checkRoom(pin)
        && checkGuest(pin) && checkFeature(pin);
    });
  };

  window.filter = {
    getFiltered: getFiltered
  };
})();
