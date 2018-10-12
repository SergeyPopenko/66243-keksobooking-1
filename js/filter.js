'use strict';

(function () {
  var FILTER_DEFAULT = 'any';

  var filter = document.querySelector('.map__filters');
  var filterType = filter.querySelector('#housing-type');
  var filterPrice = filter.querySelector('#housing-price');
  var filterRoom = filter.querySelector('#housing-rooms');
  var filterGuest = filter.querySelector('#housing-guests');

  var Price = {
    LOW: 10000,
    MIDDLE: 50000
  };

  var checkType = function (pin) {
    return filterType.value === FILTER_DEFAULT ? true
      : pin.offer.type === filterType.value;
  };

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

  var checkRoom = function (pin) {
    return filterRoom.value === FILTER_DEFAULT ? true
      : pin.offer.rooms === +filterRoom.value;
  };

  var checkGuest = function (pin) {
    return filterGuest.value === FILTER_DEFAULT ? true
      : pin.offer.guests === +filterGuest.value;
  };

  var checkFeature = function (pin) {
    var features = Array.from(filter.querySelectorAll('.map__checkbox:checked'));

    return features.every(function (feature) {
      return pin.offer.features.includes(feature.value);
    });
  };

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
