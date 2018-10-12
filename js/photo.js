'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

  /**
   * Uploaded photo size
   * @enum {number}
   */
  var Preview = {
    WIDTH: 70,
    HEIGHT: 70
  };

  var form = document.querySelector('.ad-form');

  var header = form.querySelector('.ad-form-header__upload');
  var headerUpload = header.querySelector('#avatar');
  var headerAvatar = header.querySelector('img');

  var housing = form.querySelector('.ad-form__photo-container');
  var housingUpload = housing.querySelector('#images');
  var housingCards = housing.querySelectorAll('.ad-form__photo');

  /**
   * Check file type
   * @param {string} names
   * @return {boolean}
   */
  var matches = function (names) {
    return FILE_TYPES.some(function (type) {
      return names.endsWith(type);
    });
  };

  /**
   * Reads file and puts it in callback
   * @param {Object} file
   * @param {function} readerLoadCallback
   */
  var render = function (file, readerLoadCallback) {
    var fileName = file.name.toLowerCase();

    if (matches(fileName)) {
      var reader = new FileReader();

      reader.addEventListener('load', readerLoadCallback);

      reader.readAsDataURL(file);

      if (reader.readyState === 2) {
        reader.removeEventListener('load', readerLoadCallback);
      }
    }
  };

  /**
   * Creates and renders uploaded pic
   * @param {Object} file
   * @return {HTMLElement}
   */
  var createPreview = function (file) {
    var preview = document.createElement('div');
    var pic = new Image(Preview.WIDTH, Preview.HEIGHT);

    pic.src = file;

    preview.classList.add('ad-form__photo');
    preview.draggable = true;

    preview.appendChild(pic);

    return preview;
  };

  /**
   * Changes single uploaded pic
   * @param {ProgressEvent} evt
   */
  var setHeaderAvatar = function (evt) {
    headerAvatar.src = evt.currentTarget.result;
  };

  /**
   * Renders multi uploaded pics
   * @param {ProgressEvent} evt
   */
  var showHousingPhotos = function (evt) {
    var file = evt.currentTarget.result;
    var card = createPreview(file);

    card.id = 'draggable-' + evt.loaded;

    card.addEventListener('dragstart', dragstartHandler);

    housing.appendChild(card);
  };

  /**
   * Handler for single upload field
   */
  var headerUploadChangeHandler = function () {
    render(headerUpload.files[0], setHeaderAvatar);
  };

  /**
   * Handler for multi upload field
   */
  var housingUploadChangeHandler = function () {
    var files = Array.from(housingUpload.files);

    housingUpload.multiple = true;

    housingCards[0].classList.add('visually-hidden');

    files.forEach(function (file) {
      render(file, showHousingPhotos);
    });
  };

  /**
   * Toggle css classes
   * @param {HTMLElement} item
   */
  var activateDragUpload = function (item) {
    item.classList.remove('visually-hidden');
    item.classList.add('absolutelly-hidden');
  };

  /**
   * Adds upload handlers
   */
  var addHandlers = function () {
    activateDragUpload(headerUpload);
    activateDragUpload(housingUpload);

    housingUpload.multiple = true;

    headerUpload.addEventListener('change', headerUploadChangeHandler);
    housingUpload.addEventListener('change', housingUploadChangeHandler);
  };

  /**
   * Removes upload handlers
   */
  var removeHandlers = function () {
    var cards = Array.from(housingCards);

    headerUpload.removeEventListener('change', headerUploadChangeHandler);
    housingUpload.removeEventListener('change', housingUploadChangeHandler);

    cards.forEach(function (card) {
      card.removeEventListener('dragstart', dragstartHandler);
    });
  };

  /**
   * Dragover prevent
   * @param {DragEvent} evt
   */
  var dragoverHandler = function (evt) {
    evt.preventDefault();
  };

  /**
   * Drag & drop complete
   * @param {DragEvent} evt
   */
  var dropHandler = function (evt) {
    var dragItem = evt.dataTransfer.getData('id', evt.currentTarget.id);

    evt.preventDefault();

    housing.appendChild(document.querySelector('#' + dragItem));
    housing.removeEventListener('dragover', dragoverHandler);

    evt.currentTarget.removeEventListener('drop', dropHandler);
  };

  /**
   * Drag & drop init
   * @param {DragEvent} evt
   */
  var dragstartHandler = function (evt) {
    evt.dataTransfer.setData('id', evt.currentTarget.id);

    housing.addEventListener('dragover', dragoverHandler);
    housing.addEventListener('drop', dropHandler);
  };

  window.photo = {
    addHandlers: addHandlers,
    removeHandlers: removeHandlers
  };
})();
