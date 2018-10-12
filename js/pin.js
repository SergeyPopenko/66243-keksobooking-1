'use strict';

/**
 * Create and render pins from template
 */
(function () {
  var template = document.querySelector('#pin').content;
  var list = document.querySelector('.map__pins');

  /**
   * Creates pin from template
   * @param {Array<string,number>} host
   * @return {HTMLElement}
   */
  var create = function (host) {
    var pin = template.cloneNode(true);
    var item = pin.querySelector('.map__pin');
    var pic = pin.querySelector('img');

    item.style.left = host.location.x - window.utils.Pin.GAP_X + 'px';
    item.style.top = host.location.y - window.utils.Pin.GAP_Y + 'px';

    pic.src = host.author.avatar;
    pic.title = host.offer.title;
    pic.alt = host.offer.title;

    return item;
  };

  /**
     * Render pins list
     * @param {Array<string,number>} pins
     */
  var render = function (pins) {
    var fragment = document.createDocumentFragment();

    pins.forEach(function (pin, i) {
      var pinItem = create(pin);

      if (pinItem) {
        pinItem.addEventListener('click', function (evt) {
          var selected = document.querySelector('.map__pin--active');

          window.card.open(pins[i]);

          if (selected) {
            selected.classList.remove('map__pin--active');
          }

          evt.currentTarget.classList.add('map__pin--active');
        });

        fragment.appendChild(pinItem);
      }
    });

    list.appendChild(fragment);
  };

  window.pin = {
    render: render
  };
})();
