var H5PEditor = H5PEditor || {};

/**
 * ImageCoordinateSelector widget module
 *
 * @param {jQuery} $
 */
H5PEditor.widgets.imageCoordinateSelector = H5PEditor.ImageCoordinateSelector = (function ($) {

  /**
   * Creates an image coordinate selector.
   *
   * @param {object} parent
   * @param {object} field
   * @param {object} params
   * @param {function} setValue
   *
   * @returns {ImageCoordinateSelector}
   */
  function ImageCoordinateSelector(parent, field, params, setValue) {
    var self = this;

    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;

    this.imageField = H5PEditor.findField(this.field.imagePath, this.parent);

    if (this.imageField === undefined) {
      throw "I need an image field to do my job";
    }

    if (this.imageField !== undefined) {
      // H5PEditor.followField() does not work for the first element in list
      // as it is used in Image Hotspots
      this.imageField.changes.push(function () {
        var params = self.imageField.params;
        if (params === undefined) {
          return self.clearImage();
        }

        self.updateImage(params.path);
        if(self.params && self.params.x && self.params.y) {
          self.updateHotspot(self.params.x, self.params.y);
        }
      });
    }

    self.$container = $('<div>', {
      'class': 'image-coordinate-selector',
      click: function (e) {
        var offset = $(this).offset();
        var x = e.pageX - offset.left - 5;
        var y = e.pageY - offset.top - 5;

        var xInPercent = self.fixPercent((x/$(this).width())*100);
        var yInPercent = self.fixPercent((y/$(this).height())*100);

        // Set visual element
        self.updateHotspot(xInPercent, yInPercent);

        // Save the value
        self.params = {x: xInPercent, y: yInPercent};
        self.setValue(self.field, self.params);
      }
    });

    self.$hotspot = $('<div>', {
      'class': 'image-coordinate-hotspot'
    }).appendTo(self.$container);

    if(self.imageField.params && self.imageField.params.path) {
      self.updateImage(self.imageField.params.path);
    }
  };

  /**
   * Append the field to the wrapper.
   *
   * @param {H5P.jQuery} $wrapper
   */
  ImageCoordinateSelector.prototype.appendTo = function ($wrapper) {
    this.$container.appendTo($wrapper);
  };

  /**
   * Update image
   *
   * @param {string} path Image path
   */
  ImageCoordinateSelector.prototype.updateImage = function (path) {
    if (this.imgPath === path) {
      return;
    }
    this.imgPath = path;

    // Remove image if present
    this.clearImage();
    // Create image
    this.$container.append('<img src="' + H5P.getPath(path, H5PEditor.contentId) + '">');
  };

  /**
   * Remove image
   */
  ImageCoordinateSelector.prototype.clearImage = function () {
    this.$container.find('img').remove();
  };

  /**
   * Update visual hotspot placement
   */
  ImageCoordinateSelector.prototype.updateHotspot = function (x, y) {
    // Set visual element
    this.$hotspot.css({
      left: x + '%',
      top: y + '%',
      display: 'block'
    });
  };

  /**
   * Making sure percent is an integer between 0 and 100
   */
  ImageCoordinateSelector.prototype.fixPercent = function (percent) {
    percent = parseInt(percent);
    return percent < 0 ? 0 : (percent > 100 ? 100 : percent);
  };


  /**
   * Validate the current values. Invoked by core
   *
   * @returns {boolean} Valid or not
   */
  ImageCoordinateSelector.prototype.validate = function () {
    return this.params !== undefined && this.params.x !== undefined && this.params.y !== undefined &&
           this.params.x >= 0 && this.params.x <= 100 &&
           this.params.y >= 0 && this.params.y <= 100;
  };

  /**
   * Remove me. Invoked by core
   */
  ImageCoordinateSelector.prototype.remove = function () {
    this.$container.remove();
  };

  return ImageCoordinateSelector;
})(H5P.jQuery);
