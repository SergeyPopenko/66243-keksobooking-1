'use strict';

(function () {
  var parse = function (pin) {
    var items = [
      {
        isValid: pin.author.avatar !== undefined,
        data: pin.author.avatar,
        elem: '.popup__avatar',
      },
      {
        isValid: pin.offer.title !== undefined,
        data: pin.offer.title,
        elem: '.popup__title',
      },
      {
        isValid: pin.offer.address !== undefined,
        data: pin.offer.address,
        elem: '.popup__text--address',
      },
      {
        isValid: pin.offer.price !== undefined,
        data: pin.offer.price + ' ₽/ночь',
        elem: '.popup__text--price',
      },
      {
        isValid: pin.offer.type !== undefined,
        data: window.utils.getHostType(pin.offer.type).headerText,
        elem: '.popup__type',
      },
      {
        isValid: typeof pin.offer.rooms === 'number'
          && typeof pin.offer.guests === 'number',
        data: pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей',
        elem: '.popup__text--capacity',
      },
      {
        isValid: pin.offer.checkin !== undefined
          && pin.offer.checkout !== undefined,
        data: 'Заезд после ' + pin.offer.checkin + ', выезд до '
          + pin.offer.checkout,
        elem: '.popup__text--time',
      },
      {
        isValid: pin.offer.description !== undefined,
        data: pin.offer.description,
        elem: '.popup__description',
      }
    ];

    return items;
  };

  window.data = {
    parse: parse
  };
})();
