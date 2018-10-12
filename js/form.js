'use strict';

/**
 * Checks form fields and set properties
 */
(function () {
  /**
   * Room available
   * @enum {number}
   */
  var Apartment = {
    MIN: 1,
    MID: 3
  };

  var size = {
    '1': ['для 1 гостя'],
    '2': ['для 1 гостя', 'для 2 гостей'],
    '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
    '100': ['не для гостей']
  };

  var form = document.querySelector('.ad-form');
  var address = form.querySelector('#address');
  var price = form.querySelector('#price');
  var type = form.querySelector('#type');
  var room = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');
  var reset = form.querySelector('.ad-form__reset');
  var times = form.querySelectorAll('.ad-form__element--time select');

  /**
   * Update field value
   * @param {string} position
   */
  var setAdress = function (position) {
    address.value = position;
  };

  /**
   * Updates min and placeholder in form price field
   */
  var setPrice = function () {
    var cost = window.utils.getHostType(type.value).minCost;

    price.min = cost;
    price.placeholder = cost;
  };

  /**
   * Toggle disabled property for fields
   * @param {Array<HTMLElement>} fields to toggle
   * @param {boolean} isDisabled - indicates when field disabled
   */
  var setDisabled = function (fields, isDisabled) {
    fields.forEach(function (field) {
      field.disabled = isDisabled;
    });
  };

  /**
   * Handler for update host min price on change host type
   */
  var typeChangeHandler = function () {
    setPrice();
  };

  /**
   * Handler for update host check time field
   * @param {Object} evt - change select event
   */
  var timeChangeHandler = function (evt) {
    times.forEach(function (time) {
      if (evt.target.value !== time.value) {
        time.value = evt.target.value;
      }
    });
  };

  /**
   * Filter rooms count by host sizes
   * @param {boolean} isReset - indicates when form resets
   */
  var renderPlaces = function (isReset) {
    var space = room.value;
    var area = isReset ? Apartment.MIN : space;
    var places = size[area];

    capacity.textContent = '';

    places.forEach(function (place, i) {
      var option = document.createElement('option');

      option.textContent = place;
      option.value = (+space > Apartment.MID) ? 0 : i + 1;
      capacity.appendChild(option);
    });
  };

  /**
   * Check current rooms count and render options
   */
  var update = function () {
    renderPlaces(false);
  };

  /**
   * Restore price and adress field values
   */
  var updateValues = function () {
    setPrice();
    setAdress(window.main.getPinPosition());
  };

  /**
   * Handler for restore field values
   */
  var resetClickHandler = function () {
    renderPlaces(true);
    resetForm();
  };

  /**
   * Handler for update room/capacity value in selects
   */
  var roomChangeHandler = function () {
    update();
  };

  // init handlers
  var addHandlers = function () {
    times.forEach(function (time) {
      time.addEventListener('change', timeChangeHandler);
    });

    room.addEventListener('change', roomChangeHandler);
    type.addEventListener('change', typeChangeHandler);
    reset.addEventListener('click', resetClickHandler);
    form.addEventListener('submit', formSubmitHandler);
  };

  // disable handlers
  var removeHandlers = function () {
    times.forEach(function (time) {
      time.removeEventListener('change', timeChangeHandler);
    });

    room.removeEventListener('change', roomChangeHandler);
    type.removeEventListener('change', typeChangeHandler);
    reset.removeEventListener('click', resetClickHandler);
    form.removeEventListener('submit', formSubmitHandler);
  };

  /**
   * Init event listeners when page becomes active
   * @param {string} position
   */
  var init = function (position) {
    setAdress(position);
    setPrice();
    update();
    addHandlers();

    form.classList.remove('ad-form--disabled');
  };

  /**
   * Handler for close popup on ESC press
   * @param {KeyboardEvent} evt - keyboard event
   */
  var keydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideMessage);
  };

  /**
   * Handler for close popup on click
   */
  var clickHandler = function () {
    hideMessage();
  };

  /**
   * Removes success popup and handlers
   */
  var hideMessage = function () {
    var dialog = document.querySelector('.success');

    dialog.remove();

    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
  };

  /**
   * Renders success popup and add handlers
   */
  var showMessage = function () {
    var template = document.querySelector('#success')
      .content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', clickHandler);
  };

  /**
   * Returns form pics placeholders
   */
  var setDefaultPics = function () {
    var avatar = form.querySelector('.ad-form-header__preview img');
    var images = form.querySelectorAll('.ad-form__photo');
    var draft = form.querySelector('.ad-form__photo');

    images.forEach(function (image, i) {
      if (i > 0) {
        image.remove();
      }

      draft.classList.remove('visually-hidden');
    });

    avatar.src = avatar.dataset.origin;
  };

  /**
   * Disable page elements
   */
  var resetForm = function () {
    form.reset();
    form.classList.add('ad-form--disabled');

    removeHandlers();
    setDefaultPics();
    updateValues();

    window.card.hide();
    window.main.resetPage();
  };

  /**
   * Form cleanup and return page to default
   */
  var setSuccess = function () {
    resetForm();
    showMessage();
  };

  /**
   * Handler for close popup on ESC press
   * @param {KeyboardEvent} evt - keyboard event
   */
  var errorKeydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideError);
  };

  /**
   * Handler for close popup on click
   */
  var errorClickHandler = function () {
    hideError();
  };

  /**
   * Renders error popup and add handlers
   */
  var showError = function () {
    var template = document.querySelector('#error')
      .content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', errorKeydownHandler);
    document.addEventListener('click', errorClickHandler);
  };

  /**
   * Removes success popup and handlers
   */
  var hideError = function () {
    var dialog = document.querySelector('.error');

    dialog.remove();

    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', errorClickHandler);
  };

  /**
   * Send form and validate status
   * @param {Object} evt
   */
  var formSubmitHandler = function (evt) {
    evt.preventDefault();

    if (form.checkValidity()) {
      window.backend.send(new FormData(form), setSuccess, showError);
    }
  };

  window.form = {
    setAdress: setAdress,
    setDisabled: setDisabled,
    init: init
  };
})();
