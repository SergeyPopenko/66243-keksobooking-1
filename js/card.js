'use strict';

(function () {

  var Preview = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var template = document.querySelector('#card').content;
  var map = document.querySelector('.map');
  var isShow = false;
  var close;
  var card;

  var open = function (pin) {
    if (isShow) {
      hide();
    }

    map.appendChild(create(pin));

    card = map.querySelector('.map__card.popup');
    close = card.querySelector('.popup__close');

    close.focus();

    close.addEventListener('click', closeClickHandler);
    document.addEventListener('keydown', keydownHandler);

    isShow = true;
  };

  var hide = function () {
    if (card) {
      close.removeEventListener('click', closeClickHandler);
      document.removeEventListener('keydown', keydownHandler);

      card.remove();
    }

    isShow = false;
  };

  var closeClickHandler = function () {
    hide();
  };

  var keydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hide);
  };

  var create = function (pin) {
    var item = template.cloneNode(true);
    var features = item.querySelector('.popup__features');
    var photos = item.querySelector('.popup__photos');
    var parsedPins = window.data.parse(pin);

    var checkCardChilds = function (parsedItems) {
      parsedItems.forEach(function (parsedItem) {
        var itemChild = item.querySelector(parsedItem.elem);

        if (parsedItem.isValid) {
          if (itemChild.src) {
            itemChild.src = parsedItem.data;
          } else {
            itemChild.textContent = parsedItem.data;
          }
        } else {
          itemChild.remove();
        }
      });
    };

    checkCardChilds(parsedPins);

    renderFeatures(features, pin.offer);
    renderPreviews(photos, pin.offer);

    return item;
  };

  var renderFeatures = function (parent, offer) {
    if (offer.features && offer.features.length > 0) {
      var items = createFeatures(offer.features);

      parent.textContent = '';

      items.forEach(function (item) {
        parent.appendChild(item);
      });
    } else {
      parent.remove();
    }
  };

  var renderPreviews = function (parent, offer) {
    if (offer.photos && offer.photos.length > 0) {
      var previews = createPreviews(offer.photos, offer.title);

      parent.textContent = '';

      previews.forEach(function (preview) {
        parent.appendChild(preview);
      });
    } else {
      parent.remove();
    }
  };

  var createFeatures = function (features) {
    return features.map(function (feature) {
      var item = document.createElement('li');

      item.classList.add('popup__feature', 'popup__feature--' + feature);

      return item;
    });
  };

  var createPreviews = function (photos, title) {
    var previews = window.utils.getSortedList(photos);

    return previews.map(function (preview) {
      var photo = new Image(Preview.WIDTH, Preview.HEIGHT);

      photo.classList.add('popup__photo');
      photo.src = preview;
      photo.title = title;
      photo.alt = title;

      return photo;
    });
  };

  window.card = {
    hide: hide,
    open: open
  };
})();
