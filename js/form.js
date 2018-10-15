'use strict';

(function () {

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

  var setAdress = function (position) {
    address.value = position;
  };

  var setPrice = function () {
    var cost = window.utils.getHostType(type.value).minCost;

    price.min = cost;
    price.placeholder = cost;
  };

  var setDisabled = function (fields, isDisabled) {
    fields.forEach(function (field) {
      field.disabled = isDisabled;
    });
  };

  var typeChangeHandler = function () {
    setPrice();
  };

  var timeChangeHandler = function (evt) {
    times.forEach(function (time) {
      if (evt.target.value !== time.value) {
        time.value = evt.target.value;
      }
    });
  };

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

  var update = function () {
    renderPlaces(false);
  };

  var updateValues = function () {
    setPrice();
    setAdress(window.main.getPinPosition());
  };

  var resetClickHandler = function () {
    renderPlaces(true);
    resetForm();
  };

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

  var removeHandlers = function () {
    times.forEach(function (time) {
      time.removeEventListener('change', timeChangeHandler);
    });

    room.removeEventListener('change', roomChangeHandler);
    type.removeEventListener('change', typeChangeHandler);
    reset.removeEventListener('click', resetClickHandler);
    form.removeEventListener('submit', formSubmitHandler);
  };

  var init = function (position) {
    setAdress(position);
    setPrice();
    update();
    addHandlers();

    form.classList.remove('ad-form--disabled');
  };

  var keydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideMessage);
  };

  var hideMessage = function () {
    var dialog = document.querySelector('.success');

    dialog.remove();

    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', hideMessage);
  };

  var showMessage = function () {
    var template = document.querySelector('#success')
      .content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', hideMessage);
  };

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

  var resetForm = function () {
    form.reset();
    form.classList.add('ad-form--disabled');

    removeHandlers();
    setDefaultPics();
    updateValues();

    window.card.hide();
    window.main.resetPage();
  };

  var setSuccess = function () {
    resetForm();
    showMessage();
  };

  var errorKeydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideError);
  };

  var errorClickHandler = function () {
    hideError();
  };

  var showError = function () {
    var template = document.querySelector('#error')
      .content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', errorKeydownHandler);
    document.addEventListener('click', errorClickHandler);
  };

  var hideError = function () {
    var dialog = document.querySelector('.error');

    dialog.remove();

    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', errorClickHandler);
  };

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
